import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-resource-layout-standalone',
  templateUrl: './chat-resource-layout-standalone.component.html',
  styleUrls: ['./chat-resource-layout-standalone.component.css']
})
export class ChatResourceLayoutStandaloneComponent implements OnInit {
  
  subject_id: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
   this.subject_id = this.route.snapshot.paramMap.get('id')
  }

}
