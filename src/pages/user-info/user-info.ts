import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {LoginPage} from "../login/login"
@Component({
  selector: "page-user-info",
  templateUrl: "user-info.html"
})
export class UserInfoPage {
  username: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  password2: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad UserInfoPage");
  }

  update() {
    this.navCtrl.pop();
  }
}
