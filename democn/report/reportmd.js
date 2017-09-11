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
	var getMeta = datasetMetaStore.getDatasetMeta;
	//创建销售明细数据集
    var dsPaymentTerm = new jslet.data.Dataset(getMeta('paymentTerm'));
    var dsCustomer = new jslet.data.Dataset(getMeta('customer'));
    var dsDetail = new jslet.data.Dataset(getMeta('salesDetail'));
    var dsMaster = new jslet.data.Dataset(getMeta('salesMaster'));
    
    //Add data into detail dataset
    var detail1 = [{ "seqno": 1, "product": "P1", "qty": 2000, "price": 11.5 },
				{ "seqno": 2, "product": "P2", "qty": 1000, "price": 21.5 },
				{ "seqno": 3, "product": "P3", "qty": 3000, "price": 31.5 },
				{ "seqno": 4, "product": "P4", "qty": 5000, "price": 41.5 },
				{ "seqno": 5, "product": "P5", "qty": 8000, "price": 51.5}];

    var detail2 = [{ "seqno": 1, "product": "M1", "qty": 1, "price": 10001 },
    				{ "seqno": 2, "product": "M2", "qty": 2, "price": 30000}];

    //Add data into master dataset
    var dataList = [{ "saleid": "200901001", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02", "details": detail1 },
			{ "saleid": "200901002", "saledate": new Date(2001, 1, 1), "customer": "01", "paymentterm": "01", "details": detail2 },
			{ "saleid": "200901003", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02"}];
    dsMaster.records(dataList);
	
	/********************************** 结束定义数据集 ************************************************/

	var template = $('#reportTemplate').text();
	
	//设计新的报表模板
	$('#btnDesign').click(function() {
		jslet.defaultReport.design('salesMaster', 'salesReport', '销售明细报表');
	});
	//修改现有的报表模板
	$('#btnDesignEdit').click(function() {
		jslet.defaultReport.design('salesMaster', 'salesReport', '销售明细报表', template);
	});
	//预览报表
	$('#btnPreview').click(function() {
		jslet.defaultReport.preview('salesMaster', 'salesReport', '销售明细报表', template);
	});
	//打印报表
	$('#btnPrint').click(function() {
		jslet.defaultReport.print('salesMaster', 'salesReport', '销售明细报表', template);
	});
	
	//创建控件
	jslet.ui.install();
	
});
