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
	//创建数据集
    var fldCfg = [
		{name: 'month', dataType: 'S', label: "Month"},
		{name: 'amount', dataType: 'N', label: "Amount", displayFormat: "#,##0.00"},
		{name: 'netprofit', dataType: 'N', label: "Net Profit", displayFormat: "#,##0.00"}
	];
    var dsSummary = new jslet.data.Dataset({name: "summary", fields: fldCfg});

    //创建演示数据
    var records = [{"month": "Jan.", "amount": 20000, "netprofit": 8000 },
        {"month": "Jan.", "amount": 30000, "netprofit": 11000 },
		{"month": "Feb.", "amount": 55500, "netprofit": 21000 },
		{"month": "Mar.", "amount": 45300, "netprofit": 14090 },
		{"month": "Apr.", "amount": 29300, "netprofit": 7409 },
		{"month": "May.", "amount": 49300, "netprofit": 12409 },
		{"month": "Jun.", "amount": 57900, "netprofit": 19900}
	];
    dsSummary.records(records);

    jslet.ui.install();
    
    //绑定按钮事件
	$('#btnChart').click(function() {
		var chartDlg = new jslet.ui.ChartDialog('summary', {categoryField: 'month'});
		chartDlg.show();
	});

});
