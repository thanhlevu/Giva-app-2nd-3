import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Picture } from '../../intefaces/posting';

import { HttpClient } from '@angular/common/http';
import { MediaProvider } from '../../providers/media/media';
import { GetByTagPipe } from './../../pipes/get-by-tag/get-by-tag';
import { RegisterPage } from "../register/register";
import { PostViewPage } from '../post-view/post-view';
import { PostingPage } from '../posting/posting';
import { MyItemsPage } from '../my-items/my-items';
import { PostEditPage } from '../post-edit/post-edit';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  picArray: Picture[] = [];
  tagPipe: any;

  constructor(
    private mediaProvider: MediaProvider, public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public http: HttpClient
  ) {
    this.tagPipe = new GetByTagPipe(this.mediaProvider);
  }

  ionViewDidEnter() {
    this.loadItems_GivaTag();
  }

  loadItems() {
    return this.http
      .get<Picture[]>("../../assets/test.json")
      .subscribe(data => {
        //console.log(data);
        this.picArray = data;
      });
  }

  loadItemsFromServer() {
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/media")
      .subscribe((data: Picture[]) => {
        this.picArray = data;
      });
  }

  loadItems_GivaTag() {
    return this.tagPipe.transform('GIVA').then((files: Picture[]) => {
      this.picArray = files.sort(
        (a, b) => Number(b.file_id) - Number(a.file_id)
      );
    });
  }

  viewImage(url: string) {
    // this.photoViewer.show(this.src + url);
  }

  viewPost(Pic: Picture) {
    console.log(Pic);

    if (Pic.user_id === localStorage.userID) {
      this.navCtrl.push(PostEditPage, Pic);
    } else {
      this.navCtrl.push(PostViewPage, Pic);
    }
  }

  goToPost() {
    this.navCtrl.push(PostingPage);
  }

  goToMyPosts() {
    this.navCtrl.push(MyItemsPage);
  }
}
