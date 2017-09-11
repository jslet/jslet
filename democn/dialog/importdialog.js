(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['common/metastore', 'jslet', 'mock/employee-mock', 'mock/xportschema-mock'], factory);
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
    
    //基础导入
	$('#btnBasicImport').click(function() {
		var importDlg = new jslet.ui.ImportDialog('employee');
		importDlg.show();
	});
	
    //指定字段导入
	$('#btnFieldsImport').click(function() {
		var importDlg = new jslet.ui.ImportDialog('employee', {includeFields: ['id', 'name', 'gender', 'birthday']});
		importDlg.show();
	});
	
	//按模板导入
	$('#btnAdvancedImport').click(function() {
		var importDlg = new jslet.ui.ImportDialog('employee', {hasSchemaSection: true});
		//保存导出模板
		importDlg.onSubmitSchema(function(action, changedRecord) {
			
			if(action == 'delete') {
				sendRequest('/demo/importschema/delete', changedRecord.schema);
			} else {
				sendRequest('/demo/importschema/save', changedRecord);
			}
		});
		//查询导出模板
		importDlg.onQuerySchema(function(ck) {
			return sendRequest('/demo/importschema/query');
		});
		importDlg.show();
	});
	
	function sendRequest(url, reqData, callBack) {
		var settings = {type: 'POST', contentType: 'application/json', mimeType: 'application/json', dataType: 'json', data: reqData};
		
		var defer = jQuery.Deferred();
		jQuery.ajax(url, settings)
		.done(function(data, textStatus, jqXHR) {
			defer.resolve(data);
		});
		return defer.promise();
	}
	
});
