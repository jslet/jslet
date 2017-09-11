(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['common/metastore', 'jslet', 'mock/employee-mock'], factory);
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
	//datasetMetaStore定义在公共js:common/datasetmetastore.js中
	//将数据集定义信息仓库加到datasetFactory中，创建Dataset时会仓库里去定义信息
	jslet.data.datasetFactory.addMetaStore(window.datasetMetaStore);
	//通过工厂方法，可以自动创建主数据集及相关的数据集
    jslet.data.datasetFactory.createDataset('employee').done(function() {
    	jslet.ui.install(function() {
    		var dsEmployee = jslet.data.getDataset('employee');
    		dsEmployee.query();
    	});
    });
    
    //绑定按钮事件
	$('#chkShowSeqenceCol').click(function() {
		var checked = $('#chkShowSeqenceCol')[0].checked;
		//设置表格是否有序号列
		jslet('#tblEmployee').hasSeqCol(checked).renderAll();
	});
	
	$('#chkShowSelectCol').click(function() {
		var checked = $('#chkShowSelectCol')[0].checked;
		//设置表格是否有选择列
		jslet('#tblEmployee').hasSelectCol(checked).renderAll();
	});
	
	$('#btnFixedRows').click(function() {
		var count = parseInt($('#txtFixedRows').val());
		//设置表格固定行数
		jslet('#tblEmployee').fixedRows(count).renderAll();
	});

	$('#btnFixedCols').click(function() {
		var count = parseInt($('#txtFixedCols').val());
		//设置表格固定列数
		jslet('#tblEmployee').fixedCols(count).renderAll();
	});
	
	$('#btnSetRowClick').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//设置表格单击事件
		jslet('#tblEmployee').onRowClick(function() {
			jslet.ui.info('你点击了第：' + (dsEmployee.recno() + 1) + ' 行!', null, null, 1000); 
		});
	});
	
	$('#btnClearRowClick').click(function() {
		//清除表格单击事件
		jslet('#tblEmployee').onRowClick(null);
	});
	
	$('#btnSetRowDblClick').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//设置表格双击事件
		jslet('#tblEmployee').onRowClick(null); //先清除单击事件
		jslet('#tblEmployee').onRowDblClick(function() {
			jslet.ui.info('你双击了第：' + (dsEmployee.recno() + 1) + ' 行!', null, null, 1000); 
		});
	});
	
	$('#btnClearRowDblClick').click(function() {
		//清除表格双击事件
		jslet('#tblEmployee').onRowDblClick(null);
	});
	
	$('#btnSetSelect').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		//设置表格选择事件，
		jslet('#tblEmployee').onSelect(function() {
			jslet.ui.info('你选择了第：' + (dsEmployee.recno() + 1) + ' 行!', null, null, 1000); 
		});
	});
	
	$('#btnClearSelect').click(function() {
		//清除表格选择
		jslet('#tblEmployee').onSelect(null);
	});
	
	$('#btnSelectBy').click(function() {
		var dsEmployee = jslet.data.getDataset('employee');
		var selectBy = $('#txtSelectBy').val();
		//设置表格分组选择（相同值一起选择）
		jslet('#tblEmployee').selectBy(selectBy);
	});
	
});
