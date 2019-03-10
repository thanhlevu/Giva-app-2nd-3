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
import {
  PostingForm,
  PostEdit,
  Picture,
  TagsResponse
} from "../../intefaces/posting";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { map, filter, switchMap } from "rxjs/operators";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MediaProvider } from "../../providers/media/media";

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
  categoryTagId: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public http: HttpClient,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.compileData();
    this.getCategoryTag();
  }

  refreshFileData() {
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response;
      });
  }

  addCategoryTag(file_Id, category) {
    this.mediaProvider.deleteTag_Category(this.categoryTagId);
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

  getCategoryTag() {
    this.mediaProvider
      .getTagsByFileId(this.navParams.data.file_id)
      .subscribe((response: TagsResponse[]) => {
        console.log(response);
        for (var i = 0; i < response.length; i++) {
          if (response[i].tag.includes("GIVA_Category.")) {
            this.postingForm.category = response[i].tag.split(
              "GIVA_Category."
            )[1];
            this.categoryTagId = response[i].tag_id;
            console.log(this.postingForm.category);
          }
        }
      });
  }

  toggleReserve() {
    let newFormData: PostEdit = {};
    if (!this.postingForm.reserved) {
      newFormData.description =
        this.navParams.data.description.split("(@!GIVA?#)reserved:")[0] +
        "(@!GIVA?#)reserved:false(@!GIVA?#)chatter:" +
        this.navParams.data.description.split("(@!GIVA?#)chatter:")[1];
    } else {
      newFormData.description =
        this.navParams.data.description.split("(@!GIVA?#)reserved:")[0] +
        "(@!GIVA?#)reserved:true(@!GIVA?#)chatter:" +
        this.navParams.data.description.split("(@!GIVA?#)chatter:")[1];
    }
    this.mediaProvider
      .updateFileInfo(this.navParams.data.file_id, newFormData)
      .subscribe(response => {
        console.log(response);
      });
  }

  compileData() {
    this.fileData =
      "http://media.mw.metropolia.fi/wbma/uploads/" +
      this.navParams.data.filename;
    this.postingForm.title = this.navParams.data.title;
    this.postingForm.info_item = this.navParams.data.description
      .split("(@!GIVA?#)")[0]
      .split(":")[1];
    this.postingForm.location = this.navParams.data.description
      .split("(@!GIVA?#)")[1]
      .split(":")[1];
    this.postingForm.endTime = this.navParams.data.description
      .split("(@!GIVA?#)endTime=")[1]
      .split("(@!GIVA?#)contact:")[0];
    this.postingForm.contact = this.navParams.data.description
      .split("(@!GIVA?#)")[3]
      .split(":")[1];
    this.postingForm.contactTimeFrom = this.navParams.data.description
      .split("(@!GIVA?#)contactTimeFrom=")[1]
      .split("(@!GIVA?#)contactTimeTo=")[0];
    this.postingForm.contactTimeTo = this.navParams.data.description
      .split("(@!GIVA?#)contactTimeTo=")[1]
      .split("(@!GIVA?#)reserved:")[0];
    this.postingForm.reserved = this.navParams.data.description
      .split("(@!GIVA?#)")[6]
      .split(":")[1];
    console.log("this.navParams.222");
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
      "(@!GIVA?#)geolocation:" +
      this.postingForm.location +
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
      this.navParams.data.description.split("(@!GIVA?#)chatter:")[1];

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

    this.addCategoryTag(this.navParams.data.file_id, this.postingForm.category);
  }

  deletePost(file_id) {
    this.mediaProvider.deleteFile(file_id).subscribe(res => {
      console.log(res);
    });
    this.loading();
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
      this.navCtrl.popToRoot();
    }, 1000);
  }
}
