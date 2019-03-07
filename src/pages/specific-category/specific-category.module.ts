import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecificCategoryPage } from './specific-category';

@NgModule({
  declarations: [
    SpecificCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecificCategoryPage),
  ],
})
export class SpecificCategoryPageModule {}
