import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// localgost:4200/
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todos'
  },
  {
    path: 'todos',
    loadChildren: () => import('./todo/todo.module').then( m => m.TodoModule) // lazy load
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
