import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]]
  })

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authServices: AuthService
  ) { }

  ngOnInit(): void {
  }

  register() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    
    this.authServices.signUpWithEmailAndPassword(email, password).subscribe(
      () => {
        this.snackbar.open("Cadastro criado com sucesso", "",{
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      }
    )
  }

  signInWithGoogle() {

  }
}