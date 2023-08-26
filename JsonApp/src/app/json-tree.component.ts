import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import JSONFormatter from 'json-formatter-js';


@Component({
	selector: 'json-tree',
	templateUrl: './json-tree.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonTreeComponent implements AfterViewInit {
	private _data: any;
	@Input()
	get data(): any {
		return this._data;
	}
	set data(v: any) {
		this._data = v;
		this.renderData(v);
	}

	@ViewChild('jsonPlace') jsonPlace?: ElementRef;

	constructor(private ref: ChangeDetectorRef) {
	}

	ngAfterViewInit() {
		this.renderData(this.data);
	}

	private renderData(data: any) {
		if (this.jsonPlace) {
			const formatter = new JSONFormatter(data, 10);
			formatter.render()
			const lastChild = this.jsonPlace.nativeElement.lastChild;
			if (lastChild) {
				this.jsonPlace.nativeElement.removeChild(lastChild);
			}

			this.jsonPlace.nativeElement.appendChild(formatter.render());
			this.ref.detectChanges();
			console.debug('rendered tree');
		}
	}

}


