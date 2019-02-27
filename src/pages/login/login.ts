import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RegisterPage } from "../register/register";
import { LoginResponse, User } from '../../intefaces/posting';
import { MediaProvider } from "../../providers/media/media";
import { TabsPage } from "../tabs/tabs";

@IonicPage()
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
  ) { }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  loginClicked(formSignIn) {
    this.mediaprovider.login(this.user).subscribe(
      (response: LoginResponse) => {

        localStorage.setItem("token", response.token);

        this.navCtrl.push(TabsPage);
        this.mediaprovider.token = response.token;
        this.mediaprovider.loggedIn = true;
        this.mediaprovider.user = response.user;
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
