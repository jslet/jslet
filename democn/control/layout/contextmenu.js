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
	//菜单的全局处理函数
    function globalMenuItemClick(menuObj) {
    	var msg = '你点击了菜单：' + menuObj.name;
    	if(menuObj.itemType == 'check' || menuObj.itemType == 'radio') {
    		msg += menuObj.checked? '，菜单项已勾选': '，菜单项已取消勾选';
    	}
        jslet.ui.info(msg);
    }

    var menuItems = [
		{id: 'back', name: 'Backward', iconClass: 'icon1'},
		{id: 'go', name: 'Forward', disabled: true},
		{name: '-'},
		{id: 'saveAs', name: 'Save Background As', disabled: true},
		{id: 'setBackground', name: 'Set Background', disabled: true},
		{id: 'copyBackground', name: 'Copy Backgound', disabled: true},
		{name: '-'},
		{id: 'selectAll', name: 'Select All'},
		{id: 'paste', name: 'Paste', disabled: true},
		{name: '-'},
		{id: 'encode', name: 'Encode', items: [
			{id: 'autoSelect', name: 'Auto Select', itemType: 'radio', checked: true},
			{name: '-'},
			{id: 'gb2312', name: 'Simplied Chinese(GB2312)', itemType: 'radio'},
			{id: 'utf8', name: 'Unicode(UTF-8)', itemType: 'radio'},
		    {id: 'English', name: "English"}
			]
		},
		{name: '-'},
        {id: 'fullScreen', name: 'Full Screen', itemType: 'check'}
    ];

    var popupMenuCfg = { type: 'Menu', onItemClick: globalMenuItemClick, items: menuItems};

	jslet.ui.bindControl($('#popMenu')[0], popupMenuCfg);
	
	//绑定按钮事件
	$('#popContainer').on('contextmenu', function(event){
		//显示右键菜单
		jslet('#popMenu').showContextMenu(event);
	});
	
	$('#btnDropdown').click(function(event){
		//点击按钮下拉菜单
		jslet('#popMenu').showAt(event.currentTarget);
	});
	
});
