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
  TagsResponse,
  ServerResponse
} from "../../intefaces/interfaces";
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
  isApp = localStorage.getItem("isApp") == "true" ? true : false;

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

  // refresh new file data (after update)
  refreshFileData() {
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response;
      });
  }

  // add new category tage to item
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

  // get the category of the item
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

  // get/set item reserved
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
      .subscribe((response: ServerResponse) => {
        console.log(response.message);
      });
  }

  // get data from description string, and show up
  compileData() {
    this.fileData =
      "http://media.mw.metropolia.fi/wbma/uploads/" +
      this.navParams.data.filename;
    this.postingForm.title = this.navParams.data.title.split("GIVA_Title_")[1];
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
      },
      err => {
        console.log(err);
      }
    );
  }

  // update new data
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
    newFormData.title = "GIVA_Title_" + this.postingForm.title;
    newFormData.description = this.postingForm.description;
    console.log("test: ", newFormData);
    this.mediaProvider
      .updateFileInfo(file_id, newFormData)
      .subscribe((res: ServerResponse) => {
        console.log(res.message);
        this.loading();
      });

    // add category tage to image
    this.addCategoryTag(this.navParams.data.file_id, this.postingForm.category);
  }

  // delete the image
  deletePost(file_id) {
    this.mediaProvider.deleteFile(file_id).subscribe(res => {
      console.log(res);
    });
    this.loading();
  }

  // show preview of image
  showPreview() {
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

  // when the user input a new image
  handleChange($event) {
    this.postingForm.file = $event.target.files[0];
    this.showPreview();
  }

  // loading in 1s and go back to HomePage
  loading() {
    let loading = this.loadingCtrl.create({});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.popToRoot();
    }, 1000);
  }
}
