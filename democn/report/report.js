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
	//datasetMetaStore定义在公共js:common/datasetmetastore.js中
	var getMeta = datasetMetaStore.getDatasetMeta;
	//创建“性别”数据集
    var dsGender = new jslet.data.Dataset(getMeta('gender'));

    //创建“职位”
    var dsPosition = new jslet.data.Dataset(getMeta('position'));
    
    //创建“职位”
    var dsCurrency = new jslet.data.Dataset(getMeta('currency'));
    
    //创建“称呼”，称呼有性别之分
    var dsSalutation = new jslet.data.Dataset(getMeta('salutation'));

    //创建“省份”数据集
    var dsProvince = new jslet.data.Dataset(getMeta('province'));

    //创建“部门”数据集
    var dsDept = new jslet.data.Dataset(getMeta('department'));

    //创建“员工信息”数据集
    var dsEmployee = new jslet.data.Dataset(getMeta('employee'));
	dsEmployee.enableContextRule();
	
	/********************************** 结束定义数据集 ************************************************/

	var template = $('#reportTemplate').text();
	
	//查询报表数据
	$('#btnQuery').click(function() {
		dsEmployee.query();	
	});
	//设计新的报表模板
	$('#btnDesign').click(function() {
		jslet.defaultReport.design('employee', 'employee', '员工表');
	});
	//修改现有的报表模板
	$('#btnDesignEdit').click(function() {
		jslet.defaultReport.design('employee', 'employee', '员工表', template);
	});
	//预览报表
	$('#btnPreview').click(function() {
		jslet.defaultReport.preview('employee', 'employee', '员工表', template);
	});
	//打印报表
	$('#btnPrint').click(function() {
		jslet.defaultReport.print('employee', 'employee', '员工表', template);
	});
	
	//查询数据，创建控件
	dsEmployee.query();
	jslet.ui.install();
	
});
