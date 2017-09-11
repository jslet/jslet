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
	var dsAgency = jslet.data.getDataset('agency');
	
	//创建第二个数据集
	var dsAgency1 = dsAgency.clone('agency1');
	dsAgency1.records(dsAgency.records());
	
	//创建第三个数据集
	var dsAgency2 = dsAgency.clone('agency2');
	dsAgency2.records(dsAgency.records());
	
	//在此设置哪些记录能够被选择
	dsAgency2.onCheckSelectable(function(){
		return !this.hasChildren(); 
	});

	jslet.ui.install();
	
});
