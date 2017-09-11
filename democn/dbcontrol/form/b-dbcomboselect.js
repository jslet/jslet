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
    	var dsEmployee = jslet.data.getDataset('employee');
    	
        dsEmployee.createField({name: "deptName", dataType: 'S', length: 10, label: "部门名称", displayOrder: 3});
        //设置当“department”字段改变时，同时取“部门表”的“name"的值赋给“deptName”字段
        dsEmployee.getField('department').lookup().returnFieldMap({deptName: 'name'});
    	dsEmployee.query();
    	jslet.ui.install();
    });
    
    //设置“部门”多选或者单选
    $('#btnSetMultiDept').click(function() {
    	var dsEmployee = jslet.data.getDataset('employee');
    	var fldObj = dsEmployee.getField('department');
    	var oldValue = fldObj.valueStyle();
    	var msg = '';
    	if(oldValue === jslet.data.FieldValueStyle.NORMAL) {
    		fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
    		msg = '已设为多选！';
    	} else {
    		fldObj.valueStyle(jslet.data.FieldValueStyle.NORMAL);
    		msg = '已设为单选！';
    	}
    	jslet('#selDept').closePopup().renderAll();
    	jslet.ui.info(msg);
    });
    
    //设置“部门”只能选择末级或者反之
    $('#btnOnlyLeaf').click(function() {
    	var dsEmployee = jslet.data.getDataset('employee');
    	var fldObj = dsEmployee.getField('department');
    	var flag = fldObj.lookup().onlyLeafLevel();
    	fldObj.lookup().onlyLeafLevel(!flag);
    	jslet('#selDept').closePopup();
    	jslet.ui.info(!flag? '已设置仅仅末级可选！': '已设置所有可选')
    });
    
    //设置“职位”多选或者单选
    $('#btnSetMultiPos').click(function() {
    	var dsEmployee = jslet.data.getDataset('employee');
    	var fldObj = dsEmployee.getField('position');
    	var oldValue = fldObj.valueStyle();
    	if(oldValue === jslet.data.FieldValueStyle.NORMAL) {
    		fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
    	} else {
    		fldObj.valueStyle(jslet.data.FieldValueStyle.NORMAL);
    	}
    	jslet('#selPosition').closePopup();
    });
    
});
