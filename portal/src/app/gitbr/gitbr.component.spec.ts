import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitbrComponent } from './gitbr.component';

describe('GitbrComponent', () => {
  let component: GitbrComponent;
  let fixture: ComponentFixture<GitbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
