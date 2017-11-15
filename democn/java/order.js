(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['jslet'], factory);
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
    var fldCfg = [
        {name: 'action', dataType: 'E'}, 
        {name: 'seqno', dataType: 'N', length: 6, label: '序号'},
        {name: 'product', dataType: 'S', length: 20, label: '产品'},
        {name: 'qty', dataType: 'N', length: 6, label: '数量'},
        {name: 'price', dataType: 'N', length: 8, scale: 2, label: '数量'},
        {name: 'amount', dataType: 'N', length: 10, scale: 2, label: '金额', formula: '[qty]*[price]'}
        ];
    //创建订单明细
    var dsOrderItem = new jslet.data.Dataset({name: 'orderItem', fields: fldCfg});
    
    fldCfg = [
       {name: 'action', dataType: 'E'}, 
       {name: 'orderNo', dataType: 'S', length: 11, label: '订单号', required: true, tip: '订单号不得重复!', unique: true}, 
       {name: 'orderDate', dataType: 'D', length: 10, label: '下单日期', required: true}, 
       {name: 'customer', dataType: 'S', length: 6, label: '客户'},
       {name: 'paymentTerm', dataType: 'S', length: 6, label: '付款条款', displayWidth: 6},
       {name: 'items', dataType: 'V', label: '订单明细', detailDataset: 'orderItem'}
       ];
    //创建“订单”数据集
    var dsOrder = new jslet.data.Dataset({name: 'order', fields: fldCfg});
	
    //设置订单的实体类名
    dsOrder.recordClass('com.jslet.sample.order.Order');
    //设置订单明细的实体类名
    dsOrderItem.recordClass('com.jslet.sample.order.OrderItem');
    //设置查询URL
    dsOrder.queryUrl("/order/find");
    //设置保存URL
    dsOrder.submitUrl("/order/save");
    
    //查询数据
    $('#btnQuery').on('click', function() {
    	dsOrder.query();
    });
    $('#btnSave').on('click', function() {
    	dsOrder.submit();
    });
    jslet.ui.install();
});
