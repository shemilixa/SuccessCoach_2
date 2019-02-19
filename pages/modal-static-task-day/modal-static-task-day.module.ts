import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalStaticTaskDayPage } from './modal-static-task-day';

@NgModule({
  declarations: [
    ModalStaticTaskDayPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalStaticTaskDayPage),
  ],
})
export class ModalStaticTaskDayPageModule {}
