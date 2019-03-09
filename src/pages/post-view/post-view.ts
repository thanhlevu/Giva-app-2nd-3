import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { Picture, PostInfo, FavoriteResponse } from "../../intefaces/posting";
import { ChatBoxPage } from "../chat-box/chat-box";
import { MediaProvider } from "../../providers/media/media";
import { ServerResponse } from "../../intefaces/posting";

@IonicPage()
@Component({
  selector: "page-post-view",
  templateUrl: "post-view.html"
})
export class PostViewPage {
  id;
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

  ngOnInit() {
    console.log(this.navParams.data);
    this.checkFavorite();
    if (
      (this.navParams.data.description.split("$")[8].split(":")[1] == "" ||
        this.navParams.data.user_id == localStorage.getItem("userID") ||
        this.navParams.data.description.split("$")[8].split(":")[1] ==
          localStorage.getItem("userID")) &&
      !this.navParams.data.description
        .split("$blockedIDs:")[1]
        .split(",")
        .includes(localStorage.getItem("userID") + "")
    ) {
      this.onChatBox = true;
    }
    if (this.navParams.data.user_id == localStorage.getItem("userID")) {
      this.isMyPost = true;
    }
    this.postInfo.filename = this.navParams.data.filename;

    this.postInfo.title = this.navParams.data.title;

    this.postInfo.description = this.navParams.data.description
      .split("$")[0]
      .split(":")[1];
    this.postInfo.category = this.navParams.data.description
      .split("$")[1]
      .split(":")[1];
    this.postInfo.end_time = this.navParams.data.description
      .split("$")[3]
      .split("=")[1];
    this.postInfo.contact = this.navParams.data.description
      .split("$")[4]
      .split(":")[1];
    this.postInfo.contact_time_from = this.navParams.data.description
      .split("$")[5]
      .split("=")[1];
    this.postInfo.contact_time_to = this.navParams.data.description
      .split("$")[6]
      .split("=")[1];
    if (
      this.navParams.data.description.split("$")[7].split(":")[1] == "false"
    ) {
      this.postInfo.reserved = false;
    } else {
      this.postInfo.reserved = true;
    }
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
    //   this.navParams.data.description.split("$")[8].split(":")[1] == "" &&
    //   this.navParams.data.user_id !== localStorage.getItem("userID")
    // ) {
    //   this.navCtrl.push(ChatBoxPage);
    // } else if (this.navParams.data.user_id == localStorage.getItem("userID")) {
    //   this.navCtrl.push(ChatBoxPage);
    // } else {
    //   alert("sorry! this item is unavaiable now");
    // }
  }
  /*   getMedia() {
    this.mediaProvider.getFileDataById(this.id).subscribe((pic: Picture) => {
      this.pic = pic;
      console.log("this1", this.pic.title, this.pic.file_id);
    });
  } */

  ionViewDidLeave() {}

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
