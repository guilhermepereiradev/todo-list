import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { mergeMap, map, merge } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Todo } from 'src/app/models/Todo';
import { User } from '../../models/User'

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  
  private usersCollection = this.store.collection<User>('users');
  private currentUser = this.authService.currentUser;


  constructor(
    private store: AngularFirestore,
    private authService: AuthService
  ) { }
  
  getTodos(){
    return this.currentUser.pipe(
      //junta o primeiro e o segundo observable e transforma em uma coisa só(currentUser + userCollection)
      mergeMap( user => {
        //acessa a coleção e retorna o doc com esse id
        return this.usersCollection.doc(user?.uid).get() //get() serve para recuperar os dados de um ou mais documentos no firebase
      }),
      map(userDoc => {
        // retorna os Todos desse user
        return userDoc.data()?.todos || []
      })
    )
  }

  createTodo(todo: Todo){
    return this.currentUser.pipe(
      mergeMap( user => {
        return this.usersCollection.doc(user?.uid).get()
      }),
      mergeMap( userDoc =>{
        // afuncao data retorna um objeto com os dados de user
        const user = userDoc.data() as User
        todo.id = this.store.createId()
        user.todos.push(todo)

        //alterar o user no firebase
        //ref pega referencia do documento para fazer o CRUD
        return userDoc.ref.update(user) //tbm é uma promisse
      })
    )
  }

  deleteTodo(todo: Todo){
    return this.currentUser.pipe(
      mergeMap( user => {
        return this.usersCollection.doc(user?.uid).get()
      }),
      mergeMap( userDoc =>{
        // afuncao data retorna um objeto com os dados de user
        const user = userDoc.data() as User
        
        user.todos = user.todos.filter( t => t.id != todo.id)

        //alterar o user no firebase
        //ref pega referencia do documento para fazer o CRUD
        return userDoc.ref.update(user) //tbm é uma promisse
      })
    )
  }
  
  updateTodo(todo: Todo){
    return this.currentUser.pipe(
      mergeMap( user => {
        return this.usersCollection.doc(user?.uid).get()
      }),
      mergeMap( userDoc =>{
        const user = userDoc.data() as User
        
        user.todos = user.todos.map( t => {
          if (t.id == todo.id){
            return todo
          } else {
            return t
          }
        })

        return userDoc.ref.update(user)
      })
    )
  }
}
