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
    //"员工信息"
    var fldCfg = [
       {name: 'action', dataType: 'E'}, 
       {name: 'id', dataType: 'S', length: 11, label: '编码', required: true, tip: '编码不得重复!', unique: true}, 
       {name: 'name', dataType: 'S', length: 20, label: '姓名', required: true, unique: true, aggraded: true, tip: '名称不得重复!'}, 
       {name: 'gender', dataType: 'S', length: 6, label: '性别'},
       {name: 'age', dataType: 'N', length: 6, label: '年龄', displayWidth: 6, dataRange: {min: 18, max: 60 }, formula: '[birthday]?((new Date()).getFullYear() - [birthday].getFullYear()): 0'},
       {name: 'birthday', dataType: 'D', label: '生日', displayFormat: 'yyyy-MM-dd', dataRange: {min: new Date(1960, 1, 1), max: new Date()}},
       {name: 'salary', dataType: 'N', length: 16, scale: 2, label: '薪水', displayFormat: '￥#,##0.##', aggraded: true}
       ];
    //创建“员工信息”数据集
    var dsEmployee = new jslet.data.Dataset({name: 'employee', fields: fldCfg});
    //设置查找URL
	dsEmployee.queryUrl("/employee/find");
	//设置保存URL
	dsEmployee.submitUrl("/employee/save");
	
	/********************************** 结束定义数据集 ************************************************/
	
	//查询数据
	$('#btnQuery').click(function() {
		dsEmployee.query();	
	});
	//保存数据
	$('#btnSave').click(function() {
		dsEmployee.submit();	
	});
	//创建控件
	jslet.ui.install();
});
