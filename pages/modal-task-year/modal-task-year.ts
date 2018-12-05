import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-task-year',
  templateUrl: 'modal-task-year.html',
})
export class ModalTaskYearPage {
	public sfer: any;
	public data: any;
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
	 	this.data = this.navParams.get('obj');
	}

	createTask(){
		let obj = {
			rowid: this.data.rowid,
			idgroup: this.data.idgroup,
			name: this.data.name,
			description: this.data.description
		};
		this.view.dismiss(obj);		
	}

}
