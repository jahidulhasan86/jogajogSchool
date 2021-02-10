import { Component, OnInit } from '@angular/core';
import { Option, Question, Quiz, QuizConfig } from 'src/models/index';
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { ExamService } from 'src/app/shared/services/exam_services/exam.service';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-exam',
  templateUrl: './view-exam.component.html',
  styleUrls: ['./view-exam.component.css']
})
export class ViewExamComponent implements OnInit {
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
  //filteredQuestions: any = null;
  letAnswerSheet = [];
  selecteExam: any
  preparedExamAnswer: any
  questionCount = 0;
  checked: boolean = true
  sUser: any;
  quest: any;
  subId: NodeJS.Timeout;
  sub_id: string;


  constructor(public examService: ExamService, private router: Router, private spinner: NgxSpinnerService) { }

  loadAnswers(xmId) {
    if (!xmId) return
    let response: any;
    this.spinner.show();
    this.examService.getStudentAnswerPaperByExamId(xmId).subscribe(result => {
      this.spinner.hide();
      if (result.status == 'ok') {
        response = result
      }
    }, err => {
      this.spinner.hide();  
      console.log(err)
    })

  }

  answer_model_creation(xmRes) {
    let obj = {
      id: this.selecteExam.id,
      name: this.selecteExam.name,
      exam_type_name: this.selecteExam.exam_type_name,
      score: this.selecteExam.score,
      obtained_score: this.selecteExam.obtained_score,
      period_in_minute: this.selecteExam.period_in_minute,
      class_teacher_subject_pk_id: xmRes[0].question_object.class_teacher_subject_pk_id,
      branch_id: xmRes[0].branch_id,
      class_id: xmRes[0].class_id,
      class_name: xmRes[0].question_object.class_name,
      dept_id: xmRes[0].dept_id,
      score_against_answer: xmRes[0].score_against_answer,
      teacehr_name: xmRes[0].question_object.teacehr_name,
      subject_name: xmRes[0].question_object.subject_name,
      questions: []
    }
    xmRes.forEach(e => {
      let ques = e.question_object
      if (ques) {
        ques.std_answer = e.answer ? e.answer : ''
        ques.score_against_answer = e.score_against_answer ? e.score_against_answer : ''
        obj.questions.push(ques)
      }
    })
    this.preparedExamAnswer = obj

  }

  ngOnInit() {
    console.log(this.quiz)
    // this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
    // console.log('user',this.sUser)
    // this.quizes = this.quizService.getAll();
    // this.quizName = this.quizes[0].id;
    this.questionCount = this.pager.size;
    // this.chatService.stdClassSummaryViewSelected.next(false);
    // this.chatService.xmMenuSelected.next(false);
    // this.chatService.liveXmMenuSelected.next(false);
    // this.chatService.openChattingWindow$.next(false);
    // this.chatService.viewXmMenuSelected.next(true);
    // this.chatService.teacherXmMenuSelected.next(false);
    // this.chatService.teacherViewXmMenuSelected.next(false);
    // this.chatService.dashboard$.next(false);

    let response: any;
    this.selecteExam = JSON.parse(localStorage.getItem("current_answer_xm"))
    this.loadAnswers(this.selecteExam.id);
    this.examService.xmAnswerResponseCast.subscribe(xmRes => {
      if (!xmRes) return
      if (xmRes && xmRes.resultset.length > 0) {
        this.answer_model_creation(xmRes.resultset)

        this.quiz = this.preparedExamAnswer
        this.pager.count = this.quiz.questions.length;
        this.mode = 'quiz';

        // this.filteredQuestions =  (this.quiz.questions) ?
        // this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
      }
    })

    setTimeout(() => {
      console.log('view exam', this.quiz)
      this.quest = this.quiz.questions
      console.log(this.quest)
      // console.log('aaa', this.quest[0].mcq_optinos)
      for (let i = 0; i < this.quest.length; i++) {
        let element = this.quest[i].mcq_optinos;
        if (!element) {
          continue
        }
        if (element.length == 2) {
          Object.assign(element[0], { 'option_no': 'A' })
          Object.assign(element[1], { 'option_no': 'B' })
        }
        if (element.length == 3) {
          Object.assign(element[0], { 'option_no': 'A' })
          Object.assign(element[1], { 'option_no': 'B' })
          Object.assign(element[2], { 'option_no': 'C' })
        }
        if (element.length == 4) {
          Object.assign(element[0], { 'option_no': 'A' })
          Object.assign(element[1], { 'option_no': 'B' })
          Object.assign(element[2], { 'option_no': 'C' })
          Object.assign(element[3], { 'option_no': 'D' })
        }
      }

    }, 2000)

  }

  loadQuiz(xmId: string) {
    if (!xmId) return
    let response: any;
    this.spinner.show();
    this.examService.getByExamId(xmId).subscribe(result => {
      this.spinner.hide();
      if (result.status == 'ok') {
        response = result
      }
    }, err => {
      this.spinner.hide();
      console.log(err)
    })
  }

  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    // this.remainingTime = this.config.duration - diff;
    if (diff >= (this.config.duration * 60)) {
      //Time Up
      this.onSubmit();
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

      // question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  backtostdexamlist() {
    //  this.sub_id = localStorage.getItem("selected_subject_id");
    this.router.navigate([`/student`]).then((x) => {
      if (!!x) {
        this.subjectIdCheck()
      }
    }).catch((e) => {
      console.log(e)
    })
    // this.chatService.stdClassSummaryViewSelected.next(false);
    // this.chatService.xmMenuSelected.next(true);
    // this.chatService.liveXmMenuSelected.next(false);
    // this.chatService.openChattingWindow$.next(false);
    // this.chatService.viewXmMenuSelected.next(false);
    // this.chatService.teacherXmMenuSelected.next(false);
    // this.chatService.teacherViewXmMenuSelected.next(false);
    // this.chatService.dashboard$.next(false);
    this.examService.stdExamAns$.next(true)
  }

  subjectIdCheck() {
    this.subId = setInterval(() => {
      this.sub_id = localStorage.getItem("selected_subject_id");
      const subject_id = document.getElementById(this.sub_id)
      const examHistId = document.getElementById('examHist')
      if (!!subject_id) {
        subject_id.click()
        examHistId.click()
        clearTimeout(this.subId)
      }
    }, 1000)
  }





  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
    this.questionCount = this.questionCount + this.filteredQuestions.length

    document.getElementById('viewscrollpanel').scrollTo(0, 0)
  }

  isAnswered(question: Question) {
    // return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    // return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    let answers = [];
    // this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    // Post your data to the server here. answers contains the questionId and the users' answer.
    console.log(this.quiz.questions);
    this.mode = 'result';
  }
}

