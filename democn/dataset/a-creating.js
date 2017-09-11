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
	var getMeta = datasetMetaStore.getDatasetMeta;
	//创建“性别”数据集
    var dsGender = new jslet.data.Dataset(getMeta('gender'));

    //创建“部门”数据集
    var dsDept = new jslet.data.Dataset(getMeta('department'));
    
    jslet.ui.install();
});
