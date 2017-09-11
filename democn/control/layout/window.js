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
    $('#btnOpenModelessInBody').click(function() {
    	//在Body中打开非模态窗口
    	var winCfg = {type: "Window", animation: 'slide', iconClass:"fa fa-diamond", 
    			caption: "非模态窗口", width: 500, height: 500};
        var owin = jslet.ui.createControl(winCfg);
        owin.setContent("Body中打开非模态窗口!");
        owin.show(350,250);
    });
    
    
    $('#btnOpenModelInBody').click(function() {
    	//在Body中打开模态窗口
    	var winCfg = {type: "Window", caption: "模态窗口", minimizable: false, maximizable:false, width: 500, height: 500};
        var owin = jslet.ui.createControl(winCfg);
        owin.setContent("Body中打开模态窗口!");
        owin.showModal(150, 50);
    });

    $('#btnOpenModelInBodyCenter').click(function() {
    	//在Body中打开模态窗口
    	var winCfg = {type: "Window", caption: "模态窗口", animation: 'fade', minimizable: false, maximizable:false, isCenter: true};
        var owin = jslet.ui.createControl(winCfg);
        owin.setContent("Body中打开模态窗口!");
        owin.showModal(150, 50);
    });
    
    var left = 10;
    var top = 10;
    
    $('#btnOpenModelessInDiv').click(function() {
    	//在DIV中打开非模态窗口
    	var winCfg = {type: "Window", animation: 'slide', iconClass:"fa fa-diamond", 
    			caption: "非模态窗口"};
    	var container = $('#container')[0];
        var owin = jslet.ui.createControl(winCfg, container);
        owin.setContent("Body中打开非模态窗口!");
        left += 20;
        top += 20;
        
        owin.show(left, top);
    });
        
    $('#btnOpenModelInDiv').click(function() {
    	//在DIV中打开模态窗口
    	var winCfg = {type: "Window", caption: "模态窗口", minimizable: false, maximizable:false};
    	var container = $('#container')[0];
        var owin = jslet.ui.createControl(winCfg, container);
        owin.setContent("Body中打开模态窗口!");
        owin.showModal(50, 50);
    });
    
    $('#btnOpenGitHub').click(function() {
    	//在窗口中打开网址
        owin = jslet.ui.createControl({ type: "Window", caption: "<i>child window</i>", width: 800, height: 600 });
        owin.setContent("<iframe src='http://jslet.github.com/jslet' style='width: 100%;height: 98%; border:none' />");
        owin.show(150, 50);
    });
    
   jslet.ui.install();
});
