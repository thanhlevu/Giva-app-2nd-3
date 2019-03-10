import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MediaProvider } from "../../providers/media/media";
import { HttpClient } from "@angular/common/http";
import { Picture } from "../../intefaces/posting";
import { PostViewPage } from "../post-view/post-view";
import { PostEditPage } from "../post-edit/post-edit";

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

  ionViewDidLoad() {
    console.log("ionViewDidLoad MyItemsPage");
  }

  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
  }

  getMyItems() {
    this.mediaProvider.getMyItems().subscribe((response: Picture[]) => {
      this.myItemArray = response;
      console.log(this.myItemArray);
    });
  }
}
