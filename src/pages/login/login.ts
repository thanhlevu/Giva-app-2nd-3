import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RegisterPage } from "../register/register";
import { HomePage } from "../home/home";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  username: string;
  password: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  login() {
    this.navCtrl.push(HomePage);
    console.log(this.username);
    console.log(this.password);
  }

  goRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }
}
