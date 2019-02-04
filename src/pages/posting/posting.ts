import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {
  ActionSheet,
  ActionSheetOptions
} from "@ionic-native/action-sheet/ngx";
import { PostingForm } from "../../intefaces/posting";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { map, filter, switchMap } from "rxjs/operators";

import { HttpClient, HttpHeaders } from "@angular/common/http";

@IonicPage()
@Component({
  selector: "page-posting",
  templateUrl: "posting.html"
})
export class PostingPage {
  postingForm: PostingForm = {};
  myPhoto: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public http: HttpClient
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad PostPage");
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
        this.myPhoto = "data:image/jpeg;base64," + imageData;
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
        this.myPhoto = "data:image/jpeg;base64," + imageData;
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
    let postData = new FormData();
    postData.append("file", this.myPhoto);
    let data: Observable<any> = this.http.post(
      "https://media.mw.metropolia.fi/wbma/media",
      postData
    );
    data.subscribe(res => {
      console.log(res);
    });
  }
}
