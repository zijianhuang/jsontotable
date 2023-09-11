import { DOCUMENT, LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { AlertService, DIALOG_ACTIONS_ALIGN, TextInputService, WaitService } from 'nmce';
import { AppConfigConstants } from '../environments/environment';
import { APP_DI_CONFIG } from './app-config';
import { ConfirmUploadService } from './confirmUpload.component';
import { JsonTreeComponent } from './json-tree.component';
import { TextareaDialogService } from './textarea.component';
import { TreeTableCdkComponent } from './tree-table-cdk.component';
import { UpdateAppService } from './updateApp.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
	loading = true;
	title = 'JSON to Table';
	currentFileName: string | undefined = '';

	tableData: Object = [];

	htmlVersion?: string;
	htmlBuildTime?: string;

	hackFlag = true;

	useMaterial = false;

	scroll = false;

	current = 0;

	@ViewChild('treeTableRef') treeTableRef?: TreeTableCdkComponent;

	@ViewChild('menuTrigger') mainMenuTrigger?: MatMenuTrigger;

	@ViewChild('jsonTree') jsonTree?: JsonTreeComponent;

	currentModuleName: string = 'table';

	url: string | null = '';

	get darkMode() {
		if (APP_DI_CONFIG.dark != null) {// if user defined, then what the uer defined
			return APP_DI_CONFIG.dark;
		} else if (APP_DI_CONFIG.dark == null) { //if user did not define, the startup const determine
			return AppConfigConstants.dark;
		}

		return false;
	}
	//set darkMode(v: boolean | undefined | null) {
	//	APP_DI_CONFIG.dark = v;
	//}

	constructor(public confirmUploadService: ConfirmUploadService,
		private ref: ChangeDetectorRef,
		private alertService: AlertService,
		private textareaDialogService: TextareaDialogService,
		private inputDialogService: TextInputService,
		private httpClient: HttpClient,
		private activatedRoute: ActivatedRoute,
		@Inject(DIALOG_ACTIONS_ALIGN) public actionsAlign: 'start' | 'center' | 'end',
		private locationStrategy: LocationStrategy,
		private waitService: WaitService,
		@Inject(DOCUMENT) private doc: Document,
		private updateAppService: UpdateAppService,
	) {
		if (this.darkMode) {
			console.debug('load dark theme');
			this.loadStyles(true);
		}

		//goback prevention
		history.pushState(null, '', window.location.href);
		this.locationStrategy.onPopState(() => {
			history.pushState(null, '', window.location.href);
			console.info('This app prevents goback.');
		});

		APP_DI_CONFIG.DialogActionsAlign = actionsAlign;
		this.alertService.initOnce();
		this.displayNewVersions();


	}

	ngOnInit() {
		this.activatedRoute.queryParams
			.subscribe(params => {
				this.url = params['url'];
				console.debug('url: ' + this.url);
				if (this.url) {
					this.loadFromUrl(this.url);
					this.url = '';
					if (this.mainMenuTrigger?.menuOpened) {
						this.mainMenuTrigger.closeMenu();
					}
				}
			}
		);

		this.updateAppService.checkAvailable();
	}

	ngAfterViewInit(): void {
		this.loading = false;
		if (!this.currentFileName && !this.url) {
			this.mainMenuTrigger?.openMenu();
		};
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
		this.inputDialogService.open(`Type or Paste URL allowing origin ${location.hostname}`, 'URL').subscribe(
			url => {
				this.loadFromUrl(url);
			}
		);
	}

	private loadFromUrl(url: string) {
		if (url) {
			this.httpClient.get(url, { responseType: 'json', headers: { 'ngsw-bypass': '', 'Cache-Control': 'no-cache' } }).subscribe({
				next: data => {
					this.assignObject(data);
					this.currentFileName = 'URL';
					this.ref.detectChanges();
				},
				error: error => {
					this.alertService.error(error);
				}
			});

		}
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
		this.waitService.setWait({ loading: true });
		this.ref.detectChanges();
		this.hackFlag = false; //https://stackoverflow.com/questions/50383003/how-to-re-render-a-component-manually-angular-5
		this.ref.detectChanges(); //hacky, but simple and works.
		this.hackFlag = true;
		this.ref.detectChanges();
		this.waitService.setWait({ loading: false });
		this.ref.detectChanges();
	}

	styleChanged(v: boolean) {
		this.ref.detectChanges();
	}

	private displayNewVersions() {
		const oldHtmlVersion = localStorage['Fonlow.JsonViewer.HtmlVersion'];
		if (oldHtmlVersion !== APP_DI_CONFIG.version) {
			this.htmlVersion = APP_DI_CONFIG.version;
			localStorage['Fonlow.JsonViewer.HtmlVersion'] = APP_DI_CONFIG.version;
		}

		const oldHtmlBuildTime = localStorage['Fonlow.JsonViewer.HtmlBuildTime'];
		if (oldHtmlBuildTime !== APP_DI_CONFIG.buildTime?.toString()) {
			this.htmlBuildTime = APP_DI_CONFIG.buildTime;
			localStorage['Fonlow.JsonViewer.HtmlBuildTime'] = APP_DI_CONFIG.buildTime;
		}

		if (this.htmlBuildTime || this.htmlVersion) {
			this.alertService.success('App updated');
			console.info(`Version: ${APP_DI_CONFIG.version}; Build: ${this.htmlBuildTime}`);
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

	copyIndentedJsonToClipboard() {
		const indented = JSON.stringify(this.tableData, null, '\t');
		this.copyTextToClipboard(indented, 'text/plain');
		//navigator.clipboard.writeText(indented).then(
		//	d => this.alertService.success('Indented JSON text copied to clipboard')
		//);
	}

	copyHtmlToClipboard() {
		const htmlText = this.treeTableRef?.tableRef?.nativeElement.innerHTML;
		//const listener = (e: ClipboardEvent) => {
		//	e.clipboardData?.setData('text/html', htmlText);//the operation may fail if the memory left in the OS is not enough.
		//	e.clipboardData?.setData('text/plain', htmlText); //working, but deprecated in Web browsers
		//	e.preventDefault();
		//	document.removeEventListener('copy', listener);
		//};
		//console.debug(htmlText);
		//document.addEventListener('copy', listener);
		//document.execCommand('copy');

		//		this.copyTextToClipboard(htmlText, 'text/html');
		//		this.alertService.success('Copied to clipboard');
		const clipboardItem = new ClipboardItem({ //thanks to https://www.nikouusitalo.com/blog/why-isnt-clipboard-write-copying-my-richtext-html/
			'text/plain': new Blob(
				[htmlText],
				{ type: 'text/plain' }
			),
			'text/html': new Blob(
				[htmlText],
				{ type: 'text/html' }
			),
		});

		navigator.clipboard.write([clipboardItem]).then(
			() => {
				this.alertService.success('Copied to clipboard');
			},
			() => {
				this.alertService.warn('Something wrong');
			}
		);
	}

	private copyTextToClipboard(text: string, type: string) {
		const blob = new Blob([text], { type });
		const data = [new ClipboardItem({ [type]: blob })];
		navigator.clipboard.write(data).then(
			() => {
				this.alertService.success('Copied to clipboard');
			},
			() => {
				this.alertService.warn('Something wrong');
			}
		);
	};

	toggleTable() {
		this.current = 0;
	}

	toggleTree() {
		this.current = 1;
	}

	about() {
		window.open('https://jsontotable.fonlow.org', '_blank');
	}

	private loadStyles(dark: boolean) {
		const head = this.doc.getElementsByTagName('head')[0];
		const themeFile = dark ? 'themedark.css' : 'theme.css';
		let themeLink = this.doc.getElementById(
			'theme'
		) as HTMLLinkElement;


		if (themeLink) {
			themeLink.href = `assets/themes/${themeFile}`;
		}

		let customLink = this.doc.getElementById(
			'custom'
		) as HTMLLinkElement;

		const customFile = dark ? 'colorsdark.css' : 'colors.css';
		if (customLink) {
			customLink.href = `assets/themes/${customFile}`;
		}

	}

	toggleDarkMode() {
		if (this.darkMode) {
			APP_DI_CONFIG.dark = false;
		} else {
			APP_DI_CONFIG.dark = true;
		}

		this.loadStyles(this.darkMode!);

		this.jsonTree?.refresh();
	}
}
