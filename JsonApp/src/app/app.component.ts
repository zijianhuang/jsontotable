import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmUploadService } from './confirmUpload.component';
import { AlertService } from 'nmce';
import { APP_DI_CONFIG } from './app-config';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
	loading = true;
	title = 'JSON to Table';
	currentFileName: string | undefined = '';
	//tableData = [
	//	{
	//		id: 1, make: "Ford", model: "focus", reg: "P232 NJP", color: "white", serviceHistory: [
	//			{ date: "01/02/2016", engineer: "Steve Boberson", actions: "Changed oli filter" },
	//			{ date: "07/02/2017", engineer: "Martin Stevenson", actions: "Break light broken" },
	//		]
	//	},
	//	{
	//		id: 2, make: "BMW", model: "m3", reg: "W342 SEF", color: "red", serviceHistory: [
	//			{ date: "22/05/2017", engineer: "Jimmy Brown", actions: "Aligned wheels" },
	//			{ date: "11/02/2018", engineer: "Lotty Ferberson", actions: "Changed Oil" },
	//			{ date: "04/04/2018", engineer: "Franco Martinez", actions: "Fixed Tracking" },
	//		]
	//	},
	//];

	tableData = [];

	htmlVersion?: string;
	htmlBuildTime?: string;

	hackFlag = true;

	useMaterial = false;

	usedOnce = false;

	constructor(public confirmUploadService: ConfirmUploadService,
		private ref: ChangeDetectorRef,
		private alertService: AlertService,
	) {
		this.alertService.initOnce();
		this.displayNewVersions();
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		this.loading = false;
	}

	loadJsonFile() {
		this.confirmUploadService.open(`Import`, `Select JSON file`, '.json').subscribe(
			brief => {
				if (brief && brief.file) {
					const reader = new FileReader();
					reader.onload = () => {
						if (reader.result) {
							this.assignText(<string>reader.result);
							this.currentFileName = brief.name;
						}
					};

					reader.readAsText(brief.file!);
				}
			}
		);
	}

	private assignText(s: string) {
		try {
			this.tableData = JSON.parse(s);
		} catch (e) {
			this.alertService.error('JSON may be invalid.');
			return;
		}

		this.usedOnce = true;
		this.hackFlag = false; //https://stackoverflow.com/questions/50383003/how-to-re-render-a-component-manually-angular-5
		this.ref.detectChanges(); //hacky, but simple and works.
		this.hackFlag = true;
		this.ref.detectChanges();
	}

	styleChanged(v: boolean) {
		this.ref.detectChanges();
	}

	private displayNewVersions() {
		const oldHtmlVersion = localStorage['APS.JsonViewer.HtmlVersion'];
		if (oldHtmlVersion !== APP_DI_CONFIG.version) {
			this.htmlVersion = APP_DI_CONFIG.version;
			localStorage['APS.JsonViewer.HtmlVersion'] = APP_DI_CONFIG.version;
		}

		const oldHtmlBuildTime = localStorage['APS.JsonViewer.HtmlBuildTime'];
		if (oldHtmlBuildTime !== APP_DI_CONFIG.buildTime?.toString()) {
			this.htmlBuildTime = APP_DI_CONFIG.buildTime;
			localStorage['APS.JsonViewer.HtmlBuildTime'] = APP_DI_CONFIG.buildTime;
		}

		if (this.htmlBuildTime || this.htmlVersion) {
			this.alertService.success('App updated');
		}

	}

	pasteFromClipboard() {
		navigator.clipboard.readText().then( //on Firefox, need to follow https://stackoverflow.com/questions/67440036/navigator-clipboard-readtext-is-not-working-in-firefox first.
			s => {
				this.assignText(s);
				this.currentFileName = 'Clipboard';
				this.ref.detectChanges();
			}
		);
	}

	getIndentedText() {
		const indented = JSON.stringify(this.tableData, null, '\t');
		navigator.clipboard.writeText(indented).then(
			d => this.alertService.success('Indented JSON text copied to clipboard')
		);
	}
}
