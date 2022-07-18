import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth' // autenticação com firebase
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, tap } from 'rxjs';
import { Todo } from 'src/app/models/Todo';
import { User } from 'src/app/models/User';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //criar uma propiedade com a referencia da coleção de usuarios do firebase
  private usersCollection = this.store.collection<User>('users') //coleções são como as tabelas do mysql

  constructor(
    private authentication: AngularFireAuth, //serve para manipular a parte de autenticação do firebase
    private store: AngularFirestore // serve para manipular o banco de dados do firebase
  ) { }

  signUpWithEmailAndPassword(email: string, password: string){
    // o from transformara a Promisse que o método createUserWuthEmailAndPassword retorna em um observable
    return from(this.authentication.createUserWithEmailAndPassword(email, password)).pipe(
      tap((credentials) => {
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
    )
  }
}
