import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class LocalpushProvider {

  constructor(
      public http: HttpClient,
      private localNotifications: LocalNotifications
    ) {
    console.log('Hello LocalpushProvider Provider');
  }

  push(){
    this.localNotifications.schedule({
      text: 'Delayed ILocalNotification',
      trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
    });
  }


}
