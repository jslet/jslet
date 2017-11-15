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
    //字段信息
    var fldCfg = [
       {name: 'boCode', dataType: 'S', length: 11, label: '业务表'}, 
       {name: 'keyValue', dataType: 'S', length: 20, displayWidth: 10, label: '键值', aggraded: true}, 
       {name: 'content', dataType: 'S', length: 200, displayWidth: 20, label: '修改内容'}, 
       {name: 'user', dataType: 'S', length: 20, label: '变更用户'},
       {name: 'updateTime', dataType: 'D', length: 20, label: '变更日期', displayFormat: 'yyyy-MM-dd hh:mm:ss'}
       ];
    //创建“变更日志”数据集
    var dsAuditLog = new jslet.data.Dataset({name: 'auditLog', fields: fldCfg});
    //设置查找URL
    dsAuditLog.queryUrl("/auditlog/find");
	
	/********************************** 结束定义数据集 ************************************************/
	
	//查询数据
	$('#btnQuery').click(function() {
		dsAuditLog.query();	
	});
	//创建控件
	jslet.ui.install();
});
