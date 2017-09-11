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
    	cloneDataset();
    	jslet.ui.install();
    });
    
    function cloneDataset() {
		var dsEmployee = jslet.data.getDataset('employee');
		//Clone出一个数据集：criteria，用于输入查询条件
		var dsCriteria = dsEmployee.clone('criteria', ['salary','gender']);
		//修改“工资”字段的属性
		dsCriteria.getField('salary').valueStyle(jslet.data.FieldValueStyle.BETWEEN);
		dsCriteria.insertRecord();
		dsCriteria.autoShowError(false);
    }
    //绑定按钮事件
	$('#btnQuery').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		var dsCriteria = jslet.data.getDataset('criteria');
		dsEmployee.queryUrl('/demo/employee/find');
		dsEmployee.query(dsCriteria.getRecord());
		dsEmployee.first();
	});
	   
});
