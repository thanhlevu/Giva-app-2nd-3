import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditInfoPage } from './edit-info';

@NgModule({
  declarations: [
    EditInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditInfoPage),
  ],
})
export class EditInfoPageModule {}
