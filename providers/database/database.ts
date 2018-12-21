import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HTTP } from '@ionic-native/http';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class DatabaseProvider {

	private db: SQLiteObject;
	public platform: string;
	public isOpen: boolean = false;
  public userGoogle: any;

  constructor(
  	private sqlite: SQLite,
  	public plt: Platform,
    private alertCtrl: AlertController,
    private googlePlus: GooglePlus,    
    private http: HTTP
  ) {
  	
  	if(plt.is('cordova')){
  		//если телефон
  		this.platform = 'cordova';
  	}
  }

  synchronization(){
    if(this.platform == 'cordova'){
      this.googlePlus.trySilentLogin({})
      .then(googleUser => {
        this.userGoogle = googleUser;
        this.usersToServer(googleUser);
      })
      .catch(error => {
        this.googlePlus.login({})
          .then(googleUser => {
          this.userGoogle = googleUser;
          this.usersToServer(googleUser);
        })
      });
    }
  }


  usersToServer(googleUser){
    let headers = {
        'Content-Type': 'application/json'
    };

    let url = "http://success-coach.ru/modules/users/";
    this.http.post(url, googleUser, headers)
        .then(data => {
          this.connectionDataBase();
        })
        .catch(error => {
          console.log(error);
          
    });
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
    let url = "http://success-coach.ru/modules/start/";
    let statusUrl: string;
    this.http.get(url, {}, {})
    .then(data => {
      let dataJson = JSON.parse(data.data);

     /*let alert = this.alertCtrl.create({
        title: 'Востановление данных',
        message: 'Востановить данные?',
        buttons: [
          {
            text: 'Нет',
            role: 'cancel',
            handler: () => {
              statusUrl = 'STANDART';
              this.verificationExistenceTables(dataJson, statusUrl);
            }
          },
          {
            text: 'Да',
            handler: () => {
              statusUrl = 'MY_DATA';
              this.verificationExistenceTables(dataJson, statusUrl);   
            }
          }
        ]
      });
      alert.present(); */
      
      statusUrl = 'MY_DATA';
      this.verificationExistenceTables(dataJson, statusUrl);     
    })
    .catch(error => {
      console.log(error.status);
      console.log(error.error);
      console.log(error.headers);
    });
    //
  }

  verificationExistenceTables(tables, statusUrl) {
    //метор создает все необходимые таблицы в базе данных
    //и заполняет стартовыми значениями

    for(var i=0; i<tables.length; i++){   

      //console.log(tables[i]);

      let name = tables[i].name; 
      let createSQl = ''; 
      let url = tables[i].url; 

      let nom = 0;
      for(let key in tables[i].fields){
        createSQl = createSQl + key + ' ' + tables[i].fields[key];        
        if(nom<Object.keys(tables[i].fields).length-1){
          createSQl = createSQl + ', ';          
        }
        nom++;
      }
      this.db.executeSql('SELECT count(*) as con FROM '+name, [])
      .then(res => {
        //получаю данные которые еще не сохранены на удаленном сервере
        let option =" WHERE clone=1";
        this.getDataAll(name, option)
        .then(dataRow => {          
          if(dataRow.rows.length>0) { 
            let arDataSync: any = [];
            for(var iElem=0; iElem<dataRow.rows.length; iElem++) { 
              arDataSync.push(dataRow.rows.item(iElem));  
            }
            this.synchronizationDataServer(name, arDataSync);     
          }
        });
      })
      .catch(() => {     
        this.db.executeSql("CREATE TABLE IF NOT EXISTS '"+name+"' ("+createSQl+")", [])
        .then(() => {
          //console.log('ok n'+i);
          if(url){
            this.http.get(url+'?START='+statusUrl+'&USERID='+this.userGoogle.userId, {}, {})
            .then(data => {
              //console.log(data.data);
              let dataJson = JSON.parse(data.data);
              for(var j=0; j<dataJson.length; j++) {
                let nameCellStr = [];    
                let insertSQl = 'NULL';          
                let nom = 0;
                for(var nameCell in dataJson[j]){                  
                  nameCellStr.push(dataJson[j][nameCell]);

                  if(nom<Object.keys(dataJson[j]).length){
                    insertSQl = insertSQl + ', ?';         
                  }
                  nom++;                 
                }
                console.log('INSERT INTO '+name+' VALUES('+insertSQl+')');
                console.log(nameCellStr);
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
    if(this.platform == 'cordova'){
  		if (this.isOpen) {
        let values = 'NULL';
				for(var i=0; i<data.length; i++) {
           values = values + ', ?';
        }
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
        return this.db.executeSql('UPDATE '+nameTable+' SET '+updateFild+' WHERE rowid='+idElement, []); 
      }   
    } else {
      console.log('получение данных');
    }

  }

  deleteElementTable(nameTable, idElement){
    if(this.platform == 'cordova'){
      if (this.isOpen) {
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
				return this.db.executeSql('DROP TABLE if exists '+nameTable, []);	
			}
  	} else {
  		console.log('Удаление таблицы');
  	}
  }


  synchronizationDataServer(moduleName, arData){
    //сохраниение удалление изменение данных на удаленном сервере
    let url = "http://success-coach.ru/modules/"+moduleName+"/";
    
    let obj: any = {
      userId: this.userGoogle.userId,
      data: arData
    };

    let headers = {
      'Content-Type': 'application/json'
    };
    this.http.post(url, obj, headers)
    .then(data => {      
      data['data'] = data['data'].replace(/\s/g, '');
      if(data['data'] == 'ok'){
        for(let index in arData){
          this.updateElementTable(moduleName, arData[index]['rowid'], 'clone=0');
        }
      }
    })
    .catch(error => {
      console.log(error);          
    });

  }

}
