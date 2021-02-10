import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatResourceLayoutStandaloneComponent } from './chat-resource-layout-standalone.component';

describe('ChatResourceLayoutStandaloneComponent', () => {
  let component: ChatResourceLayoutStandaloneComponent;
  let fixture: ComponentFixture<ChatResourceLayoutStandaloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatResourceLayoutStandaloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatResourceLayoutStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
