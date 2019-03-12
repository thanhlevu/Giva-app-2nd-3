import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { User, LoginResponse } from "../../intefaces/interfaces";
import { MediaProvider } from "../../providers/media/media";
import { ServerResponse } from "../../intefaces/interfaces";

@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  user: User = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider
  ) {}

  // register a new account, give the successful notification and go back to LoginPage
  signUp() {
    this.mediaProvider.register(this.user).subscribe(
      (response: ServerResponse) => {
        alert(response.message);
        this.navCtrl.pop().catch();
      },
      error => {
        console.log(error);
      }
    );
  }

  // if already have account, go back to LoginPage
  goToLoginPage() {
    this.navCtrl.pop().catch();
  }
}
