import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Picture, FavoriteResponse } from "../../intefaces/posting";
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
  favoriteFileIdArray: FavoriteResponse[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    private mediaProvider: MediaProvider
  ) {}

  ionViewDidEnter() {
    this.getAllMyFavoriteItems();
    console.log("ionViewDidLoad FavoritesPage");
  }
  getAllMyFavoriteItems() {
    this.mediaProvider
      .getAllMyFavoriteItems()
      .subscribe((favoriteFileIdArray: FavoriteResponse[]) => {
        this.favoriteFileIdArray = favoriteFileIdArray;
        console.log("this.favoriteFileIdArray", this.favoriteFileIdArray);
        this.favoriteItemArray = [];
        for (var i = 0; i < this.favoriteFileIdArray.length; i++) {
          console.log(this.favoriteFileIdArray[i].file_id);
          this.mediaProvider
            .getFileDataById(this.favoriteFileIdArray[i].file_id)
            .subscribe((picture: Picture) => {
              console.log("picture", picture);
              console.log("this.favoriteItemArray", this.favoriteItemArray);
              this.favoriteItemArray.push(picture);
            });
        }
      });
  }

  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
  }
}
