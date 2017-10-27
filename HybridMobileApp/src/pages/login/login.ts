import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';
import { PeopleServiceProvider } from '../../providers/people-service/people-service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  form;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private authHandler:AuthHandlerProvider, private peopleServiceProvider:PeopleServiceProvider) {
    console.log('--> LoginPage constructor() called');

    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setCallbacks(
      () =>  {
        let view = this.navCtrl.getActive();
        if (!(view.instance instanceof HomePage )) {
          this.navCtrl.setRoot(HomePage);
        }
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
    console.log('--> Sign-in with user: ', username);
    this.authHandler.login(username, password);
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
