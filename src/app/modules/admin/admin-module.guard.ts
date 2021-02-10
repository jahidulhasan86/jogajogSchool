import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {first, map, pluck, tap} from 'rxjs/operators';
import { AccountService } from 'src/app/shared/services/user_service/account.service';

@Injectable()
export class CanLoadAdminModule implements CanLoad {

  constructor( private router: Router, private accService:AccountService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.accService.getSessionUserInfo()) return false;
    return this.accService.getUserRole().toString().toLowerCase()==='admin' || this.accService.getUserRole().toString().toLowerCase()==='teacher';
  }
}
