import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { FirebaseService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    name: [
      { type: 'required', message: 'name is required' },
    ],
    email: [
      { type: 'required', message: 'email is required' },
      { type: 'pattern', message: 'email is not valid' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      {
        type: 'minlength',
        message:
          'the min of legnth is 5 characters',
      },
    ],
  };

  constructor(
    private navCtrl: NavController,
    private authService: FirebaseService,
    private formBuilder: FormBuilder
  ) {}

  // para validar un correo valido y contraseña
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      
    });
  }

  // registro de ususario en firebase
  tryRegister(value) {
    this.authService.signup(value).then(
      (res) => {
        console.log(res);
        this.errorMessage = '';
        this.successMessage =
          'whelcome to the multichat';
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    );
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }
}
