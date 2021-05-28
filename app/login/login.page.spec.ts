import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { loginPage } from './login.page';

describe('loginPage', () => {
  let component: loginPage;
  let fixture: ComponentFixture<loginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ loginPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(loginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
