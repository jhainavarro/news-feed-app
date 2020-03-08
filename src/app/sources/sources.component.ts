import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Source } from './sources.model';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent {

  @Input() sources$: Rx.Observable<Source[]>;
  @Input() selected: FormControl;

}
