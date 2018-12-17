import { Component, } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TaskProvider } from '../../providers/task/task.service';
import { Service } from './service.model';
import { Observable } from 'rxjs';



@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {

  uid: string;
  taskList$: Observable<Service[]>;
  taskList: Service[];
  showId: string = '';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public taskProvider: TaskProvider) {

          this.uid = navParams.get('uid');
          this.taskProvider.setServiceCollection(this.uid);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TasksPage');
    this.taskList$ = this.taskProvider.getServiceList();   
  }

  itemTapped(event, task){
    if(this.showId==task.id){
      this.showId = '';
    }else {
      this.showId = task.id;
    }
    
  }

  taskDone(task: Service): void {
    task.state = 'Terminado'
    this.taskProvider.updateService(task);
  }

  taskStarted(task: Service): void {
    task.state = 'Em Execução'
    this.taskProvider.updateService(task);
  }

  taskStopped(task: Service): void {
    task.state = 'Planeado'
    this.taskProvider.updateService(task);
  }

}
