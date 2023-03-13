// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

interface AppConfigConstantsType {
	version: string;
	buildTime?: string; // for BUILD_TIME
}

declare const BUILD_TIME: {
	/**
	 * Adjusted during build with build*.bat which inserts the variable to buildTime.js.
	 */
	buildTime?: string;
}

export const AppConfigConstants: AppConfigConstantsType = {
	version: '20221111.08', //alter this before build
	...(typeof BUILD_TIME === 'undefined' ? { buildTime: 'Unknown' } : BUILD_TIME),
}
