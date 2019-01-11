import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { StartPage } from '../pages/start/start';
import { DatabaseProvider } from '../providers/database/database';
import { GooglePlus } from '@ionic-native/google-plus';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { LocalpushProvider } from '../providers/localpush/localpush';


@NgModule({
  declarations: [
    MyApp,
    StartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    HTTP,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    LocalNotifications,
    LocalpushProvider
  ]
})
export class AppModule {}