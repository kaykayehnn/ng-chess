import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { UserRegistration } from '../../contracts/UserRegistration';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public readonly SIGN_IN = true;
  public readonly SIGN_UP = false;
  private readonly validators: { [key: string]: Validators } = {
    email: [
      Validators.required,
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ],
    password: [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    ]
  };

  public userForm: FormGroup;
  public signMode: boolean = this.SIGN_IN;
  private user = new UserRegistration();

  @Output() private hide = new EventEmitter<boolean>();
  constructor (private authService: AuthService) { }

  ngOnInit (signMode?: boolean) {
    if (signMode === undefined) { signMode = this.signMode; }

    if (signMode === this.SIGN_UP) {
      this.userForm = new FormGroup({
        email: new FormControl(this.user.email, this.validators.email, this.notTakenEmail.bind(this)),
        // ENHANCEMENT: debounce async validation
        password: new FormControl(this.user.password, this.validators.password),
        repeatPassword: new FormControl(this.user.repeatPassword, this.validators.password)
      }, { validators: this.matchingPasswords });
    } else {
      this.userForm = new FormGroup({
        email: new FormControl(this.user.email, this.validators.email),
        password: new FormControl(this.user.password, this.validators.password)
      });
    }
  }

  onSubmit () {
    const { email, password } = this.userForm.controls;
    const method = this.signMode === this.SIGN_UP ? 'signupUser' : 'signinUser';

    this.authService[method](email.value, password.value)
      .subscribe(() => {
        this.hide.emit(true);
      });
  }

  toggleMode (value: boolean) {
    if (this.signMode !== value) { this.ngOnInit(value); }

    this.signMode = value;
  }

  matchingPasswords (control: FormGroup): ValidationErrors | null {
    const passwordControl = control.get('password');
    const repeatPasswordControl = control.get('repeatPassword');

    return passwordControl.value === repeatPasswordControl.value
      || (passwordControl.dirty !== repeatPasswordControl.dirty) ? null : { differentPasswords: true };
  }

  notTakenEmail (ctrl: AbstractControl): Observable<ValidationErrors | null | void> {
    return this.authService.getByEmail(ctrl.value)
      .map(user => user.length ? ({ existingEmail: true }) : null);
  }
}
