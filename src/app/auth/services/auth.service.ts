import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth' // autenticação com firebase
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { from, tap } from 'rxjs';
import { Todo } from 'src/app/models/Todo';
import { User } from 'src/app/models/User';
import { GoogleAuthProvider } from 'firebase/auth'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //criar uma propiedade com a referencia da coleção de usuarios do firebase
  private usersCollection = this.store.collection<User>('users') //coleções são como as tabelas do mysql

  constructor(
    private authentication: AngularFireAuth, //serve para manipular a parte de autenticação do firebase
    private store: AngularFirestore, // serve para manipular o banco de dados do firebase
    private router: Router
  ) { }

  get currentUser() {
      //authState retorna um observable com o usuario que esta logado atualmente na aplicação ou null 
    return this.authentication.authState
  }

  private saveUserData(){
    return tap((credentials: firebase.default.auth.UserCredential) => {
      // recuperar o uid do usuario
      const uid = credentials.user?.uid as string;
      // recuperar o email do usuario
      const email = credentials.user?.email as string;

      const todos: Todo[] = []

      //criação de um novo documento na coleção de ususarios //doc são como as rows no mysql

      // a funcao doc te retorna a referencia para um documento na coleção a partir do seu UID
      // a funcao set atribui valores ao documento que vc está referenciando
      this.usersCollection.doc(uid).set({
        uid: uid,
        email: email,
        todos: todos,
      })

      //envia o email de verificação 
      credentials.user?.sendEmailVerification()
    })
  }
  signUpWithEmailAndPassword(email: string, password: string){
    // o from transformara a Promisse que o método createUserWuthEmailAndPassword retorna em um observable
    return from(this.authentication.createUserWithEmailAndPassword(email, password)).pipe(this.saveUserData())
  }

  signInWithEmailAndPassword(email: string, password: string){
    return from(this.authentication.signInWithEmailAndPassword(email, password))
  }

  signInWithGoogle(){
    const googleProvider = new GoogleAuthProvider()
    return from(this.authentication.signInWithPopup(googleProvider))
  }
  signUpWithGoogle(){
    const googleProvider = new GoogleAuthProvider()
    return from(this.authentication.signInWithPopup(googleProvider)).pipe(this.saveUserData())
  }

  signOut(){
    return from(this.authentication.signOut()).pipe(
      tap( () => this.router.navigateByUrl('/auth/login'))
    )
  }
}
