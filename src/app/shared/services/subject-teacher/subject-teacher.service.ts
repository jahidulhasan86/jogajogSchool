import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, } from 'src/environments/environment';
import { map, catchError, flatMap, mergeMap, toArray, tap, switchMap, concatMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectTeacherService {

  private getClassWiseSubjectsAndTeachersURL = `${environment.alert_skool}/class/getClassWiseSubjectsAndTeachers`;
  private getConferencesStatusByIdsUrl = `${environment.vchub}/conference/getstatus`;
  private getTeacherByBranchIdURL = `${environment.alert_skool}/teacher/getTeachersByBranchId`;
  private getClassStudentsByTeacherIdURL = `${environment.alert_skool}/student/getClassStudentsByTeacherId`;
  private notifyURL: string = environment.alert_skool + '/notify';
  
  subject_id: any;
  currentUser: any;
  subjects = [];
  
  constructor(private http: HttpClient) { }

  getClassWiseSubjectsAndTeachersByClassId(query, isAddStudent?) {
    console.log(
      "<===========getClassWiseSubjectsAndTeachers service is called============>"
    );

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
        map((x: any) => x),
        tap((x) => {
          var subjectList = [];
          let slno = 0;
          x.result.forEach((e) => {
            e.position = ++slno;
            e.user_name = e.teacher_user_name // this property added to use only teacher list filter
            subjectList.push(e);
          });
          // this.classWiseSubjectAndTeacherList$.next(subjectList);
          // const { result } = x
          // this.subject_id = result.map(subject => {
          //   return subject.id
          // });
          // x.subjectIds = this.subject_id;
          // return x;
        }),
        tap((x) => {
          if (!!x && isAddStudent) {
            const { result } = x
            this.subject_id = result.map(subject => {
              return subject.id
            });
            x.subjectIds = this.subject_id
          }
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  getConferencesStatusbyIds(ids: string) {
    console.log("<======== Get Conference status by ids Service Called========>")

    let body = {
      ids: ids
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    return this.http.post(this.getConferencesStatusByIdsUrl, body, httpOptions)
      .pipe(
        map(x => x),
        catchError((error: Response) => {
          return throwError(error);
        })
      )
  }

  mergeConferenceStatusWithSubject(subjects) {
    let modifySubjectList = [];
    subjects.result.forEach((subjectItem) => {
      // findObj from conf_status
      let StatusIndex = subjects.confStatus.resultset.findIndex(
        (x) => x.id == subjectItem.id
      );

      // and put that conference_status on subject array 
      if (StatusIndex !== -1) {
        subjectItem.conference_status =
          subjects.confStatus.resultset[StatusIndex].status;
        // Object.assign(subjectItem, { wait_for_host: true })
      }
      let object = {
        // make a object for the 1st time
        class_id: subjectItem.class_id,
        class_name: subjectItem.class_name,
        subject_list: [subjectItem],
      };
      // find index on modifySubjectList Array
      let index = modifySubjectList.findIndex(
        (x) => x.class_id == subjectItem.class_id
      );
      if (index == -1) {
        // if not found, then push this obj on modifySubjectList
        modifySubjectList.push(object);
      } else {
        // if found, then push only data
        modifySubjectList[index].subject_list.push(subjectItem);
      }
    });
    let sortArrayByAlphabetically = modifySubjectList.sort(
      (a, b) => (a.class_name > b.class_name ? 1 : -1)
    );
    console.log('mergeConferenceStatusWithSubject', sortArrayByAlphabetically);

    return sortArrayByAlphabetically
  }

  flatSubjectListByClass(subjects) {
    this.subjects = []
    for (var i = 0; i < subjects.length; i++) {
      for (var z = 0; z < subjects[i].subject_list.length; z++) {
        this.subjects.push(subjects[i].subject_list[z])
      }
    }
    console.log('flatSubjectListByClass', this.subjects)
    localStorage.setItem('subject_list', JSON.stringify(this.subjects))
    return this.subjects
  }

  GetTeacherByBranchIdSchoolId(branchId, schoolId) {
    console.log("<===========Get Teacher By BranchId service is called============>");

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
          let slno = 0;
          x.resultset.forEach((e) => {
            Object.assign(e, {
              position: ++slno,
              name: e.user_name,
              dept_name: e.dept_name,
              branch_name: e.branch_name,
              created: e.created,
              active: e.is_active,
              user_name: e.user_name,
              user_id: e.user_id,
              profile_pic: e.profile_pic
            })
          });
          return x
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  getClassStudentsByTeacherId() {
    console.log(
      "<===========Get class student by teacher id service is called============>"
    );

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    return this.http.get(`${this.getClassStudentsByTeacherIdURL}?teacher_id=${this.currentUser.id}`, httpOptions).pipe(
      map((x) => x),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  flatStudentListByClass(classes) {
    var students = []
    for (var i = 0; i < classes.length; i++) {
      for (var z = 0; z < classes[i].students.length; z++) {
        Object.assign(classes[i].students[z], { class_name: classes[i].class_name })
        students.push(classes[i].students[z])
      }
    }
    console.log('flatStudentListByClass', students)
    return students
  }

  notify(conferenceInfo) {
    console.log("<======== notify service called ========>");

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    let req = {
      "users": conferenceInfo.teacherList,
      "data": {
        "company_id": this.currentUser.company_id,
        "app_name": environment.app_name,
        "meeting_name": conferenceInfo.subject_name,
        "meeting_code": conferenceInfo.id,
        "meeting_password": ""
      },
      "email": {
        "subject": "Reminder",
        "template": "notify",
        "from": "Jogajog Classroom <comms@sensor.buzz>",
        "context": {
          "messageText": "Students are waiting for you to start the class. Can you please start now?",
          "owner": {
            "host_name": conferenceInfo.teachers_name
          },
          "meeting_name": conferenceInfo.subject_name,
          "meeting_code": conferenceInfo.id,
          "meeting_password": "",
          // "meeting_url": ""
        }
      },
      "push": {
        "meeting_name": conferenceInfo.subject_name,
        "meeting_code": conferenceInfo.id,
        "meeting_password": "",
        "type":"reminder"
      }
    }

    console.log(JSON.stringify(req))

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    return this.http
      .post(this.notifyURL, req, httpOptions)
      .pipe(
        map((x : any) => x),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

}
