import { Component, Input } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {
	@Input() root: any;

  constructor(
    public navCtrl: NavController
    ) {
  }

  ionViewDidLoad() {}

  gotoPage(url){    
    this.navCtrl.push(url, {rootParams: this.navCtrl['rootParams']});
  }

}
