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
    	dsEmployee.query();
    	jslet.ui.install();
    });
    
    //设置范围为今年内出生的
    $('#btnSetRange').click(function() {
    	var dsEmployee = jslet.data.getDataset('employee');
    	var fldObj = dsEmployee.getField('birthday');
    	var currDate = new Date();
    	var currYear = currDate.getFullYear();
    	
    	fldObj.dataRange({min: new Date(currYear, 0, 1), max: new Date()})
    	jslet.ui.info('已设置了生日范围，请点击日期控件！');
    });
        
});
