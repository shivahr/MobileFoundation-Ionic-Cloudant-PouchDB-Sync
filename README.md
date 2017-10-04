# MobileFirst-Ionic-GettingStarted

## Steps
1. [Setup Ionic and MFP CLI](#step-1-setup-ionic-and-mfp-cli)
2. [Create Ionic Sample Application](#step-2-create-ionic-sample-application)
  - 2.1 [Create a new Ionic project](#21-create-a-new-ionic-project)
  - 2.2 [Start a local dev server for app dev/testing](#22-start-a-local-dev-server-for-app-devtesting)
  - 2.3 [Update application to display a list of people](#23-update-application-to-display-a-list-of-people)
  - 2.4 [Run application on Android phone](#24-run-application-on-android-phone)
3. [Create an Adapter in MobileFirst Server to fetch data from Cloudant database](#step-3-create-an-adapter-in-mobilefirst-server-to-fetch-data-from-cloudant-database)
  - 3.1 [Create Cloudant database and populate with people data](#31-create-cloudant-database-and-populate-with-people-data)
  - 3.2 [Create Bluemix Mobile Foundation service and configure MFP CLI](#32-create-bluemix-mobile-foundation-service-and-configure-mfp-cli)
  - 3.3 [Create an MFP adapter to query people data](#33-create-an-mfp-adapter-to-query-people-data)
4. [Update Ionic app to fetch data from MobileFirst Adapter](#step-4-update-ionic-app-to-fetch-data-from-mobilefirst-adapter)

## Step 1. Setup Ionic and MFP CLI
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

* Install Atom (IDE for JavaScript)

  Install TypeScript plugin for Atom
```
apm install atom-typescript
```

* Install Google Chrome

Note: If you are on Windows, instead of using sudo, run the above commands in a command prompt opened in administrative mode.

## Step 2. Create Ionic Sample Application

Ionic quick tutorials:
* 10 Minutes with Ionic 2: Hello World http://blog.ionic.io/10-minutes-with-ionic-2-hello-world/
* 10 Minutes with Ionic 2: Adding Pages and Navigation http://blog.ionic.io/10-minutes-with-ionic-2-adding-pages-and-navigation/
* 10 Minutes with Ionic 2: Calling an API http://blog.ionic.io/10-minutes-with-ionic-2-calling-an-api/
* 10 Minutes with Ionic 2: Using the Camera with Ionic Native http://blog.ionic.io/10-minutes-with-ionic-2-using-the-camera-with-ionic-native/

### 2.1 Create a new Ionic project

Create a new Ionic project with blank starter template
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

### 2.2 Start a local dev server for app dev/testing

To get a preview of the application, Ionic/Cordova provides a feature by the which the application can be launched in a browser by using the `cordova serve` or `ionic serve` as shown below:
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

The above command also launches the Cordova [live-reload](https://www.npmjs.com/package/cordova-plugin-browsersync) workflow. The live-reload feature watches for changes in your source files and automatically builds the project and reloads the application in browser.

Since the `ionic serve` command continues to run in foreground, to be able to run any further Cordova/Ionic commands open a new terminal and change directory to the project.

### 2.3 Update application to display a list of people 

Let us update the application to [display a list of people](http://blog.ionic.io/10-minutes-with-ionic-2-calling-an-api/) by fetching data from say https://randomuser.me/api/

#### 2.3.1 Create a new Provider

```
$ ionic generate provider PeopleService
[OK] Generated a provider named PeopleService!
```

The above command will generate an `@Injectable` class called `PeopleServiceProvider` in `src/providers/people-service/people-service.ts`

#### 2.3.2 Add code in provider to get people data from https://randomuser.me/api/

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

#### 2.3.3 Add the HttpModule to your app.module.ts

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

#### 2.3.4 Modify home page to display the list of people

  - Update `src/pages/home/home.ts` as below:

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

  - Update `src/pages/home/home.html` as below:

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

#### 2.3.5 Preview new app

Once you save all the above changes, back in console where `ionic serve` is running, you can see an automatic build being run as shown below:

```
...
[17:20:29]  lint finished in 7.28 s 
[17:27:00]  build started ... 
[17:27:00]  deeplinks update started ... 
[17:27:00]  deeplinks update finished in 9 ms 
[17:27:00]  transpile started ... 
[17:27:03]  transpile finished in 2.26 s 
[17:27:03]  webpack update started ... 
[17:27:04]  webpack update finished in 1.66 s 
[17:27:04]  sass update started ... 
[17:27:08]  sass update finished in 3.30 s 
[17:27:08]  build finished in 7.26 s 
```

The app being previewed in browser is reloaded as shown below:

<img src="doc/source/images/PreviewAppInBrowser.png" alt="Preview app in browser using cordova serve" width="300" border="10" />

### 2.4 Run application on Android phone

#### 2.4.1 Install Android Studio and Android SDK platform
* Download and install Android Studio from https://developer.android.com/studio/index.html
* Install Android SDK Platform 23 (or higher)
  - Launch Android Studio.
  - Click on *Configure* -> *SDK Manager*
  - Under *SDK Platforms*, select *Android 6.0 (Marshmallow) API Level 23*. Click *Apply* and then click *OK*. This will install Android SDK Platform on your machine.
 
#### 2.4.2 Enable developer options and USB debugging on your Android phone
* Enable USB debugging on your Android phone as per the steps in https://developer.android.com/studio/debug/dev-options.html
  - Launch the Settings app on your phone. Select *About Device* -> *Software Info* . Tap *Build number* 7 times to enable developer options.
  - Return to Settings list. Select *Developer options* and enable *USB debugging*.
* If you are developing on Windows, then you need to install the appropriate USB driver as per instructions in https://developer.android.com/studio/run/oem-usb.html.
* Connect the Android phone to your development machine by USB cable, and accept *allow* access on your phone.

#### 2.4.3 Enable Android platform for Ionic application

* Add Cordova platform for Android
```
$ ionic cordova platform add android@6
> cordova platform add android@6 --save
✔ Running command - done!
```

  Note: Make sure the Cordova platform version being added is supported by the MobileFirst plug-ins. Site https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/application-development/sdk/cordova/ lists the supported levels.
```
$ cordova platform version
Installed platforms:
  android 6.3.0
Available platforms: 
  blackberry10 ~3.8.0 (deprecated)
  browser ~4.1.0
  ios ~4.4.0
  osx ~4.0.1
  webos ~3.7.0
```

#### 2.4.4 Build/Run the Ionic application on Android phone

* Build Android application
```
$ ionic cordova build android
```

* Run application on Android device
```
$ ionic cordova run android
```

<img src="doc/source/images/SampleIonicAppRunningOnAndroid.png" alt="Snapshot of app running on Android device" width="240" border="10" />

## Step 3. Create an Adapter in MobileFirst Server to fetch data from Cloudant database

### 3.1 Create Cloudant database and populate with people data

* Log in to [Bluemix Dashboard](https://console.bluemix.net/) and create [*Cloudant NoSQL DB*](https://console.bluemix.net/catalog/services/cloudant-nosql-db) service.
* From the welcome page of Cloudant service that you just created, launch the Cloudant Dashboard.
* In the Cloudant dashboard, click on *Databases*.
* Click on *Create Database*. Specify name of database as `employees` as shown below. Click *Create*.

<img src="doc/source/images/CreateCloudantDatabase.png" alt="Preview app in browser using cordova serve" width="800" border="10" />

Once the database is created, the dashboard will update to show the documents inside `employees` database (which, as expected, will be empty to begin with).

* Click *Create Document*. Under document content, after the auto populated `_id` field, enter `name`, `email` and `picture` information fetched from https://randomuser.me/api/?results=10 as shown below.

```
{
  "_id": "7fc63023799dfda9582609e75127b4fa",
  "gender": "female",
  "name": {
    "title": "mademoiselle",
    "first": "eloane",
    "last": "barbier"
  },
  "email": "eloane.barbier@example.com",
  "picture": {
    "large": "https://randomuser.me/api/portraits/women/61.jpg",
    "medium": "https://randomuser.me/api/portraits/med/women/61.jpg",
    "thumbnail": "https://randomuser.me/api/portraits/thumb/women/61.jpg"
  }
}
```

Click *Create Document* to create/save the document.

* Repeat the above steps and create documents for the remaining user data.

### 3.2 Create Bluemix Mobile Foundation service and configure MFP CLI
* Log in to [Bluemix Dashboard](https://console.bluemix.net/) and create [*Mobile Foundation*](https://console.bluemix.net/catalog/services/mobile-foundation) service. Make a note of the admin password.

* Back on your local machine, configure MFP CLI to work with Bluemix Mobile Foundation server by running following command in console.

```
$ mfpdev server add
? Enter the name of the new server profile: Bluemix-MFP
? Enter the fully qualified URL of this server: https://mobilefoundation-71-hb-server.mybluemix.net:443
? Enter the MobileFirst Server administrator login ID: admin
? Enter the MobileFirst Server administrator password: **********
? Save the administrator password for this server?: Yes
? Enter the context root of the MobileFirst administration services: mfpadmin
? Enter the MobileFirst Server connection timeout in seconds: 30
? Make this server the default?: No
Verifying server configuration...
The following runtimes are currently installed on this server: mfp
Server profile 'Bluemix-MFP' added successfully.

$ mfpdev server info
Name         URL
--------------------------------------------------------------------------------------
Bluemix-MFP  https://mobilefoundation-71-hb-server.mybluemix.net:443        [Default]
--------------------------------------------------------------------------------------
```

### 3.3 Create an MFP adapter to query people data

#### 3.3.1 Create an MFP adapter of type HTTP

Use MFP CLI to create an MFP adapter of type HTTP as shown below.

```
$ cd ..
$ mfpdev adapter create
? Enter adapter name: peopleAdapter
? Select adapter type: HTTP
? Enter group ID: com.mfp.adapters
Creating http adapter: peopleAdapter...
Successfully created adapter: peopleAdapter
```

Change directory to the newly created adapter source.

#### 3.3.2 Point the created adapter to your Cloudant service instance


Update `src/main/adapter-resources/adapter.xml` as below. Change domain, username and password to point to your Cloudant service:

```
<?xml version="1.0" encoding="UTF-8"?>
<mfp:adapter name="peopleAdapter"
			 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			 xmlns:mfp="http://www.ibm.com/mfp/integration"
			 xmlns:http="http://www.ibm.com/mfp/integration/http">

  <displayName>peopleAdapter</displayName>
  <description>peopleAdapter</description>
  <connectivity>
    <connectionPolicy xsi:type="http:HTTPConnectionPolicyType">
      <protocol>https</protocol>
      <domain>YourCloudantDomain-bluemix.cloudant.com</domain>
      <port>443</port>
      <connectionTimeoutInMilliseconds>30000</connectionTimeoutInMilliseconds>
      <socketTimeoutInMilliseconds>30000</socketTimeoutInMilliseconds>
      <authentication>
        <basic/>
          <serverIdentity>
            <username>YourCloudantUsername</username>
            <password>YourCloudantPassword</password>
          </serverIdentity>
      </authentication>
      <maxConcurrentConnectionsPerNode>50</maxConcurrentConnectionsPerNode>
    </connectionPolicy>
  </connectivity>
  <procedure name="getPeople" scope = "restrictedData"/>
</mfp:adapter>
```

  How to get the domain, username and password for your Cloudant service instance?

  - In Bluemix Dashboard, under *Services*, click on your Cloudant service instance. 
  - In the Cloudant service overview page, click on *Service credentials* and then click on *View Credentials* as shown below.

  <img src="doc/source/images/GettingCloudantCredentials.png" alt="Getting Cloudant service credentials" width="800" border="10" />

  - Use the *host* value for *domain*.

#### 3.3.3 Write adapter method to read data from Cloudant database

Update `js/peopleAdapter-impl.js` as below:

```
function getPeople() {
    var path = 'employees' + '/_all_docs?include_docs=true';
    var input = {
        method : 'get',
        returnedContentType : 'json',
        path : path,
    };
    var response = MFP.Server.invokeHttp(input);
    if (!response.rows) {
        response.isSuccessful = false;
        return response;
    } else {
        var results = [];
        for (var i=0; i < response.rows.length; i++) {
            results.push(response.rows[i].doc);
        }
        return {'rows': results};
    }
}
```

#### 3.3.4 Build and Deploy the MFP adapter

```
$ cd peopleAdapter/
$ mfpdev adapter build
Building adapter...
Successfully built adapter
$ mfpdev adapter deploy
Verifying server configuration...
Deploying adapter to runtime mfp on https://mobilefoundation-71-hb-server.mybluemix.net:443/mfpadmin...
Successfully deployed adapter
```

#### 3.3.5 Test the newly created MFP adapter

* Create credentials to test Adapter REST API
  - MobileFirst Operations Console -> Runtime Settings -> Confidential Clients -> New
  - ID: test, Secret: test, Allowed Scope: **
 
* Test Adapter REST API
  - MobileFirst Operations Console -> Adapters -> peopleAdapter -> Resources -> View Swagger Docs
  - Show/Hide -> /getPeople -> Click on OFF to enable authentication -> Select Default Scope -> Click Authorize
  - Click *try it out*

  <img src="doc/source/images/SwaggerToolsForTestingMobileFirstAdapter.png" alt="Swagger UI for testing MobileFirst Adapters" width="800" border="10" />

## Step 4. Update Ionic app to fetch data from MobileFirst Adapter
