import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class SynchronizationProvider {

	public platform: string;
	public userGoogle: any;

	constructor(
		public plt: Platform,
		private googlePlus: GooglePlus,
		public database: DatabaseProvider,
		private http: HTTP
	) {
		if(plt.is('cordova')){
	  		//если телефон
	  		this.platform = 'cordova';
	  	}
	}

	connectGoogle(){
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
		    	this.connectDatabase();
		    })
		    .catch(error => {
		      console.log(error);
		      
		});
	}

	connectDatabase(){
		if (!this.database.isOpen) {
			this.database.connectionDataBase();
		}

	}

	synchronizationDataServer(moduleName, arData){
		//сохраниение удалление изменение данных на удаленном сервере
		console.log(arData);
	}

}
