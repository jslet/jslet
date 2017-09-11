(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['common/metastore', 'jslet', 'mock/employee-mock'], factory);
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
    //创建“部门”数据集
    var dsDept = new jslet.data.Dataset(datasetMetaStore.getDatasetMeta('department'));
    
	//创建测试数据集
	var dsCfg = {name: "btwdataset", fields: [
	    {name: 'action', dataType: 'E'},
		{name: 'name', dataType: 'S', length: 10, label: 'Name', valueStyle: jslet.data.FieldValueStyle.BETWEEN},//between style
		{name: 'birthday', dataType: 'D', length: 10, displayWidth: 15, label: 'Birthday', valueStyle: jslet.data.FieldValueStyle.BETWEEN},
		{name: 'salary', dataType: 'N', length: 12, scale: 2, displayFormat: '#,##0.00', label: 'Salary', valueStyle: jslet.data.FieldValueStyle.BETWEEN},
		{name: 'department', dataType: 'S', length: 12, label: 'Department', lookup: { dataset: 'department'}, valueStyle: jslet.data.FieldValueStyle.BETWEEN},
	]};
	dsBetween = new jslet.data.Dataset(dsCfg);
	dsBetween.appendRecord();
	
	jslet.ui.install();
});
