(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['common/metastore', 'jslet'], factory);
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
    	//HTML声明式必须要运行以下代码
    	jslet.ui.install();
    });
	
    //动态HTML声明式（一般适合弹出式的对话框的创建）
	$('#btnDyncHtml').click(function() {
		var html = '<select data-jslet="type: \'DBSelect\', dataset: \'employee\', field: \'department\'" style="width: 100px"></select>';
		$('#dyncContrainer').html(html);
		//只安装指定容器下的控件
		jslet.ui.install($('#dyncContrainer')[0]);
	});
	
    //绑定式: 适合配置比较复杂的控件
	$('#btnBind').click(function() {
		var ctrlCfg = {type: 'DBTable', dataset: 'employee', hasSelectCol: true, onRowClick: function() {
			jslet.ui.info('点击！');
		}};
		
		jslet.ui.bindControl($('#tblEmployeeBind')[0], ctrlCfg);
	});
	
    //代码创建: 在某个容器中创建控件
	$('#btnCreate').click(function() {
		var ctrlCfg = {type: 'DBTable', dataset: 'employee', hasSelectCol: true};
		
		jslet.ui.createControl(ctrlCfg, $('#ctrlContainer')[0], '100%', '100%');
	});
	
	
});
