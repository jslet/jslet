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
	var tabPanelCfg = [
			{header: "User IFrame", useIFrame: true, closable: true, url: "../../glance/glance.html", iconClass: "fa fa-flag"},
			{header: "User Panel Id1", closable: true, content: "p2"},
			{header: "Page Five",closable:true, content: "p5"}
		];

    //onAddTabItem 新增页签事件
    function doAddTabItem() {
		var defer = jQuery.Deferred();

        var cfg = null;
        var header = jslet.ui.prompt("请输入页签头：", "新增页签", function(button, value) {
        	if (button == "ok") {
        		cfg = {header: '', iconClass: 'fa fa-database', closable: true, useIFrame: false};
        		cfg.header = value;
                cfg.content = document.createElement("div");
                cfg.content.innerHTML = "Demo Panel";
        	} else {
        		cfg = null;
        	}
    		defer.resolve(cfg);
        });
        
        return defer.promise();
    }

    //onRemoveTabItem 删除页签事件
    function doRemoveTabItem(tabIndex, selected) {
		var defer = jQuery.Deferred();
        jslet.ui.confirm("确定要删除当前页签么?", null, function(button) {
        	defer.resolve(button == "ok");
        });
        return defer.promise();
    }

    //onActiveIndexChanged 跳转页签事件
    function doActiveIndexChanged(oldIndex, newIndex) {
		var defer = jQuery.Deferred();
        jslet.ui.confirm("确定要离开此页签么?", null, function(button) {
        	defer.resolve(button == "ok");
        });
        return defer.promise();
    }

    //固定Tab项，Tab项高度不一致
	var tabFixedCfg = {type: "TabControl", items: jslet.deepClone(tabPanelCfg), newable: false, closable: false};
	jslet.ui.bindControl($('#tabFixed')[0], tabFixedCfg);
	
	//可增可删Tab项
	var tabFlexiableCfg = {type: "TabControl", items: jslet.deepClone(tabPanelCfg), newable: true, closable: true, 
			onAddTabItem: doAddTabItem, onRemoveTabItem: doRemoveTabItem, onActiveIndexChanged: doActiveIndexChanged};
	jslet.ui.bindControl($('#tabFlexiable')[0], tabFlexiableCfg);
	
	//Tab项高度一致
	var tabSameHeightCfg = {type: "TabControl", items: jslet.deepClone(tabPanelCfg), newable: false, closable: false, isFixedHeight: true};
	jslet.ui.bindControl($('#tabSameHeight')[0], tabSameHeightCfg);

	//仅Tab头，无Tab Panel
	var tabOnlyHeaderCfg = {type: "TabControl", items: jslet.deepClone(tabPanelCfg), newable: false, closable: false, hasContent: false};
	jslet.ui.bindControl($('#tabOnlyHeader')[0], tabOnlyHeaderCfg);
	
});
