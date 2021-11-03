import { switchMap,take } from 'rxjs/operators';
import { AppState } from './../../../store/AppState';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad{

  constructor(
    private store: Store<AppState>,
    private router: Router) { }

  canLoad(): Observable<boolean>{
    return this.store.select('login').pipe(
      take(1),
      switchMap(loginState => {
        if(loginState.isLoggedIn){
          return of(true);
        }
        this.router.navigateByUrl('login');
        return of(false);
      })
    )
  }
}
