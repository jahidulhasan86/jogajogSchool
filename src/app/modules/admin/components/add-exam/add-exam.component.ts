import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Subscription, fromEvent } from "rxjs";
import Swal from "sweetalert2";
// import { Class } from "../class/class.component";
import { exam_type_name } from "../add-exam/exam_type_name";
import * as $ from "jquery";
import { map, debounceTime, startWith, distinctUntilChanged } from "rxjs/operators";
import { ExamService } from "src/app/shared/services/exam_services/exam.service";
import { AdminService } from "src/app/shared/services/admin_services/admin.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-add-exam",
  templateUrl: "./add-exam.component.html",
  styleUrls: ["./add-exam.component.css"],
})
export class AddExamComponent implements OnInit  {

  // @ViewChild('startTime') startTime: ElementRef;
  // @ViewChild('endTime') endTime: ElementRef;
  startTimeUIBind: string;
  public examModel = {
    id: "",
    name: "",
    exam_type: "1",
    exam_type_name: "CT",
    year: "",
    branch_id: "",
    dept_id: "",
    class_teacher_subject_pk_id: "",
    class_id: "",
    teacher_id: "",
    class_name: "",
    teacher_name: "",
    subject_name: "",
    period_in_minute: "",
    per_page_total_question: "",
    set_of_questions: [],
    score: "",
    is_exam_published: false,
    exam_published_date: undefined,
    exam_date: undefined,
    start_time: undefined,
    end_time: undefined,
    timezone: "",
    remarks: "",
  };

  public questionModel = {
    id: "",
    question: "",
    answer_with_type: "1",
    answer_with_type_name: "mcq",
    answer_limit: "",
    mcq_optinos: [],
    answer: "",
    score: undefined,
    branch_id: "",
    dept_id: "",
    class_teacher_subject_pk_id: "",
    subject_name: "",
    class_id: "",
    class_name: "",
    teacher_id: "",
    teacher_name: "",
    serial_no: undefined
  };

  answer_types: any = [
    {
      id: "1",
      value: "MCQ",
    },
    {
      id: "2",
      value: "Textbox",
    },
  ];

  option1: any;
  option2: any;
  option3: any;
  option4: any;

  option1View: any = false;
  option2View: any = false;
  option3View: any = false;
  option4View: any = false;

  public loader = false;
  public examSetupView = true;
  mcqView: boolean = true;
  textView: boolean = false;
  option;
  selectedAnsRadioGlobal: any;
  questionCount = 1;

  public subjectObj;
  private subscriptions: Array<Subscription> = [];
  selectedBranch: any;
  selectedDepartment: any;
  classes: any;
  subjects: any;
  exam_type_name = [];
  public exam_type_name_obj;
  selectedClass: any;
  examListView = true
  sUser: any;
  count = 0

  endTimePickerUIBind = ''
  startTimePickerUIBind = ''
  QScoreLimit: any;
  examData: any;
  isExamTypeOpen = true
  lastQType: string = 'mcq';
  submittedQScore: any;
  dateNow = new Date().toISOString().slice(0, 10);
  min_start_time: any

  current_page = 1;
  records_per_page = 1;

  submittedQuestions = []
  is_first_submitted_Q_view: boolean = true;
  is_submitted_Q_view: boolean = false;
  qLength: number;
  qCount = 0
  isTextBox: boolean = false;
  component_name_for_child = 'add_class'
  optionReset = 0
  selectedSubject: any;

  constructor(
    private examService: ExamService,
    private adminService: AdminService,
    private spinner: NgxSpinnerService
  ) {
    this.examModel.set_of_questions = [];
    this.exam_type_name = exam_type_name;
  }

  ngOnInit() {
    this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
  }

  ngAfterViewInit() {
  }

  deptReceived(event) {
    this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    this.selectedBranch = event.branch
    if (this.selectedBranch && this.selectedDepartment){
      this.examModel.branch_id = this.selectedBranch.id;
      this.examModel.dept_id = this.selectedDepartment.id;
      let teacher_id: any;
      if (this.sUser.role.role_name === 'Teacher') {
        teacher_id = this.sUser.teacher_info.user_id;
      }
      this.getClassByDeptId(this.selectedDepartment.id, teacher_id);
    }
  }

  

