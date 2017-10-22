import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PeopleServiceProvider } from '../../providers/people-service/people-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PeopleServiceProvider]
})
export class HomePage {
    people: any;

  constructor(public navCtrl: NavController, public peopleService: PeopleServiceProvider) {
    this.peopleService.getData().then(data => {
      this.people = data;
    });
  }

}
