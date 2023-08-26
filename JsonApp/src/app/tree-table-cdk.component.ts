import { Component, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { TreeTableBase } from './tree-table-base.directive';

/**
 * This is a wrapper class for the tabulator JS library.
 * For more info see http://tabulator.info
 */
@Component({
	selector: 'tree-table-cdk',
	templateUrl: './tree-table-cdk.component.html',
	styleUrls: ['./tree-table-cdk.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeTableCdkComponent extends TreeTableBase {
	@ViewChild('tableRef') tableRef?: ElementRef;

}
