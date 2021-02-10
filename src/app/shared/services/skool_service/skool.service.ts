import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { Observable, throwError, Subject, BehaviorSubject, of, from } from "rxjs";
import { map, catchError, flatMap, mergeMap, toArray, tap, ignoreElements, find, filter, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SkoolService {
  private getByIdURL = `${environment.alert_skool_url}/teacher/getById`;
  private insertTeacherForSingleLoginURL = `${environment.alert_skool_url}/teacher/insertTeacherForSingleLogin`

  currentUser: any;

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
  }

  
  insertSkool(teacherData, access_token) {
    console.log("<======== insertTeacherForSingleLogin service called ========>");
    
    console.log(JSON.stringify(teacherData));

    /* let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", access_token);
    //  this.insertTeacherForSingleLoginURL = 'http://localhost:4010/api/v1/school/insert'
    this.insertTeacherForSingleLoginURL = environment.alert_skool_url + '/school/insert';
    let options = new RequestOptions({ headers: headers }); */
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http.post(this.insertTeacherForSingleLoginURL, teacherData, httpOptions).pipe(
      map((x:any) => x.json()),
      map((x) => {
        return x;
      }),
      catchError((error: Response) => {
        return throwError(error.json());
      })
    );
  }

  getById() {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const { role } = this.currentUser
    if (role.role_name != 'Teacher' && role.role_type != '2') return of(false)

    console.log("<===========Get school info service is called============>")

    /* var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);

    let options = new RequestOptions({ headers: headers })
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: JSON.parse(localStorage.getItem('token'))
  })
};

    return this.http.get(`${this.getByIdURL}?user_id=${this.currentUser.id}`, httpOptions)
      .pipe(
        map((x:any) => x.json()),
        tap((x) => {
          Object.assign(this.currentUser, { teacher_info: x.result });
          this.currentUser.student_info ? localStorage.setItem('sessionUser', JSON.stringify(this.currentUser)) : localStorage.setItem('sessionUser', JSON.stringify(this.currentUser))
        }),
        catchError((error: Response) => {
          return throwError(error.json());
        })
      )
  }


}
