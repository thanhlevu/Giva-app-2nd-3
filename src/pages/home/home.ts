import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Picture } from "../../intefaces/posting";

import { HttpClient } from "@angular/common/http";
import { RegisterPage } from "../register/register";
import { PostViewPage } from "../post-view/post-view";

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
    this.loadItemsFromServer();
  }

  loadItems() {
    return this.http
      .get<Picture[]>("../../assets/test.json")
      .subscribe(data => {
        console.log(data);
        this.picArray = data;
      });
  }

  loadItemsFromServer() {
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/media")
      .subscribe(data => {
        console.log(data);
        this.picArray = data;
      });
  }

  viewImage(url: string) {
    //this.photoViewer.show(this.src + url);
  }

  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
    // console.log(Pic);
  }
}
