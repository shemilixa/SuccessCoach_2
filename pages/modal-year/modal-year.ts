import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-year',
  templateUrl: 'modal-year.html',
})
export class ModalYearPage {
	public sfer: any;
	public data: any;
	constructor(
		public navParams: NavParams,
		private view: ViewController
		) {
	}

	closeModal(){
		this.view.dismiss();
	}

	ionViewWillLoad() {
	 	this.data = this.navParams.get('obj');
	}

	createSfer(){
		let obj = {
			name: this.data.name
		};
		this.view.dismiss(obj);		
	}

}
