import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadHtmlComponent } from './download-html.component';

describe('DownloadHtmlComponent', () => {
  let component: DownloadHtmlComponent;
  let fixture: ComponentFixture<DownloadHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
