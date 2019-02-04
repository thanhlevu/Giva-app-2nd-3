import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RegisterPage } from "../register/register";
import { HomePage } from "../home/home";
import { UserInfoPage } from "../user-info/user-info";
import { MediaProvider } from "../../providers/media/media";
import { User, LoginResponse, UsernameResponse } from "../../intefaces/posting";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  user: User = { username: null };
  username: string;
  password: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaprovider: MediaProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  loginClicked(formSignIn) {
    console.log(this.username);
    console.log(this.password);
    console.log(formSignIn);
    this.mediaprovider.login(this.user).subscribe(
      (response: LoginResponse) => {
        console.log("response");
        console.log(response);
        localStorage.setItem("token", response.token);
        this.navCtrl.push(HomePage);
        //       this.mediaprovider.token = response.token;
        this.mediaprovider.loggedIn = true;
        this.mediaprovider.user_id = response.user.user_id;
        console.log("user.id: " + this.mediaprovider.user_id);
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
