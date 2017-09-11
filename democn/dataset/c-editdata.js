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
    	jslet.ui.install(initialize);
    });
    
    function initialize() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.query();

		//设置数据集事件
		dsEmployee.datasetListener(function (evtType) {
	        $('#txtLogs').val($('#txtLogs').val() + evtType + '; ');

	        if (evtType == jslet.data.DatasetEvent.AFTERINSERT) {
	            //Set default value 
	        }
	    });
		//设置字段值修改时的事件
		dsEmployee.onFieldChanged(function(fldName, fldValue) {
			$('#txtLogs').val($('#txtLogs').val() + '字段名：' + fldName + 
					'的值改为：' + fldValue + ' ; ');
		});
    }
    
    //绑定按钮事件
	$('#btnQuery').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.query();	
	});
	$('#btnAppend').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.appendRecord();	
	});
	$('#btnDelete').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
        jslet.ui.confirm('确实要删除吗?', '确认', function(button) {
        	if(button === 'ok') {
        		dsEmployee.deleteRecord();	
        	}
        });
	});
    
});
