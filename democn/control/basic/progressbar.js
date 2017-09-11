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

	jslet.ui.install();
	
	//绑定按钮事件
	$('#btnSetValue').click(function(){
		//设置值
		var progressObj = jslet('#progressBar');
		var value = progressObj.value() + 10;
		if(value > 100) {
			value = 0;
		}
		progressObj.value(value);
    });
	
	$('#btnStart').click(function(){
		//与jslet.StepProcessor配合
		var progressObj = jslet('#progressBar');
		
		var ProcessFn = function(start, end, percent) {
			for(var i = start; i <= end; i++) {
				//模拟耗时操作
				for(var j = 0; j < 20; j++) {
					console.log(j)
				}
			}
			progressObj.value(percent);
		};
		//把5000条数据分为20部分来执行，每执行一部分就更新一次进度条
		new jslet.StepProcessor(5000, ProcessFn, 20).run();
	});

});
