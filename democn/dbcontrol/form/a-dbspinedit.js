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
    	jslet.data.getDataset('employee').query();
    	jslet.ui.install();
    });
    
    //设置最大最小值(1000, 10000)
    $('#btnSetDataRange').click(function() {
    	var dsEmployee = jslet.data.getDataset('employee');
    	//设置字段对象的dataRange属性即可
    	dsEmployee.getField('salary').dataRange({min: 1000, max: 10000})
    });
});
