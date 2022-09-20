import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
	console.info('enableProdMode()');
	enableProdMode();
	if (window) {
		window.console.debug = function () { }; //generally I don't use console.log()
	}
}

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
