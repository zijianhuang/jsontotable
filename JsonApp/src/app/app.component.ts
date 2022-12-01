import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmUploadService } from './confirmUpload.component';
import { AlertService, TextInputComponent, TextInputService } from 'nmce';
import { APP_DI_CONFIG } from './app-config';
import { TextareaDialogService } from './textarea.component';
import { HttpClient } from '@angular/common/http';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
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

	tableData: Object = [];

	htmlVersion?: string;
	htmlBuildTime?: string;

	hackFlag = true;

	useMaterial = false;

	usedOnce = false;

	scroll = false;

	@ViewChild('tabGroup') tabGroup?: MatTabGroup;

	currentModuleName: string = 'table';

	constructor(public confirmUploadService: ConfirmUploadService,
		private ref: ChangeDetectorRef,
		private alertService: AlertService,
		private textareaDialogService: TextareaDialogService,
		private inputDialogService: TextInputService,
		private httpClient: HttpClient,
	) {
		this.alertService.initOnce();
		this.displayNewVersions();
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		this.loading = false;
		if (this.tabGroup) {
			this.tabGroup.selectedIndex = 0;
			console.debug('current tab should be table.');
		}
	}

	loadJsonFile() {
		this.confirmUploadService.open(`Import`, `Select JSON file`, '.json').subscribe(
			brief => {
				if (brief && brief.file) {
					const reader = new FileReader();
					reader.onload = () => {
						if (reader.result) {
							this.currentFileName = brief.name;
							this.scroll = brief.file!.size > 10000;
							this.assignText(<string>reader.result);
						}
					};

					reader.readAsText(brief.file!);
				}
			}
		);
	}

	loadJsonFromUrl() {
		this.inputDialogService.open('Type or Paste URL', "URL").subscribe(
			url => {
				if (url) {
					this.httpClient.get(url, { responseType: 'json', headers: { 'ngsw-bypass': '', 'Cache-Control': 'no-cache' } }).subscribe({
						next: data => {
							this.assignObject(data);
							this.currentFileName = 'URL';
						},
						error: error => {
							this.alertService.error(error);
						}
					});

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

		this.rerender();
	}

	private assignObject(obj: Object) {
		try {
			this.tableData = obj;
		} catch (e) {
			this.alertService.error('JSON may be invalid.');
			return;
		}

		this.rerender();
	}

	private rerender() {
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

	async pasteFromClipboard() {
		// @ts-ignore
		const isFirefox = typeof InstallTrigger !== 'undefined'; //otherwsie, use ngmd's Platform service
		if (isFirefox) {
			this.alertService.info('In Firefox, please presss ctrl+V to paste.', true);
			this.textareaDialogService.open().subscribe(
				text => {
					if (text) {
						this.assignText(text);
						this.currentFileName = 'Clipboard';
						this.ref.detectChanges();
					}
				}
			);
		} else {

			navigator.clipboard.readText().then( //on Firefox, need to follow https://stackoverflow.com/questions/67440036/navigator-clipboard-readtext-is-not-working-in-firefox first.
				s => {
					this.assignText(s);
					this.currentFileName = 'Clipboard';
					this.ref.detectChanges();
				}
			);
		}
	}

	static copyPlainTextToClipboard(plainText: string) {
		const listener = (e: ClipboardEvent) => {
			e.clipboardData?.setData("text/plain", plainText);
			e.preventDefault();
			document.removeEventListener("copy", listener);
		};

		document.addEventListener("copy", listener);
		document.execCommand("copy");
	};

	getIndentedText() {
		const indented = JSON.stringify(this.tableData, null, '\t');
		navigator.clipboard.writeText(indented).then(
			d => this.alertService.success('Indented JSON text copied to clipboard')
		);
	}

	toggleTable() {
		if (this.tabGroup) {
			this.tabGroup.selectedIndex = 0;
		}
	}

	toggleTree() {
		if (this.tabGroup) {
			this.tabGroup.selectedIndex = 1;
		}
	}
}
