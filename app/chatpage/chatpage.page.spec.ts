import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatpagePage } from './chatpage.page';

describe('ChatpagePage', () => {
  let component: ChatpagePage;
  let fixture: ComponentFixture<ChatpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
