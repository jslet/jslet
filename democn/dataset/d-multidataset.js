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
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.queryUrl('/demo/employee/findEmployeeAndDepartment');
    	//清除“部门”数据集的本地数据以便接收服务端返回的数据
    	jslet.data.getDataset('department').records(null);
    	jslet.ui.install();
    });
    
    //绑定按钮事件
	$('#btnQuery').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.query();
	});
});
