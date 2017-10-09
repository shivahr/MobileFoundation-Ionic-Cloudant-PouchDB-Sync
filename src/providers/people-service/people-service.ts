/// <reference path="../../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
import { Injectable } from '@angular/core';

@Injectable()
export class PeopleServiceProvider {
  data: any = null;

  constructor() {
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      let dataRequest = new WLResourceRequest("/adapters/peopleAdapter/getPeople", WLResourceRequest.GET);
      dataRequest.send().then(
        (response) => {
          console.log('--> data loaded from adapter', response);
          this.data = response.responseJSON.rows;
          resolve(this.data)
        }, (failure) => {
          console.log('--> failed to load data', failure);
          resolve('error')
        })
    });
  }

}
