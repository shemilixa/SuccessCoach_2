import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HTTP } from '@ionic-native/http';

@Injectable()
export class DatabaseProvider {

	private db: SQLiteObject;
	public platform: string;
	public isOpen: boolean = false;

  constructor(
  	private sqlite: SQLite,
  	public plt: Platform,
    private http: HTTP
  ) {
  	
  	if(plt.is('cordova')){
  		//если телефон
  		this.platform = 'cordova';
  	}
  }

  connectionDataBase(): void{
    if(this.platform == 'cordova'){
      this.sqlite = new SQLite();
      this.sqlite.create({
        name: 'db.db',
        location: 'default'
      }).then((db:SQLiteObject) => {
        this.db = db;
        this.isOpen = true;
        this.structureDB();
      }).catch((error) => {
        this.isOpen = false;
        console.log(error);
      });
    } else {
      console.log('База не подключена');
    }

  }

  structureDB(): void{
    //В методе описывается структура базы данных
    //rowid обязателен для каждой таблицы
    let url = "http://success-coach.ru?data=START";
    this.http.get(url, {}, {})
    .then(data => {
      console.log(data.data);
      let dataJson = JSON.parse(data.data);
      console.log(dataJson);
      this.verificationExistenceTables(dataJson);   
    })
    .catch(error => {
      console.log(error.status);
      console.log(error.error);
      console.log(error.headers);
    });
    //
  }

  verificationExistenceTables(tables) {
    //метор создает все необходимые таблицы в базе данных
    //и заполняет стартовыми значениями

    for(var i=0; i<tables.length; i++){   

      console.log(tables[i]);

      let name = tables[i].name; 
      let createSQl = ''; 
      let insertSQl = 'NULL'; 
      let url = tables[i].url; 

      let nom = 0;
      for(let key in tables[i].fields){
        createSQl = createSQl + key + ' ' + tables[i].fields[key];        
        if(nom<Object.keys(tables[i].fields).length-1){
          createSQl = createSQl + ', ';
          insertSQl = insertSQl + ', ?';
        }
        nom++;
      }
      this.db.executeSql('SELECT count(*) as con FROM '+name, [])
      .then(res => {
        console.log('ok s'+i);
        console.log(res.rows.item(0).con);        
      })
      .catch(() => {     
        this.db.executeSql("CREATE TABLE IF NOT EXISTS '"+name+"' ("+createSQl+")", [])
        .then(() => {
          console.log('ok n'+i);
          if(url){
            this.http.get(url, {}, {})
            .then(data => {
              console.log(data.data);
              let dataJson = JSON.parse(data.data);
              for(var j=0; j<dataJson.length; j++) {
                let nameCellStr = [];               
                for(var nameCell in dataJson[j]){                  
                 nameCellStr.push(dataJson[j][nameCell]);
                }
                this.db.executeSql('INSERT INTO '+name+' VALUES('+insertSQl+')',nameCellStr);
              }
            })
            .catch(error => {
              console.log('ok e'+i);
              console.log(error.status);
              console.log(error.error);
              console.log(error.headers);
            });
          }          
        });
      });   
    }
  }

  createTable(nameTable, obj){
    let createSQl = '';
    let nom = 0;
    for(let key in obj.fields){
      createSQl = createSQl + key + ' ' + obj.fields[key];        
      if(nom<Object.keys(obj.fields).length-1){
        createSQl = createSQl + ', ';
      }
      nom++;
    }
    if(this.platform == 'cordova'){
      if (this.isOpen) {
        return this.db.executeSql("CREATE TABLE IF NOT EXISTS '"+nameTable+"' ("+createSQl+")", []);
      }
    }
  }

  insertDataTables (nameTable, data){  	
    console.log(nameTable);
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
        let values = 'NULL';
				for(var i=0; i<data.length; i++) {
           values = values + ', ?';
        }
        console.log(values);
        console.log(data);
        return this.db.executeSql('INSERT INTO '+nameTable+' VALUES('+values+')', data);
			}
  	} else {
  		console.log('Данные заполнены');
  	}
  }  

  getDataAll(nameTable, option = ''){
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
				return this.db.executeSql('SELECT * FROM '+nameTable+' '+option, []);	
			}		
  	} else {
  		console.log('получение данных');
  	}
  }

  getCountTask(idGr){
    if(this.platform == 'cordova'){
      if (this.isOpen) {        
        return this.db.executeSql(`
            SELECT 
              count(yeardetailed.rowid) as countTask,
              yeardetailedPer.countPerformed as countPerformed
            FROM 
              yeardetailed,
              (SELECT 
                count(*) as countPerformed
              FROM 
                yeardetailed
              WHERE 
                idgroup=`+idGr+`
                AND
                status=1
                 ) as  yeardetailedPer            
            WHERE 
              idgroup=`+idGr, []); 
      }   
    } else {
      console.log('получение данных');
    }
  }

  updateElementTable(nameTable, idElement, updateFild){
    if(this.platform == 'cordova'){
      if (this.isOpen) {    
        console.log('UPDATE '+nameTable+' SET '+updateFild+' WHERE rowid='+idElement)    
        return this.db.executeSql('UPDATE '+nameTable+' SET '+updateFild+' WHERE rowid='+idElement, []); 
      }   
    } else {
      console.log('получение данных');
    }

  }

  deleteElementTable(nameTable, idElement){
    if(this.platform == 'cordova'){
      if (this.isOpen) {
        console.log('DELETE FROM '+nameTable+' WHERE rowid='+idElement);
        return this.db.executeSql('DELETE FROM '+nameTable+' WHERE rowid='+idElement, []); 
      }   
    } else {
      console.log('получение данных');
    }

  }


  dropTable(nameTable){
    //удаление переданной таблицы
  	if(this.platform == 'cordova'){
  		if (this.isOpen) {
        console.log("dropTable");
				return this.db.executeSql('DROP TABLE if exists '+nameTable, []);	
			}
  	} else {
  		console.log('Удаление таблицы');
  	}
  }

}
