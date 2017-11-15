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
	
	var parts = [
	        {id: 'p1', caption: 'Part1', url: 'sidemenu.html', left: 0, top: 0, width: 350, height: 200,closable: false},
	        {id: 'p2', caption: 'Part2', url: 'tabcontrol.html', left: 351, top: 0, width: 350, height: 200},
	        {id: 'p3', caption: 'Part3', url: '../../glance/glance.html', left: 0, top: 201, width: 350, height: 200},
	        {id: 'p4', caption: 'Part4', url: '../../dataset/b-action.html', left: 351, top: 201, width: 350, height: 200},
	];
	
   jslet.ui.install(function() {
		jslet('#portal').parts(parts);
   });
   
   var partNo = 10;
   //增加部件
   $('#btnAdd').on('click', function() {
	   var newId = 'new' + partNo++;
	   var partCfg = {id: newId, caption: 'New Part' + partNo, width: 200, height: 200, content: '<p3>New Part ' + partNo + '</p3>'};
	   jslet('#portal').addPart(partCfg);
   });
   
   //删除部件
   $('#btnRemove').on('click', function() {
	   var newId = 'new' + --partNo;
	   jslet('#portal').removePart(newId);
   });
   
   //设置部件标题
   $('#btnSetCaption').on('click', function() {
	   jslet('#portal').setPartCaption('p1', '新标题');
   });
   
   //设置部件内容
   $('#btnSetContent').on('click', function() {
	   jslet('#portal').setPartContent('p1', '<p2>新的内容</p2>');
   });
   
});
