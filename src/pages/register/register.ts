import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { User, LoginResponse } from "../../intefaces/posting";
import { MediaProvider } from "../../providers/media/media";

@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  user: User = { username: null };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }

  signUp() {
    console.log(this.user);

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

  goLoginPage() {
    this.navCtrl.pop().catch();
  }
}
