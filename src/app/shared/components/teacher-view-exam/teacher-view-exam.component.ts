import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Option, Question, Quiz, QuizConfig } from '../../../../models/index';
import { ExamService } from '../../../../app/shared/services/exam_services/exam.service';
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";

// import { setInterval, clearInterval } from 'timers';
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-teacher-view-exam',
  templateUrl: './teacher-view-exam.component.html',
  styleUrls: ['./teacher-view-exam.component.css']
})
export class TeacherViewExamComponent implements OnInit , AfterViewInit,OnDestroy {
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
  
  questionCount = 0;
  answerSheet = [];
  constructor( public router: Router, public examService: ExamService,  private spinner: NgxSpinnerService) { }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
  
  ngAfterViewInit(): void {
    clearInterval(this.timer);
  }
  public isScoring = false
  public isReviewing = false
  public stdAnswersForScoreModel : any
  public totalQuestions = 0


  
  backToTeacherExamList()
  {
     /*  this.navigateToTeacherExams('"TeacherExams"')
      if(this.isScoring) {       
        setTimeout(() => {
          const stdAttendExam = document.getElementById('stdAttendExam')
          if(!!stdAttendExam) stdAttendExam.click()
        }, 100);
      } */
      this.router.navigate(['/instructor']);

  }


  ngOnInit() {
    console.log('teacher exam view')
    

    let response: any;
    let xmId = localStorage.getItem("current_xm_id");
    this.loadQuiz(xmId);
    if(localStorage.getItem('StudentAnswersForScore'))
    {
      this.stdAnswersForScoreModel = JSON.parse( localStorage.getItem('StudentAnswersForScore'))            
      this.loadStudentAnswers(xmId,this.stdAnswersForScoreModel.student_id)
    }
    
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
        this.totalQuestions = this.quiz.questions.length
        //this.ellapsedTime = '00:00:00';
        //this.timer = setInterval(() => { this.tick(); }, 1000);
        //this.duration = this.parseTime(this.config.duration);
        this.mode = 'quiz';

        if(this.stdAnswersForScoreModel)
        {
          /**this portion for scoring by teacher */
          this.stdAnswersForScoreModel.exam_name = this.quiz.name
          this.isScoring = true
          if(this.stdAnswersForScoreModel.is_reviewed) this.isReviewing = true

          this.examService.xmAnswerResponseCast.subscribe(ansRes=>{
            if(!ansRes || ansRes.resultset.length == 0) return

            this.quiz.student_id_vw = this.stdAnswersForScoreModel.student_id
            this.quiz.student_name_vw = this.stdAnswersForScoreModel.student_name
            ansRes.resultset.forEach(e => {
              let ques = this.quiz.questions.find(q=>q.id == e.question_id)
              if(ques) {
                ques.std_answer_vw = e.answer
                if(ques.questionTypeId == '1' )
                {
                  if(ques.std_answer_vw == ques.answer)
                    ques.score_against_answer_vw = ques.score
                  else ques.score_against_answer_vw = '0'                  
                }
                if(this.isReviewing) ques.score_against_answer_vw = e.score_against_answer ? e.score_against_answer : '0'
              }
            });

          })
          

        }
        
          // this.filteredQuestions = (this.quiz.questions) ?
          // this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
      }
    })

    this.examService.showStudentScoreListCast.subscribe((res) => {
      if (!res) return;
      if(!localStorage.getItem("StudentAnswersForScore")) return
      localStorage.removeItem("StudentAnswersForScore")
      this.navigateToTeacherExams("TeacherExams"); 
      this.examService.showStudentExamAttendedList$.next(res)   
      this.examService.showStudentScoreList$.next(null)
      
    });

  }

  
  navigateToTeacherExams(target) {
    localStorage.removeItem("current_xm_id");
    localStorage.removeItem("current_answer_xm");
    this.router.navigate(["/" + target]);
  }
   

  loadStudentAnswers(xmId: string, student_id:string) {
    if (!xmId) return
    let response: any;
    this.examService.getStudentAnswerPaperByExamId(xmId,student_id).subscribe((result:any) => {
      if (result.status == 'ok') {
        response = result
      }
    }, err => {
      console.log(err)
    })
  }

  loadQuiz(xmId: string) {
    if (!xmId) return
    let response: any;
    this.spinner.show();
    this.examService.getByExamId(xmId).subscribe(result => {
      if (result.status == 'ok') {
        response = result;
        this.spinner.hide();
      }
    }, err => {
      console.log(err)
    })
  }


  get filteredQuestions() {
  console.log('questionL',this.quiz.questions)
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }



  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
    this.questionCount = this.questionCount+this.filteredQuestions.length
    document.getElementById('scrollpanel').scrollTo(0,0)

  }

  
  onMarksSelect(question: Question, event) {
      let value = event.target.value
      if(parseFloat( question.score) < parseFloat( value))
      {
        Swal.fire({
          title: `Obtained marks cannot be greater than question marks.`,
          icon: "warning"
        }).then(res=>{
          if(res) document.getElementById(question.id).focus()
        });
        //

      }

      this.quiz.questions.filter(q=>q.id == question.id)[0].score_against_answer_vw = value
    }


    saveScore()
    {
      let notscored = this.quiz.questions.filter(q=>!q.score_against_answer_vw)
      if(notscored.length > 0)
      {
        Swal.fire({
          title: "Scoring is not finished yet.",
          icon: "warning",
        });
        return
      }
      Swal.fire({
      title: "Are you sure to submit the score?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        // this.isSpinner = true;
        this.spinner.show();
        this.stdAnswersForScoreModel.answers_score=[]
        this.quiz.questions.forEach(e=>{
          let obj = {
            question_id : e.id,
            score_against_answer : e.score_against_answer_vw
          }
          this.stdAnswersForScoreModel.answers_score.push(obj)
        })
        this.examService.scoreStudentExamPaper(this.stdAnswersForScoreModel).subscribe(
            (result:any) => {
              if (result.status == "ok") {
                this.spinner.hide();
                this.examService.showStudentScoreList$.next(result.result)
                Swal.fire({
                  title: "Score is submitted successfully.",
                  icon: "success",
                });
              }
            },
            (err) => {
              this.spinner.hide();
              Swal.fire({
                title: "Error! Submission failed. Please try again later.",
                icon: "error",
              });
            }
          );
      }
    });
  }

    
  


}