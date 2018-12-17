import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryBuilderComponent } from './story-builder.component';

describe('StoryBuilderComponent', () => {
  let component: StoryBuilderComponent;
  let fixture: ComponentFixture<StoryBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
