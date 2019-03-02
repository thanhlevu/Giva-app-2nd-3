import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Picture, PostInfo } from "../../intefaces/posting";

/**
 * Generated class for the PostViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-post-view",
  templateUrl: "post-view.html"
})
export class PostViewPage {
  pic: Picture;
  postInfo: PostInfo = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.postInfo.filename = this.navParams.data.filename;

    this.postInfo.title = this.navParams.data.title;

    this.postInfo.description = this.navParams.data.description
      .split("$")[0]
      .split(":")[1];
    this.postInfo.category = this.navParams.data.description
      .split("$")[1]
      .split(":")[1];
    this.postInfo.end_time = this.navParams.data.description
      .split("$")[3]
      .split("=")[1];
    this.postInfo.contact = this.navParams.data.description
      .split("$")[4]
      .split(":")[1];
    this.postInfo.contact_time_from = this.navParams.data.description
      .split("$")[5]
      .split("=")[1];
    this.postInfo.contact_time_to = this.navParams.data.description
      .split("$")[6]
      .split("=")[1];
    this.postInfo.reserved = this.navParams.data.description
      .split("$")[7]
      .split(":")[1];

    console.log("AS", this.postInfo);
  }

  ionViewDidLoad() {}
}
