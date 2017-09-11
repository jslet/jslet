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
	//绑定按钮事件
	$('#btnShowInBody').click(function(){
		//在Body中显示
		var waitingbox = new jslet.ui.WaitingBox(document.body);
		waitingbox.show("Please wait a moment...");

		//延时2秒后关闭
		setTimeout(function(){
			waitingbox.destroy(); 
			waitingbox = null;
		}, 2000);
	});
	
	var waitingbox1 = null;
	
	$('#btnShowInDiv').click(function(){
		//在DIV中显示
		if (!waitingbox1) {
			waitingbox1 = new jslet.ui.WaitingBox(document.getElementById("container"), "Gray", true);
		}
		waitingbox1.show("Please wait a moment...");
	});
	
	$('#btnHideInDiv').click(function(){
		//关闭DIV中的等待框
		if (waitingbox1) {
			waitingbox1.hide();
		}
	});
	
});
