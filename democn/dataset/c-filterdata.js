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
    
    function filterData(filter) {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.filter(filter);
		dsEmployee.filtered(true);
    }
    
    //绑定按钮事件
	$('#btnFilter1').click(function() {
		filterData($('#txtFilter1').val());
	});
	
	$('#btnFilter2').click(function() {
		filterData($('#txtFilter2').val());
	});
	
	$('#btnFilter3').click(function() {
		filterData($('#txtFilter3').val());
	});
	
	$('#btnFilter4').click(function() {
		filterData($('#txtFilter4').val());
	});
	
	$('#btnFilter5').click(function() {
		filterData($('#txtFilter5').val());
	});
	
	$('#btnFilter6').click(function() {
		filterData($('#txtFilter6').val());
	});

	//清除筛选条件，显示全部数据
    function clearFilter() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.filter(null);
		dsEmployee.filtered(false);
    }
	$(document.body).find('*[name=btnClear]').click(clearFilter);
	
});
