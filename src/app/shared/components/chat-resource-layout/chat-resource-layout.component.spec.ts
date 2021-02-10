import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatResourceLayoutComponent } from './chat-resource-layout.component';

describe('ChatResourceLayoutComponent', () => {
  let component: ChatResourceLayoutComponent;
  let fixture: ComponentFixture<ChatResourceLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatResourceLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatResourceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
