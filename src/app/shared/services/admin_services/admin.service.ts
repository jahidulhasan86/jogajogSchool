
import { HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError, flatMap, mergeMap, toArray, tap, switchMap, concatMap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private getAllBranchBySchoolIdURL = `${environment.alert_skool}/branch`; // ?school_id=
  private getAllDeptByBranchIdURL = `${environment.alert_skool}/dept/getDeptsByBranchId`; // ?branch=
  private getByClassIdURL = `${environment.alert_skool}/class/getClassesByDeptId`;
  private insertClassURL = `${environment.alert_skool}/class/insert`;
  private classInviteURL = `${environment.alert_skool}/class/classInvite`;
  private getTeacherByDeptIdURL = `${environment.alert_skool}/teacher/getTeachersByDeptId`; // ?dept_id=
  private getTeacherByBranchIdURL = `${environment.alert_skool}/teacher/getTeachersByBranchId`; // ?dept_id=
  private insertTeacherURL = `${environment.alert_skool}/teacher/insert`;
  private getClassWiseSubjectsAndTeachersURL = `${environment.alert_skool}/class/getClassWiseSubjectsAndTeachers`; // ?class_id=
  private insertClassWiseSubjectAndTeacherURL = `${environment.alert_skool}/class/insertClassWiseSubjectTeacher`;
  private addConferenceUrl = `${environment.vchub}/conference/addConference`;
  private getStudentsByIdURL = `${environment.alert_skool}/student/getStudents`;
  private insertStudentURL = `${environment.alert_skool}/student/insert`;
  public addUsersToExistingConferenceUrl = environment.vchub + '/conference/addUsersToExistingConference';
  currentUser: any;
  private assignUserToClassURL: string = environment.alert_skool_url + '/student/assignStudentToClass';
  subject_id: any;



  constructor(private http: HttpClient) { }


  getAllBranchBySchoolId(school_id) {
    console.log(
      "<===========getAllBranchBySchoolId service is called============>"
    );
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    return this.http
      .get(`${this.getAllBranchBySchoolIdURL}?school_id=${school_id}`, httpOptions)
      .pipe(
        map((x: any) => x),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  getAllDeptByBranchId(branch_id) {
    console.log(
      "<===========getAllDeptByBranchId service is called============>"
    );

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    return this.http
      .get(`${this.getAllDeptByBranchIdURL}?branch=${branch_id}`, httpOptions)
      .pipe(
        map((x: any) => x),

        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  getClassByDeptId(id, teacher_id?) {
    console.log(
      "<===========Get class by department id service is called============>"
    );

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
    let query;
    if (teacher_id) {
      query = "?dept=" + id + "&teacher_id=" + teacher_id;
    } else {
      query = "?dept=" + id;
    }
    return this.http.get(`${this.getByClassIdURL}${query}`, httpOptions).pipe(
      map((x: any) => {
        var count = 1;
        if (x.resultset.length > 0) {
          x.resultset.forEach((x) => {
            return (x.position = count++);
          });
        }
        return x
      }
      ),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  assignUserToClass(body) {

    let assignStudentToClassModel = {
      school_id: body.company_id,
      branch_id: body.branch_id,
      class_id: body.class_id
    }

    console.log("<======== Assign user to class service called ========>");
    /*   this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
      let headers = new Headers();
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
      .post(this.assignUserToClassURL, assignStudentToClassModel, httpOptions)
      .pipe(
        map((x: any) => x.json()),
        catchError((error: Response) => {
          return throwError(error.json());
        })
      );
  }

  insertClass(classData) {
    console.log("<======== insert class service called ========>");
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))


      })
    };

    return this.http.post(this.insertClassURL, JSON.stringify(classData), httpOptions)
      .pipe(
        map((x: any) => x),
        catchError((error: Response) => {
          return throwError(error);
        })
      )
  }

  classInvite(body) {
    console.log("<======== Class invite service called ========>");
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))


      })
    };
    return this.http
      .post(this.classInviteURL, body, httpOptions)
      .pipe(
        map((x: any) => x),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  GetTeacherByDeptIdSchoolId(deptId, schoolId) {
    console.log("<===========Get Teacher By DeptId service is called============>");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))


      })
    };

    return this.http
      .get(`${this.getTeacherByDeptIdURL}?dept_id=${deptId}&school_id=${schoolId}`, httpOptions)
      .pipe(
        map((x: any) => {
          let count = 1;
          if (x.resultset.length > 0) {
            x.resultset.forEach((e) => {
              return (e.position = count++);
            });
          }
          return x
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  GetTeacherByBranchIdSchoolId(branchId, schoolId) {
    console.log("<===========Get Teacher By BranchId service is called============>");

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))


      })
    };

    return this.http
      .get(
        `${this.getTeacherByBranchIdURL}?branch_id=${branchId}&school_id=${schoolId}`,
        httpOptions
      )
      .pipe(
        map((x: any) => {
          var count = 1;
          if (x.resultset.length > 0) {
            x.resultset.forEach((e) => {
              return (e.position = count++);
            });
          }
          return x
        }),

        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  insertTeacher(teacherData) {
    console.log("<======== Teacher insert service called ========>");
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log(JSON.stringify(teacherData));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))

      })
    };
    return this.http.post(this.insertTeacherURL, teacherData, httpOptions).pipe(
      map((x: any) => x),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  // 
  // query = "class_id=id" / "teacher_id=id" ....
  getClassWiseSubjectsAndTeachersByClassId(query, isAddStudent?) {
    console.log("<===========getClassWiseSubjectsAndTeachers service is called============>");
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))

      })
    };

    return this.http
      .get(`${this.getClassWiseSubjectsAndTeachersURL}?${query}`, httpOptions)
      .pipe(
        map((x: any) => x),
        tap((x) => {
          var count = 1;
          if (x.result.length > 0) {
            x.result.forEach((e) => {
              return (e.position = count++);
            });
          }
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

  insertClassWiseSubjectTeacher(data) {
    console.log("<======== insertClassWiseSubjectTeacher service called ========>");
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log(JSON.stringify(data));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))

      })
    };

    return this.http.post(this.insertClassWiseSubjectAndTeacherURL, data, httpOptions).pipe(
      map((x: any) => x),
      catchError((error: Response) => {
        return throwError(error.json());
      })
    );
  }

  _addConference_forLearn2Gether(conferenceName: any, conference_id: any, tags: any, userList: string[], conferenceType: any, deviceList?: string[], region?: any, conferenceMode?: boolean, isAllowContributor?: boolean, isPinned?: boolean, geofenceList?) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<======== Add Conference Service Called========>")
    var name = conferenceName
    // my_group
    var req = {
      "conference_id": conference_id,
      "conference_name": name,
      "users": userList,
      "devices": deviceList,
      "region": region,
      "conference_type": conferenceType,
      "is_pinned": isPinned,
      "is_allow_contributor": isAllowContributor,
      "geofences": geofenceList ? geofenceList : null,
      "tags": tags
    }

    console.log("reqBody- add conference", req)
    // const accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsInVzZXJfbmFtZSI6ImphaGlkX3QxIiwiZW1haWwiOiJjaWZhaDcxMjQxQHlla3RhcmEuY29tIiwidXNlcl9pZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsImNvbXBhbnlfaWQiOiJkMTdiNWQzZi01NjVhLTRkNWItODgxNS1lNTU2YjdjZjkwZWQiLCJjb21wYW55X25hbWUiOiJKb2dham9nIFNjaG9vbCIsImFwcF9pZCI6ImUyMWJmNDlmLTQwZDgtNGYxYS1hMjNhLTQ5OTgwZTg5MTdhZSIsImFwcF9uYW1lIjoiSm9nYWpvZyBDbGFzc3Jvb20iLCJqdGkiOiIyODhmZTEwMi00Njg4LTQ3N2QtOTVhZC05NDdmMGNkZGRjMjciLCJpYXQiOjE2MDc1MDgzNDIsImlzcyI6Im9hdXRoLnN1cnJvdW5kYXBwcyIsInN1YiI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCJ9.Brm25VRxinNRwRwbAdo-PLMtQz9P0UVfBAVwS-AQnPnAN0sYQmnTnT_13D5qGQcoHs5XUqZvx4YStno1ltJVfmi87P-0hBaWk-lpga_tccqgczVGe9YXYNWpwC7UfMBxMAWw8JgGJrLEygravKRCs0zM6052BBJHUArFZg-Ldy7VAI2SQ94BdLUgOzxN_dwIDO_jrtarEuYa4cufWhMgO--yq55lx215RHKQXorYoCY8mexg1dDxZlr1FP_5NZLcC6huAWKYAnRvQGiRZ3rmZYyxHf_7TW1YYOK8jFRQbtIBHayUOZ6JwdwBKz3qnGFCHQpBFtFW1sw2avWfDVzxlw"
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))

      })
    };
    return this.http.post(this.addConferenceUrl + '?token=' + this.currentUser.access_token, req, httpOptions)
      .pipe(
        map((x: any) => {
          console.log("Add conference", x);
          return x;
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }


  getStudentsById(id, type?) {
    console.log(
      "<===========Get students by id service is called============>"
    );

    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))

      })
    };

    return this.http.get(`${this.getStudentsByIdURL}?${type}=${id}`, httpOptions).pipe(
      map((x: any) => {
        var count = 1;
        if (x.result.pgData.length > 0) {
          x.result.pgData.forEach((x) => {
            return (x.position = count++);
          });
        }
        return x
      }),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }


  insertStudent(studentData) {
    console.log("<======== insert student service called ========>");

    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    studentData.company_id = environment.company_id
    studentData.app_id = environment.app_id

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
    return this.http
      .post(this.insertStudentURL, JSON.stringify(studentData), httpOptions)
      .pipe(
        map((x: any) => x),
        map((x: any) => x.result),
        switchMap((x) => {
          return from(this.subject_id).pipe(
            mergeMap((id) => {
              let userList = []
              userList.push({ user_id: x.result.user_id, user_name: x.result.user_name })
              let req = {
                "id": id,
                "users": userList
              }
              console.log("<======== assign student to existing conference service called ========>");
              return this.http.post(this.addUsersToExistingConferenceUrl, req, httpOptions).pipe(
                map((x: any) => x)
              )
            })
          )
        }), toArray(),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  _addUsersToExistingConference(conferenceId: any, userList?: string[]) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<======== Add Users To Existing Conference Service Called========>")

    let req = {
      "id": conferenceId,
      "users": userList
    }
    // const accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsInVzZXJfbmFtZSI6ImphaGlkX3QxIiwiZW1haWwiOiJjaWZhaDcxMjQxQHlla3RhcmEuY29tIiwidXNlcl9pZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsImNvbXBhbnlfaWQiOiJkMTdiNWQzZi01NjVhLTRkNWItODgxNS1lNTU2YjdjZjkwZWQiLCJjb21wYW55X25hbWUiOiJKb2dham9nIFNjaG9vbCIsImFwcF9pZCI6ImUyMWJmNDlmLTQwZDgtNGYxYS1hMjNhLTQ5OTgwZTg5MTdhZSIsImFwcF9uYW1lIjoiSm9nYWpvZyBDbGFzc3Jvb20iLCJqdGkiOiIyODhmZTEwMi00Njg4LTQ3N2QtOTVhZC05NDdmMGNkZGRjMjciLCJpYXQiOjE2MDc1MDgzNDIsImlzcyI6Im9hdXRoLnN1cnJvdW5kYXBwcyIsInN1YiI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCJ9.Brm25VRxinNRwRwbAdo-PLMtQz9P0UVfBAVwS-AQnPnAN0sYQmnTnT_13D5qGQcoHs5XUqZvx4YStno1ltJVfmi87P-0hBaWk-lpga_tccqgczVGe9YXYNWpwC7UfMBxMAWw8JgGJrLEygravKRCs0zM6052BBJHUArFZg-Ldy7VAI2SQ94BdLUgOzxN_dwIDO_jrtarEuYa4cufWhMgO--yq55lx215RHKQXorYoCY8mexg1dDxZlr1FP_5NZLcC6huAWKYAnRvQGiRZ3rmZYyxHf_7TW1YYOK8jFRQbtIBHayUOZ6JwdwBKz3qnGFCHQpBFtFW1sw2avWfDVzxlw"
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))

      })
    };
    return this.http.post(this.addUsersToExistingConferenceUrl + '?token=' + this.currentUser.access_token, req, httpOptions)
      .pipe(
        map((result: any) => result),
        map(x => {
          console.log(" from Add Users To Existing Conference function", x);
          return x;
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }


}
