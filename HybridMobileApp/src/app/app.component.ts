import { Component , Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, renderer: Renderer) {
    console.log('--> MyApp constructor() called');

    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      console.log('--> MyApp mfpjsloaded');
      this.rootPage = HomePage;
    })

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('--> MyApp platform.ready() called');
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
