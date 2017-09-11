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
	$('#btnInfo1').click(function(){
		//单行消息（提示）
		jslet.ui.info("Hello world!");
	});
	
	$('#btnInfo2').click(function(){
		//多行消息（提示）
		jslet.ui.info("First line message<br />Second line message");
	});
	
	$('#btnInfo3').click(function(){
		//1s后关闭（提示）
		jslet.ui.info("You has to fill that blank!", "Tips", null, 1000);
	});
	
	$('#btnInfo4').click(function(){
		//关闭后回调（提示） 
		jslet.ui.info("Hello world!", null, function() {
			alert('Callback Run!');
		});
	});

	$('#btnError').click(function(){
		//1s后关闭（错误）
		jslet.ui.error("You made a mistake!", null, null, 1000);
	});
	
	$('#btnWarn').click(function(){
		//1s后关闭（警告）
		jslet.ui.warn("You has to fill that blank!", null, null, 1000);
	});
	
	$('#btnConfirmCancel').click(function(){
		//确认/取消
		function callBack(button){
			$("#result2").html("You click button:" + button);
		}
		
		jslet.ui.confirm("Are you sure to save this?", "Confirm", callBack);
	});
	
	$('#btnYesNoCancel').click(function(){
		//是/否/取消
		function callBack(button){
			$("#result3").html("你点击的按钮为: " + button);
		}
		
		jslet.ui.confirm("Are you sure to save this?", null, callBack, true);
	});
	
	$('#btnInput').click(function(){
		//单行输入框）
		//回调函数
		function callBack(button, inputValue) {
			if (button == "ok")
            	$("#result4").html("你输入的文件名为:" + inputValue);
            else
            	$("#result4").html("你点击了取消按钮！");
		}
		
		//输入值校验函数
		function validate(inputValue) {
			if (!inputValue) {
				jslet.ui.info("必须录入文件名!");
				return false;
			}
			return true;
        }
		
        jslet.ui.prompt("请输入文件名：", "输入文件名", callBack, "test.txt", validate);
	});
	
	$('#btnMultInput').click(function(){
		//多行输入框
		function callBack(button, inputValue) {
			if (button == "ok")
				$("#result5").html("你的输入值为:" + inputValue);
			else
				$("#result5").html("你点击了取消按钮！");
		}
		
        jslet.ui.prompt("请输入说明：", "输入说明", callBack, "", null, true);
	});	
});
