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
    	jslet.ui.install();
    });
    
    function initialize() {
		var dsEmployee = jslet.data.getDataset('employee');
		dsEmployee.query();
		
		//设置“ID”的自定义校验规则
		dsEmployee.getField('id').customValidator(function(fldName, fldValue) {
			if(fldValue && fldValue.length < 4) {
				return '员工编码的长度不能小于4位！'
			}
			return null;
		});

		//设置“Name”的自定义校验规则
		dsEmployee.getField('name').customValidator(function(fldName, fldValue, serverValidateFn) {
			//黑名单为：['a', 'b', 'c']，返回的信息为：“不允许的名称！”
			return serverValidateFn("/demo/employee/checkblacklist", {"name": fldValue});
		});
		
		//设置录入结束时的事件，在光标移动到另外一行时对数据进行校验
		dsEmployee.on(jslet.data.DatasetEvent.BEFORECONFIRM, function() {
			var gender = dsEmployee.getFieldValue('gender');
			var age = dsEmployee.getFieldValue('age');
			if(gender === 'F' && age > 55) {
				//设置错误信息到年龄字段上
				dsEmployee.setFieldError('age', '女性年龄不能大于55！');
			}
		});
    }
    
});
