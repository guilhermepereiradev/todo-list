import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { mergeMap, map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
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
        return this.usersCollection.doc(user?.uid).get()
      }),
      map(userDoc => {
        // retorna os Todos desse user
        return userDoc.data()?.todos || []
      })
    )
  }
}
