import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { User, LoginResponse } from "../../intefaces/interfaces";
import { MediaProvider } from "../../providers/media/media";

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

  signUp() {
    this.mediaProvider.register(this.user).subscribe(
      response => {
        console.log(response);
        this.navCtrl.pop().catch();
      },
      error => {
        console.log(error);
      }
    );
  }

  goToLoginPage() {
    this.navCtrl.pop().catch();
  }
}
