import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UiConfig } from '../../../assets/uiconfig';
import { GlobalValue } from '../../global'
@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})
export class SignupSuccessComponent implements OnInit {
  globalValue;
  constructor() { }

  ngOnInit() {
    UiConfig.prototype.responsive()
    this.globalValue = GlobalValue  
  }

}
