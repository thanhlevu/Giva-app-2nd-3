import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PostingPage } from "./posting";

@NgModule({
  declarations: [PostingPage],
  imports: [IonicPageModule.forChild(PostingPage)]
})
export class PostingPageModule {}
