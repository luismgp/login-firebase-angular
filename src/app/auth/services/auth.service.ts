import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Login } from '../interfaces/user';
import { User } from '../interfaces/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(  
    private auth: AngularFireAuth,
    private router: Router,
    private fdb: AngularFireDatabase
  ) { }


  async login(log: Login) {
    const usuario = await this.auth.signInWithEmailAndPassword( log.email, log.password );
    const uuid: any = usuario.user.uid;
    return uuid;
  }

  async logout() {

    try {

      localStorage.removeItem('user');
      await this.auth.signOut();

      this.router.navigate(['/login']);
      
    } catch (error) {
      console.log(error);
    }
      
  }

  async passwordResetEmail( passwordResetEmail: string ) {
    return await this.auth.sendPasswordResetEmail( passwordResetEmail );
  }

  async user( uid: string ){
    return this.fdb.object<User>( `bdusers/users/${uid}/` )
      .snapshotChanges().pipe(
        map( c => ( { keyUser: c.payload.key, ...c.payload.val() } ) )
      );
  }

  async getUsuarioLocal(): Promise<User>{
    const user = localStorage.getItem('user');
    if(user) return JSON.parse(user);
    else return undefined
  }

}
