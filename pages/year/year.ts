import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { HTTP } from '@ionic-native/http';


@IonicPage({
  name: 'YearPage'
})
@Component({
  selector: 'page-year',
  templateUrl: 'year.html',
})
export class YearPage {
	public items: any = [];
  public menuobj: any = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private database: DatabaseProvider,
    public modalCtrl: ModalController,
    private http: HTTP
  	) {
  }


  ionViewDidLoad() { 
    this.menuobj = this.navParams.get('menu');
    console.log(this.menuobj); 
    this.getDataSectionAll();
  }



  gotoPage(url, id){
    this.navCtrl.push(url, {id: id});
  }

  getDataSectionAll() {  
    this.items = [];	
  	this.database.getDataAll('yeargr')    
    .then(res => {
  		if(res.rows.length>0) {   
  	    for(var i=0; i<res.rows.length; i++) {
          let obj = res.rows.item(i);
          this.database.getCountTask(obj.rowid)
          .then(con => {
            //console.log(con.rows.item(0));
            let countPerformed = 0;
            if(con.rows.item(0).countPerformed){
              countPerformed = con.rows.item(0).countPerformed;
            }
            this.items.push({rowid:obj.rowid,name:obj.name,ord:obj.ord,ico:obj.ico, count:con.rows.item(0).countTask, countPer:countPerformed });

          }).catch(error => {
            console.log('error');
            //items.push({rowid:obj.rowid,name:obj.name,ord:obj.ord,ico:obj.ico, con:'0' });
          });            
  		  }
  		}						
  	});

 
  }

  addGroup(){
    let objSet = {
      name: 'Тестовая строка',
      ord: '13',
      ico: ''
    };
    this.database.insertDataTables('yeargr', [objSet.name, objSet.ord, objSet.ico])
      .then((data) => {
        let objGet = {
          rowid: data['insertId'],
          name: objSet['name'],
          ord: objSet['ord'],
          ico: objSet['ico'],
        };
        this.items.push(objGet);  
        console.log(data['insertId']);
    });
  }

  addTask(){    
    let modal = document.getElementById('modaladdtask')
    modal.style.display="block";
    modal.className = "animated bounceInUp";
  }

  menu(){
    document.getElementById('modalmenu').style.display="block";
    document.getElementById('bgroundfull').style.display="block";

    let modal = document.getElementById('modalmenu');  
    modal.className = "animated slideInLeft";
  }

  dropTableSecond() {
  	this.database.dropTable('yeargr')
      .then(() => {
        console.log('ok');
        
      })
      .catch(error => {
        console.log('error');
      });
  	this.items = [];
  }

  onChanged(increased:any){
    //метод записывает в базу данных ответ из модального окна
    //записыват задачи в определенную группу
    let objSet = {
      idgroup: increased.idgroup,
      name: increased.name,
      description: increased.description,
      importance: '',
      startdate: '',
      finisshdate: '',
      status: ''
    };
    this.database.insertDataTables('yeardetailed', [objSet.idgroup, objSet.name, objSet.description, objSet.importance, objSet.startdate, objSet.finisshdate, objSet.status ])
      .then((data) => {
        this.getDataSectionAll();
    });
  }


}



