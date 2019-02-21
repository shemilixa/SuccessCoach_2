import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-static-task-day',
  templateUrl: 'modal-static-task-day.html',
})
export class ModalStaticTaskDayPage {
  public task: any;
  public exercises: any;
  
  constructor(
		public navParams: NavParams,
		private view: ViewController
    ) {
  }

	ionViewWillLoad() {
    this.exercises = this.navParams.get('exercises');
    this.task = this.navParams.get('task');
    this.task.startMin = this.getTimeFromMins(this.task.timeStartMin);
    this.task.finishMin  = this.getTimeFromMins(this.task.timeFinishMin);

  }

  closeModal(){
    this.view.dismiss();
  }
  getTimeFromMins(mins) {
    let hours = Math.trunc(mins/60);
    let minutes = mins % 60;   
    if(minutes == 0){
      return hours + ':00';
    } else {
      return hours + ':' + minutes;
    }    	
  }

  viewTraining(){
    this.view.dismiss('viewTraining');    
  }

  saveTask(){
    console.log(this.task);
  }


}
