import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Event } from '../../pages/events/events.model';

@Injectable()
export class EventProvider {
  private eventsCollection: AngularFirestoreCollection<Event>;

  constructor(private db: AngularFirestore,) {
    this.eventsCollection = db.collection<Event>('events', ref =>
      ref.orderBy('eventDate', 'desc')
    );
  }

  addEvent(event: Event): Observable<string> {
    console.log("Saving event..");
    console.log(event);
    return from(
      this.eventsCollection
        .add(event)
        .then(_event => {
          console.log("Event saved..");
          console.log(_event.id);
          return _event.id;
        })
        .catch(err => {
          return err;
        })
    );
  }

  updateEventUrl(eventId: string, url: string): Observable<Event> {
    return from(
      this.eventsCollection.doc(eventId)
      .update({imageUrl: url})
      .then(_event => {
        return _event;
      })
      .catch(err => {
        return err;
      })
    );
  }

}
