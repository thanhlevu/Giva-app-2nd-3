import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoginPage } from "../login/login";
import { MediaProvider } from "../../providers/media/media";
import { User, LoginResponse } from "../../intefaces/posting";
import { EditInfoPage } from "../edit-info/edit-info";

@Component({
  selector: "page-user-info",
  templateUrl: "user-info.html"
})
export class UserInfoPage {
  userInfo: User = {};
  error:string ="";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider
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
    if(this.checkUsername()){
    if (this.checkPasswords()) {
      delete this.userInfo.password2;
      console.log("userInfo ", this.userInfo);
      this.mediaProvider.updateUserInfo(this.userInfo).subscribe(
        (response: LoginResponse) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    } else{
      this.error = "Check passwords";
    }
  }else{
    this.error = "check username";
  }
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
  checkUsername(){
    if(this.userInfo.username != null){
      if(this.userInfo.full_name != null){
        if(this.userInfo.email != null){
          return true;
        }else{
          this.error = "Check email";
          return false;
        }
      }else{
        this.error = "Check full name";
        return false;
      }
      
    }else{
      this.error = "Check username";
      return false;
    }
  }
  checkPasswords(){
    if(this.userInfo.password.length > 0 && this.userInfo.password2.length > 0 ){
      if(this.userInfo.password == this.userInfo.password2){

      }else{
        return false;
      }
    }else{
      return false;
    }
  }
}
