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
    	//设置“部门”字段为多选
    	dsEmployee.getField('department').valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
    	//设置“职位”字段为单选
    	dsEmployee.getField('position').valueStyle(jslet.data.FieldValueStyle.NORMAL);
    	dsEmployee.query();
    	jslet.ui.install();
    });
    
    //1、可设置显示的列数
    $('#btnSetColumn').click(function() {
    	jslet('#cbgDept').columnCount(4).renderAll();
    });
    
    //3、可设置最多选择个数
    $('#btnSetLimitCount').click(function() {
    	var dsEmployee = jslet.data.getDataset('employee');
    	var fldObj = dsEmployee.getField('department');
    	fldObj.valueCountLimit(3);
    	jslet.ui.info('已设置，请选择值！');
    });
    
});
