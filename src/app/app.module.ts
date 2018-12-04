import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { EventsPage } from '../pages/events/events';
import { TaskProvider } from '../providers/task/task.service';
import { TasksPage } from '../pages/tasks/tasks';
import { LoginPage } from '../pages/login/login';

const firebase = {
  apiKey: "AIzaSyBzOqQimbLuB9jX9so2tWf5XdyL1FymwnI",
  authDomain: "glui-iot.firebaseapp.com",
  databaseURL: "https://glui-iot.firebaseio.com",
  projectId: "glui-iot",
  storageBucket: "glui-iot.appspot.com",
  messagingSenderId: "849401831205"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    EventsPage,
    TasksPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebase),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    EventsPage,
    TasksPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    AngularFireStorage,
    AuthProvider,
    TaskProvider
  ]
})
export class AppModule {}
