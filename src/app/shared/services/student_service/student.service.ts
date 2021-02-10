import { Injectable } from '@angular/core';
/* import { Http, Response, Headers, RequestOptions } from '@angular/http'; */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../../environments/environment'
import { Observable, throwError, Subject, BehaviorSubject, of } from 'rxjs';
import { map, catchError, flatMap, mergeMap, toArray, tap, ignoreElements } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class StudentService {
    public selectedSubject$ = new BehaviorSubject<any>(null);
    selectedSubjectast = this.selectedSubject$.asObservable();

    private currentUser = null;

    private getStudentsUrl = environment.alert_skool_url + '/student/getStudents?';
    private getStudentByIdURL = `${environment.alert_skool_url}/student/getStudentById`
    insertTeacherForSingleLoginURL: string = environment.alert_skool_url + '/student/insertStudentForSingleLogin';
    // private getTeachersByClassIdURL = `${GlobalValue.alert_skool_url}/teacher/getTeachersByClassId`
    private getStudentsByIdURL = environment.alert_skool_url+'/student/getStudents';
    private students = new BehaviorSubject<any>([])

    private classStudents = new BehaviorSubject<any>([])
    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    }

    getStudents() {
        console.log("<===========Student get service is fired============>")

        /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.currentUser.access_token);

        let options = new RequestOptions({ headers: headers })
 */
        //fire request
        const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

        return this.http.get(this.getStudentsUrl + "?school_id=" + environment.company_id, httpOptions)
            .pipe(
                map(x => x),
                catchError((error: Response) => {
                    return throwError(error.json());
                })
            )
    }

    getStudentById() {

        this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

        const { role } = this.currentUser
        if (role.role_name != 'student' && role.role_type != '3') return of(false)

        console.log("<===========Get student info by id service is called============>")

      
        const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};


        return this.http.get(`${this.getStudentByIdURL}?id=${this.currentUser.id}`, httpOptions)
            .pipe(
                map((x:any)=> x),
                tap((x) => {
                    Object.assign(this.currentUser, { student_info: x.result });
                    this.currentUser.student_info ? localStorage.setItem('sessionUser', JSON.stringify(this.currentUser)) : localStorage.setItem('sessionUser', JSON.stringify(this.currentUser))
                }),
                catchError((error: Response) => {
                    return throwError(error.json());
                })
            )
    }

    // getTeachersByClassId(id) {

    //     this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    //     console.log("<===========Get teachers by class_id service is called============>")

    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Authorization', this.currentUser.access_token);

    //     let options = new RequestOptions({ headers: headers })

    //     return this.http.get(`${this.getTeachersByClassIdURL}?class_id=${id}`, options)
    //         .pipe(
    //             map(x => x.json()),
    //             catchError((error: Response) => {
    //                 return throwError(error.json());
    //             })
    //         )
    // }





    
    // service not working 

    insertStudentForSingleLogin(studentData, access_token) {
        console.log("<======== insert Student For Single Login service called ========>");

        console.log(JSON.stringify(studentData));

        const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

        return this.http.post(this.insertTeacherForSingleLoginURL, studentData, httpOptions).pipe(
            map((x:any) => x),
            map((x) => {
                return x;
            }),
            catchError((error: Response) => {
                return throwError(error.json());
            })
        );
    }


  getStudentsById(id, type?) {
    console.log(
      "<===========Get students by id service is called============>"
    );

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    /* var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.currentUser.access_token);

    let options = new RequestOptions({ headers: headers }); */

    
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: JSON.parse(localStorage.getItem('token'))
        })
    };

    return this.http.get(`${this.getStudentsByIdURL}?${type}=${id}`, httpOptions).pipe(
      map((x:any) =>{
        var count = 1;
        x.result.pgData.forEach((x) => {
          return (x.position = count++);
        });
       return x.result;      
    } ),
      
      catchError((error: Response) => {
        this.students.next([])
        return throwError(error.json());
      })
    );
  }

}