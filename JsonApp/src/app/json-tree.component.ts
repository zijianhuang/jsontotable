import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import JSONFormatter from 'json-formatter-js';
import { APP_DI_CONFIG } from './app-config';
import { AppConfigConstants } from '../environments/environment';


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

	get darkMode() {
		if (APP_DI_CONFIG.dark != null) {// if user defined, then what the uer defined
			return APP_DI_CONFIG.dark;
		} else if (APP_DI_CONFIG.dark == null) { //if user did not define, the startup const determine
			return AppConfigConstants.dark;
		}

		return false;
	}

	constructor(private ref: ChangeDetectorRef) {
	}

	ngAfterViewInit() {
		this.renderData(this.data);
	}

	private renderData(data: any) {
		if (this.jsonPlace) {
			console.debug('jsonTree theme: ' + this.darkMode);
			const formatter = new JSONFormatter(data, 10, { theme: this.darkMode ? 'dark' : '' });
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

	refresh() {
		this.renderData(this.data);
	}

}


