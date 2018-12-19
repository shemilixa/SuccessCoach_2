import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { GooglePlus } from '@ionic-native/google-plus';

/*
  Generated class for the GoogleplusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleplusProvider {

	public platform: string;
	public userGoogle: any;

  	constructor(
  	  	public plt: Platform,
  	  	private googlePlus: GooglePlus,
    	private http: HTTP
  	) {

	  	if(plt.is('cordova')){
	  		//если телефон
	  		this.platform = 'cordova';
	  	}
	}

	connect(){
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
		      console.log(data);
		    })
		    .catch(error => {
		      console.log(error);
		      
		});
	}




    moduleOperationOnServer(module, operation, arData){
    	if(this.platform == 'cordova'){
		    let headers = {
		        'Content-Type': 'application/json'
		    };

		    let url = "http://success-coach.ru/modules/"+module+"/";
		    this.http.post(url, {user: this.userGoogle.userId, operation: operation, data: arData}, headers)
		    .then(data => {
		      console.log(data);
		    })
		    .catch(error => {
		      console.log(error);
		      
		    });
		}
  	}



}
