import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YearPage } from './year';

@NgModule({
  declarations: [
    YearPage,
  ],
  imports: [
    IonicPageModule.forChild(YearPage),
  ],
   entryComponents: [
    YearPage
  ]
})
export class YearPageModule {}
