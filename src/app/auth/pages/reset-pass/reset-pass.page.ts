import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  loader: boolean = false;
  mail: string = '';

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit(){
  }

  validate(){
    !this.mail ? 
    console.log('There is no email') : 
    this.validateEmail();
  }

  validData( cadena: string ){

    // ^[a-z]+@[a-z]+\.[a-z]{2,4}((,\s?){1}[a-z]+@[a-z]+\.[a-z]{2,4})*$
    const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const result = cadena.replace(/\s/g, "").split(/,|;/);
    for( let i = 0; i < result.length; i++ ) {

      if(!regex.test(result[i])) {
          return false
      }

    }

    const stringMails: string = cadena.replace(/ /g, "");
          const mailsSend: string[] = stringMails.split(",");
          return mailsSend;

  }

  validateEmail() {
    const string = this.validData(this.mail);
    if(!string) console.log('Email with invalid format');
    else this.confirmReset();
  }

  async confirmReset() {

    const alert = await this.alertCtrl.create({
      header: 'Message',
      message: 'Reset password',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: () => {
            this.sendPass();
          }
        }
      ]
    });

    await alert.present();

  }

  async sendPass(){
        
    try {

      this.loader = true;
      await this.auth.passwordResetEmail(this.mail);
      console.log('Password sent')
      this.loader = false;
      
    } catch (error) {
      this.loader = false;
      console.log(error);
    }

  }

}
