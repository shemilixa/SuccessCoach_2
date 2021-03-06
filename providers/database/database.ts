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
  private googleUserSessionProgram: string;
  private googleUserSessionServer: string;

  constructor(
  	private sqlite: SQLite,
  	private plt: Platform,
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
        this.googleUserSessionProgram = 'constant';
        this.usersToServer(googleUser);
      })
      .catch(error => {
        this.googlePlus.login({})
          .then(googleUser => {
          this.userGoogle = googleUser;
          this.googleUserSessionProgram = 'new';
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
          data['data'] = data['data'].replace(/\s/g, '');
          this.googleUserSessionServer = data['data'];
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
        this.userVerificationAndDataAvailability();        
      }).catch((error) => {
        this.isOpen = false;
        console.log(error);
      });
    } else {
      console.log('База не подключена');
    }
  }



  userVerificationAndDataAvailability(){
    let statusUrl: string;

    if( this.googleUserSessionProgram == 'new' && this.googleUserSessionServer == 'constant'){
      //пользователь включил приложение в первые
      //но пользователь уже пользовался когдато этим приложением
      let alert = this.alertCtrl.create({
        title: 'Востановление данных',
        message: 'Востановить данные?',
        buttons: [
          {
            text: 'Нет',
            role: 'cancel',
            handler: () => {
              statusUrl = 'STANDART';
              this.structureDB(statusUrl);
            }
          },
          {
            text: 'Да',
            handler: () => {
              statusUrl = 'MY_DATA';
              this.structureDB(statusUrl);
            }
          }
        ]
      });
      alert.present();
    } else if(this.googleUserSessionProgram == 'new' && this.googleUserSessionServer == 'new'){
      //пользователь включил приложение в первые
      //никогда не пользовался этим приложением
      statusUrl = 'STANDART';
      this.structureDB(statusUrl);
    } else {
      //пользователь включил приложение не первый раз
      //нужно сделать только синхронизацию новых данных
      this.getTableForSynchronization();
    }
  }

  structureDB(statusUrl): void{
    //метод получает структуру базы данных
    //rowid обязателен для каждой таблицы
    let url = "http://success-coach.ru/modules/start/?START="+statusUrl+"&USERID="+this.userGoogle['userId'];

    this.http.get(url, {}, {})
    .then(data => {
      let dataJson = JSON.parse(data.data);
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
    //метод создает все необходимые таблицы в базе данных
    //и заполняет необходимыми данными таблицы

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
        this.getTableForSynchronization();
      })
      .catch(() => { 
        //Создаю новую таблицу    
        this.db.executeSql("CREATE TABLE IF NOT EXISTS '"+name+"' ("+createSQl+")", [])
        .then(() => {
          if(url){
            //Получаю данные для заполнения таблиц
            this.http.get(url+'?START='+statusUrl+'&USERID='+this.userGoogle.userId, {}, {})
            .then(data => {              
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

  getTableForSynchronization(){
    //получаю имена таблиц в базе данных 
    //для синхронизации
    this.db.executeSql("SELECT * FROM sqlite_master  where type = 'table' ", [])
    .then(objTable => {
      let nameTable: string;
      for(var iElem=0; iElem<objTable.rows.length; iElem++) {  
        nameTable = objTable.rows.item(iElem)['name'];  
        this.getTablefildsForSynchronization(nameTable);
      }
    });
  }

  getTablefildsForSynchronization(nameTable){
    //получаю не синхронизированные поля
    //и отправляю их на синхронизацию
    let option =" WHERE clone=1";
    this.getDataAll(nameTable, option)
    .then(dataRow => {         
      if(dataRow.rows.length>0) { 
        let arDataSync: any = [];
        for(var iFil=0; iFil<dataRow.rows.length; iFil++) { 
          arDataSync.push(dataRow.rows.item(iFil));  
        }
        this.synchronizationDataServer(nameTable, arDataSync);     
      }
    });    
  }



  synchronizationDataServer(moduleName, arData){
    //сохраниение удалление изменение данных на удаленном сервере
    let url = "http://success-coach.ru/modules/"+moduleName+"/?START=UPDATE";
    
    let obj: any = {
      userId: this.userGoogle.userId,
      data: arData
    };

    let headers = {
      'Content-Type': 'application/json'
    };


    this.http.post(url, obj, headers)
    .then(data => {     
      console.log(data); 
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
    //Универсальный метод добавления
    //новых записей в таблиы 
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


  deleteAll(nameTable){
    //удаление переданной таблицы
    if(this.platform == 'cordova'){
      if (this.isOpen) {
        return this.db.executeSql('DELETE FROM '+nameTable, []); 
      }
    } else {
      console.log('Удаление всех данных из таблицы');
    }
  }
  
}