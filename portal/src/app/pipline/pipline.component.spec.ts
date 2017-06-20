import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiplineComponent } from './pipline.component';

describe('PiplineComponent', () => {
  let component: PiplineComponent;
  let fixture: ComponentFixture<PiplineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiplineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
