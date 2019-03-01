import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Picture } from "../../intefaces/posting";

import { HttpClient } from "@angular/common/http";
import { RegisterPage } from "../register/register";
import { PostViewPage } from "../post-view/post-view";
import { PostingPage } from "../posting/posting";
import { MyItemsPage } from "../my-items/my-items";
import { PostEditPage } from "../post-edit/post-edit";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  picArray: Picture[];

  src = "http://media.mw.metropolia.fi/wbma/uploads/";

  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public http: HttpClient
  ) {}

  ngOnInit() {
    /*     if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(currentPosition) {
        // get current location
        let currentLocation = {
          lat: currentPosition.coords.latitude,
          lng: currentPosition.coords.longitude
        };
        console.log("currentLocation: ", currentLocation);
        // save the current location to Local Storage
        localStorage.setItem(
          "current_location",
          JSON.stringify(currentLocation)
        );
      });
    } */
  }

  ionViewDidEnter() {
    this.loadItems_GivaTag();
  }
  loadItems() {
    return this.http
      .get<Picture[]>("../../assets/test.json")
      .subscribe(data => {
        //console.log(data);
        this.picArray = data;
      });
  }

  loadItemsFromServer() {
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/media")
      .subscribe((data: Picture[]) => {
        this.picArray = data;
      });
  }

  loadItems_GivaTag() {
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/tags/GIVA")
      .subscribe(items => {
        //order by the newest post
        this.picArray = items.sort(
          (a, b) => Number(b.file_id) - Number(a.file_id)
        );
      });
  }

  viewImage(url: string) {
    //this.photoViewer.show(this.src + url);
  }

  viewPost(Pic: Picture) {
    if (Pic.user_id == localStorage.userID) {
      this.navCtrl.push(PostEditPage, Pic);
    } else {
      this.navCtrl.push(PostViewPage, Pic);
    }
  }

  goToPost() {
    this.navCtrl.push(PostingPage);
  }

  goToMyPosts() {
    this.navCtrl.push(MyItemsPage);
  }
}
