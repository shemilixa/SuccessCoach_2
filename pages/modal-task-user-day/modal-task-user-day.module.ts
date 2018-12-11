import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTaskUserDayPage } from './modal-task-user-day';

@NgModule({
  declarations: [
    ModalTaskUserDayPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTaskUserDayPage),
  ],
})
export class ModalTaskUserDayPageModule {}
