import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

	public items: any = [];

  constructor(
  	public navCtrl: NavController,
  	private database: DatabaseProvider
  ) {
  	
  }

  ngOnInit() {
  	setTimeout(() => { this.getDataSectionAll(); }, 1000);  	
  }

  ngAfterViewChecked(){
  }


  addTables(){
  	this.database.structureDB();
  }

  
  getDataSectionAll() {  	
  	this.database.getDataAll('section')
  	.then(res => {
		if(res.rows.length>0) {	
	 		var items = [];		    
	    for(var i=0; i<res.rows.length; i++) {
	      items.push({rowid:res.rows.item(i).rowid,name:res.rows.item(i).name,url:res.rows.item(i).url,active:res.rows.item(i).active})
		  }
		 this.items = items;
		}						
	});
  }

  dropTableSecond() {
  	this.database.dropTable('section');
  	this.items = [];
  }

  
}
