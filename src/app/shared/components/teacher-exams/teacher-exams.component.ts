import {
    Component,
    OnInit,
    AfterViewInit,
    HostListener,
    OnDestroy,
    Input,
  } from "@angular/core";
  
  import { ExamService } from "../../services/exam_services/exam.service";
  import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
  
  import * as $ from "jquery";
  import Swal from "sweetalert2";
  import { Subscription } from "rxjs";  
  import { NgxSpinnerService } from "ngx-spinner";
  @Component({
    selector: "app-teacher-exams",
    templateUrl: "./teacher-exams.component.html",
    styleUrls: ["./teacher-exams.component.css"],
  })
  export class TeacherExamsComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() subject:any;
    public loader = false;
    public todayExamList = [];
    public allExamList = [];
    public allExamListForDropDown = [];
    public allUpcommingList = [];
    private subscriptions: Array<Subscription> = [];
    classes;
    subjects;
    selectedBranch;
    branch_id;
    selectedDepartment;
    dept_id;
    class_id;
    class_teacher_subject_pk_id;
  
    public allDoneExamList = [];
    sUser: any;
    switchToviewStr: any = 'my_exams';
    selectedClass:any;
    selectedSubject : any;
    selectedExam: any;
    attendedInExamObj: any;
    globalValue: any;
    attendedInExamlist: any =[];
    is_result_published = false
    showView: any;
    component_name_for_child = 'add_class';
    subject_name:string;
  
    constructor(
      
      private exmService: ExamService,
      private router: Router,
      private spinner: NgxSpinnerService
      
    ) {}
    @HostListener("window:resize", ["$event"])
    onResize(event) {
      this.uiModification();
    }
  
    ngAfterViewInit(): void {
      this.uiModification();
      $("#teacher_exam_list").show();
    }
  
    backtoexamlist() {
      $("#teacher_exam_list").show();
      this.getTeacherExams();
    }
  
    uiModification() {
      $("#fullpage").css(
        "height",
        window.innerHeight - ($(".header").height() + 10)
      );
    }
  
    public isScored = false;
  
    ngOnInit() {
      this.exmService.currentUser = JSON.parse(
        localStorage.getItem("sessionUser")
      );
      this.subject_name = this.subject.subject_name;
      this.getTeacherExams();

      this.uiModification();
      this.subjects = [{ id: "0", subject_name: "List is empty" }];
      this.classes = [{ id: "0", name: "List is empty" }];
      this.allExamListForDropDown = [{ id: "0", name: "List is empty" }];
      this.examSelector(this.allExamListForDropDown[0]);
  
      this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
      $("#teacher_exam_list").show();
      
      localStorage.removeItem("StudentAnswersForScore");     
       
  
      console.log("exam list page");
  
      
    }
  
    ngOnDestroy() {
      this.subscriptions.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
    }
  
    navigateToTeacherExams(target) {
      localStorage.removeItem("current_xm_id");
      localStorage.removeItem("current_answer_xm");
      this.router.navigate(["/" + target]);
   
    }
  
    navigateToTargetViewMode(target, exam, is_option_save?) {
      this.router.navigate(["/" + target]);
  
      localStorage.setItem("current_xm_id", exam.id);
      
  
      this.optionsInfoStore(is_option_save)
    }
  
    public exam_name;
    public student_list = [];
  
    getStudentAnswers(exam) {
      this.loader = true;
      this.allDoneExamList = [];
      this.student_list = [];
      this.exam_name = exam.name;
      this.exmService.getAnswerPapersForTeacherByExamId(exam.id).subscribe(
        (result:any) => {
          if (result) {
            this.loader = false;
            this.allDoneExamList = result.resultset;
            result.resultset.forEach((e) => {
              if (!this.student_list.find((q) => q.student_id == e.student_id)) {
                let created = new Date(e.created);
                let day_of_week = created.getDay();
                if (day_of_week == 0) e.day_of_week = "Sunday";
                if (day_of_week == 1) e.day_of_week = "Monday";
                if (day_of_week == 2) e.day_of_week = "Tuesday";
                if (day_of_week == 3) e.day_of_week = "Wednesday";
                if (day_of_week == 4) e.day_of_week = "Thurseday";
                if (day_of_week == 5) e.day_of_week = "Friday";
                if (day_of_week == 6) e.day_of_week = "Saturday";
  
                let obj = {
                  student_id: e.student_id,
                  student_name: e.student_name,
                  created: e.created,
                  day_of_week: e.day_of_week,
                  exam_id: e.exam_id,
                  exam_name: this.exam_name,
                  answers_score: [],
                };
                this.student_list.push(obj);
              } else {
                let std = this.student_list.find(
                  (q) => q.student_id == e.student_id
                );
                let objScore = {
                  question_id: e.question_id,
                  score_against_answer: e.score_against_answer,
                  std_answer: e.answer,
                  answer_with_type: e.answer_with_type,
                };
                let exist = std.answers_score.find(
                  (q) => q.question_id == e.question_id
                );
                if (!exist) std.answers_score.push(objScore);
              }
            });
          }
        },
        (err) => {
          console.log(err);
          this.loader = false;
          if (err.code == 404) {
            // Swal({
            //   title: `Students are not attended in "` + this.exam_name + ' "exam.',
            //   type: "warning",
            //   timer: 3000,
            // });
            this.allDoneExamList = [];
            this.student_list = [];
          }
        }
      );
    }
  
    getStudentsAttendedInExamByExamId(exam){    
      this.spinner.show();
      this.exam_name = exam.name;
      this.attendedInExamObj = null;
      this.attendedInExamlist = [];
      this.exmService.getStudentsAttendedInExamByExamId(exam.id, 'Teacher')
        .subscribe((result:any) => {
          setTimeout(() => {
            //this.exmService.selectedExamAfterScoring = null
        }, 6000);
          this.spinner.hide();
          if(result.status == 'ok'){
            this.attendedInExamObj = result.result;
            this.attendedInExamlist = result.result.student_list;
          }
        }, err => {
          this.spinner.hide();
          if (err.code == 404) {
            // Swal({
            //   title: `Students are not attended in "` + this.exam_name + ' "exam.',
            //   type: "warning",
            //   timer: 3000,
            // });
            this.spinner.hide();
            this.attendedInExamObj = null;
            this.attendedInExamlist = [];
          }
        })
    }
  
    getTeacherExams() {
      this.spinner.show();
      localStorage.removeItem("StudentAnswersForScore");
      this.allExamList = [];
      this.todayExamList = [];
      this.allUpcommingList = [];
      this.allExamListForDropDown = [];
      this.exmService
        .getMyExamsByClassId(
          this.subject.class_id,
          this.exmService.currentUser.role.role_name,
          this.subject.id
        )
        .subscribe(
          (result:any) => {
            if (result) {
              this.spinner.hide();
              result.resultset.forEach((e) => {
                let exmDate = new Date(e.exam_date);
                let day_of_week = exmDate.getDay();
                if (day_of_week == 0) e.day_of_week = "Sunday";
                if (day_of_week == 1) e.day_of_week = "Monday";
                if (day_of_week == 2) e.day_of_week = "Tuesday";
                if (day_of_week == 3) e.day_of_week = "Wednesday";
                if (day_of_week == 4) e.day_of_week = "Thurseday";
                if (day_of_week == 5) e.day_of_week = "Friday";
                if (day_of_week == 6) e.day_of_week = "Saturday";
              });
              this.allExamList = result.resultset;
              
              console.log(this.allExamList);
              if (this.allExamList.length == 0) {
                if(this.switchToviewStr == 'my_exams'){
                  Swal.fire({
                    title: `No exams are found`,
                    icon: "warning",
                    timer: 2000,
                  });
                }
  
                this.allExamListForDropDown = [{ id: "0", name: "List is empty" }];
                this.examSelector(this.allExamListForDropDown[0]);
              } else {
                this.todayExamList = this.allExamList.filter(
                  (x) =>
                    new Date(x.exam_date).toLocaleDateString() ==
                    new Date().toLocaleDateString()
                );
                this.allUpcommingList = this.allExamList.filter(
                  (x) =>
                    new Date(x.exam_date).toLocaleDateString() != new Date().toLocaleDateString()
                    && new Date(x.exam_date).getTime() > new Date().getTime()
                );
  
                if (this.allUpcommingList.length == 0 && this.todayExamList.length == 0) {
                if(this.switchToviewStr == 'my_exams'){
                    Swal.fire({
                      title: `No exams are found`,
                      icon: "warning",
                      timer: 2000,
                    });
                  }
                }
  
                this.allExamListForDropDown = result.resultset;
                if (localStorage.hasOwnProperty("optionsInfoBySelection")) {
                  this.allExamListForDropDown.map((exam) => {
                    if (JSON.parse(localStorage.getItem('optionsInfoBySelection')).exam.id === exam.id) {
                      this.selectedExam = exam
                    }
                  })
                } else {
                this.selectedExam = this.allExamListForDropDown[0]
                /* if(this.exmService.selectedExamAfterScoring && this.exmService.selectedExamAfterScoring.id){
                  let obj = this.allExamListForDropDown.find(q=>q.id == this.exmService.selectedExamAfterScoring.id)
                  if(obj) this.selectedExam = obj                
                } */
                }
  
                this.examSelector(this.selectedExam);
              }
            }
          },
          (err) => {
            this.spinner.hide();
            console.log(err);
            this.loader = false;
            if (err.code == 404) {
              if(this.switchToviewStr == 'my_exams'){
                Swal.fire({
                  title: `No exams are found`,
                  icon: "warning",
                  timer: 2000,
                });
              }
  
              this.allExamList = [];
              this.todayExamList = [];
              this.allUpcommingList = [];
              this.allExamListForDropDown = [{ id: "0", name: "List is empty" }];
              this.examSelector(this.allExamListForDropDown[0]);
            }
          }
        );
    }
  
   
  
    classSelectorFromClick(selectedCls) {
     /*  this.exmService.selectedExamAfterScoring = null
      this.classSelector(selectedCls.id)
  
      if (localStorage.hasOwnProperty("optionsInfoBySelection")) {
        localStorage.removeItem('optionsInfoBySelection')
    } */
  
    }
  
   
  
    subjectSelectorFromClick(selectedSub) {
      this.subjectSelector(selectedSub.id)
     // this.exmService.selectedExamAfterScoring = null
  
      if (localStorage.hasOwnProperty("optionsInfoBySelection")) {
        localStorage.removeItem('optionsInfoBySelection')
    }
    }
  
    subjectSelector(value) {
      this.class_teacher_subject_pk_id = value;
      this.selectedSubject = this.subjects.find(q=>q.id == value)
      if(!this.selectedSubject)
       alert('this.selectedSubject undefined : ' + value + '---' + JSON.stringify(this.subjects))
  
      this.allExamList = [];
      this.todayExamList = [];
      this.allUpcommingList = [];
      this.allExamListForDropDown = [];
      
  
      if(value != '0'){
        this.getTeacherExams()
      }
    }
  
    examSelector(exam){
      this.selectedExam = exam;
      this.is_result_published = this.selectedExam.is_result_published
      if(this.selectedExam.id != '0'){
        this.getStudentsAttendedInExamByExamId(this.selectedExam);
      } else {
        this.attendedInExamObj = null;
        this.attendedInExamlist = [];
      }
    }
  
    // publishExam(exam_id) {
    //   this.exmService.publishUnpublishExam(exam_id).subscribe(
    //     (result) => {
    //       if (result) {
    //         this.loader = false;
    //         Swal({
    //           title: `Exam successfully started. `,
    //           type: "warning",
    //           timer: 2000,
    //         });
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //       this.loader = false;
    //       Swal({
    //         title: `Exam was not started. Please try again later`,
    //         type: "warning",
    //         timer: 2000,
    //       });
    //     }
    //   );
    // }
  
    startNowExam(exam) {
      this.spinner.show();
      let today = new Date();
      let start_time: any = new Date(exam.start_time);
      var difference = start_time.getTime() - today.getTime();
      var differenceResultInMinutes = Math.round(difference / 60000);
      var MS_PER_MINUTE = 60000;
      var minimum_min_difference = 3; // trashhold time in min
      var actualStartTime = new Date(
        start_time - minimum_min_difference * MS_PER_MINUTE
      );
      
      if (differenceResultInMinutes <= minimum_min_difference) {
        this.exmService.startExamForStudents(exam.id).subscribe(
          (result) => {
            if (result) {

              this.spinner.hide();
              Swal.fire({
                title: `Exam successfully started. `,
                icon: "success",
                timer: 2000,
              });
              this.getTeacherExams();
            }
          },
          (err) => {
            console.log(err);
            this.loader = false;
            Swal.fire
            ({
              title: `Exam was not started. Please try again later`,
              icon: "warning",
              timer: 2000,
            });
          }
        );
      } else {
        Swal.fire({
          title:
            `You can only start this exam from ` +
            this.convertTime(
              actualStartTime.getHours() +
                ":" +
                actualStartTime.getMinutes() +
                ":" +
                actualStartTime.getSeconds()
            ),
          icon: "warning",
          timer: 2000,
        });
      }
    }
  
    convertTime(time) {
      var timeString = time;
      var H = +timeString.substr(0, 2);
      var h = H % 12 || 12;
      var ampm = H < 12 ? "AM" : "PM";
      timeString = h + timeString.substr(2, 3) + " " + ampm;
      return timeString; // return adjusted time or original string
    }
  
   
  
    loadAnswerAndScoreExams(std) {
      $("#teacher_exam_list").hide();
      
      localStorage.setItem("StudentAnswersForScore", JSON.stringify(std));
      this.navigateToTargetViewMode("/instructor/teacher-view-exam", { id: std.exam_id }, true);
    }
  
    loadAnswerAndScoreExamsForReview(std) {
      if(this.is_result_published) return
      $("#teacher_exam_list").hide();
      
      std.is_reviewed = true
      localStorage.setItem("StudentAnswersForScore", JSON.stringify(std));
      this.navigateToTargetViewMode("/instructor/teacher-view-exam", { id: std.exam_id }, true);
    }
  
    loadExams() {
      $("#teacher_exam_list").show();
      this.getTeacherExams();
    }
  
  
    switchToview(type) {
      this.switchToviewStr = type;    
      $("#teacher_exam_list").show();
      
      if(type == 'my_exams'){
        if (localStorage.hasOwnProperty("optionsInfoBySelection")) {
          localStorage.removeItem('optionsInfoBySelection')
    }
      }
  
    }
  
    _activeClick(event) {
      console.log("active event ", event);
      event.currentTarget.classList.remove("tab-default");
      event.currentTarget.classList.add("tab-active");
      var pageListlist = document.getElementsByClassName("page-link");
      for (let i = 0; i < pageListlist.length; i++) {
        pageListlist[i].classList.remove("tab-active");
        pageListlist[i].classList.add("tab-default");
      }
      event.currentTarget.classList.remove("tab-default");
      event.currentTarget.classList.add("tab-active");
    }
  
    publish_result() {
      let notscored = this.attendedInExamlist.filter(q=>!q.is_scored)
    if (notscored.length > 0) {
        Swal.fire({
          title: "Scoring is not finished yet for all attended students.",
          icon: "warning",
          timer:2000,
        });
        return
      }
      Swal.fire({
      title: "Are you sure to publish?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        this.exmService.examResultPublish(this.selectedExam.id).subscribe(
            (result:any) => {
              if (result.status == "ok") {  
                this.is_result_published = true              
                Swal.fire({
                  title: "Published successfully.",
                  icon: "success",
                  timer:2000
                });
              }
            },
            (err) => {
              Swal.fire({
                title: "Error! Submission failed. Please try again later.",
                icon: "error",
                timer:2000
              });
            }
          );
      }
    });
    }
  
    optionsInfoStore(is_option_save) {
      if (is_option_save) {
        if (this.sUser.role.role_name === "Teacher") {
          let optionsInfoBySelection = {
            dept: this.selectedDepartment,
            class: this.selectedClass,
            subject: this.selectedSubject,
            exam: this.selectedExam
  }
          if (!!optionsInfoBySelection)
            localStorage.setItem('optionsInfoBySelection', JSON.stringify(optionsInfoBySelection))
        }
      }
          
    }
    goToView(){
      this.router.navigate(['admin/exam_activity']);
    
    }
  
  }