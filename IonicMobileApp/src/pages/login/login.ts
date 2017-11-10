import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';
import { PeopleServiceProvider } from '../../providers/people-service/people-service';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  form;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private authHandler:AuthHandlerProvider, private peopleServiceProvider:PeopleServiceProvider, private network: Network) {
    console.log('--> LoginPage constructor() called');

    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setCallbacks(
      () =>  {
        // online login success call back
        let view = this.navCtrl.getActive();
        if (!(view.instance instanceof HomePage )) {
          this.navCtrl.setRoot(HomePage);
        }
        this.authHandler.storeCredentialsInJSONStore(this.form.value.username, this.form.value.password);
        this.peopleServiceProvider.setupDBSync();
      }, (error) => {
        if (error.failure !== null) {
          this.showAlert(error.failure);
        } else {
          this.showAlert("Failed to login.");
        }
      }, () => {
        // this.navCtrl.setRoot(Login);
      });
  }

  processForm() {
    // Reference: https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/inputs/basic/pages.ts
    let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "" || password === "") {
      this.showAlert('Username and password are required');
      return;
    }
    if (this.hasNetworkConnection()) {
      console.log('--> Online sign-in with user: ', username);
      this.authHandler.login(username, password);
    } else {
      console.log('--> Offline sign-in with user: ', username);
      this.authHandler.offlineLogin(username, password, () => {
        // offline login success call back
        let view = this.navCtrl.getActive();
        if (!(view.instance instanceof HomePage )) {
          this.navCtrl.setRoot(HomePage);
        }
        this.peopleServiceProvider.setupDBSync();
      }, (error) => {
        this.showAlert(error.failure);
      });
    }
  }

  hasNetworkConnection() {
    // https://ionicframework.com/docs/native/network/
    return this.network.type !== 'none';
  }

  showAlert(alertMessage) {
    let prompt = this.alertCtrl.create({
      title: 'Login Failure',
      message: alertMessage,
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });
    prompt.present();
  }

  ionViewDidLoad() {
    console.log('--> LoginPage ionViewDidLoad() called');
  }

}
