import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RegisterPage } from "../register/register";
import { HomePage } from "../home/home";
import { UserInfoPage } from "../user-info/user-info";
import { MediaProvider } from "../../providers/media/media";
import { User, LoginResponse, UsernameResponse } from "../../intefaces/posting";
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
    public mediaprovider: MediaProvider
  ) {}

  ionViewDidLoad() {
    if (localStorage.getItem("token")) {
      this.navCtrl.push(TabsPage);
    }
  }

  loginClicked(formSignIn) {
    this.mediaprovider.login(this.user).subscribe(
      (response: LoginResponse) => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userID", response.user.user_id + "");
        localStorage.setItem("userEmail", response.user.email);

        this.navCtrl.push(TabsPage);
        this.mediaprovider.token = response.token;
        this.mediaprovider.loggedIn = true;
        this.mediaprovider.user_id = response.user.user_id;
      },
      error => {
        console.log(error);
      }
    );
  }

  goRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }
}
