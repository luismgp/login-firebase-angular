import { Component, OnInit } from '@angular/core';
import { Login, User } from '../../interfaces/user';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginData: Login = {email: '', password: ''};
  loader = false;
  msgerror = '';
  uid: string = '';
  usuario: Observable<User>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  async ngOnInit() {
  }

  async login() {

      if(this.loginData.email === '' || this.loginData.password === ''){

        this.msgerror = 'No data entered';
        this.loader = false;

      }else{

        try {

          this.loader = true;
          const uid = await this.authService.login(this.loginData);
          const user = await this.authService.user( uid );

          user.pipe( take(1)).subscribe( u => {

            this.loader = false;
            const jsonData = JSON.stringify(u);
            localStorage.setItem('user', jsonData);

            this.router.navigate(['/home']);
            
          });


        } catch (err) {
          this.handleError(err);
          this.loader = false;
        }

      }

  }

  handleError(error: any) {
    try {
      switch (error.code) {
        case 'auth/invalid-email':
          this.msgerror = 'El correo electrónico ingresado no es válido.';
          break;
        case 'auth/user-disabled':
          this.msgerror = 'El usuario ha sido deshabilitado.';
          break;
        case 'auth/user-not-found':
          this.msgerror = 'No hay ningún usuario registrado con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          this.msgerror = 'La contraseña es incorrecta. Por favor, verifica tus datos e intenta de nuevo.';
          break;
        default:
          this.msgerror = 'Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo más tarde.';
          break;
      }
    } catch (additionalError) {
      console.error('Error adicional en handleError():', additionalError);
    }
  }

}
