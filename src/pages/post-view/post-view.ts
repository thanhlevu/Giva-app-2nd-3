import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Picture, PostInfo } from "../../intefaces/posting";
import { ChatBoxPage } from "../chat-box/chat-box";
import { MediaProvider } from "../../providers/media/media";
import { ServerResponse } from "../../intefaces/posting";
@IonicPage()
@Component({
  selector: "page-post-view",
  templateUrl: "post-view.html"
})
export class PostViewPage {
  pic: Picture;
  postInfo: PostInfo = {};
  onChatBox = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mediaProvider: MediaProvider
  ) {}

  ngOnInit() {
    console.log(this.navParams.data);
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
}
