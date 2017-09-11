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
	$('#btnGetValue').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//取当前员工所属部门的地址
		var address = dsEmployee.getFieldValue('department.address');
		$('#result1').val(address);
	});
	
	$('#btnFindData').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.first();
		//查找部门地址在深圳的员工
		dsEmployee.find('[department.address]=="深圳"', true);	
	});
	
	$('#btnFilterData').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//筛选部门地址在深圳的员工
		dsEmployee.filter('[department.address]=="深圳"');
		dsEmployee.filtered(true);	
		dsEmployee.first();
	});

	$('#btnClear').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.filter(null);
		dsEmployee.filtered(false);	
		dsEmployee.first();
	});
    
	$('#btnSort1').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//按部门地址（升序）排序
		dsEmployee.indexFields('department.address');
		dsEmployee.first();
	});
    
	$('#btnSort2').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//按部门地址（降序）排序
		dsEmployee.indexFields('department.address desc');
		dsEmployee.first();
	});
    
});
