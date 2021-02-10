import { HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError, flatMap, mergeMap, toArray, tap, switchMap, concatMap } from 'rxjs/operators';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private getMyExamsByClassIdURL = `${environment.alert_skool}/exam/getMyExamsByClassId`;
  private getExamByBranchDeptAndYearURL = `${environment.alert_skool}/exam/getExamByBranchDeptAndYear`;
  private deleteExamUrl = `${environment.alert_skool}/exam/deleteExams`;
  private insertQuestionUrl =`${environment.alert_skool}/exam/insertquestion`;
  private insertExamUrl = `${environment.alert_skool}/exam/insert`;
  private updateExamURL = `${environment.alert_skool}/exam/updateExam`;
  private updateQuestionURL = `${environment.alert_skool}/exam/updateQuestion`;
  private getByExamIdURL = `${environment.alert_skool}/exam/getByExamId`;
  private insertStudentAnswerPaperUrl =`${environment.alert_skool}/exam/insertStudentAnswerPaper`;
  private getStudentAnswerPaperByExamIdURL = `${environment.alert_skool}/exam/getStudentAnswerPaperByExamId`;
  currentUser: any;
  public stdExamAns$ = new BehaviorSubject<boolean>(false);
  stdExamAnsCast = this.stdExamAns$.asObservable();
  public examList = new BehaviorSubject<any>([]);

  public xmResponseSubject = new BehaviorSubject<any>(null);
  xmResponseSubjectObserver = this.xmResponseSubject.asObservable();
  public xmAnswerResponse$ = new BehaviorSubject<any>(null);
  xmAnswerResponseCast = this.xmAnswerResponse$.asObservable();

  
/*   private getMyExamsByClassIdURL =
            environment.alert_skool_url + "/exam/getMyExamsByClassId"; */
  private getAnswerPapersForTeacherByExamIdUrl =
            environment.alert_skool_url + "/exam/getAnswerPapersForTeacherByExamId";
  private getStudentsAttendedInExamUrl =
            environment.alert_skool_url + "/exam/getStudentsAttendedInExam";
  private examResultPublishUrl =
            environment.alert_skool_url + "/exam/examResultPublish";
  private startExamForStudentsUrl =
            environment.alert_skool_url + "/exam/startExamForStudents";
 /*  private getStudentAnswerPaperByExamIdURL =
          environment.alert_skool_url + "/exam/getStudentAnswerPaperByExamId"; */
  private scoreStudentExamPaperUrl =
          environment.alert_skool_url + "/exam/scoreStudentExamPaper";  
  
  public showStudentScoreList$ = new BehaviorSubject<any>(null);
  showStudentScoreListCast = this.showStudentScoreList$.asObservable();
  public showStudentExamAttendedList$ = new BehaviorSubject<any>(null);
  showStudentExamAttendedListCast = this.showStudentExamAttendedList$.asObservable();              
