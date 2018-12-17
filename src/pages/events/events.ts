import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { firestore } from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Event, EventState, EventType } from './events.model';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EventProvider } from '../../providers/event/event.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  eventForm: FormGroup;
  event: Event;
  useruid: string;
  eventLocation: firestore.GeoPoint;
  file: Blob = null;
  hasImage: boolean = false;
  loading: boolean = false;
  errorMsg: string;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
 
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    mediaType: this.camera.MediaType.PICTURE
  }

  imgUrl = 'assets/imgs/logo.png';
  dataMsg: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private geolocation: Geolocation,
    private eventService: EventProvider,
    private camera: Camera,
    private afStorage: AngularFireStorage,
    private toastCtrl: ToastController) {
      

    this.event = {
      uid: '',
      user_uid: '',
      service_uid: '',
      description: '',
      location: new firestore.GeoPoint(38.5490182, -7.91107599),
      eventDate: moment().valueOf(),
      imageUrl: '/assets/images/image.png',
      state: 'Novo',
      type: '',
      createdAt: moment().valueOf(),
      active: true
    };

    this.setEventForm();

    this.useruid = navParams.get('uid');
    this.geolocation.getCurrentPosition().then(
      _location => {
        console.log(_location.coords);
        this.eventLocation = new firestore.GeoPoint(
          _location.coords.latitude,
          _location.coords.longitude
        );
      });
  }

  ionViewDidLoad() {

  }

  get f() {
    return this.eventForm.controls;
  }

  setEventForm(): void {
    this.eventForm = this.formBuilder.group({
      description: [this.event.description, Validators.required],
      type: [this.event.type, Validators.required],
    });
  }

  submit(): void {
    this.loading = true;
    this.event.description = this.eventForm.value.description;
    this.event.type = this.eventForm.value.type;
    if (this.eventLocation) {
      this.event.location = this.eventLocation;
    }
    this.event.user_uid = this.useruid;
    this.addEvent();
  }

  addEvent(): void {
    this.eventService.addEvent(this.event).subscribe(
      _eventId => {
        if (_eventId) {
          this.event.id = _eventId;
          if(this.hasImage){
            this.upload();
          }else {
            this.loading = false;
              this.navCtrl.pop();
          }
        }
      },
      error => {
        this.errorHandler(error);
      });
  }

  takePicture(): void {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imgUrl = `data:image/jpeg;base64,${imageData}`;
      this.hasImage = true;
      //this.dataURItoBlob(imageData)
    }, (err) => {
     this.errorHandler(err);
    });
  }

  _submit(): void {
    this.loading = true;
  }

  upload(): void {
    const path = `glui/${this.event.id}/${new Date().getTime()}_${this.event.type}.jpg`;
    const fileRef = this.afStorage.ref(path);
    fileRef.putString(this.imgUrl, 'data_url').then(data => {
     console.log(data);
     data.ref.getDownloadURL().then( url => {
      this.eventService.updateEventUrl(this.event.id, url).subscribe(
        _event => {
          this.presentToast();
            this.loading = false;
        },
        error => {
          this.errorHandler(error);
        });
     });
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Ocorrêcia adicionado com sucesso',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.navCtrl.pop();
    });
  
    toast.present();
  }

  errorHandler(error: string): void {
    this.loading = false;
    this.errorMsg = error;
    console.log("Event Component Error");
    console.log(error);
  }

}
