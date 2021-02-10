import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  fullyear: number;

  constructor() { }

  ngOnInit(): void {
    this.fullyear = new Date().getFullYear();
  }

}
