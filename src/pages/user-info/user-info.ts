import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { LoginPage } from "../login/login";
import { MediaProvider } from "../../providers/media/media";
import {
  User,
  LoginResponse,
  TagsResponse,
  Picture,
  ServerResponse
} from "../../intefaces/interfaces";

@Component({
  selector: "page-user-info",
  templateUrl: "user-info.html"
})
export class UserInfoPage {
  userInfo: User = {};
  avatar: Picture[] = [];
  avatarUrl = "../../assets/icon/user.svg";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.searchUserAvatarByTitle();
    this.getUsersInfo();
  }

  getUsersInfo() {
    this.mediaProvider.getUsersInfo().subscribe((response: User) => {
      this.userInfo = response;
      console.log("response", response);
    });
  }

  // upload new avatar when the user input a new picture
  handleChange($event) {
    // delete the using avatar
    if (this.avatar) {
      for (var i = 0; i < this.avatar.length; i++) {
        this.mediaProvider.deleteFile(this.avatar[i].file_id).subscribe(res => {
          console.log(res);
        });
      }
    }

    // upload avatar file with the special title: "GIVA_Avartar_userID"
    const fd = new FormData();
    fd.append("file", $event.target.files[0]);
    fd.append("title", "GIVA_Avartar_" + localStorage.getItem("userID"));
    this.mediaProvider
      .uploadImage(fd)
      .subscribe((UploadResponse: TagsResponse) => {
        this.searchUserAvatarByTitle();
      });
  }

  // search user'avatar if exist
  searchUserAvatarByTitle() {
    this.mediaProvider
      .getFilesByTitle({
        title: "GIVA_Avartar_" + localStorage.getItem("userID")
      })
      .subscribe((response: Picture[]) => {
        if (response.length != 0) {
          this.avatar = response;
          console.log("response.file_id", Boolean(response[0].file_id));
          this.avatarUrl =
            "http://media.mw.metropolia.fi/wbma/uploads/" +
            response[0].filename;
          console.log("avatarUrl", this.avatarUrl);
        }
      });
  }

  // update the user' data
  updateUserInfo() {
    if (this.userInfo.password2 == this.userInfo.password) {
      delete this.userInfo.password2;
      console.log("userInfo ", this.userInfo);
      this.mediaProvider
        .updateUserInfo(this.userInfo)
        .subscribe((response: ServerResponse) => {
          alert(response.message);
        });
    } else alert("Passwords DO NOT match.");
  }

  // log out = clear localstorage, go back to LoginPage and hide the tab bar
  logOut() {
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);

    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map(key => {
        elements[key].style.display = "none";
      });
    }
  }

  // loading for a while if refreshing data needed
  loading() {
    let loading = this.loadingCtrl.create({});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 500);
  }
}
