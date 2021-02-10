import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  host: {
    "(window:resize)": "onResize($event)"
  }
})
export class AdminLayoutComponent implements OnInit {
  sidebar_open: boolean = true;

  constructor() { }

  onResize(e) {
    this.uiModify()
  }

  ngOnInit(): void {
      this.uiModify()
      setTimeout(() => {
        this.uiModify()
       }, 500);
  
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

