import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../../environments/environment'
import { Observable, throwError, Subject, BehaviorSubject, of, from } from "rxjs";
import { map, catchError, flatMap, mergeMap, toArray, tap, ignoreElements, find, filter, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private getByIdURL = `${environment.alert_skool_url}/teacher/getById`;
  private insertTeacherForSingleLoginURL = `${environment.alert_skool_url}/teacher/insertTeacherForSingleLogin`
  private getClassWiseSubjectsAndTeachersURL = environment.alert_skool_url+'/class/getClassWiseSubjectsAndTeachers'; // ?class_id=
  currentUser: any;
  public classWiseSubjectAndTeacherList$ = new BehaviorSubject<any>([]);
  public classWiseSubjectAndTeacherListCast = this.classWiseSubjectAndTeacherList$.asObservable();
  subject_id: any[];

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
  }

  
  insertTeacherForSingleLogin(teacherData, access_token) {
    console.log("<======== insertTeacherForSingleLogin service called ========>");
    
    console.log(JSON.stringify(teacherData));

    /* let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", access_token); */
    // this.insertTeacherForSingleLoginURL = 'http://localhost:4010/api/v1/teacher/insertTeacherForSingleLogin'
  /*   let options = new RequestOptions({ headers: headers }); */
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: JSON.parse(localStorage.getItem('token'))
    })
  };


    return this.http.post(this.insertTeacherForSingleLoginURL, teacherData, httpOptions).pipe(
      map((x:any) => x),
      map((x) => {
        return x;
      }),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  getById() {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const { role } = this.currentUser
    if (role.role_name != 'Teacher' && role.role_type != '2') return of(false)

    console.log("<===========Get teacher info service is called============>")
/* 
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);

    let options = new RequestOptions({ headers: headers }) */
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};


    return this.http.get(`${this.getByIdURL}?user_id=${this.currentUser.id}`, httpOptions)
      .pipe(
        map((x:any) => x),
        tap((x) => {
          Object.assign(this.currentUser, { teacher_info: x.result });
          this.currentUser.student_info ? localStorage.setItem('sessionUser', JSON.stringify(this.currentUser)) : localStorage.setItem('sessionUser', JSON.stringify(this.currentUser))
        }),
        catchError((error: Response) => {
          return throwError(error.json());
        })
      )
  }

  getClassWiseSubjectsAndTeachersByClassId(query, isAddStudent?) {
    console.log(
      "<===========getClassWiseSubjectsAndTeachers service is called============>"
    );

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

   /*  var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.currentUser.access_token);

    let options = new RequestOptions({ headers: headers }); */
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http
      .get(
        `${this.getClassWiseSubjectsAndTeachersURL}?${query}`,
        httpOptions
      )
      .pipe(
        map((x:any) => x),
        tap((x) => {
          var subjectList = [];
          let slno = 0;
          x.result.forEach((e) => {
            e.position = ++slno;
            e.user_name = e.teacher_user_name // this property added to use only teacher list filter
            subjectList.push(e);
          });
          this.classWiseSubjectAndTeacherList$.next(subjectList);
          const { result } = x
          this.subject_id = result.map(subject => {
            return subject.id
          });
          x.subjectIds = this.subject_id;
          return x;
        }),
        tap((x) => {
          if (!!x && isAddStudent) {
            const { result } = x
            this.subject_id = result.map(subject => {
              return subject.id
            });
          }
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }



}
