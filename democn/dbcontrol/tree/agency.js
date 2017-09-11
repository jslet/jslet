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
	//创建机构数据集用于显示树控件
	var dsAgency = new jslet.data.Dataset({name: "agency", fields: [
	   {name: 'id', label: 'ID', dataType: 'N', required: true},
	   {name: 'parentid', label: 'ParentID', dataType: 'N', readOnly: true},
	   {name: 'code', label: 'Code', dataType: 'S', required: true},
	   {name: 'name', label: 'Name', dataType: 'S', required: true},
	   {name: 'iconcls', label: 'Icon Class', dataType: 'S', length: 30, displayWidth: 10, required: true}
	   ],
	   //所有的树控件必须配置以下属性
	   keyField: 'id', codeField: 'code', nameField: 'name', parentField: 'parentid'
	});
	
	//创建5000条随机数据
	function getRandomChar(){
		return String.fromCharCode(65 + Math.round(Math.random()*25));// + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	
	function generateLargeData(){
		var data = [], rec, code1, code2, m=1, id1, id2;
		for(var i = 1; i < 11; i++){
			code1 = i;
			if(i < 10)
				code1 ='00' + i;
			else
			if(i < 100)
				code1 = '0' + i;
			else
				code1 = i;
			
			id1 = m++;
			rec = {id: id1, code: code1, name: getRandomChar() + code1, iconcls: 'fa fa-folder jl-folder'};
			data.push(rec);
			for(var j = 1; j < 6; j++){
				code2 = code1+ (j < 10 ? '0': '')+j;
				id2 = m++;
				rec = {id: id2, code: code2, name: getRandomChar() + code2, parentid: id1, iconcls: 'fa fa-folder jl-folder'};
				data.push(rec);
				for(var k = 1; k < 11; k++){
					code3 = code2+(k < 10 ? '0': '') + k;
					rec = {id: m++, code: code3, name: getRandomChar() + code3, parentid: id2, iconcls: 'fa fa-file jl-file'};
					data.push(rec);
				}
			}
		}
		return data;
	}
	
	dsAgency.records(generateLargeData());
	
	var cloneDs = dsAgency.clone('selectableAgency');
	cloneDs.records(dsAgency.records());
});
