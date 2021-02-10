import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructor-layout',
  templateUrl: './instructor-layout.component.html',
  styleUrls: ['./instructor-layout.component.css'],
  host: {
    "(window:resize)": "onResize($event)"
  }
})
export class InstructorLayoutComponent implements OnInit {
  sidebar_open: boolean = true;

  constructor() { }
  onResize(e) {
    this.uiModify()
  }

  ngOnInit(): void {
     setTimeout(() => {
      this.uiModify()
      this.uiModify()
     }, 500);
  
  }
  uiModify(){
    // let windowHeight = window.innerHeight
    document.getElementById('sidenav_container').style.height = window.innerHeight - 64 + "px";
    document.getElementById('side-nav').style.height = window.innerHeight -64 + "px"
  }
  sideNavbarToggle(e){
    this.sidebar_open = e
    }
}
