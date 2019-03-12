import { Component, OnInit } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Picture } from "../../intefaces/interfaces";
import { HttpClient } from "@angular/common/http";
import { RegisterPage } from "../register/register";
import { PostViewPage } from "../post-view/post-view";
import { PostingPage } from "../posting/posting";
import { MyItemsPage } from "../my-items/my-items";
import { PostEditPage } from "../post-edit/post-edit";
import { MediaProvider } from "../../providers/media/media";
declare var google;
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  picArray: Picture[];
  selectedCategory: string;
  src = "http://media.mw.metropolia.fi/wbma/uploads/";
  options = {};
  title: string;
  currentLocation: any;
  selectedRadius = 0;
  keyword: string = "";
  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public http: HttpClient,
    private alertCtrl: AlertController,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(currentPosition => {
      // get current location
      this.currentLocation = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude
      };
    });
  }

  searchByCategory() {
    if (this.selectedCategory != "all") {
      this.mediaProvider
        .getFilesByTag("GIVA_Category." + this.selectedCategory)
        .subscribe((response: Picture[]) => {
          this.picArray = response;
        });
    } else {
      this.loadItems_GivaTag();
    }
  }

  searchByTitle(ev: any) {
    this.keyword = ev.target.value.toLowerCase();
    if (ev.target.value != "") {
      this.mediaProvider
        .getFilesByTitle({ title: "GIVA_Title_" })
        .subscribe((response: Picture[]) => {
          console.log("response", response);
          this.picArray = response.filter((
            item // ??? error if using {}
          ) =>
            item.title
              .split("GIVA_Title_")[1]
              .toLowerCase()
              .includes(ev.target.value.toLowerCase())
          );
        });
    } else {
      this.loadItems_GivaTag();
    }
  }

  searchByDistance() {
    this.mediaProvider.getAllItemsWithGivaTag().subscribe(items => {
      //order by the newest post
      let array = items.sort((a, b) => Number(b.file_id) - Number(a.file_id));

      for (var i = 0; i < array.length; i++) {
        var myLocation = new google.maps.LatLng(this.currentLocation);
        var itemLocation = new google.maps.LatLng(
          array[i].description
            .split("(@!GIVA?#)")[1]
            .split(",")[0]
            .split("geolocation:")[1],
          array[i].description.split("(@!GIVA?#)")[1].split(",")[1]
        );
        if (
          google.maps.geometry.spherical.computeDistanceBetween(
            myLocation,
            itemLocation
          ) >
          Number(this.selectedRadius) * 1000
        ) {
          array.splice(i, 1);
        }
      }
      this.picArray = array;
    });
  }

  doRefresh(event) {
    this.loadItems_GivaTag();
    setTimeout(() => {
      console.log("Async operation has ended");
      console.log(event);
      event.complete();
    }, 2000);
  }

  loading() {
    let loading = this.loadingCtrl.create({});
    loading.present();

    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.parent.select(0);
    }, 1000);
  }
  ionViewDidEnter() {
    this.loadItems_GivaTag();
  }

  loadItems_GivaTag() {
    this.mediaProvider.getAllItemsWithGivaTag().subscribe(items => {
      //order by the newest post
      this.picArray = items.sort(
        (a, b) => Number(b.file_id) - Number(a.file_id)
      );
    });
  }

  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
  }

  goToPost() {
    this.navCtrl.push(PostingPage);
  }

  goToMyPosts() {
    this.navCtrl.push(MyItemsPage);
  }
}
