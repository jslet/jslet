/*!
 * Jslet JavaScript Framework v4.0.0
 * http://www.jslet.com
 *
 * Copyright 2016 Jslet Team
 * Released under GNU AGPL v3.0 license and commercial license
 */
/* jshint ignore:start */
"use strict";
(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define('jslet-locale', factory);
	    } else {
	    	define(function(require, exports, module) {
	    		module.exports = factory();
	    	});
	    }
    } else {
    	factory();
    }
})(function () {
/* jshint ignore:end */

var root = this || window, locale;
if(!root.jsletlocale) {
	locale = {};
	root.jsletlocale = locale;
} else {
	locale = root.jsletlocale;
}

locale.isRtl = false;//false: direction = 'ltr', true: direction = 'rtl'

locale.Common = {
	jsonParseError: 'Can\'t parse JSON string: {0}',
	ConnectError: 'Can\'t connect server or timeout!'
};

locale.Date = {
	format: 'MM/dd/yyyy'	
};

locale.Checker = {
	required: '[{0}] is Required!',
	requiredBooleanValue: '[{0}] must be a Boolean value!',
	requiredStringValue: '[{0} : {1}] must be a String value!',
	requiredDateValue: '[{0} : {1}] must be a Date value!',
	requiredNumbericValue: '[{0} : {1}] must be a Numberic value!',
	greatThanZero: '[{0} : {1}] must be great than zero!',
	greatThanEqualZero: '[{0} : {1}] must be great than or equal zero!',
	betweenValue: '[{0} : {1}] must be between [{2}] and [{3}]!',
	lessThanMaxValue: '[{0} : {1}] must be less than [{2}]!',
	greatThanMinValue: '[{0} : {1}] must be great than [{2}]!',
	requiredArrayValue: '[{0} : {1}] must be an Array!',
	requiredObjectValue: '[{0} : {1}] must be an Object!',
	requiredPlanObjectValue: '[{0} : {1}] must be a plan Object!',
	requiredHtmlElement: '[{0} : {1}] must be a HTML element!',
	requiredFunctionValue: '[{0} : {1}] must be a Function!',
	instanceOfClass: '[{0} : {1}] must be instance of [{2}]',
	inArray: '[{0}: {1}] must be one of [{2}]!'
};

locale.Dataset = {
	fieldNameRequired: 'Field name is required when defining field object！',
	invalidDatasetField: 'Invalid dataset field config: [{0}], property: detailDataset required!',
	invalidActionField: 'Invalid action field config: [{0}], property: fixedValue required!',
	invalidDateFieldValue: 'Invalid value: [{1}] for DATE field: [{0}]!',
	invalidNumberFieldValue: 'Invalid value: [{1}] for NUMBER field: [{0}]!',
	parentFieldNotSet: 'Dataset properties: [parentField] and [keyField] not set, use insertRecord() instead!',
	detailDsHasError: 'Detail Dataset: {0} has error data!',
	queryUrlRequired: 'Dataset\'s queryUrl required! Use: yourDataset.queryUrl(yourUrl)',
	submitUrlRequired: 'Dataset\'s submitUrl required! Use: yourDataset.submitUrl(yourUrl)',
	cannotFocusControl: 'Can\'t focus on this control, maybe it\'s disabled!',
	cannotImportSnapshot: 'Snapshot name: [{0}] does not match the current dataset name: [{1}], cannot import snapshot!',
	serverReturnNullRecord: 'The return record from server exists null. Please check it.',
	fieldNotFound:  'Undefined field: {0}!',
	valueNotFound: '[{0}]: Not find the value!',
	lookupNotFound: 'Field: {0} not set the lookup setting, you can not use the field chain!',
	datasetFieldNotBeSetValue: 'Field: {0} is readonly!',
	datasetFieldNotBeCalculated: 'Cannot calculated by field: {0}!',
	insertMasterFirst: 'Add data to master dataset first!',
	lookupFieldExpected: 'Field: {0} must be lookup field!',
	invalidLookupField: 'Invalid lookup field: {0}!',
	invalidContextRule: 'Invalid context rule in field: [{0}]!',
	fieldValueRequired: 'Value required!',
	translateListenerRequired: 'Event listener: translateListener required!',
	minMaxValueError: 'Min value must less than and equal to max value in Field: [{0}]!',
	invalidDate: 'Invalid date, date format: {0}!',
	invalidInt: 'Only:0-9,- allowed!',
	invalidFloat: 'Only:0-9,-,. allowed',
	invalidIntegerPart: 'Invalid integer part, expected length：{0}, actual length：{1}!',
	invalidDecimalPart: 'Invalid decimal part, expected length：{0}, actual length：{1}!',
	cannotConfirm: 'Exists invalid data, check it first!',
	notInRange: 'Input value must be in range: {0} to {1}',
	lessThanValue: 'Input value must less than: {0}',
	moreThanValue: 'Input value must more than: {0}',
	lessThanCount: 'Value count must less than: {0}',
	moreThanCount: 'Value count must more than: {0}',
	cannotDelParent: 'Cannot delete record which has children!',
	notUnique: 'Input value is not unique!',
	LookupDatasetNotSameAsHost: 'Lookup dataset cannot be the host dataset!',
	betweenLabel: ' - ',
	betwwenInvalid: 'Min value should not be great than max value',
	value: 'Value',
	nullText: '(Empty)',
	noDataSubmit: 'No data to submit!',
	trueText: 'Yes',
	falseText: '',
	notFound: 'NotFound({0})',
	totalLabel: ' Total',
	datasetNotFound: 'Can not find the dataset: {0}， create it first!',
};

locale.EnumDataset = {
	code: 'Code',
	name: 'Name'
};
	
locale.Control = {
	duplicatedId: 'Duplicated HTML element ID：{0}. Duplicated element id would cause unpredictable issues.'
};
	
locale.DBControl = {
	datasetNotFound: 'Can not find the dataset: {0}!',
	expectedProperty: 'Property value: {0} expected!',
	propertyValueMustBeInt: 'Property: {0} must be number!',
	jsletPropRequired: 'Poperty:jslet required!',
	invalidHtmlTag: 'Invalid attached HTML tag，reference: {0} !',
	invalidJsletProp: 'Parameter NOT meet the JSON specification: {0}'
};

locale.DBImage = {
	lockedImageTips: 'Image locked'
};

locale.DBCheckBoxGroup = {
	invalidCheckedCount: 'Not exceed {0} items!',
	noOptions: 'No options',
	selectAll: 'All'
};

locale.DBRadioGroup = {
	noOptions: 'No options'
};

locale.DBBetweenEdit = {
	betweenLabel: '-'
};

locale.DBSelect = { 
	moreLookupRecords: 'The options count of DBSelect is more than 100, it will cause performance issues, use "DBComboSelect" or "DBAutoComplete" instead!'
};

locale.DBComboSelect = { 
	find: 'Press Ctrl + F to find data!',
	cannotSelect: 'Only leaf item allowed.',
	notFound: 'Not found!'
};

locale.MessageBox = { 
	ok: 'OK',
	cancel: 'Cancel',
	yes: 'Yes',
	no: 'No',
	info: 'Message',
	error: 'Error',
	warn: 'Warn',
	confirm: 'Confirm',
	prompt: 'Please input: '
};

locale.Calendar = { 
	yearPrev: 'Prev Year',
	monthPrev: 'Prev Month',
	yearNext: 'Next Year',
	monthNext: 'Next Month',
	Sun: 'Su',
	Mon: 'Mo',
	Tue: 'Tu',
	Wed: 'We',
	Thu: 'Th',
	Fri: 'Fr',
	Sat: 'Sa',
	today: 'Today',
	monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	firstDayOfWeek: 0
};

locale.DBTreeView = { 
	expandAll: 'Expand All',
	collapseAll: 'Collapse All',
	checkAll: 'Select All',
	uncheckAll: 'Unselect All',
	nextError: 'Next Error Record(Ctrl + E)'
};

locale.TabControl ={
	reload: 'Reload',
	close: 'Close',
	closeOther: 'Close Other',
	closeAll: 'Close All',
	newTab: 'New Tab',
	contentChanged: 'Data changed! Close this tab without saving?'
};

locale.DBTable = { 
	norecord: 'No Records',
	sorttitle: 'Press Ctrl to sort by multiple column',
	totalLabel: 'Total',
	
	selectAll: 'Select All(Ctrl + A)',
	find: 'Find(Ctrl + F)...',
	fixed: 'Fixed',
	fixedCol: 'Fixed Column',
	fixedRow: 'Fixed Row',
	copy: 'Copy(Ctrl + C)',
	copyInfo: 'For the browser limit, you must press "Ctrl + C" to copy the selection!',
	nextError: 'Next Error Record(Ctrl + E)',
	
	appendTip: 'Append one record',
	deleteTip: 'Delete the current record'
};

locale.findDialog = {
	caption: 'Find - {0}',
	placeholder: '<Enter> for finding...'
};

locale.FilterDataset = {
	equal: '==',
	notEqual: '!=',
	greatThan: '>',
	greatThanAndEqual: '>=',
	lessThan: '<',
	lessThanAndEqual: '<=',
	and: 'And',
	or: 'Or',
	between: 'Between',
	likeany: 'Like Any',
	likefirst: 'Like First',
	likelast: 'Like Last',
	select: 'Select',
	selfchildren0: 'Self & all children',
	children0: 'All children',
	selfchildren1: 'Self & direct children',
	children1: 'Direct children',
	
	lParenthesis: 'Left Parenthesis',
	field: 'Field Name',
	dataType: 'Data Type',
	operator: 'Operator',
	value: 'Value',
	rParenthesis: 'Right Parenthesis',
	logicalOpr: 'Logical Operator',
	
	parenthesisNotMatched: 'Left parenthesis NOT match right parenthesis!',
	valueRequired: 'Filter value required!',
	
	year: 'Year',
	month: 'Month',
	yearMonth: 'YearMonth'
};

locale.FilterPanel = {
	ok: '  OK  ',
	cancel: ' Cancel ',
	clear: ' Clear ',
	clearAll: ' Clear All ',
};

locale.ExportDialog = {
	existedErrorData: 'Exist error data, continue?',
	caption: 'Export Dialog',
	schemaName: 'Export Schema',
	saveSchema: 'Save',
	saveAsSchema: 'Save As',
	deleteSchema: 'Delete',
	success: 'Save export schema success!',
	inuputSchemaLabel: 'Inuput schema name: ',
	all: 'All',
	onlySelected: 'Only selected',
	onlyOnce: 'Export master only once',
	fileName: 'File Name：',
	exportData: ' Export ',
	cancel: ' Cancel ',
	fileAndFieldsRequired: 'File name and export fields required!'
};		

locale.ImportDialog = {
	caption: 'Import',
	schemaName: 'Import Schema',
	saveSchema: ' Save ',
	saveAsSchema: ' Save As ',
	deleteSchema: ' Delete ',
	existedSchema: 'Import schema exists, overwrite?',
	
	fieldLabel: ' Field ',
	columnHeader: ' Column Header ',
	fixedValue: 'Fixed Value',
	fileName: 'File Name:',
	importData: ' Import ',
	cancel: ' cancel ',
	duplicateFields: 'Exist duplicate Fields: {0}',
	notSupportFile: 'Not support file!',
	noData: 'No data in inporting file!',
	noColHeader: 'No column in file or no column for required field!'
};
		
locale.InputSettingDialog = {
	labelLabel: 'Field Name',
	labelDefaultValue: 'Default Value',
	labelFocused: 'Focused',
	labelValueFollow: 'Value Follow',
	caption: 'Data Input Setting',
	save: ' Save ',
	cancel: ' Cancel '
};

var root = this || window, locale;
if(!root.jsletlocale) {
	locale = {};
	root.jsletlocale = locale;
} else {
	locale = root.jsletlocale;
}

locale.DatasetFactory = {
	datasetMetaStoreRequired: 'At least one dataset meta store required! Use jslet.data.datasetFactory.addMetaStore to add one.',
	metaNotFound: 'Not found dataset meta: {0}'
};

locale.DBChart = {
	onlyNumberFieldAllowed: 'Number type field expected!'
};

locale.DBPageBar = {
	refresh: 'Refresh',
	first: 'First page',
	prior: 'Prior page',
	next: 'Next page',
	last: 'Last page',
	pageSize: 'Page size',
	pageNum: 'Page number '
};

locale.DBSelectView = { 
	moreLookupRecords: 'The options count of DBSelect is more than 100, it will cause performance issues, use "DBComboSelectView" or "DBAutoCompleteView" instead!'
};

locale.BatchEditDialog = {
	caption: 'Batch Edit',
	onlySelected: 'Only selected',
	onlyNullValue: 'Only null value',
	ok: ' OK',
	cancel: ' Cancel ',
	errorData: 'Not input data or exist error data!'
};

locale.DatasetDesigner = {
	dtString: 'String',
	dtNumber: 'Number',
	dtDate: 'Date',
	dtBoolean: 'Boolean',
	dtDataset: 'Dataset',
	dtAction: 'Action',
	dtEdit: 'Edit Action',
	
	vsNormal: 'Normal',
	vsBetween: 'Between-And',
	vsMultiple: 'Multiple',
		
	alLeft: 'Left',
	alCenter: 'Center',
	alRight: 'Right',
	
	dsName: 'Dataset Name',
	dsDesc: 'Description',
	dsKeyField: 'Key Field',
	dsCodeField: 'Code Field',
	dsNameField: 'Name Field',
	dsParentField: 'Parent Field',
	dsSelectField: 'Selected status Field',
	dsStatusField: 'Status Field',
	dsContextRules: 'Context Rules',
	
	dsQueryUrl: 'Query URL',
	dsSubmitUrl: 'Submit URL',
	dsRecordClass: 'Record Class',
	dsPageSize: 'Page Size',
	
	dsFixedIndexFields: 'Fixed Index Fields',
	dsIndexFields: 'Index Fields',
	dsFixedFilter: 'Fixed Filter',
	dsFilter: 'Filter',
	dsFiltered: 'Filtered',
	
	dsReadOnly: 'Read Only',
	dsAuditLogEnabled: 'Audit Log Enabled',
	
	fName: 'Field Name',
	fShortName: 'Short Name',
	fLabel: 'Label',
	fDisplayLabel: 'Display Label',
	fTip: 'Field Tip',
	fDateType: 'Data Type',
	fDetailDataset: 'Detail Dataset',
	fLength: 'Data Length',
	fScale: 'Data Scale',
	fDefaultExpr: 'Default Expression',
	fDefaultValue: 'Default Value',
	fValueStyle: 'Value Style',
	fDisplayWidth: 'Display Width',
	fDisplayOrder: 'Display Order',
	fDisplayFormat: 'Display Format',
	fAlignment: 'Alignment',
	
	fEditControl: 'Edit Control',
	fvEditControl: '(Auto)',
	fNullText: 'Null Text',
	fFormula: 'Formula',
	fReadOnly: 'ReadOnly',
	fVisible: 'Visible',
	fUnitConverted: 'Unit Converted',
	
	fRequired: 'Required',
	fDataRange: 'Data Range',
	fRegularExpr: 'Regular Expression',
	fUnique: 'Unique',
	fEditMask: 'Edit Mask',
	fValueCountLimit: 'Value Count Limit',
	fValidChars: 'Valid Chars',
	
	fMergeSame: 'Merge Same',
	fMmergeSameBy: 'Merge Same By',
	fAggraded: 'Aggraded',
	fAggradedBy: 'Aggraded By',
	fValueFollow: 'Value Follow',
	fFocused: 'Focused',
	
	fFixedValue: 'Fixed Value',
	fAntiXss: 'Anti-Xss',
	fTrueValue: 'True Value',
	fFalseValue: 'False Value',
	fTrueText: 'True Text',
	fFalseText: 'False Text',
	fLookup: 'Lookup Field',
	
	fvNullText: '(Empty)'
};

locale.ImageViewer = {
	caption: 'Image Viewer'
};

locale.ChartDialog = {
	caption: 'Chart',
	chartType: 'Chart',
	recordRange: 'Range',
	rrAll: 'All',
	rrCurrent: 'Current',
	rrSelected: 'Selected',
	
	reverse: 'Inverse X-Y Axis',
	valueFields: 'Fields',
	ctLine: 'Line',
	ctPie: 'Pie',
	ctBar: 'Bar',
	ctStackBar: 'Stack Bar',

	valueFieldsRequired: 'Value fields required!'
};

locale.Report = {
	tips: 'Connecting Jslet report assistant failed! Open it first!',
	tips1: 'If it\'s running, it need to be certificated, continue?',
	ignoreWarning: 'It\'s opening the certificate page now, the browser will pop up the warning message, ignore it and continue to open the page!',
	notFoundDs: 'Not found dataset: {0}'	
};


/* jshint ignore:start */
	return locale;
});
/* jshint ignore:end */
