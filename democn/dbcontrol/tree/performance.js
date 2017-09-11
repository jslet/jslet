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
	var dsPerformance = dsAgency.clone('performance');

	//产生单级多数据
	function generateLargeData(){
		function getRandomChar(){
			return String.fromCharCode(65 + Math.round(Math.random()*25));// + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		}
		
		var data = [], rec, code1, code2, m=1, id1, id2;
		for(var i = 1; i < 3; i++){
			code1 = i;
			if(i < 10)
				code1 ='00' + i;
			else
			if(i < 100)
				code1 = '0' + i;
			else
				code1 = i;
			
			id1 = m++;
			rec = {id: id1, code: code1, name: getRandomChar() + code1, iconcls: 'folderIcon'};
			data.push(rec);
			for(var j = 1; j <= 5000; j++){
				code2 = code1+ (j < 10 ? '0': '')+j;
				id2 = m++;
				rec = {id: id2, code: code2, name: getRandomChar() + code2, parentid: id1, iconcls: 'folderIcon'};
				data.push(rec);
			}
		}
		return data;
	}
	
	dsPerformance.records(generateLargeData());
	jslet.ui.install();
	
});
