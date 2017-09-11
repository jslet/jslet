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
	var bomService = {
		find: function(pageNo, pageSize, pageCount) {
			var result = [];
			var count = pageNo + pageSize;
			for(var i = 1; i <= pageSize; i++) {
				result.push({itemid: 'item' + (i + (pageNo - 1) * pageSize), quantity: Math.round(Math.random()* 20)});
			}
			return result;
		}
	}
	
	jQuery.mockjax({
		url : "/demo/bom/find",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			var data = JSON.parse(request.data);
			data.pageCount = Math.ceil(20000 / data.pageSize);
			data.main = bomService.find(data.pageNo, data.pageSize, data.pageCount);
			this.responseText = data;
		}
	});

	var performanceService = {
		find: function() {
			var result = [];
			for(var i = 0; i < 20000; i++) {
				var rec = {};
				for(var j = 1; j <= 70; j++) {
					rec['a' + j] = 'value'+ j + '-' + i;
				}
				result.push(rec)
			}
			return result;
		}
	}
	
	jQuery.mockjax({
		url : "/demo/perf/find",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [100, 300],
		response: function(request) {
			this.responseText = {main: performanceService.find()};
		}
	});

	
});
