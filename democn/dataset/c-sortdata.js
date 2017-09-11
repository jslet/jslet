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
	//将数据集定义信息仓库加到datasetFactory中，创建Dataset时会仓库里去定义信息
	jslet.data.datasetFactory.addMetaStore(window.datasetMetaStore);
	//通过工厂方法，可以自动创建主数据集及相关的数据集
    jslet.data.datasetFactory.createDataset('employee').done(function() {
    	jslet.ui.install(function() {
    		var dsEmployee = jslet.data.getDataset('employee');
    		dsEmployee.query();
    	});
    });
    
    //绑定按钮事件
	$('#btnSort1').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.indexFields($('#txtField1').val());
		dsEmployee.first();
	});
	
	$('#btnSort2').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.indexFields($('#txtField2').val());
		dsEmployee.first();
	});
	
	$('#btnSort3').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.indexFields($('#txtField3').val());
		dsEmployee.first();
	});
	
	$('#btnSort4').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.indexFields($('#txtField4').val());
		dsEmployee.first();
	});
	
    
});
