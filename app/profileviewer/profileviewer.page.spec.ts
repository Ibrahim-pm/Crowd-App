import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileviewerPage } from './profileviewer.page';

describe('ProfileviewerPage', () => {
  let component: ProfileviewerPage;
  let fixture: ComponentFixture<ProfileviewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileviewerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileviewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
