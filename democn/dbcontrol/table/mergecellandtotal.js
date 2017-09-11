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
	var fldCfg =[{ name: 'orderNo', type: 'S', length: 30, displayWidth: 12,label: 'Order No', 
					mergeSame: true, aggregated: true, aggregatedBy: 'orderNo'}, //设置单元格合并和合计行
					
	            { name: 'customer', type: 'S', length: 60, label: 'Customer', displayWidth: 15, 
						mergeSame: true, mergeSameBy: 'orderNo'}, //设置单元格合并
						
	            { name: 'totalAmount', type: 'N', length: 11, label: 'Total Amount', scale: 2, displayFormat: '$#,##0.00', 
	            	mergeSame: true, mergeSameBy: 'orderNo', aggregated: true, aggregatedBy: 'orderNo'}, //设置单元格合并和合计行
	            	
	            { name: 'itemNo', type: 'N', length: 10, label: 'Item No', displayWidth: 8},
	            
	            { name: 'product', type: 'S', length: 30, label: 'Product', displayWidth: 20},
	            { name: 'quantity', type: 'N', length: 6, label: 'Quantity'},
	            { name: 'price', type: 'N', length: 11, label: 'Price', scale: 2, displayFormat: '$#,##0.00'},
	            { name: 'amount', type: 'N', length: 11, label: 'Amount', scale: 2, displayFormat: '$#,##0.00', formula: '[quantity] * [price]'}
	];
	
	var dsOrders = new jslet.data.Dataset({name: 'Orders', fields: fldCfg, fixedIndexFields: 'orderNo'});
	
	//创建演示数据
	var records = [
	    {orderNo: 'N001', customer: 'Microsoft', totalAmount: 23000, itemNo: 1, product: 'Computer', quantity: 3, price: 1000},
	    {orderNo: 'N001', customer: 'Microsoft', totalAmount: 23000, itemNo: 2, product: 'Desk', quantity: 50, price: 200},
	    {orderNo: 'N001', customer: 'Microsoft', totalAmount: 23000, itemNo: 3, product: 'Chair', quantity: 200, price: 50},
	    {orderNo: 'N002', customer: 'Microsoft', totalAmount: 2100, itemNo: 1, product: 'Projector', quantity: 3, price: 500},
	    {orderNo: 'N002', customer: 'Microsoft', totalAmount: 2100, itemNo: 2, product: 'Calculator', quantity: 30, price: 20},
	    {orderNo: 'N003', customer: 'IBM', totalAmount: 3000, itemNo: 1, product: 'Computer', quantity: 1, price: 1500},
	    {orderNo: 'N003', customer: 'IBM', totalAmount: 3000, itemNo: 2, product: 'Chair', quantity: 30, price: 50}
	    ];
	dsOrders.records(records);
	
	jslet.ui.install();
});
