# MobileFirst-Ionic-GettingStarted

## Setup Ionic and MFP CLI
* Install Node.js by downloading the setup from https://nodejs.org/en/ (Node.js 6.x or above)
```
$ node --version
v8.6.0
```

* Install Cordova
```
$ sudo npm install -g cordova
$ cordova --version
7.0.1
```

* Install Ionic
```
$ sudo npm install -g ionic
$ ionic --version
3.12.0
```

* Install IBM MobileFirst Platform CLI
```
$ sudo npm install -g mfpdev-cli
$ mfpdev --version
8.0.0-2017091111
```

* Install GIT https://git-scm.com/downloads
```
$ git --version
git version 2.9.3 ...
```

* Install Maven:
```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install maven
$ mvn --version
Apache Maven 3.5.0 ...
```

* Install Java SDK
```
$ java -version
java version "1.8.0_101"
```

* Install Android Studio
https://developer.android.com/studio/index.html
  - Once Android Studio is opened, click on "Configure" -> "SDK Manager" -> Select Android 6.0 (Marshmallow) API Level 3 -> OK
  - Connect Android phone to computer by USB cable.
  - On the mobile go to Settings -> About Phone -> On Build number, click 7 times to enable Developer mode.
  - On the mobile go to Settings -> Developer Options and select Enable USB Debugging.

* Install Atom (IDE for JavaScript)
Install TypeScript plugin for Atom
```
apm install atom-typescript
```

* Install Google Chrome

Note: If you are on Windows, instead of using sudo, run the above commands in a command prompt opened in administrative mode.

## Create Ionic Sample Application

Ionic quick tutorials:
* 10 Minutes with Ionic 2: Hello World http://blog.ionic.io/10-minutes-with-ionic-2-hello-world/
* 10 Minutes with Ionic 2: Adding Pages and Navigation http://blog.ionic.io/10-minutes-with-ionic-2-adding-pages-and-navigation/
* 10 Minutes with Ionic 2: Calling an API http://blog.ionic.io/10-minutes-with-ionic-2-calling-an-api/
* 10 Minutes with Ionic 2: Using the Camera with Ionic Native http://blog.ionic.io/10-minutes-with-ionic-2-using-the-camera-with-ionic-native/

### Create a new Ionic project with blank starter template
```
$ ionic start MobileFirst-Ionic-GettingStarted blank
✔ Creating directory ./MobileFirst-Ionic-GettingStarted - done!
[INFO] Fetching app base (https://github.com/ionic-team/ionic2-app-base/archive/master.tar.gz)
✔ Downloading - done!
[INFO] Fetching starter template blank 
       (https://github.com/ionic-team/ionic2-starter-blank/archive/master.tar.gz)
✔ Downloading - done!
✔ Updating package.json with app details - done!
✔ Creating configuration file ionic.config.json - done!
[INFO] Installing dependencies may take several minutes!
> npm install
✔ Running command - done!
> git init

? Connect this app to the Ionic Dashboard? No
> git add -A
> git commit -m "Initial commit" --no-gpg-sign

Next Steps:
Go to your newly created project: cd ./MobileFirst-Ionic-GettingStarted
$
```

Change directory to the newly created project:
```
$ cd MobileFirst-Ionic-GettingStarted
```

### Start a local dev server for app dev/testing
To see how the blank project looks like, Ionic/Cordova provides a feature by the which the application can be launched in a browser by using the `cordova serve` or `ionic serve` as shown below:
```
$ ionic serve
[INFO] Starting app-scripts server: --address 0.0.0.0 --port 8100 
       --livereload-port 35729 --dev-logger-port 53703 - Ctrl+C to cancel
[17:20:10]  watch started ... 
[17:20:10]  build dev started ... 
[17:20:10]  clean started ... 
[17:20:10]  clean finished in 1 ms 
[17:20:10]  copy started ... 
[17:20:10]  deeplinks started ... 
[17:20:10]  deeplinks finished in 22 ms 
[17:20:10]  transpile started ... 
[17:20:13]  transpile finished in 3.58 s 
[17:20:13]  preprocess started ... 
[17:20:14]  copy finished in 3.83 s 
[17:20:14]  preprocess finished in 185 ms 
[17:20:14]  webpack started ... 
[17:20:21]  webpack finished in 7.48 s 
[17:20:21]  sass started ... 
[17:20:22]  sass finished in 1.01 s 
[17:20:22]  postprocess started ... 
[17:20:22]  postprocess finished in 5 ms 
[17:20:22]  lint started ... 
[17:20:22]  build dev finished in 12.36 s 
[17:20:22]  watch ready in 12.42 s 
[17:20:22]  dev server running: http://localhost:8100/ 

[INFO] Development server running!
       Local: http://localhost:8100
       External: http://192.xxx.xxx.xxx:8100, http://9.xxx.xxx.xxx:8100
```

The above command also launches the Cordova [live-reload](https://www.npmjs.com/package/cordova-plugin-browsersync) workflow. The live-reload feature triggers an automatic project build and refresh of the application in browser whenever we save changes to the application source files.

Since the `ionic serve` command continues to run in foreground, to be able to run any further Cordova/Ionic commands open a new terminal and change directory to the project.

### Update application to display a list of people 

Add a provider class to get a list of people data from https://randomuser.me/api/

Create a new Provider
```
$ ionic generate provider PeopleService
[OK] Generated a provider named PeopleService!
```

The above command will generate an `@Injectable` class called `PeopleServiceProvider` in `src/providers/people-service/people-service.ts`

Update `src/providers/people-service/people-service.ts` as below:

<pre><code>
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PeopleServiceProvider {
<b>  data: any = null;</b>

  constructor(public http: Http) {
  }

<b>  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get('https://randomuser.me/api/?results=20')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data.results;
          resolve(this.data);
        });
    });
  }
</b>
}
</code></pre>

Add the HttpModule to your `src/app/app.module.ts` as shown below:

<pre><code>
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
<b>import { HttpModule } from '@angular/http';</b>
...
@NgModule({
  ...
  imports: [
    BrowserModule,
<b>    HttpModule,</b>
    IonicModule.forRoot(MyApp)
  ],
  ...
})
...
</code></pre>

Modify home page to display the list of people

Update `src/pages/home/home.ts` as below:
<pre><code>
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
<b>import { PeopleServiceProvider } from '../../providers/people-service/people-service';</b>

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'<b>,
  providers: [PeopleServiceProvider]</b>
})
export class HomePage {
  <b>people: any;</b>

  constructor(public navCtrl: NavController, public peopleServiceProvider: PeopleServiceProvider) {
    <b>this.peopleServiceProvider.load().then(data => {
      this.people = data;
    });</b>
  }

}
</code></pre>

Update `src/pages/home/home.html` as below:
```
<ion-header>
  <ion-navbar>
    <ion-title>
      Team members
    </ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>
  <ion-list>
    <ion-item *ngFor="let person of people">
      <ion-avatar item-left>
        <img src="{{person.picture.thumbnail}}">
      </ion-avatar>
      <h2>{{person.name.first}} {{person.name.last}}</h2>
      <p>{{person.email}}</p>
    </ion-item>
  </ion-list>
</ion-content>
```
 
