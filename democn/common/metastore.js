(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(factory);
	    } else {
	    	define(function(require, exports, module) {
	    		module.exports = factory();
	    	});
	    }
    } else {
    	factory();
    }
})(function () {
	/********************************** Dataset Meta Store ************************************************/
	/******************（实际开发中，这部分代码可以存入缓存中，然后用DatasetFactory创建，一行代码搞定）****************/
    var metaStore = []; 
	
	//“性别”
    metaStore.push({name: 'gender', description: '性别', isEnum: true, records: 'F:女,M:男,U:未知'});

    //“职位”
    metaStore.push({name: 'position', description: '职位', isEnum: true, records: '0:总经理,1:经理,2:主管,3:员工'});
    
    //“货币”
    metaStore.push({name: 'currency', description: '货币', isEnum: true, records: 'RMB:人民币,USD:美元,HKD:港币'});
    
    //创建“称呼”，称呼有性别之分
    var salutationFldCfg =[
      { name: 'code', dataType: 'S', length: 2, label: '称呼编码'},
  	  { name: 'name', dataType: 'S', length: 30, label: '称呼名称'},
  	  { name: 'gender', dataType: 'S', length: 2, label: '性别'}
  	];
    
    var records = [{code:'Sir', name:'先生', gender: 'M'}, {code:'Gentleman', name:'阁下', gender: 'M'},
           	  	{code:'Mr', name:'兄弟', gender: 'M'}, {code:'Miss', name:'小姐', gender: 'F'}, {code:'Madam', name:'女士', gender: 'F'},
        	  	{code:'Mrs', name:'姐妹', gender: 'F'}, {code:'Dr', name:'博士', gender: 'B'}
        	];
    //“称呼”
    metaStore.push({name: 'salutation', description: '称呼', fields: salutationFldCfg, keyField: 'code',  nameField: 'name', records: records});

    //“省份”
    metaStore.push({name: 'province', description: '省份', isEnum: true, records:
    		'01:安徽,02:北京,03:福建,04:甘肃,05:广东,06:广西,07:贵州,08:海南,09:河北,10:河南,11:黑龙江,12:湖北,'+
             '13:湖南,14:吉林,15:江苏,16:江西,17:辽宁,18:内蒙古,19:宁夏,20:青海,21:山东,22:山西,23:陕西,24:上海,'+
             '25:四川,26:天津,27:西藏,28:新疆,29:云南,30:浙江,31:重庆'});

    //"部门"
    var deptFldCfg = [
       {name: 'deptid', dataType: 'S', length: 10, displayWidth: 6, label: '部门编码'}, 
       {name: 'name', dataType: 'S', length: 15, label: '部门名称'}, 
       {name: 'address', dataType: 'S', length: 50, label: '部门地址'}, 
       {name: 'parentid', dataType: 'S', length: 10, label: '父级部门编码', visible:false}];

    var data = [{deptid: '00', name: '行政部', address: '深圳'}, 
                {deptid: '01',  name: '市场部', address: '北京'}, 
                {deptid: '0101', name: '成都分部', address: '成都', parentid: '01'}, 
                {deptid: '0102', name: '上海分部', address: '上海', parentid: '01'}, 
                {deptid: '02', name: '研发部', address: '深圳'}, 
                {deptid: '0201', name: '研发一部', address: '深圳', parentid: '02'}, 
                {deptid: '0202', name: '研发二部', address: '深圳', parentid: '02'}, 
                {deptid: '03', name: '质量部', address: '深圳'}, 
                {deptid: '04', name: '财务部', address: '深圳'}];

    metaStore.push({name: 'department', description: '部门', fields: deptFldCfg, 
		keyField: 'deptid',codeField: 'deptid', nameField: 'name', 
		parentField: 'parentid', autoRefreshHostDataset: true,
		records: data});

    //"员工信息"
    var fldCfg = [
       {name: 'id', dataType: 'S', length: 6, label: '编码', required: true, tip: '编码不得重复!', unique: true}, 
       {name: 'name', dataType: 'S', length: 20, label: '姓名', required: true, unique: true, aggraded: true, tip: '名称不得重复!', displayWidth: 10}, 
       {name: 'department', dataType: 'S', length: 10, label: '部门', dislayWidth: 16, required: true, lookup: {dataset: 'department'}, editControl: 'DBComboSelect'}, 
       {name: 'gender', dataType: 'S', length: 6, label: '性别', lookup: {dataset: 'gender'}},
       {name: 'salutation', dataType: 'S', length: 10, label: '称呼', displayWidth: 6, lookup: {dataset: 'salutation'}},
       {name: 'age', dataType: 'N', length: 6, label: '年龄', displayWidth: 6, dataRange: {min: 18, max: 60 }, formula: '[birthday]?((new Date()).getFullYear() - [birthday].getFullYear()): 0'},
       {name: 'married', dataType: 'B', label: '已婚', trueValue: 1, falseValue: 0, displayWidth: 10},
       {name: 'birthday', dataType: 'D', label: '生日', displayFormat: 'yyyy-MM-dd', dataRange: {min: new Date(1960, 1, 1), max: new Date()}},
       {name: 'position', dataType: 'S', length: 10, label: '职位', lookup: {dataset: 'position'}},
       {name: 'salary', dataType: 'N', length: 10, scale: 2, label: '薪水', displayFormat: '￥#,##0.##', aggraded: true},
       {name: 'currency', dataType: 'S', length: 6, label: '货币', lookup: {dataset: 'currency'}},
       {name: 'idcard', dataType: 'S', length: 18, label: '身份证号', encrypted: {start: 10, end: 15},
	   		regularExpr: /\d{18}/ig, regularMessage: '无效身份证号, 须18位数字!', tip: '18数字'},
       {name: 'university', dataType: 'S', length: 50, label: '毕业院校', displayWidth: 16},
       {name: 'province', dataType: 'S', length: 10, label: '省份', lookup: {dataset: 'province'}, editControl: 'DBComboSelect'},
       {name: 'city', dataType: 'S', length: 10, label: '城市', visible: false},
       {name: 'photo', dataType: 'S', length: 50, label: '照片', displayWidth: 10},
       {name: 'officePhone', dataType: 'S', length: 20, label: '公司电话', 
    	   		regularExpr: /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, regularMessage: '无效电话号码!', tip: '格式:999-99999999'},
       {name: 'cellPhone', dataType: 'S', length: 12, label: '手机', 
    	   		regularExpr: /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, regularMessage: '无效手机号码!', tip: '"1"+10 数字'},
       {name: 'email', dataType: 'S', length: 50, label: 'Email', displayWidth: 20, 
    	   		regularExpr: /^[a-zA-Z_0-9-'\+~]+(\.[a-zA-Z_0-9-'\+~]+)*@([a-zA-Z_0-9-]+\.)+[a-zA-Z]{2,7}$/ig, regularMessage: '无效 Email地址!', tip: 'foo@foo.com'},
       {name: 'summary', dataType: 'S', length: 200, label: '备注', displayWidth: 20, editControl: 'DBTextArea'} 
    ];

    //创建规则：“称呼”字段的可选项根据“性别”字段值进行变化
	var rule1 = {condition: '[gender]', rules: [{field: 'salutation', lookup: {filter: '[gender] == "${gender}" || [gender] == "B"'}}]};

	metaStore.push({name: 'employee', fields: fldCfg, keyField: 'id', description: '员工信息',
    	queryUrl: '/demo/employee/findall', submitUrl: '/demo/employee/save',
    	contextRules: [rule1]});
	
/////////////////////////////////////////////////////////////////
	//"PaymentTerm"
	metaStore.push({name: "paymentTerm", description: '付款方式', isEnum: true, records: {'01':'M/T','02':'T/T'}});

	//"Customer"
	metaStore.push({name: "customer", description: '客户', isEnum: true, records: {'01':'ABC','02':'Oil Group LTD','03':'Mail Group LTD'}});

	var detailFldCfg = [
		{name: 'action', label: '动作', dataType: 'E', displayWidth: 1},
		{name: 'seqno', dataType: 'N', label: '序号'},
		{name: 'product', dataType: 'S', label: '货物名称', length: 20},
		{name: 'qty', dataType: 'N', label: '数量', length: 11, defaultValue: 2},
		{name: 'price', dataType: 'N', label: '价格', length: 11, scale: 2},
		{name: 'amount', dataType: 'N', label: '金额', length: 11, scale: 2, 
			formula: '[qty]*[price]', aggraded: true, displayFormat: '#,##0.00'}
	];
	
	metaStore.push({name: 'salesDetail', description: '销售明细', fields: detailFldCfg});
	//销售主表字段定义
	var fieldCfg = [{name: 'action', label: '动作', dataType: 'E', displayWidth: 1},
		{name: 'saleid', dataType: 'S', label: '销售单号'},
		{name: 'saledate', dataType: 'D', label: '销售日期', displayFormat: 'yyyy-MM-dd'},
		{name: 'customer', dataType: 'S', label: '客户', length: 20, lookup: {dataset: 'customer'}},
		{name: 'paymentterm', dataType: 'S', label: '付款方式', lookup: {dataset: 'paymentTerm'}},
		//主表中增加一个DataType为'V'类型的字段details，用来指向明细数据集：salesDetail
		{name: 'details', dataType: 'V', label: '销售明细', detailDataset: 'salesDetail'},
		{name: 'comment', dataType: 'S', length: 20, label: '说明'}
	];

	metaStore.push({name: 'salesMaster', description: '销售单', fields: fieldCfg});
	
/////////////////////////////////////////////////////////////////	
	//根据数据集名称查找数据集的定义信息
	function getDatasetMeta(dsName) {
		var meta;
		for(var i = 0, len = metaStore.length; i < len; i++) {
			meta = metaStore[i];
			if(meta.name == dsName) {
				return meta;
			}
		}
	};
	
	window.datasetMetaStore = {getDatasetMeta: getDatasetMeta, getAllMetas: function() {return metaStore}};
	return window.datasetMetaStore;
});
