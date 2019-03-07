import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Picture } from "../../intefaces/posting";
import { MediaProvider } from "../../providers/media/media";

@IonicPage()
@Component({
  selector: "page-post-view",
  templateUrl: "post-view.html"
})

export class PostViewPage {
/**
 * 
 * Gets an error when trying to get single media.. fix tomorrow
 * 
 * 
 */
  id;
  public pic: Picture = {
    file_id: 1
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mediaprovdier: MediaProvider) {}

  ngOnInit() {
    console.log(this.navParams.data);
    this.id = this.navParams.data;
  }

  ionViewDidLoad() {
   this.getMedia();
  }
getMedia(){
  this.mediaprovdier.getSingleMedia(this.id).subscribe(
  (pic: Picture)=>{
     this.pic = pic;
    console.log("this1", this.pic.title, this.pic.file_id);
  }
);
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
