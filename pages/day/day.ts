import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Modal, ModalController, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';


@IonicPage(
	name: 'DayPage'
	)
@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {
  public platform: string;
  public heightPlaner: number = 300;
  public hour: number = this.heightPlaner/24;
  public minute: number = this.heightPlaner/(24*60);
  public lineThickness: number = 0.2;
  public date: string;

  public timePlaner: any;
  public arrTasks: any = [];
  public arrStandartTask: any = [];
  public currentTimeLiner: number;
  public tileDay: string;
  public titleNameDey: string;

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
    var dd = String(d.getDate());
    var mm = String(d.getMonth() + 1);
    var yy = d.getFullYear();
    if(String(mm).length == 1 ){
      mm = "0"+String(mm);
    }

    if(String(dd).length == 1 ){
      dd = "0"+String(dd);
    }

    this.date = String(yy)+String(mm)+String(dd);

    this.standartTask(); //Получение ежедневных (статических) дел
    //this.getDataSectionAll();
    this.currentTime();
    this.titleNameDey = 'Сегодня';
    this.tileDay = String(dd)+'.'+String(mm)+'.'+String(yy)+' '+this.getWeekDay(d);
    
  }

  doClick(){
    this.menuCtrl.toggle();   
  }

  ionViewDidLeave(){
    //this.navCtrl.pop();
  }

  standartTask(){
    this.arrTasks = [];
    var items: any = [];

    if(this.platform == 'cordova'){

      let option = ' WHERE del<>1 ';
      this.database.getDataAll('deystandart', option)
      .then(res => {
        if(res.rows.length>0) {           
          for(var i=0; i<res.rows.length; i++) {   
              items.push({
                      rowid: "-"+res.rows.item(i).rowid,
                      name: res.rows.item(i).name,
                      description: res.rows.item(i).description,
                      timeStart: res.rows.item(i).timeStart,
                      timeFinish: res.rows.item(i).timeFinish,
                      status: res.rows.item(i).alarmСlock,
                      exercises: JSON.parse(res.rows.item(i).exercises),
                      module: "deystandart"
                    });
          }          
          for(var i=0; i< this.arrStandartTask.length; i++){
              items.push(this.arrStandartTask[i]);
          }
          //this.getTasks(items);  
        } else {
          this.arrTasks = [];
        }  

        this.getDataSectionAll(items);//Получение пользовательских динамических дел       
      });     
    } else {
      items = [
        {rowid: 10001, name: 'Пробуждение Чемпиона', description: '', date: '', timeStart: 360, timeFinish: 540, status: 'main_morning' },
        {rowid: 10002, name: 'Выгодные переговоры!', description: '', date: '', timeStart: 540, timeFinish: 600, status: 'main_morning' },
        {rowid: 10003, name: 'Четкое собрание!', description: '', date: '', timeStart: 600, timeFinish: 780, status: 'main_morning' },
        {rowid: 10004, name: 'Приятный обед', description: '', date: '', timeStart: 780, timeFinish: 840, status: 'main_morning' },
        {rowid: 10005, name: 'Эффективная встреча', description: '', date: '', timeStart: 840, timeFinish: 900, status: 'main_morning' },
        {rowid: 10006, name: 'Собрание Победителей', description: '', date: '', timeStart: 900, timeFinish: 1020, status: 'main_morning' },
        {rowid: 10007, name: 'Расслабление после Успешного дня! (окончание рабочего дня)', description: '', date: '', timeStart: 1020, timeFinish: 1080, status: 'main_morning' },
        {rowid: 10008, name: 'Тренировка Чемпиона (спорт)', description: '', date: '', timeStart: 1080, timeFinish: 1170, status: 'main_morning' },
        {rowid: 10009, name: 'Радостное время с семьей!', description: '', date: '', timeStart: 1170, timeFinish: 1290, status: 'main_morning' },
        {rowid: 10010, name: 'Планирование следующего Великого дня!', description: '', date: '', timeStart: 1290, timeFinish: 1320, status: 'main_morning' },
        {rowid: 10011, name: 'Счастливый Сон Героя!', description: '', date: '', timeStart: 1320, timeFinish: 1440, status: 'main_morning' }
      ];

      this.getDataSectionAll(items);//Получение пользовательских динамических дел
    }
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
    let pagesHtml = document.querySelectorAll(".scroll_region");
    let hoursPX = pagesHtml[pagesHtml.length-1].clientHeight/24;
    pagesHtml[pagesHtml.length-1].scrollTop=hoursPX*(hh*2);
  }

  getDataSectionAll(items:any=[] ) {   
    this.arrTasks = [];
    //var items: any = [];

    if(this.platform == 'cordova'){
      let option = ' WHERE date='+this.date+' AND del<>1 ';
      this.database.getDataAll('daygr', option)
      .then(res => {
        if(res.rows.length>0) { 
          
          for(var i=0; i<res.rows.length; i++) {          
              items.push({
                      rowid: res.rows.item(i).rowid,
                      name: res.rows.item(i).name,
                      description: res.rows.item(i).description,
                      date: res.rows.item(i).date,
                      timeStart: res.rows.item(i).timeStart,
                      timeFinish: res.rows.item(i).timeFinish,
                      status: res.rows.item(i).status,
                      module: "daygr"
                    });
          }          
          for(var i=0; i< this.arrStandartTask.length; i++){
            items.push(this.arrStandartTask[i]);
          } 
        } else if(this.arrStandartTask.length) {
          this.arrTasks = [];
        }       
        this.getTasks(items);   
        console.log(items);
      });
    } else {
      //тестовые данные(без БД)
      items = [        
        {rowid: 0, name: "тест2", description: "", timeStart: 750, timeFinish: 890, height: 0, module: "daygr" },
        {rowid: 1, name: "тест3", description: "", timeStart: 700, timeFinish: 950, height: 0, module: "daygr" },   
        {rowid: 2, name: "тест1", description: "Очень нужная и важная задача нужно ее объязательно выполнить", timeStart: 900, timeFinish: 1000, height: 0, module: "daygr" },     
        {rowid: 3, name: "Баеньки хочет чемпион", description: "", timeStart: 940, timeFinish: 1020, height: 0, module: "daygr" },
        {rowid: 4, name: "Обед чемпиона", description: "", timeStart: 660, timeFinish: 720, height: 0, module: "daygr" },
        {rowid: 5, name: "Задача", description: "", timeStart: 840, timeFinish: 850, height: 0, module: "daygr" },
        {rowid: 6, name: "тестовя задача", description: "", timeStart: 840, timeFinish: 950, height: 0, module: "daygr" },
        {rowid: 7, name: "тест2", description: "", timeStart: 750, timeFinish: 890, height: 0, module: "daygr" },
        {rowid: 8, name: "тест3", description: "", timeStart: 700, timeFinish: 950, height: 0, module: "daygr" },   
        {rowid: 9, name: "тест1", description: "Очень нужная и важная задача нужно ее объязательно выполнить", timeStart: 900, timeFinish: 1000, height: 0, module: "daygr" },     
        {rowid: 10, name: "Баеньки хочет чемпион", description: "", timeStart: 940, timeFinish: 1020, height: 0, module: "daygr" },
        {rowid: 11, name: "Обед чемпиона", description: "", timeStart: 660, timeFinish: 720, height: 0, module: "daygr" },
        {rowid: 12, name: "Задача", description: "", timeStart: 840, timeFinish: 850, height: 0, module: "daygr" },
        {rowid: 13, name: "тестовя задача", description: "", timeStart: 840, timeFinish: 950, height: 0, module: "daygr" },
      ];

      for(var i=0; i< this.arrStandartTask.length; i++){
        items.push(this.arrStandartTask[i]);
      }
      //подготовка массива для визуального вывода      
      this.getTasks(items);     
    }  
  }

  getTasks(data){

    //преобразование минут в высоту
    let result: any = [];
    let min: number = 1440;

    for(let i=0; i<data.length; i++){
      if(min > data[i].timeStart){
        min = data[i].timeStart;
      }
      data[i].timeStartMin = data[i].timeStart;
      data[i].timeFinishMin = data[i].timeFinish;
      data[i].timeStart = data[i].timeStart*this.minute;
      data[i].timeFinish = data[i].timeFinish*this.minute;
      data[i].height = data[i].timeFinish - data[i].timeStart;  
      result.push(data[i]);      
    }

    this.distributorBlock(result);
  }

  distributorBlock(data){
    //распределение задач по блокам  
    //верменный массив 
    let intermediate: any = [];
    
    let intermediateObj: any = {};

    intermediate.push([]);
    data[0].colspan = 0;

    intermediate[0].push(data[0]);
    intermediateObj[data[0].rowid] = data[0];
    
    for(let one=1; one<data.length; one++){     

      let colspan = this.distributorBlock_colspan(intermediate, data[one]);

      if(!intermediate[colspan]){
        intermediate[colspan] = [];
      }
      data[one].colspan = colspan;   
      intermediate[colspan].push(data[one]);    
      intermediateObj[data[one].rowid] = data[one];       
    }

    for(let one=0; one<data.length; one++){
      data[one].neighborsAll = this.distributorBlock_serchNeighbors(data, data[one]);
    }

    //нужно получит максимальное количество вложенных элементов
    for(let  one in intermediateObj){
      let count = intermediateObj[one].neighborsAll.length;
      for(let neighborsElementIndex in intermediateObj[one].neighborsAll){
        var neighborsElement = intermediateObj[intermediateObj[one].neighborsAll[neighborsElementIndex]];
        if (neighborsElement.neighborsAll.length>count) {count = neighborsElement.neighborsAll.length}
      }
      intermediateObj[one].countWidth = 96/(count+1);  
      intermediateObj[one].left = intermediateObj[one].countWidth*intermediateObj[one].colspan;    
      this.arrTasks.push(intermediateObj[one]);
    }
    //console.log(intermediateObj);
  }


  distributorBlock_colspan(data, element){
    let colspan = 0;   
    let heightCompare = 0;
    for(let one in data){  
      let flag = false;
      for(let two in data[one]){        
        if(data[one][two].timeStart > element.timeStart){
          heightCompare = element.timeFinish - element.timeStart;
        } else {
          heightCompare = data[one][two].timeFinish - data[one][two].timeStart;
        }

        if(
          (Math.abs(data[one][two].timeStart - element.timeStart) < heightCompare) &&
          element.rowid != data[one][two].rowid
        ){    
          //проверка соседних задач на пересечение          
          flag = true;
        } 
      }
      if(!flag){
        return colspan; 
      } else {
        colspan++;
      }
    }
    return colspan;
  }

  distributorBlock_serchNeighbors(data, element ){
    let neighbors: any = [];
    let arNeighborsCompare: any = {};
    let heightCompare = 0;
    for(let one in data){ 

      if(data[one].timeStart > element.timeStart){
        heightCompare = element.timeFinish - element.timeStart;
      } else {
        heightCompare = data[one].timeFinish - data[one].timeStart;
      }

      if(
        (Math.abs(data[one].timeStart - element.timeStart) < heightCompare) &&
          element.rowid != data[one].rowid
        ){
        //проверка соседних задач на пересечение
        
        if(arNeighborsCompare[data[one].colspan] == undefined  ){
            neighbors.push(data[one].rowid);
            arNeighborsCompare[data[one].colspan] = data[one].colspan;
        }
      }
    } 
    return neighbors;    
  }



  addTaskDay(){
    //открытие модального окна для длбавление дел   

    let newTask: Modal  = this.modalCtrl.create('ModalTaskUserDayPage', {date: this.date, task: ''});
    newTask.present();
      
    newTask.onDidDismiss((data)=>{
      if(data){
        if(data.new == 'create'){
          this.addTaskBase(data);
        }
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
      date: Number(this.date),
      timeStart: increased.timeStart,
      timeFinish: increased.timeFinish,
      status: ''
    };

    console.log(objSet.date);

    this.database.insertDataTables('daygr', [objSet.name, objSet.description, objSet.date, objSet.timeStart, objSet.timeFinish, objSet.status, 1, 0  ])
      .then((data) => {
        this.standartTask();
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

    let text: string;
    if(this.date == String(yy)+String(mm)+String(dd)){
      this.titleNameDey = 'Сегодня';
      this.tileDay = String(obj.day)+'.'+String(obj.month)+'.'+String(obj.year)+' '+this.getWeekDay(date);
    } else if(this.date == String(yy)+String(mm)+String(dd+1)){
      this.titleNameDey = 'Завтра';
      this.tileDay = String(obj.day)+'.'+String(obj.month)+'.'+String(obj.year)+' '+this.getWeekDay(date);
    } else {
      this.titleNameDey = String(obj.day)+'.'+String(obj.month)+'.'+String(obj.year)+' '+this.getWeekDay(date);
      this.tileDay = '';
    }   
    this.standartTask();
  }

  findParentElement (el, cls) {
    //поиск родительского класса
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  getWeekDay(date) {
    var days = ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Субота'];
    return days[date.getDay()];
  }

  modalSeeTask(task){  
    let newTask: Modal  = this.modalCtrl.create('ModalTaskSeeDayPage', {task: task});
    newTask.present();

      
    newTask.onDidDismiss((data)=>{
      console.log(data);
      if(data == 'delete'){
        this.deleteTask(task);
      } else if(data == 'edit') {
        this.updateTaskDay(task);
      }      
    });
  }


  modalStaticSeeTask(task){
    //модальное окно для просмотра статических задач
    let newTask: Modal  = this.modalCtrl.create('ModalStaticTaskDayPage', {task: task});
    newTask.present();
      
    newTask.onDidDismiss((data)=>{
      if(data == 'viewTraining'){
        this.viewTraining();
      } 
    });
  }

  viewTraining(){
    //модальное окно для просмотра статических задач

    var playlist: any = [
      {"url":"http://success-coach.ru/modules/workout/1_r.gif", "name": "Упражнение лыжник", "count": 20, "timeout": 2000},
      {"url":"http://success-coach.ru/modules/workout/2_r.gif", "name": "Упражнение дыхание", "count": 5, "timeout": 2000},          
    ];

    let newTask: Modal  = this.modalCtrl.create('ViewTrainingPage', {"exercises": playlist});
    newTask.present();
    
    /*newTask.onDidDismiss((data)=>{
      if(data == 'viewTraining'){
        this.viewTraining();
      } 
    });*/

  }

  deleteTask(indexObj){
    //this.database.deleteElementTable('daygr', indexObj.rowid);

    this.database.updateElementTable(
        'daygr', 
        indexObj.rowid,  
        "clone=1, del=1",
      );

    this.standartTask();
  }


  updateTaskDay(task){
    //открытие модального окна для длбавление дел   

    let newTask: Modal  = this.modalCtrl.create('ModalTaskUserDayPage', {date: this.date, task: task});
    newTask.present();
      
    newTask.onDidDismiss((data)=>{
      if(data){               
        if(data.new == 'update'){
          this.editTask(data);
          this.standartTask();
        }
      } else {
        console.log('error');
      }      
    });
  }


  editTask(data){    
    this.database.updateElementTable(
        'daygr', 
        data.rowid,  
        "name='"+data.name+"', description='"+data.description+"', timeStart='"+data.timeStart+"', timeFinish='"+data.timeFinish+"', clone=1, del=0",
      );
  }

}
