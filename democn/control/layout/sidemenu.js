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
        jslet.ui.info(msg);
    }

    var menuItems = [
         { name: 'File', items: [
             { id: 'new', name: 'New Tab' },
             { id: 'open', name: 'Open File...' },
             //分隔线
             { name: '-' },
             { id: 'saveAs', name: 'Save As...' },
             { id: 'send', name: 'Send Page...', iconClass: 'fa fa-floppy-o' },
             { name: '-' },
             { id: 'set', name: 'Page Setup...' },
             { id: 'preview', name: 'Preview' },
             { id: 'print', name: 'Print...' },
             { name: '-' },
             { id: 'exit', name: 'Exit' }
             ]
         },
         { name: 'Edit', items: [
             //设置菜单不可点击
             { id: 'undo', name: 'Undo', disabled: true },
             { id: 'redo', name: 'Redo', disabled: true },
             { name: '-' },
             { id: 'cut', name: 'Cut', disabled: true, iconClass: 'fa fa-scissors' },
             { id: 'copy', name: 'Copy', disabled: true, iconClass: 'fa fa-files-o' },
             { id: 'paste', name: 'Paste', disabled: true, iconClass: 'fa fa-clipboard' },
             { id: 'del', name: 'Delete', disabled: true },
             { name: '-' },
             { id: 'selectAll', name: 'Select All' },
             { name: '-' },
             { id: 'find', name: 'Find' }
             ]
         },
         { name: 'View', items: [
             { id: 'toolbar', name: 'Tool Bar' },
             { id: 'sidePanel', name: 'Side Bar' },
             { name: '-' },
             { id: 'scale', name: 'Scale' },
             { id: 'uiStyle', name: 'UI Style' },
             { id: 'encode', name: 'Encode', items: [
                 //设置菜单项为：Radio类型, Radio类型的菜单项需设置group属性，group相同的为一组
                 { id: 'gb2312', name: 'Simplied Chinese(GB2312)', itemType: 'radio', group: 'encode' },
                 { id: 'utf8', name: 'Unicode(UTF-8)', itemType: 'radio', group: 'encode', checked: true},
                 { id: 'english', name: 'English', itemType: 'radio', group: 'encode'},
             ] },
             { name: '-' },
             //设置菜单项为：Check类型
             { id: 'fullScreen', name: 'Full Screen', itemType: 'check', checked: true }
             ]
         }
         ];

    var menuCfg = {type: 'SideMenuBar', popupWidth: 300, onItemClick: globalMenuItemClick, items: menuItems};

	jslet.ui.bindControl($('#sideMenu')[0], menuCfg);
});
