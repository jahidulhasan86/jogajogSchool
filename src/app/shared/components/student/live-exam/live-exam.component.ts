import { Component, OnInit, AfterViewInit, OnDestroy, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from 'src/app/shared/services/exam_services/exam.service';
import { Option, Question, Quiz, QuizConfig } from 'src/models/index';
// import * as $ from "jquery";
import Swal from "sweetalert2";
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-live-exam',
  templateUrl: './live-exam.component.html',
  styleUrls: ['./live-exam.component.css'],
})
export class LiveExamComponent implements OnInit, AfterViewInit, OnDestroy {
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': false,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 7200,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': true,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 2,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00:00';
  remainingTime: any;
  duration = '7200';
  nextBtnText = "NEXT";
  // filteredQuestions: any = null;
  answerSheet = [];
  questionCount = 0;
  subId: NodeJS.Timeout;
  sub_id: string;
  constructor(public examService: ExamService, private router: Router, private spinner:NgxSpinnerService) { }
 
  @HostListener('unloaded')
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  ngAfterViewInit(): void {
    clearInterval(this.timer);
    let self = this;
    document.addEventListener('input', function (event) {
      let targetArea: any = event
      if (targetArea.target.tagName.toLowerCase() !== 'textarea') return;
      self._handleTextAreaSize(event.target);
    }, false);
  }

  ngOnInit() {
    this.questionCount = this.pager.size;
    // this.chatService.stdClassSummaryViewSelected.next(false);
    // this.chatService.xmMenuSelected.next(false);
    // this.chatService.liveXmMenuSelected.next(true);
    // this.chatService.viewXmMenuSelected.next(false);
    // this.chatService.openChattingWindow$.next(false);
    // this.chatService.teacherXmMenuSelected.next(false);
    // this.chatService.teacherViewXmMenuSelected.next(false);
    // this.chatService.dashboard$.next(false);
    let response: any;
    let xmId = localStorage.getItem("current_xm_id");
    this.loadQuiz(xmId);
    this.examService.xmResponseSubjectObserver.subscribe(xmRes => {
      if (xmRes) {
        response = xmRes
        this.quiz = new Quiz(response);
        !this.quiz.subject_name ? this.quiz.subject_name = response.result.subject_name : this.quiz.subject_name;
        !this.quiz.teacehr_name ? this.quiz.teacehr_name = response.result.teacehr_name : this.quiz.teacehr_name;
        !this.quiz.period_in_minute ? this.quiz.period_in_minute = response.result.period_in_minute : this.quiz.period_in_minute;
        this.config.duration = parseInt(this.quiz.period_in_minute);
        this.pager.count = this.quiz.questions.length;
        this.startTime = new Date();
        this.ellapsedTime = '00:00:00';
        this.timer = setInterval(() => { this.tick(); }, 1000);
        this.duration = this.parseTime(this.config.duration);
        this.mode = 'quiz';
        // this.filteredQuestions = (this.quiz.questions) ?
        //   this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
      }
    })

  }

  loadQuiz(xmId: string) {
    if (!xmId) return
    this.spinner.show();
    let response: any;
    this.examService.getByExamId(xmId, true).subscribe(result => {
      this.spinner.hide();
      if (result.status == 'ok') {
        response = result
      }
    }, err => {
      console.log(err)
    })
  }

  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    // this.remainingTime = this.config.duration - diff;
    if (diff >= (this.config.duration * 60)) {
      //Examination Time Up
      this.onSubmit(true);
    }

    this.remainingTime = (this.config.duration * 60) - diff;
    this.ellapsedTime = this.parseTime(this.remainingTime);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === "1") {
      let ansProp: any;
      question.options.forEach((op) => {
        if (op.id !== option.id) {
          ansProp = {
            "question_id": question.id,
            "answer_with_type": question.questionTypeId,
            "answer_with_type_name": question.answer_with_type_name,
            "answer": option.name
          }
        }
      });
      if (this.answerSheet.length > 0) {
        this.answerSheet = this.answerSheet.filter(item => item.question_id !== ansProp.question_id)
      }
      this.answerSheet.push(ansProp)
    } else if (question.questionTypeId === "2") {
      let optionText: any;
      optionText = option;
      let ansProp = {
        "question_id": question.id,
        "answer_with_type": question.questionTypeId,
        "answer_with_type_name": question.answer_with_type_name,
        "answer": optionText.target.value
      }
      if (this.answerSheet.length > 0) {
        this.answerSheet = this.answerSheet.filter(item => item.question_id !== ansProp.question_id)
      }
      this.answerSheet.push(ansProp)
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
    console.log("given ans===== " + this.answerSheet)
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
    this.questionCount = this.questionCount + this.filteredQuestions.length
  }


  onSubmit(isAutoSubmit?) {
    let answerModel = {
      exam_id: this.quiz.id,
      branch_id: this.quiz.branch_id,
      dept_id: this.quiz.dept_id,
      class_id: this.quiz.class_id,
      answers: this.answerSheet
    }
    if (answerModel.answers.length > 0 && !isAutoSubmit) {
      let self = this;
      Swal.fire({
        title: "Are you sure to submit?",
        text: "Your will not be able to modeify this answer sheet.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then(function (x) {
        if (x.value) {
          self.submitXmPaper(answerModel, isAutoSubmit)
        }
      })
    } else {
      if (!isAutoSubmit) {
        let self = this;
        Swal.fire({
          title: "Unanswered! Are you sure to submit?",
          text: "Your will not be able to modeify this answer sheet.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        }).then(function (x) {
          if (x.value) {
            self.submitXmPaper(answerModel, isAutoSubmit)
          }
        })
      } else {
        this.submitXmPaper(answerModel, isAutoSubmit)
      }
    }
  }

  submitXmPaper(answerModel, isAutoSubmit?) {
    // let myXmMenu = document.getElementById("myExams");
    this.spinner.show();
    this.examService.insertStudentAnswerPaper(answerModel).subscribe(xmRes => {
      this.spinner.hide();
      if (xmRes.status == 'ok') {
        // myXmMenu.click();
        localStorage.removeItem("current_xm_id");
        clearInterval(this.timer);
        if (!isAutoSubmit) {
          Swal.fire({
            title: "Answer Submitted Successfully!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          })
          this.backToExamList()
        } else {
          Swal.fire({
            title: "Examination Time Up!",
            icon: "info",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          })
        }

      }
    }, err => {
      // myXmMenu.click();
      this.spinner.hide();
      clearInterval(this.timer);
      if (!isAutoSubmit) {
        Swal.fire({
          title: "Error! " + err.message.en,
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        })
      } else {
        Swal.fire({
          title: "Examination Time Up!",
          icon: "info",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        })
      }

    })
  }

  backToExamList(){
    this.router.navigate([`/student`]).then((x) => {
      if (!!x) {
        this.goToExams()
      }
    }).catch((e) => {
      console.log(e)
    })
  }

  goToExams(){
    this.subId = setInterval(() => {
      this.sub_id = localStorage.getItem("selected_subject_id");
      const subject_id = document.getElementById(this.sub_id)
      if (!!subject_id) {
        subject_id.click()
        clearTimeout(this.subId)
      }
    }, 1000)
  }

  _handleTextAreaSize(field) {
    field.style.height = 'inherit';
    var computed = window.getComputedStyle(field);
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
      + parseInt(computed.getPropertyValue('padding-top'), 10)
      + field.scrollHeight
      + parseInt(computed.getPropertyValue('padding-bottom'), 10)
      + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    field.style.height = height + 'px';
  }
}
