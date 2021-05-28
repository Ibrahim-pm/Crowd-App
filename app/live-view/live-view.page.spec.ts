import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiveViewPage } from './live-view.page';

describe('LiveViewPage', () => {
  let component: LiveViewPage;
  let fixture: ComponentFixture<LiveViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
