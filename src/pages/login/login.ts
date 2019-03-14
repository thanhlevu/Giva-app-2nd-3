import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { RegisterPage } from "../register/register";
import { HomePage } from "../home/home";
import { UserInfoPage } from "../user-info/user-info";
import { MediaProvider } from "../../providers/media/media";
import {
  User,
  LoginResponse,
  UsernameResponse
} from "../../intefaces/interfaces";
import { TabsPage } from "../tabs/tabs";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  user: User = {};
  username: string;
  password: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaprovider: MediaProvider,
    private platform: Platform
  ) {}

  // check if the user logged in before, if true ==> go to HomePage directly
  ionViewDidLoad() {
    if (localStorage.getItem("token")) {
      this.navCtrl.push(TabsPage);
    }
  }

  // login clicked: store token, userId, user's email, isApp inside localstorage.
  loginClicked(formSignIn) {
    this.mediaprovider.login(this.user).subscribe(
      (response: LoginResponse) => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userID", response.user.user_id + "");
        localStorage.setItem("userEmail", response.user.email);
        localStorage.setItem(
          "isApp",
          !this.platform.is("core") ? "true" : "false"
        );

        console.log("isApp", localStorage.getItem("isApp"));
        this.navCtrl.push(TabsPage);
      },
      error => {
        console.log(error);
      }
    );
  }

  //go to RegisterPage
  goRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }
}
