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
       {name: 'action', dataType: 'E'}, 
       {name: 'userId', dataType: 'N', length: 11, label: '用户Id', required: true, tip: 'UserId不得重复!', unique: true}, 
       {name: 'userCode', dataType: 'S', length: 20, label: '用户编码', required: true, unique: true, aggraded: true, tip: '用户编码不得重复!'}, 
       {name: 'userName', dataType: 'S', length: 20, label: '用户姓名', required: true, unique: true}, 
       {name: 'password', dataType: 'S', length: 20, label: '密码', editControl: 'DBPassword',encrypted: {start: 0, end: 100}},
       {name: 'tel', dataType: 'S', length: 20, label: '电话'},
       {name: 'remark', dataType: 'S', length: 20, label: '备注'}
       ];
    //创建“用户”数据集
    var dsUser = new jslet.data.Dataset({name: 'user', fields: fldCfg});
    //设置后端实体类
    dsUser.recordClass('com.jslet.sample.user.User');
    //设置查找URL
	dsUser.queryUrl("/user/find");
	//设置保存URL
	dsUser.submitUrl("/user/save");
	
	/********************************** 结束定义数据集 ************************************************/
	
	//查询数据
	$('#btnQuery').click(function() {
		dsUser.query();	
	});
	//保存数据
	$('#btnSave').click(function() {
		dsUser.submit();	
	});
	//创建控件
	jslet.ui.install();
});
