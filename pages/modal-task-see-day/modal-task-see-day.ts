import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-task-see-day',
  templateUrl: 'modal-task-see-day.html',
})
export class ModalTaskSeeDayPage {
	public task: any;
	constructor(
		public navParams: NavParams,
		private view: ViewController
		) {
	}

	ionViewWillLoad() {
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

	editTask(){
		this.view.dismiss('edit');
	}

	deleteTask(){
		this.view.dismiss('delete');
	}

}
