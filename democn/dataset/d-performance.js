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
	var fields = [{ "name": "longFieldName1", shortName: 'a1', "type": "S", "length": 10, "label": "Field 1", aggraded: true }];
	for(var i = 2; i < 71; i++) {
		fields.push({ "name": "longFieldName" + i, shortName: 'a' + i, "type": "S", "length": 10, "label": "Field " + i});
	}
    var dsBigTable = new jslet.data.Dataset({name: "bigtable", fields: fields, keyField: "field1"});

    dsBigTable.queryUrl('/demo/perf/find');
	jslet.ui.install();
	
    //绑定按钮事件
	$('#btnQuery').click(function() {
        var waitingbox = new jslet.ui.WaitingBox(document.body);
        waitingbox.show("正在查询，请稍后...");
		dsBigTable.query().always(function() {
			waitingbox.destroy(); 
			waitingbox = null;
		});
	});
		
});
