(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['dbcontrol/tree/agency'], factory);
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
    
	jslet.ui.install();
    //绑定按钮事件
	$('#chkShowSeqenceCol').click(function() {
		var checked = $('#chkShowSeqenceCol')[0].checked;
		//设置表格是否有序号列
		jslet('#tblEmployee').hasSeqCol(checked).renderAll();
	});
	
    //绑定按钮事件
	$('#btnInsertChild').click(function() {
		var dsAgency = jslet.data.getDataset('agency');
		//为当前记录插入一条子节点
		dsAgency.insertChild();
		dsAgency.focusEditControl('id');
	});
	
	$('#btnInsertSibling').click(function() {
		var dsAgency = jslet.data.getDataset('agency');
		//为当前记录插入一条同级节点
		dsAgency.insertSibling();
		dsAgency.focusEditControl('id');
	});
	
	$('#btnDeleteRecord').click(function() {
		var dsAgency = jslet.data.getDataset('agency');
		//删除当前记录
		dsAgency.deleteRecord();
	});
	
	$('#btnDisplayFields').click(function() {
		//显示：名称（编码）
		jslet('#trAgency').displayFields('[name]+" ("+[code]+")"').renderAll();
	});
	
	$('#btnRestore').click(function() {
		//显示：名称
		jslet('#trAgency').displayFields('name').renderAll();
	});
	
	$('#btnRowClick').click(function() {
		var dsAgency = jslet.data.getDataset('agency');
		//设置树节点的点击事件
		jslet('#trAgency').onItemClick(function() {
			jslet.ui.info('点击了第：' + dsAgency.recno() + ' 行！');
		});
	});
	
	$('#btnClearRowClick').click(function() {
		//清除树节点的点击事件
		jslet('#trAgency').onItemClick(null);
	});
	
	
});
