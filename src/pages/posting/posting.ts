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

@IonicPage()
@Component({
  selector: "page-posting",
  templateUrl: "posting.html"
})
export class PostingPage {
  postingForm: PostingForm = { reserved: false };
  myPhoto: any;
  file: File;
  fileData: string;
  itemLocation: Geolocation = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public http: HttpClient,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    let that = this;
    navigator.geolocation.getCurrentPosition(function(currentPosition) {
      // get current location
      that.itemLocation = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude
      };
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
    if (this.postingForm.contact == undefined) {
      this.postingForm.contact = localStorage.userEmail;
    }
    this.postingForm.description =
      "description:" +
      this.postingForm.info_item +
      "$category:" +
      this.postingForm.category +
      "$geolocation:" +
      this.itemLocation.lat +
      "," +
      this.itemLocation.lng +
      "$endTime=" +
      this.postingForm.endTime +
      "$contact:" +
      this.postingForm.contact +
      "$contactTimeFrom=" +
      this.postingForm.contactTimeFrom +
      "$contactTimeTo=" +
      this.postingForm.contactTimeTo +
      "$reserved:" +
      this.postingForm.reserved +
      "$chatter:" +
      "$blockedIDs:";

    const fd = new FormData();
    //fd.append("file", this.postingForm.file);
    fd.append("file", this.fileData);

    fd.append("title", this.postingForm.title);
    fd.append("description", this.postingForm.description);

    this.mediaProvider.upload(fd).subscribe((UploadResponse: TagsResponse) => {
      //set time out in 2s
      console.log("UploadResponse", UploadResponse);

      //add GIVA tag to the Image
      this.mediaProvider
        .addTag_Giva(UploadResponse.file_id)
        .subscribe((TagResponse: TagsResponse) => {
          console.log("TagResponse", TagResponse);
        });
      // hide spinner
      this.loading();
    });
  }

  showPreview() {
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
    this.showPreview();
  }

  loading() {
    let loading = this.loadingCtrl.create({});
    loading.present();

    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.pop().catch();
    }, 2000);
  }
}
