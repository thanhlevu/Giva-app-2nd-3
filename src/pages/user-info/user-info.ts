import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { MediaProvider } from "../../providers/media/media";
import { User, LoginResponse } from "../../intefaces/posting";
import { EditInfoPage } from "../edit-info/edit-info";

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
    console.log("ionViewDidLoad UserInfoPage");
  }

  onUpdateUserInfo() {
    if (this.userInfo.password2 == this.userInfo.password) {
      delete this.userInfo.password2;
      console.log("userInfo ", this.userInfo);
      this.mediaProvider.updateUserInfo(this.userInfo).subscribe(
        (response: LoginResponse) => {
          console.log(response);
          this.navCtrl.pop().catch();
        },
        error => {
          console.log(error);
        }
      );
    } else console.log("passwords dont match.");
  }

  editProfile() {
    this.navCtrl.push(EditInfoPage);
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
