import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Modal, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Platform } from 'ionic-angular';

@IonicPage(
	name: 'DayPage'
	)
@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {
  public platform: string;
  public heightPlaner: number = 200;
  public hour: number = this.heightPlaner/24;
  public minute: number = this.heightPlaner/(24*60);
  public lineThickness: number = 0.2;
  public date: string;



  public timePlaner: any;
  public arrTasks: any = [];
  public currentTimeLiner: number;
  public tileDay: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public menuCtrl: MenuController,
    private database: DatabaseProvider,
    public plt: Platform,
    public modalCtrl: ModalController
  	) {
  	this.menuCtrl.close();
    if(plt.is('cordova')){
      //если телефон
      this.platform = 'cordova';
    }
  }

  ionViewDidLoad() {
    this.makePlanerBlank();

    var d = new Date();
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yy = d.getFullYear();
    this.date = String(yy)+String(mm)+String(dd);
    this.getDataSectionAll();
    this.currentTime();
    this.tileDay = 'Сегодня '+String(dd)+'.'+String(mm)+'.'+String(yy)+' '+this.getWeekDay(d);
  }

  doClick(){
    this.menuCtrl.toggle();
   
  }

  ionViewDidLeave(){
    //this.navCtrl.pop();
  }





  makePlanerBlank(){
    document.getElementById("timeDay").style.height = this.heightPlaner+"vh";
    document.getElementById("taskDay").style.height = this.heightPlaner+"vh";   
    this.getTimePlaner();
  }


  getTimePlaner(){
    this.timePlaner = [
      '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ];

  }

  

  currentTime(){
    var d = new Date();
    var hh = d.getHours();
    var i = d.getMinutes();

    this.currentTimeLiner = Number((hh*60+i)*this.minute);

    let hoursPX = document.querySelector(".scroll_region").clientHeight/24;
    document.querySelector(".scroll_region").scrollTop=hoursPX*(hh*2);
  }

  getDataSectionAll() {     
    if(this.platform == 'cordova'){
      let option = ' WHERE date='+this.date;
      this.database.getDataAll('daygr', option)
      .then(res => {
        if(res.rows.length>0) { 
          this.arrTasks = [];
          var items: any = [];
          for(var i=0; i<res.rows.length; i++) {          
              items.push({rowid:res.rows.item(i).rowid,
                      name:res.rows.item(i).name,
                      description:res.rows.item(i).description,
                      date:res.rows.item(i).date,
                      timeStart:res.rows.item(i).timeStart,
                      timeFinish:res.rows.item(i).timeFinish,
                      status:res.rows.item(i).status
                    });

          }
          this.getTasks(items);
          //console.log(this.getTasks);
        } else {
          this.arrTasks = [];
        }          
      });
    } else {
      let items = [
        {rowid: "", name: "Чаепитие чемпиона", description: "", timeStart: 840, timeFinish: 870, height: 0 },
        {rowid: "", name: "Зарядка чемпиона", description: "", timeStart: 480, timeFinish: 600, height: 0 },
        {rowid: "", name: "Баеньки чемпион хочет", description: "", timeStart: 900, timeFinish: 1020, height: 0 },
        {rowid: "", name: "Обед чемпиона", description: "", timeStart: 660, timeFinish: 720, height: 0 }
      ];
      this.getTasks(items);
    }


  }

  getTasks(data){
    let min: number = 1440;

    for(let i=0; i<data.length; i++){
      if(min > data[i].timeStart){
        min = data[i].timeStart;
      }
      data[i].timeStart = data[i].timeStart*this.minute;
      data[i].timeFinish = data[i].timeFinish*this.minute;
      data[i].height = data[i].timeFinish - data[i].timeStart;  
      this.arrTasks.push(data[i]);
    }
  }

  addTaskDay(){
    //открытие модального окна для длбавление дел   

    let newTask: Modal  = this.modalCtrl.create('ModalTaskUserDayPage', {date: this.date});
    newTask.present();
      
    newTask.onDidDismiss((data)=>{
      if(data){
        console.log(data);
        this.addTaskBase(data);
      } else {
        console.log('error');
      }      
    });
  }

  addTaskBase(increased:any){
    //метод записывает в базу данных ответ из модального окна
    //записыват задачи в определенную группу
    let objSet = {
      name: increased.name,
      description: increased.description,
      date: this.date,
      timeStart: increased.timeStart,
      timeFinish: increased.timeFinish,
      status: ''
    };
    this.database.insertDataTables('daygr', [objSet.name, objSet.description, objSet.date, objSet.timeStart, objSet.timeFinish, objSet.status  ])
      .then((data) => {
        this.getDataSectionAll();
    });
  }

  showModalCalendar(e){
    //Открытие календаря
    let mainElement = this.findParentElement (e.target, 'masters_template');
    let modal = mainElement.querySelector('.modalCalendar');
    modal.style.top = '2%';
    let blocker = mainElement.querySelector('.bloker');    
    blocker.style.width = '100%';
    //e.target.parentElement.nextElementSibling.style.height = "100%";
  }

  hiddeModalCalendar(e){
    //скртытие календаря swipe
    let mainElement = this.findParentElement (e.target, 'masters_template');
    let modalCalendar = this.findParentElement (e.target, 'modalCalendar');
    if(e.deltaY < -50){
      modalCalendar.style.top = "-80vh";
      let blocker = mainElement.querySelector('.bloker');    
      blocker.style.width = '0';
    }
  }

  hiddeModalCalendarClick(e){
    //скртытие календаря
    let mainElement = this.findParentElement (e.target, 'masters_template');
    let modal = mainElement.querySelector('.modalCalendar');
    modal.style.top = '-80vh';
    let blocker = mainElement.querySelector('.bloker');    
    blocker.style.width = '0';
  }

  selectDate(obj:any){
    //выбрали дату в календаре
    this.hiddeModalCalendarClick(obj.event);
    this.date = String(obj.year)+String(obj.month)+String(obj.day);   
    let date = new Date(obj.year,obj.month-1,obj.day);

    let d = new Date();
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let yy = d.getFullYear();

    let text: string = '';
    if(this.date == String(yy)+String(mm)+String(dd)){
      text = 'Сегодня ';
    } else if(this.date == String(yy)+String(mm)+String(dd+1)){
      text = 'Завтра ';
    }


    this.tileDay = text+String(obj.day)+'.'+String(obj.month)+'.'+String(obj.year)+' '+this.getWeekDay(date);
    this.getDataSectionAll();
  }

  findParentElement (el, cls) {
    //поиск родительского класса
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  getWeekDay(date) {
    var days = ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суботу'];
    return days[date.getDay()];
  }


}
