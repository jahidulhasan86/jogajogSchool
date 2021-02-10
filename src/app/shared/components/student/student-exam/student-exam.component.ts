import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from 'src/app/shared/services/exam_services/exam.service';
import * as $ from "jquery";
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit, AfterViewInit, OnChanges {

  public loader = false 
  public todayExamList = []
  public upcommingExamList = []
  public allExamList = []
 
  public allDoneExamList = []
  @Input() sendSubject: any;
  constructor(private exmService : ExamService,private router:Router,private spinner:NgxSpinnerService) { }

  ngAfterViewInit(): void {
    // $("#fullpage").fullpage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ccc',changes)
    if (changes.sendSubject) {
      this.ngOnInit();
      document.getElementById('std-exam-list').click()
    }
  }

  ngOnInit() {
    console.log('s',this.sendSubject[0].class_id)
    
    // this.chatService.stdClassSummaryViewSelected.next(false);
    // this.chatService.xmMenuSelected.next(true);
    // this.chatService.liveXmMenuSelected.next(false);
    // this.chatService.viewXmMenuSelected.next(false);
    // this.chatService.openChattingWindow$.next(false);
    // this.chatService.teacherXmMenuSelected.next(false);
    // this.chatService.teacherViewXmMenuSelected.next(false);
    // this.chatService.dashboard$.next(false);
    console.log('exam list page')

    this.exmService.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    
    //$('#ans_sheet').hide()
    this.exmService.stdExamAnsCast.subscribe(res=>{
        if(!res) {
            $('#ans_sheet').hide()
            return 
        }
        //this.loadAnswerExams()
        let objDom =  document.getElementById('examHist')
        if(objDom) objDom.click()
    })
    let stdinfo 
    if(this.exmService.currentUser.role.role_name == "Student" && this.exmService.currentUser.student_info)
    {
      stdinfo = this.exmService.currentUser.student_info
      this.spinner.show();
      this.exmService.getMyExamsByClassId(this.sendSubject[0].class_id, this.exmService.currentUser.role.role_name,this.sendSubject[0].id).subscribe(result => {
        if (result) {
          this.spinner.hide();
          console.log('exam_with_sub_id',result)
          this.loader = false
          result.resultset.forEach(e => {
            let exmDate = new Date(e.exam_date)
            let day_of_week = exmDate.getDay()
            if(day_of_week == 0) e.day_of_week = 'Sunday'
            if(day_of_week == 1) e.day_of_week = 'Monday'
            if(day_of_week == 2) e.day_of_week = 'Tuesday'
            if(day_of_week == 3) e.day_of_week = 'Wednesday'
            if(day_of_week == 4) e.day_of_week = 'Thurseday'
            if(day_of_week == 5) e.day_of_week = 'Friday'
            if(day_of_week == 6) e.day_of_week = 'Saturday'
          });
          this.allExamList = result.resultset
          this.allDoneExamList = result.resultset.filter(q=>q.status == 'Done' || q.status=='Expired' || q.status=='Result Published')
          this.upcommingExamList=result.resultset.filter(x=>new Date(x.exam_date).toLocaleDateString() != new Date().toLocaleDateString() && x.status=='Upcoming')
          this.todayExamList = this.allExamList.filter(x=>new Date(x.exam_date).toLocaleDateString() == new Date().toLocaleDateString() && (x.status=='Ongoing' || x.status=='Upcoming'))

          
        }
      }, err => {
        this.spinner.hide();
        console.log(err)
        this.loader = false
        if (err.code == 404) {
          Swal.fire({
            title: `No exams are found`,
            icon: "warning",
            timer: 2000,
          });
        }
      })
    }
  }

  loadAnswerExams()
  {
    $('#my_exam').hide()
    $('#ans_sheet').show()

  }
  loadExams()
  {
    $('#my_exam').show()
    $('#ans_sheet').hide()

    this.exmService.stdExamAns$.next(false)
  }
 
  
  navigateToTarget(target,id){    
    this.router.navigate([`/student/${target}`]);
    localStorage.setItem("current_xm_id",id);
    // this.chatService.stdClassSummaryViewSelected.next(false);
    // this.chatService.xmMenuSelected.next(false);
    // this.chatService.liveXmMenuSelected.next(true);
    // this.chatService.openChattingWindow$.next(false);
    // this.chatService.viewXmMenuSelected.next(false);
    // this.chatService.teacherXmMenuSelected.next(false);
    // this.chatService.teacherViewXmMenuSelected.next(false);
    // this.chatService.dashboard$.next(false);
  }
 
  navigateToTargetViewMode(target,exam){    
    // console.log('exam',exam)
    this.router.navigate([`/student/${target}`]);
    let obj = {
      id : exam.id,
      name : exam.name,
      exam_type_name : exam.exam_type_name,
      score : exam.score,
      period_in_minute : exam.period_in_minute,
      obtained_score : exam.obtained_score

    }    
    localStorage.setItem("current_answer_xm", JSON.stringify( obj));
    // this.chatService.stdClassSummaryViewSelected.next(false);
    // this.chatService.xmMenuSelected.next(false);
    // this.chatService.liveXmMenuSelected.next(false);
    // this.chatService.openChattingWindow$.next(false);
    // this.chatService.viewXmMenuSelected.next(true);
    // this.chatService.teacherXmMenuSelected.next(false);
    // this.chatService.teacherViewXmMenuSelected.next(false);
    // this.chatService.dashboard$.next(false); 
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

}
