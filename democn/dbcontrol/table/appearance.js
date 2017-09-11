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
		dsEmployee.query();
    	jslet.ui.install();
    });
    
    //相邻行设置不同颜色
    window.doFillRowOdd = function(otr, dataset) {
		var recno = dataset.recno();
		if(recno % 2 == 0)
			$(otr).removeClass("oddRow");
		else
			$(otr).addClass("oddRow");
    }

    //表格行的颜色根据“性别”字段不同而不同
    window.doFillRowGender = function(otr, dataset) {
		var gender = dataset.getFieldValue('gender');
		var jqTr = $(otr);
		if(gender == 'M'){
			jqTr.removeClass("femaleRow");
			jqTr.removeClass("unknownRow");
		}
		else
		if(gender == 'F'){
			jqTr.addClass("femaleRow");
			jqTr.removeClass("unknownRow");
		}else{
			jqTr.removeClass("femaleRow");
			jqTr.addClass("unknownRow");
		}
    }
	
    //设置表格单元格的样式
    window.doFillCell = function(otd, dataset, fieldName) {
		if(fieldName != "name")
			return;
		var posValue = dataset.getFieldValue("position");

		if(posValue > 1)
			$(otd).removeClass("managerCell");
		else
			$(otd).addClass("managerCell");
    }

});