  resetExamSetupField() {
    Object.keys(this.examModel).forEach((key) => {
      key == 'is_exam_published' ? this.examModel[key] = false :
        key == 'set_of_questions' ? this.examModel[key] = [] :
          key == 'exam_type' ? this.examModel[key] = '1' :
            key == 'exam_type_name' ? this.examModel[key] = 'CT' :
              key == 'exam_published_date' ? this.examModel[key] = undefined :
                key == 'exam_date' ? this.examModel[key] = undefined :
                  key == 'start_time' ? this.examModel[key] = undefined :
                    key == 'end_time' ? this.examModel[key] = undefined : this.examModel[key] = ''
    });

    const start_time = (<HTMLInputElement>document.getElementById('start_time'))
    if (!!start_time) start_time.value = ''
    this.endTimePickerUIBind = ''
    this.examSetupView = true;

    this.isExamTypeOpen = false
    this.exam_type_name = []

    setTimeout(() => {
      if (this.exam_type_name.length == 0) {
        this.exam_type_name = exam_type_name
        this.isExamTypeOpen = true
      }
    }, 1500);

    // this.adminService.allReset.next(true)
    this.optionReset++

    console.log(this.examModel)
  }

  resetQuestionSetupField() {
    Object.keys(this.questionModel).forEach((key) => {
      key == 'mcq_optinos' ? this.questionModel[key] = [] :
        key == 'score' ? this.questionModel[key] = undefined :
          key == 'serial_no' ? this.questionModel[key] = undefined :
            key == 'answer_with_type' ? this.questionModel[key] = '1' :
              key == 'answer_with_type_name' ? this.questionModel[key] = 'mcq' : this.questionModel[key] = ''
    });

    this.option1 = "";
    this.option2 = "";
    this.option3 = "";
    this.option4 = "";
    this.option = null;
    this.option1View = false;
    this.option2View = false;
    this.option3View = false;
    this.option4View = false;

    if (this.lastQType === 'mcq') {
      this.mcqView = false;
      this.textView = false;
      setTimeout(() => {
        this.mcqView = true;
      }, 500);
    } else if (this.lastQType === 'textbox') {
      this.questionModel.answer_with_type = '2'
      this.questionModel.answer_with_type_name = 'textbox'
      this.mcqView = false;
      this.textView = false;
      setTimeout(() => {
        this.textView = true;
      }, 500);
    }

    this.selectedAnsRadioGlobal = null;

    console.log(this.questionModel)
  }

  datePickerEvent(date) {
    this.min_start_time = ''
    this.startTimePickerUIBind = ''

     if(!this.examData){
      this.endTimePickerUIBind = ''
      //  this.examModel.end_time = undefined
     }
   
   

    if (this.dateNow == date) {
      this.min_start_time = new Date().toLocaleTimeString()
      this.startTimePickerUIBind = this.min_start_time
    }
    if (this.dateNow !== date) {
      this.min_start_time = '12:00 am'
      this.startTimePickerUIBind = '12:00 am'
    }

    setTimeout(() => {
      this.startTimePickerUIBind = ''
    }, 50);

    console.log(this.dateNow, date)
  }

  timeSelector(event, src) {
    const exam_date = this.examModel.exam_date
    if (src == 'start_time') {
      this.examModel.start_time = new Date((`${exam_date} ${event}`).replace(/-/g, '/')).getTime()
      if (!!this.examModel.period_in_minute)
        this.endTimeBindByDuration(this.examModel.start_time, this.examModel.period_in_minute)
    }
    if (src == 'end_time') {
      this.examModel.end_time = new Date((`${exam_date} ${event}`).replace(/-/g, '/')).getTime()
      // if (this.examModel.start_time)
      //   this.durationBindByEndTime(this.examModel.end_time - this.examModel.start_time)
    }
  }

  endTimeBindByDuration(start_time, duration) {
    if (!!duration) {
      let st = start_time
      this.examModel.end_time = (st += (Number(duration) * 60000))
      if (!!this.examModel.end_time) this.endTimePickerUIBind = new Date(this.examModel.end_time).toLocaleTimeString()
    } else {
      this.examModel.end_time = undefined
      this.endTimePickerUIBind = ''
    }
  }

  durationBindByEndTime(duration) {
    if (Math.sign(duration) === 1) {
      this.examModel.period_in_minute = (duration / 60000).toString()
    } else {
      this.examModel.period_in_minute = ''
      this.examModel.end_time = undefined
      this.endTimePickerUIBind = ''
    }
  }

