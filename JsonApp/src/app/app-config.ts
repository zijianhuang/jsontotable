import { AppConfigConstants } from "src/environments/environment";
import { HttpHeaders } from '@angular/common/http';

export interface ViewerSettings {
	/**
	 * True of show annotations section at startup.
	 */
	showAnnotations?: boolean,
	showDate?: boolean,
	showTags?: boolean,
	/**
	 * Show album tags. When viewer is with an album, not show at all.
	 */
	showAlbums?: boolean,
	showTitle?: boolean,

	hideSideNavAfterSelect?: boolean;
}

export class APP_DI_CONFIG {
	// #region External Web Resources
	private static _baseUri = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/';
	static get baseUri(): string { return this._baseUri; }

	/**
	 * Initialized in app-root component, by injected DIALOG_ACTIONS_ALIGN, provided in app module.
	 */
	static DialogActionsAlign: 'start' | 'center' | 'end' = 'end';

	/**
	 * Set during startup, combining the with the host startup url and index.html base href tag.
	 */
	static startupBaseHref = location.toString();

	static readonly version: string = AppConfigConstants.version;

	static readonly buildTime = AppConfigConstants.buildTime;

	static albumPoemViewerSettings: ViewerSettings = {
		showAlbums: false,//always not to show album tags.

		get showAnnotations() {
			return APP_DI_CONFIG.getStorageBooleanItem('albumPoemViewer.showAnnotations'); //presuming only one user is using the PC on that OS account.
		},
		set showAnnotations(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('albumPoemViewer.showAnnotations', v);
		},

		get showDate() {
			return APP_DI_CONFIG.getStorageBooleanItem('albumPoemViewer.showDate', 'true');
		},
		set showDate(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('albumPoemViewer.showDate', v);
		},

		get showTags() {
			return APP_DI_CONFIG.getStorageBooleanItem('albumPoemViewer.showTags');
		},
		set showTags(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('albumPoemViewer.showTags', v);
		},

		showTitle: true,//always
	}

	static isSmallScreen = window.innerWidth < 600 || window.innerHeight < 600; 

	static poemViewerSettings: ViewerSettings = {
		get showAlbums() {
			return APP_DI_CONFIG.getStorageBooleanItem('poemViewer.showAlbums');
		},
		set showAlbums(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('poemViewer.showAlbums', v);
		},

		get showAnnotations() {
			return APP_DI_CONFIG.getStorageBooleanItem('poemViewer.showAnnotations', 'true');
		},
		set showAnnotations(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('poemViewer.showAnnotations', v);
		},

		get showDate() {
			return APP_DI_CONFIG.getStorageBooleanItem('poemViewer.showDate');
		},
		set showDate(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('poemViewer.showDate', v);
		},

		get showTags() {
			return APP_DI_CONFIG.getStorageBooleanItem('poemViewer.showTags');
		},
		set showTags(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('poemViewer.showTags', v);
		},

		get showTitle() {
			return APP_DI_CONFIG.getStorageBooleanItem('poemViewer.showTitle');
		},
		set showTitle(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('poemViewer.showTitle', v);
		},

		get hideSideNavAfterSelect() {
			return APP_DI_CONFIG.getStorageBooleanItem('poemViewer.hideSideNavAfterSelect', APP_DI_CONFIG.isSmallScreen ? 'true' : 'false');
		},
		set hideSideNavAfterSelect(v: boolean) {
			APP_DI_CONFIG.setStorageBooleanItem('poemViewer.hideSideNavAfterSelect', v);
		},


	}

	private static getStorageBooleanItem(key: string, defaultValue?: string) {
		const s = localStorage.getItem(key);
		return s ? s === 'true' : defaultValue === 'true';
	}

	private static setStorageBooleanItem(key: string, v: boolean) {
		localStorage.setItem(key, v ? 'true' : 'false');
		console.debug(`Set: ${key}  ${v}`);
	}

	private static getStorageIntItem(key: string, defaultValue?: string) {
		const s = localStorage.getItem(key);
		return s ? parseInt(s) : 0;
	}

	private static setStorageIntItem(key: string, v: number) {
		localStorage.setItem(key, v.toString());
		console.debug(`Set: ${key}  ${v}`);
	}

	private static getSessionStorageBooleanItem(key: string, defaultValue?: string) {
		const s = sessionStorage.getItem(key);
		return s ? s === 'true' : defaultValue === 'true';
	}

	private static setSessionStorageBooleanItem(key: string, v: boolean) {
		sessionStorage.setItem(key, v ? 'true' : 'false');
		console.debug(`Set: ${key}  ${v}`);
	}

	static currentStaticDataIndex = 0;

	static get dataTimestamp() {
		return APP_DI_CONFIG.getStorageIntItem('poemViewer.dataTimestamp');
	}
	static set dataTimestamp(v: number) {
		APP_DI_CONFIG.setStorageIntItem('poemViewer.dataTimestamp', v);
	}

	static get toUpdateData() {
		return APP_DI_CONFIG.getStorageBooleanItem('poemViewer.toUpdateData');
	}

	static set toUpdateData(v: boolean) {
		APP_DI_CONFIG.setStorageBooleanItem('poemViewer.toUpdateData', v);
	}

}

export const  mySettingsList= ['settings.writtenLanguage', 'settings.defaultSpokenLanguage', 'settings.spokenLangs',
	'settings.usePublished', 'settings.useRyhmes', 'settings.useNumberOfStanza', 'settings.useFirstPublishUrl',
	'settings.useAnnotations', 'settings.useNumberedAnnotations', 'settings.useTags', 'settings.useAlbums', 'settings.useYearFirstInPublished', 'settings.advancedClipboardEnabled'];

// export const BACKEND_URLS = new InjectionToken<string[]>('Backend URLs that need http interceptor', {
// 	providedIn: 'root',
// 	factory: ()=> [APP_DI_CONFIG.apiBaseUri]
// })
