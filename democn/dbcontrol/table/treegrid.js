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
	
    var dsCfg = {name: 'agency',
    		//树形表格的数据集必须要设置这4个属性
    		keyField: 'itemid', codeField: 'code', nameField: 'name', parentField: 'parentid',
    		fields: [
	    		 {name: 'name', dataType: 'S', length: 20, label: 'Name', required: true},
	    		 {name: 'code', dataType: 'S', length: 10, label: 'Code', required: true},
	    		 {name: 'itemid', dataType: 'N', length: 10, label: 'ID'},
	    		 {name: 'parentid', dataType: 'N', length: 10, label: 'Parent ID', readOnly: true}
    		]};
    var dsAgency = new jslet.data.Dataset(dsCfg);
    
    //创建演示数据
    var records = [{ itemid: 'cn', parentid: '0', code: '00', name: 'China' },
		{ itemid: '1', parentid: 'cn', code: '01', name: 'Guangdong' },
		{ itemid: '2', parentid: '1', code: '0101', name: 'Guangzhou' },
		{ itemid: '3', parentid: '1', code: '0102', name: 'Shenzhen' },
		{ itemid: '4', parentid: '3', code: '010201', name: 'Nanshan' },
		{ itemid: '5', parentid: '3', code: '010202', name: 'Futian' },
		{ itemid: '6', parentid: '1', code: '0103', name: 'Dongguang' },
		{ itemid: '7', parentid: 'cn', code: '02', name: 'Hunan' },
		{ itemid: '8', parentid: '7', code: '0201', name: 'Changsha' },
		{ itemid: '9', parentid: '7', code: '0202', name: 'Zhuzhou' },
		{ itemid: '10', parentid: '7', code: '0203', name: 'YueYang' },
		{ itemid: '11', parentid: '7', code: '0204', name: 'Hengyang' },
		{ itemid: '12', parentid: '7', code: '0205', name: 'Shaoyang' }
	];

    dsAgency.records(records);
	
    var tblAgency;
    
    jslet.ui.install(function() {
    	tblAgency = jslet('#tblAgency');
    	//界面创建成功后，调用DBTable的方法
    	tblAgency.expandAll();
    });
    
    //绑定按钮事件
    $('#btnExpand').click(function() {
    	tblAgency.expand();
    });
    
    $('#btnExpandAll').click(function() {
    	tblAgency.expandAll();
    });
    
    $('#btnCollapse').click(function() {
    	tblAgency.collapse();
    });
    
    $('#btnCollapseAll').click(function() {
    	tblAgency.collapseAll();
    });
    
});
