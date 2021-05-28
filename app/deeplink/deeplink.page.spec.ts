import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeeplinkPage } from './deeplink.page';

describe('DeeplinkPage', () => {
  let component: DeeplinkPage;
  let fixture: ComponentFixture<DeeplinkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeeplinkPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeeplinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
