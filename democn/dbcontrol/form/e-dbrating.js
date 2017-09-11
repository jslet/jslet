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
	//创建测试数据集
	var dsCfg = {name: "analyst", fields: [
   	    {name: "name", dataType: 'S', length: 10, label: 'Name', required: true},
   	    {name: "rating1", dataType: 'N', length: 8, scale: 2, label: 'Rating1', readOnly: true},
   	    {name: "rating2", dataType: 'N', length: 8, scale: 2, label: 'Rating2'},
   	    {name: "rating3", dataType: 'N', length: 8, scale: 2, label: 'Rating3'}
        ]};
	dsAnalyst = new jslet.data.Dataset(dsCfg);
	//初始数据
	var records = [{ name: "Tom", rating1: 3, rating2: 3.25, rating3: 6 }, 
	                { name: "Jerry", rating1: 1.5, rating2: 2.5, rating3: 4 }, 
	                { name: "Mark", rating1: 0, rating2: 1.75, rating3: 9 }, 
	                { name: "Join", rating1: 5, rating2: 4.5, rating3: 2}];
	dsAnalyst.records(records);
	
	jslet.ui.install();
});
