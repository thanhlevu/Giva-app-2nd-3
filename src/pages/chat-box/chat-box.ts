import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  CommentRequest,
  CommentsResponse,
  User,
  ServerResponse,
  Picture
} from "../../intefaces/posting";
import { MediaProvider } from "../../providers/media/media";
/**
 * Generated class for the ChatBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-chat-box",
  templateUrl: "chat-box.html"
})
export class ChatBoxPage {
  message: string;
  commentRequest: CommentRequest = {};
  cmtArray: CommentsResponse[];
  myId: number;
  isMyPost = false;
  reserverID: string = "";
  description: string = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider
  ) {}

  ngOnInit() {
    this.myId = Number(localStorage.getItem("userID"));
    console.log("this.navParams.data", this.navParams.data);
    this.getAllComments();
  }

  sendComment() {
    this.commentRequest.file_id = this.navParams.data.file_id;
    this.commentRequest.comment = this.message;
    this.mediaProvider
      .sendComment(this.commentRequest)
      .subscribe((res: ServerResponse) => console.log(res.message));
    this.getAllComments();
  }

  getAllComments() {
    this.getFileInfo(this.navParams.data.file_id);

    this.mediaProvider
      .getAllComments(this.navParams.data.file_id)
      .subscribe((res: CommentsResponse[]) => {
        this.cmtArray = res.map((cmt: CommentsResponse) => {
          cmt.time_added = cmt.time_added.split("T")[1];
          cmt.time_added = cmt.time_added.replace(
            ":" + cmt.time_added.split(":")[2],
            ""
          );
          this.mediaProvider
            .getOtherUsersInfo(cmt.user_id)
            .subscribe((UserInfo: User) => {
              cmt.username = UserInfo.username;
            });
          return cmt;
        });
        this.cmtArray.reverse();
        console.log("this.cmtArray", this.cmtArray);
      });
  }

  deleteComment(comment_id) {
    this.mediaProvider
      .deleteComment(comment_id)
      .subscribe(res => console.log(res));
    this.getAllComments();
  }

  choseReceiver(user_id) {
    // for updating the file's info, pass the Object, not JSON
    this.mediaProvider
      .updateFileInfo(this.navParams.data.file_id, {
        description:
          this.description.replace(this.description.split("$chatter:")[1], "") +
          user_id
      })
      .subscribe((serverResponse: ServerResponse) => {
        //console.log(serverResponse.message);
      });
    this.getAllComments();
  }
  cancelReceiver() {
    this.mediaProvider
      .updateFileInfo(this.navParams.data.file_id, {
        description: this.description.replace(
          this.description.split("$chatter:")[1],
          ""
        )
      })
      .subscribe((serverResponse: ServerResponse) => {
        //console.log(serverResponse.message);
      });
    this.getAllComments();
  }

  getFileInfo(file_id) {
    this.mediaProvider.getFileData(file_id).subscribe((fileData: Picture) => {
      this.description = fileData.description;
      this.reserverID = fileData.description.split("$chatter:")[1];
      if (fileData.user_id == Number(localStorage.getItem("userID"))) {
        console.log(
          "fileData.user_id == Number(localStorage.getItem:",
          fileData.user_id == Number(localStorage.getItem("userID"))
        );

        this.isMyPost = true;
        console.log("this.isMyPost2", this.isMyPost);
      }
    });
  }
}
