import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {

	private db: SQLiteObject;
	public platform: string;
	public isOpen: boolean;

  constructor(
  	private sqlite: SQLite,
  	public plt: Platform
  ) {
  	
  	if(plt.is('cordova')){
  		//если телефон
  		this.platform = 'cordova';
  	}

		if (!this.isOpen) {
  		this.connectionDataBase();  		
  	}
  }


  public openSQLiteDatabase() {
		return new Promise((resolve, reject) => {
		  if(this.isOpen) {
		    console.log("DB IS OPEN");
		    resolve(this.isOpen);
		  } else {
		    console.log("DB IS NOT OPEN");
		    this.connectionDataBase();
		    this.openSQLiteDatabase();
		    reject(false);
		  }
		});
	}



  connectionDataBase(){
  	if(this.platform == 'cordova'){
	  	this.sqlite = new SQLite();
	  	this.sqlite.create({
	      name: 'db.db',
	      location: 'default'
	    }).then((db:SQLiteObject) => {
	    	this.db = db;
	    	this.isOpen = true;
	    	//console.log('ok');
	    }).catch((error) => {
	      console.log(error);
	    });
  	} else {
  		console.log('База не подключена');
  	}
  }



  createTables(){
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
	  		this.db.executeSql('CREATE TABLE IF NOT EXISTS section(rowid INTEGER PRIMARY KEY, name TEXT, url TEXT, active INT)', [])
	      .then(res => console.log('Executed SQL'))
	      .catch(e => console.log(e));
	      console.log('таблица создана');
	    }
  	} else {
  		console.log('таблица создана');
  	}
  }

  insertDataTablesSection(data){  	
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
				for(var i=0; i<data.length; i++) {
					this.db.executeSql('INSERT INTO section VALUES(NULL,?,?,?)',[data[i].name,data[i].url,data[i].active]);
				}
			}
  	} else {
  		console.log('Данные заполнены');
  	}
  }

  getDataAll(nameTable){
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
				return this.db.executeSql('SELECT * FROM '+nameTable, []);	
			}		
  	} else {
  		console.log('получение данных');
  	}
  }

  checkTable(nameTable){
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
				return this.db.executeSql("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='"+nameTable+"'", []);	
			}
  	} else {
  		console.log('Удаление таблицы');
  	}
  }

  dropTable(nameTable){
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
				return this.db.executeSql('DROP TABLE if exists '+nameTable, []);	
			}
  	} else {
  		console.log('Удаление таблицы');
  	}
  }

}
