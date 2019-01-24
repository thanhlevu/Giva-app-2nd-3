import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  username: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  password2: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }

  signUp() {
    console.log(
      "username: " +
        this.username +
        "phone: " +
        this.phone +
        "address: " +
        this.address +
        "email: " +
        this.email +
        "password: " +
        this.password +
        "password2: " +
        this.password2
    );
    this.navCtrl.push(LoginPage);
  }
}
