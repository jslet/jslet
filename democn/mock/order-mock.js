(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['jquery', 'lib/mock/jquery.mockjax.min'], factory);
	    } else {
	    	define(function(require, exports, module) {
	    		module.exports = factory();
	    	});
	    }
    } else {
    	factory();
    }
})(function () {
	/* Order */
	var orderList = [
	     {product: 'TV', price: 3000, quantity: 50},
	     {product: 'Computer', price: 7500, quantity: 30},
	     {product: 'Car', price: 20000, quantity: 3},
	     {product: 'Mouse', price: 26, quantity: 700},
	     {product: 'Desk', price: 300, quantity: 150}
	 ];
	
	var orderService = {
		findAll: function() {
			return orderList;
		},
		
		audit: function(orders) {
			var order;
			for(var i = 0, len = orders.length; i < len; i++) {
				order = orders[i];
				order.state = 'audit';
				order.auditor = 'Jack';
				order.auditdate = new Date();
			}
			return orders;
		},
		
		cancelAudit: function(orders) {
			var order;
			for(var i = 0, len = orders.length; i < len; i++) {
				order = orders[i];
				order.state = '';
				order.auditor = '';
				order.auditdate = null;
			}
			return orders;
		}
	}
	
	jQuery.mockjax({
		url : "/demo/order/findall",
		contentType : "application/json",
		dataType: 'json',
		responseTime: 100,
		response: function(request) {
			this.responseText = {main: orderService.findAll()};
		}
	});

	jQuery.mockjax({
		url : "/demo/order/audit",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			var data = JSON.parse(request.data);
			data.main = orderService.audit(data.main);
			this.responseText = data;
		}
	});

	jQuery.mockjax({
		url : "/demo/order/cancelaudit",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			var data = JSON.parse(request.data);
			data.main = orderService.cancelAudit(data.main);
			this.responseText = data;
		}
	});
});
