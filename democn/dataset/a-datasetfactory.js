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
	var getMeta = datasetMetaStore.getDatasetMeta;
	
	var metaStore = new jslet.data.IndexedDBMetaStore('test');
	/*metaStore.addDatasetMeta('employee', window.getDatasetMeta('employee'))
	metaStore.addDatasetMeta('department', window.getDatasetMeta('department'))
	metaStore.addDatasetMeta('province', window.getDatasetMeta('province'))
	metaStore.addDatasetMeta('gender', window.getDatasetMeta('gender'))
	metaStore.addDatasetMeta('position', window.getDatasetMeta('position'))
	*/
//	metaStore.addDatasetMetas(window.datasetMetaStore.getAllMetas());
	//将数据集定义信息仓库加到datasetFactory中，创建Dataset时会仓库里去定义信息
	jslet.data.datasetFactory.addMetaStore(window.datasetMetaStore).addMetaStore(metaStore);
	
	//通过工厂方法，可以自动创建主数据集及相关的数据集, 
	//比如：employee数据集关联了6个数据集集：department, gender, position, currency, salutation, province
	//通过以下代码可以一次性地创建完毕
	jslet.data.datasetFactory.createDataset('employee').done(function() {
		jslet.data.getDataset('employee').query();
		jslet.ui.install();
    });
});
