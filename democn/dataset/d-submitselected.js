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
	//创建“订单”数据集
	var fldCfg = [
		{ name: 'state', type: 'S', length: 30, label: 'Audit State', displayWidth: 8},
		{ name: 'auditor', type: 'S', length: 20, label: 'Auditor', displayWidth: 10},
		{ name: 'auditdate', type: 'D', length: 20, label: 'Audit Date', displayFormat: 'yyyy-MM-dd hh:mm:ss'},
		{ name: 'product', type: 'S', length: 30, label: 'Product', displayWidth: 16},
		{ name: 'price', label: 'Price', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00'},
		{ name: 'quantity', label: 'Quantity', type: 'N', length: 5, displayFormat: '#,##0.00' },
		{ name: 'cost', label: 'Total Cost', type: 'N', length: 12, scale: 2, displayFormat: '#,##0.00', formula:'[price]*[quantity]' }
		];
	var dsOrder = new jslet.data.Dataset({name: 'product', fields: fldCfg});
	dsOrder.queryUrl('/demo/order/findall');
   	jslet.ui.install();
    
    //绑定按钮事件
	$('#btnQuery').click(function() {
		//查询
		dsOrder.query();
	});
	
	$('#btnAudit').click(function() {
		if(!dsOrder.hasSelectedRecords()) {
			jslet.ui.info('请先选择数据，再审核！', null, null, 1000);
			return;
		}
		dsOrder.submitSelected('/demo/order/audit');
	});

	$('#btnCancelAudit').click(function() {
		if(!dsOrder.hasSelectedRecords()) {
			jslet.ui.info('请先选择数据，再取消审核！', null, null, 1000);
			return;
		}
		dsOrder.submitSelected('/demo/order/cancelaudit');
	});
});
