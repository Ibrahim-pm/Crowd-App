import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HashtredingPage } from './hashtreding.page';

describe('HashtredingPage', () => {
  let component: HashtredingPage;
  let fixture: ComponentFixture<HashtredingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HashtredingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HashtredingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
