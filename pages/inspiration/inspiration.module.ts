import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspirationPage } from './inspiration';

@NgModule({
  declarations: [
    InspirationPage,
  ],
  imports: [
    IonicPageModule.forChild(InspirationPage),
  ],
})
export class InspirationPageModule {}
