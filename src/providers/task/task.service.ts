import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../pages/tasks/service.model';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable()
export class TaskProvider {

  private serviceCollection: AngularFirestoreCollection<Service>;
  private serviceDocument: AngularFirestoreDocument<Service> = null;

  constructor(private db: AngularFirestore) {


  }


  setServiceCollection(uid): void {
    this.serviceCollection = this.db.collection<Service>('services', ref =>
      ref.where('workerid', '==', uid)
        .orderBy('serviceDate', 'desc')
    );
  }

  getServiceList(): Observable<Service[]> {
    return this.serviceCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Service;
          const id = a.payload.doc.id;
          return { id, ...data }
        })
      )
    );
  }


  updateService(service: Service): void {
    const serviceDocument = this.db.doc<Service>(`services/${service.id}`);

    serviceDocument
      .update(service)
      .then(_service => {
        return _service;
      })
      .catch(err => {
        return err;
      });
  }
}
