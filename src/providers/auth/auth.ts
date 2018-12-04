import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of, throwError} from 'rxjs';
import { switchMap, catchError, map  } from 'rxjs/operators';
import { User, Email, Profile } from './user.model';
import { ErrorCodes } from './error.model';

@Injectable()
export class AuthProvider {

  user: Observable<User>;
  useruid: string;
  isAuthenticated: BehaviorSubject<boolean>;
  private profilesCollection: AngularFirestoreCollection<Profile>;
  authProviderReady$: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { 
    this.isAuthenticated = new BehaviorSubject<boolean>(false);
    this.user = this.afAuth.authState.pipe(
      switchMap( user => {
        if(user) {
          this.isAuthenticated.next(true);
          const u = this.db.doc<User>(`users/${user.uid}`).valueChanges();
          //console.log('################')
          //console.log(u);
          this.useruid = user.uid;
          return u;
        } else {
          this.isAuthenticated.next(false);
          return of(null);
        }
      })
    )
  }

  isUserAuthenticated(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getUserUid(): string {
    return this.useruid;
  }

  getProfile(): Observable<Profile[]> {
    //console.log(this.useruid);
    return this.db.collection<Profile>('profiles', ref => ref.where('user_uid', '==', this.useruid)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Profile;
        const id = a.payload.doc.id;
        return { id, ...data }
      }))
    );
  }

  getUser(): Observable<User> {
    return this.user;
  }

  updateIsAuthenticated(show: boolean): void {
    this.isAuthenticated.next(show);
  }

  login(credentials: Email): Observable<boolean | {}> {
    return of(this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
    .then(
      fbUser => {
        let userExists = false;
        if(fbUser !== undefined && fbUser!== null){
          this.updateIsAuthenticated(true);
          this.updateUserData(fbUser.user);
          userExists = true;
        }
        return userExists;
      })
    ).pipe(
      catchError(error => {
        const err = ErrorCodes[error.code];
        this.handleError(error);
       return throwError(err)
      })
    )
  }

  logout() {
    this.afAuth.auth.signOut().then(
      () => {
        this.updateIsAuthenticated(false);
          
      }
    )
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email || null
    };
    return userRef.set(data);
  }

  private handleError(error: Error) {
    console.error(error);
  }


}
