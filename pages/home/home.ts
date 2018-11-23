import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DatabaseProvider]
})
export class HomePage implements OnInit{

	public items: any = [];

  constructor(
  	public navCtrl: NavController,
  	private database: DatabaseProvider
  ) {
  	
  }

  ngOnInit() {
  	this.database.openSQLiteDatabase()
		.then((result) =>{
			console.log(result);
		});
  }

  ngAfterViewChecked(){

  }


  addTables(){
  	this.database.createTables();
  }

  insertDataTables(){
  	let obj = [
  		{
		    "name": "Твой успешный день",
		    "url": "day",
		    "active": "1"
		  },
		  {
		    "name": "Твой успешный год",
		    "url": "year",
		    "active": "1"
		  },
		  {
		    "name": "Выход из стресса",
		    "url": "stress",
		    "active": "1"
		  },
		  {
		    "name": "Вдохновление на день",
		    "url": "",
		    "active": "0"
		  },
		  {
		    "name": "Бизнес решение",
		    "url": "",
		    "active": "0"
		  },
		  {
		    "name": "Питание",
		    "url": "",
		    "active": "0"
		  },
		  {
		    "name": "Общение",
		    "url": "communication",
		    "active": "1"
		  }
  	];

  	//console.log(obj);

  	this.database.insertDataTablesSection(obj);
  }

  getDataSectionAll(){
  	/*console.log(1);
  	this.database.getDataAll('section')
  	.then(res => {
  		console.log(2);
				if(res.rows.length>0) {	
			 		var items = [];		    
			    for(var i=0; i<res.rows.length; i++) {
			      items.push({rowid:res.rows.item(i).rowid,name:res.rows.item(i).name,url:res.rows.item(i).url,active:res.rows.item(i).active})
				  }
				 this.items = items;
				}						
			});*/

		this.database.openSQLiteDatabase()
		.then((result) =>{
			console.log(result);
		});
  }

  dropTableSecond(){
  	this.database.dropTable('section');
  	this.items = [];
  }

}
