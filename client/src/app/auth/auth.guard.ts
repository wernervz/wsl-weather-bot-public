import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { LoopbackLoginService } from './loopback/lb-login.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: LoopbackLoginService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.isAuthenticated();
  }

}
