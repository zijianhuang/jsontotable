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

	static get dark(): boolean | undefined | null {
		return APP_DI_CONFIG.getStorageBooleanItem('json2table.dark', 'false');
	};
	static set dark(v: boolean) {
		APP_DI_CONFIG.setStorageBooleanItem('json2table.dark', v);
	};

	static isSmallScreen = window.innerWidth < 600 || window.innerHeight < 600; 

	private static getStorageBooleanItem(key: string, defaultValue?: string): boolean | undefined {
		const s = localStorage.getItem(key);
		if (s == null) {
			return undefined;
		}
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

}

export const  mySettingsList= ['settings.writtenLanguage', 'settings.defaultSpokenLanguage', 'settings.spokenLangs',
	'settings.usePublished', 'settings.useRyhmes', 'settings.useNumberOfStanza', 'settings.useFirstPublishUrl',
	'settings.useAnnotations', 'settings.useNumberedAnnotations', 'settings.useTags', 'settings.useAlbums', 'settings.useYearFirstInPublished', 'settings.advancedClipboardEnabled'];

// export const BACKEND_URLS = new InjectionToken<string[]>('Backend URLs that need http interceptor', {
// 	providedIn: 'root',
// 	factory: ()=> [APP_DI_CONFIG.apiBaseUri]
// })
