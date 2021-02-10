import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-layout',
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.css'],
  host: {
    "(window:resize)": "onResize($event)"
  }
})
export class StudentLayoutComponent implements OnInit {
  sidebar_open: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.uiModify()
    setTimeout(() => {
      this.uiModify()
     }, 500);
  }

  onResize(e) {
    this.uiModify()
  }

  uiModify(){
    let windowHeight = window.innerHeight
    document.getElementById('sidenav_container').style.height = windowHeight - 64 + "px"
    document.getElementById('side-nav').style.height = windowHeight -64 + "px"
  }
  sideNavbarToggle(e){
    this.sidebar_open = e
    }

}
