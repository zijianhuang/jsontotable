import { Directive, Input, OnInit } from '@angular/core';

export interface TableColumnDef {
	columnDef: string,
	header: string,
	cell: (element: any) => void,
	subTableColumnDefs?: TableColumnDef[]
}

@Directive()
export class TreeTableBase implements OnInit {

	private _data: any;
	/**
	 * data is expected an array. If not array, the setter will render it into an array.
	 */
	@Input()
	get data(): any {
		return this._data;
	}
	set data(obj: any) {
		if (!obj || (Object.keys(obj).length === 0 && obj.constructor === Object)) {
			console.debug('Object is empty');
			this._data = obj;
		}
		else {
			this.rootTableColumnDefs = [];
			this.displayedColumns = [];
			this.arrayFieldNames = [];
			this.objectFieldNames = [];

			if (!Array.isArray(obj)) {
				this._data = [obj];
			} else {
				const firstRow = obj[0];
				const firstRowType = typeof firstRow;
				if (this.basicTypes.indexOf(firstRowType) >= 0) {
					obj = obj.map(d => { return { '[ ]': d } }); // refine the original data on the original reference
				}

				this._data = obj;
			}

			this.GetTableColumnDef(this._data, this.rootTableColumnDefs);

			console.debug('original data is ' + JSON.stringify(obj));
			console.debug('transformed data is ' + JSON.stringify(this._data));
			console.debug('rootTableColumnDefs is ' + JSON.stringify(this.rootTableColumnDefs));

			this.displayedColumns = this.rootTableColumnDefs.filter(d => !d.subTableColumnDefs).map(d => d.header);
			this.arrayFieldNames = this.getArrayFieldNames(this._data[0]);
			console.debug('arrayFieldNames: ' + this.arrayFieldNames.join(', '));
			this.objectFieldNames = this.getObjectFieldNames(this._data[0]);
			console.debug('objectFieldNames: ' + this.objectFieldNames.join(', '));
		}
	}

	private readonly basicTypes = ['string', 'number', 'date', 'bigint', 'boolean'];

	/**
	 * Headers of columns
	 */
	displayedColumns: string[] = [];
	/*
	 * array fields of the row object
	 */
	arrayFieldNames: string[] = [];

	/**
	 * Complex object fields of the row object
	 */
	objectFieldNames: string[] = [];

	rootTableColumnDefs: TableColumnDef[] = [];

	ngOnInit() {

	}

	getNonArrayFieldCount(obj: any) {
		if (obj) {
			const entries = Object.entries(obj);
			const len = entries.filter(d => !Array.isArray(d[1])).length;
			return len;
		}

		return 0;
	}

	/**
	 * Just for debugging
	 * @param rowObject
	 */
	getArrayFieldNames(rowObject: any) {
		if (rowObject) {
			const entries = Object.entries(rowObject);
			const fieldNames = entries.filter(d => Array.isArray(d[1])).map(d => {
				return d[0];
			});
			return fieldNames;
		}

		return [];
	}

	getObjectFieldNames(rowObject: any) {
		if (rowObject) {
			const entries = Object.entries(rowObject);
			const fieldNames = entries.filter(d => !Array.isArray(d[1]) && this.basicTypes.indexOf(typeof d[1]) < 0 && d[1] !== null)
				.map(d => { return d[0]; });
			return fieldNames;
		}

		return [];
	}

	/**
	 * Generate column definitions of data, recuisively.
	 * @param data
	 * @param tableColumnDefs
	 */
	private GetTableColumnDef(data: any[], tableColumnDefs: TableColumnDef[]) {
		const firstRow = data[0];
		if (firstRow) {
			const entries = Object.entries(firstRow);

			for (const [k, v] of entries) {
				const fieldName = k;
				const value: any = v;
				const type = typeof value;
				if (['string', 'number', 'date', 'bigint', 'boolean'].indexOf(type) >= 0) {
					tableColumnDefs.push({
						columnDef: fieldName,
						header: fieldName,
						cell: (element: any) => element[fieldName],
					})
				}
				else if (Array.isArray(value)) {
					const subTableColumnDefs: TableColumnDef[] = [];
					this.GetTableColumnDef(value, subTableColumnDefs);
					tableColumnDefs.push({
						columnDef: fieldName,
						header: fieldName,
						cell: (element: any) => element[fieldName],
						subTableColumnDefs: subTableColumnDefs
					});
				} else if (['null', 'undefined'].indexOf(type) < 0) {
					const subTableColumnDefs: TableColumnDef[] = [];
					const objAsArray = [value];
					this.GetTableColumnDef(objAsArray, subTableColumnDefs);
					tableColumnDefs.push({
						columnDef: fieldName,
						header: fieldName,
						cell: (element: any) => element[fieldName],
						subTableColumnDefs: subTableColumnDefs
					});
				}
			}

		}
	}
}
