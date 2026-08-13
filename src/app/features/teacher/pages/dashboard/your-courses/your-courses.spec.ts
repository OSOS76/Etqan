import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCourses } from './your-courses';

describe('YourCourses', () => {
  let component: YourCourses;
  let fixture: ComponentFixture<YourCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourCourses],
    }).compileComponents();

    fixture = TestBed.createComponent(YourCourses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