  durationEvent(e) {
    if (this.count == 0 && !!this.examModel.start_time)
      this.endTimeBindByDuration(this.examModel.start_time, e.target.value)
    this.count = 1
    const duration = document.getElementById('duration')
    fromEvent(duration, 'input').pipe(
      map((e) => (<HTMLInputElement>e.target).value),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((result) => {
      console.log(result)
      this.count = 1
      if (!!this.examModel.start_time)
        this.endTimeBindByDuration(this.examModel.start_time, result)
    })
  }

  examScoreEvent(value) {
    this.QScoreLimit = Number(value)
  }

  questionScoreEvent(value, isSubmitted?) {
    if (!isSubmitted) {
      if (Number(value) > this.QScoreLimit) {
        Swal.fire({
          title: "Exam score is: " + this.examModel.score,
          text: "Current Question score set limit is : " + this.QScoreLimit,
          icon: "warning",
          showConfirmButton: false,
          timer: 2500
        });
      }
    } else {
      if (Number(value) == Number(this.submittedQScore)) {
        this.questionModel.score = value
      }

      if (Number(value) > Number(this.submittedQScore)) {
        if (this.QScoreLimit == 0) {
          Swal.fire({
            title: "Exam score limt exceed",
            icon: "warning",
            showConfirmButton: false,
            timer: 2500
          });
          this.questionModel.score = this.submittedQScore
        }
        if (this.QScoreLimit != 0) {

          Swal.fire({
            title: `Current score to set is ${this.QScoreLimit}`,
            text: `Can adjust ${this.QScoreLimit} marks for this question`,
            icon: "warning",
            showConfirmButton: false,
            timer: 2500
          });

          if (Number(value) == Number(this.submittedQScore) + this.QScoreLimit) {
            this.questionModel.score = value
          }
          if (Number(value) > Number(this.submittedQScore) + this.QScoreLimit) {
            this.questionModel.score = this.submittedQScore
          }
          if (Number(value) < Number(this.submittedQScore) + this.QScoreLimit) {
            this.questionModel.score = value
          }
        }
      } else {
        this.questionModel.score = value
      }
    }
  }

  classSelector(value, doEmpty?) {
     // doEmpty = true/false > empty the list
     this.selectedClass = value
    console.log(value)
    if (doEmpty) {
      this.examModel.class_id = null;
    } else {
      this.examModel.class_id = value.id;
      if (this.examModel.class_id)
        this.getClassWiseSubjectsAndTeachersByClassId(this.examModel.class_id);
    }
  }

  subjectSelector(e, doEmpty?) { // doEmpty = true/false > empty the list
    this.selectedSubject = e
    console.log(this.selectedSubject)
    if (doEmpty) {
      // this.subjectObj = e;
      this.examModel.class_teacher_subject_pk_id = null;
      this.examModel.teacher_name = null;
      this.examModel.teacher_id = null;
      this.examModel.subject_name = null;
      this.examModel.class_name = null;
    } else {
      // this.subjectObj = e;
      this.examModel.class_teacher_subject_pk_id = e.id;
      this.examModel.teacher_name = this.sUser.user_name;
      this.examModel.teacher_id = this.sUser.id;
      this.examModel.subject_name = e.subject_name;
      this.examModel.class_name = e.class_name;
    }
  }

  examTypeSelector(value) {
    this.exam_type_name.forEach((x) => {
      if (x.viewValue === value) {
        this.examModel.exam_type_name = x.viewValue
        this.examModel.exam_type = x.value;
      }
    })
  }

  errorMsg(qScore) {
    if (qScore == 0) {
      Swal.fire({
        title: "Exam score already set to all question",
        text: `Can't set new question for ${this.examModel.name} exam`,
        icon: "warning",
        showConfirmButton: false,
        timer: 2500
      });
    } else {
      if (this.questionModel.score > this.QScoreLimit) {
        Swal.fire({
          title: "Question score limt exceed",
          text: `Set ${this.QScoreLimit} marks question to set ${this.examModel.name} exam`,
          icon: "warning",
          showConfirmButton: false,
          timer: 2500
        });
      }

      if (this.questionModel.score < this.QScoreLimit) {
        Swal.fire({
          title: `Exam score is ${this.examModel.score}`,
          text: `Set ${this.QScoreLimit} marks question to set ${this.examModel.name} exam`,
          icon: "warning",
          showConfirmButton: false,
          timer: 2500
        });
      }

      if (!this.questionModel.score) {
        Swal.fire({
          title: "Required field missing",
          icon: "warning",
          timer: 2000
        });
      }
    }
  }

  questionTypeChange(value) {
    this.answer_types.forEach(x => {
      if (x.value === value) {
        this.questionModel.answer_with_type = x.id
        this.questionModel.answer_with_type_name = value.toLowerCase();
        this.questionModel.answer_limit = ''
        this.questionModel.answer = ''
        if (value === 'MCQ') {
          this.mcqView = true;
          this.textView = false;
          this.option1View = false;
          this.option2View = false;
          this.option3View = false;
          this.option4View = false;

          this.lastQType = 'mcq'

        } else {
          this.mcqView = false;
          this.textView = true;

          this.lastQType = 'textbox'
        }
      }
    });
  }

  selectOptionCount(value) {
    if (value != "0") {
      this.questionModel.answer_limit = value;
    } else {
      this.questionModel.answer_limit = "";
    }

    if (value == "0") {
      this.option1View = false;
      this.option2View = false;
      this.option3View = false;
      this.option4View = false;

      // new 
      this.option1 = "";
      this.option2 = "";
      this.option3 = "";
      this.option4 = "";
    }
    if (value == "1") {
      this.option1View = true;
      this.option2View = false;
      this.option3View = false;
      this.option4View = false;

      // new 
      this.option2 = "";
      this.option3 = "";
      this.option4 = "";
    }
    if (value == "2") {
      this.option1View = true;
      this.option2View = true;
      this.option3View = false;
      this.option4View = false;

      // new 
      this.option3 = "";
      this.option4 = "";
    }
    if (value == "3") {
      this.option1View = true;
      this.option2View = true;
      this.option3View = true;
      this.option4View = false;

      // new
      this.option4 = "";
    }
    if (value == "4") {
      this.option1View = true;
      this.option2View = true;
      this.option3View = true;
      this.option4View = true;
    }
  }

  selectAnswer(value?) {
    if (value) {
      this.selectedAnsRadioGlobal = value;
      this.isTextBox = false
    }
    if (this.selectedAnsRadioGlobal == "1") {
      this.questionModel.answer = this.option1;
    }
    if (this.selectedAnsRadioGlobal == "2") {
      this.questionModel.answer = this.option2;
    }
    if (this.selectedAnsRadioGlobal == "3") {
      this.questionModel.answer = this.option3;
    }
    if (this.selectedAnsRadioGlobal == "4") {
      this.questionModel.answer = this.option4;
    }
    console.log(this.questionModel.answer);
  }

  readyMcqQuestion() {
    this.questionModel.mcq_optinos = [];
    if (this.option1)
      this.questionModel.mcq_optinos.push({ name: this.option1 });
    if (this.option2)
      this.questionModel.mcq_optinos.push({ name: this.option2 });
    if (this.option3)
      this.questionModel.mcq_optinos.push({ name: this.option3 });
    if (this.option4)
      this.questionModel.mcq_optinos.push({ name: this.option4 });
  }

  _activeClick(event) {
    event.currentTarget.classList.remove('tab-default');
    event.currentTarget.classList.add('tab-active');
    var pageListlist = document.getElementsByClassName('page-link')
    for (let i = 0; i < pageListlist.length; i++) {
      pageListlist[i].classList.remove('tab-active');
      pageListlist[i].classList.add('tab-default');
    }
    event.currentTarget.classList.remove('tab-default');
    event.currentTarget.classList.add('tab-active');
  }

  switchToExamActivity(type) {
    if (type == 'exams') {
      this.examListView = true
      this.resetExamSetupField()
      this.examData = undefined
    } else {
      this.examListView = false
    }
    // else {
    //   console.log('no activity selected')
    // }
  }

  goToExamSetupViewToggle() {
    if (this.examSetupView) {
      if (this.examModel.branch_id && this.examModel.dept_id
        && this.examModel.class_id && this.examModel.class_name && this.examModel.class_teacher_subject_pk_id
        && this.examModel.name && this.examModel.subject_name && this.examModel.period_in_minute
        && this.examModel.per_page_total_question && this.examModel.score && this.examModel.teacher_id
        && this.examModel.teacher_name && this.examModel.exam_type && this.examModel.exam_type_name
        && this.examModel.exam_date && this.examModel.start_time && this.examModel.end_time
      ) {
        this.examSetupView = !this.examSetupView;
      } else {
        Swal.fire({
          title: "Required Field Missing",
          icon: "warning",
        });
      }
    } else {
      this.examSetupView = !this.examSetupView;
    }
    console.log(this.examModel)
  }

  finalSubmit() {
    if (this.questionModel.question) {
      this.insertQuestion('from_last_question_submit');
    } else {
      if (this.questionModel.score == this.QScoreLimit) {
        if (this.questionModel.question) {
          this.insertExam();
        }
        if (!this.questionModel.question) {
          Swal.fire({
            title: "Question name required",
            icon: "warning",
            timer: 2000
          });
        }
      }
    }

    if (this.QScoreLimit == 0) this.insertExam();
  }

  getClassByDeptId(id, teacher_id?) {
    this.loader = true;
      this.adminService.getClassByDeptId(id, teacher_id).subscribe(
        (result) => {
          if (result.status == 'ok') {
             this.loader = false;
             this.classes = result.resultset;
            if (this.classes.length > 0) {
              this.selectedClass = this.classes[0];
              this.classSelector(this.classes[0])
            } else {
              this.classes = [{ id: '0', name: 'No Classes Found' }];
              this.selectedClass = this.classes[0];
              this.classSelector(this.classes[0].id, true)
              //Class list empty means the subject list also empty. so that i do empty subject here.
              this.subjects = [{ id: '0', subject_name: 'No Subjects Found' }];
              this.selectedSubject = this.subjects[0]
              this.subjectSelector(this.subjects[0], true)
            }

          }
        },
        (err) => {
          // this.classes = []
          console.log(err);
          this.loader = false;
          if (err.code == 404) {
            Swal.fire({
              title: `No class found for ${this.selectedDepartment.name} department`,
              icon: "warning",
              timer: 2000,
            });
          }
        }
      )
 
  }
  

  getClassWiseSubjectsAndTeachersByClassId(id) {
    let query = "class_id=" + id;
    this.subscriptions.push(
      this.adminService
        .getClassWiseSubjectsAndTeachersByClassId(query)
        .subscribe(
          (result) => {
            if (result.status == "ok") {
              console.log("teacher list by class_id", result);
              this.subjects = result.result;
              if (this.subjects.length > 0) {
                if (this.sUser.role.role_name.toLowerCase() !== 'admin') {
  
                  // this.subjects = this.subjects.filter(subject => subject.teachers.include() == this.sUser.id);
                  let subjects=[];
                  this.subjects.forEach(e=>{
                  let teachers = [];
                  e.teachers.forEach(t=>{
                  teachers.push(t.teacher_id);
                  })
                  if (teachers.includes(this.sUser.id)){
                  subjects.push(e);
                  }
                  })
                  this.subjects = subjects;
                  this.selectedSubject = this.subjects[0]
                  this.subjectSelector(this.subjects[0]);
                  
                  if (this.subjects.length == 0) {
                  this.subjects = [{ id: '0', subject_name: 'No Subjects Found' }]
                  this.selectedSubject = this.subjects[0]
                  this.subjectSelector(this.subjects[0]);
                  }
                  }
             
              } else {
                this.subjects = [{ id: '0', subject_name: 'No Subjects Found' }];
                this.selectedSubject = this.subjects[0]
                this.subjectSelector(this.subjects[0], true)
              }
            }
          },
          (err) => {
            console.log(err);
          }
        )
    );
  }

  insertQuestion(src?) {
    delete this.questionModel.id;
    if (this.mcqView) {
      this.readyMcqQuestion();
    }
    this.questionModel.question;

    this.questionModel.mcq_optinos = this.mcqView ? this.questionModel.mcq_optinos : [];
    this.questionModel.answer = this.mcqView ? this.questionModel.answer : "";

    if (!!this.questionModel.answer_limit) this.questionModel.answer_limit = this.questionModel.answer_limit.toString();

    this.questionModel.dept_id = this.examModel.dept_id;
    this.questionModel.branch_id = this.examModel.branch_id;
    this.questionModel.teacher_id = this.examModel.teacher_id;
    this.questionModel.teacher_name = this.examModel.teacher_name;
    this.questionModel.class_id = this.examModel.class_id;
    this.questionModel.class_name = this.examModel.class_name;
    this.questionModel.subject_name = this.examModel.subject_name;
    this.questionModel.class_teacher_subject_pk_id = this.examModel.class_teacher_subject_pk_id;
    this.questionModel.serial_no = this.questionCount

    if (!!this.questionModel.question) {
      if ((this.questionModel.answer_with_type == '1' && this.questionModel.mcq_optinos.length > 1 && !!this.questionModel.answer) || (this.questionModel.answer_with_type == '2' && !!this.questionModel.answer_limit)) {
        if (this.questionModel.score <= this.QScoreLimit && !!this.questionModel.score) {
          if (!!this.questionModel.score) this.questionModel.score = this.questionModel.score.toString();
          this.questionModel.serial_no = this.questionModel.serial_no.toString()
          this.examService.insertQuestion(this.questionModel).subscribe(
            (result) => {
              if (result.status == "ok") {
                console.log(result)

                this.QScoreLimit = this.QScoreLimit - Number(this.questionModel.score)
                this.submittedQuestions.push(result.result)
                console.log(this.submittedQuestions)

                this.examModel.set_of_questions.push(result.result.id);

                if (this.QScoreLimit != 0) {
                  this.questionCount++;
                }

                this.resetQuestionSetupField();

                if (src === 'from_last_question_submit') {
                  this.insertExam();
                }

              }
            },
            (err) => {
              console.log(err);
              Swal.fire({
                title: "Something went wrong",
                icon: "warning",
                timer: 2000
              });
            }
          );
        } else {
          console.log(this.questionModel)
          if (this.questionModel.score > this.QScoreLimit) {
            Swal.fire({
              title: "Question score limt exceed",
              icon: "warning",
              timer: 2000
            });
          }

          if (!this.questionModel.score) {
            Swal.fire({
              title: "Question score required",
              icon: "warning",
              timer: 2000
            });
          }
        }
      } else {
        console.log(this.questionModel)
        if (this.questionModel.answer_with_type == '1') {
          if (this.questionModel.mcq_optinos.length == 0 && !this.questionModel.answer) {
            Swal.fire({
              title: "MCQ options with answer required",
              icon: "warning",
              timer: 2000
            });
          }
          if (this.questionModel.mcq_optinos.length > 1 && !this.questionModel.answer) {
            Swal.fire({
              title: "Answer required",
              icon: "warning",
              timer: 2000
            });
          }
          if (this.questionModel.mcq_optinos.length == 1 && !this.questionModel.answer) {
            Swal.fire({
              title: "Minimum 2 MCQ option and answer required",
              icon: "warning",
              timer: 2000
            });
          }
          if (this.questionModel.mcq_optinos.length == 1 && !!this.questionModel.answer) {
            Swal.fire({
              title: "Minimum 2 MCQ option required",
              icon: "warning",
              timer: 2000
            });
          }
        } else {
          Swal.fire({
            title: "Answer limit required",
            icon: "warning",
            timer: 2000
          });
        }
      }
    } else {
      console.log(this.questionModel)
      Swal.fire({
        title: "Question name required",
        icon: "warning",
        timer: 2000
      });
    }
  }

  insertExam() {
    console.log('exam model from insert function', this.examModel)
    delete this.examModel.id;
    this.examModel.exam_date = new Date(this.examModel.exam_date).getTime();
    // this.examModel.exam_published_date = this.examModel.exam_date;
    this.examModel.is_exam_published = true;
    this.examModel.period_in_minute = this.examModel.period_in_minute.toString();
    this.examModel.per_page_total_question = this.examModel.per_page_total_question.toString();
    this.examModel.score = this.examModel.score.toString();
    var d = new Date();
    var year = d.getFullYear();
    this.examModel.year = year.toString();
    this.examService.insertExam(this.examModel).subscribe(
      (result) => {
        if (result.status == "ok") {
          this.resetExamSetupField();
          this.questionCount = 1;
          Swal.fire({
            title: "Exam Successfully Created.",
            icon: "success",
            timer: 2000
          });

          console.log(JSON.stringify(this.submittedQuestions))
        }
      },
      (err) => {
        console.log(err);
        Swal.fire({
          title: "Something went wrong",
          icon: "warning",
          timer: 2000
        });
      }
    );
  }

  updateQuestion() {
    if (this.mcqView) {
      this.readyMcqQuestion();
    }

    delete this.questionModel.serial_no

    if (this.isTextBox == true && !!this.questionModel.answer && this.questionModel.answer_with_type == '1') {
      this.questionModel.answer = ''
    }

    let adjust_score: any

    if (!!this.questionModel.question) {
      if ((this.questionModel.answer_with_type == '1' && this.questionModel.mcq_optinos.length > 1 && !!this.questionModel.answer) || (this.questionModel.answer_with_type == '2' && !!this.questionModel.answer_limit)) {
        if (!!this.questionModel.score) {

          if (this.questionModel.score > this.submittedQScore) {
            adjust_score = this.questionModel.score - this.submittedQScore
            if (this.QScoreLimit == adjust_score) {
              this.QScoreLimit = 0
            } else {
              this.QScoreLimit = this.QScoreLimit - adjust_score
            }
          } else {
            adjust_score = this.submittedQScore - this.questionModel.score
            this.QScoreLimit += adjust_score
          }

          if (this.questionModel.answer_with_type == '2') this.questionModel.answer = ''

          this.questionModel.answer_limit = this.questionModel.answer_limit.toString()
          this.questionModel.score = this.questionModel.score.toString()

          this.examService.updateQuestion(this.questionModel).subscribe((result) => {
            if (result.status == 'ok') {
              Swal.fire({
                title: "Question Updated",
                icon: "success",
                timer: 1500
              });
              if (!!result.result) {
                for (var i = 0; i < this.submittedQuestions.length; i++) {
                  if (result.result.id === this.submittedQuestions[i].id) {
                    this.submittedQuestions[i].question = result.result.question
                    this.submittedQuestions[i].answer_with_type = result.result.answer_with_type
                    this.submittedQuestions[i].answer_with_type_name = result.result.answer_with_type_name
                    this.submittedQuestions[i].score = result.result.score
                    this.submittedQuestions[i].answer_limit = result.result.answer_limit
                    this.submittedQuestions[i].answer = result.result.answer
                    this.submittedQuestions[i].mcq_optinos = result.result.mcq_optinos
                    this.submittedQScore = result.result.score
                    break
                  }
                }
              }
              console.log(result)
            }
          }, err => {
            Swal.fire({
              title: "Something went wrong",
              icon: "warning",
              timer: 2000
            });
            console.log(err)
          })
        } else {
          if (!this.questionModel.score) {
            Swal.fire({
              title: "Question score required",
              icon: "warning",
              timer: 2000
            });
          }
        }
      } else {
        if (this.questionModel.answer_with_type == '1') {
          if (this.questionModel.mcq_optinos.length == 0 && !this.questionModel.answer) {
            Swal.fire({
              title: "MCQ options with answer required",
              icon: "warning",
              timer: 2000
            });
          }
          if (this.questionModel.mcq_optinos.length > 1 && !this.questionModel.answer) {
            Swal.fire({
              title: "Answer required",
              icon: "warning",
              timer: 2000
            });
          }
          if (this.questionModel.mcq_optinos.length == 1 && !this.questionModel.answer) {
            Swal.fire({
              title: "Minimum 2 MCQ option and answer required",
              icon: "warning",
              timer: 2000
            });
          }
          if (this.questionModel.mcq_optinos.length == 1 && !!this.questionModel.answer) {
            Swal.fire({
              title: "Minimum 2 MCQ option required",
              icon: "warning",
              timer: 2000
            });
          }
        } else {
          Swal.fire({
            title: "Answer limit required",
            icon: "warning",
            timer: 2000
          });
        }
      }
    } else {
      Swal.fire({
        title: "Question name required",
        icon: "warning",
        timer: 2000
      });
    }
  }

  // for submitted question show
  prevPage() {
    if (this.current_page > 1) {
      this.current_page--;
      this.qLength++
      this.changePage(this.current_page);
    }
  }

  nextPage() {
    if (this.current_page < this.numPages()) {
      this.current_page++;
      this.qLength--
      this.changePage(this.current_page);
    }
  }

  changePage(page) {

    this.option1View = false;
    this.option2View = false;
    this.option3View = false;
    this.option4View = false;

    this.option = null
    this.option1 = ""
    this.option2 = ""
    this.option3 = ""
    this.option4 = ""
    this.questionModel.answer = ''

    if (this.qCount == 0) {
      this.submittedQuestions.reverse()
      this.qLength = this.submittedQuestions.length
      this.qCount = 1
      // page_span.innerHTML = this.qLength.toString();
    }

    this.is_first_submitted_Q_view = false
    this.is_submitted_Q_view = true

    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    // var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > this.numPages()) page = this.numPages();

    for (var i = (page - 1) * this.records_per_page; i < (page * this.records_per_page); i++) {

      this.questionModel.question = this.submittedQuestions[i].question
      this.questionModel.answer_with_type = this.submittedQuestions[i].answer_with_type
      this.questionModel.answer_with_type_name = this.submittedQuestions[i].answer_with_type_name
      this.questionModel.score = this.submittedQuestions[i].score
      this.questionModel.answer_limit = this.submittedQuestions[i].answer_limit
      this.questionModel.answer = this.submittedQuestions[i].answer
      this.questionModel.class_teacher_subject_pk_id = this.submittedQuestions[i].class_teacher_subject_pk_id
      this.questionModel.id = this.submittedQuestions[i].id
      this.questionModel.mcq_optinos = this.submittedQuestions[i].mcq_optinos
      this.questionModel.branch_id = this.submittedQuestions[i].branch_id
      this.questionModel.dept_id = this.submittedQuestions[i].dept_id
      this.questionModel.class_id = this.submittedQuestions[i].class_id
      this.questionModel.subject_name = this.submittedQuestions[i].subject_name
      this.questionModel.class_name = this.submittedQuestions[i].class_name
      this.questionModel.teacher_id = this.submittedQuestions[i].teacher_id
      this.questionModel.teacher_name = this.submittedQuestions[i].teacher_name

      this.submittedQScore = this.submittedQuestions[i].score

      if (this.questionModel.answer_with_type == '1') {

        setTimeout(() => {
          $('#options').val(this.questionModel.answer_limit);
        }, 500);

        this.mcqView = true
        this.textView = false

        this.isTextBox = false

        if (this.questionModel.answer_limit == '2') {
          this.option1View = true;
          this.option2View = true;
          this.option3View = false;
          this.option4View = false;

          this.option1 = this.submittedQuestions[i].mcq_optinos[0].name
          this.option2 = this.submittedQuestions[i].mcq_optinos[1].name
        }

        if (this.questionModel.answer_limit == '3') {
          this.option1View = true;
          this.option2View = true;
          this.option3View = true;
          this.option4View = false;

          this.option1 = this.submittedQuestions[i].mcq_optinos[0].name
          this.option2 = this.submittedQuestions[i].mcq_optinos[1].name
          this.option3 = this.submittedQuestions[i].mcq_optinos[2].name
        }

        if (this.questionModel.answer_limit == '4') {
          this.option1View = true;
          this.option2View = true;
          this.option3View = true;
          this.option4View = true;

          this.option1 = this.submittedQuestions[i].mcq_optinos[0].name
          this.option2 = this.submittedQuestions[i].mcq_optinos[1].name
          this.option3 = this.submittedQuestions[i].mcq_optinos[2].name
          this.option4 = this.submittedQuestions[i].mcq_optinos[3].name
        }

        if (this.questionModel.answer) {
          if (this.questionModel.answer === this.option1) {
            setTimeout(() => {
              document.getElementById('SQ1').click()
            }, 500);

          }
          if (this.questionModel.answer === this.option2) {
            setTimeout(() => {
              document.getElementById('SQ2').click()
            }, 500);
          }
          if (this.questionModel.answer === this.option3) {
            setTimeout(() => {
              document.getElementById('SQ3').click()
            }, 500);
          }
          if (this.questionModel.answer === this.option4) {
            setTimeout(() => {
              document.getElementById('SQ4').click()
            }, 500);
          }
        }

      } else {
        this.mcqView = false
        this.textView = true

        this.isTextBox = true

        this.option1View = false;
        this.option2View = false;
        this.option3View = false;
        this.option4View = false;

        this.option1 = ""
        this.option2 = ""
        this.option3 = ""
        this.option4 = ""
        this.option = null
        this.questionModel.answer = ''
      }
    }

    // page_span.innerHTML = Qlength.toString();

    if (page == 1) {
      btn_prev.style.visibility = "hidden";
    } else {
      btn_prev.style.visibility = "visible";
    }

    if (page == this.numPages()) {
      btn_next.style.visibility = "hidden";
    } else {
      btn_next.style.visibility = "visible";
    }

    console.log(this.questionModel)
  }

  numPages() {
    return Math.ceil(this.submittedQuestions.length / this.records_per_page);
  }

  backtoQSetupView() {

    this.submittedQuestions.reverse()

    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");

    this.is_first_submitted_Q_view = true
    this.is_submitted_Q_view = false
    this.current_page = 1;
    this.qCount = 0
    btn_next.style.visibility = "visible";
    this.isTextBox = false

    this.resetQuestionSetupField()

  }

  receiveExamData(event) {
    this.examListView = false
    this.examData = event
    console.log('examData', this.examData)
    this.spinner.show()
    if (!!this.examData) {

      // this.endTimePickerUIBind = new Date(this.examData.end_time).toLocaleTimeString();
      // this.startTimeUIBind = new Date(this.examData.start_time).toLocaleTimeString()

      this.examModel.name = this.examData.name
      this.examModel.exam_type = this.examData.exam_type
      this.examModel.exam_type_name = this.examData.exam_type_name
      this.examModel.period_in_minute = this.examData.period_in_minute
      this.examModel.exam_date = new Date(this.examData.exam_date).toISOString().slice(0, 10)
      this.examModel.start_time = new Date(this.examData.start_time).getTime()
      this.examModel.end_time = new Date(this.examData.end_time).getTime()

      setTimeout(() => {
        this.classes = [{ id: '0', name: this.examData.class_name }];
        this.subjects = [{ id: '0', subject_name: this.examData.subject_name }];
        this.endTimePickerUIBind = new Date(this.examData.end_time).toLocaleTimeString();
        this.startTimeUIBind = new Date(this.examData.start_time).toLocaleTimeString()
        this.examModel.teacher_name = this.examData.teacehr_name
        this.examModel.score = this.examData.score
        this.examModel.per_page_total_question = this.examData.per_page_total_question

        this.examModel.class_teacher_subject_pk_id = this.examData.class_teacher_subject_pk_id
        this.examModel.id = this.examData.id

      }, 4000);

      setTimeout(() => {
        this.spinner.hide()
      }, 5000);
    }
  }

  updateExam() {
    console.log('exm', this.examModel)
    if (!this.examModel.name || !this.examModel.period_in_minute || !this.examModel.exam_date || !this.examModel.end_time || !this.examModel.start_time) {
      Swal.fire({
        title: "Required Field Missing",
        icon: "warning",
        timer: 2500
      });
    }
    else {
      if ((this.examModel.class_teacher_subject_pk_id == this.examData.class_teacher_subject_pk_id) && (this.examModel.id == this.examData.id)) {
        this.loader = true
        this.examService.updateExam(this.examModel).subscribe((result) => {
          if (result.status == 'ok') {
            console.log(result)
            Swal.fire({
              title: "Exam Successfully Updated ",
              icon: "success",
              timer: 2500
            });
            const viewExamList = document.getElementById('viewExamList')
            if (!!viewExamList) viewExamList.click()
            this.loader = false
          }
        }, err => {
          console.log(err)
          Swal.fire({
            title: "Exam Failed to Update",
            icon: "warning",
            timer: 1500
          });
          this.loader = false
        })
      }
    }


  }



}