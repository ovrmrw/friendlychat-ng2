/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { setTimeoutPromise, elements, elementText, elementValue } from '../../test-ng2/testing.helper';
/* <<< boilerplate */


////////////////////////////////////////////////////////////////////////
// modules
import { AppComponent } from '../../src/app/app.component';
import { AppService } from '../../src/app/app.service';

import { Observable } from 'rxjs/Rx';


////////////////////////////////////////////////////////////////////////
// mocks
class MockService {
  user = {};
  get currentUser$() {
    return Observable.of(this.user);
  }
}

const mockTemplate = '';


////////////////////////////////////////////////////////////////////////
// tests
describe('TEST: App Component', () => {
  /* >>> boilerplate */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AppService, useClass: MockService }
      ]
    });
  });
  /* <<< boilerplate */


  it('can create, should be authed.', async(async () => {
    await TestBed
      .overrideComponent(AppComponent, { set: { template: mockTemplate } })
      .compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    assert(!!fixture);

    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    assert(component.isAuthed === false);
    component.ngOnInit();
    assert(component.isAuthed === true);
  }));


  it('can create, should be authed. (fakeAsync ver.)', fakeAsync(() => {
    TestBed
      .overrideComponent(AppComponent, { set: { template: mockTemplate } })
      .compileComponents();
    tick();
    const fixture = TestBed.createComponent(AppComponent);
    assert(!!fixture);

    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    assert(component.isAuthed === false);
    component.ngOnInit();
    assert(component.isAuthed === true);
  }));

});
