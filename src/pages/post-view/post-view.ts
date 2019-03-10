import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import {
  Picture,
  PostInfo,
  FavoriteResponse,
  PostEdit,
  TagsResponse
} from "../../intefaces/posting";
import { ChatBoxPage } from "../chat-box/chat-box";
import { MediaProvider } from "../../providers/media/media";
import { ServerResponse } from "../../intefaces/posting";
import { PostEditPage } from "../post-edit/post-edit";

@IonicPage()
@Component({
  selector: "page-post-view",
  templateUrl: "post-view.html"
})
export class PostViewPage {
  pic: Picture;
  postInfo: PostInfo = {};
  onChatBox = false;
  isMyPost = false;
  onFavorite = false;
  onMap = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}
  ngOnInit() {}
  ionViewDidEnter() {
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response;

        console.log(this.navParams.data);
        console.log(this.navParams.data.description.split("(@!GIVA?#)"));

        this.checkFavorite();

        if (
          (this.navParams.data.description
            .split("(@!GIVA?#)")[7]
            .split(":")[1] == "" ||
            this.navParams.data.user_id == localStorage.getItem("userID") ||
            this.navParams.data.description
              .split("(@!GIVA?#)")[7]
              .split(":")[1] == localStorage.getItem("userID")) &&
          !this.navParams.data.description
            .split("(@!GIVA?#)blockedIDs:")[1]
            .split(",")
            .includes(localStorage.getItem("userID") + "")
        ) {
          this.onChatBox = true;
        }

        if (this.navParams.data.user_id == localStorage.getItem("userID")) {
          this.isMyPost = true;
        }

        this.postInfo.filename = this.navParams.data.filename;
        this.postInfo.title = this.navParams.data.title.split("GIVA_Title_")[1];
        this.postInfo.description = this.navParams.data.description
          .split("(@!GIVA?#)")[0]
          .split(":")[1];
        this.postInfo.end_time = this.navParams.data.description
          .split("(@!GIVA?#)")[2]
          .split("=")[1];
        this.postInfo.contact = this.navParams.data.description
          .split("(@!GIVA?#)")[3]
          .split(":")[1];
        this.postInfo.contact_time_from = this.navParams.data.description
          .split("(@!GIVA?#)")[4]
          .split("=")[1];
        this.postInfo.contact_time_to = this.navParams.data.description
          .split("(@!GIVA?#)")[5]
          .split("=")[1];

        if (
          this.navParams.data.description
            .split("(@!GIVA?#)")[6]
            .split(":")[1] == "false"
        ) {
          this.postInfo.reserved = false;
        } else {
          this.postInfo.reserved = true;
        }
      });
  }

  // set item reserved ==> update description
  toggleReserve() {
    let newFormData: PostEdit = {};
    console.log("reserved...");
    if (!this.postInfo.reserved) {
      newFormData.description =
        this.navParams.data.description.split("(@!GIVA?#)reserved:")[0] +
        "(@!GIVA?#)reserved:false(@!GIVA?#)chatter:" +
        this.navParams.data.description.split("(@!GIVA?#)chatter:")[1];
      console.log(newFormData.description);
    } else {
      newFormData.description =
        this.navParams.data.description.split("(@!GIVA?#)reserved:")[0] +
        "(@!GIVA?#)reserved:true(@!GIVA?#)chatter:" +
        this.navParams.data.description.split("(@!GIVA?#)chatter:")[1];
      console.log(newFormData.description);
    }
    this.mediaProvider
      .updateFileInfo(this.navParams.data.file_id, newFormData)
      .subscribe(response => {
        console.log(response);
      });
  }

  goToPostEdit() {
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response;
        this.navCtrl.push(PostEditPage, this.navParams.data);
      });
  }

  refreshFileData() {
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response;
      });
    console.log("this.navParams.data12", this.navParams.data);
  }

  goToChatBox() {
    this.navCtrl.push(ChatBoxPage, this.navParams.data);

    /*   // for updating the file's info, pass the Object, not JSON
    this.mediaProvider
      .updateFileInfo(this.navParams.data.file_id, {
        description:
          this.navParams.data.description + localStorage.getItem("userID")
      })
      .subscribe((UpdateResponse: ServerResponse) => {
        console.log(UpdateResponse);
      }); */

    // if (
    //   this.navParams.data.description.split("(@!GIVA?#)")[8].split(":")[1] == "" &&
    //   this.navParams.data.user_id !== localStorage.getItem("userID")
    // ) {
    //   this.navCtrl.push(ChatBoxPage);
    // } else if (this.navParams.data.user_id == localStorage.getItem("userID")) {
    //   this.navCtrl.push(ChatBoxPage);
    // } else {
    //   alert("sorry! this item is unavaiable now");
    // }
  }

  ionViewWillUnload() {
    localStorage.removeItem("current_location");
    localStorage.removeItem("departure_point");
    localStorage.removeItem("vehicle");
  }

  checkFavorite() {
    this.mediaProvider
      .getAllFavourites()
      .subscribe((response: FavoriteResponse[]) => {
        console.log("FavoriteResponse", response);
        for (var i = 0; i < response.length; i++) {
          if (response[i].file_id == this.navParams.data.file_id) {
            this.onFavorite = true;
            console.log("onFavorite", this.onFavorite);
          }
        }
      });
  }

  addFavorites() {
    const fd = {
      file_id: this.navParams.data.file_id
    };
    this.mediaProvider.addFavorite(fd).subscribe((response: Response) => {
      console.log("addFavorites", response);
    });
  }

  deleteFavourite() {
    this.mediaProvider
      .deleteFavourite(this.navParams.data.file_id)
      .subscribe((response: Response) => {
        console.log("deleteFavourite", response);
      });
  }

  public toggleFavorite() {
    if (!this.onFavorite) {
      this.deleteFavourite();
    } else {
      this.addFavorites();
    }
  }

  deleteImage() {
    this.mediaProvider
      .deleteFile(this.navParams.data.file_id)
      .subscribe(res => console.log(res));
    let loading = this.loadingCtrl.create({});
    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 300);
    this.navCtrl.pop();
  }

  showGoogleMap() {
    if (!this.onMap) {
      this.onMap = true;
    } else {
      this.onMap = false;
    }
  }
}
