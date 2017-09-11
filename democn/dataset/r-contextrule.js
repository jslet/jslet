(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['jslet'], factory);
	    } else {
	    	define(function(require, exports, module) {
	    		module.exports = factory();
	    	});
	    }
    } else {
    	factory();
    }
})(function () {
	/********************************** 定义数据集 ************************************************/
	//定义基础数据集
	new jslet.data.Dataset({name: 'ContactType', isEnum: true, records: 'I:Individual,O:Organization'}); 
	new jslet.data.Dataset({name: 'Gender',  isEnum: true, records: 'F:Female,M:Male'}); 
	new jslet.data.Dataset({name: 'PerferChannel',  isEnum: true, records: '01:Postal Mail,02:Phone,03:Email'}); 
	new jslet.data.Dataset({name: 'Race',  isEnum: true, records: '01:Brown,02:Yellow,03:White'}); 

	var salutationFldCfg =[
	   	{ name: 'code', type: 'S', length: 2, label: 'Code'},
		{ name: 'name', type: 'S', length: 30, label: 'Name'},
		{ name: 'gender', type: 'S', length: 30, label: 'Gender' }
	];
	var dsSalutation = new jslet.data.Dataset({name: 'Salutation', fields: salutationFldCfg, keyField: 'code', codeField: 'code', nameField: 'name'});

	dsSalutation.records([
		{code:'Sir', name:'Sir', gender: 'M'},
		{code:'Gentleman', name:'Gentleman', gender: 'M'},
		{code:'Mr', name:'Mr.', gender: 'M'},
		{code:'Miss', name:'Miss', gender: 'F'},
		{code:'Madam', name:'Madam', gender: 'F'},
		{code:'Mrs', name:'Mrs.', gender: 'F'},
		{code:'Dr', name:'Dr.', gender: 'B'}
	]);

	var countryFldCfg = [
		{ name: 'code', type: 'S', length: 2, label: 'Country Code', displayWidth: 6, editMask: {mask:'LL',transform: 'upper'}, required: true },
		{ name: 'name', type: 'S', length: 30, label: 'Country Name', displayWidth: 20, required: true },
		{ name: 'phoneMask', type: 'S', length: 30, label: 'Phone Mask', displayWidth: 20 },
		{ name: 'ssnMask', type: 'S', length: 30, label: 'SSN Edit Mask', displayWidth: 20 },
		{ name: 'idCardMask', type: 'S', length: 20, label: 'ID Card Mask', displayWidth: 20},
		{ name: 'driverLicenseMask ', type: 'S', length: 20, label: 'Driver\'s License Number Mask', displayWidth: 20}
	];

	var dsCountry = new jslet.data.Dataset({name: 'Country', fields: countryFldCfg, keyField: 'code', codeField: 'code', nameField: 'name'}); 

	dsCountry.records([
	 {code:'CN', name:'China', phoneMask: '(86)9009-00000009',ssnMask: 'NO999999', idCardMask: '',driverLicenseMask:''},
	 {code:'US', name:'United State', phoneMask: '(1)9009-00000009',ssnMask: 'US999999', idCardMask: '',driverLicenseMask:''}
	]);
	
	//定义主数据集: Contact 
	var contactFldCfg = [
	  	{ name: 'id', type: 'N', length: 8, label: 'Num#', displayWidth: 6, diaplayFormat: '##0' },
	  	{ name: 'contactType', type: 'S', length: 1, label: 'Contact Type', defaultValue: 'I', 
	  		lookup: {dataset: 'ContactType'},editControl:"DBRadioGroup", tip: 'Change it and check other fields.' },
	  	{ name: 'firstName', type: 'S', length: 10, label: 'First Name', required: true },
	  	{ name: 'lastName', type: 'S', length: 20, label: 'Last Name', required: true },
	  	{ name: 'gender', type: 'S', length: 1, label: 'Gender', required: true, lookup: {dataset: 'Gender'},tip: 'Change it and check "Salutation" field.' },
	  	{ name: 'salutation', type: 'S', length: 1, label: 'Salutation',lookup: {dataset: 'Salutation'} },
	  	
	  	{ name: 'title', type: 'S', length: 10, label: 'Title'},
	    { name: 'country', type: 'S', length: 2, label: 'Country', displayWidth: 10, required: true, defaultValue: 'US',
	  		lookup: {dataset: 'Country'}, tip: 'Change it and check the edit mask of "Phone", "SSNCode" etc.' },
	    { name: 'city', type: 'S', length: 15, label: 'City', displayWidth: 10 },
	    { name: 'birthday', type: 'D', label: 'Birthday'},
	  	{ name: 'phone', type: 'S', length: 12, label: 'Phone' },
	  	{ name: 'ssnCode', type: 'S', length: 20, label: 'SSN Code', displayWidth: 10 },
	  	{ name: 'idCardNum', type: 'S', length: 20, label: 'ID Card#', displayWidth: 10 },
	  	{ name: 'driverLicenseNum', type: 'S', length: 20, label: 'Driver\'s License#', displayWidth: 10 },
	  	{ name: 'race', type: 'S', length: 1, label: 'Race',lookup: {dataset: 'Race'} },
	  	{ name: 'perferChannel', type: 'S', length: 1, label: 'Perfer Channel',lookup: {dataset: 'PerferChannel'} }
	];

	var dsContact = new jslet.data.Dataset({name: 'Contact', fields: contactFldCfg, keyField: 'id'});
	dsContact.records([
		{id:1, contactType: 'I', firstName: 'Tom', lastName: 'Zeng', gender: 'M',title:'PM',
		country:'CN', perferChannel:'03', race:'02', salutation: 'Sir'},
		{id:2, contactType: 'O', title:'Google', country:'US', perferChannel:'02'}
	]);
	
	//定义上下文规则
	//规则一： 根据国家设置“phone”，“ssnCode”，“idCardNum”，“driverLicenseNum”的EditMask
	var rule1 = {
		condition: '[country]',
		rules:[
		{field: 'phone', meta: {editMask: 'expr:[Contact!country.phoneMask]'}},
		{field: 'idCardNum', meta: {editMask: 'expr:[Country!idCardMask]'}},
		{field: 'driverLicenseNum', meta: {editMask: 'expr:[Country!driverLicenseMask]'}}		
		]
	};
	//规则二：如果contactType是 “组织机构（O)", 则与个人有关的字段不能编辑.
	var rule2 = {
		condition: '[contactType] == "O"',
		rules:[
			{field: 'gender', meta: {disabled: true}, value: null},
			{field: 'firstName', meta: {disabled: true}, value: ''},
			{field: 'lastName', meta: {disabled: true}, value: ''},
			{field: 'salutation', meta: {disabled: true}, value: ''},
			{field: 'birthday', meta: {disabled: true}, value: null},
			{field: 'race', meta: {disabled: true}, value: null}
		],
		otherwise: [
			{field: 'gender', meta: {disabled: false}},
			{field: 'firstName', meta: {disabled: false}},
			{field: 'lastName', meta: {disabled: false}},
			{field: 'salutation', meta: {disabled: false}},
			{field: 'birthday', meta: {disabled: false}},
			{field: 'race', meta: {disabled: false}}
		]
	};
	//规则三：“称呼”字段的值范围根据“性别”不同而不同.
	var rule3 = {
		condition: '[gender]',
		rules: [
		        {field: 'salutation', lookup: {filter: '[gender] == "${gender}" || [gender] == "B"'}}
		]
	};
	dsContact.contextRules([rule1, rule2, rule3]);
	dsContact.enableContextRule();
	
    jslet.ui.install();
    
});
