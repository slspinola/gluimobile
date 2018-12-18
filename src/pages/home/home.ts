import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TasksPage } from '../tasks/tasks';
import { EventsPage } from '../events/events';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  uid: string;
  username: string;
  errorMsg: string;

  pages = [
    { title: 'Serviços', icon:'list-box', component: TasksPage },
    { title: 'Ocorrências', icon:'pricetags', component: EventsPage },
    { title: 'Recolha', icon:'trash', component: EventsPage },
    { title: 'Outro', icon:'pint', component: EventsPage },
    { title: 'Varredura', icon:'leaf', component: EventsPage },
    { title: 'Manutenção', icon:'construct', component: EventsPage },
    { title: 'Sarjetas', icon:'grid', component: EventsPage },

  ];

  constructor(public navCtrl: NavController, private authService: AuthProvider) {
    this.authService.user.subscribe(
      user => {
        console.log(user.uid);
        this.uid = user.uid
        this.authService.getProfile().subscribe(
          profile => {
            console.log(profile[0]);
            this.uid = profile[0].id;
            this.username = profile[0].name + ' ' + profile[0].lastname;
          },
          error => {
            this.errorHandler(error);
          }
          )
      })
  }

  navigateTo(page: any): void {
    //this.navCtrl.push(TasksPage, {});
    if(this.uid == 'undefined'){
      this.uid = 'slsspinola'
    }
    this.navCtrl.push(page.component, {uid: this.uid});
  }

  getUser(): void {
    
  }

  errorHandler(error: string): void {
    this.errorMsg = error;
    console.log("Event Component Error");
    console.log(error);
  }

}
