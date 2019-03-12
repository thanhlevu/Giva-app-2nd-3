import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { MediaProvider } from "../../providers/media/media";
import { User, LoginResponse } from "../../intefaces/posting";
import { EditInfoPage } from "../edit-info/edit-info";
import {  ValidatorProvider } from "../../providers/validator/validator";

@Component({
  selector: "page-user-info",
  templateUrl: "user-info.html"
})
export class UserInfoPage {
  userInfo: User = {};
  message: boolean = false;
  error:string ="";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private validator: ValidatorProvider
  ) {}

  ionViewDidLoad() {
    this.getUsersInfo();
    console.log("ionViewDidLoad UserInfoPage");
  }

  getUsersInfo() {
    this.mediaProvider.getUsersInfo().subscribe((response: User) => {
      this.userInfo = response;
      console.log(response);
    });
  }

  updateUserInfo() {
    this.validator.validateUserData(this.userInfo)
    .then((data) => {
      delete this.userInfo.password2;
      this.mediaProvider.updateUserInfo(this.userInfo).subscribe(
        (response: LoginResponse) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    })
    .catch((err) => {
      console.log("err",err);
      this.error = "Check "+err;
      this.message = true;
    })
 
  }

  logOut() {
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);

    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map(key => {
        elements[key].style.display = "none";
      });
    }
  }
}
