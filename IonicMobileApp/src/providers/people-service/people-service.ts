/// <reference path="../../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class PeopleServiceProvider {
  data: any = null;
  db: any;
  zone: any;
  syncCalled = false;

  constructor() {
    console.log('--> PeopleServiceProvider constructor() called');
    this.db = new PouchDB('mytestdb');
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
      this.handleChange(change);
    });
  }

  setupDBSync() {
    if (this.syncCalled) {
      return;
    }
    this.syncCalled = true;
    console.log('--> PeopleServiceProvider setupDBSync() called');
    let dataRequest = new WLResourceRequest("/adapters/peopleAdapter/getCloudantCredentials", WLResourceRequest.GET);
    dataRequest.send().then(
      (response) => {
        let options = {
          live: true,
          retry: true,
          continuous: true,
          auth: {
            username: response.responseJSON.username,
            password: response.responseJSON.password
          }
        };
        this.db.sync(response.responseJSON.url, options);
        console.log('--> sync between PouchDB and Cloudant has been setup');
      }, (failure) => {
        console.log('--> failed to fetch DB credentials', failure);
      }
    )
  }

  getData() {
    console.log('--> PeopleServiceProvider getData() called');
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.data = [];
        result.rows.map((row) => {
          this.data.push(row.doc);
        });
        resolve(this.data);
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  handleChange(change) {
    console.log('--> PeopleServiceProvider handleChange() called');
    let changedDoc = null;
    let changedIndex = null;
    this.data.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    this.zone.run(() => {
      if (change.deleted) {
        // A document was deleted
        this.data.splice(changedIndex, 1);
      } else {
        if (changedDoc) {
          // A document was updated
          this.data[changedIndex] = change.doc;
        } else {
          // A document was added
          this.data.push(change.doc);
        }
      }
    });
  }

}
