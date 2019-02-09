import { Component, OnInit } from "@angular/core";
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
import { PostingForm, PostEdit } from "../../intefaces/posting";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { map, filter, switchMap } from "rxjs/operators";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MediaProvider } from "../../providers/media/media";

/**
 * Generated class for the PostEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-post-edit",
  templateUrl: "post-edit.html"
})
export class PostEditPage implements OnInit {
  postingForm: PostingForm = { reserved: false };
  myPhoto: any;
  file: File;
  fileData: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public http: HttpClient,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.fileData =
      "https://media.mw.metropolia.fi/wbma/uploads/" +
      this.navParams.data.filename;
    this.postingForm.title = this.navParams.data.title;
    this.postingForm.info_item = this.navParams.data.description
      .split("$")[0]
      .split(":")[1];
    console.log(
      "de:" + this.navParams.data.description.split("$")[0].split(":")[1]
    );
    this.postingForm.category = this.navParams.data.description
      .split("$")[1]
      .split(":")[1];
    this.postingForm.location = this.navParams.data.description
      .split("$")[2]
      .split(":")[1];
    this.postingForm.endTime =
      this.navParams.data.description.split("$")[3].split(":")[1] +
      ":" +
      this.navParams.data.description.split("$")[3].split(":")[2] +
      ":" +
      this.navParams.data.description.split("$")[3].split(":")[3];
    console.log(
      "here: $$$ ",
      this.navParams.data.description.split("$")[3].split(":")[1] +
        ":" +
        this.navParams.data.description.split("$")[3].split(":")[2] +
        ":" +
        this.navParams.data.description.split("$")[3].split(":")[3]
    );
    this.postingForm.contact = this.navParams.data.description
      .split("$")[4]
      .split(":")[1];
    this.postingForm.contactTimeFrom =
      this.navParams.data.description.split("$")[5].split(":")[1] +
      ":" +
      this.navParams.data.description.split("$")[6].split(":")[2];
    this.postingForm.contactTimeTo =
      this.navParams.data.description.split("$")[6].split(":")[1] +
      ":" +
      this.navParams.data.description.split("$")[6].split(":")[2];

    this.postingForm.reserved = this.navParams.data.description
      .split("$")[7]
      .split(":")[1];
  }
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

  updateFile(file_id) {
    this.postingForm.description =
      "description:" +
      this.postingForm.info_item +
      "$category:" +
      this.postingForm.category +
      "$location:" +
      this.postingForm.location +
      "$endTime:" +
      this.postingForm.endTime +
      "$contact:" +
      this.postingForm.contact +
      "$contactTimeFrom:" +
      this.postingForm.contactTimeFrom +
      "$contactTimeTo:" +
      this.postingForm.contactTimeTo +
      "$reserved:" +
      this.postingForm.reserved;

    let newFormData: PostEdit = {};
    newFormData.title = this.postingForm.title;
    newFormData.description = this.postingForm.description;
    console.log("test: ", newFormData);
    this.mediaProvider.updateFileInfo(file_id, newFormData).subscribe(res => {
      //set time out in 2s
      console.log(res);
      // hide spinner
      this.loading();
    });
  }

  deletePost(file_id) {
    this.mediaProvider.deleteFile(file_id).subscribe(res => {
      console.log(res);
    });
    this.navCtrl.pop().catch();
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
