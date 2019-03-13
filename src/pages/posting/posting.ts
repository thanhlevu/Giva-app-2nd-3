import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Platform
} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {
  ActionSheet,
  ActionSheetOptions
} from "@ionic-native/action-sheet/ngx";
import {
  PostingForm,
  TagsResponse,
  Geolocation
} from "../../intefaces/interfaces";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { map, filter, switchMap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MediaProvider } from "../../providers/media/media";
import { HomePage } from "../home/home";
import { App } from "ionic-angular";
import { PostViewPage } from "../post-view/post-view";

@IonicPage()
@Component({
  selector: "page-posting",
  templateUrl: "posting.html"
})
export class PostingPage {
  postingForm: PostingForm = { reserved: false };
  myPhoto: any;
  fileData: string = "";
  itemLocation: Geolocation = {};
  isApp = localStorage.getItem("isApp");
  mobileFile: Blob;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public http: HttpClient,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.getCurrentLocation();
    console.log("isApp", this.isApp);
  }

  // get the user current locaton
  getCurrentLocation() {
    let that = this;
    navigator.geolocation.getCurrentPosition(currentPosition => {
      // get current location
      that.itemLocation = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude
      };
    });
  }

  // open camera if using mobile devices
  openCamera() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.fileData = "data:image/jpeg;base64," + imageData;
        this.mobileFile = this.convertBase64toBlob(this.fileData);
      },
      err => {
        console.log(err);
      }
    );
  }

  // open gallery if using mobile devices
  openGallery() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      targetHeight: 300,
      targetWidth: 300
    };

    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.fileData = "data:image/jpeg;base64," + imageData;
        this.mobileFile = this.convertBase64toBlob(this.fileData);
      },
      err => {
        console.log(err);
      }
    );
  }

  convertBase64toBlob(dataUrl: string) {
    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  }

  // update a image
  uploadImage() {
    // if the user allows to access the current location.
    if (this.itemLocation.lat) {
      if (this.postingForm.contact == undefined) {
        this.postingForm.contact = localStorage.userEmail;
      }
      //format the description that contains more data: item's detail, item's geolocation, deadline for taking items, how to contact and contacting time.
      this.postingForm.description =
        "description:" +
        this.postingForm.info_item +
        "(@!GIVA?#)geolocation:" +
        this.itemLocation.lat +
        "," +
        this.itemLocation.lng +
        "(@!GIVA?#)endTime=" +
        this.postingForm.endTime +
        "(@!GIVA?#)contact:" +
        this.postingForm.contact +
        "(@!GIVA?#)contactTimeFrom=" +
        this.postingForm.contactTimeFrom +
        "(@!GIVA?#)contactTimeTo=" +
        this.postingForm.contactTimeTo +
        "(@!GIVA?#)reserved:" +
        this.postingForm.reserved +
        "(@!GIVA?#)chatter:" +
        "(@!GIVA?#)blockedIDs:";

      // set up form data for the uploading file
      const fd = new FormData();
      if (!this.isApp) {
        fd.append("file", this.postingForm.file);
      } else {
        fd.append("file", this.mobileFile);
      }
      fd.append("title", "GIVA_Title_" + this.postingForm.title);
      fd.append("description", this.postingForm.description);

      // upload the file
      this.mediaProvider
        .uploadImage(fd)
        .subscribe((UploadResponse: TagsResponse) => {
          //add GIVA tag to the Image
          this.mediaProvider
            .addTag_Giva(UploadResponse.file_id)
            .subscribe((TagResponse: TagsResponse) => {
              console.log("TagResponse", TagResponse);

              //add Category tag to the image
              this.addCategoryTag(
                UploadResponse.file_id,
                this.postingForm.category
              );
            });
          this.loading();
        });
    } else {
      alert("uploading a image needs to access the location");
      this.getCurrentLocation();
    }
  }

  // add the category to image by file id
  addCategoryTag(file_Id, category) {
    let data = {
      file_id: file_Id,
      tag: "GIVA_Category." + category
    };
    this.mediaProvider
      .addTag_Category(data)
      .subscribe((TagResponse: TagsResponse) => {
        console.log("Second: ", TagResponse);
      });
  }

  // get the selected image then show preview
  handleChange($event) {
    this.postingForm.file = $event.target.files[0];
    this.showMediaPreview();
  }

  // show the image
  showMediaPreview() {
    if (this.postingForm.file) {
      var reader = new FileReader();
      reader.onloadend = evt => {
        //using arrow fuction to change the reference, if not ==> error of this.
        this.fileData = reader.result;
      };
      if (this.postingForm.file.type.includes("video")) {
        this.fileData = "http://via.placeholder.com/500x200/000?text=Video";
      } else if (this.postingForm.file.type.includes("audio")) {
        this.fileData = "http://via.placeholder.com/500x200/000?text=Audio";
      } else {
        reader.readAsDataURL(this.postingForm.file);
      }
    }
  }

  // loading 1s to refresh the new data, and go back to HomePage
  loading() {
    let loading = this.loadingCtrl.create({});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.parent.select(0);
    }, 1000);
  }
}
