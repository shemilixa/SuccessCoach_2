import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewTrainingPage } from './view-training';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    ViewTrainingPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewTrainingPage),
    RoundProgressModule
  ],
  providers: [
  ],
})
export class ViewTrainingPageModule {}
