import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LivevideoPage } from './livevideo.page';

describe('LivevideoPage', () => {
  let component: LivevideoPage;
  let fixture: ComponentFixture<LivevideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivevideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LivevideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
