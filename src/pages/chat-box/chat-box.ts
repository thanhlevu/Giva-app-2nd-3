import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  App,
  LoadingController
} from "ionic-angular";
import {
  CommentRequest,
  CommentsResponse,
  User,
  ServerResponse,
  Picture
} from "../../intefaces/interfaces";
import { MediaProvider } from "../../providers/media/media";
@IonicPage()
@Component({
  selector: "page-chat-box",
  templateUrl: "chat-box.html",
  queries: {
    content: new ViewChild("content")
  }
})
export class ChatBoxPage {
  app: App;
  message: string;
  commentRequest: CommentRequest = {};
  cmtArray: any = [{}];
  myId: number;
  isMyPost = false;
  reserverID: string = "";
  description: string = "";
  blockedIDs: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  @ViewChild(Content) content: Content;

  // sroll to the bottom to see the new message
  ionViewDidEnter() {
    this.content.scrollToBottom(300);
  }

  // get the user Id and load all comment of the item
  ngOnInit() {
    this.myId = Number(localStorage.getItem("userID"));
    this.getAllComments();
  }

  // send a new comment to item
  sendComment() {
    this.commentRequest.file_id = this.navParams.data.file_id;
    this.commentRequest.comment = this.message;
    this.mediaProvider
      .sendComment(this.commentRequest)
      .subscribe((res: ServerResponse) => {
        console.log(res.message);
        this.message = "";
      });
    this.getAllComments();
    this.loading();
  }

  // loading for fetching new comments
  loading() {
    let loading = this.loadingCtrl.create({});
    loading.present();

    setTimeout(() => {
      loading.dismiss();
      this.content.scrollToBottom(100);
    }, 500);
  }

  // get all comment of the item
  getAllComments() {
    this.getFileInfo(this.navParams.data.file_id);

    this.mediaProvider
      .getAllComments(this.navParams.data.file_id)
      .subscribe((response: CommentsResponse[]) => {
        this.cmtArray = response.map((cmt: CommentsResponse) => {
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

        // take the avatar of people who did comment
        for (var i = 0; i < this.cmtArray.length; i++) {
          let a = i;

          // request the user avatars
          this.mediaProvider
            .getFilesByTitle({
              title: "GIVA_Avartar_" + this.cmtArray[i].user_id
            })
            .subscribe((avatarResponse: Picture[]) => {
              if (avatarResponse.length != 0) {
                this.cmtArray[a].filename = avatarResponse[0].filename;
              }
            });

          //request the user fullname
          this.mediaProvider
            .getOtherUsersInfo(this.cmtArray[i].user_id)
            .subscribe((userDataResponse: User) => {
              console.log("userDataResponse", userDataResponse.full_name);
              if (userDataResponse.full_name) {
                this.cmtArray[a].full_name = userDataResponse.full_name;
              } else {
                this.cmtArray[a].full_name = "Anonymous";
              }
            });
        }
      });
  }

  // delete the comment by comment id
  deleteComment(comment_id) {
    this.mediaProvider
      .deleteComment(comment_id)
      .subscribe((res: ServerResponse) => console.log(res.message));
    this.getAllComments();
  }

  // choose the chatter that makes the chat room private
  choseReceiver(user_id) {
    // for updating the file's info, pass the Object, not JSON
    this.mediaProvider
      .updateFileInfo(this.navParams.data.file_id, {
        description: this.description.replace(
          this.description.split("(@!GIVA?#)chatter:")[1],
          user_id +
            "(@!GIVA?#)blockedIDs:" +
            this.description.split("(@!GIVA?#)blockedIDs:")[1]
        )
      })
      .subscribe((serverResponse: ServerResponse) => {
        console.log(serverResponse.message);
      });
    this.getAllComments();
  }

  // if no agreement reached, remove the chatter, the chat room becomes public
  cancelReceiver() {
    this.mediaProvider
      .updateFileInfo(this.navParams.data.file_id, {
        description: this.description.replace(
          this.description.split("(@!GIVA?#)chatter:")[1],
          "(@!GIVA?#)blockedIDs:" +
            this.description.split("(@!GIVA?#)blockedIDs:")[1]
        )
      })
      .subscribe((serverResponse: ServerResponse) => {
        console.log(serverResponse.message);
      });
    this.getAllComments();
  }

  // get the file info by file_id
  getFileInfo(file_id) {
    this.mediaProvider
      .getFileDataById(file_id)
      .subscribe((fileData: Picture) => {
        this.description = fileData.description;
        this.reserverID = fileData.description
          .split("(@!GIVA?#)chatter:")[1]
          .split("(@!GIVA?#)blockedIDs:")[0];
        if (fileData.user_id == Number(localStorage.getItem("userID"))) {
          this.isMyPost = true;
        }
        this.blockedIDs = this.description
          .split("(@!GIVA?#)blockedIDs:")[1]
          .split(",");
      });
  }

  // block the user who messes up the chat room.
  blockThisUserID(user_id) {
    if (!this.description.split("(@!GIVA?#)blockedIDs")[1].includes(user_id)) {
      this.mediaProvider
        .updateFileInfo(this.navParams.data.file_id, {
          description: this.description + user_id + ","
        })
        .subscribe((serverResponse: ServerResponse) => {
          console.log(serverResponse.message);
        });
    }
    this.getAllComments();
  }

  // unblock the user who messed up the chat room.
  unblockThisUserID(user_id) {
    if (this.description.split("(@!GIVA?#)blockedIDs")[1].includes(user_id)) {
      this.mediaProvider
        .updateFileInfo(this.navParams.data.file_id, {
          description: this.description.replace(user_id + ",", "")
        })
        .subscribe((serverResponse: ServerResponse) => {
          console.log(serverResponse.message);
        });
    }
    this.getAllComments();
  }

  ionViewDidLeave() {}
}
