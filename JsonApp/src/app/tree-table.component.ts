import { Component } from '@angular/core';
import { TreeTableBase } from './tree-table-base.directive';

/**
 * This is a wrapper class for the tabulator JS library.
 * For more info see http://tabulator.info
 */
@Component({
	selector: 'tree-table',
	templateUrl: './tree-table.component.html',
	styleUrls: ['./tree-table.component.css']
})
export class TreeTableComponent extends TreeTableBase {

}
