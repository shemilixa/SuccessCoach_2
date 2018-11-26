import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the YearPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'YearPage'
})
@Component({
  selector: 'page-year',
  templateUrl: 'year.html',
})
export class YearPage {
	public items: any = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private database: DatabaseProvider
  	) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YearPage');
    this.getDataSectionAll();
  }

  getDataSectionAll() {  	
  	this.database.getDataAll('year_group')
    .then(res => {
  		if(res.rows.length>0) {	
  	 		var items = [];		    
  	    for(var i=0; i<res.rows.length; i++) {
  	      items.push({rowid:res.rows.item(i).rowid,name:res.rows.item(i).name,order:res.rows.item(i).order,ico:res.rows.item(i).ico})
  		  }
  		 this.items = items;
  		 console.log(items);
  		}						
  	});
  }

   dropTableSecond() {
  	this.database.dropTable('year_group');
  	this.items = [];
  }


}
