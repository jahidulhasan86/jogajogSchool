import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExamService } from 'src/app/shared/services/exam_services/exam.service';
import { Quiz, QuizConfig } from 'src/models';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit {
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
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': false,
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QuestionViewComponent>, private examService: ExamService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    if (this.data.id) this.getQuestionByExamId(this.data.id)
    let response: any;
    let xmId = localStorage.getItem("current_xm_id");
    this.examService.xmResponseSubjectObserver.subscribe(xmRes => {
      if (xmRes) {
        response = xmRes
        this.quiz = new Quiz(response);
        !this.quiz.subject_name ? this.quiz.subject_name = response.result.subject_name : this.quiz.subject_name;
        !this.quiz.teacehr_name ? this.quiz.teacehr_name = response.result.teacehr_name : this.quiz.teacehr_name;
        !this.quiz.period_in_minute ? this.quiz.period_in_minute = response.result.period_in_minute : this.quiz.period_in_minute;
        this.config.duration = parseInt("1");
        this.pager.count = this.quiz.questions.length;
        this.startTime = new Date();
        this.mode = 'quiz';
      }
    })
  }


  getQuestionByExamId(examId: string) {
    this.spinner.show()
    if (!examId) return
    let response: any;
    this.examService.getByExamId(examId).subscribe(result => {
      if (result.status == 'ok') {
        console.log(result)
        this.spinner.hide()
      }
    }, err => {
      console.log(err)
    })
  }


  get filteredQuestions() {
    console.log(this.quiz.questions)
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];

  }


  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
    this.questionCount = this.questionCount+this.filteredQuestions.length

  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSelect(value,event){

  }

}

