import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Picture } from "../../intefaces/posting";
import { MediaProvider } from "../../providers/media/media";

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

  id;
  public pic: Picture;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mediaprovdier: MediaProvider) {}

  ngOnInit() {
    console.log(this.navParams.data);
    this.pic = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PostViewPage");
  }

  pin(){
    this.id = this.pic.file_id;
    const fd = {
      "file_id": this.id
    }
    this.mediaprovdier.makeFavorite(fd).subscribe(
      (response: Response) =>{
        console.log(response);
      }
    )
  }
}
