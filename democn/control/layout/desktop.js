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
	//菜单项配置
	var menuCfg = [{
			name: '开始',
			iconClass : 'fa fa-flag',
			items: [{
				//设置此页面自动打开
				name: '说明', url: '../../readme.html', autoOpen: true
			}, {
				//设置debounce，打开此页面时，会出现滚动条以及防止页面跳动
				id: 'gettingStarted', name: '惊鸿一瞥', url: '../../glance/glance.html', debounce: true 
			}]
		}, {
			name: 'DB-创建',
			iconClass : 'fa fa-cogs',
			items: [{
				name: '创建数据集', url: '../../dataset/a-creating.html'
			}, {
				name: '基于模型库创建', url: '../../dataset/a-datasetfactory.html'
			}, {
				name: '-'
			}, {
				name: '创建字段', url: '../../dataset/b-fields.html'
			}, {
				name: '公式字段', url: '../../dataset/b-formula.html'
			}, {
				name: '主子表', url: '../../dataset/b-masterdetail.html'
			}, {
				name: '查找字段', url: '../../dataset/b-lookupfield.html'
			}, {
				name: '动作字段', url: '../../dataset/b-action.html'
			}, {
				name: '编辑动作字段', url: '../../dataset/b-editaction.html'
			}]
		}];
	
	function doLoadMenu() {
		return menuCfg;
	}
	//Desktop控件的配置	
	var desktopCfg = {type: 'Desktop', onLoadMenu: doLoadMenu, menuType: 'side', header: 'Jslet演示内容'};
	
	jslet.ui.bindControl($('#desktop')[0], desktopCfg);
	
	//绑定按钮事件
	$('#btnSideMenu').click(function() {
		//菜单改为侧边栏菜单
		jslet('#desktop').menuType('side').renderAll();
	});
	
	$('#btnTopMenu').click(function() {
		//菜单改为顶部菜单条
		jslet('#desktop').menuType('top').renderAll();
	});
	
	$('#btnOpenMenu').click(function() {
		//打开另外的菜单
		jslet.ui.desktopUtil.openMenuById('gettingStarted');
	});	
	
});
