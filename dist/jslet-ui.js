/*!
 * Jslet JavaScript Framework v4.0.0
 * http://www.jslet.com
 *
 * Copyright 2016 Jslet Team
 * Released under GNU AGPL v3.0 license and commercial license
 */

/* jshint ignore:start */
"use strict";
(function (root, factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define('jslet-ui', ['jslet-data', 'jslet-locale'], factory);
	    } else {
	    	define(function(require, exports, module) {
	    		require('jslet-css');
	    		var jslet = require('jslet-data');
	    		var jsletlocale = require('jslet-locale');
	    		module.exports = factory(jslet, jsletlocale);
	    	});
	    }
    } else {
    	factory(window.jslet, window.jsletlocale);
    }
})(this, function (jslet, jsletlocale) {
	if(!jslet.ui) {
		/**
		 * @class
		 * @static
		 */
		jslet.ui = {};
	}

/* jshint ignore:end */

/**
* @class
* 
* Control Class, base class for all control.
*/
jslet.ui.Control = jslet.Class.create({
	/**
	 * @protected
	 * 
	 * Constructor method.
	 * 
	 * @param {HtmlElement} el HTML element.
	 * @param {String | Object} ctrlParams Parameters of this control, it would be a JSON string or plan object, like: '{prop1: value1, prop2: value2}'.
	 */
	initialize: function (el, ctrlParams) {
		var Z = this;
		Z.el = el;

		Z.allProperties = null;
		ctrlParams = jslet.ui._evalParams(ctrlParams);
		if (Z.isValidTemplateTag	&& !Z.isValidTemplateTag(Z.el)) {
			var ctrlClass = jslet.ui.getControlClass(ctrlParams.type), template;
			if (ctrlClass) {
				template = ctrlClass.htmlTemplate;
			} else {
				template = '';
			}
			throw new Error(jslet.formatMessage(jsletlocale.DBControl.invalidHtmlTag, template));
		}
		Z._styleClass = null;
		
		Z.styleClass = function(styleClass) {
			if(styleClass === undefined) {
				return Z._styleClass;
			}
			Z._styleClass = styleClass;
		};
		
		Z._childControls = null;
		Z.setParams(ctrlParams);
		Z.checkRequiredProperty();
		Z.el.jslet = this;
		Z.beforeBind();
		if(!Z.el.id) {
			Z.el.id = jslet.nextId();
		}
		Z.bind();
		var jqEl = jQuery(Z.el);
		if(Z._styleClass) {
			jqEl.addClass(Z._styleClass);
		}
		Z.afterBind();
	},

	/**
	 * @protected
	 * 
	 * Before bind.
	 * Child control can extend this method.
	 */
	beforeBind: function() {
		
	},
	
	/**
	 * @protected
	 * 
	 * Bind this control to a HTML element.
	 */
	bind: function() {
		
	},
	
	/**
	 * @protected
	 * 
	 * After bind.
	 */
	afterBind: function() {
		
	},
	
	/**
	 * @protected
	 * 
	 * Render this control, if control configuration is changed, call this method to refresh control.
	 * 
	 * @return {this}
	 */
	renderAll: function() {
		return this;
	},
	
	/**
	 * @protected
	 */
	setParams: function (ctrlParams) {
		if (!ctrlParams) {
			return;
		}
		var ctrlType = ctrlParams.type;
		this.styleClass(ctrlParams.styleClass);
		
		for(var name in ctrlParams) {
			var prop = this[name];
			if(name == 'type' || name == 'styleClass') {
				continue;
			}
			if(prop && prop.call) {
				prop.call(this, ctrlParams[name]);
			} else {
				throw new Error(ctrlType +  " NOT support control property: " + name);
			}
		}
	},

	/**
	 * @protected
	 */
	checkRequiredProperty: function () {
		if (!this.requiredProperties) {
			return;
		}
		var arrProps = this.requiredProperties.split(','),
			cnt = arrProps.length, name;
		for (var i = 0; i < cnt; i++) {
			name = arrProps[i].trim();
			if (!this[name]) {
				throw new Error(jslet.formatMessage(jsletlocale.DBControl.expectedProperty, [name]));
			}
		}
	},
	
	/**
	 * @protected
	 * 
	 * Add child control into this control.
	 */
	addChildControl: function(childCtrl) {
		var Z = this;
		if(!Z._childControls) {
			Z._childControls = [];
		}
		if(childCtrl) {
			Z._childControls.push(childCtrl);
		}
	},
	
	/**
	 * @protected
	 * 
	 * Refresh dataset when user changed the value.
	 */
	doUIChanged: function () {},
	
	/**
	 * @protected
	 * 
	 * Remove all child controls from this control.
	 */
	removeAllChildControls: function() {
		var Z = this, childCtrl;
		if(Z._childControls) {
			for(var i = 0, len = Z._childControls.length; i < len; i++) {
				childCtrl = Z._childControls[i];
				childCtrl.destroy();
			}
			Z._childControls = null;
		}
        if(Z.el) {
            Z.el.innerHTML = '';
        }
	},
	
	/**
	 * Destroy method
	 */
	destroy: function(){
		if(this.el) {
			this.el.jslet = null;
			this.el = null;
		}
	}
});

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * Base data sensitive control.
 */
jslet.ui.DBControl = jslet.Class.create(jslet.ui.Control, {
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, ctrlParams) {
		$super(el, ctrlParams);
	},

	_dataset: undefined,

	_isDBControl: true,
	
	/**
	 * @property
	 * 
	 * Dataset which to link to control.
	 * 
	 * @param {String | undefined} dataset Dataset name.
	 * 
	 * @return {this | jslet.data.Dataset}
	 */
	dataset: function(dataset) {
		if(dataset === undefined) {
			return this._dataset;
		}

		if (jslet.isString(dataset)) {
			dataset = jslet.data.getDataset(jQuery.trim(dataset));
		}
		
		jslet.Checker.test('DBControl.dataset', dataset).required().isClass(jslet.data.Dataset.className);
		this._dataset = dataset;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	setParams: function ($super, ctrlParams) {
		$super(ctrlParams);
		if(this._isDBControl && !this._dataset) {
			var dsName = this.getDatasetInParentElement();
			this.dataset(dsName);
		}
	},
	
	/**
	 * @protected
	 * @override
	 * 
	 * Call this method before binding parameters to a HTML element, you can rewrite this in your owner control.
	 */
	beforeBind: function ($super) {
		$super();
		if(this._isDBControl) {
			this._dataset.addLinkedControl(this);
		}
	},

	/**
	 * @protected
	 * @override
	 */
	checkRequiredProperty: function($super) {
		if(this._isDBControl) {
			jslet.Checker.test('DBControl.dataset', this._dataset).required();
		}
		$super();
	},
	
	/**
	 * @protected
	 * 
	 * Refresh control when data changed.
	 * There are three type changes: meta changed, data changed, lookup data changed.
	 * 
	 * @param {jslet.data.RefreshEvent} evt jslet refresh event object.
	 * 
	 * @return {Boolean} if refresh successfully, return true, otherwise false.
	 */
	refreshControl: function (evt) {
		var Z = this, evtType;
		if(evt) {
			evtType = evt.eventType;
		} else {
			evtType = jslet.data.RefreshEvent.UPDATEALL;
		}
		// Meta changed 
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
			var metaName = evt.metaName;
			if(Z._field && Z._field == evt.fieldName) {
				Z.doMetaChanged(metaName);
			} else {
				if(!Z._field && (metaName == 'visible' || metaName == 'editControl')) {
					Z.doMetaChanged(metaName);
				}
			}
			return true;
		}
		//Lookup data changed
		if(evtType == jslet.data.RefreshEvent.UPDATELOOKUP && evt.fieldName == Z._field) {
			Z.doLookupChanged(evt.isMetaChanged);
			return true;
		}

		//Value changed
		if (evtType == jslet.data.RefreshEvent.SCROLL || 
				evtType == jslet.data.RefreshEvent.INSERT ||
				evtType == jslet.data.RefreshEvent.DELETE) {
			Z.doValueChanged();
			return true;
		}
		if((evtType == jslet.data.RefreshEvent.UPDATERECORD ||
			evtType == jslet.data.RefreshEvent.UPDATECOLUMN) && 
			evt.fieldName === undefined || evt && evt.fieldName == Z._field){
			Z.doValueChanged();
			return true;
		}
		if(evtType == jslet.data.RefreshEvent.UPDATEALL) {
			Z.doMetaChanged();
			Z.doLookupChanged();
			Z.doValueChanged();
			return true;
		}
		
		return true;
	}, // end refreshControl
	
	/**
	 * @protected
	 * 
	 * Refresh UI when field meta is changed.
	 * 
	 * @param {String} metaName Field meta name, like: readOnly, disabled,...
	 */
	doMetaChanged: function(metaName){},
	
	/**
	 * @protected
	 * 
	 * Refresh UI when field value is changed.
	 */
	doValueChanged: function() {},
	
	/**
	 * @protected
	 * 
	 * Refresh UI when field lookup value is changed.
	 */
	doLookupChanged: function() {},
	
	/**
	 * @private
	 */
	getDatasetInParentElement: function () {
		var el = this.el, pEl = null;
		while (true) {
			pEl = jslet.ui.getParentElement(el, 1);
			if (!pEl) {
				break;
			}
			if (pEl.jslet) {
				return pEl.jslet.dataset;
			}
			el = pEl;
		} //end while
		return null;
	},

	/**
	 * @override
	 */
	destroy: function ($super) {
		this.removeAllChildControls();
		if (this._isDBControl && this._dataset) {
			this._dataset.removeLinkedControl(this);
		}
		this._dataset = null;
		$super();
	}
});

/**
 * @class
 * @extend jslet.ui.DBControl
 * 
 * Base data sensitive field control. It's the base class for all form controls.
 */
jslet.ui.DBFieldControl = jslet.Class.create(jslet.ui.DBControl, {
	initialize: function ($super, el, ctrlParams) {
		$super(el, ctrlParams);
	},

	_field: undefined,
	
	_valueIndex: undefined,
	
	_enableInvalidTip: true,
	
	_tableId: null,
	
	_tabIndex: null,
	
	/**
	 * @property
	 * 
	 * Field name which to link to control.
	 * 
	 * @param {String | undefined} fldName Field name.
	 * 
	 * @return {this | String}
	 */
	field: function(fldName) {
		if(fldName === undefined) {
			return this._field;
		}
		
		fldName = jQuery.trim(fldName);
		jslet.Checker.test('DBControl.field', fldName).isString().required();
		var k = fldName.lastIndexOf('#');
		if(k > 0) {
			this._fieldMeta = fldName.substring(k+1);
			fldName = fldName.substring(0, k);
		}
		
		this._field = fldName;
		return this;
	},
	
	fieldMeta: function() {
		return this._fieldMeta;
	},
	
	/**
	 * @property
	 * 
	 * Field value index which to link to control. 
	 * 
	 * @param {Integer | undefined} valueIndex Field value index.
	 * 
	 * @return {this | Integer}
	 */
	valueIndex: function(valueIndex) {
		if(valueIndex === undefined) {
			return this._valueIndex;
		}
		jslet.Checker.test('DBControl.valueIndex', valueIndex).isNumber();
		
		this._valueIndex = parseInt(valueIndex);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Tab index of control. 
	 * 
	 * @param {Integer | undefined} tabIndex Tab index.
	 * 
	 * @return {this | Integer}
	 */
	tabIndex: function(tabIndex) {
		if(tabIndex === undefined) {
			return this._tabIndex;
		}
		jslet.Checker.test('DBControl.tabIndex', tabIndex).isNumber();
		this._tabIndex = tabIndex;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	setParams: function ($super, ctrlParams) {
		$super(ctrlParams);
		if(this._isDBControl) {
			var value = ctrlParams.valueIndex;
			if (value !== undefined) {
				this.valueIndex(value);
			}
		}
		var tbIdx = ctrlParams.tabIndex;
		if(tbIdx !== undefined) {
			this.tabIndex(tbIdx);
		}
		
	},
 
	/**
	 * @protected
	 * @override
	 */
	checkRequiredProperty: function($super) {
		$super();
		if(this._isDBControl) {
			jslet.Checker.test('DBControl.field', this._field).required();
			this.existField(this._field);
		}
	},

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		if(!metaName || metaName == 'tip') {
			var fldObj = this._dataset.getField(this._field);
			if(!fldObj) {
				throw new Error('Field: ' + this._field + ' NOT exist!');
			}
			var tip = fldObj.tip();
			tip = tip ? tip: '';
			this.el.title = tip;
		}
	},
	
	setTabIndex: function() {
		var Z = this,
			tabIdx = Z._tabIndex;
		if(Z._isDBControl) {
			if(tabIdx !== 0 && !tabIdx) {
				var fldObj = Z._dataset.getField(Z._field);
				if(fldObj) {
					tabIdx = fldObj.tabIndex();
				}
			}
		}
		if(tabIdx === 0 || tabIdx) {
			Z.el.tabIndex = tabIdx;
		}
	},
	
	existField: function(fldName) {
		var fldObj = this._dataset.getField(fldName);
		return fldObj ? true: false;
	},
	
	/**
	 * @protected
	 * 
	 * The table id when this control is embed into a DBTable control. This property is used internally, don't call it directly.
	 */
	tableId: function(tableId) {
		if(tableId === undefined) {
			return this._tableId;
		}
		this._tableId = tableId;
		return this;
	},
	
	/**
	 * Get field value.
	 * 
	 * @return {Object} Field value.
	 */
	getValue: function() {
		return this._dataset.getFieldValue(this._field, this._valueIndex); 
	},
	
	/**
	 * Get display text of field.
	 * 
	 * @param {Boolean} isEditing True - get editing text, false - get display text.
	 * 
	 * @return {String}
	 */
	getText: function(isEditing) {
		return this._dataset.getFieldText(this._field, isEditing, this._valueIndex); 
	},
	
	/**
	 * Get field error.
	 * 
	 * @return {Object} Error Object, like {message: 'Not Exists!', inputText: 'Foo'}
	 */
	getFieldError: function() {
		return this._dataset.getFieldError(this._field, this._valueIndex);
	},
	
	/**
	 * @protected
	 * 
	 * Render invalid message and change the control to "invalid" style.
	 * 
	 *  @param {String} errObj error object: {code: xxx, message}, if it's null, clear the 'invalid' style. 
	 */
	renderInvalid: function (errObj) {
		var Z = this;
		if (!Z._field) {
			return;
		}
		if (errObj){
			jQuery(Z.el).parent().addClass('has-error');
			Z.el.title = errObj.message || '';
		} else {
			jQuery(Z.el).parent().removeClass('has-error');
			Z.el.title = '';
		}
	},
 
	/**
	 * @protected
	 * 
	 * Identify this control can be focused or not.  
	 */
	canFocus: function() {
		return true;
	},
	
	/**
	 * Focus to this control.
	 * 
	 * @return {this}
	 */
	focus: function() {
		var Z = this;
		if(!Z.canFocus()) {
			return;
		}
		if(Z._isDBControl) {
			var	fldObj = Z._dataset.getField(Z._field),
				flag = !fldObj || fldObj.disabled() || fldObj.readOnly() || !fldObj.visible();
			if(flag) {
				return;
			}
			if(Z._tableId) {
				jslet('#' + Z._tableId).gotoField(Z._field);
			}
		}
		this.innerFocus();
		return this;
	},
	
	/**
	 * @protected
	 * 
	 */
	innerFocus: function() {
		var Z = this,
			el = Z.el;
		if (el.focus) {
			try {
				el.focus();
				if(Z.selectText && Z.autoSelectAll && Z.autoSelectAll()) {
					Z.selectText();
				}
				return;
			} catch (e) {
				//Can\'t focus on this control, maybe it\'s disabled!
				console.warn(jsletlocale.Dataset.cannotFocusControl);
			}
		}
	},
	
	/**
	 * @override
	 */
	destroy: function ($super) {
		$super();
		this._field = null;
	}
	
});

/*
 * Convert string parameters to object
 * 
 * @param {String | Object} ctrlParams Control parameters.
 * @return {Object}
 */
jslet.ui._evalParams = function (ctrlParams) {
	jslet.Checker.test('evalParams#ctrlParams', ctrlParams).required();
	if (jslet.isString(ctrlParams)) {
		var p = jQuery.trim(ctrlParams);
		if (!p.startsWith('{') && p.indexOf(':')>0) {
			p = '{' + p +'}';
		}
		try {
			/* jshint ignore:start */
			ctrlParams = new Function('return ' + unescape(p))();
			/* jshint ignore:end */
			if(ctrlParams['var']) {
				ctrlParams = ctrlParams['var'];
			}
			return ctrlParams;
		} catch (e) {
			throw new Error(jslet.formatMessage(jsletlocale.DBControl.invalidJsletProp, [ctrlParams]));
		}
	}
	return ctrlParams;
};

/*
 * Hold all jslet control's configurations.
 */
jslet.ui.controls = {};

/**
 * @member jslet.ui
 * 
 * Register jslet control class. This method is used to create a new Jslet control. Example:
 * 
 *     @example
 *     jslet.ui.register('DBTable', jslet.ui.DBTable);
 * 
 * @param {String} ctrlName Control name.
 * @param {jslet.ui.Control} ctrlType Control Class.
 */
jslet.ui.register = function (ctrlName, ctrlType) {
	jslet.Checker.test('jslet.ui.register#ctrlName', ctrlName).required().isString();
	jslet.Checker.test('jslet.ui.register#ctrlType', ctrlType).required();
	jslet.ui.controls[ctrlName.toLowerCase()] = ctrlType;
};

/**
 * Create jslet control according to control configuration, and add it to parent element. Example:
 * 
 *     @example
 *     var pElement = document.getElementById('div1');
 *     jslet.ui.createControl({type:'DBTable', dataset: 'employee'}, pElement, 300, 500); 
 * 
 * @member jslet.ui
 * 
 * @param {String | Object} jsletparam Jslet Parameter.
 * @param {HtmlElement} parent Parent html element which created control will be added to.
 * @param {Integer} width (Optional)Control width, unit: px.
 * @param {Integer} height (Optional)Control height, Unit: px. 
 * @param {Boolean} hidden (Optional)Hide control or not.
 *  
 * @return {jslet.ui.Control}
 */
jslet.ui.createControl = function (jsletparam, parent, width, height, hidden) {
	jslet.Checker.test('jslet.ui.createControl#jsletparam', jsletparam).required();
	var isAuto = false, 
		pnode = parent,
		container = document.createElement('div'),
		ctrlParam = jslet.ui._evalParams(jsletparam),
		controlType = ctrlParam.type;
	if (!controlType) {
		controlType = jslet.ui.controls.DBTEXT;
	}
	var ctrlClass = jslet.ui.controls[controlType.toLowerCase()];
	if (!ctrlClass) {
		throw new Error('NOT found control type: ' + controlType);
	}
	container.innerHTML = ctrlClass.htmlTemplate;

	var el = container.firstChild;
	container.removeChild(el);
	if(hidden) {
		el.style.display = 'none';
	}	
	if (parent) {
		parent.appendChild(el);
	} else {
		document.body.appendChild(el);
	}
	if (width) {
		if (parseInt(width) == width)
			width = width + 'px';
		el.style.width = width;
	}
	if (height) {
		if (parseInt(height) == height)
			height = height + 'px';
		el.style.height = height;
	}

	return new ctrlClass(el, ctrlParam);
};

/**
 * @member jslet.ui
 * 
 * Get jslet class with class name.
 * 
 * @param {String} name Class name.
 * 
 * @return {jslet.ui.Control}
 */
jslet.ui.getControlClass = function (name) {
	jslet.Checker.test('jslet.ui.getControlClass#name', name).required().isString();
	return jslet.ui.controls[name.toLowerCase()];
};

/**
 * @member jslet.ui
 * 
 * Bind jslet control to an existing html element. Example:
 * 
 *     @example
 *     var tblDiv = document.getElementById('tblDiv');
 *     jslet.ui.bindControl(tblDiv, {type:'DBTable', dataset: 'employee'}); 
 * 
 * @param {HtmlElement} el HTML element.
 * @param {String | Object} jsletParam Control parameters.
 */
jslet.ui.bindControl = function (el, jsletParam, isInstalling) {
	if(!isInstalling) {
		jslet.Checker.test('jslet.ui.bindControl#el', el).required().isHTMLElement();
	}
	if (!jsletParam)
		jsletParam = jQuery(el).attr('data-jslet');
	if(el.jslet) {
		console.warn('Control has installed! Don\'t install it again!');
		return null;
	}
	if(!isInstalling) {
		jslet.Checker.test('jslet.ui.bindControl#jsletParam', jsletParam).required();
	}
	var ctrlParam = jslet.ui._evalParams(jsletParam);
	var controlType = ctrlParam.type;
	if (!controlType) {
		el.jslet = ctrlParam;
		return null;
	}
	var ctrlClass = jslet.ui.controls[controlType.toLowerCase()];
	if (!ctrlClass) {
		throw new Error('NOT found control type: ' + controlType);
	}
	return new ctrlClass(el, ctrlParam);
};

/**
 * @member jslet.ui
 * 
 * Unbind jslet control and clear jslet property. Example:
 * 
 *     @example
 *     var tblDiv = document.getElementById('tblDiv');
 *     jslet.ui.unbindControl(tblDiv); 
 * 
 * @param {HtmlElement} el HTML element.
 */
jslet.ui.unbindControl = function(el, isInstalling) {
	if(!isInstalling) {
		jslet.Checker.test('jslet.ui.unbindControl#el', el).required().isHTMLElement();
	}
	if (el.jslet && el.jslet.destroy) {
		el.jslet.destroy();
	}
	el.jslet = null;
};

/**
 * @member jslet.ui
 * 
 * Re-bind jslet control. Example:
 * 
 *     @example
 *     var tblDiv = document.getElementById('tblDiv');
 *     jslet.ui.rebindControl(tblDiv); 
 * 
 * @param {HtmlElement} el HTML element which binded a Jslet control.
 */
jslet.ui.rebindControl = function(el) {
	jslet.Checker.test('jslet.ui.rebindControl#el', el).required().isHTMLElement();
	jslet.ui.unbindControl(el);
	jslet.ui.bindControl(el);
};

/**
 * @member jslet.ui
 * 
 * Scan the specified HTML element children and bind jslet control to these HTML element with 'data-jslet' attribute. Example:
 * 
 *     @example
 *     jslet.ui.install(); //Install jslet on document.body
 *     
 *     var dialogDiv = document.getElementById('dlgId');
 *     jslet.ui.install(dialogDiv); //Install jslet on a dialog.
 * 
 * @param {HtmlElement} pElement (Optional)Parent HTML element which need to be scan, if null, document.body is used.
 * @param {Function} onJsletReady (Optional)Call back function after jslet installed.
 */
jslet.ui.install = function (pElement, onJsletReady) {
	if(pElement && (onJsletReady === undefined)) {
		//Match case: jslet.ui.install(onJsletReady);
		if(jQuery.isFunction(pElement)) {
			onJsletReady = pElement;
			pElement = null;
		}
	}
	
	if(!pElement && jsletlocale.isRtl){
		var jqBody = jQuery(document.body);
		if(!jqBody.hasClass('jl-rtl')) {
			jqBody.addClass('jl-rtl');
		}
	}
	var htmlTags;
	if (!pElement){
		pElement = document.body;
	} else {
		jslet.Checker.test('jslet.ui.install#pElement', pElement).isHTMLElement();		
	}
	htmlTags = jQuery(pElement).find('*[data-jslet]');

	var cnt = htmlTags.length, el, id, 
		existIds = jslet.existIds;
	if(!existIds) {
		existIds = {};
		jslet.existIds = existIds;
	}
	for (var i = 0; i < cnt; i++) {
		el = htmlTags[i];
		id = el.id;
		if(id) {
			if(existIds[id]) {
				console.warn(jslet.formatMessage(jsletlocale.Control.duplicatedId, [id]));
			} else {
				existIds[id] = 1;
			}
		}
		jslet.ui.bindControl(el, undefined, true);
	}
	if(onJsletReady){
		onJsletReady();
		//jslet.ui.onReady();
	}
	if(jslet.global.afterInstall) {
		jslet.global.afterInstall(pElement);
	}
};

///**
// * {Event} Fired after jslet has installed all controls.
// * Pattern: function(){};
// */
//jslet.ui.onReady = null;

/**
 * @member jslet.ui
 * 
 * Scan the specified HTML element children and unbind jslet control to these HTML element with 'data-jslet' attribute.
 * 
 * @param {HtmlElement} pElement (Optional)Parent HTML element which need to be scan, if null, document.body is used.
 */
jslet.ui.uninstall = function (pElement) {
	var htmlTags;
	if (!pElement) {
		htmlTags = jQuery('*[data-jslet]');
	} else {
		jslet.Checker.test('jslet.ui.install#pElement', pElement).isHTMLElement();		
		htmlTags = jQuery(pElement).find('*[data-jslet]');
	}
	var el;
	for(var i =0, cnt = htmlTags.length; i < cnt; i++){
		el = htmlTags[i];
		if (el.jslet && el.jslet.destroy) {
			el.jslet.destroy();
		}
		el.jslet = null;
	}
	if(jslet.ui.menuManager) {
		jQuery(document).off('mousedown', jslet.ui.menuManager.hideAll);
	}
//	jslet.ui.onReady = null;
};

/**
 * @private
 * @class
 * 
* Drag & Drop. A common framework to implement drag & drop. Example:
* 
*     @example
*     //Define a delegate class
*     dndDelegate = {}
*     dndDelegate._doDragStart = function(){}
*     dndDelegate._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {}
*     dndDelegate._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {}
*     dndDelegate._doDragCancel = function () {}
* 
*     //Initialize jslet.ui.DnD
*     //var dnd = new jslet.ui.DnD();
*     //Or use global jslet.ui.DnD instance to bind 'dndDelegate'
*     jslet.ui.dnd.bindControl(dndDelegate);
*	
*     //After end dragging, you need unbind it
*     jslet.ui.dnd.unbindControl();
* 
*/
jslet.ui.DnD = function () {
	var oldX, oldY, x, y, deltaX, deltaY,
		dragDelta = 2, 
		dragged = false, 
		bindedControl, 
		mouseDowned = true,
		self = this;

	this._docMouseDown = function (event) {
		event = jQuery.event.fix( event || window.event );
		mouseDowned = true;
		deltaX = 0;
		deltaY = 0;
		oldX = event.pageX;
		oldY = event.pageY;
		dragged = false;

		if (bindedControl && bindedControl._doMouseDown) {
			bindedControl._doMouseDown(oldX, oldY, x, y, deltaX, deltaY);
		}
	};

	this._docMouseMove = function (event) {
		if (!mouseDowned) {
			return;
		}
		event = jQuery.event.fix( event || window.event );
		
		x = event.pageX;
		y = event.pageY;
		if (!dragged) {
			if (Math.abs(deltaX) > dragDelta || Math.abs(deltaY) > dragDelta) {
				dragged = true;
				oldX = x;
				oldY = y;
				if (bindedControl && bindedControl._doDragStart) {
					bindedControl._doDragStart(oldX, oldY);
				}
				return;
			}
		}
		deltaX = x - oldX;
		deltaY = y - oldY;
		if (dragged) {
			if (bindedControl && bindedControl._doDragging) {
				bindedControl._doDragging(oldX, oldY, x, y, deltaX, deltaY);
			}
		} else {
			if (bindedControl && bindedControl._doMouseMove) {
				bindedControl._doMouseMove(oldX, oldY, x, y, deltaX, deltaY);
			}
			oldX = x;
			oldY = y;
		}
	};

	this._docMouseUp = function (event) {
		mouseDowned = false;
		if (dragged) {
			dragged = false;
			if (bindedControl && bindedControl._doDragEnd) {
				bindedControl._doDragEnd(oldX, oldY, x, y, deltaX, deltaY);
			}
		} else {
			if (bindedControl && bindedControl._doMouseUp) {
				bindedControl._doMouseUp(oldX, oldY, x, y, deltaX, deltaY);
			}
		}
		self.unbindControl();
	};

	this._docKeydown = function (event) {
		event = jQuery.event.fix( event || window.event );
		if (event.which == 27) {//Esc key
			if (dragged) {
				dragged = false;
				if (bindedControl && bindedControl._doDragCancel) {
					bindedControl._doDragCancel();
					self.unbindControl();
				}
			}
		}
	};

	this._docSelectStart = function (event) {
		event = jQuery.event.fix( event || window.event );
		event.preventDefault();

		return false;
	};

	/**
	 * Bind control.
	 * 
	 * @param {Object} ctrl The control need drag & drop, there are four method in it: <br />
	 *  ctrl._doDragStart = function(){} <br />
	 *  ctrl._doDragging = function(oldX, oldY, x, y, deltaX, deltaY){} <br />
	 *  ctrl._doDragEnd = function(oldX, oldY, x, y, deltaX, deltaY){} <br />
	 *  ctrl._doDragCancel = function(){} <br />
	 *  ctrl_doDragStart = function{}
	 */
	this.bindControl = function (ctrl) {
		bindedControl = ctrl;
		var doc = jQuery(document);
		doc.on('mousedown', this._docMouseDown);
		doc.on('mouseup', this._docMouseUp);
		doc.on('mousemove', this._docMouseMove);
		doc.on('selectstart', this._docSelectStart);
		doc.on('keydown', this._docKeydown);
	};

	/**
	 * Unbind the current control
	 */
	this.unbindControl = function () {
		var doc = jQuery(document);
		doc.off('mousedown', this._docMouseDown);
		doc.off('mouseup', this._docMouseUp);
		doc.off('mousemove', this._docMouseMove);
		doc.off('selectstart', this._docSelectStart);
		doc.off('keydown', this._docKeydown);
		
		bindedControl = null;
	};
};

/**
 * @private
 * 
 * Global Drag & drop object.
 * 
 * @member jslet.ui
 */
jslet.ui.dnd = new jslet.ui.DnD();


/**
 * @class
 * 
 * EditMask.
 * 
 * Create edit mask class and attach to a HTML text element. Example:
 * 
 *     @example
 *     var htmlText = jQuery('#textId')[0];
 *     var mask = new jslet.ui.EditMask();
 *     mask.attach(htmlText);
 *     mask.setMask('L00-000');
 * 
 */
jslet.ui.EditMask = function () {
	this._mask = null;
	this._keepChar = true;
	this._transform = null;

	this._literalChars = null;
	this._parsedMask = null;
	this._format = null;
	this._target = null;
	this._buffer = null;
};

jslet.ui.EditMask.prototype = {
	maskChars: {
		'#': { regexpr: new RegExp('[0-9\\-]'), required: false }, 
		'0': { regexpr: new RegExp('[0-9]'), required: true },
		'9': { regexpr: new RegExp('[0-9]'), required: false },
		'L': { regexpr: new RegExp('[A-Za-z]'), required: true },
		'l': { regexpr: new RegExp('[A-Za-z]'), required: false },
		'A': { regexpr: new RegExp('[0-9a-zA-Z]'), required: true },
		'a': { regexpr: new RegExp('[0-9a-zA-Z]'), required: false },
		'C': { regexpr: null, required: true },
		'c': { regexpr: null, required: false }
	},
	
	transforms: ['upper','lower'],

	/**
	 * Set edit mask. Example:
	 * 
	 *     @example
	 *     var htmlText = jQuery('#textId')[0];
	 *     var mask = new jslet.ui.EditMask();
	 *     mask.attach(htmlText);
	 *     mask.setMask('L00-000');
	 * 
	 * @param {String} mask Mask string, rule: <br />
	 *  '#': char set: 0-9 and -, not required. <br />
	 *  '0': char set: 0-9, required. <br />
	 *  '9': char set: 0-9, not required. <br />
	 *  'L': char set: A-Z,a-z, required. <br />
	 *  'l': char set: A-Z,a-z, not required. <br />
	 *  'A': char set: 0-9,a-z,A-Z, required. <br />
	 *  'a': char set: 0-9,a-z,A-Z, not required. <br />
	 *  'C': char set: any char, required. <br />
	 *  'c': char set: any char, not required.
	 *
	 * @param {Boolean} keepChar Keep the literal character or not.
	 * @param {String} transform Transform character into UpperCase or LowerCase, optional value: 'upper', 'lower' or null.
	 */
	setMask: function(mask, keepChar, transform){
		mask = jQuery.trim(mask);
		jslet.Checker.test('EditMask#mask', mask).isString();
		this._mask = mask;
		this._keepChar = keepChar ? true: false;
		
		this._transform = null;
		if(transform){
			var checker = jslet.Checker.test('EditMask#transform', transform).isString();
			transform = jQuery.trim(transform);
			transform = transform.toLowerCase();
			checker.inArray(this.transforms);
			this._transform = transform;
		}
		this._parseMask();
	},
	
	/**
	 * Attach edit mask to a HTML text element.
	 * 
	 * @param {HtmlElement} target HTML text element.
	 */
	attach: function (target) {
		jslet.Checker.test('EditMask.attach#target', target).required();
		var Z = this, jqText = jQuery(target);
		Z._target = target;
		jqText.on('keypress.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			var c = event.which;
			if (c === 0) {
				return true;
			}
			if (!Z._doKeypress(c)) {
				event.preventDefault();
			} else {
				return true;
			}
		});
		jqText.on('keydown.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			if (!Z._doKeydown(event.which)) {
				event.preventDefault();
			} else {
				return true;
			}
		});

		jqText.on('blur.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			if (!Z._doBur()) {
				event.preventDefault();
				event.currentTarget.focus();
			} else {
				return true;
			}
		});

		jqText.on('cut.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			Z._doCut(event.originalEvent.clipboardData || window.clipboardData);
			event.preventDefault();
			return false;
		});

		jqText.on('paste.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			if (!Z._doPaste(event.originalEvent.clipboardData || window.clipboardData)) {
				event.preventDefault();
			}
		});
	},

	/**
	 * Detach edit mask from a HTML text element
	 */
	detach: function(){
		var jqText = jQuery(this._target);
		jqText.off('keypress.editmask');
		jqText.off('keydown.editmask');
		jqText.off('blur.editmask');
		jqText.off('cut.editmask');
		jqText.off('paste.editmask');
		this._target = null; 
	},
	
	/**
	 * Set value to text box.
	 * 
	 * @param {String} value New value.
	 */
	setValue: function (value) {
		jslet.Checker.test('EditMask.setValue#value', value).isString();
		value = jQuery.trim(value);
		value = value ? value : '';
		if(!this._mask) {
			this._target.value = value;
			return;
		}
		
		var Z = this;
		Z._clearBuffer(0);
		var prePos = 0, pos, preValuePos = 0, k, i, 
			ch, vch, valuePos = 0, fixedChar, 
			maskLen = Z._parsedMask.length;
		while (true) {
			fixedChar = Z._getFixedCharAndPos(prePos);
			pos = fixedChar.pos;
			ch = fixedChar.ch;
			if (pos < 0) {
				pos = prePos;
			}
			if (ch) {
				valuePos = value.indexOf(ch, preValuePos);
				if (valuePos < 0) {
					valuePos = value.length;
				}
				k = -1;
				for (i = valuePos - 1; i >= preValuePos; i--) {
					vch = value.charAt(i);
					Z._buffer[k + pos] = vch;
					k--;
				}
				preValuePos = valuePos + 1;
			} else {
				k = 0;
				var c, cnt = Z._buffer.length;
				for (i = prePos; i < cnt; i++) {
					c = value.charAt(preValuePos + k);
					if (!c) {
						break;
					}
					Z._buffer[i] = c;
					k++;
				}
				break;
			}
			prePos = pos + 1;
		}
		Z._showValue();
	},
	
	/**
	 * Get unmasked value.
	 * 
	 * @return {String} Unmasked value.
	 */
	getValue: function(){
		var value = this._target.value;
		if(this._keepChar) {
			return value;
		} else {
			var result = [], maskObj;
			for(var i = 0, cnt = value.length; i< cnt; i++){
				maskObj = this._parsedMask[i];
				if(maskObj.isMask) {
					result.push(value.charAt(i));
				}
			}
			return result.join('');
		}
	},
	
	/**
	 * Check the value is valid or not.
	 * 
	 * @return {Boolean} True - the value is valid, false - otherwise.
	 */
	validateValue: function(){
		var Z = this, len = Z._parsedMask.length, cfg;
		for(var i = 0; i< len; i++){
			cfg = Z._parsedMask[i];
			if(cfg.isMask && Z.maskChars[cfg.ch].required){
				if(Z._buffer[i] == Z._format[i]) {
					return false;
				}
			}
		}
		return true;
	},
	
	_getFixedCharAndPos: function (begin) {
		var Z = this;
		if (!Z._literalChars || Z._literalChars.length === 0) {
			return { pos: 0, ch: null };
		}
		if (!begin) {
			begin = 0;
		}
		var ch, mask;
		for (var i = begin, cnt = Z._parsedMask.length; i < cnt; i++) {
			mask = Z._parsedMask[i];
			if (mask.isMask) {
				continue;
			}
			ch = mask.ch;
			if (Z._literalChars.indexOf(ch) >= 0) {
				return { ch: ch, pos: i };
			}
		}
		return { pos: -1, ch: null };
	},

	_parseMask: function () {
		var Z = this;
		if(!Z._mask) {
			Z._parsedMask = null;
			return;
		}
		Z._parsedMask = [];
		
		Z._format = [];
		var c, prevChar = null, isMask;

		for (var i = 0, cnt = Z._mask.length; i < cnt; i++) {
			c = Z._mask.charAt(i);
			if (c == '\\') {
				prevChar = c;
				continue;
			}
			isMask = false;
			if (Z.maskChars[c] === undefined) {
				if (prevChar) {
					Z._parsedMask.push({ ch: prevChar, isMask: isMask });
				}
				Z._parsedMask.push({ ch: c, isMask: isMask });
			} else {
				isMask = prevChar ? false : true;
				Z._parsedMask.push({ ch: c, isMask: isMask });
			}
			if(Z._keepChar && !isMask){
				if(!Z._literalChars) {
					Z._literalChars = [];
				}
				var notFound = true;
				for(var k = 0, iteralCnt = Z._literalChars.length; k < iteralCnt; k++){
					if(Z._literalChars[k] == c){
						notFound = false;
						break;
					}
				}
				if(notFound) {
					Z._literalChars.push(c);
				}
			}
			prevChar = null;
			Z._format.push(isMask ? '_' : c);
		} //end for

		Z._buffer = Z._format.slice(0);
		if(Z._target) {
			Z._target.value = Z._format.join('');
		}
	},
	
	_validateChar: function (maskChar, inputChar) {
		var maskCfg = this.maskChars[maskChar];
		var regExpr = maskCfg.regexpr;
		if (regExpr) {
			return regExpr.test(inputChar);
		} else {
			return true;
		}
	},

	_getValidPos: function (pos, toLeft) {
		var Z = this, 
			cnt = Z._parsedMask.length, i;
		if (pos >= cnt) {
			return cnt - 1;
		}
		if (!toLeft) {
			for (i = pos; i < cnt; i++) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}
			for (i = pos; i >= 0; i--) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}

		} else {
			for (i = pos; i >= 0; i--) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}
			for (i = pos; i < cnt; i++) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}
		}
		return -1;
	},

	_clearBuffer: function (begin, end) {
		if(!this._buffer) {
			return;
		}
		if (!end) {
			end = this._buffer.length - 1;
		}
		for (var i = begin; i <= end; i++) {
			this._buffer[i] = this._format[i];
		}
	},

	_packEmpty: function (begin, end) {
		var c, k = 0, Z = this, i;
		for (i = begin; i >= 0; i--) {
			c = Z._format[i];
			if (Z._literalChars && Z._literalChars.indexOf(c) >= 0) {
				k = i;
				break;
			}
		}
		begin = k;
		var str = [];
		for (i = begin; i < end; i++) {
			c = Z._buffer[i];
			if (c != Z._format[i]) {
				str.push(c);
			}
		}
		var len = str.length - 1;

		for (i = end - 1; i >= begin; i--) {
			if (len >= 0) {
				Z._buffer[i] = str[len];
				len--;
			} else {
				Z._buffer[i] = Z._format[i];
			}
		}
	},

	_updateBuffer: function (pos, ch) {
		var begin = pos.begin, end = pos.end, Z = this;

		begin = Z._getValidPos(begin);
		if (begin < 0) {
			return -1;
		}
		Z._clearBuffer(begin + 1, end);
		if (Z._literalChars && Z._literalChars.indexOf(ch) >= 0) {
			for (var i = begin, cnt = Z._parsedMask.length; i < cnt; i++) {
				if (Z._parsedMask[i].ch == ch) {
					Z._packEmpty(begin, i);
					return i;
				}
			}
		} else {
			var maskObj = Z._parsedMask[begin];
			if (Z._validateChar(maskObj.ch, ch)) {
				Z._buffer[begin] = ch;
				return begin;
			} else	{
				return -1;
			}
		}
	},

	_moveCursor: function (begin, toLeft) {
		begin = this._getValidPos(begin, toLeft);
		if (begin >= 0) {
			jslet.ui.TextUtil.setCursorPos(this._target, begin);
		}
	},

	_showValue: function () {
		this._target.value = this._buffer.join('');
	},

	_doKeypress: function (chCode) {
		if (chCode == 13) {
			return true;
		}

		var ch = String.fromCharCode(chCode), Z = this;
		if (Z._transform == 'upper') {
			ch = ch.toUpperCase();
		} else {
			if (Z._transform == 'lower') {
				ch = ch.toLowerCase();
			}
		}
		var pos = jslet.ui.TextUtil.getCursorPos(Z._target);
		var begin = Z._updateBuffer(pos, ch);
		Z._showValue();
		if (begin >= 0) {
			Z._moveCursor(begin + 1);
		} else {
			Z._moveCursor(pos.begin);
		}

		return false;
	},

	_doKeydown: function (chCode) {
		var Z = this,
			pos = jslet.ui.TextUtil.getCursorPos(Z._target),
			begin = pos.begin,
			end = pos.end;

		if (chCode == 229) {//IME showing
			var flag = (Z._parsedMask.legnth > begin);
			if (flag) {
				var msk = Z._parsedMask[begin];
				flag = msk.isMask;
				if (flag) {
					var c = msk.ch;
					flag = (c == 'c' || c == 'C');
				}
			}
			if (!flag) {
				window.setTimeout(function () {
					Z._showValue();
					Z._moveCursor(begin);
				}, 50);
			}
		}
		if (chCode == 13) //enter
		{
			return true;
		}

		if (chCode == 8) //backspace
		{
			if (begin == end) {
				begin = Z._getValidPos(--begin, true);
				end = begin;
			}
			Z._clearBuffer(begin, end);
			Z._showValue();
			Z._moveCursor(begin, true);
			return false;
		}

		if (chCode == 27) // Allow to send 'ESC' command
		{
			return false;
		}

		if (chCode == 39) // Move Left
		{
		}

		if (chCode == 46) // delete the selected text
		{
			Z._clearBuffer(begin, end - 1);
			Z._showValue();
			Z._moveCursor(begin);

			return false;
		}
		return true;
	},

	_doBur: function () {
		var mask, c, Z = this;
		for (var i = 0, cnt = Z._parsedMask.length; i < cnt; i++) {
			mask = Z._parsedMask[i];
			if (!mask.isMask) {
				continue;
			}
			c = mask.ch;
			if (Z.maskChars[c].required) {
				if (Z._buffer[i] == Z._format[i]) {
					//jslet.ui.TextUtil.setCursorPos(Z._target, i);
					//return false;
					return true;
				}
			}
		}
		return true;
	},

	_doCut: function (clipboardData) {
		var Z = this,
			data = jslet.ui.TextUtil.getSelectedText(Z._target),
			range = jslet.ui.TextUtil.getCursorPos(Z._target),
			begin = range.begin;
		Z._clearBuffer(begin, range.end - 1);
		Z._showValue();
		Z._moveCursor(begin, true);
		clipboardData.setData('Text', data);
		return false;
	},

	_doPaste: function (clipboardData) {
		var pasteValue = clipboardData.getData('Text');
		if (!pasteValue) {
			return false;
		}
		var pos = jslet.ui.TextUtil.getCursorPos(this._target), begin = 0, ch;
		pos.end = pos.begin;
		for (var i = 0; i < pasteValue.length; i++) {
			ch = pasteValue.charAt(i);
			begin = this._updateBuffer(pos, ch);
			pos.begin = i;
			pos.end = pos.begin;
		}
		this._showValue();
		if (begin >= 0) {
			this._moveCursor(begin + 1);
		}
		return true;
	}
};

/**
 * @class
 * @static
 * 
 * Util of "Text" control.
 */
jslet.ui.TextUtil = {
	/**
	 * Select text from an Input(Text) element.
	 * 
	 * @param {HtmlElement} txtEl The HTML text element .  
	 * @param {Integer} start Start position.
	 * @param {Integer} end End position.
	 */
	selectText: function(txtEl, start, end){
		var v = txtEl.value;
		if (v.length > 0) {
			start = start === undefined ? 0 : start;
			end = end === undefined ? v.length : end;
 
			if (txtEl.setSelectionRange) {
				txtEl.setSelectionRange(start, end);
			} else if (txtEl.createTextRange) {
				var range = txtEl.createTextRange();
				range.moveStart('character', start);
				range.moveEnd('character', end - v.length);
				range.select();
			}
		}	
	},
	
	/**
	 * Get selected text.
	 * 
	 * @param {HtmlElement} textEl HTML Text Element.
	 * 
	 * @return {String}  
	 */
	getSelectedText: function (txtEl) {
		if (txtEl.setSelectionRange) {
			var begin = txtEl.selectionStart;
			var end = txtEl.selectionEnd;
			return txtEl.value.substring(begin, end);
		}
		if (document.selection && document.selection.createRange) {
			return document.selection.createRange().text;
		}
	},

	/**
	 * Get cursor postion of a HTML text element.
	 * 
	 * @param {HtmlElement} txtEl HTML Text Element.
	 * 
	 * @return {Integer}
	 */
	getCursorPos: function(txtEl){
		var result = { begin: 0, end: 0 };

		if (txtEl.setSelectionRange) {
			result.begin = txtEl.selectionStart;
			result.end = txtEl.selectionEnd;
		}
		else if (document.selection && document.selection.createRange) {
			var range = document.selection.createRange();
			result.begin = 0 - range.duplicate().moveStart('character', -100000);
			result.end = result.begin + range.text.length;
		}
		return result;
	},
	
	/**
	 * Set cursor postion of html text element
	 * 
	 * @param {HtmlElement} txtEl Html Text Element
	 * @param {Integer} pos Cusor position
	 */
	setCursorPos: function(txtEl, pos){
		if (txtEl.setSelectionRange) {
			txtEl.focus();
			txtEl.setSelectionRange(pos, pos);
		}
		else if (txtEl.createTextRange) {
			var range = txtEl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}	
	}
};

/**
 * @class
 * 
 * Control focus manager.
 */
jslet.ui.FocusManager = function() {
	this._onChangingFocus = null;
	this._focusKeyCode = null;
	this._containerIds = null;
	this._activeDataset = null;
	this._activeField = null;
	this._activeValueIndex = null;
	
	this._initialize();
};

jslet.ui.FocusManager.prototype = {
	/**
	 * @event
	 * 
	 * Set or get onChangingFocus event handler. Example:
	 * 
	 *     @example
	 *     var doChangingFocus = function (element, reserve, datasetObj, fieldName, focusingFieldList, valueIndex) {
	 * 	     console.log('Changing focus');
	 *     };
	 *     jslet.ui.globalFocusManager.onChangingFocus(doChangingFocus);
	 * 
	 * @param {Function | undefined} onChangingFocus Focus changing event handler.
	 * 
	 * @param {HtmlElement} element Focusing HTML element;
	 * @param {Boolean} reserve If it's focusing prior element, reserve is true, otherwise false;
	 * @param {jslet.data.Dataset} datasetObj Current dataset object. If the UI control is not jslet UI control, it's null;
	 * @param {String} fieldName Current field name. If the UI control is not jslet UI field control, it's null;
	 * @param {String[]} focusingFieldList Focusing field name list. You can use 'focusingFieldList' and 'fieldName' to check the position of field name.  
	 * @param {Integer} valueIndex Identify the value index of BETWEEN-style or MULTIPLE-style field.
	 * 
	 * @return {this | Function}
	 */
	onChangingFocus: function(onChangingFocus) {
		if(onChangingFocus === undefined) {
			return this._onChangingFocus;
		}
		jslet.Checker.test('FocusManager.onChangingFocus', onChangingFocus).isFunction();
		this._onChangingFocus = onChangingFocus;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get 'focusKeyCode'
	 * 
	 * @param {Integer | undefined} focusKeyCode Key code for changing focus, default is 9 ('Tab' key).
	 * 
	 * @return {this | Integer}
	 */
	focusKeyCode: function(focusKeyCode) {
		if(focusKeyCode === undefined) {
			return this._focusKeyCode;
		}
		jslet.Checker.test('FocusManager.focusKeyCode', focusKeyCode).isNumber();
		this._focusKeyCode = focusKeyCode;
		return this;
	},
	
	activeDataset: function(dsName) {
		if(dsName === undefined) {
			return this._activeDataset;
		}
		jslet.Checker.test('FocusManager.activeDataset', dsName).isString();
		this._activeDataset = dsName;
		return this;
	},
	
	activeField: function(fldName) {
		if(fldName === undefined) {
			return this._activeField;
		}
		jslet.Checker.test('FocusManager.activeField', fldName).isString();
		this._activeField = fldName;
		return this;
	},
	
	activeValueIndex: function(valueIndex) {
		if(valueIndex === undefined) {
			return this._activeValueIndex;
		}
		jslet.Checker.test('FocusManager.activeValueIndex', valueIndex).isNumber();
		this._activeValueIndex = valueIndex;
		return this;
	},
	
	pushContainer: function(containerId) {
		jslet.Checker.test('FocusManager.pushContainer#containerId', containerId).required().isString();
		if(this._containerIds === null) {
			this._containerIds = [];
		}
		this._containerIds.push(containerId);
	},
	
	popContainer: function(containerId) {
		jslet.Checker.test('FocusManager.pushContainer#containerId', containerId).required().isString();
		if(this._containerIds[this._containerIds.length - 1] == containerId) {
			this._containerIds.pop();
		}
	},
	
	tabPrev: function() {
		jQuery.tabPrev(this._getContainer(), true, jQuery.proxy(this._doChangingFocus, this));
	},
	
	tabNext: function() {
		jQuery.tabNext(this._getContainer(), true, jQuery.proxy(this._doChangingFocus, this));
	},
	
	_getContainer: function() {
		var Z = this,
			jqContainer;
		if(Z._containerIds && Z._containerIds.length > 0) {
			var containerId = Z._containerIds[Z._containerIds.length - 1];
			jqContainer = jQuery('#' + containerId);
			if(jqContainer.length === 0) {
				throw new Error('Not found container: ' + containerId);
			}
		} else {
			jqContainer = jQuery(document);
		}
		return jqContainer;
	},
	
	_doChangingFocus: function(ele, reverse) {
		var Z = this,
			dsObj = jslet.data.getDataset(Z._activeDataset),
			focusedFlds = dsObj && dsObj.mergedFocusedFields();
		if(Z._onChangingFocus) {
			var cancelFocus = Z._onChangingFocus(ele, reverse, dsObj, Z._activeField, focusedFlds, Z._activeValueIndex);
			if(!cancelFocus) {
				return false;
			}
		}
		if(!Z._activeDataset && !Z._activeField) {
			return true;
		}
		if(!dsObj || !dsObj.focusedFields()) {
			return true;
		}
		var idx = focusedFlds.indexOf(Z._activeField);
		if(idx < 0) {
			return true;
		}
		var masterFldName;
		if(!reverse) {
			if(idx === focusedFlds.length - 1) {
				masterFldName = dsObj.masterField();
				if(masterFldName) {
					Z._activeDataset = dsObj.masterDataset();
					Z._activeField = masterFldName;
					return Z._doChangingFocus(ele, reverse);
				}
				return true;
			} else {
				dsObj.focusEditControl(focusedFlds[idx + 1]);
			}
		} else {
			if(idx === 0) {
				masterFldName = dsObj.masterField();
				if(masterFldName) {
					Z._activeDataset = dsObj.masterDataset();
					Z._activeField = masterFldName;
					return Z._doChangingFocus(ele, reverse);
				}
				return true;
			} else {
				dsObj.focusEditControl(focusedFlds[idx - 1]);
			}
		}
		return false;
	},
	
	_initialize: function() {
		function isTabableElement(ele) {
			var tagName = ele.tagName;
			if(tagName == 'TEXTAREA' || tagName == 'A' || tagName == 'BUTTON') {
				return false;
			}
			if(tagName == 'INPUT') {
				var typeAttr = ele.type;
				if(typeAttr == 'button' || typeAttr == 'image' || typeAttr == 'reset' || typeAttr == 'submit' || typeAttr == 'url' || typeAttr == 'file') {
					return false;
				}
			}
			return true;
		}
		
		var Z = this;
		
		function handleHostKeyDown(event) {
			var focusKeyCode = Z._focusKeyCode || jslet.global.defaultFocusKeyCode || 9;
			var keyCode = event.which;
			if(keyCode === focusKeyCode || keyCode === 9) {
				if(keyCode !== 9 && !isTabableElement(event.target)) {
					return;
				}
				
				if(event.shiftKey){
					Z.tabPrev();
				}
				else{
					Z.tabNext();
				}
				event.preventDefault();
	       		event.stopImmediatePropagation();
	       		return false;
			}
		}
		jQuery(document).keydown(handleHostKeyDown);
	}
};

/**
 * Global focus manager.
 * 
 * @member jslet.ui
 * @type {jslet.ui.FocusManager}
 */
jslet.ui.globalFocusManager = new jslet.ui.FocusManager();

/*!
 * jQuery.tabbable 1.0 - Simple utility for selecting the next / previous ':tabbable' element.
 * https://github.com/marklagendijk/jQuery.tabbable
 *
 * Includes ':tabbable' and ':focusable' selectors from jQuery UI Core
 *
 * Copyright 2013, Mark Lagendijk
 * Released under the MIT license
 *
 */

(function($){
	/**
	 * @private
	 * 
	 * Focusses the next :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.focusNext = function(container, isLoop, onChangingFocus){
		selectNextTabbableOrFocusable(':focusable', container, isLoop, onChangingFocus);
	};

	/**
	 * @private
	 * 
	 * Focusses the previous :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.focusPrev = function(container, isLoop, onChangingFocus){
		return selectPrevTabbableOrFocusable(':focusable', container, isLoop, onChangingFocus);
	};

	/**
	 * @private
	 * 
	 * Focusses the next :tabable element.
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.tabNext = function(container, isLoop, onChangingFocus){
		return selectNextTabbableOrFocusable(':tabbable', container, isLoop, onChangingFocus);
	};

	/**
	 * @private
	 * 
	 * Focusses the previous :tabbable element
	 * Does not take into account that the taborder might be different as the :tabbable elements order
	 * (which happens when using tabindexes which are greater than 0).
	 */
	$.tabPrev = function(container, isLoop, onChangingFocus){
		return selectPrevTabbableOrFocusable(':tabbable', container, isLoop, onChangingFocus);
	};

	function selectNextTabbableOrFocusable(selector, container, isLoop, onChangingFocus){
		if(!container) {
			container = document;
		}
		var selectables = jQuery(container).find(selector);
		sortByTabIndex(selectables);
		var current = $(':focus');
		var nextIndex = 0;
		var currEle = null;
		if(current.length === 1){
			currEle = current[0];
			var currentIndex = selectables.index(current);
			if(currentIndex + 1 < selectables.length){
				nextIndex = currentIndex + 1;
			} else {
				if(isLoop) {
					nextIndex = 0;
				}
			}
		}

		var canFocus = true;
		if(onChangingFocus && currEle) {
			canFocus = onChangingFocus(currEle, false);
		}
		if(canFocus) {
			var jqEl = selectables.eq(nextIndex);
			jqEl.focus();
			return jqEl[0];
		} else {
			return currEle;
		}
	}

	function selectPrevTabbableOrFocusable(selector, container, isLoop, onChangingFocus){
		if(!container) {
			container = document;
		}
		var selectables = jQuery(container).find(selector);
		sortByTabIndex(selectables);
		var current = $(':focus');
		var prevIndex = selectables.length - 1;
		var currEle = null;
		if(current.length === 1){
			currEle = current[0];
			var currentIndex = selectables.index(current);
			if(currentIndex > 0){
				prevIndex = currentIndex - 1;
			} else {
				if(isLoop) {
					prevIndex = selectables.length - 1;
				}
			}
		}

		var canFocus = true;
		if(onChangingFocus && currEle) {
			canFocus = onChangingFocus(currEle, true);
		}
		if(canFocus) {
			var jqEl = selectables.eq(prevIndex);
			jqEl.focus();
			return jqEl[0];
		} else {
			return currEle;
		}
	}

	function sortByTabIndex(items) {
		if(!items) {
			return;
		}
		
		var item, item1, k;
		for(var i = 1, len = items.length; i < len; i++) {
			item = items[i];
			k = 0;
			for(var j = i - 1; j >= 0; j--) {
				item1 = items[j];
				if(item1.tabIndex <= item.tabIndex) {
					k = j + 1;
					break;
				}
			} //end for j
			if(i !== k) {
				items.splice(i, 1);
				items.splice(k, 0, item);
			}
		} //end for i
	}
	
	/*
	 * :focusable and :tabbable, both taken from jQuery UI Core
	 */
	$.extend($.expr[ ':' ], {
		data: $.expr.createPseudo ?
			$.expr.createPseudo(function(dataName){
				return function(elem){
					return !!$.data(elem, dataName);
				};
			}) :
			// support: jQuery <1.8
			function(elem, i, match){
				return !!$.data(elem, match[ 3 ]);
			},

		focusable: function(element){
			return focusable(element, !isNaN($.attr(element, 'tabindex')));
		},

		tabbable: function(element){
			var tabIndex = $.attr(element, 'tabindex'),
				isTabIndexNaN = isNaN(tabIndex);
			return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
		}
	});

	/**
	 * @private
	 * 
	 * Focusable function, taken from jQuery UI Core
	 * @param element
	 * @returns {*}
	 */
	function focusable(element){
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase(),
			isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));
		if('area' === nodeName){
			map = element.parentNode;
			mapName = map.name;
			if(!element.href || !mapName || map.nodeName.toLowerCase() !== 'map'){
				return false;
			}
			img = $('img[usemap=#' + mapName + ']')[0];
			return !!img && visible(img);
		}
		return ( /input|select|textarea/.test(nodeName) ?
			!element.disabled :
			'a' === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible(element);

		function visible(element){
			return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function(){
				return $.css(this, 'visibility') === 'hidden';
			}).length;
		}
	}
})(jQuery);

/**
* @class
* Message bus. Example:
* 
*     @example
*     var myCtrlObj = {onReceiveMessage: function(messageName, messageBody){alert(messageBody.x);}};
*     
*     jslet.messageBus.subcribe('MyMessage', myCtrlObj); //Subcribe a message from MessageBus
*     
*     jslet.messageBus.unsubcribe('MyMessage', myCtrlObj); //Unsubcribe a message from MessageBus
*     
*     jslet.messageBus.sendMessage('MyMessage', {x: 10, y:10}); //Send a mesasge to MessageBus
* 
*/
jslet.MessageBus = function () {
	var _messages = {};
	//SizeChanged is predefined message
	_messages[jslet.MessageBus.SIZECHANGED] = [];
	
	var _timeoutHandlers = [];
	/**
	 * Send a message.
	 * 
	 * @param {String} messageName Message name.
	 * @param {Object} mesageBody Message body.
	 */
	this.sendMessage = function (messageName, messageBody, sender) {
		if(!_messages[messageName]) {
			return;
		}
		var handler = _timeoutHandlers[messageName];
		
		if (handler){
			window.clearTimeout(handler);
		}
		handler = setTimeout(function(){
			_timeoutHandlers[messageName] = null;
			var ctrls = _messages[messageName], ctrl;
			for(var i = 0, cnt = ctrls.length; i < cnt; i++){
				ctrl = ctrls[i];
				if (ctrl && ctrl.onReceiveMessage){
					ctrl.onReceiveMessage(messageName, messageBody);
				}
			}
		}, 30);
		_timeoutHandlers[messageName] = handler;
	};

	/**
	* Subscribe a message.
	* 
	* @param {String} messageName message name.
	* @param {Object} ctrlObj control object which need subscribe a message.<br /> 
	*   there must be a function: onReceiveMessage in ctrlObj.<br />
	*	onReceiveMessage: function(messageName, messageBody){}<br />
	*   //messageName: String, message name;<br />
	*   //messageBody: Object, message body;<br />
	*/
	this.subscribe = function(messageName, ctrlObj){
		if (!messageName || !ctrlObj) {
			throw new Error("MessageName and ctrlObj required!");
		}
		var ctrls = _messages[messageName];
		if (!ctrls){
			ctrls = [];
			_messages[messageName] = ctrls;
		}
		ctrls.push(ctrlObj);
	};
	
	/**
	 * Subscribe a message.
	 * 
	 * @param {String} messageName message name.
	 * @param {Object} ctrlObj control object which need subscribe a message.
	 */
	this.unsubscribe = function(messageName, ctrlObj){
		var ctrls = _messages[messageName];
		if (!ctrls) {
			return;
		}
		var k = ctrls.indexOf(ctrlObj);
		if (k >= 0) {
			ctrls.splice(k,1);
		}
	};
};

jslet.MessageBus.SIZECHANGED = "SIZECHANGED";

jslet.messageBus = new jslet.MessageBus();

jQuery(window).on("resize",function(){
	jslet.messageBus.sendMessage(jslet.MessageBus.SIZECHANGED, null, window);
});

/**
 * @class
 * 
 * Resize event bus, manage all resize event. Example:
 * 
 *     @example
 *     var myCtrlObj = {
 *       checkSizeChanged: function(){}
 *     }
 *
 *     //Subcribe a message from MessageBus
 *     jslet.resizeEventBus.subcribe(myCtrlObj);
 *
 *     //Unsubcribe a message from MessageBus
 *     jslet.resizeEventBus.unsubcribe(myCtrlObj);
 * 
 *     //Send a mesasge to MessageBus
 *     jslet.resizeEventBus.sendMessage('MyMessage', {x: 10, y:10});
 * 
 */
jslet.ui.ResizeEventBus = function () {
	
	var handler = null;
	
	function getResizableChild(sender, childElements) {
		if(!sender) {
			sender = document.body;
		}
		var children = sender.children;
		if(!children) {
			return;
		}
		var child;
		for(var i = 0, len = children.length; i < len; i++) {
			child = children[i];
			if(child.getAttribute(jslet.ui.ResizeEventBus.RESIZABLE)) {
				childElements.push(child);
				continue;
			}
			if(child.children) {
				getResizableChild(child, childElements);
			}
		}
	}
	
	/**
	 * Fire a "resize" message.
	 * 
	 * @param {HtmlElement} sender Sender which sends the "resize" event.
	 */
	this.resize = function (sender) {
		var ctrls = [];
		getResizableChild(sender, ctrls);
		var ctrl, jsletCtrl;
		if(jslet.ui._activePopup) {
			jslet.ui._activePopup.hide();
		}
		for(var i = 0, cnt = ctrls.length; i < cnt; i++){
			ctrl = ctrls[i];
			if (ctrl){
				jsletCtrl = ctrl.jslet;
				if (jsletCtrl && jsletCtrl.checkSizeChanged){
					jsletCtrl.checkSizeChanged();
				}
			}
		}
	};

	this._bodyResize = jslet.debounce(this.resize, 100);
	
	/**
	 * Subscribe a control to response a resize event. Example:
	 * 
	 *     @example
	 *     var uiCtrl = {
	 *       checkSizeChanged: function() {}
	 *     };
	 * 
	 *     jslet.ui.resizeEventBus.subscribe(uiCtrl);
	 * 
	 * @param {Object} ctrlObj Control object which need subscribe a message, there must be a function: checkSizeChanged in ctrlObj.
	 */
	this.subscribe = function(ctrlObj) {
		if (!ctrlObj || !ctrlObj.el) {
			throw new Error("ctrlObj required!");
		}
		if(!ctrlObj.checkSizeChanged || !jQuery.isFunction(ctrlObj.checkSizeChanged)) {
			throw new Error('subscribe#ctrlObj must have a method named: "checkSizeChanged"!');
		}
		jQuery(ctrlObj.el).attr(jslet.ui.ResizeEventBus.RESIZABLE, true);
		var p = ctrlObj.el.parentNode;
		while(p) {
			if(jQuery(p).attr(jslet.ui.ResizeEventBus.RESIZABLE)) {
				break;
			}
			p = p.parentNode;
		}
	};
	
	/**
	 * Unsubscribe a control to response a resize event.
	 * 
	 * @param {Object} ctrlObj control object which need subscribe a message.
	 */
	this.unsubscribe = function(ctrlObj){
		if (!ctrlObj || !ctrlObj.el) {
			throw new Error("ctrlObj required!");
		}
		jQuery(ctrlObj.el).removeAttr(jslet.ui.ResizeEventBus.RESIZABLE);
	};
	
};

jslet.ui.ResizeEventBus.RESIZABLE = "data-jslet-resizable";

/**
 * Global resize event bus object.
 * 
 * @member jslet.ui
 * @type {jslet.ui.ResizeEventBus}
 */
jslet.ui.resizeEventBus = new jslet.ui.ResizeEventBus();

jQuery(window).on("resize",function(){
	jslet.ui.resizeEventBus._bodyResize();
});

jslet.ui.htmlclass = {};
jslet.ui.GlobalZIndex = 100;

/**
 * @enum
 * 
 * Key code.
 */
jslet.ui.KeyCode = {
	BACKSPACE: 8, 
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CONTROL: 17,
	ALT: 18,

	CAPSLOCK: 20,
	ESCAPE: 27,
	SPACE: 32,
	PAGEUP: 33,
	PAGEDOWN: 34,
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	
	INSERT: 45,
	DELETE: 46,

	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,

	IME: 229
};

for(var i = 65; i < 90; i++) {
	jslet.ui.KeyCode[String.fromCharCode(i)] = i;
}

/**
 * @method
 * @member jslet.ui
 * 
 * Get the specified level parent element. Example:
 * 
 *     @example
 *     //html snippet is: body -> div1 -> div2 ->table
 *     jslet.ui.getParentElement(div2); // return div1
 *     jslet.ui.getParentElement(div2, 2); //return body 
 * 
 * @param {HtmlElement} htmlElement HTML element.
 * @param {Integer} level level
 * 
 * @return {HtmlElement} Parent element, if not found, return null.
 */
jslet.ui.getParentElement = function (htmlElement, level) {
	if (!level) {
		level = 1;
	}
	var flag = htmlElement.parentElement ? true : false,
	result = htmlElement;
	for (var i = 0; i < level; i++) {
		if (flag) {
			result = result.parentElement;
		} else {
			result = result.parentNode;
		}
		if (!result) {
			return null;
		}
	}
	return result;
};

/**
 * @private
 * 
 * Find first parent with specified condition. Example:
 * 
 *      @example
 *      //Html snippet: body ->div1 ->div2 -> div3
 *	   var odiv = jslet.ui.findFirstParent(
 *		  odiv3, 
 *		  function (node) {return node.class == 'head';},
 *		  function (node) {return node.tagName != 'BODY'}
 *       );
 * 
 * @member jslet.ui
 * 
 * @param {HtmlElement} element The start checking html element.
 * @param {Function} startConditionFn Callback function.
 * @param {HtmlElement} startConditionFn.node: function(node}{...}, node is html element;
 * @param {Boolean} startConditionFn.return True - Start to get parent node, false - otherwise. 
 * @param {Function} stopConditionFn Callback function.
 * @param {HtmlElement} stopConditionFn.node: function(node}{...}, node is html element;
 * @param {Boolean} startConditionFn.return True - End to get parent node, false - otherwise. 
 * 
 * @return {HtmlElement} Parent element or null.
 */
jslet.ui.findFirstParent = function (htmlElement, conditionFn, stopConditionFn) {
	var p = htmlElement;
	if (!p) {
		return null;
	}
	if (!conditionFn) {
		return p.parentNode;
	}
	if (conditionFn(p)) {
		return p;
	} else {
		if (stopConditionFn && stopConditionFn(p.parentNode)) {
			return null;
		}
		return jslet.ui.findFirstParent(p.parentNode, conditionFn, stopConditionFn);
	}
};

/**
 * @private
 * 
 * Find parent element that has 'jslet' property.
 * 
 * @member jslet.ui
 * 
 * @param {HtmlElement} element The start checking html element.
 * 
 * @return {HtmlElement} Parent element or null.
 */
jslet.ui.findJsletParent = function(element){
	return jslet.ui.findFirstParent(element, function(ele){
		return ele.jslet ? true:false; 
	});
};

/**
 * @private
 * 
 * Check one node is a child of another node or not.
 * 
 * @member jslet.ui
 * 
 * @param {HtmlElement} parentNode parent node.
 * @param {HtmlElement} testNode, testing node.
 * 
 * @return {Boolean} true - 'testNode' is a child of 'parentNode', false - otherwise.
 */
jslet.ui.isChild = function(parentNode, testNode) {
	if(!parentNode || !testNode) {
		return false;
	}
	var p = testNode;
	while(p) {
		if(p == parentNode) {
			return true;
		}
		p = p.parentNode;
	}
	return false;
};

/**
 * @class
 * 
 * Text Measurer, measure the display width or height of the given text. Example:
 * 
 *     @example
 *     jslet.ui.textMeasurer.setElement(document.body);
 *     try{
 *       var width = jslet.ui.textMeasurer.getWidth('HellowWorld');
 *       var height = jslet.ui.textMeasurer.getHeight('HellowWorld');
 *     }finally{
 *       jslet.ui.textMeasurer.setElement();
 *     }
 * 
 */
jslet.ui.TextMeasurer = function () {
	var rule,felement = document.body,felementWidth;

	var lastText = null;
	
	var createRule = function () {
		if (!rule) {
			rule = document.createElement('div');
			document.body.appendChild(rule);
			rule.style.position = 'absolute';
			rule.style.left = '-9999px';
			rule.style.top = '-9999px';
			rule.style.display = 'none';
			rule.style.margin = '0px';
			rule.style.padding = '0px';
			rule.style.overflow = 'hidden';
		}
		if (!felement) {
			felement = document.body;
		}
	};

	/**
	 * Set HTML element which to be used to merge. 
	 * 
	 * @param {HtmlElement} element.
	 */
	this.setElement = function (element) {
		felement = element;
		if (!felement) {
			return;
		}
		createRule();
		rule.style.fontSize = felement.style.fontSize;
		rule.style.fontStyle = felement.style.fontStyle;
		rule.style.fontWeight = felement.style.fontWeight;
		rule.style.fontFamily = felement.style.fontFamily;
		rule.style.lineHeight = felement.style.lineHeight;
		rule.style.textTransform = felement.style.textTransform;
		rule.style.letterSpacing = felement.style.letterSpacing;
	};

	this.setElementWidth = function (width) {
		felementWidth = width;
		if (!felement) {
			return;
		}
		if (width) {
			felement.style.width = width;
		} else {
			felement.style.width = '';
		}
	};

	function updateText(text){
		if (lastText != text) {
			rule.innerHTML = text;
		}
	}
	
	/**
	 * Get the display size of specified text.
	 * 
	 * @param {String} text The text to be measured.
	 * 
	 * @return {Integer} Display size, unit: px.
	 */
	this.getSize = function (text) {
		createRule();
		updateText(text);
		var ruleObj = jQuery(rule);
		return {width:ruleObj.width(),height:ruleObj.height()};
	};

	/**
	 * Get the display width of specified text.
	 * 
	 * @param {String} text The text to be measured.
	 * 
	 * @return {Integer} Display width, unit: px.
	 */
	this.getWidth = function (text) {
		return this.getSize(text).width;
	};

	/**
	 * Get the display height of specified text.
	 * 
	 * @param {String} text The text to be measured.
	 * 
	 * @return {Integer} Display height, unit: px.
	 */
	this.getHeight = function (text) {
		return this.getSize(text).height;
	};
};

/**
 * Text measurer. Example:
 * 
 *     @example
 *     jslet.ui.textMeasurer.setElement(document.body);
 *     try{
 *       var width = jslet.ui.textMeasurer.getWidth('HellowWorld');
 *       var height = jslet.ui.textMeasurer.getHeight('HellowWorld');
 *     }finally{
 *       jslet.ui.textMeasurer.setElement();
 *     }

 * @type {jslet.ui.TextMeasurer}
 * 
 * @member jslet.ui
 */
jslet.ui.textMeasurer = new jslet.ui.TextMeasurer();

/**
 * Get css property value. Example:
 * 
 *     @example
 *     var width = jslet.ui.getCssValue('fooClass', 'width'); //Return value like '100px' or '200em'
 * 
 * @member jslet.ui
 * 
 * @param {String} className Css class name.
 * @param {String} styleName style name
 * 
 * @return {String} Css property value.
 */
jslet.ui.getCssValue = function(className, styleName){
	var odiv = document.createElement('div');
	odiv.className = className;
	odiv.style.display = 'none';
	document.body.appendChild(odiv);
	var result = jQuery(odiv).css(styleName);
	
	document.body.removeChild(odiv);
	return result;
};

jslet.ui.setEditableStyle = function(formElement, disabled, readOnly, onlySetStyle, required) {
	if(!onlySetStyle) {
		formElement.disabled = disabled;
		formElement.readOnly = readOnly;
	}
	var jqEl = jQuery(formElement);
	if(disabled || readOnly) {
		if (!jqEl.hasClass('jl-readonly')) {
			jqEl.addClass('jl-readonly');
			jqEl.removeClass('jl-ctrl-required');
		}
	} else {
		jqEl.removeClass('jl-readonly');
		if(required) {
			jqEl.addClass('jl-ctrl-required');
		}
	}
};

/**
 * Get system scroll bar width.
 * 
 * @member jslet.ui
 * 
 * @return {Integer} scroll bar width.
 */
jslet.ui.scrollbarSize = function() {
	var parent, child, width, height;

	if (width === undefined) {
		parent = jQuery('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
		child = parent.children();
		width = child.innerWidth() - child.height(99).innerWidth();
		parent.remove();
	}

	return width;
};

/*
 * getStyleObject Plugin for jQuery JavaScript Library
 * From: http://upshots.org/?p=112
 *
 * Copyright: Unknown, see source link
 * Plugin version by Dakota Schneider (http://hackthetruth.org)
 */
(function($){
    $.fn.getStyleObject = function(){
        var dom = this.get(0);
        var style, prop;
        var returns = {};
        if(window.getComputedStyle){
            var camelize = function(a,b){
                return b.toUpperCase();
            };
            style = window.getComputedStyle(dom, null);
            for(var i=0;i<style.length;i++){
                prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                returns[camel] = val;
            }
            return returns;
        }
        if(dom.currentStyle){
            style = dom.currentStyle;
            for(prop in style){
                returns[prop] = style[prop];
            }
            return returns;
        }
        return this.css();
    };
})(jQuery);

jslet.Clipboard = function() {
	var doc = window.document;
	var clipboard = doc.getElementById('jsletClipboard');
	if(!clipboard) {
		jQuery('<textarea id="jsletClipboard" style="position:absolute;top:-1000px" tabindex="-1"></textarea>').appendTo(doc.body);
	
	    window.addEventListener('copy', function (event) {
	        var text = jQuery('#jsletClipboard').val();
	        if(text) {
		        if(event.clipboardData) {
		        	event.clipboardData.setData('text/plain', text);
		        } else {
		        	window.clipboardData.setData('text', text);
		        }
		        jQuery('#jsletClipboard').val(null);
		        event.preventDefault();
		        return false;
	        }
	    });
	}
};

jslet.Clipboard.putText = function(text) {
	var clipboard = jQuery('#jsletClipboard').val(text);
	clipboard[0].select();
};

jslet.Clipboard();

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * Calendar. Example:
 * 
 *     @example
 *     //1. Declaring:
 *       <div data-jslet='type:"Calendar"' />
 *
 *     //2. Binding
 *       <div id='ctrlId' />
 *       //js snippet 
 *       var el = document.getElementById('ctrlId');
 *       jslet.ui.bindControl(el, {type:"Calendar"});
 *	
 *     //3. Create dynamically
 *       jslet.ui.createControl({type:"Calendar"}, document.body);
 */
jslet.ui.Calendar = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,value,onDateSelected,minDate,maxDate';

		Z._value = null;
		
		Z._onDateSelected = null;
		
		Z._minDate = null;

		Z._maxDate = null;
		
		Z._currYear = 0;
		Z._currMonth = 0;
		Z._currDate = 0;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Calendar value.
	 * 
	 * @param {Date | undefined} value calendar value.
	 * 
	 * @return {this | Date}
	 */
	value: function(value) {
		if(value === undefined) {
			return this._value;
		}
		jslet.Checker.test('Calendar.value', value).isDate();
		this._value = value;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get minimum date of calendar range.
	 * 
	 * @param {Date | undefined} minDate Minimum date of calendar range.
	 * 
	 * @return {this | Date}
	 */
	minDate: function(minDate) {
		if(minDate === undefined) {
			return this._minDate;
		}
		jslet.Checker.test('Calendar.minDate', minDate).isDate();
		this._minDate = minDate;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get maximum date of calendar range.
	 * 
	 * @param {Date | undefined} maxDate Maximum date of calendar range.
	 * 
	 * @return {this | Date}
	 */
	maxDate: function(maxDate) {
		if(maxDate === undefined) {
			return this._maxDate;
		}
		jslet.Checker.test('Calendar.maxDate', maxDate).isDate();
		this._maxDate = maxDate;
		return this;
	},
		
	/**
	 * @event
	 * 
	 * Fired when user select a date. Example:
	 * 
	 *     @example
	 *     calendar.onDateSelected(function(value){});
	 *
	 * @param {Function | undefined} onDateSelected Date selected event handler.
	 * @param {Date} onDateSelected.value Calendar value.
	 * 
	 * @return {this | Function}
	 */
	onDateSelected: function(onDateSelected) {
		if(onDateSelected === undefined) {
			return this._onDateSelected;
		}
		jslet.Checker.test('Calendar.onDateSelected', onDateSelected).isFunction();
		this._onDateSelected = onDateSelected;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-calendar')) {
			jqEl.addClass('jl-calendar panel panel-default');
		}
		var calendarLocale = jsletlocale.Calendar;
		var template = ['<div class="jl-cal-header">',
			'<a class="jl-cal-btn jl-cal-yprev" title="', calendarLocale.yearPrev,
			'" href="javascript:;">&lt;&lt;</a><a href="javascript:;" class="jl-cal-btn jl-cal-mprev" title="', calendarLocale.monthPrev, '">&lt;',
			'</a><a href="javascript:;" class="jl-cal-title"></a><a href="javascript:;" class="jl-cal-btn jl-cal-mnext" title="', calendarLocale.monthNext, '">&gt;',
			'</a><a href="javascript:;" class="jl-cal-btn jl-cal-ynext" title="', calendarLocale.yearNext, '">&gt;&gt;</a>',
		'</div>',
		'<div class="jl-cal-body">',
			'<table cellpadding="0" cellspacing="0">',
				'<thead><tr><th class="jl-cal-weekend">',
				calendarLocale.Sun,
					'</th><th>',
					calendarLocale.Mon,
						'</th><th>',
					calendarLocale.Tue,
						'</th><th>',
					calendarLocale.Wed,
						'</th><th>',
					calendarLocale.Thu,
						'</th><th>',
					calendarLocale.Fri,
						'</th><th class="jl-cal-weekend">',
					calendarLocale.Sat,
						'</th></tr></thead><tbody>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'</tbody></table></div><div class="jl-cal-footer"><a class="jl-cal-today" href="javascript:;">', calendarLocale.today, '</a></div>'];

		jqEl.html(template.join(''));
		var jqTable = jqEl.find('.jl-cal-body table');
		Z._currYear = -1;
		jqTable.on('click', Z._doTableClick);
		
		var dvalue = Z._value && jslet.isDate(Z._value) ? Z._value : new Date();
		this.setValue(dvalue);
		jqEl.find('.jl-cal-today').click(function (event) {
			var d = new Date();
			Z.setValue(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
			Z._fireSelectedEvent();
		});
		
		jqEl.find('.jl-cal-yprev').click(function (event) {
			Z.incYear(-1);
		});
		
		jqEl.find('.jl-cal-mprev').click(function (event) {
			Z.incMonth(-1);
		});
		
		jqEl.find('.jl-cal-ynext').click(function (event) {
			Z.incYear(1);
		});
		
		jqEl.find('.jl-cal-mnext').click(function (event) {
			Z.incMonth(1);
		});
		
		jqEl.on('keydown', function(event){
			var ctrlKey = event.ctrlKey,
				keyCode = event.keyCode;
			var delta = 0;
			if(keyCode == jslet.ui.KeyCode.UP) {
				if(ctrlKey) {
					Z.incYear(-1);
				} else {
					Z.incDate(-7);
				}
				event.preventDefault();
				return;
			} 
			if(keyCode == jslet.ui.KeyCode.DOWN) {
				if(ctrlKey) {
					Z.incYear(1);
				} else {
					Z.incDate(7);
				}
				event.preventDefault();
				return;
			}
			if(keyCode == jslet.ui.KeyCode.LEFT) {
				if(ctrlKey) {
					Z.incMonth(-1);
				} else {
					Z.incDate(-1);
				}
				event.preventDefault();
				return;
			}
			if(keyCode == jslet.ui.KeyCode.RIGHT) {
				if(ctrlKey) {
					Z.incMonth(1);
				} else {
					Z.incDate(1);
				}
				event.preventDefault();
				return;
			}
		});
	},
	
	_getNotNullDate: function() {
		var value =this._value;
		if(!value) {
			value = new Date();
		}
		return value;
	},
	
	incDate: function(deltaDay) {
		var value = this._getNotNullDate();
		value.setDate(value.getDate() + deltaDay);
		this.setValue(value);
	},
	
	incMonth: function(deltaMonth) {
		var value = this._getNotNullDate(),
			oldDate = value.getDate();
		value.setMonth(value.getMonth() + deltaMonth);
		if(oldDate >=29) {
			var newDate = value.getDate();
			if(oldDate != newDate) {
				value = new Date(value.getFullYear(), value.getMonth(), 1) - 24*3600*1000;
				value = new Date(value);
			}
		}
		this.setValue(value);
	},
	
	incYear: function(deltaYear) {
		var value = this._getNotNullDate(),
			oldDate = value.getDate();
		value.setFullYear(value.getFullYear() + deltaYear);
		if(oldDate >=29) {
			var newDate = value.getDate();
			if(oldDate != newDate) {
				value = new Date(value.getFullYear(), value.getMonth(), 1) - 24*3600*1000;
				value = new Date(value);
			}
		}
		this.setValue(value);
	},
	
	_innerSetValue: function(value) {
		var Z = this,
			oldValue = Z._getNotNullDate();
		if(value) { //Overwrite Year/Month/Date part, keep time part.
			oldValue.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
		}
		Z._value = oldValue;
	},
	
	/**
	 * Set date value of calendar.
	 * 
	 * @param {Date} value Calendar date.
	 */
	setValue: function (value) {
		if (!value) {
			return;
		}

		var Z = this;
		if (Z._minDate && value < Z._minDate) {
			value = new Date(Z._minDate.getTime());
		}
		if (Z._maxDate && value > Z._maxDate) {
			value = new Date(Z._maxDate.getTime());
		}
		Z._innerSetValue(value);
		var y = value.getFullYear(), 
			m = value.getMonth();
		if (Z._currYear == y && Z._currMonth == m) {
			Z._setCurrDateCls();
		} else {
			Z._refreshDateCell(y, m);
		}
	},

	/**
	 * @override.
	 */
	focus: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		jqEl.find('.jl-cal-current')[0].focus();
	},
	
	_checkNaviState: function () {
		var Z = this,
			jqEl = jQuery(Z.el), flag, btnToday;
		if (Z._minDate) {
			var minY = Z._minDate.getFullYear(),
				minM = Z._minDate.getMonth(),
				btnYearPrev = jqEl.find('.jl-cal-yprev')[0];
			flag = (Z._currYear <= minY);
			btnYearPrev.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._currYear == minY && Z._currMonth <= minM);
			var btnMonthPrev = jqEl.find('.jl-cal-mprev')[0];
			btnMonthPrev.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._minDate > new Date());
			btnToday = jqEl.find('.jl-cal-today')[0];
			btnToday.style.visibility = (flag ? 'hidden' : 'visible');
		}

		if (Z._maxDate) {
			var maxY = Z._maxDate.getFullYear(),
				maxM = Z._maxDate.getMonth(),
				btnYearNext = jqEl.find('.jl-cal-ynext')[0];
			flag = (Z._currYear >= maxY);
			btnYearNext.jslet_disabled = flag;
			btnYearNext.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._currYear == maxY && Z._currMonth >= maxM);
			var btnMonthNext = jqEl.find('.jl-cal-mnext')[0];
			btnMonthNext.jslet_disabled = flag;
			btnMonthNext.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._maxDate < new Date());
			btnToday = jqEl.find('.jl-cal-today')[0];
			btnToday.style.visibility = (flag ? 'hidden' : 'visible');
		}
	},

	_refreshDateCell: function (year, month) {
		var Z = this,
			jqEl = jQuery(Z.el),
			monthnames = jsletlocale.Calendar.monthNames,
			mname = monthnames[month],
			otitle = jqEl.find('.jl-cal-title')[0];
		otitle.innerHTML = mname + ',' + year;
		var otable = jqEl.find('.jl-cal-body table')[0],
			rows = otable.tBodies[0].rows,
			firstDay = new Date(year, month, 1),
			w1 = firstDay.getDay(),
			oneDayMs = 86400000, //24 * 60 * 60 * 1000
			date = new Date(firstDay.getTime() - (w1 + 1) * oneDayMs);
		date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		var rowCnt = rows.length, otr, otd, m, oa;
		for (var i = 1; i <= rowCnt; i++) {
			otr = rows[i - 1];
			for (var j = 1, tdCnt = otr.cells.length; j <= tdCnt; j++) {
				otd = otr.cells[j - 1];
				date = new Date(date.getTime() + oneDayMs);
				oa = otd.firstChild;
				if (Z._minDate && date < Z._minDate || Z._maxDate && date > Z._maxDate) {
					oa.innerHTML = '';
					otd.jslet_date_value = null;
					continue;
				} else {
					oa.innerHTML = date.getDate();
					otd.jslet_date_value = date;
				}
				m = date.getMonth();
				if (m != month) {
					jQuery(otd).addClass('jl-cal-disable');
				} else {
					jQuery(otd).removeClass('jl-cal-disable');
				}
			} //end for j
		} //end for i
		Z._currYear = year;
		Z._currMonth = month;
		Z._setCurrDateCls();
		Z._checkNaviState();
	},
	
	_fireSelectedEvent: function() {
		var Z = this;
		if (Z._onDateSelected) {
			Z._onDateSelected.call(Z, Z._value);
		}
	},
	
	_doTableClick: function (event) {
		event = jQuery.event.fix( event || window.event );
		var node = event.target,
			otd = node.parentNode;
		
		if (otd && otd.tagName && otd.tagName.toLowerCase() == 'td') {
			if (!otd.jslet_date_value) {
				return;
			}
			var el = jslet.ui.findFirstParent(otd, function (node) { return node.jslet; });
			var Z = el.jslet;
			Z._innerSetValue(otd.jslet_date_value);
			Z._setCurrDateCls();
			try{
				otd.firstChild.focus();
			}catch(e){
			}
			Z._fireSelectedEvent();
		}
	},

	_setCurrDateCls: function () {
		var Z = this;
		if (!jslet.isDate(Z._value)) {
			return;
		}
		var currM = Z._value.getMonth(),
			currY = Z._value.getFullYear(),
			currD = Z._value.getDate(),
			jqEl = jQuery(Z.el),
			otable = jqEl.find('.jl-cal-body table')[0],
			rows = otable.tBodies[0].rows,
			rowCnt = rows.length, otr, otd, m, d, y, date, jqLink;
		for (var i = 0; i < rowCnt; i++) {
			otr = rows[i];
			for (var j = 0, tdCnt = otr.cells.length; j < tdCnt; j++) {
				otd = otr.cells[j];
				date = otd.jslet_date_value;
				if (!date) {
					continue;
				}
				m = date.getMonth();
				y = date.getFullYear();
				d = date.getDate();
				jqLink = jQuery(otd.firstChild);
				if (y == currY && m == currM && d == currD) {
					if (!jqLink.hasClass('jl-cal-current')) {
						jqLink.addClass('jl-cal-current');
					}
					try{
						otd.firstChild.focus();
					} catch(e){
					}
				} else {
					jqLink.removeClass('jl-cal-current');
				}
			}
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.off();
		jqEl.find('.jl-cal-body table').off();
		jqEl.find('.jl-cal-today').off();
		jqEl.find('.jl-cal-yprev').off();
		jqEl.find('.jl-cal-mprev').off();
		jqEl.find('.jl-cal-mnext').off();
		jqEl.find('.jl-cal-ynext').off();
		$super();
	}
});
jslet.ui.register('Calendar', jslet.ui.Calendar);
jslet.ui.Calendar.htmlTemplate = '<div></div>';

/**
* @class
* 
* MessageBox, it can be used to display info, warn, error, confirm, prompt dialog.
*/
jslet.ui.MessageBox = function () {

	/**
	 * Show message box.
	 * 
	 * @param {String} message Message text.
	 * @param {String} caption Caption text.
	 * @param {String} iconClass Caption icon class.
	 * @param {String[]} buttons Array of button names, it's the subset of array ['ok','cancel', 'yes', 'no'], like : ['ok','cancel'].
	 * @param {Function} callbackFn Callback function when user click one button. 
	 * @param {String} callbackFn.button Button name which clicked, optional value: ok, cancel, yes, no. 
	 * @param {String} callbackFn.value Text which user inputted. 
	 * @param {Integer} hasInput Value inputting flag, options: 0 - none, 1 - single line input, 2 - multiple line input.
	 * @param {String} defaultValue The default value of Input element, if 'hasInput' = 0, this argument is be ignored.
	 * @param {Function} validateFn Validate function of input element, if 'hasInput' = 0, this argument is be ignored.
	 * @param {String} validateFn.value The value which need to be validated, if 'hasInput' = 0, this argument is be ignored.
	 */
	this.show = function (message, caption, iconClass, buttons, callbackFn, hasInput, defaultValue, validateFn) {

		var opt = { type: 'window', caption: caption, isCenter: true, resizable: false, minimizable: false, maximizable: false, stopEventBubbling: true, animation: 'fade'};
		var owin = jslet.ui.createControl(opt);
		var iconHtml = '';
		if (iconClass) {
			iconHtml = '<div class="jl-msg-icon ';
			if (iconClass == 'info' || iconClass == 'error' || iconClass == 'question' || iconClass == 'warning') {
				iconHtml += 'jl-msg-icon-' + iconClass;
			} else {
				iconHtml += iconClass;
			}
			iconHtml += '"><i class="fa ';
			switch (iconClass) {
	            case 'info':
	            	iconHtml += 'fa-info';
	                break;
	            case 'error':
	            	iconHtml += 'fa-times';
	                break;
	            case 'success':
	            	iconHtml += 'fa-check';
	                break;
	            case 'warning':
	            	iconHtml += 'fa-exclamation';
	                break;
	            case 'question':
	            	iconHtml += 'fa-question';
	                break;
	            default :
	            	iconHtml += 'fa-info';
                 	break;
	        }
			iconHtml += '"></i></div>';
		}

		var btnCount = buttons.length;
		var btnHtml = [], btnName, i;
		if (jsletlocale.isRtl){
			for (i = btnCount - 1; i >=0; i--) {
				btnName = buttons[i];
				btnHtml.push('<button class="jl-msg-button btn btn-default btn-xs" ');
				btnHtml.push(' data-jsletname="');
				btnHtml.push(btnName);
				btnHtml.push('">');
				btnHtml.push(jsletlocale.MessageBox[btnName]);
				btnHtml.push('</button>');
			}
		} else {
			for (i = 0; i < btnCount; i++) {
				btnName = buttons[i];
				btnHtml.push('<button class="jl-msg-button btn btn-default btn-xs" ');
				btnHtml.push('" data-jsletname="');
				btnHtml.push(btnName);
				btnHtml.push('">');
				btnHtml.push(jsletlocale.MessageBox[btnName]);
				btnHtml.push('</button>');
			}
		}
		var inputHtml = ['<br />'];
		if (hasInput) {
			if (hasInput == 1) {
				inputHtml.push('<input type="text"');
			} else {
				inputHtml.push('<textarea rows="5"');
			}
			inputHtml.push(' style="width:');
			inputHtml.push('98%"');
			if (defaultValue !== null && defaultValue !== undefined) {
				inputHtml.push(' value="');
				inputHtml.push(defaultValue);
				inputHtml.push('"');
			}
			if (hasInput == 1) {
				inputHtml.push(' />');
			} else {
				inputHtml.push('></textarea>');
			}
		}
		if(message) {
			message = message.replace('\n', '<br />');
		}
		var html = ['<div class="jl-msg-container">', iconHtml, '<div class="' + (hasInput? 'jl-msg-message-noicon': 'jl-msg-message') + '">',
					message, inputHtml.join(''), '</div>', '</div>',
					'<div class="jl-msg-tool"><div>', btnHtml.join(''), '</div></div>'
		];

		owin.setContent(html.join(''));
		var jqEl = jQuery(owin.el);
		var toolBar = jqEl.find('.jl-msg-tool')[0].firstChild;
		var inputCtrl = null;
		if (hasInput == 1) {
			inputCtrl = jqEl.find('.jl-msg-container input')[0];
		} else {
			inputCtrl = jqEl.find('.jl-msg-container textarea')[0];
		}
		
		jQuery(toolBar).on('click', 'button', function(event) {
			var obtn = event.currentTarget;
			var btnName = jQuery(obtn).attr('data-jsletname');
			var value = null;
			if (hasInput && btnName == 'ok') {
				value = inputCtrl.value;
				if (validateFn && !validateFn(value)) {
					inputCtrl.focus();
					return;
				}
			}
			owin.close();
			if (callbackFn) {
				callbackFn(btnName, value);
			}
		});

		owin.showModal();
		owin.setZIndex(99981);
		var k = btnCount - 1;
		if (jsletlocale.isRtl) {
			k = 0;
		}
		if(inputCtrl) {
			inputCtrl.focus();
		} else {
			var toolBtn = toolBar.childNodes[k];
			if(toolBtn) {
				toolBtn.focus();
			}
		}
		return owin;
	};
};

/**
 * Show info message. Example:
 * 
 *     @example
 *     jslet.ui.info('Finished!', 'Tips');
 *     jslet.ui.info('Finished!', 'Tips', function(){console.log('info')});
 *     jslet.ui.info('Finished!', 'Tips', null, 1000); //Auto close after 1 second.
 *     
 * @member jslet.ui
 * 
 * @param {String} message Message text.
 * @param {String} caption Caption text.
 * @param {Function} callbackFn Callback function when user click one button.
 * @param {Integer} timeout Auto close message box after 'timeout'(ms) elapses. 
 */
jslet.ui.info = jslet.ui.alert = function (message, caption, callbackFn, timeout) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jsletlocale.MessageBox.info;
	}
	var owin = omsgBox.show(message, caption, 'info', ['ok'], callbackFn);
	if(timeout) {
		timeout = parseInt(timeout);
		if(!window.isNaN(timeout)) {
			window.setTimeout(function() {
				owin.close();
			}, timeout);
		}
	}
};


/**
 * Show error message. Example:
 * 
 *     @examle
 *     jslet.ui.error('You have made a mistake!', 'Error');
 *     jslet.ui.error('You have made a mistake!', 'Error', function(){console.log('error')});
 *     jslet.ui.error('You have made a mistake!', 'Error', null, 1000); //Auto close after 1 second.
 * 
 * @member jslet.ui
 * 
 * @param {String} message Message text.
 * @param {String} caption Caption text.
 * @param {Function} callbackFn Callback function when user click one button.
 * @param {Integer} timeout Auto close message box after 'timeout'(ms) elapses. 
 */
jslet.ui.error = function (message, caption, callbackFn, timeout) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jsletlocale.MessageBox.error;
	}
	var owin = omsgBox.show(message, caption, 'error', ['ok'], callbackFn);
	if(timeout) {
		timeout = parseInt(timeout);
		if(!window.isNaN(timeout)) {
			window.setTimeout(function() {
				owin.close();
			}, timeout);
		}
	}
};

/**
 * Show warning message. Example:
 * 
 *     @example
 *     jslet.ui.warn('Program will be shut down!', 'Warning');
 *     jslet.ui.warn('Program will be shut down!', 'Warning', function(){console.log('warning')});
 *     jslet.ui.warn('Program will be shut down!', 'Warning', null, 1000); //Auto close after 1 second.
 *     
 * @member jslet.ui
 * 
 * @param {String} message Message text.
 * @param {String} caption Caption text.
 * @param {Function} callbackFn Callback function when user click one button.
 * @param {Integer} timeout Auto close message box after 'timeout'(ms) elapses. 
 */
jslet.ui.warn = function (message, caption, callbackFn, timeout) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jsletlocale.MessageBox.warn;
	}
	var owin = omsgBox.show(message, caption, 'warning', ['ok'], callbackFn);
	if(timeout) {
		timeout = parseInt(timeout);
		if(!window.isNaN(timeout)) {
			window.setTimeout(function() {
				owin.close();
			}, timeout);
		}
	}
};

/**
 * Show confirm message. Example:
 * 
 *     @example
 *     var callbackFn = function(button){
 *       alert('Button: ' + button + ' clicked!');
 *     }
 *     jslet.ui.confirm('Are you sure?', 'Confirm', callbackFn);//show Ok/Cancel
 *     jslet.ui.confirm('Are you sure?', 'Confirm', callbackFn, true);//show Yes/No/Cancel
 * 
 * @member jslet.ui
 * 
 * @param {String} message Message text.
 * @param {String} caption Caption text.
 * @param {Function} callbackFn Callback function when user click one button. 
 * @param {String} callbackFn.button Button name which clicked, optional value: ok, cancel, yes, no. 
 */
jslet.ui.confirm = function(message, caption, callbackFn, isYesNo){
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jsletlocale.MessageBox.confirm;
	}
	if (!isYesNo) {
		omsgBox.show(message, caption, 'question',['ok', 'cancel'], callbackFn);	
	} else {
		omsgBox.show(message, caption, 'question', ['yes', 'no', 'cancel'], callbackFn);
	}
};

/**
 * Prompt user to input some value. Example:
 * 
 *     @example
 *     var callbackFn = function(button, value){
 *       alert('Button: ' + button + ', value:' + value);
 *     };
 *     
 *     var validateFn = function(value){
 *       if (!value){
 *         alert('Please input some thing!');
 *         return false;
 *       }
 *       return true;
 *     };
 *     
 *     jslet.ui.prompt('Input your name: ', 'Prompt', callbackFn, 'Bob', validateFn);
 *     jslet.ui.prompt('Input your comments: ', 'Prompt', callbackFn, null, validateFn, true);
 * 
 * @member jslet.ui
 * 
 * @param {String} message Message text.
 * @param {String} caption Caption text.
 * @param {Function} callbackFn Callback function when user click one button. 
 * @param {String} callbackFn.button Button name which clicked, optional value: ok, cancel, yes, no. 
 * @param {String} callbackFn.value Text which user inputted. 
 * @param {String} defaultValue The default value of Input element, if 'hasInput' = 0, this argument is be ignored.
 * @param {Function} validateFn Validate function of input element, if 'hasInput' = 0, this argument is be ignored.
 * @param {String} validateFn.value The value which need to be validated, if 'hasInput' = 0, this argument is be ignored.
 * @param {Boolean} isMultiLine True - user can input multiple lines text, false - only one line text.
 */
jslet.ui.prompt = function (message, caption, callbackFn, defaultValue, validateFn, isMultiLine) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption && !message) {
		caption = jsletlocale.MessageBox.prompt;
	}
	if (!isMultiLine) {
		omsgBox.show(message, caption, null, ['ok', 'cancel'], callbackFn, 1, defaultValue, validateFn);
	} else {
		omsgBox.show(message, caption, null, ['ok', 'cancel'], callbackFn, 2, defaultValue, validateFn);
	}
};

/**
* @class 
* 
* Overlay panel. Example:
* 
*     @example
*     var overlay = new jslet.ui.OverlayPanel(Z.el.parentNode);
*     overlay.setZIndex(999, '#ddd');
*     overlay.show();
* 
* @param {HtmlElement} container HTML Element that OverlayPanel will cover.
* @param {String} color Color String.
*/
jslet.ui.OverlayPanel = function (container, color) {
	var odiv = document.createElement('div');
	jQuery(odiv).addClass('jl-overlay').on('click', function(event){
		event = jQuery.event.fix( event || window.event );
		var srcEle = event.target;
		if(!jslet.ui.PopupPanel.popupElement.checkAndHide(srcEle)) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
	});
	
	if (color) {
		odiv.style.backgroundColor = color;
	}
	var left, top, width, height;
	if (!container) {
		var jqBody = jQuery(document.body);
		left = 0;
		top = 0;
		width = jqBody.width();
		height = jqBody.height();
	} else {
		width = jQuery(container).width();
		height = jQuery(container).height();
	}
	odiv.style.left = '0px';
	odiv.style.top = '0px';
	odiv.style.bottom = '0px';
	odiv.style.right = '0px';
	if (!container) {
		document.body.appendChild(odiv);
	} else {
		container.appendChild(odiv);
	}
	odiv.style.display = 'none';

	var oldResizeHanlder = null;
	if (!container) {
		oldResizeHanlder = window.onresize;

		window.onresize = function () {
			odiv.style.width = document.body.scrollWidth + 'px';
			odiv.style.height = document.body.scrollHeight + 'px';
		};
	} else {
		oldResizeHanlder = container.onresize;
		container.onresize = function () {
			var width = jQuery(container).width() - 12;
			var height = jQuery(container).height() - 12;
			odiv.style.width = width + 'px';
			odiv.style.height = height + 'px';
		};
	}

	this.overlayPanel = odiv;

	/**
	 * Show overlay panel.
	 */
	this.show = function () {
		odiv.style.display = 'block';
		return odiv;
	};

	/**
	 * Hide overlay panel.
	 */
	this.hide = function () {
		odiv.style.display = 'none';
		return odiv;
	};
	
	/**
	 * Set Z-index.
	 * 
	 * @param {Integer} zIndex Z-Index.
	 */
	this.setZIndex = function(zIndex){
		this.overlayPanel.style.zIndex = zIndex;
	};

	/**
	 * Destroy overlay panel.
	 */
	this.destroy = function () {
		this.hide();
		if (!container) {
			window.onresize = oldResizeHanlder;
			document.body.removeChild(odiv);
		} else {
			container.onresize = oldResizeHanlder;
			container.removeChild(odiv);
		}
		jQuery(this.overlayPanel).off();
	};
};

/**
 * @private
 * @class
 * 
 * Popup Panel. Example: 
 * 
 *     @example
 *     var popPnl = new jslet.ui.PopupPanel();
 *     popPnl.contentElement(document.getElementById('id'));
 *     popPnl.show(10, 10, 100, 100);
 * 
 *     popPnl.hide(); //or
 *     popPnl.destroy();
 *  
 */
jslet.ui.PopupPanel = function (excludedEl) {
	this._onHidePopup = null;
	this._excludedEl = excludedEl;
	this._contentEl = null;
};

jslet.ui.PopupPanel.prototype = {
	/**
	 * Event handler when hide popup panel: function(){}
	 */
	onHidePopup: function(onHidePopup) {
		if(onHidePopup === undefined) {
			return this._onHidePopup;
		}
		this._onHidePopup = onHidePopup;
		return this;
	},
	
	excludedElement: function(excludedEl) {
		if(excludedEl === undefined) {
			return this._excludedEl;
		}
		this._excludedEl = excludedEl;
		return this;
	},
	
	contentElement: function(contentEl) {
		if(contentEl === undefined) {
			return this._contentEl;
		}
		this._contentEl = contentEl;
		return this;
	},
	
	show: function(left, top, width, height, ajustX, ajustY) {
		jslet.ui.PopupPanel.popupElement.show(this, left, top, width, height, ajustX, ajustY);
	},
	
	hide: function() {
		jslet.ui.PopupPanel.popupElement.hide();
	},
	
	destroy: function() {
		this._onHidePopup = null;
		this._excludedEl = null;
		this._contentEl = null;
	}
};

(function () {
	var PopupElement = function() {
		var sharedPopPnl = null;
		var activePopup = null;
		
		var inPopupPanel = function (htmlElement) {
			if (!htmlElement || htmlElement === document) {
				return false;
			}
			if (jQuery(htmlElement).hasClass('jl-popup-panel')) {
				return true;
			} else {
				return inPopupPanel(htmlElement.parentNode);
			}
		};
		var self = this;
		var documentClickHandler = function (event) {
			if(!activePopup) {
				return;
			}
			event = jQuery.event.fix( event || window.event );
			var srcEle = event.target;
			self.checkAndHide(srcEle);
		};
		
		function createPanel() {
			if(sharedPopPnl) {
				return;
			}
			var p = document.createElement('div');
			p.style.display = 'none';
			p.className = 'jl-popup-panel jl-opaque jl-border-box dropdown-menu';
			p.style.position = 'absolute';
			p.style.zIndex = 99000;
			document.body.appendChild(p);
			
			jQuery(document).on('click', documentClickHandler);
			sharedPopPnl = p;
		}
		
		function changeContent(newPopup) {
			var oldContent = sharedPopPnl.childNodes[0];
			if (oldContent) {
				sharedPopPnl.removeChild(oldContent);
			}
			if(newPopup) {
				var content = newPopup.contentElement();
				if(!content) {
					return;
				}
				sharedPopPnl.appendChild(content);
				content.style.border = 'none';
			}
		}
		
		this.show = function(activePop, left, top, width, height, ajustX, ajustY) {
			createPanel();
			if(activePopup !== activePop) {
				this.hide();
				changeContent(activePop);
			}
			activePopup = activePop;
			
			left = parseInt(left);
			top = parseInt(top);
			
			if (height) {
				sharedPopPnl.style.height = parseInt(height) + 'px';
			}
			if (width) {
				sharedPopPnl.style.width = parseInt(width) + 'px';
			}
			var jqWin = jQuery(window),
				winWidth = jqWin.scrollLeft() + jqWin.width(),
				winHeight = jqWin.scrollTop() + jqWin.height(),
				panel = jQuery(sharedPopPnl),
				w = panel.outerWidth(),
				h = panel.outerHeight();
			if (jsletlocale.isRtl) {
				left -= w;
			}
			if(left + w > winWidth) {
				left += winWidth - left - w - 1;
			}
			if(top + h > winHeight) {
				top -= (h + 2 + ajustY);
			}
			if(left < 0) {
				left = 1;
			}
			if(top < 0) {
				top = 1;
			}
			
			if (top) {
				sharedPopPnl.style.top = top + 'px';
			}
			if (left) {
				sharedPopPnl.style.left = left + 'px';
			}
			sharedPopPnl.style.display = 'block';
		};
		
		this.hide = function() {
			if(activePopup) {
				if (sharedPopPnl) {
					sharedPopPnl.style.display = 'none';
				}
				var hideCallBack = activePopup.onHidePopup();
				if(hideCallBack) {
					hideCallBack.call(activePopup);
				}
				activePopup = null;
			}
		};
		
		/**
		 * Check the specified element is in the active popup panel or not. If it is not in the popup panel, hide the popup panel. 
		 */
		this.checkAndHide = function(el) {
			if(!activePopup) {
				return true;
			}
			if (jslet.ui.isChild(activePopup.excludedElement(), el) ||
					inPopupPanel(el)) {
					return false;
			}
			this.hide();
			return true;
		};
		
		this.destroy = function() {
			if(!sharedPopPnl) {
				return;
			}
			document.body.removeChild(sharedPopPnl);
			jQuery(sharedPopPnl).off();
			jQuery(document).off('click', documentClickHandler);
		}; 
	};
	
	jslet.ui.PopupPanel.popupElement = new PopupElement();
})();


/**
 * @class
 * @extend jslet.ui.Control
 * 
 * ProgressBar. Example:
 * 
 *     @example
 *     var jsletParam = {type:"ProgressBar",value:10, labelText: 'Starting...']};
 * 
 *     //1. Declaring:
 *       <div data-jslet='jsletParam' style="width: 300px"></div>
 *  
 *     //2. Binding
 *       <div id='ctrlId'></div>
 *     //Js snippet
 *       var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 *
 */
jslet.ui.ProgressBar = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,value,labelText';

		Z._value = 0;
		
		Z._labelText = '0%';
		
		Z._binded = false;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get progress bar value.
	 * 
	 * @param {Integer | undefined} value Progress bar value.
	 * 
	 * @return {this | Integer}
	 */
	value: function(value) {
		if(value === undefined) {
			return this._value;
		}
		value = parseInt(value);
		if(!value) {
			value = 0;
		}
		if(value < 0) {
			value = 0;
		}
		if(value > 100) {
			value = 100;
		}
		this._value = value;
		this._setValue();
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get progress bar label text.
	 * 
	 * @param {String | undefined} labelText Progress bar label text.
	 * 
	 * @return {this | String}
	 */
	labelText: function(labelText) {
		if(labelText === undefined) {
			return this._labelText;
		}
		this._labelText = labelText;
		if(this._binded) {
			var jqEl = jQuery(this.el);
			var jqLabel = jqEl.find('.jl-progressbar-label');
			jqLabel.text(labelText);
		}
		return this;
	},
		
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
		this._binded = true;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-progressbar')) {
			jqEl.addClass('jl-progressbar jl-border-box jl-round5');
		}
		jqEl.attr('role', 'progressbar').attr('aria-valuemax', '100').attr('aria-valuemin', '0').attr('aria-valuenow', this._value);
		jqEl.html('<div class="jl-progressbar-label">' + Z._labelText + '</div><div class="jl-progressbar-value"></div>');
	},
	
	_setValue: function() {
		var Z = this;
		if(!Z._binded) {
			return;
		}
		var jqEl = jQuery(Z.el);
		var jqLabel = jqEl.find('.jl-progressbar-label');
		var jqValue = jqEl.find('.jl-progressbar-value');
		Z._oldValue = -1;
		var value = Z._value, strValue = value + '%';
		if(value != Z._oldValue) {
			jqLabel.text(strValue);
			jqValue.css('width', strValue);
			jqEl.attr('aria-valuenow', value);
			Z._oldValue = value;
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		$super();
	}
});
jslet.ui.register('ProgressBar', jslet.ui.ProgressBar);
jslet.ui.ProgressBar.htmlTemplate = '<div></div>';

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * ProgressBar. Example:
 * 
 *     @example
 *     var progressObj = jslet.ui.ProgressPopup(document.body, 'saving...');
 *     progressObj.value(40);
 *     progressObj.show();
 *
 * @param {HtmlElement} container The container where the progress popup control show in.
 * @param {String} caption The progress caption.
 * @param {Boolean} cancellable True - the progress popup can be cancelled, false - otherwise.
 * @param {Function} onCancelled The cancelled event, fired when user clicking the close button.
 * 
 */
jslet.ui.ProgressPopup = function(container, caption, cancellable, onCancelled) {
	jslet.Checker.test('ProgressPopus#container', container).isHTMLElement();
	jslet.Checker.test('ProgressPopus#onCancelled', onCancelled).isFunction();
	
	this._dialog = null;
	this._value = 0;
	this._cancellable = false;
	if(cancellable !== undefined) {
		this._cancellable = !!cancellable;
	}
	this._onCancelled = onCancelled;
	
	this.initialize(container || document.body, caption || '');
};

jslet.ui.ProgressPopup.prototype = {
		
	initialize: function(container, caption) {
		var opt = { type: 'window', caption: caption, isCenter: true, resizable: true, minimizable: false, closable: this._cancellable, maximizable: false, 
				width: 500, height: 80, animation: 'fade', onClosed: this._onCancelled};
		var owin = jslet.ui.createControl(opt, container);
		var html = '<div name="progressBar" data-jslet="type: \'ProgressBar\'" style="width: 100%"/>';
		owin.setContent(html);
		this._dialog = owin;
		jslet.ui.install(owin.el);
	},
	
	/**
	 * Show progress popup control.
	 * 
	 * @return {this}
	 */
	show: function() {
		this._dialog.showModal();
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get progress bar value.
	 * 
	 * @param {Integer | undefined} value Progress bar value.
	 * 
	 * @return {this | Integer}
	 */
	value: function(value) {
		if(value === undefined) {
			return this._value;
		}
		value = parseInt(value);
		if(!value) {
			value = 0;
		}
		if(value < 0) {
			value = 0;
		}
		if(value > 100) {
			value = 100;
		}
		this._value = value;
		var progressBar = jQuery(this._dialog.el).find('[name=progressBar]')[0].jslet;
		progressBar.value(value);
	},
	
	/**
	 * Close and destroy the progress popup control.
	 */
	destroy: function(){
		if(this._dialog) {
			this._dialog.close();
			this._dialog = null;
		}
	}
};

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBRating. A control which usually displays some star to user, and user can click to rate something. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBRating",dataset:"employee",field:"grade", itemCount: 5};
 * 
 *     //1. Declaring:
 *      <div data-jslet='type:"DBRating",dataset:"employee",field:"grade"', itemCount: 5' />
 *      or
 *      <div data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.Rating = jslet.Class.create(jslet.ui.DBFieldControl, {
	_isDBControl: false,
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,value,itemCount,splitCount,readOnly';
		
		Z._itemCount = 5;

		Z._splitCount = 0;
		
		Z._itemWidth = 0;
		
		Z._value = 0;
		
		Z._readOnly = false;
		
		Z._isReady = false;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get the rate item count, In other words, the count of 'Star' sign.
	 * 
	 * @param {Integer | undefined} itemCount Rate item count.
	 * 
	 * @return {this | Integer}
	 */
	itemCount: function(itemCount) {
		if(itemCount === undefined) {
			return this._itemCount;
		}
		jslet.Checker.test('DBRating.itemCount', itemCount).isGTZero();
		this._itemCount = parseInt(itemCount);
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get the rating value.
	 * 
	 * @param {Number | undefined} value Rating value.
	 * 
	 * @return {this | Number}
	 */
	value: function(value) {
		if(value === undefined) {
			return this._value;
		}
		jslet.Checker.test('DBRating.value', value).isGTZero();
		this._value = value;
		if(this._isReady) {
			this._setValue(value);
		}
		return this;
	},

	/**
	 * @property
	 * 
	 * Identity whether the rating is read only or not.
	 * 
	 * @param {Boolean | undefined} readOnly True - the rating is read only, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	readOnly: function(readOnly) {
		if(readOnly === undefined) {
			return this._readOnly;
		}
		this._readOnly = readOnly? true: false;
		return this;
	},

	/**
	 * @property
	 * 
	 * Value splitCount for one item. <br />
	 * if "splitCount" is 0.5, the possible value will be 0.5, 1, 1.5, ... <br />
	 * if "splitCount" is 0.25, the possible value will be 0.25, 0.5, 0.75, 1, 1.25, 1.5, ... 
	 * 
	 * @param {Integer | undefined} splitCount 
	 * 
	 * @return {this | Integer}
	 */
	splitCount: function(splitCount) {
		if(splitCount === undefined) {
			return this._splitCount;
		}
		jslet.Checker.test('DBRating.splitCount', splitCount).isGTEZero();
		this._splitCount = splitCount;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-rating')) {
			jqEl.addClass('jl-rating');
		}

		Z.renderAll();
		jqEl.on('mousemove', 'td', jQuery.proxy(Z._mouseMove, Z));
		jqEl.on('mouseleave', jQuery.proxy(Z._mouseOut, Z));
		jqEl.on('mouseup', 'td', jQuery.proxy(Z._mouseUp, Z));
		Z._isReady = true;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el),
			i, len, 
			html1 = '',
			html2 = '',
			sTd = '<td><i class="fa fa-star" aria-hidden="true"></i></td>';
		for(i = 0, len = Z._itemCount; i < len; i++) {
			html1 += sTd;
			html2 += sTd;
		}
		var html = '<div class="jl-rating"><table><tr>' + html1 +
			'</tr></table><div class="jl-rating-value"><table><tr>' + html2 + 
			'</tr></table></div></div>';
		jqEl.html(html);
		window.setTimeout(function() {
			Z._itemWidth = jqEl.find('td:first').outerWidth();
			Z._setValue(Z._value);
		}, 5);
		return this;
	},

	_mouseMove: function domove(event) {
		var Z = this;
		if (Z._readOnly) {
			return;
		}
		var jqEl = jQuery(Z.el);
		jqEl.find('.jl-rating-value').width(Z._getMovedWidth(event));
		Z._changed = true;
	},

	_getMovedWidth: function(event) {
		var otd = event.currentTarget,
			cellIndex = otd.cellIndex;
		return this._itemWidth * cellIndex + event.offsetX;
	},
	
	_mouseOut: function doout(event) {
		var Z = this;
		if (Z._readOnly) {
			return;
		}
		if(Z._changed) {
			Z._setValue(Z._value);
		}
	},

	_mouseUp: function dodown(event) {
		var Z = this;
		if (Z._readOnly) {
			return;
		}
		Z._changed = false;
		var jqEl = jQuery(Z.el),
			movedWidth = Z._getMovedWidth(event);

		Z._value = Z._round(Z._itemCount * movedWidth / (Z._itemCount * Z._itemWidth));
		Z.doUIChanged();
	},
	
	_round: function(value) {
		var splitCount = this._splitCount;
		if(!splitCount || splitCount === 1) {
			return Math.ceil(value);
		}
		var intPart = parseInt(value),
			decPart = value - intPart,
			unit = 1 / splitCount,
			ceil;
		for(var i = 1, len = splitCount; i <= len; i++) {
			ceil = i * unit;
			if(decPart < ceil) {
				return intPart + ceil; 
			}
		}
		return value;
	},
	
	_setValue: function(value) {
		jslet.Checker.test('Rating.value', value).isNumber();
		if(value < 0) {
			value = 0;
		}
		var Z = this,
			itemCnt = Z._itemCount;
		if(value > itemCnt) {
			value = itemCnt;
		}
		var jqEl = jQuery(Z.el);
		jqEl.find('.jl-rating-value').width(value * Z._itemWidth);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.off();
		
		$super();
	}
	
});

jslet.ui.register('Rating', jslet.ui.Rating);
jslet.ui.Rating.htmlTemplate = '<Div></Div>';

/**
* @class 
* 
* TipPanel. Example:
* 
*     @example
*     var tipPnl = new jslet.ui.TipPanel();
*     tipPnl.show('Hello world', 10, 10);
*/
jslet.ui.TipPanel = function () {
	this._hideTimerId = null;
	this._showTimerId = null;
	this._oldElement = null;
	var p = document.createElement('div');
	jQuery(p).addClass('jl-tip-panel');
	document.body.appendChild(p);
	this._tipPanel = p;

	/**
	 * Show tips at specified position. Example:
	 * 
	 *     @example
	 *     tipPnl.show('foo...', event);
	 *     tipPnl.show('foo...', 100, 200);
	 * 
	 * @param {String} tips Tips text.
	 * @param {Integer | MouseEvent} leftOrEvent Position left or mouse event, if it is mouse event, the "top" argument is undefined.
	 * @param {Integer | undefined} top Position top.
	 */
	this.show = function (tips, leftOrEvent, top) {
		var Z = this;
		var len = arguments.length;
		var isSameCtrl = false, left = leftOrEvent;
		if (len == 2) { //this.show(tips)
			var evt = left;
			evt = jQuery.event.fix( evt );

			top = evt.pageY + 16; left = evt.pageX + 2;
			var ele = evt.currentTarget;
			isSameCtrl = (ele === Z._oldElement);
			Z._oldElement = ele;
		} else {
			left = parseInt(left);
			top = parseInt(top);
		}

		if (Z._hideTimerId) {
			window.clearTimeout(Z._hideTimerId);
			if (isSameCtrl) {
				return;
			}
		}

		this._showTimerId = window.setTimeout(function () {
			var p = Z._tipPanel;
			p.innerHTML = tips;
			p.style.left = left + 'px';
			p.style.top = top + 'px';
			Z._tipPanel.style.display = 'block';
			Z._showTimerId = null;
		}, 300);
	};

	/**
	 * Hide tip panel.
	 */
	this.hide = function () {
		var Z = this;
		if (Z._showTimerId) {
			window.clearTimeout(Z._showTimerId);
			return;
		}
		Z._hideTimerId = window.setTimeout(function () {
			Z._tipPanel.style.display = 'none';
			Z._hideTimerId = null;
			Z._oldElement = null;
		}, 300);
	};
};

/**
 * @class 
 * 
 * WaitingBox. Example:
 * 
 *     @example
 *     var wb = new jslet.ui.WaitingBox(document.getElementById("test"), "Gray", true);
 *	   wb.show("Please wait a moment...");
 * 
 * @param {HtmlElement} container The container which waiting box resides on.
 * @param {String} overlayColor Overlay color.
 * @param {Boolean} tipsAtNewLine Tips is at new line or not. If false, tips and waiting icon is at the same line.
 */
jslet.ui.WaitingBox = function (container, overlayColor, tipsAtNewLine) {
	var overlay = new jslet.ui.OverlayPanel(container);
	var s = '<div class="jl-waitingbox jl-round4"><i class="fa fa-spinner fa-pulse fa-2x fa-fw jl-waitingbox-icon"></i>';
		s += '<span class="jl-waitingbox-text"></span></div>';

	jQuery(overlay.overlayPanel).html(s);

	/**
	 * Show waiting box.
	 * 
	 * @param {String} tips Tips.
	 */
	this.show = function (tips) {
		var p = overlay.overlayPanel,
			box = p.firstChild,
			tipPanel = box.childNodes[1];
		tipPanel.innerHTML = tips ? tips : '';
		var jqPnl = jQuery(p),
			ph = jqPnl.height(),
			pw = jqPnl.width();

		setTimeout(function () {
			var jqBox = jQuery(box);
			box.style.top = Math.round((ph - jqBox.height()) / 2) + 'px';
			box.style.left = Math.round((pw - jqBox.width()) / 2) + 'px';
		}, 10);

		overlay.show();
	};

	/**
	 * Hide waiting box.
	 */
	this.hide = function () {
		overlay.hide();
	};

	/**
	 * Destroy waiting box.
	 */
	this.destroy = function () {
		overlay.overlayPanel.innerHTML = '';
		overlay.destroy();
	};
};

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * Accordion. Example:
 * 
 *     @example
 *     var jsletParam = {type:"Accordion",selectedIndex:1,items:[{caption:"Caption1"},{caption:"Caption2"}]};
 * 
 *     //1. Declaring:
 *       <div data-jslet='jsletParam' style="width: 300px; height: 400px;">
 *         <div>content1</div>
 *         <div>content2</div>
 *       </div>
 *  
 *     //2. Binding
 *       <div id='ctrlId'>
 *         <div>content1</div>
 *         <div>content2</div>
 *       </div>
 *       //Js snippet
 *       var el = document.getElementById('ctrlId');
 *       jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *       jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.Accordion = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,selectedIndex,onChanged,items';

		Z._selectedIndex = 0;
		
		Z._onChanged = null;
		
		Z._items = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Selected index.
	 * 
	 * @param {Integer | undefined} index selected index.
	 * 
	 * @return {this | Integer}
	 */
	selectedIndex: function(index) {
		if(index === undefined) {
			return this._selectedIndex;
		}
		jslet.Checker.test('Accordion.selectedIndex', index).isGTEZero();
		this._selectedIndex = index;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when user changes accordion panel. Example:
	 * 
	 *     @example 
	 *	   accordionObj.onChanged(function(index){
	 *     });
	 *
	 * @param {Function | undefined} onChanged Accordion panel changed event.
	 * @param {Integer} onChanged.index Accordion panel index.
	 * 
	 * @return {this | Function}
	 */
	onChanged: function(onChanged) {
		if(onChanged === undefined) {
			return this._onChanged;
		}
		jslet.Checker.test('Accordion.onChanged', onChanged).isFunction();
		this._onChanged = onChanged;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Accordion item settings. Example:
	 * 
	 *     @example
	 *     accordObj.items([caption: 'caption1'}, {caption: 'caption2'},...]);
	 *     
	 * @param {Object[] | undefined} items Items settings.
	 * @param {String} items.caption Item caption.
	 * 
	 * @return {this | Object[]} 
	 */
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		jslet.Checker.test('Accordion.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('Accordion.items.caption', item.caption).isString().required();
		}
		this._items = items;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-accordion')) {
			jqEl.addClass('jl-accordion jl-border-box jl-round5');
		}
		var panels = jqEl.find('>div'), jqCaption, headHeight = 0, item;

		var captionCnt = Z._items ? Z._items.length - 1: -1, caption;
		panels.before(function(index) {
			if (index <= captionCnt) {
				caption = Z._items[index].caption;
			} else {
				caption = 'caption' + index;
			}
			return '<button class="btn btn-default jl-accordion-head btn-sm" jsletindex = "' + index + '">' + caption + '</button>';
		});

		var jqCaptions = jqEl.find('>.jl-accordion-head');
		jqCaptions.click(Z._doCaptionClick);
		
		headHeight = jqCaptions.outerHeight() * panels.length;
		var contentHeight = jqEl.innerHeight() - headHeight-1;
		
		panels.wrap('<div class="jl-accordion-body" style="height:'+contentHeight+'px;display:none"></div>');
		var index = Z._selectedIndex;
		if(index > 0) {
			Z._selectedIndex = 0;
		}
        Z.setSelectedIndex(index, true);
	},
	
	_doCaptionClick: function(event){
		var jqCaption = jQuery(event.currentTarget),
			Z = jslet.ui.findJsletParent(jqCaption[0]).jslet,
			k = parseInt(jqCaption.attr('jsletindex'));
		Z.setSelectedIndex(k);
	},
	
	/**
	 * Set selected index
	 * 
	 * @param {Integer} index Panel index, start at 0.
	 */
	setSelectedIndex: function(index, isRenderAll){
		if (!index) {
			index = 0;
		}
		var Z = this;
		var jqBodies = jQuery(Z.el).find('>.jl-accordion-body');
		var pnlCnt = jqBodies.length - 1;
		if (index > pnlCnt) {
			return;
		}

		if (Z._selectedIndex == index && index < pnlCnt){
			jQuery(jqBodies[index]).hide();
			if(!isRenderAll || isRenderAll && index > 0) {
				index++;
			}
			jQuery(jqBodies[index]).show();
			Z._selectedIndex = index;
			if (Z._onChanged){
				Z._onChanged.call(this, index);
			}
			return;
		}
		if (Z._selectedIndex >= 0 && Z._selectedIndex != index) {
			jQuery(jqBodies[Z._selectedIndex]).hide();
		}
		jQuery(jqBodies[index]).show();
		Z._selectedIndex = index;
		if (Z._onChanged) {
			Z._onChanged.call(this, index);
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.find('>.jl-accordion-head').off();
		$super();
	}
});
jslet.ui.register('Accordion', jslet.ui.Accordion);
jslet.ui.Accordion.htmlTemplate = '<div></div>';

/**
 * @class 
 * @extend jslet.ui.Control
 * 
 * Jslet Desktop, this control is used to a desktop with a main menu and a workbench.<br />  
 * Example:
 * 
 *     @example
 *     var jsletParam = {type:"Desktop"};
 * 
 *     //1. Declaring:
 *     <div id="chartId" data-jslet='type:"Desktop"' />
 *     or
 *     <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *     <div id="ctrlId"  />
 *     //Js snippet
 *     var el = document.getElementById('ctrlId');
 *     jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 *
 */
jslet.ui.Desktop = jslet.Class.create(jslet.ui.Control, {
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'header,onLoadMenu,menuType,menuWidth';
		Z.requiredProperties = 'onLoadMenu';
		
		Z._header = null;
		Z._onLoadMenu = null;
		Z._menuType = 'side';
		
		Z._menuWidth = 160;
		Z._expanded = true;
		
		$super(el, params);
	},
	
	/**
	 * @property
	 * 
	 * Set or get menu header.
	 * 
	 * @param {String | undefined} header Menu header.
	 * 
	 * @return {this | String}
	 */
	header: function(header) {
		if(header === undefined) {
			return this._header;
		}
		this._header = header;
		return this;
	},
		
	/**
	 * @event
	 * 
	 * Loading menu event. It can be a Function or a global function name.<br />
	 * Loaded menu configuration is used for jslet.ui.Menu or jslet.ui.SideMenu control.
	 * 
	 * @param {Function | String} onLoadMenu Menu loading event handler.
	 * @param {Object[] | Promise} onLoadMenu.return Menu loading event handler.
	 * 
	 * @return {this}
	 */
	onLoadMenu: function(onLoadMenu) {
		jslet.Checker.test('DeskTop.onLoadMenu', onLoadMenu).required();
		this._onLoadMenu = onLoadMenu;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Menu position. The optional values: left or top.
	 * 
	 * @param {String | undefined} menuType Menu type. The optional values: 'side', 'top', 'tree', default is 'side'.
	 * 
	 * @return {this | String}
	 */
	menuType: function(menuType) {
		if(menuType === undefined) {
			return this._menuType;
		}
		jslet.Checker.test('Desktop.menuType', menuType).inArray(['side', 'top', 'tree']);
		this._menuType = menuType;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Menu width for side menu. It's valid when 'menuType' is 'side'.
	 * 
	 * @param {Integer | undefined} menuWidth Menu width for side menu.
	 * 
	 * @return {this | Integer}
	 */
	menuWidth: function(menuWidth) {
		if(menuWidth === undefined) {
			return this._menuWidth;
		}
		this._menuWidth = menuWidth;
		return this;
	},
		
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		if(!this.el.id) {
			this.el.id = jslet.nextId();
		}
		var jqEl = jQuery(this.el);
		if(!jqEl.hasClass('jl-desktop')) {
			jqEl.addClass('jl-desktop');
		}
		this.renderAll();
		jslet.desktop = this;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(this.el), html,
			isTop = (Z._menuType === 'top');
		if(isTop) {
			html = '<div name="mainMenu" class="jl-dsk-menu-top"></div><div name="workbench" class="jl-dsk-bench-top"></div>';
		} else {
			Z._expanded = true;
			html = '<div class="jl-dsk-menu-left" style="width: ' + Z._menuWidth + 'px">' + 
			'<div class="jl-dsk-header"><span class="jl-dsk-headercontent">' + (Z._header || '') + 
			'</span><a class="jl-dsk-toggle" href="javascript:void(0)"><i class="fa fa-exchange"></i></a></div>' +
			'<div class="jl-dsk-menu" name="mainMenu"></div></div><div name="workbench" class="jl-dsk-bench-left" style="padding-left: ' + Z._menuWidth + 'px"></div>';
		}
 		
		jqEl.html(html);
		var menuEl = jqEl.find('[name="mainMenu"]')[0],
			wbEl = jqEl.find('[name="workbench"]')[0];
		
		var wbCfg = {type: 'TabControl', newable: false, isFixedHeight: true, styleClass: (Z.styleClass() || '') + ' jl-dsk-bench', 
				enableLoading: true, 
				onContentLoading: Z._doContentLoading, onContentLoaded: Z._doContentLoaded, onRemoveTabItem: Z._doRemoveTabItem};
		Z._workbench = jslet.ui.bindControl(wbEl, wbCfg);
		
		var menuCfg = {type: (isTop? 'MenuBar': 'SideMenuBar'), onItemClick: jQuery.proxy(Z._openMenu, Z)},
			menuItems = null;
		if(Z._onLoadMenu) {
			var result = Z._onLoadMenu();
			if(result.done) {
				result.done(function(items) {
					jslet.Checker.test('Desktop.MenuItems', items).isArray();
					Z._mainMenu.items(items);
					Z._mainMenu.renderAll();
					Z._autoOpenMenu(items);
				});
			} else {
				menuCfg.items = result;
				menuItems = result;
			}
		}
		
		Z._mainMenu = jslet.ui.bindControl(menuEl, menuCfg);
		if(menuItems) {
			Z._autoOpenMenu(menuItems);
		}
		if(!isTop) {
			jqEl.find('.jl-dsk-toggle').off().on('click', function() {
				Z._toggleMenu();
			});
		}
	},
	
	_autoOpenMenu: function(menuItems) {
		if(!menuItems) {
			return;
		}
		var menuCfg;
		for(var i = 0, len = menuItems.length; i < len; i++) {
			menuCfg = menuItems[i];
			if(menuCfg.items) {
				this._autoOpenMenu(menuCfg.items);
			} else if(menuCfg.autoOpen) {
				this._openMenu(menuCfg);
			}
		}
	},
	
	_toggleMenu: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		Z._expanded = !Z._expanded;
		var menuContainer = jqEl.find('.jl-dsk-menu-left'),
			jqHeader = jqEl.find('.jl-dsk-headercontent'),
			jqWB = jQuery(Z._workbench.el);
		if(Z._expanded) {
			Z._mainMenu.expand();
			menuContainer.removeClass('jl-dsk-menu-left-collapsed');
			jqHeader.show();
			jqWB.css('padding-left', Z._menuWidth);
		} else {
			Z._mainMenu.collapse();
			jqHeader.hide();
			menuContainer.addClass('jl-dsk-menu-left-collapsed');
			jqWB.css('padding-left', 40);
		}
	},
	
	showTabPanel: function(tabPanelId) {
		this._workbench.setContentLoadedState(tabPanelId);
	},
	
	setTabPanelChanged: function(tabPanelId, changed) {
		this._workbench.setContentChangedState(tabPanelId, changed);
	},
	
	openMenuById: function(menuId) {
		var menuCfg = this._getMenuCfg(this._mainMenu.items(), menuId, true);
		this._openMenu(menuCfg);
	},
	
	openMenuByName: function(menuName) {
		var menuCfg = this._getMenuCfg(this._mainMenu.items(), menuName);
		this._openMenu(menuCfg);
	},
	
	/**
	 * Set tab item to changed state or not.
	 * 
	 * @param {String} tabItemId Tab item id.
	 * @param {Boolean} changed Changed state.
	 */
	setContentChangedState: function(tabItemId, changed) {
		this._workbench.setContentChangedState(tabItemId, changed);
	},
	
	/**
	 * set the specified tab item to loaded state. It will fire the "onContentLoaded" event.
	 * 
	 * @param {String} tabItemId - tab item id.
	 */
	setContentLoadedState: function(tabItemId) {
		this._workbench.setContentLoadedState(tabItemId);
	},
	
	_getMenuCfg: function(items, key, isById) {
		var result = null, item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			if(item.items) {
				result = this._getMenuCfg(item.items, key, isById);
				if(result) {
					return result;
				}
			} else {
				if(isById) {
					if(item.id === key) {
						return item;
					}
				} else {
					if(item.name === key) {
						return item;
					}
				}
			}
		}
		return null;
	},
	
	_doContentLoading: function(id, tabItemCfg) {
    	if(tabItemCfg.debounce) {
    		jQuery('#' + id).hide();
    	}
		
	},
	
	_doContentLoaded: function(id, tabItemCfg) {
    	if(tabItemCfg.debounce) {
    		jQuery('#' + id).fadeIn('fast');
    	}
	},
	
	_doRemoveTabItem: function(tabItemCfg, isActive) {
//    	var iframe = document.getElementById(tabItemCfg.contentId);
//    	var iframeWin = iframe.contentWindow || iframe;
//    	if(iframeWin.onMainTabClosed) {
//    		iframeWin.onMainTabClosed(tabItemCfg);
//    	}
    	return true;
	},
	
	_openMenu: function(menuCfg) {
		if(!menuCfg) {
			return;
		}
		var menuUrl = jQuery.trim(menuCfg.url);
		
		if(menuUrl) {
			var menuId = menuCfg.id;
			menuUrl = jslet.urlUtil.addParam(menuUrl, {menuId: menuId});
	    	this._workbench.addTabItem({id: 'if-' + menuId, header: menuCfg.name, url: menuUrl, closable: true, userIFrame: true, debounce: menuCfg.debounce, iconClass: menuCfg.iconClass});
	    	return;
		}
		if(menuCfg.onclick) {
			menuCfg.onclick.call(menuCfg);
			return;
		}
		console.warn('Menu: ' + menuCfg.name + ' not exists properties: "url" or "onclick"！');
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.find('.jl-dsk-toggle').off();
		$super();
	}
});

jslet.ui.register('Desktop', jslet.ui.Desktop);
jslet.ui.Desktop.htmlTemplate = '<div></div>';

jslet.ui.DesktopUtil = function() {
	var checkDatasetChangedHandler, currTabItemId, changingDatasets, debounce = null;
	
	function getCurrTabItemId() {
		if(!currTabItemId) {
			var url = window.document.location.href;
			currTabItemId = jslet.urlUtil.getParam(url, 'jlTabItemId');
		}
		return currTabItemId;
	}
	
	function isPageDebounce() {
		if(debounce === null) {
			var url = window.document.location.href;
			debounce = jslet.urlUtil.getParam(url, 'debounce');
		}
		return !!debounce;
	}
	
	function getDesktop() {
		var p = window.parent;
		var result = null;
		while(true) {
			if(!p) {
				break;
			}
			if(p.jslet && p.jslet.desktop) {
				result = p.jslet.desktop;
				break;
			}
			p = p.parent;
		}
		if(!result) { //If parent not exists desktop object, check current window object.
			if(window.jslet) {
				result = window.jslet.desktop;
			}
		}
		return result;
	}
	
	this.showTabPanel = function() {
		var desktop = getDesktop();
		if(!desktop) {
			return;
		}
		desktop.showTabPanel(getCurrTabItemId());
	};
	
	this.registerEditableDataset = function(datasetNames) {
		jslet.Checker.test('registerEditableDataset的参数必须为String', datasetNames).isString();
		if(datasetNames) {
			var chgDatasets = datasetNames;
			if(jslet.isString(chgDatasets)) {
				chgDatasets = datasetNames.split(',');
			}
			changingDatasets = {};
			for(var i = 0, len = chgDatasets.length; i < len; i++) {
				changingDatasets[chgDatasets[i]] = false;
			}
			if(!checkDatasetChangedHandler && getCurrTabItemId()) {
				var self = this;
				//定时监测注册的数据集是否有变动，有变动则发送消息给主页面的tabcontrol控件更新修改状态
				checkDatasetChangedHandler = window.setInterval(function() {
					var dsObj, isDiff = false,
						changed = false, oldChanged, newChanged;
					for(var dsName in changingDatasets) {
						dsObj = jslet.data.getDataset(dsName);
						if(dsObj) {
							oldChanged = changingDatasets[dsName];
							newChanged = dsObj.hasChangedData(true);
							changed = changed || newChanged;
							if(oldChanged !== newChanged) {
								isDiff = true;
								changingDatasets[dsName] = newChanged;
								if(changed) {
									break;
								}
							}
						}
					}
					if(isDiff) {
						var desktop = getDesktop();
						if(!desktop) {
							return;
						}
						desktop.setContentChangedState(getCurrTabItemId(), changed);
					}
				}, 500);
			}
		} else {
			if(!checkDatasetChangedHandler) {
				window.clearInterval(checkDatasetChangedHandler);
				checkDatasetChangedHandler = null;
			}
			changingDatasets = null;
		}
	};
	
	this.openMenuById = function(menuId) {
		var desktop = getDesktop();
		if(!desktop) {
			return;
		}
		desktop.openMenuById(menuId);
	};

	this.openMenuByName = function(menuName) {
		var desktop = getDesktop();
		if(!desktop) {
			return;
		}
		desktop.openMenuByName(menuName);
	};
	
	this.setContentLoadedState = function() {
		if(!isPageDebounce()) {
			return;
		}
		var desktop = getDesktop();
		if(!desktop) {
			return;
		}
		desktop.setContentLoadedState(getCurrTabItemId());
	};
};

jslet.ui.desktopUtil = new jslet.ui.DesktopUtil();

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * FieldSet. Example:
 * 
 *     @example
 *     //1. Declaring:
 *       <div data-jslet='type:"FieldSet"' />
 *
 *     //2. Binding
 *       <div id='ctrlId' />
 *       //Js snippet
 *       var jsletParam = {type:"FieldSet"};
 *       var el = document.getElementById('ctrlId');
 *       jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *       var jsletParam = {type:"FieldSet"};
 *       jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.FieldSet = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,caption,collapsed';

		Z._caption = null; 
		
		Z._collapsed = false;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get caption of FieldSet.
	 * 
	 * @param {String | undefined} caption Caption of FieldSet.
	 * 
	 * @return {this | String}
	 */
	caption: function(caption) {
		if(caption === undefined) {
			return this._caption;
		}
		jslet.Checker.test('FieldSet.caption', caption).isString();
		this._caption = caption;
		return this;
	},

	/**
	 * @property
	 * 
	 * Identify FieldSet is collapsed or not.
	 * 
	 * @param {Boolean | undefined} collapsed True - FieldSet is collapsed, false(default) - otherwise. 
	 * @return {this | Boolean}
	 */
	collapsed: function(collapsed) {
		if(collapsed === undefined) {
			return this._collapsed;
		}
		this._collapsed = collapsed ? true: false;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-fieldset')) {
			jqEl.addClass('jl-fieldset jl-round5');
		}
		
		var tmpl = ['<legend class="jl-fieldset-legend">'];
		tmpl.push('<span class="jl-fieldset-title"><i class="fa fa-chevron-circle-up jl-fieldset-btn">');
		tmpl.push('<span>');
		tmpl.push(Z._caption);
		tmpl.push('</span></span></legend><div class="jl-fieldset-body"></div>');
		
		var nodes = Z.el.childNodes, 
			children = [],
			i, cnt;
		cnt = nodes.length;
		for(i = 0; i < cnt; i++){
			children.push(nodes[i]);
		}

		jqEl.html(tmpl.join(''));
		var obody = jQuery(Z.el).find('.jl-fieldset-body')[0];
		cnt = children.length;
		for(i = 0; i < cnt; i++){
			obody.appendChild(children[i]);
		}
		
		jqEl.find('.jl-fieldset-btn').click(jQuery.proxy(Z._doExpandBtnClick, this));
	},
	
	_doExpandBtnClick: function(){
		var Z = this, jqEl = jQuery(Z.el);
		var fsBody = jqEl.find('.jl-fieldset-body');
		if (!Z._collapsed){
			fsBody.slideUp();
			jqEl.addClass('jl-fieldset-collapse');
			jqEl.find('.jl-fieldset-btn').addClass('fa-chevron-circle-down');
		}else{
			fsBody.slideDown();
			jqEl.removeClass('jl-fieldset-collapse');
			jqEl.find('.jl-fieldset-btn').removeClass('fa-chevron-circle-down');
		}
		fsBody[0].focus();
		Z._collapsed = !Z._collapsed;
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.find('input.jl-fieldset-btn').off();
		$super();
	}
});

jslet.ui.register('FieldSet', jslet.ui.FieldSet);
jslet.ui.FieldSet.htmlTemplate = '<fieldset></fieldset>';

jslet.ui.menuManager = {};
/*
 * Global menu id collection, array of string
 */
jslet.ui.menuManager._menus = [];

/*
 * Register menu id
 * 
 * @param {String} menuid Menu control id
 */
jslet.ui.menuManager.register = function (menuid) {
	jslet.ui.menuManager._menus.push(menuid);
};

/*
 * Unregister menu id
 * 
 * @param {String} menuid Menu control id
 */
jslet.ui.menuManager.unregister = function (menuid) {
	for (var i = 0, len = this._menus.length; i < len; i++) {
		jslet.ui.menuManager._menus.splice(i, 1);
	}
};

/*
 * Hide all menu item.
 */
jslet.ui.menuManager.hideAll = function (event) {
	var id, menu, menus = jslet.ui.menuManager._menus;
	for (var i = 0, len = menus.length; i < len; i++) {
		id = menus[i];
		menu = jslet('#'+id);
		if (menu) {
			menu.hide();
		}
	}
	jslet.ui.menuManager.menuBarShown = false;
	jslet.ui.menuManager._contextObject = null;
};

jQuery(document).on('mousedown', jslet.ui.menuManager.hideAll);

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * MenuBar. Example:
 * 
 *     @example
 *     var jsletParam = {type: 'MenuBar', onItemClick: globalMenuItemClick, items: [
 *       {name: 'File', items: [
 *         {id: 'new', name: 'New Tab', iconClass: 'icon1' }]
 *       }]};
 *
 *     //1. Declaring:
 *      <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <div id='ctrlId' />
 *      //js snippet:
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.MenuBar = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,onItemClick,items';

		Z._onItemClick = null;
		
		Z._items = null;
		
		$super(el, params);
	},

	/**
	 * @event
	 * 
	 * Set or get menuItem click event handler. Example:
	 * 
	 *     @example
	 *     menubarObj.onItemClick(function(menuId){});
	 * 
	 * @param {Function | undefined} onItemClick MenuItem click event handler.
	 * @param {String} onItemClick.menuId MenuItem click event handler.
	 * 
	 * @return {this | Function}
	 */
	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('MenuBar.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get menu items configuration.
	 * 
	 * @param {Object[] | undefined} items Menu items.
	 * @param {String} items.id Menu item id.
	 * @param {String} items.name Menu item name.
	 * @param {Function} items.onClick Menu item onClick event, example: onClick: function(event) {}.
	 * @param {MouseEvent} items.onClick.event Mouse event.
	 * @param {Boolean} items.disabled True - Menu item is disabled, false - otherwise.
	 * @param {Boolean} items.checked True - Menu item is checked, false - otherwise.
	 * @param {String} items.iconClass Menu item icon class name.
	 * @param {String} items.disabledIconClass Menu item icon disabled class name.
	 * @param {String} items.itemType Menu item type, optional value: null, 'radio', 'check'.
	 * @param {String} items.group Group name, only work when itemType equals 'radio'.
	 * @param {Object[]} items.items Sub menu items.
	 * 
	 * @return {this | Object[]}
	 */
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		if(!items) {
			this._items = null;
			return this;
		}
		jslet.Checker.test('MenuBar.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('MenuBar.items.name', item.name).isString().required();
		}
		this._items = items;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-menubar')) {
			jqEl.addClass('jl-menubar jl-unselectable jl-round5');
		}

		this.renderAll();
		jqEl.on('mouseout',function (event) {
			if (Z._preHoverItem && !jslet.ui.menuManager.menuBarShown) {
				jQuery(Z._preHoverItem).removeClass('jl-menubar-item-hover');
			}
		});
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		jqEl.find('.jl-menubar-item').off();
		this._createMenuBar();
	},

	/**
	 * Set a menu item to be disabled/enabled.
	 * 
	 * @param {String} menuId Menu id.
	 * @param {Boolean} disabled True - the menu item is disabled, otherwise it's enabled.
	 */
	setDisabled: function (menuId, disabled) {
		var operator = new jslet.ui.Menu.Operator(this);
		operator.setDisabled(menuId, disabled);
	},

	/**
	 * Set a menu item to be checked or non-checked.
	 * 
	 * @param {String} menuId Menu id.
	 * @param {Boolean} checked True - the menu item is checked, otherwise it's non-checked.
	 */
	setChecked: function (menuId, checked) {
		var operator = new jslet.ui.Menu.Operator(this);
		operator.setChecked(menuId, checked);
	},
	
	_createMenuBar: function () {
		var Z = this;
		if (Z.isPopup || !Z._items) {
			return;
		}
		for (var i = 0, cnt = Z._items.length, item; i < cnt; i++) {
			item = Z._items[i];
			Z._createBarItem(Z.el, item, Z._menubarclick);
		}
	},

	_showSubMenu: function (omi) {
		var Z = omi.parentNode.jslet,
			itemCfg = omi.jsletvar;
		if (!itemCfg.items) {
			return;
		}
		if (!itemCfg.subMenu) {
			var el = document.createElement('div');
			document.body.appendChild(el);
			itemCfg.subMenu = new jslet.ui.Menu(el, { onItemClick: Z._onItemClick, items: itemCfg.items });
		}
		var jqBody = jQuery(document.body),
			bodyMTop = parseInt(jqBody.css('margin-top')),
			bodyMleft = parseInt(jqBody.css('margin-left')),
			jqMi = jQuery(omi), 
			pos = jqMi.offset(), 
			posX = pos.left;
		if (jsletlocale.isRtl) {
			posX +=  jqMi.width() + 10;
		}
		itemCfg.subMenu.show(posX, pos.top + jqMi.height());
		jslet.ui.menuManager.menuBarShown = true;
		Z._activeMenuItem = omi;
		// this.parentNode.parentNode.jslet.ui._createMenuPopup(cfg);
	},

	_createBarItem: function (obar, itemCfg) {
		if (itemCfg.visible !== undefined && !itemCfg.visible) {
			return;
		}
		var omi = document.createElement('div');
		jQuery(omi).addClass('jl-menubar-item');
		omi.jsletvar = itemCfg;
		var Z = this, jqMi = jQuery(omi);
		jqMi.on('click',function (event) {
			var cfg = this.jsletvar;
			if(!cfg.items) {
				jslet.ui.menuManager.hideAll();
				if (cfg.onClick) {
					cfg.onClick.call(Z, cfg);
				} else {
					if (Z._onItemClick)
						Z._onItemClick.call(Z, cfg);
				}
			} else {
				//				if (Z._activeMenuItem != this || jslet.ui.menuManager.menuBarShown)
				Z._showSubMenu(this);
			}
			event.stopPropagation();
			event.preventDefault();
		});

		jqMi.on('mouseover', function (event) {
			if (Z._preHoverItem) {
				jQuery(Z._preHoverItem).removeClass('jl-menubar-item-hover');
			}
			Z._preHoverItem = this;
			jQuery(this).addClass('jl-menubar-item-hover');
			if (jslet.ui.menuManager.menuBarShown) {
				jslet.ui.menuManager.hideAll();
				Z._showSubMenu(this);
				jslet.ui.menuManager._inPopupMenu = true;
			}
		});
		
		var template = [];
		template.push('<a class="jl-focusable-item" href="javascript:void(0)">');
		template.push(itemCfg.name);
		template.push('</a>');
		
		omi.innerHTML = template.join('');
		obar.appendChild(omi);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		Z._activeMenuItem = null;
		Z._preHoverItem = null;
		Z._menubarclick = null;
		Z._onItemClick = null;
		var jqEl = jQuery(Z.el);
		jqEl.off();
		jqEl.find('.jl-menubar-item').off();
		jqEl.find('.jl-menubar-item').each(function(){
			var omi = this;
			if (omi.jsletvar){
				omi.jsletvar.subMenu = null;
				omi.jsletvar = null;
			}
		});
		$super();
	}
});
jslet.ui.register('MenuBar', jslet.ui.MenuBar);
jslet.ui.MenuBar.htmlTemplate = '<div></div>';

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * Menu. Example:
 * 
 *     @example
 *     var jsletParam = {type: 'Menu', onItemClick: globalMenuItemClick, items: [
 *       {id: 'back', name: 'Backward', iconClass: 'icon1' },
 *       {id: 'go', name: 'Forward', disabled: true },
 *       {name: '-' }]};
 *
 *     //1. Declaring:
 *       <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *       <div id='menu1' />
 *       //js snippet:
 *       var el = document.getElementById('menu1');
 *       jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *       jslet.ui.createControl(jsletParam, document.body);
 *       //Use the below code to show context menu
 *       jslet('#ctrlId').showContextMenu(event);
 *       //Show menu at the specified position
 *       jslet('#ctrlId').show(left, top);
 * 
 */
jslet.ui.Menu = jslet.Class.create(jslet.ui.Control, {
	_onItemClick: undefined,
	_items:undefined,
	_invoker: null,
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'onItemClick,items,invoker'; //'invoker' is used for inner
		//items is an array, menu item's properties: id, name, onClick,disabled,iconClass,disabledIconClass,itemType,checked,group,items
		$super(el, params);
		Z._activeSubMenu = null;
	},

	/**
	 * @event
	 * 
	 * Set or get menuItem click event handler. Example:
	 * 
	 *     @example
	 *     menubarObj.onItemClick(function(menuId){});
	 * 
	 * @param {Function | undefined} onItemClick MenuItem click event handler.
	 * @param {String} onItemClick.menuId MenuItem click event handler.
	 * 
	 * @return {this | Function}
	 */
	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('Menu.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get menu items configuration.
	 * 
	 * @param {Object[] | undefined} items Menu items.
	 * @param {String} items.id Menu item id.
	 * @param {String} items.name Menu item name.
	 * @param {Function} items.onClick Menu item onClick event, example: onClick: function(event) {}.
	 * @param {MouseEvent} items.onClick.event Mouse event.
	 * @param {Boolean} items.disabled True - Menu item is disabled, false - otherwise.
	 * @param {Boolean} items.checked True - Menu item is checked, false - otherwise.
	 * @param {String} items.iconClass Menu item icon class name.
	 * @param {String} items.disabledIconClass Menu item icon disabled class name.
	 * @param {String} items.itemType Menu item type, optional value: null, 'radio', 'check'.
	 * @param {String} items.group Group name, only work when itemType equals 'radio'.
	 * @param {Object[]} Sub menu items.
	 * 
	 * @return {this | Object[]}
	 */
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		jslet.Checker.test('Menu.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('Menu.items.name', item.name).isString().required();
		}
		this._items = items;
		return this;
	},
	
	invoker: function(invoker) {
		if(invoker === undefined) {
			return this._invoker;
		}
		this._invoker = invoker;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el),
			ele = Z.el;
		if (!jqEl.hasClass('jl-menu')) {
			jqEl.addClass('jl-menu');
		}
		ele.style.display = 'none';

		if (!ele.id) {
			ele.id = jslet.nextId();
		}

		jslet.ui.menuManager.register(ele.id);
		Z._createMenuPopup();
		jqEl.on('mousedown',function (event) {
			event = jQuery.event.fix( event || window.event );
			event.stopPropagation();
			event.preventDefault();
			return false;
		});

		jqEl.on('mouseover', function (event) {
			jslet.ui.menuManager._inPopupMenu = true;
			if (jslet.ui.menuManager.timerId) {
				window.clearTimeout(jslet.ui.menuManager.timerId);
			}
		});

		jqEl.on('mouseout', function (event) {
			jslet.ui.menuManager._inPopupMenu = false;
			jslet.ui.menuManager.timerId = window.setTimeout(function () {
				if (!jslet.ui.menuManager._inPopupMenu) {
					jslet.ui.menuManager.hideAll();
				}
				jslet.ui.menuManager.timerId = null;
			}, 800);
		});
	},

	/**
	 * Set a menu item to be disabled/enabled.
	 * 
	 * @param {String} menuId Menu id.
	 * @param {Boolean} disabled True - the menu item is disabled, otherwise it's enabled.
	 */
	setDisabled: function (menuId, disabled) {
		var operator = new jslet.ui.Menu.Operator(this);
		operator.setDisabled(menuId, disabled);
	},

	/**
	 * Set a menu item to be checked or non-checked.
	 * 
	 * @param {String} menuId Menu id.
	 * @param {Boolean} checked True - the menu item is checked, otherwise it's non-checked.
	 */
	setChecked: function (menuId, checked) {
		var operator = new jslet.ui.Menu.Operator(this);
		operator.setChecked(menuId, checked);
	},
	
	/**
	 * Show menu at specified position.
	 * 
	 * @param {Integer} left Position left.
	 * @param {Integer} top Position top.
	 */
	show: function (left, top) {
		var Z = this, 
			jqEl = jQuery(Z.el),
			width = jqEl.outerWidth(),
			height = jqEl.outerHeight(),
			jqWin = jQuery(window),
			winWidth = jqWin.scrollLeft() + jqWin.width(),
			winHeight = jqWin.scrollTop() + jqWin.height();
			
		left = left || Z.left || 10;
		top = top || Z.top || 10;
		if (jsletlocale.isRtl) {
			left -= width;
		}
		if(left + width > winWidth) {
			left += winWidth - left - width - 1;
		}
		if(top + height > winHeight) {
			top += winHeight - top - height - 1;
		}
		if(left < 0) {
			left = 0;
		}
		if(top < 0) {
			top = 0;
		}
		Z.el.style.left = left + 'px';
		Z.el.style.top = parseInt(top) + 'px';
		Z.el.style.display = 'block';
		if (!Z.shadow) {
			Z.shadow = document.createElement('div');
			jQuery(Z.shadow).addClass('jl-menu-shadow');
			Z.shadow.style.width = width + 'px';
			Z.shadow.style.height = height + 'px';
			document.body.appendChild(Z.shadow);
		}
		Z.shadow.style.left = left + 1 + 'px';
		Z.shadow.style.top = top + 1 + 'px';
		Z.shadow.style.display = 'block';
	},

	/**
	 * Show menu at the position which specifed by a HTML element. Example:
	 * 
	 *     @example
	 *     menuObj.showAt('#btn1'); //
	 *     menuObj.showAt(document.getElementById('btn1'));
	 * 
	 * @param {String | HtmlElement} hostEl Host HTML element or jQuery query string.
	 */
	showAt: function(hostEl) {
		var jqHost = jQuery(hostEl);
		if(jqHost.length === 0) {
			throw new Error('Host control NOT found When showing menu, check it first!');
		}
		var offset = jqHost.offset();
		this.show(offset.left, offset.top + jqHost.outerHeight());
	},
	
	/**
	 * Hide menu item and all its sub menu item.
	 */
	hide: function () {
		this.ctxElement = null;
		this.el.style.display = 'none';
		if (this.shadow) {
			this.shadow.style.display = 'none';
		}
	},

	/**
	 * Show menu on context menu. Example:
	 * 
	 *     @example
	 *     //Html
	 *     <div id="popmenu" oncontextmenu="popMenu(event);">
	 *     //Js
	 *	   function popMenu(event) {
	 *	     jslet("#popmenu").showContextMenu(event);
	 *     }
	 */
	showContextMenu: function (event, contextObj) {
		jslet.ui.menuManager.hideAll();

		event = jQuery.event.fix( event || window.event );
		jslet.ui.menuManager._contextObject = contextObj;
		this.show(event.pageX, event.pageY);
		event.preventDefault();
	},

	_createMenuPopup: function () {
		var panel = this.el,
			items = this._items, itemCfg, name, i, cnt;
		cnt = items.length;
		for (i = 0; i < cnt; i++) {
			itemCfg = items[i];
			if (!itemCfg.name) {
				continue;
			}
			name = itemCfg.name.trim();
			if (name != '-') {
				this._createMenuItem(panel, itemCfg);
			} else {
				this._createLine(panel, itemCfg);
			}
		}

		document.body.appendChild(panel);
	},

	_ItemClick: function (sender, cfg) {
		//has sub menu items
		if (cfg.items) {
			this._showSubMenu(sender, cfg);
			return;
		}
		if (cfg.disabled) {
			return;
		}
		jslet.ui.menuManager.hideAll();
		if (cfg.itemType == 'check' || cfg.itemType == 'radio') {
			this.setChecked(sender.id, !cfg.checked);
		}
		var contextObj = jslet.ui.menuManager._contextObject || this;
		if (cfg.onClick) {
			cfg.onClick.call(contextObj, cfg);
		} else {
			if (this._onItemClick) {
				this._onItemClick.call(contextObj, cfg);
			}
		}
	},

	_hideSubMenu: function () {
		var Z = this;
		if (Z._activeSubMenu) {
			Z._activeSubMenu._hideSubMenu();
			Z._activeSubMenu.hide();
			Z._activeSubMenu.el.style.zIndex = parseInt(jQuery(Z.el).css('zIndex'));
		}
	},

	_showSubMenu: function (sender, cfg, delayTime) {
		var Z = this;
		var func = function () {
			Z._hideSubMenu();
			if (!cfg.subMenu) {
				return;
			}
			var jqPmi = jQuery(sender),
				pos = jqPmi.offset(), 
				x = pos.left;
			if (!jsletlocale.isRtl) {
				x += jqPmi.width();
			}

			cfg.subMenu.show(x - 2, pos.top);
			cfg.subMenu.el.style.zIndex = parseInt(jQuery(Z.el).css('zIndex')) + 1;
			Z._activeSubMenu = cfg.subMenu;
		};
		if (delayTime) {
			window.setTimeout(func, delayTime);
		} else {
			func();
		}
	},

	_ItemOver: function (sender, cfg) {
		if (this._activeSubMenu) {
			this._showSubMenu(sender, cfg, 200);
		}
	},

	_createMenuItem: function (container, itemCfg, defaultClickHandler) {
		//id, name, onClick,disabled,iconClass,disabledIconClass,itemType,checked,group,items,subMenuId
		var isCheckBox = false, 
			isRadioBox = false,
			itemType = itemCfg.itemType;
		if (itemType) {
			isCheckBox = (itemType == 'check');
			isRadioBox = (itemType == 'radio');
		}
		if (isCheckBox) {
			itemCfg.iconClass = 'fa fa-check';//'jl-menu-check';
		}
		if (isRadioBox) {
			itemCfg.iconClass = 'fa fa-circle'; //kjl-menu-radio';
		}
		if (itemCfg.items) {
			itemCfg.disabled = false;
		}
		var mi = document.createElement('div'), Z = this, jqMi = jQuery(mi);
		jqMi.addClass('jl-menu-item ' + (itemCfg.disabled ? 'jl-menu-disabled' : ''));

		if (!itemCfg.id) {
			itemCfg.id = jslet.nextId();
		}
		mi.id = itemCfg.id;
		mi.jsletvar = itemCfg;
		jqMi.on('click', function (event) {
			Z._ItemClick(this, this.jsletvar);
			event.stopPropagation();
			event.preventDefault();
		});

		jqMi.on('mouseover', function (event) {
			Z._ItemOver(this, this.jsletvar);
			if (Z._preHoverItem) {
				jQuery(Z._preHoverItem).removeClass('jl-menu-item-hover');
			}
			Z._preHoverItem = this;
			if (!this.jsletvar.disabled) {
				jQuery(this).addClass('jl-menu-item-hover');
			}
		});

		jqMi.on('mouseout', function (event) {
			if (!this.jsletvar.subMenu) {
				jQuery(this).removeClass('jl-menu-item-hover');
			}
		});

		var template = [];
		template.push('<span class="jl-menu-icon-placeholder ');
		if ((isCheckBox || isRadioBox) && !itemCfg.checked) {
			//Empty 
		} else {
			if (itemCfg.iconClass) {
				template.push((!itemCfg.disabled || !itemCfg.disabledIconClass) ? itemCfg.iconClass : itemCfg.disabledIconClass);
			}
		}
		template.push('"></span>');

		if (itemCfg.items) {
			template.push('<div class="jl-menu-arrow"><i class="fa fa-caret-right" aria-hidden="true"></i></div>');
		}

		template.push('<a  href="javascript:void(0)" class="jl-focusable-item jl-menu-content ');
		template.push(' jl-menu-content-left jl-menu-content-right');
		template.push('">');
		template.push(itemCfg.name + "&nbsp;&nbsp;&nbsp;&nbsp;");
		template.push('</a>');
		mi.innerHTML = template.join('');
		container.appendChild(mi);
		if (itemCfg.items) {
			var el = document.createElement('div');
			document.body.appendChild(el);
			itemCfg.subMenu = new jslet.ui.Menu(el, { onItemClick: Z._onItemClick, items: itemCfg.items, invoker: mi });
		}
	},

	_createLine: function (container, itemCfg) {
		var odiv = document.createElement('div');
		jQuery(odiv).addClass('jl-menu-line');
		container.appendChild(odiv);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this, 
			jqEl = jQuery(Z.el);
		Z._activeSubMenu = null;
		jslet.ui.menuManager.unregister(Z.el.id);
		jqEl.off();
		jqEl.find('.jl-menu-item').each(function(){
			this.onmouseover = null;
			this.onclick = null;
			this.onmouseout = null;
		});
		
		$super();
	}
});

jslet.ui.register('Menu', jslet.ui.Menu);
jslet.ui.Menu.htmlTemplate = '<div></div>';


jslet.ui.Menu.Operator = function(menuObj) {
	this._menuObj = menuObj;
};

jslet.ui.Menu.Operator.prototype = {
	getMenuItemById: function(id) {
		jslet.Checker.test('getMenuItemById#id', id).required().isString();
		
		function getItem(items, id) {
			var item, itemObj;
			for(var i = 0, len = items.length; i < len; i++) {
				item = items[i];
				if(item.id === id) {
					return item;
				}
				if(item.items) {
					item = getItem(item.items, id);
					if(item) {
						return item;
					}
				}
			}
			return null;
		}
		var items = this._menuObj.items();
		if(!items) {
			return null;
		}
		return getItem(items, id);
	},
		
	getMenuGroup: function(id, excludeSelf) {
		jslet.Checker.test('getMenuGroup#id', id).required().isString();
		
		function getItemGroup(items, id) {
			var item, itemObj;
			for(var i = 0, len = items.length; i < len; i++) {
				item = items[i];
				if(item.id === id && item.itemType === 'radio') {
					var groupName = item.group,
						result = [], itemCfg;
					for(var j = 0, size = items.length; j < size; j++) {
						itemCfg = items[j];
						if(excludeSelf && itemCfg.id === id) {
							continue;
						}
						if(itemCfg.itemType === 'radio' && itemCfg.group === groupName) {
							result.push(itemCfg);
						}
					}
					return result;
				}
				if(item.items) {
					var groupItems = getItemGroup(item.items, id);
					if(groupItems) {
						return groupItems;
					}
				}
			}
			return null;
		}
		var items = this._menuObj.items();
		if(!items) {
			return null;
		}
		return getItemGroup(items, id);
	},
		
	setDisabled: function (menuId, disabled) {
		var itemCfg = this.getMenuItemById(menuId);
		itemCfg.disabled = disabled? true: false;
		if (itemCfg.items) {
			return;
		}
		var jqMi = jQuery('#'+menuId);
		if(jqMi.length === 0) {
			return;
		}
		if (disabled) {
			jqMi.removeClass('jl-menu-enabled');
			jqMi.addClass('jl-menu-disabled');
		} else {
			jqMi.removeClass('jl-menu-disabled');
			jqMi.addClass('jl-menu-enabled');
		}
	},
	
	setChecked: function (menuId, checked) {
		var itemCfg = this.getMenuItemById(menuId);
		var itemType = itemCfg.itemType;
		checked = itemType === 'radio'? true: checked; //Radio menu item can not be unchecked.
		if (itemCfg.disabled || itemType != 'check' && itemType != 'radio' || itemCfg.checked == checked) {	
			return;
		}
		itemCfg.checked = checked;
		var changedCfg = [itemCfg], i, len;
		if(itemType == 'radio') {
			var otherGroups = this.getMenuGroup(menuId, true);
			for(i = 0, len = otherGroups.length; i < len; i++) {
				itemCfg = otherGroups[i];
				if(itemCfg.checked) {
					itemCfg.checked = false;
					changedCfg.push(itemCfg);
					break;
				}
			}
		}
		var jqIcon;
		for(i = 0, len = changedCfg.length; i < len; i++) {
			itemCfg = changedCfg[i];
			jqIcon = jQuery('#'+itemCfg.id).find('.jl-menu-icon-placeholder');
			if (itemCfg.checked) {
				jqIcon.addClass(itemCfg.iconClass);
			} else {
				jqIcon.removeClass(itemCfg.iconClass);
			}
		}
	}
};

/**
 * @class
 * @extend jslet.ui.Control
 * 
 * Side menu bar. Example:
 * 
 *     @example
 *     var jsletParam = {type: 'SideMenuBar', onItemClick: globalMenuItemClick, items: [
 *       {name: 'File', items: [
 *         {id: 'new', name: 'New Tab', iconClass: 'icon1' }]
 *       }]};
 *
 *     //1. Declaring:
 *      <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <div id='ctrlId' />
 *      //js snippet:
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.SideMenuBar = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,hasSubTitle,onItemClick,items,popupWidth';

		Z._hasSubTitle = true;
		
		Z._onItemClick = null;
		
		Z._items = null;
		
		Z._popupWidth = null;
		
		Z._containerId = null;
		
		Z._closeTimeout = null;
		Z._showTimeout = null;
		
		Z.oldHeight = 0;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Identify to show sub-menu title or not.
	 * 
	 * @param {Boolean | undefined} hasSubTitle True - show sub menu title, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasSubTitle: function(hasSubTitle) {
		if(hasSubTitle === undefined) {
			return this._hasSubTitle;
		}
		this._hasSubTitle = hasSubTitle? true: false;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get menuItem click event handler. Example:
	 * 
	 *     @example
	 *     menubarObj.onItemClick(function(menuId){});
	 * 
	 * @param {Function | undefined} onItemClick MenuItem click event handler.
	 * @param {String} onItemClick.menuId MenuItem click event handler.
	 * 
	 * @return {this | Function}
	 */
	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('SideMenuBar.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get menu items configuration.
	 * 
	 * @param {Object[] | undefined} items Menu items.
	 * @param {String} items.id Menu item id.
	 * @param {String} items.name Menu item name.
	 * @param {Function} items.onClick Menu item onClick event, example: onClick: function(event) {}.
	 * @param {Boolean} items.disabled True - Menu item is disabled, false - otherwise.
	 * @param {Boolean} items.checked True - Menu item is checked, false - otherwise.
	 * @param {String} items.iconClass Menu item icon class name.
	 * @param {String} items.disabledIconClass Menu item icon disabled class name.
	 * @param {String} items.itemType Menu item type, optional value: null, 'radio', 'check'.
	 * @param {String} items.group Group name, only work when itemType equals 'radio'.
	 * @param {Object[]} items.items Sub menu items.
	 * 
	 * @return {this | Object[]}
	 */
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		if(!items) {
			this._items = null;
			return this;
		}
		jslet.Checker.test('SideMenuBar.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('SideMenuBar.items.name', item.name).isString().required();
		}
		this._items = items;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get pop up panel width.
	 * 
	 * @param {Integer | undefined} popupHeight The width of pop up panel width.
	 * 
	 * @return {this | Integer}
	 */
	popupWidth: function(popupWidth) {
		if(popupWidth === undefined) {
			return this._popupWidth;
		}
		jslet.Checker.test('SideMenuBar.popupWidth', popupWidth).isGTEZero();
		this._popupWidth = parseInt(popupWidth);
		return this;
	},
		
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		jslet.ui.resizeEventBus.subscribe(Z);
		if(!Z.el.id) {
			Z.el.id = jslet.nextId();
		}
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-sidemenubar')) {
			jqEl.addClass('jl-sidemenubar jl-unselectable jl-round4');
		}
		jqEl.on('mouseenter', '.jl-smb-baritem', function(event) {
			Z._clearShowTimeout();
			Z._clearCloseTimeout();
			var omi = event.currentTarget;
			Z._showTimeout = window.setTimeout(function() {
				Z._showSubMenu(omi);
			}, 100);
		});
		jqEl.on('mouseleave', function() {
			Z._doMouseLeave();
		});
		var containerId = Z.el.id + '_panel';
		Z._containerId = containerId;
		var container = document.getElementById(containerId);
		if(!container) {
			container = document.createElement('div');
			document.body.appendChild(container);
			container.id = containerId;
			container.className = 'jl-smb-popup';
			jQuery(container).on('mouseleave', function() {
				Z._doMouseLeave();
			}).on('mouseenter', function() {
				Z._doMouseEnter();
			}).on('click', '.jl-smb-item', function(event) {
				Z._doMenuClick(event.currentTarget);
			});
		}
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el),
			jqContainer = jQuery('#' + Z._containerId);
		jqEl.find('.jl-smb-up').off();
		jqEl.find('.jl-smb-down').off();
		jqContainer.html('<span class="jl-smb-box"></span>');
		if(Z._popupWidth) {
			jqContainer.css('width', Z._popupWidth + 'px');
		}
		Z._itemHeight = parseFloat(jslet.ui.getCssValue('jl-smb-baritem', 'height'));

		var html = '';
		html += '<div class="jl-smb-up"><a href="javascript:void(0)"><i class="fa fa-chevron-up"></i></a></div>';
		html += '<div class="jl-smb-items"><ul class="jl-smb-ul">';
		var items = Z._items || [];
		for (var i = 0, cnt = items.length, item; i < cnt; i++) {
			item = items[i];
			if(item.id === null || item.id === undefined) {
				item.id = jslet.nextId();
			}
			if(!item.items || item.items.length === 0) {
				console.warn('Menu item: ' + item.name + ' does not have items!');
				continue;
			}
			html += '<li><a class="jl-smb-baritem" id="' + item.id + '" href="javascript:void(0)">';
			html += '<i class="jl-smb-icon ' + (item.iconClass || 'jl-hidden') + '"></i>';
			html += '<span>' + item.name + '</span><i class="jl-smb-arrow fa fa-chevron-right"></i>';
			html += '</a></li>';
			Z._createMenuItem(jqContainer, item.id, item.items);
		}
		html += '<li class="jl-smb-lastbaritem"></li></ul></div>';
		html += '<div class="jl-smb-down"><a href="javascript:void(0)"><i class="fa fa-chevron-down"></i></a></div>';
		jqEl.html(html);
		jqEl.find('.jl-smb-up').on('click', function() {
			Z._hideSubMenu();
			jqEl.find('.jl-smb-down').show();
			var jqItems = jqEl.find('.jl-smb-items');
			var scrTop = jqItems.scrollTop();
			scrTop -= Z._itemHeight;
			if(scrTop <= 0) {
				jQuery(this).hide();
			}
			jqItems.scrollTop(scrTop);
		}).on('mouseenter', function() {
			Z._hideSubMenu();
		});
		jqEl.find('.jl-smb-down').on('click', function() {
			Z._hideSubMenu();
			jqEl.find('.jl-smb-up').show();
			var jqItems = jqEl.find('.jl-smb-items');
			var scrTop = jqItems.scrollTop() + Z._itemHeight;
			var maxScrTop = jqItems[0].scrollHeight - jqItems.innerHeight();
			if(scrTop > maxScrTop) {
				jQuery(this).hide();
			}
			jqItems.scrollTop(scrTop);
		}).on('mouseenter', function() {
			Z._hideSubMenu();
		});
		Z.resize();
	},

	collapse: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		jqEl.find('.jl-smb-baritem > .jl-smb-arrow').hide();
		jqEl.find('.jl-smb-baritem > span').hide();
	},
	
	expand: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		jqEl.find('.jl-smb-baritem > .jl-smb-arrow').show();
		jqEl.find('.jl-smb-baritem > span').show();
	},
	
	_clearShowTimeout: function() {
		var Z = this;
		if(Z._showTimeout) {
			window.clearTimeout(Z._showTimeout);
			Z._showTimeout = null;
		}
	},
	
	_clearCloseTimeout: function() {
		var Z = this;
		if(Z._closeTimeout) {
			window.clearTimeout(Z._closeTimeout);
			Z._closeTimeout = null;
		}
	},
	
	_getItemById: function(items, id, isFirstLevel) {
		var Z = this, itemCfg;
		for(var i = 0, cnt = items.length; i < cnt; i++) {
			itemCfg = items[i]; 
			if(itemCfg.id === id) {
				return itemCfg;
			}
			if(!isFirstLevel && itemCfg.items) {
				itemCfg = Z._getItemById(itemCfg.items, id);
				if(itemCfg) {
					return itemCfg;
				}
			}
		}
		return null;
	},
	
	_createMenuItem: function(jqContainer, id, items) {
		var Z = this;
		var html = Z._innerCreateMenuItem(id, items, 0);
		jqContainer.append(html);
	},
	
	_innerCreateMenuItem: function(id, items, level) {
		var Z = this;
		
		function getMenuItems(menuItems, result) {
			var itemCfg;
			for(var k = 0, len = menuItems.length; k < len; k++) {
				itemCfg = menuItems[k];
				if(itemCfg.items) {
					getMenuItems(itemCfg.items, result);
				} else {
					result.push(itemCfg);
				}
			}
		}
		var groups = [], group = null, groupItems, menuName, menuItems, itemCfg;
		for (var i = 0, cnt = items.length - 1; i <= cnt; i++) {
			itemCfg = items[i];
			if(itemCfg.items) {
				menuItems = [];
				getMenuItems(itemCfg.items, menuItems);
				groups.push({id: itemCfg.id || jslet.nextId(), name: itemCfg.name, items: menuItems});
				group = null;
			} else {
				if(group === null) {
					groupItems = [];
					group = {id: jslet.nextId(), items: groupItems, isLine: true};
					groups.push(group);
				}
				menuName = jQuery.trim(itemCfg.name);
				if(menuName === '-') {
					group = null;
					continue;
				}
				groupItems.push(itemCfg);
			}
		}
		var html = '<ul id="' + id +'_popup" class="jl-smb-popup-ul ' + (level === 0? 'jl-hidden': '') + '">';
		for(var j = 0, grpCnt = groups.length - 1; j <= grpCnt; j++) {
			group = groups[j];
			menuName = jQuery.trim(group.name);
			html += '<li class="jl-smb-group' + (j < grpCnt? ' jl-smb-line': '') + '">';
			if(!group.isLine) {
				if(Z._hasSubTitle && menuName) {
					html += '<div class="jl-smb-subtitle">' + menuName + '</div>';
				}
			}
			
			html += '<ul id="' + group.id +'_popup" class="jl-smb-popup-ul">';
			groupItems = group.items;
			for (i = 0, cnt = groupItems.length - 1; i <= cnt; i++) {
				itemCfg = groupItems[i];
				id = itemCfg.id;
				if(!id && id !== 0) {
					id = jslet.nextId();
					itemCfg.id = id;
				}
				menuName = jQuery.trim(itemCfg.name);
				html += '<li>';
				html += '<a id="' + id + '" class="jl-smb-item' + (itemCfg.disabled ? ' jl-smb-disabled': '') +
				  '" href="javascript:void(0)">';
				html += '<span class="jl-smb-popup-icon ' + (itemCfg.iconClass || '') + '"></span>' + menuName + '</a>';
				html += '</li>';
			} //End for i
			html += '</ul>';
			html += '</li>';
		} //End for j
		html += '</ul>';
		return html;
	},
	
	_hideSubMenu: function() {
		this._clearShowTimeout();
		jQuery('#' + this._containerId).hide();
	},
	
	_showSubMenu: function (omi) {
		var Z = this,
			itemCfg = Z._getItemById(Z._items, omi.id, true);
		if (!itemCfg.items) {
			return;
		}
		var jqEl = jQuery(Z.el);
		var jqPopupContainer = jQuery('#' + Z._containerId);
		jqPopupContainer.children().each(function(index) {
			var jqItem = jQuery(this);
			if(jqItem.hasClass('jl-smb-box')) {
				return;
			}
			var isHidden = jqItem.hasClass('jl-hidden');
			if(this.id !== itemCfg.id + '_popup') {
				if(!isHidden) {
					jqItem.addClass('jl-hidden');
				}
			} else {
				if(isHidden) {
					jqItem.removeClass('jl-hidden');
				}
			}
		});
		var jqMi = jQuery(omi), 
			pos = jqMi.offset(), 
			posX = pos.left + jqMi.width() + 2,
			posY = pos.top;
		var delta = pos.top + jqPopupContainer.outerHeight() - jQuery(window).innerHeight() - document.body.scrollTop;
		var jqBox = jqPopupContainer.find('.jl-smb-box');
		if(delta > 0) {
			posY = posY - delta;
			jqBox.css('top', delta +'px');
		} else {
			jqBox.css('top', '0');
		}
		jqPopupContainer.show();
		jqPopupContainer.offset({left: posX, top: posY - 1});
	},

	_doMouseEnter: function() {
		var Z = this;
		Z._clearShowTimeout();
		Z._clearCloseTimeout();
	},
	
	_doMouseLeave: function() {
		var Z = this;
		Z._clearShowTimeout();
		Z._closeTimeout = window.setTimeout(function() {
			window.clearTimeout(Z._closeTimeout);
			Z._closeTimeout = null;
			Z._hideSubMenu();
		}, 200);
	},
	
	_doMenuClick: function(omi) {
		var Z = this,
			itemCfg = Z._getItemById(Z._items, omi.id);
		if (itemCfg.disabled) {
			return;
		}
		Z._hideSubMenu();
		if(itemCfg.onClick) {
			itemCfg.onClick(itemCfg);
		}
		if(Z._onItemClick) {
			Z._onItemClick(itemCfg);
		}
	},
	
	resize: function(){
		var Z = this,
			jqEl = jQuery(Z.el),
			height = jqEl.height();
		if (height === Z.oldHeight){
			return;
		}
		Z.oldHeight = height;
		var jqItems = jqEl.find('.jl-smb-items');
		jqItems.height(height);
		var containerHeight = jqItems.innerHeight();
		if(jqItems[0].scrollHeight <= containerHeight) {
			jqEl.find('.jl-smb-up').hide();
			jqEl.find('.jl-smb-down').hide();
			return;
		}
		if(jqItems.scrollTop() > 0) {
			jqEl.find('.jl-smb-up').show();
		}
		jqEl.find('.jl-smb-down').show();
		var visiCnt = Math.floor(containerHeight / Z._itemHeight);
		var lastItemH = containerHeight - visiCnt * Z._itemHeight;
		jqEl.find('.jl-smb-lastbaritem').css('height', lastItemH + 'px');
	},
	
	/**
	 * @protected
	 * 
	 * Run when container size changed, it's revoked by jslet.ui.resizeEventBus.
	 * 
	 */
	checkSizeChanged: function(){
		this.resize();
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		jslet.ui.resizeEventBus.unsubscribe(Z);
		Z._clearShowTimeout();
		Z._activeMenuItem = null;
		Z._preHoverItem = null;
		Z._menubarclick = null;
		Z._onItemClick = null;
		var jqEl = jQuery(Z.el);
		jqEl.off();
		jQuery('#' + Z._containerId).off();
		$super();
	}
});
jslet.ui.register('SideMenuBar', jslet.ui.SideMenuBar);
jslet.ui.SideMenuBar.htmlTemplate = '<div></div>';


/**
 * @class 
 * @extend jslet.ui.Control
 * 
 * Split Panel. Example:
 * 
 *     @example
 *     var jsletParam = {type:"SplitPanel",direction:"hori",floatIndex: 1};
 *     //1. Binding:
 *       <div data-jslet='jsletParam' style="width: 300px; height: 400px;">
 *         <div>content1</div>
 *         <div>content2</div>
 *       </div>
 *     
 *     //2. Binding on fly
 *       <div id='ctrlId'>
 *         <div>content1</div>
 *         <div>content2</div>
 *       </div>
 *     //Js snippet
 *       var el = document.getElementById('ctrlId');
 *       jslet.ui.bindControl(el, jsletParam);
 *	
 *     //3. Create dynamically
 *       jslet.ui.createControl(jsletParam, document.body);
 *
 */
jslet.ui.SplitPanel = jslet.Class.create(jslet.ui.Control, {
	directions: ['hori', 'vert'],
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,direction,floatIndex,onExpanded,onResize';

		Z._direction = 'hori';

		Z._floatIndex = 1;
		
		Z._onExpanded = null;
		
		Z._onResize = null;
		
		Z.panels = null; //Array, panel configuration, {size:100, maxSize: 100, minSize:10}

		Z._oldSize = 0;
		
		Z._oldHeight = 0;
		
		Z._oldWidth = 0;
		
		Z._changeFloatSizeDebounce = jslet.debounce(Z._changeFloatSize, 110);

		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get float panel index, only one panel can be a floating panel.
	 * 
	 * @param {Integer | undefined} index float panel index.
	 * 
	 * @return {this | Integer}
	 */
	floatIndex: function(index) {
		if(index === undefined) {
			return this._floatIndex;
		}
		jslet.Checker.test('SplitPanel.floatIndex', index).isGTEZero();
		this._floatIndex = index;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get Split direction, optional value: 'hori', 'vert'. Default value is 'hori'
	 * 
	 * @param {String | undefined} direction optional value: 'hori', 'vert'.
	 * 
	 * @return {this | String}
	 */
	direction: function(direction) {
		if(direction === undefined) {
			return this._direction;
		}
		direction = jQuery.trim(direction);
		var checker = jslet.Checker.test('SplitPanel.direction', direction).required().isString();
		direction = direction.toLowerCase();
		checker.inArray(this.directions);
		this._direction = direction;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when user expand/collapse one panel.. Example:
	 * 
	 *     @example
	 *     splitter.onExpanded(function(panelIndex){}); 
	 *
	 * @param {Function | undefined} onExpanded Expanded event handler.
	 * @param {Integer} onExpanded.panelIndex The changing panel index.
	 * 
	 * @return {this | Function}
	 */
	onExpanded: function(onExpanded) {
		if(onExpanded === undefined) {
			return this._onExpanded;
		}
		jslet.Checker.test('SplitPanel.onExpanded', onExpanded).isFunction();
		this._onExpanded = onExpanded;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired after user change size of one panel. Example:
	 * 
	 *     @example
	 *     splitter.onResize(function(panelIndex, newSize){}); 
	 *
	 * @param {Function | undefined} onResize Resize event handler.
	 * @param {Integer} onResize.panelElement The changing panel element.
	 * 
	 * @return {this | Function}
	 */
	onResize: function(onResize) {
		if(onResize === undefined) {
			return this._onResize;
		}
		jslet.Checker.test('SplitPanel.onResize', onResize).isFunction();
		this._onResize = onResize;
		return this;
	},
   
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this, 
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-splitpanel')) {
			jqEl.addClass('jl-splitpanel jl-border-box jl-round5');
		}
		this.renderAll();
		jslet.ui.resizeEventBus.subscribe(Z);
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, jqEl = jQuery(Z.el);
		Z._isHori = (Z._direction == 'hori');
		Z._splitterClsName = Z._isHori ? 'jl-sp-splitter-hori': 'jl-sp-splitter-vert';
		jqEl.off();
		jqEl.on('mousedown', '.' + Z._splitterClsName, Z._splitterMouseDown);
		jqEl.on('click', '.jl-sp-button', function(event){
			var jqBtn = jQuery(event.currentTarget),
				jqSplitter = jqBtn.parent(),
				index = parseInt(jqSplitter.attr('jsletindex'));
			Z.expand(index);
			event.stopPropagation();
		});
		
		var panelDivs = jqEl.find('>div'),
			lastIndex = panelDivs.length - 1;
		if (!Z._floatIndex && Z._floatIndex !== 0 || Z._floatIndex > lastIndex) {
			Z._floatIndex = lastIndex;
		}
		if (Z._floatIndex > lastIndex) {
			Z._floatIndex = lastIndex;
		}
		if (!Z.panels) {
			Z.panels = [];
		}

		panelDivs.each(function(k){
			var jqPanel = jQuery(panelDivs[k]),
				oPanel = Z.panels[k];
			if (!oPanel){
				oPanel = {};
				Z.panels[k] = oPanel;
			}

			var minSize = parseInt(jqPanel.css(Z._isHori ?'min-width': 'min-height'));
			oPanel.minSize = minSize ? minSize : 5;
			
			var maxSize = parseInt(jqPanel.css(Z._isHori ?'max-width': 'max-height'));
			oPanel.maxSize = maxSize ? maxSize : Infinity;
			oPanel.expanded = jqPanel.css('display') != 'none';
			
			var size = oPanel.size;
			if (size !== null && size !== undefined) {
				if (Z._isHori) {
					jqPanel.outerWidth(size - 5);
				} else {
					jqPanel.outerHeight(size - 5);
				}
			}
		});
		Z.width = jqEl.innerWidth();
		Z.height = jqEl.innerHeight();
		
		Z._splitterTracker = document.createElement('div');
		var jqTracker = jQuery(Z._splitterTracker);
		jqTracker.addClass('jl-sp-splitter-tracker');
		var fixedSize = 0,
			clsName = Z._isHori ? 'jl-sp-panel-hori': 'jl-sp-panel-vert';
		Z.el.appendChild(Z._splitterTracker);
		if (Z._isHori) {
			Z._splitterTracker.style.height = '100%';
		} else {
			Z._splitterTracker.style.width = '100%';
		}
		var splitterSize = parseInt(jslet.ui.getCssValue(Z._splitterClsName, Z._isHori? 'width' : 'height'));
		panelDivs.after(function(k){
			var panel = panelDivs[k],
				jqPanel = jQuery(panel),
				expanded = Z.panels[k].expanded;
			if (Z._isHori) {
				jqPanel.outerHeight(Z.height);
			}
			jqPanel.addClass(clsName);

			if (k === Z._floatIndex) {
				Z.floatPanel = panel;
			} else {
				if (expanded) {
					fixedSize += splitterSize + Z.panels[k].size;
				} else {
					jqPanel.css('display', 'none');
					fixedSize += splitterSize;
				}
			}
			if (k === lastIndex){
				if (Z._isHori) {
					return '<div style="clear:both;width:0px"></div>';
				}
				return '';
			}
			var id = jslet.nextId(),
				minBtnCls = Z._isHori ? 'fa-caret-left' : 'fa-caret-up';
				
			if (Z._floatIndex <= k || !expanded) {
				minBtnCls += Z._isHori ? ' fa-caret-right' : ' fa-caret-down';
			}
			return '<div class="'+ Z._splitterClsName + ' jl-unselectable" id = "' + id + 
			'" jsletindex="'+ (k >= Z._floatIndex ? k+1: k)+ '"><div class="jl-sp-button ' +  
			(Z._isHori? 'jl-sp-button-hori': 'jl-sp-button-vert')+ '"' + 
			(expanded ? '': ' jsletcollapsed="1"') +'><i class="fa ' + 
			minBtnCls  + '" aria-hidden="true"></i></div></div>';
		});
		var splitters = jqEl.find('.' + Z._splitterClsName);
		if (Z._isHori) {
			splitters.outerHeight(Z.height);
		}

		var oSplitter;
		for(var i = 0, cnt = splitters.length; i < cnt; i++){
			oSplitter = splitters[i];
			oSplitter._doDragStart = Z._splitterDragStart;
			oSplitter._doDragging = Z._splitterDragging;
			oSplitter._doDragEnd = Z._splitterDragEnd;
			oSplitter._doDragCancel = Z._splitterDragCancel;
		}
		Z._changeFloatSize();
	},
	
	_changeFloatSize: function(visiblePanel) {
		var Z = this,
			jqEl = jQuery(Z.el),
			panelDivs = jqEl.find('>div'),
			fixedSize = 0,
			panelCnt = Z.panels.length * 2;
		
		panelDivs.each(function(k){
			if(k >= panelCnt) {
				return;
			}
			var jqPanel = jQuery(this);
			if(this !== Z.floatPanel && (visiblePanel === this || jqPanel.css('display') != 'none')) {
				fixedSize += Z._isHori ? jqPanel.outerWidth(true) : jqPanel.outerHeight(true);
			}
		});
		var floatSize, floatMinSize = 5;
		var panelCfg = Z.panels[Z._floatIndex];
		if(panelCfg) {
			floatMinSize = panelCfg.minSize? panelCfg.minSize: 5;
		}
		if(Z._isHori) {
			floatSize = jqEl.innerWidth() - fixedSize - 6;
			if(floatSize < floatMinSize) {
				floatSize = floatMinSize;
			}
			jQuery(Z.floatPanel).outerWidth(floatSize);
		} else {
			floatSize = jqEl.innerHeight() - fixedSize - 6;
			if(floatSize < floatMinSize) {
				floatSize = floatMinSize;
			}
			jQuery(Z.floatPanel).outerHeight(floatSize);
		}
	},
	
	/**
	 * Expand or collapse the specified panel. Example:
	 * 
	 *     @example
	 *     splitter.expand(1, true); //Expand the second panel.
	 *     splitter.expand(0, false); //Collapse the first panel.
	 * 
	 * 
	 * @param {Integer} index Panel index.
	 * @param {Boolean} expanded True for expanded, false otherwise.
	 */
	expand: function(index, expanded, notChangeSize){
		var Z = this, jqPanel, jqEl = jQuery(Z.el),
			splitters = jqEl.find('.'+Z._splitterClsName);
		if (index < 0 || index > splitters.length) {
			return;
		}
		var	jqSplitter = jQuery(splitters[(index >= Z._floatIndex ? index - 1: index)]),
			jqBtn = jqSplitter.find(':first-child');
			
		if (expanded === undefined) {
			expanded  = jqBtn.attr('jsletcollapsed')=='1';
		}
		if (index < Z._floatIndex) {
			jqPanel = jqSplitter.prev();
		} else {
			jqPanel = jqSplitter.next();
		}
		var jqIcon = jqBtn.find(':first-child');
		if (Z._isHori){
			if (jqIcon.hasClass('fa-caret-right')) {
				jqIcon.removeClass('fa-caret-right');
				jqIcon.addClass('fa-caret-left');
			} else {
				jqIcon.removeClass('fa-caret-left');
				jqIcon.addClass('fa-caret-right');
			}
		} else {
			if (jqIcon.hasClass('fa-caret-down')) {
				jqIcon.removeClass('fa-caret-down');
				jqIcon.addClass('fa-caret-up');
			} else {
				jqIcon.removeClass('fa-caret-up');
				jqIcon.addClass('fa-caret-down');
			}
		}

		if (expanded){
			Z._changeFloatSize(jqPanel[0]);
			jqPanel.css('display', 'block');
			jqBtn.attr('jsletcollapsed', '0');
		}else{
			jqPanel.css('display','none');
			jqBtn.attr('jsletcollapsed', '1');
			Z._changeFloatSize();
		}
		if(notChangeSize) {
			return;
		}
		Z.panels[index].expanded = expanded;
		if (Z._onExpanded) {
			Z._onExpanded.call(Z, index);
		}
		jslet.ui.resizeEventBus.resize(Z.el);
	},
	
	_splitterMouseDown: function(event){
		var pos = jQuery(this).position(),
			Z = this.parentNode.jslet;
		Z._splitterTracker.style.top = pos.top + 'px';
		Z._splitterTracker.style.left = pos.left + 'px';
		Z._draggingId = this.id;
		var jqSplitter = jQuery('#'+Z._draggingId),
			jqBtn = jqSplitter.find(':first-child');
		if(jqBtn.attr('jsletcollapsed')=='1') { //Collapsed
			jqBtn.click();
			return;
		}
		
		jslet.ui.dnd.bindControl(this);
	},
		
	_splitterDragStart: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z._splitterTracker),
			jqSplitter = jQuery('#'+Z._draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			jqPanel = index < Z._floatIndex ? jqSplitter.prev(): jqSplitter.next(),
			cfg = Z.panels[index],
			jqFp = jQuery(Z.floatPanel);
		
		var panelSize = Z._isHori ? jqPanel.outerWidth(true) : jqPanel.outerHeight(true);
		Z._dragRangeMin = panelSize  - cfg.minSize;
		Z._dragRangeMax = cfg.maxSize - panelSize;
		var fpMax = (Z._isHori ? jqFp.outerWidth(true) : jqFp.outerHeight(true)) - Z.panels[Z._floatIndex].minSize;
		if (Z._dragRangeMax > fpMax) {
			Z._dragRangeMax = fpMax;
		}
		jqTracker.show();
	},
	
	_splitterDragging: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z._splitterTracker),
			jqSplitter = jQuery('#'+Z._draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			delta = Math.abs(Z._isHori ? deltaX : deltaY),
			expanded;
			
		if (Z._isHori) {
			expanded = index < Z._floatIndex && deltaX >= 0 || index > Z._floatIndex && deltaX < 0;
		} else {
			expanded = index < Z._floatIndex && deltaY >= 0 || index > Z._floatIndex && deltaY < 0;
		}
		if (expanded && delta > Z._dragRangeMax){
			Z.endDelta = Z._dragRangeMax;
			return;
		}
		
		if (!expanded && delta > Z._dragRangeMin){
			Z.endDelta = Z._dragRangeMin;
			return;
		}
		
		Z.endDelta = Math.abs(Z._isHori ? deltaX : deltaY);
		var pos = jqTracker.offset();
		if (Z._isHori) {
			pos.left = x;
		} else {
			pos.top = y;
		}
		jqTracker.offset(pos);
	},
	
	_splitterDragEnd: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z._splitterTracker),
			jqSplitter = jQuery('#'+Z._draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			jqPanel = index < Z._floatIndex ? jqSplitter.prev(): jqSplitter.next(),
			expanded,
			jqFp = jQuery(Z.floatPanel);

		if (Z._isHori) {
			expanded = index < Z._floatIndex && deltaX >= 0 || index > Z._floatIndex && deltaX < 0;
		} else {
			expanded = index < Z._floatIndex && deltaY >= 0 || index > Z._floatIndex && deltaY < 0;
		}
		var delta = Z.endDelta * (expanded ? 1: -1);
		
		if (Z._isHori) {
			if(delta < 0) {
				jqPanel.outerWidth(jqPanel.outerWidth() + delta);
				jqFp.outerWidth(jqFp.outerWidth() - delta);
			} else {
				jqFp.outerWidth(jqFp.outerWidth() - delta);
				jqPanel.outerWidth(jqPanel.outerWidth() + delta);
			}
		} else {
			if(delta < 0) { 
				jqPanel.outerHeight(jqPanel.outerHeight() + delta);
				jqFp.outerHeight(jqFp.outerHeight() - delta);
			} else {
				jqFp.outerHeight(jqFp.outerHeight() - delta);
				jqPanel.outerHeight(jqPanel.outerHeight() + delta);
			}
		}
		if (Z._onResize) {
			Z._onResize.call(Z, jqPanel[0]);
		}
		jslet.ui.resizeEventBus.resize(Z.el);
		jqTracker.hide();
	},
	
	_splitterDragCancel: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z._splitterTracker);
		jqTracker.hide();
	},
	
	/**
	 * Run when container size changed, it's revoked by jslet.ui.resizeEventBus.
	 * 
	 */
	checkSizeChanged: function(){
		var Z = this,
			jqEl = jQuery(Z.el),
			currWidth = jqEl.innerWidth(),
			currHeight = jqEl.innerHeight();
		if (Z._isHori && currWidth !== Z._oldWidth ||
			!Z._isHori && currHeight !== Z._oldHeight) {
			Z._changeFloatSizeDebounce();
		}
		if(Z._oldWidth != currWidth || Z._oldHeight != currHeight) {
			jslet.ui.resizeEventBus.resize(Z.el);
		}
		Z._oldWidth = currWidth;
		Z._oldHeight = currHeight;
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this,
		jqEl = jQuery(Z.el);
		Z._splitterTracker = null;
		Z._draggingId = null;
		Z.floatPanel = null;
		var splitters = jqEl.find('.'+Z._splitterClsName);
		splitters.off('mousedown', Z._splitterMouseDown);
		Z._splitterMouseDown = null;
		var item;
		for(var i = 0, cnt = splitters.length; i < cnt; i++){
			item = splitters[i];
			jslet.ui.dnd.unbindControl(item);
			item._doDragStart = null;
			item._doDragging = null;
			item._doDragEnd = null;
			item._doDragCancel = null;
		}
		jslet.ui.resizeEventBus.unsubscribe(Z);
		$super();
	}
});

jslet.ui.register('SplitPanel', jslet.ui.SplitPanel);
jslet.ui.SplitPanel.htmlTemplate = '<div></div>';

/**
 * @class 
 * @extend jslet.ui.Control
 * 
 * TabControl. Example:
 * 
 *     @example
 *     var jsletParam = {type: "TabControl", 
 *       activeIndex: 1, 
 *       onCreateContextMenu: doCreateContextMenu, 
 *       items: [
 *         {header: "one", userIFrame: true, url: "http://www.google.com", iconClass: "tabIcon"},
 *         {header: "two", closable: true, divId: "p2"},
 *         {header:"three",closable:true,divId:"p3"},
 *       ]};
 *     //1. Binding:
 *     <div data-jslet='jsletParam' style="width: 300px; height: 400px;" />
 *
 *     //2. Binding on fly
 *     <div id='ctrlId' />
 *     //Js snippet
 *     var el = document.getElementById('ctrlId');
 *     jslet.ui.bindControl(el, jsletParam);
 *	
 *     //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.TabControl = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,activeIndex,newable,closable,items,isFixedHeight,hasContent,onAddTabItem,onActiveIndexChanged,onRemoveTabItem,onCreateContextMenu,onContentLoading,onContentLoaded,enableLoading';
		
		Z._activeIndex = -1;
		
		Z._newable = true;
		
		Z._closable = true;
		
		Z._onActiveIndexChanged = null;
		
		Z._onAddTabItem = null;
		
		Z._onRemoveTabItem = null;
		
		Z._onCreateContextMenu = null;
		
		Z._items = [];
		
		Z._hasContent = true;
		
		Z._isFixedHeight = false;
		
		Z._itemsWidth = [];
		Z._containerWidth = 0;
		Z._ready = false;
		
		Z._leftIndex = 0;
		Z._rightIndex = 0;
		Z._maxHeaderWidth = 160;
		Z._tabControlWidth = jQuery(Z.el).width();
		Z._tabControlHeight = jQuery(Z.el).height();
		Z._contextItemIndex = 0;
		
		Z._onContentLoading = null;
		Z._onContentLoaded = null;
		
		Z._enableLoading = false;
		
		$super(el, params);
	},

	/**
	 * Set or get active tab item index.
	 * 
	 * @param {Integer | undefined} index active tabItem index.
	 * 
	 * @return {this | Integer}
	 */
	activeIndex: function(index) {
		if(index === undefined) {
			return this._activeIndex;
		}
		jslet.Checker.test('TabControl.activeIndex', index).isGTEZero();
		if(this._ready) {
			this._chgActiveIndex(index);
		} else {
			this._activeIndex = index;
		}
		return this;
	},
	
	/**
	 * Set or get active tab item id.
	 * 
	 * @param {String | undefined} itemId active tabItem id.
	 * 
	 * @return {this | String}
	 */
	activeItemId: function(itemId) {
		var Z = this;
		if(itemId === undefined) {
			var itemCfg = Z._items[this._activeIndex];
			if(itemCfg) {
				return itemCfg.id;
			}
			return null;
		}
		jslet.Checker.test('TabControl.activeItemId', itemId).isString();
		if(this._ready) {
			var items = Z._items;
			for(var i = 0, len = items.length; i < len; i++) {
				if(itemId === items[i].id) {
					this._chgActiveIndex(i);
					break;
				}
			}
		}
		return this;
	},
	
	/**
	 * Get active tab item configuration.
	 * 
	 * @return {jslet.ui.TabItem}
	 */
	activeItem: function() {
		var items = this._items;
		if(items && items.length > 0) {
			return this._items[this._activeIndex || 0];
		}
		return null;
	},
	
	/**
	 * Identify whether user can add tab item on fly.
	 * 
	 * @param {Boolean | undefined} newable True(default) - user can add tab item on fly, false - otherwise.
	 * 
	 * @return {this | Boolean} 
	 */
	newable: function(newable) {
		if(newable === undefined) {
			return this._newable;
		}
		this._newable = newable? true: false;
		return this;
	},
	
	/**
	 * Identify if user can close tab item on fly.
	 * 
	 * @param {Boolean | undefined} closable True(default) - user can close tab item on fly, false - otherwise.
	 * 
	 * @return {this | Boolean} 
	 */
	closable: function(closable) {
		if(closable === undefined) {
			return this._closable;
		}
		this._closable = closable? true: false;
		return this;
	},
	
	/**
	 * Identify if the TabControl has content panel. Sometimes, you only need the TabControl which is without content panel. 
	 * 
	 * @param {Boolean | undefined} hasContent True(default) - TabControl has content panel, false - otherwise.
	 * 
	 * @return {this | Boolean} 
	 */
	hasContent: function(hasContent) {
		if(hasContent === undefined) {
			return this._hasContent;
		}
		this._hasContent = hasContent? true: false;
		return this;
	},
	
	/**
	 * Identify whether the height of TabPanel is same. 
	 * 
	 * @param {Boolean | undefined} isFixedHeight True - the height of TabPanel is same, false(default) - otherwise.
	 * 
	 * @return {this | Boolean} 
	 */
	isFixedHeight: function(isFixedHeight) {
		if(isFixedHeight === undefined) {
			return this._isFixedHeight;
		}
		this._isFixedHeight = isFixedHeight? true: false;
		return this;
	},
	
	/**
	 * Identify whether enable loading icon when open a tab panel. 
	 * 
	 * @param {Boolean | undefined} enableLoading True - enable loading icon, false(default) - otherwise.
	 * 
	 * @return {this | Boolean} 
	 */
	enableLoading: function(enableLoading) {
		if(enableLoading === undefined) {
			return this._enableLoading;
		}
		this._enableLoading = enableLoading? true: false;
		return this;
	},
	
	/**
	 * Fired after add a new tab item.
	 * Pattern: 
	 *   function(){}
	 *   
	 * @param {Function | undefined} onAddTabItem tab item added event handler.
	 * 
	 * @return {this | Function} 
	 */
	onAddTabItem: function(onAddTabItem) {
		if(onAddTabItem === undefined) {
			return this._onAddTabItem;
		}
		jslet.Checker.test('TabControl.onAddTabItem', onAddTabItem).isFunction();
		this._onAddTabItem = onAddTabItem;
		return this;
	},
	
	/**
	 * Fired when user toggle tab item.
	 * Pattern: 
	 *   function(oldIndex, newIndex){}
	 *   //oldIndex: Integer
	 *   //newIndex: Integer
	 *   
	 * @param {Function | undefined} onActiveIndexChanged tab item active event handler.
	 * 
	 * @return {this | Function} 
	 */
	onActiveIndexChanged: function(onActiveIndexChanged) {
		if(onActiveIndexChanged === undefined) {
			return this._onActiveIndexChanged;
		}
		jslet.Checker.test('TabControl.onActiveIndexChanged', onActiveIndexChanged).isFunction();
		this._onActiveIndexChanged = onActiveIndexChanged;
		return this;
	},

	/**
	 * Fired after remove a tab item.
	 * Pattern: 
	 *  function(tabItemIndex, active){}
	 *  //tabItemIndex: Integer
	 *  //active: Boolean Identify if the removing item is active
	 *  //return: Boolean, false - cancel removing tab item, true - remove tab item. 
	 *   
	 * @param {Function | undefined} onRemoveTabItem tab item removed event handler.
	 * 
	 * @return {this | Function}
	 */
	onRemoveTabItem: function(onRemoveTabItem) {
		if(onRemoveTabItem === undefined) {
			return this._onRemoveTabItem;
		}
		jslet.Checker.test('TabControl.onRemoveTabItem', onRemoveTabItem).isFunction();
		this._onRemoveTabItem = onRemoveTabItem;
		return this;
	},

	/**
	 * Fired before show context menu.
	 * Pattern: 
	 *   function(menuItems){}
	 *   //menuItems: Array of MenuItem, see menu item configuration in jslet.ui.menu.js.
	 *   
	 * @param {Function | undefined} onCreateContextMenu creating context menu event handler.
	 * 
	 * @return {this | Function} 
	 */
	onCreateContextMenu: function(onCreateContextMenu) {
		if(onCreateContextMenu === undefined) {
			return this._onCreateContextMenu;
		}
		jslet.Checker.test('TabControl.onCreateContextMenu', onCreateContextMenu).isFunction();
		this._onCreateContextMenu = onCreateContextMenu;
		return this;
	},
	 
	/**
	 * Fired before loading content of tab item;
	 * Pattern: 
	 *   function(contentId, itemCfg){}
	 *   //contentId: {String} the content element's id.
	 *   //itemCfg: {Plan Object} tab item config
	 *   
	 * @param {Function | undefined} onContentLoading before loading tab panel content handler.
	 * 
	 * @return {this | Function} 
	 */
	onContentLoading: function(onContentLoading) {
		if(onContentLoading === undefined) {
			return this._onContentLoading;
		}
		jslet.Checker.test('TabControl.onContentLoading', onContentLoading).isFunction();
		this._onContentLoading = onContentLoading;
		return this;
	},
	 
	/**
	 * Fired after loading content of tab item;
	 * Pattern: 
	 *   function(contentId, itemCfg){}
	 *   //contentId: {String} the content element's id.
	 *   //itemCfg: {Plan Object} tab item config
	 *   
	 * @param {Function | undefined} onContentLoading after loading tab panel content handler.
	 * 
	 * @return {this | Function} 
	 */
	onContentLoaded: function(onContentLoaded) {
		if(onContentLoaded === undefined) {
			return this._onContentLoaded;
		}
		jslet.Checker.test('TabControl.onContentLoaded', onContentLoaded).isFunction();
		this._onContentLoaded = onContentLoaded;
		return this;
	},
	 
	/**
	 * Set or get tab item configuration.
	 * 
	 * @param {jslet.ui.TabItem[] | undefined} items tab items.
	 * 
	 * @return {this | jslet.ui.TabItem[]}
	 */
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		jslet.Checker.test('TabControl.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('TabControl.items.header', item.header).isString().required();
		}
		this._items = items;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jslet.ui.resizeEventBus.subscribe(this);
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		function innerAdd(itemCfg) {
			if (!itemCfg) {
				return;
			}
			Z.addTabItem(itemCfg);
			Z._calcItemsWidth();
			Z.activeIndex(Z._items.length - 1);
		}
		
		Z._createContextMenu();

		var	template = [
			'<div class="jl-tab-header jl-unselectable"><div class="jl-tab-container jl-unselectable"><ul class="jl-tab-list">',
			Z._newable ? '<li><a href="javascript:;" class="jl-tab-inner"><span class="jl-tab-new">+</span></a></li>' : '',
			'</ul></div><a class="jl-tab-left jl-hidden"><span class="jl-nav-btn fa fa-arrow-circle-left"></span></a><a class="jl-tab-right jl-hidden"><span class="jl-nav-btn fa fa-arrow-circle-right"></span></a></div>',
			'<div class="jl-tab-panels jl-round5 jl-hidden' + (Z._isFixedHeight ? ' jl-tab-panels-fixed': '') + ' "',
			Z._hasContent? '': ' style="border: 0;height:0"',
			'></div>'];

		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-tabcontrol')) {
			jqEl.addClass('jl-tabcontrol jl-round5');
		}
		jqEl.html(template.join(''));
		if (Z._newable) {
			var oul = jqEl.find('.jl-tab-list')[0];
			var newTab = oul.childNodes[oul.childNodes.length - 1];
			Z._newTabItem = newTab;
			
			newTab.onclick = function () {
				if (!Z._onAddTabItem) {
					return;
				}
				var	itemCfg = Z._onAddTabItem.call(Z);
				if(jslet.isPromise(itemCfg)) {
					itemCfg.done(function(result) {
						innerAdd(result);
					});
				} else {
					innerAdd(itemCfg);
				}
			};
		}

		var jqNavBtn = jqEl.find('.jl-tab-left');
		
		jqNavBtn.on("click",function (event) {
			Z._setVisiTabItems(Z._leftIndex - 1);
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		jqNavBtn.on("mousedown",function (event) {
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		jqNavBtn = jqEl.find('.jl-tab-right');

		jqNavBtn.on("click",function (event) {
			Z._setVisiTabItems(Z._leftIndex + 1);
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		jqNavBtn.on("mousedown",function (event) {
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		
		if (Z._items && Z._items.length > 0) {
			var oitem, 
				cnt = Z._items.length;
			for (var i = 0; i < cnt; i++) {
				oitem = Z._items[i];
				Z._renderTabItem(oitem);
			}
			Z._activeIndex = 0;
		}
		Z._calcItemsWidth();
		Z._ready = true;
		Z._chgActiveIndex(Z._activeIndex);
		Z._checkTabItemCount();
	},

	addItem: function (itemCfg) {
		this._items[this._items.length] = itemCfg;
	},

	/**
	 * Change tab item's header.
	 * 
	 * @param {Integer} index - tab item index.
	 * @param {String} header - tab item header.
	 */
	tabHeader: function(index, header) {
		jslet.Checker.test('tabHeader#index', index).isGTEZero();
		jslet.Checker.test('tabHeader#label', header).required().isString();
		
		var Z = this;
		var itemCfg = Z._getTabItemCfg(index);
		if(!itemCfg) {
			return;
		}

		itemCfg.header = header;
		var jqEl = jQuery(Z.el);
		var panelContainer = jqEl.find('.jl-tab-list')[0];
		var nodes = panelContainer.childNodes;
		jQuery(nodes[index]).find('.jl-tab-title').html(header);
		Z._calcItemsWidth();
	},
	
	/**
	 * Disable tab item.
	 * 
	 * @param {Integer} index - tab item index.
	 * @param {Boolean} disabled - true - disabled, false - otherwise.
	 */
	tabDisabled: function(index, disabled) {
		jslet.Checker.test('tabDisabled#index', index).isGTEZero();
		var Z = this;
		var itemCfg = Z._getTabItemCfg(index);
		if(!itemCfg) {
			return;
		}
		if(index == Z._activeIndex) {
			console.warn('Cannot set current tab item to disabled.');
			return;
		}
		itemCfg.disabled(disabled);
		var jqEl = jQuery(Z.el),
			jqPanels = jqEl.find('.jl-tab-panels'),
			panelContainer = jqPanels[0],
			nodes = panelContainer.childNodes,
			jqItem = jQuery(nodes[index]);
		if(disabled) {
			jqItem.addClass('jl-tab-disabled');
		} else {
			jqItem.removeClass('jl-tab-disabled');
		}
	},
	
	_checkTabItemCount: function() {
		var Z = this,
			jqTabPanels = jQuery(Z.el).find('.jl-tab-panels');
		if(!Z._items || Z._items.length === 0) {
			if(!jqTabPanels.hasClass('jl-hidden')) {
				jqTabPanels.addClass('jl-hidden');
			}
		} else {
			jqTabPanels.removeClass('jl-hidden');

		} 
	},
	
	/*
	 * Change active tab item.
	 * 
	 * @param {Integer} index Tab item index which will be toggled to.
	 */
	_chgActiveIndex: function (index) {
		var Z = this;
		
		function innerChgActiveIndex() {
			var jqEl = jQuery(Z.el),
				oli, 
				oul = jqEl.find('.jl-tab-list')[0],
				nodes = oul.childNodes,
				cnt = nodes.length - (Z._newable ? 2 : 1);
	
			var itemContainer = jqEl.find('.jl-tab-panels')[0],
				item,
				items = itemContainer.childNodes;
			for (var i = 0; i <= cnt; i++) {
				oli = jQuery(nodes[i]);
				item = items[i];
				if (i === index) {
					oli.addClass('jl-tab-active');
					item.style.display = 'block';
					//To fix Chrome bug: scrollbar disappeared.
					var oIframe = item.childNodes[0];
					if(oIframe.tagName == 'IFRAME') {
						item.style.overflow = 'hidden';
						var oldHeight = oIframe.style.height;
						oIframe.style.height = "0";
						/* jshint ignore:start */
						oIframe.scrollWidth;
						/* jshint ignore:end */
						oIframe.style.height = oldHeight || "100%";
					}
				} else {
					oli.removeClass('jl-tab-active');
					item.style.display = 'none';
				}
			}
			Z._activeIndex = index;
			if(index < Z._leftIndex || index >= Z._rightIndex) {
				Z._setVisiTabItems(null, Z._activeIndex);
			}
		}
	
		var itemCfg = Z._getTabItemCfg(index);
		if(!itemCfg || itemCfg.disabled) {
			return;
		}
		if (index != Z._activeIndex && Z._onActiveIndexChanged) {
			var result = Z._onActiveIndexChanged.call(Z, Z._activeIndex, index);
			if(jslet.isPromise(result)) {
				result.done(function(canChanged) {
					if(canChanged === undefined || canChanged) {
						innerChgActiveIndex();
					}
				});
			} else {
				if(result === undefined || result) {
					innerChgActiveIndex();
				}
			}
		} else {
			innerChgActiveIndex();
		}
	},
	
	_getTabItemCfg: function(index) {
		var Z = this;
		if(Z._items.length <= index) {
			return null;
		}
		return Z._items[index];
	},
	
	_calcItemsWidth: function() {
		var Z = this,
			jqEl =jQuery(Z.el),
			nodes = jqEl.find('.jl-tab-list').children();
		Z._itemsWidth = [];
		Z._totalItemsWidth = 0;
		nodes.each(function(index){
			var w = jQuery(this).outerWidth() + 5;
			Z._itemsWidth[index] = w;
			Z._totalItemsWidth += w;
		});

		Z._containerWidth = jqEl.find('.jl-tab-container').innerWidth();
		Z._setNavBtnVisible();
	},
	
	_setVisiTabItems: function(leftIndex, rightIndex) {
		var Z = this, w, i, len;
		if(!leftIndex && leftIndex !== 0) {
			if(!rightIndex) {
				return;
			}
			if(Z._newable) {
				rightIndex++;
			}
			w = Z._itemsWidth[rightIndex];
			Z._leftIndex = rightIndex;
			for(i = rightIndex - 1; i >= 0; i--) {
				w += Z._itemsWidth[i];
				if(w > Z._containerWidth) {
					Z._leftIndex = i + 1;
					break;
				}
				Z._leftIndex = i;
			}
			leftIndex = Z._leftIndex;
		} else {
			Z._leftIndex = leftIndex;
		}
		w = 0;
		Z._rightIndex = leftIndex;
		for(i = leftIndex, len = Z._itemsWidth.length; i < len; i++) {
			w += Z._itemsWidth[i];
			if(w > Z._containerWidth) {
				Z._rightIndex = i - 1;
				break;
			}
			Z._rightIndex = i;
		}
		var leftPos = 0;
		for(i = 0; i < Z._leftIndex; i++) {
			leftPos += Z._itemsWidth[i];
		}
		leftPos += 5;
		var jqEl = jQuery(Z.el);
		jqEl.find('.jl-tab-container').scrollLeft(jsletlocale.isRtl ? 50000 - leftPos: leftPos);
		Z._setNavBtnVisible();
	},
	
	_setNavBtnVisible: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			jqBtnLeft = jqEl.find('.jl-tab-left'),
			isHidden = jqBtnLeft.hasClass('jl-hidden');
		if(Z._leftIndex > 0 && Z._totalItemsWidth > Z._containerWidth) {
			if(isHidden) {
				jqBtnLeft.removeClass('jl-hidden');
			}
		} else {
			if(!isHidden) {
				jqBtnLeft.addClass('jl-hidden');
			}
		}
		var jqBtnRight = jqEl.find('.jl-tab-right');
		var totalCnt = Z._itemsWidth.length;
		isHidden = jqBtnRight.hasClass('jl-hidden');
		if(Z._rightIndex < totalCnt - 1 && Z._totalItemsWidth > Z._containerWidth) {
			if(isHidden) {
				jqBtnRight.removeClass('jl-hidden');
			}
		} else {
			if(!isHidden) {
				jqBtnRight.addClass('jl-hidden');
			}
		}
	},
	
	_createHeader: function (parent, itemCfg) {
		var Z = this,
			canClose = Z._closable && itemCfg.closable,
			tmpl = [];
		
		if(Z._enableLoading) {
			tmpl.push('<div class="jl-tab-loading jl-hidden"><i class="fa fa-spinner fa-pulse fa-fw"></i></div>');
		}
		tmpl.push('<a href="javascript:;" class="jl-tab-inner' + (canClose? ' jl-tab-close-loc': '') + 
		        '" onclick="javascript:this.blur();" title="' + itemCfg.header + '">');

		tmpl.push('<span class="jl-tab-icon ' + (itemCfg.iconClass || '') + '"></span>');

		tmpl.push('<span class="jl-tab-title">');
		tmpl.push(itemCfg.header);
		tmpl.push('</span>');
		tmpl.push('<span class="fa fa-times close jl-tab-close' + (!canClose || itemCfg.disabled? ' jl-hidden': '') + '"></span><span style="clear:both"></span>');
		tmpl.push('</a>');
		if(!itemCfg.id && itemCfg.id !== 0) {
			itemCfg.id = jslet.nextId();
		}
		var oli = document.createElement('li');
		oli.id = itemCfg.id + '_h';
		if(itemCfg.disabled) {
			jQuery(oli).addClass('jl-tab-disabled');
		}
		oli.innerHTML = tmpl.join('');

		if (Z._newable) {
			var lastNode = parent.childNodes[parent.childNodes.length - 1];
			parent.insertBefore(oli, lastNode);
		} else {
			parent.appendChild(oli);
		}
		oli.jslet = Z;
		jQuery(oli).on('click', Z._changeTabItem);

		if (canClose) {
			jQuery(oli).find('.jl-tab-close').click(Z._doCloseBtnClick);
		}
		if(Z.contextMenu && !itemCfg.disabled) {
			oli.oncontextmenu = function (event) {
				var k = 0;
				var items = jQuery(Z.el).find('.jl-tab-list li').each(function() {
					if(this === event.currentTarget) {
						Z._contextItemIndex = k;
						return false;
					}
					k++;
				});
				Z.contextMenu.showContextMenu(event, Z);
			};
		}
	},

	_changeTabItem: function (event) {
		var nodes = this.parentNode.childNodes,
			index = -1;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] == this) {
				index = i;
				break;
			}
		}
		this.jslet._chgActiveIndex(index);
	},

	_doCloseBtnClick: function (event) {
		var oli = this.parentNode.parentNode,
			nodes = oli.parentNode.childNodes,
			index = -1;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] == oli) {
				index = i;
				break;
			}
		}
		oli.jslet.removeTabItem(index);
		event.preventDefault();
		return false;
	},

	_createBody: function (parent, itemCfg) {
		var Z = this,
			jqDiv = jQuery(document.createElement('div'));
		if (!jqDiv.hasClass('jl-tab-panel')) {
			jqDiv.addClass('jl-tab-panel');
		}
		parent.appendChild(jqDiv[0]);
		
		if (itemCfg.content || itemCfg.contentId) {
			var ocontent = itemCfg.content;
			if(itemCfg.contentId) {
				ocontent = jQuery('#'+itemCfg.contentId)[0];
			}
			if (ocontent) {
				jqDiv.html('');
				jqDiv.append(ocontent);
				jqDiv.children().show();
				return;
			}
		}

		var url = itemCfg.url;
		if (url) {
			url = jslet.urlUtil.addParam(url, {jlTabItemId: itemCfg.id});
			if(itemCfg.debounce) {
				url = jslet.urlUtil.addParam(url, {debounce: true});
			}
			itemCfg.url = url;
			if (itemCfg.useIFrame || itemCfg.useIFrame === undefined) {
				var h = itemCfg.height;
				if(h && !jslet.isString(h)) {
					h += 'px';
				}
				h = h ? h: '100%';
				
				var id = itemCfg.id || jslet.nextId(); 
				var s = '<iframe id="' + id + '" scrolling="yes" frameborder="0" allowtransparency="true" src="' + 
					url + 
				'" style="background-color:transparent;width: 100%;' + (Z._isFixedHeight? '': 'height:' + h) + '"' +
				(Z._isFixedHeight? 'class="jl-tab-frame-fixed"': '') + '></iframe>';
				jqDiv.html(s);
				itemCfg.contentId = id;
				if(itemCfg.debounce) {
					if(Z._enableLoading) {
						var jqEl = jQuery(Z.el),
							jqHead = jqEl.find('.jl-tab-header');
						jqHead.find('#' + id + '_h .jl-tab-loading').removeClass('jl-hidden');
					}
					if(Z._onContentLoading) {
						Z._onContentLoading.call(Z, id, itemCfg);
					}
				}
			}
		}
	},

	/**
	 * Add tab item dynamically.
	 * 
	 * @param {Object} newItemCfg Tab item configuration
	 * @param {Boolean} noDuplicate Identify if the same "tabItem.id" can be added or not, default is true. 
	 */
	addTabItem: function (newItemCfg, noDuplicate) {
		var Z = this,
			tabItems = Z._items,
			newId = newItemCfg.id;
		if(!newId) {
			newId = jslet.nextId();
			newItemCfg.id = newId;
		}
		var itemCfg;
		if((noDuplicate === undefined || noDuplicate) && newId) {
			for(var i = 0, len = tabItems.length; i < len; i++) {
				itemCfg = tabItems[i];
				if(newId === itemCfg.id) {
					if(itemCfg.url !== newItemCfg.url) {
						itemCfg.url = newItemCfg.url;
						Z.reloadTabItem(itemCfg);
					}
					Z.activeIndex(i);
					return;
				}
			}
		}
		tabItems.push(newItemCfg);
		Z._renderTabItem(newItemCfg);
		Z._calcItemsWidth();
		Z._chgActiveIndex(tabItems.length - 1);
		Z._checkTabItemCount();
	},

	/**
	 * set the specified tab item to loaded state. It will fire the "onContentLoaded" event.
	 * 
	 * @param {String} tabItemId - tab item id.
	 */
	setContentLoadedState: function(tabItemId) {
		var Z = this,
			jqEl = jQuery(Z.el);
		if(Z._enableLoading) {
			jqEl.find('#' + tabItemId + '_h .jl-tab-loading').addClass('jl-hidden');
		}
		if(!Z._onContentLoaded) {
			return;
		}
		var	tabItems = Z._items,
			contentId = null,
			itemCfg;
		for(var i = 0, len = tabItems.length; i < len; i++) {
			itemCfg = tabItems[i];
			if(tabItemId === itemCfg.id) {
				contentId = itemCfg.contentId;
				break;
			}
		}
		if(!contentId) {
			return;
		}
		Z._onContentLoaded.call(Z, contentId, itemCfg);
	},
	
	/**
	 * Set tab item to changed state or not.
	 * 
	 * @param {String} tabItemId - tab item id.
	 * @param {Boolean} changed - changed state.
	 */
	setContentChangedState: function(tabItemId, changed) {
		var Z = this,
			tabItems = Z._items,
			itemCfg,
			idx = -1;
		for(var i = 0, len = tabItems.length; i < len; i++) {
			itemCfg = tabItems[i];
			if(tabItemId === itemCfg.id) {
				idx = i;
				break;
			}
		}
		if(idx < 0) {
			return;
		}
		itemCfg.changed = changed;
		var header = itemCfg.header,
			hasChangedFlag = (header.charAt(0) === '*');
		if(changed) {
			if(!hasChangedFlag) {
				header = '*' + header;
				Z.tabHeader(idx, header);
			}
		} else {
			if(hasChangedFlag) {
				header = header.substring(1);
				Z.tabHeader(idx, header);
			}
		}
	},
	
	/**
	 * Identify which exists changed tab item or not.
	 */
	hasChanged: function(tabIndex) {
		jslet.Checker.test('TabControl.hasChanged#tabIndex', tabIndex).isGTEZero();
		var Z = this,
			tabItems = Z._items,
			itemCfg,
			idx = -1,
			noTabIndex = (tabIndex === undefined || tabIndex === null);
		for(var i = 0, len = tabItems.length; i < len; i++) {
			itemCfg = tabItems[i];
			if(itemCfg.changed) {
				if(noTabIndex || tabIndex === i) {
					return true;
				}
			}
		}
		return false;
	},
	
	_renderTabItem: function(itemCfg) {
		var Z = this,
			jqEl = jQuery(Z.el),
			oul = jqEl.find('.jl-tab-list')[0],
			panelContainer = jqEl.find('.jl-tab-panels')[0];
		if(!itemCfg.id) {
			itemCfg.id = jslet.nextId();
		}
		Z._createHeader(oul, itemCfg);
		Z._createBody(panelContainer, itemCfg);
	},
	
	/**
	 * Remove tab item with tabItemIndex
	 * 
	 * @param {Integer} tabItemIndex Tab item index
	 */
	removeTabItem: function (tabItemIndex) {
		var Z = this;
		if (tabItemIndex >= Z._items.length || tabItemIndex < 0) {
			return;
		}
		var itemCfg = Z._items[tabItemIndex];
		if(itemCfg.changed) {
            jslet.ui.confirm(jsletlocale.TabControl.contentChanged, jsletlocale.MessageBox.confirm, function(button){
				if(button === 'ok') {
					Z._innerRemoveTabItem(tabItemIndex);
				}
            });
		} else {
			Z._innerRemoveTabItem(tabItemIndex);
		}
	},

	_innerRemoveTabItem: function (tabItemIndex) {
		var Z = this,
			jqEl = jQuery(Z.el),
			oul = jqEl.find('.jl-tab-list')[0],
			nodes = oul.childNodes,
			oli = jQuery(nodes[tabItemIndex]),
			active = oli.hasClass('jl-tab-active');
		
		function innerRemove() {
			oli.find('.jl-tab-close').hide();
			oli.animate({width:'toggle'},200, function() {
				var elItem = oli[0]; 
				elItem.oncontextmenu = null;
				oul.removeChild(elItem);
				Z._items.splice(tabItemIndex, 1);
				var panelContainer = jqEl.find('.jl-tab-panels')[0];
				nodes = panelContainer.childNodes;
				var tabPanel = nodes[tabItemIndex];
				panelContainer.removeChild(tabPanel);
				Z._calcItemsWidth();
				Z._checkTabItemCount();
				if (active) {
					var cnt = nodes.length - (Z._newable ? 2 : 1);
					tabItemIndex = Z._getNextValidIndex(tabItemIndex, tabItemIndex >= cnt);
					if (tabItemIndex >= 0) {
						Z._chgActiveIndex(tabItemIndex);
					} else {
						Z._activeIndex = -1;
					}
				} else {
					if(Z._activeIndex > tabItemIndex) {
						Z._activeIndex--;
					}
				}
			});
		}
		if (Z._onRemoveTabItem) {
			var result = Z._onRemoveTabItem.call(Z, Z._items[tabItemIndex], active);
			if(jslet.isPromise(result)) {
				result.done(function(canRemoved) {
					if (canRemoved === undefined || canRemoved) {
						innerRemove();
					}
				});
			} else {
				if (result === undefined || result) {
					innerRemove();
				}
			}
		}
	},

	_getNextValidIndex: function(start, isLeft) {
		var Z = this, i, len;
		if(isLeft) {
			for(i = start - 1; i >= 0; i--) {
				if(!Z._items[i].disabled) {
					return i;
				}
			}
		} else {
			for(i = start, len = Z._items.length; i < len; i++) {
				if(!Z._items[i].disabled) {
					return i;
				}
			}
		}
		return -1;
	},
	
	/**
	 * Reload the active tab panel.
	 */
	reload: function() {
		var Z = this,
			currIdx = Z._contextItemIndex,
			itemCfg = Z._items[currIdx];
		Z.reloadTabItem(itemCfg);
	},
	
	reloadTabItem: function(itemCfg) {
		var Z = this;
		if(!itemCfg) {
			return;
		}
		var contentId = itemCfg.contentId;
		if(contentId) {
			if(itemCfg.debounce) {
				if(Z._enableLoading) {
					var jqEl = jQuery(Z.el),
						jqHead = jqEl.find('.jl-tab-header');
					jqHead.find('#' + contentId + '_h .jl-tab-loading').removeClass('jl-hidden');
				}
				if(Z._onContentLoading) {
					Z._onContentLoading.call(Z, contentId, itemCfg);
				}
			}
			jQuery('#' + contentId).attr('src', itemCfg.url);
		}
	},
	
	/**
	 * Close the current active tab item  if this tab item is closable.
	 */
	close: function (tabItemIndex) {
		var Z = this;
		if(tabItemIndex === undefined) {
			tabItemIndex = Z._activeIndex;
		}
		var itemCfg = Z._items[tabItemIndex];
		if (itemCfg && tabItemIndex >= 0 && itemCfg.closable && !itemCfg.disabled) {
			Z.removeTabItem(tabItemIndex);
		}
	},

	/**
	 * Close all closable tab item except current active tab item.
	 */
	closeOther: function () {
		var Z = this, oitem;
		for (var i = Z._items.length - 1; i >= 0; i--) {
			oitem = Z._items[i];
			if (oitem.closable && !oitem.disabled) {
				if (Z._contextItemIndex == i) {
					continue;
				}
				Z.removeTabItem(i);
			}
		}
	},
	
	/**
	 * Close all closable tab item.
	 */
	closeAll: function() {
		var Z = this, oitem;
		for (var i = Z._items.length - 1; i >= 0; i--) {
			oitem = Z._items[i];
			if (oitem.closable && !oitem.disabled) {
				Z.removeTabItem(i);
			}
		}
	},
	
	/**
	 * Run when container size changed, it's revoked by jslet.ui.resizeEventBus.
	 * 
	 */
	checkSizeChanged: function(){
		var Z = this,
			jqEl = jQuery(Z.el),
			currWidth = jqEl.width(),
			currHeight = jqEl.height();
		if(currWidth === Z._tabControlWidth && currHeight === Z._tabControlHeight) {
			return;
		}
		if ( Z._tabControlWidth != currWidth){
			Z._tabControlWidth = currWidth;
			Z._calcItemsWidth();
			Z._setVisiTabItems(Z._leftIndex);
		}
		Z._tabControlHeight = currHeight;
		jslet.ui.resizeEventBus.resize(Z.el);		
	},
	
	_createContextMenu: function () {
		var Z = this;
		Z.contextMenu = null;
		if (!jslet.ui.Menu || !Z._closable) {
			return;
		}
		var menuCfg = { type: 'Menu', onItemClick: jQuery.proxy(Z._menuItemClick, Z), items: [
   			{ id: 'reload', name: jsletlocale.TabControl.reload},
			{ id: 'close', name: jsletlocale.TabControl.close},
			{ id: 'closeOther', name: jsletlocale.TabControl.closeOther},
			{ id: 'closeAll', name: jsletlocale.TabControl.closeAll}]
			};
		if (Z._onCreateContextMenu) {
			Z._onCreateContextMenu.call(Z, menuCfg.items);
		}

		if (menuCfg.items.length === 0) {
			return;
		}
		Z.contextMenu = jslet.ui.createControl(menuCfg);
	},

	_menuItemClick: function (menuCfg, checked) {
		var menuId = menuCfg.id;
		if(menuId === 'reload') {
			this.reload();
		} else if (menuId === 'close') {
			this.close(this._contextItemIndex);
		} else if (menuId === 'closeOther') {
			this.closeOther();
		} else if (menuId === 'closeAll') {
			this.closeAll();
		}
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		if(Z._newTabItem) {
			Z._newTabItem.onclick = null;
			Z._newTabItem = null;
		}
		var jqEl = jQuery(Z.el), 
			head = jqEl.find('.jl-tab-header')[0];
		
		jqEl.find('.jl-tab-left').off();
		jqEl.find('.jl-tab-right').off();
		head.oncontextmenu = null;
		jqEl.find('.jl-tab-close').off();
		var items = jqEl.find('.jl-tab-list').find('li');
		items.off();
		items.each(function(){
			this.jslet = null;
		});
		jslet.ui.resizeEventBus.unsubscribe(this);

		$super();
	}
});

jslet.ui.register('TabControl', jslet.ui.TabControl);
jslet.ui.TabControl.htmlTemplate = '<div></div>';

/**
 * @class
 * 
* Tab Item
*/
jslet.ui.TabItem = function () {
	var Z = this;
	Z.id = null; //{String} Element Id
	Z.index = -1; //{Integer} TabItem index
	Z.header = null; //{String} Head of tab item
	Z.closable = false; //{Boolean} Can be closed or not
	Z.disabled = false; //{Boolean} 
	Z.useIFrame = false; //{Boolean}
	Z.height = '100%';
	Z.url = null; //{String} 
	Z.contentId = null; //{String} 
	Z.content = null; //{String} 
};


/**
 * @class
 * @extend jslet.ui.Control
 * 
 * Window, there are the following features: <br /> 
 * 1. Show as modal or modeless; <br />
 * 2. User can change window size; <br />
 * 3. User can minimize/maximize/restore/close window; <br />
 * 4. User can move window; <br />
 * 
 * Example:
 *
 *     @example
 *     var oWin = jslet.ui.createControl({ type: "Window", iconClass:"winicon", caption: "test window", minimizable: false, maximizable:false,onActive: doWinActive, onPositionChanged: doPositionChanged });
 *     oWin.setContent("Open modeless window in the Body(with icon)!");
 *     oWin.show(350,250);
 *     //or oWin.showModel(350, 250);
 *
 */
jslet.ui.Window = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'styleClass,caption,resizable,minimizable,maximizable,closable,iconClass,onSizeChanged,onClosed,onPositionChanged,onActive,width,height,minWidth,maxWidth,minHeight,maxHeight,isCenter,isSmallHeader,stopEventBubbling,animation';

		Z._caption = null;
		
		Z._resizable = true;
		
		Z._minimizable = true;

		Z._maximizable = true;
		
		Z._closable = true;
		
		Z._iconClass = null;
		
		Z._width = 0;
		
		Z._height = 0;
		
		Z._minWidth = 20;
		
		Z._minHeight = 30;
		
		Z._maxWidth = -1;

		Z._maxHeight = -1;

		Z._isCenter = false;
 
		Z._animation = 'linear';
		
		Z._onSizeChanged = null;
		
		Z._onPositionChanged = null;
		
		Z._onActive = null;
		
		Z._onClosed = null;

		Z._stopEventBubbling = false;
		
		Z._isModal = false;
		
		Z._state = null; 
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get window caption.
	 * 
	 * @param {String | undefined} caption Window caption.
	 * 
	 * @return {this | String}
	 */
	caption: function(caption) {
		if(caption === undefined) {
			return this._caption;
		}
		jslet.Checker.test('Window.caption', caption).isString();
		this._caption = caption;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the icon class of window header.
	 * 
	 * @param {String | undefined} iconClass The icon css class of window header.
	 * 
	 * @return {this | String}
	 */
	iconClass: function(iconClass) {
		if(iconClass === undefined) {
			return this._iconClass;
		}
		jslet.Checker.test('Window.iconClass', iconClass).isString();
		this._iconClass = iconClass;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether the window can be resized or not.
	 * 
	 * @param {Boolean | undefined} resizable True - window can be resized, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	resizable: function(resizable) {
		if(resizable === undefined) {
			return this._resizable;
		}
		this._resizable = resizable? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether the window can be minimized or not.
	 * 
	 * @param {Boolean | undefined} minimizable True - window can be minimized, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	minimizable: function(minimizable) {
		if(minimizable === undefined) {
			return this._minimizable;
		}
		this._minimizable = minimizable? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether the window can be maximized or not.
	 * 
	 * @param {Boolean | undefined} maximizable True - window can be maximized, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	maximizable: function(maximizable) {
		if(maximizable === undefined) {
			return this._maximizable;
		}
		this._maximizable = maximizable? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether the window can be closed or not.
	 * 
	 * @param {Boolean | undefined} closable True - window can be closed, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	closable: function(closable) {
		if(closable === undefined) {
			return this._closable;
		}
		this._closable = closable? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether the window is shown in center of container.
	 * 
	 * @param {Boolean | undefined} isCenter True - window is shown in center of container, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	isCenter: function(isCenter) {
		if(isCenter === undefined) {
			return this._isCenter;
		}
		this._isCenter = isCenter? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Animation effect for showing and hiding.
	 * 
	 * @param {String | undefined} animation Animation effect for showing and hiding, optional value: 'none', 'linear', 'slide', 'fade', default is 'linear'.
	 * 
	 * @return {this | String}
	 */
	animation: function(animation) {
		if(animation === undefined) {
			return this._animation;
		}
		this._animation = animation;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether stopping the event bubble.
	 * 
	 * @param {Boolean | undefined} stopEventBubbling True - stop event bubbling, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	stopEventBubbling: function(stopEventBubbling) {
		if(stopEventBubbling === undefined) {
			return this._stopEventBubbling;
		}
		this._stopEventBubbling = stopEventBubbling? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get window initial width.
	 * 
	 * @param {Integer | undefined} width Window initial width.
	 * 
	 * @return {this | Integer}
	 */
	width: function(width) {
		if(width === undefined) {
			return this._width;
		}
		jslet.Checker.test('Window.width', width).isGTZero();
		this._width = width;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get window initial height.
	 * 
	 * @param {Integer | undefined} height Window initial height.
	 * 
	 * @return {this | Integer}
	 */
	height: function(height) {
		if(height === undefined) {
			return this._height;
		}
		jslet.Checker.test('Window.height', height).isGTZero();
		this._height = height;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get window minimum width.
	 * 
	 * @param {Integer | undefined} minWidth Window minimum width.
	 * 
	 * @return {this | Integer}
	 */
	minWidth: function(minWidth) {
		if(minWidth === undefined) {
			return this._minWidth;
		}
		jslet.Checker.test('Window.minWidth', minWidth).isGTZero();
		if(minWidth < 20) {
			minWidth = 20;
		}
		this._minWidth = minWidth;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get window minimum height.
	 * 
	 * @param {Integer | undefined} minHeight Window minimum height.
	 * 
	 * @return {this | Integer}
	 */
	minHeight: function(minHeight) {
		if(minHeight === undefined) {
			return this._minHeight;
		}
		jslet.Checker.test('Window.minHeight', minHeight).isGTZero();
		if(minHeight < 30) {
			minHeight = 30;
		}
		this._minHeight = minHeight;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get window maximum width.
	 * 
	 * @param {Integer | undefined} maxWidth Window maximum width.
	 * 
	 * @return {this | Integer}
	 */
	maxWidth: function(maxWidth) {
		if(maxWidth === undefined) {
			return this._maxWidth;
		}
		jslet.Checker.test('Window.maxWidth', maxWidth).isNumber();
		this._maxWidth = maxWidth;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get window maximum height.
	 * 
	 * @param {Integer | undefined} maxHeight Window maximum height.
	 * 
	 * @return {this | Integer}
	 */
	maxHeight: function(maxHeight) {
		if(maxHeight === undefined) {
			return this._maxHeight;
		}
		jslet.Checker.test('Window.maxHeight', maxHeight).isNumber();
		this._maxHeight = maxHeight;
		return this;
	},

	/**
	 * @event
	 * 
	 * Set or get window size changed event handler. Example:
	 * 
	 *     @example
	 *     owin.onSizeChanged(function(width, height){
	 *     
	 *     });
	 * 
	 * @param {Function | undefined} onSizeChanged Window size changed event handler.
	 * @param {Integer} onSizeChanged.width Changed width.
	 * @param {Integer} onSizeChanged.height Changed height.
	 * 
	 * @return {this | Function}
	 */
	onSizeChanged: function(onSizeChanged) {
		if(onSizeChanged === undefined) {
			return this._onSizeChanged;
		}
		jslet.Checker.test('Window.onSizeChanged', onSizeChanged).isFunction();
		this._onSizeChanged = onSizeChanged;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get window position changed event handler. <br />
	 * Fired when user changes the window's position. Example:
	 * 
	 *     @example
	 *     owin.onPositionChanged(function(left, top){
	 *     });
	 * 
	 * @param {Function | undefined} onPositionChanged window position changed event handler
	 * @param {Integer} onPositionChanged.left The left of changing position.
	 * @param {Integer} onPositionChanged.top The top of changing position.
	 * 
	 * @return {this | Function}
	 */
	onPositionChanged: function(onPositionChanged) {
		if(onPositionChanged === undefined) {
			return this._onPositionChanged;
		}
		jslet.Checker.test('Window.onPositionChanged', onPositionChanged).isFunction();
		this._onPositionChanged = onPositionChanged;
		return this;
	},

	/**
	 * @event
	 * 
	 * Set or get window activated event handler. <br />
	 * Fired when the window is active. Example:
	 * 
	 *     @example
	 *     owin.onActive(function(winObj){
	 *       //windObj: jslet.ui.Window Window Object
	 *     });
	 * 
	 * @param {Function | undefined} onActive Window activated event handler.
	 * @param {jslet.ui.Window} onActive.winObj Jslet window object.
	 * 
	 * @return {this | Function}
	 */
	onActive: function(onActive) {
		if(onActive === undefined) {
			return this._onActive;
		}
		jslet.Checker.test('Window.onActive', onActive).isFunction();
		this._onActive = onActive;
		return this;
	},
	
	
	/**
	 * @event
	 * 
	 * Set or get window closed event handler. <br />
	 * Fired when uses closes window. Example:
	 * 
	 *     @example
	 *     owin.onClosed(function(winObj){});
	 * 
	 * @param {Function | undefined} onClosed Window closed event handler.
	 * @param {jslet.ui.Window} onClosed.winObj Jslet window object.
	 * @param {String} onClosed.return If return value equals 'hidden', then hide window instead of closing.
	 * 
	 * @return {this | Function}
	 */
	onClosed: function(onClosed) {
		if(onClosed === undefined) {
			return this._onClosed;
		}
		jslet.Checker.test('Window.onClosed', onClosed).isFunction();
		this._onClosed = onClosed;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		if (!Z._closable) {
			Z._minimizable = false;
			Z._maximizable = false;
		}
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-window')) {
			jqEl.addClass('panel panel-default jl-window');
		}
		if (Z._width) {
			jqEl.width(Z._width);
		}
		if (Z._height) {
			jqEl.height(Z._height);
		}
		jqEl.css('display','none');
		var template = [
		'<div class="panel-heading jl-win-header jl-win-header-sm" style="cursor:move">',
			Z._iconClass ? '<span class="jl-win-header-icon ' + Z._iconClass + '"></span>' : '',
			'<span class="panel-title jl-win-caption">', Z._caption ? Z._caption : '', '</span>',
			'<span class="jl-win-tool jl-unselectable">'];
			template.push(Z._closable ? '<button class="close jl-win-close" onfocus="this.blur();">x</button>' : '');
			template.push(Z._maximizable ? '<button class="close jl-win-max" onfocus="this.blur();">□</button>' : '');
			template.push(Z._minimizable ? '<button class="close jl-win-min" onfocus="this.blur();">-</button>' : '');
		template.push('</span></div>');
		template.push('<div class="panel-body jl-win-body"></div>');

		jqEl.html(template.join(''));
		jqEl.on('mousemove', Z._doWinMouseMove);
		jqEl.on('mousedown', Z._doWinMouseDown);
		jqEl.on('dblclick', function(event){
			event.stopPropagation();
			event.preventDefault();
		});

		jqEl.on('click', function(event){
			if(Z._stopEventBubbling) {
				event.stopPropagation();
				event.preventDefault();
			}
		});
		
		Z._changeBodyHeight();
		var jqHeader = jqEl.find('.jl-win-header'),
			header = jqHeader[0];
		var jqBody = jqEl.find('.jl-win-body');
		jqBody.on('mouseenter',function (event) {
			window.setTimeout(function(){
				if (jslet.temp_dragging) {
					return;
				}
				Z.cursor = null;
			},300);
		});
		jqBody.on('dblclick',function (event) {
			event.stopPropagation();
			event.preventDefault();
		});
		
		jqHeader.on('mousedown',function (event) {
			Z.activate();
			if (Z._state == 'max') {
				return;
			}
			Z.cursor = null;
			jslet.ui.dnd.bindControl(this);
		});

		jqHeader.on('dblclick',function (event) {
			event.stopPropagation();
			event.preventDefault();
			if (!Z._maximizable) {
				return;
			}
			if (Z._state != 'max') {
				Z.maximize();
			} else {
				Z.restore();
			}
		});

		header._doDragStart = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._createTrackerMask(header);
			Z.trackerMask.style.cursor = header.style.cursor;
			jslet.temp_dragging = true;
		};

		header._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z.setPosition(Z.left + deltaX, Z.top + deltaY, true);
		};

		header._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
			var left = parseInt(Z.el.style.left);
			var top = parseInt(Z.el.style.top);
			Z.setPosition(left, top);
			Z._removeTrackerMask();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		header._doDragCancel = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z.setPosition(Z.left, Z.top);
			Z._removeTrackerMask();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		Z.el._doDragStart = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._createTrackerMask(this);
			Z._createTracker();
			Z.trackerMask.style.cursor = Z.el.style.cursor;
			jslet.temp_dragging = true;
		};

		Z.el._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._changeTrackerSize(deltaX, deltaY);
		};

		Z.el._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
			if (!Z.tracker) {
				return;
			}
			var left = parseInt(Z.tracker.style.left);
			var top = parseInt(Z.tracker.style.top);
			var width = parseInt(Z.tracker.style.width);
			var height = parseInt(Z.tracker.style.height);

			Z.setPosition(left, top);
			Z.changeSize(width, height);
			Z._removeTrackerMask();
			Z._removeTracker();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		Z.el._doDragCancel = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._removeTrackerMask();
			Z._removeTracker();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		if (Z._closable) {
			var jqClose = jqEl.find('.jl-win-close');
			jqClose.click(function (event) {
				Z.close();
				event = jQuery.event.fix( event || window.event );
				event.stopPropagation();
				event.preventDefault();
			});
		}
		if (Z._minimizable) {
			var jqMin = jqEl.find('.jl-win-min');
			jqMin.click(function (event) {
				Z.minimize();
				event = jQuery.event.fix( event || window.event );
				event.stopPropagation();
				event.preventDefault();
			});
		}
		if (Z._maximizable) {
			var jqMax = jqEl.find('.jl-win-max'),
				btnMax = jqMax[0];
			jqMax.click(function (event) {
				if (Z._state != 'max') {
					btnMax.innerHTML = '■';
					Z.maximize();
				} else {
					btnMax.innerHTML = '□';
					Z.restore();
				}
				event = jQuery.event.fix( event || window.event );
				event.stopPropagation();
				event.preventDefault();
			});
		}
	},

	/**
	 * Show window at specified position.
	 * 
	 * @param {Integer} left Position left.
	 * @param {Integer} top Position top.
	 */
	show: function (left, top) {
		var Z = this,
			jqEl = jQuery(Z.el);
		if (Z._isCenter) {
			var jqOffsetP = jQuery(window),
				pw = jqOffsetP.width(),
				ph = jqOffsetP.height();
			left = document.body.scrollLeft + Math.round((pw - jqEl.outerWidth()) / 2);
			top = document.body.scrollTop + Math.round((ph - jqEl.outerHeight()) / 2);
			if(left < 0) {
				left = 0;
			}
			if(top < 0) {
				top = 0;
			} 
		}

		Z.top = top ? top : 0;
		Z.left = left ? left : 0;
		Z.el.style.left = Z.left + 'px';
		Z.el.style.top = Z.top + 'px';
		if(Z._animation == 'slide') {
			jqEl.slideDown(function() {
				Z._changeBodyHeight();
				Z.activate();
			});
		}
		
		if(Z._animation == 'fade') {
			jqEl.fadeIn(function() {
				Z._changeBodyHeight();
				Z.activate();
			});
		} else if(Z._animation == 'none') {
			jqEl.show(function() {
				Z._changeBodyHeight();
				Z.activate();
			});
		} else {
			jqEl.show('fast', function() {
				Z._changeBodyHeight();
				Z.activate();
			});
		}
	},

	/**
	 * Show modal window at specified position.
	 * 
	 * @param {Integer} left Position left.
	 * @param {Integer} top Position top.
	 */
	showModal: function (left, top) {
		var Z = this;
		Z._isModal = true;
		if (!Z.overlay) {
			Z.overlay = new jslet.ui.OverlayPanel(Z.el.parentNode);
		}
		jslet.ui.GlobalZIndex += 10;
		var k = jslet.ui.GlobalZIndex;
		Z.el.style.zIndex = k;
		Z.show(left, top);
		Z.overlay.setZIndex(k - 2);
		Z.overlay.show();
	},

	/**
	 * Hide window.
	 */
	hide: function () {
		var Z = this;
		var jqEl = jQuery(Z.el);
		if(Z._animation == 'slide') {
			jqEl.slideUp();
		} else if(Z._animation == 'fade') {
			jqEl.fadeOut();
		} else if(Z._animation == 'none') {
			jqEl.hide();
		} else {
			jqEl.hide('fast');
		}
		if (Z.overlay) {
			Z.overlay.hide();
		}
	},

	/**
	 * Close window, this will fire onClosed event.
	 */
	close: function () {
		var Z = this;
		if(!Z.el) {
			return;
		}
		if (Z._onClosed) {
			var action = Z._onClosed.call(Z);
			if (action && action.toLowerCase() == 'hidden') {
				Z.hide();
				return;
			}
		}
		var pnode = Z.el.parentNode;
		pnode.removeChild(Z.el);
		if (Z.overlay) {
			Z.overlay.destroy();
			Z.overlay = null;
		}
		jslet.ui.GlobalZIndex -= 10;
		Z.destroy();
	},

	/**
	 * Minimize window.
	 */
	minimize: function () {
		var Z = this;
		if (Z._state == 'min') {
			Z.restore();
			return;
		}
		if (Z._state == 'max') {
			Z.restore();
		}
		var jqEl = jQuery(Z.el);
		Z._tempHeight = jqEl.height();
		Z._tempWidth = jqEl.width();
		Z.changeSize(Z._tempWidth, Z._getHeaderHeight() + 2);
		Z._state = 'min';
	},

	/**
	 * Maximize window.
	 */
	maximize: function () {
		var Z = this,
			offsetP = jQuery(window),
			width = offsetP.width(),
			height = offsetP.height(),
			left = document.body.scrollLeft,
			top = document.body.scrollTop;
		
		Z.setPosition(left, top, true);
		if (Z._state !== 'min') {
			var jqEl = jQuery(Z.el);
			Z._tempHeight = jqEl.height();
			Z._tempWidth = jqEl.width();
		}
		Z.changeSize(width, height);
		Z._state = 'max';
	},

	/**
	 * Restore window.
	 */
	restore: function () {
		var Z = this;
		Z.setPosition(Z.left, Z.top, true);
		Z.changeSize(Z._tempWidth, Z._tempHeight);
		Z._state = null;
	},

	/**
	 * Activate window, this will fire the 'OnActive' event.
	 */
	activate: function () {
		var Z = this;
		if (!Z.overlay) {
			Z.bringToFront();
		}
		if (Z._onActive) {
			Z._onActive.call();
		}
	},

	/**
	 * Change window position.
	 * 
	 * @param {Integer} left Position left.
	 * @param {Integer} top Position top.
	 * @param {Boolean} notUpdateLeftTop True - Only change html element position, 
	 *		not change the inner position of Window object, it is usually use for moving action.
	 */
	setPosition: function (left, top, notUpdateLeftTop) {
		var Z = this;
		if(top < 0) {
			top = 0;
		}
		if(left < 0) {
			left = 0;
		}
		if (!notUpdateLeftTop) {
			Z.left = left;
			Z.top = top;
		} else {
			if (Z._onPositionChanged) {
				var result = Z._onPositionChanged.call(Z, left, top);
				if (result) {
					if (result.left) {
						left = result.left;
					}
					if (result.top) {
						top = result.top;
					}
				}
			}
		}
		Z.el.style.left = left + 'px';
		Z.el.style.top = top + 'px';
	},

	/**
	 * Change window size.
	 * 
	 * @param {Integer} width Window width.
	 * @param {Integer} height Window height.
	 * @param {Boolean} notUpdateSize True - Only change html element size, 
	 *		not change the inner size of Window object, it is usually use for moving action.
	 */
	changeSize: function (width, height) {
		var Z = this;
		if (Z._onSizeChanged) {
			Z._onSizeChanged.call(Z, width, height);
		}

		var jqEl = jQuery(Z.el);
		if(width) {
			jqEl.width(width);
		}
		if(height) {
			jqEl.height(height);
		}
		Z._changeBodyHeight();
	},

	_getHeaderHeight: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			jqHeader = jqEl.find('.jl-win-header');
		return jqHeader.outerHeight() || 30;
	},
	
	_changeBodyHeight: function() {
		var Z = this;
		if(!Z._height) {
			return;
		}
		var jqEl = jQuery(Z.el),
			jqBody = jqEl.find('.jl-win-body');
		jqBody.outerHeight(jqEl.innerHeight() - Z._getHeaderHeight());
		jslet.ui.resizeEventBus.resize(Z.el);
	},
	
	/**
	 * Get window caption element. You can use it to customize window caption.
	 * 
	 * @return {HtmlElement}
	 */
	getCaptionPanel: function () {
		return jQuery(this.el).find('.jl-win-caption')[0];
	},

	/**
	 * Change window caption.
	 * 
	 * @param {String} caption Window caption.
	 */
	changeCaption: function (caption) {
		this.caption = caption;
		var captionDiv = jQuery(this.el).find('.jl-win-caption');
		captionDiv.html(caption);
	},

	/**
	 * Get window content element. You can use it to customize window content.
	 * 
	 * @return {HtmlElement}
	 */
	getContentPanel: function () {
		return jQuery(this.el).find('.jl-win-body')[0];
	},

	/**
	 * Set window content.
	 * 
	 * @param {String} html Html text for window content.
	 */
	setContent: function (html) {
		if (!html){
			jslet.showError('Window content cannot be null!');
			return;
		}
		var bodyDiv = jQuery(this.el).find('.jl-win-body');
		if (html && html.toLowerCase) {
			bodyDiv.html(html);
		} else {
			bodyDiv.html('');
			
			html.parentNode.removeChild(html);
			bodyDiv[0].appendChild(html);
			if (html.style && html.style.display == 'none') {
				html.style.display = 'block';
			}
		}
	},

	/**
	 * Bring window to front.
	 */
	bringToFront: function () {
		var Z = this;
		var p = Z.el.parentNode;
		var node, jqEl = jQuery(Z.el);
		var maxIndex = 0, jqNode, winIdx;
		for (var i = 0, cnt = p.childNodes.length; i < cnt; i++) {
			node = p.childNodes[i];
			if (node.nodeType != 1 || node == Z.el) {
				if (!Z._isModal) {
					jqEl.find('.jl-win-header').addClass('jl-window-active');
				}
				continue;
			}
			jqNode = jQuery(node);
			
			if (jqNode.hasClass('jl-window')) {
				winIdx = parseInt(node.style.zIndex) || 0;
				if (maxIndex < winIdx) {
					maxIndex = winIdx;
				}
				if (!Z._isModal) {
					jqNode.find('.jl-win-header').removeClass('jl-window-active');
				}
			}
		}
		var styleObj = jqEl.getStyleObject();
		winIdx = parseInt(styleObj.zIndex) || 0;
		if (winIdx <= maxIndex) {
			Z.setZIndex(maxIndex + 2);
		}
	},

	/**
	 * Set window Z-Index.
	 * 
	 * @param {Integer} zIndex Z-Index.
	 */
	setZIndex: function (zIndex) {
		this.el.style.zIndex = zIndex;
		if(this.overlay) {
			this.overlay.setZIndex(zIndex - 2);
		}
	},

	_checkSize: function (width, height) {
		var Z = this;
		if (width) {
			if (width < Z._minWidth || Z._maxWidth > 0 && width > Z._maxWidth) {
				return false;
			}
		}

		if (height) {
			if (height < Z.minHeight || Z._maxHeight > 0 && height > Z._maxHeight) {
				return false;
			}
		}
		return true;
	},

	_changeTrackerSize: function (deltaX, deltaY) {
		var Z = this;
		if (!Z.tracker || !Z.cursor) {
			return;
		}
		var jqEl = jQuery(Z.el), 
			w = jqEl.width(), 
			h = jqEl.height(), 
			top = null, left = null;

		if (Z.cursor == 'nw') {
			w = w - deltaX;
			h = h - deltaY;
			top = Z.top + deltaY;
			left = Z.left + deltaX;
		} else if (Z.cursor == 'n') {
			h = h - deltaY;
			top = Z.top + deltaY;
		} else if (Z.cursor == 'ne') {
			h = h - deltaY;
			w = w + deltaX;
			top = Z.top + deltaY;
		} else if (Z.cursor == 'e') {
			w = w + deltaX;
		} else if (Z.cursor == 'se') {
			w = w + deltaX;
			h = h + deltaY;
		} else if (Z.cursor == 's'){
			h = h + deltaY;
		} else if (Z.cursor == 'sw') {
			h = h + deltaY;
			w = w - deltaX;
			left = Z.left + deltaX;
		} else if (Z.cursor == 'w') {
			w = w - deltaX;
			left = Z.left + deltaX;
		}

		if (!Z._checkSize(w, h)) {
			return;
		}
		var jqTracker = jQuery(Z.tracker);
		if (w) {
			jqTracker.width(w);
		}
		if (h) {
			jqTracker.height(h);
		}
		if (top) {
			Z.tracker.style.top = top + 'px';
		}
		if (left) {
			Z.tracker.style.left = left + 'px';
		}
	},

	_doWinMouseMove: function (event) {
		if (jslet.temp_dragging) {
			return;
		}
		event = jQuery.event.fix( event || window.event );
		
		var srcEl = event.target, jqSrcEl = jQuery(srcEl);
		
		if (!jqSrcEl.hasClass('jl-window')) {
			return;
		}
		if (!srcEl.jslet._resizable || srcEl.jslet._state) {
			srcEl.jslet.cursor = null;
			srcEl.style.cursor = 'default';
			return;
		}

		var pos = jqSrcEl.offset(),
			x = event.pageX - pos.left,
			y = event.pageY - pos.top,
			w = jqSrcEl.width(),
			h = jqSrcEl.height();
		var delta = 8, wdelta = w - delta, hdelta = h - delta, cursor = null;
		if (x <= delta && y <= delta) {
			cursor = 'nw';
		} else if (x > delta && x < wdelta && y <= delta) {
			cursor = 'n';
		} else if (x >= wdelta && y <= delta) {
			cursor = 'ne';
		} else if (x >= wdelta && y > delta && y <= hdelta) {
			cursor = 'e';
		} else if (x >= wdelta && y >= hdelta) {
			cursor = 'se';
		} else if (x > delta && x < wdelta && y >= hdelta) {
			cursor = 's';
		} else if (x <= delta && y >= hdelta) {
			cursor = 'sw';
		} else if (x <= delta && y > delta && y < hdelta) {
			cursor = 'w';
		}
		
		srcEl.jslet.cursor = cursor;
		srcEl.style.cursor = cursor ? cursor + '-resize' : 'default';
	},

	_doWinMouseDown: function (event) {
		var ojslet = this.jslet;
		ojslet.activate();
		if (ojslet.cursor) {
			jslet.ui.dnd.bindControl(this);
		}
	},

	_createTrackerMask: function (holder) {
		var Z = this;
		if (Z.trackerMask) {
			return;
		}
		var jqBody = jQuery(document.body);

		Z.trackerMask = document.createElement('div');
		jQuery(Z.trackerMask).addClass('jl-win-tracker-mask');
		Z.trackerMask.style.top = '0px';
		Z.trackerMask.style.left = '0px';
		Z.trackerMask.style.zIndex = 99998;
		Z.trackerMask.style.width = jqBody.width() + 'px';
		Z.trackerMask.style.height = jqBody.height() + 'px';
		Z.trackerMask.style.display = 'block';
		Z.trackerMask.onmousedown = function () {
			if (holder && holder._doDragCancel) {
				holder._doDragCancel();
			}
		};
		jqBody[0].appendChild(Z.trackerMask);
	},

	_removeTrackerMask: function () {
		var Z = this;
		if (Z.trackerMask) {
			Z.trackerMask.onmousedown = null;
			document.body.removeChild(Z.trackerMask);
		}
		Z.trackerMask = null;
	},

	_createTracker: function () {
		var Z = this;
		if (Z.tracker) {
			return;
		}
		var jqEl = jQuery(Z.el), 
			w = jqEl.width(), 
			h = jqEl.height();
		
		Z.tracker = document.createElement('div');
		var jqTracker = jQuery(Z.tracker);
		jqTracker.addClass('jl-win-tracker');
		Z.tracker.style.top = Z.top + 'px';
		Z.tracker.style.left = Z.left + 'px';
		Z.tracker.style.zIndex = 99999;
		jqTracker.width(w);
		jqTracker.height(h);
		Z.tracker.style.display = 'block';
		Z.el.parentNode.appendChild(Z.tracker);
	},

	_removeTracker: function () {
		var Z = this;
		if (Z.tracker) {
			Z.el.parentNode.removeChild(Z.tracker);
		}
		Z.tracker = null;
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this,
			jqEl = jQuery(Z.el);
		jslet.ui.uninstall(Z.el);

		jqEl.find('.jl-win-max').off();
		jqEl.find('.jl-win-min').off();
		jqEl.find('.jl-win-close').off();

		var jqHeader = jqEl.find('.jl-win-header'),
			header = jqHeader[0];
		jqHeader.off();
		jqEl.find('.jl-win-body').off();
		if (Z.trackerMask) {
			Z.trackerMask.onmousedown = null;
		}
		Z.trackerMask = null;
		Z.el._doDragCancel = null;
		Z.el._doDragEnd = null;
		Z.el._doDragging = null;
		Z.el._doDragStart = null;
		header._doDragCancel = null;
		header._doDragEnd = null;
		header._doDragging = null;
		header._doDragStart = null;
		if ($super) {
			$super();
		}
	}
});
jslet.ui.register('Window', jslet.ui.Window);
jslet.ui.Window.htmlTemplate = '<div></div>';

/**
 * @class
 * 
 * Field control add-on.
 */
jslet.ui.FieldControlAddon = {
	/**
	 * @property {String} field Field name if the add-on is another field, like: 'currency' 
	 */
	field: null,
	/**
	 * @property {String} content Fixed content if the add-on is the fixed content, like: 'kg'
	 */
	content: null,
	
	/**
	 * @property {String} width The add-on width.
	 */
	width: '10px'
};

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBPlace. It's an placeholder for other DBControls. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBPlace",dataset: "dataset", "field":"fieldName", suffix: [{"content": "KG", "width": "10px"}] };
 *
 *     //1. Declaring:
 *      <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBPlace = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'styleClass,dataset,field,prefix,suffix,expandChildWidth';
		
		this.editControl = null;
		
		this._expandChildWidth = true;
		
		$super(el, params);
	},

	/**
	 * Prefix of this control. Example:
	 * 
	 *     @example
	 *     dbPlaceObj.prefix([{field: '', content: '', width: 30}]);
	 * 
	 * @param {jslet.ui.FieldControlAddon[] | undefined} prefix - The prefix settings.
	 * 
	 * @return {this | jslet.ui.FieldControlAddon[]}
	 */
	prefix: function(prefix) {
		if(prefix === undefined) {
			return this._prefix;
		}
		
		jslet.Checker.test('DBPlace#prefix', prefix).isArray();
		var setting;
		for(var i = 0, len = prefix.length; i < len; i++) {
			setting = prefix[i];
			if(!setting.field && !setting.content) {
				throw new Error('In DBPlace#prefix setting, one of property "field" or "content" is required!');
			}
		}
		if(prefix && prefix.length === 0) {
			prefix = null;
		}
		this._prefix = prefix;
		return this;
	},
	
	
	/**
	 * Suffix of this control. Example:
	 * 
	 *     @example
	 *     dbPlaceObj.suffix([{field: '', content: '', width: 30}]);
	 * 
	 * @param {jslet.ui.FieldControlAddon[] | undefined} suffix - The suffix settings. 
	 * 
	 * @return {this | jslet.ui.FieldControlAddon[]}
	 */
	suffix: function(suffix) {
		if(suffix === undefined) {
			return this._suffix;
		}
		
		jslet.Checker.test('DBPlace#suffix', suffix).isArray();
		jslet.Checker.test('DBPlace#suffix', suffix).isArray();
		var setting;
		for(var i = 0, len = suffix.length; i < len; i++) {
			setting = suffix[i];
			if(!setting.field && !setting.content) {
				throw new Error('In DBPlace#suffix setting, one of property "field" or "content" is required!');
			}
		}
		if(suffix && suffix.length === 0) {
			suffix = null;
		}
		this._suffix = suffix; 
		return this;
	},
	
	expandChildWidth: function(expandChildWidth) {
		if(expandChildWidth === undefined) {
			return this._expandChildWidth;
		}
		this._expandChildWidth = expandChildWidth? true: false;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		Z.renderAll();
	},
	
	/**
	 * @protected
	 * @override
	 */
	refreshControl: function (evt) {
		var Z = this,
			evtType = evt.eventType;
		// Meta changed 
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA &&
			Z._field == evt.fieldName && 
			(evt.metaName == 'editControl' || evt.metaName == 'valueStyle')) {
			Z.renderAll();
			return true;
		}
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		Z.removeAllChildControls();
		
		var fldName, i, len,
			hasAddon = Z._prefix || Z._suffix;
		if(!hasAddon) {
			Z._renderEditor(Z._field, Z.el);
			return;
		}
		
		jQuery(Z.el).addClass('jl-comb-editor');
		if(Z._prefix) {
			Z._renderOtherPart(Z.el, Z._prefix);
		}
		var editorEl = Z._renderEditor(Z._field, Z.el);
		jQuery(editorEl).addClass('jl-comb-master');
		
		if(Z._suffix) {
			Z._renderOtherPart(Z.el, Z._suffix);
		}		
		return this;
	},
	
	_renderEditor: function(fldName, parentEl) {
		var Z = this,
			fldObj = Z._dataset.getField(fldName),
			param = fldObj.editControl();
		if (fldObj.valueStyle() == jslet.data.FieldValueStyle.BETWEEN && Z._valueIndex === undefined) {
			param = {
				type: 'DBBetweenEdit'
			};
		}
		param.dataset = Z._dataset;
		param.field = fldName;
		if(Z._valueIndex !== undefined) {
			param.valueIndex = Z._valueIndex;
		}
		if(Z._tabIndex || Z._tabIndex === 0) {
			param.tabIndex = Z._tabIndex;
		}
		var dbCtrl = jslet.ui.createControl(param, parentEl);
		Z.addChildControl(dbCtrl);
		if(dbCtrl.tableId) {
			dbCtrl.tableId(Z._tableId);
		}
		var elId = jslet.nextId();
		dbCtrl.el.id = elId;
		return dbCtrl.el;
	},
	
	_renderOtherPart: function(ctrlDiv, arrPrefixOrSuffix) {
		var fixCfg, editorEl, width, partEl, 
			jqCtrlDiv = jQuery(ctrlDiv);
		for(var i = 0, len = arrPrefixOrSuffix.length; i < len; i++) {
			fixCfg = arrPrefixOrSuffix[i];
			width = fixCfg.width;
			var id = jslet.nextId();
			jqCtrlDiv.append('<span id = "' + id + '"></span>');
			partEl = document.getElementById(id);
			if(fixCfg.field) {
				 this._renderEditor(fixCfg.field, partEl);
			} else if(fixCfg.content) {
				partEl.innerHTML = fixCfg.content;
			} else {
				console.warn('prefix or suffix: field or content is required!');
				continue;
			}
			if(!width) {
				console.warn('Width is empty, use 5% instead!');
				width = '5%';
			}
			jQuery(partEl).addClass('jl-comb-addon').children().first().addClass('input-sm');
			
			partEl.style.width = width;
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	canFocus: function() {
		return false;
	}
});

jslet.ui.register('DBPlace', jslet.ui.DBPlace);
jslet.ui.DBPlace.htmlTemplate = '<div></div>';

/**
 * @class
 * @extend jslet.ui.DBFieldControl
 * 
 * DBText is a powerful control, it can input any data type, like: Number, Date etc. Example:
 * 
 *     @example
 *      var jsletParam = {type:“DBText“,field:“name“};
 *     //1. Declaring:
 *      <input id=“ctrlId“ type=“text“ data-jslet='jsletParam' /&gt;
 *      or
 *      <input id=“ctrlId“ type=“text“ data-jslet='{type:“DBText“,field:“name“}' /&gt;
 * 
 *     //2. Binding
 *      <input id=“ctrlId“ type=“text“ data-jslet='jsletParam' /&gt;
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 * 
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBText = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,beforeUpdateToDataset,enableInvalidTip,onKeyDown,autoSelectAll,readOnly';

		/**
		 * @protected
		 */
		Z._beforeUpdateToDataset = null;
		
		Z._enableInvalidTip = true;
		
		Z._enterProcessed = false;
		
		Z._autoSelectAll = true;

		Z._readOnly = false;
		
		Z.oldValue = null;
		Z.editMask = null;
		Z._position = null;
		$super(el, params);
	},

	beforeUpdateToDataset: function(beforeUpdateToDataset) {
		if(beforeUpdateToDataset === undefined) {
			return this._beforeUpdateToDataset;
		}
		jslet.Checker.test('DBText.beforeUpdateToDataset', beforeUpdateToDataset).isFunction();
		this._beforeUpdateToDataset = beforeUpdateToDataset;
		return this;
	},

	enableInvalidTip: function(enableInvalidTip) {
		if(enableInvalidTip === undefined) {
			return this._enableInvalidTip;
		}
		this._enableInvalidTip = enableInvalidTip? true: false;
		return this;
	},

	readOnly: function(readOnly) {
		if(readOnly === undefined) {
			return this._readOnly;
		}
		this._readOnly = readOnly? true: false;
		if(readOnly) {
			this.el.readOnly = true;
		}
		return this;
	},

	/**
	 * @property
	 * 
	 * Identify whether selecting all text when the text box got focus.
	 * 
	 * @param {Boolean | undefined} autoSelectAll True - select all text, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	autoSelectAll: function(autoSelectAll) {
		if(autoSelectAll === undefined) {
			return this._autoSelectAll;
		}
		this._autoSelectAll = autoSelectAll? true: false;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'input' && 
				el.type.toLowerCase() == 'text';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.addClass('form-control input-sm');
		Z.el.name = Z._field;
		if (Z.doFocus) {
			jqEl.on('focus', jQuery.proxy(Z.doFocus, Z));
		}
		if (Z.doBlur) {
			jqEl.on('blur', jQuery.proxy(Z.doBlur, Z));
		}
		if (Z.doKeydown) {
			jqEl.on('keydown', Z.doKeydown);
		}
		if (Z.doKeypress) {
			jqEl.on('keypress', Z.doKeypress);
		}
		Z.doMetaChanged('required');
	}, // end bind

	/**
	 * @protected
	 * @override
	 */
	doFocus: function () {
		var Z = this;
		if (Z._skipFocusEvent) {
			return;
		}
		jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		Z.doValueChanged();
		Z.oldValue = Z.el.value;
		if(Z._autoSelectAll) {
			jslet.ui.TextUtil.selectText(Z.el);
		}
	},

	/**
	 * @protected
	 * @override
	 */
	doBlur: function () {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		Z._position = jslet.ui.TextUtil.getCursorPos(Z.el);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		var jqEl = jQuery(this.el);
		if(jqEl.attr('readOnly') || jqEl.attr('disabled')) {
			return;
		}
		Z.updateToDataset();
		Z._isBluring = true;
		try {
			Z.doValueChanged();
		} finally {
			Z._isBluring = false;
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doKeydown: function(event) {
		event = jQuery.event.fix( event || window.event );
		var keyCode = event.which;
		//When press 'enter', write data to dataset.
		var Z = this.jslet,
			K = jslet.ui.KeyCode;
		if(keyCode === K.ENTER) {
			Z._enterProcessed = true;
			Z.updateToDataset();
		}
		//Process 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown' key when it is editing. 
		var isEditing = Z._dataset.status() > 0;
		if(isEditing && (keyCode === K.UP || keyCode === K.DOWN || keyCode === K.PAGEUP || keyCode === K.PAGEDOWN)) {
			Z._enterProcessed = true;
			Z.updateToDataset();
		}
		var fldObj = Z._dataset.getField(Z._field);
		if (!fldObj.readOnly() && !fldObj.disabled() && (keyCode === K.BACKSPACE || keyCode === K.DELETE)) {
			Z._dataset.editRecord();
		}
		if(keyCode === K.LEFT || keyCode === K.RIGHT) { //Arrow-left, Arrow-right
			var pos = jslet.ui.TextUtil.getCursorPos(Z.el);
			if((keyCode === K.LEFT && pos.begin > 0) || 
					(keyCode === 39 && pos.begin < Z.el.value.length)) {
	       		event.stopImmediatePropagation();
			}
		}
	},

	/**
	 * @protected
	 * @override
	 */
	doKeypress: function (event) {
		var Z = this.jslet,
			fldObj = Z._dataset.getField(Z._field);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		event = jQuery.event.fix( event || window.event );
		var keyCode = event.which,
			existStr = jslet.cutString(Z.el.value, jslet.ui.TextUtil.getSelectedText(Z.el)),
			cursorPos = jslet.ui.TextUtil.getCursorPos(Z.el);
		if (!Z._dataset.fieldValidator().checkInputChar(fldObj, String.fromCharCode(keyCode), existStr, cursorPos.begin)) {
			event.preventDefault();
			return false;
		}
		Z._dataset.editRecord();
		//When press 'enter', write data to dataset.
		if(keyCode === jslet.ui.KeyCode.ENTER) {
			if(!Z._enterProcessed) {
				Z.updateToDataset();
			} else {
				Z._enterProcessed = false;
			}
		}
	},

	/**
	 * Select text.
	 * 
	 * @param {Integer} start (Optional) Start of cursor position.
	 * @param {Integer} end (Optional) End of cursor position.
	 * 
	 * @return {this}
	 */
	selectText: function(start, end){
		jslet.ui.TextUtil.selectText(this.el, start, end);
		return this;
	},
	
	/**
	 * Input a text into text control at current cursor position.
	 * 
	 * @param {String} text The text need to be input.
	 * 
	 * @return {this}
	 */
	inputText: function(text) {
		if(!text) {
			return;
		}
		jslet.Checker.test('DBText.inputText#text', text).isString();
		
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(fldObj.getType() !== jslet.data.DataType.STRING) {
			console.warn('Only String Field can be input!');
			return;
		}
		var ch, chs = [];
		for(var i = 0, len = text.length; i < len; i++) {
			ch = text[i];
			if (Z._dataset.fieldValidator().checkInputChar(fldObj, ch)) {
				chs.push(ch);
			}
		}
		if(!Z._position) {
			Z._position = jslet.ui.TextUtil.getCursorPos(Z.el);
		}
		var subStr = chs.join(''),
			value =Z.el.value,
			begin = Z._position.begin,
			end = Z._position.end;
		var prefix = value.substring(0, begin), 
			suffix = value.substring(end); 
		Z.el.value = prefix + text + suffix;
		Z._position = jslet.ui.TextUtil.getCursorPos(Z.el);		
		Z.updateToDataset();
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	refreshControl: function ($super, evt, isForce) {
		if($super(evt, isForce) && this.afterRefreshControl) {
			this.afterRefreshControl(evt);
		}
	}, 

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!Z._readOnly && (!metaName || metaName == "disabled" || metaName == "readOnly")) {
			jslet.ui.setEditableStyle(Z.el, fldObj.disabled(), fldObj.readOnly(), false, fldObj.required());
		}
		
		if(metaName && metaName == 'required') {
			var jqEl = jQuery(Z.el);
			if (fldObj.required()) {
				jqEl.addClass('jl-ctrl-required');
			} else {
				jqEl.removeClass('jl-ctrl-required');
			}
		}
		if(!metaName || metaName == 'editMask') {
			var editMaskCfg = fldObj.editMask();
			if (editMaskCfg) {
				if(!Z.editMask) {
					Z.editMask = new jslet.ui.EditMask();
					Z.editMask.attach(Z.el);
				}
				var mask = editMaskCfg.mask,
					keepChar = editMaskCfg.keepChar,
					transform = editMaskCfg.transform;
				Z.editMask.setMask(mask, keepChar, transform);
			} else {
				if(Z.editMask) {
					Z.editMask.detach();
					Z.editMask = null;
				}
			}
		}
		
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
		
		Z.el.maxLength = fldObj.getEditLength();
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var errObj = Z.getFieldError();
		if(errObj && errObj.message) {
			Z.el.value = errObj.inputText || Z._dataset.getFieldText(Z._field);
			Z.renderInvalid(errObj);
			return;
		} else {
			Z.renderInvalid(null);
		}
		var fldObj = Z._dataset.getField(Z._field);
		var align = fldObj.alignment();
	
		if (jsletlocale.isRtl){
			if (align == 'left') {
				align= 'right';
			} else {
				align = 'left';
			}
		}
		Z.el.style.textAlign = align;
		var value;
		if (Z.editMask){
			value = Z.getText();
			Z.editMask.setValue(value);
		} else {
			if (document.activeElement != Z.el || Z.el.readOnly || Z._isBluring) {
				value = Z.getText(false);
			} else {
				value = Z.getText(true);
			}
			if(fldObj.getType() === jslet.data.DataType.STRING && fldObj.antiXss()) {
				value = jslet.htmlDecode(value);
			}
			Z.el.value = value;
		}
		Z.oldValue = Z.el.value;
	},

	/**
	 * @protected
	 * @override
	 */
	doLookupChanged: function() {
		this.doValueChanged();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	}, // end renderAll

	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return true;
		}
		var value = Z.el.value;
		if(Z.oldValue == value) {
			return true;
		}
		Z._dataset.editRecord();
		if (this.editMask && !this.editMask.validateValue()) {
			return false;
		}
		if (Z._beforeUpdateToDataset) {
			if (!Z._beforeUpdateToDataset.call(Z)) {
				return false;
			}
		}

		Z._keep_silence_ = true;
		try {
			if (Z.editMask) {
				value = Z.editMask.getValue();
			}
			Z._dataset.setFieldText(Z._field, value, Z._valueIndex);
		} finally {
			Z._keep_silence_ = false;
		}
		Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		return true;
	}, // end updateToDataset

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		jQuery(Z.el).off();
		if (Z.editMask){
			Z.editMask.detach();
			Z.editMask = null;
		}
		Z._beforeUpdateToDataset = null;
		Z.onKeyDown = null;
		$super();
	}
});
jslet.ui.register('DBText', jslet.ui.DBText);
jslet.ui.DBText.htmlTemplate = '<input type="text"></input>';

/**
 * @class
 * @extend jslet.ui.DBText
 * 
 * DBPassword.
 */
jslet.ui.DBPassword = jslet.Class.create(jslet.ui.DBText, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		jQuery(el).attr('type', 'password');
		$super(el, params);
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'input';
	}
});

jslet.ui.register('DBPassword', jslet.ui.DBPassword);
jslet.ui.DBPassword.htmlTemplate = '<input type="password"></input>';

/**
 * @class
 * @extend jslet.ui.DBText
 * 
 * DBTextArea.
 */
jslet.ui.DBTextArea = jslet.Class.create(jslet.ui.DBText, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		$super(el, params);
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'textarea';
	}
});

jslet.ui.register('DBTextArea', jslet.ui.DBTextArea);
jslet.ui.DBTextArea.htmlTemplate = '<textarea></textarea>';


/**
 * @class
 * @extend jslet.ui.DBFieldControl
 * 
 * DBCustomComboBox: used for jslet.ui.DBComboSelect and jslet.ui.DBDatePicker.
 */
jslet.ui.DBCustomComboBox = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,textReadOnly';
		Z._textReadOnly = false;
		Z.enableInvalidTip = false;

		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Identify whether the text box is read only.
	 * 
	 * @param {Boolean | undefined} textReadOnly True - text box is read only, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	textReadOnly: function(textReadOnly) {
		if(textReadOnly === undefined) {
			return this._textReadOnly;
		}
		this._textReadOnly = textReadOnly ? true: false;
		if(this.textCtrl) {
			this.textCtrl.readOnly(textReadOnly);
		}
		return this;
	},
	
//	/**
//	 * @protected
//	 * @override
//	 */
//	afterBind: function ($super) {
//		$super();
//		
//		if (this._textReadOnly) {
//			this.el.childNodes[0].readOnly = true;
//		}
//	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('input-group')) {
			jqEl.addClass('input-group input-group-sm');
		}
		var btnCls = Z.comboButtonCls ? Z.comboButtonCls:'fa-caret-down'; 
		var s = '<input type="text" class="form-control">' + 
    	'<span class="input-group-btn jl-comb-btn-group"><button class="btn btn-default btn-sm " tabindex="-1"><i class="fa ' + btnCls + '"></i></button></span>'; 
		jqEl.html(s);
		var dbtext = jqEl.find('[type="text"]')[0];
		Z.textCtrl = new jslet.ui.DBText(dbtext, {
			type: 'dbtext',
			dataset: Z._dataset,
			field: Z._textField || Z._field,
			enableInvalidTip: true,
			valueIndex: Z._valueIndex,
			tabIndex: Z._tabIndex,
			readOnly: Z._textReadOnly
		});
		jQuery(dbtext).on('keydown', function(event) {
			var keyCode = event.which;
			if(keyCode === jslet.ui.KeyCode.BACKSPACE && !this.value) {
				Z.buttonClick();
			}
		});
		
		jQuery(dbtext).on('click', function(event) {
			if(Z._textReadOnly) {
				Z.buttonClick();
			}
       		event.preventDefault();
       		event.stopImmediatePropagation();
       		return false;
		});
		
		Z.addChildControl(Z.textCtrl);
		
		var jqBtn = jqEl.find('button');
		if (this.buttonClick) {
			
			jqBtn.on('click', function(event){
				Z.buttonClick(jqBtn[0]);
			});
			jqBtn.focus(function(event) {
				jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
			});
			jqBtn.blur(function(event) {
				jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
			});
			
		}
	},


	/**
	 * @protected
	 * @override
	 */
	tableId: function ($super, tableId) {
		$super(tableId);
		this.textCtrl.tableId(tableId);
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl();
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	innerFocus: function() {
		var Z = this;
		if(Z._textReadOnly) {
			jQuery(Z.el).find('button').focus();
		} else {
			Z.textCtrl.focus();
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this;
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var fldObj = Z._dataset.getField(Z._field),
				flag = fldObj.disabled() || fldObj.readOnly();
			var jqEl = jQuery(Z.el);
			jqEl.find('button').attr("disabled", flag);
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		var dbbtn = Z.el.childNodes[1];
		dbbtn.onclick = null;
		jQuery(Z.textCtrl.el).off('keydown', this.popupUp);
		Z.textCtrl.destroy();
		Z.textCtrl = null;
		$super();
	}
});




/**
 * @class
 * @extend jslet.ui.DBText
 * 
 * DBAutoComplete. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBAutoComplete",field:"department", matchType:"start"};
 *     //1. Declaring:
 *      <input id="cboAuto" type="text" data-jslet='jsletParam' />
 *      
 *     //2. Binding
 *      <input id="cboAuto" type="text" data-jslet='jsletParam' />
 *      //Js snippet
 *      var el = document.getElementById('cboAuto');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBAutoComplete = jslet.Class.create(jslet.ui.DBText, {
	
	MatchModes: ['start','end', 'any'],
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		if (!Z.allProperties) {
			Z.allProperties = 'styleClass,dataset,field,lookupField,minChars,minDelay,displayTemplate,matchMode,beforePopup,onGetFilterField,filterFields';
		}
		
		Z._lookupField = null;
		
		Z._minChars = 0;

		Z._minDelay = 0;
		
		Z._beforePopup = null;
		
		Z._filterFields = null;
		
		Z._defaultFilterFields = null;
		
		Z._onGetFilterField = null;
		
		Z._matchMode = 'start';
		
		Z._timeoutHandler = null; 
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get lookup field name.
	 * 
	 * @param {String | undefined} lookupField Lookup field name.
	 * 
	 * @return {this | String}
	 */
	lookupField: function(lookupField) {
		if(lookupField === undefined) {
			return this._lookupField;
		}
		jslet.Checker.test('DBAutoComplete.lookupField', lookupField).isString();
		this._lookupField = lookupField;
		return this;
	},
   
	/**
	 * @property
	 * 
	 * Set or get minimum characters before searching. <br />
	 * Suppose minChars = 3, when user input 1 character, the search panel would not pop up. After user input 3 characters, the search panel pops up.
	 * 
	 * @param {Integer | undefined} minChars Minimum characters before searching.
	 * 
	 * @return {this | Integer}
	 */
	minChars: function(minChars) {
		if(minChars === undefined) {
			return this._minChars;
		}
		jslet.Checker.test('DBAutoComplete.minChars', minChars).isGTEZero();
		this._minChars = parseInt(minChars);
		return this;
	},
   
	/**
	 * @property
	 * 
	 * Set or get delay time(ms) before auto searching. If user input the value very quickly, the searching panel would not pop up.
	 * 
	 * @param {Integer | undefined} minDelay Delay time.
	 * 
	 * @return {this | Integer}
	 */
	minDelay: function(minDelay) {
		if(minDelay === undefined) {
			return this._minDelay;
		}
		jslet.Checker.test('DBAutoComplete.minDelay', minDelay).isGTEZero();
		this._minDelay = parseInt(minDelay);
		return this;
	},
   
	/**
	 * @property
	 * 
	 * Set or get match mode.
	 * 
	 * @param {String | undefined} matchMode match mode, optional values: 'start'(default), 'end', 'any'.
	 * 
	 * @return {this | String}
	 */
	matchMode: function(matchMode) {
		if(matchMode === undefined) {
			return this._matchMode;
		}
		matchMode = jQuery.trim(matchMode);
		var checker = jslet.Checker.test('DBAutoComplete.matchMode', matchMode).isString();
		matchMode = matchMode.toLowerCase();
		checker.testValue(matchMode).inArray(this.MatchModes);
		this._matchMode = matchMode;
		return this;
	},
   
	/**
	 * @property
	 * 
	 * Set or get filter fields, more than one fields are separated with ','. <br />
	 * Filter fields is used to match the inputting value.
	 * 
	 * @param {String | undefined} filterFields Filter fields.
	 * 
	 * @return {this | String}
	 */
	filterFields: function(filterFields) {
		var Z = this;
		if(filterFields === undefined) {
			return Z._filterFields;
		}
		jslet.Checker.test('DBAutoComplete.filterFields', filterFields).isString();
		Z._filterFields = filterFields;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get before pop up event handler, you can use this to customize the display result. Example:
	 * 
	 *     @example
	 *     autoCompleteObj.beforePopup(function(dataset, inputValue){});
	 * 
	 * @param {Function | undefined} beforePopup Before pop up event handler.
	 * @param {jslet.data.Dataset} beforePopup.dataset Dataset object.
	 * @param {String} beforePopup.inputValue Input value.
	 * 
	 * @return {this | Function}
	 */
	beforePopup: function(beforePopup) {
		if(beforePopup === undefined) {
			return this._beforePopup;
		}
		this._beforePopup = beforePopup;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get filter field event handler, you can use this to customize the display result.. Example:
	 * 
	 *     @example
	 *     autoCompleteObj.onGetFilterField(function(dataset, inputValue){});
	 *   
	 * @param {Function | undefined} onGetFilterField Filter field event handler.
	 * @param {jslet.data.Dataset} onGetFilterField.dataset Dataset object.
	 * @param {String} onGetFilterField.inputValue Input value.
	 * @param {String} onGetFilterField.return Filter field name.
	 * 
	 * @return {this | Function}
	 */
	onGetFilterField: function(onGetFilterField) {
		if(onGetFilterField === undefined) {
			return this._onGetFilterField;
		}
		this._onGetFilterField = onGetFilterField;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'input' &&
			el.type.toLowerCase() == 'text';
	},

	/**
	 * @protected
	 * @override
	 */
	doBlur: function () {
		var Z = this;
		if (Z.el.disabled || Z.el.readOnly) {
			return;
		}
		var	fldObj = Z._dataset.getField(Z._field);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		if (Z.contentPanel && Z.contentPanel.isShowing()) {
			if(Z._isSelecting) {
				return;
			}
			var value = Z.el.value, canBlur = true;
			if(!Z._lookupField) {
				fldObj = Z._dataset.getField(Z._field);
				var	lkf = fldObj.lookup(),
					lkds = lkf.dataset();
				if(value.length > 0 && lkds.recordCount() === 0) {
					canBlur = false;
				}
			}
			if (Z.contentPanel && Z.contentPanel.isShowing()) {
				Z.contentPanel.closePopup();
			}
			Z.updateToDataset();
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
			if(!canBlur) {
				Z.el.focus();
			}
		} else {
			Z.updateToDataset();
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		}
	},

	doChange: null,

	/**
	 * @protected
	 * @override
	 */
	doKeydown: function (event) {
		if (this.disabled || this.readOnly) {
			return;
		}
		event = jQuery.event.fix( event || window.event );

		var keyCode = event.which, 
			Z = this.jslet,
			K = jslet.ui.KeyCode;
		if(keyCode >= K.F1 && keyCode <= K.F12 || keyCode === K.SHIFT || keyCode === K.CONTROL || keyCode === K.ALT || 
				keyCode === K.CAPSLOCK || keyCode === K.INSERT || keyCode === K.HOME || keyCode === K.END || 
				keyCode === K.PAGEUP || keyCode === K.PAGEDOWN || keyCode === K.LEFT || keyCode === K.RIGHT) { 
			return;
		}
		if(keyCode === K.ESCAPE && Z.contentPanel) {
			Z.contentPanel.closePopup();
			return;
		}
		if (keyCode === K.UP || keyCode === K.DOWN) {
			if(Z.contentPanel && Z.contentPanel.isPop) {
				var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
				lkf = fldObj.lookup(),
				lkds = lkf.dataset();
				if (keyCode === K.UP) { //up arrow
					lkds.prior();
					event.preventDefault();
		       		event.stopImmediatePropagation();
				}
				if (keyCode === K.DOWN) {//down arrow
					lkds.next();
					event.preventDefault();
		       		event.stopImmediatePropagation();
				}
			} else {
				if(!Z.tableId()) {
					Z._invokePopup();
				}
			}
			return;
		} 

		if (keyCode === K.DELETE || keyCode === K.BACKSPACE || keyCode === K.IME) {
			Z._invokePopup();
			return;
		}
		if (keyCode !== K.ENTER && keyCode !== K.TAB) {
			Z._invokePopup();
		} else if (Z.contentPanel) {
			if(Z.contentPanel.isShowing()) {
				Z.contentPanel.confirmSelect();
			}
		}
	},

	/**
	 * @protected
	 * @override
	 */
	doKeypress: function (event) {
		if (this.disabled || this.readOnly) {
			return;
		}
//		var keyCode = event.keyCode ? event.keyCode : 
//			event.which	? event.which: event.charCode;
//		var Z = this.jslet;
//		if (keyCode != 13 && keyCode != 9) {
//			Z._invokePopup();
//		} else if (Z.contentPanel) {
//			if(Z.contentPanel.isShowing()) {
//				Z.contentPanel.confirmSelect();
//			}
//		}
	},

	_invokePopup: function () {
		var Z = this;
		if (Z._timeoutHandler) {
			clearTimeout(Z._timeoutHandler);
		}
		var delayTime = 100;
		if (Z._minDelay) {
			delayTime = parseInt(Z._minDelay);
		}
		
		Z._timeoutHandler = setTimeout(function () {
			Z._populate(Z.el.value); 
		}, delayTime);
	},

	_getDefaultFilterFields: function(lookupFldObj) {
		var Z = this;
		if(Z._defaultFilterFields) {
			return Z._defaultFilterFields;
		}
		var codeFld = lookupFldObj.codeField(),
			nameFld = lookupFldObj.nameField(),
			lkDs = lookupFldObj.dataset(),
			codeFldObj = lkDs.getField(codeFld),
			nameFldObj = lkDs.getField(nameFld),
			arrFields = [];
		if(codeFldObj && codeFldObj.visible()) {
			arrFields.push(codeFld);
		}
		if(codeFld != nameFld && nameFldObj && nameFldObj.visible()) {
			arrFields.push(nameFld);
		}
		Z._defaultFilterFields = arrFields;
		return arrFields;
	},
	
	_getFilterFields: function(lkFldObj, inputValue) {
		var Z = this;
		var filterFlds = null;
		
		var eventFunc = jslet.getFunction(Z._onGetFilterField);
		if (eventFunc) {
			filterFlds = eventFunc.call(Z, lkFldObj.dataset(), inputValue);
			jslet.Checker.test('DBAutoComplete.onGetFilterField#return', filterFlds).isString();
		}
		filterFlds = filterFlds || Z._filterFields;
		var arrFields;
		if (filterFlds) {
			arrFields = filterFlds.split(',');
		} else {
			arrFields = Z._getDefaultFilterFields(lkFldObj);
		}
		if(arrFields.length === 0) {
			throw new Error('Not specified [filter fields]!');
		}
		var filterValue = inputValue;
		if (Z._matchMode == 'start') {
			filterValue = filterValue + '%';
		} else {
			if (Z._matchMode == 'end') {
				filterValue = '%' + filterValue;
			} else {
				filterValue = '%' + filterValue + '%';
			}
		}
		var fldName, result = '';
		for(var i = 0, len = arrFields.length; i < len; i++) {
			fldName = arrFields[i];
			if(i > 0) {
				result += ' || ';
			}
			result += 'like([' + fldName + '],"' + filterValue + '")';
		}
		return result;
	},
	
	_populate: function (inputValue) {
		var Z = this;
		if (Z._minChars > 0 && inputValue && inputValue.length < Z._minChars) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
			lkFld = fldObj.lookup();
		if (!lkFld) {
			console.error(Z._field + ' is NOT a lookup field!');
			return;
		}
		
		var lkds = lkFld.dataset(),
			oldFlag = lkds.autoRefreshHostDataset();
		lkds.autoRefreshHostDataset(true);
		try {
			var	editFilter = lkFld.editFilter();
			var eventFunc = jslet.getFunction(Z._beforePopup);
			if (eventFunc) {
				eventFunc.call(Z, lkds, inputValue, editFilter);
			} else if (inputValue) {
				var filter = Z._getFilterFields(lkFld, inputValue);
				if(editFilter) {
					if(filter) {
						filter = '(' + editFilter + ') && (' + filter + ')';
					} else {
						filter = editFilter;
					}
				}
				lkds.filter(filter);
				lkds.filtered(true);
			} else {
				if(editFilter) {
					lkds.filter(editFilter);
					lkds.filtered(true);
				} else {
					lkds.filter(null);
					if(!lkds.fixedFilter()) {
						lkds.filtered(false);
					}
				}
			}
		} finally {
			lkds.autoRefreshHostDataset(oldFlag);
		}
		//Clear field value which specified by 'lookupField'.
		if(Z._lookupField) {
			var dataRec = Z._dataset.getRecord();
			if(dataRec) {
				dataRec[Z._lookupField] = null;
			}
		}
		if (!Z.contentPanel) {
			Z.contentPanel = new jslet.ui.DBAutoCompletePanel(Z);
		} else {
			if(Z.contentPanel.isShowing()) {
				return;
			}
		}
		var jqEl = jQuery(Z.el),
			r = jqEl.offset(),
			h = jqEl.outerHeight(),
			x = r.left,
			y = r.top + h;
		
		if (jsletlocale.isRtl){
			x = x + jqEl.outerWidth() - Z.contentPanel.dlgWidth;
		}
		Z.contentPanel.showPopup(x, y, 0, h);
	},
	
	_destroyPopPanel: function() {
		var Z = this;
		if (Z.contentPanel){
			Z.contentPanel.destroy();
			Z.contentPanel = null;
		}
	},
		
	/**
	 * @protected
	 * @override
	 */
	doLookupChanged: function (isMetaChanged) {
		if(isMetaChanged) {
			this._destroyPopPanel();
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		this._destroyPopPanel();
		jQuery(this.el).off();
		$super();
	}
	
});

/**
 * @private
 * @class DBAutoCompletePanel
 * 
 */
jslet.ui.DBAutoCompletePanel = function (autoCompleteObj) {
	var Z = this;
	Z.dlgWidth = 320;
	Z.dlgHeight = 180;

	var lkf, lkds;
	Z.comboCfg = autoCompleteObj;
	Z.dataset = autoCompleteObj.dataset();
	Z.field = autoCompleteObj.lookupField() || autoCompleteObj.field();
	Z.lkDataset = null;

	Z.confirmSelect = function () {
		Z.comboCfg._isSelecting = true;
		var fldValue = Z.lkDataset.keyValue();
		if (fldValue || fldValue === 0) {
			Z.dataset.setFieldValue(Z.field, fldValue, Z.valueIndex);			
			Z.comboCfg.el.focus();
		}
		if (Z.comboCfg.afterSelect) {
			Z.comboCfg.afterSelect(Z.dataset, Z.lkDataset);
		}
		Z.closePopup();
	};

	function create () {
		if (!Z.panel) {
			Z.panel = document.createElement('div');
			Z.panel.style.width = '100%';
			Z.panel.style.height = '100%';
			jQuery(Z.panel).on("mousedown", function(event){
				Z.comboCfg._isSelecting = true;
				event.stopPropagation();
			});
		}
		//process variable
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup(),
			lkds = lkfld.dataset();
		Z.lkDataset = lkds;
		var fields = lkds.getNormalFields(),
			totalChars = 0;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if(fldObj.visible()) {
				totalChars += fldObj.displayWidth();
			}
		}
		var totalWidth = totalChars * (jslet.global.defaultCharWidth || 12) + 30;
		Z.dlgWidth = totalWidth;
		if(Z.dlgWidth < 150) {
			Z.dlgWidth = 150;
		}
		if(Z.dlgWidth > 500) {
			Z.dlgWidth = 500;
		}

		Z.panel.innerHTML = '';

		var cntw = Z.dlgWidth - 4,
			cnth = Z.dlgHeight - 4,
			tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, noborder:true, hasSelectCol: false, hasSeqCol: false, hideHead: true };
		tableparam.onRowClick = Z.confirmSelect;

		Z.otable = jslet.ui.createControl(tableparam, Z.panel, '100%', cnth);
		Z.otable.el.focus();
		Z.otable.el.style.border = "0";
		
		return Z.panel;
	}

	Z.showPopup = function (left, top, ajustX, ajustY) {
		Z.comboCfg._isSelecting = false;
		Z.isPop = true;
		Z.popup.show(left, top, Z.dlgWidth, Z.dlgHeight, ajustX, ajustY);
	};

	Z.doClosePopup = function () {
		Z.isPop = false;
		var oldRecno = Z.lkDataset.recno() || 0;
		try {
			Z.lkDataset.filter(null);
		} finally {
			if(oldRecno >= 0) {
				Z.lkDataset.recno(oldRecno);
			}
		}
	};
	
	Z.closePopup = function () {
		Z.popup.hide();
	};
	
	Z.isShowing = function(){
		return Z.isPop;
	};
	
	create();
	Z.popup = new jslet.ui.PopupPanel(autoCompleteObj.el);
	Z.popup.contentElement(Z.panel);
	Z.popup.onHidePopup(Z.doClosePopup);
	Z.isPop = false;
	
	Z.destroy = function(){
		jQuery(Z.panel).off();
		Z.otable.onRowClick = null;
		Z.otable.destroy();
		Z.otable = null;
		Z.panel = null;
		Z.popup.destroy();
		Z.popup = null;
		Z.comboCfg = null;
		Z.dataset = null;
		Z.field = null;
		Z.lkDataset = null;
	};
};

jslet.ui.register('DBAutoComplete', jslet.ui.DBAutoComplete);
jslet.ui.DBAutoComplete.htmlTemplate = '<input type="text"></input>';

/**
 * @class
 * @extend jslet.ui.DBFieldControl
 * 
 * DBBetweenEdit. <br /> 
 * It implements "From ... To ..." style editor. This editor usually use in query parameter editor. <br />
 * Example:
 * 
 *     @example
 *       var jsletParam = {type:"DBBetweenEdit","field":"dateFld"};
 *
 *     //1. Declaring:
 *       <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *       <div id="ctrlId"  />
 *     //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBBetweenEdit = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'styleClass,dataset,field';
		this._minEleId = null;
		this._maxEleId = null;

		$super(el, params);
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		Z.renderAll();
	},

	/**
	 * @hide
	 */
	refreshControl: function (evt) {
		return;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		Z.removeAllChildControls();
		jslet.ui.textMeasurer.setElement(Z.el);
		var lbl = jsletlocale.Dataset.betweenLabel;
		if (!lbl) {
			lbl = '-';
		}
		lbl = '&nbsp;' + lbl + '&nbsp;';

		var fldObj = Z._dataset.getField(Z._field);
		var ctrlCfg = {};
		ctrlCfg.dataset = Z._dataset.name();
		ctrlCfg.field = Z._field;
		ctrlCfg.type = 'DBPlace';
		ctrlCfg.valueIndex = 0;
		
		var template = 
			'<div class="input-group">' + 
			'<div class="jl-btw-min" data-jslet=\'' + JSON.stringify(ctrlCfg) + '\'></div>' + 
			'<span class="input-group-addon jl-btw-separator">' + lbl + '</span>';
		ctrlCfg.valueIndex = 1;
		template += 
			'<div class="jl-btw-max" data-jslet=\'' + JSON.stringify(ctrlCfg) + '\'></div>' + 
			'</div>';

		Z.el.innerHTML = template;
		jslet.ui.install(Z.el);
		var jqEl = jQuery(Z.el);
		Z._minEleId = jqEl.find('.jl-btw-min')[0].id;
		Z._maxEleId = jqEl.find('.jl-btw-max')[0].id;
		
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	tableId: function($super, tableId){
		$super(tableId);
		jslet('#'+ this._minEleId).tableId(tableId);
		jslet('#'+ this._maxEleId).tableId(tableId);
	},
	
	/**
	 * @protected
	 * @override
	 */
	innerFocus: function() {
		jslet('#'+ this._minEleId).focus();
	}
	
});

jslet.ui.register('DBBetweenEdit', jslet.ui.DBBetweenEdit);
jslet.ui.DBBetweenEdit.htmlTemplate = '<div></div>';

/**
 * @class
 * @extend jslet.ui.DBFieldControl
 *  
 * DBCheckBox. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBCheckBox", dataset:"employee", field:"married"};
 * 
 *     //1. Declaring:
 *      <input type='checkbox' data-jslet='type:"DBCheckBox",dataset:"employee", field:"married"' />
 *      or
 *      <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <input id="ctrlId" type="checkbox" />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBCheckBox = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.isCheckBox = true;
		Z.allProperties = 'styleClass,dataset,field,beforeClick';
		Z._beforeClick = null;
		
		Z._skipRefresh = false;
		jQuery(el).attr('type', 'checkbox');
		$super(el, params);
	},

	beforeClick: function(beforeClick) {
		if(beforeClick === undefined) {
			return this._beforeClick;
		}
		jslet.Checker.test('DBCheckBox.beforeClick', beforeClick).isFunction();
		this._beforeClick = beforeClick;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'input';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		Z.renderAll();
		Z.el.name = Z._field;
		var jqEl = jQuery(Z.el);
		if(!jqEl.hasClass('jl-dbcheck')) {
			jqEl.addClass('jl-dbcheck');
		}
		jqEl.on('click', Z._doClick);
		jqEl.focus(function(event) {
			jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		});
		jqEl.blur(function(event) {
			jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		});
		jqEl.addClass('checkbox-inline form-control');
	}, // end bind

	_doClick: function (event) {
		var Z = this.jslet;
		if (Z._beforeClick) {
			var result = Z._beforeClick.call(Z, Z.el);
			if (!result) {
				return;
			}
		}
		Z.updateToDataset();
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled() || fldObj.readOnly();
			jslet.ui.setEditableStyle(Z.el, disabled, disabled, false, fldObj.required());
			Z.setTabIndex();
		}
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if(Z._skipRefresh) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._field),
			value = Z.getValue();
		if (value) {
			Z.el.checked = true;
		} else {
			Z.el.checked = false;
		}
	},
	
	focus: function() {
		this.el.focus();
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},

	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._field),
			value = Z.el.checked;
		Z._keep_silence_ = true;
		try {
			Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
		} finally {
			Z._keep_silence_ = false;
		}
	}, // end updateToDataset
	
	/**
	 * @override
	 */
	destroy: function($super){
		jQuery(this.el).off();
		$super();
	}
});

jslet.ui.register('DBCheckBox', jslet.ui.DBCheckBox);
jslet.ui.DBCheckBox.htmlTemplate = '<input type="checkbox"></input>';


/**
 * @class
 * @extend jslet.ui.DBFieldControl
 * 
 * DBCheckBoxGroup. Display a group of checkbox. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBCheckBoxGroup",dataset:"employee",field:"department", columnCount: 3};
 * 
 *     //1. Declaring:
 *      <div data-jslet='type:"DBCheckBoxGroup",dataset:"employee",field:"department", columnCount: 3' />
 *      or
 *      <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBCheckBoxGroup = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,columnCount,hasSelectAllBox';
		
		Z._columnCount = 99999;
		
		Z._hasSelectAllBox = false;
		
		Z._itemIds = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get column count.
	 * 
	 * @param {Integer | undefined} columnCount Column count.
	 * 
	 * @return {this | Integer}
	 */
	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBCheckBoxGroup.columnCount', columnCount).isGTEZero();
		this._columnCount = parseInt(columnCount);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether creating "select all" box.
	 * 
	 * @param {Boolean | undefined} hasSelectAllBox True - has "select all box", false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasSelectAllBox: function(hasSelectAllBox) {
		if(hasSelectAllBox === undefined) {
			return this._hasSelectAllBox;
		}
		this._hasSelectAllBox = hasSelectAllBox? true: false;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		var fldObj = Z._dataset.getField(Z._field);
//		if(fldObj.valueStyle() !== jslet.data.FieldValueStyle.MULTIPLE) {
//			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
//		}
		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.on('keydown', function(event) {
			var keyCode = event.which, idx, activeEle, activeId;
			
			if(keyCode === jslet.ui.KeyCode.LEFT) { //Arrow Left
				if(!Z._itemIds || Z._itemIds.length === 0) {
					return;
				}
				activeEle = document.activeElement;
				activeId = activeEle && activeEle.id;
				
				idx = Z._itemIds.indexOf(activeId);
				if(idx === 0) {
					return;
				}
				document.getElementById(Z._itemIds[idx - 1]).focus();
				event.preventDefault();
	       		event.stopImmediatePropagation();
			} else if( keyCode === jslet.ui.KeyCode.RIGHT) { //Arrow Right
				if(!Z._itemIds || Z._itemIds.length === 0) {
					return;
				}
				activeEle = document.activeElement;
				activeId = activeEle && activeEle.id;
				
				idx = Z._itemIds.indexOf(activeId);
				if(idx === Z._itemIds.length - 1) {
					return;
				}
				document.getElementById(Z._itemIds[idx + 1]).focus();
				event.preventDefault();
	       		event.stopImmediatePropagation();
			}
		});
		
		jqEl.on('click', 'input[type="checkbox"]', function (event) {
			var ctrl = this;
			window.setTimeout(function(){ //Defer firing 'updateToDataset' when this control is in DBTable to make row changed firstly.
				event.delegateTarget.jslet.updateToDataset(ctrl);
			}, 5);
		});
		jqEl.on('focus', 'input[type="checkbox"]', function (event) {
			jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		});
		jqEl.on('blur', 'input[type="checkbox"]', function (event) {
			jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		});
		jqEl.addClass('form-control');//Bootstrap class
		jqEl.css('height', 'auto');
	},

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly" || metaName == 'tabIndex') {
			var disabled = fldObj.disabled(),
				readOnly = fldObj.readOnly();
			disabled = disabled || readOnly;
			var chkBoxes = jQuery(Z.el).find('input[type="checkbox"]'),
				chkEle, 
				tabIndex = fldObj.tabIndex(),
				required = fldObj.required();
			for(var i = 0, cnt = chkBoxes.length; i < cnt; i++){
				chkEle = chkBoxes[i];
				jslet.ui.setEditableStyle(chkEle, disabled, readOnly, false, required);
				chkEle.tabIndex = tabIndex;
			}
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var checkboxs = jQuery(Z.el).find('input[type="checkbox"]'),
			chkcnt = checkboxs.length, 
			checkbox, i;
		for (i = 0; i < chkcnt; i++) {
			checkbox = checkboxs[i];
			if(jQuery(checkbox).hasClass('jl-selectall')) {
				continue;
			}
			checkbox.checked = false;
		}
		var values = Z.getValue();
		if(values && values.length > 0) {
			var valueCnt = values.length, value;
			for (i = 0; i < chkcnt; i++) {
				checkbox = checkboxs[i];
				for (var j = 0; j < valueCnt; j++) {
					value = values[j];
					if (value == checkbox.value) {
						checkbox.checked = true;
					}
				}
			}
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doLookupChanged: function () {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field), 
			lkf = fldObj.lookup();
		if (!lkf) {
			console.error(jslet.formatMessage(jsletlocale.Dataset.lookupNotFound,
					[fldObj.name()]));
			return;
		}
//		if(fldObj.valueStyle() != jslet.data.FieldValueStyle.MULTIPLE) {
//			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
//		}
		
		var lkds = lkf.dataset(),
			lkCnt = lkds.recordCount();
		if(lkCnt === 0) {
			Z.el.innerHTML = jsletlocale.DBCheckBoxGroup.noOptions;
			return;
		}
		Z._itemIds = [];
		var template = ['<table cellpadding="0" cellspacing="0">'],
			isNewRow = false;
		var editFilter = lkf.editFilter();
		Z._innerEditFilterExpr = null;
		var editItemDisabled = lkf.editItemDisabled();
		if(editFilter) {
			Z._innerEditFilterExpr = new jslet.data.Expression(lkds, editFilter);
		}
		var disableOption = false,
			k = -1,
			itemId;
		if(Z._hasSelectAllBox && lkCnt > 0) {
			template.push('<tr>');
			itemId = jslet.nextId();
			template.push('<td style="white-space: nowrap;vertical-align:middle"><input type="checkbox" class="jl-selectall"');
			template.push(' id="');
			template.push(itemId);
			template.push('"/><label for="');
			template.push(itemId);
			template.push('">');
			template.push(jsletlocale.DBCheckBoxGroup.selectAll);
			template.push('</label></td>');
			k = 0;
			Z._itemIds.push(itemId);
		}
		Z.el.innerHTML = '';
		var oldRecno = lkds.recnoSilence();
		try {
			for (var i = 0; i < lkCnt; i++) {
				lkds.recnoSilence(i);
				disableOption = false;
				if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
					if(!editItemDisabled) {
						continue;
					} else {
						disableOption = true;
					}
				}
				k++;
				isNewRow = (k % Z._columnCount === 0);
				if (isNewRow) {
					if (k > 0) {
						template.push('</tr>');
					}
					template.push('<tr>');
				}
				itemId = jslet.nextId();
				Z._itemIds.push(itemId);
				template.push('<td style="white-space: nowrap; "><input type="checkbox" value="');
				template.push(lkds.getFieldValue(lkf.keyField()));
				template.push('" id="');
				template.push(itemId);
				template.push('" ' + (disableOption? ' disabled': '') + '/><label for="');
				template.push(itemId);
				template.push('">');
				template.push(lkf.getCurrentDisplayValue());
				template.push('</label></td>');
				isNewRow = (k % Z._columnCount === 0);
			} // end for
			if (lkCnt > 0) {
				template.push('</tr>');
			}
			template.push('</table>');
			Z.el.innerHTML = template.join('');
		} finally {
			lkds.recnoSilence(oldRecno);
		}
		Z.doMetaChanged();
	}, // end renderOptions

	updateToDataset: function(currCheckBox) {
		var Z = this;
		if (Z._is_silence_) {
			return;
		}
		var allBoxes = jQuery(Z.el).find('input[type="checkbox"]'), chkBox, j, allCnt;
		if(jQuery(currCheckBox).hasClass('jl-selectall')) {
			var isAllSelected = currCheckBox.checked;
			for(j = 0, allCnt = allBoxes.length; j < allCnt; j++){
				chkBox = allBoxes[j];
				if(chkBox == currCheckBox) {
					continue;
				}
				if (!chkBox.disabled) {
					chkBox.checked = isAllSelected;
				}
			} //end for j
		}
		
		var fldObj = Z._dataset.getField(Z._field),
			limitCount = fldObj.valueCountLimit(), 
			values = null;
		if(fldObj.valueStyle() === jslet.data.FieldValueStyle.NORMAL) {
			if(currCheckBox.checked) {
				for(j = 0, allCnt = allBoxes.length; j < allCnt; j++){
					chkBox = allBoxes[j];
					if(chkBox === currCheckBox || jQuery(chkBox).hasClass('jl-selectall')) {
						continue;
					}
					chkBox.checked = false;
				} //end for j
				values = currCheckBox.value;
			}
		} else {
			values = [];
			var count = 0;
			for(j = 0, allCnt = allBoxes.length; j < allCnt; j++){
				chkBox = allBoxes[j];
				if(jQuery(chkBox).hasClass('jl-selectall')) {
					continue;
				}
				if (chkBox.checked) {
					values.push(chkBox.value);
					count ++;
				}
			} //end for j
	
			if (limitCount && count > limitCount) {
				currCheckBox.checked = !currCheckBox.checked;
				jslet.showInfo(jslet.formatMessage(jsletlocale.DBCheckBoxGroup.invalidCheckedCount,
						[''	+ limitCount]));
				return;
			}
		}
		
		Z._is_silence_ = true;
		try {
			Z._dataset.setFieldValue(Z._field, values);
		} finally {
			Z._is_silence_ = false;
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	innerFocus: function() {
		var itemIds = this._itemIds;
		if (itemIds && itemIds.length > 0) {
			document.getElementById(itemIds[0]).focus();
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, 
			jqEl = jQuery(Z.el);
		if(!jqEl.hasClass("jl-checkboxgroup")) {
			jqEl.addClass("jl-checkboxgroup");
		}
		Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.off();
		$super();
	}
});

jslet.ui.register('DBCheckBoxGroup', jslet.ui.DBCheckBoxGroup);
jslet.ui.DBCheckBoxGroup.htmlTemplate = '<div></div>';


/**
 * @class
 * @extend jslet.ui.DBFieldControl
 * 
 * DBCKEditor is a data sensitive CKEditor. Example:
 * 
 *     @example
 *      var jsletParam = {type:“DBCKEditor“,field:“name“};
 *     //1. Declaring:
 *      <input id=“ctrlId“ type=“text“ data-jslet='jsletParam' /&gt;
 *      or
 *      <input id=“ctrlId“ type=“text“ data-jslet='{type:“DBCKEditor“,field:“name“}' /&gt;
 * 
 *     //2. Binding
 *      <input id=“ctrlId“ type=“text“ data-jslet='jsletParam' /&gt;
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 * 
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBCKEditor = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,height';

		Z._height = 150;
		
		Z._oldValue = null;
		
		Z._editorId = null;
		Z._editor = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get CKEditor initial height.
	 * 
	 * @param {Integer | undefined} height CKEditor initial height.
	 * 
	 * @return {this | Integer}
	 */
	height: function(height) {
		if(height === undefined) {
			return this._height;
		}
		jslet.Checker.test('DBCKEditor.height', height).isGTZero();
		this._height = height;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		if(!window.CKEDITOR) {
			throw new Error('Not found CKEDITOR component! Goto for more: http://ckeditor.com/');
		}
		var jqEl = jQuery(Z.el);
		jqEl.addClass('jl-ckeditor');
		var editorId = jslet.nextId();
		var html = '<textarea class="jl-hidden"></textarea>';
		jqEl.html(html);
		jqEl.children().attr('id', editorId).attr('name', Z._field);
		
		var editor = window.CKEDITOR.replace(editorId, {
			height: Z._height
		});
		
		editor.on('focus', jQuery.proxy(Z._doFocus, Z));
		editor.on('blur', jQuery.proxy(Z._doBlur, Z));
		editor.on('change', jQuery.proxy(Z._doChange, Z));
		Z._editor = editor;
		Z._editorId = '#cke_' + editorId;
		Z.renderAll();
	}, // end bind

	/**
	 * @protected
	 * @override
	 */
	_doFocus: function () {
		var Z = this;
		jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		jQuery(Z._editorId).addClass('jl-focus');
	},

	/**
	 * @protected
	 * @override
	 */
	_doBlur: function () {
		var Z = this;
		jQuery(Z._editorId).removeClass('jl-focus');
		jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
	},
	
	_doChange: function() {
		this.updateToDataset();
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var state = fldObj.disabled() || fldObj.readOnly();
			window.setTimeout(function() {
				Z._editor.setReadOnly(state);
			}, 100);
		}
		
		if(metaName && metaName == 'required') {
			var jqEl = jQuery(Z.el);
			if (fldObj.required()) {
				jqEl.addClass('jl-ctrl-required');
			} else {
				jqEl.removeClass('jl-ctrl-required');
			}
		}
		
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var errObj = Z.getFieldError(), value;
		if(errObj && errObj.message) {
			Z.renderInvalid(errObj);
			value = errObj.inputText;
		} else {
			Z.renderInvalid(null);
			value = Z.getText();
		}
		Z._editor.setData(value);
		Z._editor.resetDirty();
		Z._oldValue = Z.el.value;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},

	innerFocus: function($super) {
		this._editor.focus();
	},
	
	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		if(!Z._editor.checkDirty()) {
			return;
		}
		var value = Z._editor.getData();
		if(Z._oldValue == value) {
			return;
		}
		Z._dataset.editRecord();
		Z._keep_silence_ = true;
		try {
			Z._dataset.setFieldText(Z._field, value, Z._valueIndex);
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		} finally {
			Z._keep_silence_ = false;
			Z._editor.resetDirty();
		}
		var errObj = Z.getFieldError();
		if(errObj && errObj.message) {
			Z.renderInvalid(errObj);
		} else {
			Z.renderInvalid(null);
		}
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		jQuery(Z.el).off();
		Z._editor = null;
		$super();
	}
});
jslet.ui.register('DBCKEditor', jslet.ui.DBCKEditor);
jslet.ui.DBCKEditor.htmlTemplate = '<div></div>';


/**
 * @class 
 * @extend jslet.ui.DBCustomComboBox
 * 
 * DBComboSelect. Show data on a popup panel, it can display tree style or table style. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBCombodlg",dataset:"employee",field:"department", textReadOnly:true};
 * 
 *      //1. Declaring:
 *      <div data-jslet='type:"DBCombodlg",dataset:"employee",field:"department", textReadOnly:true' />
 *      or
 *      <div data-jslet='jsletParam' />
 *  
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBComboSelect = jslet.Class.create(jslet.ui.DBCustomComboBox, {
	showStyles: ['auto', 'table', 'tree'],
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,textField,searchField,popupHeight,popupWidth,showStyle,textReadOnly,onGetSearchField,correlateCheck,autoSelected';
		Z._textField = null;
		
		Z._showStyle = 'auto';
		
		Z._popupWidth = 300;

		Z._popupHeight = 300;
		
		Z._contentPanel = null;
		
		Z._pickupField = null;
		
		Z._onGetSearchField = null;
		
		Z._correlateCheck = false;
		
		Z._autoSelected = true;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get the field name of text box.
	 * 
	 * @param {String | undefined} textField Field name which binded to the text box.
	 * 
	 * @return {this | String}
	 */
	textField: function(textField) {
		if(textField === undefined) {
			return this._textField;
		}
		jslet.Checker.test('DBComboSelect.textField', textField).required().isString();
		this._textField = textField.trim();
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get pop up panel height.
	 * 
	 * @param {Integer | undefined} popupHeight The height of pop up panel.
	 * 
	 * @return {this | Integer}
	 */
	popupHeight: function(popupHeight) {
		if(popupHeight === undefined) {
			return this._popupHeight;
		}
		jslet.Checker.test('DBComboSelect.popupHeight', popupHeight).isGTEZero();
		this._popupHeight = parseInt(popupHeight);
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get pop up panel width.
	 * 
	 * @param {Integer | undefined} popupHeight The width of pop up panel width.
	 * 
	 * @return {this | Integer}
	 */
	popupWidth: function(popupWidth) {
		if(popupWidth === undefined) {
			return this._popupWidth;
		}
		jslet.Checker.test('DBComboSelect.popupWidth', popupWidth).isGTEZero();
		this._popupWidth = parseInt(popupWidth);
		return this;
	},
		
	/**
	 * @property
	 * 
	 * Set or get the content style of pop up panel.
	 * 
	 * @param {String | undefined} showStyle The content style of the pop up panel, optional value: "auto"(default), "table", "tree".
	 * 
	 * @return {this | String}
	 */
	showStyle: function(showStyle) {
		if(showStyle === undefined) {
			return this._showStyle;
		}
		showStyle = jQuery.trim(showStyle);
		var checker = jslet.Checker.test('DBComboSelect.showStyle', showStyle).isString();
		showStyle = showStyle.toLowerCase();
		checker.testValue(showStyle).inArray(this.showStyles);
		this._showStyle = showStyle;
		return this;
	},
	
	/*
	 * @event
	 * 
	 * Set or get "onGetSearchField" event handler.
	 * 
	 * @param {Function} Optional onGetSearchField event handler.
	 * 
	 * @return {Function or this}
	 */
	onGetSearchField: function(onGetSearchField) {
		if(onGetSearchField === undefined) {
			return this._onGetSearchField;
		}
		this._onGetSearchField = onGetSearchField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether correlate checking the tree nodes or not.
	 * 
	 * @param {Boolean | undefined} correlateCheck True - correlate checking the tree nodes, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	correlateCheck: function(correlateCheck) {
		if(correlateCheck === undefined) {
			return this._correlateCheck;
		}
		this._correlateCheck = correlateCheck;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Automatically select the finding record when searching record.
	 * 
	 * @param {Boolean | undefined} autoSelected True - Automatically select record, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	autoSelected: function(autoSelected) {
		if(autoSelected === undefined) {
			return this._autoSelected;
		}
		this._autoSelected = autoSelected;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return true;
	},

	/**
	 * @protected
	 * @override
	 */
	afterBind: function ($super) {
		$super();
		
		if (this._contentPanel) {
			this._contentPanel = null;
		}
	},

	buttonClick: function (btnEle) {
		var Z = this, 
			el = Z.el, 
			fldObj = Z._dataset.getField(Z._field), 
			lkf = fldObj.lookup(),
			jqEl = jQuery(el);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;		
		}
		if (lkf === null || lkf === undefined) {
			throw new Error(Z._field + ' is NOT a lookup field!');
		}
		var style = Z._showStyle;
		if (Z._showStyle == 'auto') {
			style = lkf.parentField() ? 'tree' : 'table';
		}
		if (!Z._contentPanel) {
			Z._contentPanel = new jslet.ui.DBComboSelectPanel(Z, btnEle);
			Z._contentPanel.showStyle = style;
			Z._contentPanel.customButtonLabel = Z.customButtonLabel;
			Z._contentPanel.onCustomButtonClick = Z.onCustomButtonClick;
			if (Z._popupWidth) {
				Z._contentPanel.popupWidth = Z._popupWidth;
			}
			if (Z._popupHeight) {
				Z._contentPanel.popupHeight = Z._popupHeight;
			}
		}
		var r = jqEl.offset(), 
			h = jqEl.outerHeight(), 
			x = r.left, y = r.top + h;
		if (jsletlocale.isRtl){
			x = x + jqEl.outerWidth();
		}
		Z._contentPanel.showPopup(x, y, 0, h);
	},
	
	closePopup: function(){
		var Z = this;
		if(Z._contentPanel) {
			Z._contentPanel.closePopup();
		}
		Z._contentPanel = null;
		Z.focus();
		return Z;
	},
	
	/**
	 * @protected
	 * @override
	 */
	doLookupChanged: function (isMetaChanged) {
		if(isMetaChanged) {
			this._destroyPopPanel();
		}
	},
	
	_destroyPopPanel: function() {
		var Z = this;
		if (Z._contentPanel){
			Z._contentPanel.destroy();
			Z._contentPanel = null;
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		this._destroyPopPanel();
		$super();
	}
});

jslet.ui.DBComboSelectPanel = function (comboSelectObj, btnEle) {
	var Z = this;

	Z.showStyle = 'auto';

	Z.customButtonLabel = null;
	Z.onCustomButtonClick = null;
	Z.popupWidth = 350;
	Z.popupHeight = 350;
	Z._isShowing = false;
	
	var otree, otable, showType, valueSeperator = ',', lkf, lkds, self = this;
	Z.comboSelectObj = comboSelectObj;

	Z.dataset = comboSelectObj._dataset;
	Z.field = comboSelectObj._field;
	Z.fieldObject = Z.dataset.getField(Z.field);
	Z.panel = null;
	Z.searchBoxEle = null;
	Z._oldFilter = null;
	Z._oldFiltered = null;
	
	Z.popup = new jslet.ui.PopupPanel(btnEle);
	Z.popup.onHidePopup = function() {
		Z._isShowing = false;
		Z._restoreLkDsEvent();
		if(Z.comboSelectObj) {
			Z.comboSelectObj.focus();
		}
	};
	Z._confirmSelectDebounce = jslet.debounce(this._confirmSelect, 50);
};

jslet.ui.DBComboSelectPanel.prototype = {
		
	lookupDs: function() {
		return this.fieldObject.lookup().dataset();
	},
	
	isMultiple: function() {
		return this.fieldObject && this.fieldObject.valueStyle() === jslet.data.FieldValueStyle.MULTIPLE;
	},
		
	showPopup: function (left, top, ajustX, ajustY) {
		var Z = this;
		if(Z._isShowing) {
			return;
		}
		Z._initSelected();
		var showType = Z.showStyle.toLowerCase();
		if (!Z.panel) {
			Z.panel = Z._create();
		} else {
			var ojslet = Z.otree ? Z.otree : Z.otable;
			ojslet.dataset().addLinkedControl(ojslet);
			window.setTimeout(function(){
				ojslet.renderAll();
			}, 1);
		}
		var jqPanel = jQuery(Z.panel);
		jqPanel.find('.jl-combopnl-head input').val('');
		jqPanel.find('.jl-combopnl-head').hide();

		if(showType == 'table') {
			var fields = Z.lookupDs().getNormalFields(),
				fldObj, totalChars = 0;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				if(fldObj.visible()) {
					totalChars += fldObj.displayWidth();
				}
			}
			var totalWidth = totalChars * (jslet.global.defaultCharWidth || 12) + 40;
			Z.popupWidth = totalWidth;
			if(Z.popupWidth < 150) {
				Z.popupWidth = 150;
			}
			if(Z.popupWidth > 500) {
				Z.popupWidth = 500;
			}
		}
		Z._setLookupDsEvent();
		Z._isShowing = true;
		Z.popup.contentElement(Z.panel);
		Z.popup.show(left, top, Z.popupWidth, Z.popupHeight, ajustX, ajustY);
		Z._showTips(jsletlocale.DBComboSelect.find);
		Z._focus();
	},

	closePopup: function () {
		var Z = this;
		Z.popup.hide();
		var dispCtrl = Z.otree ? Z.otree : Z.otable;
		if(dispCtrl) {
			dispCtrl.dataset().removeLinkedControl(dispCtrl);
		}
		Z.comboSelectObj.focus();
	},
	
	_setLookupDsEvent: function() {
		var Z = this;
		
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup();
		var lkDs = lkfld.dataset();
		var editFilter = lkfld.editFilter();
		if(editFilter) {
			var filter = lkDs.filter();
			Z._oldFilter = filter;
			Z._oldFiltered = lkDs.filtered();
			if(filter) {
				filter = '(' + editFilter + ') && (' + filter + ')';
			} else {
				filter = editFilter;
			}
			lkDs.filter(filter);
			lkDs.filtered(true);
			
		}
		if(Z.isMultiple()) {
			Z._oldLkDsCheckSelectable = null;
			if(lkfld.onlyLeafLevel()) {
				Z._oldLkDsCheckSelectable = lkDs.onCheckSelectable();
				lkDs.onCheckSelectable(function(){
					return !this.hasChildren();
				});
			}

			lkDs = Z.lookupDs();
			Z._oldLkDsListener = lkDs.datasetListener();
			lkDs.datasetListener(function(eventType) {
				if(Z._oldLkDsListener) {
					Z._oldLkDsListener.call(lkDs, eventType);
				}
				if(eventType === jslet.data.DatasetEvent.AFTERSELECT) {
					Z._confirmSelectDebounce.call(Z);
				}
			});
		}
		
	},
	
	_restoreLkDsEvent: function() {
		var Z = this;
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup();
		if(!lkfld) {
			return;
		}
		var lkDs = lkfld.dataset();
		if(Z.isMultiple()) {
			lkDs.onCheckSelectable(Z._oldLkDsCheckSelectable? Z._oldLkDsCheckSelectable: null);
			lkDs.datasetListener(Z._oldLkDsListener? Z._oldLkDsListener: null);
		}
		if(Z._oldFiltered) {
			lkDs.filtered(Z._oldFiltered);
		}
		if(Z._oldFilter) {
			lkDs.filter(Z._oldFilter);
		} 
	},
	
	_create: function () {
		var Z = this;
		if (!Z.panel) {
			Z.panel = document.createElement('div');
			Z.panel.style.width = '100%';
			Z.panel.style.height = '100%';
		}

		//process variable
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup(),
			pfld = lkfld.parentField(),
			showType = Z.showStyle.toLowerCase(),
			lkds = Z.lookupDs();

		var template = ['<div class="jl-combopnl-tip" style="display:none"></div>',
		                '<div class=" col-xs-8 col-xs-offset-4 jl-combopnl-head">',
		                '<div class="input-group input-group-sm">',
		                '<input class="form-control" type="text" size="10"></input>',
		                '<span class="input-group-btn">',
		                '<button class="jl-combopnl-search btn btn-secondary" type="button"><i class="fa fa-search"></i></button>',
		                '<button class="jl-combopnl-closesearch btn btn-secondary" type="button"><i class="fa fa-times"></i></button>',
		                '</span>',
		                '</div></div>',
		                '<div class="jl-combopnl-content"></div>'];

		Z.panel.innerHTML = template.join('');
		var jqPanel = jQuery(Z.panel),
			jqPh = jqPanel.find('.jl-combopnl-head');
		jqPanel.on('keydown', function(event){
			var keyCode = event.which;
			if(keyCode === jslet.ui.KeyCode.ENTER) {
				Z._confirmAndClose();
			}
			if(keyCode === jslet.ui.KeyCode.ESCAPE) {
				Z.closePopup();
			}
			if(event.ctrlKey && keyCode === jslet.ui.KeyCode.F) {
				jqPanel.find('.jl-combopnl-head').slideDown();
				Z.searchBoxEle.focus();
				event.preventDefault();
	       		event.stopImmediatePropagation();
				return false;
			}
		});
		Z.searchBoxEle = jqPh.find('input')[0];
		jQuery(Z.searchBoxEle).on('keydown', function(event) {
			event = jQuery.event.fix( event || window.event );
			if (event.which != 13) {//enter
				return;
			}

			Z._findData(event.currentTarget);
		});
		
		jqPanel.find('.jl-combopnl-closesearch').click(function() {
			jqPanel.find('.jl-combopnl-head').slideUp();
			Z._focus();
		});
		jqPanel.find('.jl-combopnl-search').click(function() {
			Z._findData(Z.searchBoxEle);
		});
		var contentPanel = jqPanel.find('.jl-combopnl-content')[0];

		//create popup content
		if (showType == 'tree') {
			var treeParam = { 
				type: 'DBTreeView', 
				dataset: lkds, 
				readOnly: false, 
				displayFields: lkfld.displayFields(), 
				hasCheckBox: Z.isMultiple(),
				expandLevel:1
			};

			if (!Z.isMultiple()) {
				treeParam.onItemClick = jQuery.proxy(Z._confirmAndClose, Z);
			}
			treeParam.correlateCheck = Z.comboSelectObj.correlateCheck();
			window.setTimeout(function(){
				Z.otree = jslet.ui.createControl(treeParam, contentPanel, '100%', '100%');
			}, 1);
		} else {
			var tableParam = { type: 'DBTable', dataset: lkds, readOnly: true, hasSelectCol: Z.isMultiple(), hasSeqCol: false, 
					hasFindDialog: false, hasFilterDialog: false };
			if (!Z.isMultiple()) {
				tableParam.onRowClick = jQuery.proxy(Z._confirmAndClose, Z);
			}
			window.setTimeout(function(){
				Z.otable = jslet.ui.createControl(tableParam, contentPanel, '100%', '100%');
			}, 1);
		}
		return Z.panel;
	},

	_initSelected: function () {
		var Z = this;
		var fldValue = Z.comboSelectObj.getValue(), 
			lkds = Z.lookupDs();

		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup();

		if(lkfld.onlyLeafLevel()) {
			lkds.onCheckSelectable(function(){
				return !this.hasChildren();
			});
		}
		if (!Z.isMultiple()) {
			if (fldValue) {
				lkds.findByKey(fldValue);
			}
			return;
		}
		lkds.disableControls();
		try {
			lkds.selectAll(false);
			if (fldValue) {
				var arrKeyValues = fldValue;
				if(!jslet.isArray(fldValue)) {
					arrKeyValues = fldValue.split(jslet.global.valueSeparator);
				}
				for (var i = 0, len = arrKeyValues.length; i < len; i++){
					lkds.selectByKeyValue(true, arrKeyValues[i]);
				}
			}
		} finally {
			lkds.enableControls();
		}
	},

	_findData: function (searchText) {
		var Z = this;
		var findFldName = Z.comboSelectObj.searchField, 
			findingValue = this.searchBoxEle.value;
		if (!findingValue) {
			return;
		}
		var eventFunc = jslet.getFunction(Z.comboSelectObj.onGetSearchField);
		if (eventFunc) {
			findFldName = eventFunc.call(findingValue);
		}
		var findFldNames = null;
		var lkds = Z.lookupDs();
		if(!findFldName) {
			findFldNames = [];
			var fields = lkds.getNormalFields(), fldObj;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				if(fldObj.visible()) {
					findFldNames.push(fldObj.name());
				}
			}
		} else {
			findFldNames = findFldName.split(',');
		}
		if(!findFldNames || findFldNames.length === 0) {
			console.warn('Search field NOT specified! Can\'t search data!');
			return;
		}
		var	currRecno = lkds.recno() + 1;
		var options = {startRecno: currRecno, findingByText: true, matchType: 'any'};
		var found = lkds.findByField(findFldNames, findingValue, options);
		if(!found) {
			options.startRecno = 0;
			found = lkds.findByField(findFldNames, findingValue, options);
		}
		if(found && found.isEqual && Z.comboSelectObj.autoSelected()) {
			lkds.select(true);
		}
		if(!found) {
			Z._showTips(jsletlocale.DBComboSelect.notFound);
		}
		if(searchText) {
			searchText.focus();
		}
		return;
		
	},

	_focus: function() {
		var Z = this;
		window.setTimeout(function(){
			var dbCtrl = Z.otable || Z.otree;
			if(dbCtrl) {
				dbCtrl.el.focus();
			}
		}, 10);
	},
	
	_showTips: function (tips) {
		var jqPanel = jQuery(this.panel);
		jqPanel.find('.jl-combopnl-tip').html(tips).slideDown();
		window.setTimeout(function() {
			jqPanel.find('.jl-combopnl-tip').slideUp();
		}, 1500);
	},
	
	_confirmSelect: function () {
		var Z = this,
			fldValue = Z.comboSelectObj.getValue(),
			fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup(),
			isMulti = Z.isMultiple(),
			lookupDs = Z.lookupDs();
		
		if (isMulti) {
			fldValue = lookupDs.selectedKeyValues();
		} else {
			if(lookupDs.hasChildren() && lkfld.onlyLeafLevel()) {
				Z._showTips(jsletlocale.DBComboSelect.cannotSelect);
				return false;
			}
			fldValue = lookupDs.keyValue();
		}

		Z.dataset.setFieldValue(Z.field, fldValue, Z._valueIndex);
		if (!isMulti && Z.comboSelectObj._afterSelect) {
			Z.comboSelectObj._afterSelect(Z.dataset, lookupDs);
		}
		return true;
	},
	
	_confirmAndClose: function () {
		if(this._confirmSelect()) {
			this.closePopup();
		}
	},

	destroy: function(){
		var Z = this;
		Z._restoreLkDsEvent();
		if (Z.otree){
			Z.otree.destroy();
			Z.otree = null;
		}
		if (Z.otable){
			Z.otable.destroy();
			Z.otable = null;
		}
		Z.comboSelectObj = null;
		
		jQuery(Z.searchBoxEle).off();
		Z.fieldObject = null;
		
		Z.searchBoxEle = null;
		Z.popup.destroy();
		Z.popup = null;
		Z.panel = null;
	}
};

jslet.ui.register('DBComboSelect', jslet.ui.DBComboSelect);
jslet.ui.DBComboSelect.htmlTemplate = '<div></div>';

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBDataLabel. Show field value in a HTML label. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBDataLabel",dataset:"employee",field:"department"};
 * 
 *     //1. Declaring:
 *      <label data-jslet='type:"DBDataLabel",dataset:"employee",field:"department"' />
 *      or
 *      <label data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <label id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBDataLabel = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'styleClass,dataset,field';
		
		$super(el, params);
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jQuery(this.el).addClass('form-control-static jl-datalabel jl-lbl-normal');//Bootstrap class
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'label';
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		var text = Z.getText();
		Z.el.innerHTML = text;
		Z.el.title = text;
	},
	
	/**
	 * @protected
	 * @override
	 */
	doLookupChanged: function() {
		this.doValueChanged();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	canFocus: function() {
		return false;
	}
});

jslet.ui.register('DBDataLabel', jslet.ui.DBDataLabel);
jslet.ui.DBDataLabel.htmlTemplate = '<label></label>';


/**
 * @class 
 * @extend jslet.ui.DBCustomComboBox
 * 
 * DBDatePicker. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBDatePicker",dataset:"employee",field:"birthday", textReadOnly:true};
 * 
 *     //1. Declaring:
 *      <div data-jslet='type:"DBDatePicker",dataset:"employee",field:"birthday", textReadOnly:true' />
 *      or
 *      <div data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBDatePicker = jslet.Class.create(jslet.ui.DBCustomComboBox, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,textReadOnly,popupWidth,popupHeight';
		
		Z._popupWidth = 260;

		Z._popupHeight = 226;

		Z.popup = null;
		
		Z.comboButtonCls = 'fa-calendar';

		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get pop up panel height.
	 * 
	 * @param {Integer | undefined} popupHeight The height of pop up panel.
	 * 
	 * @return {this | Integer}
	 */
	popupHeight: function(popupHeight) {
		if(popupHeight === undefined) {
			return this._popupHeight;
		}
		jslet.Checker.test('DBDatePicker.popupHeight', popupHeight).isGTEZero();
		this._popupHeight = parseInt(popupHeight);
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get pop up panel width.
	 * 
	 * @param {Integer | undefined} popupHeight The width of pop up panel width.
	 * 
	 * @return {this | Integer}
	 */
	popupWidth: function(popupWidth) {
		if(popupWidth === undefined) {
			return this._popupWidth;
		}
		jslet.Checker.test('DBDatePicker.popupWidth', popupWidth).isGTEZero();
		this._popupWidth = parseInt(popupWidth);
		return this;
	},
		
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return true;
	},

	buttonClick: function (btnEle) {
		var el = this.el, 
			Z = this, 
			fldObj = Z._dataset.getField(Z._field),
			jqEl = jQuery(el);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		var width = Z._popupWidth,
			height = Z._popupHeight,
			dateValue = Z.getValue(),
			range = fldObj.dataRange(),
			minDate = null,
			maxDate = null;
		
		if (range){
			if (range.min) {
				minDate = range.min;
			}
			if (range.max) {
				maxDate = range.max;
			}
		}
		if (!Z.contentPanel) {
			Z.contentPanel = jslet.ui.createControl({ type: 'Calendar', value: dateValue, minDate: minDate, maxDate: maxDate,
				onDateSelected: function (date) {
					Z._dataset.setFieldValue(Z._field, new Date(date.getTime()), Z._valueIndex);
					Z.popup.hide();
					try {
						Z.el.focus();
					} catch(e) {
						//Ignore
					}
				}
			}, null, width + 'px', height + 'px', true); //Hide panel first
			
			Z.popup = new jslet.ui.PopupPanel(btnEle);
			
			Z.popup.onHidePopup = function() {
				Z.focus();
			};
			Z.popup.contentElement(Z.contentPanel.el);
		}
		
		var r = jqEl.offset(), 
			h = jqEl.outerHeight(), 
			x = r.left, y = r.top + h;
		if (jsletlocale.isRtl){
			x = x + jqEl.outerWidth();
		}
		Z.contentPanel.el.style.display = 'block';
		Z.popup.show(x, y, width + 3, height + 3, 0, h);
		Z.contentPanel.focus();
		Z.contentPanel.setValue(dateValue);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		if(Z.contentPanel) {
			Z.contentPanel.destroy();
			Z.contentPanel = null;
		}
		if(Z.popup) {
			Z.popup.destroy();
			Z.popup = null;
		}
		$super();
	}
	
});

jslet.ui.register('DBDatePicker', jslet.ui.DBDatePicker);
jslet.ui.DBDatePicker.htmlTemplate = '<div></div>';

/**
 * @class
 * @extend jslet.ui.DBFieldControl
 * 
 * DBHtml. Display html text from one field. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBHtml",dataset:"employee",field:"comment"};
 * 
 *     //1. Declaring:
 *      <div data-jslet='type:"DBHtml",dataset:"employee",field:"comment"' />
 *      or
 *      <div data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBHtml = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'styleClass,dataset,field';
		$super(el, params);
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jQuery(this.el).addClass('form-control');
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var content = this.getText();
		this.el.innerHTML = content;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	canFocus: function() {
		return false;
	}

});

jslet.ui.register('DBHtml', jslet.ui.DBHtml);
jslet.ui.DBHtml.htmlTemplate = '<div style="width:200px;height:200px"></div>';

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBImage. Display an image which store in database or which's path store in database. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBImage",dataset:"employee",field:"photo"};
 * 
 *     //1. Declaring:
 *      <img data-jslet='{type:"DBImage",dataset:"employee",field:"photo"}' />
 *      or
 *      <img data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <img id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBImage = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,locked,baseUrl,altField,enableViewer,viewUrlField';
		
		Z._locked = false;
		
		Z._baseUrl = null;
		
		Z._altField = null;
		
		Z._enableViewer = false;
		
		Z._viewUrlField = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get base URL for image "src". The whole image URL is : "baseUrl" + the value of field. 
	 * 
	 * @param {String | undefined} baseUrl Base URL.
	 * 
	 * @return {this | String}
	 */
	baseUrl: function(baseUrl) {
		if(baseUrl === undefined) {
			return this._baseUrl;
		}
		baseUrl = jQuery.trim(baseUrl);
		jslet.Checker.test('DBImage.baseUrl', baseUrl).isString();
		this._baseUrl = baseUrl;
		return this;
	},
   
	/**
	 * @property
	 * 
	 * Identify whether show image viewer. If true, user can click the image to show the image viewer. 
	 * 
	 * @param {Boolean | undefined} enableViewer True - enable viewer, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	enableViewer: function(enableViewer) {
		if(enableViewer === undefined) {
			return this._enableViewer;
		}
		this._enableViewer = enableViewer? true: false;
		return this;
	},
   
	/**
	 * @property
	 * 
	 * Set or get the field name for image viewer. If 'field' stores the thumbnail url, 'viewUrlField' is stores the initial image url which is 
	 * provided for image viewer. Only enabled when 'enableViewer' is true.
	 * 
	 * @param {String | undefined} viewUrlField.
	 * 
	 * @return {this | String}
	 */
	viewUrlField: function(viewUrlField) {
		if(viewUrlField === undefined) {
			return this._viewUrlField;
		}
		viewUrlField = jQuery.trim(viewUrlField);
		jslet.Checker.test('DBImage.viewUrlField', viewUrlField).isString();
		this._viewUrlField = viewUrlField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the field name for image "alt". If not found the image, it displays the "alt" value.
	 * 
	 * @param {String | undefined} baseUrl Base url.
	 * 
	 * @return {this | String}
	 */
	altField: function(altField) {
		if(altField === undefined) {
			return this._altField;
		}
		altField = jQuery.trim(altField);
		jslet.Checker.test('DBImage.altField', altField).isString();
		this._altField = altField;
		return this;
	},
   
	/**
	 * @property
	 * 
	 * Identify whether stop refreshing image when moving dataset's cursor.
	 * 
	 * @param {Boolean | undefined} locked True - stop refreshing, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	locked: function(locked) {
		if(locked === undefined) {
			return this._locked;
		}
		this._locked = locked;
		return this;
	},
   
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'img';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.addClass('img-responsive img-rounded');
		if(jslet.ui.ImageViewer) {
			jqEl.on('click', function() {
				if(Z._locked || !Z._enableViewer) {
					return;
				}
				var viewer = new jslet.ui.ImageViewer();
				viewer.show(Z._getImgUrl(true));
			});
		}
	},

	_getImgUrl: function(isForViewer) {
		var Z = this, srcUrl;
		if(isForViewer && Z._viewUrlField) {
			srcUrl = Z._dataset.getFieldValue(Z._viewUrlField);
			if(!srcUrl) {
				srcUrl = Z.getValue();
			}
		}else {
			srcUrl = Z.getValue();
		}
		if (!srcUrl) {
			srcUrl = '';
		} else {
			if (Z._baseUrl) {
				srcUrl = Z._baseUrl + srcUrl;
			}
		}
		return srcUrl;
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if (Z._locked) {
			Z.el.alt = jsletlocale.DBImage.lockedImageTips;
			Z.el.src = '';
			return;
		}

		var srcURL = Z._getImgUrl();
		if (Z.el.src != srcURL) {
			var altText = srcURL;
			if(Z._altField) {
				altText = Z._dataset.getFieldText(Z._altField);
			}
			Z.el.alt = altText || '';
			Z.el.src = srcURL;
		}
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	canFocus: function() {
		return false;
	}
});

jslet.ui.register('DBImage', jslet.ui.DBImage);
jslet.ui.DBImage.htmlTemplate = '<img></img>';

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBLabel. Display field name, use this control to void hard-coding field name, and you can change field name dynamically. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBLabel",dataset:"employee",field:"department"};
 * 
 *      //1. Declaring:
 *      <label data-jslet='type:"DBLabel",dataset:"employee",field:"department"' />
 *      or
 *      <label data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <label id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBLabel = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'styleClass,dataset,field';
		this.isLabel = true;
		$super(el, params);
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		jQuery(this.el).addClass('control-label');
		this.renderAll();
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'label';
	},

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function(metaName) {
		if(metaName && jslet.ui.DBLabel.METANAMES.indexOf(metaName) < 0) {
			return;
		}
		var Z = this, subType = Z._fieldMeta,
			fldObj = Z._dataset.getField(Z._field),
			content = '';
		if(!fldObj) {
			throw new Error('Field: ' + this._field + ' NOT exist!');
		}
		var jqEl = jQuery(Z.el);
		if((!subType || subType == 'label') && (!metaName || metaName == 'label' || metaName == 'required')) {
			if (fldObj.required()) {
				content += '<span class="jl-lbl-required">' + 
					jslet.ui.DBLabel.REQUIREDCHAR + '</span>';
			}
			content += fldObj.displayLabel() || '';
			jqEl.html(content);
			Z.el.title = jqEl.text();
			return;
		}
		if(subType && subType == 'tip' && 
			(!metaName || metaName == subType)) {
			content = fldObj.tip() || '';
			jqEl.html(content);
			Z.el.title = jqEl.text();
			return;
		}
		if(subType  && subType == 'error' && 
			(metaName && metaName == subType)) {
			var errObj = Z.getFieldError();
			content = errObj && errObj.message || '';
			jqEl.html(content);
			Z.el.title = jqEl.text();
			return;
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var jqEl = jQuery(this.el),
			subType = this.fieldMeta();
		
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent());
		if(subType == 'error') {
			if(!jqEl.hasClass('jl-lbl-error')) {
				jqEl.addClass('jl-lbl-error');
			}
		} else 
		if(subType == 'tip') {
			if(!jqEl.hasClass('jl-lbl-tip')) {
				jqEl.addClass('jl-lbl-tip');
			}
		} else {
			if(!jqEl.hasClass('jl-lbl')) {
				jqEl.addClass('jl-lbl');
			}
		}
		return this;
	}
});

jslet.ui.DBLabel.REQUIREDCHAR = '*';
jslet.ui.DBLabel.METANAMES = ['label', 'required', 'tip', 'error'];
jslet.ui.register('DBLabel', jslet.ui.DBLabel);
jslet.ui.DBLabel.htmlTemplate = '<label></label>';


/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBList. Show data on list, it can display tree style or table style. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBList",dataset:"employee",field:"department"};
 * 
 *     //1. Declaring:
 *      <div data-jslet='type:"DBList",dataset:"employee",field:"department"' />
 *      or
 *      <div data-jslet='jsletParam' />
 *  
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBList = jslet.Class.create(jslet.ui.DBFieldControl, {
	showStyles: ['auto', 'table', 'tree'],
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,showStyle,correlateCheck';
		
		Z._showStyle = 'auto';
		
		Z._correlateCheck = false;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get the content style of pop up panel.
	 * 
	 * @param {String | undefined} showStyle The content style of the pop up panel, optional value: "auto"(default), "table", "tree".
	 * 
	 * @return {this | String}
	 */
	showStyle: function(showStyle) {
		if(showStyle === undefined) {
			return this._showStyle;
		}
		showStyle = jQuery.trim(showStyle);
		var checker = jslet.Checker.test('DBComboSelect.showStyle', showStyle).isString();
		showStyle = showStyle.toLowerCase();
		checker.testValue(showStyle).inArray(this.showStyles);
		this._showStyle = showStyle;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether correlate checking the tree nodes or not.
	 * 
	 * @param {Boolean | undefined} correlateCheck True - correlate checking the tree nodes, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	correlateCheck: function(correlateCheck) {
		if(correlateCheck === undefined) {
			return this._correlateCheck;
		}
		this._correlateCheck = correlateCheck;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},
	
	/**
	 * @override
	 */
	renderAll: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		if(jqEl.hasClass('jl-dblist')) {
			jqEl.addClass('jl-dblist');
		}
		var fldObj = Z._dataset.getField(Z._field),
			lkfld = fldObj.lookup(),
			pfld = lkfld.parentField(),
			showType = Z._showStyle.toLowerCase(),
			lkds = lkfld.dataset(),
			isMulti = fldObj.valueStyle() === jslet.data.FieldValueStyle.MULTIPLE;
		if(showType == 'auto' && pfld) {
			showType = 'tree';
		}
		if (showType == 'tree') {
			var treeParam = { 
				type: 'DBTreeView', 
				dataset: lkds, 
				readOnly: false, 
				displayFields: lkfld.displayFields(), 
				hasCheckBox: isMulti,
				correlateCheck: Z._correlateCheck,
				expandLevel: 99
			};
			if(isMulti) {
				treeParam.afterCheckBoxClick = function() {
					Z.updateToDataset();
				};
			} else {
				treeParam.onItemClick = function() {
					Z.updateToDataset();
				};
			}
	
			window.setTimeout(function() {
				jslet.ui.createControl(treeParam, Z.el, '100%', '100%');
				jQuery(Z.el.childNodes[0]).on('focus', function(event) {
					jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
				}).on('blur', function(event) {
					jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
				});
			}, 1);
		} else {
			var tableParam = {type: 'DBTable', dataset: lkds, readOnly: true, hasSelectCol: isMulti, hasSeqCol: false, hasFindDialog: false, hasFilterDialog: false};
			if(isMulti) {
				tableParam.afterSelect = tableParam.afterSelectAll = function() {
					Z.updateToDataset();
				};
			} else {
				tableParam.onRowClick = function() {
					Z.updateToDataset();
				};
			}
			window.setTimeout(function() {
				jslet.ui.createControl(tableParam, Z.el, '100%', '100%');
			}, 1);
		}
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName) {
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			Z.el.disabled = true;
		} else {
			Z.el.disabled = false;
		}
		
		if(metaName && metaName == 'required') {
			var jqEl = jQuery(Z.el);
			if (fldObj.required()) {
				jqEl.addClass('jl-ctrl-required');
			} else {
				jqEl.removeClass('jl-ctrl-required');
			}
		}
		
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
		
	},
	
	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return true;
		}
		
		var fldObj = Z._dataset.getField(Z._field),
			lkfld = fldObj.lookup(),
			lkds = lkfld.dataset(),
			isMulti = fldObj.valueStyle() === jslet.data.FieldValueStyle.MULTIPLE,
			value;
		if(!isMulti) {
			value = lkds.keyValue();
		} else {
			value = lkds.selectedKeyValues();
		}
		Z._dataset.editRecord();
		Z._keep_silence_ = true;
		try {
			Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		} finally {
			Z._keep_silence_ = false;
		}
		return true;
	}, // end updateToDataset
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var errObj = Z.getFieldError();
		if(errObj && errObj.message) {
			Z.el.value = errObj.inputText || '';
			Z.renderInvalid(errObj);
			return;
		} else {
			Z.renderInvalid(null);
		}
		var fldObj = Z._dataset.getField(Z._field),
			fldValue = fldObj.getValue(),
			lkfld = fldObj.lookup(),
			pfld = lkfld.parentField(),
			lkds = lkfld.dataset(),
			isMulti = fldObj.valueStyle() === jslet.data.FieldValueStyle.MULTIPLE;
		if(!isMulti) {
			lkds.findByKey(fldValue);
		} else {
			var oldRecno = lkds.recno();
			lkds.disableControls();
			try {
				lkds.selectAll(false);
				if(fldValue) {
					for(var i = 0, len = fldValue.length; i < len; i++) {
						lkds.findByKey(fldValue[i]);
						lkds.selected(true);
					}
				}
			} finally {
				lkds.recno(oldRecno);
				lkds.enableControls();
			}
		}
	},

	/**
	 * @override
	 */
	destroy: function($super) {
		var Z = this;
		$super();
	}
});

jslet.ui.register('DBList', jslet.ui.DBList);
jslet.ui.DBList.htmlTemplate = '<div></div>';

/**
 * @class 
 * @extend jslet.ui.DBControl
 * 
 * DBLookupLabel. Display field value according to another field and its value. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBLookupLabel",dataset:"department",lookupField:"deptcode", lookupValue: '0101', returnField: 'name'};
 * 
 *      //1. Declaring:
 *      <label data-jslet='{type:"DBLookupLabel",dataset:"department",lookupField:"deptcode", lookupValue: "0101", returnField: "name"}' />
 *      or
 *      <label data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <label id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBLookupLabel = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,lookupField,returnField,lookupValue';
		Z.requiredProperties = 'lookupValue,lookupField,returnField';

		Z._lookupField = null;
		
		Z._lookupValue = null;
		
		Z._returnField = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get the field name for looking up.
	 * 
	 * @param {String | undefined} lookupField Lookup field name.
	 * 
	 * @return {this | String}
	 */
	lookupField: function(lookupField) {
		if(lookupField === undefined) {
			return this._lookupField;
		}
		jslet.Checker.text('lookupField', lookupField).required().isString();
		this._lookupField = lookupField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the lookup value.
	 * 
	 * @param {Object | undefined} lookupField Lookup value.
	 * 
	 * @return {this | Object}
	 */
	lookupValue: function(lookupValue) {
		if(lookupValue === undefined) {
			return this._lookupValue;
		}
		jslet.Checker.text('lookupValue', lookupValue).required();
		this._lookupValue = lookupValue;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the return field name.
	 * 
	 * @param {String | undefined} returnField Return field name.
	 * 
	 * @return {this | String}
	 */
	returnField: function(returnField) {
		if(returnField === undefined) {
			return this._returnField;
		}
		jslet.Checker.text('returnField', returnField).required().isString();
		this._returnField = returnField;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jQuery(this.el).addClass('form-control');
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'label';
	},

	/**
	 * @protected
	 * @override
	 */
	refreshControl: function (evt, isForce) {
		if (evt.eventType != jslet.data.RefreshEvent.UPDATEALL) {
			return;
		}
		if (!isForce) {
			return;
		}
		var Z = this;
		var result = Z.dataset.lookup(Z._lookupField, Z._lookupValue, Z._returnField);
		if (result === null) {
			result = 'NOT found: ' + Z._lookupValue;
		}
		Z.el.innerHTML = result;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent, true);
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	canFocus: function() {
		return false;
	}
});
jslet.ui.register('DBLookupLabel', jslet.ui.DBLookupLabel);
jslet.ui.DBLookupLabel.htmlTemplate = '<label></label>';


/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBRadioGroup. Display a group of radio that user can select one option. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBRadioGroup",dataset:"employee",field:"department"};
 * 
 *     //1. Declaring:
 *      <div data-jslet='type:"DBRadioGroup",dataset:"employee",field:"department"'' />
 *      or
 *      <div data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBRadioGroup = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,columnCount';
		
		Z._columnCount = 99999;
		
		Z._itemIds = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get column count.
	 * 
	 * @param {Integer | undefined} columnCount Column count.
	 * 
	 * @return {this | Integer}
	 */
	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBRadioGroup.columnCount', columnCount).isGTEZero();
		this._columnCount = parseInt(columnCount);
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.on('keydown', function(event) {
			var keyCode = event.which, idx, activeEle, activeId;
			
			if(keyCode === jslet.ui.KeyCode.LEFT) { //Arrow Left
				if(!Z._itemIds || Z._itemIds.length === 0) {
					return;
				}
				activeEle = document.activeElement;
				activeId = activeEle && activeEle.id;
				
				idx = Z._itemIds.indexOf(activeId);
				if(idx === 0) {
					return;
				}
				document.getElementById(Z._itemIds[idx - 1]).focus();
				event.preventDefault();
	       		event.stopImmediatePropagation();
			} else if( keyCode === jslet.ui.KeyCode.RIGHT) { //Arrow Right
				if(!Z._itemIds || Z._itemIds.length === 0) {
					return;
				}
				activeEle = document.activeElement;
				activeId = activeEle && activeEle.id;
				
				idx = Z._itemIds.indexOf(activeId);
				if(idx === Z._itemIds.length - 1) {
					return;
				}
				document.getElementById(Z._itemIds[idx + 1]).focus();
				event.preventDefault();
	       		event.stopImmediatePropagation();
			}
		});
		jqEl.on('click', 'input[type="radio"]', function(event){
			var ctrl = this;
			window.setTimeout(function(){ //Defer firing 'updateToDataset' when this control is in DBTable to make row changed firstly.
				event.delegateTarget.jslet.updateToDataset(ctrl);
			}, 5);
		});
		jqEl.on('focus', 'input[type="radio"]', function (event) {
			jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		});
		jqEl.on('blur', 'input[type="radio"]', function (event) {
			jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		});
		jqEl.addClass('form-control');
		jqEl.css('height', 'auto');
	},

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName) {
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly" || metaName == 'tabIndex') {
			var disabled = fldObj.disabled(),
				readOnly = fldObj.readOnly();
		
			Z.disabled = disabled || readOnly;
			disabled = Z.disabled;
			var radios = jQuery(Z.el).find('input[type="radio"]'),
				required = fldObj.required(),
				radioEle,
				tabIdx = fldObj.tabIndex();
			
			for(var i = 0, cnt = radios.length; i < cnt; i++){
				radioEle = radios[i];
				jslet.ui.setEditableStyle(radioEle, disabled, readOnly, false, required);
				radioEle.tabIndex = tabIdx;
			}
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var value = Z.getValue(),
			radios = jQuery(Z.el).find('input[type="radio"]'), 
			radio;
		for(var i = 0, cnt = radios.length; i < cnt; i++){
			radio = radios[i];
			radio.checked = (value == jQuery(radio.parentNode).attr('value'));
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doLookupChanged: function () {
		var Z = this;
		var fldObj = Z._dataset.getField(Z._field), lkf = fldObj.lookup();
		if (!lkf) {
			console.error(jslet.formatMessage(jsletlocale.Dataset.lookupNotFound,
					[fldObj.name()]));
			return;
		}
		var lkds = lkf.dataset(),
			cnt = lkds.recordCount();
		if(cnt === 0) {
			Z.el.innerHTML = jsletlocale.DBRadioGroup.noOptions;
			return;
		}
		var oldRecno = lkds.recno();
		try {
			var template = ['<table cellpadding="0" cellspacing="0">'],
				isNewRow = false, 
				itemId;
			var editFilter = lkf.editFilter();
			Z._innerEditFilterExpr = null;
			var editItemDisabled = lkf.editItemDisabled();
			if(editFilter) {
				Z._innerEditFilterExpr = new jslet.data.Expression(lkds, editFilter);
			}
			var disableOption = false, k = -1;
			
			Z._itemIds = [];
			for (var i = 0; i < cnt; i++) {
				lkds.recnoSilence(i);
				disableOption = false;
				if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
					if(!editItemDisabled) {
						continue;
					} else {
						disableOption = true;
					}
				}
				k++;
				isNewRow = (k % Z._columnCount === 0);
				if (isNewRow) {
					if (k > 0) {
						template.push('</tr>');
					}
					template.push('<tr>');
				}
				itemId = jslet.nextId();
				Z._itemIds.push(itemId);
				template.push('<td style="white-space: nowrap;vertical-align:middle" value="');
				template.push(lkds.getFieldValue(lkf.keyField()));
				template.push('"><input name="');
				template.push(Z._field);
				template.push('" type="radio" id="');
				template.push(itemId);
				template.push('" ' + (disableOption? ' disabled': '') + '/><label for="');
				template.push(itemId);
				template.push('">');
				template.push(lkf.getCurrentDisplayValue());
				template.push('</label></td>');
			} // end while
			if (cnt > 0) {
				template.push('</tr>');
			}
			template.push('</table>');
			Z.el.innerHTML = template.join('');
		} finally {
			lkds.recnoSilence(oldRecno);
		}
		Z.doMetaChanged();
	}, // end renderOptions

	updateToDataset: function(currCheckBox) {
		var Z = this;
		if (Z._keep_silence_ || Z.disabled) {
			return;
		}
		Z._keep_silence_ = true;
		try {
			Z._dataset.setFieldValue(Z._field, jQuery(currCheckBox.parentNode).attr('value'));
			currCheckBox.checked = true;
		} finally {
			Z._keep_silence_ = false;
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	innerFocus: function() {
		var itemIds = this._itemIds;
		if (itemIds && itemIds.length > 0) {
			document.getElementById(itemIds[0]).focus();
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, 
			jqEl = jQuery(Z.el);
		if(!jqEl.hasClass("jl-radiogroup")) {
			jqEl.addClass("jl-radiogroup");
		}
		Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.off();
		$super();
	}
});

jslet.ui.register('DBRadioGroup', jslet.ui.DBRadioGroup);
jslet.ui.DBRadioGroup.htmlTemplate = '<div></div>';

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBRangeSelect. Display a select which options produce with 'beginItem' and 'endItem'. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBRangeSelect",dataset:"employee",field:"age",beginItem:10,endItem:100,step:5};
 * 
 *     //1. Declaring:
 *      <select data-jslet='type:"DBRangeSelect",dataset:"employee",field:"age",beginItem:10,endItem:100,step:5' />
 *      or
 *      <select data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *      <select id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBRangeSelect = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,beginItem,endItem,step';
		if (!Z.requiredProperties) {
			Z.requiredProperties = 'field,beginItem,endItem,step';
		}

		Z._beginItem = 0;

		Z._endItem = 10;

		Z._step = 1;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get the begin item of range.
	 * 
	 * @param {Integer | undefined} beginItem Begin item of range.
	 * 
	 * @return {this | Integer}
	 */
	beginItem: function(beginItem) {
		if(beginItem === undefined) {
			return this._beginItem;
		}
		jslet.Checker.test('DBRangeSelect.beginItem', beginItem).isNumber();
		this._beginItem = parseInt(beginItem);
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get the end item of range.
	 * 
	 * @param {Integer | undefined} endItem End item of range.
	 * 
	 * @return {this | Integer}
	 */
	endItem: function(endItem) {
		if(endItem === undefined) {
			return this._endItem;
		}
		jslet.Checker.test('DBRangeSelect.endItem', endItem).isNumber();
		this._endItem = parseInt(endItem);
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get the step.
	 * 
	 * @param {Integer | undefined} step Step.
	 * 
	 * @return {this | Integer}
	 */
	step: function(step) {
		if(step === undefined) {
			return this._step;
		}
		jslet.Checker.test('DBRangeSelect.step', step).isNumber();
		this._step = parseInt(step);
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return (el.tagName.toLowerCase() == 'select');
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			valueStyle = fldObj.valueStyle();
		
		if(Z.el.multiple && valueStyle != jslet.data.FieldValueStyle.MULTIPLE) {
			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
		} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && !Z.el.multiple) {
			Z.el.multiple = "multiple";	
		}
		Z.renderAll();
		Z.el.name = Z._field;
		var jqEl = jQuery(Z.el);
		jqEl.on('change', Z._doChanged);// end observe
		jqEl.focus(function(event) {
			jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		});
		jqEl.blur(function(event) {
			jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		});
		if(Z.el.multiple) {
			jqEl.on('click', 'option', function () {
				Z._currOption = this;
			});// end observe
		}
		jqEl.addClass('form-control');//Bootstrap class
	}, // end bind

	_doChanged: function (event) {
		var Z = this.jslet;
		if(Z.el.multiple) {
			if(Z.inProcessing) {
				Z.inProcessing = false;
			}
			var fldObj = Z._dataset.getField(Z._field),
				limitCount = fldObj.valueCountLimit();
			if(limitCount) {
				var values = Z.getValue(),
					count = 1;
				if(jslet.isArray(values)) {
					count = values.length;
				}
				if (count >= limitCount) {
					jslet.showInfo(jslet.formatMessage(jsletlocale.DBCheckBoxGroup.invalidCheckedCount,
							[''	+ limitCount]));
					
					window.setTimeout(function(){
						if(Z._currOption) {
							Z.inProcessing = true;
							Z._currOption.selected = false;
						}
					}, 10);
					return;
				}
			}
		}
		this.jslet.updateToDataset();
	},
		
	renderOptions: function () {
		var Z = this,
			arrhtm = [];
		
		var fldObj = Z._dataset.getField(Z._field);
		if (!fldObj.required()){
			arrhtm.push('<option value="_null_">');
			arrhtm.push(fldObj.nullText());
			arrhtm.push('</option>');
		}

		for (var i = Z._beginItem; i <= Z._endItem; i += Z._step) {
			arrhtm.push('<option value="');
			arrhtm.push(i);
			arrhtm.push('">');
			arrhtm.push(i);
			arrhtm.push('</option>');
		}
		jQuery(Z.el).html(arrhtm.join(''));
	}, // end renderOptions

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled() || fldObj.readOnly();
			Z.el.disabled = disabled;
			jslet.ui.setEditableStyle(Z.el, disabled, disabled, true, fldObj.required());
		}
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}

		if (!Z.el.multiple) {
			var value = Z.getValue();
			if (value !== null) {
				Z.el.value = value;
			} else {
				Z.el.value = null;
			}
		} else {
			var arrValue = Z.getValue(),
				optCnt = Z.el.options.length, opt, selected, i;
			Z._keep_silence_ = true;
			try {
				for (i = 0; i < optCnt; i++) {
					opt = Z.el.options[i];
					if (opt) {
						opt.selected = false;
					}
				}

				var j, vcnt = arrValue.length - 1;
				for (i = 0; i < optCnt; i++) {
					opt = Z.el.options[i];
					for (j = vcnt; j >= 0; j--) {
						selected = (arrValue[j] == opt.value);
						if (selected) {
							opt.selected = selected;
						}
					} // end for j
				} // end for i
			} finally {
				Z._keep_silence_ = false;
			}
		}
	},
	
	/**
	 * @override
	 */
	focus: function() {
		this.el.focus();
		return this;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.renderOptions();
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},

	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var value,
			isMulti = Z.el.multiple;
		if (!isMulti) {
			value = Z.el.value;
			var fldObj = Z._dataset.getField(Z._field);
			if (value == '_null_' && !fldObj.required()) {
				value = null;
			}
		} else {
			var opts = jQuery(Z.el).find('option'),
				optCnt = opts.length - 1, opt;
			value = [];
			for (var i = 0; i <= optCnt; i++) {
				opt = opts[i];
				if (opt.selected) {
					value.push(opt.value);
				}
			}
		}
		Z._keep_silence_ = true;
		try {
			if (!isMulti) {
				Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
			} else {
				Z._dataset.setFieldValue(Z._field, value);
			}
		} finally {
			Z._keep_silence_ = false;
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		jQuery(this.el).off();
		$super();
	}
});

jslet.ui.register('DBRangeSelect', jslet.ui.DBRangeSelect);
jslet.ui.DBRangeSelect.htmlTemplate = '<select></select>';

/**
 * @class 
 * @extend jslet.ui.Rating
 * 
 * DBRating. A control which usually displays some star to user, and user can click to rate something. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBRating",dataset:"employee",field:"grade", itemCount: 5};
 * 
 *     //1. Declaring:
 *      <div data-jslet='type:"DBRating",dataset:"employee",field:"grade"', itemCount: 5' />
 *      or
 *      <div data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBRating = jslet.Class.create(jslet.ui.Rating, {
	_isDBControl: true,
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		$super(el, params);
		this.refreshControl();
	},

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			Z._readOnly = fldObj.disabled() || fldObj.readOnly();
		}
		if(!metaName || metaName == "required") {
			Z._required = fldObj.required();
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			value = Z.getValue();
		
		Z._value = value;
		Z._setValue(value);
	},
	
	/**
	 * @protected
	 * @override
	 */
	doUIChanged: function() {
		var Z = this;
		Z._dataset.setFieldValue(Z._field, Z.value(), Z._valueIndex);
	}
	
});

jslet.ui.register('DBRating', jslet.ui.DBRating);
jslet.ui.DBRating.htmlTemplate = '<Div></Div>';

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBSelect. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBSelect",dataset:"employee",field:"department"};
 * 
 *     //1. Declaring:
 *      <select data-jslet='type:"DBSelect",dataset:"employee",field:"department"' />
 *      or
 *      <select data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <select id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBSelect = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,groupField,lookupDataset';

		Z._groupField = null;
		
		Z._lookupDataset = null;
		
		Z._enableInvalidTip = true;
		
		Z._innerEditFilterExpr = null;
		
		Z._isRendering = false;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get group field name, you can use this to group options. <br />
	 * Detail to see HTML "OptGroup" element.
	 * 
	 * @param {String | undefined} groupField Group field name.
	 * 
	 * @return {this | String}
	 */
	groupField: function(groupField) {
		if(groupField === undefined) {
			return this._groupField;
		}
		groupField = jQuery.trim(groupField);
		jslet.Checker.test('DBSelect.groupField', groupField).isString();
		this._groupField = groupField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the lookup dataset to render "Select Options".
	 * 
	 * @param {String | undefined} lookupDataset Lookup dataset name.
	 * 
	 * @return {this | String}
	 */
	lookupDataset: function(lookupDataset) {
		if(lookupDataset === undefined) {
			return this._lookupDataset;
		}

		if (jslet.isString(lookupDataset)) {
			lookupDataset = jslet.data.getDataset(jQuery.trim(lookupDataset));
		}
		
		jslet.Checker.test('DBSelect.lookupDataset', lookupDataset).isClass(jslet.data.Dataset.className);
		this._lookupDataset = lookupDataset;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function(el) {
		return (el.tagName.toLowerCase() == 'select');
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			valueStyle = fldObj.valueStyle();
		
		if(Z.el.multiple && valueStyle != jslet.data.FieldValueStyle.MULTIPLE) {
			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
		} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && !Z.el.multiple) {
			Z.el.multiple = "multiple";	
		}
		Z.renderAll();
		Z.el.name = Z._field;

		var jqEl = jQuery(Z.el);
		jqEl.on('change', Z._doChanged);
		jqEl.focus(function(event) {
			jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		});
		jqEl.blur(function(event) {
			jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		});
		if(Z.el.multiple) {
			jqEl.on('click', 'option', Z._doCheckLimitCount);
		}
		jqEl.addClass('form-control');//Bootstrap class
		Z.doMetaChanged('required');
	}, // end bind

	_doChanged: function(event) {
		var Z = this.jslet;
		if(Z.el.multiple) {
			if(Z.inProcessing) {
				Z.inProcessing = false;
			}
			var fldObj = Z._dataset.getField(Z._field),
				limitCount = fldObj.valueCountLimit();

			if(limitCount) {
				var values = Z._dataset.getFieldValue(Z._field),
					count = 1;
				if(jslet.isArray(values)) {
					count = values.length;
				}
				if (count >= limitCount) {
					jslet.showInfo(jslet.formatMessage(jsletlocale.DBCheckBoxGroup.invalidCheckedCount,
							[''	+ limitCount]));
					
					window.setTimeout(function(){
						if(Z._currOption) {
							Z.inProcessing = true;
							Z._currOption.selected = false;
						}
					}, 10);
					return;
				}
			}
		}
		this.jslet.updateToDataset();
	},
	
	_doCheckLimitCount: function(event) {
		var Z = event.delegateTarget.jslet;
		Z._currOption = this;
	},

	_setDefaultValue: function(fldObj, firstItemValue) {
		if(!firstItemValue || !fldObj.required()) {
			return;
		}
		var dftValue = fldObj.defaultValue();
		if(dftValue) {
			var lkds = fldObj.lookup().dataset();
			var found = lkds.findByKey(dftValue);
			if(found) {
				return;
			} else {
				dftValue = null;
			}
		}
		
		if(!dftValue) {
			fldObj.defaultValue(firstItemValue);
		}
		if(this._dataset.changedStatus() && !fldObj.getValue()) {
			fldObj.setValue(firstItemValue);
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doLookupChanged: function() {
		var Z = this;
		if(Z._isRendering) {
			return;
		}
		var	fldObj = Z._dataset.getField(Z._field),
			lkf = fldObj.lookup();
		if(Z._lookupDataset) {
			lkf = new jslet.data.FieldLookup(fldObj, {dataset: Z._lookupDataset});
		} else {
			if (!lkf) {
				return;
			}
		}
		Z._isRendering = true;
		var lkds = lkf.dataset(),
			groupIsLookup = false,
			groupLookup, 
			groupFldObj, 
			extraIndex;
		if (Z._groupField) {
			groupFldObj = lkds.getField(Z._groupField);
			if (groupFldObj === null) {
				throw 'NOT found field: ' + Z._groupField + ' in ' + lkds.name();
			}
			lkds.indexFields(Z._groupField);
		}
		var preGroupValue = null, groupValue, groupDisplayValue, content = [];

		if (!Z.el.multiple && !fldObj.required()){
			content.push('<option value="_null_">');
			content.push(fldObj.nullText());
			content.push('</option>');
		}
		var oldRecno = lkds.recno(),
			optValue, optDispValue, 
			firstItemValue = null,
			editFilter = lkf.editFilter();
		Z._innerEditFilterExpr = null;
		var editItemDisabled = lkf.editItemDisabled();
		if(editFilter) {
			Z._innerEditFilterExpr = new jslet.data.Expression(lkds, editFilter);
		}
		var disableOption = false, allCnt = 0;
		try {
			for (var i = 0, cnt = lkds.recordCount(); i < cnt; i++) {
				lkds.recnoSilence(i);
				disableOption = false;
				if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
					if(!editItemDisabled) {
						continue;
					} else {
						disableOption = true;
					}
				}
				if (Z._groupField) {
					groupValue = lkds.getFieldValue(Z._groupField);
					if (groupValue != preGroupValue) {
						if (preGroupValue !== null) {
							content.push('</optgroup>');
						}
						if (groupIsLookup) {
							if (!groupLookup.dataset()
											.findByField(groupLookup.keyField(), groupValue)) {
								throw 'Not found: [' + groupValue + '] in Dataset: [' +
									groupLookup.dataset().name() +
									']field: [' + groupLookup.keyField() + ']';
							}
							groupDisplayValue = groupLookup.getCurrentDisplayValue();
						} else
							groupDisplayValue = groupValue;

						content.push('<optgroup label="');
						content.push(groupDisplayValue);
						content.push('">');
						preGroupValue = groupValue;
					}
				}
				content.push('<option value="');
				optValue = lkds.getFieldValue(lkf.keyField());
				if(firstItemValue === null) {
					firstItemValue = optValue;
				}
				content.push(optValue);
				content.push('"'+ (disableOption? ' disabled': '') +  '>');
				content.push(lkf.getCurrentDisplayValue());
				content.push('</option>');
				allCnt++;
			} // end for
			if (preGroupValue !== null) {
				content.push('</optgroup>');
			}
			if(allCnt > 100) {
				console.warn(fldObj.label() + '(' + Z._field + '): ' + jsletlocale.DBSelect.moreLookupRecords);
			}

			jQuery(Z.el).html(content.join(''));
			Z._setDefaultValue(fldObj, firstItemValue);
			Z.doValueChanged();
		} finally {
			Z._isRendering = false;
			lkds.recnoSilence(oldRecno);
		}
	},

	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled() || fldObj.readOnly();
			Z.el.disabled = disabled;
			jslet.ui.setEditableStyle(Z.el, disabled, disabled, true, fldObj.required());
		}
		if(metaName && metaName == 'required') {
			var jqEl = jQuery(Z.el);
			if (fldObj.required()) {
				jqEl.addClass('jl-ctrl-required');
			} else {
				jqEl.removeClass('jl-ctrl-required');
			}
		}
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._skipRefresh) {
			return;
		}
		var errObj = Z.getFieldError();
		if(errObj && errObj.message) {
			Z.el.value = errObj.inputText;
			Z.renderInvalid(errObj);
			return;
		} else {
			Z.renderInvalid(null);
		}
		var value = Z.getValue();
		if(!Z.el.multiple && value === Z.el.value) {
			return;
		}
		var i, optCnt = Z.el.options.length, 
			opt;
		for (i = 0; i < optCnt; i++) {
			opt = Z.el.options[i];
			if (opt) {
				opt.selected = false;
			}
		}
		
		var fldObj = Z._dataset.getField(Z._field);
		if (!Z.el.multiple) {
			if(!Z._checkOptionEditable(fldObj, value)) {
				value = null;
			}
			if (value === null){
				if (!fldObj.required()) {
					value = '_null_';
				}
			}
			Z.el.value = value;
		} else {
			var arrValue = value;
			if(arrValue === null || arrValue.length === 0) {
				return;
			}
				
			var vcnt = arrValue.length - 1, selected;
			Z._skipRefresh = true;
			try {
				for (i = 0; i < optCnt; i++) {
					opt = Z.el.options[i];

					for (var j = vcnt; j >= 0; j--) {
						selected = (arrValue[j] == opt.value);
						if (selected) {
							opt.selected = selected;
						}
					} // end for j
				} // end for i
			} finally {
				Z._skipRefresh = false;
			}
		}
	},
 
	_checkOptionEditable: function(fldObj, fldValue) {
		var Z = this;
		if(!Z._innerEditFilterExpr || fldValue === null || fldValue === undefined || fldValue === '') {
			return true;
		}
		var lkDs = fldObj.lookup().dataset(); 
		if(lkDs.findByKey(fldValue) && !Z._innerEditFilterExpr.eval()) {
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function() {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},

	updateToDataset: function() {
		var Z = this;
		if (Z._skipRefresh) {
			return;
		}
		var opt, value,
			isMulti = Z.el.multiple;
		if (!isMulti) {
			value = Z.el.value;
			if (!value) {
				opt = Z.el.options[Z.el.selectedIndex];
				value = opt.innerHTML;
			}
		} else {
			var opts = jQuery(Z.el).find('option'),
				optCnt = opts.length - 1;
			value = [];
			for (var i = 0; i <= optCnt; i++) {
				opt = opts[i];
				if (opt.selected) {
					value.push(opt.value ? opt.value : opt.innerHTML);
				}
			}
		}

		Z._skipRefresh = true;
		try {
			Z._dataset.editRecord();
			var valueChanged = false;
			if (!isMulti) {
				var fldObj = Z._dataset.getField(Z._field);
				if (value == '_null_' && !fldObj.required()) {
					value = null;
				}
				Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
				if(value != Z._dataset.getFieldValue(Z._field, Z._valueIndex)) {
					valueChanged = true;
				}
			} else {
				Z._dataset.setFieldValue(Z._field, value);
				if(value != Z._dataset.getFieldValue(Z._field)) {
					valueChanged = true;
				}
			}
			if(valueChanged) {
				Z._skipRefresh = false;
				Z.doValueChanged();
			}
		} finally {
			Z._skipRefresh = false;
		}
	}, // end updateToDataset
	
	/**
	 * @override
	 */
	destroy: function($super){
		this._currOption = null;
		jQuery(this.el).off();
		$super();
	}
});

jslet.ui.register('DBSelect', jslet.ui.DBSelect);
jslet.ui.DBSelect.htmlTemplate = '<select></select>';

/**
 * @class 
 * @extend jslet.ui.DBControl
 * 
 * DBSelectView. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBSelectView",dataset:"employee",displayFields:"name"};
 * 
 *     //1. Declaring:
 *      <select data-jslet='type:"DBSelectView",dataset:"employee",displayFields:"name"' />
 *      or
 *      <select data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <select id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBSelectView = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,displayFields,groupField';

		Z._groupField = null;
		
		Z._displayFields = null;

		Z._innerEditFilterExpr = null;
		
		Z._isRendering = false;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get group field name, you can use this to group options. <br />
	 * Detail to see HTML "OptGroup" element.
	 * 
	 * @param {String | undefined} groupField Group field name.
	 * 
	 * @return {this | String}
	 */
	groupField: function(groupField) {
		if(groupField === undefined) {
			return this._groupField;
		}
		groupField = jQuery.trim(groupField);
		jslet.Checker.test('DBSelectView.groupField', groupField).isString();
		this._groupField = groupField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Display fields to render tree node, it's a js expresssion, like: "[code]+'-'+[name]".
	 * 
	 * @param {String | undefined} displayFields Display fields, it's a js expresssion, like: "[code]+'-'+[name]".
	 * 
	 * @return {this | String}
	 */
	displayFields: function(displayFields) {
		if(displayFields === undefined) {
			var dispFields = this._displayFields;
			if(dispFields) {
				if(this._dataset.getField(dispFields)) {
					return '[' + dispFields + ']';
				}
				return dispFields;
			} else {
				var dataset = this._dataset;
				var dispField = dataset.nameField() || dataset.codeField() || dataset.keyField();
				if(dispField) {
					return '[' + dispField + ']';
				}
				jslet.Checker.test('DBSelectView.displayFields', dispField).required();
			}
		}
		displayFields = jQuery.trim(displayFields);
		jslet.Checker.test('DBSelectView.displayFields', displayFields).required().isString();
		this._displayFields = displayFields;
		this._innerDisplayFieldsExpr = null;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function(el) {
		return (el.tagName.toLowerCase() == 'select');
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function() {
		var Z = this;
		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.on('change', Z._doChanged);
		jqEl.addClass('form-control');//Bootstrap class
	}, // end bind

	_doChanged: function(event) {
		this.jslet._dataset.recno(parseInt(this.value));
	},
	
	_renderOptions: function() {
		var Z = this;
		if(Z._isRendering) {
			return;
		}
		Z._isRendering = true;
		var dsObj = Z.dataset(),
			groupIsLookup = false,
			groupLookup, 
			groupFldObj, 
			extraIndex;
		if (Z._groupField) {
			groupFldObj = dsObj.getField(Z._groupField);
			if (groupFldObj === null) {
				throw 'NOT found field: ' + Z._groupField + ' in ' + dsObj.name();
			}
			dsObj.fixedIndexFields(Z._groupField);
		}
		var preGroupValue = null, groupValue, groupDisplayValue, content = [];

		var oldRecno = dsObj.recno(),
			optValue, optDispValue, 
			firstItemValue = null,
			dispFieldExpr = Z.displayFields();
		jslet.Checker.test('DBSelectView.displayFields', dispFieldExpr).required().isString();
		if(!Z._innerDisplayFieldsExpr) {
			Z._innerDisplayFieldsExpr = new jslet.data.Expression(dsObj, dispFieldExpr);
		}
		var allCnt = 0, displayValue;
		try {
			for (var i = 0, cnt = dsObj.recordCount(); i < cnt; i++) {
				dsObj.recnoSilence(i);
				if (Z._groupField) {
					groupValue = dsObj.getFieldValue(Z._groupField);
					if (groupValue != preGroupValue) {
						if (preGroupValue !== null) {
							content.push('</optgroup>');
						}
						if (groupIsLookup) {
							if (!groupLookup.dataset()
											.findByField(groupLookup.keyField(), groupValue)) {
								throw 'Not found: [' + groupValue + '] in Dataset: [' +
									groupLookup.dataset().name() +
									']field: [' + groupLookup.keyField() + ']';
							}
							groupDisplayValue = groupLookup.getCurrentDisplayValue();
						} else
							groupDisplayValue = groupValue;

						content.push('<optgroup label="');
						content.push(groupDisplayValue);
						content.push('">');
						preGroupValue = groupValue;
					}
				}
				content.push('<option value="'+ i +'">');
				content.push(Z._innerDisplayFieldsExpr.eval());
				content.push('</option>');
				allCnt++;
			} // end for
			if (preGroupValue !== null) {
				content.push('</optgroup>');
			}
			if(allCnt > 100) {
				console.warn(dsObj.name() + jsletlocale.DBSelectView.moreLookupRecords);
			}

			jQuery(Z.el).html(content.join(''));
		} finally {
			Z._isRendering = false;
			dsObj.recnoSilence(oldRecno);
			Z.el.value = Z.dataset().recno();
		}
	}, // end renderOptions

	/**
	 * @override
	 */
	renderAll: function() {
		this._renderOptions();
		return this;
	},

	refreshControl: function(evt) {
		var Z = this,
			evtType = evt.eventType;
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
			//empty
		} else if (evtType == jslet.data.RefreshEvent.UPDATEALL) {
			Z.renderAll();
		} else if (evtType == jslet.data.RefreshEvent.INSERT ||
			evtType == jslet.data.RefreshEvent.DELETE) {
			Z.renderAll();
		} else if (evtType == jslet.data.RefreshEvent.UPDATERECORD ||
			evtType == jslet.data.RefreshEvent.UPDATECOLUMN) {
			Z.renderAll();
		} else if (evtType == jslet.data.RefreshEvent.SCROLL) {
			Z.el.value = Z.dataset().recno();
		}
	}, // end refreshControl
		
	
	/**
	 * @override
	 */
	destroy: function($super){
		jQuery(this.el).off();
		$super();
	}
});

jslet.ui.register('DBSelectView', jslet.ui.DBSelectView);
jslet.ui.DBSelectView.htmlTemplate = '<select></select>';

/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBSpinEdit. 
 * 
 *     @example
 *     var jsletParam = {type:"DBSpinEdit",dataset:"employee",field:"age", minValue:18, maxValue: 100, step: 5};
 * 
 *    //1. Declaring:
 *     <div data-jslet='type:"DBSpinEdit",dataset:"employee",field:"age", minValue:18, maxValue: 100, step: 5'></div>
 *     or
 *     <div data-jslet='jsletParam'></div>
 *
 *    //2. Binding
 *     <div id="ctrlId"></div>
 *     //Js snippet
 *     var el = document.getElementById('ctrlId');
 *     jslet.ui.bindControl(el, jsletParam);
 *
 *    //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBSpinEdit = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,step';

		Z._step = 1;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get step.
	 * 
	 * @param {Integer | undefined} step Step value.
	 * 
	 * @return {this | Integer}
	 */
	step: function(step) {
		if(step === undefined) {
			return this._step;
		}
		jslet.Checker.test('DBSpinEdit.step', step).isNumber();
		this._step = step;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tag = el.tagName.toLowerCase();
		return tag == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if(!jqEl.hasClass('jl-spinedit')) {
			jqEl.addClass('input-group jl-spinedit');
		}
		Z._createControl();
		Z.renderAll();
	},

	_createControl: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			s = '<input type="text" class="form-control">' + 
		    	'<div class="jl-spinedit-btn-group">' +
		    	'<button class="btn btn-default jl-spinedit-up" tabindex="-1"><i class="fa fa-caret-up"></i></button>' + 
		    	'<button class="btn btn-default jl-spinedit-down" tabindex="-1"><i class="fa fa-caret-down"></i></button>';
		jqEl.html(s);
		
		var editor = jqEl.find('input')[0],
			upButton = jqEl.find('.jl-spinedit-up')[0],
			downButton = jqEl.find('.jl-spinedit-down')[0];
		Z.editor = editor;
		editor.name = Z._field;
		jQuery(Z.editor).on("keydown", function(event){
			if(Z._isDisabled()) {
				return;
			}
			var keyCode = event.keyCode;
			if(keyCode === jslet.ui.KeyCode.UP) {
				Z.decValue();
				event.preventDefault();
				return;
			}
			if(keyCode === jslet.ui.KeyCode.DOWN) {
				Z.incValue();
				event.preventDefault();
				return;
			}
		});
		new jslet.ui.DBText(editor, {
			dataset: Z._dataset,
			field: Z._field,
			beforeUpdateToDataset: Z.beforeUpdateToDataset,
			valueIndex: Z._valueIndex,
			tabIndex: Z._tabIndex
		});
		
		var jqBtn = jQuery(upButton);
		jqBtn.on('click', function () {
			Z.incValue();
		});
		
		jqBtn.focus(function(event) {
			jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		});
		jqBtn.blur(function(event) {
			jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		});
		
		jqBtn = jQuery(downButton);
		jqBtn.on('click', function () {
			Z.decValue();
		});
		
		jqBtn.focus(function(event) {
			jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
		});
		jqBtn.blur(function(event) {
			jslet.ui.globalFocusManager.activeDataset(null).activeField(null).activeValueIndex(null);
		});
	},
	
	_isDisabled: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		return fldObj.disabled() || fldObj.readOnly();
	},
	
	beforeUpdateToDataset: function () {
		var Z = this,
			val = Z.el.value;
		var fldObj = Z._dataset.getField(Z._field),
			range = fldObj.dataRange(),
			minValue = Number.NEGATIVE_INFINITY, 
			maxValue = Number.POSITIVE_INFINITY;
		
		if(range) {
			if(range.min || range.min === 0) {
				minValue = parseFloat(range.min);
			}
			if(range.max || range.min === 0) {
				maxValue = parseFloat(range.max);
			}
		}
		if (val) {
			val = parseFloat(val);
		}
		jQuery(Z.el).attr('aria-valuenow', val);
		Z.el.value = val;
		return true;
	},

	setValueToDataset: function (val) {
		var Z = this;
		if (Z.silence) {
			return;
		}
		Z.silence = true;
		if (val === undefined) {
			val = Z.value;
		}
		try {
			Z._dataset.setFieldValue(Z._field, val, Z._valueIndex);
		} finally {
			Z.silence = false;
		}
	},

	incValue: function () {
		var Z = this,
			val = Z.getValue();
		if (!val) {
			val = 0;
		}
		var maxValue = Z._getRange().maxValue;
		if (val === maxValue) {
			return;
		} else if (val < maxValue) {
			val += Z._step;
		} else {
			val = maxValue;
		}
		if (val > maxValue) {
			val = maxValue;
		}
		jQuery(Z.el).attr('aria-valuenow', val);
		Z.setValueToDataset(val);
		return this;
	},

	_getRange: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			range = fldObj.dataRange(),
			minValue = Number.NEGATIVE_INFINITY, 
			maxValue = Number.POSITIVE_INFINITY;
		
		if(range) {
			if(range.min || range.min === 0) {
				minValue = parseFloat(range.min);
			}
			if(range.max || range.min === 0) {
				maxValue = parseFloat(range.max);
			}
		}
		return {minValue: minValue, maxValue: maxValue};
	},
	
	decValue: function () {
		var Z = this,
			val = Z.getValue();
		if (!val) {
			val = 0;
		}
		var minValue = Z._getRange().minValue;
		if (val === minValue) {
			return;
		} else if (val > minValue) {
			val -= Z._step;
		} else {
			val = minValue;
		}
		if (val < minValue)
			val = minValue;
		jQuery(Z.el).attr('aria-valuenow', val);
		Z.setValueToDataset(val);
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	innerFocus: function() {
		this.editor.focus();
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName) {
		$super(metaName);
		var Z = this,
			jqEl = jQuery(this.el),
			fldObj = Z._dataset.getField(Z._field);
		
		if(!metaName || metaName == 'disabled' || metaName == 'readOnly') {
			var disabled = fldObj.disabled() || fldObj.readOnly(),
				jqUpBtn = jqEl.find('.jl-spinedit-up'),
				jqDownBtn = jqEl.find('.jl-spinedit-down');
				
			if (disabled) {
				jqUpBtn.attr('disabled', 'disabled');
				jqDownBtn.attr('disabled', 'disabled');
			} else {
				jqUpBtn.attr('disabled', false);
				jqDownBtn.attr('disabled', false);
			}
		}
		if(!metaName || metaName == 'dataRange') {
			var range = fldObj.dataRange();
			jqEl.attr('aria-valuemin', range && (range.min || range.min === 0) ? range.min: '');
			jqEl.attr('aria-valuemin', range && (range.max || range.max === 0) ? range.max: '');
		}
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function(){
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	tableId: function($super, tableId){
		$super(tableId);
		this.editor.jslet.tableId(tableId);
	},
	
	/**
	 * @override
	 */
	destroy: function(){
		var jqEl = jQuery(this.el);
		jQuery(this.editor).off();
		this.editor = null;
		jqEl.find('.jl-upbtn-up').off();
		jqEl.find('.jl-downbtn-up').off();
	}
	
});
jslet.ui.register('DBSpinEdit', jslet.ui.DBSpinEdit);
jslet.ui.DBSpinEdit.htmlTemplate = '<div></div>';


/**
 * @class 
 * @extend jslet.ui.DBFieldControl
 * 
 * DBTimePicker is used for time inputting. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBTimePicker",field:"time"};
 *     //1. Declaring:
 *      <input id="ctrlId" type="text" data-jslet='jsletParam' />
 *      or
 *      <input id="ctrlId" type="text" data-jslet='{type:"DBTimePicker",field:"time"}' />
 *
 *     //2. Binding
 *      <input id="ctrlId" type="text" data-jslet='jsletParam' />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBTimePicker = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,is12Hour,hasSecond';
		
		Z._is12Hour = false;
		
		Z._hasSecond = true;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Identify whether use 12-hour style.
	 * 
	 * @param {Boolean | undefined} is12Hour True - use 12-hour style, false(default) - use 24-hour style.
	 * 
	 * @return {this | Boolean}
	 */
	is12Hour: function(is12Hour) {
		if(is12Hour === undefined) {
			return this._is12Hour;
		}
		this._is12Hour = is12Hour? true: false;
		return this;
	},

	/**
	 * @property
	 * 
	 * Identify whether exists "Second" part or not.
	 * 
	 * @param {Boolean | undefined} hasSecond True(default) - exists "Second" part, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasSecond: function(hasSecond) {
		if(hasSecond === undefined) {
			return this._hasSecond;
		}
		this._hasSecond = hasSecond? true: false;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div' || tagName == 'span';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if(!jqEl.hasClass('jl-timepicker')) {
			jqEl.addClass('form-control jl-timepicker');
		}
		Z.renderAll();
		jqEl.on('change', 'select', function(event){
			Z.updateToDataset();
		});
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el),
			fldObj = Z._dataset.getField(Z._field),
			range = fldObj.dataRange(),
			minTimePart = {hour: 0, minute: 0, second: 0},
			maxTimePart = {hour: 23, minute: 59, second: 59};
		
		if(range) {
			if(range.min) {
				minTimePart = Z._splitTime(range.min);
			}
			if(range.max) {
				maxTimePart = Z._splitTime(range.max);
			}
		}
		var	tmpl = [];
		
		tmpl.push('<select class="jl-time-hour">');
		if(Z._is12Hour) {
			var minHour = minTimePart.hour;
			var maxHour = maxTimePart.hour;
			var min = 100, max = 0, hour;
			for(var k = minHour; k < maxHour; k++) {
				hour = k;
				if( k > 11) {
					hour = k - 12;
				}
				min = Math.min(min, hour);
				max = Math.max(max, hour);
			}
			tmpl.push(Z._getOptions(min, max));
		} else {
			tmpl.push(Z._getOptions(minTimePart.hour, maxTimePart.hour || 23));
		}
		tmpl.push('</select>');
		
		tmpl.push('<select class="jl-time-minute">');
		tmpl.push(Z._getOptions(0, 59));
		tmpl.push('</select>');
		
		if(Z._hasSecond) {
			tmpl.push('<select class="jl-time-second">');
			tmpl.push(Z._getOptions(0, 59));
			tmpl.push('</select>');
		}
		
		if(Z._is12Hour) {
			tmpl.push('<select class="jl-time-ampm"><option value="am">AM</option><option value="pm">PM</option></select>');
		}
		jqEl.html(tmpl.join(''));
		Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},

	_getOptions: function(begin, end) {
		var result = [], value;
		for(var i = begin; i <= end; i++) {
			if( i < 10) {
				value = '0' + i;
			} else {
				value = '' + i;
			}
			result.push('<option value="');
			result.push(i);
			result.push('">');
			result.push(value);
			result.push('</option>');
		}
		return result.join('');
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly" || metaName == 'tabIndex') {
			var disabled = fldObj.disabled() || fldObj.readOnly();
			var items = jQuery(Z.el).find("select"), item,
				required = fldObj.required(),
				tabIdx = fldObj.tabIndex();
			for(var i = 0, cnt = items.length; i < cnt; i++){
				item = items[i];
				item.disabled = disabled;
				jslet.ui.setEditableStyle(item, disabled, disabled, true, required);
				item.tabIndex = tabIdx;
			}
		}
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var value = Z.getValue(),
			timePart = Z._splitTime(value),
			hour = timePart.hour,
			jqEl = jQuery(Z.el),
			jqHour = jqEl.find('.jl-time-hour'),
			jqMinute = jqEl.find('.jl-time-minute');
		
		if(Z._is12Hour) {
			var jqAmPm = jqEl.find('.jl-time-ampm');
			jqAmPm.prop('selectedIndex', hour < 12 ? 0: 1);
			if(hour > 11) {
				hour -= 12;
			}
		}
		jqHour.val(hour);
		jqMinute.val(timePart.minute);
		if(Z._hasSecond) {
			jqMinute = jqEl.find('.jl-time-second');
			jqMinute.val(timePart.second);
		}
	},
	 
	_splitTime: function(value) {
		var	hour = 0,
			minute = 0,
			second = 0;
		if(value) {
			if(jslet.isDate(value)) {
				hour = value.getHours();
				minute = value.getMinutes();
				second = value.getSeconds();
			} else if(jslet.isString(value)) {
				var parts = value.split(":");
				hour = parseInt(parts[0]);
				if(parts.length > 1) {
					minute = parseInt(parts[1]);
				}
				if(parts.length > 2) {
					second = parseInt(parts[2]);
				}
			}
		}
		return {hour: hour, minute: minute, second: second};
	},
	
	_prefix: function(value) {
		if(parseInt(value) < 10) {
			return '0' + value;
		}
		return value;
	},
	
	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return true;
		}

		Z._keep_silence_ = true;
		try {
			var jqEl = jQuery(Z.el),
				fldObj = Z._dataset.getField(Z._field),
				value = null, hour;
			if(fldObj.getType() != jslet.data.DataType.DATE) {
				value = [];
				if(Z._is12Hour && jqEl.find('.jl-time-ampm').prop("selectedIndex") > 0) {
					hour = parseInt(jqEl.find('.jl-time-hour').val()) + 12;
					value.push(hour);
				} else {
					value.push(Z._prefix(jqEl.find('.jl-time-hour').val()));
				}
				value.push(':');
				value.push(Z._prefix(jqEl.find('.jl-time-minute').val()));
				if(Z._hasSecond) {
					value.push(':');
					value.push(Z._prefix(jqEl.find('.jl-time-second').val()));
				}
				value = value.join('');
			} else {
				value = Z.getValue();
				if(!value) {
					value = new Date();
				}
				hour = parseInt(jqEl.find('.jl-time-hour').val());
				if(Z._is12Hour && jqEl.find('.jl-time-ampm').prop("selectedIndex") > 0) {
					hour += 12;
				}
				var minute = parseInt(jqEl.find('.jl-time-minute').val());
				var second = 0;
				if(Z._hasSecond) {
					second = parseInt(jqEl.find('.jl-time-second').val());
				}
				
				value.setHours(hour);
				value.setMinutes(minute);
				value.setSeconds(second);
			}
			Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
		} finally {
			Z._keep_silence_ = false;
		}
		return true;
	},

	/**
	 * @protected
	 * @override
	 */
	innerFocus: function() {
		var jqEl = jQuery(this.el);
		jqEl.find('.jl-time-hour').focus();
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		jQuery(this.el).off();
		$super();
	}
});
jslet.ui.register('DBTimePicker', jslet.ui.DBTimePicker);
jslet.ui.DBTimePicker.htmlTemplate = '<div></div>';

/**
 * @class
 * @extend jslet.ui.DBFieldControl
 * 
 * DBUEditor is a data sensitive UEditor. Example:
 * 
 *     @example
 *      var jsletParam = {type:“DBUEditor“,field:“name“};
 *     //1. Declaring:
 *      <input id=“ctrlId“ type=“text“ data-jslet='jsletParam' /&gt;
 *      or
 *      <input id=“ctrlId“ type=“text“ data-jslet='{type:“DBUEditor“,field:“name“}' /&gt;
 * 
 *     //2. Binding
 *      <input id=“ctrlId“ type=“text“ data-jslet='jsletParam' /&gt;
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 * 
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBUEditor = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,field,height';

		Z._height = 150;
		
		Z._oldValue = null;
		
		Z._editor = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get UEditor initial height.
	 * 
	 * @param {Integer | undefined} height UEditor initial height.
	 * 
	 * @return {this | Integer}
	 */
	height: function(height) {
		if(height === undefined) {
			return this._height;
		}
		jslet.Checker.test('DBUEditor.height', height).isGTZero();
		this._height = height;
		return this;
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		if(!window.UE) {
			throw new Error('Not found UEditor component! Goto for more: http://ueditor.baidu.com/website/');
		}
		var jqEl = jQuery(Z.el);
		jqEl.addClass('jl-ueditor');
		var editorId = jslet.nextId();
		var html = '<textarea></textarea>';
		jqEl.html(html);
		jqEl.children().attr('id', editorId).attr('name', Z._field);
		var editor = window.UE.getEditor(editorId);
		
		editor.on('focus', jQuery.proxy(Z._doFocus, Z));
		editor.on('contentchange', jQuery.proxy(Z._doChange, Z));
		Z._editor = editor;
		editor.addListener('ready', function(editor) {
			Z.renderAll();
		 });
	}, // end bind

	/**
	 * @protected
	 * @override
	 */
	_doFocus: function () {
		var Z = this;
		jslet.ui.globalFocusManager.activeDataset(Z._dataset.name()).activeField(Z._field).activeValueIndex(Z._valueIndex);
	},

	_doChange: function() {
		this.updateToDataset();
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			console.warn('UEditor Not support this feature: set read only!');
		}
		
		if(metaName && metaName == 'required') {
			var jqEl = jQuery(Z.el);
			if (fldObj.required()) {
				jqEl.addClass('jl-ctrl-required');
			} else {
				jqEl.removeClass('jl-ctrl-required');
			}
		}
		
	},
	
	/**
	 * @protected
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var errObj = Z.getFieldError(), value;
		if(errObj && errObj.message) {
			Z.renderInvalid(errObj);
			value = errObj.inputText;
		} else {
			Z.renderInvalid(null);
			value = Z.getText();
		}
		Z._editor.setContent(value || '');
		Z._oldValue = Z.el.value;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},

	innerFocus: function($super) {
		this._editor.focus();
	},
	
	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var value = Z._editor.getContent();
		if(Z._oldValue == value) {
			return;
		}
		Z._dataset.editRecord();
		Z._keep_silence_ = true;
		try {
			Z._dataset.setFieldText(Z._field, value, Z._valueIndex);
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		} finally {
			Z._keep_silence_ = false;
		}
		var errObj = Z.getFieldError();
		if(errObj && errObj.message) {
			Z.renderInvalid(errObj);
		} else {
			Z.renderInvalid(null);
		}
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		jQuery(Z.el).off();
		Z._editor = null;
		$super();
	}
});
jslet.ui.register('DBUEditor', jslet.ui.DBUEditor);
jslet.ui.DBUEditor.htmlTemplate = '<div></div>';


/*
 * Inner Class for DBTable and DBTreeView control
 */
"use strict";
jslet.ui.ListViewModel = function (dataset, isTree) {// boolean, identify if it's tree model
	var visibleCount = 0,
		visibleStartRow = 0,
		visibleEndRow = 0,
		needShowRows = null,//Array of all rows that need show, all of these rows's status will be 'expanded'
		allRows = null,//Array of all rows, include 'expanded' and 'collapsed' rows
		currentRowno = 0,
		currentRecno = 0;
	this.onTopRownoChanged = null; //Event handler: function(rowno){}
	this.onVisibleCountChanged = null; //Event handler: function(visibleRowCount){}
	this.onCurrentRownoChanged = null; //Event handler: function(rowno){}
	this.onNeedShowRowsCountChanged = null; //Event handler: function(needShowCount){}
	this.onCheckStateChanged = null;  //Event handler: function(){}
		
	this.fixedRows = 0;
	var initial = function () {
		if (!isTree) {
			return false;
		}
		var ds = dataset;
		if (!ds._parentField || !ds._keyField) {
			return false;
		}
		return true;
	};
	initial();
	
	this.refreshModel = function (expandLevel) {
		if (!isTree) {
			return;
		}
		if(expandLevel === undefined) {
			expandLevel = -1;
		}
		var dsObj = dataset, 
			hiddenCnt = 0, 
			recno, 
			allCnt = dsObj.recordCount(), 
			childCnt, 
			result = [], 
			pId,
			oldRecno = dsObj.recnoSilence();
		try {
			dsObj.recnoSilence(this.fixedRows);
			var level = 0, 
				pnodes = [], 
				node, pnode, 
				tmpNode, tmpKeyValue,
				currRec, keyValue, recCnt;
			for(recno = 0, recCnt = dsObj.recordCount(); recno < recCnt; recno++) {
				dsObj.recnoSilence(recno);
				keyValue = dsObj.keyValue();
				level = 0;
				pnode = null;
				pId = dsObj.parentValue();
				for(var m = pnodes.length - 1; m>=0; m--) {
					tmpNode = pnodes[m];
					tmpKeyValue = tmpNode.keyvalue; 
					if (tmpKeyValue !== null && 
						tmpKeyValue !== undefined && 
						tmpKeyValue !== '' && 
						tmpKeyValue == pId) {
						level = tmpNode.level + 1;
						pnode = tmpNode;
						break;
					}
				}
				if (pnode){
					for(var k = pnodes.length - 1; k > m; k--) {
						pnodes.pop();
					}
				}
				currRec = dsObj.getRecord();
				var expanded = true;
				if(expandLevel >= 0 && level <= expandLevel) {
					expanded = true;
				} else { 
					expanded = dsObj.expanded();
				}
				node = { parent: pnode, recno: recno, keyvalue: keyValue, expanded: expanded, isbold: 0, level: level };
				pnodes.push(node);
								
				if (pnode){
					if (!pnode.children) {
						pnode.children = [];
					}
					pnode.children.push(node);
				} else {
					result.push(node);
				}
				
			} //end for recno
		} finally {
			dsObj.recnoSilence(oldRecno);
		}
		allRows = result;
		for(var j = 0, len = allRows.length; j < len; j++) {
			this._updateNodeBoldStyle(allRows[j]);
		}
		this._setLastFlag(result);
		this._refreshNeedShowRows();
	};
		
	this._updateNodeBoldStyle = function(node) {
		
		function update(pnode) {
			var children = pnode.children, 
				cnode, found = false;
			if(!children) {
				return;
			}
			for(var i = 0, cnt = children.length; i < cnt; i++) {
				cnode = children[i];
				if(cnode.children) {
					update(cnode);
					if(!cnode.isbold) {
						if (dataset.selectedByRecno(cnode.recno)) {
							pnode.isbold = true;
							found = true;
							break;
						}
					} else {
						pnode.isbold = true;
						found = true;
						break;
					}
				} else {
					if (dataset.selectedByRecno(cnode.recno)) {
						pnode.isbold = true;
						found = true;
						break;
					}
				}
			}
			if(!found) {
				pnode.isbold = false;
			}
		}
		
		if(!node) {
			return;
		}
		
		var pNode = node, root = node;
		while(true) {
			pNode = node.parent;
			if(pNode === null) {
				root = node;
				break;
			}
			node = pNode;
		}
		update(root);
	};
	
	this._setLastFlag = function (nodes) {
		if (!nodes || nodes.length === 0) {
			return;
		}
		var node;
		nodes[nodes.length - 1].islast = true;
		for (var i = 0, cnt = nodes.length; i < cnt; i++) {
			node = nodes[i];
			if (node.children && node.children.length > 0) {
				this._setLastFlag(node.children);
			}
		}
		return null;
	};
	
	this._refreshNeedShowRows = function (notFireChangedEvent) {
		if (!isTree) {
			return;
		}
		var result = [], node;
		if (!allRows) {
			this.refreshModel();
			return;
		}
		var preCnt = needShowRows ? needShowRows.length: 0;
		needShowRows = [];
		this._findVisibleNode(allRows);
		var currCnt = needShowRows.length;
		if (!notFireChangedEvent && this.onNeedShowRowsCountChanged){
			this.onNeedShowRowsCountChanged(currCnt);
		}
	};
	
	this.hasChildren = function (recno) {
		if (!isTree) {
			return false;
		}
		if (!recno) {
			recno = dataset.recno();
		}
		var node = this._innerFindNode(allRows, recno);
		if (node === null) {
			return;
		}
		return node.children && node.children.length > 0;
	};
	
	this.getLevel = function (recno) {
		if (!isTree) {
			return false;
		}
		if (!recno) {
			recno = dataset.recno();
		}
		var node = this._innerFindNode(allRows, recno);
		if (node === null) {
			return;
		}
		return node.level;
	};
	
	this._findVisibleNode = function (nodes) {
		if (!nodes) {
			return;
		}
		var node;
		for (var i = 0, cnt = nodes.length; i < cnt; i++) {
			node = nodes[i];
			needShowRows.push(node);
			if (node.expanded){
				this._findVisibleNode(node.children);
			}
		}
	};
	
	this.rownoToRecno = function (rowno) {
		if (!isTree) {
			return rowno + this.fixedRows;
		}
		if (rowno < 0) {
			rowno = rowno + this.fixedRows;
			return rowno >= 0 ? rowno : -1;
		}
		if (rowno >= needShowRows.length) {
			return -1;
		}
		return needShowRows[rowno].recno;
	};
	
	this.recnoToRowno = function (recno) {
		if (!isTree) {
			return recno - this.fixedRows;
		}
		for(var i = 0, cnt = needShowRows.length; i < cnt; i++){
			if (needShowRows[i].recno == recno) {
				return i;
			}
		}
		return -1;
	};
	
	this.setVisibleStartRow = function (rowno, notFireEvt) {
		if (rowno >= 0) {
			var maxVisibleNo = this.getNeedShowRowCount() + 1 - visibleCount;
			if (rowno > maxVisibleNo) {
				rowno = maxVisibleNo;
			}
		}
		if (rowno < 0) {
			rowno = 0;
		}
		if (visibleStartRow == rowno) {
			return;
		}
		visibleStartRow = rowno;
		visibleEndRow = rowno + visibleCount - 1;
		if (!notFireEvt && this.onTopRownoChanged) {
			this.onTopRownoChanged(rowno);
		}
	};
	
	this.getVisibleStartRow = function () {
		return visibleStartRow;
	};
	
	this.setVisibleEndRow = function(endRow){
		visibleEndRow = endRow;
	};
	
	this.getVisibleEndRow = function(){
		return visibleEndRow;
	};
	
	this.setVisibleCount = function (count, notFireEvt) {
		if (visibleCount == count) {
			return;
		}
		visibleCount = count;
		visibleEndRow = visibleStartRow + count - 1;
		if (!notFireEvt && this.onVisibleCountChanged) {
			this.onVisibleCountChanged(count);
		}
	};
	
	this.getVisibleCount = function () {
		return visibleCount;
	};
	
	this.getNeedShowRowCount = function () {
		if (!isTree) {
			return dataset.recordCount()- this.fixedRows;
		}
		return needShowRows.length;
	};
	
	this.getCurrentRow = function(){
		return needShowRows[currentRowno];
	};
	
	this.skipSetCurrentRowno = function() {
		this._skipSetCurrentRowno = true;
	};
	
	this.setCurrentRowno = function (rowno, notFireEvt, checkVisible) {
		if(this._skipSetCurrentRowno) {
			this._skipSetCurrentRowno = false;
			return null;
		}
		if(rowno === undefined) {
			return null;
		}
		var preRowno = currentRowno, recno = 0, currRow=null;
		if (rowno < 0){//In the fixed row area
			var lowestRowno = -1 * this.fixedRows;
			if (rowno < lowestRowno) {
				rowno = lowestRowno;
			}
			recno = this.fixedRows + rowno;
		} else {
			var maxRow = this.getNeedShowRowCount();
			if(maxRow === 0) {
				currentRowno = 0;
				currentRecno = -1;
				return null;
			}
			if (rowno >= maxRow) {
				rowno = maxRow - 1;
			}
			if (!isTree) {
				recno = rowno + this.fixedRows;
			} else {
				currRow = needShowRows[rowno];
				recno = currRow.recno;
			}
			if (checkVisible) {
				if (rowno >= 0 && rowno < visibleStartRow){
					this.setVisibleStartRow(rowno);
				} else {
					if (rowno >= visibleStartRow + visibleCount) {
						this.setVisibleStartRow(rowno - visibleCount + 1);
					}
				}
			}
		}
		currentRowno = rowno;
		currentRecno = recno;
		if (!notFireEvt && this.onCurrentRownoChanged) {
			this.onCurrentRownoChanged(preRowno, currentRowno);
		}
		return currRow;
	};
	
	this.getCurrentRowno = function () {
		return currentRowno;
	};
	
	this.getCurrentRecno = function() {
		return currentRecno;
	};
	
	this.nextRow = function () {
		dataset.confirm();
		this.setCurrentRowno(currentRowno + 1, false, true);
	};
	
	this.priorRow = function (num) {
		dataset.confirm();
		this.setCurrentRowno(currentRowno - 1, false, true);
	};
	
	this.nextPage = function () {
		dataset.confirm();
		this.setVisibleStartRow(visibleStartRow + visibleCount);
		this.setCurrentRowno(visibleStartRow);
	};
	
	this.priorPage = function () {
		dataset.confirm();
		this.setVisibleStartRow(visibleStartRow - visibleCount);
		this.setCurrentRowno(visibleStartRow);
	};
	
	this._innerFindNode = function (nodes, recno) {
		var node, nextNode;
		for (var i = 0, cnt = nodes.length - 1; i <= cnt; i++) {
			node = nodes[i];
			if (node.recno == recno) {
				return node;
			}
			if (node.children) {
				var result = this._innerFindNode(node.children, recno);
				if (result) {
					return result;
				}
			}
		}
		return null;
	};
	
	this.expand = function (callbackFn) {
		if (!isTree) {
			return;
		}
		var node = this._innerFindNode(allRows, dataset.recno());
		if (node === null) {
			return;
		}
		dataset.confirm();
		var oldRecno = dataset.recnoSilence();
		try {
			node.expanded = node.children ? true : false;
			dataset.recnoSilence(node.recno);
			dataset.expanded(node.expanded);
			var p = node;
			while (true) {
				p = p.parent;
				if (!p) {
					break;
				}
				if (!p.expanded) {
					dataset.recnoSilence(p.recno);
					dataset.expanded(true);
					p.expanded = true;
				}
			}
		} finally {
			dataset.recnoSilence(oldRecno);
		}
		this._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this.collapse = function (callbackFn) {
		if (!isTree) {
			return;
		}
		var node = this._innerFindNode(allRows, dataset.recno());
		if (node === null) {
			return;
		}
		dataset.confirm();
		var oldRecno = dataset.recnoSilence();
		try {
			dataset.recnoSilence(node.recno);
			dataset.expanded(false);
			node.expanded = false;
		} finally {
			dataset.recnoSilence(oldRecno);
		}
		
		this._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this._iterateNode = function (nodes, callbackFn) {
		var node;
		for (var i = 0, cnt = nodes.length; i < cnt; i++) {
			node = nodes[i];
			if (node.children) {
				if (callbackFn) {
					callbackFn(node);
				}
				if (node.children && node.children.length > 0) {
					this._iterateNode(node.children, callbackFn);
				}
			}
		}
		return null;
	};
	
	this._callbackFn = function (node, expanded) {
		var oldRecno = dataset.recnoSilence();
		try {
			dataset.recnoSilence(node.recno);
			dataset.expanded(expanded);
			node.expanded = expanded;
		} finally {
			dataset.recnoSilence(oldRecno);
		}
	};
	
	this.expandAll = function (callbackFn) {
		if (!isTree) {
			return;
		}
		
		dataset.confirm();
		var Z = this;
		Z._iterateNode(allRows, function (node) {
			Z._callbackFn(node, true); 
		});
		Z._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this.collapseAll = function (callbackFn) {
		if (!isTree) {
			return;
		}
		dataset.confirm();
		var Z = this;
		Z._iterateNode(allRows, function (node) {
			Z._callbackFn(node, false); 
		});
		Z._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this.syncDataset = function(){
		var recno = dataset.recno();
		if(recno < 0) {
			return;
		}
		var node = this._innerFindNode(allRows, dataset.recno()),
			pnode = node.parent;
		if (pnode && !pnode.expanded){
			while(true){
				if (!pnode.expanded) {
					pnode.expanded = true;
				} else {
						break;
				}
				pnode = pnode.parent;
				if (!pnode) {
					break;
				}
			}
		}
		this._refreshNeedShowRows();
		var rowno = this.recnoToRowno(recno);
		this.setCurrentRowno(rowno, false, true);
	};
	
	this.checkNode = function(state, relativeCheck, onlyCheckChildren){
		var node = this.getCurrentRow();
		dataset.selected(state ? 1 : 0);

		if (relativeCheck){
			if (node.children && node.children.length > 0) {
				this._updateChildState(node, state);
			}
			if (node.parent && !onlyCheckChildren) {
				this._updateParentState(node, state);
			}
		}
		
		this._updateNodeBoldStyle(node);
		
		if (this.onCheckStateChanged) {
			this.onCheckStateChanged();
		}
	};
	
	this.checkChildNodes = function(state, relativeCheck){
		var node = this.getCurrentRow();
		dataset.selected(state ? 1 : 0);

		if (relativeCheck){
			if (node.parent) {
				this._updateParentState(node, state);
			}
			if (node.children && node.children.length > 0) {
				this._updateChildState(node, state);
			}
		}

		this._updateNodeBoldStyle(node);
		
		if (this.onCheckStateChanged) {
			this.onCheckStateChanged();
		}
	};
	
	this._updateChildState = function(node, state){
		var oldRecno = dataset.recnoSilence(),
			childNode;
		try{
			for(var i = 0, cnt = node.children.length; i < cnt; i++){
				childNode = node.children[i];
				dataset.recnoSilence(childNode.recno);
				dataset.selected(state);
				if (childNode.children && childNode.children.length > 0) {
					this._updateChildState(childNode, state);
				}
			}
		} finally {
			dataset.recnoSilence(oldRecno);
		}
	};
	
	this._updateParentState = function(node, state){
		var pNode = node.parent;
		if (!pNode) {
			return;
		}
		var childNode, newState, childState;
		if (state != 2){
			for(var i = 0, cnt = pNode.children.length; i < cnt; i++){
				childNode = pNode.children[i];
				childState = dataset.selectedByRecno(childNode.recno);
				if (childState == 2){
					newState = 2;
					break;
				}
				if (i === 0){
					newState = childState;
				} else if (newState != childState){
					newState =2;
					break;
				}
			}//end for
		} else {
			newState = state;
		}
		var pState = dataset.selectedByRecno(pNode.recno);
		if (pState != newState){
			var oldRecno = dataset.recnoSilence();
			try{
				dataset.recnoSilence(pNode.recno);
				dataset.selected(newState);
			}finally{
				dataset.recnoSilence(oldRecno);
			}
		}
		this._updateParentState(pNode, newState);
	};
	
	this.reset = function() {
		visibleCount = 0;
		visibleStartRow = 0;
		visibleEndRow = 0;
		needShowRows = null;
		allRows = null;
		currentRowno = 0;
		currentRecno = 0;
		this.fixedRows = 0;
	};
	
	this.destroy = function(){
		dataset = null;
		allRows = null;
		this.reset();
		this.onTopRownoChanged = null;
		this.onVisibleCountChanged = null;
		this.onCurrentRownoChanged = null;
		this.onNeedShowRowsCountChanged = null;
		this.onCheckStateChanged = null;
	};
};

/**
 * @class 
 * @extend jslet.ui.DBControl
 * 
 * DBTreeView. <br /> 
 * Features: <br />
 * 1. Perfect performance, you can load unlimited data; <br />
 * 2. Checkbox on tree node; <br />
 * 3. Relative check, when you check one tree node, its children and its parent will check too; <br />
 * 4. Many events for you to customize tree control; <br />
 * 5. Context menu supported and you can customize your context menu; <br />
 * 6. Icon supported on each tree node. <br />
 * 
 * Example:
 * 
 *     @example
 *     var jsletParam = { type: "DBTreeView", 
 *     	dataset: "dsAgency", 
 *     	displayFields: "[code]+'-'+[name]",
 *      keyField: "id", 
 *     	parentField: "parentid",
 *      hasCheckBox: true, 
 *     	iconClassField: "iconcls", 
 *     	onCreateContextMenu: doCreateContextMenu, 
 *     	correlateCheck: true
 *     };
 *     
 *     //1. Declaring:
 *       <div id="ctrlId" data-jslet="jsletParam">
 *       or
 *       <div data-jslet='jsletParam' />
 *  
 *     //2. Binding
 *       <div id="ctrlId"  />
 *       //Js snippet
 *     	var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *       jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBTreeView = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,displayFields,useArrow,itemHeight,hasLine,hasCheckBox,enableErrorFinding,correlateCheck,correlative,onlyCheckChildren,readOnly,expandLevel,onItemClick,onItemDblClick,beforeCheckBoxClick,afterCheckBoxClick,iconClassField,onGetIconClass,onRenderItem,onCreateContextMenu';
		Z.requiredProperties = 'displayFields';
		
		Z._displayFields = null;

		Z._itemHeight = 22;
		
		Z._useArrow = false;

		Z._hasLine = true;

		Z._hasCheckBox = false;

		Z._readOnly = false;
		
		Z._correlative = false;
		
		Z._onlyCheckChildren = false;
		
		Z._iconClassField = null;
		
		Z._expandLevel = -1;
		
		Z._onItemClick = null;
		
		Z._onItemDblClick = null;

		Z._beforeCheckBoxClick = null;
		
		Z._afterCheckBoxClick = null;

		Z._onGetIconClass = null;
		
		Z._onRenderItem = null;
		
		Z._onCreateContextMenu = null;
		
		Z._enableErrorFinding = false;
		
		Z.iconWidth = null;
		
		$super(el, params);
	},
	
	/**
	 * @property
	 * 
	 * Display fields to render tree node, it's a js expresssion, like: "[code]+'-'+[name]".
	 * 
	 * @param {String | undefined} displayFields Display fields, it's a js expresssion, like: "[code]+'-'+[name]".
	 * 
	 * @return {this | String}
	 */
	displayFields: function(displayFields) {
		if(displayFields === undefined) {
			var dispFields = this._displayFields;
			if(dispFields) {
				if(this._dataset.getField(dispFields)) {
					return '[' + dispFields + ']';
				}
				return dispFields;
			} else {
				var dataset = this._dataset;
				var dispField = dataset.nameField() || dataset.codeField() || dataset.keyField();
				if(dispField) {
					return '[' + dispField + ']';
				}
				jslet.Checker.test('DBTreeView.displayFields', dispField).required();
			}
		}
		displayFields = jQuery.trim(displayFields);
		jslet.Checker.test('DBTreeView.displayFields', displayFields).required().isString();
		this._displayFields = displayFields;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get tree items' height, default is 22px.
	 * 
	 * @param {Integer | undefined} itemHeight Tree items' height.
	 * 
	 * @return {this | Integer}
	 */
	itemHeight: function(itemHeight) {
		if(itemHeight === undefined) {
			return this._itemHeight;
		}
		jslet.Checker.test('DBTreeView.itemHeight', itemHeight).isNumber();
		this._itemHeight = itemHeight;
	},
	
	/**
	 * @property
	 * 
	 * If icon class is stored one field, you can set this property to display different tree node icon.
	 * 
	 * @param {String | undefined} iconClassField Icon class field.
	 * 
	 * @return {this | String}
	 */
	iconClassField: function(iconClassField) {
		if(iconClassField === undefined) {
			return this._iconClassField;
		}
		iconClassField = jQuery.trim(iconClassField);
		jslet.Checker.test('DBTreeView.iconClassField', iconClassField).isString();
		this._iconClassField = iconClassField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * If true, use "Arrow" as expander, else "Plus/Minus" as expander.
	 * 
	 * @param {Boolean | undefined} useArrow True - use "Arrow" as expander, False - "Plus/Minus" as expander.
	 * 
	 * @return {this | Boolean}
	 */
	useArrow: function(useArrow) {
		if(useArrow === undefined) {
			return this._useArrow;
		}
		this._useArrow = useArrow ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether there is a line before tree node.
	 * 
	 * @param {Boolean | undefined} hasLine True - a line before tree node, False - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasLine: function(hasLine) {
		if(hasLine === undefined) {
			return this._hasLine;
		}
		this._hasLine = hasLine ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether there is a check box on tree node.
	 * 
	 * @param {Boolean | undefined} hasCheckBox True - a check box on tree node, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasCheckBox: function(hasCheckBox) {
		if(hasCheckBox === undefined) {
			return this._hasCheckBox;
		}
		this._hasCheckBox = hasCheckBox ? true: false;
		return this;
	},
	
	correlateCheck: function(correlateCheck) {
		return this.correlative(correlateCheck);
	},
	
	/**
	 * @property
	 * 
	 * If true, when you check one tree node, its children and its parent will be checked too.
	 * 
	 * @param {Boolean | undefined} correlative If true, when checking one tree node, its children and its parent will be checked too.
	 * 
	 * @return {this | Boolean}
	 */
	correlative: function(correlative) {
		if(correlative === undefined) {
			return this._correlative;
		}
		this._correlative = correlative ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * If true, only check children.
	 * 
	 * @param {Boolean | undefined} onlyCheckChildren True - only check children, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	onlyCheckChildren: function(onlyCheckChildren) {
		if(onlyCheckChildren === undefined) {
			return this._onlyCheckChildren;
		}
		this._onlyCheckChildren = onlyCheckChildren ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether the checkbox is read only or not, ignored if "hasCheckBox" is false.
	 * 
	 * @param {Boolean | undefined} readOnly Checkbox is readOnly or not, ignored if hasCheckBox = false.
	 * 
	 * @return {this | Boolean}
	 */
	readOnly: function(readOnly) {
		if(readOnly === undefined) {
			return this._readOnly;
		}
		this._readOnly = readOnly ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify the nodes which level is from 0 to "expandLevel" will be expanded when initialize tree.
	 * 
	 * @param {Integer | undefined} expandLevel Identify the nodes which level is from 0 to "expandLevel" will be expanded when initialize tree.
	 * 
	 * @return {this | Integer}
	 */
	expandLevel: function(expandLevel) {
		if(expandLevel === undefined) {
			return this._expandLevel;
		}
		jslet.Checker.test('DBTreeView.expandLevel', expandLevel).isGTEZero();
		this._expandLevel = parseInt(expandLevel);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether it's showing the 'Error find' menu item in the context menu.
	 * 
	 * @param {Boolean | undefined} enableErrorFinding True - show error find menu item in the context menu, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	enableErrorFinding: function(enableErrorFinding) {
		if(enableErrorFinding === undefined) {
			return this._enableErrorFinding;
		}
		this._enableErrorFinding = enableErrorFinding ? true: false;
		return this;
	},
		
	/**
	 * @event
	 * 
	 * Get or set item clicking event. Example:
	 * 
	 *     @example
	 *     treeObj.onItemClick(function() {});
	 * 
	 * @param {Function | undefined} onItemClick Item clicking event.
	 * 
	 * @return {this | Function}
	 */
	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('DBTreeView.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Get or set item double clicking event. Example:
	 * 
	 *     @example
	 *     treeObj.onItemDblClick(function() {});
	 * 
	 * @param {Function | undefined} onItemDblClick Double clicking item event.
	 * 
	 * @return {this | Function}
	 */
	onItemDblClick: function(onItemDblClick) {
		if(onItemDblClick === undefined) {
			return this._onItemDblClick;
		}
		jslet.Checker.test('DBTreeView.onItemDblClick', onItemDblClick).isFunction();
		this._onItemDblClick = onItemDblClick;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get before check box clicking event. Example:
	 * 
	 *     @example
	 *     treeObj.beforeCheckBoxClick(function() {});
	 * 
	 * @param {Function | undefined} beforeCheckBoxClick Before check box clicking event handler.
	 * 
	 * @return {this | Function}
	 */
	beforeCheckBoxClick: function(beforeCheckBoxClick) {
		if(beforeCheckBoxClick === undefined) {
			return this._beforeCheckBoxClick;
		}
		jslet.Checker.test('DBTreeView.beforeCheckBoxClick', beforeCheckBoxClick).isFunction();
		this._beforeCheckBoxClick = beforeCheckBoxClick;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get after check box click event. Example:
	 * 
	 *     @example
	 *     treeObj.afterCheckBoxClick(function() {});
	 * 
	 * @param {Function | undefined} afterCheckBoxClick After check box clicking event handler.
	 * 
	 * @return {this | Function}
	 */
	afterCheckBoxClick: function(afterCheckBoxClick) {
		if(afterCheckBoxClick === undefined) {
			return this._afterCheckBoxClick;
		}
		jslet.Checker.test('DBTreeView.afterCheckBoxClick', afterCheckBoxClick).isFunction();
		this._afterCheckBoxClick = afterCheckBoxClick;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * You can use this event to customize your tree node icon flexibly. Example:
	 * 
	 *     @example
	 *     treeObj.onGetIconClass(function(keyValue, level, isLeaf) {
	 *        return 'icon_class';
	 *     });
	 *     
	 * @param {Function | undefined} onGetIconClass Get icon class event.
	 * @param {String} onGetIconClass.keyValue Key value of tree node.
	 * @param {Integer} onGetIconClass.level Tree node level.
	 * @param {Boolean} onGetIconClass.isLeaf Identify whether the tree node is the leaf node.
	 * @param {String} onGetIconClass.return Icon class name.
	 * 
	 * @return {this | Function}
	 */
	onGetIconClass: function(onGetIconClass) {
		if(onGetIconClass === undefined) {
			return this._onGetIconClass;
		}
		jslet.Checker.test('DBTreeView.onGetIconClass', onGetIconClass).isFunction();
		this._onGetIconClass = onGetIconClass;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get item rendering event. Example:
	 * 
	 *     @example
	 *     treeObj.onRenderItem(function(iconEl, textEl, level, isLeaf) {});
	 * 
	 * @param {Function | undefined} onRenderItem Item rendering event.
	 * @param {HtmlElement} onRenderItem.iconEl HTML element for rendering icon.
	 * @param {HtmlElement} onRenderItem.textEl HTML element for rendering text.
	 * @param {Integer} onRenderItem.level Tree node level.
	 * @param {Boolean} onRenderItem.isLeaf Identify whether the tree node is the leaf node.
	 * 
	 * @return {this | Function}
	 */
	onRenderItem: function(onRenderItem) {
		if(onRenderItem === undefined) {
			return this._onRenderItem;
		}
		jslet.Checker.test('DBTreeView.onRenderItem', onRenderItem).isFunction();
		this._onRenderItem = onRenderItem;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Set or get context menu creating event. It's used to add customized menu. Example:
	 * 
	 *     @example
	 *     treeObj.onCreateContextMenu(function(menuItems) {
	 *       menuItems.push({ name: '-' });
	 *       menuItems.push({ id: 'customMenu', name: 'Customized Menu1', onClick: function() { alert('Customized Menu1 clicked!'); } });
	 *     });
	 * 
	 * @param {Function | undefined} onCreateContextMenu context menu creating event.
	 * @param {Object[]} onCreateContextMenu.menuItems context menu creating event.
	 * 
	 * @return {this | Function}
	 */
	onCreateContextMenu: function(onCreateContextMenu) {
		if(onCreateContextMenu === undefined) {
			return this._onCreateContextMenu;
		}
		jslet.Checker.test('DBTreeView.onCreateContextMenu', onCreateContextMenu).isFunction();
		this._onCreateContextMenu = onCreateContextMenu;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function(el) {
		return el.tagName.toLowerCase() == 'div';
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		Z.scrBarSize = jslet.ui.scrollbarSize() + 1;
		
		if (Z._keyField === undefined) {
			Z._keyField = Z._dataset.keyField();
		}
		var ti = jqEl.attr('tabindex');
		if (!ti) {
			jqEl.attr('tabindex', -1);
		}
		jqEl.keydown(function(event) {
			var keyCode = event.which, 
				ctrlKey = event.ctrlKey;
			if(ctrlKey && keyCode === jslet.ui.KeyCode.E) { //ctrl + e
				Z.gotoNextError();
				event.preventDefault();
	       		event.stopImmediatePropagation();
				return false;
			}
			if(ctrlKey && keyCode === jslet.ui.KeyCode.HOME) { //ctrl + Home
				Z._dataset.first();
				event.preventDefault();
	       		event.stopImmediatePropagation();
				return false;
			}
			if(ctrlKey && keyCode === jslet.ui.KeyCode.END) { //ctrl + Home
				Z._dataset.last();
				event.preventDefault();
	       		event.stopImmediatePropagation();
				return false;
			}
			if (Z._doKeydown(event.which)) {
				event.preventDefault();
			}
		});
		jqEl.on('mouseenter', 'td.jl-tree-text', function(event) {
			jQuery(this).addClass('jl-tree-nodes-hover');
		});
		jqEl.on('mouseleave', 'td.jl-tree-text', function(event) {
			jQuery(this).removeClass('jl-tree-nodes-hover');
		});
		if (!jqEl.hasClass('jl-tree')) {
			jqEl.addClass('jl-tree');
		}
        var notFF = ((typeof Z.el.onmousewheel) == 'object'); //firefox or nonFirefox browser
        var wheelEvent = (notFF ? 'mousewheel' : 'DOMMouseScroll');
        jqEl.on(wheelEvent, function(event) {
            var originalEvent = event.originalEvent;
            var num = notFF ? originalEvent.wheelDelta / -120 : originalEvent.detail / 3;
            Z.listvm.setVisibleStartRow(Z.listvm.getVisibleStartRow() + num);
       		event.preventDefault();
        });
		
		Z.renderAll();
		Z.refreshControl(jslet.data.RefreshEvent.scrollEvent(this._dataset.recno()));
		Z._createContextMenu();		
		jslet.ui.resizeEventBus.subscribe(Z);
	}, // end bind
	
	/**
	 * @override
	*/
	renderAll: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		Z.evaluator = new jslet.data.Expression(Z._dataset, Z.displayFields());
		if(Z._useArrow) {
			jqEl.removeClass('jl-tree-plus');
			jqEl.removeClass('jl-tree-plus-nl');
			jqEl.addClass('jl-tree-arrow');
		} else {
			jqEl.removeClass('jl-tree-arrow');
			if(Z._hasLine) {
				jqEl.addClass('jl-tree-plus');
			} else {
				jqEl.addClass('jl-tree-plus-nl');
			}
		}
		jqEl.html('');
		Z.oldWidth = jqEl.width();
		Z.oldHeight = jqEl.height();
		jqEl.css('line-height', Z._itemHeight + 'px');
		Z.nodeHeight = Z.iconWidth = (Z._itemHeight || parseInt(jslet.ui.getCssValue('jl-tree', 'line-height')));
		var strHeight = jqEl[0].style.height; 
		if(strHeight.indexOf('%') > 0) {
			Z.treePanelHeight = jqEl.parent().height() * parseFloat(strHeight) / 100;
		} else {
			Z.treePanelHeight = jqEl.height();
		}
		Z.treePanelWidth = jqEl.width();
		Z.nodeCount = Math.floor(Z.treePanelHeight / Z.nodeHeight);

		Z._initVm();
		Z._initFrame();
		Z.listvm.syncDataset();
	}, // end renderAll
	
	_initFrame: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
			
		jqEl.find('.jl-tree-container').off();
		jqEl.find('.jl-tree-scrollbar').off();
		
		var strCheckbox = '<span class="fa-stack jl-tree-mixedchecked jl-hidden"><i class="fa fa-square fa-stack-1x"></i><i class="fa fa-square-o fa-stack-2x" aria-hidden="true"></i></span>';
		strCheckbox += '<span class="fa fa-check-square-o jl-tree-checked jl-hidden"></span>';
		strCheckbox += '<span class="fa fa-square-o jl-tree-unchecked jl-hidden"></span>';
		var lines = [], i, cnt;
		for(i = 0; i < 5; i++) {//Default cells for lines is 5
			lines.push('<td class="jl-tree-unit jl-tree-lines" ');
			lines.push(jslet.ui.DBTreeView.NODETYPE);
			lines.push('="0"></td>');
		}
		var strLines = lines.join(''),
			tmpl = ['<div class="jl-tree-container">'],
			flag = !Z._hasLine || Z._useArrow;
		for(i = 0, cnt = Z.nodeCount; i < cnt; i++) {
			tmpl.push('<table class="jl-tree-nodes" cellpadding="0" cellspacing="0"><tr>');
			tmpl.push(strLines);
			tmpl.push('<td class="jl-tree-unit jl-tree-expander" ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//expander
			tmpl.push('="1">');
			if(flag) {
				if(Z._useArrow) {
					tmpl.push('<i class="fa fa-caret-right" aria-hidden="true"></i>');
				} else {
					tmpl.push('<i class="fa fa-plus-square-o" aria-hidden="true"></i>');
				}
			}
			tmpl.push('</td><td class="jl-tree-unit jl-tree-checkbox" ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//checkbox
			tmpl.push('="2">' + strCheckbox + '</td><td ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//icon
			tmpl.push('="3"></td><td class="jl-tree-text" ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//text
			tmpl.push('="9" nowrap="nowrap"></td></tr></table>');
		}
		tmpl.push('</div><div class="jl-tree-scrollbar"><div class="jl-tree-tracker"></div></div>');
		jqEl.html(tmpl.join(''));
		
		jqEl.on('click', 'td[data-nodetype]', function(event) {
			Z._doRowClick(event.currentTarget);
			event.stopImmediatePropagation();
		});
		jqEl.on('dblclick', 'td[data-nodetype]', function(event) {
			Z._doRowDblClick(event.currentTarget);
			event.stopImmediatePropagation();
		});
		Z.listvm.setVisibleCount(Z.nodeCount);
		var sb = jqEl.find('.jl-tree-scrollbar');
		
		sb.on('scroll',function() {
			var numb = Math.ceil(this.scrollTop/Z.nodeHeight);
			if (numb != Z.listvm.getVisibleStartRow()) {
				Z._skip_ = true;
				try {
					Z.listvm.setVisibleStartRow(numb);
				} finally {
					Z._skip_ = false;
				}
			}
		});	
	},
	
	/**
	 * Goto next error record if dataset exists error records. Press 'Ctrl + E' to call this method.
	 */
	gotoNextError: function() {
		var Z = this;
		if(!Z._dataset.nextError()) {
			Z._dataset.firstError();
		}
	},

	resize: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			height = jqEl.height(),
			width = jqEl.width();
		if (width != Z.oldWidth) {
			Z.oldWidth = width;
			Z.treePanelWidth = jqEl.innerWidth();
			Z._fillData();
		}
		if (height != Z.oldHeight) {
			Z.oldHeight = height;
			Z.treePanelHeight = jqEl.innerHeight();
			Z.nodeCount = Math.floor(height / Z.nodeHeight) - 1;
			Z._initFrame();
		}
	},
	
	hasChildren: function() {
		return this.listvm.hasChildren();
	},
	
	_initVm:function() {
		var Z=this;
		Z.listvm = new jslet.ui.ListViewModel(Z._dataset, true);
		Z.listvm.refreshModel(Z._expandLevel);
		Z.listvm.fixedRows=0;
		
		Z.listvm.onTopRownoChanged=function(rowno) {
			rowno = Z.listvm.getCurrentRowno();
			Z._fillData();
			Z._doCurrentRowChanged(rowno);
			Z._syncScrollBar(rowno);
		};
		
		Z.listvm.onVisibleCountChanged=function() {
			Z._fillData();
			var allCount = Z.listvm.getNeedShowRowCount();
			jQuery(Z.el).find('.jl-tree-tracker').height(Z.nodeHeight * allCount);
		};
		
		Z.listvm.onCurrentRownoChanged=function(prevRowno, rowno) {
			Z._doCurrentRowChanged(rowno);
		};
		
		Z.listvm.onNeedShowRowsCountChanged = function(allCount) {
			Z._fillData();
			jQuery(Z.el).find('.jl-tree-tracker').height(Z.nodeHeight * (allCount + 2));
		};
		
		Z.listvm.onCheckStateChanged = function() {
			Z._fillData();
		};
	},
	
	_doKeydown: function(keyCode) {
		var Z = this, result = false;
		if (keyCode === jslet.ui.KeyCode.SPACE) {//space
			Z._doCheckBoxClick();
			result = true;
		} else if (keyCode === jslet.ui.KeyCode.UP) {//KEY_UP
			Z.listvm.priorRow();
			Z._dataset.recno(Z.listvm.getCurrentRecno());
			result = true;
		} else if (keyCode === jslet.ui.KeyCode.DOWN) {//KEY_DOWN
			Z.listvm.nextRow();
			Z._dataset.recno(Z.listvm.getCurrentRecno());
			result = true;
		} else if (keyCode === jslet.ui.KeyCode.LEFT) {//KEY_LEFT
			if (jsletlocale.isRtl) {
				Z.listvm.expand();
			} else {
				Z.listvm.collapse();
			}
			result = true;
		} else if (keyCode === jslet.ui.KeyCode.RIGHT) {//KEY_RIGHT
			if (jsletlocale.isRtl) {
				Z.listvm.collapse();
			} else {
				Z.listvm.expand();
			}
			result = true;
		} else if (keyCode === jslet.ui.KeyCode.PAGEUP) {//KEY_PAGEUP
			Z.listvm.priorPage();
			Z._dataset.recno(Z.listvm.getCurrentRecno());
			result = true;
		} else if (keyCode === jslet.ui.KeyCode.PAGEDOWN) {//KEY_PAGEDOWN
			Z.listvm.nextPage();
			Z._dataset.recno(Z.listvm.getCurrentRecno());
			result = true;
		}
		return result;
	},
	
	_getTrByRowno: function(rowno) {
		var nodes = jQuery(this.el).find('.jl-tree-nodes'), row;
		for(var i = 0, cnt = nodes.length; i < cnt; i++) {
			row = nodes[i].rows[0];
			if (row.jsletrowno == rowno) {
				return row;
			}
		}
		return null;
	},
	
	_doCurrentRowChanged: function(rowno) {
		var Z = this;
		if (Z.prevRow) {
			jQuery(Z._getTextTd(Z.prevRow)).removeClass(jslet.ui.htmlclass.TREENODECLASS.selected);
		}
		var otr = Z._getTrByRowno(rowno);
		if (otr) {
			jQuery(Z._getTextTd(otr)).addClass(jslet.ui.htmlclass.TREENODECLASS.selected);
		}
		Z.prevRow = otr;
	},
	
	_getTextTd: function(otr) {
		return otr.cells[otr.cells.length - 1];
	},
	
	_doExpand: function() {
		this.expand();
	},
	
	_doRowClick: function(treeNode) {
		var Z = this,
			nodeType = treeNode.getAttribute(jslet.ui.DBTreeView.NODETYPE);
		if(!nodeType) {
			return;
		}
		if (nodeType != '0') {
			Z._syncToDs(treeNode);
		}
		if (nodeType == '1' || nodeType == '2') { //expander
			var item = Z.listvm.getCurrentRow();
			if (nodeType == '1' && item.children && item.children.length > 0) {
				if (item.expanded) {
					Z.collapse();
				} else {
					Z.expand();
				}
			}
			if (nodeType == '2') {//checkbox
				Z._doCheckBoxClick();
			}
		}
		if(nodeType == '9') {
			Z._doCheckBoxClick();
			if(Z._onItemClick) {
				Z._onItemClick.call(Z);
			}
		}
	},
	
	_doRowDblClick: function(treeNode) {
		this._syncToDs(treeNode);
		var nodeType = treeNode.getAttribute(jslet.ui.DBTreeView.NODETYPE);
		if (this._onItemDblClick && nodeType == '9') {
			this._onItemDblClick.call(this);
		}
	},
	
	_doCheckBoxClick: function() {
		var Z = this;
		if (Z._readOnly) {
			return;
		}
		var node = Z.listvm.getCurrentRow();
		if(!node.hasCheckbox) {
			return;
		}
		if (Z._beforeCheckBoxClick && !Z._beforeCheckBoxClick.call(Z)) {
			return;
		}
		Z.listvm.checkNode(!Z._dataset.selected()? 1:0, Z._correlative, Z._onlyCheckChildren);
		if (Z._afterCheckBoxClick) {
			Z._afterCheckBoxClick.call(Z);
		}
	},
	
	_syncToDs: function(otr) {
		var rowno = -1, k;
		while(true) {
			k = otr.jsletrowno;
			if (k === 0 || k) {
				rowno = k;
				break;
			}
			otr = otr.parentNode;
			if (!otr) {
				break;
			}
		}
		if (rowno < 0) {
			return;
		}
		this.listvm.setCurrentRowno(rowno);
		this._dataset.recno(this.listvm.getCurrentRecno());
	},
	
	_fillData: function() {
		var Z = this,
			vCnt = Z.listvm.getVisibleCount(), 
			topRowno = Z.listvm.getVisibleStartRow(),
			allCnt = Z.listvm.getNeedShowRowCount(),
			availbleCnt = vCnt + topRowno,
			index = 0,
			jqEl = jQuery(Z.el),
			nodes = jqEl.find('.jl-tree-nodes'), node;
		if (Z._isRendering) {
			return;
		}

		Z._isRendering = true;
		Z._skip_ = true;
		var oldRecno = Z._dataset.recnoSilence(),
			preRowNo = Z.listvm.getCurrentRowno(),
			ajustScrBar = true, maxNodeWidth = 0, nodeWidth;
		try{
			if (allCnt < availbleCnt) {
				for(var i = availbleCnt - allCnt; i > 0; i--) {
					node = nodes[vCnt - i];
					node.style.display = 'none';
				}
				ajustScrBar = false; 
			} else {
				allCnt = availbleCnt;
			}
			var endRow = allCnt - 1;
			
			for(var k = topRowno; k <= endRow; k++) {
				node = nodes[index++];
				nodeWidth = Z._fillNode(node, k);
				if (ajustScrBar && maxNodeWidth < Z.treePanelWidth) {
					if (k == endRow && nodeWidth < Z.treePanelWidth) {
						ajustScrBar = false;
					} else {
						maxNodeWidth = Math.max(maxNodeWidth, nodeWidth);
					}
				}
				if (k == endRow && ajustScrBar) {
					node.style.display = 'none';
				} else {
					node.style.display = '';
					node.jsletrowno = k;
				}
			}
		} finally {
			Z.listvm.setCurrentRowno(preRowNo, false);
			Z._dataset.recnoSilence(oldRecno);
			Z._isRendering = false;
			Z._skip_ = false;
		}
		window.setTimeout(function() {
			Z._checkScrollBar();
		}, 5);
	},

	_setCheckClsName: function(oCheckBox, expanded) {
		var jqCheckBox = jQuery(oCheckBox);
		if (!expanded) {
			jqCheckBox.find('.jl-tree-checked').addClass('jl-hidden');
			jqCheckBox.find('.jl-tree-mixedchecked').addClass('jl-hidden');
			jqCheckBox.find('.jl-tree-unchecked').removeClass('jl-hidden');
		} else if (expanded == 2) { //mixed checked
			jqCheckBox.find('.jl-tree-checked').addClass('jl-hidden');
			jqCheckBox.find('.jl-tree-mixedchecked').removeClass('jl-hidden');
			jqCheckBox.find('.jl-tree-unchecked').addClass('jl-hidden');
		} else {
			jqCheckBox.find('.jl-tree-checked').removeClass('jl-hidden');
			jqCheckBox.find('.jl-tree-mixedchecked').addClass('jl-hidden');
			jqCheckBox.find('.jl-tree-unchecked').addClass('jl-hidden');
		}
	},
	
	_fillNode: function(nodeTbl, rowNo) {
		var row = nodeTbl.rows[0],
			Z = this,
			item = Z.listvm.setCurrentRowno(rowNo, true),
			cells = row.cells, 
			cellCnt = cells.length, 
			requiredCnt = item.level + 4,
			otd, i, cnt;
		Z._dataset.recnoSilence(Z.listvm.getCurrentRecno());
		row.jsletrowno = rowNo;
		if (cellCnt < requiredCnt) {
			for(i = 1, cnt = requiredCnt - cellCnt; i <= cnt; i++) {
				otd = row.insertCell(0);
				jQuery(otd).addClass('jl-tree-unit jl-tree-lines').attr('jsletline', 1);
			}
		}
		if (cellCnt >= requiredCnt) {
			for(i = 0, cnt = cellCnt - requiredCnt; i < cnt; i++) {
				cells[i].style.display = 'none';
			}
			for(i = cellCnt - requiredCnt; i < requiredCnt; i++) {
				cells[i].style.display = '';
			}
		}
		cellCnt = cells.length;
		//Line
		var pitem = item, k = 1, totalWidth = Z.iconWidth * item.level;
		for(i = item.level; i > 0; i--) {
			otd = row.cells[cellCnt- 4 - k++];
			pitem = pitem.parent;
			if (pitem.islast) {
				otd.className = jslet.ui.htmlclass.TREELINECLASS.empty;
			} else {
				otd.className = jslet.ui.htmlclass.TREELINECLASS.line;
			}
		}

		//expander
		var oexpander = row.cells[cellCnt- 4],
			jqSign;
		oexpander.noWrap = true;
		oexpander.style.display = '';
		if (item.children && item.children.length > 0) {
			if(!Z._useArrow && Z._hasLine) {
				if (!item.islast) {
					oexpander.className = item.expanded ? jslet.ui.htmlclass.TREELINECLASS.minus : jslet.ui.htmlclass.TREELINECLASS.plus;
				} else {
					oexpander.className = item.expanded ? jslet.ui.htmlclass.TREELINECLASS.minusBottom : jslet.ui.htmlclass.TREELINECLASS.plusBottom;
				}
			} else {
				jqSign = jQuery(oexpander.childNodes[0]);
				if(Z._useArrow) {
					if(item.expanded) {
						jqSign.addClass('jl-tree-rotate-45');
						
					} else {
						jqSign.removeClass('jl-tree-rotate-45');
					}
				} else {
					if(item.expanded) {
						jqSign.removeClass('fa-plus-square-o');
						jqSign.addClass('fa-minus-square-o');
					} else {
						jqSign.addClass('fa-plus-square-o');
						jqSign.removeClass('fa-minus-square-o');
					}
				}
				jqSign.show();
			}
		} else {
			if(!Z._useArrow && Z._hasLine) {
				if (!item.islast) {
					oexpander.className = jslet.ui.htmlclass.TREELINECLASS.join;
				} else {
					oexpander.className = jslet.ui.htmlclass.TREELINECLASS.joinBottom;
				}
			} else {
				jqSign = jQuery(oexpander.childNodes[0]);
				jqSign.hide();
			}
		}
		totalWidth += Z.iconWidth;
				
		// CheckBox
		var flag = Z._hasCheckBox && Z._dataset.checkSelectable();
		var node = Z.listvm.getCurrentRow();
		node.hasCheckbox = flag;
		var ocheckbox = row.cells[cellCnt- 3];
		if (flag) {
			ocheckbox.noWrap = true;
			Z._setCheckClsName(ocheckbox, Z._dataset.selected());
			ocheckbox.style.display = '';
			totalWidth += Z.iconWidth;
		} else {
			ocheckbox.style.display = 'none';
		}
		//Icon
		var oIcon = row.cells[cellCnt- 2],
			clsName = 'jl-tree-unit jl-tree-icon',
			iconClsId = null;

		var isLeaf = !(item.children && item.children.length > 0);
		if(Z._iconClassField || Z._onGetIconClass) {
			if(Z._iconClassField) {
				iconClsId = Z._dataset.getFieldValue(Z._iconClassField);
			} else if (Z._onGetIconClass) {
				iconClsId = Z._onGetIconClass.call(Z, Z._dataset.keyValue(), item.level, isLeaf); //keyValue, level, isLeaf
			}
			if (iconClsId) {
				clsName = iconClsId + ' '+ clsName;
			}
			if (oIcon.className != clsName) {
				oIcon.className = clsName;
			}
			oIcon.style.display = '';
			totalWidth += Z.iconWidth;
		} else {
			oIcon.style.display = 'none';
		}
		//Text
		var text = Z.evaluator.eval() || '      ';
		jslet.ui.textMeasurer.setElement(Z.el);
		var width = Math.round(jslet.ui.textMeasurer.getWidth(text)) + 10;
		totalWidth += width + 10;
		jslet.ui.textMeasurer.setElement();
		var oText = row.cells[cellCnt- 1];
		oText.style.width = width + 'px';

		var jqTd = jQuery(oText);
		jqTd.html(text);
		if(Z._dataset.existRecordError()) {
			if(!jqTd.hasClass('has-error')) {
				jqTd.addClass('has-error');
			}
			oText.title = Z._dataset.getRecordErrorInfo();
		} else {
			if(jqTd.hasClass('has-error')) {
				jqTd.removeClass('has-error');
			}
			oText.title = jqTd.text();
		}
		
		if (item.isbold) {
			jqTd.addClass('jl-tree-child-checked');
		} else {
			jqTd.removeClass('jl-tree-child-checked');
		}
		if(Z._onRenderItem) {
			Z._onRenderItem.call(Z, oIcon, oText, item.level, isLeaf); //keyValue, level, isLeaf
		}
		return totalWidth;
	},
		
	_syncScrollBar: function() {
		var Z = this;
		if (Z._skip_) {
			return;
		}
		jQuery(Z.el).find('.jl-tree-scrollbar').scrollTop(Z.nodeHeight * Z.listvm.getVisibleStartRow());
	},
	
	_checkScrollBar: function() {
		var jqScr = jQuery(this.el).find('.jl-tree-scrollbar');
		var scr = jqScr[0];
		if(scr.scrollHeight > scr.clientHeight) {
			jqScr.removeClass('jl-tree-scrollbar-hidden');
		} else {
			if(!jqScr.hasClass('jl-tree-scrollbar-hidden')) {
				jqScr.addClass('jl-tree-scrollbar-hidden');
			}
		}
	},
	
	/**
	 * Expand the current tree node.
	 */
	expand: function() {
		this.listvm.expand();
	},
	
	/**
	 * Collapse the current tree node.
	 */
	collapse: function() {
		this.listvm.collapse();
	},
	
	/**
	 * Expand all child nodes of the current tree node.
	 */
	expandAll: function() {
		this.listvm.expandAll();
	},
	
	/**
	 * Collapse all child nodes of the current tree node.
	 */
	collapseAll: function() {
		this.listvm.collapseAll();
	},
	
	_createContextMenu: function() {
		if (!jslet.ui.Menu) {
			return;
		}
		var Z = this;
		var menuCfg = { type: 'Menu', onItemClick: jQuery.proxy(Z._menuItemClick, Z), items: []};
		if (Z._hasCheckBox) {
			menuCfg.items.push({ id: 'checkAll', name: jsletlocale.DBTreeView.checkAll });
			menuCfg.items.push({ id: 'uncheckAll', name: jsletlocale.DBTreeView.uncheckAll });
			menuCfg.items.push({ name: '-' });
		}
		menuCfg.items.push({ id: 'expandAll', name: jsletlocale.DBTreeView.expandAll });
		menuCfg.items.push({ id: 'collapseAll', name: jsletlocale.DBTreeView.collapseAll});
		if(Z._enableErrorFinding) {
			menuCfg.items.push({ name: '-' });
			menuCfg.items.push({ id: 'nextError', name: jsletlocale.DBTreeView.nextError});
		}

		if (Z._onCreateContextMenu) {
			Z._onCreateContextMenu.call(Z, menuCfg.items);
		}
		if (menuCfg.items.length === 0) {
			return;
		}
		Z.contextMenu = jslet.ui.createControl(menuCfg);
		jQuery(Z.el).on('contextmenu', function(event) {
			var node = event.target,
				nodeType = node.getAttribute(jslet.ui.DBTreeView.NODETYPE);
			if(!nodeType || nodeType == '0') {
				return;
			}
			Z._syncToDs(node);
			Z.contextMenu.showContextMenu(event, Z);
		});
	},
	
	_menuItemClick: function(menuCfg, checked) {
		var menuId = menuCfg.id;
		var Z = this;
		if (menuId == 'expandAll') {
			Z.expandAll();
		} else if (menuId == 'collapseAll') {
			Z.collapseAll();
		} else if (menuId == 'checkAll') {
			Z.listvm.checkChildNodes(true, true);
			if (Z._afterCheckBoxClick) {
				Z._afterCheckBoxClick.call(Z);
			}
		} else if (menuId == 'uncheckAll') {
			Z.listvm.checkChildNodes(false, true);
			if (Z._afterCheckBoxClick) {
				Z._afterCheckBoxClick.call(Z);
			}
		} else if (menuId == 'nextError') {
			Z.gotoNextError();
		}
		
	},
	
	refreshControl: function(evt) {
		var Z = this,
			evtType = evt.eventType;
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
			//empty
		} else if (evtType == jslet.data.RefreshEvent.UPDATEALL) {
			Z.renderAll();
		} else if (evtType == jslet.data.RefreshEvent.INSERT ||
			evtType == jslet.data.RefreshEvent.DELETE) {
			Z.listvm.refreshModel(Z._expandLevel);
			if(evtType == jslet.data.RefreshEvent.INSERT) {
				Z.listvm.syncDataset();
			}
		} else if (evtType == jslet.data.RefreshEvent.UPDATERECORD ||
			evtType == jslet.data.RefreshEvent.UPDATECOLUMN) {
			Z._fillData();
		} else if (evtType == jslet.data.RefreshEvent.SELECTALL) {
			if (Z._hasCheckBox) {
				Z._fillData();
			}
		} else if (evtType == jslet.data.RefreshEvent.SELECTRECORD) {
			if (Z._hasCheckBox) {
				Z.listvm.checkNode(Z._dataset.selected(), Z._correlative, Z._onlyCheckChildren);
			}
		} else if (evtType == jslet.data.RefreshEvent.SCROLL) {
			Z.listvm.syncDataset();
		}
	}, // end refreshControl
		
	/**
	 * @protected
	 * 
	 * Run when container size changed, it's revoked by jslet.ui.resizeEventBus.
	 * 
	 */
	checkSizeChanged: function() {
		this.resize();
	},

	/**
	 * @override
	 */
	destroy: function($super) {
		var Z = this,
			jqEl = jQuery(Z.el);
		
		jslet.ui.resizeEventBus.unsubscribe(Z);
		jqEl.find('.jl-tree-nodes').off();
		Z.listvm.destroy();
		Z.listvm = null;
		Z.prevRow = null;
		
		$super();
	}
});

jslet.ui.htmlclass.TREELINECLASS = {
		line : 'jl-tree-unit jl-tree-lines jl-tree-line',// '|'
		join : 'jl-tree-unit jl-tree-lines jl-tree-join',// |-
		joinBottom : 'jl-tree-unit jl-tree-lines jl-tree-join-bottom',// |_
		minus : 'jl-tree-unit  jl-tree-expander jl-tree-lines jl-tree-minus',// O-
		minusBottom : 'jl-tree-unit jl-tree-expander jl-tree-lines jl-tree-minus-bottom',// o-_
		noLineMinus : 'jl-tree-unit  jl-tree-expander jl-tree-lines jl-tree-noline-minus',// o-
		plus : 'jl-tree-unit jl-tree-expander jl-tree-lines jl-tree-plus',// o+
		plusBottom : 'jl-tree-unit jl-tree-expander jl-tree-lines jl-tree-plus-bottom',// o+_
		noLinePlus : 'jl-tree-unit jl-tree-expander jl-tree-lines jl-tree-noline-plus',// o+
		empty : 'jl-tree-unit'
};
jslet.ui.htmlclass.TREECHECKBOXCLASS = {
	checked : 'jl-tree-unit jl-tree-checkbox jl-tree-checked',
	unChecked : 'jl-tree-unit jl-tree-checkbox jl-tree-unchecked',
	mixedChecked : 'jl-tree-unit jl-tree-checkbox jl-tree-mixedchecked'
};

jslet.ui.htmlclass.TREENODECLASS = {
	selected : 'jl-tree-selected',
	childChecked : 'jl-tree-child-checked',
	treeNodeLevel : 'jl-tree-child-level'
};

jslet.ui.DBTreeView.NODETYPE = 'data-nodetype';

jslet.ui.register('DBTreeView', jslet.ui.DBTreeView);
jslet.ui.DBTreeView.htmlTemplate = '<div></div>';



if(!jslet.ui.table) {
	jslet.ui.table = {};
}
jslet.ui.table.TableCellEditor = function(tableCtrl) { 
	var _tableCtrl = tableCtrl; 
	var _editPanel;
	var _currField;
	
	function _create() { 
		var html = '<div class="form-group form-group-sm jl-tbl-editpanel"><table class="jl-tbl-edittable"><tbody><tr class="jl-tbl-editrow">';
		var columns = _tableCtrl._sysColumns, colCfg,
			tblDataset = tableCtrl.dataset(),
			dsName = tblDataset.name(),
			left = 1, i, len;
			
		for(i = 0, len = columns.length; i < len; i++) {
			colCfg = columns[i];
			left += colCfg.width + 1;
		}
		columns = _tableCtrl.innerColumns;
		var tableId = tableCtrl.el.id,
			editorTabIndex = tableCtrl.editorTabIndex(),
			isBool, fldObj, fldName, dataType,
			alignStr = ';text-align: center',
			editableFields = tableCtrl.editableFields(),
			readOnlyFields = tableCtrl.readOnlyFields(),
			isManual;
		isManual = editableFields && editableFields.length > 0 || readOnlyFields && readOnlyFields.length > 0;
		for(i = 0, len = columns.length; i < len; i++) {
			colCfg = columns[i];
			fldName = colCfg.field;
			if(!fldName) {
				continue;
			}
			if(readOnlyFields && readOnlyFields.indexOf(fldName) >= 0) {
				continue;
			}
			if(editableFields && editableFields.indexOf(fldName) < 0) {
				continue;
			}
			fldObj = tblDataset.getField(fldName);
			dataType = fldObj.getType();
			if(dataType === jslet.data.DataType.ACTION || dataType === jslet.data.DataType.EDITACTION) {
				continue;
			}
			html += '<td class="jl-edtfld-' + fldName +  '" style="display:none;vertical-align: middle' + 
				(isBool? alignStr: '') + '">';
			if(isManual || !fldObj.fieldReadOnly() && !fldObj.fieldDisabled()) {
				var additionStr = '';
				if(colCfg.prefix) {
					additionStr = ', prefix: ' + jslet.JSON.stringify(colCfg.prefix);
				}
				if(colCfg.suffix) {
					additionStr += ', suffix: ' + jslet.JSON.stringify(colCfg.suffix);
				}
				isBool = (fldObj.dataType() === jslet.data.DataType.BOOLEAN);
				html += '<div data-jslet=\'type:"DBPlace",dataset:"' + dsName + 
					'",field:"' + fldName + 
					'", tableId: "' + tableId + 
					'", expandChildWidth: ' + (isBool? 'false': 'true') + 
					(editorTabIndex? ', tabIndex: ' + editorTabIndex: '') + 
					additionStr + 
					'\' class="' + colCfg.widthCssName + 
					(isBool? ' jl-tbl-check-col': '') + 
					'"></div>';
			}
			html += '</td>';
		}
		html += '</tr></tbody></table></div>';
		var jqPanel = jQuery(html);
		jqPanel.appendTo(jQuery(_tableCtrl.el));
		jqPanel.css('left', left + 'px');
		jslet.ui.install(jqPanel[0]);
		_editPanel = jqPanel;
		jqPanel.height(_tableCtrl.rowHeight());
		jqPanel.on('keydown', function(event) {
			var keyCode = event.which;
			//prevent to fire dbtable's ctrl+c
			if(event.ctrlKey && keyCode === jslet.ui.KeyCode.C) { //ctrl + c
	       		event.stopImmediatePropagation();
			}
		});
	}
	
	_create();
	
	this.showEditor = function(fldName, otd) {
		var dataset = _tableCtrl.dataset();
		if(dataset.recordCount() === 0) {
			return;
		}
		if(!fldName) {
			dataset.focusEditControl(_currField);
			return;
		}
		var fldObj = dataset.getField(fldName);
		if(!fldObj || fldObj.disabled() || fldObj.readOnly()) {
			this.hideEditor();
			return;
		}
		var jqTd = jQuery(otd),
			firstId = jqTd.attr('jsletFirstId'),
			cellPos;
		if(firstId) {
			var firstOffset = jQuery('#' + firstId).offset();
			var offsetHeight = parseFloat(jqTd.attr('jsletOffsetHeight'));
			cellPos = {left: firstOffset.left, top: firstOffset.top + offsetHeight};
		} else {
			cellPos = jqTd.offset();
		}
		_editPanel.show();
		if(_currField) {
			_editPanel.find('.jl-edtfld-' + _currField).hide();
		}
		var jqEditor = _editPanel.find('.jl-edtfld-' + fldName);
		_editPanel.offset(cellPos);
		jqEditor.show();
		dataset.focusEditControl(fldName);
		_currField = fldName;
	};
	
	this.currentField = function() {
		return _currField;
	};
	
	this.hideEditor = function() {
		_editPanel.hide();
		_tableCtrl.el.focus();
	};
	
	this.destroy = function() { 
		_tableCtrl = null; 
	};
};



if(!jslet.ui.table) {
	jslet.ui.table = {};
}

/**
 * @class
 * 
 * Cell render.
 */
jslet.ui.table.CellRender = jslet.Class.create({
	/**
	 * Create column header.
	 * 
	 * @param {HtmlElement} cellPanel Cell panel.
	 * @param {jslet.ui.table.TableColumn} colSetting Column settings.
	 */
	createHeader: function(cellPanel, colSetting) {
		
	},
	
	/**
	 * Create cell.
	 * 
	 * @param {HtmlElement} cellPanel Cell panel.
	 * @param {jslet.ui.table.TableColumn} colSetting Column settings.
	 */
	createCell: function(cellPanel, colCfg) {
	
	},
	
	/**
	 * Refresh cell content.
	 * 
	 * @param {HtmlElement} cellPanel Cell panel.
	 * @param {jslet.ui.table.TableColumn} colSetting Column settings.
	 * @param {Integer} recNo Record number.
	 */
	refreshCell: function(cellPanel, colCfg, recNo) {
	
	}
});

/**
 * @class
 * @extend jslet.ui.table.CellRender
 * 
 * Default cell render.
 */
jslet.ui.table.DefaultCellRender =  jslet.Class.create(jslet.ui.table.CellRender, {
	/**
	 * @override
	 */
	createCell: function(cellPanel, colCfg) {
		var Z = this,
			fldName = colCfg.field,
			fldObj = Z._dataset.getField(fldName);
		cellPanel.parentNode.style.textAlign = fldObj.alignment();
	},
								
	/**
	 * @override
	 */
	refreshCell: function(cellPanel, colCfg, recNo) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var Z = this,
			fldName = colCfg.field;
		if (!fldName) {
			return;
		}
		
		var fldObj = Z._dataset.getField(fldName), text;
		try {
			text = Z._dataset.getFieldTextByRecno(recNo, fldName);
		} catch (e) {
			text = 'error: ' + e.message;
			console.error(e);
		}
		
		if (fldObj.urlExpr()) {
			var url = '<a href=' + fldObj.calcUrl(),
				target = fldObj.urlTarget();
			if (target) {
				url += ' target=' + target;
			}
			url += '>' + text + '</a>';
			text = url;
		}
		if(text === '' || text === null || text === undefined) {
			text = '&nbsp;';
		}
		var jqCellPanel = jQuery(cellPanel); 
		jqCellPanel.html(text);
		cellPanel.title = jqCellPanel.text();
		Z._showSelected(cellPanel.parentNode, fldName, recNo);
	} 
});

/**
 * @class
 * @extend jslet.ui.table.CellRender
 * 
 * Sequence column cell render.
 */
jslet.ui.table.SequenceCellRender = jslet.Class.create(jslet.ui.table.CellRender, {
	/**
	 * @override
	 */
	createHeader: function(cellPanel, colCfg) {
		cellPanel.innerHTML = this._seqColHeader || '&nbsp;';
	},
	
	/**
	 * @override
	 */
	createCell: function(cellPanel, colCfg) {
		jQuery(cellPanel.parentNode).addClass('jl-tbl-sequence');
	},
	
	/**
	 * @override
	 */
	refreshCell: function(cellPanel, colCfg) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var jqDiv = jQuery(cellPanel), 
			text,
			recno = this.listvm.getCurrentRecno();
		if(this._reverseSeqCol) {
			text = this._dataset.recordCount() - recno;
		} else {
			text = recno + 1;
		}
		var title;
		if(this._dataset.existRecordError(recno)) {
			jqDiv.parent().addClass('has-error');
			title = this._dataset.getRecordErrorInfo(recno);
		} else {
			jqDiv.parent().removeClass('has-error');
			title = text;
		}
		
		cellPanel.title = title;
		jqDiv.html(text);
	}
});

/**
 * @class
 * @extend jslet.ui.table.CellRender
 * 
 * Select column cell render.
 */
jslet.ui.table.SelectCellRender = jslet.Class.create(jslet.ui.table.CellRender, {
	/**
	 * @override
	 */
	createHeader: function(cellPanel, colCfg) {
		cellPanel.style.textAlign = 'center';
		var ocheckbox = document.createElement('input');
		ocheckbox.type = 'checkbox';
		var Z = this;
		jQuery(ocheckbox).addClass('jl-tbl-select-check jl-tbl-select-all').on('click', function(event) {
			if(Z._beforeSelectAll) {
				Z._beforeSelectAll.call(Z);
			}
			Z._dataset.selectAll(this.checked ? 1 : 0, Z._onSelectAll);
			if(Z._afterSelectAll) {
				Z._afterSelectAll.call(Z);
			}
		});
		cellPanel.appendChild(ocheckbox);
	},
	
	/**
	 * @override
	 */
    createCell: function(cellPanel, colCfg) {
	    cellPanel.style.textAlign = 'center';
		var Z = this, 
		ocheck = document.createElement('input'),
		jqCheck = jQuery(ocheck);
		jqCheck.attr('type', 'checkbox').addClass('jl-tbl-select-check');
		jqCheck.click(Z._doSelectBoxClick);
		cellPanel.appendChild(ocheck);
	},

	/**
	 * @override
	 */
	refreshCell: function(cellPanel, colCfg, recNo) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var Z = this,
			ocheck = cellPanel.firstChild;
		if(Z._dataset.checkSelectable(recNo)) {
			ocheck.checked = Z._dataset.selectedByRecno(recNo);
			ocheck.style.display = '';
		} else {
			ocheck.style.display = 'none';
		}
	}
});

/**
 * @class
 * @extend jslet.ui.table.CellRender
 * 
 * Edit action column cell render.
 */
jslet.ui.table.EditActionCellRender = jslet.Class.create(jslet.ui.table.CellRender, {
	/**
	 * @override
	 */
	createHeader: function(cellPanel, colCfg) {
		cellPanel.style.textAlign = 'center';
		
		var Z = this,
			jqCell = jQuery(cellPanel);
		jqCell.html('<a class="jl-tbl-insert" href="javascript: void(0)" title="' + jsletlocale.DBTable.appendTip +
				'"><i class="fa fa-plus"></i></a>');
		jqCell.on('click', function(event) {
			window.setTimeout(function() {
				Z._doAppendRecord();
			}, 80);
		});
	},
	
	/**
	 * @override
	 */
    createCell: function(cellPanel, colCfg) {
	    cellPanel.style.textAlign = 'center';
		var Z = this,
			jqCell = jQuery(cellPanel);
		jqCell.html('<a class="jl-tbl-delete" href="javascript: void(0)" title="' + jsletlocale.DBTable.deleteTip +
				'"><i class="fa fa-minus"></i></a>');
		jqCell.on('click', function(event) {
			window.setTimeout(function() {
				Z._doDeleteRecord();
			}, 80);
		});
	}

});

jslet.ui.table.SubgroupCellRender = jslet.Class.create(jslet.ui.table.CellRender, {
	createCell: function(cellPanel, colCfg) {
		//TODO
	}
});

/**
 * @class
 * @extend jslet.ui.table.CellRender
 * 
 * Boolean column cell render.
 */
jslet.ui.table.BoolCellRender = jslet.Class.create(jslet.ui.table.DefaultCellRender, {
	createCell: function(cellPanel, colCfg) {
		var jqCell = jQuery(cellPanel);
		jqCell.css('textAlign', 'center');
		jqCell.html('<i class="fa fa-square-o" aria-hidden="true"></i>');
	},

	/**
	 * @override
	 */
	refreshCell: function(cellPanel, colCfg, recNo) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var jqCell = jQuery(cellPanel);
		var Z = this,
			fldName = colCfg.field, 
			fldObj = Z._dataset.getField(fldName);
		if (Z._dataset.getFieldValueByRecno(recNo, fldName)) {
			jqCell.find('.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square-o');
		}
		else {
			jqCell.find('.fa-check-square-o').removeClass('fa-check-square-o').addClass('fa-square-o');
		}
		Z._showSelected(cellPanel.parentNode, fldName, recNo);
	}
});

/**
 * @class
 * @extend jslet.ui.table.CellRender
 * 
 * Tree column cell render.
 */
jslet.ui.table.TreeCellRender = jslet.Class.create(jslet.ui.table.CellRender, {
	/**
	 * @override
	 */
	createCell: function(cellPanel, colCfg, recNo) {
		var Z = this;

		var odiv = document.createElement('div'),
			jqDiv = jQuery(odiv);
		odiv.style.height = Z.rowHeight() - 2 + 'px';
		jqDiv.html('<span class="jl-tbltree-indent"></span><a class="jl-tbltree-btn" href="javascript:void()"><i class="fa fa-minus-square-o" aria-hidden="true"></i></a>' + 
				'<span class="jl-tbltree-iconhost"></span><span class="jl-tbltree-text"></span>');
		
		cellPanel.appendChild(odiv);
	},
	
	/**
	 * @override
	 */
	refreshCell: function(cellPanel, colCfg, recNo) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var odiv = cellPanel.firstChild,
			jqDiv = jQuery(odiv),
			arrSpan = odiv.childNodes,
			Z = this,
			level = Z.listvm.getLevel(recNo);
		
		if (!jslet.ui.table.TreeCellRender.iconWidth) {
			jslet.ui.table.TreeCellRender.iconWidth = parseInt(jslet.ui.getCssValue('jl-tbltree-indent', 'width'));
		}
		var hasChildren = Z.listvm.hasChildren(recNo),
			indentWidth = (!hasChildren ? level + 1 : level) * jslet.ui.table.TreeCellRender.iconWidth;
		//Indent
		jqDiv.find('.jl-tbltree-indent').css('width', indentWidth + 'px');
		
		//Expand button
		var jqExpBtn = jqDiv.find('.jl-tbltree-btn'); //expand button
		jqExpBtn.css('display', hasChildren ? 'inline-block' : 'none');
		if (hasChildren) {
			var expanded = Z._dataset.expandedByRecno(recNo);
			if(expanded) {
				jqExpBtn.find('.fa-plus-square-o').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
			} else {
				jqExpBtn.find('.fa-minus-square-o').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
			}
		}
		//Icon
		if (colCfg.getIconClass) {
			var iconCls = colCfg.getIconClass(level, hasChildren);
			if (iconCls) {
				var jqIcon = jqDiv.find('.jl-tbltree-iconhost');
				jqIcon.addClass('jl-tbltree-icon ' + iconCls);
			}
		}
		
		//Text
		var fldName = colCfg.field, fldObj = Z._dataset.getField(fldName), text;
		try {
			text = Z._dataset.getFieldTextByRecno(recNo, fldName);
		} catch (e) {
			text = 'error: ' + e.message;
		}
		cellPanel.title = text;
		if (fldObj.urlExpr()) {
			var url = '<a href=' + fldObj.calcUrl();
			var target = fldObj.urlTarget();
			if (target) {
				url += ' target=' + target;
			}
			url += '>' + text + '</a>';
			text = url;
		}
		jqDiv.find('.jl-tbltree-text').html(text);
		Z._showSelected(cellPanel.parentNode, fldName, recNo);
	}
});


jslet.ui.table.cellRenders = {
	defaultCellRender: new jslet.ui.table.DefaultCellRender(),
	treeCellRender: new jslet.ui.table.TreeCellRender(),
	boolCellRender: new jslet.ui.table.BoolCellRender(),
	sequenceCellRender: new jslet.ui.table.SequenceCellRender(),
	selectCellRender: new jslet.ui.table.SelectCellRender(),
	editActionCellRender: new jslet.ui.table.EditActionCellRender(),
	subgroupCellRender: new jslet.ui.table.SubgroupCellRender()
};


jslet.ui.htmlclass.TABLECLASS = {
	currentrow: 'jl-tbl-current',
	scrollBarWidth: 16,
	selectColWidth: 30,
	hoverrow: 'jl-tbl-row-hover',
};

if(!jslet.ui.table) {
	jslet.ui.table = {};
}

/**
 * @class
 * 
 * Table column.
 */
jslet.ui.table.TableColumn = function() {
	var Z = this;
	
	/**
	 * @property {String} field Field name.
	 */
	Z.field = null;
	
	/**
	 * @property {String} label Column header label.
	 */
	Z.label = null;
	
	/**
	 * @property {String} title Column header title.
	 */
	Z.title = null;
	
	/**
	 * @property {jslet.ui.FieldControlAddon[]} prefix The prefix part of the field when editing.
	 */
	Z.prefix = null;
	
	/**
	 * @property {jslet.ui.FieldControlAddon[]} suffix The suffix part of the field when editing.
	 */
	Z.suffix = null;
	 
	/**
	 * @property {Integer} width Column display width.
	 */
	Z.width = null;   //Integer, column display width
	
	/**
	 * @property {Boolean} disableHeadSort True - user sort this column by click column header, false - otherwise.
	 */
	Z.disableHeadSort = false;
	
	/**
	 * @property {Boolean} disableFilter True - disable to show filter panel, false - otherwise.
	 */
	Z.disableFilter = false;

	/**
	 * @property {Boolean} mergeSame True - if this column value of adjoined rows is same then merge these rows, false - otherwise.
	 */
	Z.mergeSame = false;
	
	/**
	 * @property {Boolean} noRefresh True - do not refresh for customized column, false - otherwise.
	 */
	Z.noRefresh = false; //Boolean, true - do not refresh for customized column
	
	/**
	 * @property {Boolean} visible True - column is visible, false - otherwise.
	 */
	Z.visible = true;

	/**
	 * @property {jslet.ui.table.CellRender} cellRender Column cell render for customized column.
	 */
	Z.cellRender = null;  

	Z.colNum = null;  //Integer, column number
	Z.displayOrder = null; //Integer, display order
	Z.colSpan = null; //Integer, column span
};

/*
 * Sub group, use this class to implement complex requirement in one table row, like master-detail style row
 */
jslet.ui.table.TableSubgroup = function() {
var Z = this;
	Z.hasExpander = true; //Boolean, true - will add a new column automatically, click this column will expand or collapse subgroup panel
	Z.template = null;//String, html template 
	Z.height = 0; //Integer, subgroup panel height
};

/**
 * @class
 * 
 * Table column header, use this class to implement hierarchical header
 */
jslet.ui.table.TableHead = function() {
	var Z = this;
	
	/**
	 * @property {String} label Head label.
	 */
	Z.label = null;
	
	/**
	 * @property {String} title Head title.
	 */
	Z.title = null;
	
	/**
	 * @property {String} id Head id.
	 */
	Z.id = null;
	
	/**
	 * @property {Boolean} disableHeadSort True - user sort this column by click column header, false - otherwise.
	 */
	Z.disableHeadSort = false;
	
	/**
	 * @property {Boolean} disableFilter True - disable to show filter panel, false - otherwise.
	 */
	Z.disableFilter = false;

	/**
	 * @property {jslet.ui.table.TableHead[]} subHeads Sub heads.
	 */
	Z.subHeads = null;

	Z.rowSpan = 0;
	Z.colSpan = 0;
	
};

/**
 * @class
 * @extend jslet.ui.DBControl
 */
jslet.ui.AbstractDBTable = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function($super, el, params) {
		var Z = this;
		
		Z.allProperties = 'styleClass,dataset,fixedRows,fixedCols,hasSeqCol,hasSelectCol,reverseSeqCol,seqColHeader,noborder,readOnly,editable,hideHead,' + 
			'disableHeadSort,onlySpecifiedCol,disableMouseWheel,selectBy,rowHeight,footerRowHeight,onRowClick,onRowDblClick,onSelect,onSelectAll,' + 
			'beforeSelect,beforeSelectAll,afterSelect,afterSelectAll,onFillRow,onFillCell,treeField,columns,subgroup,aggregated,' + 
			'autoClearSelection,onCellClick,defaultCellRender,hasFindDialog,hasFilterDialog,autoStretch,minVisibleRows,maxVisibleRows' +
			'onAppendRecord,onDeleteRecord,editableFields,readOnlyFields,enableErrorFinding';
		
		Z._fixedRows = 0;

		Z._fixedCols = 0;

		Z._hasSeqCol = true;
		
		Z._reverseSeqCol = false;
	
		Z._seqColHeader = null;

		Z._hasSelectCol = false;
		
		Z._noborder = false;
		
		Z._editable = false;

		Z._hideHead = false;
		
		Z._onlySpecifiedCol = false;
		
		Z._disableHeadSort = false;
		
		Z._disableMouseWheel = false;
		
		Z._aggregated = true;
		
		Z._autoClearSelection = true;
		
		Z._selectBy = null;

		Z._rowHeight = null;

		Z._headRowHeight = null;

		Z._footerRowHeight = null;
		
		Z._treeField = null;

		Z._columns = null;
		
		Z._editableFields = null;
		
		Z._readOnlyFields = null;
		
		Z._onRowClick = null;

		Z._onRowDblClick = null;
		
		Z._onCellClick = null;
		
		Z._onSelect = null;

		Z._onSelectAll = null;
		
		Z._beforeSelect = null;
		
		Z._afterSelect = null;
		
		Z._beforeSelectAll = null;
		
		Z._afterSelectAll = null;
		
		Z._onFillRow = null;
		
		Z._onFillCell = null;		

		Z._onAppendRecord = null;

		Z._onDeleteRecord = null;
		
		Z._defaultCellRender = null;

		Z._hasFindDialog = true;
		
		Z._hasFilterDialog = true;
		
		Z._enableErrorFinding = false;
		
		Z._repairHeight = 0;
		Z.contentHeight = 0;
		Z.subgroup = null;//jslet.ui.table.TableSubgroup
		
		Z._sysColumns = null;//all system column like sequence column, select column, sub-group column
		Z._isHoriOverflow = false;
		Z._oldHeight = null;
		
		Z._currRow = null;
		Z._currColNum = 0;
		Z._editingField = null;
		Z._editorTabIndex = 1;
		Z._rowHeightChanged = false;
		Z._autoStretch = false;
		Z._minVisibleRows = 1;
		Z._maxVisibleRows = 0;
		Z._oldVisibleRows = -1;
		
		Z._cellEditor = null;
		
		$super(el, params);
	},
	
	/**
	 * @property
	 * 
	 * Set or get fixed rows.
	 * 
	 * @param {Integer | undefined} rows Fixed rows.
	 * 
	 * @return {this | Integer}
	 */
	fixedRows: function(rows) {
		if(rows === undefined) {
			return this._fixedRows;
		}
		jslet.Checker.test('DBTable.fixedRows', rows).isNumber();
		this._fixedRows = parseInt(rows);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get Fixed columns.
	 * 
	 * @param {Integer | undefined} cols Fixed columns.
	 * 
	 * @return {this | Integer}
	 */
	fixedCols: function(cols) {
		if(cols === undefined) {
			return this._fixedCols;
		}
		jslet.Checker.test('DBTable.fixedCols', cols).isNumber();
		this._fixedCols = parseInt(cols);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get row height of table row.
	 * 
	 * @param {Integer | undefined} rowHeight Table row height.
	 * 
	 * @return {this | Integer}
	 */
	rowHeight: function(rowHeight) {
		var Z = this;
		if(rowHeight === undefined) {
			if(Z._rowHeight === null) {
				var clsName = Z._editable? 'jl-tbl-editing-row': 'jl-tbl-row';
				Z._rowHeight = parseInt(jslet.ui.getCssValue(clsName, 'height')) || 25;
			}
			return Z._rowHeight;
		}
		jslet.Checker.test('DBTable.rowHeight', rowHeight).isGTZero();
		Z._rowHeight = parseInt(rowHeight);
		Z._rowHeightChanged = true;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get row height of table header.
	 * 
	 * @param {Integer | undefined} headRowHeight Table header row height.
	 * 
	 * @return {this | Integer}
	 */
	headRowHeight: function(headRowHeight) {
		if(headRowHeight === undefined) {
			if(this._headRowHeight === null) {
				this._headRowHeight = parseInt(jslet.ui.getCssValue('jl-tbl-header-row', 'height')) || 25;
			}
			return this._headRowHeight;
		}
		jslet.Checker.test('DBTable.headRowHeight', headRowHeight).isGTZero();
		this._headRowHeight = parseInt(headRowHeight);
		return this;
	},
	/**
	 * @property
	 * 
	 * Set or get row height of table footer.
	 * 
	 * @param {Integer | undefined} footerRowHeight Table footer row height.
	 * 
	 * @return {this | Integer}
	 */
	footerRowHeight: function(footerRowHeight) {
		if(footerRowHeight === undefined) {
			if(this._footerRowHeight === null) {
				this._footerRowHeight = parseInt(jslet.ui.getCssValue('jl-tbl-footer-row', 'height')) || 20;
			}
			return this._footerRowHeight;
		}
		jslet.Checker.test('DBTable.footerRowHeight', footerRowHeight).isGTZero();
		this._footerRowHeight = parseInt(footerRowHeight);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether there is sequence column in DBTable.
	 * 
	 * @param {Boolean | undefined} hasSeqCol True(default) - exists sequence column, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasSeqCol: function(hasSeqCol) {
		if(hasSeqCol === undefined) {
			return this._hasSeqCol;
		}
		this._hasSeqCol = hasSeqCol ? true: false;
		return this;
	},

	/**
	 * @property
	 * 
	 * Identify whether the sequence number is reverse.
	 * 
	 * @param {Boolean | undefined} reverseSeqCol True - the sequence number is reverse, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	reverseSeqCol: function(reverseSeqCol) {
		if(reverseSeqCol === undefined) {
			return this._reverseSeqCol;
		}
		this._reverseSeqCol = reverseSeqCol ? true: false;
		return this;
	},
		
	/**
	 * @property
	 * 
	 * Set or get sequence column header.
	 * 
	 * @param {String | undefined} seqColHeader Sequence column header.
	 * 
	 * @return {this | String}
	 */
	seqColHeader: function(seqColHeader) {
		if(seqColHeader === undefined) {
			return this._seqColHeader;
		}
		this._seqColHeader = seqColHeader;
		return this;
	},
		
	/**
	 * @property
	 * 
	 * Identify whether there is "select" column in DBTable.
	 * 
	 * @param {Boolean | undefined} hasSelectCol True(default) - has "select" column, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasSelectCol: function(hasSelectCol) {
		if(hasSelectCol === undefined) {
			return this._hasSelectCol;
		}
		this._hasSelectCol = hasSelectCol ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify the table has border or not.
	 * 
	 * @param {Boolean | undefined} noborder True - the table without border, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	noborder: function(noborder) {
		if(noborder === undefined) {
			return this._noborder;
		}
		this._noborder = noborder ? true: false;
		return this;
	},
	
	/**
	 * @deprecated
	 * Use editable instead.
	 * 
	 * Identify the table is read only or not.
	 * 
	 * @param {Boolean | undefined} readOnly True(default) - the table is read only, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	readOnly: function(readOnly) {
		var Z = this;
		if(readOnly === undefined) {
			return !Z._editable;
		}
		Z.editable(!readOnly);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify the table is editable or not.
	 * 
	 * @param {Boolean | undefined} editable True(default) - the table is editable, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	editable: function(editable) {
		var Z = this;
		if(editable === undefined) {
			return Z._editable;
		}
		Z._editable = editable ? true: false;
		if(Z._editable && !Z._rowHeightChanged) {
			Z._rowHeight = null;
		}
		return this;
	},
	
	
	/**
	 * @property
	 * 
	 * Identify the table header is hidden or not.
	 * 
	 * @param {Boolean | undefined} hideHead True - the table header is hidden, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hideHead: function(hideHead) {
		if(hideHead === undefined) {
			return this._hideHead;
		}
		this._hideHead = hideHead ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify the table has aggregated row or not.
	 * 
	 * @param {Boolean | undefined} aggregated True - the table has aggregated row, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	aggregated: function(aggregated) {
		if(aggregated === undefined) {
			return this._aggregated;
		}
		this._aggregated = aggregated ? true: false;
		return this;
	},

	/**
	 * @property
	 * 
	 * Identify whether automatically clear selection when selecting table cells.
	 * 
	 * @param {Boolean | undefined} autoClearSelection True(default) - automatically clear selection, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	autoClearSelection: function(autoClearSelection) {
		if(autoClearSelection === undefined) {
			return this._autoClearSelection;
		}
		this._autoClearSelection = autoClearSelection ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify disable table head sorting or not.
	 * 
	 * @param {Boolean | undefined} disableHeadSort True - disable table header sorting, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	disableHeadSort: function(disableHeadSort) {
		if(disableHeadSort === undefined) {
			return this._disableHeadSort;
		}
		this._disableHeadSort = disableHeadSort ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Disable to use mouse wheel to scroll rows or not.
	 * 
	 * @param {Boolean | undefined} disableMouseWheel True - disable to use mouse wheel to scroll rows, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	disableMouseWheel: function(disableMouseWheel) {
		if(disableMouseWheel === undefined) {
			return this._disableMouseWheel;
		}
		this._disableMouseWheel = disableMouseWheel ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether showing the specified columns or not.
	 * 
	 * @param {Boolean | undefined} onlySpecifiedCol True - only showing the specified columns, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	onlySpecifiedCol: function(onlySpecifiedCol) {
		if(onlySpecifiedCol === undefined) {
			return this._onlySpecifiedCol;
		}
		this._onlySpecifiedCol = onlySpecifiedCol ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Specified field names for selecting group records, multiple field names are separated with ','.<br />
	 * See jslet.data.Dataset.select(selected, selectBy). Example:
	 * 
	 *     @example
	 *     tblObj.selectBy('code,gender');
	 * 
	 * @param {String | undefined} selectBy group selecting field names.
	 * 
	 * @return {this | String}
	 */
	selectBy: function(selectBy) {
		if(selectBy === undefined) {
			return this._selectBy;
		}
		jslet.Checker.test('DBTable.selectBy', selectBy).isString();
		this._selectBy = selectBy;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Display table as tree style. If this property is set, the dataset must be a tree style dataset, 
	 *  means dataset.parentField() and dataset.levelField() can not be empty.<br />
	 * Only one field name allowed. Example:
	 * 
	 *     @example
	 *     tblObj.treeField('code');
	 * 
	 * @param {String | undefined} treeField the field name which will show as tree style.
	 * 
	 * @return {this | String}
	 */
	treeField: function(treeField) {
		if(treeField === undefined) {
			return this._treeField;
		}
		jslet.Checker.test('DBTable.treeField', treeField).isString();
		this._treeField = treeField;
		return this;
	},

	/**
	 * @property
	 * 
	 * Default cell render, it must be a child class of jslet.ui.table.CellRender. Example:
	 * 
	 *     @example
	 * 	   var cellRender = jslet.Class.create(jslet.ui.table.CellRender, {
	 *	     createHeader: function(cellPanel, colCfg) { },
	 *	     createCell: function(cellPanel, colCfg) { },
	 *	     refreshCell: function(cellPanel, colCfg, recNo) { }
	 *     });
	 * 
	 * @param {jslet.ui.table.CellRender} defaultCellRender Default cell render.
	 * 
	 * @return {this | jslet.ui.table.CellRender}
	 * 
	 */
	defaultCellRender: function(defaultCellRender) {
		if(defaultCellRender === undefined) {
			return this._defaultCellRender;
		}
		jslet.Checker.test('DBTable.defaultCellRender', defaultCellRender).isObject();
		
		this._defaultCellRender = defaultCellRender;
		return this;
	},
	
	currColNum: function(currColNum) {
		var Z = this;
		if(currColNum === undefined) {
			return Z._currColNum;
		}
		var oldColNum = Z._currColNum;
		Z._currColNum = currColNum;
		if(oldColNum !== currColNum) {
			Z._adjustCurrentCellPos(oldColNum > currColNum);
			Z._showCurrentCell();
		}
		if(Z._findDialog) {
			var colCfg = Z.innerColumns[currColNum];
			if(colCfg.field) {
				Z._findDialog.findingField(colCfg.field);
			}
		}
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when table row clicked. Example:
	 * 
	 *     @example
	 *     tblObj.onRowClick(function(otr) {});
	 *     
	 * @param {Function | undefined} onRowClick Table row clicked event handler.
	 * @param {HtmlElement} onRowClick.trElement Table row element.
	 * 
	 * @return {this | Function}
	 */
	onRowClick: function(onRowClick) {
		if(onRowClick === undefined) {
			return this._onRowClick;
		}
		jslet.Checker.test('DBTable.onRowClick', onRowClick).isFunction();
		this._onRowClick = onRowClick;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when table row double clicked. Example:
	 * 
	 *     @example
	 *     tblObj.onRowDblClick(function(otr) {});
	 *     
	 * @param {Function | undefined} onRowDblClick Table row double clicked event handler.
	 * @param {HtmlElement} onRowDblClick.trElement Table row element.
	 * 
	 * @return {this | Function}
	 */
	onRowDblClick: function(onRowDblClick) {
		if(onRowDblClick === undefined) {
			return this._onRowDblClick;
		}
		jslet.Checker.test('DBTable.onRowDblClick', onRowDblClick).isFunction();
		this._onRowDblClick = onRowDblClick;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when table cell clicked. Example:
	 * 
	 *     @example
	 *     tblObj.onCellClick(function(otd) {});
	 *     
	 * @param {Function | undefined} onCellClick Table cell clicked event handler.
	 * @param {HtmlElement} onCellClick.tdElement Table cell element.
	 * 
	 * @return {this | Function}
	 */
	onCellClick: function(onCellClick) {
		if(onCellClick === undefined) {
			return this._onCellClick;
		}
		jslet.Checker.test('DBTable.onCellClick', onCellClick).isFunction();
		this._onCellClick = onCellClick;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when table row is selected(select column is checked). Example:
	 * 
	 *     @example
	 *     tblObj.onSelect(function(checked) {});
	 *     
	 * @param {Function | undefined} onSelect Table row selected event handler.
	 * @param {Boolean} onSelect.checked True - table row is selected, false - otherwise.
	 * 
	 * @return {this | Function}
	 */
	onSelect: function(onSelect) {
		if(onSelect === undefined) {
			return this._onSelect;
		}
		jslet.Checker.test('DBTable.onSelect', onSelect).isFunction();
		this._onSelect = onSelect;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when all table rows are selected. Example:
	 * 
	 *     @example
	 *     tblObj.onSelectAll(function(dataset, checked) {});
	 *     
	 * @param {Function | undefined} onSelectAll All Table row selected event handler.
	 * @param {jslet.data.Dataset} onSelectAll.dataset The current dataset object.
	 * @param {Boolean} onSelectAll.checked True - all rows selected, false - otherwise.
	 * 
	 * @return {this | Function}
	 */
	onSelectAll: function(onSelectAll) {
		if(onSelectAll === undefined) {
			return this._onSelectAll;
		}
		jslet.Checker.test('DBTable.onSelectAll', onSelectAll).isFunction();
		this._onSelectAll = onSelectAll;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired before table row is selected(select column is checked). Example:
	 * 
	 *     @example
	 *     tblObj.beforeSelect(function(selected) {
	 *       return true;
	 *     });
	 *     
	 * @param {Function | undefined} beforeSelect Table row selecting event handler.
	 * @param {Boolean} beforeSelect.selected True - table row is selected, false - otherwise.
	 * @param {Boolean} beforeSelect.return True - table row is allowed to select, false - otherwise.
	 * 
	 * @return {this | Function}
	 */
	beforeSelect: function(beforeSelect) {
		if(beforeSelect === undefined) {
			return this._beforeSelect;
		}
		jslet.Checker.test('DBTable.beforeSelect', beforeSelect).isFunction();
		this._beforeSelect = beforeSelect;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired after table row is selected(select column is checked). Example:
	 * 
	 *     @example
	 *     tblObj.afterSelect(function() {});
	 *     
	 * @param {Function | undefined} afterSelect Table row after selected event handler.
	 * 
	 * @return {this | Function}
	 */
	afterSelect: function(afterSelect) {
		if(afterSelect === undefined) {
			return this._afterSelect;
		}
		jslet.Checker.test('DBTable.afterSelect', afterSelect).isFunction();
		this._afterSelect = afterSelect;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired before all table rows are selected(select column is checked). Example:
	 * 
	 *     @example
	 *     tblObj.beforeSelectAll(function(selected) {
	 *       return true;
	 *     });
	 *     
	 * @param {Function | undefined} beforeSelectAll All table rows are being selected event handler.
	 * @param {Boolean} beforeSelectAll.selected True - all table rows are selected, false - otherwise.
	 * @param {Boolean} beforeSelectAll.return True - all table rows are allowed to select, false - otherwise.
	 * 
	 * @return {this | Function}
	 */
	beforeSelectAll: function(beforeSelectAll) {
		if(beforeSelectAll === undefined) {
			return this._beforeSelectAll;
		}
		jslet.Checker.test('DBTable.beforeSelectAll', beforeSelectAll).isFunction();
		this._beforeSelectAll = beforeSelectAll;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired after all table rows are selected(select column is checked). Example:
	 * 
	 *     @example
	 *     tblObj.afterSelectAll(function() {});
	 *     
	 * @param {Function | undefined} afterSelectAll Event handler for "after all table rows are selected".
	 * 
	 * @return {this | Function}
	 */
	afterSelectAll: function(afterSelectAll) {
		if(afterSelectAll === undefined) {
			return this._afterSelectAll;
		}
		jslet.Checker.test('DBTable.afterSelectAll', afterSelectAll).isFunction();
		this._afterSelectAll = afterSelectAll;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when fill row, user can use this to customize each row style like background color, font color. Example:
	 * 
	 *     @example
	 *     tblObj.onFillRow(function(trEle, dsObj) {});
	 *   
	 * @param {Function | undefined} onFillRow Table row filled event handler.
	 * @param {HtmlElement} onFillRow.trElement Table row element.
	 * @param {jslet.data.Dataset} onFillRow.dataset Current dataset object.
	 * 
	 * @return {this | Function}
	 */
	onFillRow: function(onFillRow) {
		if(onFillRow === undefined) {
			return this._onFillRow;
		}
		jslet.Checker.test('DBTable.onFillRow', onFillRow).isFunction();
		this._onFillRow = onFillRow;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when fill cell, user can use this to customize each cell style like background color, font color. Example:
	 * 
	 *     @example
	 *     tblObj.onFillRow(function(trEle, dsObj, fldName) {});
	 * 
	 * @param {Function | undefined} onFillCell Table cell filled event handler.
	 * @param {HtmlElement} onFillCell.tdElement Table cell element.
	 * @param {jslet.data.Dataset} onFillCell.dataset Current dataset object.
	 * @param {String} onFillCell.fieldName Field name.
	 * 
	 * @return {this | Function}
	 */
	onFillCell: function(onFillCell) {
		if(onFillCell === undefined) {
			return this._onFillCell;
		}
		jslet.Checker.test('DBTable.onFillCell', onFillCell).isFunction();
		this._onFillCell = onFillCell;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when user click the '+' button of the 'Edit' column. Example:
	 * 
	 *     @example
	 *     tblObj.onAppendRecord(function() {
	 *        this.dataset().appendRecord();
	 *     });
	 * 
	 * @param {Function | undefined} onAppendRecord '+’ button event handler.
	 * 
	 * @return {this | Function}
	 */
	onAppendRecord: function(onAppendRecord) {
		if(onAppendRecord === undefined) {
			return this._onAppendRecord;
		}
		jslet.Checker.test('DBTable.onAppendRecord', onAppendRecord).isFunction();
		this._onAppendRecord = onAppendRecord;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when user click the '-' button of the 'Edit' column. Example:
	 * 
	 *     @example
	 *     tblObj.onDeleteRecord(function() {
	 *        this.dataset().deleteRecord();
	 *     });
	 * 
	 * @param {Function | undefined} onDeleteRecord '-’ button event handler.
	 * 
	 * @return {this | Function}
	 */
	onDeleteRecord: function(onDeleteRecord) {
		if(onDeleteRecord === undefined) {
			return this._onDeleteRecord;
		}
		jslet.Checker.test('DBTable.onDeleteRecord', onDeleteRecord).isFunction();
		this._onDeleteRecord = onDeleteRecord;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify the table has finding dialog or not.
	 * 
	 * @param {Boolean | undefined} hasFindDialog true(default) - show finding dialog when press 'Ctrl + F', false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasFindDialog: function(hasFindDialog) {
		var Z = this;
		if(hasFindDialog === undefined) {
			return Z._hasFindDialog;
		}
		Z._hasFindDialog = hasFindDialog? true: false;
		return this;
	},

	/**
	 * @property
	 * 
	 * Identify the table has filter dialog or not.
	 * 
	 * @param {Boolean | undefined} hasFilterDialog true(default) - show filter dialog when creating table, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasFilterDialog: function(hasFilterDialog) {
		var Z = this;
		if(hasFilterDialog === undefined) {
			return Z._hasFilterDialog;
		}
		Z._hasFilterDialog = hasFilterDialog? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether it's showing the 'Error find' menu item in the context menu.
	 * 
	 * @param {Boolean | undefined} enableErrorFinding True - show error find menu item in the context menu, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	enableErrorFinding: function(enableErrorFinding) {
		if(enableErrorFinding === undefined) {
			return this._enableErrorFinding;
		}
		this._enableErrorFinding = enableErrorFinding ? true: false;
		return this;
	},
		
	/**
	 * @property
	 * 
	 * Identify whether the table height is stretched automatically according to the dataset's records.
	 * 
	 * @param {Boolean | undefined} autoStretch True - The table height is stretched automatically, false(default) - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	autoStretch: function(autoStretch) {
		var Z = this;
		if(autoStretch === undefined) {
			return Z._autoStretch;
		}
		Z._autoStretch = autoStretch? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the minimum visible rows of the table.
	 * 
	 * @param {Integer | undefined} minVisibleRows Minimum visible rows.
	 * 
	 * @return {this | Integer}
	 */
	minVisibleRows: function(minVisibleRows) {
		if(minVisibleRows === undefined) {
			return this._minVisibleRows;
		}
		jslet.Checker.test('DBTable.minVisibleRows', minVisibleRows).isGTZero();
		this._minVisibleRows = parseInt(minVisibleRows);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the minimum visible rows of the table.
	 * 
	 * @param {Integer | undefined} maxVisibleRows Minimum visible rows.
	 * 
	 * @return {this | Integer}
	 */
	maxVisibleRows: function(maxVisibleRows) {
		if(maxVisibleRows === undefined) {
			return this._maxVisibleRows;
		}
		jslet.Checker.test('DBTable.maxVisibleRows', maxVisibleRows).isNumber();
		this._maxVisibleRows = parseInt(maxVisibleRows);
		return this;
	},
		
	cellEditor: function() {
		var Z = this;
		if(!Z._editable) {
			return null;
		}
		if(!Z._cellEditor) {
			Z._cellEditor = new jslet.ui.table.TableCellEditor(Z);
		}
		return Z._cellEditor;
	},

	/**
	 * @property
	 * 
	 * Table columns configurations, array of jslet.ui.table.TableColumn.
	 * 
	 * @param {jslet.ui.table.TableColumn[] | undefined} columns Table columns configurations.
	 * 
	 * @return {this | jslet.ui.table.TableColumn[]}
	 */
	columns: function(columns) {
		if(columns === undefined) {
			return this._columns;
		}
		jslet.Checker.test('DBTable.columns', columns).isArray();
		var colObj;
		for(var i = 0, len = columns.length; i < len; i++) {
			colObj = columns[i];
			jslet.Checker.test('DBTable.Column.field', colObj.field).isString();
			jslet.Checker.test('DBTable.Column.label', colObj.label).isString();
			jslet.Checker.test('DBTable.Column.colNum', colObj.colNum).isGTEZero();
			jslet.Checker.test('DBTable.Column.displayOrder', colObj.displayOrder).isNumber();
			jslet.Checker.test('DBTable.Column.width', colObj.width).isGTZero();
			jslet.Checker.test('DBTable.Column.colSpan', colObj.colSpan).isGTZero();
			jslet.Checker.test('DBTable.Column.prefix', colObj.prefix).isArray();
			jslet.Checker.test('DBTable.Column.suffix', colObj.suffix).isArray();
			if(!colObj.field) {
				colObj.disableHeadSort = true;
				colObj.disableFilter = true;
			} else {
				colObj.disableHeadSort = colObj.disableHeadSort ? true: false;
				colObj.disableFilter = colObj.disableFilter ? true: false;
			}
			colObj.mergeSame = colObj.mergeSame ? true: false;
			colObj.noRefresh = colObj.noRefresh ? true: false;
			jslet.Checker.test('DBTable.Column.cellRender', colObj.cellRender).isObject();
		}
		this._columns = columns;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get editable fields when DBTable is in editable. It is contrast to 'readOnlyFields'.<br />
	 * If the read only columns' count is greater than editable fields, use 'readOnlyFields' instead. <br />
	 * If 'editableFields' and 'readOnlyFields' are not specified, editable fields comes from jslet.data.Field object.
	 * 
	 * @param {String[] | String | undefined} editableFields Editable fields.
	 * 
	 * @return {this | String[]}
	 */
	editableFields: function(editableFields) {
		if(editableFields === undefined) {
			return this._editableFields;
		}
		if(jslet.isString(editableFields)) {
			editableFields = editableFields.split(',');
		} else {
			jslet.Checker.test('DBTable.editableFields', editableFields).isArray();
		}
		for(var i = 0, len = editableFields.length; i < len; i++) {
			jslet.Checker.test('DBTable.editableFields#fieldName', editableFields[i]).required().isString();
			editableFields[i] = editableFields[i].trim();
		}
		this._editableFields = editableFields;
	},
	
	/**
	 * @property
	 * 
	 * Set or get read only fields when DBTable is in editable. It is contrast to 'editableFields'.<br />
	 * If the editable columns' count is greater than read only fields, use 'editableFields' instead. <br />
	 * If 'editableFields' and 'readOnlyFields' are not specified, editable fields comes from jslet.data.Field object.
	 * 
	 * @param {String[] | String | undefined} readOnlyFields Read only fields.
	 * 
	 * @return {this | String[]}
	 */
	readOnlyFields: function(readOnlyFields) {
		if(readOnlyFields === undefined) {
			return this._readOnlyFields;
		}
		if(jslet.isString(readOnlyFields)) {
			readOnlyFields = readOnlyFields.split(',');
		} else {
			jslet.Checker.test('DBTable.readOnlyFields', readOnlyFields).isArray();
		}
		for(var i = 0, len = readOnlyFields.length; i < len; i++) {
			jslet.Checker.test('DBTable.readOnlyFields#fieldName', readOnlyFields[i]).required().isString();
			readOnlyFields[i] = readOnlyFields[i].trim();
		}
		this._readOnlyFields = readOnlyFields;
	},
	
	/**
	 * Goto and show the specified cell by field name.
	 * 
	 * @param {String} fldName field name.
	 */
	gotoField: function(fldName) {
		jslet.Checker.test('DBTable.gotoField#fldName', fldName).required().isString();
		var colNum = this.getColNumByField(fldName);
		if(colNum >= 0) {
			this.gotoColumn(colNum);
		}
	},
	
	/**
	 * Get column number with field name.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return {Integer} Column number.
	 */
	getColNumByField: function(fldName) {
		var lastColNum = this.innerColumns.length - 1,
			colCfg;
		for(var i = 0; i <= lastColNum; i++) {
			colCfg = this.innerColumns[i];
			if(colCfg.field == fldName) {
				return colCfg.colNum;
			}
		}
		return -1;
	},
	
	/**
	 * Get field name with column number.
	 * 
	 * @param {Integer} colNum Column number.
	 * 
	 * @return {String} Field name.
	 */
	getFieldByColNum: function(colNum) {
		var lastColNum = this.innerColumns.length - 1,
			colCfg;
		for(var i = 0; i <= lastColNum; i++) {
			colCfg = this.innerColumns[i];
			if(colCfg.colNum == colNum) {
				return colCfg.field;
			}
		}
		return null;
	},
	
	/**
	 * Goto and show the specified cell by field name.
	 * 
	 * @param {String} fldName field name.
	 */
	gotoColumn: function(colNum) {
		jslet.Checker.test('DBTable.gotoColumn#colNum', colNum).required().isGTEZero();
		var lastColNum = this.innerColumns.length - 1;
		if(colNum > lastColNum) {
			colNum = lastColNum;
		}
		this.currColNum(colNum);
	},
	
	editorTabIndex: function() {
		return this._editorTabIndex;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function(el) {
		return el.tagName.toLowerCase() == 'div';
	},
	
	_calcTabIndex: function() {
		var Z = this,
			jqEl = jQuery(Z.el);
		if(Z._editable) {
			var masterFldObj = Z._dataset.getMasterFieldObject(),
				tbIdx = null;
			if(masterFldObj) {
				tbIdx = masterFldObj.tabIndex();
			}
			if(!tbIdx) {
				tbIdx = Z.el.tabIndex;
			}
			Z._editorTabIndex = tbIdx && tbIdx > 0? tbIdx: null;
		}
		Z.el.tabIndex = -1;
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function() {
		var Z = this;
		jslet.ui.resizeEventBus.subscribe(Z);
		
		jslet.ui.textMeasurer.setElement(Z.el);
		Z.charHeight = jslet.ui.textMeasurer.getHeight('M')+4;
		jslet.ui.textMeasurer.setElement();
		Z.charWidth = jslet.global.defaultCharWidth || 12;
		Z._widthStyleId = jslet.nextId();
		Z._initializeVm();
		Z._calcTabIndex();
		Z.renderAll();
		Z._bindEvents();
	}, // end bind
	
	_bindEvents: function() {
		var Z = this;
		var jqEl = jQuery(Z.el);
        var notFF = ((typeof Z.el.onmousewheel) == 'object'); //firefox or nonFirefox browser
        var wheelEvent = (notFF ? 'mousewheel' : 'DOMMouseScroll');
        jqEl.on(wheelEvent, function(event) {
        	if(Z._disableMouseWheel) {
        		return;
        	}
        	
            var originalEvent = event.originalEvent;
            var num = notFF ? originalEvent.wheelDelta / -120 : originalEvent.detail / 3;
			if(Z._editable && Z._dataset.status() != jslet.data.DataSetStatus.BROWSE) {
				Z._dataset.confirm();
			}
            Z.listvm.setVisibleStartRow(Z.listvm.getVisibleStartRow() + num);
			var cellEditor = Z.cellEditor();
			if(cellEditor) {
				cellEditor.hideEditor();
			}
       		event.preventDefault();
        });

        jqEl.on('mousedown', function(event) {
        	if(event.shiftKey) {
	       		event.preventDefault();
	       		event.stopImmediatePropagation();
	       		return false;
        	}
        });
        
        jqEl.on('click', 'button.jl-tbl-filter', function(event) {
    		if (!Z._filterPanel) {
    			Z._filterPanel = new jslet.ui.table.DBTableFilterPanel(Z);
    		}
    		var btnEle = event.currentTarget,
    			jqFilterBtn = jQuery(btnEle),
    			tblPos = jQuery(Z.el).offset();
    		var r = jqFilterBtn.offset(), 
    			h = jqFilterBtn.outerHeight(), 
    			x = r.left - tblPos.left, 
    			y = r.top + h - tblPos.top;
    		if (jsletlocale.isRtl) {
    			x = x + jqFilterBtn.outerWidth();
    		}
    		var fldName = jqFilterBtn[0].getAttribute('jsletfilterfield');
    		Z._filterPanel.changeField(fldName);
    		Z._filterPanel.jqFilterBtn(jqFilterBtn);
    		Z._filterPanel.show(x, y, 0, h);
        	
       		event.preventDefault();
       		event.stopImmediatePropagation();
        });
        jqEl.on('dblclick', 'td.jl-tbl-cell', function(event) {
        	var otd = event.currentTarget;
        	Z._doDblCellClick(otd, event.offsetY);
        });
        
        jqEl.on('mousedown', 'td.jl-tbl-cell', function(event) {
        	var otd = event.currentTarget;
        	var offsetY = event.offsetY;
        	if(event.target != otd) {
        		offsetY = jQuery(event.target).offset().top - jQuery(otd).offset().top + event.offsetY;
        	}
        	Z._doCellClick(otd, offsetY, event);
        	
        	if(event.shiftKey || event.ctrlKey) {
	       		event.preventDefault();
	       		event.stopImmediatePropagation();
	       		return false;
        	}
        });

        jqEl.on('click', '.jl-tbltree-btn', function(event) {
        	function checkFn(node) {
				return node.tagName && node.tagName.toLowerCase() == 'tr' && (node.jsletrecno || node.jsletrecno === 0);
			}
			
			function callBackFn() {
				Z._fillData();
			}
			
			var otr = jslet.ui.findFirstParent(this, checkFn);
					
			event.stopImmediatePropagation();
			event.preventDefault();
			var recNo = otr.jsletrecno;
			Z._dataset.recno(recNo);
			if(Z._dataset.aborted()) {
				return false;
			}
			
			if (Z._dataset.expandedByRecno(recNo)) {
				Z.listvm.collapse(callBackFn);
			} else {
				Z.listvm.expand(callBackFn);
			}
			return false;
        });
        
		jqEl.on('keydown', function(event) {
			var keyCode = event.which,
				ctrlKey = event.ctrlKey,
				shiftKey = event.shiftKey,
				altKey = event.altKey;
			if(ctrlKey) {
				var flag = false;
				if(Z._hasFindDialog && keyCode === jslet.ui.KeyCode.F) { //ctrl + f
					Z.showFindDialog();
					flag = true;
				}
				if(keyCode === jslet.ui.KeyCode.E && (Z._enableErrorFinding || Z._editable)) { //ctrl + e
					Z.gotoNextError();
					flag = true;
				}
				if(keyCode === jslet.ui.KeyCode.A) { //ctrl + a
					Z.selectAllCells();
					flag = true;
				}
				if(keyCode === jslet.ui.KeyCode.HOME) { //ctrl + Home
					Z._dataset.first();
					flag = true;
				}
				if(keyCode === jslet.ui.KeyCode.END) { //ctrl + End
					Z._dataset.last();
					flag = true;
				}
				if(keyCode === jslet.ui.KeyCode.C) { //ctrl + c
					Z.copySelection(false);
					return;
				}
				if(flag) {
					event.preventDefault();
		       		event.stopImmediatePropagation();
					return false;
				}
			}
			var isTabKey = (keyCode === jslet.ui.KeyCode.TAB || keyCode === jslet.global.defaultFocusKeyCode);
			if(shiftKey && isTabKey) { //Shift TAB Left
				if(!Z.tabPrior()) {
					return;
				}
			} else if(isTabKey) { //TAB Right
				if(!Z.tabNext()) {
					return;
				}
			} else if(keyCode === jslet.ui.KeyCode.LEFT) { //Arrow Left
				Z.movePriorCell(ctrlKey, shiftKey, altKey);
			} else if( keyCode === jslet.ui.KeyCode.RIGHT) { //Arrow Right
				Z.moveNextCell(ctrlKey, shiftKey, altKey);
			} else if (keyCode === jslet.ui.KeyCode.UP) {//KEY_UP
				Z._doBeforeSelect(ctrlKey, shiftKey, altKey);
				Z.listvm.priorRow();
				Z._processSelection(ctrlKey, shiftKey, altKey);
			} else if (keyCode === jslet.ui.KeyCode.DOWN) {//KEY_DOWN
				Z._doBeforeSelect(ctrlKey, shiftKey, altKey);
				Z.listvm.nextRow();
				Z._processSelection(ctrlKey, shiftKey, altKey);
			} else if (keyCode === jslet.ui.KeyCode.PAGEUP) {//KEY_PAGEUP
				Z.listvm.priorPage();
			} else if (keyCode === jslet.ui.KeyCode.PAGEDOWN) {//KEY_PAGEDOWN
				Z.listvm.nextPage();
			} else {
				return;
			}
			if(keyCode === jslet.ui.KeyCode.ENTER && !Z._editable) {
				return;
			}
			event.preventDefault();
       		event.stopImmediatePropagation();
		});		
		Z._createContextMenu();
	},
	
	_createContextMenu: function() {
		if (!jslet.ui.Menu) {
			return;
		}
		var Z = this;
		var menuCfg = {type: 'Menu', onItemClick: jQuery.proxy(Z._menuItemClick, Z), items: []};
		menuCfg.items.push({id: 'selectAll', name: jsletlocale.DBTable.selectAll});
		menuCfg.items.push({id: 'copy', name: jsletlocale.DBTable.copy});
		menuCfg.items.push({name: '-'});
		if(Z._hasFindDialog) {
			menuCfg.items.push({id: 'find', name: jsletlocale.DBTable.find});
		}
		menuCfg.items.push({id: 'fixed', name: jsletlocale.DBTable.fixed, 
			items: [{id: 'fixedCol', name: jsletlocale.DBTable.fixedCol},
			        {id: 'fixedRow', name: jsletlocale.DBTable.fixedRow},
			]});
		if(Z._enableErrorFinding || Z._editable) {
			menuCfg.items.push({name: '-'});
			menuCfg.items.push({id: 'nextError', name: jsletlocale.DBTable.nextError});
		}
		if (Z._onCreateContextMenu) {
			Z._onCreateContextMenu.call(Z, menuCfg.items);
		}
		if (menuCfg.items.length === 0) {
			return;
		}
		Z.contextMenu = jslet.ui.createControl(menuCfg);
		jQuery(Z.el).on('contextmenu', '.jl-tbl-cell', function(event) {
			Z.contextMenu.showContextMenu(event, Z);
		});
	},
	
	_menuItemClick: function(menuCfg, checked) {
		var menuId = menuCfg.id;
		var Z = this;
		if (menuId == 'selectAll') {
			Z.selectAllCells();
		} else if (menuId == 'find') {
			Z.showFindDialog();
		} else if (menuId == 'fixedRow') {
			Z.fixedRows(Z._dataset.recno() + 1);
			Z.renderAll();
		} else if (menuId == 'fixedCol') {
			Z.fixedCols(Z._currColNum + 1);
			Z.renderAll();
		} else if (menuId == 'copy') {
			jslet.ui.info(jsletlocale.DBTable.copyInfo);
		} else if (menuId == 'nextError') {
			Z.gotoNextError();
		}
	},
	
	/**
	 * Show finding record dialog. Press 'Ctrl + F' to call this method.
	 */
	showFindDialog: function() {
		var Z = this;
		if(Z._filterPanel) {
			Z._filterPanel.hide();
		}
		if(!Z._hasFindDialog) {
			return;
		}
		if(!Z._findDialog) {
			Z._findDialog = new jslet.ui.table.FindDialog(Z);
		}
		if(!Z._findDialog.findingField()) {
			var colCfg = Z.innerColumns[Z._currColNum];
			if(colCfg.field) {
				Z._findDialog.findingField(colCfg.field);
			} else {
				//Get first column with field name.
				for(var i = Z._currColNum + 1, len = Z.innerColumns.length; i < len; i++) {
					colCfg = Z.innerColumns[i];
					if(colCfg.field) {
						Z._findDialog.findingField(colCfg.field);
						break;
					}
				}
			}
		}
		if(Z._findDialog.findingField()) {
			Z._findDialog.show(0, Z.headSectionHt);
		}		
		return this;
	},
	
	/**
	 * Goto the next error record if dataset exists errors. Press 'Ctrl + E' to call this method.
	 */
	gotoNextError: function() {
		var Z = this;
		if(!Z._dataset.nextError()) {
			Z._dataset.firstError();
		}
		return this;
	},
	
	copySelection: function(fitExcel) {
		var Z = this, 
			selectedText;
		if(fitExcel) {
			selectedText = Z._dataset.selection.getSelectionText('"', true, '\t');
		} else {
			selectedText = Z._dataset.selection.getSelectionText('', false, '\t');
		}
		if(!selectedText) {
			var fldName = Z.getFieldByColNum(Z._currColNum);
			if(fldName) {
				selectedText = Z._dataset.getFieldText(fldName);
			}
		}
		if(selectedText) {
			jslet.Clipboard.putText(selectedText);
			window.setTimeout(function() {Z.el.focus();}, 5);
		}
		return this;
	},
	
	selectAllCells: function() {
		var Z = this,
			fields = [], colCfg, fldName;
		for(var i = 0, len = Z.innerColumns.length; i < len; i++) {
			colCfg = Z.innerColumns[i];
			fldName = colCfg.field;
			if(fldName) {
				fields.push(fldName);
			}
		}
		Z._dataset.selection.selectAll(fields, true);
		Z._refreshSelection();
		return this;
	},
	
	/**
	 * Move cursor to the prior editable field.
	 */
	tabPrior: function() {
		var Z = this,
			fldName = Z.getFieldByColNum(Z._currColNum),
			lastColNum, num = null, 
			focusedFields = Z._dataset.focusedFields(),
			editingFields = Z._getEditingFields();
		if(editingFields && editingFields.indexOf(fldName) >= 0) {
			var focusMngr = jslet.ui.globalFocusManager,
				onChangingFocusFn = focusMngr.onChangingFocus();
			
			if(focusedFields) {
				focusedFields = focusedFields.slice(0);
				for(var i = focusedFields.length - 1; i >= 0; i--) {
					if(editingFields.indexOf(focusedFields[i]) < 0) {
						focusedFields.splice(i, 1);
					}
				}
			}
			var idx = -1, fields;
			if(focusedFields) {
				fields = focusedFields;
				idx = fields.indexOf(fldName);
			}
			if(idx < 0) {
				fields = editingFields;
				idx = fields.indexOf(fldName);
			}
			if(onChangingFocusFn) {
				var cancelFocus = onChangingFocusFn(document.activeElement || Z.el, true, Z._dataset, 
						focusMngr.activeField(), fields, focusMngr.activeValueIndex());
				if(!cancelFocus) {
					return true;
				}
			}
			if(fields && idx >= 0) {
				if(idx === 0) {
					if(Z._dataset.recno() > 0) {
						Z._dataset.prior();
						fldName = fields[fields.length - 1];
					} else {
						return false;
					}
				} else {
					fldName = fields[idx - 1];
				}
				num = Z.getColNumByField(fldName);
			}
		}
		if(num === null) {
			lastColNum = Z.innerColumns.length - 1;
			if(Z._currColNum === 0) {
				if(Z._dataset.recno() > 0) {
					Z._dataset.prior();
					num = lastColNum;
				} else {
					return false;
				}
			} else {
				num = Z._currColNum - 1;
			}
		}
		Z.currColNum(num);
		return true;
	},
	
	/**
	 * Move cursor to the next editable field.
	 */
	tabNext: function() {
		var Z = this,
			fldName = Z.getFieldByColNum(Z._currColNum),
			lastColNum, num = null, 
			focusedFields = Z._dataset.focusedFields(),
			editingFields = Z._getEditingFields();
			
		if(editingFields && editingFields.indexOf(fldName) >= 0) {
			var focusMngr = jslet.ui.globalFocusManager,
				onChangingFocusFn = focusMngr.onChangingFocus();
			
			if(focusedFields) {
				focusedFields = focusedFields.slice(0);
				for(var i = focusedFields.length - 1; i >= 0; i--) {
					if(editingFields.indexOf(focusedFields[i]) < 0) {
						focusedFields.splice(i, 1);
					}
				}
			}
			var idx = -1, fields;
			if(focusedFields) {
				fields = focusedFields;
				idx = fields.indexOf(fldName);
			}
			if(idx < 0) {
				fields = editingFields;
				idx = fields.indexOf(fldName);
			}
			if(onChangingFocusFn) {
				var cancelFocus = onChangingFocusFn(document.activeElement || Z.el, false, Z._dataset, 
						focusMngr.activeField(), fields, focusMngr.activeValueIndex());
				if(!cancelFocus) {
					return true;
				}
			}
			if(fields && idx >= 0) {
				if(idx === fields.length - 1) {
					if(Z._dataset.recno() < Z._dataset.recordCount() - 1) {
						Z._dataset.next();
						fldName = fields[0];
					} else {
						return false;
					}
				} else {
					fldName = fields[idx + 1];
				}
				num = Z.getColNumByField(fldName);
			}
		}
		if(num === null) {
			lastColNum = Z.innerColumns.length - 1;
			if(Z._currColNum < lastColNum) {
				num = Z._currColNum + 1;
			} else {
				if(Z._dataset.recno() === Z._dataset.recordCount() - 1) {
					return false;
				}
				Z._dataset.next();
				num = 0;
			}
		}
		Z.currColNum(num);
		return true;
	},
	
	movePriorCell: function(ctrlKey, shiftKey, altKey) {
		var Z = this,
			lastColNum = Z.innerColumns.length - 1,
			num;
		
		if(Z._currColNum === 0) {
			if(Z._dataset.recno() > 0) {
				Z._dataset.prior();
				num = lastColNum;
			} else {
				return;
			}
		} else {
			num = Z._currColNum - 1;
		}
		Z._doBeforeSelect(ctrlKey, shiftKey, altKey);
		Z.currColNum(num);
		Z._processSelection(ctrlKey, shiftKey, altKey);
		return this;
	},
	
	moveNextCell: function(ctrlKey, shiftKey, altKey) {
		var Z = this,
			lastColNum = Z.innerColumns.length - 1,
			num;
		
		if(Z._currColNum < lastColNum) {
			num = Z._currColNum + 1;
		} else {
			if(Z._dataset.recno() === Z._dataset.recordCount() - 1) {
				return;
			}
			Z._dataset.next();
			num = 0;
		}
		Z._doBeforeSelect(ctrlKey, shiftKey, altKey);
		Z.currColNum(num);
		Z._processSelection(ctrlKey, shiftKey, altKey);
		return this;
	},
	
	_getEditingFields: function() {
		var Z = this; 
		if(!Z._editable) {
			return null;
		}
		var fldName, fldObj,
			dsObj = Z._dataset,
			result = null;

		for(var i = 0, len = Z.innerColumns.length; i < len; i++) {
			fldName = Z.innerColumns[i].field;
			if(!fldName) {
				continue;
			}
			fldObj = dsObj.getField(fldName);
			if(!fldObj.disabled() && !fldObj.readOnly()) {
				if(!result) {
					result = [];
				}
				result.push(fldName);
			}
		}
		return result;
	},
	
	_initializeVm: function() {
		var Z = this;

		Z.listvm = new jslet.ui.ListViewModel(Z._dataset, Z._treeField ? true : false);
		
		Z.listvm.onTopRownoChanged = function(rowno) {
			if (rowno < 0) {
				return;
			}
			Z._fillData();
			
			Z._syncScrollBar(rowno);
			Z._showCurrentRow();
		};
	
		Z.listvm.onVisibleCountChanged = function() {
			Z.renderAll();
		};
		
		Z.listvm.onCurrentRownoChanged = function(preRowno, rowno) {
			Z._hideCurrentRow();
			if (Z._dataset.recordCount() === 0) {
				Z._currRow = null;
				return;
			}
			Z._dataset.recno(Z.listvm.getCurrentRecno());
			var currRow = Z._getTrByRowno(rowno), otr;
			if (!currRow) {
				return;
			}
			otr = currRow.fixed;
			if (otr) {
				jQuery(otr).addClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
			}
			
			otr = currRow.content;
			jQuery(otr).addClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
			Z._currRow = currRow;
			if(Z._editable) {
				var fldName = Z._editingField;
				if(fldName) {
					var fldObj = Z._dataset.getField(fldName);
					if(fldObj && !fldObj.disabled() && !fldObj.readOnly()) {
						Z._dataset.focusEditControl(fldName);
					}
				}
			}
		};
	},
	
	/**
	 * @override
	 */
	renderAll: function() {
		var Z = this;
		Z._innerDestroy();
		Z.el.innerHTML = '';
		Z.listvm.fixedRows = Z._fixedRows;
		Z._calcParams();
		Z.listvm.refreshModel();
		Z._createFrame();
		Z._fillData();
		Z._showCurrentRow(true);
		Z._oldHeight = jQuery(Z.el).height();
		Z._updateSortFlag(true);
		return this;
	}, // end renderAll

	_doBeforeSelect: function(hasCtrlKey, hasShiftKey, hasAltKey) {
	},
	
	_getSelectionFields: function(startColNum, endColNum) {
		if(startColNum > endColNum) {
			var tmp = startColNum;
			startColNum = endColNum;
			endColNum = tmp;
		}
		var fields = [], fldName, colCfg, colNum;
		for(var i = 0, len = this.innerColumns.length; i < len; i++) {
			colCfg = this.innerColumns[i];
			colNum = colCfg.colNum;
			if(colNum >= startColNum && colNum <= endColNum) {
				fldName = colCfg.field;
				if(fldName) {
					fields.push(fldName);
				}
			}
		}
		return fields;
	},
	
	_processSelection: function(hasCtrlKey, hasShiftKey, hasAltKey) {
		var Z = this,
			currRecno = Z._dataset.recno(),
			fldName;
		if(hasCtrlKey || !Z._autoClearSelection) { //If autoClearSelection = false, click a cell will select it.
			fldName = Z.innerColumns[Z._currColNum].field;
			if(fldName) {
				if(Z._dataset.selection.isSelected(currRecno, fldName)) {
					Z._dataset.selection.remove(currRecno, currRecno, [fldName], true);
				} else {
					Z._dataset.selection.add(currRecno, currRecno, [fldName], true);
				}
				Z._refreshSelection();
			}
			Z._preRecno = currRecno;
			Z._preColNum = Z._currColNum;
			return;
		}
		if(hasShiftKey) {
			var fields;
			if(Z._preTmpRecno >= 0 && Z._preTmpColNum >= 0) {
				fields = Z._getSelectionFields(Z._preColNum || 0, Z._preTmpColNum);
				Z._dataset.selection.remove(Z._preRecno || 0, Z._preTmpRecno, fields, false);
			}
			fields = Z._getSelectionFields(Z._preColNum || 0, Z._currColNum);
			Z._dataset.selection.add(Z._preRecno || 0, currRecno, fields, true);
			Z._refreshSelection();
			Z._preTmpRecno = currRecno;
			Z._preTmpColNum = Z._currColNum;
		} else {
			Z._preRecno = currRecno;
			Z._preColNum = Z._currColNum;
			Z._preTmpRecno = currRecno;
			Z._preTmpColNum = Z._currColNum;
			if(Z._autoClearSelection) {
				Z._dataset.selection.removeAll();
				Z._refreshSelection();
			}
		}
	},
	
	_processColumnSelection: function(colCfg, hasCtrlKey, hasShiftKey, hasAltKey) {
		if(!hasCtrlKey && !hasShiftKey) {
			return;
		}
		var Z = this,
			recCnt = Z._dataset.recordCount();
		if(recCnt === 0) {
			return;
		}
		var fields, colNum;
		if(hasShiftKey) {
			if(Z._preTmpColNum >= 0) {
				fields = Z._getSelectionFields(Z._preColNum || 0, Z._preTmpColNum);
				Z._dataset.selection.remove(0, recCnt, fields, true);
			}
			colNum = colCfg.colNum + colCfg.colSpan - 1;
			fields = Z._getSelectionFields(Z._preColNum || 0, colNum);
			Z._dataset.selection.add(0, recCnt, fields, true);
			Z._preTmpColNum = colNum;
		} else {
			if(!hasCtrlKey && Z._autoClearSelection) {
				Z._dataset.selection.removeAll();
			}
			if(colCfg.colSpan > 1) {
				fields = [];
				var startColNum = colCfg.colNum,
					endColNum = colCfg.colNum + colCfg.colSpan, fldName;
				
				for(colNum = startColNum; colNum < endColNum; colNum++) {
					fldName = Z.innerColumns[colNum].field;
					fields.push(fldName);
				}
			} else {
				fields = [colCfg.field];
			}
			Z._dataset.selection.add(0, recCnt, fields, true);
			Z._preColNum = colCfg.colNum;
		}
		Z._refreshSelection();
	},
	
	_processRowSelection: function(hasCtrlKey, hasShiftKey, hasAltKey) {
		if(!hasCtrlKey && !hasShiftKey) {
			return;
		}
		var Z = this,
			fields = Z._getSelectionFields(0, Z.innerColumns.length - 1);
		var currRecno = Z._dataset.recno();
		if(hasShiftKey) {
			if(Z._preTmpRecno >= 0) {
				Z._dataset.selection.remove(Z._preRecno || 0, Z._preTmpRecno, fields, true);
			}
			Z._dataset.selection.add(Z._preRecno || 0, currRecno, fields, true);
			Z._preTmpColNum = currRecno;
		} else {
			if(!hasCtrlKey && Z._autoClearSelection) {
				Z._dataset.selection.removeAll();
			}
			Z._dataset.selection.add(currRecno, currRecno, fields, true);
			Z._preRecno = currRecno;
		}
		Z._refreshSelection();
	},
	
	_prepareColumn: function() {
		var Z = this, cobj;
		Z._sysColumns = [];
		//prepare system columns
		if (Z._hasSeqCol) {
			cobj = {label:'&nbsp;',width: Z.seqColWidth, disableHeadSort:true,isSeqCol:true, 
					cellRender:jslet.ui.table.cellRenders.sequenceCellRender, widthCssName: Z._widthStyleId + '-s0'};
			Z._sysColumns.push(cobj);
		}
		if (Z._hasSelectCol) {
			cobj = {label:'<input type="checkbox" />', width: Z.selectColWidth, disableHeadSort:true,isSelectCol:true, 
					cellRender:jslet.ui.table.cellRenders.selectCellRender, widthCssName: Z._widthStyleId + '-s1'};
			Z._sysColumns.push(cobj);
		}
		
		if (Z.subgroup && Z.subgroup.hasExpander) {
			cobj = {label:'&nbsp;', width: Z.selectColWidth, disableHeadSort:true, isSubgroup: true, 
					cellRender:jslet.ui.table.cellRenders.subgroupCellRender, widthCssName: Z._widthStyleId + '-s2'};
			Z._sysColumns.push(cobj);
		}
		//prepare data columns
		var tmpColumns = [], fldObj;
		if (Z._columns) {
			for(var k = 0, colCnt2 = Z._columns.length; k < colCnt2; k++) {
				cobj = Z._columns[k];
				if (!cobj.field) {
					cobj.disableHeadSort = true;
				} else {
					fldObj = Z._dataset.getField(cobj.field);
					if(!fldObj) {
						throw new Error('Not found Field: ' + cobj.field);
					}
					cobj.displayOrder = fldObj.displayOrder();
				}
				tmpColumns.push(cobj);
			}
		}
		function getColumnObj(fldName) {
			if (Z._columns) {
				for(var m = 0, colCnt1 = Z._columns.length; m < colCnt1; m++) {
					cobj = Z._columns[m];
					if (cobj.field && cobj.field == fldName) {
						return cobj;
					}
				}
			}
			return null;
		}
		var i, fldcnt, colCnt, fldName;
		if (!Z._onlySpecifiedCol) {
			var fields = Z._dataset.getFields();
			for (i = 0, fldcnt = fields.length; i < fldcnt; i++) {
				fldObj = fields[i];
				fldName = fldObj.name();
				if (fldObj.visible()) {
					cobj = getColumnObj(fldName);
					if(!cobj) {
						cobj = new jslet.ui.table.TableColumn();
						cobj.field = fldObj.name();
						cobj.displayOrder = fldObj.displayOrder();
						tmpColumns.push(cobj);
					}
				} // end if visible
			} // end for
			if (Z._columns) {
				for(i = 0, colCnt = Z._columns.length; i < colCnt; i++) {
					cobj = Z._columns[i];
					if (!cobj.field) {
						continue;
					}
					fldObj = Z._dataset.getTopField(cobj.field);
					if (!fldObj) {
						throw new Error("Field: " + cobj.field + " doesn't exist!");
					}
					var children = fldObj.children();
					if (children && children.length > 0) {
						fldName = fldObj.name();
						var isUnique = true;
						// cobj.field is not a child of a groupfield, we need check if the topmost parent field is duplicate or not 
						if (cobj.field != fldName) {
							for(var n = 0; n < tmpColumns.length; n++) {
								if (tmpColumns[n].field == fldName) {
									isUnique = false;
									break;
								}
							} // end for k
						}
						if (isUnique) {
							cobj = new jslet.ui.table.TableColumn();
							cobj.field = fldName;
							cobj.displayOrder = fldObj.displayOrder();
							tmpColumns.push(cobj);
						}
					}
				} //end for i
			} //end if Z.columns
		}
		
		tmpColumns.sort(function(cobj1, cobj2) {
			var ord1 = cobj1.displayOrder || 0;
			var ord2 = cobj2.displayOrder || 0;
			return ord1 === ord2? 0: (ord1 < ord2? -1: 1);
		});
		
		Z.innerHeads = [];
		Z.innerColumns = [];
		var ohead, label, 
			context = {lastColNum: 0, depth: 0};
		
		for(i = 0, colCnt = tmpColumns.length; i < colCnt; i++) {
			cobj = tmpColumns[i];
			fldName = cobj.field;
			if (!fldName) {
				ohead = new jslet.ui.table.TableHead();
				label = cobj.label;
				ohead.label = label? label: "";
				ohead.level = 0;
				ohead.colNum = context.lastColNum++;
				cobj.colNum = ohead.colNum;
				ohead.id = jslet.nextId();
				ohead.widthCssName = Z._widthStyleId + '-' + ohead.colNum;
				cobj.widthCssName = ohead.widthCssName;
				ohead.disableHeadSort = cobj.disableHeadSort;

				Z.innerHeads.push(ohead);
				Z.innerColumns.push(cobj);
				
				continue;
			}
			fldObj = Z._dataset.getField(fldName);
			Z._convertField2Head(context, fldObj);
		}

		Z.maxHeadRows = context.depth + 1;
		Z._calcHeadSpan();
	
		//check fixedCols property
		var preColCnt = 0, len,
			fixedColNum = Z._fixedCols - Z._sysColumns.length;
		colCnt = 0;
		for(i = 1, len = Z.innerHeads.length; i < len; i++) {
			ohead = Z.innerHeads[i];
			colCnt += ohead.colSpan;
			if (fixedColNum <= preColCnt || fixedColNum == colCnt) {
				break;
			}
			if (fixedColNum < colCnt && fixedColNum > preColCnt) {
				Z._fixedCols = preColCnt + Z._sysColumns.length;
			}
			
			preColCnt = colCnt;
		}
	},
	
	_calcHeadSpan: function(heads) {
		var Z = this;
		if (!heads) {
			heads = Z.innerHeads;
		}
		var ohead, childCnt = 0;
		for(var i = 0, len = heads.length; i < len; i++ ) {
			ohead = heads[i];
			ohead.rowSpan = Z.maxHeadRows - ohead.level;
			if (ohead.subHeads) {
				ohead.colSpan = Z._calcHeadSpan(ohead.subHeads);
				childCnt += ohead.colSpan;
			} else {
				ohead.colSpan = 1;
				childCnt++;
			}
		}
		return childCnt;
	},
	
	_convertField2Head: function(context, fldObj, parentHeadObj) {
		function checkHtml(htmlStr) {
		    var  reg = /<[^>]+>/g;
		    return reg.test(htmlStr);
		}
		
		var Z = this;
		if (!fldObj.visible()) {
			return false;
		}
		var level = 0, heads;
		if (!parentHeadObj) {
			heads = Z.innerHeads;
		} else {
			level = parentHeadObj.level + 1;
			heads = parentHeadObj.subHeads;
		}
		var ohead, fldName = fldObj.name();
		ohead = new jslet.ui.table.TableHead();
		ohead.label = fldObj.displayLabel();
		ohead.field = fldName;
		ohead.level = level;
		ohead.colNum = context.lastColNum;
		ohead.id = jslet.nextId();
		heads.push(ohead);
		context.depth = Math.max(level, context.depth);
		var fldChildren = fldObj.children();
		if (fldChildren && fldChildren.length > 0) {
			ohead.subHeads = [];
			var added = false;
			for(var i = 0, cnt = fldChildren.length; i< cnt; i++) {
				Z._convertField2Head(context, fldChildren[i], ohead);
			}
		} else {
			context.lastColNum ++;
			var cobj, found = false;
			var len = Z._columns ? Z._columns.length: 0;
			for(var k = 0; k < len; k++) {
				cobj = Z._columns[k];
				if (cobj.field == fldName) {
					found = true;
					break;
				}
			}
			if (!found) {
				cobj = new jslet.ui.table.TableColumn();
				cobj.field = fldName;
			}
			if (!cobj.label) {
				cobj.label = fldObj.displayLabel();
			}
			var dataType = fldObj.getType();
			if(dataType === jslet.data.DataType.BOOLEAN) {
				cobj.isBoolColumn = true;
			}
			cobj.mergeSame = fldObj.mergeSame();
			cobj.colNum = ohead.colNum;
			if (!cobj.width) {
				var maxWidth = fldObj ? fldObj.displayWidth() : 0;
				if (!Z._hideHead && cobj.label) {
					if(checkHtml(cobj.label)) {
						maxWidth = Math.max(maxWidth, jQuery(cobj.label).text().length);
					} else {
						maxWidth = Math.max(maxWidth, cobj.label.length);
					}
				}
				cobj.width = maxWidth ? (maxWidth * Z.charWidth) : 10;
			}
			//check and set cell render 
			if (!cobj.cellRender) {
				if (dataType === jslet.data.DataType.BOOLEAN) {//data type is boolean
					cobj.cellRender = jslet.ui.table.cellRenders.boolCellRender;
				} else if (dataType === jslet.data.DataType.EDITACTION) {//data type is edit
					ohead.cellRender = cobj.cellRender = jslet.ui.table.cellRenders.editActionCellRender;
				} else if (cobj.field == Z._treeField) {
					cobj.cellRender = jslet.ui.table.cellRenders.treeCellRender;
				}
			}
			if(dataType === jslet.data.DataType.ACTION || dataType === jslet.data.DataType.EDITACTION) {
				ohead.disableHeadSort = true;
				ohead.disableFilter = true;
			}
			ohead.widthCssName = Z._widthStyleId + '-' + ohead.colNum;
			cobj.widthCssName = ohead.widthCssName;
			
			Z.innerColumns.push(cobj);
		}
		return true;
	},
	
	_calcParams: function() {
		var Z = this;
		Z._currColNum = 0;
		Z._preTmpColNum = -1;
		Z._preTmpRecno = -1;
		Z._preRecno = -1;
		Z._preColNum = -1;

		if (Z._treeField) {//if tree style table, it can't be sorted by clicking column header
			Z._disableHeadSort = true;
		}
		// calculate Sequence column width
		if (Z._hasSeqCol) {
			Z.seqColWidth = ('' + Z._dataset.recordCount()).length * Z.charWidth + 5;
			var sWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
			Z.seqColWidth = Z.seqColWidth > sWidth ? Z.seqColWidth: sWidth;
		} else {
			Z.seqColWidth = 0;
		}
		// calculate Select column width
		if (Z._hasSelectCol) {
			Z.selectColWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
		} else {
			Z.selectColWidth = 0;
		}
		//calculate Fixed row section's height
		if (Z._fixedRows > 0) {
			Z.fixedSectionHt = Z._fixedRows * Z.rowHeight();
		} else {
			Z.fixedSectionHt = 0;
		}
		//Calculate Foot section's height
		if (Z.aggregated() && Z.dataset().checkAggregated()) {
			Z.footSectionHt = Z.footerRowHeight();
		} else {
			Z.footSectionHt = 0;
		}
		Z._prepareColumn();

		// fixed Column count must be less than total columns
		if (Z._fixedCols) {
			if (Z._fixedCols > Z.innerColumns.length) {
				Z._fixedCols = Z.innerColumns.length;
			}
		}
		Z.hasFixedCol = Z._sysColumns.length > 0 || Z._fixedCols > 0;
		if (Z.hasFixedCol) {
			var w = 0, i, cnt;
			for(i = 0, cnt = Z._sysColumns.length; i < cnt; i++) {
				w += Z._sysColumns[i].width + 1;
			}
			for(i = 0, cnt = Z._fixedCols; i < cnt; i++) {
				w += Z.innerColumns[i].width + 1;
			}
			Z.fixedColWidth = w + 1;
		} else {
			Z.fixedColWidth = 0;
		}
	}, // end _calcParams

	_setScrollBarMaxValue: function(maxValue) {
		var Z = this,
			v = maxValue + Z._repairHeight + (Z._autoStretch? Z.footSectionHt: 0);
		Z.jqVScrollBar.find('div').height(v);
		if(Z.contentSectionHt >= v) {
			Z.jqVScrollBar.parent().addClass('jl-scrollbar-hidden');	
		} else {
			Z.jqVScrollBar.parent().removeClass('jl-scrollbar-hidden');	
		}
	},

	_changeColWidthCssRule: function(cssName, width) {
		var Z = this,
			styleEle = document.getElementById(Z._widthStyleId),
			styleObj = styleEle.styleSheet || styleEle.sheet,
			cssRules = styleObj.cssRules || styleObj.rules,
			cssRule = null, found = false;
			cssName = '.' + cssName;
		for(var i = 0, len = cssRules.length; i < len; i++) {
			cssRule = cssRules[i];
			if(cssRule.selectorText == cssName) {
				found = true;
				break;
			}
		}
		if(found) {
			cssRule.style.width = width + 'px';
		}
		return found;
	},

	_changeColWidth: function(index, deltaW) {
		var Z = this,
			colObj = Z.innerColumns[index];
		if (colObj.width + deltaW <= 0) {
			return;
		}
		colObj.width += deltaW;
		if(colObj.field) {
			Z._dataset.designMode(true);
			try {
				Z._dataset.getField(colObj.field).displayWidth(Math.round(colObj.width/Z.charWidth));
			} finally {
				Z._dataset.designMode(false);
			}
		}
		if(Z._changeColWidthCssRule(colObj.widthCssName, colObj.width)) {
			Z._changeContentWidth(deltaW);
		}
	},

	_refreshSeqColWidth: function() {
		var Z = this;
		if (!Z._hasSeqCol) {
			return;
		}
		var oldSeqColWidth = Z.seqColWidth;
		Z.seqColWidth = ('' + Z._dataset.recordCount()).length * Z.charWidth;
		var sWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
		Z.seqColWidth = Z.seqColWidth > sWidth ? Z.seqColWidth: sWidth;
		if(Z.seqColWidth == oldSeqColWidth) {
			return;
		}
		var colObj;
		for(var i = 0, len = Z._sysColumns.length; i < len; i++) {
			colObj = Z._sysColumns[i];
			if(colObj.isSeqCol) {
				break;
			}
		}
		colObj.width = Z.seqColWidth;
		Z._changeColWidthCssRule(colObj.widthCssName, Z.seqColWidth);
		var deltaW = Z.seqColWidth - oldSeqColWidth;
		Z._changeContentWidth(deltaW, true);
	},

	_changeContentWidth: function(deltaW, isLeft) {
		var Z = this,
			totalWidth = Z.getTotalWidth(isLeft),
			totalWidthStr = totalWidth + 'px';
		if(!isLeft) {
			Z.rightHeadTbl.parentNode.style.width = totalWidthStr;
			Z.rightFixedTbl.parentNode.style.width = totalWidthStr;
			Z.rightContentTbl.parentNode.style.width = totalWidthStr;
			if (Z.footSectionHt) {
				Z.rightFootTbl.style.width = totalWidthStr;
			}
		} else {
			Z.fixedColWidth = totalWidth;
			Z.leftHeadTbl.parentNode.parentNode.style.width = Z.fixedColWidth + 1 + 'px';
			Z.leftHeadTbl.parentNode.style.width = totalWidthStr;
			Z.leftFixedTbl.parentNode.style.width = totalWidthStr;
			Z.leftContentTbl.parentNode.style.width = totalWidthStr;
		}
		Z._checkHoriOverflow();
	},

	_createFrame: function() {
		var Z = this;
		Z.el.style.position = 'relative';
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-table')) {
			jqEl.addClass('jl-table jl-border-box jl-round5');
		}
		if(Z._noborder) {
			jqEl.addClass('jl-tbl-noborder');
		}
		
		function generateWidthStyle() {
			var colObj, cssName, i, len,
				styleHtml = ['<style type="text/css" id="' + Z._widthStyleId + '">\n'];
			for(i = 0, len = Z._sysColumns.length; i < len; i++) {
				colObj = Z._sysColumns[i];
				styleHtml.push('.' + colObj.widthCssName +'{width:' + colObj.width + 'px}\n');
			}
			for(i = 0, len = Z.innerColumns.length; i< len; i++) {
				colObj = Z.innerColumns[i];
				styleHtml.push('.' + colObj.widthCssName +'{width:' + colObj.width + 'px}\n');
			}
			styleHtml.push('</style>');
			return styleHtml.join('');
		}
		
		var dbtableframe = [
			'<div class="jl-tbl-splitter" style="display: none"></div>',
			generateWidthStyle(),
			'<div class="jl-tbl-norecord">',
			jsletlocale.DBTable.norecord,
			'</div>',
			'<table class="jl-tbl-container"><tr>',
			'<td><div class="jl-tbl-fixedcol"><table class="jl-tbl-data"><tbody /></table><table class="jl-tbl-data"><tbody /></table><div class="jl-tbl-content-div"><table class="jl-tbl-data"><tbody /></table><table><tbody /></table></div></div></td>',
			'<td><div class="jl-tbl-contentcol"><div><table class="jl-tbl-data jl-tbl-content-table" border="0" cellpadding="0" cellspacing="0"><tbody /></table></div><div><table class="jl-tbl-data jl-tbl-content-table"><tbody /></table></div><div class="jl-tbl-content-div"><table class="jl-tbl-data jl-tbl-content-table"><tbody /></table><table class="jl-tbl-content-table jl-tbl-footer"><tbody /></table></div></div></td>',
			'<td class="jl-scrollbar-col"><div class="jl-tbl-vscroll-head"></div><div class="jl-tbl-vscroll"><div /></div></td></tr></table>'];
		
		jqEl.html(dbtableframe.join(''));

		var children = jqEl.find('.jl-tbl-fixedcol')[0].childNodes;
		Z.leftHeadTbl = children[0];
		Z.leftFixedTbl = children[1];
		Z.leftContentTbl = children[2].firstChild;
		Z.leftFootTbl = children[2].children[1];
		
		children = jqEl.find('.jl-tbl-contentcol')[0].childNodes;
		Z.rightHeadTbl = children[0].firstChild;
		Z.rightFixedTbl = children[1].firstChild;
		Z.rightContentTbl = children[2].firstChild;
		Z.rightFootTbl = children[2].children[1];

		Z.height = jqEl.height();
		if(Z.height <= 1 && !Z._autoStretch) {
			Z.height = 200;
			jqEl.height(200);
		}
		if (Z._hideHead) {
			Z.leftHeadTbl.style.display = 'none';
			Z.rightHeadTbl.style.display = 'none';
			jqEl.find('.jl-tbl-vscroll-head').css('display', 'none');
		}
		if (Z._fixedRows <= 0) {
			Z.leftFixedTbl.style.display = 'none';
			Z.rightFixedTbl.style.display = 'none';
		}
		if (!Z.footSectionHt) {
			Z.leftFootTbl.style.display = 'none';
			Z.rightFootTbl.style.display = 'none';
		}
		Z.leftHeadTbl.parentNode.parentNode.style.width = Z.fixedColWidth + 'px';
		
		var jqRightHead = jQuery(Z.rightHeadTbl);
		jqRightHead.off();
		var x = jqRightHead.on('mousedown', Z._doSplitHookDown);
		var y = jqRightHead.on('mouseup', Z._doSplitHookUp);
		
		jQuery(Z.leftHeadTbl).on('mousedown', '.jl-tbl-header-cell', function(event) {
			event = jQuery.event.fix(event || window.event);
			if(event.button) {
				return;
			}
			var el = event.target;
			if (el.className == 'jl-tbl-splitter-hook') {
				return;
			}
			var colCfg = this.jsletColCfg;
			if(colCfg.field) {
				Z._processColumnSelection(colCfg, event.ctrlKey, event.shiftKey, event.altKey);
			}
		});
		
		jqRightHead.on('mousedown', '.jl-tbl-header-cell', function(event) {
			if(event.button) {
				return;
			}
			event = jQuery.event.fix(event || window.event);
			var el = event.target;
			if (el.className == 'jl-tbl-splitter-hook') {
				return;
			}
			var colCfg = this.jsletColCfg;
			if(colCfg.field) {
				Z._processColumnSelection(colCfg, event.ctrlKey, event.shiftKey, event.altKey);
			}
		});

		jQuery(Z.leftHeadTbl).on('mouseup', '.jl-focusable-item', function(event) {
			if(event.button) {
				return;
			}
			event = jQuery.event.fix(event || window.event);
			var el = event.target;
			if (Z.isDraggingColumn) {
				return;
			}
			Z._doHeadClick(this.parentNode.parentNode.parentNode.jsletColCfg, event.ctrlKey);
			Z._head_label_cliecked = true;
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		
		jqRightHead.on('mouseup', '.jl-focusable-item', function(event) {
			if(event.button) {
				return;
			}
			event = jQuery.event.fix(event || window.event);
			var el = event.target;
			if (Z.isDraggingColumn) {
				return;
			}
			Z._doHeadClick(this.parentNode.parentNode.parentNode.jsletColCfg, event.ctrlKey);
			Z._head_label_cliecked = true;
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		
		var dragTransfer = null;
		jqRightHead.on('dragstart', '.jl-focusable-item', function(event) {
			if(Z._filterPanel) {
				Z._filterPanel.hide();
			}
			var otd = this.parentNode.parentNode.parentNode,
				colCfg = otd.jsletColCfg,
				e = event.originalEvent,
				transfer = e.dataTransfer;
			transfer.dropEffect = 'link';
			transfer.effectAllowed = 'link';
			dragTransfer = {fieldName: colCfg.field, rowIndex: otd.parentNode.rowIndex, cellIndex: otd.cellIndex};
			transfer.setData('fieldName', colCfg.field); //must has this row otherwise FF does not work.
			return true;
		});

		function checkDropable(currCell) {
			var colCfg = currCell.jsletColCfg,
				srcRowIndex = dragTransfer.rowIndex,
				srcCellIndex = dragTransfer.cellIndex,
				currRowIndex = currCell.parentNode.rowIndex,
				currCellIndex = currCell.cellIndex;
			var result = (srcRowIndex == currRowIndex && currCellIndex != srcCellIndex);
			if(!result) {
				return result;
			}
			var	srcFldName = dragTransfer.fieldName,
				currFldName = colCfg.field,
				srcPFldObj = Z._dataset.getField(srcFldName).parent(),
				currPFldObj = currFldName && Z._dataset.getField(currFldName).parent();
			result = (srcPFldObj === currPFldObj || (currPFldObj && srcPFldObj.name() == currPFldObj.name()));
			return result;
		}
		
		jqRightHead.on('dragover', '.jl-tbl-header-cell .jl-tbl-header-div', function(event) {
			if(!dragTransfer) {
				return false;
			}
			var otd = this.parentNode,
				e = event.originalEvent,
				transfer = e.dataTransfer;
			if(checkDropable(otd)) { 
				jQuery(event.currentTarget).addClass('jl-tbl-col-over');
				transfer.dropEffect = 'link';
			} else {
				transfer.dropEffect = 'move';
			}
		    return false;
		});

		jqRightHead.on('dragenter', '.jl-tbl-header-cell .jl-tbl-header-div', function(event) {
			if(!dragTransfer) {
				return false;
			}
			var otd = this.parentNode,
				e = event.originalEvent,
				transfer = e.dataTransfer;
			if(checkDropable(otd)) { 
				jQuery(event.currentTarget).addClass('jl-tbl-col-over');
				transfer.dropEffect = 'link';
			} else {
				transfer.dropEffect = 'move';
			}
		    return false;
		});
		
		jqRightHead.on('dragleave', '.jl-tbl-header-cell .jl-tbl-header-div', function(event) {
			if(!dragTransfer) {
				return false;
			}
			jQuery(event.currentTarget).removeClass('jl-tbl-col-over');
			return  false;
		});
		
		jqRightHead.on('drop', '.jl-tbl-header-cell .jl-tbl-header-div', function(event) {
			if(!dragTransfer) {
				return false;
			}
			jQuery(event.currentTarget).removeClass('jl-tbl-col-over');
			var currCell = this.parentNode,
				e = event.originalEvent,
				transfer = e.dataTransfer,
				colCfg = currCell.jsletColCfg,
				srcRowIndex = dragTransfer.rowIndex,
				srcCellIndex = dragTransfer.cellIndex,
				currRowIndex = currCell.parentNode.rowIndex,
				currCellIndex = currCell.cellIndex;
			
			if(!checkDropable(currCell)) { 
				return;
			}
			var destField = this.parentNode.jsletColCfg.field;
			if(!destField) {
				return;
			}
			var	srcField = dragTransfer.fieldName;
			Z._moveColumn(srcRowIndex, srcCellIndex, currCellIndex);
	    	return false;
		});
		
		var jqLeftFixedTbl = jQuery(Z.leftFixedTbl),
			jqRightFixedTbl = jQuery(Z.rightFixedTbl),
			jqLeftContentTbl = jQuery(Z.leftContentTbl),
			jqRightContentTbl = jQuery(Z.rightContentTbl);
		
		jqLeftFixedTbl.off();
		jqLeftFixedTbl.on('mouseenter', 'tr', function() {
			jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			jQuery(jqRightFixedTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
		});
		jqLeftFixedTbl.on('mouseleave', 'tr', function() {
			jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			jQuery(jqRightFixedTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
		});

		jqRightFixedTbl.off();
		jqRightFixedTbl.on('mouseenter', 'tr', function() {
			jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			jQuery(jqLeftFixedTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
		});
		jqRightFixedTbl.on('mouseleave', 'tr', function() {
			jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			jQuery(jqLeftFixedTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
		});
		
		jqLeftContentTbl.off();
		jqLeftContentTbl.on('mouseenter', 'tr', function() {
			jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			jQuery(jqRightContentTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
		});
		jqLeftContentTbl.on('mouseleave', 'tr', function() {
			jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			jQuery(jqRightContentTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
		});
		
		jqRightContentTbl.off();
		jqRightContentTbl.on('mouseenter', 'tr', function() {
			jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			var hasLeft = (Z._fixedRows > 0 || Z._sysColumns.length > 0);
			if(hasLeft) {
				jQuery(jqLeftContentTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			}
		});
		jqRightContentTbl.on('mouseleave', 'tr', function() {
			jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			var hasLeft = (Z._fixedRows > 0 || Z._sysColumns.length > 0);
			if(hasLeft) {
				jQuery(jqLeftContentTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			}
		});
		
		Z.jqVScrollBar = jqEl.find('.jl-tbl-vscroll');
		//The scrollbar width must be set explicitly, otherwise it doesn't work in IE. 
		Z.jqVScrollBar.width(jslet.ui.scrollbarSize() + 1);
		
		Z.jqVScrollBar.off().on('scroll', function() {
			if (Z._keep_silence_) {
				return;
			}
			if(Z._editable && Z._dataset.status() != jslet.data.DataSetStatus.BROWSE) {
				Z._dataset.confirm();
			}
			var num = Math.round(this.scrollTop / Z.rowHeight());// + Z._fixedRows;
			if (num != Z.listvm.getVisibleStartRow()) {
				Z._keep_silence_ = true;
				try {
					Z.listvm.setVisibleStartRow(num);
					Z._showCurrentRow();
					var cellEditor = Z.cellEditor();
					if(cellEditor) {
						cellEditor.hideEditor();
					}
				} finally {
					Z._keep_silence_ = false;
				}
			}

		});

		jqEl.find('.jl-tbl-contentcol').off().on('scroll', function() {
			if(Z._isCurrCellInView()) {
				//Avoid focusing the current control
				jslet.temp.focusing = true;
				try {
					Z._showCurrentCell();
					
				} finally {
					jslet.temp.focusing = false;
				}
			} else {
	        	var cellEditor = Z.cellEditor();
	        	if(cellEditor) {
	       			cellEditor.hideEditor();
	        	}
			}
			if(Z._filterPanel) {
				Z._filterPanel.hide();
			}
		});
		
		var splitter = jqEl.find('.jl-tbl-splitter')[0];
		splitter._doDragStart = function() {
			this.style.display = 'block';
			if(Z._filterPanel) {
				Z._filterPanel.hide();
			}
		};
		
		splitter._doDragging = function(oldX, oldY, x, y, deltaX, deltaY) {
			var bodyMleft = parseInt(jQuery(document.body).css('margin-left'));

			var ojslet = splitter.parentNode.jslet;
			var colObj = ojslet.innerColumns[ojslet.currColId];
			if (colObj.width + deltaX <= 40) {
				return;
			}
			splitter.style.left = x - jQuery(splitter.parentNode).offset().left - bodyMleft + 'px';
		};

		splitter._doDragEnd = function(oldX, oldY, x, y, deltaX,
			deltaY) {
			var Z = splitter.parentNode.jslet;
			var cellEditor = Z.cellEditor();
			if(cellEditor) {
				cellEditor.hideEditor();
			}
			Z._changeColWidth(Z.currColId, deltaX);
			splitter.style.display = 'none';
			splitter.parentNode.jslet.isDraggingColumn = false;
//			if(cellEditor) {
//				cellEditor.showEditor();
//			}

		};

		splitter._doDragCancel = function() {
			splitter.style.display = 'none';
			splitter.parentNode.jslet.isDraggingColumn = false;
		};

		if (Z.footSectionHt) {
			Z.leftFootTbl.style.display = '';
			Z.rightFootTbl.style.display = '';
		}
		Z._renderHeader();
		if (Z._hideHead) {
			Z.headSectionHt = 0;
		} else {
			Z.headSectionHt = Z.maxHeadRows * Z.headRowHeight();
		}
		Z._changeContentWidth(0);

		Z.noRecordDiv = jqEl.find('.jl-tbl-norecord')[0];
		Z.noRecordDiv.style.top = Z.headSectionHt + 'px';
		Z.noRecordDiv.style.left = jqEl.find('.jl-tbl-fixedcol').width() + 5 + 'px';
		jqEl.find('.jl-tbl-vscroll-head').height(Z.headSectionHt + Z.fixedSectionHt);
		Z._renderBody();
	},

	_moveColumn: function(rowIndex, srcCellIndex, destCellIndex) {
		var Z = this;
		
		function moveOneRow(cells, srcStart, srcEnd, destStart, destEnd) {
			var cobj, 
				colNo = 0, 
				srcCells = [],
				destCells = [], i, len;
			
			for(i = 0, len = cells.length; i < len; i++) {
				cobj = cells[i];
				if(colNo >= srcStart && colNo <= srcEnd) {
					srcCells.push(cobj);
				} else if(colNo >= destStart && colNo <= destEnd) {
					destCells.push(cobj);
				} else {
					if(colNo > srcEnd && colNo > destEnd) {
						break;
					}
				}
				
				colNo += cobj.colSpan || 1;
			}
			var destCell;
			if(srcStart > destStart) {	
				destCell = destCells[0];
				for(i = 0, len = srcCells.length; i < len; i++) {
					jQuery(srcCells[i]).insertBefore(destCell);
				}
			} else {
				destCell = destCells[destCells.length - 1];
				for(i = srcCells.length; i >= 0; i--) {
					jQuery(srcCells[i]).insertAfter(destCell);
				}
			}
		}
		
		function moveOneTableColumn(rows, rowIndex, srcStart, srcEnd, destStart, destEnd) {
			var rowCnt = rows.length;
			if(rowCnt === 0 || rowCnt === rowIndex) {
				return;
			}
			var rowObj, cellCnt;
			for(var i = rowIndex, len = rows.length; i < len; i++) {
				rowObj = rows[i];
				moveOneRow(rowObj.cells, srcStart, srcEnd, destStart, destEnd);
			}
		}
		
		var rows = Z.rightHeadTbl.createTHead().rows, cobj,
			rowObj = rows[rowIndex],
			srcStart = 0,
			srcEnd = 0,
			destStart = 0,
			destEnd = 0, 
			preColNo = 0,
			colNo = 0;
		
		for(var i = 0, len = rowObj.cells.length; i < len; i++) {
			cobj = rowObj.cells[i];
			preColNo = colNo; 
			colNo += (cobj.colSpan || 1);
			if(i === srcCellIndex) {
				srcStart = preColNo;
				srcEnd = colNo - 1;
			}
			if(i === destCellIndex) {
				destStart = preColNo;
				destEnd = colNo - 1;
			}
		}
		var srcCell = rowObj.cells[srcCellIndex],
			destCell = rowObj.cells[destCellIndex];
		var srcColCfg = srcCell.jsletColCfg,
			destColCfg = destCell.jsletColCfg,
			srcFldName = srcColCfg.field,
			destFldName = destColCfg.field;
		if(srcFldName && destFldName) {
			Z._dataset.designMode(true);
			try {
				Z._dataset.moveField(srcFldName, destFldName);
			} finally {
				Z._dataset.designMode(false);
			}
		}
		var currField = Z.getFieldByColNum(Z._currColNum);
		var dataRows = Z.rightContentTbl.tBodies[0].rows;
		Z._changeColNum(dataRows[0], srcStart, srcEnd, destStart, destEnd);
		var headRows = Z.rightHeadTbl.createTHead().rows;
		moveOneTableColumn(headRows, rowIndex, srcStart, srcEnd, destStart, destEnd);
		moveOneTableColumn(Z.rightFixedTbl.tBodies[0].rows, 0, srcStart, srcEnd, destStart, destEnd);
		moveOneTableColumn(dataRows, 0, srcStart, srcEnd, destStart, destEnd);
		moveOneTableColumn(Z.rightFootTbl.tBodies[0].rows, 0, srcStart, srcEnd, destStart, destEnd);
		Z._dataset.selection.removeAll();
		Z._refreshSelection();
    	Z.gotoField(currField);
	},
	
	_changeColNum: function(rowObj, srcStart, srcEnd, destStart, destEnd) {
		if(!rowObj) {
			return;
		}
		var cobj, 
			colNo = 0, 
			srcCells = [],
			destCells = [],
			cells = rowObj.cells, i, len;
		
		for(i = 0, len = cells.length; i < len; i++) {
			cobj = cells[i];
			if(colNo >= srcStart && colNo <= srcEnd) {
				srcCells.push(cobj);
			} else if(colNo >= destStart && colNo <= destEnd) {
				destCells.push(cobj);
			} else {
				if(colNo > srcEnd && colNo > destEnd) {
					break;
				}
			}
			colNo += cobj.colSpan || 1;
		}
		var srcCellLen = srcCells.length,
			destCellLen = destCells.length,
			firstDestColNum= destCells[0].jsletColCfg.colNum,
			k = 0, colCfg;
		if(srcStart > destStart) {
			for(i = srcStart; i <= srcEnd; i++) {
				colCfg = cells[i].jsletColCfg;
				colCfg.colNum = firstDestColNum + (k++);
			}
			for(i = destStart; i < srcStart; i++) {
				colCfg = cells[i].jsletColCfg;
				colCfg.colNum = colCfg.colNum + srcCellLen;
			}
		} else {
			var newStart = firstDestColNum - srcCellLen + destCellLen;
			for(i = srcStart; i <= srcEnd; i++) {
				colCfg = cells[i].jsletColCfg;
				colCfg.colNum = newStart + (k++);
			}
			for(i = srcEnd + 1; i <= destEnd; i++) {
				colCfg = cells[i].jsletColCfg;
				colCfg.colNum = colCfg.colNum - srcCellLen;
			}
		}		
	},
	
	_calcAndSetContentHeight: function() {
		var Z = this,
			jqEl = jQuery(Z.el);

		var rh = Z.rowHeight(), rows;
		if(Z._autoStretch) {
			rows = Z._dataset.recordCount() - Z._fixedRows;
			if(Z._oldVisibleRows === rows) {
				return;
			}
			if(Z._maxVisibleRows > 0 && rows > Z._maxVisibleRows) {
				rows = Z._maxVisibleRows;
			}
			if(rows < Z._minVisibleRows) {
				rows = Z._minVisibleRows;
			}
			Z.contentSectionHt = rh * rows + Z.footSectionHt;
			Z._repairHeight = 0;
			Z._oldVisibleRows = rows;
			Z.listvm.setVisibleCount(rows, true);
		} else {
			Z.contentSectionHt = Z.height - Z.headSectionHt - Z.fixedSectionHt;
			if (Z._isHoriOverflow) {
				Z.contentSectionHt -= jslet.ui.htmlclass.TABLECLASS.scrollBarWidth;
			}
			rows = Math.floor((Z.contentSectionHt - Z.footSectionHt) / rh);
			Z.listvm.setVisibleCount(rows, true);
			Z._repairHeight = Z.contentSectionHt - rows * rh;
		}
		
		//jqEl.find('.jl-tbl-contentcol').height(Z.height);
		jqEl.find('.jl-tbl-content-div').height(Z.contentSectionHt);

		Z.jqVScrollBar.height(Z.contentSectionHt);
		Z._setScrollBarMaxValue(Z.listvm.getNeedShowRowCount() * rh);
	},
	
	_stretchContentHeight: function() {
		if(!this._autoStretch) {
			return;
		}
		this._calcAndSetContentHeight();
		this._stretchContentRow();
	},

	_checkHoriOverflow: function() {
		var Z = this,
			contentWidth = Z.getTotalWidth();

		if(Z._hideHead) {
			Z._isHoriOverflow = contentWidth > jQuery(Z.rightContentTbl.parentNode.parentNode).innerWidth();
		} else {
			Z._isHoriOverflow = contentWidth > Z.rightHeadTbl.parentNode.parentNode.clientWidth;
		}
		Z._calcAndSetContentHeight();
	},
	
	_refreshHeadCell: function(fldName) {
		var Z = this,
			jqEl = jQuery(Z.el), oth = null, cobj;
		jqEl.find('.jl-tbl-header-cell').each(function(index, value) {
			cobj = this.jsletColCfg;
			if(cobj && cobj.field == fldName) {
				oth = this;
				return false;
			}
		});
		if(!oth) {
			return;
		}
		var fldObj = Z._dataset.getField(cobj.field);
		cobj.label = fldObj.displayLabel();
		var ochild = oth.childNodes[0];
		var cellRender = cobj.cellRender || Z._defaultCellRender;
		if (cellRender && cellRender.createHeader) {
			ochild.html('');
			cellRender.createHeader.call(Z, ochild, cobj);
		} else {
			var sh = cobj.label || '&nbsp;';
			if(cobj.field && Z._isCellEditable(cobj)) {
				if(fldObj && fldObj.required()) {
					sh = '<span class="jl-lbl-required">*</span>' + sh;
				}
			} 
			jQuery(oth).find('.jl-focusable-item').html(sh);
		}
	},
	
	_createHeadCell: function(otr, cobj) {
		var Z = this,
			rowSpan = 0, colSpan = 0;
		
		if (!cobj.subHeads) {
			rowSpan = Z.maxHeadRows - (cobj.level ? cobj.level: 0);
		} else {
			colSpan = cobj.colSpan;
		}
		var oth = document.createElement('th');
		oth.className = 'jl-tbl-header-cell jl-unselectable';
		oth.noWrap = true;
		oth.jsletColCfg = cobj;
		if (rowSpan && rowSpan > 1) {
			oth.rowSpan = rowSpan;
		}
		if (colSpan && colSpan > 1) {
			oth.colSpan = colSpan;
		}
		oth.innerHTML = '<div style="position: relative" unselectable="on" class="jl-unselectable jl-tbl-header-div jl-border-box ' + 
			(cobj.widthCssName || '') +'">';
		var ochild = oth.childNodes[0];
		var cellRender = cobj.cellRender || Z._defaultCellRender;
		if (cellRender && cellRender.createHeader) {
			cellRender.createHeader.call(Z, ochild, cobj);
		} else {
			var sh = cobj.label || '&nbsp;';
			if(cobj.field) {
				var fldObj = Z._dataset.getField(cobj.field);
				if(fldObj && fldObj.required()) {
					sh = '<span class="jl-lbl-required">*</span>' + sh;
				}
			} 
			ochild.innerHTML = [
			    Z._hasFilterDialog && cobj.field && !cobj.subHeads && !cobj.disableFilter? '<button class="jl-tbl-filter" jsletfilterfield="' + cobj.field + 
			    		'"><i class="fa fa-filter"></i></button>': '',
			    '<span id="',
				cobj.id, 
				'" unselectable="on" style="width:100%;padding:0px 2px">',
				((!Z._disableHeadSort && !cobj.disableHeadSort) ? '<span class="jl-focusable-item" draggable="true">' + sh +'</span>': sh),
				'</span><span unselectable="on" class="jl-tbl-sorter" title="',
				jsletlocale.DBTable.sorttitle,
				'">&nbsp;</span><div  unselectable="on" class="jl-tbl-splitter-hook" colid="',
				cobj.colNum,
				'">&nbsp;</div>'].join('');
		}
		otr.appendChild(oth);	
	}, // end _createHeadCell

	_renderHeader: function() {
		var Z = this;
		if (Z._hideHead) {
			return;
		}
		var otr, otrLeft = null, cobj, otrRight, otd, oth, i, cnt,
			leftHeadObj = Z.leftHeadTbl.createTHead(),
			rightHeadObj = Z.rightHeadTbl.createTHead();
		for(i = 0; i < Z.maxHeadRows; i++) {
			leftHeadObj.insertRow(-1);
			rightHeadObj.insertRow(-1);
		}
		otr = leftHeadObj.rows[0];
		for(i = 0, cnt = Z._sysColumns.length; i < cnt; i++) {
			cobj = Z._sysColumns[i];
			cobj.rowSpan = Z.maxHeadRows;
			Z._createHeadCell(otr, cobj);
		}
		function travHead(arrHeadCfg) {
			var cobj, otr;
			for(var m = 0, ccnt = arrHeadCfg.length; m < ccnt; m++) {
				cobj = arrHeadCfg[m];
				if (cobj.colNum < Z._fixedCols) {
					otr = leftHeadObj.rows[cobj.level];
				} else {
					otr = rightHeadObj.rows[cobj.level];
				}
				Z._createHeadCell(otr, cobj);
				if (cobj.subHeads) {
					travHead(cobj.subHeads);
				}
			}
		}
		travHead(Z.innerHeads);
		var jqTr1, jqTr2, h= Z.headRowHeight();
		for(i = 0; i <= Z.maxHeadRows; i++) {
			jqTr1 = jQuery(leftHeadObj.rows[i]);
			jqTr2 = jQuery(rightHeadObj.rows[i]);
			jqTr1.height(h);
			jqTr2.height(h);
		}
		Z.sortedCell = null;
		Z.indexField = null;
	}, // end renderHead

	getTotalWidth: function(isLeft) {
		var Z= this,
			totalWidth = 0, i, cnt;
		if(!isLeft) {
			for(i = Z._fixedCols, cnt = Z.innerColumns.length; i < cnt; i++) {
				totalWidth += Z.innerColumns[i].width;
			}
		} else {
			for(i = 0, cnt = Z._sysColumns.length; i < cnt; i++) {
				totalWidth += Z._sysColumns[i].width;
			}
			for(i = 0, cnt = Z._fixedCols; i < cnt; i++) {
				totalWidth += Z.innerColumns[i].width;
			}
		}
		return totalWidth;
	},
	
	_doSplitHookDown: function(event) {
		event = jQuery.event.fix( event || window.event );
		var ohook = event.target;
		if (ohook.className != 'jl-tbl-splitter-hook') {
			return;
		}
		var tblContainer = jslet.ui.findFirstParent(ohook, function(el) {
			return el.tagName.toLowerCase() == 'div' && el.jslet && el.jslet._dataset;
		});
		var jqTblContainer = jQuery(tblContainer),
			jqBody = jQuery(document.body), 
			bodyMTop = parseInt(jqBody.css('margin-top')),
			bodyMleft = parseInt(jqBody.css('margin-left')),
			y = jqTblContainer.position().top - bodyMTop,
			jqHook = jQuery(ohook),
			h = jqTblContainer.height() - 20,
			currLeft = jqHook.offset().left - jqTblContainer.offset().left - bodyMleft,
			splitDiv = jqTblContainer.find('.jl-tbl-splitter')[0];
		splitDiv.style.left = currLeft + 'px';
		splitDiv.style.top = '1px';
		splitDiv.style.height = h + 'px';
		jslet.ui.dnd.bindControl(splitDiv);
		tblContainer.jslet.currColId = parseInt(jqHook.attr('colid'));
		tblContainer.jslet.isDraggingColumn = true;
	},

	_doSplitHookUp: function(event) {
		event = jQuery.event.fix( event || window.event );
		var ohook = event.target.lastChild;
		if (!ohook || ohook.className != 'jl-tbl-splitter-hook') {
			return;
		}
		var tblContainer = jslet.ui.findFirstParent(ohook, function(el) {
			return el.tagName.toLowerCase() == 'div' && el.jslet && el.jslet._dataset;
		});

		var jqTblContainer = jQuery(tblContainer),
			jqBody = jQuery(document.body); 
		jqBody.css('cursor','auto');

		var splitDiv = jqTblContainer.find('.jl-tbl-splitter')[0];
		if (splitDiv.style.display != 'none') {
			splitDiv.style.display = 'none';
		}
		tblContainer.jslet.isDraggingColumn = false;
	},

	_getColumnByField: function(fieldName) {
		var Z = this;
		if (!Z.innerColumns) {
			return null;
		}
		var cobj;
		for (var i = 0, cnt = Z.innerColumns.length; i < cnt; i++) {
			cobj = Z.innerColumns[i];
			if (cobj.field == fieldName) {
				return cobj;
			}
		}
		return null;
	},

	_doHeadClick: function(colCfg, ctrlKeyPressed) {
		var Z = this;
		if (Z._disableHeadSort || colCfg.disableHeadSort || Z.isDraggingColumn) {
			return;
		}
		Z._doSort(colCfg.field, ctrlKeyPressed);
	}, // end _doHeadClick

	_doSort: function(sortField, isMultiSort) {
		var Z = this;
		Z._dataset.confirm();
		Z._dataset.disableControls();
		try {
			Z._dataset.toggleIndexField(sortField, !isMultiSort);
			Z.listvm.refreshModel();
		} finally {
			Z._dataset.enableControls();
		}
	},

	_updateSortFlag: function() {
		var Z = this;
		if (Z._hideHead) {
			return;
		}

		var sortFields = Z._dataset.mergedIndexFields();
		
		var leftHeadObj = Z.leftHeadTbl.createTHead(),
			rightHeadObj = Z.rightHeadTbl.createTHead(),
			leftHeadCells, rightHeadCells,
			allHeadCells = [], oth, i, cnt, r,
			rowCnt = leftHeadObj.rows.length;
		for(r = 0; r < rowCnt; r++) {
			leftHeadCells = leftHeadObj.rows[r].cells;
			for (i = 0, cnt = leftHeadCells.length; i < cnt; i++) {
				oth = leftHeadCells[i];
				if (oth.jsletColCfg) {
					allHeadCells[allHeadCells.length] = oth;
				}
			}
		}
		for(r = 0; r < rowCnt; r++) {
			rightHeadCells =  rightHeadObj.rows[r].cells;
			for (i = 0, cnt = rightHeadCells.length; i < cnt; i++) {
				oth = rightHeadCells[i];
				if (oth.jsletColCfg) {
					allHeadCells[allHeadCells.length] = oth;
				}
			}
		}
		var sortDiv, 
			cellCnt = allHeadCells.length;
		for (i = 0; i < cellCnt; i++) {
			oth = allHeadCells[i];
			sortDiv = jQuery(oth).find('.jl-tbl-sorter')[0];
			if (sortDiv) {
				sortDiv.innerHTML = '&nbsp;';
			}
		}
		var fldName, sortFlag, sortObj, 
			k = 1,
			len = sortFields.length;
		for (i = 0; i < len; i++) {
			sortObj = sortFields[i];
			for (var j = 0; j < cellCnt; j++) {
				oth = allHeadCells[j];
				fldName = oth.jsletColCfg.field;
				if (!fldName) {
					continue;
				}
				sortDiv = jQuery(oth).find('.jl-tbl-sorter')[0];
				sortFlag = '&nbsp;';
				if (fldName == sortObj.fieldName) {
					sortFlag = sortObj.order === 1 ? '<i class="fa fa-arrow-up"></i>' : '<i class="fa fa-arrow-down"></i>';
					if (len > 1) {
						sortFlag += k++;
					}
					sortDiv.innerHTML = sortFlag;
					break;
				}
			}
		}
	},

	_doSelectBoxClick: function(event) {
		var ocheck = null;
		if (event) {
			event = jQuery.event.fix( event || window.event );
			ocheck = event.target;
		} else {
			ocheck = this;
		}
		var otr = jslet.ui.getParentElement(ocheck, 2);
		try {
			jQuery(otr).click();// tr click
		} finally {
			var otable = jslet.ui.findFirstParent(otr, function(node) {
				return node.jslet? true: false;
			});
			var oJslet = otable.jslet;

			if (oJslet._onSelect) {
				var flag = oJslet._onSelect.call(oJslet, ocheck.checked);
				if (flag !== undefined && !flag) {
					ocheck.checked = !ocheck.checked;
					return;
				}
			}
			if(oJslet._beforeSelect) {
				oJslet._beforeSelect.call(oJslet);
			}
			oJslet._dataset.select(ocheck.checked ? 1 : 0, oJslet._selectBy);
			oJslet._showCurrentCell();
			if(oJslet._afterSelect) {
				oJslet._afterSelect.call(oJslet);
			}
		}
	}, // end _doSelectBoxClick

	_getTableRow: function(otd, offsetTop) {
		var otr = otd.parentElement,
			rowSpan = otd.rowSpan;
		if(rowSpan < 2) {
			return otr;
		}
		var currIdx = otr.rowIndex;
		var rows = otr.parentElement.rows;
		var height = 0;
		for(var i = currIdx; i < currIdx + rowSpan; i++) {
			otr = rows[i];
			height += otr.offsetHeight;
			if(height >= offsetTop) {
				return otr;
			}
		}
		return otr;
	},
	
	_doCellClick: function(otd, offsetTop, event) {
		var Z = this;
    	var colCfg = otd.jsletColCfg;
    	if(!colCfg) {
    		return;
    	}
    	Z._doRowClick(Z._getTableRow(otd, offsetTop));
		if(colCfg.isSeqCol) { //If the cell is sequence cell, process row selection.
			Z._processRowSelection(event.ctrlKey, event.shiftKey, event.altKey);
		} else {
    		var colNum = colCfg.colNum;
    		if(colNum !== 0 && !colNum) {
    			return;
    		}
			Z._doBeforeSelect(event.ctrlKey, event.shiftKey, event.altKey);
    		Z.currColNum(colNum);
			Z._processSelection(event.ctrlKey, event.shiftKey, event.altKey);
	    	var cellEditor = Z.cellEditor();
	    	if(cellEditor) {
	    		if(Z._isCellEditable(colCfg)) {
	    			var fldName = colCfg.field;
	    			cellEditor.showEditor(fldName, otd);
	    			if(colCfg.isBoolColumn) {
	    				window.setTimeout(function() {
	        				Z._dataset.setFieldValue(fldName, !Z._dataset.getFieldValue(fldName));
	    				}, 5);
	    			}
	    		} else {
	    			cellEditor.hideEditor();
	    		}
	    	}
		}
		if (Z._onCellClick) {
			Z._onCellClick.call(Z, otd);
		}
	},
	
	_doDblCellClick: function(otd, offsetTop) {
    	this._doRowDblClick(this._getTableRow(otd, offsetTop));
	},

	_doRowDblClick: function(otr) {
		if(!otr) {
			return;
		}
		if (this._onRowDblClick) {
			this._onRowDblClick.call(this, otr);
		}
	},

	_doRowClick: function(otr) {
		if(!otr) {
			return;
		}
		var Z = this,
			dsObj = Z.dataset(),
			otrRecno = otr.jsletrecno; 
		if(otrRecno !== dsObj.recno()) {
			if(dsObj.status()) {
				dsObj.confirm();
			}
	
			var rowno = Z.listvm.recnoToRowno(otrRecno);
			Z.listvm.setCurrentRowno(rowno);
			dsObj.recno(Z.listvm.getCurrentRecno());
		}
		if (Z._onRowClick) {
			Z._onRowClick.call(Z, otr);
		}
	},

	_renderCell: function(otr, colCfg, isFirstCol) {
		var Z = this;
		var otd = document.createElement('td');
		otd.noWrap = true;
		otd.jsletColCfg = colCfg;
		jQuery(otd).addClass('jl-tbl-cell');
		otd.innerHTML = '<div class="jl-tbl-cell-div ' + (colCfg.widthCssName || '') + '"></div>';
		var ochild = otd.firstChild;
		var cellRender = colCfg.cellRender || Z._defaultCellRender;
		if (cellRender && cellRender.createCell) {
			cellRender.createCell.call(Z, ochild, colCfg);
		} else if (!Z._isCellEditable(colCfg)) {
				jslet.ui.table.cellRenders.defaultCellRender.createCell.call(Z, ochild, colCfg);
				colCfg.editable = false;
		} else {
			jslet.ui.table.cellRenders.defaultCellRender.createCell.call(Z, ochild, colCfg);
			colCfg.editable = true;
		}
		otr.appendChild(otd);
	},

	_renderRow: function(sectionNum, onlyRefreshContent) {
		var Z = this;
		var rowCnt = 0, leftBody = null, rightBody,
			hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0;
		switch (sectionNum) {
			case 1:
				{//fixed data
					rowCnt = Z._fixedRows;
					if (hasLeft) {
						leftBody = Z.leftFixedTbl.tBodies[0];
					}
					rightBody = Z.rightFixedTbl.tBodies[0];
					break;
				}
			case 2:
				{//data content
					rowCnt = Z.listvm.getVisibleCount();
					if (hasLeft) {
						leftBody = Z.leftContentTbl.tBodies[0];
					}
					rightBody = Z.rightContentTbl.tBodies[0];
					break;
				}
		}
		var otr, oth, colCfg, isfirstCol, 
			startRow = 0, j,
			fldCnt = Z.innerColumns.length;
		if (onlyRefreshContent) {
			startRow = rightBody.rows.length;
		}
		var rh = Z.rowHeight();
		// create date content table row
		for (var i = startRow; i < rowCnt; i++) {
			if (hasLeft) {
				otr = leftBody.insertRow(-1);
				otr.style.height = rh + 'px';

				var sysColLen = Z._sysColumns.length;
				for(j = 0; j < sysColLen; j++) {
					colCfg = Z._sysColumns[j];
					Z._renderCell(otr, colCfg, j === 0);
				}
				
				isfirstCol = sysColLen === 0;
				for(j = 0; j < Z._fixedCols; j++) {
					colCfg = Z.innerColumns[j];
					Z._renderCell(otr, colCfg, isfirstCol && j === 0);
				}
			}
			isfirstCol = !hasLeft;
			otr = rightBody.insertRow(-1);
			otr.style.height = rh + 'px';
			for (j = Z._fixedCols; j < fldCnt; j++) {
				colCfg = Z.innerColumns[j];
				Z._renderCell(otr, colCfg, j == Z._fixedCols);
			}
		}
	},

	_stretchContentRow: function() {
		var Z = this;
		var visibleRowCnt = Z.listvm.getVisibleCount() - Z._fixedRows, 
			leftBody = null, leftRows = null,
			rightBody, rightRows,
			hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0;

		if (hasLeft) {
			leftBody = Z.leftContentTbl.tBodies[0];
			leftRows = leftBody.rows;
		}
		rightBody = Z.rightContentTbl.tBodies[0];
		rightRows = rightBody.rows;
		var i, oldRowCount = rightRows.length;
		//Hide the extra rows
		for(i = visibleRowCnt; i < oldRowCount; i++) {
			if(hasLeft) {
				leftRows[i].style.display = 'none';
			}
			rightRows[i].style.display = 'none';
		}
		
		var otr, colCfg, isfirstCol, j,
			fldCnt = Z.innerColumns.length,
			rh = Z.rowHeight();
		// create date content table row
		for (i = 0; i < visibleRowCnt; i++) {
			if (i < oldRowCount) {
				if(hasLeft) {
					leftRows[i].style.display = 'table-row';
				}
				rightRows[i].style.display = 'table-row';
				continue;
			}
			if (hasLeft) {
				otr = leftBody.insertRow(-1);
				otr.style.height = rh + 'px';

				var sysColLen = Z._sysColumns.length;
				for(j = 0; j < sysColLen; j++) {
					colCfg = Z._sysColumns[j];
					Z._renderCell(otr, colCfg, j === 0);
				}
				
				isfirstCol = sysColLen === 0;
				for(j = 0; j < Z._fixedCols; j++) {
					colCfg = Z.innerColumns[j];
					Z._renderCell(otr, colCfg, isfirstCol && j === 0);
				}
			}
			isfirstCol = !hasLeft;
			otr = rightBody.insertRow(-1);
			otr.style.height = rh + 'px';
			for (j = Z._fixedCols; j < fldCnt; j++) {
				colCfg = Z.innerColumns[j];
				Z._renderCell(otr, colCfg, j == Z._fixedCols);
			}
		}
	},
	
	_renderBody: function(onlyRefreshContent) {
		var Z = this;
		if (onlyRefreshContent) {
			Z._renderRow(2, true);
		} else {
			Z._renderRow(1);
			Z._renderRow(2);
			Z._renderTotalSection();
		}
	}, // end _renderBody

	_renderTotalSection: function() {
		var Z = this;
		if (!Z.footSectionHt) {
			return;
		}
		var hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0,
			leftBody,
			rightBody,
			otr, colCfg, j, len;
		if (hasLeft) {
			leftBody = Z.leftFootTbl.tBodies[0];
		}
		rightBody = Z.rightFootTbl.tBodies[0];
		
		function createCell(colCfg) {
			var otd = document.createElement('td');
			otd.noWrap = true;
			otd.innerHTML = '<div class="jl-tbl-footer-div ' + (colCfg.widthCssName || '') + '"></div>';
			otd.jsletColCfg = colCfg;
			return otd;
		}
		
		if (hasLeft) {
			otr = leftBody.insertRow(-1);
			otr.style.height = Z.footerRowHeight() + 'px';

			for(j = 0, len = Z._sysColumns.length; j < len; j++) {
				colCfg = Z._sysColumns[j];
				otr.appendChild(createCell(colCfg));
			}
			
			for(j = 0; j < Z._fixedCols; j++) {
				colCfg = Z.innerColumns[j];
				otr.appendChild(createCell(colCfg));
			}
		}
		otr = rightBody.insertRow(-1);
		otr.style.height = Z.footerRowHeight() + 'px';
		for (j = Z._fixedCols, len = Z.innerColumns.length; j < len; j++) {
			colCfg = Z.innerColumns[j];
			otr.appendChild(createCell(colCfg));
		}
	},
	
	_fillTotalSection: function() {
		var Z = this,
			aggregateValues = Z._dataset.aggregatedValues();
		if (!Z.footSectionHt || !aggregateValues) {
			return;
		}
		var sysColCnt = Z._sysColumns.length,
			hasLeft = Z._fixedCols > 0 || sysColCnt > 0,
			otrLeft, otrRight;
		if (hasLeft) {
			otrLeft = Z.leftFootTbl.tBodies[0].rows[0];
		}
		otrRight = Z.rightFootTbl.tBodies[0].rows[0];

		var otd, k = 0, fldObj, cobj, fldName, totalValue;
		var aggregateValueObj,
			labelDisplayed = false,
			canShowLabel = true;
		if(sysColCnt > 0) {
			otd = otrLeft.cells[sysColCnt - 1];
			otd.innerHTML = jsletlocale.DBTable.totalLabel;
			canShowLabel = false;
		}
		var colNum;
		for (var i = 0, len = Z.innerColumns.length; i < len; i++) {
			cobj = Z.innerColumns[i];
			colNum = cobj.colNum;
			if (colNum < Z._fixedCols) {
				otd = otrLeft.cells[colNum + sysColCnt];
			} else {
				otd = otrRight.cells[colNum - Z._fixedCols];
			}
			otd.style.textAlign = 'right';

			fldName = cobj.field;
			aggregateValueObj = aggregateValues[fldName];
			if (!aggregateValueObj) {
				if(canShowLabel) {
					var content;
					if(labelDisplayed) {
						content = '&nbsp;';
					} else {
						content = jsletlocale.DBTable.totalLabel;
						labelDisplayed = true;
					}
					otd.firstChild.innerHTML = content;
					otd.firstChild.title = '';
				}
				continue;
			}
			canShowLabel = false;
			fldObj = Z._dataset.getField(fldName);
			if(fldObj.getType() === jslet.data.DataType.NUMBER) {
				totalValue = aggregateValueObj.sum;
			} else {
				totalValue = aggregateValueObj.count;
			}
			if(!totalValue) {
				otd.firstChild.innerHTML = '&nbsp;';
				otd.firstChild.title = '';
				continue;
			}
			var dispFmt = fldObj.displayFormat();
			var displayValue = totalValue;
			if(dispFmt && fldObj.getType() === jslet.data.DataType.NUMBER) {
				displayValue = totalValue? jslet.formatNumber(totalValue, dispFmt) : '';
			}
			otd.firstChild.innerHTML = displayValue;
			otd.firstChild.title = displayValue;
		}
	},
	
	_fillData: function() {
		var Z = this;
		var preRecno = Z._dataset.recno(),
			allCnt = Z.listvm.getNeedShowRowCount(),
			h = allCnt * Z.rowHeight();
		Z._setScrollBarMaxValue(h);
		var noRecord = Z.dataset().recordCount() === 0;
		Z.noRecordDiv.style.display = (noRecord ?'block':'none');
		var oldRecno = Z._dataset.recnoSilence();
		try {
			Z._fillRow(true);
			Z._fillRow(false);
			if (Z.footSectionHt) {
				Z._fillTotalSection();
			}
		} finally {
			Z._dataset.recnoSilence(oldRecno);
		}
		Z._refreshSeqColWidth();
		if(Z._cellEditor && noRecord) {
			Z._cellEditor.hideEditor();
		}
	},

	_fillRow: function(isFixed) {
		var Z = this,
			rowCnt = 0, start = 0, leftBody = null, rightBody,
			hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0;
			
		if (isFixed) {
			rowCnt = Z._fixedRows;
			start = -1 * Z._fixedRows;
			if (rowCnt === 0) {
				return;
			}
			if (hasLeft) {
				leftBody = Z.leftFixedTbl.tBodies[0];
			}
			rightBody = Z.rightFixedTbl.tBodies[0];
		} else {
			rowCnt = Z.listvm.getVisibleCount();
			start = Z.listvm.getVisibleStartRow();
			if (hasLeft) {
				leftBody = Z.leftContentTbl.tBodies[0];
			}
			rightBody = Z.rightContentTbl.tBodies[0];
		}
		
		var otr, colCfg, isfirstCol, recNo = -1, cells, clen, otd, j, 
			fldCnt = Z.innerColumns.length,
			allCnt = Z.listvm.getNeedShowRowCount() - Z.listvm.getVisibleStartRow(),
			fixedRows = hasLeft ? leftBody.rows : null,
			contentRows = rightBody.rows,
			sameValueNodes = {},
			isFirst = true,
			actualCnt = Math.min(contentRows.length, rowCnt);

		for (var i = 0; i < actualCnt ; i++) {
			if (i + (isFixed? start: 0) >= allCnt) {
				if (hasLeft) {
					otr = fixedRows[i];
					otr.style.display = 'none';
				}
				otr = contentRows[i];
				otr.style.display = 'none';
				continue;
			}

			Z.listvm.setCurrentRowno(i + start, true);
			recNo = Z.listvm.getCurrentRecno();
			Z._dataset.recnoSilence(recNo);
			if (hasLeft) {
				otr = fixedRows[i];
				otr.jsletrecno = recNo;
				otr.style.display = '';
				if (Z._onFillRow) {
					Z._onFillRow.call(Z, otr, Z._dataset);
				}
				cells = otr.childNodes;
				clen = cells.length;
				for (j = 0; j < clen; j++) {
					otd = cells[j];
					Z._fillCell(recNo, otd, sameValueNodes, isFirst);
				}
			}

			otr = contentRows[i];
			otr.jsletrecno = recNo;
			otr.style.display = '';
			if (Z._onFillRow) {
				Z._onFillRow.call(Z, otr, Z._dataset);
			}
			// fill content table
			otr = contentRows[i];
			cells = otr.childNodes;
			clen = cells.length;
			for (j = 0; j < clen; j++) {
				otd = cells[j];
				Z._fillCell(recNo, otd, sameValueNodes, isFirst);
			} //end for data content field
			isFirst = 0;
		} //end for records
		Z.listvm.setCurrentRowno(0, true);
	},

	_fillCell: function(recNo, otd, sameValueNodes, isFirst) {
		var Z = this,
			colCfg = otd.jsletColCfg;
		if (!colCfg) {
			return;
		}
		var fldName = colCfg.field,
			cellPanel = otd.firstChild,
			jqTd;
		
		if (Z._onFillCell) {
			Z._onFillCell.call(Z, cellPanel, Z._dataset, fldName);
		}
		if (fldName && colCfg.mergeSame && sameValueNodes) {
			if (isFirst || !Z._dataset.isSameAsPrevious(fldName)) {
				sameValueNodes[fldName] = { cell: otd, count: 1 };
				jqTd = jQuery(otd);
				jqTd.attr('rowspan', 1);
				if(Z._editable) {
					var offset = jqTd.offset();
					jqTd.attr('jsletFirstId', null);
					if(!otd.id) {
						otd.id = jslet.nextId();
					}
				}
				otd.style.display = '';
			}
			else {
				var sameNode = sameValueNodes[fldName];
				sameNode.count++;
				otd.style.display = 'none';
				var jqFirstTd = jQuery(sameNode.cell);
				if(Z._editable) {
					jQuery(otd).attr('jsletOffsetHeight', (sameNode.count -1) * Z.rowHeight()).attr('jsletFirstId', jqFirstTd.attr('id'));
				}
				jqFirstTd.attr('rowspan', sameNode.count);
			}
		}
		var cellRender = colCfg.cellRender || Z._defaultCellRender;
		if (cellRender && cellRender.refreshCell) {
			cellRender.refreshCell.call(Z, cellPanel, colCfg, recNo);
		} else {
			jslet.ui.table.cellRenders.defaultCellRender.refreshCell.call(Z, cellPanel, colCfg, recNo);
		}
		if(fldName) {
			var errObj = Z._dataset.getFieldErrorByRecno(recNo, fldName);
			jqTd = jQuery(otd);
			var title = cellPanel.title;
			if(errObj && errObj.message) {
				if(!jqTd.hasClass('has-error')) {
					jqTd.addClass('has-error');
				}
				cellPanel.title = errObj.message;
			} else {
				if(jqTd.hasClass('has-error')) {
					jqTd.removeClass('has-error');
				}
			}
		}
	},

	refreshCurrentRow: function() {
		var Z = this,
			hasLeft = Z._fixedCols > 0 || Z._hasSeqCol || Z._hasSelectCol,
			fixedBody = null, contentBody, idx,
			recno = Z._dataset.recno();

		if (recno < Z._fixedRows) {
			if (hasLeft) {
				fixedBody = Z.leftFixedTbl.tBodies[0];
			}
			contentBody = Z.rightFixedTbl.tBodies[0];
			idx = recno;
		}
		else {
			if (hasLeft) {
				fixedBody = Z.leftContentTbl.tBodies[0];
			}
			contentBody = Z.rightContentTbl.tBodies[0];
			idx = Z.listvm.recnoToRowno(Z._dataset.recno()) - Z.listvm.getVisibleStartRow();
		}

		var otr, cells, otd, recNo, colCfg, j, clen;

		if (hasLeft) {
			otr = fixedBody.rows[idx];
			if (!otr) {
				return;
			}
			cells = otr.childNodes;
			recNo = otr.jsletrecno;
			if (Z._onFillRow) {
				Z._onFillRow.call(Z, otr, Z._dataset);
			}
			var ocheck;
			for (j = 0, clen = cells.length; j < clen; j++) {
				otd = cells[j];
				colCfg = otd.jsletColCfg;
				if (colCfg && colCfg.isSeqCol) {
					colCfg.cellRender.refreshCell.call(Z, otd.firstChild, colCfg);
					continue;
				}
				if (colCfg && colCfg.isSelectCol) {
					ocheck = otd.firstChild;
					ocheck.checked = Z._dataset.selected();
					continue;
				}
				Z._fillCell(recNo, otd);
			}
		}

		otr = contentBody.rows[idx];
		if (!otr) {
			return;
		}
		recNo = otr.jsletrecno;
		if (Z._onFillRow) {
			Z._onFillRow.call(Z, otr, Z._dataset);
		}
		// fill content table
		cells = otr.childNodes;
		for (j = 0, clen = cells.length; j < clen; j++) {
			otd = cells[j];
			Z._fillCell(recNo, otd);
		}
	},

	_getLeftRowByRecno: function(recno) {
		var Z = this;
		if (recno < Z._fixedRows) {
			return Z.leftFixedTbl.tBodies[0].rows[recno];
		}
		var rows = Z.leftContentTbl.tBodies[0].rows, row;
		for (var i = 0, cnt = rows.length; i < cnt; i++) {
			row = rows[i];
			if (row.jsletrecno == recno) {
				return row;
			}
		}
		return null;
	}, // end _getLeftRowByRecno

	_showCurrentRow: function(checkVisible) {//Check if current row is in visible area
		var Z = this,
			rowno = Z.listvm.recnoToRowno(Z._dataset.recno());
		Z.listvm.setCurrentRowno(rowno, false, checkVisible);
		Z._showCurrentCell();
	},

	_hideCurrentRow: function() {
		var Z = this;
		if (Z._currRow) {
			if (Z._currRow.fixed) {
				jQuery(Z._currRow.fixed).removeClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
			}
			jQuery(Z._currRow.content).removeClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
		}
		
	},
	
	_getTrByRowno: function(rowno) {
		var Z = this, 
			hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0,
			idx, otr, k, rows, row, fixedRow;

		if (rowno < 0) {//fixed rows
			rows = Z.rightFixedTbl.tBodies[0].rows;
			k = Z._fixedRows + rowno;
			row = rows[k];
			fixedRow = (hasLeft ? Z.leftFixedTbl.tBodies[0].rows[k] : null);
			return { fixed: fixedRow, content: row };
		}
		//data content
		rows = Z.rightContentTbl.tBodies[0].rows;
		k = rowno - Z.listvm.getVisibleStartRow();
		if (k >= 0) {
			row = rows[k];
			if (!row) {
				return null;
			}
			fixedRow = hasLeft ? Z.leftContentTbl.tBodies[0].rows[k] : null;
			return { fixed: fixedRow, content: row };
		}
		return null;
	},

	_getCurrCellEl: function() {
		var Z = this;
		if(!Z._currRow) {
			return null;
		}
		var contentRow = Z._currRow.content,
			cells = contentRow.cells, 
			cellEl, colCfg;
		for(var i = 0, len = cells.length; i < len; i++) {
			cellEl = cells[i];
			colCfg = cellEl.jsletColCfg;
			if(colCfg && colCfg.colNum === Z._currColNum) {
				return cellEl;
			}
		}
		return null;
	},
	
	_adjustCurrentCellPos: function(isLeft) {
		var Z = this;
		if(!Z._currRow) {
			return;
		}
		var jqEl = jQuery(Z.el),
			jqContentPanel = jqEl.find('.jl-tbl-contentcol'),
			contentPanel = jqContentPanel[0],
			oldScrLeft = contentPanel.scrollLeft;
		if(Z._currColNum < Z._fixedCols) { //If current cell is in fixed content area
			return;
		}
		var currTd = Z._getCurrCellEl(),
			currTdLeft = currTd.offsetLeft,
			currTdWidth = currTd.offsetWidth,
			containerWidth = contentPanel.clientWidth,
			containerLeft = contentPanel.scrollLeft;
		if(currTdLeft < containerLeft) {
			contentPanel.scrollLeft = currTdLeft;
			return;
		}
		if(currTdLeft + currTdWidth > containerLeft + containerWidth) {
			contentPanel.scrollLeft = currTdLeft + currTdWidth - containerWidth;
		}
	},

	_isCurrCellInView: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			jqContentPanel = jqEl.find('.jl-tbl-contentcol'),
			contentPanel = jqContentPanel[0],
			borderW = (Z._noborder ? 0: 2),
			oldScrLeft = contentPanel.scrollLeft,
			currColLeft = 0, i, len;
		if(Z._currColNum < Z._fixedCols) { //If current cell is in fixed content area
			return true;
		}
		for(i = Z._fixedCols, len = Z.innerColumns.length; i < Z._currColNum; i++) {
			currColLeft += (Z.innerColumns[i].width + borderW); //"2" is the cell border's width(left+right)
		}
		if(currColLeft < oldScrLeft) {
			return false; 
		}
		var containerWidth = jqContentPanel.innerWidth(),
			contentWidth = jqContentPanel.find('.jl-tbl-content-div').width(),
			scrWidth = 0;
		for(i = Z.innerColumns.length - 1; i > Z._currColNum; i--) {
			scrWidth += (Z.innerColumns[i].width + borderW); //"2" is the cell border's width(left+right)
		}
		currColLeft = contentWidth - scrWidth - containerWidth;
		currColLeft = (currColLeft >= 0? currColLeft: 0);
		if(currColLeft > oldScrLeft) {
			return false; 
		}
		
		return true;
	},
	
	_showCurrentCell: function() {
		var Z = this,
			rowObj = Z._currRow;
		if(!rowObj) {
			return;
		}
		var otr;
		if(Z._currColNum >= Z._fixedCols) {
			otr = rowObj.content;
		} else {
			otr = rowObj.fixed;
		}
		var recno = otr.jsletrecno;
    	var cellEditor = Z.cellEditor();
		if(recno !== Z._dataset.recno()) {
    		if(Z.prevCell) {
    			Z.prevCell.removeClass('jl-tbl-curr-cell');
    		}
        	if(cellEditor) {
       			cellEditor.hideEditor();
        	}
			return;
		}
		var ocells = otr.cells, otd, colCfg, found = false;
		for(var i = 0, len = ocells.length; i < len; i++) {
			otd = ocells[i];
        	colCfg = otd.jsletColCfg;
        	if(colCfg && colCfg.colNum == Z._currColNum) {
        		if(Z.prevCell) {
        			Z.prevCell.removeClass('jl-tbl-curr-cell');
        		}
        		var jqCell = jQuery(otd);
        		jqCell.addClass('jl-tbl-curr-cell');
        		Z.prevCell = jqCell;
        		found = true;
        		break;
        	}
		}
    	if(cellEditor && found) {
    		if(Z._isCurrCellInView()) {
    			cellEditor.showEditor(colCfg.field, otd);
    		} else {
    			cellEditor.hideEditor();
    		}
    	}
	},
	
	_showSelected: function(otd, fldName, recno) {
		var Z = this,
			jqCell = jQuery(otd);
		if(recno === undefined) {
			recno = Z._dataset.recno();
		}
		var isSelected = Z._dataset.selection.isSelected(recno, fldName);
		if(isSelected) {
			jqCell.addClass('jl-tbl-selected');
		} else {
			jqCell.removeClass('jl-tbl-selected');
		}
	},
	
	_refreshSelection: function() {
		var Z = this;
		jQuery(Z.el).find('td.jl-tbl-cell').each(function(k, otd) {
        	var colCfg = otd.jsletColCfg;
        	var recno = parseInt(otd.parentNode.jsletrecno);
        	if((recno || recno === 0) && colCfg) {
        		var fldName = colCfg.field;
        		if(fldName) {
        			Z._showSelected(otd, fldName, recno);
        		}
        	}
		});
	},
	
	_syncScrollBar: function(rowno) {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var	sw = rowno * Z.rowHeight();
		Z._keep_silence_ = true;
		try {
			var scrBar = Z.jqVScrollBar[0];
			window.setTimeout(function() {
				scrBar.scrollTop = sw;
			}, 10);
		} finally {
			Z._keep_silence_ = false;
		}
	},

	/**
	 * Toggle(expand/collapse) the current record expanded status, enabled for tree style table.
	 */
	toggle: function() {
		var Z = this;
		if(Z._dataset.recordCount() === 0) {
			return;
		}
		var expanded = Z._dataset.expandedByRecno(Z._dataset.recno());
		if (expanded) {
			Z.listvm.collapse(function() {
				Z._fillData();
			});
		} else {
			Z.listvm.expand(function() {
				Z._fillData();
			});
		}
	},
	
	/**
	 * Expand the current record, enabled for tree style table.
	 */
	expand: function() {
		var Z = this;
		if(Z._dataset.recordCount() === 0) {
			return;
		}
		var expanded = Z._dataset.expandedByRecno(Z._dataset.recno());
		if (!expanded) {
			Z.listvm.expand(function() {
				Z._fillData();
			});
		}
	},
	
	/**
	 * Collapse the current record, enabled for tree style table.
	 */
	collapse: function() {
		var Z = this;
		if(Z._dataset.recordCount() === 0) {
			return;
		}
		var expanded = Z._dataset.expandedByRecno(Z._dataset.recno());
		if (expanded) {
			Z.listvm.collapse(function() {
				Z._fillData();
			});
		}
	},
	
	/**
	 * Expand all records, enabled for tree style table.
	 */
	expandAll: function() {
		var Z = this;
		Z.listvm.expandAll(function() {
			Z._fillData(); 
		});
	},

	/**
	 * Collapse all records, enabled for tree style table.
	 */
	collapseAll: function() {
		var Z = this;
		Z.listvm.collapseAll(function() {
			Z._fillData(); 
		});
	},

	/**
	 * @override
	 */
	_doMetaChanged: function(metaName, fldName) {
		var Z = this;
		if(!fldName) {
			Z.renderAll();
			return;
		}
		if(metaName == 'label' && !Z._hideHead) {
			Z._refreshHeadCell(fldName);
			return;
		}
		
		if(metaName == 'required' && Z._editable && !Z._hideHead) {
			Z._refreshHeadCell(fldName);
			return;
		}

		if(metaName == 'visible') {
			
		}
		if(Z._editable && (metaName == 'readOnly' || metaName == 'disabled')) {
			var cellEditor = Z.cellEditor();
			if(cellEditor) {
				var currFld = cellEditor.currentField();
				if(currFld == fldName) {
					cellEditor.showEditor(fldName);
				}
			}
		}
	},
	
	refreshControl: function(evt) {
		var Z = this, i, cnt, otr, otd, checked, ocheckbox, col, recno,
			evtType = evt.eventType;
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
			Z._doMetaChanged(evt.metaName, evt.fieldName);
		} else if (evtType == jslet.data.RefreshEvent.AGGREGATED) {
			Z._fillTotalSection();			
		} else if (evtType == jslet.data.RefreshEvent.BEFORESCROLL) {
			
		} else if (evtType == jslet.data.RefreshEvent.SCROLL) {
			if (Z._dataset.recordCount() === 0) {
				return;
			}
			Z._showCurrentRow(true);
		} else if (evtType == jslet.data.RefreshEvent.UPDATEALL) {
			if(!Z.listvm) {
				return;
			}
			Z._hideCurrentRow();
			Z.listvm.refreshModel();
			Z._stretchContentHeight();
			Z._updateSortFlag(true);
			if(Z._dataset.recordCount() === 0) {
				Z._currRow = null;
			}
			Z._fillData();
			Z._showCurrentRow(true);
			if(Z._filterPanel) {
				Z._filterPanel.checkFilterBtnStyle();
			}
			//Clear "Select all" checkbox
			if(Z._hasSelectCol) {
				jQuery(Z.el).find('.jl-tbl-select-all')[0].checked = false;
			}
		} else if (evtType == jslet.data.RefreshEvent.UPDATERECORD) {
			var fldName = evt.fieldName;
			if(fldName) {
				var fldObj = Z._dataset.getField(fldName);
				if(fldObj && fldObj.mergeSame()) {
					Z._fillData();
					return;
				}
			}
			Z.refreshCurrentRow();
		} else if (evtType == jslet.data.RefreshEvent.UPDATECOLUMN || evtType == jslet.data.RefreshEvent.UPDATELOOKUP) {
			Z._fillData();
		} else if (evtType == jslet.data.RefreshEvent.INSERT) {
			Z.listvm.refreshModel();
			Z._stretchContentHeight();
			recno = Z._dataset.recno();
			var	preRecno = evt.preRecno;

			Z._fillData();
			Z._keep_silence_ = true;
			try {
				Z.refreshControl(jslet.data.RefreshEvent.scrollEvent(recno, preRecno));
			} finally {
				Z._keep_silence_ = false;
			}
		} else if (evtType == jslet.data.RefreshEvent.DELETE) {
			Z.listvm.refreshModel();
			Z._stretchContentHeight();
			Z._fillData();
			if(Z._dataset.recordCount() === 0) {
				Z._currRow = null;
			}
		} else if (evtType == jslet.data.RefreshEvent.SELECTRECORD) {
			if (!Z._hasSelectCol) {
				return;
			}
			col = 0;
			if (Z._hasSeqCol) {
				col++;
			}
			recno = evt.recno;
			for(i = 0, cnt = recno.length; i < cnt; i++) {
				otr = Z._getLeftRowByRecno(recno[i]);
				if (!otr) {
					continue;
				}
				otd = otr.cells[col];
				checked = evt.selected ? true : false;
				ocheckbox = jQuery(otd).find('[type=checkbox]')[0];
				ocheckbox.checked = checked;
				ocheckbox.defaultChecked = checked;
			}
		} else if (evtType == jslet.data.RefreshEvent.SELECTALL) {
			if (!Z._hasSelectCol) {
				return;
			}
			col = 0;
			if (Z._hasSeqCol) {
				col++;
			}
			var leftFixedBody = Z.leftFixedTbl.tBodies[0],
				leftContentBody = Z.leftContentTbl.tBodies[0],
				rec,
				oldRecno = Z._dataset.recno();

			try {
				for (i = 0, cnt = leftFixedBody.rows.length; i < cnt; i++) {
					otr = leftFixedBody.rows[i];
					if (otr.style.display == 'none') {
						break;
					}
					Z._dataset.recnoSilence(otr.jsletrecno);
					checked = Z._dataset.selected() ? true : false;
					otd = otr.cells[col];
					ocheckbox = jQuery(otd).find('[type=checkbox]')[0];
					ocheckbox.checked = checked;
					ocheckbox.defaultChecked = checked;
				}

				for (i = 0, cnt = leftContentBody.rows.length; i < cnt; i++) {
					otr = leftContentBody.rows[i];
					if (otr.style.display == 'none') {
						break;
					}
					Z._dataset.recnoSilence(otr.jsletrecno);
					checked = Z._dataset.selected() ? true : false;
					otd = otr.cells[col];
					ocheckbox = jQuery(otd).find('[type=checkbox]')[0];
					ocheckbox.checked = checked;
					ocheckbox.defaultChecked = checked;
				}
			} finally {
				Z._dataset.recnoSilence(oldRecno);
			}
		} //end event selectall
	}, // refreshControl

	_isCellEditable: function(colCfg) {
		var Z = this;
		if (!Z._editable) {
			return false;
		}
		var fldName = colCfg.field;
		if (!fldName) {
			return false;
		}
		if(Z._editableFields && Z._editableFields.length > 0 && Z._editableFields.indexOf(fldName) < 0) {
			return false;
		}
		if(Z._readOnlyFields && Z._readOnlyFields.length > 0 && Z._readOnlyFields.indexOf(fldName) >=0) {
			return false;
		}
		var fldObj = Z._dataset.getField(fldName),
			isEditable = !fldObj.fieldDisabled() && !fldObj.fieldReadOnly() ? 1 : 0;
		return isEditable;
	},
	
	_doAppendRecord: function() {
		var Z = this;
		if(Z._onAppendRecord) {
			Z._onAppendRecord.call(Z);
		} else {
			Z._dataset.appendRecord();
		}
	},
	
	_doDeleteRecord: function() {
		var Z = this;
		if(Z._onDeleteRecord) {
			Z._onDeleteRecord.call(Z);
		} else {
			Z._dataset.deleteRecord();
		}
	},
	
	/**
	 * @protected
	 * 
	 * Run when container size changed, it's revoked by jslet.ui.resizeEventBus.
	 * 
	 */
	checkSizeChanged: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			newHeight = jqEl.height();
		if (newHeight == Z._oldHeight) {
			return;
		}
		Z.height = newHeight;
		Z.renderAll();
	},
	
	_innerDestroy: function() {
		var Z = this, 
			jqEl = jQuery(Z.el);
		Z._currRow = null;
		Z._oldVisibleRows = -1;
		Z.listvm.reset();
		Z.leftHeadTbl = null;
		Z.rightHeadTbl = null;
		jQuery(Z.rightHeadTbl).off();

		Z.leftFixedTbl = null;
		Z.rightFixedTbl = null;

		Z.leftContentTbl = null;
		Z.rightContentTbl = null;

		Z.leftFootTbl = null;
		Z.rightFootTbl = null;
		
		Z.noRecordDiv = null;
		if(Z.jqVScrollBar) {
			Z.jqVScrollBar.off();
		}
		Z.jqVScrollBar = null;
		
		var splitter = jqEl.find('.jl-tbl-splitter')[0];
		if(splitter) {
			splitter._doDragging = null;
			splitter._doDragEnd = null;
			splitter._doDragCancel = null;
		}
		Z.parsedHeads = null;
		Z.prevCell = null;
		
		jqEl.find('.jl-tbl-select-check').off();
		if(Z._filterPanel) {
			Z._filterPanel.destroy();
			Z._filterPanel = null;
		}
		
		if(Z._findDialog) {
			Z._findDialog.destroy();
			Z._findDialog = null;
		}
		
		if(Z._cellEditor) {
			Z._cellEditor.destroy();
			Z._cellEditor = null;
		}		
	},
	
	/**
	 * @override
	 */
	destroy: function($super) {
		var Z = this, 
			jqEl = jQuery(Z.el);
		jslet.ui.resizeEventBus.unsubscribe(Z);
		jqEl.off();
		Z._innerDestroy();
		Z.listvm.destroy();
		Z.listvm = null;
		$super();
	} 
});

/**
 * @class
 * @extend jslet.ui.AbstractDBTable
 * 
 * DBTable is a powerful control, features: <br />
 * <ol>
 * <li>
 * <dl><dt>Sort Data</dt><dd>Clicking column header text to sort data, SHIFT + Clicking column header text to sort data with multiple columns.</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Find Data</dt><dd>Pressing CTRL + F to pop up finding dialog.</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Filter Data</dt><dd>Pressing the down-arrow of each column header to pop up filtering dialog.</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Copy Data to Clipboard</dt><dd>First select cells(CTRL + A, CTRL/SHIFT + Clicking Cell), pressing CTRL + C to copy data.</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Find Error Record</dt><dd>When importing records or batch editing records, press CTRL + E to find the next record existing error.</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Multi-Layer Column Header</dt><dd>Set dataset field's property "children".</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Change Column Width</dt><dd>Drag and drop column line.</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Move Column</dt><dd>Drag and drop column header.</dd></dl>
 * </li>
 * <li>
 * <dl><dt>Support Sequence Column</dt><dd>Set property "hasSeqCol" to true to show sequence column; <br />
 * Set property "reverseSeqCol" to "true" to reverse sequence no; <br />
 * Set property "seqColHeader" to customize sequence header. </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Support Select Column</dt>
 * <dd>Set property "hasSelectCol" to "true" to show select column.<br />
 * Clicking "Select Column" header to select all records.<br />
 * Set property "selectBy" to group select records.<br />
 * Set dataset event "onCheckSelectable" to check which records can be selected. 
 * </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Support Action Column</dt><dd>Add a "ACTION" type field to dataset. </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Support Edit Action Column</dt><dd>Add a "EDITACTION" type field to dataset. </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Support Fixed rows or columns</dt><dd>Set value to properties "fixedRows" or "fixedCols". </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Support "Total" row</dt><dd>Set the dataset field's properties: "aggregated" and "aggregatedBy". </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Support Merge Rows with Same Value</dt><dd>Set the dataset field's properties: "mergeSame" and "mergeSameBy". </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Tree-Grid Style</dt><dd>Set property: "treeField". </dd></dl>
 * </li>
 * <li>
 * <dl><dt>In-cell Edit</dt><dd>Set property: "editable" to true. </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Customize Table Style</dt><dd>Use: "noborder", "onFillRow", "onFillCell", "hideHead" to customize. </dd></dl>
 * </li>
 * <li>
 * <dl><dt>Stretch Table Height Automatically</dt><dd>Use: "autoStretch", "minVisibleRows", "onFillCell", "maxVisibleRows" to customize. </dd></dl>
 * </li>
 * </ol>
 * 
 * Example:
 * 
 *     @example
 *     var jsletParam = {type:"DBTable", dataset: "employee"};
 * 
 *     //1. Declaring:
 *     <div id="chartId" data-jslet='type:"DBTable", dataset: "employee"' />
 *     or
 *     <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *     <div id="ctrlId"  />
 *     //Js snippet
 *     var el = document.getElementById('ctrlId');
 *     jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBTable = jslet.Class.create(jslet.ui.AbstractDBTable, {});

jslet.ui.register('DBTable', jslet.ui.DBTable);
jslet.ui.DBTable.htmlTemplate = '<div></div>';

/*
* Splitter: used in jslet.ui.DBTable
*/
jslet.ui.Splitter = function() {
	if (!jslet.ui._splitDiv) {
		var odiv = document.createElement('div');
		odiv.className = 'jl-split-column';
		odiv.style.display = 'none';
		jslet.ui._splitDiv = odiv;
		document.body.appendChild(odiv);
		odiv = null;
	}
	
	this.isDragging = false;
	
	this.attach = function(el, left, top, height) {
		if (!height) {
			height = jQuery(el).height();
		}
		var odiv = jslet.ui._splitDiv;
		odiv.style.height = height + 'px';
		odiv.style.left = left + 'px';
		odiv.style.top = top + 'px';
		odiv.style.display = 'block';
		jslet.ui.dnd.bindControl(this);
		this.isDragging = false;
	};
	
	this.unattach = function() {
		jslet.ui._splitDiv.style.display = 'none';
		this.onSplitEnd = null;
		this.onSplitCancel = null;
	};
	
	this.onSplitEnd = null;
	this.onSplitCancel = null;
	
	this._doDragEnd = function(oldX, oldY, x, y, deltaX, deltaY) {
		jslet.ui.dnd.unbindControl();
		if (this.onSplitEnd) {
			this.onSplitEnd(x - oldX);
		}
		this.unattach();
		this.isDragging = false;
	};
	
	this._doDragging = function(oldX, oldY, x, y, deltaX, deltaY) {
		this.isDragging = true;
		jslet.ui._splitDiv.style.left = x + 'px';
	};
	
	this._doDragCancel = function() {
		jslet.ui.dnd.unbindControl();
		if (this.onSplitCancel) {
			this.onSplitCancel();
		}
		this.unattach();
		this.isDragging = false;
	};
};

if(!jslet.ui.table) {
	jslet.ui.table = {};
}

/*
 * Filter panel for DBTable
 */
jslet.ui.table.DBTableFilterPanel = function(tblCtrl) {
	var Z = this;
	Z._width = 300;
	Z._height = 150;
	Z.fieldName = null;
	Z._filterDatasetObj = new jslet.data.FilterDataset(tblCtrl.dataset());
	Z._filterDataset = Z._filterDatasetObj.filterDataset();
	Z._filterDataset.getField('lParenthesis').visible(false);
	Z._filterDataset.getField('rParenthesis').visible(false);
	Z._filterDataset.getField('logicalOpr').visible(false);
	Z._filterDataset.getField('valueExprInput').visible(false);
	Z._dbtable = tblCtrl;
	Z._jqFilterBtn = null;
	Z._currFieldName = null;
	Z._currFilterExpr = null;
};

jslet.ui.table.DBTableFilterPanel.prototype = {
	
	jqFilterBtn: function(jqFilterBtn) {
		this._jqFilterBtn = jqFilterBtn;
	},
		
	changeField: function(fldName) {
		var dsFilter = this._filterDataset,
			fldObj = dsFilter.getField('field'),
			lkDs = fldObj.lookup().dataset();
		dsFilter.cancel();
		lkDs.filter('[name] == "' + fldName +'" || like([name],"'+ fldName + '.%' + '")');
		lkDs.filtered(true);
		fldObj.visible(lkDs.recordCount() > 1);
		if(!dsFilter.find('[field] == "' + fldName + '" || like([field], "' + fldName + '.%' + '")')) {
			dsFilter.appendRecord();
			dsFilter.setFieldValue('field', fldName);
		}
		this._currFieldName = fldName;
	},
	
	show: function (left, top, ajustX, ajustY) {
		var Z = this;
		if (!Z._panel) {
			Z._panel = Z._create();
		}
		Z._panel.style.left = left + 'px';
		Z._panel.style.top = top + 'px';
		jQuery(Z._panel).show('fast');
		window.setTimeout(function(){
			Z._filterDataset.focusEditControl('value');
		},5);
	},

	hide: function () {
		this._filterDataset.cancel();
		jQuery(this._panel).hide('fast');
	},
	
	cancelFilter: function() {
		this._filterDataset.cancel();
	},
	
	_create: function () {
		var Z = this;
		if (!Z._panel) {
			Z._panel = document.createElement('div');
			Z._dbtable.el.appendChild(Z._panel);
		}
		jQuery(Z._panel).addClass('panel panel-default jl-filter-panel');
		Z._panel.innerHTML = '<div class=""><div data-jslet="type: \'DBEditPanel\', dataset: \'' + Z._filterDataset.name() + 
		'\', columnCount: 1,hasLabel:false " style="width:100%;height:100%" ></div></div>' +
		'<div class="jl-filter-panel-toolbar"><button class="btn btn-default btn-sm jl-filter-panel-ok" tabIndex="90990">' + jsletlocale.FilterPanel.ok +
		'</button><button class="btn btn-default btn-sm jl-filter-panel-cancel" tabIndex="90991">' + jsletlocale.FilterPanel.cancel + 
		'</button><button class="btn btn-default btn-sm jl-filter-panel-clear" tabIndex="90992">' + jsletlocale.FilterPanel.clear + 
		'</button><button class="btn btn-default btn-sm jl-filter-panel-clearall" tabIndex="90993">' + jsletlocale.FilterPanel.clearAll + 
		'</button></div>';
		jslet.ui.install(Z._panel);
		var jqPanel = jQuery(Z._panel);
		jqPanel.find('.jl-filter-panel-ok').on('click', function(){
			var dsFilter = Z._filterDataset;
			dsFilter.confirm();
			if(jslet.isEmpty(dsFilter.getFieldValue('value'))) {
				dsFilter.deleteRecord();
			}
			var filter = Z._filterDatasetObj.getFilterExpr();
			Z._dbtable.dataset().filter(filter).filtered(true);
			Z._currFilterExpr = filter;
			
			Z.hide();
			Z._setFilterBtnStyle();
		});
		jqPanel.find('.jl-filter-panel-cancel').on('click', function(){
			Z._filterDataset.cancel();
			Z.hide();
		});
		jqPanel.find('.jl-filter-panel-clear').on('click', function(){
			Z._filterDataset.deleteRecord();
			var filter = Z._filterDatasetObj.getFilterExpr();
			Z._dbtable.dataset().filter(filter).filtered(true);
			Z.hide();
			Z._currFilterExpr = filter;
			Z._setFilterBtnStyle();
		});
		jqPanel.find('.jl-filter-panel-clearall').on('click', function(){
			Z._filterDataset.records(null);
			Z._dbtable.dataset().filter(null).filtered(false);
			Z.hide();
			Z._clearFilterBtnStyle();
		});
		//prevent to fire the dbtable's keydown event.
		jqPanel.on('keydown', function(event) {
       		event.stopImmediatePropagation();
		});
		return Z._panel;
	},

	_clearFilterBtnStyle: function() {
		var jqPanel = jQuery(this._panel);
		jQuery(this._dbtable.el).find('.jl-tbl-filter-hasfilter').attr('title', '').removeClass('jl-tbl-filter-hasfilter');
		jqPanel.find('.jl-filter-panel-clearall').attr('title', '');
		this._currFilterExpr = null;
	},
	
	checkFilterBtnStyle: function() {
		var Z = this;
		if(!Z._currFilterExpr) {
			return;
		}
		var dsHost = Z._dbtable.dataset(),
			dsFilterExpr = dsHost.filter();
		if(dsHost.filtered() && dsFilterExpr == Z._currFilterExpr) {
			return;
		}
		Z._clearFilterBtnStyle();
		var dsFilter = Z._filterDataset;
		if(!dsFilterExpr || !dsHost.filtered()) {
			dsFilter.records(null);
		}
		var filterText = Z._filterDatasetObj.getFilterExprText();
		jQuery(Z._dbtable.el).find('button.jl-tbl-filter').each(function(){
			var fldName = this.getAttribute('jsletfilterfield');
			var jqFilterBtn = jQuery(this);
			if(dsFilter.find('[field] == "' + fldName + '" || like([field], "' + fldName + '.%' + '")')) {
				jqFilterBtn.addClass('jl-tbl-filter-hasfilter');
			} else {
				jqFilterBtn.removeClass('jl-tbl-filter-hasfilter');
			}
			jqFilterBtn.attr('title', filterText || '');
		});
		jQuery(Z._panel).find('.jl-filter-panel-clearall').attr('title', filterText || '');
	},
	
	_setFilterBtnStyle: function() {
		var Z = this;
		var filterText = Z._filterDatasetObj.getFilterExprText();
		
		var dsFilter = Z._filterDataset;
		if(dsFilter.find('[field] == "' + Z._currFieldName + '" || like([field], "' + Z._currFieldName + '.%' + '")')) {
			Z._jqFilterBtn.addClass('jl-tbl-filter-hasfilter');
		} else {
			Z._jqFilterBtn.removeClass('jl-tbl-filter-hasfilter');
		}
		Z._jqFilterBtn.attr('title', filterText || '');
		jQuery(Z._dbtable.el).find('.jl-tbl-filter-hasfilter').attr('title', filterText || '');
		jQuery(Z._panel).find('.jl-filter-panel-clearall').attr('title', filterText || '');
	},
	
	destroy: function(){
		var Z = this;
		jslet.ui.uninstall(Z._panel);
		Z._panel.innerHTML = '';
		Z._panel = null;
		Z._dbtable = null;
		Z._jqFilterBtn = null;
	}
};

if(!jslet.ui.table) {
	jslet.ui.table = {};
}

/*
 * Find dialog for DBTable
 */
jslet.ui.table.FindDialog = function (dbContainer) {
	var _dialog;
	var _dataset = dbContainer.dataset();
	var _containerEl = dbContainer.el;
	var _currfield = null;
	var _findingField = null;
	var _left = -1;
	var _top = -1;
	function initialize() {
		var opt = { type: 'window', caption: jslet.formatMessage(jsletlocale.findDialog.caption, ['']), isCenter: false, resizable: true, minimizable: false, maximizable: false, 
				stopEventBubbling: true, styleClass: 'jl-finddlg'};
		_dialog = jslet.ui.createControl(opt, _containerEl);
		_dialog.onClosed(function(){
			return 'hidden';
		});
			
		var content = '<div class="input-group input-group-sm"><input class="form-control jl-finddlg-value" placeholder="' + 
		jsletlocale.findDialog.placeholder + '"/>' + 
		'<div class="input-group-btn"><button class="btn btn-default jl-finddlg-find"><i class="fa fa-search" /></button></div></div>';
		
		_dialog.setContent(content);
		_dialog.onPositionChanged(function(left, top) {
			_left = (left > 0? left: 0);
			_top = (top > 0? top: 0);
		});
		var dlgEl = _dialog.el;

		var jqFindingValue = jQuery(dlgEl).find('.jl-finddlg-value');
		var isStart = true;
		jqFindingValue.on('keydown', function(event){
			if(event.keyCode === jslet.ui.KeyCode.ENTER) {
				findData();
	       		event.stopImmediatePropagation();
				event.preventDefault();
				return false;
			}
			isStart = true;
		});
		
		var jqFind = jQuery(dlgEl).find('.jl-finddlg-find');
		jqFind.on('click', function(event) {
			findData();
		});

		function findData() {
			if(_dataset.recordCount() < 2) {
				return;
			}
			var findingValue = jqFindingValue.val(),
				currRecno = 0;
			if(!isStart) {
				currRecno = _dataset.recno() + 1;
			}
			var options = {startRecno: currRecno, findingByText: true, matchType: 'any'};
			var found = _dataset.findByField(_findingField, findingValue, options);
			isStart = !found;
			if(!found) {
				if(currRecno > 0) { //If not found, find from the first position.
					findData();
				}
			}
			return found;
		}
	}
	
	this.show = function(left, top) {
		if(!_findingField) {
			return;
		}
		if(_left >= 0) {
			left = _left;
		}
		if(_top >= 0) {
			top = _top;
		}
		left = left || 0;
		top = top || 0;
		_dialog.show(left, top);
		this.focus();
	};
	
	this.hide = function() {
		_dialog.hide();
	};
	
	this.findingField = function(findingField) {
		if(findingField === undefined) {
			return _findingField;
		}
		var oldField = _findingField;
		_findingField = findingField;
		if(_findingField) {
			var fldObj = _dataset.getField(_findingField);
			if(fldObj) {
				var dataType = fldObj.getType();
				if(dataType === jslet.data.DataType.ACTION || dataType === jslet.data.DataType.EDITACTION) {
					_findingField = null;
					return;
				}
				_dialog.changeCaption(jslet.formatMessage(jsletlocale.findDialog.caption, [fldObj.label()]));
				if(oldField != findingField) {
					jQuery(_dialog.el).find('.jl-finddlg-value').val('');
				}
			}
		}
	};
	
	this.focus = function() {
		jQuery(_dialog.el).find('.jl-finddlg-value').focus();
	};
	
	this.destroy = function() {
		_dialog.destroy();
	};
	
	initialize();
};



/**
 * @class 
 * @extend jslet.ui.DBControl
 * 
 * DBChart, show data as a chart. We use an open source chart component to show chart: EChart(http://echarts.baidu.com/).
 * EChart is very powerful, but we implement these usual chart: column, bar, line, area, pie. <br />  
 * Example:
 * 
 *     @example
 *     var jsletParam = {type:"DBChart", dataset:"summary", chartType:"column",categoryField:"month",valueFields:"amount",recordRange: jslet.data.RecordRange.ALL, reverse: false};
 * 
 *     //1. Declaring:
 *     <div id="chartId" data-jslet='type:"DBChart",chartType:"column",categoryField:"month",valueFields:"amount,netProfit", dataset:"summary"' />
 *     or
 *     <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *     <div id="ctrlId"  />
 *     //Js snippet
 *     var el = document.getElementById('ctrlId');
 *     jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 *
 */
jslet.ui.DBChart = jslet.Class.create(jslet.ui.DBControl, {
	chartTypes: ['line', 'stackline', 'bar', 'stackbar', 'pie'],
	
	legendPositions: ['none', 'top', 'bottom', 'left', 'right'],
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,chartType,chartTitle,categoryField,valueFields,legendPos,recordRange,reverse';
		Z.requiredProperties = 'valueFields,categoryField';
		
		Z._chartType = "line";
		
		Z._categoryField = null;
		
		Z._valueFields = null;
		
		Z._chartTitle = null;

		Z._legendPos = 'none';
		
		Z._recordRange = jslet.data.RecordRange.ALL;
		
		Z._reverse = false;
		
		Z._fieldValidated = false;
		
		Z._oldHeight = -1;
		
		Z._echart = null;
		
		Z._onSetChartOption = null;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Set or get chart type. Optional chart type: line(default), column, bar, area, pie.
	 * 
	 * @param {String | undefined} chartType Chart type, optional value: 'line'(default), 'stackline', 'bar', 'stackbar', 'pie'.
	 * 
	 * @return {this | String}
	 */
	chartType: function(chartType) {
		if(chartType === undefined) {
			return this._chartType;
		}
		chartType = jQuery.trim(chartType);
		var checker = jslet.Checker.test('DBChart.chartType', chartType).isString().required();
		checker.testValue(chartType.toLowerCase()).inArray(this.chartTypes);
		this._chartType = chartType;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get category field.
	 * 
	 * @param {String | undefined} categoryField Category field.
	 * 
	 * @return {this | String}
	 */
	categoryField: function(categoryField) {
		if(categoryField === undefined) {
			return this._categoryField;
		}
		jslet.Checker.test('DBChart.categoryField', categoryField).isString().required();
		categoryField = jQuery.trim(categoryField);
		this._categoryField = categoryField;
		this._fieldValidated = false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get value fields, multiple fields are separated with comma(,).
	 * 
	 * @param {String | undefined} valueFields Value fields.
	 * 
	 * @return {this | String}
	 */
	valueFields: function(valueFields) {
		if(valueFields === undefined) {
			return this._valueFields;
		}
		jslet.Checker.test('DBChart.valueFields', valueFields).isString().required();
		valueFields = jQuery.trim(valueFields);
		this._valueFields = valueFields.split(',');
		this._fieldValidated = false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get chart title.
	 * 
	 * @param {String | undefined} chartTitle Chart title.
	 * 
	 * @return {this | String}
	 */
	chartTitle: function(chartTitle) {
		if(chartTitle === undefined) {
			return this._chartTitle;
		}
		jslet.Checker.test('DBChart.chartTitle', chartTitle).isString();
		this._chartTitle = chartTitle;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get chart legend position, optional value: 'none', 'top'(default), 'bottom', 'left', 'right'.
	 * 
	 * @param {String | undefined} legendPos Chart legend position.
	 * 
	 * @return {this | String}
	 */
	legendPos: function(legendPos) {
		if(legendPos === undefined) {
			return this._legendPos;
		}
		legendPos = jQuery.trim(legendPos);
		var checker = jslet.Checker.test('DBChart.legendPos', legendPos).isString().required();
		checker.testValue(legendPos.toLowerCase()).inArray(this.legendPositions);
		this._legendPos = legendPos;
		return this;
	},
		
	/**
	 * @property
	 * 
	 * Set or get record range, optional value: jslet.data.RecordRange.ALL, jslet.data.RecordRange.CURRENT, jslet.data.RecordRange.SELECTED.
	 * 
	 * @param {jslet.data.RecordRange | undefined} recordRange default is jslet.data.RecordRange.ALL.
	 * 
	 * @return {this | jslet.data.RecordRange}
	 */
	recordRange: function(recordRange) {
		if(recordRange === undefined) {
			return this._recordRange;
		}
		this._recordRange = recordRange;
		return this;
	},
		
	/**
	 * @property
	 * 
	 * Identify whether reverse the X-axis and Y-axis or not.
	 * 
	 * @param {Boolean | undefined} reverse True - reverse the X-axis and Y-axis, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	reverse: function(reverse) {
		if(reverse === undefined) {
			return this._reverse;
		}
		this._reverse = reverse? true: false;
		return this;
	},
	
	onSetChartOption: function(onSetChartOption) {
		if(onSetChartOption === undefined) {
			return this._onSetChartOption;
		}
		jslet.Checker.test('DBChart.onSetChartOption', onSetChartOption).isFunction();
		this._onSetChartOption = onSetChartOption;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		if(!this.el.id) {
			this.el.id = jslet.nextId();
		}
		this.renderAll();
		jslet.ui.resizeEventBus.subscribe(this);
	},
	
	_getEChart: function() {
		if(!this._echart) {
			this._echart = jslet.global.echarts.init(this.el);
		}
		return this._echart;
	},

	_validateFields: function() {
		var Z = this;
		if(Z._fieldValidated) {
			return;
		}
		var dsObj = Z._dataset,
			fldName = Z._categoryField;
		if (!dsObj.getField(fldName)) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
		}
		if(Z._valueFields) {
			for(var i = 0, len = Z._valueFields.length; i < len; i++) {
				fldName = Z._valueFields[i];
				if(!dsObj.getField(fldName)) {
					throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
				}
			}
		}
		Z._fieldValidated = true;
	},
	
	_getLineRecord: function(dsObj, xLabels, yValues, yFields, legendLabels) {
		var Z = this,
			startRecno = 0, endRecno = dsObj.recordCount() - 1;
		if(Z._recordRange === jslet.data.RecordRange.CURRENT) {
			startRecno = endRecno = dsObj.recno();
		}
		var isInit = false, valueFldName,
			valueFldCnt = Z._valueFields.length,
			valueArr, 
			isSelectedRange = Z._recordRange === jslet.data.RecordRange.SELECTED;
		for(var k = startRecno; k <= endRecno; k++) {
			dsObj.recnoSilence(k);
			if(isSelectedRange && !dsObj.selected()) {
				continue;
			}
			xLabels.push(dsObj.getFieldText(Z._categoryField));
			for(var i = 0; i < valueFldCnt; i++) {
				valueFldName = Z._valueFields[i];
				if(!isInit) {
					valueArr = [];
					yValues.push(valueArr);
					legendLabels.push(dsObj.getField(valueFldName).label());
					yFields.push(valueFldName);
				} else {
					valueArr = yValues[i];
				}
				valueArr.push(dsObj.getFieldValue(valueFldName));
			}
			isInit = true;
		} //End for k
	},
	
	_getLineRecordReverse: function(dsObj, xLabels, yValues, yFields, legendLabels) {
		var Z = this,
			startRecno = 0, endRecno = dsObj.recordCount() - 1;
		if(Z._recordRange === jslet.data.RecordRange.CURRENT) {
			startRecno = endRecno = dsObj.recno();
		}
		var isInit = false, valueFldName,
			valueFldCnt = Z._valueFields.length,
			valueArr, 
			isSelectedRange = Z._recordRange === jslet.data.RecordRange.SELECTED;
		for(var k = startRecno; k <= endRecno; k++) {
			dsObj.recnoSilence(k);
			if(isSelectedRange && !dsObj.selected()) {
				continue;
			}
			legendLabels.push(dsObj.getFieldText(Z._categoryField));
			valueArr = [];
			for(var i = 0; i < valueFldCnt; i++) {
				valueFldName = Z._valueFields[i];
				if(!isInit) {
					xLabels.push(dsObj.getField(valueFldName).label());
					yFields.push(valueFldName);
				}
				valueArr.push(dsObj.getFieldValue(valueFldName));
			}
			yValues.push(valueArr);
			isInit = true;
		} //End for k
	},
	
	_getLineData: function() {
		var Z = this,
			dsObj = Z._dataset,
			xLabels = [],
			yValues = [],
			yFields = [],
			legendLabels = [];

		if(dsObj.recordCount() === 0 || !Z._valueFields) {
			return {xLabels: xLabels, yValues: yValues, yFields: yFields, legendLabels: legendLabels};
		}
		var oldRecno = dsObj.recnoSilence();
		try {
			if(Z._reverse) {
				Z._getLineRecordReverse(dsObj, xLabels, yValues, yFields, legendLabels);
			} else {
				Z._getLineRecord(dsObj, xLabels, yValues, yFields, legendLabels);
			}
		} finally {
			dsObj.recnoSilence(oldRecno);
		}
		return {xLabels: xLabels, yValues: yValues, yFields: yFields, legendLabels: legendLabels};
	},

	_getPieData: function() {
		var Z = this,
			dsObj = Z._dataset,
			chartData = [],
			legendLabels = [],
			result = {chartData: chartData, legendLabels: legendLabels, title: ''};
		if(dsObj.recordCount() === 0 || !Z._valueFields) {
			chartData = [['', 0]];
			return result;
		}
		var startRecno = 0, endRecno = dsObj.recordCount() - 1;
		if(Z._recordRange === jslet.data.RecordRange.CURRENT || Z._reverse) {
			startRecno = endRecno = dsObj.recno();
		}
		if(Z._reverse) {
			result.title = Z._dataset.getField(Z._valueFields[0]).displayLabel();
		} else {
		}
		var oldRecno = dsObj.recnoSilence(), k, len, valueFldName, label, value,
			isSelectedRange = Z._recordRange === jslet.data.RecordRange.SELECTED;
		try {
			if(!Z._reverse) {
				result.title = Z._dataset.getField(Z._valueFields[0]).displayLabel();
				valueFldName = Z._valueFields[0];
				for(k = startRecno; k <= endRecno; k++) {
					dsObj.recnoSilence(k);
					if(isSelectedRange && !dsObj.selected()) {
						continue;
					}
					label = dsObj.getFieldText(Z._categoryField);
					value = dsObj.getFieldValue(valueFldName);
					chartData.push({name: label, value: value});
					legendLabels.push(label);
				}
			} else {
				dsObj.recnoSilence(startRecno);
				result.title = Z._dataset.getField(Z._categoryField).displayLabel();
				var fldObj;
				for(k = 0, len = Z._valueFields.length; k < len; k++) {
					valueFldName = Z._valueFields[k];
					fldObj = dsObj.getField(valueFldName);
					label = fldObj.displayLabel();
					value = fldObj.getValue();
					chartData.push([label, value]);
				}
			}
		} finally {
			dsObj.recnoSilence(oldRecno);
		}
		return result;
	},

	_drawLineChart: function() {
		var Z = this,
			chartData = Z._getLineData(),
			echart = Z._getEChart(),
			legendLabels = chartData.legendLabels,
			option = {title: {text: Z._chartTitle},
				legend: {data: legendLabels},
				xAxis: {data: chartData.xLabels},
				yAxis: {type: 'value'}
			};
		var yValues = chartData.yValues,
			yFields = chartData.yFields,
			series = [], stack = null,
			chtype = Z._chartType;
		if(chtype === 'stackline'){
			stack = 'stack';
			chtype = 'line';
		}
		if(chtype === 'stackbar') {
			stack = 'stack';
			chtype = 'bar';
		}
		for(var i = 0, len = yValues.length; i < len; i++) {
			series.push({field: yFields[i], name: legendLabels[i], data: yValues[i], type: chtype, stack: stack});
		}
		option.series = series;
		
		if(Z._onSetChartOption) {
			Z._onSetChartOption(option);
		}
		echart.setOption(option);
	},
		
	_drawPieChart: function() {
		var Z = this,
			chartData = Z._getPieData(),
			echart = Z._getEChart(),
			title = chartData.title,
			chartTitle = (Z._chartTitle? Z._chartTitle + ' - ' : '') + title,
		legendLabels = chartData.legendLabels;
		chartData = chartData.chartData;
			
		var option = {title: {text: chartTitle},
				legend: {data: legendLabels}
			};
		
		var series = [{type: 'pie', data: chartData}];
		option.series = series;
		if(Z._onSetChartOption) {
			Z._onSetChartOption(option);
		}
		echart.setOption(option);
	},
	
	drawChart: function () {
		var Z = this,
			dsObj = Z._dataset;
		if(jQuery(Z.el).is(':hidden')) {
			return;
		}
		Z._getEChart().clear();
		
		if(dsObj.recordCount() === 0) {
			return;
		}
		if(Z._recordRange === jslet.data.RecordRange.SELECTED) {
			if(!Z._dataset.hasSelectedRecords()) {
				return;
			}
		}
		Z._validateFields();
		if(Z._chartType == 'pie') {
			Z._drawPieChart();
			return;
		}
		if(Z._chartType == 'line' || Z._chartType == 'bar' || 
			Z._chartType == 'stackline' || Z._chartType == 'stackbar') {
			Z._drawLineChart();
			return;
		}
	},

	refreshControl: function (evt) {
		var evtType = evt.eventType;
		if (evtType === jslet.data.RefreshEvent.UPDATEALL || 
			evtType === jslet.data.RefreshEvent.UPDATERECORD ||
			evtType === jslet.data.RefreshEvent.UPDATECOLUMN || 
			evtType === jslet.data.RefreshEvent.INSERT || 
			evtType === jslet.data.RefreshEvent.DELETE || 
			(evtType === jslet.data.RefreshEvent.SCROLL && this._recordRange === jslet.data.RecordRange.CURRENT) || 
			((evtType === jslet.data.RefreshEvent.SELECTRECORD || evtType === jslet.data.RefreshEvent.SELECTALL) &&
				this._recordRange === jslet.data.RecordRange.SELECTED)
			) {
			this.drawChart();
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		return this;
	},
	
	/**
	 * Run when container size changed, it's revoked by jslet.ui.resizeEventBus.
	 * 
	 */
	checkSizeChanged: function(){
		var Z = this;
		var currHeight = jQuery(Z.el).height();
		if(Z._oldHeight < 0 || Z._oldHeight === currHeight) {
			return;
		} 
		Z._oldHeight = currHeight;
		window.setTimeout(function() {
			Z.drawChart();
		}, 10);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		this.jqplot = null;
		jslet.ui.resizeEventBus.unsubscribe(this);
		$super();
	}
});

jslet.ui.register('DBChart', jslet.ui.DBChart);
jslet.ui.DBChart.htmlTemplate = '<div></div>';

/**
 * @class
 * @extend jslet.ui.DBControl
 * 
 * DBEditPanel is a container control used for user to input data. 
 * Example:
 * 
 *     @example
 *     var jsletParam = {type:"DBEditPanel",dataset:"employee",columnCount:3};
 * 
 *     //1. Declaring:
 *       <div id='ctrlId' data-jslet='type:"DBEditPanel",dataset:"employee",columnCount:3' />
 *       or
 *       <div data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *       <div id="ctrlId"  />
 *       //Js snippet
 *       var el = document.getElementById('ctrlId');
 *       jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *       jslet.ui.createControl(jsletParam, document.body);
 */

jslet.ui.DBEditPanel = jslet.Class.create(jslet.ui.DBControl, {
	
	_totalColumns: 12, //Bootstrap column count 
	
	/**
	 * @protected
	 * @override
	*/
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,columnCount,labelCols,onlySpecifiedFields,fields,hasLabel,includeFields,excludeFields,layout';
		
		Z._columnCount = 3;

		Z._labelCols = 1;

		Z._onlySpecifiedFields = false;
		
		Z._includeFields = null;
		
		Z._excludeFields = null;
		
		Z._layout = null;
		
		Z._hasLabel = true;
		
		Z._metaChangedDebounce = jslet.debounce(Z.renderAll, 10);

		$super(el, params);
	},
	
	/**
	 * @property
	 * 
	 * Set or get column count.
	 * 
	 * @param {Integer | undefined} columnCount Column count.
	 * 
	 * @return {this | undefined}
	 */
	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBEditPanel.columnCount', columnCount).isGTZero();
		this._columnCount = parseInt(columnCount);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get display column count of field label. According to Bootstrap document, this property is in range: [1,11].
	 * 
	 * @param {Integer | undefined} labelCols The display column count of field label.
	 * 
	 * @return {this | undefined}
	 */
	labelCols: function(labelCols) {
		if(labelCols === undefined) {
			return this._labelCols;
		}
		jslet.Checker.test('DBEditPanel.labelCols', labelCols).isNumber().between(1,10);
		this._labelCols = parseInt(labelCols);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether it only displays the fields which specified by "fields" property.
	 * 
	 * @param {Boolean | undefined} onlySpecifiedFields True - only display the specified fields, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	onlySpecifiedFields: function(onlySpecifiedFields) {
		if(onlySpecifiedFields === undefined) {
			return this._onlySpecifiedFields;
		}
		this._onlySpecifiedFields = onlySpecifiedFields ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether it exists the field label part.
	 * 
	 * @param {Boolean | undefined} hasLabel True - exists field label part, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	hasLabel: function(hasLabel) {
		if(hasLabel === undefined) {
			return this._hasLabel;
		}
		this._hasLabel = hasLabel ? true: false;
		return this;
	},
	
	/*
	 * @deprecated
	 * Use 'layout' instead.
	 */
	fields: function(fields) {
		return this.layout(fields);
	},
	
	/**
	 * @property
	 * 
	 * Set or get editing field's layout.
	 * 
	 * @param {Object[] | undefined} layout Editing fields setting.
	 * @param {String} layout.field Field name.
	 * @param {Integer} layout.labelCols Label display column, range: [1, 3].
	 * @param {Integer} layout.dataCols Edit control display column, range: [1, 11].
	 * @param {Boolean} layout.inFirstCol Display field at first column.
	 * @param {Boolean} layout.showLine Display line separator.
	 * @param {Boolean} layout.visible The field is visible or not.
	 * @param {String | Number} layout.height The height of the edit field, if the value is numberic, the unit is 'px'.
	 * @param {jslet.ui.FieldControlAddon[]} layout.prefix The prefix part of the field.
	 * @param {jslet.ui.FieldControlAddon[]} layout.suffix The suffix part of the field.
	 * 
	 * @return {this | Object[]}
	 */
	layout: function(layout) {
		if(layout === undefined) {
			return this._layout;
		}
		jslet.Checker.test('DBEditPanel.layout', layout).isArray();
		var fldCfg;
		for(var i = 0, len = layout.length; i < len; i++) {
			fldCfg = layout[i];
			jslet.Checker.test('DBEditPanel.layout.field', fldCfg.field).isString().required();
			jslet.Checker.test('DBEditPanel.layout.labelCols', fldCfg.labelCols).isNumber().between(1,3);
			jslet.Checker.test('DBEditPanel.layout.dataCols', fldCfg.dataCols).isNumber().between(1,11);
			jslet.Checker.test('DBEditPanel.layout.prefix', fldCfg.prefix).isArray();
			jslet.Checker.test('DBEditPanel.layout.suffix', fldCfg.suffix).isArray();
			jslet.Checker.test('DBEditPanel.layout.height', fldCfg.height).isGTZero();
			fldCfg.inFirstCol = fldCfg.inFirstCol ? true: false;
			fldCfg.showLine = fldCfg.showLine ? true: false;
			fldCfg.visible = (fldCfg.visible || fldCfg.visible === undefined) ? true: false;
		}
		this._layout = layout;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Specify which fields are displayed in edit panel.
	 * 
	 * @param {String[] | undefined} includeFields Field names which are displayed in edit panel.
	 * 
	 * @return {this | String[]}
	 */
	includeFields: function(includeFields) {
		if(includeFields === undefined) {
			return this._includeFields;
		}
		jslet.Checker.test('DBEditPanel.includeFields', includeFields).isArray();
		this._includeFields = includeFields;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Specify which fields are not displayed in edit panel.
	 * 
	 * @param {String[] | undefined} includeFields Field names which are not displayed in edit panel.
	 * 
	 * @return {this | String[]}
	 */
	excludeFields: function(excludeFields) {
		if(excludeFields === undefined) {
			return this._excludeFields;
		}
		jslet.Checker.test('DBEditPanel.excludeFields', excludeFields).isArray();
		this._excludeFields = excludeFields;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	*/
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},
	
	_calcLayout: function () {
		var Z = this,
			allFlds = Z._dataset.getNormalFields(), 
			fldLayout,  fldObj, i, fldName, found, 
			fcnt = allFlds.length,
			fldLayouts = [], 
			layoutCnt = Z._layout ? Z._layout.length : 0;
		
		if(Z._onlySpecifiedFields && Z._layout) {
			
			for(i = 0; i < layoutCnt; i++) {
				fldLayout = Z._layout[i];
				if(fldLayout.visible || fldLayout.visible === undefined) {
					fldLayouts.push(fldLayout);
				}
			}
		} else {
			var exFields = Z._excludeFields,
				inFields = Z._includeFields;
			for(i = 0; i < fcnt; i++) {
				fldObj = allFlds[i];
				fldName = fldObj.name();
				if(exFields && exFields.indexOf(fldName) >= 0) {
					continue;
				}
				found = false;
				if(inFields && inFields.indexOf(fldName) < 0) {
					continue;
				}
				if(!fldObj.visible()) {
					continue;
				}
				found = false;
				for(var j = 0; j < layoutCnt; j++) {
					fldLayout = Z._layout[j];
					if(fldLayout.field !== fldName) {
						continue;
					}
					found = true;
					if(fldLayout.visible || fldLayout.visible === undefined) {
						fldLayouts.push(fldLayout);
					}
					break;
				}
				if(!found) {
					fldLayouts.push({field: fldName});
				}
			}
		}
		var dftDataCols = Math.floor((Z._totalColumns - Z._labelCols * Z._columnCount) / Z._columnCount);
		if(dftDataCols <= 0) {
			dftDataCols = 1;
		}

		//calc row, col
		var layout, r = 0, c = 0, colsInRow = 0, itemCnt;
		for (i = 0, layoutCnt = fldLayouts.length; i < layoutCnt; i++) {
			layout = fldLayouts[i];
			if(!layout.labelCols) {
				layout._innerLabelCols = Z._labelCols;
			}
			if(!layout.dataCols) {
				layout._innerDataCols = dftDataCols;
			} else {
				layout._innerDataCols = layout.dataCols;	
			}
			itemCnt = layout._innerLabelCols + layout._innerDataCols;
			if (layout.inFirstCol || layout.showLine || colsInRow + itemCnt > Z._totalColumns) {
				r++;
				colsInRow = 0;
			}
			layout.row = r;
			colsInRow += itemCnt;
		}
		return fldLayouts;
	},
	
	getEditField: function (fieldName) {
		var Z = this;
		if (!Z._layout) {
			Z._layout = [];
		}
		var editFld;
		for (var i = 0, cnt = Z._layout.length; i < cnt; i++) {
			editFld = Z._layout[i];
			if (editFld.field == fieldName) {
				return editFld;
			}
		}
		var fldObj = Z._dataset.getField(fieldName);
		if (!fldObj) {
			return null;
		}
		editFld = {
			field: fieldName
		};
		Z._layout.push(editFld);
		return editFld;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		Z.removeAllChildControls();
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-editpanel')) {
			jqEl.addClass('jl-editpanel form-horizontal');
		}
		jqEl.html('');
		var allFlds = Z._dataset.getNormalFields(),
			fcnt = allFlds.length;
		var layouts = Z._calcLayout();
		//calc max label width
			
		var layout, editor, r = -1, oLabel, editorCfg, fldName, fldObj, ohr, octrlDiv, opanel, ctrlId, dbCtrl;
		for (var i = 0, cnt = layouts.length; i < cnt; i++) {
			layout = layouts[i];
			if (layout.showLine) {
				ohr = document.createElement('hr');
				Z.el.appendChild(ohr);
			}
			if (layout.row != r) {
				opanel = document.createElement('div');
				opanel.className = 'form-group form-group-sm';
				//jQuery(opanel).css('width','100%').css('margin', '0px');
				Z.el.appendChild(opanel);
				r = layout.row;
			}
			fldName = layout.field;
			fldObj = Z._dataset.getField(fldName);
			if (!fldObj) {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
			}
			editorCfg = fldObj.editControl();
			var isCheckBox = editorCfg.type.toLowerCase() == 'dbcheckbox';
			if(isCheckBox) {
				if(Z._hasLabel) {
					oLabel = document.createElement('div');
					opanel.appendChild(oLabel);
					oLabel.className = 'col-sm-' + layout._innerLabelCols;
				}
				octrlDiv = document.createElement('div');
				opanel.appendChild(octrlDiv);
				octrlDiv.className = 'col-sm-' + (Z._hasLabel? layout._innerDataCols: 12);
				
				editorCfg.dataset = Z._dataset;
				editorCfg.field = fldName;
				editor = jslet.ui.createControl(editorCfg, null);
				octrlDiv.appendChild(editor.el);
				Z.addChildControl(editor);
				if(Z._hasLabel) {
					oLabel = document.createElement('label');
					octrlDiv.appendChild(oLabel);
					dbCtrl = new jslet.ui.DBLabel(oLabel, {
						type: 'DBLabel',
						dataset: Z._dataset,
						field: fldName
					});
				}
				ctrlId = jslet.nextId();
				editor.el.id = ctrlId;
				jQuery(oLabel).attr('for', ctrlId);
				Z.addChildControl(dbCtrl);
			} else {
				if(Z._hasLabel) {
					oLabel = document.createElement('label');
					opanel.appendChild(oLabel);
					oLabel.className = 'col-sm-' + layout._innerLabelCols;
					dbCtrl = new jslet.ui.DBLabel(oLabel, {
						type: 'DBLabel',
						dataset: Z._dataset,
						field: fldName
					});
					Z.addChildControl(dbCtrl);
				}
				
				octrlDiv = document.createElement('div');
				opanel.appendChild(octrlDiv);
				octrlDiv.className = 'col-sm-' + (Z._hasLabel? layout._innerDataCols: 12);
				
				editor = jslet.ui.createControl({type: 'DBPlace', dataset: this._dataset, field: fldName, 
					prefix: layout.prefix, suffix: layout.suffix}, octrlDiv);
				ctrlId = jslet.nextId();
				editor.el.id = ctrlId;
				var layoutHeight = layout.height;
				if(layoutHeight) {
					if(jslet.isNumber(layoutHeight)) {
						layoutHeight = layoutHeight + 'px'; 
					}
					jQuery(editor.el).css('height', layoutHeight);
					jQuery(editor.el.firstChild).css('height', '100%');
				}
				jQuery(oLabel).attr('for', ctrlId);
				Z.addChildControl(editor);
			}
		}
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		if(metaName && (metaName == 'visible' || metaName == 'editControl')) {
			this._metaChangedDebounce.call(this);
		}
	}
});

jslet.ui.register('DBEditPanel', jslet.ui.DBEditPanel);
jslet.ui.DBEditPanel.htmlTemplate = '<div></div>';

"use strict";
/*!
 * Jslet Javascript Framework v4.0.0
 * https://github.com/jslet/jslet/
 *
 * Copyright 2016 Jslet Team
 * Released under GNU AGPL v3.0 license
 */

/**
 * @class 
 * @extend jslet.ui.DBControl
 * 
 * DBInspector. 
 * Display & Edit fields in two columns: Label column and Value column. If in edit mode, this control takes the field editor configuration from dataset field object. <br />
 * Example:
 * 
 *     @example
 *     var jsletParam = {type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100};
 * 
 *     //1. Declaring:
 *       <div id='ctrlId' data-jslet='type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100' />
 *       or
 *       <div data-jslet='jsletParam' />
 * 
 *     //2. Binding
 *       <div id="ctrlId"  />
 *       //Js snippet
 *       var el = document.getElementById('ctrlId');
 *       jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *       jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBInspector = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,columnCount,layout';
		
		Z._columnCount = 1;
		
		Z._layout = null;
		
		Z._includeFields = null;
		
		Z._excludeFields = null;
		
		Z._metaChangedDebounce = jslet.debounce(Z.renderAll, 10);

		$super(el, params);
	},
	
	/**
	 * @property
	 * 
	 * Set or get column count.
	 * 
	 * @param {Integer | undefined} columnCount Column count.
	 * 
	 * @return {this | undefined}
	 */
	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBInspector.columnCount', columnCount).isGTZero();
		this._columnCount = parseInt(columnCount);
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the edit layout.
	 * 
	 * @param {Object[] | undefined} layout Edit layout.
	 * @param {String} layout.field Field name.
	 * @param {Boolean} layout.visible Visible of field.
	 * @param {jslet.ui.FieldControlAddon[]} layout.prefix The prefix part of the field.
	 * @param {jslet.ui.FieldControlAddon[]} layout.suffix The suffix part of the field.
	 * 
	 * @return {this | Object[]}
	 */
	layout: function(layout) {
		if(layout === undefined) {
			return this._layout;
		}
		jslet.Checker.test('DBInspector.layout', layout).isArray();
		var fldCfg;
		for(var i = 0, len = layout.length; i < len; i++) {
			fldCfg = layout[i];
			jslet.Checker.test('DBInspector.layout.field', fldCfg.field).isString().required();
		}
		this._layout = layout;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Specify which fields are displayed in edit panel.
	 * 
	 * @param {String[] | undefined} includeFields Field names which are displayed in edit panel.
	 * 
	 * @return {this | String[]}
	 */
	includeFields: function(includeFields) {
		if(includeFields === undefined) {
			return this._includeFields;
		}
		jslet.Checker.test('DBInspector.includeFields', includeFields).isArray();
		this._includeFields = includeFields;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Specify which fields are not displayed in edit panel.
	 * 
	 * @param {String[] | undefined} includeFields Field names which are not displayed in edit panel.
	 * 
	 * @return {this | String[]}
	 */
	excludeFields: function(excludeFields) {
		if(excludeFields === undefined) {
			return this._excludeFields;
		}
		jslet.Checker.test('DBInspector.excludeFields', excludeFields).isArray();
		this._excludeFields = excludeFields;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},
	
	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this;
		var colCnt = Z._columnCount;
		if (colCnt) {
			colCnt = parseInt(colCnt);
		}
		if (colCnt && colCnt > 0) {
			Z._columnCount = colCnt;
		} else {
			Z._columnCount = 1;
		}
		Z.renderAll();
	},
	
	_calcLayout: function () {
		var Z = this,
			allFlds = Z._dataset.getNormalFields(), 
			fldObj, i, fldName, found, fldLayout,
			fcnt = allFlds.length,
			layoutCnt = Z._layout ? Z._layout.length : 0,
			fldLayouts = [];
		
		var exFields = Z._excludeFields,
			inFields = Z._includeFields;
		for(i = 0; i < fcnt; i++) {
			fldObj = allFlds[i];
			fldName = fldObj.name();
			if(exFields && exFields.indexOf(fldName) >= 0) {
				continue;
			}
			found = false;
			if(inFields && inFields.indexOf(fldName) < 0) {
				continue;
			}
			if(!fldObj.visible()) {
				continue;
			}
			found = false;
			for(var j = 0; j < layoutCnt; j++) {
				fldLayout = Z._layout[j];
				if(fldLayout.field !== fldName) {
					continue;
				}
				found = true;
				if(fldLayout.visible === undefined || fldLayout.visible) {
					fldLayouts.push(fldLayout);
				}
				break;
			}
			if(!found) {
				fldLayouts.push({field: fldName});
			}
		}
		return fldLayouts;
	},

	_calcLabelWidth: function(fields) {
		var Z = this,
			fcnt = fields.length,
			columnCnt = Math.min(fcnt, Z._columnCount), 
			arrLabelWidth = [],
			w, c, i;
		for (i = 0; i < columnCnt; i++) {
			arrLabelWidth[i] = 0;
		}
		var charWidth = jslet.ui.textMeasurer.getWidth('*');
		jslet.ui.textMeasurer.setElement(Z.el);
		var dsObj = Z._dataset, fldObj, fldName;
		for (i = 0; i < fcnt; i++) {
			fldName = fields[i].field; 
			fldObj = dsObj.getField(fldName);
			c = i % columnCnt;
			w = Math.round(jslet.ui.textMeasurer.getWidth(fldObj.displayLabel()) + charWidth) + 15;
			if (arrLabelWidth[c] < w) {
				arrLabelWidth[c] = w;
			}
		}
		jslet.ui.textMeasurer.setElement();
		return arrLabelWidth;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		Z.removeAllChildControls();
		
		if (!jqEl.hasClass('jl-inspector'))
			jqEl.addClass('jl-inspector jl-round5');
		var totalWidth = jqEl.width(),
			allFlds = Z._dataset.getFields();
		jqEl.html('<table cellpadding=0 cellspacing=0 style="margin:0;padding:0;table-layout:fixed;width:100%;height:100%"><tbody></tbody></table>');
		var fldObj, i, found, visible, fldName, cfgFld, fcnt,
			fieldLayouts = Z._calcLayout();
		fcnt = fieldLayouts.length;
		if (fcnt === 0) {
			return;
		}
		var	columnCnt = Math.min(fcnt, Z._columnCount), 
			arrLabelWidth = Z._calcLabelWidth(fieldLayouts);
		
		var otable = Z.el.firstChild,
			tHead = otable.createTHead(), otd, otr = tHead.insertRow(-1);
		for (i = 0; i < columnCnt; i++) {
			otd = otr.insertCell(-1);
			otd.style.width = arrLabelWidth[i] + 'px';
			otd = otr.insertCell(-1);
		}
		
		var oldRowNo = -1, oldC = -1, rowNo, odiv, oLabel, editor, fldCtrl, dbCtrl, c, fldCfg;
		Z.preRowIndex = -1;
		var dsObj = Z._dataset;
		for (i = 0; i < fcnt; i++) {
			fldCfg = fieldLayouts[i];
			fldName = fldCfg.field;
			fldObj = dsObj.getField(fldName);
			rowNo = Math.floor(i / columnCnt);
			c = i % columnCnt;
			if (oldRowNo != rowNo) {
				otr = otable.insertRow(-1);
				oldRowNo = rowNo;
			}
			
			otd = otr.insertCell(-1);
			otd.noWrap = true;
			otd.className = jslet.ui.htmlclass.DBINSPECTOR.labelColCls;
			
			oLabel = document.createElement('label');
			otd.appendChild(oLabel);
			dbCtrl = new jslet.ui.DBLabel(oLabel, {
				type: 'DBLabel',
				dataset: Z._dataset,
				field: fldName
			});
			Z.addChildControl(dbCtrl);
			
			otd = otr.insertCell(-1);
			otd.className = jslet.ui.htmlclass.DBINSPECTOR.editorColCls;
			otd.noWrap = true;
			otd.align = 'left';
			odiv = document.createElement('div');
			odiv.noWrap = true;
			otd.appendChild(odiv);
			fldCtrl = {type: 'DBPlace'};
			fldCtrl.dataset = Z._dataset;
			fldCtrl.field = fldName;
			fldCtrl.prefix = fldCfg.prefix;
			fldCtrl.suffix = fldCfg.suffix;
			
			editor = jslet.ui.createControl(fldCtrl, odiv);
			if (!editor.isCheckBox) {
				editor.el.style.width = '100%';//editorWidth - 10 + 'px';
			}
			Z.addChildControl(editor);
		} // end for
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		if(metaName && (metaName == 'visible' || metaName == 'editControl')) {
			this._metaChangedDebounce.call(this);
		}
	}
});

jslet.ui.htmlclass.DBINSPECTOR = {
	labelColCls: 'jl-inspector-label',
	editorColCls: 'jl-inspector-editor'
};

jslet.ui.register('DBInspector', jslet.ui.DBInspector);
jslet.ui.DBInspector.htmlTemplate = '<div></div>';

/**
 * @class 
 * @extend jslet.ui.DBControl
 * 
 * DBError. Display dataset error. Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBError",dataset:"employee"};
 *  
 *     //1. Declaring:
 *      <div data-jslet='type:"DBError",dataset:"employee"' />
 *      or
 *      <div data-jslet='jsletParam' />
 *  
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBError = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'styleClass,dataset';
		$super(el, params);
	},

	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-errorpanel')) {
			jqEl.addClass('jl-errorpanel');
		}

		Z.renderAll();
	},

	/**
	 * @protected
	 * @override
	 */
	refreshControl: function (evt) {
		if (evt && evt.eventType == jslet.data.RefreshEvent.ERROR) {
			this.el.innerHTML = evt.message || '';
		}
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl();
	},
	
});

jslet.ui.register('DBError', jslet.ui.DBError);
jslet.ui.DBError.htmlTemplate = '<div></div>';

/**
 * @class 
 * @extend jslet.ui.DBControl
 * 
 * DBPageBar. Features: <br />
 * 1. First page, Prior Page, Next Page, Last Page; <br />
 * 2. Can go to specified page; <br />
 * 3. Can specify page size on runtime; <br />
 * 4. Need not write any code; <br />
 * 
 * Example:
 * 
 *     @example
 *      var jsletParam = {type:"DBPageBar",dataset:"bom",pageSizeList:[20,50,100,200]};
 *
 *     //1. Declaring:
 *      <div data-jslet='type:"DBPageBar",dataset:"bom",pageSizeList:[20,50,100,200]' />
 *      or
 *      <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *      <div id="ctrlId"  />
 *      //Js snippet
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 */
jslet.ui.DBPageBar = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'styleClass,dataset,showPageSize,pageSizeList';
		Z._showPageSize = true;
		
		Z._pageSizeList = [100, 200, 500];

		Z._currPageCount = 0;
		
		$super(el, params);
	},

	/**
	 * @property
	 * 
	 * Identify whether show "Page Size" part or not.
	 * 
	 * @param {Boolean | undefined} showPageSize True - show "PageSize", false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	showPageSize: function(showPageSize) {
		if(showPageSize === undefined) {
			return this._showPageSize;
		}
		this._showPageSize = showPageSize ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get a list of page size.
	 * 
	 * @param {Integer[] | undefined} pageSizeList Array of integer, like: [50,100,200].
	 * 
	 * @return {this | Integer[]} 
	 */
	pageSizeList: function(pageSizeList) {
		if(pageSizeList === undefined) {
			return this._pageSizeList;
		}
		jslet.Checker.test('DBPageBar.pageSizeList', pageSizeList).isArray();
		var size;
		for(var i = 0, len = pageSizeList.length; i < len; i++) {
			size = pageSizeList[i];
			jslet.Checker.test('DBPageBar.pageSizeList', size).isGTZero();
		}
		this._pageSizeList = pageSizeList;
		return this;
	},
	
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-pagebar')) {
			jqEl.addClass('jl-pagebar');
		}
		var template = [
		'<div class="form-inline form-group">',
	  	'<select class="form-control input-sm jl-pb-pagesize" title="', jsletlocale.DBPageBar.pageSize, '"></select>',
	    '<button class="btn btn-default btn-sm jl-pb-first" title="', jsletlocale.DBPageBar.first, '"><i class="fa fa-angle-double-left" aria-hidden="true"></i></button>',
	    '<button class="btn btn-default btn-sm jl-pb-prior" title="', jsletlocale.DBPageBar.prior, '"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
	    '<button class="btn btn-default btn-sm jl-pb-next" title="', jsletlocale.DBPageBar.next, '"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
	    '<button class="btn btn-default btn-sm jl-pb-last" title="', jsletlocale.DBPageBar.last, '"><i class="fa fa-angle-double-right" aria-hidden="true"></i></button>',
	    '<button class="btn btn-default btn-sm jl-pb-refresh" title="', jsletlocale.DBPageBar.refresh, '"><i class="fa fa-refresh" aria-hidden="true"></i></button>',
	  	'<select class="form-control input-sm jl-pb-pagenum" title="', jsletlocale.DBPageBar.pageNum, '"></select>',
	    '</div>'];
		
		jqEl.html(template.join(''));

		Z._jqPageSize = jqEl.find('.jl-pb-pagesize');
		if (Z._showPageSize) {
			Z._jqPageSize.removeClass('jl-hidden');
			var pgSizeList = Z._pageSizeList;
			var cnt = pgSizeList.length, s = '', pageSize;
			for (var i = 0; i < cnt; i++) {
				pageSize = pgSizeList[i];
				s += '<option value="' + pageSize + '">' + pageSize + '</option>';
			}

			Z._jqPageSize.html(s);
			if(cnt > 0) {
				Z._dataset.pageSize(parseInt(pgSizeList[0]));
			}
			Z._jqPageSize.on('change', function (event) {
				var dsObj = Z.dataset();
				dsObj.pageNo(1);
				dsObj.pageSize(parseInt(this.value));
				dsObj.requery();
			});
		} else {
			Z._jqPageSize.addClass('jl-hidden');
		}

		Z._jqFirstBtn = jqEl.find('.jl-pb-first');
		Z._jqPriorBtn = jqEl.find('.jl-pb-prior');
		Z._jqNextBtn = jqEl.find('.jl-pb-next');
		Z._jqLastBtn = jqEl.find('.jl-pb-last');
		Z._jqRefreshBtn = jqEl.find('.jl-pb-refresh');
		Z._jqPageNum = jqEl.find('.jl-pb-pagenum');
		
		Z._jqFirstBtn.on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var dsObj = Z.dataset();
			dsObj.pageNo(1);
			dsObj.requery();
		});

		Z._jqPriorBtn.on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var dsObj = Z.dataset(),
				num = dsObj.pageNo();
			if (num == 1) {
				return;
			}
			dsObj.pageNo(num - 1);
			dsObj.requery();
		});

		Z._jqPageNum.on('change', function (event) {
			var dsObj = Z.dataset();
			var num = parseInt(this.value);
			dsObj.pageNo(num);
			dsObj.requery();
		});

		Z._jqNextBtn.on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var dsObj = Z.dataset(),
				num = dsObj.pageNo();
			if (num >= dsObj.pageCount()) {
				return;
			}
			dsObj.pageNo(++num);
			dsObj.requery();
		});

		Z._jqLastBtn.on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var dsObj = Z.dataset();

			if (dsObj.pageCount() < 1) {
				return;
			}
			dsObj.pageNo(dsObj.pageCount());
			dsObj.requery();
		});

		Z._jqRefreshBtn.on('click', function (event) {
			Z.dataset().requery();
		});

		Z.renderAll();
	},

	/**
	 * @protected
	 * @override
	 */
	refreshControl: function (evt) {
		if (evt && evt.eventType != jslet.data.RefreshEvent.CHANGEPAGE) {
			return;
		}
		this._refreshPageNum();
		this._refreshButtonStatus();
	},

	_refreshPageNum: function() {
		var Z = this,
			num = Z._dataset.pageNo(), 
			count = Z._dataset.pageCount();
		if(count !== Z._currPageCount) {
			var s = '';
			for(var i = 1; i <= count; i++) {
				s += '<option value="' + i + '">' + i + '</option>';
			}
			Z._jqPageNum.html(s);
			Z._currPageCount = count;
		}
		Z._jqPageNum.val(num);
	},
	
	_refreshButtonStatus: function() {
		var Z = this, 
			ds = Z._dataset,
			pageNo = ds.pageNo(),
			pageCnt = ds.pageCount(),
			prevDisabled = true,
			nextDisabled = true;
		if(pageNo > 1) {
			prevDisabled = false;
		}
		if(pageNo < pageCnt) {
			nextDisabled = false;
		}
		Z._jqFirstBtn.attr('disabled', prevDisabled);
		Z._jqPriorBtn.attr('disabled', prevDisabled);
		Z._jqNextBtn.attr('disabled', nextDisabled);
		Z._jqLastBtn.attr('disabled', nextDisabled);
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl();
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		if(Z._jqPageSize) {
			Z._jqPageSize.off();
			Z._jqPageSize = null;
		}
		Z._jqFirstBtn.off();
		Z._jqPriorBtn.off();
		Z._jqNextBtn.off();
		Z._jqLastBtn.off();
		Z._jqPageNum.off();
		Z._jqRefreshBtn.off();

		Z._jqFirstBtn = null;
		Z._jqPriorBtn = null;
		Z._jqNextBtn = null;
		Z._jqLastBtn = null;
		Z._jqPageNum = null;
		Z._jqRefreshBtn = null;
		
		$super();
	}

});

jslet.ui.register('DBPageBar', jslet.ui.DBPageBar);
jslet.ui.DBPageBar.htmlTemplate = '<div></div>';

/**
 * A dialog for dataset batch editing. Example:
 * 
 *     @example
 *     var dialog = new jslet.ui.BatchEditDialog(dsObj, 'fld1,fld2');
 *     dialog.show();
 *       
 * @param {jslet.data.Dataset | String} dataset Dataset object or dataset name which need to be modified in bulk.
 * @param {String[] | String} editFields A String array or a string which separate by comma, to identify which fields will be modified in bulk.
 */
jslet.ui.BatchEditDialog = function(dataset, editFields) {
	jslet.Checker.test('BatchEditDialog#dataset', dataset).required();
	if(editFields && jslet.isString(editFields)) {
		editFields = editFields.split(',');
	}
	jslet.Checker.test('BatchEditDialog#editFields', editFields).isArray();
	dataset = jslet.data.getDataset(dataset);
	var Z = this;
	Z._dataset = dataset;
	Z._editFields = editFields;
	Z._onChanging = null;
	Z._batchDataset = new jslet.data.Dataset({name: dataset.name() + '_batch' + jslet.nextId(), fields: []});
	var fields = dataset.getEditableFields(), 
		fldName, i;
	if(editFields && editFields.length > 0) {
		for(i = editFields.length - 1; i >= 0; i--) {
			fldName = editFields[i];
			if(fields.indexOf(fldName) < 0) {
				editFields.splice(i, 1);
			}
		}
		fields = editFields;
	}
	var fldObj;
	for(i = fields.length - 1; i >= 0; i--) {
		fldName = fields[i];
		fldObj = dataset.getField(fldName);
		//If the field value is unique, it can't be batch modified.
		if(fldObj.unique()) {
			fields.splice(i, 1);
		}
	}
	Z._batchDataset.addFieldFromDataset(dataset, fields);
	fields = Z._batchDataset.getNormalFields();
	var len = fields.length;
	for(i = 0; i < len; i++) {
		fldObj = fields[i];
		fldObj.defaultValue(null);
		fldObj.defaultExpr(null);
		fldObj.required(false);
	}
};

jslet.ui.BatchEditDialog.prototype = {
	/**
	 * @event
	 * 
	 * Changing event. Fired when modify the field's value. Example:
	 * 
	 *     @example
	 *     var dialog = new jslet.ui.BatchEditDialog(dsObj, 'fld1,fld2');
	 *     dialog.onChanging(function(fldName, theValue) {});
	 *     dialog.show();
	 *     
	 * @param {Function} onChanging Changing event handler.
	 * @param {String} onChanging.fieldName The changing field name;
	 * @param {Object} onChanging.theValue The changing field value;
	 * 
	 * @return {Boolean} True - The terminal the default field changing action. False - Perform the default changing action.
	 */	
	onChanging: function(onChanging) {
		if(onChanging === undefined) {
			return this._onChanging;
		}
		this._onChanging = onChanging;
		return this;
	},
	
	/**
	 * Show the batch edit dialog.
	 */
	show: function() {
		var Z = this;
		Z._batchDataset.records(null);
		
		var creating = false;
		if(!Z._dlgId) {
			Z._createDialog();
			creating = true;
		}
		var owin = jslet('#' + Z._dlgId);
		owin.showModal();
		owin.setZIndex(999);
	},
	
	_createDialog: function() {
		var bedLocale = jsletlocale.BatchEditDialog;
		
		var opt = { type: 'window', caption: bedLocale.caption, isCenter: true, resizable: true, minimizable: false, maximizable: false, animation: 'fade', styleClass: 'jl-bedlg'};
		var owin = jslet.ui.createControl(opt);
		var onlySelectedId = jslet.nextId(), 
			onlyNullId = jslet.nextId();
		
		var html = [
		            '<div class="input-group input-group-sm">',
		            '<div class="jl-bedlg-fields" data-jslet="type:\'DBInspector\',dataset:\'', this._batchDataset.name(), 
		            '\'"></div></div>',

		            '<div class="input-group input-group-sm jl-bedlg-option">',
		            '<div class="col-sm-6"><label><input id="' + onlySelectedId + '" name="jlOnlySelected" type="checkbox" aria-label="...">',
		            bedLocale.onlySelected,
		            '</label></div>',
		            '<div class="col-sm-6"><label><input id="' + onlyNullId + '" name="jlOnlyNull" type="checkbox" aria-label="...">',
		            bedLocale.onlyNullValue,
		            '</label></div>',
		            '</div>',
					
		            '<div class="input-group input-group-sm jl-bedlg-toolbar"><label class="control-label col-sm-7">&nbsp</label>',
		            '<div class="col-sm-5"><button name="jlbtnOk" class="btn btn-default btn-sm">',		            
		            bedLocale.ok,
		            '</button><button name="jlbtnCancel" class="btn btn-default btn-sm">',
		            bedLocale.cancel,
		            '</button></div></div>',
		            '</div>'];
		owin.setContent(html.join(''));
		owin.onClosed(function () {
			return 'hidden';
		});
		this._dlgId = owin.el.id;
		var jqEl = jQuery(owin.el), 
			Z = this;
		
		jqEl.find('[name=jlbtnOk]').on('click', function(event) {
			var onlySelected = jqEl.find('[name=jlOnlySelected]').prop('checked');
			var onlyNull = jqEl.find('[name=jlOnlyNull]').prop('checked');
			if(Z._modifyData(onlySelected, onlyNull)) {
				owin.close();
			}
		});
		jqEl.find('[name=jlbtnCancel]').on('click', function(event) {
			owin.close();
		});
		
		jslet.ui.install(owin.el);
	},
	
	_modifyData: function(onlySelected, onlyNull) {
		var Z = this,
			dsObj = Z._batchDataset;
		dsObj.confirm();
		if(dsObj.recordCount() === 0 || dsObj.existDatasetError()) {
			jslet.showInfo(jsletlocale.BatchEditDialog.errorData);
			return false;
		}
		
		dsObj.first();
		var fldNames = [], fldObj, fldValue, inputValue = {},
			allFldObjs = dsObj.getNormalFields();
		for(var i = 0, len = allFldObjs.length; i < len; i++) {
			fldObj = allFldObjs[i];
			fldValue = fldObj.getValue();
			if(fldValue !== null && fldValue !== undefined) {
				fldNames.push(fldObj.name());
				inputValue[fldObj.name()] = fldValue;
			} 
		}

		var cnt = fldNames.length, fldName;
		Z._dataset.iterate(function() {
			if(onlySelected && !this.selected()) {
				return;
			}
			for(var j = 0; j < cnt; j++) {
				fldName = fldNames[j];
				if(onlyNull) {
					fldValue = this.getFieldValue(fldName);
					if(fldValue !== null && fldValue !== '' && fldValue !== undefined) {
						continue;
					} 
				}
				if(Z._onChanging) {
					if(Z._onChanging.call(this, fldName, inputValue[fldName])) {
						continue;
					}
				}
				this.setFieldValue(fldName, inputValue[fldName]);
			}
			this.confirm();
		});
		return true;
	}
};


/**
 * Show chart for a dataset. Example:
 * 
 *     @example
 *     var dialog = new jslet.ui.ChartDialog(dsObj, options);
 *     dialog.show();
 *       
 * @param {jslet.data.Dataset | String} dataset Dataset object or dataset name which the chart is shown on.
 * @param {Object} options Chart dialog options.
 * @param {Object} options.chartTypes See property "chartTypes".
 * @param {Object} options.categoryField See property "categoryField".
 * @param {Object} options.valueFields See property "valueFields".
 * @param {Object} options.excludeValueFields See property "excludeValueFields".
 * @param {Object} options.width See property "width".
 * @param {Object} options.height See property "height".
 */
jslet.ui.ChartDialog = function(dataset, options) {
	jslet.Checker.test('ChartDialog#dataset', dataset).required();
	
	var Z = this;
	Z._dataset = jslet.data.getDataset(dataset);
	
	Z._width = 800;
	Z._height = 500;

	function setProp(options, propName) {
		if(options && options[propName] !== undefined && Z[propName] !== undefined) {
			Z[propName](options[propName]);
		}
	}
	setProp(options, 'chartTypes');
	setProp(options, 'categoryField');
	setProp(options, 'valueFields');
	setProp(options, 'excludeValueFields');
	setProp(options, 'width');
	setProp(options, 'height');
	
	Z._dlgId = null;
	Z._chartId = null;
	Z._parsedValueFields = null;
	
	Z._chartSettingDs = null;
	Z._chartSettingDsName = null;
	Z._chartTypeDs = null;
	Z._initialize();
};

jslet.ui.ChartDialog.prototype = {
		
	_initialize: function() {
		var Z = this,
			chartLocale = jsletlocale.ChartDialog;
		var chartTypes = [{code: 'line', name:  chartLocale.ctLine}, 
		                  {code: 'bar', name:  chartLocale.ctBar},
		                  {code: 'pie', name:  chartLocale.ctPie},
			              {code: 'stackbar', name:  chartLocale.ctStackBar}],
			chartTypeDs = new jslet.data.Dataset({name: 'chartTypeDs' + jslet.nextId(), isEnum: true, defaultValue: 'line', 
				records: chartTypes});
		var ranges = [{code: jslet.data.RecordRange.ALL, name: chartLocale.rrAll}, 
		              {code: jslet.data.RecordRange.CURRENT, name:  chartLocale.rrCurrent},
			          {code: jslet.data.RecordRange.SELECTED, name:  chartLocale.rrSelected}],
			rangeDs = new jslet.data.Dataset({name: 'rangeDs' + jslet.nextId(), isEnum: true, defaultValue: 'line', 
				records: ranges});
		
		Z._chartTypeDs = chartTypeDs;
		var valueFldLkDs = new jslet.data.Dataset({name: 'chartDlgDs' + jslet.nextId(), isEnum: true});
		var fldCfg = [{name: 'chartType', dataType: 'S', label: chartLocale.chartType, lookup: {dataset: chartTypeDs}, required: true}, 
		              {name: 'recordRange', dataType: 'N', label: chartLocale.recordRange, lookup: {dataset: rangeDs}, required: true, defaultValue: jslet.data.RecordRange.ALL},
		              {name: 'reverse', dataType: 'B', label: chartLocale.reverse, defaultValue: false, visible: false},
		              {name: 'valueFields', dataType: 'S', label: chartLocale.valueFields, required: true, lookup: {dataset: valueFldLkDs}, 
			valueStyle: jslet.data.FieldValueStyle.MULTIPLE, editControl: {type:"DBComboSelect", textReadOnly: true}}];
		Z._chartSettingDsName = 'chartSetting' + jslet.nextId();
		Z._chartSettingDs = new jslet.data.Dataset({name: Z._chartSettingDsName, fields: fldCfg});
		Z._chartSettingDs.appendRecord();
		Z._chartSettingDs.onFieldChanged(jQuery.proxy(Z._doFieldChanged, Z));
	},
	
	/**
	 * @property
	 * 
	 * Set or get the valid chart types, the optional values are: 'line', 'stackline', 'pie', 'bar', 'stackbar'.
	 *     
	 * @param {String[] | undefined} chartTypes The valid chart types;
	 * 
	 * @return {this | String[]}
	 */	
	chartTypes: function(chartTypes) {
		if(chartTypes === undefined) {
			return this._chartTypes;
		}
		jslet.Checker.test('ChartDialog#chartTypes', chartTypes).isArray();
		this._chartTypes = chartTypes;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the category field name of chart.
	 *     
	 * @param {String | undefined} categoryField The category field name;
	 * 
	 * @return {this | String}
	 */	
	categoryField: function(categoryField) {
		if(categoryField === undefined) {
			return this._categoryField;
		}
		jslet.Checker.test('ChartDialog#categoryField', categoryField).isString().required();
		this._categoryField = categoryField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the value fields name of chart. If this property is not set, it will use the all number fields as value fields.
	 * 
	 * @param {String[] | undefined} valueFields The value field name;
	 * 
	 * @return {this | String[]}
	 */	
	valueFields: function(valueFields) {
		if(valueFields === undefined) {
			return this._valueFields;
		}
		jslet.Checker.test('ChartDialog#valueFields', valueFields).isArray();
		this._valueFields = valueFields;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get which the fields name can not be value fields.
	 *     
	 * @param {String[] | undefined} valueFields The exclude value field names;
	 * 
	 * @return {this | String[]}
	 */	
	excludeValueFields: function(excludeValueFields) {
		if(excludeValueFields === undefined) {
			return this._excludeValueFields;
		}
		jslet.Checker.test('ChartDialog#excludeValueFields', excludeValueFields).isArray();
		this._excludeValueFields = excludeValueFields;
		return this;
	},
		
	/**
	 * Set or get the dialog width.
	 * 
	 * @param {Integer | undefined} width Dialog width;
	 * 
	 * @return {this | Integer}
	 */
	width: function(width) {
		if(width === undefined) {
			return this._width;
		}
		jslet.Checker.test('ChartDialog.width', width).isNumber();
		return this;
	},
	
	/**
	 * Set or get the dialog height.
	 * 
	 * @param {Integer | undefined} height Dialog height;
	 * 
	 * @return {this | Integer}
	 */
	height: function(height) {
		if(height === undefined) {
			return this._height;
		}
		jslet.Checker.test('ChartDialog.height', height).isNumber();
		return this;
	},
	
	/**
	 * Show chart dialog.
	 */
	show: function() {
		var Z = this;
		jslet.Checker.test('ChartDialog#categoryField', Z._categoryField).isString().required();
		Z._refreshValueFields();
		
		if(!Z._parsedValueFields || Z._parsedValueFields.length === 0) {
			jslet.ui.info(jsletlocale.ChartDialog.valueFieldsRequired);
			return;
		}
		if(Z._chartTypes && Z._chartTypes.length > 0) {
			Z._chartTypeDs.filter('inArray([code], ' + JSON.stringify(Z._chartTypes) + ')');
			Z._chartTypeDs.filtered(true);
		} else {
			Z._chartTypeDs.filtered(false);
		}
		var creating = false;
		if(!Z._dlgId) {
			Z._createDialog();
			creating = true;
		}
		var owin = jslet('#' + Z._dlgId);
		owin.showModal();
		owin.setZIndex(999);
		jslet('#' + Z._chartId).drawChart();
	},
	
	_refreshValueFields: function() {
		var Z = this, i, len, fldObj, fldName;
		if(Z._valueFields && Z._valueFields.length > 0) {
			Z._parsedValueFields = Z._valueFields;
		} else {
			Z._parsedValueFields = [];
			var fields = Z._dataset.getNormalFields(),
				exFields = Z._excludeValueFields;
			for(i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				fldName = fldObj.name();
				if(fldObj.dataType() !== jslet.data.DataType.NUMBER || fldObj.lookup()) {
					continue;
				}
				if(exFields && exFields.indexOf(fldName) >= 0) {
					continue;
				}
				Z._parsedValueFields.push(fldName); 
			}
		}
		var records = [], values = [];
		for(i = 0, len = Z._parsedValueFields.length; i < len; i++) {
			fldName = Z._parsedValueFields[i];
			fldObj = Z._dataset.getField(fldName);
			records.push({code: fldName, name: fldObj.displayLabel()});
			values.push(fldName);
		}
		var dsObj = Z._chartSettingDs,
			lkds = dsObj.getField('valueFields').lookup().dataset();
		dsObj.setFieldValue('valueFields', values);
		lkds.records(records);
	},
	
	_createDialog: function() {
		var Z = this,
			chartLocale = jsletlocale.ChartDialog;
		var opt = { type: 'window', caption: chartLocale.caption, isCenter: true, resizable: true, minimizable: false, maximizable: true, animation: 'fade', styleClass: 'jl-chartdlg', 
				onSizeChanged: function() {
					window.setTimeout(function() {jslet('#' + Z._chartId).drawChart();}, 10);
				}};
		if(Z._width) {
			opt.width = Z._width;
		}
		if(Z._height) {
			opt.height = Z._height;
		}
		var owin = jslet.ui.createControl(opt);
		owin.onClosed(function () {
			Z.destroy();
		});
		var chartCfg = "type: 'DBChart', dataset: '" + Z._dataset.name() + 
			"', categoryField: '" + Z._categoryField + 
			"', valueFields: '" + Z._parsedValueFields.join(',') + "'";
		var html = '';
		html += '<div class="jl-chartdlg-editor" data-jslet="type: \'DBEditPanel\', dataset: \'' + Z._chartSettingDsName + 
		'\'"></div>';
		html += '<div class="jl-chartdlg-chart" data-jslet="' + chartCfg + '" style="width: 100%;height: 100%"></div>';
		owin.setContent(html);
		Z._dlgId = owin.el.id;
		var jqEl = jQuery(owin.el);
		
		jslet.ui.install(owin.el, function() {
			Z._chartId = jqEl.find('.jl-chartdlg-chart')[0].id;
		});
	},

	_doFieldChanged: function(fldName, fldValue) {
		var Z = this;
		if(!Z._chartId) {
			return;
		}
		var dsObj = Z._chartSettingDs;
		var chartObj = jslet('#' + Z._chartId);
		if(fldName === 'chartType') {
			if(fldValue === 'pie') {
				chartObj.chartType(fldValue);
				dsObj.getField('valueFields').valueStyle(jslet.data.FieldValueStyle.NORMAL);
				var valueFlds = dsObj.getFieldValue('valueFields');
				if(valueFlds && jslet.isArray(valueFlds) && valueFlds.length > 1) {
					dsObj.setFieldValue('valueFields', valueFlds[0]);
					return;
				}
			} else {
				dsObj.getField('valueFields').valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
			}
		}
		if(fldName === 'valueFields' && jslet.isArray(fldValue)) {
			fldValue = fldValue.join(',');
		}
		chartObj[fldName](fldValue);
		
		chartObj.drawChart();
	},
	
	destroy: function() {
		var Z = this;
    	if(Z._chartSettingDs) {
    		var lkds = Z._chartSettingDs.getField('valueFields').lookup().dataset();
    		lkds.destroy();
    		Z._chartSettingDs.destroy();
    		Z._chartSettingDs = null;
    	}
    	Z._dataset = null;
    	
	}

};


/**
 * @class
 * 
 * Export dialog for specified Dataset object. Example:
 * 
 *     @example
 *     var dlg = new jslet.ui.ExportDialog('employee');
 *     //var dlg = new jslet.ui.ExportDialog(dsObj, {includeFields: ['fld1', 'fld2']});
 *     dlg.show('employee.xml');
 * 
 * @param {jslet.data.Dataset | String} dataset Dataset object or dataset name.
 * @param {Object} options (Optional)Export options. 
 * @param {Boolean} options.hasSchemaSection Identify whether export schema section is visible or not. 
 * @param {String[]} options.includeFields Specify which fields need export. 
 * @param {String[]} options.excludeFields Specify which fields need not export. 
 */
jslet.ui.ExportDialog = function(dataset, options) {
	this._dataset = jslet.data.getDataset(dataset);
	
	this._exportDataset = null;
	
	this._dlgId = null;
	
	this._onExported = null;

	this._onQuerySchema = null;
	
	this._onSubmitSchema = null;
	
	this._progressBar = null;

	this._hasSchemaSection = false;
	
	this._includeFields = null;
	
	this._excludeFields = null;
	
	if(options) {
		this._hasSchemaSection = (options.hasSchemaSection? true: false);
		this._includeFields = options.includeFields;
		this._excludeFields = options.excludeFields;
	}
	this._initialize();
};

jslet.ui.ExportDialog.prototype = {
	/**
	 * Show export dialog.
	 * 
	 * @param {String} fileName Excel file name.
	 */	
	show: function(fileName) {
		var Z = this;
		Z._dataset.confirm();
		if(Z._dataset.existDatasetError()) {
	        jslet.ui.confirm(jsletlocale.ExportDialog.existedErrorData, null, function(button){
	        	if(button == 'cancel') {
	        		return;
	        	}
	    		return Z._innerShow(fileName);
	        });
		} else {
			return Z._innerShow(fileName);
		}
        
	},
	
	_innerShow: function(fileName) {
		var Z = this;
    	if(Z._hasSchemaSection) {
	    	var exportDsClone = Z._exportDataset;
			Z._querySchema();
    	}
		Z._hasDetailDataset = false;
		Z._refreshFields();
		var jqEl = jQuery('#' + this._dlgId);
		var owin = jqEl[0].jslet;
		fileName = (fileName || Z._dataset.description() + '.xlsx');
		var jqExpportFile = jqEl.find('[name="jltxtExportFile"]');
		jqExpportFile.val(fileName);
		if(Z._hasDetailDataset) {
			jqEl.find('[name="jlOnlyOnceDiv"]').show();
		}
		owin.showModal();
		owin.setZIndex(999);
		return owin;
	},
	
	/**
	 * @event
	 * 
	 * Query export schema event handler. Example:
	 * 
	 *     @example
	 *     var exportDialog = new jslet.ui.ExportDialog(exportingDataset, {hasSchemaSection: true});
	 *     var querySchemaFn = function(callBackFn) {
	 * 	      var exportSchemaData = [{schema: '', fields: ['field1','field2']}];
	 * 	      callBackFn(exportSchemaData); //For asynchronous operation.
	 * 	     //return exportSchemaData; 	//For synchronous operation.
	 *     };
	 * 
	 *     exportDialog.onQuerySchema(querySchemaFn);
	 *     
	 * @param {Function} onQuerySchema Query schema event handler.
	 * @param {Function} onQuerySchema.callBackFn Query schema callback function.
	 * @param {Function} onQuerySchema.callBackFn.exportSchemaData Query schema.
	 * 
	 * @return {this | Function}
	 */
	onQuerySchema: function(onQuerySchema) {
		if(onQuerySchema === undefined) {
			return this._onQuerySchema;
		}
		jslet.Checker.test('ImportDialog#onQuerySchema', onQuerySchema).isFunction();
		this._onQuerySchema = onQuerySchema;
		return this;
	},	
	
	/**
	 * @event
	 * 
	 * Submit export schema event handler. Example:
	 * 
	 *     @example
	 *     var exportDialog = new jslet.ui.ExportDialog(exportingDataset, {hasSchemaSection: true});
	 *     var submitSchemaFn = function(action, changedRec) {
	 * 	     if(action == 'insert') {}
	 * 	     if(action == 'update') {}
	 * 	     if(action == 'delete') {}
	 *     };
	 * 
	 *     exportDialog.onSubmitSchema(submitSchemaFn);
	 *     
	 * @param {Function | undefined} onSubmitSchema Submitting schema event handler.
	 * @param {String} onSubmitSchema.action Submit action, optional value: 'insert', 'update', 'delete'.
	 * @param {Object} onSubmitSchema.changedRecord Changed record.
	 * 
	 * @return {this | Function}
	 */
	onSubmitSchema: function(onSubmitSchema) {
		if(onSubmitSchema === undefined) {
			return this._onSubmitSchema;
		}
		jslet.Checker.test('ImportDialog#onSubmitSchema', onSubmitSchema).isFunction();
		this._onSubmitSchema = onSubmitSchema;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Exported event handler. Example:
	 * 
	 *     @example
	 *     var exportDialog = new jslet.ui.ExportDialog(exportingDataset);
	 *     exportDialog.onExported(function(dataset) {});
	 * 
	 * @param {Function | undefined} onExported Exported event.
	 * @param {jslet.data.Dataset} onExported.dataset Exporting dataset object.
	 * 
	 * @return {this | Function}
	 */
	onExported: function(onExported) {
		if(onExported === undefined) {
			return this._onExported;
		}
		jslet.Checker.test('ExportDialog#onExported', onExported).isFunction();
		this._onExported = onExported;
		return this;
	},
	
	_initialize: function() {
		var edLocale = jsletlocale.ExportDialog;
		var fldCfg = [
		    	      {name: 'field', type: 'S', length: 100, label: 'Field Name', nullText: 'default'}, 
		    	      {name: 'label', type: 'S', length: 50, label: 'Field Label'},
		    	      {name: 'parent', type: 'S', length: 100, label: 'Field Name'}, 
		    	      {name: 'required', type: 'B', length: 8, visible: false} 
		    	    ];
		var exportLKDs = new jslet.data.Dataset({name: 'exportLKDs' + jslet.nextId(), fields: fldCfg, 
				keyField: 'field', codeField: 'field', nameField: 'label', parentField: 'parent', isFireGlobalEvent: false});
		exportLKDs.onCheckSelectable(function(){
	        return !this.hasChildren(); 
	    });
		
		var expFldCfg = [
    	      {name: 'schema', type: 'S', length: 30, label: 'Export Schema'}, 
    	      {name: 'fields', type: 'S', length: 500, label: 'Export Fields', visible: false, valueStyle: jslet.data.FieldValueStyle.MULTIPLE, lookup: {dataset: exportLKDs}}
    	    ];
		var Z = this;
    	Z._exportDataset = new jslet.data.Dataset({name: 'exportDs' + jslet.nextId(), fields: expFldCfg, keyField: 'schema', nameField: 'schema', isFireGlobalEvent: false});
		var opt = { type: 'window', caption: edLocale.caption, isCenter: true, resizable: false, minimizable: false, maximizable: false, animation: 'fade'};
		var owin = jslet.ui.createControl(opt);
		var expHtml = '';
    	if(Z._hasSchemaSection) {
    		expHtml = 
	            '<div class="input-group input-group-sm" style="margin-bottom: 10px"><span class="input-group-addon">' +
	            edLocale.schemaName + 
	            '</span>' + 
	            '<select data-jslet="type:\'DBSelectView\', displayFields:\'schema\'"></select>' + 

	            '<span class="input-group-btn"><button class="btn btn-default btn-sm" name="jlbtnSaveAs">' + 
	            edLocale.saveAsSchema + 
	            '</button></span>' +
	            '<span class="input-group-btn"><button class="btn btn-default btn-sm" name="jlbtnSave">' + 
	            edLocale.saveSchema + 
	            '</button></span>' +
	            '<span class="input-group-btn"><button class="btn btn-default btn-sm" name="jlbtnDelete">' + 
	            edLocale.deleteSchema + 
	            '</button></span>' +
	            '</div>';
    	}
		var html = ['<div class="form-horizontal jl-expdlg-content" data-jslet="dataset: \'', Z._exportDataset.name(),
		            '\'">',
		            expHtml,
		            '<div class="input-group input-group-sm" style="width: 100%;margin-bottom: 10px">',
		            '<div class="col-sm-12 jl-expdlg-fields" data-jslet="type:\'DBList\',field:\'fields\',correlateCheck:true" style="padding:0px!important"></div></div>',

		            '<div class="input-group input-group-sm"><span class="input-group-addon">',
		            edLocale.fileName,
		            '</span>',
					'<input name="jltxtExportFile" class="form-control"></input>',
					'</div>',

					'<div class="checkbox col-sm-6">',
					'<label>',
					'<input name="jlOnlySelected" type="checkbox">', edLocale.onlySelected,
				    '</label>',
					'</div>',

					'<div class="checkbox col-sm-6" name="jlOnlyOnceDiv" style="display:none">',
					'<label>',
					'<input name="jlOnlyOnce" type="checkbox" checked="true">', edLocale.onlyOnce,
				    '</label>',
					'</div>',

					'<div class="col-sm-12"></div>',
		            '<div class="input-group input-group-sm jl-expdlg-toolbar" style="margin-bottom: 0;width:100%">',
		            '<div class="col-sm-8"><div name="jlProgressExport" data-jslet="type:\'ProgressBar\', value: 50" style="display:none;width:100%"></div></div><div class="col-sm-4"><button name="jlbtnCancel" class="btn btn-default btn-sm jl-expdlg-toolbutton">',
		            edLocale.cancel,
		            '</button><button name="jlbtnExport" class="btn btn-default btn-sm jl-expdlg-toolbutton">',
		            edLocale.exportData,
		            '</button></div></div></div>',
		            '</div>'];
		owin.setContent(html.join(''));
		owin.onClosed(function () {
			Z.destroy();
		});
		Z._dlgId = owin.el.id;
		jslet.ui.install(owin.el);
		var jqEl = jQuery(owin.el);
		Z._progressBar = jqEl.find('[name="jlProgressExport"]')[0].jslet;
		
		jqEl.find('[name="jlbtnExport"]').click(function(event) {
			Z._exportData();
		});
		jqEl.find('[name="jlbtnSave"]').click(function(event) {
			Z._saveSchema();
		});
		
		jqEl.find('[name="jlbtnSaveAs"]').click(function(event) {
			Z._saveAsSchema();
		});
		
		jqEl.find('[name="jlbtnDelete"]').click(function(event) {
			Z._deleteSchema();
		});
		
		jqEl.find('[name="jlbtnCancel"]').click(function(event) {
			owin.close();
		});
	},
	
	_saveSchema: function() {
		var dsExport = this._exportDataset;
		if(!dsExport.getFieldValue('schema')) {
			this._saveAsSchema();
			return;
		}
		dsExport.confirm();
		var currRec = dsExport.getRecord();
		this._submitSchema('update', {schema: currRec.schema, fields: currRec.fields});
	},
	
	_saveAsSchema: function() {
		var Z = this;
		jslet.ui.prompt(jsletlocale.ExportDialog.inuputSchemaLabel, null, function(button, value){
			if(button === 'ok' && value) {
				var fields = Z._exportDataset.getFieldValue('fields');
				var dsObj = Z._exportDataset;
				dsObj.disableControls();
				Z._isProgChanged = true;
				try {
					dsObj.cancel();
					dsObj.appendRecord();
					dsObj.setFieldValue('schema', value);
					dsObj.setFieldValue('fields', fields);
					dsObj.confirm();
				} finally {
					Z._isProgChanged = false;
					dsObj.enableControls();
				}
				var currRec = Z._exportDataset.getRecord();
				Z._submitSchema('insert', {schema: currRec.schema, fields: currRec.fields});
			}
		});
	},
	
	_deleteSchema: function() {
		var Z = this,
			currRec = this._exportDataset.getRecord();
		var result = this._submitSchema('delete', {schema: currRec.schema, fields: currRec.fields});
		if(result && jslet.isPromise(result)) {
			result.done(function() {
				Z._exportDataset.deleteRecord();
				if(Z._exportDataset.recordCount() === 0) {
					Z._refreshFields();
				}
			});
		} else {
			Z._exportDataset.deleteRecord();
			if(Z._exportDataset.recordCount() === 0) {
				Z._refreshFields();
			}
		}
	},	

	_querySchema: function() {
		var Z = this,
			queryFn = this._onQuerySchema || jslet.global.exportDialog.onQuerySchema;
		if(!queryFn) {
			console.warn('Event handler: onQuerySchema NOT set, can not query export schema!');
			return;
		}
		
		var result = queryFn();
		if(jslet.isPromise(result)) {
			result.done(function(schemaData) {
				if(schemaData) {
					Z._exportDataset.records(schemaData);
				}
				if(Z._exportDataset.recordCount() === 0) {
					Z._refreshFields();
				}
			});
		} else {
			if(result) {
				Z._exportDataset.records(result);
			}
			if(Z._exportDataset.recordCount() === 0) {
				Z._refreshFields();
			}
		}
	},
	
	_submitSchema: function(action, changedRecord) {
		var Z = this,
			actionFn = Z._onSubmitSchema || jslet.global.exportDialog.onSubmitSchema;
		if(actionFn) {
			return actionFn(action, changedRecord);
		} else {
			console.warn('Event handler: onSubmitSchema NOT set, can not save export schema!');
			return null;
		}
	},
	
	_exportData: function() {
		var Z = this;
		var jqEl = jQuery('#' + Z._dlgId);
		var jqExpportFile = jqEl.find('[name="jltxtExportFile"]');
		var fileName = jqExpportFile.val();
		if(!fileName || !fileName.trim()) {
			jslet.showInfo(jsletlocale.ExportDialog.fileAndFieldsRequired);
			return false;
		}
		var fields = Z._exportDataset.getFieldValue('fields');
		if(!fields || fields.length === 0) {
			jslet.showInfo(jsletlocale.ExportDialog.fileAndFieldsRequired);
			return false;
		}
		jqEl.find('[name="jlProgressExport"]').css('display', '');
		var onlySelected = jqEl.find('[name="jlOnlySelected"]').prop('checked');
		var onlyOnce = jqEl.find('[name="jlOnlyOnce"]').prop('checked');
		jslet.data.defaultXPorter.excelXPorter().exportData(Z._dataset, fileName, 
				{includeFields: fields, onlySelected: onlySelected, onlyOnce: onlyOnce, exportAggregated: true, 
			onExporting: jQuery.proxy(Z._doExporting, Z), 
			onExported: jQuery.proxy(Z._doExported, Z)});
		return true;
	},
	
	_doExported: function() {
		var Z = this;
		if(Z._onExported) {
			Z._onExported.call(Z, Z._dataset);
		}
		jslet('#' + Z._dlgId).close();
	},
	
	_doExporting: function(percent) {
		this._progressBar.value(percent);
	},
	
	_refreshFields: function() {
		var Z = this,
			fieldRecords = [{field: '_all_', label: jsletlocale.ExportDialog.all}],
			fieldNames = [],
			includeFields = Z._includeFields,
			excludeFields = Z._excludeFields;
		
		function addFields(fieldRecords, fieldNames, fields, parentField, isDetailDs) {
			var fldObj, fldName, dataType;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				dataType = fldObj.dataType();
				var isActionCol = (dataType === jslet.data.DataType.ACTION);
				var isEdtActCol = (dataType === jslet.data.DataType.EDITACTION);
				if(isActionCol || isEdtActCol) {
					continue;
				}
				fldName = fldObj.name();
				if(parentField && isDetailDs) {
					fldName = parentField + '.' + fldName;
				}
				var detailDs = fldObj.detailDataset();
				if(detailDs) {
					Z._hasDetailDataset = true;
					fieldRecords.push({field: fldName, label: fldObj.label(), parent: parentField || '_all_'});
					addFields(fieldRecords, fieldNames, detailDs.getNormalFields(), fldName, true);
					continue;
				}
				if(includeFields) {
					if(includeFields.indexOf(fldName) < 0) {
						continue;
					}
				} else {
					if(!fldObj.visible()) {
						continue;
					}	
				}
				if(excludeFields && excludeFields.indexOf(fldName) >= 0) {
					continue;
				}
				
				var required = fldObj.required();
				fieldRecords.push({field: fldName, label: fldObj.label() + (required? '<span class="jl-lbl-required">*</span>': ''), 
					parent: parentField || '_all_', required: required});
				var fldChildren = fldObj.children();
				if(fldChildren) {
					addFields(fieldRecords, fieldNames, fldChildren, fldName);
				} else {
					fieldNames.push(fldName);
				}
			}
		}
		addFields(fieldRecords, fieldNames, this._dataset.getFields());
		var exportLKDs = this._exportDataset.getField('fields').lookup().dataset();
		exportLKDs.records(fieldRecords);
		this._exportDataset.setFieldValue('fields', fieldNames);
		exportLKDs.first();
	},

	destroy: function() {
    	if(this._exportDataset) {
    		var lkds = this._exportDataset.getField('fields').lookup().dataset();
    		lkds.destroy();
    		this._exportDataset.destroy();
    		this._exportDataset = null;
    	}
    	this._dataset = null;
    	this._progressBar = null;
	}
};

/**
 * @class
 * 
 * A dialog to view image. Example:
 * 
 *     @example
 *     var imgViewer = new jslet.ui.ImageViewer({width: 500, height: 600, isModal: true});
 *     imgViewer.show('./img/igm1.jpg', 'Dog');
 * 
 * @param {Object} dialogCfg Dialog configuration.
 * @param {Integer} dialogCfg.width Dialog width.
 * @param {Integer} dialogCfg.height Dialog height.
 * @param {Boolean} dialogCfg.isModal Show image viewer as a modal dialog. 
 */
jslet.ui.ImageViewer = function(dialogCfg) {
	this._imageUrl = null;
	this._width = 400;
	this._height = 500;
	this._isModal = false;
	if(dialogCfg){
		if(dialogCfg.width) {
			this.width(dialogCfg.width);
		}
		if(dialogCfg.height) {
			this.height(dialogCfg.height);
		}
		this.isModal(dialogCfg.isModal);
	}
};

jslet.ui.ImageViewer.prototype = {
	
	/**
	 * Set or get the dialog width.
	 * 
	 * @param {Integer | undefined} width Dialog width;
	 * 
	 * @return {this | Integer}
	 */
	width: function(width) {
		if(width === undefined) {
			return this._width;
		}
		jslet.Checker.test('ImageViewer.width', width).isNumber();
		return this;
	},
	
	/**
	 * Set or get the dialog height.
	 * 
	 * @param {Integer | undefined} height Dialog height;
	 * 
	 * @return {this | Integer}
	 */
	height: function(height) {
		if(height === undefined) {
			return this._height;
		}
		jslet.Checker.test('ImageViewer.height', height).isNumber();
		return this;
	},
	
	/**
	 * Identify showing the dialog as modal or not.
	 * 
	 * @param {Boolean | undefined} isModal True - Showing as modal, false -otherwise;
	 * 
	 * @return {this | Boolean}
	 */
	isModal: function(isModal) {
		if(isModal === undefined) {
			return this._isModal;
		}
		this._isModal = isModal? true: false;
		return this;
	},
	
	/**
	 * Set image URL and show it.
	 * 
	 * @param {String} imageUrl Image URL.
	 * 
	 * @return {this}
	 */
	imageUrl: function(imageUrl) {
		this._imageUrl = imageUrl;
		this.show(imageUrl);
		return this;
	},
	
	/**
	 * Show dialog.
	 * 
	 */
	show: function(imageUrl, name) {
		var Z = this;
		var creating = false;
		if(!Z._dlgId) {
			Z._createDialog();
			creating = true;
		}
		var owin = jslet('#' + Z._dlgId);
		var jqViewer = jQuery(owin.el).find('*[name=viewer]').css('background-image', 'url(' + imageUrl + ')');
		owin.changeCaption(jsletlocale.ImageViewer.caption + (name? ' - ' + name: ''));
		if(Z._isModal) {
			owin.showModal();
		} else {
			owin.show();
		}
		
		owin.setZIndex(999);
	},
	
	_createDialog: function() {
		var opt = { type: 'window', caption: jsletlocale.ImageViewer.caption, isCenter: true, resizable: true, minimizable: false, maximizable: true, 
				width: this._width, height: this._height, animation: 'fade', styleClass: 'jl-isdlg'};
		var owin = jslet.ui.createControl(opt);
		var html = '<div name="viewer" style="width: 100%; height: 100%;background-size:contain;background-origin:content;background-position:50% 50%;background-repeat:no-repeat;"/>';
		owin.setContent(html);
		this._dlgId = owin.el.id;
		jslet.ui.install(owin.el);
	}
};

/**
 * @class
 * 
 * Import dialog for specified Dataset object. Example:
 * 
 *     @example
 *     var dlg = new jslet.ui.ImportDialog(dsObj, {includeFields: ['fld1', 'fld2']});
 *     var dlg = new jslet.ui.ImportDialog('employee');
 * 
 * @param {jslet.data.Dataset | String} dataset (Required)Dataset object or dataset name.
 * @param {Object} options (Optional)Import options. 
 * @param {Boolean} options.hasSchemaSection Identify whether import schema section is visible or not. 
 * @param {String[]} options.includeFields Specify which fields need import. 
 * @param {String[]} options.excludeFields Specify which fields need not import. 
 */
jslet.ui.ImportDialog = function(dataset, options) {
	this._dataset = jslet.data.getDataset(dataset);
	this._importDataset = null;
	
	this._parsedData = null;
	
	this._dlgId = null;
	
	this._onCustomImport = null;
	this._onImporting = null;
	this._onImported = null;
	
	this._onQuerySchema = null;
	this._onSubmitSchema = null;
	
	this._schemaDsName = null;
	this._schemaLkDsName = null;
	
	this._colHeaders = null;
	
	this._progressBar = null;
	
	this._hasSchemaSection = false;
	
	this._includeFields = null;
	
	this._excludeFields = null;
	
	if(options) {
		this._hasSchemaSection = (options.hasSchemaSection? true: false);
		this._includeFields = options.includeFields;
		this._excludeFields = options.excludeFields;
	}
	this._initialize();
};

jslet.ui.ImportDialog.prototype = {
	/**
	 * Show import dialog
	 */
	show: function() {
		var Z = this;
		if(Z._hasSchemaSection) {
			Z._querySchema();
		}
		Z._refreshFields();
		var jqEl = jQuery('#' + this._dlgId);
		jqEl.find('#jltxtImportFile').val('');
		var owin = jqEl[0].jslet;
		owin.showModal();
		owin.setZIndex(999);
		return owin;
	},

	/**
	 * @event
	 * 
	 * Query import schema event handler. Example:
	 * 
	 *     @example
	 *     var importDialog = new jslet.ui.ImportDialog(importingDataset, {hasSchemaSection: true});
	 *     var querySchemaFn = function(callBackFn) {
	 * 	      var exportSchemaData = [{schema: '', fields: ['field1','field2']}];
	 * 	      callBackFn(exportSchemaData); //For asynchronous operation.
	 * 	     //return exportSchemaData; 	//For synchronous operation.
	 *     };
	 * 
	 *     importDialog.onQuerySchema(querySchemaFn);
	 *     
	 * @param {Function} onQuerySchema Query schema event handler.
	 * @param {Function} onQuerySchema.callBackFn Query schema callback function.
	 * @param {Function} onQuerySchema.callBackFn.exportSchemaData Query schema.
	 * 
	 * @return {this | Function}
	 */
	onQuerySchema: function(onQuerySchema) {
		if(onQuerySchema === undefined) {
			return this._onQuerySchema;
		}
		jslet.Checker.test('ImportDialog#onQuerySchema', onQuerySchema).isFunction();
		this._onQuerySchema = onQuerySchema;
		return this;
	},	
	
	/**
	 * @event
	 * 
	 * Submit import schema event handler. Example:
	 * 
	 *     @example
	 *     var importDialog = new jslet.ui.ImportDialog(importingDataset, {hasSchemaSection: true});
	 *     var submitSchemaFn = function(action, changedRec) {
	 * 	     if(action == 'insert') {}
	 * 	     if(action == 'update') {}
	 * 	     if(action == 'delete') {}
	 *     };
	 * 
	 *     importDialog.onSubmitSchema(submitSchemaFn);
	 *     
	 * @param {Function | undefined} onSubmitSchema Submitting schema event handler.
	 * @param {String} onSubmitSchema.action Submit action, optional value: 'insert', 'update', 'delete'.
	 * @param {Object} onSubmitSchema.changedRecord Changed record.
	 * 
	 * @return {this | Function}
	 */
	onSubmitSchema: function(onSubmitSchema) {
		if(onSubmitSchema === undefined) {
			return this._onSubmitSchema;
		}
		jslet.Checker.test('ImportDialog#onSubmitSchema', onSubmitSchema).isFunction();
		this._onSubmitSchema = onSubmitSchema;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Customized importing event. Example:
	 * 
	 *     @example
	 *     var importDialog = new jslet.ui.ImportDialog(importingDataset);
	 *     importDialog.onCustomImport(function(importingDataset, parsedData, fieldMaps) { });
	 *     
	 * @param {Function | undefined} onCustomImport Customized importing event.
	 * @param {jslet.data.Dataset} onCustomImport.importingDataset Importing dataset object.
	 * @param {Object[]} onCustomImport.parsedData Parsed data from excel file.
	 * @param {Object[]} onCustomImport.fieldMaps Field map to excel header.
	 * 
	 * @return {this | Function}
	 */
	onCustomImport: function(onCustomImport) {
		if(onCustomImport === undefined) {
			return this._onCustomImport;
		}
		jslet.Checker.test('ImportDialog#onCustomImport', onCustomImport).isFunction();
		this._onCustomImport = onCustomImport;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Importing event. Example:
	 * 
	 *     @example
	 *     var importDialog = new jslet.ui.ImportDialog(importingDataset);
	 *     importDialog.onImporting(function(fieldName, excelColValue) { });
	 *     
	 * @param {Function | undefined} onImporting Importing event.
	 * @param {String} onImporting.fieldName The importing field name.
	 * @param {String} onImporting.excelColValue The mapping column value of excel file.
	 * 
	 * @return {this | Function}
	 */
	onImporting: function(onImporting) {
		if(onImporting === undefined) {
			return this._onImporting;
		}
		jslet.Checker.test('ImportDialog#onImporting', onImporting).isFunction();
		this._onImporting = onImporting;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Imported event. Example:
	 * 
	 *     @example
	 *     var importDialog = new jslet.ui.ImportDialog(importingDataset);
	 *     importDialog.imported(function(dataset) { });
	 *     
	 * @param {Function | undefined} onImported Imported event.
	 * @param {jslet.data.Dataset} onImported.dataset Importing dataset object.
	 * 
	 * @return {this | Function}
	 */
	onImported: function(onImported) {
		if(onImported === undefined) {
			return this._onImported;
		}
		jslet.Checker.test('ImportDialog#onImported', onImported).isFunction();
		this._onImported = onImported;
		return this;
	},
	
	_initialize: function() {
		var Z = this;
		var fldCfg = [
		              {name: 'schema', type: 'S', length: 100, label: 'Schema'},
		              {name: 'fieldMaps', type: 'S', length: 5000, label: 'fieldMaps', visible: false},
		              {name: 'colHeaders', type: 'S', length: 5000, label: 'fieldMaps', visible: false}
		              ];
		var schemaLKDs = new jslet.data.Dataset({name: 'schemaLKDs' + jslet.nextId(), fields: fldCfg, 
				keyField: 'schema', codeField: 'schema', nameField: 'schema', autoRefreshHostDataset: true, auditLogEnabled: false, logChanges: false});
		
		var importDialogLocale = jsletlocale.ImportDialog;
		Z._schemaLkDsName = schemaLKDs.name();
		fldCfg = [
		    {name: 'schema', type: 'S', length: 100, label: 'Schema', lookup: {dataset: schemaLKDs}}
        ];		
		Z._schemaDsName = 'schemaDs' + jslet.nextId();
		var schemaDs = new jslet.data.Dataset({name: Z._schemaDsName, fields: fldCfg}); 
		schemaDs.onFieldChanged(function(fldName, fldValue) {
			Z._doSchemaChanged(this, fldValue);
		});
		
		fldCfg = [
	    	      {name: 'colHeader', type: 'S', length: 100, label: 'Column Header', displayWidth: 16}
	    	    ];
		var exportLKDs = new jslet.data.Dataset({name: 'exportLKDs' + jslet.nextId(), fields: fldCfg, 
				keyField: 'colHeader', codeField: 'colHeader', nameField: 'colHeader', autoRefreshHostDataset: true});
		
		var expFldCfg = [
       	      {name: 'field', type: 'S', length: 100, label: 'Field Name', visible: false}, 
	   	      {name: 'label', type: 'S', length: 100, visible: false},
	   	      {name: 'displayLabel', type: 'S', length: 100, label: importDialogLocale.fieldLabel, displayWidth: 12, readOnly: true},
    	      {name: 'colHeader', type: 'S', length: 100, label: importDialogLocale.columnHeader, displayWidth: 12, editControl: 'DBSelect',
    	    	  lookup: {dataset: exportLKDs}},
    	      {name: 'required', type: 'B', length: 10, label: 'required', visible: false},
    	      {name: 'fixedValue', type: 'S', length: 50, label: importDialogLocale.fixedValue, displayWidth: 12}
    	    ];
    	Z._importDataset = new jslet.data.Dataset({name: 'importDs' + jslet.nextId(), fields: expFldCfg, keyField: 'schema', nameField: 'schema', isFireGlobalEvent: false});
		var opt = { type: 'window', caption: importDialogLocale.caption, isCenter: true, resizable: false, minimizable: false, maximizable: false, animation: 'fade'};
		var owin = jslet.ui.createControl(opt);
		var expHtml = '';
    	if(Z._hasSchemaSection) {
    		expHtml = 
	            '<div class="input-group input-group-sm" style="margin-bottom: 10px"><span class="input-group-addon">' +
	            importDialogLocale.schemaName + 
	            '</span>' + 
	            '<select data-jslet="type:\'DBSelect\',dataset: \'' + schemaDs.name() + '\', field:\'schema\'"></select>' + 

	            '<span class="input-group-btn"><button class="btn btn-default btn-sm" name="jlbtnSaveAs">' + 
	            importDialogLocale.saveAsSchema + 
	            '</button></span>' +
	            '<span class="input-group-btn"><button class="btn btn-default btn-sm" name="jlbtnSave">' + 
	            importDialogLocale.saveSchema + 
	            '</button></span>' +
	            '<span class="input-group-btn"><button class="btn btn-default btn-sm" name="jlbtnDelete">' + 
	            importDialogLocale.deleteSchema + 
	            '</button></span>' +
	            '</div>';
    	}

		var html = ['<div class="form-horizontal jl-impdlg-content">',
	            expHtml,
	            '<div class="input-group input-group-sm"><span class="input-group-addon">',
	            importDialogLocale.fileName,
	            '</span>',
				'<input name="jltxtImportFile" title="*.xls|*.xlsx|*.xlsb|*.xlsm|*.ods" class="form-control" type="file"></input>',
				'</div>',
				
	            '<div class="col-sm-12 jl-impdlg-fieldmap" style="padding: 0!important">',
	            '<div data-jslet="type:\'DBTable\', dataset: \'', 
	            Z._importDataset.name(), 
	            '\', editable: true, hasFilterDialog:false, disableHeadSort: true"></div></div>',

				'<div class="col-sm-12"></div>',
	            '<div class="input-group input-group-sm jl-impdlg-toolbar" style="margin-bottom: 0;width:100%">',
	            '<div class="col-sm-9"><div name="jlProgressImport" data-jslet="type:\'ProgressBar\', value: 50" style="display:none;width:100%"></div></div>',
	            '<div class="col-sm-3"><button name="jlbtnCancel" class="btn btn-default btn-sm jl-impdlg-toolbutton">',
	            importDialogLocale.cancel,
	            '</button><button name="jlbtnImport" class="btn btn-default btn-sm jl-impdlg-toolbutton">',
	            importDialogLocale.importData,
	            '</button></div></div></div>',
	            '</div>'];
		owin.setContent(html.join(''));
		owin.onClosed(function () {
			Z.destroy();
		});
		jslet.ui.install(owin.el);
		Z._dlgId = owin.el.id;
		var jqEl = jQuery(owin.el);
		Z._progressBar = jqEl.find('[name="jlProgressImport"]')[0].jslet;

		jqEl.find('[name="jlbtnSaveAs"]').click(function(event) {
			Z._saveAsSchema();
		});
		
		jqEl.find('[name="jlbtnSave"]').click(function(event) {
			Z._saveSchema();
		});
		
		jqEl.find('[name="jlbtnDelete"]').click(function(event) {
			Z._deleteSchema();
		});
		
		jqEl.find('[name="jltxtImportFile"]').on('change', function(event) {
			var files = event.delegateTarget.files;
			if(files.length > 0) {
				Z._readFile(files[0]);
			}
		});
		jqEl.find('[name="jlbtnImport"]').click(function(event) {
			Z._importData();
		});
		
		jqEl.find('[name="jlbtnCancel"]').click(function(event) {
			owin.close();
		});
	}, //End of '_initialize'
	
	_querySchema: function() {
		var Z = this,
			queryFn = this._onQuerySchema || jslet.global.importDialog.onQuerySchema;
		
		function innerRefresh(schemaData) {
			if(!schemaData) {
				return;
			}
			jslet.data.getDataset(Z._schemaLkDsName).records(schemaData);
		}
		
		if(!queryFn) {
			console.warn('Event handler: onQuerySchema NOT set, can not query export schema!');
			return;
		}
		var result = queryFn();
		if(result && jslet.isPromise(result)) {
			result.done(function(schemaData) {
				innerRefresh(schemaData);
			});
		} else {
			innerRefresh(result);
		}
	},
	
	_submitSchema: function(action, changedRecord) {
		var Z = this;
		
		var actionFn = Z._onSubmitSchema || jslet.global.importDialog.onSubmitSchema;
		if(actionFn) {
			delete changedRecord._jl_;
			return actionFn(action, changedRecord);
		}
		return null;
	},
	
	_saveAsSchema: function() {
		var Z = this;
		var fieldMaps = Z._getFieldMaps();
		if(!fieldMaps) {
			return;
		}
		jslet.ui.prompt(jsletlocale.ExportDialog.inuputSchemaLabel, null, function(button, schemaName){
			if(button === 'ok' && schemaName) {
				var dsSchema = jslet.data.getDataset(Z._schemaDsName);
				var dsSchemaLk = jslet.data.getDataset(Z._schemaLkDsName);
				var context = dsSchemaLk.startSilenceMove();
				var foundRecno = -1;
				var breakDown = false;
				try {
					if(dsSchemaLk.findByKey(schemaName)) {
		            	foundRecno = dsSchemaLk.recno();
					}
				} finally {
					dsSchemaLk.endSilenceMove(context);
				}
				if(foundRecno >= 0) {
		            jslet.ui.confirm(jsletlocale.ImportDialog.existedSchema, null, function(button){
		            	if(button == 'cancel') {
		            		return;
		            	}
		            	dsSchemaLk.recno(foundRecno);
						dsSchemaLk.editRecord();
						dsSchemaLk.setFieldValue('schema', schemaName);
						var strMaps = JSON.stringify(fieldMaps);
						dsSchemaLk.setFieldValue('fieldMaps', strMaps);
						dsSchemaLk.setFieldValue('colHeaders', JSON.stringify(Z._getColHeaders()));
						dsSchemaLk.confirm();
						Z._isSaving = true;
						try {
							dsSchema.setFieldValue('schema', schemaName);
						} finally {
							Z._isSaving = false;
						}
						Z._submitSchema('insert', dsSchemaLk.getRecord());
		            });
				} else {
					dsSchemaLk.appendRecord();
					dsSchemaLk.setFieldValue('schema', schemaName);
					var strMaps = JSON.stringify(fieldMaps);
					dsSchemaLk.setFieldValue('fieldMaps', strMaps);
					dsSchemaLk.setFieldValue('colHeaders', JSON.stringify(Z._getColHeaders()));
					dsSchemaLk.confirm();
					Z._isSaving = true;
					try {
						dsSchema.setFieldValue('schema', schemaName);
					} finally {
						Z._isSaving = false;
					}
					Z._submitSchema('insert', dsSchemaLk.getRecord());
				}
			}
		});
	},
	
	_saveSchema: function() {
		var Z = this,
			dsSchemaLk = jslet.data.getDataset(Z._schemaLkDsName),
			dsSchema = jslet.data.getDataset(Z._schemaDsName);
		if(dsSchemaLk.recordCount() === 0 || !dsSchema.getFieldValue('schema')) {
			Z._saveAsSchema();
			return;
		}
		var fieldMaps = Z._getFieldMaps();
		if(!fieldMaps) {
			return;
		}
		dsSchemaLk.editRecord();
		var strMaps = JSON.stringify(fieldMaps);
		dsSchemaLk.setFieldValue('fieldMaps', fieldMaps);
		dsSchemaLk.setFieldValue('colHeaders', JSON.stringify(Z._getColHeaders()));
		
		dsSchemaLk.confirm();
		Z._submitSchema('update', dsSchemaLk.getRecord());
	},
	
	_deleteSchema: function() {
		var Z = this,
			dsSchemaLk = jslet.data.getDataset(Z._schemaLkDsName),
			dsSchema = jslet.data.getDataset(Z._schemaDsName);
		if(dsSchemaLk.recordCount() === 0 || !dsSchema.getFieldValue('schema')) {
			return;
		}
		var result = Z._submitSchema('delete', dsSchemaLk.getRecord());
		if(result && jslet.isPromise(result)) {
			result.done(function() {
				dsSchemaLk.deleteRecord();
				dsSchema.setFieldValue('schema', null);
				dsSchema.confirm();
			});
		} else {
			dsSchemaLk.deleteRecord();
			dsSchema.setFieldValue('schema', null);
			dsSchema.confirm();
		}
	},
	
	_refreshFields: function() {
		var fieldRecords = [], fldObj, fldName, required, label,
			fields = this._dataset.getNormalFields(), 
			labels = {}, errLabels = null,
			includeFields = this._includeFields,
			excludeFields = this._excludeFields;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			fldName = fldObj.name();
			if(includeFields) {
				if(includeFields.indexOf(fldName) < 0) {
					continue;
				}
			} else {
				if(!fldObj.visible()) {
					continue;
				}	
			}
			if(excludeFields && excludeFields.indexOf(fldName) >= 0) {
				continue;
			}
			required = fldObj.required();
			label = fldObj.label();
			if(labels[label]) {
				if(errLabels) {
					errLabels += ',' + errLabels;
				} else {
					errLabels = label;
				}
			} else {
				labels[label] = true;
			}
			fieldRecords.push({field: fldName, label: label, displayLabel: label + (required? '<span class="jl-lbl-required">*</span>': ''), required: required});
		}
		if(errLabels) {
			jslet.showInfo(jslet.formatMessage(jsletlocale.ImportDialog.duplicateFields, [errLabels]));
		}
		this._importDataset.records(fieldRecords);
		this._importDataset.first();
		this._colHeaders = null;
	},

	_readFile: function(fileObj) {
		var Z = this,
			name = fileObj.name,
			suffix = name.substring(name.lastIndexOf('.') + 1) || '';
		suffix = suffix.toLowerCase();
		if(suffix != 'xls' && suffix != 'xlsx' && suffix != 'xlsb' && suffix != 'xlsm' && suffix != 'ods') {
			jslet.showError(jsletlocale.ImportDialog.notSupportFile);
			return;
		}
	    var	reader = new window.FileReader();
		reader.onload = function(e) {
			var fileContent,
				parsedResult = null;
			if(e) {
				fileContent = e.target.result;
			} else {
				fileContent = reader.content;
			}
			try {
				parsedResult = jslet.data.defaultXPorter.excelXPorter().importData(Z._dataset, fileContent);
			} catch(e) {
				console.error(e);
				jslet.showError(jsletlocale.ImportDialog.notSupportFile);
			}
			if(parsedResult) {
				Z._colHeaders = parsedResult.header;
				Z._addColumnHeader(Z._colHeaders);
				Z._parsedData = parsedResult.data;
			} else {
				jslet.showError(jsletlocale.ImportDialog.noData);
			}
		};
		reader.readAsBinaryString(fileObj);
	},
	
	_addColumnHeader: function(headers) {
		if(!headers) {
			return;
		}
		var fieldRecords = [], i, len;
		for(i = 0, len = headers.length; i < len; i++) {
			fieldRecords.push({/*colNum: i,*/ colHeader: headers[i]});
		}
		this._importDataset.getField('colHeader').lookup().dataset().records(fieldRecords);
		this._mapFieldColumn();
	},
	
	_mapFieldColumn: function() {
		var headers = this._colHeaders;
		if(!headers) {
			return;
		}
		var records = this._importDataset.records(),
			label, rec, found = false;
		for(var i = 0, len = records.length; i < len; i++) {
			rec = records[i];
			if(!rec.fixedValue) {
				label = rec.colHeader || rec.label;
				if(headers.indexOf(label) >= 0) {
					rec.colHeader = label;
					found = true;
				} else {
					rec.colHeader = null;
				}
			} else {
				if(rec.colHeader) {
					rec.colHeader = null;
					found = true;
				}
			}
		}
		if(found) {
			this._importDataset.records(records);
		}
	},
	
	_doSchemaChanged: function(dsSchema, schemaName) {
		if(this._isSaving) {
			return;
		}
		var mapFlds = null,
			colHeaders, records,
			mapFldCnt = 0,
			dsSchemaLk = jslet.data.getDataset(this._schemaLkDsName);
		if(schemaName) {
			mapFlds = JSON.parse(dsSchema.getFieldValue('schema.fieldMaps'));
			mapFldCnt = mapFlds.length;
			
			var arrColHeaders = JSON.parse(dsSchema.getFieldValue('schema.colHeaders'));
			records = [];
			for(var k = 0, headerCnt = arrColHeaders.length; k < headerCnt; k++) {
				records.push({colHeader: arrColHeaders[k]});
			}
			var dsColHeader = this._importDataset.getField('colHeader').lookup().dataset();
			dsColHeader.records(records);
		}
		records = this._importDataset.records();
		var rec, fldName, schColHeader, mapFld;
		for(var i = 0, len = records.length; i < len; i++) {
			rec = records[i];
			fldName = rec.field;
			rec.colHeader = null;
			rec.fixedValue = null;
			schColHeader = null;
			if(mapFlds) {
				for(var j = 0; j < mapFldCnt; j++) {
					mapFld = mapFlds[j];
					if(mapFld.field == fldName) {
						rec.colHeader = mapFld.colHeader;
						rec.fixedValue = mapFld.fixedValue;
						break;
					}
				}
			}
		}
		this._importDataset.records(records);
	},
	
	_getFieldMaps: function() {
		var records = this._importDataset.records(), 
			row, fieldMaps = [];
		for(var i = 0, len = records.length; i < len; i++) {
			row = records[i];
			if(row.colHeader || row.fixedValue) {
				fieldMaps.push({field: row.field, colHeader: row.colHeader, fixedValue: row.fixedValue});
			} else if(row.required) {
				jslet.showInfo(jsletlocale.ImportDialog.noColHeader);
				return null;
			}
		}
		var fldCnt = fieldMaps.length;
		if(fldCnt === 0) {
			jslet.showInfo(jsletlocale.ImportDialog.noColHeader);
			return null;
		}
		return fieldMaps;
	},
	
	_getColHeaders: function() {
		var colHeaders = [],
			records = this._importDataset.getField('colHeader').lookup().dataset().records();
		for(var i = 0, len = records.length; i < len; i++) {
			colHeaders.push(records[i].colHeader);
		}
		return colHeaders;
	},
	
	_importData: function() {
		var Z = this;
		if(!Z._parsedData || Z._parsedData.length === 0) {
			jslet.showInfo(jsletlocale.ImportDialog.noData);
			return;
		}
		var fieldMaps = Z._getFieldMaps();
		if(!fieldMaps) {
			return;
		}
		
		if(Z._onCustomImport) {
			var isSuccess = Z._onCustomImport(Z._dataset, Z._parsedData, fieldMaps);
			if(!isSuccess) {
				return;
			}
		} else {
			var fldMap, text, colHeader,
				masterDs = Z._dataset, 
				parsedData = Z._parsedData,
				textList = [], textRec, row,
				fldCnt = fieldMaps.length,
				importingFn = Z._onImporting;
			
			for(var i = 0, len = parsedData.length; i < len; i++) {
				row = parsedData[i];
				textRec = {};
				for(var j = 0; j < fldCnt; j++) {
					fldMap = fieldMaps[j];
					colHeader = fldMap.colHeader; 
					if(colHeader) {
						if(importingFn) {
							text = importingFn(fldMap.field, row[colHeader]);
						} else {
							text = row[colHeader];
						}
					} else {
						text = fldMap.fixedValue;
					}
					if(text) {
						textRec[fldMap.field] = text;
					}
				}
				textList.push(textRec);
			}
			var jqEl = jQuery('#' + Z._dlgId);
			jqEl.find('[name="jlProgressImport"]').css('display', '');
			var dsObj = Z._dataset;
			var progressBarObj = Z._progressBar;
			dsObj.disableControls();
			new jslet.StepProcessor(textList.length, function(start, end, percent) {
				try {
					dsObj.importTextList(textList, start, end);
				} catch (e) {
					dsObj.enableControls();
					throw e;
				}
				progressBarObj.value(percent);
				if(percent === 100) {
					dsObj.enableControls();
					dsObj.first();
					Z._doImported();
				}
			}).run();
		}
		
		return;
	},
	
	_doImported: function() {
		var Z = this;
		if(Z._onImported) {
			Z._onImported(Z._dataset);
		}
		jslet('#' + Z._dlgId).close();
	},
	
	destroy: function() {
		var Z = this;
		Z._onImporting = null;
		Z._onImported = null;
		Z._onCustomImport = null;
		Z._progressBar = null;
		
		Z._dataset = null;
		var dsSchemaLk = jslet.data.getDataset(Z._schemaLkDsName);
		if(dsSchemaLk) {
			dsSchemaLk.destroy();
		}
		var dsSchema = jslet.data.getDataset(Z._schemaDsName);
		if(dsSchema) {
			dsSchema.destroy();
		}
		if(Z._importDataset) {
    		var lkds = Z._importDataset.getField('colHeader').lookup().dataset();
    		lkds.destroy();
    		this._importDataset.destroy();
    		this._importDataset = null;
		}
	}
};



/**
 * @class
 * 
 * A dialog to configure input settings like 'defaultValue', 'valueFollowed', 'focused'. <br />
 * It's used for ender user to configure their own preferences. Example:
 * 
 *     @example
 *     jslet.ui.defaultInputSettingDialog.show(dataset); 
 */
jslet.ui.InputSettingDialog = function() {
	this._inputSettingDs = null;
	
	this._hostDataset = null;
	
	this._onClosed = null;
	
	this._onRestoreDefault = null;
	
	this._settings = null;
	var Z = this;
	
	function doProxyFieldChanged(dataRec, proxyFldName, proxyFldObj) {
		var hostFldObj = jslet.data.getDataset(dataRec.dataset).getField(proxyFldName);
		proxyFldObj.dataType(hostFldObj.dataType());
		proxyFldObj.length(hostFldObj.length());
		proxyFldObj.scale(hostFldObj.scale());
		proxyFldObj.editMask(hostFldObj.editMask());

		proxyFldObj.displayFormat(hostFldObj.displayFormat());
		proxyFldObj.dateFormat(hostFldObj.dateFormat());
		proxyFldObj.displayControl(hostFldObj.displayControl());
		proxyFldObj.validChars(hostFldObj.validChars());
		if(hostFldObj.lookup()) {
			var hostLkObj = hostFldObj.lookup();
			var lkObj = hostLkObj.toPlanObject();
			lkObj.onlyLeafLevel = false;
			
			proxyFldObj.lookup(lkObj);
			proxyFldObj.editControl('DBComboSelect');
		} else {
			proxyFldObj.lookup(null);
			var editorObj = hostFldObj.editControl();
			var fldType = hostFldObj.getType();
			if(fldType !== jslet.data.DataType.DATE && fldType !== jslet.data.DataType.BOOLEAN) {
				editorObj = {type: 'DBText'};
			}
			proxyFldObj.editControl(editorObj);
		}
		proxyFldObj.valueStyle(jslet.data.FieldValueStyle.NORMAL);
	}

	function initialize() {
		var fldCfg = [{name: 'dataset', type: 'S', length: 30, visible: false},
		              {name: 'field', type: 'S', length: 30, displayWidth: 20, visible: false},
		              {name: 'label', type: 'S', label: jsletlocale.InputSettingDialog.labelLabel, length: 50, displayWidth: 15, disabled: true},
		              {name: 'parentField', type: 'S', length: 30, visible: false},
		              {name: 'tabIndex', type: 'N', label: 'tabIndex', length: 3, visible: false},
		              {name: 'focused', type: 'B', label: jsletlocale.InputSettingDialog.labelFocused, displayWidth: 6},
		              {name: 'valueFollow', type: 'B', label: jsletlocale.InputSettingDialog.labelValueFollow, displayWidth: 6},
		              {name: 'defaultValue', type: 'P', label: jsletlocale.InputSettingDialog.labelDefaultValue, length: 200, displayWidth:30, proxyHostFieldName: 'field', proxyFieldChanged: doProxyFieldChanged},
		              {name: 'isDatasetField', type: 'B', label: '', visible: false}
		              ];
		
		Z._inputSettingDs = new jslet.data.Dataset({name: 'custDs' + jslet.nextId(), fields: fldCfg, 
				keyField: 'field', nameField: 'label', parentField: 'parentField', logChanges: false, indexFields: 'tabIndex', isFireGlobalEvent: false});
		
		var custContextFn = function(fldObj, changingFldName){
			var dataset = fldObj.dataset();
			fldObj.disabled(dataset.getFieldValue('isDatasetField'));
		};
		
		Z._inputSettingDs.contextRules([{"condition": "true", "rules": [
		     {"field": 'defaultValue', "customized": custContextFn},
		     {"field": 'focused', "customized": custContextFn},
		     {"field": 'valueFollow', "customized": custContextFn}
		]}]);
		Z._inputSettingDs.enableContextRule();
		Z._inputSettingDs.onFieldChanged(function(propName, propValue){
			if(Z._isInit) {
				return;
			}
			if(!Z._settings) {
				Z._settings = {};
			}
			var hostDsName = this.getFieldValue('dataset'),
				hostFldName = this.getFieldValue('field'),
				dsSetting = Z._settings[hostDsName];
			if(!dsSetting) {
				dsSetting = {};
				Z._settings[hostDsName] = dsSetting;
			}
			var fldSetting = dsSetting[hostFldName];
			if(!fldSetting) {
				fldSetting = {};
				dsSetting[hostFldName] = fldSetting; 
			}
			fldSetting[propName] = propValue;
		});
	}
	
	initialize.call(this);
};

jslet.ui.InputSettingDialog.prototype = {
		
	hostDataset: function(hostDataset) {
		if(hostDataset === undefined) {
			return this._hostDataset;
		}
		this._hostDataset = hostDataset;
		return this;
	},
	
	/**
	 * Close event, you can use this event to store input settings. Example:
	 * 
	 *     @example
	 *     jslet.ui.defaultInputSettingDialog.show(dataset);
	 *     jslet.ui.defaultInputSettingDialog.onClosed(function(settings) {
	 *        //Save into DB
	 *     });
	 * 
	 * @param {Function | undefined} onClosed Close event.
	 * @param {Object} onClosed.settings Input settings.
	 * 
	 * @return {this | Function}
	 */
	onClosed: function(onClosedFn) {
		if(onClosedFn === undefined) {
			return this._onClosed;
		}
		this._onClosed = onClosedFn;
		return this;
	},
	
	onRestoreDefault: function(onRestoreDefaultFn) {
		if(onRestoreDefaultFn === undefined) {
			return this._onRestoreDefault;
		}
		this._onRestoreDefault = onRestoreDefaultFn;
		return this;
	},
	
	/**
	 * Show dialog.
	 * 
	 * @param {jslet.data.Dataset | String} hostDataset The dataset will be changed input setting.
	 */
	show: function(hostDataset) {
		jslet.Checker.test('InputSettingDialog.show#hostDataset', hostDataset).required();
		var Z = this;
		Z._hostDataset = jslet.data.getDataset(hostDataset);
		Z._isInit = true;
		Z._settings = null;
		Z._inputSettingDs.disableControls();
		try {
			Z._initializeFields();
		} finally {
			Z._isInit = false;
			Z._inputSettingDs.first();
			Z._inputSettingDs.enableControls();
		}
		var creating = false;
		if(!Z._dlgId) {
			Z._createDialog();
			creating = true;
		}
		var tblFields = jQuery('#' + Z._dlgId).find('.jl-isdlg-fields')[0].jslet;
		tblFields.expandAll();
		var tableWidth = tblFields.getTotalWidth() + tblFields.getTotalWidth(true);
		if(creating) {
			tblFields.onRowClick(function() {
				if(this.dataset().getFieldValue('isDatasetField')) {
					this.toggle();
				}
			});
		}
		var owin = jslet('#' + Z._dlgId);
		owin.changeSize(tableWidth + 60);
		owin.showModal();
		owin.setZIndex(999);
	},
	
	_initializeFields: function(hostDs, isKeepFields, parentField) {
		var Z = this,
			dataset = Z._inputSettingDs,
			fldObj;
		if(!hostDs) {
			hostDs = jslet.data.getDataset(Z._hostDataset);
		}
		var fields = hostDs.getNormalFields();
		if(!isKeepFields) {
			dataset.records(null);
		}
		var isDsFld;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			isDsFld = fldObj.detailDataset()? true: false;
			var dataType = fldObj.dataType;
			if(!isDsFld && !fldObj.visible() || 
					dataType === jslet.data.DataType.ACTION || 
					dataType === jslet.data.DataType.EDITACTION) {
				continue;
			}
			dataset.appendRecord();
			dataset.setFieldValue('isDatasetField', isDsFld);
			
			dataset.setFieldValue('dataset', hostDs.name());
			dataset.setFieldValue('field', fldObj.name());
			dataset.setFieldValue('label', fldObj.label());
			dataset.setFieldValue('tabIndex', fldObj.tabIndex());
			if(parentField) {
				dataset.setFieldValue('parentField', parentField);
			}
			if(!isDsFld) {
				dataset.setFieldValue('defaultValue', fldObj.defaultValue());
				dataset.setFieldValue('focused', fldObj.focused());
				dataset.setFieldValue('valueFollow', fldObj.valueFollow());
			}
			dataset.confirm();
			if(isDsFld) {
				this._initializeFields(fldObj.detailDataset(), true, fldObj.name());
			}
		}
	},
	
	_createDialog: function() {
		var opt = { type: 'window', caption: jsletlocale.InputSettingDialog.caption, isCenter: true, resizable: true, minimizable: false, maximizable: false, animation: 'fade', styleClass: 'jl-isdlg'};
		var owin = jslet.ui.createControl(opt);
		var html = [
		            '<div class="input-group input-group-sm" style="margin-bottom: 10px">',
		            '<div class="jl-isdlg-fields" data-jslet="type:\'DBTable\',dataset:\'', this._inputSettingDs.name(), 
		            '\',treeField:\'label\',readOnly:false,hasFilterDialog:false"></div></div>',

//		            '<div class="input-group input-group-sm">',
//		            '<div class="col-sm-3"><button id="jlbtnSave" class="btn btn-default btn-sm">',
//		            '<button id="jlbtnUp" class="btn btn-default btn-sm">', jsletlocale.InputSettingDialog.save, '</button>',
//		            '<button id="jlbtnDown" class="btn btn-default btn-sm">', jsletlocale.InputSettingDialog.save, '</button>',
//		            '</div>',
//		            '<label class="control-label col-sm-6">&nbsp</label>',
//		            '<div class="col-sm-3"><button id="jlbtnSave" class="btn btn-default btn-sm">',
//		            '<hr class="col-sm-11" />',
		            '<div class="input-group input-group-sm jl-isdlg-toolbar"><label class="control-label col-sm-9">&nbsp</label>',
		            '<div class="col-sm-3"><button id="jlbtnSave" class="btn btn-default btn-sm">',		            
		            jsletlocale.InputSettingDialog.save,
		            '</button><button id="jlbtnCancel" class="btn btn-default btn-sm">',
		            jsletlocale.InputSettingDialog.cancel,
		            '</button></div></div>',
		            '</div>'];
		owin.setContent(html.join(''));
		owin.onClosed(function () {
			return 'hidden';
		});
		this._dlgId = owin.el.id;
		var jqEl = jQuery(owin.el), 
			Z = this;
		
//		jqEl.find('#jlbtnUp').on('click', function(event) {
//			var dataset = Z._inputSettingDs;
//			if(dataset.recordCount() === 0) {
//				return;
//			}
//			var idx = dataset.getFieldValue('tabIndex');
//			if(!idx) {
//				idx = dataset.recno();
//			}
//			if(idx === 0) {
//				return;
//			}
//			var context = dataset.startSilenceMove();
//			try {
//				dataset.setFieldValue('tabIndex', idx - 1);
//				dataset.prior();
//				dataset.setFieldValue('tabIndex', idx);
//				dataset.confirm();
//			} finally {
//				dataset.endSilenceMove(context);
//			}
//			dataset.indexFields(dataset.indexFields());
//		});
		
		jqEl.find('#jlbtnSave').on('click', function(event) {
			if(Z._settings) {
				var hostDs, fldObj, fldSetting, propSetting;
				for(var dsName in Z._settings) {
					hostDs = jslet.data.getDataset(dsName);
					fldSetting = Z._settings[dsName]; 
					for(var fldName in fldSetting) {
						fldObj = hostDs.getField(fldName);
						propSetting = fldSetting[fldName];
						for(var propName in propSetting) {
							fldObj[propName](propSetting[propName]);
						}
					}
				}
				if(Z._onClosed) {
					Z._onClosed(Z._settings);
				}
			}
			owin.close();
		});
		jqEl.find('#jlbtnCancel').on('click', function(event) {
			owin.close();
		});
		
		jslet.ui.install(owin.el);
	}
};

/**
 * Default input setting dialog. Example:
 * 
 *     @example
 *     jslet.ui.defaultInputSettingDialog.show(dataset);
 *      
 * @member jslet.ui
 * @type {jslet.ui.InputSettingDialog}
 * 
 */
jslet.ui.defaultInputSettingDialog = new jslet.ui.InputSettingDialog();

/**
 * @class 
 * @extend jslet.ui.Control
 * 
 * Dataset designer, it can be used to design a dataset object. <br />  
 * Example:
 * 
 *     @example
 *     var jsletParam = {type:"DatasetDesigner"};
 * 
 *     //1. Declaring:
 *     <div id="chartId" data-jslet='type:"DatasetDesigner"' />
 *     or
 *     <div data-jslet='jsletParam' />
 *
 *     //2. Binding
 *     <div id="ctrlId"  />
 *     //Js snippet
 *     var el = document.getElementById('ctrlId');
 *     jslet.ui.bindControl(el, jsletParam);
 *
 *     //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 *
 */
jslet.ui.DatasetDesigner = jslet.Class.create(jslet.ui.Control, {
	
	/**
	 * @protected
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'onLoadDatasetMeta, onSaveDatasetMeta';
		Z.requiredProperties = 'onLoadDatasetMeta, onSaveDatasetMeta';
		
		Z._datasetMetas = null;
		
		Z._onLoadDatasetMeta = null;
		
		Z._onSaveDatasetMeta = null;
		
		Z._prepareDataset();
		$super(el, params);
	},
	
	/**
	 * @event
	 * 
	 * Dataset meta loading event. It can be a Function or a global function name.
	 * 
	 * @param {Function | String} onLoadDatasetMeta Dataset meta loading event handler.
	 * 
	 * @return {this}
	 */
	onLoadDatasetMeta: function(onLoadDatasetMeta) {
		jslet.Checker.test('DatasetDesigner.onLoadDatasetMeta', onLoadDatasetMeta).required();
		this._onLoadDatasetMeta = onLoadDatasetMeta;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Dataset meta saving event. It can be a Function or a global function name.
	 * 
	 * @param {Function | String} onSaveDatasetMeta Dataset meta saving event handler.
	 * 
	 * @return {this}
	 */
	onSaveDatasetMeta: function(onSaveDatasetMeta) {
		jslet.Checker.test('DatasetDesigner.onSaveDatasetMeta', onSaveDatasetMeta).required();
		this._onSaveDatasetMeta = onSaveDatasetMeta;
		return this;
	},
	
	_prepareDataset: function() {
		var dsgnLocale = jsletlocale.DatasetDesigner;
		new jslet.data.Dataset({name: 'dsgnDatatype', isEnum: true, records: 
			'S:' + dsgnLocale.dtString + 
			',N:' + dsgnLocale.dtNumber + 
			',D:' + dsgnLocale.dtDate + 
			',B:' + dsgnLocale.dtBoolean +
			',V:' + dsgnLocale.dtDataset +
			',A:' + dsgnLocale.dtAction +
			',E:' + dsgnLocale.dtEdit
			});
		
		new jslet.data.Dataset({name: 'dsgnAlignment', isEnum: true, records: 
			'left:' + dsgnLocale.alLeft + 
			',center:' + dsgnLocale.alCenter + 
			',right:' + dsgnLocale.alRight}); 
		
		new jslet.data.Dataset({name: 'dsgnValueStyle', isEnum: true, records: 
			'0:' + dsgnLocale.vsNormal + 
			',1:' + dsgnLocale.vsBetween + 
			',2:' + dsgnLocale.vsMultiple});

		new jslet.data.Dataset({name: 'dsgnEditor', fields: [{name: 'code', type: 'S'}], keyField: 'code', 
			records: 
		[{code: 'DBText'}, {code: 'DBCheckBox'}, {code: 'DBSelect'}, {code: 'DBComboSelect'},
		{code: 'DBAutoComplete'}, {code: 'DBDatePicker'}, {code: 'DBPassword'}, {code: 'DBTextArea'},
		{code: 'DBSpinEdit'}, {code: 'DBBetweenEdit'}, {code: 'DBCheckBoxGroup'}, {code: 'DBRadioGroup'},
		{code: 'DBRangeSelect'}, {code: 'DBDataLabel'}, {code: 'DBTimePicker'}, {code: 'DBImage'},
		{code: 'DBRating'}, {code: 'DBHtml'}, {code: 'DBCKEditor'}, {code: 'DBUEditor'}]
		});

		var objAccessor = {
			getValue: function(dataRec, fldName) {
				if(dataRec) {
					var origValue = dataRec[fldName];
					if(origValue) {
						return JSON.stringify(origValue);
					}
				}
				return null;
			},
			
			setValue: function(dataRec, fldName, value) {
				if(!dataRec) {
					return;
				} 
				if(value && jslet.isString(value)) {
					dataRec[fldName] = JSON.parse(value);
				}
			}
		};
			
		var fldCfg = [
          	{name: 'name', type: 'S', length: 30, label: dsgnLocale.fName, displayWidth: 20, required: true, unique: true},
          	{name: 'shortName', type: 'S', length: 10, label: dsgnLocale.fShortName, displayWidth: 10},
          	{name: 'label', type: 'S', length: 30, label: dsgnLocale.fLabel, displayWidth: 20},
          	{name: 'displayLabel', type: 'S', length: 30, label: dsgnLocale.fDisplayLabel, displayWidth: 20},
          	{name: 'tip', type: 'S', length: 30, label: dsgnLocale.fTip, displayWidth: 20},
          	{name: 'dataType', type: 'S', length: 1, label: dsgnLocale.fDateType, lookup: {dataset:"dsgnDatatype"}, displayWidth: 10, defaultValue:'S'},
            {name: 'detailDataset', type: 'S', length: 30, label: dsgnLocale.fDetailDataset, displayWidth: 10},
          	{name: 'length', type: 'N', length: 3, label: dsgnLocale.fLength, displayWidth: 10, diaplayFormat: '##0', editControl: 'DBSpinEdit', dataRange: {min: 0, max: 10000}, defaultValue: 10},
          	{name: 'scale', type: 'N', length: 3, label: dsgnLocale.fScale, displayWidth: 6, diaplayFormat: '##0', editControl:'DBSpinEdit', dataRange: {min: 0, max: 10}},
          	{name: 'defaultExpr', type: 'S', length: 100, label: dsgnLocale.fDefaultExpr, displayWidth: 10},
          	{name: 'defaultValue', type: 'S', length: 100, label: dsgnLocale.fDefaultValue, displayWidth: 10, customValueAccessor: objAccessor},
          	{name: 'valueStyle', type: 'S', label: dsgnLocale.fValueStyle, displayWidth: 10, lookup: {dataset:"dsgnValueStyle"}, defaultValue: 0},

          	{name: 'displayWidth', type: 'N', length: 3, label: dsgnLocale.fDisplayWidth, displayWidth: 10, dataRange: {min: 0, max: 10000}, diaplayFormat: '##0',editControl:'DBSpinEdit'},
          	{name: 'displayOrder', type: 'N', length: 3, label: dsgnLocale.fDisplayOrder, displayWidth: 6, defaultValue: 0, diaplayFormat: '##0', editControl:'DBSpinEdit', dataRange: {min: 0, max: 10000}},
          	{name: 'alignment', type: 'S', length: 3, label: dsgnLocale.fAlignment, displayWidth: 10, lookup: {dataset:"dsgnAlignment"}},
          	{name: 'displayFormat', type: 'S', length: 30, label: dsgnLocale.fDisplayFormat, displayWidth: 10},
          	{name: 'editControl', type: 'S', length: 100, label: dsgnLocale.fEditControl, displayWidth: 10, lookup: {dataset: "dsgnEditor"}, nullText: dsgnLocale.fvEditControl},
          	{name: 'nullText', type: 'S', label: dsgnLocale.fNullText, displayWidth: 10, defaultValue: dsgnLocale.fvNullText},

          	{name: 'formula', type: 'S', length: 100, label: dsgnLocale.fFormula, displayWidth: 50},
          	{name: 'readOnly', type: 'B', label: dsgnLocale.fReadOnly, displayWidth: 10},
          	{name: 'visible', type: 'B', label: dsgnLocale.fVisible, displayWidth: 10},
          	{name: 'unitConverted', type: 'B', label: dsgnLocale.fUnitConverted, displayWidth: 10},

          	{name: 'required', type: 'B', label: dsgnLocale.fRequired, displayWidth: 10},
          	{name: 'dataRange', type: 'S', length: 50, label: dsgnLocale.fDataRange, displayWidth: 10, customValueAccessor: objAccessor},
          	{name: 'regularExpr', type: 'S', length: 50, label: dsgnLocale.fRegularExpr, displayWidth: 10, customValueAccessor: objAccessor},
          	{name: 'unique', type: 'B', label: dsgnLocale.fUnique, displayWidth: 10},
          	{name: 'editMask', type: 'S', label: dsgnLocale.fEditMask, displayWidth: 10},
          	{name: 'valueCountLimit', type: 'N', length: 3, label: dsgnLocale.fValueCountLimit, displayWidth: 8, dataRange: {min: 0, max: 10}, diaplayFormat: '##0', editControl:'DBSpinEdit'},
          	{name: 'validChars', type: 'S', label: dsgnLocale.fValidChars, displayWidth: 10},
          	
          	{name: 'mergeSame', type: 'B', label: dsgnLocale.fMergeSame, displayWidth: 10},
          	{name: 'mergeSameBy', type: 'S', label: dsgnLocale.fMmergeSameBy, displayWidth: 10},
          	{name: 'aggraded', type: 'B', label: dsgnLocale.fAggraded, displayWidth: 10},
          	{name: 'aggradedBy', type: 'S', label: dsgnLocale.fAggradedBy, displayWidth: 10},
          	{name: 'valueFollow', type: 'B', label: dsgnLocale.fValueFollow, displayWidth: 10},
          	{name: 'focused', type: 'B', label: dsgnLocale.fFocused, displayWidth: 10},
          	{name: 'fixedValue', type: 'S', label: dsgnLocale.fFixedValue, displayWidth: 10},
          	{name: 'antiXss', type: 'B', label: dsgnLocale.fAntiXss, displayWidth: 10},

          	{name: 'trueValue', type: 'S', label: dsgnLocale.fTrueValue, displayWidth: 10},
          	{name: 'falseValue', type: 'S', label: dsgnLocale.fFalseValue, displayWidth: 10},
          	{name: 'trueText', type: 'S', label: dsgnLocale.fTrueText, displayWidth: 10},
          	{name: 'falseText', type: 'S', label: dsgnLocale.fFalseText, displayWidth: 10},
          	
          	{name: 'lookup', type: 'S', length: 100, label: dsgnLocale.fLookup, displayWidth: 10, customValueAccessor: objAccessor}
          ];
		
		var Z = this;
		var dsgnField = new jslet.data.Dataset({name: 'dsgnField', fields: fldCfg});
		dsgnField.onFieldChanged(function(fldName, fldValue) {
			if(fldName === 'dataType') {
				Z._doDataTypeChanged(fldValue);
			}
		});
		var contextRules = [
		    {condition: '[valueStyle] === 2',
				rules: [
				    {field: 'valueCountLimit', meta: {disabled: false}}
				],
				otherwise: [
					{field: 'valueCountLimit', meta: {disabled: true}, value: null}
				]
			},
			{condition: '[dataType] === "B"',
				rules: [
				    {field: 'editControl', lookup: {fixedFilter: 'inlist([code], "DBCheckBox", "DBText", "DBDataLabel") '}},
				    {field: 'valueStyle', meta: {disabled: true}},
				    {field: 'displayFormat', meta: {disabled: true}},
				    {field: 'editMask', meta: {disabled: true}}
				],
				otherwise: [
				    {field: 'valueStyle', meta: {disabled: false}},
				    {field: 'displayFormat', meta: {disabled: false}},
				    {field: 'editMask', meta: {disabled: false}}
				]
			},
			{condition: '[dataType] === "D"',
				rules: [
				    {field: 'editControl', lookup: {fixedFilter: 'inlist([code], "DBDatePicker", "DBText", "DBDataLabel") '}}
				]
			},
			{condition: '[lookup]',
				rules: [
				    {field: 'editControl', lookup: {fixedFilter: 'inlist([code], "DBComboSelect", "DBSelect", "DBAutoComplete", "DBCheckBoxGroup", "DBRadioGroup","DBText", "DBDataLabel")'}}
				]
			},
			{condition: '[dataType] === "N" && ![lookup]',
				rules: [
				    {field: 'editControl', lookup: {fixedFilter: 'inlist([code], "DBText", "DBSpinEdit", "DBRangeSelect", "DBRating", "DBDataLabel") '}}
				]
			},
			{condition: '[dataType] === "S" && ![lookup]',
				rules: [
				    {field: 'editControl', lookup: {fixedFilter: 'inlist([code], "DBText", "DBTextArea", "DBPassword", "DBHtml", "DBImage", "DBCKEditor", "DBUEditor", "DBDataLabel") '}}
				]
			}
		];
		
		dsgnField.contextRules(contextRules);
		
		fldCfg = [
	      	{name: 'name', type: 'S', length: 30, label: dsgnLocale.dsName, displayWidth: 20, required: true, unique: true},
	      	{name: 'description', type: 'S', length: 100, label: dsgnLocale.dsDesc, displayWidth: 20},
	      	
	      	{name: 'isEnum', type: 'B', defaultValue: false},
	      	{name: 'records', type: 'S', length: 2000, editControl: 'DBTextArea'},
	      	{name: 'keyField', type: 'S', length: 30, label: dsgnLocale.dsKeyField, displayWidth: 10},
	      	{name: 'codeField', type: 'S', length: 30, label: dsgnLocale.dsCodeField, displayWidth: 10},
	      	{name: 'nameField', type: 'S', length: 30, label: dsgnLocale.dsNameField, displayWidth: 10},
	      	{name: 'parentField', type: 'S', length: 30, label: dsgnLocale.dsParentField, displayWidth: 10},
	      	{name: 'selectField', type: 'S', length: 30, label: dsgnLocale.dsSelectField, displayWidth: 10, visible: false},
	      	{name: 'statusField', type: 'S', length: 30, label: dsgnLocale.dsStatusField, displayWidth: 10, visible: false},
	      	{name: 'contextRules', type: 'S', length: 3000, label: dsgnLocale.dsContextRules, displayWidth: 10},
	      	{name: 'queryUrl', type: 'S', length: 300, label: dsgnLocale.dsQueryUrl, displayWidth: 10, visible: false},
	      	{name: 'submitUrl', type: 'S', length: 300, label: dsgnLocale.dsSubmitUrl, displayWidth: 10, visible: false},
	      	{name: 'recordClass', type: 'S', length: 50, label: dsgnLocale.dsRecordClass, displayWidth: 10, visible: false},
	      	{name: 'pageSize', type: 'N', length: 5, label: dsgnLocale.dsPageSize, displayWidth: 10, visible: false},
	      	
	      	{name: 'fixedIndexFields', type: 'S', length: 100, label: dsgnLocale.dsFixedIndexFields, displayWidth: 10},
	      	{name: 'indexFields', type: 'S', length: 100, label: dsgnLocale.dsIndexFields, displayWidth: 10},
	      	{name: 'fixedFilter', type: 'S', length: 200, label: dsgnLocale.dsFixedFilter, displayWidth: 10},
	      	{name: 'filter', type: 'S', length: 200, label: dsgnLocale.dsFilter, displayWidth: 10},
	      	
	      	{name: 'filtered', type: 'B', label: dsgnLocale.dsFiltered, displayWidth: 10, visible: false},
	      	{name: 'readOnly', type: 'B', label: dsgnLocale.dsReadOnly, displayWidth: 10, visible: false},
	      	{name: 'auditLogEnabled', type: 'B', label: dsgnLocale.dsAuditLogEnabled, displayWidth: 10, visible: false},
			{name: 'fields', type: 'V', label: 'Fields', detailDataset:'dsgnField', visible:false}
	    ];
		
		var dsgnDataset = new jslet.data.Dataset({name: 'dsgnDataset', fields: fldCfg});
		
		fldCfg = [
	      	{name: 'id', type: 'S', length: 30},
	      	{name: 'objCode', type: 'S', length: 50},
	      	{name: 'objName', type: 'S', length: 50},
	      	{name: 'objType', type: 'S', length: 2},
	      	{name: 'parentId', type: 'S', length: 30},
	      	{name: 'changed', type: 'B'},
	      	{name: 'isEnum', type: 'B'},
	      	{name: 'dsName', type: 'S'},
	      	{name: 'fldName', type: 'S'}
		];
		var dsObject = new jslet.data.Dataset({name: 'dsgnObject', fields: fldCfg, keyField: 'id', codeField: 'objCode', nameField: 'objName', parentField: 'parentId', logChanges: false});
		dsObject.on(jslet.data.DatasetEvent.AFTERSCROLL, function() {
			Z._doObjectChanged();
		});
	},
		
	/**
	 * @protected
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},

	/**
	 * @protected
	 * @override
	 */
	bind: function () {
		if(!this.el.id) {
			this.el.id = jslet.nextId();
		}
		var jqEl = jQuery(this.el);
		if(jqEl.hasClass('jl-dsgn-ds')) {
			jqEl.addClass('form-group form-group-sm jl-dsgn-ds');
		}
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(this.el);
		var html = '<div class="col-xs-3" style="height: 100%"><div style="height: 100%" name="dsgnObject" ' + 
			'data-jslet="type: \'DBTreeView\', dataset: \'dsgnObject\', displayFields: \'[objName] + %22(%22 + [objCode] + %22)%22\', expandLevel: 1"' +
			'></div></div>' + 
			'<div class="col-xs-9">' + 
			'<div name="dsgnDs" style="display: none">' + 
			'<div name="dsgnDsBase" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnDataset\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'name\'}, {field: \'description\', dataCols: 6}]"></div>' + 

			'<div name="dsgnEnumValues" style="display: none" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnDataset\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'records\'}]"></div>' + 
			
			'<div name="dsgnDsLookup" style="display: none" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnDataset\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'keyField\'}, {field: \'codeField\'}, {field: \'nameField\'}, {field: \'parentField\'}]"></div>' + 
			
			'<div name="dsgnDsFilter" style="display: none" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnDataset\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'fixedIndexFields\'}, {field: \'indexFields\'}, {field: \'fixedFilter\'}, {field: \'filter\'}]"></div>' + 
			'</div>' + 
			
			'<div name="dsgnFld" style="display: none">' + 
			'<div name="dsgnFldBase" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'name\'}, {field: \'label\'}, {field: \'shortName\'}, {field: \'dataType\'}]"></div>' +
			
			'<div name="dsgnFldDetail" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'detailDataset\', dataCols: 6}]"></div>' +

			'<div name="dsgnFldCommon" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'displayOrder\'},{field: \'displayWidth\'}, {field: \'alignment\'}, {field: \'visible\'}]"></div>' +
			
			'<div name="dsgnFldLookup" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'lookup\', dataCols: 6}]"></div>' +
			
			'<div name="dsgnFldEditable" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'editControl\'}, {field: \'readOnly\'}, {field: \'required\'}, {field: \'unique\'}, {field: \'nullText\'}, {field: \'valueStyle\'}, {field: \'valueCountLimit\'}, ' + 
			'{field: \'defaultValue\'}, {field: \'displayFormat\'}, {field: \'editMask\'}, {field: \'focused\'}, ' + 
			'{field: \'valueFollow\'}, {field: \'dataRange\'}, {field: \'regularExpr\'}, {field: \'mergeSame\', inFirstCol: true}, {field: \'mergeSameBy\', dataCols: 6}]"></div>' +
			
			'<div name="dsgnFldAction" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'fixedValue\', dataCols: 6}]"></div>' +
			
			'<div name="dsgnFldBool" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'trueValue\'}, {field: \'falseValue\'}, {field: \'trueText\'}, {field: \'falseText\'}]"></div>' +
			
			'<div name="dsgnFldString" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'antiXss\'}]"></div>' +
			
			'<div name="dsgnFldNumber" data-jslet="type:\'DBEditPanel\', dataset: \'dsgnField\', labelCols: 2, columnCount: 3, onlySpecifiedFields: true,' + 
			'fields: [{field: \'aggraded\'}, {field: \'aggradedBy\', dataCols: 6}]"></div>' +
			
			'</div>';
		console.log(html);
		
		jqEl.html(html);
		jslet.ui.install(Z.el);
		jslet(jqEl.find('[name="dsgnObject"]')).onGetIconClass(function() {
			var dsObj = this.dataset();
			if(dsObj.getFieldValue('objType') === 'd') {
				return 'fa fa-table';
			} else {
				return 'fa fa-dot-circle-o';
			}
		});
		Z.queryDatasetMeta();
	},
	
	queryDatasetMeta: function () {
		var Z = this;
		if(!Z._onLoadDatasetMeta) {
			return;
		}
		var dsMetas = Z._onLoadDatasetMeta();
		if(!dsMetas) {
			return;
		}
		if(dsMetas.done) {
			dsMetas.done(function(result) {
				Z._parse(result);
			});
		} else {
			Z._parse(dsMetas);
		}
	},
	
	addDatasetMeta: function() {
		var dsObject = jslet.data.getDataset('dsgnObject');
		dsObject.appendRecord();
		dsObject.setFieldValue('isEnum', true);
	},
	
	addEnumDatasetMeta: function() {
		var dsObject = jslet.data.getDataset('dsgnObject');
		dsObject.appendRecord();
		dsObject.setFieldValue('isEnum', false);
	},
	
	deleteDatasetMeta: function() {
		var dsObject = jslet.data.getDataset('dsgnObject');
		dsObject.deleteRecord();
	},
	
	_parse: function (dsMetas) {
		this._datasetMetas = dsMetas;
		jslet.data.getDataset('dsgnDataset').records(dsMetas);
		if(!dsMetas || dsMetas.length === 0) {
			return;
		}
		
		var dsMeta, arrObj = [];
		
		function addFields(fields, parentId, dsName) {
			var fldMeta, fldId, fldName;
			for(var j = 0, fldLen = fields.length; j < fldLen; j++) {
				fldMeta = fields[j];
				fldName = fldMeta.name;
				fldId = 'f-' + fldName;
				arrObj.push({id: fldId, objCode: fldName, objName: fldMeta.label || fldMeta.name, objType: 'f', parentId: parentId, dsName: dsName, fldName: fldName});
				if(fldMeta.children) {
					addFields(fldMeta.children, fldId);
				}
			}
		}
		
		var dsId, isEnum, dsName;
		for(var i = 0, len = dsMetas.length; i < len; i++) {
			dsMeta = dsMetas[i];
			dsName = dsMeta.name;
			dsId = 'd-' + dsName;
			isEnum = dsMeta.isEnum? true: false;
			arrObj.push({id: dsId, objCode: dsName, objName: dsMeta.description || dsName, objType: 'd', isEnum: isEnum, dsName: dsName});
			if(!isEnum) {
				addFields(dsMeta.fields, dsId, dsName);
			}
		}
		jslet.data.getDataset('dsgnObject').records(arrObj);
	},
	
	_doObjectChanged: function() {
		var Z = this,
			dsObject = jslet.data.getDataset('dsgnObject'),
			objType = dsObject.getFieldValue('objType'),
			dsName = dsObject.getFieldValue('dsName'),
			fldName = dsObject.getFieldValue('fldName'),
			jqEl = jQuery(Z.el),
			jqDataset = jqEl.find('[name=dsgnDs]'),
			jqDsLookup = jqEl.find('[name=dsgnDsLookup]'),
			jqDsFilter = jqEl.find('[name=dsgnDsFilter]'),
			
			jqField = jqEl.find('[name=dsgnFld]'),
			dsgnDataset = jslet.data.getDataset('dsgnDataset'),
			dsgnField = jslet.data.getDataset('dsgnField');
		if(objType === 'd' ) {
			dsgnDataset.findByField('name', dsName);
			var isEnum = dsObject.getFieldValue('isEnum');
			if(isEnum) {
				jqDsLookup.hide();
				jqDsFilter.hide();
			} else {
				jqDsLookup.show();
				jqDsFilter.show();
			}
			jqField.hide();
			jqDataset.show();
		} else {
			dsgnDataset.findByField('name', dsName);
			dsgnField.findByField('name', fldName);
			var dataType = dsgnField.getFieldValue('dataType');
			Z._doDataTypeChanged(dataType);
			jqDataset.hide();
			jqField.show();
		}
	},
	
	_doDataTypeChanged: function(dataType) {
		var Z = this,
			jqEl = jQuery(Z.el),
			dsgnField = jslet.data.getDataset('dsgnField'),
			jqFldDetail = jqEl.find('[name=dsgnFldDetail]'),
			jqFldCommon = jqEl.find('[name=dsgnFldCommon]'),
			jqFldAction = jqEl.find('[name=dsgnFldAction]'),
			jqFldEditAction = jqEl.find('[name=dsgnFldEditAction]'),

			jqFldEditable = jqEl.find('[name=dsgnFldEditable]'),
			jqFldBool = jqEl.find('[name=dsgnFldBool]'),
			jqFldLookup = jqEl.find('[name=dsgnFldLookup]'),
			jqFldString = jqEl.find('[name=dsgnFldString]'),
			jqFldNumber = jqEl.find('[name=dsgnFldNumber]');
		
		jqFldDetail.hide();
		jqFldCommon.hide();
		jqFldAction.hide();
		jqFldEditAction.hide();
		jqFldBool.hide();
		jqFldEditable.hide();
		jqFldLookup.hide();
		jqFldString.hide();
		jqFldNumber.hide();
		if(dataType === jslet.data.DataType.DATASET) {
			jqFldDetail.show();
			dsgnField.getField('detailDataset').required(true);
			return;
		}
		dsgnField.getField('detailDataset').required(false);
		
		jqFldCommon.show();
		if(dataType === jslet.data.DataType.EDITACTION) {
			return;
		}
		if(dataType === jslet.data.DataType.ACTION) {
			jqFldAction.show();
			dsgnField.getField('fixedValue').required(true);
			return;
		} else {
			dsgnField.getField('fixedValue').required(false);
		}
		
		jqFldEditable.show();
		if(dataType === jslet.data.DataType.BOOLEAN) {
			jqFldBool.show();
			return;
		}
		
		if(dataType === jslet.data.DataType.DATE) {
			return;
		}
		jqFldLookup.show();
		if(dataType === jslet.data.DataType.STRING) {
			jqFldString.show();
		}
		
		if(dataType === jslet.data.DataType.NUMBER) {
			jqFldNumber.show();
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		$super();
	}
});

jslet.ui.register('DatasetDesigner', jslet.ui.DatasetDesigner);
jslet.ui.DatasetDesigner.htmlTemplate = '<div></div>';

/**
 * @class jslet.Report
 * 
 * A class to connect to jslet report assistant. It provides the following feature:
 * design report, preview report, print report.
 */

(function() {
	var wsSocket, serverIp, onSavingReport;
	jslet.Report = function(reportServerIp) {
		serverIp = reportServerIp;
	};
	
	jslet.Report.prototype = {
		
		getWsSocket: function() {
			if(!wsSocket) {
				wsSocket = new WsSocket(serverIp);
				
				wsSocket.onSavingReport = function(reportBo) {
					var template = window.decodeURIComponent(window.escape(window.atob(reportBo.template)));
					reportBo.template = template;
					if(onSavingReport) {
						onSavingReport.call(reportBo);
					}
				};
			}
			return wsSocket;
		},
		
		onSavingReport: function(savingReportFn) {
			if(savingReportFn === undefined) {
				return onSavingReport;
			}
			onSavingReport = savingReportFn;
			return this;
		},
		
		/**
		 * Design a report template. Example:
		 * 
		 *     @example
		 *     //Design a new report template.
		 *     jslet.defaultReport.design('employee', 'report1', 'Employee List');
		 *     
		 *     var template = '...';
		 *     //Design an existed report template.
		 *     jslet.defaultReport.design('employee', 'report1', 'Employee List', template);
		 *     
		 *     //Exclude the 'salary' field.
		 *     jslet.defaultReport.design('employee', 'report1', 'Employee List', null, 
		 *     		{'employee':{exclude:'salary'}});
		 * 
		 * @param {String} datasets (Required)Dataset names, multiple dataset names are separated by comma(,).
		 * @param {String} reportId (Required)Report id.
		 * @param {String} reportName (Required)Report name.
		 * @param {String} templateXml (Required)Report template XML string, the template is designed by jslet.defaultReport.design(..).
		 * @param {Object} printFields The fields need to be print, the format is:
		 * 		{dsName: {includeFields: ['f1',...], excludeFields: ['f3',...]}}, 
		 * 		for example: {'employee', {includeFields: ['code']}, excludeFields: ['birthday']}}.
		 */
		design: function(datasets, reportId, reportName, templateXml, printFields) {
			jslet.Checker.test('Report.design#datasets', datasets).required().isString();
			jslet.Checker.test('Report.design#reportId', reportId).required().isString();
			jslet.Checker.test('Report.design#reportName', reportName).required().isString();
			jslet.Checker.test('Report.design#template', templateXml).isString();
			jslet.Checker.test('Report.design#printFields', printFields).isPlanObject();
			var reportBo = this._combineReportBo(reportId, reportName, datasets, templateXml, printFields);
			this.getWsSocket().designReport(reportBo);
			return this;
		},
		
		/**
		 * Preview a report. Example:
		 * 
		 *     @example
		 *     var template = '...';
		 *     //Preview all records.
		 *     jslet.defaultReport.preview('employee', 'report1', 'Employee List', template);
		 *     
		 *     //Exclude the 'salary' field.
		 *     jslet.defaultReport.preview('employee', 'report1', 'Employee List', template, 
		 *     		{'employee':{exclude:'salary'}});
		 * 
		 *     //Preview the current record.
		 *     jslet.defaultReport.preview('employee', 'report1', 'Employee List', template, 
		 *     		{'employee':{exclude:'salary'}}, jslet.data.RecordRange.CURRENT);
		 * 
		 * @param {String} datasets (Required)Dataset names, multiple dataset names are separated by comma(,).
		 * @param {String} reportId (Required)Report id.
		 * @param {String} reportName (Required)Report name.
		 * @param {String} templateXml (Required)Report template XML string, the template is designed by jslet.defaultReport.design(..).
		 * @param {Object} printFields The fields need to be print, the format is:
		 * 		{dsName: {includeFields: ['f1',...], excludeFields: ['f3',...]}}, 
		 * 		for example: {'employee', {includeFields: ['code']}, excludeFields: ['birthday']}}.
		 * @param {jslet.data.RecordRange} printRange Record range to preview, 
		 * 		the optional values are jslet.data.RecordRange.ALL(default), 
		 * 		jslet.data.RecordRange.SELECTED, jslet.data.RecordRange.CURRENT.
		 */
		preview: function(datasets, reportId, reportName, templateXml, printFields, printRange) {
			jslet.Checker.test('Report.preview#datasets', datasets).required().isString();
			jslet.Checker.test('Report.preview#reportId', reportId).required().isString();
			jslet.Checker.test('Report.preview#reportName', reportName).required().isString();
			jslet.Checker.test('Report.preview#template', templateXml).required().isString();
			jslet.Checker.test('Report.preview#printFields', printFields).isPlanObject();
			var reportBo = this._combineReportBo(reportId, reportName, datasets, templateXml, printFields, printRange);
			var wsSocket = new WsSocket();
			this.getWsSocket().previewReport(reportBo);
			return this;
		},
		
		/**
		 * Print a report. Example:
		 * 
		 *     @example
		 *     var template = '...';
		 *     //Print all records.
		 *     jslet.defaultReport.print('employee', 'report1', 'Employee List', template);
		 *     
		 *     //Exclude the 'salary' field.
		 *     jslet.defaultReport.print('employee', 'report1', 'Employee List', template, 
		 *     		{'employee':{exclude:'salary'}});
		 * 
		 *     //Print the current record.
		 *     jslet.defaultReport.print('employee', 'report1', 'Employee List', template, 
		 *     		{'employee':{exclude:'salary'}}, jslet.data.RecordRange.CURRENT);
		 * 
		 * @param {String} datasets (Required)Dataset names, multiple dataset names are separated by comma(,).
		 * @param {String} reportId (Required)Report id.
		 * @param {String} reportName (Required)Report name.
		 * @param {String} templateXml (Required)Report template XML string, the template is designed by jslet.defaultReport.design(..).
		 * @param {Object} printFields The fields need to be print, the format is:
		 * 		{dsName: {includeFields: ['f1',...], excludeFields: ['f3',...]}}, 
		 * 		for example: {'employee', {includeFields: ['code']}, excludeFields: ['birthday']}}.
		 * @param {jslet.data.RecordRange} printRange Record range to print, 
		 * 		the optional values are jslet.data.RecordRange.ALL(default), 
		 * 		jslet.data.RecordRange.SELECTED, jslet.data.RecordRange.CURRENT.
		 */
		print: function(datasets, reportId, reportName, templateXml, printFields, printRange) {
			jslet.Checker.test('Report.print#datasets', datasets).required().isString();
			jslet.Checker.test('Report.print#reportId', reportId).required().isString();
			jslet.Checker.test('Report.print#reportName', reportName).required().isString();
			jslet.Checker.test('Report.print#template', templateXml).required().isString();
			jslet.Checker.test('Report.print#printFields', printFields).isPlanObject();
			var reportBo = this._combineReportBo(reportId, reportName, datasets, templateXml, printFields, printRange);
			var wsSocket = new WsSocket();
			this.getWsSocket().printReport(reportBo);
			return this;
		},
		
		_combineReportBo: function(reportId, reportName, datasets, templateXml, printFields, printRange, inDesign) {
			var reportBO = {reportId: reportId, reportName: reportName};
			var template = templateXml? window.btoa(window.unescape(window.encodeURIComponent(templateXml))): null;
			reportBO.template = template;

			var rptDatasets = [];
			reportBO.datasets = rptDatasets;
			var dsCodes = datasets.split(','), dsCode, rtnCfg, 
				recordRange = null, dsPrintFields;
			for(var i = 0, len = dsCodes.length; i < len; i++) {
				dsCode = dsCodes[i];
				rtnCfg = this._createRptDataset(rptDatasets, dsCode, null, printFields);
				if(inDesign) {
					continue;
				}
				if(printRange) {
					recordRange = printRange[dsCode] || null;
				}
				rtnCfg.rptDataset.data = rtnCfg.dataset.exportTextArray({exportHeader: false, recordRange: recordRange, includeFields: rtnCfg.fieldNames});
			}
			
			return reportBO;
		},
		
		_createRptDataset: function(rptDatasets, dsCode, dsName, printFields) {
			var dsObj = jslet.data.getDataset(dsCode);
			if(!dsObj) {
				throw new Error(jslet.formatMessage(jsletlocale.Report.notFoundDs, dsCode));
			}
			if(!dsName) {
				dsName = dsObj.description();
			}
			var rptDataset = {name: dsName};
			rptDatasets.push(rptDataset);
			var rptFields = [];
			rptDataset.fields = rptFields;
			var dsPrintFields = printFields && printFields[dsCode], includeFields, excludeFields;
			if(dsPrintFields) {
				includeFields = dsPrintFields && dsPrintFields.includeFields;
				excludeFields = dsPrintFields && dsPrintFields.excludeFields;
			}

			var fields = dsObj.getNormalFields(), fldObj, dataType, fldName,
				arrFldNames = [];
			for(var i = 0 , len = fields.length; i < len; i++) {
				fldObj = fields[i];
				fldName = fldObj.name();
				if(includeFields && includeFields.indexOf(fldName) < 0 || 
					excludeFields && excludeFields.indexOf(fldName) >= 0) {
					continue;
				}
				dataType = fldObj.getType();
				if(fldObj.lookup()) { //有查找数据集的，固定是字符串
					dataType = 'S';
				}
				if(dataType == 'V') { //子数据集
					this._createRptDataset(rptDatasets, fldObj.detailDataset(), fldObj.label(), printFields);
				} else {
					if(!fldObj.visible()) {
						if(!includeFields || includeFields.indexOf(fldName) < 0) {
							continue;
						}
					}
				}
				rptFields.push(jslet.trim(fldObj.label()) + '|' + dataType);
				arrFldNames.push(fldName);
			}
			return {dataset: dsObj, fieldNames: arrFldNames, rptDataset: rptDataset};
		}
	};

	jslet.defaultReport = new jslet.Report();
/*
**************************************************************************
 sgcWebSocket component

 written by eSeGeCe
 
            copyright ?2016
            Email : info@esegece.com
            Web : http://www.esegece.com
**************************************************************************
*/
/* jshint ignore:start */
function GUID(){var a=function(){return Math.floor(Math.random()*65536).toString(16)};return(a()+a()+a()+a()+a()+a()+a()+a())}function event(a){this.name=a;this.eventAction=null;this.subscribe=function(b){this.eventAction=b};this.fire=function(c,b){if(this.eventAction!=null){this.eventAction(c,b)}}}function sgcStreamToString(b,c){var a=new FileReader();a.readAsText(b);a.onload=function(){vResult=a.result;c(vResult)}}function sgcWSStreamRead(b,c){var a=b.slice(0,10);sgcStreamToString(a,function(f){var e=parseInt(f);var d=b.slice(10,10+e);sgcStreamToString(d,function(h){var g=h;var i=b.slice(10+e,b.size);c(g,i)})})}function sgcWebSocket(){if(arguments.length==0){return}if(typeof arguments[0]=="object"){this.host=arguments[0]["host"];this.subprotocol=arguments[0]["subprotocol"];this.user=arguments[0]["user"];this.password=arguments[0]["password"];this.transport=arguments[0]["transport"]}else{if(typeof arguments[0]=="string"){this.host=arguments[0];this.subprotocol=arguments[1];this.transport=arguments[2]}else{return}}if(this.host==undefined){this.host="127.0.0.1"}if(this.subprotocol==undefined){this.subprotocol=""}if(this.transport==undefined){this.transport=["websocket","sse"]}var a=new event("onopen");var c=new event("onclose");var f=new event("onmessage");var e=new event("onerror");if((window.WebSocket)&&(this.transport.indexOf("websocket")>-1)){var d=new event("onstream");this.open=function(){if((this.host!=="")&&(this.user!=="")&&(this.user!==undefined)){if(this.password==undefined){this.password==""}if((this.subprotocol!=="")&&(this.subprotocol!==undefined)){this.websocket=new WebSocket(this.host+"/sgc/auth/url/"+this.user+"/"+this.password,this.subprotocol)}else{this.websocket=new WebSocket(this.host+"/sgc/auth/url/"+this.user+"/"+this.password)}}else{if((this.host!=="")&&(this.subprotocol!=="")&&(this.subprotocol!==undefined)){this.websocket=new WebSocket(this.host,this.subprotocol)}else{if(this.host!==""){this.websocket=new WebSocket(this.host)}}}this.websocket.onopen=function(){a.fire({name:"onopen",message:""})};this.websocket.onmessage=function(g){if(typeof g.data==="object"){d.fire({name:"onstream",stream:g.data})}else{f.fire({name:"onmessage",message:g.data})}};this.websocket.onclose=function(g){c.fire({name:"onclose",message:"",code:g.code,reason:g.reason,clean:g.wasClean})};this.websocket.onerror=function(g){e.fire({name:"onerror",message:g.data})}};if(this.websocket==undefined){this.open()}this.send=function(g){this.websocket.send(g)};this.close=function(){this.websocket.close()};this.state=function(){switch(this.websocket.readyState){case 0:return"connecting";break;case 1:return"open";break;case 2:return"closing";break;case 3:return"closed";break;default:return"undefined";break}};this.on=function(g,h){if(g=="open"){a.subscribe(h)}else{if(g=="close"){c.subscribe(h)}else{if(g=="message"){f.subscribe(h)}else{if(g=="stream"){d.subscribe(h)}else{if(g=="error"){e.subscribe(h)}}}}}}}else{if((window.EventSource)&&(this.transport.indexOf("sse")>-1)){var b="";this.open=function(){if((this.host!=="")&&(this.user!=="")&&(this.user!==undefined)){if(this.password==undefined){this.password==""}if((this.subprotocol!=="")&&(this.subprotocol!==undefined)){this.EventSource=new EventSource(this.host.replace(/^[a-z]{2,3}\:\/{2}[a-z,0-9,.]{1,}\:[0-9]{1,4}.(.*)/,"$1")+"/sgc/auth/url/"+this.user+"/"+this.password+"/"+this.subprotocol)}else{this.EventSource=new EventSource(this.host.replace(/^[a-z]{2,3}\:\/{2}[a-z,0-9,.]{1,}\:[0-9]{1,4}.(.*)/,"$1")+"/sgc/auth/url/"+this.user+"/"+this.password)}}else{if((this.host!=="")&&(this.subprotocol!=="")&&(this.subprotocol!==undefined)){this.EventSource=new EventSource(this.subprotocol)}else{if(this.host!==""){this.EventSource=new EventSource("/")}}}this.EventSource.onopen=function(){a.fire({name:"onopen",message:""})};this.EventSource.onmessage=function(g){if(b==""){b=g.data}else{f.fire({name:"onmessage",message:g.data})}};this.EventSource.onerror=function(g){e.fire({name:"onerror",message:g.data})}};if(this.EventSource==undefined){this.open()}this.send=function(g){if(b!==""){if(window.XMLHttpRequest){xhr=new XMLHttpRequest()}else{if(window.ActiveXObject){xhr=new ActiveXObject("Microsoft.XMLHTTP")}else{return}}xhr.open("POST","/sgc/xhr/"+b,true);xhr.send(g)}};this.close=function(){this.EventSource.close();c.fire({name:"onclose",message:"",code:1000,reason:"",clean:true})};this.state=function(){switch(this.EventSource.readyState){case 0:return"connecting";break;case 1:return"open";break;case 2:return"closed";break;default:return"undefined";break}};this.on=function(g,h){if(g=="open"){a.subscribe(h)}else{if(g=="close"){c.subscribe(h)}else{if(g=="message"){f.subscribe(h)}else{if(g=="error"){e.subscribe(h)}}}}}}else{alert("WebSockets not supported by your Browser.")}}};
/* jshint ignore:end */
var assistantURL, authURL;
var WsSocket = function(serverIp) {
	serverIp = serverIp || '127.0.0.1';
	assistantURL = 'wss://' + serverIp + ':20169';
	authURL = 'https://' + serverIp + ':20169';
	
	this.ws = null;
	
	this.connected = false;
	
	this.onSavingReport = null;
	
	this.needAlert = true;
	
	this.version = null;
};

WsSocket.prototype = {
	open: function(openCallBackFn) {
        this.connected = false;
		var self = this;
		/* jshint ignore:start */
        this.ws = new sgcWebSocket(assistantURL);
        /* jshint ignore:end */
        this.ws.on('open', function(evt){
            self.connected = true;
			if(openCallBackFn) {
				openCallBackFn();
			}
		});

        this.ws.on('message', function(event) {
        	var messageText = event.message;
        	var message = JSON.parse(messageText);
        	
			var msgName = message.name;
			var msgBody = message.body;
			if(msgName == 'save' && self.onSavingReport) {
				self.onSavingReport(msgBody);
			}
        
			if(msgName == 'version') {
				self.version = msgBody;
			}
			
			if(self.onMessage) {
				self.onMessage(message);
			}
			
        });
        
        this.ws.on('close', function() {
        	self.connected = false;
        });
        
        this.ws.on('error', function(event, msg) {
        	var tips = jsletlocale.Report.tips;
			if(self.needAlert) {
				tips += '<br /><br />' + jsletlocale.Report.tips1;
	            jslet.ui.confirm(tips, null, function(button){
					if(button == 'ok') {
						jslet.ui.info(jsletlocale.Report.ignoreWarning);
						window.open(authURL);
					}
                });
			} else {
				console.error(tips);
			}
        	this.connected = false;
        });
	},
	
	send: function(msgText) {
		var self = this;
		if(!this.ws || !this.connected) {
			this.open(function() {
				self._innerSend(msgText);
			});
		} else {
			self._innerSend(msgText);
		}
	},
	
	_innerSend: function(msgText) {
		if(!this.ws || !this.connected) {
			if(this.needAlert) {
				console.log(jsletlocale.tips);
			}
			return;
		}
		if(!msgText) {
			return;
		}
		var state = this.ws.state();
		if(state == 'open') {
			var self = this;
			try {
				self.ws.send(JSON.stringify(msgText));
			} catch(e) {
				console.error(jsletlocale.tips);
			}
		}
	},
	
	designReport: function(report) {
		this.needAlert = true;
		var msg = {"name":"design", "body": report}; 
		this.send(msg);
	},
	
	previewReport: function(report) {
		this.needAlert = true;
		var msg = {"name":"preview", "body": report}; 
		this.send(msg);
	},
	
	printReport: function(report) {
		this.needAlert = true;
		var msg = {"name":"print", "body": report}; 
		this.send(msg);
	},
	
	upgrade: function(upgradeUrl) {
		this.needAlert = false;
		this.send({"name": "upgrade", "body": upgradeUrl});
	},
	
	getVersion: function() {
		var msg = {"name": "version"};
		this.needAlert = false;
		this.send(msg);
	}
};
})();

/* jshint ignore:start */
	return jslet;
});
/* jshint ignore:end */
