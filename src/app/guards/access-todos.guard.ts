import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTodosGuard implements CanActivate {
  constructor(
    private authService : AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.authService.currentUser.pipe(
      map(user => {
          if(user == null){
            // se user == null não temos niguem logado
            return this.router.parseUrl('/auth/login')
          }

          if(!user.emailVerified){
          //se o user esta logada e não confirmou o email
            user.sendEmailVerification()
            return this.router.parseUrl('/auth/verify-email')
          }

          //se o user cumpre todos os requisitos
          return true
        }
      )
    )
    
  }
  
}
