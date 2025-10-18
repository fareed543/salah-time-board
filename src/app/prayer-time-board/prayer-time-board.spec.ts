import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerTimeBoard } from './prayer-time-board';

describe('PrayerTimeBoard', () => {
  let component: PrayerTimeBoard;
  let fixture: ComponentFixture<PrayerTimeBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayerTimeBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrayerTimeBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
