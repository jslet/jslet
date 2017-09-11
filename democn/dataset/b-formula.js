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
	//创建销售明细数据集
    var dsDetail = new jslet.data.Dataset(getMeta('salesDetail'));
    dsDetail.records([{seqno: 1, product: 'Phone', qty: 8, price: 500}]);
    
    jslet.ui.install();
    
    function setEditable() {
    	var dsObj = jslet.data.getDataset('salesDetail');
    	dsObj.getField('amount').readOnly(false);
    	jslet('#tblDetail').renderAll();
    	jslet.ui.info('“金额”字段已经可编辑，请用鼠标点击“金额”列，然后修改金额。');
    }
    
	jQuery('#btnSetEditable').on('click', setEditable);
});
