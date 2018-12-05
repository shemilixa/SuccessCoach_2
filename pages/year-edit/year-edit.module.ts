import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YearEditPage } from './year-edit';

@NgModule({
  declarations: [
    YearEditPage,
  ],
  imports: [
    IonicPageModule.forChild(YearEditPage),
  ],
})
export class YearEditPageModule {}
