import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
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
} from "../../intefaces/posting";
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
  file: File;
  fileData: string = "";
  itemLocation: Geolocation = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public http: HttpClient,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController,
    private app: App
  ) {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    let that = this;
    navigator.geolocation.getCurrentPosition(currentPosition => {
      // get current location
      that.itemLocation = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude
      };
      console.log("this.itemLocation", that.itemLocation);
    });
  }
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
      },
      err => {
        console.log(err);
      }
    );
  }

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
      },
      err => {
        console.log(err);
      }
    );
  }

  cropImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300
    };

    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.myPhoto = "data:image/jpeg;base64," + imageData;
      },
      err => {
        console.log(err);
      }
    );
  }

  uploadImage() {
    if (this.itemLocation) {
      if (this.postingForm.contact == undefined) {
        this.postingForm.contact = localStorage.userEmail;
      }

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

      const fd = new FormData();
      fd.append("file", this.postingForm.file);
      //fd.append("file", this.fileData);

      fd.append("title", "GIVA_Title_" + this.postingForm.title);
      fd.append("description", this.postingForm.description);

      this.mediaProvider
        .uploadImage(fd)
        .subscribe((UploadResponse: TagsResponse) => {
          //set time out in 2s
          console.log("UploadResponse", UploadResponse);

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
      this.getCurrentLocation();
    }
  }

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

  showMediaPreview() {
    var reader = new FileReader();
    reader.onloadend = evt => {
      //using arrow fuction to change the reference, if not ==> error of this.
      //console.log(reader.result)
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

  handleChange($event) {
    console.log($event.target.files[0]);
    this.postingForm.file = $event.target.files[0];
    this.showMediaPreview();
  }

  loading() {
    let loading = this.loadingCtrl.create({});
    loading.present();

    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.parent.select(0);
    }, 1000);
  }
}
