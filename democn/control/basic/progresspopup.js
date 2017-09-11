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

	//与jslet.StepProcessor配合（可中断）
	$('#btnStart').click(function(){
		var cancelled = false;
		var progressObj = new jslet.ui.ProgressPopup(document.body, '正在保存...', true, function() {
			cancelled = true;
		});
		progressObj.show();
		
		var ProcessFn = function(start, end, percent) {
			for(var i = start; i <= end; i++) {
				//模拟耗时操作
				for(var j = 0; j < 20; j++) {
					console.log(j)
				}
			}
			if(cancelled || percent === 100) {
				progressObj.destroy();
				return false;
			}
			progressObj.value(percent);
		};
		//把5000条数据分为20部分来执行，每执行一部分就更新一次进度条
		new jslet.StepProcessor(5000, ProcessFn, 20).run();
	});

	//与jslet.StepProcessor配合（不可中断）
	$('#btnStartNoCancel').click(function(){
		var progressObj = new jslet.ui.ProgressPopup(document.body, '正在保存...');
		progressObj.show();
		
		var ProcessFn = function(start, end, percent) {
			for(var i = start; i <= end; i++) {
				//模拟耗时操作
				for(var j = 0; j < 20; j++) {
					console.log(j)
				}
			}
			if(percent === 100) {
				progressObj.destroy();
				return false;
			}
			progressObj.value(percent);
		};
		//把5000条数据分为20部分来执行，每执行一部分就更新一次进度条
		new jslet.StepProcessor(5000, ProcessFn, 20).run();
	});

});
