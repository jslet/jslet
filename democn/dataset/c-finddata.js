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
	$('#btnFindById').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.first();
		//找到以后，表格的光标会跳到相应位置
		dsEmployee.findByField('id', $('#txtId').val());
	});
	
	$('#btnFindByName').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.first();
		//第一个参数如果传入数组，则会匹配数组里的所有字段
		dsEmployee.findByField(['id', 'name'], $('#txtName').val());	
	});
	
	$('#btnFindByDeptName').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.first();
		//根据“部门”的“名称”查找
		dsEmployee.findByField('department.name', $('#txtDeptName').val());	
	});

	$('#btnFindByExpr').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.first();
		//找到以后，表格的光标会跳到相应位置
		dsEmployee.find($('#txtExpr').val());	
	});
    
	$('#btnFindByExprNext').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//传入第二个参数：true，则会查找下一条
		if(!dsEmployee.find($('#txtExpr').val(), true)) {
			dsEmployee.first();
		};
	});
    
});
