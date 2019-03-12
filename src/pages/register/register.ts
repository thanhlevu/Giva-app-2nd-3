import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { User, LoginResponse } from "../../intefaces/posting";
import { MediaProvider } from "../../providers/media/media";
import { ValidatorProvider } from "../../providers/validator/validator";

@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  user: User = { username: null };
  message: boolean = false;
  error: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private validator: ValidatorProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }

  signUp() {
    this.validator.validateRegister(this.user)
    .then((data) => {
      console.log("send", this.user);
      this.mediaProvider.register(this.user).subscribe(
        response => {
          console.log(response);
          this.navCtrl.pop().catch();
        },
        error => {
          console.log(error);
        }
      );
    }).catch((err) => {
      this.error = "Check "+err;
      this.message = true;
    })
  
  }

  goLoginPage() {
    this.navCtrl.pop().catch();
  }
}
