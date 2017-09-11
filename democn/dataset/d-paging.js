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
    var dsBOM = new jslet.data.Dataset({name: "bom", fields: [
         { "name": "itemid", "type": "S", "length": 10, "label": "Item ID", "displayWidth": 20, aggraded: true }, 
         { "name": "quantity", "type": "N", "length": 9, "label": "Quantity", "displayWidth": 15}], keyField: "itemid"});
		 
	dsBOM.queryUrl('/demo/bom/find');
	dsBOM.pageNo(1);
	//设置每页记录数
	dsBOM.pageSize(500);
	dsBOM.query();
	jslet.ui.install();
});
