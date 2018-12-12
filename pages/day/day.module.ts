import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayPage } from './day';
import { CalendarComponent } from '../../components/calendar/calendar';


@NgModule({
  declarations: [
    DayPage,
    CalendarComponent
  ],
  imports: [
    IonicPageModule.forChild(DayPage),
  ],
})
export class DayPageModule {}
