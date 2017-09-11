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
    	initialize();
    });
    
    function initialize() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.query();
	    //“照片”列的自定义绘制   	
	    var photoCellRender = {
	    	//创建单元格时
	        createCell: function (otd, colCfg) {
	            var oimg = document.createElement("img");
	            oimg.style.width = "100%";
	            oimg.style.height = "150px";
	            otd.appendChild(oimg);
	        },
	
	        //刷新单元格时
	        refreshCell: function (otd, colCfg) {
	            otd.firstChild.src = "../../photo/" + this.dataset().getFieldValue(colCfg.field);
	        }
	    };
	    
	    var tblCfg = { type: "DBTable", dataset: "employee", rowHeight: 150, onlySpecifiedCol: true,
	        columns: [{ field: "id" }, { field: "name" }, { field: "age" }, { field: "photo", cellRender: photoCellRender}]
	    };
	    
	    var tblEl = $('#tblEmployee')[0];
	    jslet.ui.bindControl(tblEl, tblCfg);
    }
    
});
