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
    var records = [
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
	$('#selChartType').on('change', function() {
		//修改图表类型
		var chartObj = jslet('#chartId');
		var chartType = $(this).val();
		if(chartType == 'stackbar') {
			chartObj.valueFields('amount,netprofit');
		}
		chartObj.chartType(chartType);
		chartObj.renderAll();
	});
	
	$('#selValueFields').on('change', function() {
		//改变图表的显示值
		var chartObj = jslet('#chartId');
		chartObj.valueFields($(this).val());
		chartObj.renderAll();
	});

	$('#btnChangeTitle').click(function() {
		//修改图表抬头
		var chartObj = jslet('#chartId');
		chartObj.chartTitle($('#txtChartTitle').val());
		chartObj.renderAll();
	});
	$('#btnSetFilter').click(function() {
		//设置筛选条件以观察图表重绘
		var chartObj = jslet('#chartId');
		var dsObj = chartObj.dataset();
		var filter = jQuery.trim($('#txtFilter').val());
		if(filter) {
			dsObj.filter(filter);
			dsObj.filtered(true);
		} else {
			dsObj.filtered(false);
		}
	});
    
	$('#btnClearFilter').click(function() {
		//清除筛选条件
		dsSummary.filtered(false);
		dsSummary.first();
	});
});
