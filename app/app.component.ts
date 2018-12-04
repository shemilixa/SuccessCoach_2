import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StartPage } from '../pages/start/start';
import { DatabaseProvider } from '../providers/database/database';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = StartPage;
  pages:any = [
    {name: "Твой успешный день", component: "DayPage", active: 1},
    {name: "Твой успешный год", component: "YearPage", active: 1},
    {name: "Выход из стресса", component:"", active: 0},
    {name: "Вдохновение на день", component: "InspirationPage", active: 1},
    {name: "Бизнес решение", component: "", active: 0},
    {name: "Питание", component: "", active: 0},
    {name: "Общение", component: "", active: 0}
  ];

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public database: DatabaseProvider
  ) {   
    this.initializeApp();   
  }

  initializeApp(){
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      if (!this.database.isOpen) {
        this.database.connectionDataBase();
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  gotoPage(url){
    this.nav.push(url.component);
  }

}

