import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { MediaProvider } from "../../providers/media/media";
import { User, LoginResponse } from "../../intefaces/posting";

@Component({
  selector: "page-user-info",
  templateUrl: "user-info.html"
})
export class UserInfoPage {
  userInfo: User = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider
  ) {}

  ionViewDidLoad() {
    this.getUsersInfo();
    console.log("ionViewDidLoad UserInfoPage");
  }

  getUsersInfo() {
    this.mediaProvider.getUsersInfo().subscribe((response: User) => {
      this.userInfo = response;
      console.log("this.navCtrl.push(TabsPage);", response);
    });
  }

  updateUserInfo() {
    if (this.userInfo.password2 == this.userInfo.password) {
      delete this.userInfo.password2;
      console.log("userInfo ", this.userInfo);
      this.mediaProvider.updateUserInfo(this.userInfo).subscribe(
        (response: LoginResponse) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    } else console.log("passwords dont match.");
  }

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
}
