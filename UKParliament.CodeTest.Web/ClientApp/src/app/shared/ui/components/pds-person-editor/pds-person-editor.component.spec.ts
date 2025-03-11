import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdsPersonEditorComponent } from './pds-person-editor.component';

describe('PersonEditorComponent', () => {
  let component: PdsPersonEditorComponent;
  let fixture: ComponentFixture<PdsPersonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdsPersonEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdsPersonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
