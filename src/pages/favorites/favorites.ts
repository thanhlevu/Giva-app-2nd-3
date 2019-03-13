import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Picture, FavoriteResponse } from "../../intefaces/interfaces";
import { HttpClient } from "@angular/common/http";
import { MediaProvider } from "../../providers/media/media";
import { Observable } from "rxjs";
import { PostViewPage } from "../post-view/post-view";

/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-favorites",
  templateUrl: "favorites.html"
})
export class FavoritesPage {
  favoriteItemArray: Picture[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    private mediaProvider: MediaProvider
  ) {}

  // load all my favorite items
  ionViewDidEnter() {
    this.getAllMyFavoriteItems();
  }

  // get all my favorite items except from avatar
  getAllMyFavoriteItems() {
    this.mediaProvider
      .getAllMyFavoriteItems()
      .subscribe((favoriteFileIdArr: FavoriteResponse[]) => {
        console.log("this.favoriteFileIdArr", favoriteFileIdArr);
        for (var i = 0; i < favoriteFileIdArr.length; i++) {
          console.log(favoriteFileIdArr[i].file_id);
          this.mediaProvider
            .getFileDataById(favoriteFileIdArr[i].file_id)
            .subscribe((picture: Picture) => {
              console.log("picture", picture);
              console.log("this.favoriteItemArray", this.favoriteItemArray);
              this.favoriteItemArray.push(picture);
            });
        }
      });
  }

  // go to PostViewPage along with the data
  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
  }
}
