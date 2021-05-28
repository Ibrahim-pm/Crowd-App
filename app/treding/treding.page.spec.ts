import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TredingPage } from './treding.page';

describe('TredingPage', () => {
  let component: TredingPage;
  let fixture: ComponentFixture<TredingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TredingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TredingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
