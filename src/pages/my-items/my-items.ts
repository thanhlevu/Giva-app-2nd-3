import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MediaProvider } from "../../providers/media/media";
import { HttpClient } from "@angular/common/http";
import { Picture } from "../../intefaces/interfaces";
import { PostViewPage } from "../post-view/post-view";
import { PostEditPage } from "../post-edit/post-edit";

/**
 * Generated class for the MyItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-items",
  templateUrl: "my-items.html"
})
export class MyItemsPage implements OnInit {
  myItemArray: Picture[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    public http: HttpClient
  ) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.getMyItems();
  }

  // go to PostViewPage
  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
  }

  // load all my items except avatar
  getMyItems() {
    this.mediaProvider.getMyItems().subscribe((response: Picture[]) => {
      this.myItemArray = response.filter(
        obj => !obj.title.includes("GIVA_Avartar_")
      );
    });
  }
}
