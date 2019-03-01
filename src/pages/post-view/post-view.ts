import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Picture } from "../../intefaces/posting";

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
  public pic: Picture;
  a: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    console.log(this.navParams.data);
    this.pic = this.navParams.data;
    console.log("a", this.a);
    if (this.a !== undefined) {
      console.log("YES");
    } else {
      console.log("NO");
    }
  }

  ionViewDidLoad() {}
}
