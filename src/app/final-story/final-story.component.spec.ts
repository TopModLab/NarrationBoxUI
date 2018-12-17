import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalStoryComponent } from './final-story.component';

describe('FinalStoryComponent', () => {
  let component: FinalStoryComponent;
  let fixture: ComponentFixture<FinalStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
