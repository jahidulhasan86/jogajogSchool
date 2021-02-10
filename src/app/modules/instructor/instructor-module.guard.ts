import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {first, map, pluck, tap} from 'rxjs/operators';
import { AccountService } from 'src/app/shared/services/user_service/account.service';
//import {State} from '../reducers';
//import {Store} from '@ngrx/store';

@Injectable()
export class CanLoadInstructorModule implements CanLoad {

  constructor( private router: Router, private accService: AccountService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    /* return this.store.pipe(
      pluck('auth', 'token'),
      map(data => !!data),
      first(),
      tap(result => {
        if (!result) {
          this.router.navigateByUrl('/login');
        }
      })
    ); */
    if(!this.accService.getSessionUserInfo()) return false;
    if(this.accService.getUserRole() !=='Teacher'){
        this.router.navigate(['']);
    }
     return this.accService.getUserRole() ==='Teacher';

  }
}
