(function(factory) {
	if (typeof define === 'function') {
		if (define.amd) {
			define([ 'jslet' ], factory);
		} else {
			define(function(require, exports, module) {
				module.exports = factory();
			});
		}
	} else {
		factory();
	}
})(function() {
	var barMenuCfg = {
		type : 'MenuBar',
		items: [{
			name: '开始',
			iconClass : 'fa fa-flag',
			items: [{
				name: '说明', url: 'readme.html', autoOpen: true
			}, {
				id: 'glance', name: '惊鸿一瞥', url: 'glance/glance.html', debounce: true
			}, {
				name: '-'
			}, {
				items: [{
					id: 'starting', name: '如何开始', url: 'starting/starting.html'
				}, {
					name: 'RequireJs加载', url: 'starting/requirejs.html'
				}]
			}]
		}, {
			name: 'DB-创建',
			iconClass : 'fa fa-cogs',
			items: [{
				name: '创建数据集', url: 'dataset/a-creating.html'
			}, {
				name: '基于模型库创建', url: 'dataset/a-datasetfactory.html'
			}, {
				name: '-'
			}, {
				name: '创建字段', url: 'dataset/b-fields.html'
			}, {
				name: '公式字段', url: 'dataset/b-formula.html'
			}, {
				name: '主子表', url: 'dataset/b-masterdetail.html'
			}, {
				name: '查找字段', url: 'dataset/b-lookupfield.html'
			}, {
				name: '动作字段', url: 'dataset/b-action.html'
			}, {
				name: '编辑动作字段', url: 'dataset/b-editaction.html'
			//}, {
			//	name: '扩展字段字段', url: 'dataset/b-extendfield.html', visible: false
			}, {
				name: '-'
			}, {
				name: '上下文值规则', url: 'dataset/r-contextrule.html'
			}, {
				name: '上下文状态规则', url: 'dataset/r-contextstate.html'
			}, {
				name: '上下文选择规则', url: 'dataset/r-contextselected.html'
			}, {
				name: '上下文自定义规则', url: 'dataset/r-contextcustom.html'
			}]
		}, {
			name: 'DB-数据操作',
			iconClass : 'fa fa-database',
			items: [{
				name: '基本操作（增删改）', url: 'dataset/c-editdata.html'
			}, {
				name: '查找', url: 'dataset/c-finddata.html'
			}, {
				name: '排序', url: 'dataset/c-sortdata.html'
			}, {
				name: '筛选', url: 'dataset/c-filterdata.html'
			}, {
				name: '字段链', url: 'dataset/c-fieldchain.html'
			}, {
				name: '数据校验', url: 'dataset/c-validation.html'
			}, {
				name: 'Clone数据集（查询条件）', url: 'dataset/c-clonedataset.html'
			}]
		}, {
			name: 'DB-服务器交互',
			iconClass : 'fa fa-server',
			items: [{name: 'Mock', items: [{
				name: '基本操作', url: 'glance/glance.html'
			}, {
				name: '查询（含查询条件）', url: 'dataset/c-clonedataset.html'
			}, {
				name: '分页查询', url: 'dataset/d-paging.html'
			}, {
				name: '多数据集查询', url: 'dataset/d-multidataset.html'
			}, {
				name: '提交所选数据（审核数据）', url: 'dataset/d-submitselected.html'
			}, {
				name: '大数据量查询', url: 'dataset/d-performance.html'
			}]},
			{name: 'Java', items: [
			   {id: 'jv-readme', name: 'Java-与Java对接说明', url: 'java/readme.html'},
			   {id: 'jv-user', name: 'Java-用户管理(服务端有实体)', url: 'java/user.html'},
			   {id: 'jv-employee', name: 'Java-员工管理(服务端无实体)', url: 'java/employee.html'},
			   {id: 'jv-order', name: 'Java-订单管理(主子结构)', url: 'java/order.html'},
			   {id: 'jv-auditlog', name: 'Java-字段变更日志', url: 'java/auditlog.html'}
			   ]}
			]
		}, {
			name: 'UI-表单控件',
			iconClass : 'fa fa-tasks',
			items: [{
				name: '创建控件', url: 'control/uicreating.html'
			}, {
				name: 'DBPlace', url: 'dbcontrol/form/a-dbplace.html'
			}, {
				name: '-'
			}, {
				name: 'DBLabel', url: 'dbcontrol/form/a-genericcontrol.html'
			}, {
				name: 'DBDataLabel', url: 'dbcontrol/form/a-genericcontrol.html'
			}, {
				name: '-'
			}, {
				name: 'DBText', url: 'dbcontrol/form/a-dbtext.html'
			}, {
				name: 'DBSpinEdit', url: 'dbcontrol/form/a-dbspinedit.html'
			}, {
				name: 'DBTextArea', url: 'dbcontrol/form/a-genericcontrol.html'
			}, {
				name: 'DBPassword', url: 'dbcontrol/form/a-genericcontrol.html'
//			}, {
//				name: 'DBCKEditor'
//			}, {
//				name: 'DBUEditor'
			}, {
				name: '-'
			}, {
				name: 'DBSelect', url: 'dbcontrol/form/b-dbselect.html'
			}, {
				name: 'DBComboSelect', url: 'dbcontrol/form/b-dbcomboselect.html'
			}, {
				name: 'DBAutoComplete', url: 'dbcontrol/form/b-dbautocomplete.html'
			}, {
				name: 'DBRangeSelect', url: 'dbcontrol/form/b-dbrangeselect.html'
			}, {
				name: '-'
			}, {
				name: 'DBDatePicker', url: 'dbcontrol/form/c-dbdatepicker.html'
			}, {
				name: 'DBTimePicker', url: 'dbcontrol/form/c-dbtimepicker.html'
			}, {
				name: '-'
			}, {
				name: 'DBCheckBox', url: 'dbcontrol/form/a-genericcontrol.html'
			}, {
				name: 'DBCheckBoxGroup', url: 'dbcontrol/form/d-dbcheckboxgroup.html'
			}, {
				name: 'DBRadioGroup', url: 'dbcontrol/form/d-dbradiogroup.html'
			}, {
				name: '-'
			}, {
				name: 'DBImage', url: 'dbcontrol/form/e-dbimage.html'
			}, {
				name: 'DBRating', url: 'dbcontrol/form/e-dbrating.html'
			}, {
				name: 'DBBetweenEdit', url: 'dbcontrol/form/e-dbbetweenedit.html'
			} ]
		},

		{
			name: 'UI-数据容器控件',
			iconClass : 'fa fa-th-large',
			items: [{
				name: 'UI-表格控件',
				items: [{
					name: '基础功能', url: 'dbcontrol/table/basic.html'
				}, {
					name: '表格编辑', url: 'dbcontrol/table/editable.html'
				}, {
					name: '展示大数据', url: 'dataset/d-performance.html'
				}, {
					name: '单元格合并', url: 'dbcontrol/table/mergecellandtotal.html'
				}, {
					name: '增加合计行', url: 'dbcontrol/table/mergecellandtotal.html'
				}, {
					name: '树形表格', url: 'dbcontrol/table/treegrid.html'
				}, {
					name: '增加动作列', url: 'dataset/b-action.html'
				}, {
					name: '增加编辑动作列', url: 'dataset/b-editaction.html'
				}, {
					name: '设置选择列可选性', url: 'dbcontrol/table/selectable.html'
				}, {
					name: '复制数据到剪贴板', url: 'dbcontrol/table/basic.html'
				}, {
					name: '设置表格样式', url: 'dbcontrol/table/appearance.html'
				}, {
					name: '自定义绘制单元格', url: 'dbcontrol/table/cellrender.html'
				}, {
					name: '表格高度自动伸缩', url: 'dbcontrol/table/autostretch.html'
				}]
			},

			{
				name: 'UI-树型控件',
				items: [{
					name: '基础功能', url: 'dbcontrol/tree/basic.html'
				}, {
					name: '带复选框树', url: 'dbcontrol/tree/checkboxtree.html'
				}, {
					name: '展示大数据', url: 'dbcontrol/tree/performance.html'
				}, {
					name: 'UI样式', url: 'dbcontrol/tree/appearance.html'
				}]
			},

			{
				name: 'UI-图表控件',
				items: [{
					name: '图表控件', url: 'dbcontrol/chart/dbchart.html'
				}]
			},

			{
				name: 'UI-编辑控件',
				items: [{
					name: 'DBEditPanel', url: 'dbcontrol/editor/dbeditpanel.html'
				}, {
					name: 'DBInspector', url: 'dbcontrol/editor/dbinspector.html'
				}]
			}]
		}, {
			name: 'UI-报表打印', iconClass: 'fa fa-diamond',
			items: [{
				id: 'rpt-list', name: '列表打印', url: 'report/report.html'
			}, {
				id: 'rpt-md', name: '主子表打印', url: 'report/reportmd.html'
			}, {
				id: 'rpt-fmt', name: '标签打印（套打）', url: 'report/preformatted.html'
			}]
		}, {
			name: 'UI-对话框控件', iconClass: 'fa fa-diamond',
			items: [{
				name: '导出对话框', url: 'dialog/exportdialog.html'
			}, {
				name: '导入对话框', url: 'dialog/importdialog.html'
			}, {
				name: '批量修改对话框', url: 'dialog/batcheditdialog.html'
			}, {
				name: '录入设置框', url: 'dialog/inputsettingdialog.html'
			}, {
				name: '图表分析框', url: 'dialog/chartdialog.html'
			}]
		}, {
			name: 'UI-基础控件', iconClass : 'fa fa-columns',
			items: [{
				name: 'MessageBox', url: 'control/basic/messagebox.html'
			}, {
				name: 'ProgressBar', url: 'control/basic/progressbar.html'
			}, {
				name: 'ProgressPopup', url: 'control/basic/progresspopup.html'
			}, {
				name: 'WaitingBox', url: 'control/basic/waitingbox.html'
			}]
		}, {
			name: 'UI-布局控件', iconClass : 'fa fa-columns',
			items: [{
				name: 'Desktop', url: 'control/layout/desktop.html'
			}, {
				name: 'Portal', url: 'control/layout/portal.html'
			}, {
				name: 'Window', url: 'control/layout/window.html'
			}, {
				name: 'TabControl', url: 'control/layout/tabcontrol.html'
			}, {
				name: '-'
			}, {
				name: 'Menu', url: 'control/layout/menu.html'
			}, {
				name: 'Context Menu', url: 'control/layout/contextmenu.html'
			}, {
				name: 'SideMenu', url: 'control/layout/sidemenu.html'
			}, {
				name: 'Accordion', url: 'control/layout/accordion.html'
			}, {
				name: 'SplitPanel', url: 'control/layout/splitpanel.html'
			}, {
				name: 'Fieldset', url: 'control/layout/fieldset.html'
			}]
		}, {
			name: '常用业务场景', iconClass : 'fa fa-bell', items: [
				{name: '主子表', url: 'dataset/b-masterdetail.html'},
				{name: '查询条件', url: 'dataset/c-clonedataset.html'},
				{name: '导入', url: 'dialog/importdialog.html'},
				{name: '导出', url: 'dialog/importdialog.html'},
				{name: '复制数据到剪贴板', url: 'dbcontrol/table/basic.html'},
				{name: '-'},
				{name: '查询/提交数据到服务器', url: 'glance/glance.html'},
				{name: '分页查询', url: 'dataset/d-paging.html'},
				{name: '提交审核数据', url: 'dataset/d-submitselected.html'},
				{name: '-'},
				{name: '表格合计行', url: 'dbcontrol/table/mergecellandtotal.html'}
			]
		}]
	};

	function setAutoOpen(menuId, menuCfgs) {
		if(!menuCfgs) {
			return false;
		}
		var menuCfg;
		for(var i = 0, len = menuCfgs.length; i < len; i++) {
			menuCfg = menuCfgs[i];
			if(menuCfg.items) {
				if(setAutoOpen(menuId, menuCfg.items)) {
					return true;
				}
			} else {
				if(menuId == menuCfg.id) {
					menuCfg.autoOpen = true;
					return true;
				}
			}
		}
		return false;
	}
	
	//取URL里的menuid参数
	var menuIds = jslet.urlUtil.getParam(window.location.href, 'menuids');
	if(menuIds) {
		menuIds = menuIds.split(',');
		for(var i = 0, len = menuIds.length; i < len; i++) {
			setAutoOpen(menuIds[i], barMenuCfg.items);
		}
	}
	
	//用于Desktop控件的菜单onLoadMenu事件
	window.doLoadMenu = function() {
		return barMenuCfg.items;
	}

	function calcLayout() {
		var jqDesktop = jQuery('#desktop'),
			jqOffsetP = jQuery(window),
			w = jqOffsetP.width(),
			h = jqOffsetP.height();
		jqDesktop.css('width', w - 30 + 'px').css('height', h - 120 + 'px');
	}
	var calcLayoutDebounce = new jslet.debounce(calcLayout, 80);
	// 创建控件，创建完成后，查询数据
	jslet.ui.install(function() {
		calcLayout();
		
		jQuery(window).on("resize", calcLayoutDebounce);

	});
	
	var theme = window.sessionStorage['jslet-theme'];
	var isInit = true;
	if(theme != 'default') {
		$('#jsletTheme').val(theme);
	}
	isInit = false;
	
	$('#jsletTheme').on('change', function() {
		if(isInit) {
			return;
		}
		var theme = this.value;
		window.sessionStorage['jslet-theme'] = theme;
		window.location.reload();
	});
});
