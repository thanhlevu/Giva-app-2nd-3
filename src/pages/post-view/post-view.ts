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
  TagsResponse,
  ServerResponse
} from "../../intefaces/interfaces";
import { ChatBoxPage } from "../chat-box/chat-box";
import { MediaProvider } from "../../providers/media/media";
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
    console.log("user-id", localStorage.getItem("userID"));

    console.log("this.navParams.data", this.navParams.data);
    // get the file data by file_id
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response; // assign new and correct data incase the user wants to go further.(chat room, setting map, edit post)

        // check favorite item?
        this.checkFavorite();

        // set conditions to show the chatbox button.
        if (
          ((this.navParams.data.description
            .split("(@!GIVA?#)")[7]
            .split(":")[1] == "" ||
            this.navParams.data.description
              .split("(@!GIVA?#)")[7]
              .split(":")[1] == localStorage.getItem("userID")) &&
            !this.navParams.data.description
              .split("(@!GIVA?#)blockedIDs:")[1]
              .split(",")
              .includes(localStorage.getItem("userID") + "")) ||
          this.navParams.data.user_id == localStorage.getItem("userID")
        ) {
          this.onChatBox = true;
        }

        // check if the item is mine
        if (this.navParams.data.user_id == localStorage.getItem("userID")) {
          this.isMyPost = true;
        }

        // assign values and show up.
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

        // check reserve and assign boolean values to "this.postInfo.reserved" that helps to limit other users's activity (see the map, get in the chat box ...)
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
    if (!this.postInfo.reserved) {
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

  // go to PostEditPage along with data
  goToPostEdit() {
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response;
        this.navCtrl.push(PostEditPage, this.navParams.data);
      });
  }

  /*   //
  refreshFileData() {
    this.mediaProvider
      .getFileDataById(this.navParams.data.file_id)
      .subscribe((response: Picture) => {
        this.navParams.data = response;
      });
  } */

  // go to ChatBoxPage with data
  goToChatBox() {
    this.navCtrl.push(ChatBoxPage, this.navParams.data);
  }

  // remove the ruote data, in case the user is moving so the current location should be update
  ionViewWillUnload() {
    localStorage.removeItem("current_location");
    localStorage.removeItem("departure_point");
    localStorage.removeItem("vehicle");
  }

  // check if the item add as my favorite
  checkFavorite() {
    this.mediaProvider
      .getAllFavourites()
      .subscribe((response: FavoriteResponse[]) => {
        for (var i = 0; i < response.length; i++) {
          if (response[i].file_id == this.navParams.data.file_id) {
            this.onFavorite = true;
          }
        }
      });
  }

  // add the item to my favorite items
  addFavorites() {
    const fd = {
      file_id: this.navParams.data.file_id
    };
    this.mediaProvider.addFavorite(fd).subscribe((response: Response) => {});
  }

  // delete the item from my favorite item
  deleteFavourite() {
    this.mediaProvider
      .deleteFavourite(this.navParams.data.file_id)
      .subscribe((response: ServerResponse) => {
        console.log(response.message);
      });
  }

  // toggle the favorite button to add or delete the favorite
  toggleFavorite() {
    if (!this.onFavorite) {
      this.deleteFavourite();
    } else {
      this.addFavorites();
    }
  }

  // delete this image and go back to HomePage
  deleteImage() {
    this.mediaProvider
      .deleteFile(this.navParams.data.file_id)
      .subscribe((response: ServerResponse) => {
        console.log(response.message);
      });
    let loading = this.loadingCtrl.create({});
    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 300);
    this.navCtrl.pop();
  }

  // show/hide the map
  showGoogleMap() {
    if (!this.onMap) {
      this.onMap = true;
    } else {
      this.onMap = false;
    }
  }
}