/* 
  public xmAnswerResponse$ = new BehaviorSubject<any>(null);
  xmAnswerResponseCast = this.xmAnswerResponse$.asObservable(); */

  constructor(private http: HttpClient) { }


  getMyExamsByClassId(class_id, role, sub_id) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log(
      "<===========Get getMyExamsByClassIdservice is called============>"
    );

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    if (!sub_id) sub_id = "";
    // class_id = '8973e1a0-7312-11ea-96f1-6d2c86545d91' /////temp
    // let url = "http://localhost:4010/api/v1/exam/getMyExamsByClassId?class_id=" + class_id
    //           + "&&role="+role + "&&subject_id=" + sub_id
    let url =
      this.getMyExamsByClassIdURL +
      "?class_id=" +
      class_id +
      "&&role=" +
      role +
      "&&subject_id=" +
      sub_id;
    return this.http.get(url, httpOptions).pipe(
      map((x:any) => x),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  getExamByBranchDeptAndYear(query, year?) {
    console.log(
      "<===========Get Exams By Branch, Dept. And Year service is called============>"
    );
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
    let url = this.getExamByBranchDeptAndYearURL 
    if(query.branch_id) url += "?branch_id=" + query.branch_id
    if(query.dept_id) url += "&dept_id=" + query.dept_id
    if(query.class_id) url += "&class_id=" + query.class_id

    return this.http.get(url, httpOptions).pipe(
      map((x: any) => {
        var count = 1;
        if (x.resultset.length > 0) {
          x.resultset.forEach((x) => {
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

  deleteExam(exam) {
    console.log("<===========Exam Delete Service Called===========>")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
  let examobj = {
         class_teacher_subject_pk_id: exam.class_teacher_subject_pk_id,
         id: exam.id
       }

  let body = {
    exam_ids: []
   }

  body.exam_ids.push(examobj);
  return this.http.post(this.deleteExamUrl, body,httpOptions).pipe(
    map((x:any) => x),
    catchError((error: Response) => {
      return throwError(error);
    })
  );
   }
   
   insertQuestion(model) {
    console.log("<===========insertQuestion service is fired============>");
    if (model.teacher_name) model.teacehr_name = model.teacher_name;
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    //fire request
    return this.http.post(this.insertQuestionUrl, model, httpOptions).pipe(
      map((x:any) => x),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  insertExam(model) {
    console.log(model);
    console.log("<===========insesrtExam service is fired============>");
    if (model.teacher_name) model.teacehr_name = model.teacher_name;

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    //fire request
    return this.http.post(this.insertExamUrl, model, httpOptions).pipe(
      map((x:any) => {
        console.log(x);
        return x;
      }),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  
  updateExam(exam) {

    console.log("<===========Exam update service called===========>")

    let updateEModel = {
      class_teacher_subject_pk_id: exam.class_teacher_subject_pk_id,
      id: exam.id,
      name: exam.name,
      exam_type: exam.exam_type,
      exam_type_name: exam.exam_type_name,
      period_in_minute: exam.period_in_minute.toString(),
      exam_date: new Date(exam.exam_date).getTime(),
      start_time: exam.start_time,
      end_time: exam.end_time,
    }

    console.log(updateEModel)

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: JSON.parse(localStorage.getItem('token'))
    })
  };
    return this.http.post(this.updateExamURL, updateEModel, httpOptions).pipe(
      map((x:any) => x),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  updateQuestion(question) {

    console.log("<===========Question update service called===========>")

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: JSON.parse(localStorage.getItem('token'))
    })
  };
    return this.http.post(this.updateQuestionURL, question, httpOptions).pipe(
      map((x:any) => x),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  getByExamId(exam_id, is_live_exam? : boolean) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log("<===========Get getByExamId is called============>");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
    //this.getByExamIdURL = 'http://localhost:4010/api/v1/exam/getByExamId'
    let url
    if(is_live_exam == undefined || is_live_exam == null)
    url = this.getByExamIdURL + "?exam_id=" + exam_id
    else url = this.getByExamIdURL + "?exam_id=" + exam_id + "&&is_live_exam=" + is_live_exam
    
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((x:any) => {
          this.xmResponseSubject.next(x);
          return x;
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }
 /*  getMyExamsByClassId(class_id, role, sub_id) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log(
      "<===========Get getMyExamsByClassIdservice is called============>"
    );

    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.currentUser.access_token);

    if (!sub_id) sub_id = "";   

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
    // class_id = '8973e1a0-7312-11ea-96f1-6d2c86545d91' /////temp
    // let url = "http://localhost:4010/api/v1/exam/getMyExamsByClassId?class_id=" + class_id
    //           + "&&role="+role + "&&subject_id=" + sub_id
    let url =
      this.getMyExamsByClassIdURL +
      "?class_id=" +
      class_id +
      "&&role=" +
      role +
      "&&subject_id=" +
      sub_id;
    return this.http.get(url, httpOptions).pipe(
      map((x) => x),
      catchError((error: Response) => {
        return throwError(error.json());
      })
    );
  } */
  getAnswerPapersForTeacherByExamId(exam_id) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log(
      "<===========Get getStudentAnswerPapersByExamId is called============>"
    );
/* 
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.currentUser.access_token);

    let options = new RequestOptions({ headers: headers }); */

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    
    //let url = "http://localhost:4010/api/v1/exam/getAnswerPapersForTeacherByExamId?exam_id=9f6379d0-87ad-11ea-acbe-0c27283bf15a"
    //exam_id = '9f6379d0-87ad-11ea-acbe-0c27283bf15a'
    let url = this.getAnswerPapersForTeacherByExamIdUrl + "?exam_id=" + exam_id;

    return this.http.get(url, httpOptions).pipe(
      map((x) => x),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  getStudentsAttendedInExamByExamId(exam_id, role) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log(
      "<===========Get getStudentsAttendedInExamByExamId is called============>"
    );
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

  

    //let url = "http://localhost:4010/api/v1/exam/getAnswerPapersForTeacherByExamId?exam_id=9f6379d0-87ad-11ea-acbe-0c27283bf15a"
    //exam_id = '9f6379d0-87ad-11ea-acbe-0c27283bf15a'
    let url = this.getStudentsAttendedInExamUrl + "?exam_id=" + exam_id + "&role=" + role;

    return this.http.get(url, httpOptions).pipe(
      map((x) => x),
      catchError((error: Response) => {
        return throwError(error.json());
      })
    );
  }
  examResultPublish(exam_id) {
    console.log(
      "<===========examResultPublish service is fired============>"
    );

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
    
    let model = {
      exam_id: exam_id
    };
    
    //fire request
    return this.http.post(this.examResultPublishUrl, model, httpOptions).pipe(
      map((x) => x),
      map((x) => {
        return x;
      }),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }
  startExamForStudents(exam_id) {
    console.log(
      "<===========startExamForStudents service is fired============>"
    );

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };   

    let model = {
      exam_id: exam_id,
      is_started_for_stds: true
    };
    //this.publishUnpublishExamUrl = 'http://localhost:4010/api/v1/exam/publishUnpublishExam'
    //fire request
    return this.http.post(this.startExamForStudentsUrl, model, httpOptions).pipe(
      map((x) => x),
      map((x) => {
        return x;
      }),
      catchError((error: Response) => {
        return throwError(error.json());
      })
    );
  }

 /*  getStudentAnswerPaperByExamId(exam_id, student_id?) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log(
      "<===========Get getStudentAnswerPaperByExamId is called============>"
    );

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    }; 
    
    if(!student_id) student_id = this.currentUser.id;
   

    //this.getStudentAnswerPaperByExamIdURL = 'http://localhost:4010/api/v1/exam/getStudentAnswerPaperByExamId'

    return this.http
      .get(
        this.getStudentAnswerPaperByExamIdURL +
          "?exam_id=" +
          exam_id +
          "&&student_id=" +
          student_id,
        httpOptions
      )
      .pipe(
        map((x) => {
          this.xmAnswerResponse$.next(x);
          return x;
        }),
        catchError((error: Response) => {
          return throwError(error.json());
        })
      );
  }
 */
  scoreStudentExamPaper(model) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<===========Get scoreStudentExamPaper is called============>");
    console.log(JSON.stringify(model));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    
    //this.scoreStudentExamPaperUrl = 'http://localhost:4010/api/v1/exam/scoreStudentExamPaper'
    return this.http.post(this.scoreStudentExamPaperUrl, model, httpOptions).pipe(
      map((x:any) => {
        return x;
      }),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  insertStudentAnswerPaper(model) {
    console.log(
      "<===========insertStudentAnswerPaper service is fired============>"
    );

    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    //fire request
    return this.http
      .post(this.insertStudentAnswerPaperUrl, model, httpOptions)
      .pipe(
        map((x:any) => x),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  getStudentAnswerPaperByExamId(exam_id, student_id?) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log(
      "<===========Get getStudentAnswerPaperByExamId is called============>"
    );

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
    if(!student_id) student_id = this.currentUser.id;

    return this.http
      .get(
        this.getStudentAnswerPaperByExamIdURL +
          "?exam_id=" +
          exam_id +
          "&&student_id=" +
          student_id,
        httpOptions
      )
      .pipe(
        map((x:any) => {
          this.xmAnswerResponse$.next(x);
          return x;
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }


}
