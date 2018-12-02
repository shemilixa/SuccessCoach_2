import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-task-year',
  templateUrl: 'modal-task-year.html',
})
export class ModalTaskYearPage {
	public sfer: any;
	public name: string;
	public description: string;
	public selectSfer: number;
	constructor(
		private navParams: NavParams,
		private view: ViewController
		) {
	}

	closeModal(){
		this.view.dismiss();
	}

	ionViewWillLoad() {
	 	this.sfer = this.navParams.get('sections');
	}

	createTask(){
		let obj = {
			idgroup: this.selectSfer,
			name: this.name,
			description: this.description
		};
		this.view.dismiss(obj);		
	}

}
