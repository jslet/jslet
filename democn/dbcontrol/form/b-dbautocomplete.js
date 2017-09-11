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
    	
        dsEmployee.createField({name: "deptName", dataType: 'S', length: 10, label: "部门名称", displayOrder: 3});
        //设置当“department”字段改变时，同时取“部门表”的“name"的值赋给“deptName”字段
        dsEmployee.getField('department').lookup().returnFieldMap({deptName: 'name'});
    	dsEmployee.query();
    	jslet.ui.install();
    });
    
    //设置匹配模式
    $('#selSetMatchMode').on('change', function() {
    	jslet('#acDepartment').matchMode(this.value).renderAll();
    });
    
});
