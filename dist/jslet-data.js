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
	        define('jslet-data', ['jquery', 'jslet-locale'], factory);
	    } else {
	    	define(function(require, exports, module) {
	    		var jsletlocale = require('jslet-locale');
	    		var jQuery = require('jquery');
	    		module.exports = factory(jQuery, jsletlocale);
	    	});
	    }
    } else {
    	factory(window.jQuery, window.jsletlocale);
    }
})(this, function (jQuery, jsletlocale) {
/* jshint ignore:end */
	if (window.jslet === undefined || jslet === undefined){
		/**
		 * Root object/function of jslet framework. Example:
		 * 
		 *     var jsletObj = jslet('#tab');
		 * 
		 * @param {String} Html tag id, like '#id'.
		 * 
		 * @return {Object} jslet object of the specified Html tag.
		 */
	    window.jslet = function(id){
	        var ele = jQuery(id)[0];
	        return (ele && ele.jslet) ? ele.jslet : null;
	    };
	}


if (window.jslet === undefined || jslet === undefined){
	/**
	 * 
	 * Get the jslet control object which is binded to a specified HTML element.
	 * 
     *     @example
     *     var jsletControl = jslet('#tableId');
	 * @static
	 * @param {String} elementId Html element id.
	 * 
	 * @return {jslet.ui.Control} jslet binded control object.
	 */
    window.jslet = function(elementId) {
    	if(typeof elementId == 'string' && elementId[0] != '#') {
    		elementId = '#' + elementId;
    	}
        var ele = jQuery(elementId)[0];
        return (ele && ele.jslet) ? ele.jslet : null;
    };
}

if (!jslet.rootUri) {
    var ohead = window.document.getElementsByTagName('head')[0], 
        uri = ohead.lastChild.src;
    if(uri) {
	    uri = uri.substring(0, uri.lastIndexOf('/') + 1);
	    jslet.rootUri = uri;
    }
}
/**
 * @class
 * @static
 */
jslet.global = {
	/**
	 * @type {String}
	 *  
	 * Jslet current version.
	 */
	version: '4.0.0',
	
	/**
	 * @type {String}
	 * 
	 * The field name which stores record changed state. <br />
	 * Used in the method: {@link jslet.data.Dataset#submit}.
	 */ 
	changeStateField: 'rs',
	
	/**
	 * @type {String}
	 * 
	 * The field name which stores record selected state.
	 * Used in method: {@link jslet.data.Dataset#selected}.
	 */
	selectStateField: '_sel_',
	
	/**
	 * @type {String}
	 * 
	 * The field name which stores record edit audit log.
	 */
	auditLogField: 'al',
	
	/**
	 * @type {String}
	 * 
	 * The separator for multiple item in a field.
	 */
	valueSeparator: ',',
	
	/**
	 * @type {String}
	 * 
	 * The server class name Mapped to a dataset. <br />
	 * In some server system, it can convert dataset record into server entity class specified by this property.
	 */
	defaultRecordClass: null,
	
	/**
	 * @type {Integer}
	 * 
	 * Default focus changed key code.
	 * Normally, press 'Tab' key to move focus, in some cases, user need to press 'Enter' key to move focus.
	 */
	defaultFocusKeyCode: 9,
	
	/**
	 * @type {Integer}
	 * 
	 * Default char display width.
	 */
	defaultCharWidth: 12,
	
	debugMode: true
};

/**
 * @event {Function}
 * 
 * Global server error handler.
 * This method can used to process some common error, like session timeout error.
 * 
 * @param {String} errCode Error code
 * @param {String} errMsg  Error message
 * 
 * @return {Boolean} Identify if handler catch this error, if catched, the rest handler will not process it.
 */
jslet.global.serverErrorHandler = function(errCode, errMsg) {
	return false;
};

/**
 * @event {Function}
 * 
 * Global event handler for jQuery.ajax, you can set settings here.<br />
 * Attention: <br />
 * The following attributes can not be set: <br />
 *   type, contentType, mimeType, dataType, data, context.
 * 
 * @param {Object} settings jQuery.ajax settings.
 * 
 * @return {Object} jQuery.ajax settings, See [http://api.jquery.com/jQuery.ajax/](#!http://api.jquery.com/jQuery.ajax/).
 */
jslet.global.beforeSubmit = function(settings) {
	return settings;
};

/**
 * @event {Function}
 * 
 * The event after jslet's binded Html element.
 *
 * @param {HtmlElement} container The HTML element which jslet binds to.
 */
jslet.global.afterInstall = function(container) {};

/**
 * Global events for import dialog.
 * 
 * @class
 * @static
 */
jslet.global.importDialog = {
	/**
	 * @event {Function}
	 * 
	 * Global query schema event, see {@link jslet.ui.ImportDialog#onQuerySchema}.
	 */
	onQuerySchema: null,
	
	/**
	 * @event {Function}
	 * 
	 * Global submit schema event, see {@link jslet.ui.ImportDialog#onQuerySchema}.
	 */
	onSubmitSchema: null
};

/**
 * Global events for export dialog.
 * 
 * @class
 * @static
 */
jslet.global.exportDialog = {
	/**
	 * @event {Function}
	 * 
	 * Global query schema event, see {@link jslet.ui.ImportDialog#onQuerySchema}.
	 */
	onQuerySchema: null,
	
	/**
	 * @event {Function}
	 * 
	 * Global submit schema event, see {@link jslet.ui.ImportDialog#onQuerySchema}.
	 */
	onSubmitSchema: null
};

/**
 * Global events for dataset object.
 * 
 * @class
 * @static
 */
jslet.global.dataset = {
	/**
	 * @event {Function}
	 * 
	 * @param {String} dsName Dataset name;
	 * @param {String} creatingOption Dataset Creating option, see {@link jslet.data#createDynamicDataset}.
	 */
	onDatasetCreating: function(dsName, creatingOption) { },
	
	/**
	 * @event {Function}
	 * 
	 * @param {String} dsName Dataset name.
	 */
	onDatasetCreated: function(dsName) {}
};

/* jshint ignore:start */
/*
 * the below code from prototype.js(http://prototypejs.org/) 
 */
jslet.toArray = function(iterable) {
	if (!iterable) {
		return [];
	}
	if ('toArray' in Object(iterable)) {
		return iterable.toArray();
	}
	var length = iterable.length || 0, results = new Array(length);
	while (length--) {
		results[length] = iterable[length];
	}
	return results;
};

jslet.extend = function(destination, source) {
	for ( var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

jslet.emptyFunction = function() {
};

jslet.keys = function(object) {
	var results = [];
	if ((typeof object) != 'object') {
		return results;
	}
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			results.push(property);
		}
	}
	return results;
};

jslet.extend(Function.prototype,
		(function() {
			var slice = Array.prototype.slice;

			function update(array, args) {
				var arrayLength = array.length, length = args.length;
				while (length--) {
					array[arrayLength + length] = args[length];
				}
				return array;
			}

			function merge(array, args) {
				array = slice.call(array, 0);
				return update(array, args);
			}

			function argumentNames() {
				var names = this.toString().match(
						/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(
						/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '').replace(
						/\s+/g, '').split(',');
				return names.length == 1 && !names[0] ? [] : names;
			}

			function bind(context) {
				if (arguments.length < 2 && (typeof arguments[0] === 'undefined')) {
					return this;
				}
				var __method = this, args = slice.call(arguments, 1);
				return function() {
					var a = merge(args, arguments);
					return __method.apply(context, a);
				};
			}

			function bindAsEventListener(context) {
				var __method = this, args = slice.call(arguments, 1);
				return function(event) {
					var a = update( [ event || window.event ], args);
					return __method.apply(context, a);
				};
			}

			function curry() {
				if (!arguments.length) {
					return this;
				}
				var __method = this, args = slice.call(arguments, 0);
				return function() {
					var a = merge(args, arguments);
					return __method.apply(this, a);
				};
			}

			function delay(timeout) {
				var __method = this, args = slice.call(arguments, 1);
				timeout = timeout * 1000;
				return window.setTimeout(function() {
					return __method.apply(__method, args);
				}, timeout);
			}

			function defer() {
				var args = update( [ 0.01 ], arguments);
				return this.delay.apply(this, args);
			}

			function wrap(wrapper) {
				var __method = this;
				return function() {
					var a = update( [ __method.bind(this) ], arguments);
					return wrapper.apply(this, a);
				};
			}

			function methodize() {
				if (this._methodized) {
					return this._methodized;
				}
				var __method = this;
				this._methodized = function() {
					var a = update( [ this ], arguments);
					return __method.apply(null, a);
				};
				return this._methodized;
			}

			return {
				argumentNames : argumentNames,
				bind : bind,
				bindAsEventListener : bindAsEventListener,
				curry : curry,
				delay : delay,
				defer : defer,
				wrap : wrap,
				methodize : methodize
			};
		})());

/* Based on Alex Arnell's inheritance implementation. */
jslet.Class = (function() {

	var IS_DONTENUM_BUGGY = (function() {
		for ( var p in {
			toString : 1
		}) {
			if (p === 'toString') {
				return false;
			}
		}
		return true;
	})();

	function subclass() {
	}
	
	function create() {
		var parent = null, properties = jslet.toArray(arguments);
		if (jslet.isFunction(properties[0])) {
			parent = properties.shift();
		}
		function klass() {
			this.initialize.apply(this, arguments);
		}

		jslet.extend(klass, jslet.Class.Methods);
		klass.superclass = parent;
		klass.subclasses = [];

		if (parent) {
			subclass.prototype = parent.prototype;
			klass.prototype = new subclass();
			parent.subclasses.push(klass);
		}

		for ( var i = 0, length = properties.length; i < length; i++) {
			klass.addMethods(properties[i]);
		}
		if (!klass.prototype.initialize) {
			klass.prototype.initialize = jslet.emptyFunction;
		}
		klass.prototype.constructor = klass;
		return klass;
	}

	function addMethods(source) {
		var ancestor = this.superclass && this.superclass.prototype, properties = jslet
				.keys(source);

		if (IS_DONTENUM_BUGGY) {
			if (source.toString != Object.prototype.toString) {
				properties.push('toString');
			}
			if (source.valueOf != Object.prototype.valueOf) {
				properties.push('valueOf');
			}
		}
		
		var isFuncFn = jslet.isFunction;
		for ( var i = 0, length = properties.length; i < length; i++) {
			var property = properties[i], value = source[property];
			if (ancestor && isFuncFn(value) && value.argumentNames()[0] == '$super') {
				var method = value;
				value = (function(m) {
					return function() {
						return ancestor[m].apply(this, arguments);
					};
				})(property).wrap(method);

				value.valueOf = method.valueOf.bind(method);
				value.toString = method.toString.bind(method);
			}
			this.prototype[property] = value;
		}

		return this;
	}

	return {
		create : create,
		Methods : {
			addMethods : addMethods
		}
	};
})();
/* end Prototype code */
/* jshint ignore:start */
jslet._AUTOID = 0;

/**
 * @method
 * 
 * Generate next global id, like 'jslet0', 'jslet1'. Example:
 * 
 *     @example
 * 	   jslet.nextId(); //return jslet0
 * 	   jslet.nextId(); //return jslet1
 * 
 * @member jslet
 * 
 * @return {String} The next global id.
 */
jslet.nextId = function(){
	return 'jslet' + (jslet._AUTOID++);
};

if(!jslet.data) {
	jslet.data = {};
}

if(!jslet.temp) {
	jslet.temp = {};
}

//if (!jslet.rootUri) {
//    var ohead = document.getElementsByTagName('head')[0], uri = ohead.lastChild.src;
//    uri = uri.substring(0, uri
//					.lastIndexOf('/')
//					+ 1);
//    jslet.rootUri = uri
//}

/*
 * Javascript language enhancement
 */
if(!Array.indexOf){
	Array.prototype.indexOf = function(value){
		for(var i = 0, cnt = this.length; i < cnt; i++){
			if(this[i] == value)
				return i;
		}
		return -1;
	};
}

if(!String.prototype.trim){
	String.prototype.trim = function(){
		this.replace(/^\s+/, '').replace(/\s+$/, '');
	};
}

if(!String.prototype.startsWith){
	String.prototype.startsWith = function(pattern) {
		return this.lastIndexOf(pattern, 0) === 0;
	};
}

if(!String.prototype.endsWith){
	//From Prototype.js
	String.prototype.endsWith = function(pattern){
        var d = this.length - pattern.length;
        return d >= 0 && this.indexOf(pattern, d) === d;
	};
}

if(!FileReader.prototype.readAsBinaryString) {
	FileReader.prototype.readAsBinaryString = function (fileData) {
		var Z = this,
			binary = '',
			reader = new FileReader();      
		reader.onload = function (e) {
			var bytes = new Uint8Array(reader.result);
			var length = bytes.byteLength;
			for (var i = 0; i < length; i++) {
				binary += String.fromCharCode(bytes[i]);
			}
			Z.content = binary;
			jQuery(Z).trigger('onload');
		}
		reader.readAsArrayBuffer(fileData);
	}
}

jslet.trim = function(str) {
	return jQuery.trim(str);
};

jslet.debounce = function(func, wait, immediate) {
	var timeoutHander;
	return function() {
		var context = this, args = arguments;
		if(!wait) {
			func.apply(context, args);
			return;
		}
		var later = function() {
			timeoutHander = null;
			func.apply(context, args);
		};
		if(timeoutHander) {
			clearTimeout(timeoutHander);
		}
		timeoutHander = setTimeout(later, wait);
	};
};

/*
 * Javascript language enhancement(end)
 */
jslet.deepClone = function(srcObj) {
	if(srcObj === undefined || srcObj === null || srcObj === true || srcObj === false) {
		return srcObj;
	}
	
	if(jslet.isString(srcObj) || jslet.isNumber(srcObj)) {
		return srcObj;
	}
	
	if(jslet.isDate(srcObj)) {
		return new Date(srcObj.getTime());
	}
    var objClone;
	if(jslet.isArray(srcObj)) {
		objClone = [];
		for(var i = 0, len = srcObj.length; i < len; i++) {
			objClone[i] = jslet.deepClone(srcObj[i]);
		}
		return objClone;
	}
    if (srcObj.constructor == Object) {
        objClone = new srcObj.constructor(); 
    } else {
        objClone = new srcObj.constructor(srcObj.valueOf()); 
    }
    for(var key in srcObj){
        if ( objClone[key] != srcObj[key] ){ 
            if ( typeof(srcObj[key]) == 'object' ){ 
                objClone[key] = jslet.deepClone(srcObj[key]);
            } else {
                objClone[key] = srcObj[key];
            }
        }
    }
    return objClone; 
};
                                        

/**
 * format message with argument. Example:
 * 
 *     @example
 *     jslet.formatMessage('Your name is: {0}', 'Bob');//return: your name is: Bob
 *     jslet.formatMessage('They are: {0} and {1}', ['Jerry','Mark']); 
 * 
 * @member jslet
 * 
 * @param {String} msg Initial message, placeholder of argument is {n}, n is number. 
 * @param {String[]} args Arguments to fill into placeholder.
 * 
 * @return formatted formatted message.
 */
jslet.formatMessage = function (msg, args) {
	jslet.Checker.test('jslet.formatMessage#msg', msg).required().isString();
    if(args === undefined || args === null) {
    	return msg; 
    }
    if(args === false) {
    	args = 'false';
    }
    if(args === true) {
    	args = 'true';
    }
    var result = msg, cnt, i;
    if (jslet.isArray(args)) {// array
        cnt = args.length;
        for (i = 0; i < cnt; i++) {
            result = result.replace('{' + i + '}', args[i]);
        }
    } else if(jslet.isObject(args)){// Object
        for (var key in args) {
            result = result.replace('{' + key + '}', args[key]);
        }
    } else {
    	return msg.replace('{0}', args);
    }
    return result;
};

jslet.formatString = function (value, dispFmt) {
	if(!dispFmt || !value) {
		return value;
	}
	jslet.Checker.test('jslet.formatString#displayFormat', dispFmt).isString();
	var valueLen = value.length,
		fmtLen = dispFmt.length,
		fmtLen1 = fmtLen - 1,
		c, k = -1, result = '', next;
	for(var i = 0; i < fmtLen; i++) {
		c = dispFmt[i];
		if(c === '\\' && i < fmtLen1) {
			next = dispFmt[i+1];
			if(next === '#') {
				result += '#';
				i++;
				continue;
			}
		}
		if(c === '#') {
			k++;
			if(k === valueLen) {
				break;
			}
			result += value[k];
		} else {
			result += c;
		}
	}
	return result;
};

jslet._SCALEFACTOR = '100000000000000000000000000000000000';

/**
 * Format a number. Example:
 * 
 *     @example
 *     jslet.formatNumber(12345.999,'#,##0.00'); //return '12,346.00'
 *     jslet.formatNumber(12345.999,'#,##0.##'); //return '12,346'
 *     jslet.formatNumber(123,'000000'); //return '000123'
 * 
 * @member jslet
 * 
 * @param {Number} num Number which need to format. 
 * @param {String} pattern Pattern for number, like '#,##0.00': <br />
 *  '#' - not required; <br />
 *  '0' - required, if the corresponding digit of the number is empty, fill in with '0'; <br />
 *
 * @return {String} Formatted Number.
 */
jslet.formatNumber = function(num, pattern) {
	if(!num && num !== 0) {
		return '';
	}
	if (!pattern) {
		return num + '';
	}
	var preFix = '', c, i;
	for (i = 0; i < pattern.length; i++) {
		c = pattern.substr(i, 1);
		if (c == '#' || c == '0' || c == ',') {
			if (i > 0) {
				preFix = pattern.substr(0, i);
				pattern = pattern.substr(i);
			}
			break;
		}
	}

	var suffix = '';
	for (i = pattern.length - 1; i >= 0; i--) {
		c = pattern.substr(i, 1);
		if (c == '#' || c == '0' || c == ',') {
			if (i > 0) {
				suffix = pattern.substr(i + 1);
				pattern = pattern.substr(0, i + 1);
			}
			break;
		}
	}

	var fmtarr = pattern ? pattern.split('.') : [''], fmtDecimalLen = 0;
	if (fmtarr.length > 1) {
		fmtDecimalLen = fmtarr[1].length;
	}
	var strarr = num ? num.toString().split('.') : ['0'], dataDecimalLen = 0;
	if (strarr.length > 1) {
		dataDecimalLen = strarr[1].length;
	}
	if (dataDecimalLen > fmtDecimalLen) {
		var factor = parseInt(jslet._SCALEFACTOR.substring(0, fmtDecimalLen + 1));
		num = Math.round(num * factor) / factor;
		strarr = num ? num.toString().split('.') : ['0'];
	}
	var retstr = '', 
		str = strarr[0],
		sign = str[0];
	if(sign === '-' || sign === '+') {
		str = str.substring(1);
	} else {
		sign = null;
	}
	var fmt = fmtarr[0],
		comma = false,
		k = str.length - 1,
		f;
	for (f = fmt.length - 1; f >= 0; f--) {
		switch (fmt.substr(f, 1)) {
			case '#' :
				if (k >= 0) {
					retstr = str.substr(k--, 1) + retstr;
				}
				break;
			case '0' :
				if (k >= 0) {
					retstr = str.substr(k--, 1) + retstr;
				} else {
					retstr = '0' + retstr;
				}
				break;
			case ',' :
				comma = true;
				retstr = ',' + retstr;
				break;
		}
	}
	if (k >= 0) {
		if (comma) {
			var l = str.length;
			for (; k >= 0; k--) {
				retstr = str.substr(k, 1) + retstr;
				if (k > 0 && ((l - k) % 3) === 0) {
					retstr = ',' + retstr;
				}
			}
		} else {
			retstr = str.substr(0, k + 1) + retstr;
		}
	}
	retstr = retstr.replace(/^,+/, '');
	
	str = strarr.length > 1 ? strarr[1] : '';
	fmt = fmtarr.length > 1 ? fmtarr[1] : '';
	k = 0;
	var decimalStr = '';
	for (f = 0; f < fmt.length; f++) {
		switch (fmt.substr(f, 1)) {
			case '#' :
				if (k < str.length) {
					decimalStr += str.substr(k++, 1);
				}
				break;
			case '0' :
				if (k < str.length) {
					decimalStr += str.substr(k++, 1);
				} else {
					decimalStr += '0';
				}
				break;
		}
	}
	if(decimalStr) {
		retstr = retstr + '.' + decimalStr;
	}
	if(sign) {
		retstr = sign + retstr;
	}
	return preFix + retstr + suffix;
};

/**
 * Format date with specified format. Example:
 * 
 *     @example
 *     var date = new Date();
 *     jslet.formatDate(date, 'yyyy-MM-dd'));//2012-12-21
 * 
 * @member jslet
 * 
 * @param {Date} date Formatting date value.
 * @param {String} format Date format.
 * 
 * @return {String} String Formatted date.
 */
jslet.formatDate = function(date, format) {
	if(!date) {
		return '';
	}
	jslet.Checker.test('jslet.formatDate#date', date).isDate();
	jslet.Checker.test('jslet.formatDate#format', format).required().isString();
	var o = {
		'M+' : date.getMonth() + 1, // month
		'd+' : date.getDate(), // day
		'h+' : date.getHours(), // hour
		'm+' : date.getMinutes(), // minute
		's+' : date.getSeconds(), // second
		'q+' : Math.floor((date.getMonth() + 3) / 3), // quarter
		'S' : date.getMilliseconds()
		// millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, 
				(date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, 
				RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
		}
	}
	return format;
};

/**
 * Parse a string to Date object. Example
 * 
 *     @example
 *     var date = jslet.parseDate('2013-03-25', 'yyyy-MM-dd');
 *     var date = jslet.parseDate('2013-03-25 15:20:18', 'yyyy-MM-dd hh:mm:ss');
 * 
 * @member jslet
 * 
 * @param {String} strDate String date.
 * @param {String} format Date format, like: 'yyyy-MM-dd hh:mm:ss'.
 * 
 * @return Date Object.
 */
jslet.parseDate = function(strDate, format) {
	if(!strDate) {
		return null;
	}
	jslet.Checker.test('jslet.parseDate#strDate', strDate).isString();
	jslet.Checker.test('jslet.parseDate#format', format).required().isString();
	
	var preChar = null, ch, v, 
		begin = -1, 
		end = 0;
	var dateParts = {'y': 0, 'M': 0,'d': 0, 'h': 0,	'm': 0, 's': 0, 'S': 0};
	
	for(var i = 0, len = format.length; i < len; i++) {
		ch = format.charAt(i);
	
		if(ch != preChar) {
			if(preChar && dateParts[preChar] !== undefined && begin >= 0) {
				end = i;
				v = parseInt(strDate.substring(begin, end));
				if(isNaN(v)) {
					throw new Error(jslet.formatMessage(jsletlocale.Dataset.invalidDate, [format]));
				}
				dateParts[preChar] = v;
			}
			begin = i;
			preChar = ch;
		}
	}
	if(begin >= 0) {
		v = parseInt(strDate.substring(begin));
		if(isNaN(v)) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.invalidDate, [format]));
		}
		dateParts[ch] = v;
	}
	var year = dateParts.y;
	if(year < 100) {
		year += 2000;
	}
	var result = new Date(year, dateParts.M - 1, dateParts.d, dateParts.h, dateParts.m, dateParts.s, dateParts.S);
	return result;
};

/*
 * Convert Date to ISO8601
 */
Date.prototype.toJSON = function() {
	return jslet.formatDate(this, 'yyyy-MM-ddThh:mm:ss');
};

/**
 * Convert string(ISO date format) to date object.
 * 
 * @member jslet
 * 
 * @param {String} dateStr A string with ISO date format, like: 2012-12-21T09:30:24Z.
 * 
 * @return {Date} ISO Date Object.
 */
jslet.convertISODate= function(dateStr) {
	if(!dateStr) {
		return null;
	}
	if(jslet.isDate(dateStr)) {
		return dateStr;
	}
	var flag = dateStr.substr(10,1);
	if(dateStr.length === 10 || 'T' == flag) {
		var year = dateStr.substr(0,4),
		month = dateStr.substr(5,2),
		day = dateStr.substr(8,2),
		hour = dateStr.substr(11,2),
		minute = dateStr.substr(14,2),
		second = dateStr.substr(17,2);
		if('Z' == dateStr.substr(-1,1)) {
			return new Date(Date.UTC(+year, +month - 1, +day, +hour,
					+minute, +second));
		}
		return new Date(+year, +month - 1, +day, +hour,
				+minute, +second);
	}
    return dateStr;
};

/*
 * Variable for convertToJsPattern,don't use it in your program
 */
jslet._currentPattern = {};

/*
 * Convert sql pattern to javascript pattern
 * 
 * @param {String} pattern sql pattern
 * @param {String} escapeChar default is '\'
 * @return {String} js regular pattern
 */
jslet._convertToJsPattern = function(pattern, escapeChar) {
	if (jslet._currentPattern.pattern == pattern && 
			jslet._currentPattern.escapeChar == escapeChar) {
		return jslet._currentPattern.result;
	}
	jslet._currentPattern.pattern = pattern;
	jslet._currentPattern.escapeChar = escapeChar;

	var jsPattern = [],
		len = pattern.length - 1,
		c, 
		nextChar,
		bgn = 0, 
		end = len,
		hasLeft = false,
		hasRight = false;
	if (pattern.charAt(0) == '%'){
       bgn = 1;
       hasLeft = true;
    }
    if (pattern.charAt(len) == '%'){
       end = len - 1;
       hasRight = true;
    }
    if (hasLeft && hasRight){
       jsPattern.push('.*');
    }
    else if (hasRight){
       jsPattern.push('^');
    }
	for (var i = bgn; i <= end; i++) {
		c = pattern.charAt(i);
		if ((escapeChar && escapeChar == c || c == '\\') && i < len) {
			nextChar = pattern.charAt(i + 1);
			if (nextChar == '%' || nextChar == '_') {
				jsPattern.push(nextChar);
				i++;
				continue;
			}
		} else if (c == '_') {
			jsPattern.push('.');
		} else {
			if (c == '.' || c == '*' || c == '[' || c == ']' || 
					c == '{' || c == '}' || c == '+' || c == '(' || 
					c == ')' || c == '\\' || c == '?' || c == '$' || c == '^')
				jsPattern.push('\\');
			jsPattern.push(c);
		}
	}// end for
	if (hasLeft && hasRight || hasRight){
       jsPattern.push('.*');
    } else if (hasLeft){
       jsPattern.push('$');
    }

    jslet._currentPattern.result = new RegExp(jsPattern.join(''), 'ig');
	return jslet._currentPattern.result;
};

/**
 * Test whether the value to match pattern or not, example:
 * 
 *     @example
 *     jslet.like('abc','%b%'); //return true 
 *     jslet.like('abc','%b'); //return false 
 *     jslet.like('abc','ab_'); //return true 
 *  
 * @member jslet
 * 
 * @param {String} testValue Testing value.
 * @param {String} pattern SQL pattern, syntax like SQL.
 * 
 * @return {Boolean} True - if matched, false - otherwise.
 */
jslet.like = function(testValue, pattern, escapeChar) {
	if (!testValue || !pattern) {
		return false;
	}
	if (pattern.length === 0) {
		return false;
	}
	if (!escapeChar) {
		escapeChar = '\\';
	}
	var jsPattern = jslet._convertToJsPattern(pattern, escapeChar);
	if(!jslet.isString(testValue)) {
		testValue += '';
	}
	return testValue.match(jsPattern) !== null;
};

/**
 * Test whether the 'testValue' is between 'minValue' and 'maxValue' or not.
 * All arguments must be same data type.
 * 
 *     @example
 *     jslet.between(4,2,5); //return true
 *     jslet.between('c','a','b'); // return false
 * 
 * @member jslet
 * 
 * @param {Number | String | Date} testValue Testing value.
 * @param {Number | String | Date} minValue Minimum value.
 * @param {Number | String | Date} maxValue Maximum value.
 * 
 * @return {Boolean} True - if matched, false - otherwise.
 */
jslet.between = function(testValue, minValue, maxValue) {
	if (arguments.length <= 1) {
		return false;
	}
	var flagMin = true,
		flagMax = true;
	if(minValue !== null && minValue !== undefined) { 
		flagMin = (jslet.compareValue(testValue, minValue) >= 0);
	}
	if(maxValue !== null && maxValue !== undefined) { 
		flagMax = (jslet.compareValue(testValue, maxValue) <= 0);
	}
	return flagMin && flagMax;
};

/**
 * Test whether the first argument is in the list of other arguments or not. Example:
 * 
 *     @example
 *     jslet.inlist('a','c','d','e'); //return false
 *     jslet.inlist('d','c','d','e'); //return true
 * 
 * @member jslet
 * 
 * @param {Number | String | Date} testValue Testing value.
 * @param {Number | String | Date} valueList One or more arguments.
 * 
 * @return {Boolean} True - if matched, false - otherwise.
 */
jslet.inlist = function(testValue, valueList) {
	var cnt = arguments.length;
	if (cnt < 2) {
		return false;
	}
	for (var i = 1; i < cnt; i++) {
		if (jslet.compareValue(testValue, arguments[i]) === 0) {
			return true;
		}
	}
	return false;
};

/**
 * Test whether the testing value is in an array or not. Example:
 * 
 *     @example
 *     jslet.inArray('a','c','d','e'); //return false
 *     jslet.inArray('d','c','d','e'); //return true
 * 
 * @member jslet
 * 
 * @param {Number | String | Date} testValue Testing value.
 * @param {Number | String | Date} valueList One or more arguments.
 * 
 * @return {Boolean} True - if matched, false - otherwise.
 */
jslet.inArray = function(testValue, values) {
	if(!testValue || !values) {
		return false;
	}
	for (var i = 0, cnt = values.length; i < cnt; i++) {
		if (jslet.compareValue(testValue, values[i]) === 0) {
			return true;
		}
	}
	return false;
};

/**
 * Test whether the given value is an array. Example:
 * 
 *     @example
 *     jslet.isArray(['a']); //return true
 *     jslet.isArray('a'); //return false
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is an array, false - otherwise.
 */
jslet.isArray = function (testValue) {
    return testValue === null || testValue === undefined || Object.prototype.toString.apply(testValue) === '[object Array]';
};

/**
 * Test whether the given value is date object. Example:
 * 
 *     @example
 *     jslet.isDate(new Date()); //return true
 *     jslet.isDate('a'); //return false
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is date object, false - otherwise.
 */
jslet.isDate = function(testValue) {
	return testValue === null || testValue === undefined || testValue.constructor == Date;
};

/**
 * Test whether the given value is a string object. Example:
 * 
 *     @example
 *     jslet.isString(123); //return false
 *     jslet.isString('a'); //return true
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is String object, false - otherwise.
 */
jslet.isString = function(testValue) {
	return testValue === null || testValue === undefined || typeof testValue == 'string';
};

/**
 * Test whether the given value is a Function object. Example:
 * 
 *     @example
 *     jslet.isString(123); //return false
 *     jslet.isString(function() {}); //return true
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is Function object, false - otherwise.
 */
jslet.isFunction = function(testValue) {
	return jQuery.isFunction(testValue);
};

jslet.isPromise = function(testValue) {
	return testValue && testValue.done && jslet.isFunction(testValue.done);
};

/**
 * Test whether the given value is a number value. Example:
 * 
 *     @example
 *     jslet.isNumber(123); //return true
 *     jslet.isNumber('a'); //return false
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is String object, false - otherwise.
 */
jslet.isNumber = function(testValue) {
	return testValue === null || testValue === undefined || jQuery.isNumeric(testValue);
};
/**
 * Test whether the given value is an object.
 * 
 *     @example
 *     jslet.isString(123); //return false
 *     jslet.isString({a:1}); //return true
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is object, false - otherwise.
 */
jslet.isObject = function(testValue) {
	return testValue === null || testValue === undefined || jQuery.type(testValue) == "object";	
};

/**
 * Test whether the given value is a HTML element.
 * 
 *     @example
 *     jslet.isHTMLElement(window); //return false
 *     jslet.isHTMLElement(document.body); //return true
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is a HTML element, false - otherwise.
 */
jslet.isHTMLElement = function(testValue) {
	return testValue === null || testValue === undefined || testValue instanceof HTMLElement;	
};

/**
 * Test whether the given value is empty. Example:
 * 
 *     @example
 *     jslet.isEmpty(123); //return false
 *     jslet.isEmpty(null); //return true
 *     jslet.isEmpty(undefined); //return true
 *     jslet.isEmpty(''); //return true
 *     jslet.isEmpty([]); //return true
 *     jslet.isEmpty([null]); //return true
 * 
 * @member jslet
 * 
 * @param {Object} testValue Testing value.
 * 
 * @return {Boolean} True - if the given value is object, false - otherwise.
 */
jslet.isEmpty = function(value) {
	if(value === null || value === undefined || value === '') {
		return true;
	}
	if(jslet.isArray(value)) {
		var arrValue = value;
		var isEmpty = true;
		for(var i = 0, len = arrValue.length; i < len; i++) {
			if(!jslet.isEmpty(arrValue[i])) {
				isEmpty = false;
				break;
			}
		}
		return isEmpty;
	}
	return false;
};

jslet.setTimeout = function(obj, func, time) {
    jslet.delayFunc = function () {
        func.call(obj);
    };
    setTimeout(jslet.delayFunc, time);
};

/**
 * Compare two values. Example:
 * 
 *     @example
 *     jslet.compareValue(1,2); //return -1
 *     jslet.compareValue(10,2); //return 1
 *     jslet.compareValue(2,2); //return 0
 *     jslet.compareValue('a','A'); //return 0
 *     jslet.compareValue('a','A', true); //return -1
 * 
 * @member jslet
 * 
 * @param {Number | String | Date} value1 Value1.
 * @param {Number | String | Date} value2 Value2.
 * @param {Boolean} caseSensitive Case sensitive or not if values are string value.
 * @param {Boolean} useLocale Use locale compare or not.
 *  
 * @return {Integer} 0 - value1 = value2, -1 - value1 < value2, 1 - value1 > value2.
 */
jslet.compareValue = function(value1, value2, caseSensitive, useLocale) {
	value1 = (value1 === undefined? null: value1);
	value2 = (value2 === undefined? null: value2);
	if(value1 === value2) {
		return 0;
	}
	if(value1 === null && value2 !== null) {
		return -1;
	}
	if(value2 === null && value1 !== null) {
		return 1;
	}
	var isStr1 = jslet.isString(value1),
		isStr2 = jslet.isString(value2);
	if(!isStr1 && !isStr2) {
		if(jslet.isDate(value1)) {
			value1 = value1.getTime();
			value2 = value2.getTime();
		}
		return value1 == value2? 0: (value1 < value2? -1: 1);
	}
	//compare string value
	if(!isStr1) {
		value1 = value1 + '';
	}
	if(!isStr2) {
		value2 = value2 + '';
	}
	if(!caseSensitive) {
		value1 = value1.toLowerCase();
		value2 = value2.toLowerCase();
	}
	if(useLocale === undefined || useLocale) {
		var result = value1.localeCompare(value2);
		return result === 0? 0: (result < 0 ? -1: 1);
	} else {
		return value1 == value2? 0: (value1 < value2? -1: 1);
	}
};

/**
 * Encode html string. Example:
 * 
 *     @example
 *     jslet.htmlEncode('<div />'); //return 'lt;div /gt;'
 * 
 * @member jslet
 * 
 * @param {String} htmlText HTML text.
 * 
 * @return {String} Ecoded HTML text.
 */
jslet.htmlEncode = function(htmlText){
    if (htmlText) {
        return jQuery('<div />').text(htmlText).html();
    } else {
        return '';
    }
};

/**
 * Decode html string. Example:
 * 
 *     @example
 *     jslet.htmlDecode('lt;div /gt;'); //return '<div />'
 * 
 * @member jslet
 * 
 * @param {String} htmlText Encoded HTML text.
 * 
 * @return {String} Decoded HTML text.
 */
jslet.htmlDecode = function(htmlText) {
    if (htmlText) {
        return jQuery('<div />').html(htmlText).text();
    } else {
        return '';
    }
};

/**
 * Get an array item safely. Example:
 * 
 *     @example
 *     var arrValues = ['a','b'];
 *     jslet.getArrayValue(arrValues, 1); // return 'b'
 *     jslet.getArrayValue(arrValues, 3); // return null
 * 
 * @member jslet
 * 
 * @param {Object[]} arrValues Array value.
 * @param {Integer} index Index of wanted to get item.
 * 
 * @return {Object} Array item.
 */
jslet.getArrayValue = function(arrValues, index) {
	if(!arrValues) {
		return null;
	}
		
    if(jslet.isArray(arrValues)){
        var len = arrValues.length;
        if(index < len) {
            return arrValues[index];
        } else {
            return null;
        }
    } else {
        return arrValues;
    }
};

/**
 * @class
 * @static
 * 
 * jslet.Checker can check whether a variable is valid on runtime. Usage:
 * 
 *     @example
 *     var x = 1;
 *     jslet.Checker.test('x', x).isGTZero();
 *     
 */
jslet.Checker = {
	varName: null,
	varValue: null,
	
	/**
	 * Set the testing variable.
	 * 
	 * @param {String} varName Variable name.
	 * @param {Object} varValue Variable value.
	 * 
	 * @return {this}
	 */
	test: function(varName, varValue) {
		this.varName = varName;
		this.varValue = varValue;
		return this;
	},
	
	/**
	 * Set the testing variable value.
	 * 
	 * @param {Object} varValue Variable value.
	 * 
	 * @return {this}
	 */
	testValue: function(varValue) {
		this.varValue = varValue;
		return this;
	},
	
	/**
	 * Check the testing variable does not equal: null | undefined | ''.
	 * 
	 *     @example
	 *     var x = null;
	 *     var y = 123;
	 *     jslet.Checker.test('x', x).required(); //error thrown
	 *     jslet.Checker.test('y', y).required(); //no error thrown
	 *     
	 * @return {this}
	 */
	required: function() {
		if(this.varValue === null || this.varValue === undefined || this.varValue === '') {
			//[{0}] is Required!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.required, [this.varName]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable type is boolean.
	 * 
	 *     @example
	 *     var x = 123;
	 *     var y = true;
	 *     jslet.Checker.test('x', x).isBoolean(); //error thrown
	 *     jslet.Checker.test('y', y).isBoolean(); //no error thrown
	 *     
	 * @return {this}
	 */
	isBoolean: function() {
		if(this.varValue !== null && 
		   this.varValue !== undefined &&
		   this.varValue !== '' &&
		   this.varValue !== 0 && 
		   this.varValue !== true && 
		   this.varValue !== false) {
			//[{0}] must be a Boolean value!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredBooleanValue, [this.varName]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable type is string.
	 * 
	 *     @example
	 *     var x = 123;
	 *     var y = 'test';
	 *     jslet.Checker.test('x', x).isString(); //error thrown
	 *     jslet.Checker.test('y', y).isString(); //no error thrown
	 *     
	 * @return {this}
	 */
	isString: function() {
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			this.varValue !== false &&
			!jslet.isString(this.varValue)) {
			//[{0}: {1}] must be a String value!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredStringValue, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable type is date.
	 * 
	 *     @example
	 *     var x = 123;
	 *     var y = new Date();
	 *     jslet.Checker.test('x', x).isDate(); //error thrown
	 *     jslet.Checker.test('y', y).isDate(); //no error thrown
	 *     
	 * @return {this}
	 */
	isDate: function() {
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			this.varValue !== false &&
			!jslet.isDate(this.varValue)) {
			//[{0}: {1}] must be a Date value!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredDateValue, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable type is date.
	 * 
	 *     @example
	 *     var x = '123';
	 *     var y = 123;
	 *     jslet.Checker.test('x', x).isNumber(); //error thrown
	 *     jslet.Checker.test('y', y).isNumber(); //no error thrown
	 *     
	 * @return {this}
	 */
	isNumber: function() {
		if(this.varValue !== null && 
			this.varValue !== undefined && 
			this.varValue !== false &&
			!jQuery.isNumeric(this.varValue)) {
			//[{0}: {1}] must be a Numberic value!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredNumbericValue, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is greater than zero.
	 * 
	 *     @example
	 *     var y = 0;
	 *     jslet.Checker.test('y', y).isGTZero(); //Error thrown
	 *     y = 123;
	 *     jslet.Checker.test('y', y).isGTZero(); //no error thrown
	 *     
	 * @return {this}
	 */
	isGTZero: function() {
		this.isNumber();
		if(this.varValue === null || this.varValue === undefined) {
			return this;
		}
		if(this.varValue <= 0) {
			//[{0}: {1}] must be great than zero!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.greatThanZero, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is greater than or equals zero.
	 * 
	 *     @example
	 *     var y = -1;
	 *     jslet.Checker.test('y', y).isGTEZero(); //Error thrown
	 *     y = 0;
	 *     jslet.Checker.test('y', y).isGTEZero(); //no error thrown
	 *     
	 * @return {this}
	 */
	isGTEZero: function() {
		this.isNumber();
		if(this.varValue === null || this.varValue === undefined) {
			return this;
		}
		if(this.varValue < 0) {
			//[{0}: {1}] must be great than or equal zero!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.greatThanEqualZero, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is in a range.
	 * 
	 *     @example
	 *     var y = 3;
	 *     jslet.Checker.test('y', y).between(1, 2); //Error thrown
	 *     jslet.Checker.test('y', y).between(2, 5); //no error thrown
	 *
	 * @param {Object} minValue Start value of range.
	 * @param {Object} maxValue End value of range.
	 * 
	 * @return {this}
	 */
	between: function(minValue, maxValue) {
		if(this.varValue === null || this.varValue === undefined) {
			return this;
		}
		var checkMin = minValue !== null && minValue !== undefined;
		var checkMax = maxValue !== null && maxValue !== undefined;
		if(checkMin && checkMax && (this.varValue < minValue || this.varValue > maxValue)) {
			//[{0} : {1}] must be between [{2}] and [{3}]!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.betweenValue, [this.varName, this.varValue, minValue, maxValue]));
		}
		if(!checkMin && checkMax && this.varValue > maxValue) {
			//[{0} : {1}] must be less than [{2}]!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.lessThanMaxValue, [this.varName, this.varValue, maxValue]));
		}
		if(checkMin && !checkMax && this.varValue < minValue) {
			//[{0} : {1}] must be great than [{2}]!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.betweenValue, [this.varName, this.varValue, minValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable type is Array.
	 * 
	 *     @example
	 *     var x = '123';
	 *     jslet.Checker.test('x', x).isArray(); //error thrown
	 *     x = ['123'];
	 *     jslet.Checker.test('x', x).isArray(); //no error thrown
	 *     
	 * @return {this}
	 */
	isArray: function() {
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			this.varValue !== false &&
			!jslet.isArray(this.varValue)) {
			//[{0}: {1}] must be an Array!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredArrayValue, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is Object.
	 * 
	 *     @example
	 *     var x = 123;
	 *     jslet.Checker.test('x', x).isObject(); //error thrown
	 *     x = [123];
	 *     jslet.Checker.test('x', x).isObject(); //no error thrown
	 *     
	 * @return {this}
	 */
	isObject: function() {
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			this.varValue !== false &&
			jQuery.type(this.varValue) !== "object") {
			//[{0}: {1}] must be an Object!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredObjectValue, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is Plan Object.
	 * 
	 *     @example
	 *     var x = 123;
	 *     jslet.Checker.test('x', x).isPlanObject(); //error thrown
	 *     x = {x: 123};
	 *     jslet.Checker.test('x', x).isPlanObject(); //no error thrown
	 *     
	 * @return {this}
	 */
	isPlanObject: function() {
		if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
				!jQuery.isPlainObject(this.varValue)) {
			//[{0}: {1}] must be a plan Object!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredPlanObjectValue, [this.varName, this.varValue]));
		}
		return this;
				
	},
	
	/**
	 * Check whether the testing variable is HTML element.
	 * 
	 *     @example
	 *     var x = window;
	 *     jslet.Checker.test('x', x).isHTMLElement(); //error thrown
	 *     x = document.body;
	 *     jslet.Checker.test('x', x).isHTMLElement(); //no error thrown
	 *     
	 * @return {this}
	 */
	isHTMLElement: function() {
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			!jslet.isHTMLElement(this.varValue)) {
			//[{0}: {1}] must be an Object!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredHtmlElement, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is Function.
	 * 
	 *     @example
	 *     var x = 123;
	 *     jslet.Checker.test('x', x).isFunction(); //error thrown
	 *     x = function() {};
	 *     jslet.Checker.test('x', x).isFunction(); //no error thrown
	 *     
	 * @return {this}
	 */
	isFunction: function() {
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			this.varValue !== false &&
			!jslet.isFunction(this.varValue)) {
			//[{0}: {1}] must be a Function!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.requiredFunctionValue, [this.varName, this.varValue]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is the specified Class.<br />
	 * This method is used internally to check jslet class.
	 * 
	 *     @example
	 *     var x = 123;
	 *     jslet.Checker.test('x', x).isClass('jslet.data.Dataset'); //error thrown
	 *     x = new jslet.data.Dataset({name: 'test', fields: []});
	 *     jslet.Checker.test('x', x).isClass('jslet.data.Dataset'); //no error thrown
	 *     
	 * @param {String} className Specified class name.
	 *     
	 * @return {this}
	 */
	isClass: function(className) {
		this.isObject();
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			this.varValue !== false &&
			this.varValue.className != className) {
			//[{0}: {1}] must be instance of [{2}]!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.instanceOfClass, [this.varName, this.varValue, className]));
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is specified type.<br />
	 * This method is used internally to check jslet class.
	 * 
	 *     @example
	 *     var x = 123;
	 *     jslet.Checker.test('x', x).isDataType('S'); //error thrown
	 *     jslet.Checker.test('x', x).isDataType('N'); //no error thrown
	 *     x = new Date();
	 *     jslet.Checker.test('x', x).isDataType('D'); //no error thrown
	 *     
	 * @param {String} dataType The optional value: 'S', 'D', 'N'.
	 *     
	 * @return {this}
	 */
	isDataType: function(dataType) {
		if(dataType == 'S') {
			this.isString();
		}
		if(dataType == 'N') {
			this.isNumber();
		}
		if(dataType == 'D') {
			this.isDate();
		}
		return this;
	},
	
	/**
	 * Check whether the testing variable is in the specified array.<br />
	 * 
	 *     @example
	 *     var x = 123;
	 *     jslet.Checker.test('x', x).inArray([1,2,3]); //error thrown
	 *     x = 2;
	 *     jslet.Checker.test('x', x).inArray([1,2,3]); //no error thrown
	 *     
	 * @param {String} arryList An array.
	 *     
	 * @return {this}
	 */
	inArray: function(arrlist) {
		if(this.varValue !== null && 
			this.varValue !== undefined &&
			this.varValue !== false &&
			arrlist.indexOf(this.varValue) < 0) {
			//[{0}: {1}] must be one of [{2}]!
			throw new Error(jslet.formatMessage(jsletlocale.Checker.inArray, [this.varName, this.varValue, arrlist.join(',')]));
		}
		return this;
	}

};

jslet.JSON = {
	normalize: function (json) {
		//json = jQuery.trim(json);
		var result = [], c, next, isKey = false, isArray = false, isObj = true, last = '', quoteChar = null, append = false;
		c = json.charAt(0);
		if(c != '{' && c != '[') {
			result.push('{"');
			append = true;
		}		
		for(var i = 0, len = json.length; i< len; i++) {
			c = json.charAt(i);
			
			if(quoteChar) {//Not process any char in a String value. 
				if(c == quoteChar) {
					quoteChar = null;
					result.push('"');
					last = '"';
				} else {
					result.push(c);
				}
				continue;
			}
			if(c == '[') {
				isArray = true;
				isObj = false;
			}
			if(c == ']' || c == '{') {
				isArray = false;
				isObj = true;
			}
			if(isKey && (c == ' ' || c == '\b')) {//Trim blank char in a key.
				continue;
			}
			if(isObj && (c == '{' || c == ',')) {
				isKey = true;
				result.push(c);
				last = c;
				continue;
			}
			if(last == '{' || last == ',') {
				result.push('"');
			}
			if(isKey && c == "'") {
				result.push('"');
				continue;
			}
			if(c == ':') {
				isKey = false;
				if(last != '"') {
					result.push('"');
				}
			}
			if(!isKey) {
				if(c == "'" || c == '"') {
					quoteChar = c;
					result.push('"');
					continue;
				}
			}
			last = c;
			result.push(c);
		}
		if(append) {
			result.push('}');
		}
		return result.join('');
	},
	
	parse: function(json) {
		try {
//			return JSON.parse(this.normalize(json));//has bug
			return JSON.parse(json);
		} catch(e) {
			throw new Error(jslet.formatMessage(jsletlocale.Common.jsonParseError, [json]));
		}
	},
	
	stringify: function(value, replacer, space) {
		return JSON.stringify(value, replacer, space);
	}

};

/**
 * Get specified function with function object or function name.
 * 
 * @member jslet
 * 
 * @param {String | Function} funcOrFuncName If its value is function name, find this function in specified context.
 * @param {Object} context The context which looking for function in, default is window.
 * 
 * @return {Function}
 */
jslet.getFunction = function(funcOrFuncName, context) {
	if(!funcOrFuncName) {
		return null;
	}
	if(jslet.isFunction(funcOrFuncName)) {
		return funcOrFuncName;
	}
	if(!context) {
		context = window;
	}
	
	var result = context[funcOrFuncName];
	if(!result) {
		console.warn('NOT found function:' + funcOrFuncName);
	}
	return result;
};

/**
 * Cut the specified string and return the remaining string.
 * 
 *     @example
 *     cutString('abcd','c'); //return 'abd'
 * 
 * @member jslet
 * 
 * @param {String} wholeStr Whole string.
 * @param {String} cuttingStr Cutting string.
 * 
 * @return {String} Remaining string.
 */
jslet.cutString = function(wholeStr, cuttingStr) {
	if(!wholeStr || !cuttingStr) {
		return wholeStr;
	}
	var reg = new RegExp(cuttingStr,"g");
	return wholeStr.replace(reg, '');
};


/**
 * Get year value from a date object.
 * 
 *     @example
 *     jslet.getYear(new Date(2015,9,10); //return 2015
 * 
 * @member jslet
 * 
 * @param {Date} dateValue Date object.
 * 
 * @return {Integer} Year of date.
 */
jslet.getYear = function(dateValue) {
	if(!dateValue || !jslet.isDate(dateValue)) {
		return 0;
	}
	return dateValue.getFullYear();
};

/**
 * Get year value from a date object.
 * 
 *     @example
 *     jslet.getMonth(new Date(2015,9,10); //return 10
 *     
 * @member jslet
 * 
 * @param {Date} dateValue Date object.
 * 
 * @return {Integer} Month of date.
 */
jslet.getMonth = function(dateValue) {
	if(!dateValue || !jslet.isDate(dateValue)) {
		return 0;
	}
	return dateValue.getMonth() + 1;
};

/**
 * Get year and month value from a date object.
 * 
 *     @example
 *     jslet.getYearMonth(new Date(2015,9,10); //return 201010
 *     
 * @member jslet
 * 
 * @param {Date} dateValue Date object.
 * 
 * @return {Integer} Year and month of date.
 */
jslet.getYearMonth = function(dateValue) {
	if(!dateValue || !jslet.isDate(dateValue)) {
		return 0;
	}
	return dateValue.getFullYear() * 100 + dateValue.getMonth() + 1;
};

jslet.removeHtmlTag = function(str) {
	if(!str) {
		return str;
	}
	if(str.indexOf('<') < 0) {
		return str;
	} else {
		return str.replace(/<(?:.|\s)*?>/g, '')
	}
};

/**
* Show error message.
* 
* @member jslet
* 
* @param {Error | String} e - Error object or error message
* @param {Function} callBackFn - Call back function, pattern: function() {}.
*/
jslet.showError = function (e, callBackFn) {
	var msg;
	if (typeof (e) == 'string') {
		msg = e;
	} else {
		msg = e.message;
	}
	if (jslet.ui && jslet.ui.error) {
		jslet.ui.error(msg, null, callBackFn);
	} else {
		window.alert(msg);
	}
};

/**
* Show info message.
* 
* @member jslet
* 
* @param {Error | String} e - Error object or error message.
* @param {Function} callBackFn - Call back function, pattern: function() {}.
* @param {Integer} timeout - Timeout for close this dialog. 
*/
jslet.showInfo = function (e, callBackFn, timeout) {
	var msg;
	if (typeof (e) == 'string') {
		msg = e;
	} else {
		msg = e.message;
	}
	if (jslet.ui && jslet.ui.info) {
		jslet.ui.info(msg, null, callBackFn, timeout);
	} else {
		window.alert(msg);
	}
};

jslet.urlUtil = {
	getDomain: function(url) {
		return url.replace(/([^:]+:\/\/[^\/]+).*/, "$1");
	},
	
	addParam: function(url, param) {
		jslet.Checker.test('addParam#url', url).required().isString();
		if(!param) {
			return url;
		}
		jslet.Checker.test('addParam#param', param).isPlanObject();
		var url1 = '';
		var k = url.indexOf('#');
		if(k >= 0) {
			url1 = url.substring(k);
			url = url.substring(0, k);
		}
		var paramObj = jslet.urlUtil.getParams(url) || {};
		for(var name in param) {
			paramObj[name] = escape((param[name] + '').trim());
		}
		var paramStr = '';
		k = 0;
		for(name in paramObj) {
			paramStr += (k++? '&': '') + name + '=' + paramObj[name];
		}
		k = url.indexOf('?');
		if(k >= 0) {
			url = url.substring(0, k);
		}
		url += '?' + paramStr + url1;
		return url;
	},

	addHash: function(url, hash) {
		jslet.Checker.test('addUrlParam#url', url).required().isString();
		if(!hash) {
			return url;
		}
		var k = url.indexOf('#');
		url = url + (k >= 0?'':'#') + hash;
		return url;
	},
	
	getParams: function(url) {
		jslet.Checker.test('getParams#url', url).required().isString();
    	intPos = url.indexOf("?");
    	if(intPos < 0) {
    		return null;
    	}
    	var url = url.substr(intPos + 1);
    	var intPos = url.indexOf('#');
    	if(intPos >= 0) {
    		url = url.substring(0, intPos);
    	}
    	
    	var arrTmp = url.split("&");
    	var result = {};
    	for(var i = 0; i < arrTmp.length; i++){
    		var arrParam = arrTmp[i].split("=");
    		result[arrParam[0]] = arrParam[1];
    	}
    	return result;
	},
	
	getParam: function(url, paramName) {
		jslet.Checker.test('getParam#paramName', paramName).required().isString();
		var params = this.getParams(url);
		if(params) {
			return params[paramName];
		}
		return null
	},
	
	getHash: function(url) {
		jslet.Checker.test('getHash#url', url).required().isString();
    	var intPos = url.indexOf('#');
    	if(intPos < 0) {
    		return null;
    	}
    	var hash = url.substring(intPos + 1);
    	intPos = hash.indexOf("?");
    	if(intPos >= 0) {
    		hash = hash.substring(0, intPos);
    	}
    	
    	return hash;
	}
};

/**
 * @class
 * 
 * This class is used to split a long loop into ten short loops in order to refresh UI between two loops.
 * It's normally used for updating ProcessBar value. Example:
 * 
 *     @example
 *     var list = [1, 2, 3, .....];
 *     function doLoop(start, end, percent) {
 *         for(var i = start; i <= end; i++) {
 *             //process biz logic
 *         }
 *         jslet('processBar').value(percent);
 *     }
 *     
 *     new jslet.StepProcessor(list.length, doLoop).run();
 * 
 * @param {Integer} count The long loop count.
 * @param {Function} processingFn The processing function.
 * @param {Integer} processingFn.start The start position of the long loop.
 * @param {Integer} processingFn.end The end position of the long loop.
 * @param {Integer} processingFn.percent The processing percent of the loop.
 * @param {Integer} unit The unit of percent, like 5, 10, 20, it can't be greater than 100. 
 * 
 */
jslet.StepProcessor = function(count, processingFn, stepCount) {
	jslet.Checker.test('jslet.StepProcessor#count', count).isGTZero();
	jslet.Checker.test('jslet.StepProcessor#processingFn', processingFn).isFunction();
	jslet.Checker.test('jslet.StepProcessor#steps', stepCount).isNumber().between(1, 100);
	var count = count;
	var steps = [];
	var index = 0;
	if(!stepCount) {
		stepCount = 10;
	}
	if(count <= stepCount) {
		steps.push([0, count - 1, 100]);
	} else {
		var k = Math.ceil(count / stepCount), start, end, percent;
		var len = Math.ceil(count / k);
		var lastIdx = len - 1;
		var m = parseInt(100 / stepCount);
		for(var i = 0; i <= lastIdx; i++) {
			start = i * k;
			end = (i + 1) * k - 1;
			if(end >= count) {
				end = count - 1;
			}
			percent = i < lastIdx? (i + 1) * m: 100;
			steps.push([start, end, percent]);
		}
	}
	var nextStep = function() {
        var step = steps[index++];
        var result = processingFn(step[0], step[1], step[2]);
        if(result === false) {
        	return;
        }
        
        if (index != steps.length) {
            var me = this;
            window.setTimeout(function(){
                nextStep();
            }, 2);
        }    	
    }
	
	/**
	 * @method run
	 * 
	 * Run the step processor.
	 */
	this.run = function() {
		index = 0;
		nextStep();
	} 
};


/**
 * @class
 * 
 * Sync some async tasks. Example:
 * 
 *     @example
 *     function doneFn() {
 *     		console.log('All tasks are ended.');
 *     }
 *     
 *     var sync = new jslet.Synchronizer(2, doneFn)
 *     
 *     ds1.query().done(function() {
 *     		sync.endTask();
 *     });
 *     ds2.query().done(function() {
 *     		sync.endTask();
 *     });
 *     
 * 
 * @param {Integer} taskCount Task count.
 * @param {Function} doneFn Done function when all async tasks have run.
 */
jslet.Synchronizer = function(taskCount, doneFn) {
	var isValid = false;
	jslet.Checker.test('Synchronizer#taskCount', taskCount).required().isGTEZero();
	jslet.Checker.test('Synchronizer#doneFn', doneFn).required().isFunction();
	this._taskCount = taskCount;
	this._doneFn = doneFn;
};

jslet.Synchronizer.prototype = {
	/**
	 * End task. Call this method in each async task.
	 */
	endTask: function() {
		this._taskCount--;
		if(this._taskCount === 0) {
			this._doneFn();
		}
	},
}
/**
 * @class
 * @private
 * 
 * Dataset context rule.
 */
jslet.data.ContextRule = function(contextRuleCfg) {
	var Z = this;
	Z._name = '';
	Z._description = '';
	Z._status = undefined;
	Z._selected = undefined;
	Z._condition = undefined;
	Z._rules = null;
	Z._otherwise = null;
	Z._create(contextRuleCfg);
};

jslet.data.ContextRule.className = 'jslet.data.ContextRule';

jslet.data.ContextRule.prototype = {
	className: jslet.data.ContextRule.className,
	
	dataStatus: ['insert', 'update', 'other'],
	
	_create: function(cxtRuleCfg) {
		jslet.Checker.test('ContextRule.contextRuleConfig', cxtRuleCfg).required().isPlanObject();
		var Z = this;
		if(cxtRuleCfg.status !== undefined) {
			Z.status(cxtRuleCfg.status);
		}
		if(cxtRuleCfg.selected !== undefined) {
			Z.selected(cxtRuleCfg.selected);
		} 
		if(cxtRuleCfg.condition !== undefined) {
			Z.condition(cxtRuleCfg.condition);
		}
		var rulesCfg = cxtRuleCfg.rules, i, len, rules;
		if(rulesCfg !== undefined) {
			jslet.Checker.test('ContextRule.rules', rulesCfg).isArray();
			rules = [];
			Z.rules(rules);
			for(i = 0, len = rulesCfg.length; i < len; i++) {
				rules.push(createContextRuleItem(rulesCfg[i]));
			}
		}
		
		var otherwiseCfg = cxtRuleCfg.otherwise;
		if(otherwiseCfg !== undefined) {
			jslet.Checker.test('ContextRule.otherwise', otherwiseCfg).isArray();
			rules = [];
			Z.otherwise(rules);
			for(i = 0, len = otherwiseCfg.length; i < len; i++) {
				rules.push(createContextRuleItem(otherwiseCfg[i]));
			}
		}
		
		function createContextRuleItem(itemCfg) {
			var item = new jslet.data.ContextRuleItem(itemCfg.field);
			if(itemCfg.meta !== undefined) {
				item.meta(createContextRuleMeta(itemCfg.meta));
			}
			
			if(itemCfg.value !== undefined) {
				item.value(itemCfg.value);
			}
			
			if(itemCfg.lookup !== undefined) {
				item.lookup(createContextRuleLookup(itemCfg.lookup));
			}
			
			if(itemCfg.customized !== undefined) {
				item.customized(itemCfg.customized);
			}
			return item;
		}
		
		function createContextRuleMeta(metaCfg) {
			var meta = new jslet.data.ContextRuleMeta();
			if(metaCfg.label !== undefined) {
				meta.label(metaCfg.label);
			}
			
			if(metaCfg.tip !== undefined) {
				meta.tip(metaCfg.tip);
			}
			
			if(metaCfg.nullText !== undefined) {
				meta.nullText(metaCfg.nullText);
			}
			
			if(metaCfg.required !== undefined) {
				meta.required(metaCfg.required);
			}
			
			if(metaCfg.disabled !== undefined) {
				meta.disabled(metaCfg.disabled);
			}
			
			if(metaCfg.readOnly !== undefined) {
				meta.readOnly(metaCfg.readOnly);
			}
			
			if(metaCfg.visible !== undefined) {
				meta.visible(metaCfg.visible);
			}
			
			if(metaCfg.formula !== undefined) {
				meta.formula(metaCfg.formula);
			}
			
			if(metaCfg.scale !== undefined) {
				meta.scale(metaCfg.scale);
			}
			
			if(metaCfg.required !== undefined) {
				meta.required(metaCfg.required);
			}
			
			if(metaCfg.displayFormat !== undefined) {
				meta.displayFormat(metaCfg.displayFormat);
			}
			
			if(metaCfg.editMask !== undefined) {
				meta.editMask(metaCfg.editMask);
			}
			
			if(metaCfg.editControl !== undefined) {
				meta.editControl(metaCfg.editControl);
			}
			
			if(metaCfg.range !== undefined) {
				meta.range(metaCfg.range);
			}
			
			if(metaCfg.regularExpr !== undefined) {
				meta.regularExpr(metaCfg.regularExpr);
			}
			
			if(metaCfg.valueCountLimit !== undefined) {
				meta.valueCountLimit(metaCfg.valueCountLimit);
			}
			
			if(metaCfg.validChars !== undefined) {
				meta.validChars(metaCfg.validChars);
			}
			
			if(metaCfg.customValidator !== undefined) {
				meta.customValidator(metaCfg.customValidator);
			}
			
			return meta;
		}

		function createContextRuleLookup(lookupCfg) {
			var lookup = new jslet.data.ContextRuleLookup();
			if(lookupCfg.dataset !== undefined) {
				lookup.dataset(lookupCfg.dataset);
			}
			
			if(lookupCfg.filter !== undefined) {
				lookup.filter(lookupCfg.filter);
			}
			
			if(lookupCfg.fixedFilter !== undefined) {
				lookup.fixedFilter(lookupCfg.fixedFilter);
			}
			
			if(lookupCfg.criteria !== undefined) {
				lookup.criteria(lookupCfg.criteria);
			}
			
			if(lookupCfg.displayFields !== undefined) {
				lookup.displayFields(lookupCfg.displayFields);
			}
			
			if(lookupCfg.onlyLeafLevel !== undefined) {
				lookup.onlyLeafLevel(lookupCfg.onlyLeafLevel);
			}
			
			return lookup;
		}
	},
	
	name: function(name) {
		if(name === undefined) {
			return this._name;
		}
		
		jslet.Checker.test('ContextRule.name', name).isString();
		this._name = jQuery.trim(name);
		return this;
	},

	status: function(status) {
		if(status === undefined) {
			return this._status;
		}
		
		jslet.Checker.test('ContextRule.status', status).isArray();
		if(status) {
			var item, checker;
			for(var i = 0, len = status.length; i < len; i++) {
				item = jQuery.trim(status[i]);
				checker = jslet.Checker.test('ContextRule.status' + i, item).isString().required();
				item = item.toLowerCase();
				checker.testValue(item).inArray(this.dataStatus);
				status[i] = item;
			}
		}
		this._status = status;
		return this;
	},

	selected: function(selected) {
		if(selected === undefined) {
			return this._selected;
		}
		
		this._selected = selected? true: false;
	},
	
	condition: function(condition) {
		if(condition === undefined) {
			return this._condition;
		}
		
		jslet.Checker.test('ContextRule.condition', condition).isString();
		this._condition = jQuery.trim(condition);
		return this;
	},
	
	rules: function(rules) {
		if(rules === undefined) {
			return this._rules;
		}

		jslet.Checker.test('ContextRule.rules', rules).isArray();
		this._rules = rules;
		return this;
	},
	
	otherwise: function(otherwise) {
		if(otherwise === undefined) {
			return this._otherwise;
		}

		jslet.Checker.test('ContextRule.otherwise', otherwise).isArray();
		this._otherwise = otherwise;
		return this;
	}

};

jslet.data.ContextRuleItem = function(fldName) {
	var Z = this;
	jslet.Checker.test('ContextRule.field', fldName).isString();
	fldName = jQuery.trim(fldName);
	jslet.Checker.test('ContextRule.field', fldName).required();
	Z._field = fldName;
	
	Z._meta = undefined;
	Z._value = undefined;
	Z._lookup = undefined;
	Z._customized = undefined;
};

jslet.data.ContextRuleItem.className = 'jslet.data.ContextRuleItem';

jslet.data.ContextRuleItem.prototype = {
	className: jslet.data.ContextRuleItem.className,
	
	field: function() {
		return this._field;
	},
	
	meta: function(meta) {
		if(meta === undefined) {
			return this._meta;
		}
		
		jslet.Checker.test('ContextRuleItem.meta', meta).isClass(jslet.data.ContextRuleMeta.className);
		this._meta = meta;
		return this;
	},

	lookup: function(lookup) {
		if(lookup === undefined) {
			return this._lookup;
		}
		
		jslet.Checker.test('ContextRuleItem.lookup', lookup).isClass(jslet.data.ContextRuleLookup.className);
		this._lookup = lookup;
		return this;
	},

	value: function(value) {
		if(value === undefined) {
			return this._value;
		}
		
		this._value = value;
		return this;
	},
	
	customized: function(customizedFn) {
		if(customizedFn === undefined) {
			return this._customized;
		}
		jslet.Checker.test('ContextRuleItem.customized', customizedFn).isFunction();
		this._customized = customizedFn;
		return this;
	}
};

jslet.data.ContextRuleMeta = function() {
	var Z = this;
	Z._label = undefined;
	Z._tip = undefined;
	Z._nullText = undefined;
	
	Z._required = undefined;
	Z._disabled = undefined;
	Z._readOnly = undefined;
	Z._visible = undefined;
	Z._formula = undefined;
	Z._scale = undefined;
	Z._defaultValue = undefined;
	Z._displayFormat = undefined;
	Z._editMask = undefined;
	Z._editControl = undefined;
	
	Z._range = undefined;
	Z._regularExpr = undefined;
	Z._valueCountLimit = undefined;
	Z._validChars = undefined;
	Z._customValidator = undefined;
};

jslet.data.ContextRuleMeta.className = 'jslet.data.ContextRuleMeta';

jslet.data.ContextRuleMeta.prototype = {
	className: jslet.data.ContextRuleMeta.className,
	
	properties: ['label', 'tip','nullText', 'required','disabled','readOnly','visible',
	             'formula','scale','defaultValue','displayFormat','editMask','editControl',
	             'range','regularExpr','valueCountLimit','validChars','customValidator'],
	/**
	 * Set or get field label.
	 * 
	 * @param {String | undefined} label Field label.
	 * @return {this | String}
	 */
	label: function (label) {
		if (label === undefined) {
			return this._label;
		}
		jslet.Checker.test('ContextRuleMeta.label', label).isString();
		this._label = label;
		return this;
	},

	/**
	 * Set or get field tip.
	 * 
	 * @param {String | undefined} tip Field tip.
	 * @return {this | String}
	 */
	tip: function(tip) {
		if (tip === undefined) {
			return this._tip;
		}
		jslet.Checker.test('ContextRuleMeta.tip', tip).isString();
		this._tip = tip;
		return this;
	},

	/**
	 * Set or get the display text if the field value is null.
	 * 
	 * @param {String | undefined} nullText Field null text.
	 * @return {this | String}
	 */
	nullText: function (nullText) {
		if (nullText === undefined) {
			return this._nullText;
		}
		
		jslet.Checker.test('ContextRuleMeta.nullText', nullText).isString();
		this._nullText = jQuery.trim(nullText);
		return this;
	},
	
	/**
	 * Set or get flag required.
	 * 
	 * @param {Boolean | undefined} required Field is required or not.
	 * @return {this | Boolean}
	 */
	required: function (required) {
		var Z = this;
		if (required === undefined) {
			return Z._required;
		}
		Z._required = required ? true: false;
		return this;
	},
	
	/**
	 * Set or get field is visible or not.
	 * 
	 * @param {Boolean | undefined} visible Field is visible or not.
	 * @return {this | Boolean}
	 */
	visible: function (visible) {
		var Z = this;
		if (visible === undefined){
			return Z._visible;
		}
		Z._visible = visible ? true: false;
		return this;
	},

	/**
	 * Set or get field is disabled or not.
	 * 
	 * @param {Boolean | undefined} disabled Field is disabled or not.
	 * @return {this | Boolean}
	 */
	disabled: function (disabled) {
		var Z = this;
		if (disabled === undefined) {
			return Z._disabled;
		}
		Z._disabled = disabled ? true: false;
		return this;
	},

	/**
	 * Set or get field is readOnly or not.
	 * 
	 * @param {Boolean | undefined} readOnly Field is readOnly or not.
	 * @return {this | Boolean}
	 */
	readOnly: function (readOnly) {
		var Z = this;
		if (readOnly === undefined){
			return Z._readOnly;
		}
		
		Z._readOnly = readOnly? true: false;
		return this;
	},

	/**
	 * Set or get field edit mask.
	 * 
	 * @param {String | undefined} mask Field edit mask.
	 * @return {this | String}
	 */
	editMask: function (mask) {
		var Z = this;
		if (mask === undefined) {
			return Z._editMask;
		}
		Z._editMask = mask;
		return this;
	},
	
	/**
	 * Set or get field decimal length.
	 * 
	 * @param {Integer | undefined} scale Field decimal length.
	 * @return {this | Integer}
	 */
	scale: function (scale) {
		var Z = this;
		if (scale === undefined) {
			return Z._scale;
		}
		jslet.Checker.test('ContextRuleMeta.scale', scale).isNumber();
		Z._scale = parseInt(scale);
		return this;
	},
	
	/**
	 * Set or get field formula. Example: 
	 * 
	 *     contextRuleMetaObj.formula('[price]*[num]');
	 * 
	 * @param {String | undefined} formula Field formula.
	 * @return {this | String}
	 */
	formula: function (formula) {
		var Z = this;
		if (formula === undefined) {
			return Z._formula;
		}
		
		jslet.Checker.test('ContextRuleMeta.formula', formula).isString();
		Z._formula = jQuery.trim(formula);
		return this;
	},

	/**
	 * Set or get field display format. <br />
	 * For number field like: #,##0.00 <br />
	 * For date field like: yyyy/MM/dd
	 * 
	 * @param {String | undefined} format Field display format.
	 * @return {this | String}
	 */
	displayFormat: function (format) {
		var Z = this;
		if (format === undefined) {
			return Z._displayFormat;
		}
		
		jslet.Checker.test('ContextRuleMeta.format', format).isString();
		Z._displayFormat = jQuery.trim(format);
		return this;
	},

	/**
	 * Set or get field edit control. It is similar as DBControl configuration.
	 * Here you need not set 'dataset' and 'field' property. Example:
	 * 
	 *     var editCtrlCfg = {type:"DBSpinEdit",minValue:10,maxValue:100,step:5};
	 *     contextRuleMetaObj.editControl(editCtrlCfg);
	 * 
	 * @param {String | Object | undefined} editCtrl If String, it will convert to DBControl setting.
	 * @return {this | Object}
	 */
	editControl: function (editCtrl) {
		var Z = this;
		if (editCtrl=== undefined){
			return Z._editControl;
		}

		Z._editControl = (typeof (editCtrl) === 'string') ? { type: editCtrl } : editCtrl;
	},

	/**
	 * Set or get field default value.
	 * The data type of default value must be same as Field's.
	 * Example:
	 *   Number field: fldObj.defauleValue(100);
	 *   Date field: fldObj.defaultValue(new Date());
	 *   String field: fldObj.defaultValue('test');
	 * 
	 * @param {Object | undefined} dftValue Field default value.
	 * @return {this | Object}
	 */
	defaultValue: function (dftValue) {
		var Z = this;
		if (dftValue === undefined) {
			return Z._defaultValue;
		}
		Z._defaultValue = dftValue;
		return this;
	},
	
	/**
	 * Set or get field rang.
	 * Range is an object as: {min: x, max: y}. Example:
	 * 
	 *     contextRuleMetaObj.range(range);
	 * 
	 * @param {Object | undefined} range Field range;
	 * @return {this | Object}
	 */
	range: function (range) {
		var Z = this;
		if (range === undefined) {
			return Z._range;
		}
		if (jslet.isString(range)) {
			/* jshint ignore:start */
			Z._range = new Function('return ' + range);
			/* jshint ignore:end */
		} else {
			Z._range = range;
		}
		return this;
	},

	/**
	 * Set or get regular expression.
	 * You can specify your own validator with regular expression. If regular expression not specified, 
	 * The default regular expression for Date and Number field will be used. Example:
	 * 
	 *     contextRuleMetaObj.regularExpr(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, 'Invalid phone number!');//like: 0755-12345678
	 * 
	 * @param {Object | undefined} expr Regular expression, format: {expr: xxx, message: yyy};
	 * @return {this | Object} An object like: { expr: expr, message: message }
	 */
	regularExpr: function (regularExpr) {
		var Z = this;
		if (regularExpr === undefined){
			return Z._regularExpr;
		}
		
		if (jslet.isString(regularExpr)) {
			/* jshint ignore:start */
			Z._regularExpr = new Function('return ' + regularExpr);
			/* jshint ignore:end */
		} else {
			Z._regularExpr = regularExpr;
		}
		return this;
	},
	
	/**
	 * Set or get allowed count when valueStyle is multiple.
	 * 
	 * @param {String | undefined} count.
	 * @return {this | String}
	 */
	valueCountLimit: function (count) {
		var Z = this;
		if (count === undefined) {
			return Z._valueCountLimit;
		}
		jslet.Checker.test('ContextRuleMeta.valueCountLimit', count).isNumber();
		Z._valueCountLimit = parseInt(count);
		return this;
	},

	/**
	 * Set or get customized validator.
	 * 
	 * @param {Function} validator Validator function.
	 * Pattern:
	 *   function(fieldObj, fldValue){}
	 *   //fieldObj: jslet.data.Field, Field object
	 *   //fldValue: Object, Field value
	 *   //return: String, if validate failed, return error message, otherwise return null; 
	 */
	customValidator: function (validator) {
		var Z = this;
		if (validator === undefined) {
			return Z._customValidator;
		}
		jslet.Checker.test('ContextRuleMeta.customValidator', validator).isFunction();
		Z._customValidator = validator;
		return this;
	},
	
	/**
	 * Valid characters for this field.
	 */
	validChars: function(chars){
		var Z = this;
		if (chars === undefined){
			return Z._validChars;
		}
		
		jslet.Checker.test('ContextRuleMeta.validChars', chars).isString();
		Z._validChars = jQuery.trim(chars);
	},
	
};

jslet.data.ContextRuleLookup = function() {
	var Z = this;
	Z._dataset = undefined;
	Z._filter = undefined;
	Z._fixedFilter = undefined;
	Z._criteria = undefined;
	Z._displayFields = undefined;
	Z._onlyLeafLevel = undefined;
};

jslet.data.ContextRuleLookup.className = 'jslet.data.ContextRuleLookup';

jslet.data.ContextRuleLookup.prototype ={
	className: jslet.data.ContextRuleLookup.className,
	
	properties: ['dataset', 'filter', 'fixedFilter', 'criteria', 'displayFields', 'onlyLeafLevel'],
	
	dataset: function(datasetName){
		var Z = this;
		if (datasetName === undefined){
			return Z._dataset;
		}
		jslet.Checker.test('ContextRuleLookup.dataset', datasetName).isString();
		Z._dataset = jQuery.trim(datasetName);
	},

	filter: function(filter){
		var Z = this;
		if (filter === undefined){
			return Z._filter;
		}
		jslet.Checker.test('ContextRuleLookup.filter', filter).isString();
		Z._filter = jQuery.trim(filter);
	},

	fixedFilter: function(fixedFilter){
		var Z = this;
		if (fixedFilter === undefined){
			return Z._fixedFilter;
		}
		jslet.Checker.test('ContextRuleLookup.fixedFilter', fixedFilter).isString();
		Z._fixedFilter = jQuery.trim(fixedFilter);
	},

	criteria: function(criteria){
		var Z = this;
		if (criteria === undefined){
			return Z._criteria;
		}
		jslet.Checker.test('ContextRuleLookup.criteria', criteria).isString();
		Z._criteria = jQuery.trim(criteria);
	},

	displayFields: function(displayFields){
		var Z = this;
		if (displayFields === undefined){
			return Z._displayFields;
		}
		jslet.Checker.test('ContextRuleLookup.displayFields', displayFields).isString();
		Z._displayFields = jQuery.trim(displayFields);
	},

	onlyLeafLevel: function(onlyLeafLevel){
		var Z = this;
		if (onlyLeafLevel === undefined){
			return Z._onlyLeafLevel;
		}
		Z._onlyLeafLevel = onlyLeafLevel ? true: false;
	}
};

jslet.data.ContextRuleEngine = function(dataset) {
	this._dataset = dataset;
	this._matchedRules = [];
	this._ruleEnv = {};
};

jslet.data.ContextRuleEngine.prototype = {

	compile: function() {
		var contextRules = this._dataset.contextRules();
		for(var i = 0, len = contextRules.length; i < len; i++) {
			this._compileOneRule(contextRules[i]);
		}
	},

	evalRule: function(changingFldName){
		var contextRules = this._dataset.contextRules();
		var ruleObj;
		this._matchedRules = [];
		this._ruleEnv = {};
		for(var i = 0, len = contextRules.length; i < len; i++) {
			ruleObj = contextRules[i];
			this._evalOneRule(ruleObj, changingFldName);
		}
		this._syncMatchedRules(changingFldName);
	},
	
	_compileOneRule: function(ruleObj) {
		var condition = ruleObj.condition;
		this._compileExpr(ruleObj, 'condition', true);
		var rules = ruleObj.rules();
		for(var i = 0, len = rules.length; i < len; i++) {
			this._compileRuleItem(rules[i]);
		}
	},
	
	_compileRuleItem: function(ruleItem) {
		this._compileExpr(ruleItem, 'value');
		var metaObj = ruleItem.meta();
		var props, propName, i, len;
		if(metaObj) {
			props = metaObj.properties;
			len = props.length;
			for(i = 0; i < len; i++) {
				propName = props[i];
				this._compileExpr(metaObj, propName);
			}
		}
		var lookupObj = ruleItem.lookup();
		if(lookupObj) {
			props = lookupObj.properties;
			len = props.length;
			for(i = 0; i < len; i++) {
				propName = props[i];
				this._compileExpr(lookupObj, propName);
			}
		}
	},
	
	_compileExpr: function(itemObj, propName, isExpr) {
		var setting = itemObj[propName].call(itemObj),
			exprName = propName +'Expr';
		
		if(setting !== null && setting !== undefined && jslet.isString(setting)) {
			if(setting.indexOf('expr:') === 0) {
				setting = setting.substring(5);
				isExpr = true;
			}
			if(isExpr) {
				itemObj[exprName] = new jslet.data.Expression(this._dataset, setting);
			}
		}
	},
	
	_evalOneRule: function(ruleObj, changingFldName) {
		var matched = false;
		var exprObj = ruleObj.conditionExpr;
		var mainFields = null;
		var hasRule = false;
		//Check if the rule matched or not
		if(exprObj) {
			mainFields = exprObj.mainFields();
			if(changingFldName) {
				if(mainFields && mainFields.indexOf(changingFldName) < 0) {
					return;
				}
			}
			matched = exprObj.eval();
			hasRule = true;
		}
		if(!hasRule || matched) {
			//if exists 'status' condition
			var ruleStatus = ruleObj.status();
			if(ruleStatus !== undefined) {
				var dsStatus = 'other', 
					changedStatus = this._dataset.changedStatus();
				if(changedStatus == jslet.data.DataSetStatus.INSERT) {
					dsStatus = 'insert';
				} else if(changedStatus == jslet.data.DataSetStatus.UPDATE) {
					dsStatus = 'update';
				}
				if(!hasRule) {
					matched = true;
				}
				matched = (matched && ruleStatus.indexOf(dsStatus) >= 0);
				hasRule = true;
			}
			//if exists 'selected' condition
			var ruleSelected = ruleObj.selected();
			if(ruleSelected !== undefined) {
				if(!hasRule) {
					matched = true;
				}
				matched = (matched && ruleSelected === (this._dataset.selected()? true: false));
			}
		}
		var ruleEnv = null;
		if(mainFields) {
			var fldName;
			for(var i = 0, len = mainFields.length; i < len; i++) {
				fldName = mainFields[i];
				if(this._ruleEnv[fldName] === undefined) {
					this._ruleEnv[fldName] = this._dataset.getFieldValue(fldName);
				}
			}
		}
		this._evalRuleItems(matched? ruleObj.rules(): ruleObj.otherwise(), changingFldName? true: false);
	},
	
	_evalRuleItems: function(rules, isValueChanged) {
		if(!rules) {
			return;
		}
		var fldName, ruleItem, matchedRule;
		for(var i = 0, len = rules.length; i < len; i++) {
			ruleItem = rules[i];
			fldName = ruleItem.field();
			matchedRule = new jslet.data.ContextRuleItem(fldName);
			
			var meta = ruleItem.meta(); 
			if(meta) {
				matchedRule.meta(new jslet.data.ContextRuleMeta());
				this._copyProperties(meta, matchedRule.meta());
			}
			
			var lookup = ruleItem.lookup(); 
			if(lookup) {
				matchedRule.lookup(new jslet.data.ContextRuleLookup());
				this._copyProperties(lookup, matchedRule.lookup());
			}

			if(isValueChanged && ruleItem.value() !== undefined) {
				matchedRule.value(this._evalExpr(ruleItem, 'value'));
			}
			
			var customized = ruleItem.customized();
			if(customized) {
				matchedRule.customized(customized);
			}
			this._matchedRules.push(matchedRule);
		}
	},
	
	_copyProperties: function(srcObject, descObject) {
		var props = srcObject.properties, propName, propValue;
		for(var i = 0, len = props.length; i < len; i++) {
			propName = props[i];
			propValue = this._evalExpr(srcObject, propName);
			if(propValue !== undefined) {
				descObject[propName].call(descObject, propValue);
			}
		}
	},
	
	_evalExpr: function(evalObj, propName) {
		var exprObj = evalObj[propName + 'Expr'];
		if(exprObj) {
			return exprObj.eval();
		} else {
			return evalObj[propName].call(evalObj);
		}
	},
	
	_syncMatchedRules: function(changingFldName) {
		var matchedRules = this._matchedRules,
			ruleObj, fldName, fldObj;
		
		for(var i = 0, len = matchedRules.length; i < len; i++) {
			ruleObj = matchedRules[i];
			fldName = ruleObj.field();
			fldObj = this._dataset.getField(fldName);
			if(fldObj) {
				this._syncMatchedRuleMeta(fldObj, ruleObj.meta());
				this._syncMatchedRuleLookup(fldObj, ruleObj.lookup());
				this._syncMatchedRuleValue(fldObj, ruleObj.value());
				var customizedFn = ruleObj.customized();
				if(customizedFn) {
					customizedFn(fldObj, changingFldName);
				}
			}
		}
	},
	
	_syncMatchedRuleMeta: function(fldObj, ruleMeta) {
		if(!ruleMeta) {
			return;
		}
		var props = ruleMeta.properties, 
			propName, propValue;
		for(var i = 0, len = props.length; i < len; i++) {
			propName = props[i];
			propValue = ruleMeta[propName].call(ruleMeta);
			if(propValue !== undefined) {
				fldObj[propName].call(fldObj, propValue);
			}
		}
	},
	
	_syncMatchedRuleLookup: function(fldObj, ruleLookup) {
		if(!ruleLookup) {
			return;
		}
		var fieldLookup = fldObj.lookup();
		if(!fieldLookup) {
			return;
		}
		var ruleDs = ruleLookup.dataset();
		if(ruleDs) {
			fieldLookup.dataset(ruleDs);
		}
		var lkDsObj = fieldLookup.dataset();
		lkDsObj.autoRefreshHostDataset(true);
		var ruleFilter = ruleLookup.filter();
		var fldName;
		if(ruleFilter !== undefined) {
			for(fldName in this._ruleEnv) {
				ruleFilter = ruleFilter.replace('${' + fldName + '}', this._ruleEnv[fldName]);
			}
			lkDsObj.filter(ruleFilter);
			lkDsObj.filtered(true);
		}
		ruleFilter = ruleLookup.fixedFilter();
		if(ruleFilter !== undefined) {
			for(fldName in this._ruleEnv) {
				ruleFilter = ruleFilter.replace('${' + fldName + '}', this._ruleEnv[fldName]);
			}
			lkDsObj.fixedFilter(ruleFilter);
			lkDsObj.filtered(true);
		}
		var ruleCriteria = ruleLookup.criteria();
		if(ruleCriteria !== undefined) {
			lkDsObj.query(ruleCriteria);
		}
		var ruleDisplayFields = ruleLookup.displayFields();
		if(ruleDisplayFields !== undefined) {
			fieldLookup.displayFields(ruleDisplayFields);
		}
		var ruleOnlyLeafLevel = ruleLookup.onlyLeafLevel();
		if(ruleOnlyLeafLevel !== undefined) {
			fieldLookup.onlyLeafLevel(ruleOnlyLeafLevel);
		}
	},
	
	_syncMatchedRuleValue: function(fldObj, value) {
		if(value !== undefined) {
			fldObj.setValue(value);
		}
	}
};
/**
 * @private
 * 
 * keep all dataset object,
 * key for dataset name, value for dataset object.
 * @member jslet.data
 */
jslet.data.dataModule = {};

/**
 * Get dataset object with dataset name. If dataset not exist, return null.
 * 
 *     @example
 *     var dsObj = jslet.data.getDataset('employee');
 *     
 * @member jslet.data
 * @param {String} dsName Dataset name;
 * @return {jslet.data.Dataset} Dataset object.
 */
jslet.data.getDataset = function (dsName) {
	if(!dsName) {
		return null;
	}
	if(jslet.isString(dsName)) {
		return jslet.data.dataModule[dsName] || null;
	}
	return dsName;
};

/**
 * @enum
 * 
 * Dataset type.
 * 
 */
jslet.data.DatasetType = {
	//0 - Normal dataset
	NORMAL: 0, 
	//1 - Lookup dataset
	LOOKUP: 1, 
	//2 - Detail dataset
	DETAIL: 2  	 
};

jslet.data.onCreatingDataset = function(dsName, dsCatalog, realDsName, hostDatasetName) { };

/**
 * @enum
 * 
 * Field data type.
 */
jslet.data.DataType = {
	//N - Number
	NUMBER: 'N', 
	//S - String
	STRING: 'S',
	//D - Date
	DATE: 'D',
	//T - Time
	TIME: 'T',
	//B - Boolean
	BOOLEAN: 'B',
	//V - Dataset field
	DATASET: 'V',
	//C - Cross Field
	CROSS: 'C',
	//P - Proxy field
	PROXY: 'P',
	//X - Dynamic field
	EXTEND: 'X',
	//A - Action
	ACTION: 'A',
	//E - Edit
	EDITACTION: 'E'
};

/**
 * @enum
 * 
 * Field value style, used in {@link jslet.data.Field#valueStyle}. <br />
 * Normally, one field stores one value. In jslet, you can store two additional style value: <br />
 * 1. BETWEEN: one field stores an array value with two values: [startValue, endValue]; <br />
 * 2. MULTIPLE: one field stores an array value: [value1, value2, ...]; <br />
 */
jslet.data.FieldValueStyle = {
	//0 - one field stores one value.
	NORMAL: 0,	
	//1 - one field stores an array value with two values: [startValue, endValue].
	BETWEEN: 1, 
	//2 - one field stores an array value: [value1, value2, ...].
	MULTIPLE: 2 
};

/**
 * @enum
 * 
 * Record range, used in submit and export method.
 */
jslet.data.RecordRange = {
	//0 - All data records.
	ALL: 0, 
	//1 - Selected data records.
	SELECTED: 1,
	//2 - The current data record.
	CURRENT: 2,
	//3 - Changed(Insert/Update/Delete) record
	CHANGED: 3
}

/**
 * @class
 *  
 * Edit Mask 
 * 
 * @param {String} mask Edit mask.
 * @param {Boolean} keepChar Keep the literal character or not.
 * @param {String} transform Transform character into UpperCase or LowerCase, optional value: upper, lower or null.
 */
jslet.data.EditMask = function(mask, keepChar, transform){
	jslet.Checker.test('jslet.data.EditMask#mask', mask).required().isString();
	/**
	 * @property 
	 * 
	 * mask {String} mask rule: <br />
	 *  '#': char set: 0-9 and -, not required <br />
	 *  '0': char set: 0-9, required <br />
	 *  '9': char set: 0-9, not required <br />
	 *  'L': char set: A-Z,a-z, required <br />
	 *  'l': char set: A-Z,a-z, not required <br />
	 *  'A': char set: 0-9,a-z,A-Z, required <br />
	 *  'a': char set: 0-9,a-z,A-Z, not required <br />
	 *  'C': char set: any char, required <br />
	 *  'c': char set: any char, not required
	 */
	this.mask = mask; 
	if(keepChar === undefined) {
		keepChar = true;
	}
	
	/**
	 * @property 
	 * 
	 * keepChar {Boolean} Keep the literal character or not
	 */
	this.keepChar = keepChar ? true: false;
	/**
	 * @property 
	 * 
	 * transform {String} Transform character into UpperCase or LowerCase,
	 *  optional value: upper, lower or null.
	 */
	this.transform = transform ? true: false;
	
	this.clone = function(){
		return new jslet.data.EditMask(this.mask, this.keepChar, this.transform);
	};
};

/**
 * @enum
 * 
 * Dataset event type.
 */
jslet.data.DatasetEvent = {
	BEFORESCROLL: 'beforescroll',
	AFTERSCROLL: 'afterscroll',
	
	BEFOREINSERT: 'beforeinsert',
	AFTERINSERT: 'afterinsert',
	
	BEFOREUPDATE: 'beforeupdate',
	AFTERUPDATE: 'afterupdate',
	
	BEFOREDELETE: 'beforedelete',
	AFTERDELETE: 'afterdelete',
	
	BEFORECONFIRM: 'beforeconfirm',
	AFTERCONFIRM: 'afterconfirm',
	
	BEFORECANCEL: 'beforecancel',
	AFTERCANCEL: 'aftercancel',
	
	BEFORESELECT: 'beforeselect',
	AFTERSELECT: 'afterselect',
	
	BEFORESELECTALL: 'beforeselectall',
	AFTERSELECTALL: 'afterselectall'
};

/**
 * @enum
 * 
 * Dataset status.
 */
jslet.data.DataSetStatus = {
	//Record is in 'browser' status.
	BROWSE: 0, 
	//Record is in 'insert' status.
	INSERT: 1, 
	//Record is in 'update' status.
	UPDATE: 2, 
	//Record is in 'delete' status.
	DELETE: 3
};

/**
 * @class
 * Refrsh event.
 */
jslet.data.RefreshEvent = {
	/**
	 * Create an update record event.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return this;
	 */
	updateRecordEvent: function(fldName) {
		return {eventType: jslet.data.RefreshEvent.UPDATERECORD, fieldName: fldName};
	},
	
	/**
	 * Create an update column event.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return this;
	 */
	updateColumnEvent: function(fldName) {
		return {eventType: jslet.data.RefreshEvent.UPDATECOLUMN, fieldName: fldName};
	},
	
	/**
	 * Create an update all event.
	 * 
	 * @return this;
	 */
	updateAllEvent: function() {
		return this._updateAllEvent;
	},
	
	/**
	 * Create an event when the field meta is changed.
	 * 
	 * @param {String} metaName Field meta name.
	 * @param {String} fldName Field name.
	 * 
	 * @return this;
	 */
	changeMetaEvent: function(metaName, fieldName, changeAllRows) {
		var result = {eventType: jslet.data.RefreshEvent.CHANGEMETA, metaName: metaName, fieldName: fieldName};
		if(changeAllRows !== undefined) {
			result.changeAllRows = changeAllRows;
		}
		return result;
	},
	
	/**
	 * Create an event before the record cursor is changing.
	 * 
	 * @param {Integer} recno The record number.
	 * 
	 * @return this;
	 */
	beforeScrollEvent: function(recno) {
		return {eventType: jslet.data.RefreshEvent.BEFORESCROLL, recno: recno};
	},
	
	/**
	 * Create an event when the record cursor is changed.
	 * 
	 * @param {Integer} recno The record number.
	 * @param {Integer} prevRecno The previous record number.
	 * 
	 * @return this;
	 */
	scrollEvent: function(recno, prevRecno) {
		return {eventType: jslet.data.RefreshEvent.SCROLL, prevRecno: prevRecno, recno: recno};
	},
	
	/**
	 * Create an event when appended a record.
	 * 
	 * @param {Integer} prevRecno The previous record number.
	 * @param {Integer} recno The record number.
	 * 
	 * @return this;
	 */
	insertEvent: function(prevRecno, recno, needUpdateAll) {
		return {eventType: jslet.data.RefreshEvent.INSERT, prevRecno: prevRecno, recno: recno, updateAll: needUpdateAll};
	},
	
	/**
	 * Create an event when deleted a record.
	 * 
	 * @param {Integer} recno The record number.
	 * 
	 * @return this;
	 */
	deleteEvent: function(recno) {
		return {eventType: jslet.data.RefreshEvent.DELETE, recno: recno};
	},
	
	/**
	 * Create an event when selected a record.
	 * 
	 * @param {Integer} recno The record number.
	 * @param {Boolean} selected True - the record is selected, false - otherwise.
	 * 
	 * @return this;
	 */
	selectRecordEvent: function(recno, selected) {
		return {eventType: jslet.data.RefreshEvent.SELECTRECORD, recno: recno, selected: selected};
	},
	
	/**
	 * Create an event when selected all records.
	 * 
	 * @param {Boolean} selected True - the record is selected, false - otherwise.
	 * 
	 * @return this;
	 */
	selectAllEvent: function(selected) {
		return {eventType: jslet.data.RefreshEvent.SELECTALL, selected: selected};
	},
	
	/**
	 * Create an event when the paging is changed.
	 * 
	 * @return this;
	 */
	changePageEvent: function() {
		return this._changePageEvent;
	},
	
	/**
	 * Create an event when thrown an error.
	 * 
	 * @return this;
	 */
	errorEvent: function(errMessage) {
		return {eventType: jslet.data.RefreshEvent.ERROR, message: errMessage};
	},
	
	/**
	 * Create an event when the field's lookup is changed.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return this;
	 */
	lookupEvent: function(fieldName, isMetaChanged) {
		return {eventType: jslet.data.RefreshEvent.UPDATELOOKUP, fieldName: fieldName, isMetaChanged: isMetaChanged};
	},
	
	/**
	 * Create an event when records are aggregated.
	 * 
	 * @return this;
	 */
	aggregatedEvent: function() {
		return {eventType: jslet.data.RefreshEvent.AGGREGATED};		
	}
};

jslet.data.RefreshEvent.CHANGEMETA = 'changeMeta';// fieldname, metatype(title, readonly,disabled,format)
jslet.data.RefreshEvent.UPDATEALL = 'updateAll';
jslet.data.RefreshEvent.UPDATERECORD = 'updateRecord';// fieldname
jslet.data.RefreshEvent.UPDATECOLUMN = 'updateColumn';// fieldname
jslet.data.RefreshEvent.BEFORESCROLL = 'beforescroll';
jslet.data.RefreshEvent.SCROLL = 'scroll';// preRecno, recno

jslet.data.RefreshEvent.SELECTRECORD = 'selectRecord';//
jslet.data.RefreshEvent.SELECTALL = 'selectAll';//
jslet.data.RefreshEvent.INSERT = 'insert';
jslet.data.RefreshEvent.DELETE = 'delete';// recno
jslet.data.RefreshEvent.CHANGEPAGE = 'changePage';
jslet.data.RefreshEvent.UPDATELOOKUP = 'updateLookup';
jslet.data.RefreshEvent.AGGREGATED = 'aggregated';

jslet.data.RefreshEvent.ERROR = 'error';

jslet.data.RefreshEvent._updateAllEvent = {eventType: jslet.data.RefreshEvent.UPDATEALL};
jslet.data.RefreshEvent._changePageEvent = {eventType: jslet.data.RefreshEvent.CHANGEPAGE};

/**
 * @private
 * 
 * Convert dataset record to json.
 * 
 * @member jslet.data
 * @param {Object[]} records Dataset records, required.
 * @param {String[]} excludeFields Excluded field names,optional.
 * 
 * @return {String} Json String. 
 */
jslet.data.record2Json = function(records, excludeFields) {
	function record2JsonFilter(key, value) {
		if(key == '_jl_') {
			return undefined;
		}
		if(excludeFields) {
			var fldName;
			for(var i = 0, len = excludeFields.length; i < len; i++) {
				fldName = excludeFields[i];
				if(key == fldName) {
					return undefined;
				}
			}
		}
		return value;		
	}
	
	if(!window.JSON || !JSON) {
		console.error('Your browser does not support JSON!');
		return;
	}
	if(excludeFields) {
		jslet.Checker.test('record2Json#excludeFields', excludeFields).isArray();		
	}
	
	return JSON.stringify(records, record2JsonFilter);
};

jslet.data.getRecInfo = function(record) {
	jslet.Checker.test('jslet.data.getRecInfo#record', record).required();
	var recInfo = record._jl_;
	if(!recInfo) {
		recInfo = {};
		record._jl_ = recInfo;
	}
	return recInfo;
};

/**
 * @private
 */
jslet.data.DatasetRelationManager = function() {
	var relations= [];
	
	/**
	 * Add dataset relation.
	 * 
	 * @param {String} hostDsName host dataset name;
	 * @param {String} hostFldName field name of host dataset;
	 * @param {String} lookupOrDetailDsName lookup or detail dataset name;
	 * @param {jslet.data.DatasetType} relationType, optional value: jslet.data.DatasetType.LOOKUP, jslet.data.DatasetType.DETAIL
	 */
	this.addRelation = function(hostDsName, hostFldName, lookupOrDetailDsName, relationType) {
		for(var i = 0, len = relations.length; i < len; i++) {
			var relation = relations[i];
			if(relation.hostDataset == hostDsName && 
				relation.hostField == hostFldName && 
				relation.lookupDataset == lookupOrDetailDsName) {
				return;
			}
		}
		relations.push({hostDataset: hostDsName, hostField: hostFldName, lookupOrDetailDataset: lookupOrDetailDsName, relationType: relationType});
	};
	
	this.removeRelation = function(hostDsName, hostFldName, lookupOrDetailDsName) {
		for(var i = relations.length - 1; i >= 0; i--) {
			var relation = relations[i];
			if(relation.hostDataset == hostDsName && 
				relation.hostField == hostFldName && 
				relation.lookupOrDetailDataset == lookupOrDetailDsName) {
				relations.splice(i,1);
			}
		}
	};
	
	this.removeDataset = function(datasetName) {
		for(var i = relations.length - 1; i >= 0; i--) {
			var relation = relations[i];
			if(relation.hostDataset == datasetName || relation.lookupOrDetailDataset == datasetName) {
				relations.splice(i,1);
			}
		}
	};
	
	this.changeDatasetName = function(oldName, newName) {
		if(!oldName || !newName) {
			return;
		}
		for(var i = 0, len = relations.length; i < len; i++) {
			var relation = relations[i];
			if(relation.hostDataset == oldName) {
				relation.hostDataset = newName;
			}
			if(relation.lookupOrDetailDataset == oldName) {
				relation.lookupOrDetailDataset = newName;
			}
		}
	};
	
	this.refreshLookupHostDataset = function(lookupDsName) {
		if(!lookupDsName) {
			return;
		}
		var relation, hostDataset;
		for(var i = 0, len = relations.length; i < len; i++) {
			relation = relations[i];
			if(relation.lookupOrDetailDataset == lookupDsName &&
				relation.relationType == jslet.data.DatasetType.LOOKUP) {
				hostDataset = jslet.data.getDataset(relation.hostDataset);
				if(hostDataset) {
					hostDataset.handleLookupDatasetChanged(relation.hostField);
				} else {
					throw new Error('NOT found Host dataset: ' + relation.hostDataset);
				}
			}
		}
	};
	
	this.getHostFieldObject = function(lookupOrDetailDsName) {
		if(!lookupOrDetailDsName) {
			return;
		}
		var relation, hostDataset;
		for(var i = 0, len = relations.length; i < len; i++) {
			relation = relations[i];
			if(relation.lookupOrDetailDataset == lookupOrDetailDsName &&
				relation.relationType == jslet.data.DatasetType.DETAIL) {
				hostDataset = jslet.data.getDataset(relation.hostDataset);
				if(hostDataset) {
					return hostDataset.getField(relation.hostField);
				} else {
					throw new Error('NOT found Host dataset: ' + relation.hostDataset);
				}
			}
		} //end for i	
	};
};
jslet.data.datasetRelationManager = new jslet.data.DatasetRelationManager();

jslet.EmptyPromise = function(action) {
	var action = action;
	
	this.done = function(callBackFn) {
		if(action == 'done' && callBackFn) {
			callBackFn();
		}
		return this;
	};
	
	this.fail = function(callBackFn) {
		if(action == 'fail' && callBackFn) {
			callBackFn();
		}
		return this;
	};
	
	this.always = function(callBackFn) {
		if(callBackFn) {
			callBackFn();
		}
		return this;
	};
};

jslet.data.displayOrderComparator = function(fldObj1, fldObj2) {
	var order1 = fldObj1.displayOrder();
	var order2 = fldObj2.displayOrder();
	return order1 - order2;
};

/**
 * @private
 * @class
 * 
 * Global data processing.
 */
jslet.data.GlobalDataHandler = function() {
	var Z = this;
	Z._datasetMetaChanged = null;
	Z._fieldMetaChanged = null;
	Z._fieldValueChanged = null;
};

jslet.data.GlobalDataHandler.prototype = {
		
	/**
	 * Fired when dataset created.
	 *  Pattern: 
	 *	function(dataset}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  
	 * @param {Function | undefined} datasetCreated dataset created event handler.
	 * @return {this | Function}
	 */
	datasetCreated: function(datasetCreated) {
		var Z = this;
		if(datasetCreated === undefined) {
			return Z._datasetCreated;
		}
		jslet.Checker.test('globalDataHandler.datasetCreated', datasetCreated).isFunction();
		Z._datasetCreated = datasetCreated;
	},
	
	/**
	 * Fired when dataset meta is changed.
	 *  Pattern: 
	 *	function(dataset, metaName}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  	//metaName: {String} dataset's meta name
	 *  
	 * @param {Function | undefined} datasetMetaChanged Dataset meta changed event handler.
	 * @return {this | Function}
	 */
	datasetMetaChanged: function(datasetMetaChanged) {
		var Z = this;
		if(datasetMetaChanged === undefined) {
			return Z._datasetMetaChanged;
		}
		jslet.Checker.test('globalDataHandler.datasetMetaChanged', datasetMetaChanged).isFunction();
		Z._datasetMetaChanged = datasetMetaChanged;
	},
	
	/**
	 * Fired when field meta is changed.
	 *  Pattern: 
	 *	function(dataset, fieldName, metaName}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  	//fieldName: {String} field name
	 *  	//metaName: {String} dataset's meta name
	 *  
	 * @param {Function | undefined} fieldMetaChanged Dataset meta changed event handler.
	 * @return {this | Function}
	 */
	fieldMetaChanged: function(fieldMetaChanged) {
		var Z = this;
		if(fieldMetaChanged === undefined) {
			return Z._fieldMetaChanged;
		}
		jslet.Checker.test('globalDataHandler.fieldMetaChanged', fieldMetaChanged).isFunction();
		Z._fieldMetaChanged = fieldMetaChanged;
	},
	
	/**
	 * Fired when field value is changed.
	 *  Pattern: 
	 *	function(dataset, metaName}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  	//fieldName: {String} field name
	 *  	//fieldValue: {Object} field value
	 *  	//valueIndex: {Integer} value index
	 *  
	 * @param {Function | undefined} fieldValueChanged field value changed event handler.
	 * @return {this | Function}
	 */
	fieldValueChanged: function(fieldValueChanged) {
		var Z = this;
		if(fieldValueChanged === undefined) {
			return Z._fieldValueChanged;
		}
		jslet.Checker.test('globalDataHandler.fieldValueChanged', fieldValueChanged).isFunction();
		Z._fieldValueChanged = fieldValueChanged;
	}
};

jslet.data.globalDataHandler = new jslet.data.GlobalDataHandler();


jslet.data.DatasetCreatingManager = function() {
	this._maxCreatingLevels = {};
	
	this._creatingDatasets = [];
	
	this._doDatasetCreatedDebounce = jslet.debounce(this._doDatasetCreated, 100);
}

jslet.data.DatasetCreatingManager.prototype = {
	setMaxCreateLevel: function(dsName, maxCreatingLevel) {
		if(maxCreatingLevel) {
			this._maxCreatingLevels[dsName] = maxCreatingLevel;
		}
	},
	
	startCreateDataset: function(dsName, hostDsName, isLookup) {
		var hostDsCfg;
		if(hostDsName) {
			hostDsCfg = this._getDsCfg(hostDsName);
			if(!hostDsCfg) {
				hostDsCfg = {name: hostDsName, level: 0, relative: []};
				this._creatingDatasets.push(hostDsCfg);
			}
			if(!this._getDsCfg(dsName)) {
				var relative = hostDsCfg.relative;
				if(!relative) {
					hostDsCfg.relative = [];
					relative = hostDsCfg.relative;
				}
				relative.push({name: dsName, level: (isLookup? hostDsCfg.level + 1: 0), parent: hostDsCfg});
			}
		}
	},
	
	endCreateDataset: function() {
		if(jslet.global.dataset.onDatasetCreated) {
			this._doDatasetCreatedDebounce.call(this);
		}
	},
	
	allowCreatingDataset: function(hostDsName) {
		var hostDsCfg = this._getDsCfg(hostDsName);
		if(!hostDsCfg) {
			return true;
		}
		var dsCfg = hostDsCfg;
		var maxLevel = 0;
		while(true) {
			if(!dsCfg.parent) {
				maxLevel = this._maxCreatingLevels[dsCfg.name];
				break;
			}
			dsCfg = dsCfg.parent;
		}
		if(maxLevel && hostDsCfg.level === maxLevel) {
			return false
		}
		return true;
	},
	
	_checkAllCreated: function(hostDsCfg) {
		var result = true, 
			dsCfg, 
			relative = hostDsCfg.relative;
		
		for(var i = 0, len = relative.length; i < len; i++) {
			dsCfg = relative[i];
			if(!jslet.data.getDataset(dsCfg.name)) {
				return false;
			}
			if(dsCfg.relative) {
				result = this._checkAllCreated(dsCfg);
				if(!result) {
					return false;
				}
			}
		}
		return true;
	},
	
	_getDsCfg: function(dsName, datasets) {
		if(!dsName) {
			return null;
		}
		var datasets, dsCfg;
		if(datasets === undefined) {
			datasets = this._creatingDatasets;
		}
		for(var i = 0, len = datasets.length; i < len; i++) {
			dsCfg = datasets[i];
			if(dsCfg.name == dsName) {
				return dsCfg;
			}
			if(dsCfg.relative) {
				dsCfg = this._getDsCfg(dsName, dsCfg.relative);
				if(dsCfg) {
					return dsCfg;
				}
			}
		}
		return null;
	},
	
	_doDatasetCreated: function() {
		var datasets = this._creatingDatasets,
			rootDsCfg, rootDsName,
			allCreated = true;
		for(var i = datasets.length - 1; i >= 0; i--) {
			rootDsCfg = datasets[i];
			rootDsName = rootDsCfg.name;
			if(this._checkAllCreated(rootDsCfg)) {
				datasets.splice(i, 1);
				delete this._maxCreatingLevels[rootDsName];
			} else {
				allCreated = false;
				break;
			}
		}
		if(allCreated) {
			jslet.global.dataset.onDatasetCreated();
		}
	}
}
jslet.data.defaultDatasetCreatingManager = new jslet.data.DatasetCreatingManager();

/**
 * @class
 * @constructor
 * 
 * Dataset is the core class in Jslet. 
 */
jslet.data.Dataset = function (datasetCfg) {
	
	var Z = this;
	Z._name = null; //Dataset name
	Z._description = null;
	Z._recordClass = jslet.global.defaultRecordClass; //Record class, used for serialized/deserialize
	Z._records = null; //Array of data records
	Z._oriRecords = null;
	Z._fields = []; //Array of jslet.data.Field
	Z._fieldsMap = {};
	
	Z._oriFields = null;
	
	Z._normalFields = []; //Array of jslet.data.Field except the fields with children.
	Z._recno = -1;
	Z._filteredRecnoArray = null;

	Z._unitConvertFactor = 1;
	Z._unitName = null;
	Z._aborted = false;

	Z._valueFollowEnabled = true;
	
	Z._status = 0; // dataset status, optional values: 0:browse;1:created;2:updated;3:deleted;
	Z._proxyFields = null;
	
	Z._fixedFilter = null;	
	Z._filter = null;
	Z._filtered = false;
	Z._innerFilter = null; //inner variable
	Z._findCondition = null;
	Z._innerFindCondition = null; //inner variable

	Z._innerFormularFields = null; //inner variable

	Z._bof = false;
	Z._eof = false;
	Z._igoreEvent = false;
	Z._logChanges = true;
	Z._auditLogEnabled = true;
	Z._validationEnabled = true;
	
	
	Z._modiObject = null;
	Z._inputtingRecord = {};
	Z._lockCount = 0;

	Z._fixedIndexFields = null;
	Z._innerFixedIndexFields = [];
	Z._indexFields = null;
	Z._innerIndexFields = [];
	Z._sortingFields = null;

	Z._convertDestFields = null;
	Z._innerConvertDestFields = null;

	Z._masterDataset = null;
	Z._masterField = null;
	Z._detailDatasetFields = null; //Array of dataset field object

	Z._linkedControls = []; //Array of DBControl except DBLabel
	Z._linkedLabels = []; //Array of DBLabel
	Z._silence = 0;
	Z._keyField = null;
	Z._codeField = null;
	Z._nameField = null;
	Z._parentField = null;
	Z._levelOrderField = null;
	Z._selectField = null;
	Z._statusField = null;
	
	Z._contextRules = null;
	Z._contextRuleEngine = null;
	Z._contextRuleEnabled = false;

	Z._dataProvider = jslet.data.DataProvider ? new jslet.data.DataProvider() : null;

	Z._queryCriteria = null; //String query parameters 
	Z._queryUrl = null; //String query URL 
	Z._submitUrl = null; //String submit URL
	Z._pageSize = 500;
	Z._pageNo = 0;  
	Z._pageCount = 0;
	//The following attributes are used for private.
	Z._ignoreFilter = false;
	Z._ignoreFilterRecno = 0;
	
	Z._fieldValidator = new jslet.data.FieldValidator();
	
	Z._onFieldChanged = null;  

	Z._onFieldFocusing = null;

	Z._isFireGlobalEvent = true;

	Z._onCheckSelectable = null;

	Z._onDataQuerying = null;
	
	Z._onDataQueried = null;
	
	Z._onDataSubmitted = null;
	
	Z._datasetListener = null;
	
	Z._datasetEventHandler = null;
	
	Z._designMode = false;
	
	Z._autoShowError = true;
	Z._autoRefreshHostDataset = false;
	Z._readOnly = false;
	Z._aggregatedValues = null;
	Z._afterScrollDebounce = jslet.debounce(Z._innerAfterScrollDebounce, 30);
	Z._calcAggregatedValueDebounce = jslet.debounce(Z.calcAggregatedValue, 100);
	Z.selection = new jslet.data.DataSelection(Z);
	Z._changeLog = new jslet.data.ChangeLog(Z);
	Z._dataTransformer = new jslet.data.DataTransformer(Z);
	Z._followedValues = null;
	Z._focusedFields = null;
	Z._canFocusFields = null;
	
	Z._lastFindingValue = null;
	Z._inContextRule = false;
	Z._aggregatedFields = null;
	Z._aggregatingCount = 0;
	
	Z.createdByFactory = false;
	Z._isEnum = false;
	this._create(datasetCfg);
};
jslet.data.Dataset.className = 'jslet.data.Dataset';

jslet.data.Dataset.prototype = {

	className: jslet.data.Dataset.className,
	
	_create: function(dsCfg) {
		var dsName = dsCfg.name, fieldConfig;
		jslet.Checker.test('createDataset#datasetName', dsName).required().isString();
		var Z = this;
		Z.name(dsName);
		Z.createdByFactory = dsCfg.createdByFactory;
		Z._isEnum = dsCfg.isEnum;
		if(Z._isEnum) {
			fieldConfig =  [{name: 'code', type: 'S', length: 20, displayWidth: 10, label: jsletlocale.EnumDataset.code},
			                {name: 'name', type: 'S', length: 100, displayWidth: 16, label: jsletlocale.EnumDataset.name}];
			Z.createFields(fieldConfig);
			Z.keyField('code');
			Z.codeField('code');
			Z.nameField('name');
			if(dsCfg.indexFields !== undefined) {
				Z.indexFields(dsCfg.indexFields);
			}
			if(dsCfg.records) {
				Z.records(dsCfg.records);
			}
			return;
		}
		fieldConfig = dsCfg.fields;
		Z.createFields(fieldConfig);
		
		function setPropValue(propName) {
			var propValue = dsCfg[propName];
			if (propValue !== undefined) {
				Z[propName](propValue);
			}
		}
		
		function setIntPropValue(propName) {
			var propValue = dsCfg[propName];
			if (propValue !== undefined) {
				Z[propName](parseInt(propValue));
			}
		}
		
		function setBooleanPropValue(propName) {
			var propValue = dsCfg[propName];
			if (propValue !== undefined) {
				if(jslet.isString(propValue)) {
					if(propValue) {
						propValue = propValue != '0' && propValue != 'false';
					}
				}
				Z[propName](propValue? true: false);
			}
		}
		
		setPropValue('keyField');
		setPropValue('codeField');
		setPropValue('nameField');
		setPropValue('parentField');
		setPropValue('levelOrderField');
		setPropValue('selectField');
		setPropValue('statusField');
		
		setPropValue('recordClass');
		setPropValue('description');
		
		setPropValue('queryUrl');
		setPropValue('submitUrl');
		setIntPropValue('pageNo');
		setIntPropValue('pageSize');
		setPropValue('fixedIndexFields');
		setPropValue('indexFields');
		setPropValue('fixedFilter');
		setPropValue('filter');
		setBooleanPropValue('filtered');
		setBooleanPropValue('autoShowError');
		setBooleanPropValue('autoRefreshHostDataset');
		setBooleanPropValue('readOnly');
		setBooleanPropValue('logChanges');
		setBooleanPropValue('auditLogEnabled');
		setBooleanPropValue('isFireGlobalEvent');
		
		setPropValue('datasetListener');
		setPropValue('onFieldChange');
		setPropValue('onFieldChanged');
		setPropValue('onFieldChanging');
		setPropValue('onCheckSelectable');
		setPropValue('contextRules');
		
		if(dsCfg.records) {
			Z.records(dsCfg.records);
		}
	},
		
	/**
	* @property
	* 
	* Set or get dataset's name. 
	* Dataset's name must be unique. Example:
	* 
	*     @example
	*     dsObj.name('test'); //Set property, return this.
	*     var propValue = dsObj.name(); //Get property value.
	* 
	* @param {String | undefined} name Dataset name.
	* 
	* @return {this | String} 
	*/
	name: function(name) {
		var Z = this;
		if(name === undefined) {
			return Z._name;
		}
		jslet.Checker.test('Dataset.name', name).required().isString();
		name = jslet.trim(name);
		
		var dsName = this._name;
		if (dsName) {
			jslet.data.dataModule[dsName] = null;
			jslet.data.datasetRelationManager.changeDatasetName(dsName, name);
		}
		jslet.data.dataModule[name] = this;
		this._name = name;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get dataset description. Dataset description is also used for dataset exporting as the default file name. 
	 * 
	 *     @example
	 *     dsObj.description('test'); //Set property, return this.
	 *     var propValue = dsObj.description(); //Get property value.
	 * 
	 * @param {String | undefined} description Dataset's description.
	 * 
	 * @return {this | String}
	 */
	description: function(description) {
		if(description === undefined) {
			return this._description || this._name;
		}
		this._description = description;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set dataset's record class, recordClass is the server entity class quantified name.
	 * It's used for automated serialization at server side.
	 * 
	 *     @example
	 *     dsObj.recordClass('test'); //Set property, return this.
	 *     var propValue = dsObj.recordClass(); //Get property value.
	 *     
	 * @param {String | undefined} clazzName Server entity class name.
	 * 
	 * @return {this | String}
	 */
	recordClass: function(clazz) {
		var Z = this;
		if (clazz === undefined) {
			return Z._recordClass;
		}
		jslet.Checker.test('Dataset.recordClass', clazz).isString();
		Z._recordClass = clazz ? clazz.trim() : null;
		return this;
	},
		
	/**
	* Clone this dataset's structure and return new dataset object..
	* 
	* @param {String} newDsName New dataset's name.
	* @param {String[]} fieldNames a list of field names which will be cloned to new dataset.
	* 
	* @return {jslet.data.Dataset} Cloned dataset object
	*/
	clone: function (newDsName, fieldNames) {
		var Z = this;
		if (!newDsName) {
			newDsName = Z._name + '_clone';
		}
		var result = new jslet.data.Dataset({name: newDsName, fields: []});
		result._datasetListener = Z._datasetListener;

		result._unitConvertFactor = Z._unitConvertFactor;
		result._unitName = Z._unitName;

		result._fixedFilter = Z._fixedFilter;
		result._filter = Z._filter;
		result._filtered = Z._filtered;
		result._logChanges = Z._logChanges;
		result._fixedIndexFields = Z._fixedIndexFields;
		result._indexFields = Z._indexFields;
		
		var keyFldName = Z._keyField,
			codeFldName = Z._codeField,
			nameFldName = Z._nameField,
			parentFldName = Z._parentField,
			levelOrderField = Z._levelOrderField,
			selectFldName = Z._selectField,
			statusFldName = Z._statusField;
		if (fieldNames) {
			keyFldName = keyFldName && fieldNames.indexOf(keyFldName) >= 0 ? keyFldName: null;
			codeFldName = codeFldName && fieldNames.indexOf(codeFldName) >= 0 ? codeFldName: null;
			nameFldName = nameFldName && fieldNames.indexOf(nameFldName) >= 0 ? nameFldName: null;
			parentFldName = parentFldName && fieldNames.indexOf(parentFldName) >= 0 ? parentFldName: null;
			levelOrderField = levelOrderField && fieldNames.indexOf(levelOrderField) >= 0 ? levelOrderField: null;
			selectFldName = selectFldName && fieldNames.indexOf(selectFldName) >= 0 ? selectFldName: null;
			statusFldName = statusFldName && fieldNames.indexOf(statusFldName) >= 0 ? statusFldName: null;
		}
		result._keyField = keyFldName;
		result._codeField = codeFldName;
		result._nameField = nameFldName;
		result._parentField = parentFldName;
		result._levelOrderField = levelOrderField;
		result._selectField = selectFldName;
		result._statusField = statusFldName;
		
		result._contextRules = Z._contextRules;
		var fldObj, fldName;
		for(var i = 0, cnt = Z._fields.length; i < cnt; i++) {
			fldObj = Z._fields[i];
			fldName = fldObj.name();
			if (fieldNames) {
				if (fieldNames.indexOf(fldName) < 0) {
					continue;
				}
			}
			result.addField(fldObj.clone(fldName, result));
		}
		return result;
	},

	/**
	 * Clone one record to another
	 * 
	 * @param {Object} srcRecord source record
	 * @param {Object} destRecord destination record
	 */
	cloneRecord: function(srcRecord, destRecord) {
		var result = destRecord || {}, 
			fldName, fldObj, fldValue, newValue, 
			arrFieldObj = this.getNormalFields();

		for(var i = 0, len = arrFieldObj.length; i < len; i++) {
			fldObj = arrFieldObj[i];
			fldName = fldObj.name();
			fldValue = srcRecord[fldName];
			if(fldValue === undefined) {
				continue;
			}
			if(fldValue && jslet.isArray(fldValue)) {
				newValue = [];
				for(var j = 0, cnt = fldValue.length; j < cnt; j++) {
					newValue.push(fldValue[j]);
				}
			} else {
				newValue = fldValue;
			}
			result[fldName] = newValue;
		}
		jslet.data.FieldValueCache.removeCache(result);
		return result;
	},
	
	/**
	 * @property 
	 *     
	 * Identity whether dataset is readonly or not. This porperty will override the field readOnly property.
	 * <br />Default value: false.
	 * 
	 *     @example
	 *     dsObj.readOnly(true); //Set property, return this.
	 *     var propValue = dsObj.readOnly(); //Get property value.
	 * 
	 * @param {Boolean | undefined} readOnly.
	 * 
	 * @return {this | Boolean}
	 */
	readOnly: function(readOnly) {
		var Z = this;
		if (readOnly === undefined) {
			return Z._readOnly;
		}
		
		Z._readOnly = readOnly? true: false;
		var fields = Z.getNormalFields(),
			fldObj;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			fldObj._fireMetaChangedEvent('readOnly');
		}
		return this;
	},
	
	/**
	 * @property 
	 * 
	 * Set or get page size. To query paging data, you must set this property.
	 * <br />Default value: 0. 
	 * 
	 *     @example
	 *     dsObj.pageSize(true); //Set property, return this.
	 *     var propValue = dsObj.pageSize(); //Get property value.
	 * 
	 * @param {Integer | undefined} pageSize Page size.
	 * 
	 * @return {this | Integer}
	 */
	pageSize: function(pageSize) {
		if (pageSize === undefined) {
			return this._pageSize;
		}
		
		jslet.Checker.test('Dataset.pageSize#pageSize', pageSize).isGTEZero();
		this._pageSize = pageSize;
		return this;
	},

	/**
	 * @property 
	 * 
	 * Set or get page number. To query paging data, you must set this property.
	 * <br />Default value: 0. 
	 * 
	 *     @example
	 *     dsObj.pageNo(true); //Set property, return this.
	 *     var propValue = dsObj.pageNo(); //Get property value.
	 * 
	 * @param {Integer | undefined} pageNo Page number.
	 * 
	 * @return {this | Integer}
	 */
	pageNo: function(pageNo) {
		if (pageNo === undefined) {
			return this._pageNo;
		}
		
		jslet.Checker.test('Dataset.pageNo#pageNo', pageNo).isGTEZero();
		this._pageNo = pageNo;
		return this;
	},
	
	/**
	 * Get page count, it's a read only property.
	 * 
	 *     @example
	 *     var propValue = dsObj.pageCount(); //Get property value.
	 * 
	 * @return {Integer}
	 */
	pageCount: function() {
		return this._pageCount;
	},
	
	/**
	 * @property
	 * 
	 * Get the master dataset object for "Detail Dataset".
	 * 
	 *     @example
	 *     var propValue = dsObj.masterDataset(); //Get property value.
	 * 
	 * @return {jslet.data.Dataset}
	 */
	masterDataset: function(masterDataset) {
		if(masterDataset === undefined) {
			if(this._masterDataset) {
				return jslet.data.getDataset(this._masterDataset);
			} else {
				return null;
			}
		}
		this._masterDataset = masterDataset;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Get the master field name for "Detail Dataset".
	 * 
	 *     @example
	 *     var propValue = dsObj.masterField(); //Get property value.
	 * 
	 * @return {String}
	 */
	masterField: function(masterField) {
		if(masterField === undefined) {
			return this._masterField;
		}
		jslet.Checker.test('Dataset.masterField', masterField).isString();
		this._masterField = masterField;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Get the master field object.
	 * 
	 *     @example
	 *     var propValue = dsObj.getMasterFieldObject(); //Get property value.
	 * 
	 * @return {jslet.data.Field} Master field object.
	 */
	getMasterFieldObject: function() {
		if(this._masterField) {
			return this.masterDataset().getField(this._masterField);
		}
		return null;
	},
	
	/**
	 * @private
	 * 
	 * Identify whether dataset is in desin mode.
	 * 
	 * @param {Boolean | undefined} designMode.
	 * 
	 * @return {this | Boolean}
	 */
	designMode: function(designMode) {
		if (designMode === undefined) {
			return this._designMode;
		}
		
		this._designMode = designMode ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Identify whether alerting the error message when apply changes to server.
	 * <br />Default value: true.
	 * 
	 *     @example
	 *     dsObj.autoShowError(true); //Set property, return this.
	 *     var propValue = dsObj.autoShowError(); //Get property value.
	 * 
	 * @param {Boolean | undefined} autoShowError.
	 * 
	 * @return {this | Boolean}
	 */
	autoShowError: function(autoShowError) {
		if (autoShowError === undefined) {
			return this._autoShowError;
		}
		
		this._autoShowError = autoShowError ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Update the host dataset or not if this dataset is a lookup dataset and its data has changed.<br />
	 * If true, all datasets which host this dataset will be refreshed.
	 * <br />Default value: false.
	 * 
	 *     @example
	 *     dsObj.autoRefreshHostDataset(true); //Set property, return this.
	 *     var propValue = dsObj.autoRefreshHostDataset(); //Get property value.
	 * 
	 * @param {Boolean | undefined} flag.
	 * 
	 * @return {this | Boolean}
	 */
	autoRefreshHostDataset: function(flag) {
		if(flag === undefined) {
			return this._autoRefreshHostDataset;
		}
		this._autoRefreshHostDataset = flag ? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set unit converting factor.
	 * 
	 * @param {Number} factor When changed this value, the field's display value will be changed by 'fldValue/factor'.
	 * @param {String} unitName Unit name that displays after field value.
	 * 
	 * @return {this}
	 */
	unitConvertFactor: function (factor, unitName) {
		var Z = this;
		if (arguments.length === 0) {
			return Z._unitConvertFactor;
		}
		
		jslet.Checker.test('Dataset.unitConvertFactor#factor', factor).isGTZero();
		jslet.Checker.test('Dataset.unitConvertFactor#unitName', unitName).isString();
		if (factor > 0) {
			Z._unitConvertFactor = factor;
		}
		else{
			Z._unitConvertFactor = 1;
		}

		Z._unitName = unitName;
		for (var i = 0, cnt = Z._normalFields.length, fldObj; i < cnt; i++) {
			fldObj = Z._normalFields[i];
			if (fldObj.getType() == jslet.data.DataType.NUMBER && fldObj.unitConverted()) {
				var fldName = fldObj.name();
				jslet.data.FieldValueCache.clearAll(Z, fldName);
				var evt = jslet.data.RefreshEvent.updateColumnEvent(fldName);
				Z.refreshControl(evt);
			}
		} //end for
		return Z;
	},

	/**
	 * @property
	 * 
	 * Identify whether enable value following when append record or not. This property is control the field's property "valueFollow".
	 * 
	 * @param {Boolean | undefined} valueFollowEnabled True -(Default) enable value following, false - otherwise.
	 * 
	 * @return {this | Boolean} 
	 */
	valueFollowEnabled: function(valueFollowEnabled) {
		if(valueFollowEnabled === undefined) {
			return this._valueFollowEnabled;
		}
		this._valueFollowEnabled = valueFollowEnabled;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get dataset event listener. Example:
	 * 
	 *     @example
	 *     dsFoo.datasetListener(function(eventType, dataset) {
	 *		 console.log(eventType);
	 *     });
	 * 
	 * @param {Function} listener Dataset event listener.
	 * @param {jslet.data.DatasetEvent} listener.eventType Event type.
	 * @param {jslet.data.Dataset} listener.dataset Dataset object.
	 * 
	 * @return {this | Function}
	 */
	datasetListener: function(listener) {
		if (arguments.length === 0) {
			return this._datasetListener;
		}
		
		this._datasetListener = listener;
		return this;
	},
	
	/**
	 * Add event handler for dataset events. Example:
	 * 
	 *     @example
	 *     var handler = function() {
	 *         console.log('After scroll event fired!');
	 *     };
	 *     dsObj.on('afterScroll', handler);
	 * 
	 * @param {jslet.data.DatasetEvent | String} eventName Event name.
	 * @param {Function | String} eventHanlder Event handler.
	 */
	on: function(eventName, eventHanlder) {
		jslet.Checker.test('Dataset.on#eventName', eventName).isString().required();
		jslet.Checker.test('Dataset.on#eventHanlder', eventHanlder).required();
		var Z = this;
		var dsHandlers = Z._datasetEventHandler;
		if(!dsHandlers) {
			dsHandlers = {};
			Z._datasetEventHandler = dsHandlers;
		}
		var evtHandlers = dsHandlers[eventName];
		if(!evtHandlers) {
			evtHandlers = [];
			dsHandlers[eventName] = evtHandlers;
		}
		evtHandlers.push(eventHanlder);
	},
	
	/**
	 * Remove event handler. Example:
	 * 
	 *     @example
	 *     //Remove all event handlers.
	 *     dsObj.off();
	 *     
	 *     //Remove the specified event handlers.
	 *     dsObj.off('afterScroll');
	 *     
	 *     //Remove one event handler.
	 *     var handler = function() {
	 *         console.log('After scroll event fired!');
	 *     };
	 *     dsObj.on('afterScroll', handler);
	 *     dsObj.off('afterScroll', handler);
	 *     
	 * 
	 * @param {jslet.data.DatasetEvent | String} eventName Event name.
	 * @param {Function | String} eventHanlder Event handler.
	 */
	off: function(eventName, eventHanlder) {
		var dsHandlers = this._datasetEventHandler;
		if(!dsHandlers) {
			return;
		}
		if(!eventName && !eventHanlder) {
			this._datasetEventHandler = null;
			return;
		}
		if(!eventName) {
			return;
		} 
		var evtHandlers = dsHandlers[eventName];
		if(!evtHandlers) {
			return;
		}
		if(!eventHanlder) {
			dsHandlers[eventName] = null;
			delete dsHandlers[eventName];
		} else {
			var handler;
			for(var i = 0, len = evtHandlers.length; i < len; i++) {
				handler = evtHandlers[i];
				if(eventHanlder === handler) {
					evtHandlers.splice(i, 1);
				}
			}
		}
	},
	
	/**
	 * @event
	 * 
	 * Fired when check a record if it's selectable or not. Example:
	 * 
	 *     @example
	 *     dsObj.onCheckSelectable(function(recno) {
	 *       return true;
	 *     });
	 *  
	 * @param {Function | undefined} onCheckSelectable Check selectable event.
	 * @param {Boolean} onCheckSelectable.recno Record number. 
	 * @param {Boolean} onCheckSelectable.return Identify whether the record is selectable or not, true - record can be selected, false - otherwise.
	 * 
	 * @return {this | Function}
	 */
	onCheckSelectable: function(onCheckSelectable) {
		if (onCheckSelectable === undefined) {
			return this._onCheckSelectable;
		}
		
		this._onCheckSelectable = onCheckSelectable;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired when querying data from server.
	 * 
	 *     @example
	 *     dsObj.onDataQuerying(function(queryResult) {
	 *       
	 *     });
	 *  
	 * @param {Function | undefined} onDataQuerying Data quering event.
	 * @param {Object} onDataQuerying.queryResult The data from server.
	 * 
	 * @return {this | Function}
	 */
	onDataQuerying: function(onDataQuerying) {
		if (onDataQuerying === undefined) {
			return this._onDataQuerying;
		}
		
		this._onDataQuerying = onDataQuerying;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired after querying data from server.
	 * 
	 *     @example
	 *     dsObj.onDataQueried(function() {
	 *       
	 *     });
	 *  
	 * @param {Function | undefined} onDataQueried Data queried event.
	 * 
	 * @return {this | Function}
	 */
	onDataQueried: function(onDataQueried) {
		if (onDataQueried === undefined) {
			return this._onDataQueried;
		}
		
		this._onDataQueried = onDataQueried;
		return this;
	},
	
	/**
	 * @event
	 * 
	 * Fired after submitting data to server.
	 * 
	 *     @example
	 *     dsObj.onDataSubmitted(function() {
	 *       
	 *     });
	 *  
	 * @param {Function | undefined} onDataSubmitted Data submitted event.
	 * 
	 * @return {this | Function}
	 */
	onDataSubmitted: function(onDataSubmitted) {
		if (onDataSubmitted === undefined) {
			return this._onDataSubmitted;
		}
		
		this._onDataSubmitted = onDataSubmitted;
		return this;
	},

	/**
	 * @private
	 */
	fieldValidator: function() {
		return this._fieldValidator;
	},
	
	/**
	 * @event
	 * 
	 * Set or get dataset onFieldChanged event handler. Example:
	 * 
	 *     @example
	 *     dsFoo.onFieldChanged(function(fldName, value, valueIndex) {
	 *     });
	 * 
	 * @param {Function} onFieldChanged Dataset on field change event handler.
	 * @param {String} onFieldChanged.fldName Field name.
	 * @param {Object} onFieldChanged.fldValue Field value.
	 * @param {Integer} onFieldChanged.valueIndex Field value index, only worked when field value style is BETWEEN or MULTIPLE.
	 * 
	 * @return {this | Function}
	 */
	onFieldChanged: function(onFieldChanged) {
		if (onFieldChanged === undefined) {
			return this._onFieldChanged;
		}
		
		this._onFieldChanged = onFieldChanged;
		return this;
	},
	
	/**
	 * @deprecated
	 * Use onFieldChanged instead.
	 */
	onFieldChange: function(onFieldChanged) {
		if (onFieldChanged === undefined) {
			return this._onFieldChanged;
		}
		
		this._onFieldChanged = onFieldChanged;
		return this;
	},
	
	onFieldFocusing: function(onFieldFocusing) {
		if(onFieldFocusing === undefined) {
			return this._onFieldFocusing;
		}
		this._onFieldFocusing = onFieldFocusing;
		return this;
	},
	
	/**
	 * Identify if firing global event or not when field value or field meta changed.
	 */
	isFireGlobalEvent: function(isFireGlobalEvent) {
		if(isFireGlobalEvent === undefined) {
			return this._isFireGlobalEvent;
		}
		this._isFireGlobalEvent = isFireGlobalEvent? true: false;
		return this;
	},
	
	/**
	 * Get dataset fields.
	 * 
	 * @return {jslet.data.Field[]} Dataset fields.
	 */
	getFields: function () {
		return this._fields;
	},

	/**
	 * Get fields which is without child fields.
	 * 
	 * @return {jslet.data.Field[]}
	 */
	getNormalFields: function() {
		return this._normalFields;
	},
	
	/**
	 * Get field names exclude the fields with children.
	 * 
	 * @return {String[]} Editable field names.
	 */
	getEditableFields: function() {
		var fields = this._normalFields,
			fldObj,
			result = [];
		
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if(fldObj.visible() && !fldObj.disabled() && !fldObj.readOnly()) {
				result.push(fldObj.name());
			}
		}
		return result;
	},
	
	getFirstFocusField: function() {
		var Z = this;
		var fields = Z.mergedFocusedFields();
		if(fields && fields.length > 0) {
			return fields[0];
		}
		fields = Z.getEditableFields();
		if(fields && fields.length > 0) {
			return fields[0];
		}
	},
	
	/**
	 * Set the specified fields to be visible, others to be hidden. Example:
	 * 
	 *     @example
	 *     dsFoo.setVisibleFields(['field1', 'field3']);
	 * 
	 * @param {String[]} visibleFields Array of visible field name.
	 * 
	 * @return {this}
	 */
	setVisibleFields: function(fieldNameArray) {
		if(!fieldNameArray) {
			return this;
		}
		if(jslet.isString(fieldNameArray)) {
			fieldNameArray = fieldNameArray.split(',');
		}
		jslet.Checker.test('Dataset.setVisibleFields#fieldNameArray', fieldNameArray).isArray();
		this._travelField(this._fields, function(fldObj) {
			fldObj.visible(false);
			return false; //Identify if cancel traveling or not
		});
		for(var i = 0, len = fieldNameArray.length; i < len; i++) {
			var fldName = jslet.trim(fieldNameArray[i]);
			var fldObj = this.getField(fldName);
			if(fldObj) {
				fldObj.visible(true);
			}
		}
		return this;
	},
	
	/**
	 * @private
	 */
	_travelField: function(fields, callBackFn) {
		if (!callBackFn || !fields) {
			return;
		}
		var isBreak = false;
		for(var i = 0, len = fields.length; i < len; i++) {
			var fldObj = fields[i];
			isBreak = callBackFn(fldObj);
			if (isBreak) {
				break;
			}
			
			var children = fldObj.children();
			if(children && children.length > 0) {
				isBreak = this._travelField(fldObj.children(), callBackFn);
				if (isBreak) {
					break;
				}
			}
		}
		return isBreak;
	},
	
	/**
	 * @private
	 */
	_cacheNormalFields: function() {
		var arrFields = this._normalFields = [];
		this._travelField(this._fields, function(fldObj) {
			var children = fldObj.children();
			var dataType = fldObj.dataType();
			if((!children || children.length === 0) && dataType !== jslet.data.DataType.ACTION && dataType !== jslet.data.DataType.EDITACTION) {
				arrFields.push(fldObj);
			}
			return false; //Identify if cancel traveling or not
		});
		this._normalFields = arrFields;
		this.calcFocusedFields();
	},
	
	/**
	 * Add some field objects.
	 * 
	 * @param {jslet.data.Field[]} fldObjs Field objects.
	 * 
	 * @return {this}
	 */
	addFields: function(arrFldObj) {
		jslet.Checker.test('Dataset.addFields#arrFldObj', arrFldObj).required().isArray();
		var Z = this,
			len = arrFldObj.length;
		if(len === 0) {
			return Z;
		}
		for(var i = 0; i < len; i++) {
			Z.addField(arrFldObj[i], true);
		}
		Z.refreshDisplayOrder();
		Z.refreshAggregatedFields();
		return this;
	},
	
	/**
	* Add an exist field object. If creating a new field, use "createField" instead.
	* 
	*     @example
	*     dsObj.addField(fldObj);
	* 
	* @param {jslet.data.Field} fldObj Field object.
	* 
	* @return {this}
	*/
	addField: function (fldObj, batchMode) {
		jslet.Checker.test('Dataset.addField#fldObj', fldObj).required().isClass(jslet.data.Field.className);
		var Z = this,
			fldName = fldObj.name();
		if(Z.getField(fldName)) {
			Z.removeField(fldName);
		}
		fldObj.dataset(Z);
		Z._fields.push(fldObj);
		var dispOrder = fldObj.displayOrder(); 
		if (!dispOrder && dispOrder !== 0) {
			fldObj.displayOrder(Z._fields.length);
		}
		var dataType = fldObj.dataType();
		if (dataType == jslet.data.DataType.DATASET) {
			if (!Z._detailDatasetFields) {
				Z._detailDatasetFields = [];
			}
			Z._detailDatasetFields.push(fldObj);
		}
		if (dataType == jslet.data.DataType.PROXY) {
			if (!Z._proxyFields) {
				Z._proxyFields = [];
			}
			Z._proxyFields.push(fldObj);
		}
		
		function addFormulaField(fldName, fldObj) {
			var children = fldObj.children();
			if(!children || children.length === 0) {
				Z._fieldsMap[fldName] = fldObj;
				Z.addInnerFormulaField(fldName, fldObj.formula());
				return;
			}
			var childFldObj;
			for(var i = 0, len = children.length; i < len; i++) {
				childFldObj = children[i]; 
				addFormulaField(childFldObj.name, childFldObj);
			}
		}
		
		addFormulaField(fldName, fldObj);
		
		if(!batchMode) {
			Z.refreshDisplayOrder();
			Z.refreshAggregatedFields();
		}
		return this;
	},
	
	/**
	 * Add specified fields of source dataset into this dataset.
	 * 
	 *     @example
	 *     var srcDsObj = jslet.data.getDataset('srcDataset');
	 *     dsObj.addFieldFromDataset(srcDsObj, ['fld1', 'fld2']);
	 * 
	 * @param {jslet.data.Dataset} srcDataset Source dataset where fields are added from.
	 * @param {String[]} fieldNames A list of field names which are copied to this dataset.
	 * 
	 * @return {this}
	 */
	addFieldFromDataset: function(srcDataset, fieldNames) {
		jslet.Checker.test('Dataset.addFieldFromDataset#srcDataset', srcDataset).required().isClass(jslet.data.Dataset.className);
		jslet.Checker.test('Dataset.addFieldFromDataset#fieldNames', fieldNames).isArray();
		var Z = this,
			fldObj, fldName, 
			srcFields = srcDataset.getFields();
		for(var i = 0, cnt = srcFields.length; i < cnt; i++) {
			fldObj = srcFields[i];
			fldName = fldObj.name();
			if (fieldNames) {
				if (fieldNames.indexOf(fldName) < 0) {
					continue;
				}
			}
			this.addField(fldObj.clone(fldName, this), true);
		}
		Z.refreshDisplayOrder();
		Z.refreshAggregatedFields();
		return this;
	},
	
	refreshDisplayOrder: function() {
		this._fields.sort(jslet.data.displayOrderComparator);
		this._cacheNormalFields();
		return this;
	},
	
	moveField: function(fromFldName, toFldName) {
		var Z = this,
			fromFldObj = Z.getField(fromFldName),
			toFldObj = Z.getField(toFldName),
			fromParent = fromFldObj.parent(),
			toParent = toFldObj.parent();
		if(!fromFldObj || !toFldObj || fromParent != toParent) {
			return this;
		}
		var fields;
		if(fromParent) {
			fields = fromParent.children();
		} else {
			fields = Z._fields;
		}
		var fldObj, fldName, i,
			fromOrder = fromFldObj.displayOrder(),
			toOrder = toFldObj.displayOrder(),
			fromIndex = fields.indexOf(fromFldObj),
			toIndex = fields.indexOf(toFldObj),
			oldDesignMode = Z.designMode();
		Z.designMode(false);
		try {
			fromFldObj.displayOrder(toFldObj.displayOrder());
			if(fromIndex < toIndex) {
				for(i = fromIndex + 1; i <= toIndex; i++) {
					fldObj = fields[i];
					fldObj.displayOrder(fldObj.displayOrder() - 1);
				}
			} else {
				for(i = toIndex; i < fromIndex; i++) {
					fldObj = fields[i];
					fldObj.displayOrder(fldObj.displayOrder() + 1);
				}
			}
		} finally {
			Z.designMode(oldDesignMode);
		}
		Z.refreshDisplayOrder();
		if(Z.designMode() && Z.isFireGlobalEvent()) {
			var handler = jslet.data.globalDataHandler.fieldMetaChanged();
			if(handler) {
				handler.call(this, Z, null, 'displayOrder');
			}
		}
		return this;
	},
	
	/**
	 * Remove field by field name.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return {this}
	 */
	removeField: function (fldName) {
		function removeFormulaField(fldName, fldObj) {
			var children = fldObj.children();
			if(!children || children.length === 0) {
				delete Z._fieldsMap[fldName];
				Z.removeInnerFormulaField(fldName);
				return this;
			}
			var childFldObj;
			for(var i = 0, len = children.length; i < len; i++) {
				childFldObj = children[i];
				removeFormulaField(childFldObj.name(), childFldObj);
			}
		}

		jslet.Checker.test('Dataset.removeField#fldName', fldName).required().isString();
		fldName = jslet.trim(fldName);
		var Z = this,
			fldObj = Z.getField(fldName);
		if (fldObj) {
			if (fldObj.dataType() == jslet.data.DataType.DATASET) {
				var k = Z._detailDatasetFields.indexOf(fldObj);
				if (k >= 0) {
					Z._detailDatasetFields.splice(k, 1);
				}
			}
			var i = Z._fields.indexOf(fldObj);
			if(i >= 0) {
				Z._fields.splice(i, 1);
			}
			fldObj.dataset(null);
			Z._cacheNormalFields();
			jslet.data.FieldValueCache.clearAll(Z, fldName);

			removeFormulaField(fldName, fldObj);
			Z.refreshAggregatedFields();
		}
		var parentFldObj = fldObj.parent();
		if(parentFldObj) {
			var children = parentFldObj.children();
			var k = children.indexOf(fldObj);
			children.splice(k, 1);
		}
		return this;
	},

	/**
	 * Clear all fields.
	 */
	clearFields: function(fields) {
		if (!fields) {
			fields = this._fields;
		}
		var start = fields.length - 1;
		for(var i = start; i >= 0; i--) {
			var fldObj = fields[i];
			var children = fldObj.children();
			if(children && children.length > 0) {
				this.clearFields(children);
			}
			this.removeField(fldObj.name());
		}
		return this;
	},
	
	refreshAggregatedFields: function() {
		var Z = this;
		Z._aggregatedFields = null;
		var fields = Z.getNormalFields(), 
			fldObj, aggregatedFields = [];
		for(var i = 0, len = fields.length; i< len; i++) {
			fldObj = fields[i];
			if(fldObj.aggregated()) {
				aggregatedFields.push(fldObj);
			}
		}
		if(aggregatedFields.length > 0) {
			Z._aggregatedFields = aggregatedFields;
		}
		return this;
	},
	
	/**
	 * Get field object by name.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return jslet.data.Field
	 */
	getField: function (fldName) {
		jslet.Checker.test('Dataset.getField#fldName', fldName).isString().required();
		fldName = jslet.trim(fldName);

		var arrField = fldName.split('.'), fldName1 = arrField[0], foundInMap = true;
		var fldObj = this._fieldsMap[fldName1];
		if(!fldObj) {
			foundInMap = false;
			this._travelField(this._fields, function(fldObj1) {
				var cancelTravel = false;
				if (fldObj1.name() == fldName1) {
					fldObj = fldObj1;
					cancelTravel = true;
				}
				return cancelTravel; //Identify if cancel traveling or not
			});
		}
		if (!fldObj) {
			return null;
		}
		if(!foundInMap) {
			this._fieldsMap[fldName1] = fldObj;
		}
		if (arrField.length == 1) {
			return fldObj;
		}
		else {
			arrField.splice(0, 1);
			var lkf = fldObj.lookup();//Lookup dataset
			if (lkf) {
				var lkds = lkf.dataset();
				if (lkds) {
					return lkds.getField(arrField.join('.'));
				}
			} else {
				var dsDetail = fldObj.detailDataset(); //Detail dataset
				if(dsDetail) {
					return dsDetail.getField(arrField.join('.'));
				}
			}
		}
		return null;
	},

	/**
	 * Get top field object by name.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return jslet.data.Field
	 */
	getTopField: function (fldName) {
		jslet.Checker.test('Dataset.getField#fldName', fldName).isString().required();
		fldName = jslet.trim(fldName);
		
		var fldObj = this.getField(fldName);
		if (fldObj) {
			while(true) {
				if (fldObj.parent() === null) {
					return fldObj;
				}
				fldObj = fldObj.parent();
			}
		}
		return null;
	},
	
	/**
	 * @private
	 * Sort function.
	 * 
	 * @param {Object} rec1: dataset record.
	 * @param {Object} rec2: dataset record.
	 */
	sortFunc: function (rec1, rec2) {
		var dsObj = jslet.temp.sortDataset;
		
		var indexFlds = dsObj._sortingFields,
			strFields = [],
			fname, idxFldCfg, i, cnt;
		for (i = 0, cnt = indexFlds.length; i < cnt; i++) {
			idxFldCfg = indexFlds[i];
			fname = idxFldCfg.fieldName;
			if(idxFldCfg.useTextToSort || dsObj.getField(fname).getType() === jslet.data.DataType.STRING) {
				strFields.push(fname);
			}
		}
		var  v1, v2, flag = 1;
		for (i = 0, cnt = indexFlds.length; i < cnt; i++) {
			idxFldCfg = indexFlds[i];
			fname = idxFldCfg.fieldName;
			if(idxFldCfg.useTextToSort) {
				v1 = dsObj.getFieldTextByRecord(rec1, fname);
				v2 = dsObj.getFieldTextByRecord(rec2, fname);
			} else {
				v1 = dsObj.getFieldValueByRecord(rec1, fname);
				v2 = dsObj.getFieldValueByRecord(rec2, fname);
			}
			if (v1 == v2) {
				continue;
			}
			if (v1 !== null && v2 !== null) {
				if(strFields.indexOf(fname) >= 0) {
					v1 = v1.toLowerCase();
					v2 = v2.toLowerCase();
					flag = (v1.localeCompare(v2) < 0? -1: 1);
				} else {
					flag = (v1 < v2 ? -1: 1);
				}
			} else if (v1 === null && v2 !== null) {
				flag = -1;
			} else {
				if (v1 !== null && v2 === null) {
					flag = 1;
				}
			}
			return flag * idxFldCfg.order;
		} //end for
		return 0;
	},
	
	/**
	 * @property
	 * 
	 * Set or get fixed index fields, field names separated by comma(','). <br />
	 * If this property is set, data records will be ordered by properties: fixedIndexFields and indexFields. <br />
	 * Diffence of fixedIndexFields and indexFields: indexFields can changed by UI control dynamically(like clicking the column head of {@link jslet.ui.DBTable}), and fixedIndexFields won't.<br />
	 * Example:
	 * 
	 *     @example
	 *     dsObj.fixedIndexFields('fld2,fld3'); //Set property, return this.
	 *     var propValue = dsObj.fixedIndexFields(); //Get property value.
	 * 
	 * @param {String | undefined} fixedIndexFields Fixed index field name.
	 * 
	 * @return {this | String}
	 */
	fixedIndexFields: function (fixedIndexFields) {
		var Z = this;
		if (fixedIndexFields === undefined) {
			return Z._fixedIndexFields;
		}
		
		jslet.Checker.test('Dataset.fixedIndexFields', fixedIndexFields).isString();
		
		Z._fixedIndexFields = fixedIndexFields? jslet.trim(fixedIndexFields): null;
		Z._innerFixedIndexFields = fixedIndexFields? Z._parseIndexFields(fixedIndexFields): [];
		var idxFld, fixedIdxFld;
		for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerIndexFields[i];
			for(var j = 0, len = Z._innerFixedIndexFields.length; j < len; j++) {
				fixedIdxFld = Z._innerFixedIndexFields[j];
				if(idxFld.fieldName === fixedIdxFld.fieldName) {
					Z._innerIndexFields.splice(i, 1);
				}
			}
		}
		
		Z._sortByFields();
		return Z;
	},
	
	/**
	 * @property
	 * 
	 * Set or get index fields, field names separated by comma(','). <br />
	 * If this property is set, data records will be ordered by properties: fixedIndexFields and indexFields. <br />
	 * Diffence of fixedIndexFields and indexFields: indexFields can changed by UI control dynamically(like clicking the column head of {@link jslet.ui.DBTable}), and fixedIndexFields won't.<br />
	 * Example:
	 * 
	 *     @example
	 *     dsObj.indexFields('fld2,fld3'); //Set property, return this.
	 *     var propValue = dsObj.indexFields(); //Get property value.
	 * 
	 * @param {String | undefined} indexFields Index field name.
	 * 
	 * @return {this | String}
	 */
	indexFields: function (indFlds) {
		var Z = this;
		if (indFlds === undefined) {
			return Z._indexFields;
		}
		
		jslet.Checker.test('Dataset.indexFields', indFlds).isString();
		indFlds = indFlds? jslet.trim(indFlds): null;
		if(!indFlds && !Z._indexFields && !Z._fixedIndexFields) {
			return this;
		}

		Z._indexFields = indFlds;
		Z._innerIndexFields = indFlds? Z._parseIndexFields(indFlds): [];
		var idxFld, fixedIdxFld;
		for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerIndexFields[i];
			for(var j = 0, len = Z._innerFixedIndexFields.length; j < len; j++) {
				fixedIdxFld = Z._innerFixedIndexFields[j];
				if(idxFld.fieldName === fixedIdxFld.fieldName) {
					fixedIdxFld.order = idxFld.order;
					Z._innerIndexFields.splice(i, 1);
				}
			}
		}
		Z._sortByFields();
		return Z;
	},

	mergedIndexFields: function() {
		var Z = this, i, len,
			result = [];
		for(i = 0, len = Z._innerFixedIndexFields.length; i < len; i++) {
			result.push(Z._innerFixedIndexFields[i]);
		}
		for(i = 0, len = Z._innerIndexFields.length; i < len; i++) {
			result.push(Z._innerIndexFields[i]);
		}
		return result;
	},
	
	toggleIndexField: function(fldName, emptyIndexFields) {
		var Z = this,
			idxFld, i, 
			found = false;
		//Check fixed index fields
		for(i = Z._innerFixedIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerFixedIndexFields[i];
			if(idxFld.fieldName === fldName) {
				idxFld.order = (idxFld.order === 1 ? -1: 1);
				found = true;
				break;
			}
		}
		if(found) {
			if(emptyIndexFields) {
				Z._innerIndexFields = [];
			}
			Z._sortByFields();
			return;
		}
		//Check index fields
		found = false;
		for(i = Z._innerIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerIndexFields[i];
			if(idxFld.fieldName === fldName) {
				idxFld.order = (idxFld.order === 1 ? -1: 1);
				found = true;
				break;
			}
		}
		if(found) {
			if(emptyIndexFields) {
				Z._innerIndexFields = [];
				Z._innerIndexFields.push(idxFld);
			}
		} else {
			if(emptyIndexFields) {
				Z._innerIndexFields = [];
			}
			idxFld = {fieldName: fldName, order: 1};
			Z._innerIndexFields.push(idxFld);
		}
		Z._sortByFields();
	},
	
	_parseIndexFields: function(indexFields) {
		var arrFields = indexFields.split(','), 
			fname, fldObj, arrFName, indexNameObj, 
			order = 1;//asce
		var result = [];
		for (var i = 0, cnt = arrFields.length; i < cnt; i++) {
			fname = jslet.trim(arrFields[i]);
			arrFName = fname.split(' ');
			if (arrFName.length == 1) {
				order = 1;
			} else if (arrFName[1].toLowerCase() == 'asce') {
				order = 1; //asce
			} else {
				order = -1; //desc
			}
			result.push({fieldName: arrFName[0], order: order});
		} //end for
		return result;
	},
	
	_sortByFields: function() {
		var Z = this;
		if (!Z.hasRecord()) {
			return;
		}
		Z.selection.removeAll();

		Z._sortingFields = [];
		var idxFld, i, cnt;
		for (i = 0, cnt = Z._innerFixedIndexFields.length; i < cnt; i++) {
			idxFld = Z._innerFixedIndexFields[i];
			Z._createIndexCfg(idxFld.fieldName, idxFld.order);
		} //end for
		for (i = 0, cnt = Z._innerIndexFields.length; i < cnt; i++) {
			idxFld = Z._innerIndexFields[i];
			Z._createIndexCfg(idxFld.fieldName, idxFld.order);
		} //end for

		if(Z._sortingFields.length === 0) {
			return;
		}
		var currRec = Z.getRecord(), 
			flag = Z.isContextRuleEnabled();
		if (flag) {
			Z.disableContextRule();
		}
		Z.disableControls();
		jslet.temp.sortDataset = Z;
		try {
			Z.records().sort(Z.sortFunc);
			Z._refreshInnerRecno();
		} finally {
			jslet.temp.sortDataset = null;
			Z.moveToRecord(currRec);
			if (flag) {
				Z.enableContextRule();
			}
			Z.enableControls();
		}		
	},
	
	/**
	 * @private
	 */
	_createIndexCfg: function(fname, order) {
		var Z = this,
			fldObj = fname;
		if(jslet.isString(fname)) {
			fldObj = Z.getField(fname);
		}
		if (!fldObj) {
			return;
		}
		if(fldObj.dataset() !== Z) {
			Z._combineIndexCfg(fname, order);
			return;
		}
		var children = fldObj.children();
		if (!children || children.length === 0) {
			var useTextToSort = true;
			if(fldObj.getType() === 'N' && !fldObj.lookup()) {
				useTextToSort = false;
			}
			Z._combineIndexCfg(fldObj.name(), order, useTextToSort);
		} else {
			for(var k = 0, childCnt = children.length; k < childCnt; k++) {
				Z._createIndexCfg(children[k], order);
			}
		}		
	},
	
	/**
	 * @private
	 */
	_combineIndexCfg: function(fldName, order, useTextToSort) {
		for(var i = 0, len = this._sortingFields.length; i < len; i++) {
			if (this._sortingFields[i].fieldName == fldName) {
				this._sortingFields.splice(i,1);//remove duplicated field
			}
		}
		var indexNameObj = {
				fieldName: fldName,
				order: order,
				useTextToSort: useTextToSort
			};
		this._sortingFields.push(indexNameObj);
	},
	
	_getWholeFilter: function() {
		var Z = this, 
			result = Z._fixedFilter;
		if(result) {
			if(Z._filter) {
				return '(' + result + ') && (' + Z._filter + ')';
			}
		} else {
			result = Z._filter;
		}
		return result;
	},
	
	/**
	 * @property
	 * 
	 * Set or get dataset fixed filter expression.<br />
	 * If this property is set, data records will be filtered by properties: fixedFilter and Filter. <br />
	 * Diffence of fixedFilter and filter: filter can changed by UI control dynamically(like {@link jslet.ui.DBAutoComplete}, {@link jslet.ui.DBTable}), and fixedFilter won't.
	 * Example:
	 * 
	 *     @example
	 *     dsObj.fixedFilter('[age] > 20'); //Set property, return this.
	 *     var propValue = dsObj.fixedFilter(); //Get property value.
	 * 
	 * @param {String | undefined} fixedFilter Fixed filter expression.
	 * 
	 * @return {this | String}
	 */
	fixedFilter: function (fixedFilter) {
		var Z = this;
		if (fixedFilter === undefined) {
			return Z._fixedFilter;
		}
		
		jslet.Checker.test('dataset.fixedFilter', fixedFilter).isString();
		if(fixedFilter) {
			fixedFilter = jslet.trim(fixedFilter);
		}
		var oldFilter = Z._getWholeFilter();
		Z._fixedFilter = fixedFilter;
		var newFilter = Z._getWholeFilter();
		
		if (!newFilter) {
			Z._innerFilter = null;
			Z._filtered = false;
			Z._filteredRecnoArray = null;
		} else {
			if(oldFilter == newFilter) {
				return this;
			} else {
				Z._innerFilter = new jslet.data.Expression(Z, newFilter);
			}
		}
		if(Z._filtered) {
			Z._doFilterChanged();
		}
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get dataset filter expression.<br />
	 * If this property is set, data records will be filtered by properties: fixedFilter and Filter. <br />
	 * Diffence of fixedFilter and filter: filter can changed by UI control dynamically(like {@link jslet.ui.DBAutoComplete}, {@link jslet.ui.DBTable}), and fixedFilter won't.
	 * Example:
	 * 
	 *     @example
	 *     dsObj.filter('[age] > 20'); //Set property, return this.
	 *     dsObj.filter('[name] like "Bob%"');
	 *     var propValue = dsObj.filter(); //Get property value.
	 * 
	 * @param {String | undefined} filter Filter expression.
	 * 
	 * @return {this | String}
	 */
	filter: function (filterExpr) {
		var Z = this;
		if (filterExpr === undefined) {
			return Z._filter;
		}
		
		jslet.Checker.test('dataset.filter#filterExpr', filterExpr).isString();
		if(filterExpr) {
			filterExpr = jslet.trim(filterExpr);
		}

		var oldFilter = Z._getWholeFilter();
		Z._filter = filterExpr;
		var newFilter = Z._getWholeFilter();
		
		if (!newFilter) {
			Z._innerFilter = null;
			var oldFiltered = Z._filtered;
			Z._filtered = false;
			Z._filteredRecnoArray = null;
			if(oldFiltered) {
				Z._doFilterChanged();
			}
		} else {
			if(oldFilter == newFilter) {
				return this;
			} else {
				Z._innerFilter = new jslet.data.Expression(Z, newFilter);
			}
			if(Z._filtered) {
				Z._doFilterChanged();
			}
		}
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get filtered flag. Only 'filtered' is true, 'filter' and 'fixedFilter' would work.<br />
	 * Example:
	 * 
	 *     @example
	 *     dsObj.filter('[age] > 20 && [name] like "Bob%"');
	 *     dsObj.filtered(true); // Set property, return this.
	 *     var propValue = dsObj.filtered(); // Get property value.
	 * 
	 * @param {Boolean | undefined} filtered Filter flag.
	 * 
	 * @return {this | Boolean}
	 */
	filtered: function (afiltered) {
		var Z = this;
		if (afiltered === undefined) {
			return Z._filtered;
		}
		
		var oldFilter = Z._getWholeFilter(), 
			oldFiltered = Z._filtered;
		if (afiltered && !oldFilter) {
			Z._filtered = false;
		} else {
			Z._filtered = afiltered ? true: false;
		}

		if(oldFiltered == Z._filtered) {
			return this;
		}
		this._doFilterChanged();
		return this;
	},
	
	_doFilterChanged: function() {
		var Z = this;
		Z.selection.removeAll();
		var flag = Z.isContextRuleEnabled();
		if (flag) {
			Z.disableContextRule();
		}
		Z.disableControls();
		try {
			if (!Z._filtered) {
				Z._filteredRecnoArray = null;
			} else {
				Z._refreshInnerRecno();
			}
		} finally {
			if(flag) {
				Z.enableContextRule();
			}
			Z.enableControls();
		}
		Z.first();
		Z._calcAggregatedValueDebounce.call(Z);		
		Z.refreshLookupHostDataset();

		return this;
	},
	
	/**
	 * @private, filter data
	 */
	_filterData: function () {
		var Z = this,
		 	filter = Z._getWholeFilter();
		if (!Z._filtered || !filter || 
				Z._status == jslet.data.DataSetStatus.INSERT || 
				Z._status == jslet.data.DataSetStatus.UPDATE) {
			return true;
		}
		var result = Z._innerFilter.eval();
		return result;
	},

	/**
	 * @private
	 */
	_refreshInnerRecno: function () {
		var Z = this;
		if (!Z.hasData()) {
			Z._filteredRecnoArray = null;
			return;
		}
		Z._filteredRecnoArray = null;
		if(!Z._filtered) {
			return;
		}
		var tempRecno = [];
		var oldRecno = Z._recno;
		try {
			for (var i = 0, cnt = Z.records().length; i < cnt; i++) {
				Z._recno = i;
				if (Z._filterData()) {
					tempRecno.push(i);
				}
			}
		}
		finally {
			Z._recno = oldRecno;
		}
		Z._filteredRecnoArray = tempRecno;
	},

	_innerAfterScrollDebounce: function() {
		var Z = this,
			eventFunc = jslet.getFunction(Z._datasetListener);
		if(eventFunc) {
			eventFunc.call(Z, jslet.data.DatasetEvent.AFTERSCROLL);
		}
	},
	
	/**
	 * @private
	 */
	_fireDatasetEvent: function (evtType) {
		var Z = this;
		if (Z._silence || Z._igoreEvent) {
			return;
		}
		if(Z._datasetListener) {
			if(evtType == jslet.data.DatasetEvent.AFTERSCROLL) {
				Z._afterScrollDebounce.call(Z);
			} else {
				var eventFunc = jslet.getFunction(Z._datasetListener);
				if(eventFunc) {
					eventFunc.call(Z, evtType);
				}
			}
		}
		
		var dsHandlers = Z._datasetEventHandler;
		if(dsHandlers) {
			var evtHandlers = dsHandlers[evtType];
			if(evtHandlers) {
				for(var i = 0, len = evtHandlers.length; i < len; i++) {
					var eventFunc = jslet.getFunction(evtHandlers[i]);
					if(eventFunc) {
						eventFunc.call(Z);
					}
				}
			}
		}

	},

	/**
	 * @property
	 * 
	 * Get record count.
	 * 
	 * @return {Integer}
	 */
	recordCount: function () {
		var records = this.records();
		if (records) {
			if (!this._filteredRecnoArray) {
				return records.length;
			} else {
				return this._filteredRecnoArray.length;
			}
		}
		return 0;
	},

	/**
	 * Check whether dataset exists records.
	 * It checks on datase filter. 
	 * 
	 *     @example
	 *     //dsObj has 2 records first.
	 *     dsObj.hasRecord(); //return true
	 *     dsObj.filter('false'); //Filter out all records.
	 *     dsObj.filtered(true);
	 *     dsObj.hasRecord(); //return false
	 *     
	 * @return {Boolean}
	 */
	hasRecord: function () {
		return this.recordCount() > 0;
	},
	
	/**
	 * Check whether dataset exists records.
	 * It checks no matter whether dataset has filter or not. 
	 * 
	 *     @example
	 *     //dsObj has 2 records first.
	 *     dsObj.hasData(); //return true
	 *     dsObj.filter('false'); //Filter out all records.
	 *     dsObj.filtered(true);
	 *     dsObj.hasData(); //still return true
	 *     
	 * @return {Boolean}
	 */
	hasData: function() {
		var records = this.records();
		return records && records.length > 0;
	},
	
	/**
	 * @property
	 * 
	 * Set or get record number, record number starts with 0.<br />
	 * Record number is relative to many data manuplating. Example:
	 * 
	 *     @example
	 *     var oldRecno = dsObj.recno();
	 *     dsObj.recno(2);
	 *     try {
	 *       dsObj.setFieldValue('fld1', 'test');
	 *     } finally {
	 *       dsObj.recno(oldRecno);
	 *     }
	 * 
	 * @param {Integer | undefined} recno Record number.
	 * @return {this | Integer}
	 */
	recno: function (recno) {
		var Z = this;
		if (recno === undefined) {
			if(Z.recordCount() > 0) {
				return Z._recno;
			} else {
				return -1;
			}
		}
		jslet.Checker.test('dataset.recno#recno', recno).isGTEZero();
		recno = parseInt(recno);
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return true;
		}
		
		if (recno == Z._recno) {
			return true;
		}
		Z.confirm();
		Z._gotoRecno(recno);
		Z._bof = Z._eof = false;
		return true;
	},
	
	/**
	 * @property
	 * 
	 * Set or get record number silently, it will not fire any event.
	 * 
	 * @param {Integer | undefined} recno Record number.
	 * @return {this | Integer}
	 */
	recnoSilence: function (recno) {
		var Z = this;
		if (recno === undefined) {
			if(Z.recordCount() > 0) {
				return Z._recno;
			} else {
				return -1;
			}
		}
		if(recno < 0) {
			recno = 0;
		}
		var last = Z.recordCount() - 1;
		if(recno > last) {
			recno = last;
		}
		Z._recno = recno > last? last: recno;
		return this;
	},

	/**
	 * @private
	 * Goto specified record number(Private)
	 * 
	 * @param {Integer}recno Record number.
	 */
	_gotoRecno: function (recno) {
		var Z = this,
			recCnt = Z.recordCount();
		if(recCnt === 0) {
			return false;
		}
		if (recno >= recCnt) {
			recno = recCnt - 1;
		} else if (recno < 0) {
			recno = 0;
		}
		
		if (Z._recno == recno) {
			return false;
		}
		var evt;
		if (!Z._silence) {
			Z._aborted = false;
			try {
				Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESCROLL);
				if (Z._aborted) {
					return false;
				}
			} finally {
				Z._aborted = false;
			}
			if (!Z._lockCount) {
				evt = jslet.data.RefreshEvent.beforeScrollEvent(Z._recno);
				Z.refreshControl(evt);
			}
		}

		var preno = Z._recno;
		Z._recno = recno;
		
		if (Z._recno != preno && Z._detailDatasetFields && Z._detailDatasetFields.length > 0) {
			var fldObj, dsDetail;
			for (var i = 0, len = Z._detailDatasetFields.length; i < len; i++) {
				fldObj = Z._detailDatasetFields[i];
				dsDetail = fldObj.detailDataset();
				if (dsDetail) {
					dsDetail._initialize(true);
				}
			} //end for
		} //end if
		Z._refreshProxyField(null, Z._silenc);
		if (Z._contextRuleEnabled) {
			this.calcContextRule();
		}
		if (!Z._silence) {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
			if (!Z._lockCount) {
				evt = jslet.data.RefreshEvent.scrollEvent(Z._recno, preno);
				Z.refreshControl(evt);
			}
		}
		return true;
	},

	/**
	 * Abort insert/update/delete action before insert/update/delete.
	 * It's usually used with event: {@link jslet.data.DatasetEvent}
	 */
	abort: function () {
		this._aborted = true;
		return this;
	},

	/**
	 * Get aborted status.
	 * 
	 * @return {Boolean}
	 */
	aborted: function() {
		return this._aborted;
	},
	
	/**
	 * @private
	 * 
	 * Move cursor back to startRecno(Private)
	 * 
	 * @param {Integer}startRecno - record number
	 */
	_moveCursor: function (recno) {
		var Z = this;
		Z.confirm();
		Z._gotoRecno(recno);
	},

	/**
	 * Move record cursor by record object.
	 * 
	 *     @example
	 *     var data = [{fld1: 'v1', fld2: 123}, {fld1: 'v2', fld2: 345}];
	 *     dsObj.records(data);
	 *     dsObj.moveToRecord(data[1]);
	 *     dsObj.recno(); //return 1
	 * 
	 * @param {Object} recordObj Record object.
	 * 
	 * @return {Boolean} True - Move successfully, false - otherwise. 
	 */
	moveToRecord: function (recordObj) {
		var Z = this;
		Z.confirm();
		if (!Z.hasRecord() || !recordObj) {
			return false;
		}
		jslet.Checker.test('dataset.moveToRecord#recordObj', recordObj).isObject();
		var k = Z.records().indexOf(recordObj);
		if (k < 0) {
			return false;
		}
		if (Z._filteredRecnoArray) {
			k = Z._filteredRecnoArray.indexOf(k);
			if (k < 0) {
				return false;
			}
		}
		Z._gotoRecno(k);
		return true;
	},

	/**
	 * @private
	 */
	startSilenceMove: function (notLogPos) {
		var Z = this;
		var context = {};
		if (!notLogPos) {
			context.recno = Z._recno;
		} else {
			context.recno = -999;
		}

		Z._silence++;
		return context;
	},

	/**
	 * @private
	 */
	endSilenceMove: function (context) {
		var Z = this;
		if (context && context.recno != -999 && context.recno != Z._recno) {
			Z._gotoRecno(context.recno);
		}
		Z._silence--;
	},

	/**
	 * @property
	 * 
	 * Check dataset cursor at the last record
	 * 
	 * @return {Boolean}
	 */
	isBof: function () {
		return this._bof;
	},

	/**
	 * @property
	 * 
	 * Check dataset cursor at the first record
	 * 
	 * @return {Boolean}
	 */
	isEof: function () {
		return this._eof;
	},

	/**
	 * Move cursor to first record
	 */
	first: function () {
		var Z = this;
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return;
		}
		Z._moveCursor(0);
		Z._bof = Z._eof = false;
		return this;
	},

	/**
	 * Move cursor to last record
	 */
	next: function () {
		var Z = this;
		var recCnt = Z.recordCount();
		if(recCnt === 0) {
			Z._bof = Z._eof = true;
			return;
		}
		if(Z._recno == recCnt - 1) {
			Z._bof = false;
			Z._eof = true;
			return;
		}
		Z._bof = Z._eof = false;
		Z._moveCursor(Z._recno + 1);
		return this;
	},

	/**
	 * Move cursor to prior record
	 */
	prior: function () {
		var Z = this;
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return;
		}
		if(Z._recno === 0) {
			Z._bof = true;
			Z._eof = false;
			return;
		}
		Z._bof = Z._eof = false;
		Z._moveCursor(Z._recno - 1);
		return this;
	},

	/**
	 * Move cursor to next record
	 */
	last: function () {
		var Z = this;
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return;
		}
		Z._bof = Z._eof = false;
		Z._moveCursor(Z.recordCount() - 1);
		Z._bof = Z._eof = false;
		return this;
	},

	/**
	 * Move cursor to the first record which exists invalid data.
	 * 
	 * @return {Boolean} If move successfully, return true, otherwise false.
	 */
	firstError: function() {
		return this._moveToError(0);
	},
	
	/**
	 * Move cursor to the next record which exists invalid data.
	 * 
	 * @return {Boolean} If move successfully, return true, otherwise false.
	 */
	nextError: function() {
		return this._moveToError(this.recno() + 1);
	},
	
	/**
	 * Move cursor to the prior record which exists invalid data.
	 * 
	 * @return {Boolean} If move successfully, return true, otherwise false.
	 */
	priorError: function() {
		return this._moveToError(this.recno() - 1, true);
	},
	
	/**
	 * Move cursor to the last record which exists invalid data.
	 * 
	 * @return {Boolean} If move successfully, return true, otherwise false.
	 */
	lastError: function() {
		return this._moveToError(this.recordCount() - 1, true);
	},
	
	_moveToError: function(startRecno, reverse) {
		var Z = this, i,
			recCnt = Z.recordCount() - 1;
		if(recCnt < 0) {
			return false;
		}
		if(!reverse) {
			if(startRecno < 0) {
				startRecno = 0;
			}
			for(i = startRecno; i <= recCnt; i++) {
				if(Z.existRecordError(i)) {
					Z._moveCursor(i);
					return true;
				}
			}
		} else {
			if(startRecno > recCnt) {
				startRecno = recCnt;
			}
			for(i = startRecno; i >= 0; i--) {
				if(Z.existRecordError(i)) {
					Z._moveCursor(i);
					return true;
				}
			}
		}
		return false;
	},
	
	/**
	 * @private
	 * Check dataset status and cancel dataset 
	 */
	checkStatusByCancel: function () {
		if (this._status != jslet.data.DataSetStatus.BROWSE) {
			this.cancel();
		}
	},

	/**
	 * Insert child record by parentId, and move cursor to the newly record.
	 * 
	 *     @example
	 *     var parentId = dsObj.keyValue();
	 *     dsObj.insertChild(parentId);
	 *     dsObj.setFieldValue('fld1', 'test');
	 *     dsObj.confirm();
	 * 
	 * @param {Object} parentId (optional) Key value of parent record, it not apply, use current record key value instead.
	 *  
	 * @return {this}
	 */
	insertChild: function (parentId) {
		var Z = this;
		if (!Z._parentField || !Z.keyField()) {
			//Dataset properties: [parentField] and [keyField] not set, use insertRecord() instead!
			throw new Error(jsletlocale.Dataset.parentFieldNotSet);
		}

		if (!Z.hasRecord()) {
			Z.innerInsert();
			return this;
		}

		var context = Z.startSilenceMove(true);
		try {
			Z.expanded(true);
			if (parentId) {
				if (!Z.findByKey(parentId)) {
					return this;
				}
			} else {
				parentId = Z.keyValue();
			}

			var pfldname = Z.parentField(), 
				parentParentId = Z.getFieldValue(pfldname);
			while (true) {
				Z.next();
				if (Z.isEof()) {
					break;
				}
				if (parentParentId == Z.getFieldValue(pfldname)) {
					Z.prior();
					break;
				}
			}
		} finally {
			Z.endSilenceMove(context);
		}

		Z.innerInsert(function (newRec) {
			newRec[Z._parentField] = parentId;
		});
		return this;
	},

	/**
	 * Insert sibling record of current record, and move cursor to the newly record.
	 * 
	 *     @example
	 *     dsObj.insertSibling();
	 *     dsObj.setFieldValue('fld1', 'test');
	 *     dsObj.confirm();
	 *     
	 * @return {this}
	 */
	insertSibling: function () {
		var Z = this;
		if (!Z._parentField || !Z._keyField) {
			//Dataset properties: [parentField] and [keyField] not set, use insertRecord() instead!
			throw new Error(jsletlocale.Dataset.parentFieldNotSet);
		}

		if (!Z.hasRecord()) {
			Z.innerInsert();
			return this;
		}

		var parentId = Z.getFieldValue(Z.parentField()),
			context = Z.startSilenceMove(true),
			found = false,
			parentKeys = [],
			currPKey, 
			prePKey = Z.keyValue(),
			lastPKey = prePKey;
		try {
			Z.next();
			while (!Z.isEof()) {
				currPKey = Z.parentValue();
				if(currPKey == prePKey) {
					parentKeys.push(prePKey);
					lastPKey = prePKey;
				} else {
					if(lastPKey != currPKey) {
						if(parentKeys.indexOf(currPKey) < 0) {
							Z.prior();
							found = true;
							break;
						}
					}
				}
				prePKey = currPKey;
				Z.next();
			}
			if (!found) {
				Z.last();
			}
		} finally {
			Z.endSilenceMove(context);
		}

		Z.innerInsert(function (newRec) {
			newRec[Z._parentField] = parentId;
		});
		return this;
	},

	/**
	 * Insert record after current record, and move cursor to the newly record.
	 * 
	 *     @example
	 *     dsObj.insertRecord();
	 *     dsObj.setFieldValue('fld1', 'test');
	 *     dsObj.confirm();
	 * 
	 * @return {this}
	 */
	insertRecord: function () {
		this.innerInsert();
		return this;
	},

	/**
	 * Add record after last record, and move cursor to the newly record.
	 * 
	 *     @example
	 *     dsObj.appendRecord();
	 *     dsObj.setFieldValue('fld1', 'test');
	 *     dsObj.confirm();
	 * 
	 * @return {this}
	 */
	appendRecord: function () {
		var Z = this;

		Z._silence++;
		try {
			Z.last();
		} finally {
			Z._silence--;
		}
		Z.insertRecord();
		return this;
	},

	/**
	 * @private
	 */
	status: function(status) {
		if(status === undefined) {
			return this._status;
		}
		this._status = status;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the current record is expanded or not. Example:
	 * 
	 *     @example
	 *     dsObj.expanded(true); //Set property, return this.
	 *     var propValue = dsObj.expanded(); //Get property value.
	 * 
	 * @param {Boolean | undefined} expanded True - expanded, false - collapsed.
	 * 
	 * @return {this | Boolean}
	 */
	expanded: function(expanded) {
		return this.expandedByRecno(this.recno(), expanded);
	},
	
	/**
	 * @property
	 * 
	 * Set or get the specified record is expanded or not. Example:
	 * 
	 *     @example
	 *     var recno = dsObj.recno();
	 *     dsObj.expandedByRecno(recno, true); //Set property, return this.
	 *     var propValue = dsObj.expandedByRecno(recno); //Get property value.
	 * 
	 * @param {Integer | undefined} recno Record number.
	 * @param {this | Boolean} True - expanded, false - collapsed.
	 * 
	 * @return {this | Boolean}
	 */
	expandedByRecno: function(recno, expanded) {
		jslet.Checker.test('dataset.expandedByRecno', recno).required().isNumber();
		var record = this.getRecord(recno);
		var recInfo = jslet.data.getRecInfo(record);
		if(expanded === undefined) {
			var result = recInfo && recInfo.expanded;
			return result? true: false;
		}
		if(recInfo === null) {
			return this;
		}
		recInfo.expanded = expanded;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get the specified record is inserted or not. Example:
	 * 
	 *     @example
	 *     var recno = dsObj.recno();
	 *     dsObj.insertedByRecno(recno, true); //Set property, return this.
	 *     var propValue = dsObj.insertedByRecno(recno); //Get property value.
	 * 
	 * @param {Integer} recno Record number.
	 * @param {Boolean | undefined} inserted True - inserted, false - not changed.
	 * 
	 * @return {this | Boolean}
	 */
	insertedByRecno: function(recno, inserted) {
		if(inserted === undefined) {
			return this.changedStatusByRecno(recno) === jslet.data.DataSetStatus.INSERT;
		}
		var recObj = this.getRecord(recno);
		if(inserted) {
			this.changedStatusByRecno(recno, jslet.data.DataSetStatus.INSERT);
			this._changeLog.log(recObj);
		} else {
			this.changedStatusByRecno(recno, jslet.data.DataSetStatus.BROWSE);
			this._changeLog.unlog(recObj);
		}
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Get or set the specified record is updated or not. Example:
	 * 
	 *     @example
	 *     var recno = dsObj.recno();
	 *     dsObj.updatedByRecno(recno, true); //Set property, return this.
	 *     var propValue = dsObj.updatedByRecno(recno); //Get property value.
	 * 
	 * @param {Integer} recno Record number.
	 * @param {Boolean | undefined} updated True - updated, false - not changed.
	 * 
	 * @return {Boolean | this}
	 */
	updatedByRecno: function(recno, updated) {
		if(updated === undefined) {
			return this.changedStatusByRecno(recno) === jslet.data.DataSetStatus.UPDATE;
		}
		var recObj = this.getRecord(recno);
		if(updated) {
			this.changedStatusByRecno(recno, jslet.data.DataSetStatus.UPDATE);
			this._changeLog.log(recObj);
		} else {
			this.changedStatusByRecno(recno, jslet.data.DataSetStatus.BROWSE);
			this._changeLog.unlog(recObj);
		}
		return this;
	},
	
	/**
	 * @private
	 */
	changedStatus: function(status) {
		if(status === undefined) {
			return this.changedStatusByRecno(this._recno, status);
		}
		this.changedStatusByRecno(this._recno, status);
		return this;
	},
	
	/**
	 * @private
	 */
	changedStatusByRecno: function(recno, status) {
		var Z = this, record, recInfo;
		if(status === undefined) {
			record = Z.getRecord(recno);
			if(!record) {
				return null;
			}
			recInfo = jslet.data.getRecInfo(record);
			if(!recInfo) {
				return jslet.data.DataSetStatus.BROWSE;
			}
			return recInfo.status;
		}
		if(!Z._logChanges) {
			return;
		}
		record = Z.getRecord(recno);
		if(!record) {
			return null;
		}
		recInfo = jslet.data.getRecInfo(record);
		if(status === jslet.data.DataSetStatus.DELETE) {
			recInfo.status = status;
			return;
		}
		var	oldStatus = recInfo.status;
		if(oldStatus === jslet.data.DataSetStatus.INSERT) {
			return;
		}
		if(oldStatus != status) {
			recInfo.status = status;
			if (Z._contextRuleEnabled) {
				Z.calcContextRule();
			}
		}
	},
	
	/**
	 * @private
	 */
	innerInsert: function (beforeInsertFn) {
		var Z = this;
		Z.confirm();

		Z.selection.removeAll();
		var dsMaster = Z.masterDataset();
		if (dsMaster) {
			if (!dsMaster.hasRecord()) {
				dsMaster.appendRecord();
			} else {
				dsMaster.editRecord();
			}
		}

		Z._aborted = false;
		try {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREINSERT);
			if (Z._aborted) {
				return;
			}
		} finally {
			Z._aborted = false;
		}

		var records = Z.records();
		if (records === null) {
			records = [];
			if(Z._masterField) { //Detail dataset doesn't have its own records.
				Z.masterDataset().setFieldValue(Z._masterField, records);
			} else {
				Z._records = records;
			}
		}
		var preRecno = Z.recno(), k;
		if (Z.hasRecord()) {
			k = records.indexOf(this.getRecord()) + 1;
		} else {
			k = 0;
		}

		var newRecord = {};
		records.splice(k, 0, newRecord);

		if (Z._filteredRecnoArray && Z._filteredRecnoArray.length > 0) {
			for (var i = Z._filteredRecnoArray.length - 1; i >= 0; i--) {
				if (Z._filteredRecnoArray[i] < k) {
					Z._filteredRecnoArray.splice(i + 1, 0, k);
					Z._recno = k;
					break;
				}
				Z._filteredRecnoArray[i] += 1;
			}
		} else {
			if(Z._filteredRecnoArray) {
				Z._filteredRecnoArray[0] = k;
			}
			Z._recno = k;
		}
		
		Z.status(jslet.data.DataSetStatus.INSERT);
		Z.changedStatus(jslet.data.DataSetStatus.INSERT);
		Z._lockCount++;
		try {
			Z._calcDefaultValue();
			if (beforeInsertFn) {
				beforeInsertFn(newRecord);
			}
	
			//calc other fields' range to use context rule
			if (Z._contextRuleEnabled) {
				Z.calcContextRule();
			}
	
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERINSERT);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
		} finally {
			Z._lockCount--;
		}
		var evt = jslet.data.RefreshEvent.insertEvent(preRecno, Z.recno(), Z._recno < Z.recordCount() - 1);
		Z.refreshControl(evt);
	},

	/**
	 * Insert all records of source dataset into current dataset; <br />
	 * Source dataset's structure must be same as current dataset.
	 * 
	 * @param {jslet.data.Dataset} srcDataset Source dataset.
	 * 
	 * @return {this}
	 */
	insertDataset: function (srcDataset) {
		var Z = this,
			oldFiltered = Z.filtered(),
			thisContext = Z.startSilenceMove(true),
			srcContext = srcDataset.startSilenceMove(true), rec;
		try {
			Z.filtered(false);
			srcDataset.first();
			while (!srcDataset.isEof()) {
				Z.insertRecord();
				Z.cloneRecord(srcDataset.getRecord(), Z.getRecord());
				Z.confirm();
				srcDataset.next();
			}
		} finally {
			srcDataset.endSilenceMove(srcContext);
			Z.filtered(oldFiltered);
			Z.endSilenceMove(thisContext);
		}
		return this;
	},

	/**
	 * Append all records of source dataset into current dataset; <br />
	 * Source dataset's structure must be same as current dataset .
	 * 
	 * @param {jslet.data.Dataset} srcDataset Source dataset.
	 * 
	 * @return {this}
	 */
	appendDataset: function (srcDataset) {
		var Z = this;
		Z._silence++;
		try {
			Z.last();
		} finally {
			Z._silence--;
		}
		Z.insertDataset(srcDataset);
		return this;
	},

	/**
	 * Append records into dataset.
	 * 
	 * @param {Object[]} records An array of object which need to append to dataset.
	 * @param {Boolean} replaceExists True - replace the record if it exists, false - skip to append if it exists.
	 *  
	 * @return {this}
	 */
	batchAppendRecords: function(records, replaceExists) {
		jslet.Checker.test('dataset.records', records).required().isArray();
		var Z = this;
		Z.confirm();
		
		Z.selection.removeAll();
		Z.disableControls();
		try{
			var keyField = Z.keyField(), rec, found,
				keyValue;
			for(var i = 0, len = records.length; i < len; i++) {
				rec = records[i];
				found = false;
				if(keyField) {
					keyValue = rec[keyField];
					if(keyValue && Z.findByKey(keyValue)) {
						found = true;
					}
				}
				if(found) {
					if(replaceExists) {
						Z.editRecord();
						Z.cloneRecord(rec, Z.getRecord());
						Z.confirm();
					} else {
						continue;
					}
				} else {
					Z.appendRecord();
					Z.cloneRecord(rec, Z.getRecord());
					Z.confirm();
				}
			}
		} finally {
			Z.enableControls();
			Z.refreshControl(jslet.data.RefreshEvent._updateAllEvent);
			Z.refreshLookupHostDataset();
		}
		return this;
	},
	
	/**
	 * @private
	 * Calculate default value.
	 */
	_calcDefaultValue: function () {
		var Z = this, fldObj, expr, value, fldName;
		for (var i = 0, fldcnt = Z._normalFields.length; i < fldcnt; i++) {
			fldObj = Z._normalFields[i];
			fldName = fldObj.name();
			if (fldObj.getType() == jslet.data.DataType.DATASET) {
				continue;
			}
			
			if(Z._valueFollowEnabled && fldObj.valueFollow() && Z._followedValues) {
				var fValue = Z._followedValues[fldName];
				if(fValue !== null && fValue !== undefined) {
					fldObj.setValue(fValue);
					continue;
				}
			}
			value = fldObj.defaultValue();
			if (value === undefined || value === null || value === '') {
				expr = fldObj.defaultExpr();
				if (!expr) {
					continue;
				}
				value = window.eval(expr);
			} else {
				if(fldObj.getType() === jslet.data.DataType.NUMBER) {
					value = fldObj.scale() > 0 ? parseFloat(value): parseInt(value);
				}
			}
			var valueStyle = fldObj.valueStyle();
			if(value && jslet.isDate(value)) {
				value = new Date(value.getTime());
			}
			if(valueStyle == jslet.data.FieldValueStyle.BETWEEN) {
				if(value) {
					value = [value, value];
				} else {
					value = [null, null];
				}
			} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE) {
				value = [value];
			}
			Z.setFieldValue(fldName, value);		
		}
	},

	/**
	 * @private
	 * Calculate default value.
	 */
	checkAggregated: function(fldName) {
		var Z = this,
			aggrFields = Z._aggregatedFields;
		if(!aggrFields || aggrFields.length === 0) {
			return false;
		}
		if(!fldName) {
			return true;
		}
		var fldObj;
		for(var i = 0, len = aggrFields.length; i < len; i++) {
			if(aggrFields[i].name() === fldName) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * @private
	 * 
	 * Disable aggregate value. It's used for improving performance for batch operating, especially for huge data.
	 */
	disableAggregating: function() {
		this._aggregatingCount++;
		return this;
	},
	
	/**
	 * @private
	 * 
	 * Enable aggregate value.
	 */
	enableAggregating: function() {
		var Z = this;
		if(Z._aggregatingCount > 0) {
			Z._aggregatingCount--;
			if(Z._aggregatingCount === 0) {
				Z._calcAggregatedValueDebounce.call(Z);
			}
		}
		return this;
	},
	
	/**
	 * @private
	 * 
	 * Calculate aggregated value.
	 */
	calcAggregatedValue: function(fldName) {
		var Z = this;
		
		if(Z._aggregatingCount > 0 || !Z.checkAggregated(fldName)) {
			return;
		}
		var aggrFields = Z._aggregatedFields,
			fldObj, aggregatedBy,
			arrAggregateBy = {},
			aggregatedValues = null,
			notCalcFields = [],
			isNum, i, len;
		for(i = 0, len = aggrFields.length; i < len; i++) {
			fldObj = aggrFields[i];
			aggregatedBy = fldObj.aggregatedBy();
			isNum = fldObj.getType() === jslet.data.DataType.NUMBER;
			if((!isNum || isNum && fldObj.lookup()) && !aggregatedBy) {
				if(!aggregatedValues) {
					aggregatedValues = {};
				}
				fldName = fldObj.name();
				aggregatedValues[fldName] = {count: Z.recordCount(), sum: 0};
				notCalcFields.push(fldName);
			}
			if(aggregatedBy && !arrAggregateBy[aggregatedBy]) {
				arrAggregateBy[aggregatedBy] = {aggregatedBy: aggregatedBy, values: {}, exists: false};
			}
		}
		if(aggrFields.length === notCalcFields.length) {
			Z.aggregatedValues(aggregatedValues);			
			return;
		}
		if(!aggregatedValues) {
			aggregatedValues = {};
		}
		
		function getAggregateByValue(aggregatedBy) {
			if(aggregatedBy.indexOf(',') < 0) {
				return Z.getFieldValue(aggregatedBy);
			}
			var fieldNames = aggregatedBy.split(',');
			var values = [];
			for(var i = 0, len = fieldNames.length; i < len; i++) {
				values.push(Z.getFieldValue(fieldNames[i]));
			}
			return values.join(',');
		}
		
		function updateAggrByValues(arrAggregateBy) {
			var aggrByObj, 
				aggrByValue,
				arrAggrByValues;
			for(var name in arrAggregateBy) {
				aggrByObj = arrAggregateBy[name];
				arrAggrByValues = aggrByObj.values;
				aggrByValue = getAggregateByValue(aggrByObj.aggregatedBy);
				if(arrAggrByValues[aggrByValue] === undefined) {
					arrAggrByValues[aggrByValue] = null;
					aggrByObj.exists = false;
				} else {
					aggrByObj.exists = true;
				}
			}
		}
		
		function existAggrBy(arrAggregateBy, aggregatedBy) {
			var aggrByObj;
			for(var name in arrAggregateBy) {
				aggrByObj = arrAggregateBy[name];
				return aggrByObj.exists;
			}
			console.warn('Not found aggregatedBy value!');
			return false;
		}
		
		var oldRecno = Z.recnoSilence(),
			fldCnt = aggrFields.length, 
			value, totalValue,
			aggregatedValueObj;
		try {
			for(var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
				Z.recnoSilence(k);
				updateAggrByValues(arrAggregateBy);
				
				for(i = 0; i < fldCnt; i++) {
					fldObj = aggrFields[i];
					fldName = fldObj.name();
					if(notCalcFields.indexOf(fldName) >= 0) {
						continue;
					}
					aggregatedBy = fldObj.aggregatedBy();
					if(aggregatedBy && existAggrBy(arrAggregateBy, aggregatedBy)) {
						continue;
					}
					aggregatedValueObj = aggregatedValues[fldName];
					if(!aggregatedValueObj) {
						aggregatedValueObj = {count: 0, sum: 0};
						aggregatedValues[fldName] = aggregatedValueObj; 
					}
					aggregatedValueObj.count = aggregatedValueObj.count + 1;
					if(fldObj.getType() === jslet.data.DataType.NUMBER) {
						value = Z.getFieldValue(fldName) || 0;
						if(jslet.isString(value)) {
							//Invalid value: [{1}] for NUMBER field: [{0}]!
							throw new Error(jslet.formatMessage(jsletlocale.Dataset.invalidNumberFieldValue, [fldName, value]));
						}
						aggregatedValueObj.sum = aggregatedValueObj.sum + value;
					}
				} //end for i
			} //end for k
		} finally {
			Z.recnoSilence(oldRecno);
		}
		var scale;
		for(i = 0; i < fldCnt; i++) {
			fldObj = aggrFields[i];
			fldName = fldObj.name();
			scale = fldObj.scale() || 0;
			aggregatedValueObj = aggregatedValues[fldName];
			if(!aggregatedValueObj ) {
				aggregatedValueObj = {count: 0, sum: 0};
				aggregatedValues[fldName] = aggregatedValueObj;
			}
			var sumValue = aggregatedValueObj.sum;
			if(sumValue) {
				var pow = Math.pow(10, scale);
				sumValue = Math.round(sumValue * pow) / pow;
				aggregatedValueObj.sum = sumValue;
			}
		} //end for i
		Z.aggregatedValues(aggregatedValues);			
	},
	
	/**
	 * Get aggregated values. Example:
	 * 
	 *     @example
	 *     var aggregated = dsObj.aggregatedValues();
	 *     var fldName = 'fld1';
	 *     var fldAggregated = aggregated[fldName];
	 *     var sum = fldAggregated.sum;
	 *     var count = fldAggregated.count;
	 * 
	 * @return {Object[]} Aggregated values
	 */
	aggregatedValues: function(aggregatedValues) {
		var Z = this;
		if(aggregatedValues === undefined) {
			return Z._aggregatedValues;
		}
		Z._aggregatedValues = aggregatedValues;
		if(!Z._aggregatedValues && !aggregatedValues) {
			return;
		}

		var evt = jslet.data.RefreshEvent.aggregatedEvent();
		Z.refreshControl(evt);
		return this;
	},
	
	/**
	 * Get record object by record number.
	 * 
	 * @param {Integer} recno (optional) Record number, if not applied, get current record instead.
	 * 
	 * @return {Object} Dataset record.
	 */
	getRecord: function (recno) {
		var Z = this, k;
		if (recno === undefined || recno === null) {
			recno = Z._recno >= 0 ? Z._recno : 0;
		} else {
			if (recno < 0 || recno >= Z.recordCount()) {
				return null;
			}
		}
		if(!Z.hasData()) {
			return null;
		}
		var records = Z.records();
		//Used to convert field value for performance purpose. 
		if(Z._ignoreFilter) {
			return records[Z._ignoreFilterRecno || 0];
		}
		
		if (Z.recordCount() === 0) {
			return null;
		}
		
		if (Z._filteredRecnoArray) {
			k = Z._filteredRecnoArray[recno];
		} else {
			k = recno;
		}

		return records[k];
	},

	/**
	 * Set field values with a plan object.
	 *  
	 *     @example
	 *     var recObj = {fld1: 'test', fld2: 234};
	 *     dsObj.setRecord(recObj);
	 *     dsObj.confirm();
	 *     dsObj.getFieldValue('fld1'); //return 'test'
	 *     
	 * @param {Object} recObj A plan object which contains field values.
	 * @param {Integer} recno (optional) Record number.
	 * 
	 * @return {this}
	 */
	setRecord: function(recObj, recno) {
		if(!recObj) {
			return this;
		}
		var Z = this;
		Z.disableControls();
		try {
			if(recno) {
				Z.recno(recno);
			}
			for(var name in recObj) {
				if(name == '_jl_') {
					continue;
				}
				Z.setFieldValue(name, recObj[name]);
			}
		} finally {
			Z.enableControls();
		}
		return this;
	},
	
	/**
	 * @private
	 */
	getRelativeRecord: function (delta) {
		return this.getRecord(this._recno + delta);
	},

	/**
	 * @private
	 */
	isSameAsPrevious: function (fldName) {
		var Z = this,
			preRec = Z.getRelativeRecord(-1);
		if (!preRec) {
			return false;
		}
		var currRec = Z.getRecord(),
			preValue = Z.getFieldValueByRecord(preRec, fldName),
			currValue = Z.getFieldValueByRecord(currRec, fldName),
			isSame = false;
		
		if(!preValue && preValue !== 0 && preValue !== false && 
				!currValue && currValue !== 0 && currValue !== false) {
			isSame = false;
		} else if(preValue && currValue) {
			if(jslet.isDate(preValue)) { //Date time comparing
				isSame = (preValue.getTime() === currValue.getTime());
			} else {
				isSame = (preValue === currValue);
			}
		}
		if(!isSame) {
			return isSame;
		}
		var	fldObj = Z.getField(fldName),
			mergeSameBy = fldObj.mergeSameBy();
		if(mergeSameBy) {
			var arrFlds = mergeSameBy.split(','), groupFldName;
			for(var i = 0, len = arrFlds.length; i < len; i++) {
				groupFldName = jslet.trim(arrFlds[i]);
				if(preRec[groupFldName] != currRec[groupFldName]) {
					return false;
				}
			}
		}
		return isSame;
	},

	/**
	 * Check wheather the current record has parent record or not.
	 * 
	 * @return {Boolean} True - has parent record. 
	 */
	hasParent: function() {
		var Z = this,
			pFldName = Z.parentField();
		if(!pFldName || Z.recno() === 0) {
			return false;
		}
		var recno = Z.recno() - 1;
		for(var k = recno; k >= 0; k--) {
			var pKeyValue = Z.getFieldValue(pFldName),
				prevRec = this.getRelativeRecord(k - recno),
				keyValue = this.getFieldValueByRecord(prevRec, Z.keyField());
			
			if(jslet.compareValue(pKeyValue, keyValue) === 0) {
				return true;
			}
			var prePKeyValue = this.getFieldValueByRecord(prevRec, Z.parentField());
			if(jslet.compareValue(pKeyValue, prePKeyValue) !== 0) {
				return false;
			}
		}
		return false;
	},
	
	/**
	 * Check the current record has child records or not
	 * 
	 * @return {Boolean} True - has child records.
	 */
	hasChildren: function () {
		var Z = this;
		if (!Z._parentField) {
			return false;
		}
		if(Z._recno < Z.recordCount() - 1) {
			if (Z.parentValue(Z._recno + 1) === Z.keyValue()) {
				return true;
			}
		}
		return false;
	},
	
	/** 
	* Iterate the child records of current record, and run the specified callback function. Example: 
	* 
	*     @example
	*     dataset.iterateChildren(function(isDirectChild){
	* 	    var fldValue = this.getFieldValue('xxx');
	* 	    this.setFieldValue('xxx', fldValue);
	*     }); 
	* 
	* @param {Function} callBackFn Callback function.
	* @param {Boolean} callBackFn.isDirectChild True - is direct child, false - otherwise.
	* @param {Boolean} callBackFn.return Identify continue iterating or not, true - break iterating, false -continue iterating.
	* 
	* @return {this}
	*/ 
	iterateChildren: function(callBackFn) {
		var Z = this;
		if (!Z._parentField) {
			return this;
		}
		var context = Z.startSilenceMove(),
			preKeyValue = Z.keyValue(),
			rootValue = preKeyValue,
			arrPValues = [];
		try {
			Z.next();
			var keyValue, pValue, isExist;
			while (!Z.isEof()) {
				pValue = Z.parentValue();
				isExist = (arrPValues.indexOf(pValue) >= 0);
				if(jslet.compareValue(pValue, preKeyValue) === 0 && !isExist) {
					arrPValues.push(preKeyValue);
					isExist = true;
				}
				if (!isExist) {
					return this;
				}
				if(callBackFn) {
					var breakIterator = callBackFn.call(Z, jslet.compareValue(pValue, rootValue) === 0);
					if(breakIterator) {
						break;
					}
				}
				preKeyValue = Z.keyValue();
				Z.next();
			}
		} finally {
			Z.endSilenceMove(context);
		}
		return this;
	},
	
	/**
	 * Update record and send dataset to update status. <br />
	 * You can use cancel() or confirm() method to return browse status.
	 * 
	 *     @example
	 *     dsObj.editRecord();
	 *     dsObj.setFieldValue('fld1', 123);
	 *     dsObj.confirm();
	 * 
	 * @fires BEFOREUPDATE
	 * @fires AFTERUPDATE
	 * 
	 * @return {this}
	 */
	editRecord: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.UPDATE ||
			Z._status == jslet.data.DataSetStatus.INSERT) {
			return this;
		}

		Z.selection.removeAll();
		if (!Z.hasRecord()) {
			Z.insertRecord();
		} else {
			Z._aborted = false;
			try {
				Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREUPDATE);
				if (Z._aborted) { 
					return this;
				}
			} finally {
				Z._aborted = false;
			}

			Z._modiObject = {};
			jQuery.extend(Z._modiObject, Z.getRecord());
			var dsMaster = Z.masterDataset();
			if (dsMaster) {
				dsMaster.editRecord();
			}

			Z.status(jslet.data.DataSetStatus.UPDATE);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERUPDATE);
		}
		return this;
	},

	/**
	 * Delete curent record.
	 * 
	 * @fires BEFOREUPDATE
	 * @fires AFTERUPDATE
	 * 
	 * @return {Boolean} Identify whether the record is deleted. If delete the new record which is not submit to server, it returns false. 
	 */
	deleteRecord: function () {
		var Z = this,
			recCnt = Z.recordCount();
		if (recCnt === 0 || Z.changedStatus() === jslet.data.DataSetStatus.DELETE) {
			return false;
		}
		Z._aborted = false;
		try {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREDELETE);
			if (Z._aborted) {
				return false;
			}
		} finally {
			Z._aborted = false;
		}
		
		Z.selection.removeAll();
		if (Z._status === jslet.data.DataSetStatus.INSERT) {
			Z.cancel();
			return false;
		}

		Z._silence++;
		try {
			Z.checkStatusByCancel();
		} finally {
			Z._silence--;
		}

		if (Z.hasChildren()) {
			jslet.showInfo(jsletlocale.Dataset.cannotDelParent);
			return false;
		}

		var preRecno = Z.recno(), 
			isLast = preRecno == (recCnt - 1), 
			k = Z._recno,
			deleted = false;
		if(Z.changedStatus() === jslet.data.DataSetStatus.INSERT) {
			Z._changeLog.unlog();
		} else {
			Z.changedStatus(jslet.data.DataSetStatus.DELETE);
			Z._changeLog.log();
			deleted = true;
		}
		Z.records().splice(k, 1);
		Z._refreshInnerRecno();
		
		var dsMaster = Z.masterDataset();
		if (dsMaster) {
			dsMaster.editRecord();
		}

		Z.status(jslet.data.DataSetStatus.BROWSE);
		
		if (isLast) {
			Z._silence++;
			try {
				Z.prior();
			} finally {
				Z._silence--;
			}
		} else {
			Z._refreshProxyField();
			if (Z._contextRuleEnabled) {
				this.calcContextRule();
			}
		}
		Z._calcAggregatedValueDebounce.call(Z);
		var evt = jslet.data.RefreshEvent.deleteEvent(preRecno);
		Z.refreshControl(evt);
		
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);	
		Z.refreshLookupHostDataset();
		var detailFields = Z._detailDatasetFields;
		if(detailFields) {
			var dtlFldObj, dsDetail;
			for(var i = 0, len = detailFields.length; i < len; i++) {
				dtlFldObj = detailFields[i];
				dsDetail = dtlFldObj.detailDataset();
				if(dsDetail) {
					dsDetail.refreshControl();
				}
			}
		}
		if (Z.isBof() && Z.isEof()) {
			return deleted;
		}
		evt = jslet.data.RefreshEvent.scrollEvent(Z._recno);
		Z.refreshControl(evt);
		return deleted;
	},

	/**
	 * Delete all selected records.
	 * 
	 * @return {this}
	 */
	deleteSelected: function() {
		var Z = this, 
			records = Z.selectedRecords(),
			recObj;
		Z.disableControls();
		try {
			for(var i = records.length - 1; i >= 0; i--) {
				recObj = records[i];
				Z.moveToRecord(recObj);
				Z.deleteRecord();
			}
		} finally {
			Z.enableControls();
		}
		return this;
	},
	
	/**
	 * Validate the dataset. Sometimes, the dataset's records is inputted outerside dataset object, then dataset can not validate data automatically.
	 * In this case, use this method to validate data manually. Example:
	 * 
	 *     @example
	 *     var records = [{field1: 'value1', field2: 123}, {field1: 'value2', field2: null}];
	 *     var dsObj.records(records);
	 *     dsObj.validateDataset(); //Validate all fields
	 *     dsObj.validateDataset(['field1']); //include fields: field1
	 *     dsObj.validateDataset(null, ['field1']);  exclude fields: field2
	 * 
	 * @param {String[]} includeFields The fields which need to be validated.
	 * @param {String[]} excludeFields The fields which don't need to be validated.
	 */
	validateDataset: function(includeFields, excludeFields) {
		var Z = this;
		Z.iterate(function() {
			Z.validateRecord(includeFields, excludeFields);
		});
		return this;
	},
	
	/**
	 * Validate the current record. It's almost used in method: validateDataset.
	 * 
	 * @param {String[]} includeFields The fields which need to be validated.
	 * @param {String[]} excludeFields The fields which don't need to be validated.
	 */
	validateRecord: function(includeFields, excludeFields) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return this;
		}
		
		var fldObj, fldName, fldValue, invalidMsg;
		for (var i = 0, cnt = Z._normalFields.length; i < cnt; i++) {
			fldObj = Z._normalFields[i];
			fldName = fldObj.name();
			if(excludeFields && excludeFields.indexOf(fldName) >= 0 || 
			   includeFields && includeFields.indexOf(fldName) < 0) {
				continue;
			}
			invalidMsg = null;
			fldValue = Z.getFieldValue(fldName);
			invalidMsg = Z._fieldValidator.checkValue(fldObj, Z.getFieldValue(fldName));
			if (invalidMsg) {
				Z.setFieldError(fldName, invalidMsg);
			} else {
				Z.setFieldError(fldName, null);
			}
		} //end for i
		if(Z._masterDataset && Z._masterField) {
			var masterDsObj = jslet.data.getDataset(Z._masterDataset),
				masterFldObj = masterDsObj.getField(Z._masterField);
			if(Z.existRecordError()) {
				//'Detail Dataset: {0} has error data!'
				masterDsObj.addFieldError(Z._masterField, jslet.formatMessage(jsletlocale.Dataset.detailDsHasError, [Z.name()]));
			} else {
				masterDsObj.addFieldError(Z._masterField, null);
			}
		}
		return this;
	},
	
	/**
	 * @private
	 */
	_innerValidateData: function (includeFields, excludeFields) {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.BROWSE || Z.recordCount() === 0) {
			return;
		}
		
		var fldObj, fldName, fldValue, invalidMsg;
		for (var i = 0, cnt = Z._normalFields.length; i < cnt; i++) {
			fldObj = Z._normalFields[i];
			fldName = fldObj.name();
			if(Z.existFieldError(fldName) || !fldObj.visible() || fldObj.disabled() || fldObj.readOnly() || excludeFields && excludeFields.indexOf(fldName) >= 0 || 
				includeFields && includeFields.indexOf(fldName) < 0 ) {
				continue;
			}
			invalidMsg = null;
			fldValue = Z.getFieldValue(fldName);
			invalidMsg = Z._fieldValidator.checkRequired(fldObj, fldValue);
			if (invalidMsg) {
				Z.setFieldError(fldName, invalidMsg);
			}
		} //end for i
		if(Z._masterDataset && Z._masterField) {
			var masterDsObj = jslet.data.getDataset(Z._masterDataset),
				masterFldObj = masterDsObj.getField(Z._masterField);
			if(Z.existRecordError()) {
				//'Detail Dataset: {0} has error data!'
				masterDsObj.addFieldError(Z._masterField, jslet.formatMessage(jsletlocale.Dataset.detailDsHasError, [Z.name()]));
			} else {
				masterDsObj.addFieldError(Z._masterField, null);
			}
		}
	},

	/**
	 * @private
	 */
	errorMessage: function(errMessage) {
		var evt = jslet.data.RefreshEvent.errorEvent(errMessage || '');
		this.refreshControl(evt);
	},
	
	addFieldError: function(fldName, errorMsg, valueIndex, inputText) {
		jslet.data.FieldError.put(this.getRecord(), fldName, errorMsg, valueIndex, inputText);
	},
	
	/**
	 * Check whether the specified record exists error.
	 * 
	 * @param {Integer | Object} recnoOrRecord Record number.
	 * @param {String[]} includeFields Checking field names.
	 * @param {String[]} excludeFields Unchecking field names.
	 * 
	 * @return {Boolean} True - exist error, false - otherwise.
	 */
	existRecordError: function(recno, includeFields, excludeFields) {
		return jslet.data.FieldError.existRecordError(this.getRecord(recno), includeFields, excludeFields);
	},
	
	getRecordErrorInfo: function(recno, includeFields, excludeFields) {
		var record = this.getRecord(recno);
		if(!this.existRecordError()) {
			return '';
		}
		var recInfo = jslet.data.getRecInfo(record);
		if(!recInfo) {
			return null;
		}
		var result = '',
			errObj = recInfo.error,
			fldObj;
		if(errObj) {
			for(var fldName in errObj) {
				if(excludeFields && excludeFields.indexOf(fldName) >= 0) {
					continue;
				}
				if(includeFields && includeFields.indexOf(fldName) < 0) {
					continue;
				}
				var msg = jslet.data.FieldError.get(record, fldName).message;
				if(msg) {
					fldObj = this.getField(fldName);
					if(result) {
						result += ', ';
					}
					result += msg;
				}
			}
		}
		return result;
	},
	
	/**
	 * @private
	 * 
	 * Check show error message if the dataset exists error data.
	 * 
	 * @param {String[]} includeFields Checking field names.
	 * @param {String[]} excludeFields Unchecking field names.
	 * @param {jslet.data.RecordRange} recordRange - checking record range.
	 */
	checkAndShowError: function(includeFields, excludeFields, recordRange) {
		var Z = this;
		if(Z.existDatasetError(includeFields, excludeFields, recordRange)) {
			if (Z._autoShowError) {
				jslet.showError(jsletlocale.Dataset.cannotConfirm, function() {
					Z.focusFirstErrorField();
				}, 2000);
			} else {
				console.warn(jsletlocale.Dataset.cannotConfirm);
				Z.focusFirstErrorField();
			}
			return true;
		}
		return false;
	},
	
	/**
	 * Check whether the dataset exists error data.
	 * 
	 *     @example
	 *     dsObj.existDatasetError(); //Check all fields
	 *     dsObj.existDatasetError(['fld1', 'fld2']); //Check 'fld1' and 'fld2'
	 * 
	 * @param {String[]} includeFields Checking field names.
	 * @param {String[]} excludeFields Unchecking field names.
	 * @param {jslet.data.RecordRange} recordRange - checking record range.
	 * 
	 * @return {Boolean} True - exist error, false - otherwise.
	 */
	existDatasetError: function(includeFields, excludeFields, recordRange) {
		var Z = this, isError = false,
			records = Z.records();
		if(!records) {
			return false;
		}
		if(recordRange === jslet.data.RecordRange.CURRENT) {
			return jslet.data.FieldError.existRecordError(Z.getRecord(), includeFields, excludeFields);
		}
		if(recordRange === jslet.data.RecordRange.SELECTED) {
			records = Z.selectedRecords() || [];		
		}
		for(var i = 0, len = records.length; i < len; i++) {
			isError = jslet.data.FieldError.existRecordError(records[i], includeFields, excludeFields);
			if(isError) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Confirm the current record which is inserting or updating. This method will validate first, and change the dataset status to 'Browse'.
	 * 
	 * @param {String[]} includeFields Checking field names.
	 * @param {String[]} excludeFields Unchecking field names.
	 * 
	 * @return {Boolean} True - the current record is valid, false - otherwise.
	 */
	confirm: function (includeFields, excludeFields) {
		var Z = this;
		if (Z._status === jslet.data.DataSetStatus.BROWSE) {
			return true;
		}
		var records = Z.records();
		if(!records || records.length ===0) {
			Z._status = jslet.data.DataSetStatus.BROWSE;
			return true;
		}
		Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECONFIRM);
		Z._confirmDetailDataset();
		Z._innerValidateData(includeFields, excludeFields);
		if(Z.status() === jslet.data.DataSetStatus.UPDATE) {
			Z.changedStatus(jslet.data.DataSetStatus.UPDATE);
		}
		
		var evt, hasError = Z.existRecordError(Z.recno(), includeFields, excludeFields);
		var rec = Z.getRecord();
		Z._modiObject = null;
		Z.status(jslet.data.DataSetStatus.BROWSE);
		if(!hasError) {
			Z._changeLog.log();
		}
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCONFIRM);
		Z._calcAggregatedValueDebounce.call(Z);
		evt = jslet.data.RefreshEvent.updateRecordEvent();
		Z.refreshControl(evt);
		if(hasError) {
			Z.errorMessage(jsletlocale.Dataset.cannotConfirm);			
		} else {
			jslet.data.FieldError.clearRecordError(Z.getRecord(), includeFields, excludeFields);
			Z.errorMessage();
		}
		var dsMaster = Z.masterDataset();
		if (dsMaster) {
			var masterFldName = Z.masterField();
			if(hasError) {
				//'Detail Dataset: {0} has error data!'
				dsMaster.addFieldError(masterFldName, jslet.formatMessage(jsletlocale.Dataset.detailDsHasError, [Z.name()]));
			} else {
				dsMaster.addFieldError(masterFldName, null);
			}
			dsMaster.refreshControl(evt);
		}
		Z.refreshLookupHostDataset();

		return !hasError;
	},

	/*
	 * @private
	 */
	_confirmDetailDataset: function() {
		var Z = this,
			fldObj, i, len,
			dtlDatasets = [],
			dtlFields = [];
		for (i = 0, len = Z._normalFields.length; i < len; i++) {
			fldObj = Z._normalFields[i];
			if(fldObj.getType() === jslet.data.DataType.DATASET) {
				dtlDatasets.push(fldObj.detailDataset());
				dtlFields.push(fldObj.name());
			}
		}
		var dsDetail, oldShowError;
		for(i = 0, len = dtlDatasets.length; i < len; i++) {
			dsDetail = dtlDatasets[i];
			if(!dsDetail) {
				continue;
			}
			dsDetail.confirm();
			if(dsDetail.existDatasetError()) {
				//'Detail Dataset: {0} has error data!'
				Z.addFieldError(dtlFields[i], jslet.formatMessage(jsletlocale.Dataset.detailDsHasError, [dsDetail.name()]));
			} else {
				Z.addFieldError(dtlFields[i], null);
			}
		}
	},
	
	/**
	 * Cancel inserting or updating. This method will rollback the current record and change dataset status to 'Browse'.
	 */
	cancel: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.BROWSE) {
			return this;
		}
		if (Z.recordCount() === 0) {
			return this;
		}
		Z._aborted = false;
		try {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECANCEL);
			if (Z._aborted) {
				return this;
			}
		} finally {
			Z._aborted = false;
		}
		 Z._cancelDetailDataset();
		 var evt, 
			k = Z._recno,
			records = Z.records();
		if (Z._status == jslet.data.DataSetStatus.INSERT) {
			Z.selection.removeAll();
			var no = Z.recno();
			records.splice(k, 1);
			Z.status(jslet.data.DataSetStatus.BROWSE);
			Z._refreshInnerRecno();
			if(no >= Z.recordCount()) {
				Z._recno = Z.recordCount() - 1;
			}
			Z._refreshProxyField();
			if (Z._contextRuleEnabled) {
				this.calcContextRule();
			}

			Z._calcAggregatedValueDebounce.call(Z);
			evt = jslet.data.RefreshEvent.deleteEvent(no);
			Z.refreshControl(evt);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
			evt = jslet.data.RefreshEvent.scrollEvent(Z._recno); 
			Z.refreshControl(evt); 
			return this;
		} else {
			if (Z._filteredRecnoArray) {
				k = Z._filteredRecnoArray[Z._recno];
			}
			var currRec = records[k];
			var modiObj = Z._modiObject;
			jQuery.extend(currRec, modiObj);
			for(var propName in currRec) {
				if(modiObj[propName] === undefined) {
					delete currRec[propName];
				}
			}
			Z._innerValidateData();

			jslet.data.FieldValueCache.removeCache(currRec);
			Z._modiObject = null;
		}

		Z._refreshProxyField();
		Z._calcAggregatedValueDebounce.call(Z);
		Z.status(jslet.data.DataSetStatus.BROWSE);
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCANCEL);

		evt = jslet.data.RefreshEvent.updateRecordEvent();
		Z.refreshControl(evt);
		return this;
	},

    /*
     * @private
     */
    _cancelDetailDataset: function() {
        var Z = this,
            fldObj, i, len,
            detailDatasets = [];
        for (i = 0, len = Z._normalFields.length; i < len; i++) {
            fldObj = Z._normalFields[i];
            if(fldObj.getType() === jslet.data.DataType.DATASET) {
                detailDatasets.push(fldObj.detailDataset());
            }
        }
        var dsDetail;
        for(i = 0, len = detailDatasets.length; i < len; i++) {
            dsDetail = detailDatasets[i];
            dsDetail.cancel();
        }
    },
     
	/**
	 * @property
	 * 
	 * If logChanges is false, the changes made by user will not be send to server. <br />
	 * If you don't need submit data to server, you can set this property value to false.
	 * <br />Default value: true. Example:
	 * 
	 *     @example
	 *     dsObj.logChanges(true); //Set property, return this.
	 *     var propValue = dsObj.logChanges(); //Get property value.
	 * 
	 * @param {Boolean | undefined} logChanges - True: log user changes, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	logChanges: function (logChanges) {
		if (logChanges === undefined) {
			return this._logChanges;
		}

		this._logChanges = logChanges;
		return this;
	},

	/**
	 * Edit log means the log when user modify records. For some sensitive data, user need audit who & when modify data. Example: 
	 * 
	 *     @example
	 *     dsObj.auditLogEnabled(true); //Set property, return this.
	 *     var propValue = dsObj.auditLogEnabled(); //Get property value.
	 * 
	 * @param {Boolean | undefined} auditLogEnabled - True: enable audit log, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	auditLogEnabled: function(auditLogEnabled) {
		if(auditLogEnabled === undefined) {
			return this._auditLogEnabled;
		}
		this._auditLogEnabled = auditLogEnabled? true: false;
		return this;
	},
	
	/**
	 * Identify whether enable field value validating or not. Example: 
	 * 
	 *     @example
	 *     dsObj.validationEnabled(true); //Set property, return this.
	 *     var propValue = dsObj.validationEnabled(); //Get property value.
	 * 
	 * @param {Boolean | undefined} validationEnabled - True: enable field value validating, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	validationEnabled: function(validationEnabled) {
		if(validationEnabled === undefined) {
			return this._validationEnabled;
		}
		this._validationEnabled = validationEnabled? true: false;
		return this;
	},
	
	/**
	 * Disable refreshing controls, it's always used in a batch operation;
	 * After batch operating, use {@link jslet.data.Dataset#enableControls}(). Example:
	 * 
	 *     @example
	 *     dsObj.disableControls();
	 *     try {
	 *       dsObj.setFieldValue('fld1', 123); //It won't refresh UI.
	 *       ...
	 *     } finally {
	 *       dsObj.enableControls();
	 *     }
	 * 
	 * @return {this}
	 */
	disableControls: function () {
		this._lockCount++;
		var fldObj, dsDetail;
		for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
			fldObj = this._normalFields[i];
			dsDetail = fldObj.detailDataset();
			if (dsDetail !== null) {				
				dsDetail.disableControls();
			}
		}
		return this;
	},

	/**
	 * Enable refreshing controls.. Example:
	 * 
	 *     @example
	 *     dsObj.disableControls();
	 *     try {
	 *       dsObj.setFieldValue('fld1', 123); //It won't refresh UI.
	 *       ...
	 *     } finally {
	 *       dsObj.enableControls();
	 *     }
	 * 
	 * @param {Boolean} refreshCtrl true - Refresh control immediately, false - Otherwise.
	 * 
	 * @return {this}
	 */
	enableControls: function (needRefreshCtrl) {
		if (this._lockCount > 0) {
			this._lockCount--;
		}
		if (!needRefreshCtrl) {
			this.refreshControl();
		}

		var fldObj, dsDetail;
		for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
			fldObj = this._normalFields[i];
			dsDetail = fldObj.detailDataset();
			if (dsDetail !== null) {				
				dsDetail.enableControls();
			}
		}
		return this;
	},
	
	/**
	 * Check whether the specified field of current record is valid or not.
	 * 
	 * @param {String} fldName Field name;
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {Boolean} True - exists invalid data, false -otherwise.
	 */
	existFieldError: function(fldName, valueIndex) {
		if (this.recordCount() === 0) {
			return false;
		}

		var currRec = this.getRecord();
		if (!currRec) {
			return false;
		}
		return jslet.data.FieldError.existFieldError(currRec, fldName, valueIndex);
	},
	
	/**
	 * Get the specified field error message of current record. Example:
	 * 
	 *     @example
	 *     var errorObj = dataset.getFieldError('field1'); //return: {message: 'Not Exists!', inputText: 'Foo'}
	 * 
	 * @param {String} fldName Field name.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {Object} Error Object, like {message: 'Not Exists!', inputText: 'Foo'}
	 */
	getFieldError: function(fldName, valueIndex) {
		return this.getFieldErrorByRecno(null, fldName, valueIndex);
	},
	
	/**
	 * Get the specified field error message of specified record. Example:
	 * 
	 *     @example
	 *     var errorObj = getFieldErrorByRecno(19, 'field1'); //return: {message: 'Not Exists!', inputText: 'Foo'}
	 * 
	 * @param {Integer} recno Record Number.
	 * @param {String} fldName Field name.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {Object} Error Object, like {message: 'Not Exists!', inputText: 'Foo'}
	 */
	getFieldErrorByRecno: function(recno, fldName, valueIndex) {
		if (this.recordCount() === 0) {
			return null;
		}

		var currRec = this.getRecord(recno);
		if (!currRec) {
			return null;
		}
		return jslet.data.FieldError.get(currRec, fldName, valueIndex);
	},
	
	/**
	 * Set the specified field error message of current record. Example:
	 * 
	 *     @example
	 * 	   var errorObj = dataset.setFieldError('field1', 'Not Exists!', null, 'Foo');
	 * 
	 * @param {String} fldName Field name.
	 * @param {String} errorMsg Field error message.
	 * @param {Integer} valueIndex (Optional)Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * @param {String} inputText (Optional)User input text.
	 * 
	 * @return {this}
	 */
	setFieldError: function(fldName, errorMsg, valueIndex, inputText) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return Z;
		}

		var currRec = Z.getRecord();
		if (!currRec) {
			return Z;
		}
		jslet.data.FieldError.put(currRec, fldName, errorMsg, valueIndex, inputText);
		return this;
	},
		
	/**
	 * Get field value with specified record number and field name.
	 * 
	 *     @example
	 *     dsObj.getFieldValueByRecno(2, 'fld1');
	 *     dsObj.getFieldValueByRecno(2, 'fld2', 0); //fld2 value is an array.
	 * 
	 * @param {Integer} recno Specified record number.
	 * @param {String} fldName Field name.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {Object} field value.
	 */
	getFieldValueByRecno: function(recno, fldName, valueIndex) {
		var dataRec = this.getRecord(recno);
		if(!dataRec) {
			return null;
		}
		return this.getFieldValueByRecord(dataRec, fldName, valueIndex);
	},
	
	/**
	 * Get field value of specified record.
	 * 
	 *     @example
	 *     var recObj = dsObj.getRecord(2);
	 *     dsObj.getFieldValueByRecno(recObj, 'fld1');
	 *     dsObj.getFieldValueByRecno(recObj, 'fld2', 0); //fld2 value is an array.
	 * 
	 * @param {Object} dataRec Specified record.
	 * @param {String} fldName Field name.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {Object} field value.
	 */
	getFieldValueByRecord: function (dataRec, fldName, valueIndex) {
		var Z = this;

		if (!dataRec) {
			dataRec = Z.getRecord();
		}
		Z._refreshProxyField(dataRec, true);

		var k = fldName.indexOf('.'), 
			dtlFldName, fldValue = null,
			fldObj = Z.getField(fldName),
			value, lkds;
		if (k > 0) { //field chain
			dtlFldName = fldName.substr(0, k);
			fldObj = Z.getField(dtlFldName);
			var lkf = fldObj.lookup(),
				dsDetail = fldObj.detailDataset();
			
			if (!lkf && !dsDetail) {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.lookupNotFound, [dtlFldName]));
			}
			if(lkf) {
				value = jslet.data.FieldRawValueAccessor.getRawValue(dataRec, fldObj);
				lkds = lkf.dataset();
				fldValue = null;
				if(value || value === 0) {
					if (lkds.findByField(lkds.keyField(), value)) {
						fldValue = lkds.getFieldValue(fldName.substr(k + 1));
					} else {
						console.warn(jslet.formatMessage(jsletlocale.Dataset.valueNotFound,
								[lkds.description(), lkds.keyField(), value]));
					}
				}
			} else {
				fldValue = dsDetail.getFieldValue(fldName.substr(k + 1));
			}
			
		} else { //single field
			if (!fldObj) {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
			}
			var formula = fldObj.formula();
			if (!formula) {
				fldValue = jslet.data.FieldRawValueAccessor.getRawValue(dataRec, fldObj);
			} else {
				if(dataRec[fldName] === undefined) {
					fldValue = Z._calcFormula(dataRec, fldName);
					jslet.data.FieldRawValueAccessor.setRawValue(dataRec, fldObj, fldValue);
				} else {
					fldValue = jslet.data.FieldRawValueAccessor.getRawValue(dataRec, fldObj);
				}
			}
		}

		if(!fldObj.valueStyle() || valueIndex === undefined) { //jslet.data.FieldValueStyle.NORMAL
			return fldValue;
		}
		return jslet.getArrayValue(fldValue, valueIndex);
	},

	/**
	 * Get field value of current record.
	 * 
	 *     @example
	 *     dsObj.getFieldValue('fld1');
	 *     dsObj.getFieldValue('fld2', 0); //fld2 value is an array.
	 * 
	 * @param {String} fldName Field name.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {Object}
	 */
	getFieldValue: function (fldName, valueIndex) {
		var currRec = this.getRecord();
		if (!currRec) {
			return null;
		}
		return this.getFieldValueByRecord(currRec, fldName, valueIndex);
	},

	_convertValueByType: function(fldName, value, dataType, scale, trimBlank) {
		if(!value || dataType === jslet.data.DataType.DATASET) {
			return value;
		}
		if(jslet.isArray(value)) {
			for(var i = 0, len = value.length; i < len; i++) {
				value[i] = this._convertValueByType(fldName, value[i], dataType, scale, trimBlank);
			}
			return value;
		}
		if(dataType === jslet.data.DataType.NUMBER) {
			var oldValue = value;
			value = scale > 0 ? parseFloat(value): parseInt(value);
			if(window.isNaN(value)) {
				//Invalid value: [{1}] for NUMBER field: [{0}]!
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.invalidNumberFieldValue, [fldName, oldValue]));
			}
			return value;
		}
		if(trimBlank && dataType === jslet.data.DataType.STRING && jslet.isString(value)) {
			return value.trim();
		}
		return value;
	},
	
	/**
	 * Set field value of current record.
	 * 
	 *     @example
	 *     dsObj.setFieldValue('fld1', 123);
	 *     dsObj.getFieldValue('fld2', ['one', 'two']); //fld2 value is an array.
	 *     dsObj.getFieldValue('fld2', 'one1', 0); //fld2 value is an array.
	 * 
	 * @param {String} fldName Field name.
	 * @param {Object} value Field value.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {this}
	 */
	setFieldValue: function (fldName, value, valueIndex) {
		var Z = this,
			fldObj = Z.getField(fldName);
		if (fldObj === null) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
		}
		if(Z._status == jslet.data.DataSetStatus.BROWSE) {
			Z.editRecord();
		}
		var auditLogRec = Z._logOldEditValue(fldName, fldObj.label());
		var currRec = Z.getRecord(),
			dataType = fldObj.getType();
		value = Z._convertValueByType(fldName, value, dataType, fldObj.scale(), fldObj.trimBlank());
		
		if(Z._validationEnabled) {
			var invalidMsg = Z._fieldValidator.checkValue(fldObj, value);
			if(invalidMsg) {
				Z.setFieldError(fldName, invalidMsg);
			} else {
				Z.setFieldError(fldName, null, valueIndex);
			}
		}
		if(!fldObj.valueStyle() || valueIndex === undefined) { //jslet.data.FieldValueStyle.NORMAL
			jslet.data.FieldRawValueAccessor.setRawValue(currRec, fldObj, value);
			if (dataType == jslet.data.DataType.DATASET) {//dataset field
				return this;
			}
		} else {
			var arrValue = jslet.data.FieldRawValueAccessor.getRawValue(currRec, fldObj);

			if(!arrValue || !jslet.isArray(arrValue)) {
				arrValue = [];
			}
			var len = arrValue.length;
			if(valueIndex < len) {
				arrValue[valueIndex] = value;
			} else {
				for(var i = len; i < valueIndex; i++) {
					arrValue.push(null);
				}
				arrValue.push(value);
			}
			
			jslet.data.FieldRawValueAccessor.setRawValue(currRec, fldObj, arrValue);
		}
		if (Z._onFieldChanged) {
			var eventFunc = jslet.getFunction(Z._onFieldChanged);
			if(eventFunc) {
				eventFunc.call(Z, fldName, value, valueIndex);
				value = Z.getFieldValue(fldName, valueIndex);
			}
		}
		if(Z.isFireGlobalEvent()) {
			var globalHandler = jslet.data.globalDataHandler.fieldValueChanged();
			if(globalHandler) {
				globalHandler.call(Z, Z, fldName, value, valueIndex);
			}
		}
		if(fldObj.valueFollow()) {
			if(!Z._followedValues) {
				Z._followedValues = {};
			}
			Z._followedValues[fldName] = value;
		}
		Z._refreshProxyField(currRec, true);
		//calc other fields' range to use context rule
		if (Z._contextRuleEnabled) {
			Z.calcContextRule(fldName);
		}
		jslet.data.FieldValueCache.clear(currRec, fldName);
		Z._logNewEditValue(fldName, auditLogRec);
		Z._updateLookupRelativeFields(fldObj, value);
		var evt = jslet.data.RefreshEvent.updateRecordEvent(fldName);
		Z.refreshControl(evt);
		Z.updateFormula(fldName);
		Z._calcAggregatedValueDebounce.call(Z);
		return this;
	},

	_logOldEditValue: function(fldName, fldLabel) {
		var Z = this;
		if(!Z._auditLogEnabled || !Z._logChanges) {
			return null;
		}
		var status = Z.changedStatus() || Z._status;
		if(status !== jslet.data.DataSetStatus.UPDATE) {
			return null;
		}
		var currRec = Z.getRecord(); 
		var auditLog = currRec[jslet.global.auditLogField];
		if(!auditLog) {
			auditLog = {};
			currRec[jslet.global.auditLogField] = auditLog;
		}
		var logRec = auditLog[fldName];
		if(!logRec) {
			logRec = {};
			auditLog[fldName] = logRec;
			logRec.l = fldLabel;
		}
		var oldValue = logRec.o;
		if(!oldValue) {
			logRec.o = Z.getFieldText(fldName);
		}
		return logRec;
	},
	
	_logNewEditValue: function(fldName, auditLogRec) {
		if(auditLogRec) {
			var newValue = this.getFieldText(fldName);
			if(newValue != auditLogRec.o) {
				auditLogRec.n = newValue;
			} else {
				var currRec = this.getRecord(); 
				var auditLog = currRec[jslet.global.auditLogField];
				delete auditLog[fldName];
			}
		}
	},
	
	clearFollowedValues: function() {
		this._followedValues = null;
		return this;
	},
	
	calcFocusedFields: function() {
		var Z = this, fldObj;
		Z._focusedFields = null;
		for(var i = 0, len = Z._normalFields.length; i < len; i++) {
			fldObj = Z._normalFields[i];
			if(fldObj.focused()) {
				if(!Z._focusedFields) {
					Z._focusedFields = [];
				}
				Z._focusedFields.push(fldObj.name());
			}
		}
		if(Z.masterField()) {
			var masterDsObj = jslet.data.getDataset(Z._masterDataset),
				masterFldObj = masterDsObj.getField(Z._masterField);
			masterFldObj.focused(Z._focusedFields && Z._focusedFields.length > 0);
		}
	},
	
	focusedFields: function() {
		return this._focusedFields;
	},
	
	mergedFocusedFields: function() {
		var fields = this._focusedFields,
			result = fields,
			canFields = this._canFocusFields,
			fldName, fldObj;
		if(fields && canFields) {
			for(var i = fields.length - 1; i >= 0; i--) {
				fldName = fields[i];
				fldObj = this.getField(fldName);
				if(fldObj.detailDataset()) {
					continue;
				}
				if(canFields.indexOf(fldName) < 0) {
					result = fields.slice(0);
					result.splice(i, 1);
				}
			}
		}
		return result;
	},
	
	_updateLookupRelativeFields: function(fldObj, fldValue) {
		//Only single value can update relative fields.
		if(!fldValue || fldObj.valueStyle() !== jslet.data.FieldValueStyle.NORMAL) {
			return;
		}
		var lkObj = fldObj.lookup();
		if(!lkObj) {
			return;
		}
		var lkRtnFldMap = lkObj.returnFieldMap();
		if(!lkRtnFldMap) {
			return;
		}
		var lkFldName, lkDs = lkObj.dataset();
		if(jslet.compareValue(lkDs.keyValue(), fldValue) !== 0) {
			if(!lkDs.findByKey(fldValue)) {
				return;
			}
		}
		var keyFldName = fldObj.name();
		for(var fldName in lkRtnFldMap) {
			//Avoid setting value to key field.
			if(keyFldName == fldName) {
				continue;
			}
			lkFldName = lkRtnFldMap[fldName];
			this.setFieldValue(fldName, lkDs.getFieldValue(lkFldName));
		}
		
	},
	
	_calcFormulaRelation: function() {
		var Z = this;
		if(!Z._innerFormularFields) {
			return;
		}
		var fldName, formulaFields, formulaFldName, fldObj,
			relation = {}, 
			count = 0;
		for(var fldName in Z._innerFormularFields) {
			var evaluator = Z._innerFormularFields[fldName];
			formulaFields = evaluator.mainFields();
			relation[fldName] = formulaFields;
			count++;
		}
		Z._innerFormulaRelation = count > 0? relation: null;
	},
	
	/**
	 * @private
	 */
	addInnerFormulaField: function(fldName, formula) {
		var Z = this;
		if(!formula) {
			return;
		}
		if (!Z._innerFormularFields) {
			Z._innerFormularFields = {};
		}
		var evaluator = new jslet.data.Expression(Z, formula);
		Z._innerFormularFields[fldName] = evaluator;
		Z._calcFormulaRelation();
	},
	
	/**
	 * @private
	 */
	removeInnerFormulaField: function (fldName) {
		if (this._innerFormularFields) {
			delete this._innerFormularFields[fldName];
			this._calcFormulaRelation();
		}
	},

	_calcFormula: function(currRec, fldName) {
		var Z = this,
			evaluator = Z._innerFormularFields[fldName],
			result = null;
		if(evaluator) {
			evaluator.context.dataRec = currRec;
			result = evaluator.eval();
		}
		return result;
	},
	
	/**
	 * @private
	 */
	updateFormula: function (changedFldName) {
		var Z = this;
		if(!Z._innerFormulaRelation) {
			return;
		}
		var fields, fldObj,
			currRec = this.getRecord();
		for(var fmlFldName in Z._innerFormulaRelation) {
			fields = Z._innerFormulaRelation[fmlFldName];
			fldObj = Z.getField(fmlFldName);
			if(!fields || fields.length === 0) {
				fldObj.setValue(Z._calcFormula(currRec, fmlFldName));
				continue;
			}
			var found = false, fldName;
			for(var j = 0, cnt = fields.length; j < cnt; j++) {
				fldName = fields[j];
				if(fldName == changedFldName || fldName.startsWith(changedFldName + '.')) {
					found = true;
					break;
				}
			}
			if(found) {
				fldObj.setValue(Z._calcFormula(currRec, fmlFldName));
			}
		}
	},
	
	/**
	 * Get field text. Difference of field text and field value: <br />
	 * Field value: the original value which request from server or send to server. <br />
	 * Field text: the formatting text from field value, it includes two types: 'Input Text' and 'Display Text', an example for them:<br />
	 * Suppose one field value is currency, 'Input Text' is '90123.56', and 'Display Text' is '$90,123.56'. <br />
	 * Example:
	 * 
	 *     @example
	 *     dsObj.setFieldValue('fld1', 90123.56);
	 *     dsObj.getFieldText('fld1', true); //return '90123.56'
	 *     dsObj.getFieldText('fld1'); //return '$90,123.56'(DisplayFormat is: '$#,##0.00)
	 * 
	 * @param {String} fldName Field name.
	 * @param {Boolean} isEditing (optional) In edit mode or not, if in edit mode, return 'Input Text'(user inputting text), else return 'Display Text'(Display text is almost formatted). 
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, starts with 0.
	 * 
	 * @return {String} Field text.
	 */
	getFieldText: function (fldName, isEditing, valueIndex) {
		if (this.recordCount() === 0) {
			return null;
		}

		var currRec = this.getRecord();
		if (!currRec) {
			return null;
		}
		return this.getFieldTextByRecord(currRec, fldName, isEditing, valueIndex);
	},
	
	/**
	 * Get field display text by record number.
	 * 
	 * @param {Object} recno Record number.
	 * @param {String} fldName Field name
	 * @param {Boolean} isEditing (optional) In edit mode or not, if in edit mode, return 'Input Text'(user inputting text), else return 'Display Text'(Display text is almost formatted). 
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {String} Field text.
	 */
	getFieldTextByRecno: function (recno, fldName, isEditing, valueIndex) {
		var dataRec = this.getRecord(recno);
		if(!dataRec) {
			return null;
		}
		return this.getFieldTextByRecord(dataRec, fldName, isEditing, valueIndex);
	},
	
	/**
	 * Get field display text with data record.
	 * 
	 * @param {Object} dataRec Data record.
	 * @param {String} fldName Field name.
	 * @param {Boolean} isEditing (optional) In edit mode or not, if in edit mode, return 'Input Text'(user inputting text), else return 'Display Text'(Display text is almost formatted). 
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, starts with 0.
	 * 
	 * @return {String} Field text.
	 */
	getFieldTextByRecord: function (dataRec, fldName, isEditing, valueIndex) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return '';
		}
		var currRec = dataRec, fldObj;
		
		Z._refreshProxyField(currRec, true);
		
		var k = fldName.indexOf('.'), value;
		if (k > 0) { //Field chain
			var dtlFldName = fldName.substr(0, k);
			fldName = fldName.substr(k + 1);
			fldObj = Z.getField(dtlFldName);
			if (!fldObj) {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
			}
			var lkf = fldObj.lookup(),
				dsDetail = fldObj.detailDataset();
			if (!lkf && !dsDetail) {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.lookupNotFound, [fldName]));
			}
			if(lkf) {
				value = currRec[dtlFldName];
				if (value === null || value === undefined) {
					return '';
				}
				var lkds = lkf.dataset();
				if (lkds.findByField(lkds.keyField(), value)) {
					if (fldName.indexOf('.') > 0) {
						return lkds.getFieldValue(fldName);
					} else {
						return lkds.getFieldText(fldName, isEditing, valueIndex);
					}
				} else {
					throw new Error(jslet.formatMessage(jsletlocale.Dataset.valueNotFound,
							[lkds.description(), lkds.keyField(), value]));
				}
			} else {
				//Can't use it in sort function.
				return dsDetail.getFieldText(fldName, isEditing, valueIndex);
			}
		}
		//Not field chain
		fldObj = Z.getField(fldName);
		if (!fldObj) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.lookupNotFound, [fldName]));
		}
		if (fldObj.getType() == jslet.data.DataType.DATASET) {
			return '';
		}
		var valueStyle = fldObj.valueStyle();
		
		if(valueStyle === jslet.data.FieldValueStyle.NORMAL || valueIndex !== undefined) {
			var errObj = jslet.data.FieldError.get(currRec, fldName, valueIndex);
			if(errObj && errObj.message) {
				var inputText = errObj.inputText;
				if(inputText !== undefined && inputText !== null) {
					return inputText;
				}
			}
		}
		var result = [];
		if(valueStyle == jslet.data.FieldValueStyle.BETWEEN && valueIndex === undefined)
		{
			var minVal = Z.getFieldTextByRecord(currRec, fldName, isEditing, 0),
				maxVal = Z.getFieldTextByRecord(currRec, fldName, isEditing, 1);
			if(!isEditing && !minVal && !maxVal){
				return '';
			}
			result.push(minVal);
			if(isEditing) {
				result.push(jslet.global.valueSeparator);
			} else {
				result.push(jsletlocale.Dataset.betweenLabel);
			}
			result.push(maxVal);
			return result.join('');
		}
		
		if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && valueIndex === undefined)
		{
			var arrValues = Z.getFieldValue(fldName), 
				len = 0;
			if(arrValues && jslet.isArray(arrValues)) {
				len = arrValues.length - 1;
			}
			
			for(var i = 0; i <= len; i++) {
				result.push(Z.getFieldTextByRecord(currRec, fldName, isEditing, i));
				if(i < len) {
					result.push(jslet.global.valueSeparator);
				}
			}
			return result.join('');
		}
		//Get cached display value if exists.
		if(!isEditing) {
			var cacheValue = jslet.data.FieldValueCache.get(currRec, fldName, valueIndex);
			if(cacheValue !== undefined) {
				return cacheValue;
			}
		}
		value = Z.getFieldValueByRecord(currRec, fldName, valueIndex);
		if (value === null || value === undefined) {
			var fixedValue = fldObj.fixedValue();
			if(fixedValue) {
				return fixedValue;
			}
			return '';
		}

		var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
		if(!convert) {
			throw new Error('Can\'t find any field value converter!');
		}
		var text = convert.valueToText(fldObj, value, isEditing);
		var encrypted = fldObj.encrypted(); 
		if(!isEditing && encrypted && text) {
			var start = encrypted.start || 0,
				end = encrypted.end;
			if(end === undefined || end === null || end < start) {
				end = 10000;
			}
			var txtLen = text.length;
			end = txtLen < end? txtLen: end;
			var oldText = text;
			text = oldText.substring(0, start); 
			for(var k = start; k < end; k++) {
				text += '*';
			}
			if(txtLen > end) {
				text += oldText.substring(end); 
			}
		}
		//Put display value into cache
		if(!isEditing) {
			jslet.data.FieldValueCache.put(currRec, fldName, text, valueIndex);
		}
		return text;
	},
	
	/**
	 * @private
	 */
	setFieldValueLength: function(fldObj, valueLength) {
		if(!fldObj.valueStyle()) { //jslet.data.FieldValueStyle.NORMAL
			return;
		}
		var value = this.getFieldValue(fldObj.name());
		if(value && jslet.isArray(value)) {
			value.length = valueLength;
		}
	},
	
	/**
	 * Set field value by input value. Example:
	 * 
	 *     @example
	 *     //Field 'department' is a lookup field.
	 *     dsObj.setFieldText('department', '0112'); //input department code
	 *     dsObj.getFieldValue('department'); //return department id: 33
	 *     dsObj.getFieldText('department'); //return department name: 'Sales Dept.'
	 *      
	 * @param {String} fldName Field name.
	 * @param {String} inputText String value inputed by user.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, starts with 0.
	 */
	setFieldText: function (fldName, inputText, valueIndex) {
		var Z = this,
		fldObj = Z.getField(fldName);
		if (fldObj === null) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
		}
		var fType = fldObj.getType();
		if (fType == jslet.data.DataType.DATASET) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.datasetFieldNotBeSetValue, [fldName]));
		}
		
		var value = Z._textToValue(fldObj, inputText, valueIndex);
		if(value !== undefined) {
			Z.setFieldValue(fldName, value, valueIndex);
		}
		return this;
	},

	_textToValue: function(fldObj, inputText, valueIndex) {
		var Z = this, value;
		
		if((fldObj.valueStyle() === jslet.data.FieldValueStyle.BETWEEN ||
			fldObj.valueStyle() === jslet.data.FieldValueStyle.MULTIPLE) && 				
			valueIndex === undefined) {
			//Set an array value
			if(!jslet.isArray(inputText)) {
				inputText = inputText.split(jslet.global.valueSeparator);
			}
			var len = inputText.length, 
				values = [],
				invalid = false;
			for(var k = 0; k < len; k++ ) {
				value = Z._textToValue(fldObj, inputText[k], k);
				if(value === undefined) {
					invalid = true;
				} else {
					if(!invalid) {
						values.push(value);
					}
				}
			}
			if(!invalid) {
				return values;
			}
			return undefined;
		}
		
		var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
		if(!convert) {
			throw new Error('Can\'t find any field value converter!');
		}
		value = convert.textToValue(fldObj, inputText, valueIndex);
		var fldName = fldObj.name();
		if(Z.getFieldError(fldName, valueIndex)) {
			var evt = jslet.data.RefreshEvent.updateRecordEvent(fldName);
			Z.refreshControl(evt);
		} else {
			Z.setFieldError(fldName, null, valueIndex);
		}
		return value;
	},
	
	/**
	 * Get key value of current record. 
	 * <br />Key value is field value of key field, and key field is defined by property {@link jslet.data.Dataset#keyField}.
	 * 
	 * @param {Integer} recno (optional) If not specified, it will get key value of current record.
	 * @return {Object} Key value.
	 */
	keyValue: function (recno) {
		if (!this._keyField || this.recordCount() === 0) {
			return null;
		}
		return this.getFieldValueByRecno(recno, this._keyField);
	},

	/**
	 * Get parent record key value of current record.
	 * <br />Key value is field value of parent field, and parent field is defined by property {@link jslet.data.Dataset#parentField}.
	 * 
	 * @param {Integer} recno recno optional, if not specified, it will get parent key value of current record.
	 * 
	 * @return {Object} Parent record key value.
	 */
	parentValue: function (recno) {
		if (!this._parentField || this.recordCount() === 0) {
			return null;
		}
		return this.getFieldValueByRecno(recno, this._parentField);
	},

	/**
	 * Find record with specified condition
	 * if found, then move cursor to that record. Example:
	 * 
	 *     @example
	 *     dsObj.find('like([name],"Bob%")'); //Finding the one whose name starts with 'Bob'.
	 *     dsObj.find("'[age] > 20' && [gender] == 'F'"); //Finding girls whose age is great than 20. 
	 *     dsObj.find('[age] > 20', true); //Find next
	 *     
	 * @param {String} condition Condition expression.
	 * @param {Boolean} fromCurrentPosition Identify whether finding data from current position or not.
	 * 
	 * @return {Boolean} True - found record, false - otherwise.
	 */
	find: function (condition, fromCurrentPosition) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return false;
		}
		Z.confirm();
		if (condition === null || condition === undefined) {
			Z._findCondition = null;
			Z._innerFindCondition = null;
			Z._findPrevRecno = null;
			return false;
		}
		jslet.Checker.test('find#condition', condition).isString();
		
		if (condition !== Z._findCondition) {
			Z._innerFindCondition = new jslet.data.Expression(this, condition);
			Z._findCondition = condition;
			Z._findPrevRecno = null;
		}
		Z._silence++;
		var foundRecno = -1, 
			oldRecno = Z._recno;
		try {
			if(!fromCurrentPosition) {
				Z.first();
				Z._findPrevRecno = null;
			} else {
				if(Z._findPrevRecno === oldRecno) {
					Z.next();
				}
			}
			while (!Z.isEof()) {
				if (Z._innerFindCondition.eval()) {
					foundRecno = Z._recno;
					break;
				}
				Z.next();
			}
		} finally {
			Z._silence--;
			Z._recno = oldRecno;
		}
		if (foundRecno >= 0) {// can fire scroll event
			Z._gotoRecno(foundRecno);
			if(fromCurrentPosition) {
				Z._findPrevRecno = foundRecno;
			}
			return true;
		}
		return false;
	},

	/**
	 * Find record with specified field name and value. If found, move cursor the found record.
	 * 
	 *     @example
	 *     dsObj.findByField('name', 'Tom'); // return true
	 *     dsObj.findByField('id,name', '5');
	 *     dsObj.findByField('id,name', 'Jack');
	 *     dsObj.findByField(['id', 'name'], '7');
	 *     dsObj.findByField('name', 'Tom', {matchType: 'first'}); // return true
	 *   
	 * @param {String | String[]} fieldNameOrFieldArray Field name, field name array or fields separated with ','.
	 * @param {Object} findingValue Finding value.
	 * @param {Object} options Finding options.
	 * @param {Integer} options.startRecno (optional) Start position to find value, default is 0.
	 * @param {Boolean} options.findingByText (optional) Identify whether finding data with field text, default is finding with field value
	 * @param {String} options.matchType (optional) The optional value: 'first' - match first, 'last' - match last, 'any' - match any, otherwise - match whole value.
	 * @param {String} options.extraFilter (optional) The extra filter when finding.
	 * 
	 * @return {Boolean} 
	 */
	findByField: function (fieldNameOrFieldArray, findingValue, options) {
		jslet.Checker.test('findByField#fieldNameOrFieldArray', fieldNameOrFieldArray).required();
		var Z = this;
		Z.confirm();
		var EQUAL = 1;
		function matchValue(matchType, value, findingValue) {
			if(jslet.compareValue(value, findingValue) === 0) {
				return EQUAL;
			}
			if(matchType == 'first') {
				return jslet.like(value, findingValue + '%');
			}
			if(matchType == 'any') {
				return jslet.like(value, '%' + findingValue + '%');
			}
			if(matchType == 'last') {
				return jslet.like(value, '%' + findingValue);
			}
			return 0;
		}
		var startRecno = 0,
			findingByText = false,
			matchType = null,
			extraFilter = null,
			extraFilterEval = null;
			
		if(options) {
			startRecno = options.startRecno || 0;
			findingByText = options.findingByText || false;
			matchType = options.matchType || null;
			extraFilter = options.extraFilter || null;
			if(extraFilter) {
				extraFilterEval = new jslet.data.Expression(Z, extraFilter);
			}
		}
		var records = Z._ignoreFilter? Z.records(): Z.filteredRecords();
		if(!records || records.length === 0) {
			return false;
		}
		
		var fields = fieldNameOrFieldArray;
		if(jslet.isString(fieldNameOrFieldArray)) {
			fields = fieldNameOrFieldArray.split(',');
		}
		var byTextArray = [], i,
			fldCnt = fields.length,
			fldName, fldObj;
		for(i = 0; i < fldCnt; i++) {
			fldName = fields[i];
			fldObj = Z.getField(fldName);
			if(!fldObj) {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
			}
			var byText = true;
			if(fldObj.getType() === 'N' && !fldObj.lookup()) {
				byText = false;
			}
			byTextArray[i] = byText;
		}
		var start = !Z._ignoreFilter && startRecno? startRecno: 0;
		var dataRec, foundRecno = -1, value, len, result = false, found = false;
		for(i = start, len = records.length; i < len; i++) {
			dataRec = records[i];
			if(extraFilterEval && !extraFilterEval.eval(dataRec)) {
				continue;
			}
			for(var j = 0; j < fldCnt; j++) {
				fldName = fields[j];
				if(findingByText && byTextArray[j]) {
					value = Z.getFieldTextByRecord(dataRec, fldName);
				} else {
					value = Z.getFieldValueByRecord(dataRec, fldName);
				}
				found = matchValue(matchType, value, findingValue);
				if (found) {
					foundRecno = i;
					if(Z._ignoreFilter) { // Only used in value converting, so does not need to move cursor.
						Z._ignoreFilterRecno = i;
						return true;
					}
					result = {};
					result.field = fldName;
					result.isEqual = (found === EQUAL);
					break;
				}
			}
			if(foundRecno >= 0) {
				break;
			}
		}
		if (foundRecno >= 0) {// can fire scroll event
			Z._gotoRecno(foundRecno);
			return result;
		}
		return false;
	},

	/**
	 * Find record with key value.
	 * <br />Key value is field value of key field, and key field is defined by property {@link jslet.data.Dataset#keyField}.
	 * 
	 * @param {Object} keyValue Key value.
	 * 
	 * @return {Boolean}
	 */
	findByKey: function (keyValue) {
		var keyField = this.keyField();
		if (!keyField) {
			return false;
		}
		return this.findByField(keyField, keyValue);
	},

	/**
	 * Find record and return the specified field value.
	 * 
	 *     @example
	 *     dsObj.lookup('department', 23, 'address'); // find department which id is 23, if found, return its address.
	 * 
	 * @param {String} fldName Field name.
	 * @param {Object} findingValue Finding field value.
	 * @param {String} returnFieldName Return value field name.
	 * 
	 * @return {Object} Field value.
	 */
	lookup: function (fldName, findingValue, returnFieldName) {
		jslet.Checker.test('lookup#fldName', fldName).required().isString();
		jslet.Checker.test('lookup#returnFieldName', returnFieldName).required().isString();
		
		if(fldName == returnFieldName) {
			return findingValue;
		}
		if (this.findByField(fldName, findingValue)) {
			return this.getFieldValue(returnFieldName);
		} else {
			return null;
		}
	},

	/**
	 * Find record with key value and return the specified field value.
	 * <br />Key value is field value of key field, and key field is defined by property {@link jslet.data.Dataset#keyField}.
	 * 
	 *     @example
	 *     dsObj.lookupByKey(23, 'address'); // find department which id is 23, if found, return its address.
	 * 
	 * @param {Object} keyValue Key value
	 * @param {String} returnFieldName Return value field name.
	 * 
	 * @return {Object} Field value.
	 */
	lookupByKey: function(keyValue, returnFldName) {
		if (this.findByKey(keyValue)) {
			return this.getFieldValue(returnFldName);
		} else {
			return null;
		}
	},
	
	/**
	 * Check whether the field value of 'fldName' is the parent value or one of the children of 'parentValue'.
	 * 
	 * @param {String} fldname Field name which is checking, this field must connect a 'tree-style' dataset.
	 * @param {Object} parentValue The value which to be checked.
	 * @param {Boolean} onlyDirectChildren True - only the direct children to be used to check, false - otherwise.
	 * 
	 * @return {Boolean} True - the field value of current record is one of the children of the 'parentValue', false -otherwise.
	 */
	inChildrenAndSelf: function(fldName, parentValue, onlyDirectChildren) {
		jslet.Checker.test('inchildren#fldName', fldName).required().isString();
		jslet.Checker.test('inchildren#parentValue', parentValue).required();
		var fldValue = this.getFieldValue(fldName);
		if(jslet.compareValue(fldValue, parentValue) === 0) {
			return true;
		}
		return this.inChildren(fldName, parentValue, onlyDirectChildren);
	},
	
	/**
	 * Check whether the field value of 'fldName' is one of the children of 'parentValue' or not.
	 * 
	 * @param {String} fldname Field name which is checking, this field must connect a 'tree-style' dataset;
	 * @param {Object} parentValue The value which is used to check;
	 * @param {Boolean} onlyDirectChildren True - only the direct children to be used to check, false - otherwise.
	 * 
	 * @return {Boolean} True - the field value of current record is one of the children of the 'parentValue', false -otherwise.
	 */
	inChildren: function(fldName, parentValue, onlyDirectChildren) {
		jslet.Checker.test('inchildren#fldName', fldName).required().isString();
		jslet.Checker.test('inchildren#parentValue', parentValue).required();
		var Z = this,
			fldObj = Z.getField(fldName);
		if(!fldObj) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNotFound, [fldName]));
		}
		var lookup = fldObj.lookup();
		if(!lookup) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.lookupFieldExpected, [fldName]));
		}
		var lkds = lookup.dataset();
		jslet.Checker.test('inchildren#lookupDataset', lkds).required();
		jslet.Checker.test('inchildren#lookupDataset.parentField', lkds.parentField()).required();
		if(!lkds.findByKey(parentValue)) {
			return false;
		}
		var fldValue = Z.getFieldValue(fldName);
		var found = false;
		lkds.iterateChildren(function(isDirectChild) {
			var breakIterator = false;
			if(!onlyDirectChildren || (onlyDirectChildren && isDirectChild)) {
				if(jslet.compareValue(lkds.keyValue(), fldValue) === 0) {
					breakIterator = true;
					found = true;
				}
			}
			return breakIterator;
		});
		return found;
	},

	/**
	 * Copy dataset's data. Example:
	 * 
	 *     @example
	 *     dsObj.copyDataset(true); //return filtered records
	 *     dsObj.copyDataset(); //return all records
	 * 
	 * @param {Boolean} baseOnCurrentFilter If true, copy data base on the dataset's filter.
	 * 
	 * @return {Object[]} Array of records. 
	 */
	copyDataset: function (underCurrentFilter) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return null;
		}
		var result = [];

		if ((!underCurrentFilter || !Z._filtered)) {
			return Z.records().slice(0);
		}

		var foundRecno = -1, 
			oldRecno = Z._recno, 
			oldFiltered = Z._filtered;
		if (!underCurrentFilter) {
			Z._filtered = false;
		}

		Z._silence++;
		try {
			Z.first();
			while (!Z.isEof()) {
				result.push(Z.getRecord());
				Z.next();
			}
		} finally {
			Z._silence--;
			Z._recno = oldRecno;
			if (!underCurrentFilter) {
				Z._filtered = oldFiltered;
			}
		}
		return result;
	},

	/**
	 * @property
	 * 
	 * Set or get 'key' field name. Example:
	 * 
	 *     @example
	 *     dsObj.keyField('deptId'); //Set property, return this.
	 *     var propValue = dsObj.keyField(); //Get property value.
	 * 
	 * @param {String | undefined} keyFldName Key field name.
	 * @return {this | String}
	 */
	keyField: function (keyFldName) {
		if (keyFldName === undefined) {
			return this._keyField;
		}
		jslet.Checker.test('Dataset.keyField', keyFldName).isString();
		this._keyField = keyFldName? jslet.trim(keyFldName): null;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get 'code' field name. Example:
	 * 
	 *     @example
	 *     dsObj.codeField('deptCode'); //Set property, return this.
	 *     var propValue = dsObj.codeField(); //Get property value.
	 * 
	 * @param {String | undefined} codeFldName Code field name.
	 * @return {this | String}
	 */
	codeField: function (codeFldName) {
		if (codeFldName === undefined) {
			return this._codeField || this.keyField();
		}
		
		jslet.Checker.test('Dataset.codeField', codeFldName).isString();
		this._codeField = codeFldName? jslet.trim(codeFldName): null;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get 'name' field name. Example:
	 * 
	 *     @example
	 *     dsObj.nameField('deptName'); //Set property, return this.
	 *     var propValue = dsObj.nameField(); //Get property value.
	 * 
	 * @param {String | undefined} nameFldName 'Name' field name.
	 * @return {this | String}
	 */
	nameField: function (nameFldName) {
		if (nameFldName === undefined) {
			return this._nameField || this.codeField();
		}
		
		jslet.Checker.test('Dataset.nameField', nameFldName).isString();
		this._nameField = nameFldName? jslet.trim(nameFldName): null;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get 'parent' field name, this perperty is only used for hierarchy(tree-style) dataset. Example:
	 * 
	 *     @example
	 *     dsObj.parentField('deptName'); //Set property, return this.
	 *     var propValue = dsObj.parentField(); //Get property value.
	 * 
	 * @param {String | undefined} parentFldName Parent field name.
	 * @return {this | String}
	 */
	parentField: function (parentFldName) {
		if (parentFldName === undefined) {
			return this._parentField;
		}
		
		jslet.Checker.test('Dataset.parentField', parentFldName).isString();
		this._parentField = parentFldName? jslet.trim(parentFldName): null;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get level order field name, this perperty is only used for hierarchy(tree-style) dataset. Example:
	 * 
	 *     @example
	 *     dsObj.levelOrderField('levelOrder'); //Set property, return this.
	 *     var propValue = dsObj.levelOrderField(); //Get property value.
	 * 
	 * @param {String | undefined} fldName Level order field name.
	 * @return {this | String}
	 */
	levelOrderField: function(fldName) {
		if (fldName === undefined) {
			return this._levelOrderField;
		}
		
		jslet.Checker.test('Dataset.levelOrderField', fldName).isString();
		this._levelOrderField = fldName? jslet.trim(fldName): null;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get 'select' field name. "Select field" is a field to store the selected state of a record. Example:
	 * 
	 *     @example
	 *     dsObj.selectField('levelOrder'); //Set property, return this.
	 *     var propValue = dsObj.selectField(); //Get property value.
	 * 
	 * @param {String} selectFldName - Select field name.
	 * @return {this | String}
	 */
	selectField: function (selectFldName) {
		if (selectFldName === undefined) {
			return this._selectField ;
		}
		
		jslet.Checker.test('Dataset.selectField', selectFldName).isString();
		this._selectField = selectFldName? jslet.trim(selectFldName): null;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get 'status' field name. "Status field" is a field to store the status of a record.
	 * It's usually used for disabled or enabled of a record. Example:
	 * 
	 *     @example
	 *     dsObj.statusField('levelOrder'); //Set property, return this.
	 *     var propValue = dsObj.statusField(); //Get property value.
	 * 
	 * @param {String} statusFldName Status field name.
	 * @return {this | String}
	 */
	statusField: function (statusFldName) {
		if (statusFldName === undefined) {
			return this._statusField;
		}
		
		jslet.Checker.test('Dataset.statusField', statusFldName).isString();
		this._statusField = statusFldName? jslet.trim(statusFldName): null;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get context rules.
	 * 
	 * @param {jslet.data.ContextRule[] | undefined} contextRule Context rule.
	 * @return {this | jslet.data.ContextRule[]}
	 */
	contextRules: function (rules) {
		var Z = this;
		if (rules === undefined) {
			return Z._contextRules;
		}
		if(jslet.isString(rules)) {
			rules = rules? jslet.JSON.parse(rules): null;
		}
		jslet.Checker.test('Dataset.contextRules', rules).isArray();
		if(!rules || rules.length === 0) {
			Z._contextRules = null;
			Z._contextRuleEngine = null;
		} else {
			var ruleObj;
			for(var i = 0, len = rules.length; i < len; i++) {
				ruleObj = rules[i];
				if(!ruleObj.className || 
						ruleObj.className != jslet.data.ContextRule.className) {
					
					rules[i] = new jslet.data.ContextRule(ruleObj);
				}
			}
			Z._contextRules = rules;
			Z._contextRuleEngine = new jslet.data.ContextRuleEngine(Z);
			Z._contextRuleEngine.compile();
			Z.enableContextRule();
		}
		return this;
	},
	
	/**
	 * Disable context rule.
	 * 
	 * @return {this}
	 */
	disableContextRule: function () {
		this._contextRuleEnabled = false;
//		this.restoreContextRule();
		return this;
	},

	/**
	 * Enable context rule, any context rule will be calculated.
	 * 
	 * @return {this}
	 */
	enableContextRule: function () {
		this._contextRuleEnabled = true;
		this.calcContextRule();
		return this;
	},

	/**
	 * Check whether context rule is enabled or not.
	 * 
	 * @return {Boolean}
	 */
	isContextRuleEnabled: function () {
		return this._contextRuleEnabled;
	},

	/**
	 * @private
	 */
	calcContextRule: function (changedField) {
		var Z = this;
		if(!Z._contextRuleEnabled || Z.recordCount() === 0) {
			return;
		}
		
		if(Z._contextRuleEngine) {
			Z._inContextRule = true;
			try {
				Z._contextRuleEngine.evalRule(changedField);
			} finally {
				Z._inContextRule = false;
			}
		}
	},

	/**
	 * @private
	 */
	_refreshProxyField: function(dataRecord, isSilence) {
		var Z = this;
		if(!Z._proxyFields || Z.recordCount() === 0) {
			return;
		}
		if(!dataRecord) {
			dataRecord = Z.getRecord();
		}

		var fldObj;
		for(var i = 0, len = Z._proxyFields.length; i < len; i++) {
			fldObj = Z._proxyFields[i];
			fldObj.changeProxyFieldName(dataRecord, isSilence);
		}
	},
	

	/**
	 * Check current record whether it's selectable.
	 * 
	 * @return {Boolean}
	 */
	checkSelectable: function (recno) {
		if(this.recordCount() === 0) {
			return false;
		}
		if(this._onCheckSelectable) {
			var eventFunc = jslet.getFunction(this._onCheckSelectable);
			if(eventFunc) {
				return eventFunc.call(this, recno);
			}
		}
		return true;
	},
	
	/**
	 * @property
	 * 
	 * Set or get selected state of current record. Example:
	 * 
	 *     @example
	 *     dsObj.selected(true); //Set property, return this.
	 *     var propValue = dsObj.selected(); //Get property value.
	 * 
	 * @param {Boolean | undefined} selected.
	 * 
	 * @return {this | Boolean}
	 */
	selected: function (selected) {
		var Z = this;
		var selFld = Z._selectField || jslet.global.selectStateField,
			rec = Z.getRecord();
		
		if(selected === undefined) {
			return rec && rec[selFld];
		}
		
		if(rec) {
			if(Z.checkSelectable()) {
				Z._aborted = false;
				try {
					Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESELECT);
					if (Z._aborted) {
						return Z;
					}
				} finally {
					Z._aborted = false;
				}
				rec[selFld] = selected;
				Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSELECT);
				if(this._contextRuleEngine) {
					this._contextRuleEngine.evalRule();
				}
			}
		}
		return Z;
	},
	
	/**
	 * Get selected state of specified record. Example:
	 * 
	 *     @example
	 *     dsObj.selected(true);
	 *     dsObj.selectedByRecno(); //return true
	 * 
	 * @param {Integer} recno (optional) Record number, if recno is not applied, return current record selected state.
	 * 
	 * @return {this | Boolean}
	 */
	selectedByRecno: function(recno) {
		var Z = this,
			selFld = Z._selectField || jslet.global.selectStateField,
			rec = Z.getRecord(recno);
		
		return rec && rec[selFld];
	},
	
	/**
	 * Select / unselect all records.
	 * 
	 * @param {Boolean} selected True - select records, false otherwise.
	 * @param {Function} onSelectAll Select event handler.
	 * @param {jslet.data.Dataset} onSelectAll.dataset Current dataset.
	 * @param {Boolean} onSelectAll.selected True - select records, false otherwise.
	 * @param {Boolean} onSelectAll.return True - allow user to select, false - otherwise.
	 * @param {Boolean} noRefresh True - refresh controls, false - otherwise.
	 * 
	 * @return {this}
	 */
	selectAll: function (selected, onSelectAll, noRefresh) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return this;
		}
		try {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESELECTALL);
			if (Z._aborted) {
				return this;
			}
		} finally {
			Z._aborted = false;
		}

		jslet.Checker.test('Dataset.selectAll#onSelectAll', onSelectAll).isFunction();
		var oldRecno = Z.recno();
		try {
			for (var i = 0, cnt = Z.recordCount(); i < cnt; i++) {
				Z.recnoSilence(i);

				Z.selected(selected);
			}
		} finally {
			Z.recnoSilence(oldRecno);
		}
		if (onSelectAll) {
			onSelectAll(this, selected);
		}
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSELECTALL);
		if (!noRefresh) {
			var evt = jslet.data.RefreshEvent.selectAllEvent(selected);
			Z.refreshControl(evt);
		}
		return this;
	},

	/**
	 * Select/unselect record by key value.
	 * 
	 * @param {Boolean} selected True - select records, false otherwise.
	 * @param {Object} keyValue Key value.
	 * @param {Boolean} noRefresh True - refresh controls, false - otherwise.
	 * 
	 * @return {this}
	 */
	selectByKeyValue: function (selected, keyValue, noRefresh) {
		var Z = this,
			oldRecno = Z.recno(),
			cnt = Z.recordCount(),
			v, changedRecNum = [];
		try {
			for (var i = 0; i < cnt; i++) {
				Z.recnoSilence(i);
				v = Z.getFieldValue(Z._keyField);
				if (v == keyValue) {
					Z.selected(selected);
					changedRecNum.push(i);
					break;
				}
			} //end for
		} finally {
			Z.recnoSilence(oldRecno);
		}
		if (!noRefresh) {
			var evt = jslet.data.RefreshEvent.selectRecordEvent(changedRecNum, selected);
			Z.refreshControl(evt);
		}
		return this;
	},

	/**
	 * Select current record or not.
	 * If 'selectBy' is not empty, select all records which value of 'selectBy' field is same as the current record. Example:
	 * 
	 *     @example
	 *     dsEmployee.select(true); //select current record
	 *     dsEmployee.select(true, 'gender'); //if the 'gender' of current value is female, all female employees will be selected.  
	 * 
	 * @param {Boolean} selected True - select records, false - unselect records.
	 * @param {String} selectBy Field names, multiple fields separated with ','.
	 * 
	 * @return {this}
	 */
	select: function (selected, selectBy) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return this;
		}

		var changedRecNum = [];
		if (!selectBy) {
			Z.selected(selected);
			changedRecNum.push(Z.recno());
		} else {
			var arrFlds = selectBy.split(','), 
				arrValues = [], i, 
				fldCnt = arrFlds.length;
			for (i = 0; i < fldCnt; i++) {
				arrValues[i] = Z.getFieldValue(arrFlds[i]);
			}
			var v, preRecno = Z.recno(), flag;
			try {
				for (var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
					Z.recnoSilence(k);
					flag = 1;
					for (i = 0; i < fldCnt; i++) {
						v = Z.getFieldValue(arrFlds[i]);
						if (v != arrValues[i]) {
							flag = 0;
							break;
						}
					}
					if (flag) {
						Z.selected(selected);
						changedRecNum.push(Z.recno());
					}
				}
			} finally {
				Z.recnoSilence(preRecno);
			}
		}

		var evt = jslet.data.RefreshEvent.selectRecordEvent(changedRecNum, selected);
		Z.refreshControl(evt);
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get data provider.
	 * 
	 * @param {jslet.data.DataProvider | undefined} provider Data provider
	 * @return {this | jslet.data.DataProvider}
	 */
	dataProvider: function (provider) {
		if (provider === undefined) {
			return this._dataProvider;
		}
		this._dataProvider = provider;
		return this;
	},
	
	/**
	 * @private
	 */
	_checkDataProvider: function () {
		if (!this._dataProvider) {
			throw new Error('DataProvider required, use: yourDataset.dataProvider(yourDataProvider);');
		}
	},

	/**
	 * Get all selected records
	 * 
	 * @return {Object[]} Array of records
	 */
	selectedRecords: function () {
		var Z = this;
		if (!Z.hasRecord()) {
			return null;
		}

		var preRecno = Z.recno(), result = [];
		try {
			for (var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
				Z.recnoSilence(k);
				if(Z.selected()) {
					result.push(Z.getRecord());
				}
			}
		} finally {
			Z.recnoSilence(preRecno);
		}
		
		return result;
	},

	hasSelectedRecords: function() {
		var Z = this, found = false;
		Z.iterate(function() {
			if(this.selected()) {
				found = true;
				return true;
			}
		});
		return found;
	},
	
	/**
	 * Get all key values of selected records.
	 * 
	 * @return {Object[]} Array of selected record key values
	 */
	selectedKeyValues: function () {
		var oldRecno = this.recno(), result = [];
		try {
			for (var i = 0, cnt = this.recordCount(); i < cnt; i++) {
				this.recnoSilence(i);
				var state = this.selected();
				if (state && state !== 2) { // 2: partial select
					result.push(this.getFieldValue(this._keyField));
				}
			}
		} finally {
			this.recnoSilence(oldRecno);
		}
		if (result.length > 0) {
			return result;
		} else {
			return null;
		}
	},

	/**
	 * Set or get query url. Example:
	 * 
	 *     @example
	 *     dsObj.queryUrl('/test/query.do'); //Set property, return this.
	 *     var propValue = dsObj.queryUrl(); //Get property value.
	 * 
	 * @param {String | undefined} queryUrl Query url.
	 * 
	 * @return {this | String}
	 */
	queryUrl: function(url) {
		if(url === undefined) {
			return this._queryUrl;
		}
		jslet.Checker.test('Dataset.queryUrl', url).isString();
		this._queryUrl = url? jslet.trim(url): null;
		return this;
	},
	
	/**
	 * Query data from server. Example:
	 * 
	 *     @example
	 *     dsEmployee.queryUrl('../getemployee.do');
	 *     var criteria = {name:'Bob', age:25};
	 *     dsEmployee.query(condition).done(function() {
	 *     	 console.log('done');
	 *     });
	 * 
	 * @param {Object | jslet.data.Dataset} criteria Condition should be a plan object or a dataset which stores query criteria.
	 * 
	 * @return {Object} jQuery promise.
	 */
	query: function (criteria) {
		if(criteria && criteria instanceof jslet.data.Dataset) {
			var criteriaDataset = criteria;
			criteriaDataset.confirm();
			if(criteriaDataset.checkAndShowError()) {
				return new jslet.EmptyPromise('fail');
			}
			criteria = criteriaDataset.getRecord();
		}
		this._queryCriteria = criteria;
		return this.requery();
	},

	_doQuerySuccess: function(result, dataset) {
		var Z = dataset;
		if (!result) {
			Z.records([]);
			if(result && result.info) {
				jslet.showInfo(result.info);
			}
			return;
		}
		if(Z._onDataQuerying) {
			Z._onDataQuerying(result);
		}
		var metas = result.meta;
		if(metas && metas.main) {
			Z._createDatasetByMeta(Z._name, metas.main);
		}
		var mainData = result.main;
		if (mainData) {
			Z.records(mainData);
		}
		var others = result.others;
		if(others) {
			var dsName, dsObj;
			for (dsName in others) {
				if(metas && metas[dsName]) {
					Z._createDatasetByMeta(Z._name, metas[dsName]);
				}
				dsObj = jslet.data.getDataset(dsName);
				if (dsObj) {
					dsObj.records(others[dsName]);
				} else {
					console.warn(dsName + ' is returned from server, but this datase does not exist!');
				}
			}
		}
		if (result.pageNo) {
			Z._pageNo = result.pageNo;
		}
		if (result.pageCount) {
			Z._pageCount = result.pageCount;
		}
		if(Z._onDataQueried) {
			Z._onDataQueried.call(Z);
		}

		var evt = jslet.data.RefreshEvent.changePageEvent();
		Z.refreshControl(evt);
		if(result && result.info) {
			jslet.showInfo(result.info);
		}
	},
	
	_createDatasetByMeta: function(dsName, dsMeta) {
		var dsObj = jslet.data.getDataset(dsName);
		var fields = dsMetaFields;
		if(!dsObj) {
			dsObj = new jslet.data.Dataset({name: dsName, fields: fields});
		} else {
			dsObj.clearFields();
			var fldCfg;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldCfg = fields[i];
				dsObj.createField(fldCfg);
			}
		}
	},
	
	_doApplyError: function(result, dataset) {
		var Z = dataset,
			errCode = result.errorCode,
			errMsg = result.errorMessage;
		if(jslet.global.serverErrorHandler) {
			var catched = jslet.global.serverErrorHandler(errCode, errMsg);
			if(catched) {
				return;
			}
		}
		errMsg = errMsg + "[" + errCode + "]";
		Z.errorMessage(errMsg);
		if(Z._autoShowError) {
			jslet.showError(errMsg);
		}
	},
	
	/**
	 * Send request to refresh with current condition.
	 * 
	 * @return {Object} jQuery promise.
	 */
	requery: function () {
		var Z = this;
		Z._checkDataProvider();

		if(!this._queryUrl) {
			//QueryUrl required! Use: yourDataset.queryUrl(yourUrl)
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.queryUrlRequired, [Z.description()]));
			
		}
		if(Z._querying) { //Avoid duplicate submitting
			return;
		}
		Z._querying = true;
		try {
			var reqData = {};
			if(Z._pageNo > 0) {
				reqData.pageNo = Z._pageNo;
				reqData.pageSize = Z._pageSize;
			}
			var criteria = Z._queryCriteria;
			if(criteria) {
				if(jslet.isArray(criteria)) {
					reqData.criteria = criteria;
				} else {
					reqData.simpleCriteria = criteria;
				}
			}
			reqData = jslet.data.record2Json(reqData);
			var url = Z._queryUrl;
			return Z._dataProvider.sendRequest(Z, url, reqData)
			.done(Z._doQuerySuccess)
			.fail(Z._doApplyError)
			.always(function(){Z._querying = false;});
		} catch(e) {
			Z._querying = false;
		}
	},

	_setChangedState: function(flag, chgRecs, pendingRecs) {
		if(!chgRecs || chgRecs.length === 0) {
			return;
		}
		var result = this._addRecordClassFlag(chgRecs, flag, this._recordClass || jslet.global.defaultRecordClass);
		for(var i = 0, len = result.length; i < len; i++) {
			pendingRecs.push(result[i]);
		}
	},

	_addRecordClassFlag: function(records, changeFlag, recClazz) {
		var fields = this.getFields(),
			fldObj, i, len, 
			detailRecordClass = null;
		
		for(i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if(fldObj.getType() === jslet.data.DataType.DATASET) {
				if(!detailRecordClass) {
					detailRecordClass = {};
				}
				detailRecordClass[fldObj.name()] = fldObj.detailDataset().recordClass();
			}
		}
		var result = [], rec, pRec, dtlRecClazz, cnt;
		for (i = 0, cnt = records.length; i < cnt; i++) {
			rec = records[i];
			pRec = {};
			rec[jslet.global.changeStateField] = changeFlag + i;
			var fldValue;
			for(var prop in rec) {
				fldValue = rec[prop];
				if(fldValue && detailRecordClass) {
					dtlRecClazz = detailRecordClass[prop];
					if(dtlRecClazz) {
						fldValue = this._addRecordClassFlag(fldValue, changeFlag, dtlRecClazz);
					}
				}
				pRec[prop] = fldValue;
			}
			result.push(pRec);
		}
		return result;
	},
	
	_doSaveSuccess: function(result, dataset) {
		var Z = dataset,
			changedRecs, 
			needCalc = false;
		if (!result || !result.main || result.main.length === 0) {
			changedRecs = Z._pendingRecords;
		} else {
			changedRecs = result.main;
			needCalc = true;
		}
		Z._dataTransformer.refreshSubmittedData(changedRecs);
		if(needCalc) {
			Z._calcAggregatedValueDebounce.call(Z);
		}
		Z.selection.removeAll();
		if(Z._onDataSubmitted) {
			Z._onDataSubmitted.call(Z);
		}
		
		Z.refreshControl();
		Z.refreshLookupHostDataset();
		if(result && result.info) {
			jslet.showInfo(result.info);
		}
	},
	
	/**
	 * Set or get submit url. Example:
	 * 
	 *     @example
	 *     dsObj.submitUrl('/test/save.do'); //Set property, return this.
	 *     var propValue = dsObj.submitUrl(); //Get property value.
	 * 
	 * @param {String | undefined} submitUrl Submit url.
	 * 
	 * @return {this | String}
	 */
	submitUrl: function(url) {
		if(url === undefined) {
			return this._submitUrl;
		}

		jslet.Checker.test('Dataset.submitUrl', url).isString();
		this._submitUrl = url? jslet.trim(url): null;
		return this;
	},
	
	/**
	 * Check whether dataset exists changed records.
	 * 
	 * @return {Boolean}
	 */
	hasChangedData: function(noConfirm) {
		var Z = this;
		if(!noConfirm) {
			Z.confirm();
		}
		var records = Z.records(), record, recInfo;
		if(!records) {
			return false;
		}
		for(var i = 0, len = records.length; i < len; i++) {
			record = records[i];
			if(Z.recordChanged(record)) {
				return true;
			}
		}
		return false;
	},
	
	recordChanged: function(record) {
		if(!record) {
			return false;
		}
		var recInfo = jslet.data.getRecInfo(record);
		if(recInfo && recInfo.status && recInfo.status !== jslet.data.DataSetStatus.BROWSE) {
			return true;
		}
		return false;
	},
	
	/**
	 * Submit changed data to server. 
	 * If server side save data successfully and return the changed data, Jslet can refresh the local data automatically.
	 * 
	 * Cause key value is probably generated at server side(like sequence), we need an extra field which store an unique value to update the key value,
	 * this extra field is named by global variable: jslet.global.changeStateField(default is'rs'), its value will start a letter 'i', 'u' or 'd', and follow a random number.
	 * You don't care about it in client side, it is generated by Jslet automatically.
	 * 
	 * At server side, you can use the leading letter to distinguish which action will be sent to DB('i' for insert, 'u' for update and 'd' for delete)
	 * If the records need be changed in server(like sequence key or other calculated fields), you should return them back.Notice:
	 * you need not to change this value of extra field: '_s_', just return it. Example:
	 * 
	 *     @example
	 *     dsObj.insertRecord();
	 *     dsObj.setFieldValue('name','Bob');
	 *     dsObj.setFieldValue('code','A01');
	 *     dsObj.confirm();
	 *     dsObj.submitUrl('../save.do');
	 *     dsObj.submit().done(function() {
	 *       console.log('done'); 
	 *     });
	 * 
	 * @param {Object} extraData extraData to submit to server
	 * @param {Object} options Options.
	 * @param {jslet.data.RecordRange} options.range Record range, the default value is jslet.data.RecordRange.SELECTED
	 * @param {String[]} options.includeFields Array of field names which need be submitted to server;
	 * @param {String[]} options.excludeFields Array of field names which need not be submitted to server;
	 * @param {jslet.data.RecordRange | Object} options.detailRange For detail dataset the default record range is jslet.data.RecordRange.ALL.<br />
	 * 		if detailRange is a value of jslet.data.RecordRange, all detail dataset has the same record range. <br />
	 *      if detailRange is a object value, the value pattern is: {detailDatasetName: jslet.data.RecordRange}
	 * 
	 * @return {Object} jQuery promise.
	 */
	submit: function(extraData, options) {
		return this._innerSubmit(extraData, options);
	},
	
	/**
	 * Submit deleted data to server. 
	 * 
	 * @param {Object} extraData extraData to submit to server
	 * 
	 * @return {Object} jQuery promise.
	 */
	submitDeleted: function(extraData) {
		return this._innerSubmit(extraData, options, true);		
	},
	
	_innerSubmit: function(extraData, options, onlyDeleted) {
		var Z = this;
		var range = options && options.range,
			includeFields = options && options.includeFields,
			excludeFields = options && options.excludeFields;
		Z.confirm();
		if(Z.checkAndShowError(includeFields, excludeFields, range)) {
			return new jslet.EmptyPromise('fail');
		}
		Z._checkDataProvider();

		if(!Z._submitUrl) {
			//Dataset\'s submitUrl required! Use: yourDataset.submitUrl(yourUrl)
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.submitUrlRequired, [Z.description()]));
		}
		
		var	detailRange = options && options.detailRange;
		var changedRecs = Z._dataTransformer.getSubmittingChanged(range, detailRange);
		if(changedRecs && onlyDeleted) {
			for(var i = changedRecs.length - 1; i >= 0; i--) {
				if('d' !== changedRecs[i].rs[0]) {
					changedRecs.splice(i, 1);
				}
			}
		}
		if (!changedRecs || changedRecs.length === 0) {
			jslet.showInfo(jsletlocale.Dataset.noDataSubmit);
			return new jslet.EmptyPromise('fail');
		}
		if(Z._submitting) { //Avoid duplicate submitting
			return;
		}
		Z._submitting = true;
		try {
			var reqData = {},
				dsName = Z.name();
			reqData.mainName = dsName;
			reqData.main = changedRecs;
			var dataMetas = {};
			reqData.meta = dataMetas;
			Z._getSubmitMeta(Z, dataMetas, 'main');
			
			if(extraData) {
				reqData.extraData = extraData;
			}
			Z._pendingRecords = changedRecs;
			reqData = jslet.data.record2Json(reqData, Z._getExcludeFields(includeFields, excludeFields));
			var url = Z._submitUrl;
			return Z._dataProvider.sendRequest(Z, url, reqData)
			.done(Z._doSaveSuccess)
			.fail(Z._doApplyError)
			.always(function(){
				Z._submitting = false;
				Z._pendingRecords = null;
			});
		} catch(e) {
			console.error(e);
			Z._submitting = false;
			Z._pendingRecords = null;
		}
	},
	
	_getSubmitMeta: function(dsObj, dataMetas, dsName) {
		var Z = this,
			fields = [], fldObj,
			dataMeta = {fields: fields},
			fldMeta, dataType,
			clazzName = Z.recordClass();
		if(clazzName) {
			dataMeta.recordClass = clazzName;
		}
		if(!dsName) {
			dsName = dsObj.name();
		}
		dataMetas[dsName] = dataMeta;
		var fldList = dsObj._fields;
		for(var i = 0, len = fldList.length; i < len; i++) {
			fldObj = fldList[i];
			dataType = fldObj.dataType();
			if(dataType === jslet.data.DataType.DATE) {
				fldMeta = {name: fldObj.name(), dataType: dataType};
				fields.push(fldMeta);
				continue;
			}
			if(dataType === jslet.data.DataType.DATASET) {
				fldMeta = {name: fldObj.name(), dataType: dataType};
				var dsDetail = fldObj.detailDataset();
				fldMeta.detailDataset = dsDetail.name();
				Z._getSubmitMeta(dsDetail, dataMeta);
				fields.push(fldMeta);
				continue;
			}
		}
	},
	
	_doSubmitSelectedSuccess: function(result, dataset) {
		if(!result) {
			return;
		}
		var mainData = result.main;
		if (!mainData || mainData.length === 0) {
			if(result.info) {
				jslet.showInfo(result.info);
			}
			return;
		}
		var Z = dataset,
			deleteOnSuccess = Z._deleteOnSuccess_,
			arrRecs = Z.selectedRecords() || [],
			i, k, rec,
			records = Z.records();
		Z.selection.removeAll();
		if(deleteOnSuccess) {
			for(i = arrRecs.length; i >= 0; i--) {
				rec = arrRecs[i];
				k = records.indexOf(rec);
				records.splice(k, 1);
			}
			Z._refreshInnerRecno();
		} else {
			var newRec, oldRec, len;
			Z._dataTransformer.refreshSubmittedData(mainData);
		}
		Z._calcAggregatedValueDebounce.call(Z);
		if(Z._onDataSubmitted) {
			Z._onDataSubmitted.call(Z);
		}
		Z.refreshControl();
		Z.refreshLookupHostDataset();
		if(result && result.info) {
			jslet.showInfo(result.info);
		}
	},
	
	/**
	 * Send selected data to server whether or not the records have been changed. 
	 * Under some special scenarios, we need send user selected record to server to process. 
	 * Sever side need not send back the processed records. Example:
	 * 
	 *     @example
	 *     //Audit the selected records, if successful, delete the selected records.
	 *     dsObj.selectAll(true);
	 *     var options = {deleteOnSuccess: true};
	 *     dsObj.submitSelected('../audit.do', null, options);
	 *     
	 *     //Submit all records
	 *     options = {range: jslet.data.RecordRange.ALL};
	 *     dsObj.submitSelected('../audit.do', null, options);
	 *      
	 *     //Submit the current record
	 *     options = {range: jslet.data.RecordRange.CURRENT};
	 *     dsObj.submitSelected('../audit.do', null, options);
	 *      
	 *     //Submit the current record width included fields
	 *     options = {range: jslet.data.RecordRange.CURRENT,
	 *     			  includeFields: ['id', 'name']};
	 *     dsObj.submitSelected('../audit.do', null, options);
	 *      
	 *     //Set all detail datasets' record range
	 *     options = {detailRange: jslet.data.RecordRange.SELECTED};
	 *     dsObj.submitSelected('../audit.do', null, options);
	 *      
	 *     //Set some detail datasets' record range
	 *     //Assume the dataset has two detail dataset, named: 'dtlDsName1' and 'dtlDsName2'
	 *     options = {detailRange: {dtlDsName1: jslet.data.RecordRange.SELECTED, dtlDsName2: jslet.data.RecordRange.ALL};
	 *     dsObj.submitSelected('../audit.do', null, options);
	 * 
	 * @param {String} url Submitting URL.
	 * @param {Object} extraData extraData to submit to server
	 * @param {Object} options Options.
	 * @param {jslet.data.RecordRange} options.range Record range, the default value is jslet.data.RecordRange.SELECTED
	 * @param {Boolean} options.deleteOnSuccess If processing successfully at server side, delete the selected record or not.
	 * @param {Boolean} options.submitEmpty True - submit to server even user does not select records, false - (Default) stop submitting if not selecting any records.
	 * @param {String[]} options.includeFields Array of field names which need be submitted to server;
	 * @param {String[]} options.excludeFields Array of field names which need not be submitted to server;
	 * @param {jslet.data.RecordRange | Object} options.detailRange For detail dataset the default record range is jslet.data.RecordRange.ALL.<br />
	 * 		if detailRange is a value of jslet.data.RecordRange, all detail dataset has the same record range. <br />
	 *      if detailRange is a object value, the value pattern is: {detailDatasetName: jslet.data.RecordRange}
	 * 
	 */
	submitSelected: function (url, extraData, options) {
		var Z = this;
		Z.confirm();
		var range = options && options.range,
			includeFields = options && options.includeFields,
			excludeFields = options && options.excludeFields,
			submitEmpty = options && options.submitEmpty;
		if(range === undefined) {
			range = jslet.data.RecordRange.SELECTED;
		}
		if(Z.checkAndShowError(includeFields, excludeFields, range)) {
			return new jslet.EmptyPromise('fail');
		}
		Z._checkDataProvider();
		jslet.Checker.test('Dataset.submitSelected#url', url).required().isString();
		if(Z._submitting) { //Avoid duplicate submitting
			return;
		}
		Z._submitting = true;
		var deleteOnSuccess = options && options.deleteOnSuccess? true: false,
			detailRange = options && options.detailRange;
		try {
			var changedRecs = Z._dataTransformer.getSubmittingSelected(range, detailRange) || [];
			if (!submitEmpty && (!changedRecs || changedRecs.length === 0)) {
				jslet.showInfo(jsletlocale.Dataset.noDataSubmit);
				return new jslet.EmptyPromise('fail');
			}
	
			Z._deleteOnSuccess_ = deleteOnSuccess;
			
			var reqData = {},
				dsName = Z.name();
			reqData.mainName = dsName;
			reqData.main = changedRecs;
			var dataMetas = {};
			reqData.meta = dataMetas;
			Z._getSubmitMeta(Z, dataMetas, 'main');
			
			if(extraData) {
				reqData.extraData = extraData;
			}
			reqData = jslet.data.record2Json(reqData, Z._getExcludeFields(includeFields, excludeFields));
			console.log(reqData);
			return Z._dataProvider.sendRequest(Z, url, reqData)
			.done(Z._doSubmitSelectedSuccess)
			.fail(Z._doApplyError)
			.always(function(){
				Z._submitting = false;
			});
		} catch(e) {
			Z._submitting = false;
		}
	},

	_getExcludeFields: function(includeFields, excludeFields) {
		if(!includeFields || includeFields.length === 0) {
			return excludeFields || null;
		}
		var Z = this;
		var fields = Z.getNormalFields(), fldObj, fldName;
		var result = [], i, len;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldName = fldObj.name();
			if(includeFields.indexOf(fldName) < 0) {
				result.push(fldName);
			}
		}
		if(excludeFields) {
			for(i = 0, len = excludeFields.length; i < len; i++) {
				fldName = excludeFields[i];
				if(exFields.indexOf(fldName) < 0) {
					result.push(fldName);
				}
			}
		}
		return result;
	},
	
	/**
	 * @private
	 */
	_refreshInnerControl: function (updateEvt) {
		var i, cnt, ctrl;
		if (updateEvt.eventType == jslet.data.RefreshEvent.UPDATEALL || 
				updateEvt.eventType == jslet.data.RefreshEvent.CHANGEMETA) {
			cnt = this._linkedLabels? this._linkedLabels.length: 0;
			for (i = 0; i < cnt; i++) {
				ctrl = this._linkedLabels[i];
				if (ctrl.refreshControl) {
					ctrl.refreshControl(updateEvt);
				}
			}
		}
		cnt = this._linkedControls? this._linkedControls.length: 0;
		for (i = 0; i < cnt; i++) {
			ctrl = this._linkedControls[i];
			if (ctrl && ctrl.refreshControl) {
				ctrl.refreshControl(updateEvt);
			}
		}
	},

	/**
	 * Focus on the edit control that link specified field name.
	 * 
	 * @param {String} fldName Field name.
	 * 
	 * @return {this}
	 */
	focusEditControl: function (fldName) {
		if(jslet.temp.focusing || !fldName) {
			return this;
		}
		var Z = this, ctrl,
			fldObj = Z.getField(fldName);
		if(!fldObj) {
			console.warn('Not found field: ' + fldName + ' in dataset: ' + Z.name());
			return this;
		}
		var dsDetail = fldObj.detailDataset();
		if(dsDetail) {
			fldName = dsDetail.getFirstFocusField();
			dsDetail.focusEditControl(fldName);
			return this;
		}
		for (var i = Z._linkedControls.length - 1; i >= 0; i--) {
			ctrl = Z._linkedControls[i];
			if(!ctrl.field) {
				continue;
			}
			if (ctrl.field() == fldName) {
				//Avoid nesting call
				jslet.temp.focusing = true;
				try {
					ctrl.focus();
				} finally {
					jslet.temp.focusing = false;
					break;
				}
			}
		} //end for
		return this;
	},

	/**
	 * Focus the first error field.
	 * 
	 * @return {this}
	 */
	focusFirstErrorField: function() {
		var fldName = jslet.data.FieldError.getFirstErrorField(this.getRecord());
		if(!fldName) {
			return this;
		}
		this.focusEditControl(fldName);
		return this;
	},
	
	/**
	 * Refresh whole field.
	 * 
	 * @param {String} fldName field name.
	 * 
	 * @return {this}
	 */
	refreshField: function(fldName) {
		this.refreshControl(jslet.data.RefreshEvent.updateColumnEvent(fldName));
		return this;
	},
	
	/**
	 * Refresh lookup field.
	 * 
	 * @param {String} fldName field name.
	 * 
	 * @return {this}
	 */
	refreshLookupField: function(fldName) {
		var lookupEvt = jslet.data.RefreshEvent.lookupEvent(fldName);
		this.refreshControl(lookupEvt);
		return this;
	},
	
	/**
	 * @private 
	 */
	refreshControl: function (updateEvt, clearFieldCache) {
		if (this._lockCount) {
			return;
		}

		if (!updateEvt) {
			updateEvt = jslet.data.RefreshEvent.updateAllEvent();
		}
		if(clearFieldCache) {
			jslet.data.FieldValueCache.removeAllCache(this);			
		}
		this._refreshInnerControl(updateEvt);
	},

	/**
	 * @private 
	 */
	addLinkedControl: function (linkedControl) {
		if (linkedControl.isLabel) {
			this._linkedLabels.push(linkedControl);
		} else {
			this._linkedControls.push(linkedControl);
			var fldName = null;
			if(linkedControl.field) {
				fldName = linkedControl.field();
			}
			if(fldName && linkedControl.canFocus()) {
				if(!this._canFocusFields) {
					this._canFocusFields = [];
				}
				this._canFocusFields.push(fldName);
			}
		}
	},

	/**
	 * @private 
	 */
	removeLinkedControl: function (linkedControl) {
		var arrCtrls = linkedControl.isLabel ? this._linkedLabels : this._linkedControls;
		if(!arrCtrls) {
			return;
		}
		var k = arrCtrls.indexOf(linkedControl);
		if (k >= 0) {
			arrCtrls.splice(k, 1);
		}
		if(!linkedControl.isLabel && linkedControl.field) {
			var fldName = linkedControl.field();
			if(fldName) {
				k = this._canFocusFields.indexOf(fldName);
				if(k >= 0) {
					this._canFocusFields.splice(k, 1);
				}
			}
		}
	},

	refreshLookupHostDataset: function() {
		if(this._autoRefreshHostDataset) {
			jslet.data.datasetRelationManager.refreshLookupHostDataset(this._name);
		}
	},
	
	handleLookupDatasetChanged: function(fldName) {
		var Z = this;
		if(!Z._inContextRule) {
			jslet.data.FieldValueCache.clearAll(Z, fldName);
		}
		Z.refreshLookupField(fldName);
		//Don't use the following code, is will cause DBAutoComplete control issues.
		//this.refreshControl(jslet.data.RefreshEvent.updateColumnEvent(fldName));
	},

	innerExportTextArray: function(exportOption, csvFlag) {
		var Z = this;
		Z.confirm();
		if(Z.existDatasetError()) {
			console.warn(jsletlocale.Dataset.cannotConfirm);
		}

		var exportHeader = true,
			exportDisplayValue = true,
			onlySelected = false,
			onlyCurrent = false,
			recordRange = jslet.data.RecordRange.ALL,
			includeFields = null,
			excludeFields = null,
			escapeDate = true;
		
		if(exportOption && jQuery.isPlainObject(exportOption)) {
			if(exportOption.exportHeader !== undefined) {
				exportHeader = exportOption.exportHeader? true: false;
			}
			if(exportOption.recordRange !== undefined) {
				recordRange = exportOption.recordRange;
				onlyCurrent = (recordRange === jslet.data.RecordRange.CURRENT);
				onlySelected = (recordRange === jslet.data.RecordRange.SELECTED);
			}
			if(exportOption.includeFields !== undefined) {
				includeFields = exportOption.includeFields;
				jslet.Checker.test('Dataset.exportCsv#exportOption.includeFields', includeFields).isArray();
			}
			if(exportOption.excludeFields !== undefined) {
				excludeFields = exportOption.excludeFields;
				jslet.Checker.test('Dataset.exportCsv#exportOption.excludeFields', excludeFields).isArray();
			}
		}
		var fldCnt, dateFields = null, fldObj, fldName;
		var exportFields = jslet.temp.exportFields && jslet.temp.exportFields[Z.name()];
		if(!exportFields) {
			exportFields = [];
			fldCnt = Z._normalFields.length;
			for(var i = 0; i < fldCnt; i++) {
				fldObj = Z._normalFields[i];
				fldName = fldObj.name();
				if(includeFields && includeFields.length > 0) {
					if(includeFields.indexOf(fldName) < 0) {
						continue;
					}
				} else {
					if(!fldObj.visible()) {
						continue;
					}
				}
				if(excludeFields && excludeFields.length > 0) {
					if(excludeFields.indexOf(fldName) >= 0) {
						continue;
					}
				} 
				if(csvFlag && fldObj.getType() === jslet.data.DataType.DATE) {
					if(!dateFields) {
						dateFields = [];
					}
					dateFields.push(i);
				}
				exportFields.push(fldObj);
			}
			if(jslet.temp.exportFields) {
				jslet.temp.exportFields[Z.name()] = exportFields;
			}
		}
		
		var result = [], arrRec;
		
		fldCnt = exportFields.length;
		if (exportHeader) {
			arrRec = [];
			for(i = 0; i < fldCnt; i++) {
				fldObj = exportFields[i];
				fldName = fldObj.label();
				arrRec.push(fldName);
			}
			result.push(arrRec);
		}

		
		var text, dataType;
		
		function exportOneRecord() {
			arrRec = [];
			for(var i = 0; i < fldCnt; i++) {
				fldObj = exportFields[i];
				fldName = fldObj.name();
				//If Number field does not have lookup field, return field value, not field text. 
				//Example: 'amount' field
				dataType = fldObj.getType();
				if(dataType === jslet.data.DataType.DATASET) {
					arrRec.push(fldObj.detailDataset().innerExportTextArray({exportHeader: false}));
					continue;
				}
				if(dataType === jslet.data.DataType.NUMBER && !fldObj.lookup()) {
					text = fldObj.getValue();
					if(text === null || text === undefined) {
						text = '';
					} else {
						text += '';
					}
				} else {
					text = Z.getFieldText(fldName);
					if(text === null || text === undefined) {
						text = '';
					}
					if(text && dataType === jslet.data.DataType.STRING) {
						var replaceFn = text.replace;
						if(replaceFn) {
							text = jslet.removeHtmlTag(text);
						} else {
							text += '';
						}
					}
				}
				arrRec.push(text);
			}
			result.push(arrRec);
		}
		
		if(onlyCurrent) {
			exportOneRecord();
			return result;
		}
		var context = Z.startSilenceMove()
		try{
			Z.first();
			while(!Z.isEof()) {
				if (onlySelected && !Z.selected()) {
					Z.next();
					continue;
				}
				exportOneRecord();
				Z.next();
			} // end while
			if(!csvFlag) {
				return result;
			} else {
				return [result, dateFields];
			}
		}finally{
			Z.endSilenceMove(context);
		}
	},

	/**
	 * Export dataset as text array like: [[123,'dd'], [[234], 'ee']].
	 * 
	 * @param {Object} exportOption Export options.
	 * @param {Boolean} exportOption.exportHeader True - export with field labels, false -otherwise.
	 * @param {Boolean} exportOption.onlySelected True - export selected records, false -otherwise.
	 * @param {Boolean} exportOption.onlyCurrent True - export current record, false -otherwise.
	 * @param {String[]} exportOption.includeFields Array of field names which to be exported.
	 * @param {String[]} exportOption.excludeFields Array of field names which not to be exported.
	 * 
	 * @return {String[][]} Text array. 
	 */
	exportTextArray: function(exportOption) {
		jslet.temp.exportFields = {};
		try {
			return this.innerExportTextArray(exportOption);
		} finally {
			delete jslet.temp.exportFields;
		}
	},
	
	/**
	 * Export data with CSV format.
	 * 
	 * @param {Object} exportOption Export options.
	 * @param {Boolean} exportOption.exportHeader True - export with field labels, false -otherwise.
	 * @param {Boolean} exportOption.onlySelected True - export selected records, false -otherwise.
	 * @param {String[]} exportOption.includeFields Array of field names which to be exported.
	 * @param {String[]} exportOption.excludeFields Array of field names which not to be exported.
	 * 
	 * @return {String} Csv Text. 
	 */
	exportCsv: function(exportOption) {
		var textArr = this.innerExportTextArray(exportOption, true),
			dateFields = textArr[1];
		textArr = textArr[0];

		if(textArr.length === 0) {
			return '';
		}
		var escapeDate = true;
		if(exportOption.escapeDate !== undefined) {
			escapeDate = exportOption.escapeDate? true: false;
		}
		
		var	recArr = textArr[0],
			fldCnt = recArr.length,
			fldSeperator = ',', 
			surround='"',
			text, isDate = false;
		
		for(var i = 0, recCnt = textArr.length; i < recCnt; i++) {
			recArr = textArr[i];
			for(var j = 0; j < fldCnt; j++) {
				text = recArr[j];
				if(text) {
					text = text.replace(/"/g,'""');
					var isStartZero = false;
					if(text.startsWith('0')) {
						isStartZero = true;
					} else {
						isDate = false;
						if(escapeDate && dateFields && i > 0 && dateFields.indexOf(j) >= 0) {
							isDate = true;
						}
					}
					text = surround + text + surround;
					if(isStartZero || isDate) {
						text = '=' + text;
					}
				} else {
					text = '""';
				}
				recArr[j] = text;
			}
			textArr[i] = recArr.join(fldSeperator);
		}
		return textArr.join('\n');
	},

	/**
	 * Export data to CSV file.
	 *  
	 * @param {String} fileName Export file name.
	 * @param {Object} exportOption Export options.
	 * @param {Boolean} exportOption.exportHeader True - export with field labels, false -otherwise.
	 * @param {Boolean} exportOption.onlySelected True - export selected records, false -otherwise.
	 * @param {String[]} exportOption.includeFields Array of field names which to be exported.
	 * @param {String[]} exportOption.excludeFields Array of field names which not to be exported.
	 */
	exportCsvFile: function(fileName, exportOption) {
		jslet.Checker.test('Dataset.exportCsvFile#fileName', fileName).required().isString();
    	var str = this.exportCsv(exportOption);
        var a = document.createElement('a');
		
        var blob = new window.Blob([str], {'type': 'text\/csv'});
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
    },
    
	/** 
	* Get filtered data records. 
	* 
	* @return {Object[]} Filtered data records.
	*/ 
	filteredRecords: function() { 
		var Z= this, 
			result = [], 
			oldRecno = Z.recnoSilence(); 
		Z.confirm();
		try { 
			for(var i = 0, len = Z.recordCount(); i < len; i++) {
				Z.recnoSilence(i); 
				result.push(Z.getRecord()); 
			} 
		} finally { 
			Z.recnoSilence(oldRecno); 
		} 
		return result; 
	}, 

	filteredDataList: function() {
		return this.filteredRecords();
	},
	
	/** 
	* Iterate the whole dataset, and run the specified callback function. Example: 
	* 
	*     @example
	*     dataset.iterate(function(){
	* 	    var fldValue = this.getFieldValue('xxx');
	* 	    this.setFieldValue('xxx', fldValue);
	*     }); 
	* 
	* @param {Function} callBackFn Call back function to iterate.
	* @param {Boolean} callBackFn.return True - break iterating, false - continue iterating.
	* @param {Integer} startRecno Start record number to iterate.
	* @param {Integer} endRecno End record number to iterate.
	* 
	* @return {this}
	*/ 
	iterate: function(callBackFn, startRecno, endRecno) { 
		jslet.Checker.test('Dataset.iterate#callBackFn', callBackFn).required().isFunction(); 
		var Z= this, 
			context = Z.startSilenceMove(); 
		try{
			startRecno = startRecno || 0;
			if(endRecno !== 0 && !endRecno) {
				endRecno = Z.recordCount() - 1;
			}
			for(var k = startRecno; k <= endRecno; k++) {
				Z.recno(k);
				if(callBackFn) { 
					if(callBackFn.call(Z)) {
						break;
					} 
				} 
			} 
		}finally{ 
			Z.endSilenceMove(context); 
		} 
		return this; 
	}, 
	
	/**
	 * Set or get raw data records. Example:
	 * 
	 *     @example
	 *     var records = [{fld1: 123, fld2: 'test'}, {fld1: 100, fld2: 'world'}];
	 *     dsObj.records(records); //set data records.
	 *     var list = dsObj.records(); //return data records.
	 * 
	 * @param {Object[] | undefined} records Raw data records.
	 * 
	 * @return {this | Object[]}
	 */
	records: function (records) {
		var Z = this;
		if (records === undefined) {
			if(Z._masterField) {
				return Z.masterDataset().getFieldValue(Z._masterField);
			}
			return Z._records;
		}
		if(Z._isEnum && records && !jslet.isArray(records)) {
			var arrRecords = [];
			if(jslet.isString(records)) {
				var enumStr = jslet.trim(records);
				var recs = enumStr.split(','), recstr, rec;
				for (var i = 0, cnt = recs.length; i < cnt; i++) {
					recstr = jslet.trim(recs[i]);
					rec = recstr.split(':');
			
					arrRecords[arrRecords.length] = {
						'code' : jslet.trim(rec[0]),
						'name' : jslet.trim(rec[1])
					};
				}
			} else {
				for(var key in records) {
					arrRecords[arrRecords.length] = {code: key, name: records[key]};
				}
			}
			Z._records = arrRecords;
			Z._initialize();
			return this;
		}
		jslet.Checker.test('Dataset.records', records).isArray();
		if(Z._masterField) {
			if(records === null) {
				records = [];
			}
			Z.masterDataset().setFieldValue(Z._masterField, records);
		} else {
			Z._records = records;
		}
		Z._initialize();
		var fields = Z._detailDatasetFields;
		if(fields) {
			var fldObj, dsDetail;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				dsDetail = fldObj.detailDataset();
				if(dsDetail) {
					dsDetail.confirm();
					dsDetail._initialize();
				}
			}
		}
		Z.calcContextRule();
		return this;
	},
	
	dataList: function(dataList) {
		return this.records(dataList);
	},
	
	_initialize: function(isDetailDs) {
		var Z = this;
		if(!isDetailDs) { //Master dataset
			jslet.data.FieldValueCache.removeAllCache(Z);
			jslet.data.FieldError.clearDatasetError(Z);
			Z._changeLog.clear();
		}
		Z.status(jslet.data.DataSetStatus.BROWSE);
		Z._recno = -1;
		Z.disableControls();
		try {
			Z._sortByFields();
			Z.filter(null);
			if(Z.filtered() || Z.fixedFilter()) {
				Z._doFilterChanged();			
			} else {
				Z.calcAggregatedValue();
			}
			Z.first();
		} finally {
			Z.enableControls();
		}
		Z.refreshLookupHostDataset();
	},
	
	/**
	 * Return dataset data with field text, field text is formatted or calculated field value.
	 * You can use them to do your special processing like: use them in jquery template.
	 * 
	 * @param {String[]} includeFields Include fields to exports.
	 * @param {String[]} excludeFields Exclude fields to exports.
	 * 
	 * @return {String[][]}
	 */
	exportTextList: function(includeFields, excludeFields) {
		var Z = this;
		Z.confirm();
		
		var	oldRecno = Z.recno(), 
			result = [],
			fldCnt, arrFldObj,
			fldObj, fldName, textValue, textRec;
		if(includeFields || includeFields) {
			arrFldObj = [];
			for(var k = 0; k < fldCnt; k++) {
				fldObj = Z._normalFields[k];
				fldName = fldObj.name();
				if(includeFields && includeFields.indexOf(fldName) >= 0) {
					arrFldObj.push(fldObj);
				}
				if(!includeFields && excludeFields && excludeFields.indexOf(fldName) < 0) {
					arrFldObj.push(fldObj);
				}
			}
		} else {
			arrFldObj = Z._normalFields;
		}
		fldCnt = arrFldObj.length;
		try {
			for (var i = 0, cnt = Z.recordCount(); i < cnt; i++) {
				Z.recnoSilence(i);
				textRec = {};
				for(var j = 0; j < fldCnt; j++) {
					fldObj = arrFldObj[j];
					fldName = fldObj.name();
					if(fldObj.getType() === jslet.data.DataType.DATASET) {
						textValue = fldObj.detailDataset().exportTextList();
					} else {
						textValue = Z.getFieldText(fldName);
					}
					textRec[fldName] = textValue;
				}
				result.push(textRec);
			}
			return result;
		} finally {
			this.recnoSilence(oldRecno);
		}
	},
	
	/**
	 * Import data from a string value array. Example:
	 * 
	 *     @example
	 * 	   var textList = [{id: '1', name: 'Tom', department: 'QA'}, {id: '2', name: 'Jerry', department: 'Admin'}];
	 * 	   dataset.importTextList(textList);
	 * 
	 * @param {Object[]} textList A string array.
	 * @param {Integer} start (optional) The start position to import.
	 * @param {Integer} end (optional) The end position to import.
	 */
	importTextList: function(textList, start, end) {
		var Z = this;
		jslet.Checker.test('importTextList#textList', textList).isArray();
		if(!textList || textList.length === 0) {
			return;
		}
		if(!start) {
			start = 0;
		}
		if(!end && end !== 0) {
			end = textList.length - 1;
		}
		Z.disableControls();
		Z.clearFollowedValues();
		var oldValueFollowEnabled = Z.valueFollowEnabled();
		Z.valueFollowEnabled(false);
		var oldReadOnly = Z.readOnly();
		try {
			var rec, fldObj, fldName, fldText, 
				fldCnt = Z._normalFields.length,
				cacheFieldMap = {}, cacheField, 
				cacheValue, value, errObj,
				oldRecno = Z.recno();
			Z.readOnly(false);
			for(var i = start; i <= end; i++) {
				rec = textList[i];
				Z.appendRecord();
				for(var j = 0; j < fldCnt; j++) {
					fldObj = Z._normalFields[j];
					fldName = fldObj.name();
					fldText = rec[fldName];
					if(fldText === undefined || fldText === '' || fldText === null) {
						continue;
					}
					if(fldObj.lookup()) {
						cacheField = cacheFieldMap[fldName];
						if(cacheField) {
							cacheValue = cacheField[fldText];
						} else {
							cacheField = {};
							cacheFieldMap[fldName] = cacheField;
							cacheValue = null;
						}
						if(cacheValue) {
							value = cacheValue.value;
							errObj = cacheValue.error;
							Z.setFieldValue(fldName, value);
							if(errObj) {
								Z.setFieldError(fldName, errObj.message, null, errObj.inputText);
							}
						} else {
							Z.setFieldText(fldName, fldText);
							value = Z.getFieldValue(fldName);
							errObj = Z.getFieldError(fldName);
							cacheField[fldText] = {value: value, error: errObj};
						}
						continue;
					}
					if(fldObj.getType() === jslet.data.DataType.DATASET) {
						if(fldText.length === 0) { //"fldText" must be an array.
							continue;
						}
						fldObj.detailDataset().importTextList(fldText);
					} else {
						Z.setFieldText(fldName, fldText);
					}
				}
				Z.confirm();
			}
		} finally {
			Z._sortByFields();
			Z.readOnly(oldReadOnly);
			Z.valueFollowEnabled(oldValueFollowEnabled);
			Z.recno(oldRecno + 1);
			Z.enableControls();
		}
	},
	
	/**
	 * Export dataset snapshot. Dataset snapshot can be used for making a backup when inputing a lot of data. 
	 * 
	 * @return {Object} Dataset snapshot.
	 */
	exportSnapshot: function() {
		
		function getDetailSetting(masterDs, details) {
			var detail;
			var detailFields = masterDs._detailDatasetFields;
			if(!detailFields) {
				return;
			}
			var dtlFldObj, dsDetail;
			for(var i = 0, len = detailFields.length; i < len; i++) {
				dtlFldObj = detailFields[i];
				dsDetail = dtlFldObj.detailDataset();
				if(dsDetail) {
					detail = {name: dsDetail.name(), recno: dsDetail.recno(), status: dsDetail.status()};
					indexFields = dsDetail.indexFields();
					if(indexFields) {
						dsDetail.indexFields = indexFields;
					}
					filter = dsDetail.filter();
					if(filter) {
						dsDetail.filter = filter;
						dsDetail.filtered = dsDetail.filtered();
					}
					details.push(detail);
					
					getDetailSetting(dsDetail, details);
				}
			}
		}
		
		var Z = this;
		if(Z.records() === 0) {
			return null;
		}
		if(Z.masterDataset()) {
			throw new Error('Can not call this method on detail dataset! Call it on "' + Z.masterDataset().name() + '"!');
		}
		var	mainDs = {name: Z.name(), recno: Z.recno(), status: Z.status(), records: Z.records(), changedRecords: Z._changeLog._changedRecords};
		var indexFields = Z.indexFields();
		if(indexFields) {
			mainDs.indexFields = indexFields;
		}
		var filter = Z.filter();
		if(filter) {
			mainDs.filter = filter;
			mainDs.filtered = Z.filtered();
		}
		var result = {master: mainDs};
		var details = [];
		getDetailSetting(Z, details);
		result.details = details;
		
		return result;
	},
	
	/**
	 * Import a dataset snapshot.
	 * 
	 * @param {Object} snapshot Dataset snapshot.
	 */
	importSnapshot: function(snapshot) {
		jslet.Checker.test('Dataset.importSnapshot#snapshot', snapshot).required().isPlanObject();
		var master = snapshot.master;
		jslet.Checker.test('Dataset.importSnapshot#snapshot.master', master).required().isPlanObject();
		var Z = this,
			dsName = master.name;
		if(Z.masterDataset()) {
			throw new Error('Can not call this method on detail dataset! Call it on "' + Z.masterDataset().name() + '"!');
		}
		if(dsName != Z._name) {
			//Snapshot name: [{0}] does not match the current dataset name: [{1}], cannot import snapshot!
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.cannotImportSnapshot, [dsName, Z._name]));
		}
		Z._records = master.records || null;
		Z._changeLog._changedRecords = master.changedRecords;
		if(master.indexFields !== undefined) {
			Z.indexFields(master.indexFields);
		}
		if(master.filter !== undefined) {
			Z.filter(master.filter);
			Z.filtered(master.filtered);
		}
		if(master.recno >= 0) {
			Z._silence++;
			try {
				Z.recno(master.recno);
				if(master.status) {
					Z.status(master.status);
				}
			} finally {
				Z._silence--;
			}
		}
		Z.calcAggregatedValue();
		Z.refreshControl();
		var details = snapshot.details;
		if(!details || details.length === 0) {
			return;
		}
		var detail, dsDetail;
		for(var i = 0, len = details.length; i < len; i++) {
			detail = details[i];
			dsDetail = jslet.data.getDataset(detail.name);
			if(dsDetail) {
				if(detail.indexFields !== undefined) {
					dsDetail.indexFields(detail.indexFields);
				}
				if(detail.filter !== undefined) {
					dsDetail.filter(detail.filter);
					dsDetail.filtered(detail.filtered);
				}
				if(detail.recno >= 0) {
					dsDetail._silence++;
					try {
						dsDetail.recno(detail.recno);
						if(detail.status) {
							dsDetail.status(detail.status);
						}
					} finally {
						dsDetail._silence--;
					}
				}
				dsDetail.refreshControl();
			}
		}
	},
	
	/**
	 * Create field object. Example:
	 * 
	 *     @example
	 *     var fldObj = dsObj.createField({name:'field1', dataType:'N', label: 'field1 label'});
	 * 
	 * @param {Object} fieldConfig A json object which property names are same as jslet.data.Field. Example: {name: 'xx', dataType: 'N', ...}
	 * @param {jslet.data.Field} parent (optional) Parent field object.
	 * 
	 * @return {jslet.data.Field}
	 */
	createField: function (fieldConfig, parentFldObj, batchMode) {
		jslet.Checker.test('Dataset.createField#fieldConfig', fieldConfig).required().isObject();
		var Z = this;
		var dtype = fieldConfig.type || fieldConfig.dataType;
		
		if(dtype === jslet.data.DataType.EXTEND) {
			Z._createExtendField(fieldConfig, parentFldObj);
		} else {
			var fldObj = new jslet.data.Field(Z, fieldConfig, parentFldObj);
			Z.addField(fldObj, batchMode);
		}
		return fldObj;
	},
	
	_createExtendField: function(fldCfg, parentFldObj) {
		jslet.Checker.test('createExtendField#extendFields', fldCfg.extendFields).required().isArray();
		var Z = this;
		var asChild = fldCfg.asChild;
		if(asChild) {
			var pFldObj = parentFldObj;
			parentFldObj = new jslet.data.Field(Z, fldCfg, parentFldObj);
			if(!pFldObj) {
				Z.addField(parentFldObj);
			}
		}
		var extFldCfg = {}, 
			extFldCfgs = fldCfg.extendFields,
			onCreatingExtendField = fldCfg.onCreatingExtendField,
			fldObjs = [], fldObj, firstSumFldCfg, 
			totalExpr = '', 
			hostFldName = fldCfg.name, 
			hasSum = false;
		
		for(var i = 0, len = extFldCfgs.length; i < len; i++) {
			extFldCfg = extFldCfgs[i];
			if(onCreatingExtendField) {
				onCreatingExtendField(extFldCfg);
			}
			fldObj = new jslet.data.Field(Z, extFldCfg, parentFldObj);
			if(extFldCfg.needSum) {
				totalExpr += '+['+fldObj.name() + ']';
				if(!hasSum) {
					firstSumFldCfg = extFldCfg;
				}
				hasSum = true;
			}
			fldObj.extendHostName(hostFldName);
			fldObjs.push(fldObj);
		}
		if(hasSum) {
			extFldCfg = firstSumFldCfg;
			extFldCfg.name = fldCfg.name + '_sum';
			extFldCfg.label = jslet.trim((asChild? '' : (fldCfg.label || fldCfg.name)) + jsletlocale.Dataset.totalLabel);
			extFldCfg.formula = totalExpr.substring(1);
			fldObj = new jslet.data.Field(Z, extFldCfg, parentFldObj);
			fldObjs.push(fldObj);
		}
		if(!parentFldObj) {
			Z.addFields(fldObjs);
		}
		return fldObjs;
	},
	
	createFields: function(fieldConfigs) {
		if(!fieldConfigs) {
			return;
		}
		jslet.Checker.test('Dataset.createFields#fieldConfigs', fieldConfigs).isArray();
		var fldObj;
		for(var i = 0, len = fieldConfigs.length; i < len; i++) {
			this.createField(fieldConfigs[i], null, true);
		}
		this.refreshDisplayOrder();
		this.refreshAggregatedFields();
	},

	destroy: function () {
		var Z = this;
		Z._masterDataset = null;
		Z._masterField = null;
		Z._fields = null;
		Z._linkedLabels = null;
		Z._linkedControls = null;
		Z._innerFilter = null;
		Z._innerFindCondition = null;
		Z._sortingFields = null;
		Z._innerFormularFields = null;
		Z._aggregatedFields = null;
		
		jslet.data.dataModule[Z._name] = null;
		delete jslet.data.dataModule[Z._name];
		jslet.data.datasetRelationManager.removeDataset(Z._name);		
	}
	
};
// end Dataset

/**
 * Create Enum Dataset. This method is use to create the simple dataset.<br />
 * The created dataset has two fixed fields: 'code', 'name'. Example:
 * 
 *     @example
 *     var dsGender = jslet.data.createEnumDataset('gender', 'F:Female,M:Male');
 *     dsGender.getFieldValue('code');//return 'F'
 *     dsGender.getFieldValue('name');//return 'Female'
 *     dsGender.next();
 *     dsGender.getFieldValue('code');//return 'M'
 *     dsGender.getFieldValue('name');//return 'Male'
 * 
 * @member jslet.data
 * @param {String} dsName Dataset name;  
 * @param {String} enumStr A string which stores enumeration data, its format must be:[code]: [name], [code]: [name].
 * @return {jslet.data.Dataset}
 */
jslet.data.createEnumDataset = function(dsName, enumStrOrObj) {
	return new jslet.data.Dataset({name: dsName, isEnum: true, records: enumStrOrObj});
};

/**
 * Create dataset with dataset configuration which is stored in other place, like DB, IndexedDB.<br />
 * It will fire global event: {@link jslet.global.dataset#onDatasetCreating}, you can listen this event, load dataset configuration and create it.<br />
 * This method will not return dataset object. You can call {@link jslet.data#getDataset} to get the dataset object. 
 * 
 * @fires onDatasetCreating 
 * @member jslet.data
 * @param {String} datasetName Dataset's name;
 * @param {Object} creatingOption Creating option, pattern:
 * {maxCreatingLevel: x, includeFields: ['fieldName1','fieldName2',...], excludeFields: ['fieldName8',...], onlyLookupFields: true|false}
 * @param {Integer} creatingOption.maxCreatingLevel Specified the max creating level when creating dataset nested(host dataset -> lookup dataset -> lookup dataset-> ...). 
 * @param {String[]} creatingOption.includeFields Only create dataset with the specified field names.
 * @param {String[]} creatingOption.excludeFields Create dataset without the specified field names.
 * @param {Boolean} creatingOption.onlyLookupFields If onlyLookupFields is true, it will create dataset with fields which specified by the following dataset's properties: keyField, codeField, nameField, parentField and enabledField;
 * @param {jslet.data.DatasetType} creatingOption.datasetType The optional values are:  jslet.data.DatasetType.NORMAL, jslet.data.DatasetType.LOOKUP, jslet.data.DatasetType.DETAIL;
 * @param {String} creatingOption.realDatasetName Dataset creator uses "realDatasetName" to load dataset records.
 */
jslet.data.createDynamicDataset = function(dsName, creatingOption, hostDsName) {
	jslet.Checker.test('createDynamicDataset#dsName', dsName).required().isString();
	var dsObj = jslet.data.getDataset(dsName);
	if(dsObj) {
		return dsObj;
	}
	if(creatingOption && creatingOption.maxCreatingLevel) {
		jslet.data.defaultDatasetCreatingManager.setMaxCreateLevel(dsName, maxCreatingLevel);
	}
	var dsType = creatingOption.datasetType;
	var isLookup = dsType && dsType === jslet.data.DatasetType.LOOKUP;
	jslet.data.defaultDatasetCreatingManager.startCreateDataset(dsName, hostDsName, isLookup);
	if(jslet.global.dataset.onDatasetCreating) {
		jslet.global.dataset.onDatasetCreating(dsName, creatingOption);
	}
};

/**
 * Create dataset with field configurations. Example:
 * 
 *     @example
 *     var fldCfg = [{
 *       name: 'deptid',
 *       type: 'S',
 *       length: 10,
 *       label: 'ID'
 *     }, {
 *       name: 'name',
 *       type: 'S',
 *       length: 20,
 *       label: 'Dept. Name'
 *     }];
 *     var dsCfg = {keyField: 'deptid', codeField: 'deptid', nameField: 'name'};
 *     var dsDepartment = jslet.data.createDataset('department', fldCfg, dsCfg);
 * 
 * @member jslet.data
 * @param {String} datasetName Dataset name.
 * @param {Object[]} fieldConfigs A list of field configuration. See {@link jslet.data.Field} properties.
 * @param {Object} datasetProps Dataset properties, like: {keyField: '', codeField: '', ...}, see dataset properties.
 * @param {Integer} maxCreatingLevel Specified the max creating level when creating dataset nested(host dataset -> lookup dataset -> lookup dataset-> ...). 
 * @return {jslet.data.Dataset}
 */
jslet.data.createDataset = function(dsName, fieldConfig, dsCfg, maxCreatingLevel) {
	jslet.Checker.test('createDataset#dsName', dsName).required().isString();
	jslet.Checker.test('createDataset#fieldConfig', fieldConfig).required().isArray();
	jslet.Checker.test('Dataset.createDataset#datasetCfg', dsCfg).isPlanObject();
	if(maxCreatingLevel) {
		jslet.data.defaultDatasetCreatingManager.setMaxCreateLevel(dsName, maxCreatingLevel);
	}
	var dsObj = new jslet.data.Dataset(jQuery.extend({name: dsName, fields: fieldConfig}, dsCfg));
	jslet.data.defaultDatasetCreatingManager.endCreateDataset(dsName);
	if(dsObj.isFireGlobalEvent()) {
		var globalHandler = jslet.data.globalDataHandler.datasetCreated();
		if(globalHandler) {
			globalHandler(dsObj);
		}
	}
	return dsObj;
};

jslet.data.ChangeLog = function(dataset) {
	this._dataset = dataset;
	this._changedRecords = null;
};

jslet.data.ChangeLog.prototype = {
	changedRecords: function(changedRecords) {
		if(changedRecords === undefined) {
			return this._getChangedRecords();
		}
		this._changedRecords = changedRecords;
	},
	
	log: function(recObj) {
		if(!this._dataset.logChanges()) {
			return;
		}
		if(!recObj) {
			recObj = this._dataset.getRecord();
		}
		var recInfo = jslet.data.getRecInfo(recObj);
		if(!recInfo.status) {
			return;
		}
		var chgRecords = this._getChangedRecords();
		if(chgRecords.indexOf(recObj) < 0) {
			chgRecords.push(recObj);
		}
	},
	
	unlog: function(recObj) {
		if(!this._dataset.logChanges()) {
			return;
		}
		if(!recObj) {
			recObj = this._dataset.getRecord();
		}
		var chgRecords = this._getChangedRecords();
		var k = chgRecords.indexOf(recObj);
		if(k >= 0) {
			chgRecords.splice(k, 1);
		}
	},
	
	clear: function() {
		this._changedRecords = null;
	},
	
	_getChangedRecords: function() {
		var dsObj = this._dataset;
		var chgRecords,
		  	masterDsObj = dsObj.masterDataset(),
		  	masterFldName = dsObj.masterField();
		if(masterDsObj && masterFldName) {
			var masterRecInfo = jslet.data.getRecInfo(masterDsObj.getRecord());
			if(!masterRecInfo.detailLog) {
				masterRecInfo.detailLog = {};
			}
			chgRecords = masterRecInfo.detailLog[masterFldName];
			if(!chgRecords) {
				chgRecords = [];
				masterRecInfo.detailLog[masterFldName] = chgRecords;
			}
		} else {
			if(!this._changedRecords) {
				this._changedRecords = [];
			}
			chgRecords = this._changedRecords;
		}
		return chgRecords;
	}
	
};

jslet.data.DataTransformer = function(dataset) {
	this._dataset = dataset;
};

jslet.data.DataTransformer.prototype = {
		
	hasChangedData: function() {
		var chgRecList = this._dataset._changeLog.changedRecords();
		if(!chgRecList || chgRecList.length === 0) {
			return false;
		}
		return true;
	},
	
	getSubmittingChanged: function(range, detailRange) {
		if(!range || range === jslet.data.RecordRange.ALL) {
			range = jslet.data.RecordRange.CHANGED;
		}
		var chgRecList = this._getRecords(this._dataset, range);
		if(range !== jslet.data.RecordRange.CHANGED) {
			var newChgList = [], rec;
			var dsObj = this._dataset;
			for(var i = 0, len = chgRecList.length; i < len; i++) {
				rec = chgRecList[i];
				if(dsObj.recordChanged(rec)) {
					newChgList.push(rec);
				}
			}
			chgRecList = newChgList;
		}
		var result = this._convert(this._dataset, chgRecList, detailRange);
		return result;
	},
	
	getSubmittingSelected: function(range, detailRange) {
		if(!range && range !== jslet.data.RecordRange.ALL) {
			range = jslet.data.RecordRange.SELECTED;
		}
		var chgRecList = this._getRecords(this._dataset, range);
		var result = this._convert(this._dataset, chgRecList, detailRange);
		return result;
	},
	
	_getRecords: function(dsObj, range) {
		var result = null;
		switch(range) {
		case jslet.data.RecordRange.ALL:
			result = dsObj.records();
			break;
		case jslet.data.RecordRange.SELECTED:
			result = dsObj.selectedRecords();
			break;
		case jslet.data.RecordRange.CURRENT:
			result = [dsObj.getRecord()];
			break;
		case jslet.data.RecordRange.CHANGED:
			result =  dsObj._changeLog.changedRecords();
			break;
		}
		return result;
	},
	
	_convertRecord: function(dsObj, chgRec, detailRange, recInfo, recClazz) {
		var fldObj, newRec = {}, detailLog;
		for(var fldName in chgRec) {
			if(fldName === '_jl_') {
				continue;
			}
			fldObj = dsObj.getField(fldName);
			if(!fldObj || fldObj.getType() !== jslet.data.DataType.DATASET) {
				newRec[fldName] = chgRec[fldName];
				continue;
			}
			detailLog = recInfo.detailLog;
			var dsDetail = fldObj.detailDataset(),
				selStateFld = dsDetail.selectField() || jslet.global.selectStateField,
				dtlRange = detailRange;
			if(jslet.isObject(detailRange)) {
				dtlRange = detailRange[dsDetail.name()];
			}
			var allSubList = [], i, len,
				dtlRecs = chgRec[fldName], dtlRec;
			if(dtlRange === jslet.data.RecordRange.ALL) { //add deleted record
				if(dtlRecs) {
					for(i = 0, len = dtlRecs.length; i < len; i++) {
						dtlRec = dtlRecs[i];
						allSubList.push(dtlRec);
					}
				}
				detailLog = detailLog? detailLog[fldName]: null;
				if(detailLog) {
					for(i = 0, len = detailLog.length; i < len; i++) {
						var subChgRec = detailLog[i]; 
						var subRecInfo = jslet.data.getRecInfo(subChgRec);
						if(subRecInfo && subRecInfo.status === jslet.data.DataSetStatus.DELETE) {
							allSubList.push(subChgRec);
						}
					}
				}
			} else if(dtlRange === jslet.data.RecordRange.CHANGED) {
				allSubList = detailLog? detailLog[fldName]: null;
			} else if(dtlRange === jslet.data.RecordRange.SELECTED) {
				if(dtlRecs) {
					for(i = 0, len = dtlRecs.length; i < len; i++) {
						dtlRec = dtlRecs[i];
						if(dtlRec[selStateFld]) {
							allSubList.push(dtlRec);
						}
					}
				}
			}
			allSubList = this._convert(dsDetail, allSubList);
			if(allSubList) {
				newRec[fldName] = allSubList;
			}
		}
		return newRec;
	},
	
	_convert: function(dsObj, chgRecList, detailRange) {
		if(!detailRange) {
			detailRange = jslet.data.RecordRange.ALL;
		}
		
		if(!chgRecList || chgRecList.length === 0) {
			return null;
		}
		var chgRec, recInfo, status, newRec,
			recClazz = dsObj._recordClass || jslet.global.defaultRecordClass,
			result = [],
			detailLog,
			selStateFld = dsObj.selectField() || jslet.global.selectStateField;
		for(var i = 0, len = chgRecList.length; i < len; i++) {
			chgRec = chgRecList[i];
			recInfo = jslet.data.getRecInfo(chgRec);
			chgRec[jslet.global.changeStateField] = this._getStatusPrefix(recInfo.status, chgRec[selStateFld]) + Math.round(Math.random()*10000);
			var newRec = this._convertRecord(dsObj, chgRec, detailRange, recInfo, recClazz);
			result.push(newRec);
		}
		return result;
	},
	
	_getStatusPrefix: function(status, selected) {
		return  status === jslet.data.DataSetStatus.INSERT ? 'i' : 
			(status === jslet.data.DataSetStatus.UPDATE? 'u':
			 status === jslet.data.DataSetStatus.DELETE? 'd': (selected? 's': ''));
	},
			
	refreshSubmittedData: function(submittedData) {
		if(!submittedData || submittedData.length === 0) {
			return;
		}
		this._refreshDataset(this._dataset, submittedData);
	},
	
	_refreshDataset: function(dsObj, submittedData, isDetailDataset) {
		if(!submittedData || submittedData.length === 0) {
			return;
		}
		var masterFldObj = dsObj.getMasterFieldObject(),
			chgLogs = dsObj._changeLog.changedRecords(),
			newRec, oldRec, flag;
		for(var i = 0, len = submittedData.length; i < len; i++) {
			newRec = submittedData[i];
			if(!newRec) {
				//'The return record exists null. Please check it.'
				console.warn(jsletlocale.Dataset.serverReturnNullRecord);
				continue;
			}
			this._refreshRecord(dsObj, newRec, chgLogs);
		}
	},
		
	_refreshRecord: function(dsObj, newRec, chgLogs) {
		var recState = newRec[jslet.global.changeStateField];
		if(!recState) {
			return;
		}
		var i, len;
		if(chgLogs && recState.charAt(0) == 'd') {
			for(i = 0, len = chgLogs.length; i < len; i++) {
				if(recState == chgLogs[i][jslet.global.changeStateField]) {
					chgLogs.splice(i, 1);
					break;
				}
			}
			return;
		}
		var oldRec, fldObj,
			records = dsObj.records() || [];
		for(i = records.length - 1; i >= 0; i--) {
			oldRec = records[i];
			if(oldRec[jslet.global.changeStateField] != recState) {
				continue;
			}
			for(var fldName in newRec) {
				if(!fldName) {
					continue;
				}
				fldObj = dsObj.getField(fldName);
				if(fldObj && fldObj.detailDataset()) {
					this._refreshDataset(fldObj.detailDataset(), newRec[fldName], true);
				} else {
					oldRec[fldName] = newRec[fldName];
				}
			} // end for fldName
			if(chgLogs) {
				for(i = 0, len = chgLogs.length; i < len; i++) {
					if(recState == chgLogs[i][jslet.global.changeStateField]) {
						chgLogs.splice(i, 1);
						break;
					}
				}
			}
			oldRec[jslet.global.changeStateField] = null;
			var auditLog = oldRec[jslet.global.auditLogField];
			if(auditLog) {
				delete oldRec[jslet.global.auditLogField];
			}
			var recInfo = jslet.data.getRecInfo(oldRec);
			if(recInfo && recInfo.status) {
				recInfo.status = 0;
			}
			jslet.data.FieldValueCache.removeCache(oldRec);
		} // end for i
	}
};

/**
 * @class
 * 
 * Dataset factory. Example:
 * 
 *     @example
 *     var dsFactory = new jslet.data.DatasetFactory();
 *     dsFactory.createDataset(''); 
 */
jslet.data.DatasetFactory = function() {
	
	this._maxCreatingLevels = {};
	
	this._creatingDatasets = [];
	
	this._metaStores = [];
	
	this._doDatasetCreatedDebounce = jslet.debounce(this._doDatasetCreated, 100);
}

jslet.data.DatasetFactory.prototype = {
	
	/**
	 * Add a dataset meta store object. Example:
	 * 
	 *     @example
	 *     
	 *     //Array meta store
	 *     var datasetMetas = [{name: 'ds1', fields:[{name: 'field1', dataType: 'S', length: 20}, ...]}, ...];
	 *     var arrayMetaStore = {
	 *          getDatasetMeta: function(datasetName) {
	 *              var dsMeta;
	 *              for(var i = 0, len = datasetMetas.length; i++) {
	 *                  dsMeta = datasetMetas[i];
	 *                  if(dsMeta.name === datasetName) {
	 *                      return dsMeta
	 *                  }
	 *              }
	 *              return null;
	 *          }
	 *     }
	 *     jslet.data.datasetFactory.addMetaStore(arrayMetaStore);
	 *     
	 *     //IndexedDB meta store
	 *     var indexedDBMetaStore = new jslet.data.IndexedDBMetaStore('demo');
	 *     jslet.data.datasetFactory.addMetaStore(indexedDBMetaStore);
	 *     
	 * @param {jslet.data.DatasetMetaStore} metaStore A meta store object.
	 * 
	 * @return {this}
	 */
	addMetaStore: function(metaStore) {
		jslet.Checker.test('DatasetFactory.addMetaStore', metaStore).required();
		jslet.Checker.test('DatasetMetaStore.getDatasetMeta', metaStore.getDatasetMeta).required().isFunction();
		this._metaStores.push(metaStore);
		return this;
	},
	
	/**
	 * Create dataset with dataset configuration which is stored in other place, like DB, IndexedDB.<br />
	 * It will fire global event: {@link jslet.global.dataset#onDatasetCreating}, you can listen this event, load dataset configuration and create it.<br />
	 * This method will not return dataset object. You can call {@link jslet.data#getDataset} to get the dataset object. 
	 * 
	 * @fires onDatasetCreating 
	 * 
	 * @param {String | String[]} datasetNames Dataset name;
	 * @param {Object} creatingOption Creating option, pattern:
	 * {maxCreatingLevel: x, includeFields: ['fieldName1','fieldName2',...], excludeFields: ['fieldName8',...], onlyLookupFields: true|false}
	 * @param {Integer} creatingOption.maxCreatingLevel Specified the max creating level when creating dataset nested(host dataset -> lookup dataset -> lookup dataset-> ...). 
	 * @param {String[]} creatingOption.includeFields Only create dataset with the specified field names.
	 * @param {String[]} creatingOption.excludeFields Create dataset without the specified field names.
	 * @param {String[]} creatingOption.visibleFields Visible field names.
	 * @param {Boolean} creatingOption.onlyLookupFields If onlyLookupFields is true, it will create dataset with fields which specified by the following dataset's properties: keyField, codeField, nameField, parentField and statusField;
	 * @param {jslet.data.DatasetType} creatingOption.datasetType The optional values are:  jslet.data.DatasetType.NORMAL, jslet.data.DatasetType.LOOKUP, jslet.data.DatasetType.DETAIL;
	 * @param {String} creatingOption.realDatasetName Dataset creator uses "realDatasetName" to load dataset records.
	 * @param {String} creatingOption.hostDatasetName Host dataset name.
	 */
	createDataset: function(datasetNames, creatingOption) {
		var Z = this;
		if(!Z._metaStores || Z._metaStores.length === 0) {
			throw new Error(jsletlocale.DatasetFactory.datasetMetaStoreRequired);
		}
		jslet.Checker.test('createDataset#datasetNames', datasetNames).required();
		var deferred = jQuery.Deferred();
		function beforeCreateOneDataset(dsName, creatingOption) {
			var dsObj = jslet.data.getDataset(dsName);
			if(dsObj) {
				return null;
			}
			console.log('Creating dataset: ' + dsName)
			var dsType = null, hostDsName = null;
			if(creatingOption) {
				var hostDsName = creatingOption.hostDatasetName;
				if(hostDsName && !Z._canCreatingDataset(hostDsName)) {
					return null;
				}
				if(creatingOption.maxCreatingLevel) {
					Z._maxCreatingLevels[dsName] = creatingOption.maxCreatingLevel;
				}
				dsType = creatingOption.datasetType;
				hostDsName = creatingOption.hostDatasetName;
			}
			var isLookup = dsType && dsType === jslet.data.DatasetType.LOOKUP;
			Z._startCreateDataset(dsName, hostDsName, isLookup);
			return dsName;
		};
		
		function doCreate(dsName, creatingOption, metaStoreIndex) {
			var metaStoreIndex = metaStoreIndex || 0;
			if(metaStoreIndex > Z._metaStores.length - 1) {
				Z._innerCreateDataset(dsName, null, null, deferred);
				return;
			}
			var metaStore = Z._metaStores[metaStoreIndex];
			var realDsName = dsName;
			if(creatingOption && creatingOption.realDatasetName) {
				realDsName = creatingOption.realDatasetName;
			}
			var result = metaStore.getDatasetMeta(dsName);
			if(result && result.done) { //return promise;
				result.done(function(dsMeta) {
					if(dsMeta) {
						Z._innerCreateDataset(dsName, dsMeta, creatingOption, deferred);
					} else {
						doCreate(dsName, creatingOption, metaStoreIndex + 1);
					}
				}).fail(function() {
						doCreate(dsName, creatingOption, metaStoreIndex + 1);
				});
			} else {
				if(result) {
					Z._innerCreateDataset(dsName, result, creatingOption, deferred);
				} else {
					doCreate(dsName, creatingOption, metaStoreIndex + 1);
				}
			}
		}
		
		var dsName;
		if(jslet.isArray(datasetNames)) {
			var arrNames = [], i,
				len = datasetNames.length;
			for(i = 0; i < len; i++) {
				dsName = datasetNames[i];
				dsName = Z._beforeCreateOneDataset(dsName, creatingOption);
				if(dsName) {
					arrNames.push(dsName);
				}
			}
			len = arrNames.length;
			for(i = 0; i < len; i++) {
				doCreate(arrNames[i], creatingOption);
			}
		} else {
			if(beforeCreateOneDataset(datasetNames, creatingOption)) {
				doCreate(datasetNames, creatingOption);
			}
		}
		return deferred.promise();
	},

	_innerCreateDataset: function(dsName, dsMeta, creatingOption, deferred) {
		if(!dsMeta) {
			throw new Error(jslet.formatMessage(jsletlocale.DatasetFactory.metaNotFound, [dsName]));
		}
		if(!dsMeta.isEnum && creatingOption && creatingOption.datasetType === jslet.data.DatasetType.LOOKUP) {
			dsMeta = jQuery.extend({}, dsMeta);
			this._filterOutLookupFields(dsMeta, creatingOption);
		}

		dsMeta.createdByFactory = true;
		var dsObj = new jslet.data.Dataset(dsMeta);
		
		//Create dataset query criteria dataset
		if(dsMeta.criteriaFields) {
			var queryMeta = {name: dsName + '_criteria', fields: dsMeta.criteriaFields};
			new jslet.data.Dataset(queryMeta);
		}
		this._doDatasetCreatedDebounce.call(this, deferred);
	},
	
	_filterOutLookupFields: function(dsMeta, creatingOption) {
		var	onlyLookupFields = creatingOption.onlyLookupFields? true: false,
			includeFields = creatingOption.includeFields,
			excludeFields = creatingOption.excludeFields,
			visibleFields = creatingOption.visibleFields;
		var enableFields = {}, filtered = false, 
			codeField = dsMeta.codeField,
			nameField = dsMeta.nameField;
		if(creatingOption.onlyLookupFields) {
			filtered = true;
			if(dsMeta.keyField) {
				enableFields[dsMeta.keyField] = true;
			}
			if(codeField) {
				enableFields[codeField] = true;
			}
			if(nameField) {
				enableFields[nameField] = true;
			}
			if(dsMeta.parentField) {
				enableFields[dsMeta.parentField] = true;
			}
			if(dsMeta.statusField) {
				enableFields[dsMeta.statusField] = true;
			}
		}
		var i, len, fldName;
		if(includeFields) {
			filtered = true;
			for(i = 0, len = includeFields.length; i < len; i++) {
				enableFields[includeFields[i]] = true;
			}
		}
		if(excludeFields) {
			filtered = true;
			for(i = 0, len = excludeFields.length; i < len; i++) {
				fldName = excludeFields[i];
				if(enableFields[fldName]) {
					enableFields[fldName] = false;
				}
			}
		}
		var fields = dsMeta.fields, fldCfg,
			filteredFields = [];
		
		for(i = 0, len = fields.length; i < len; i++) {
			fldCfg = fields[i];
			fldName = fldCfg.name;
			if(!filtered || filtered && enableFields[fldName]) {
				fldCfg = jQuery.extend({}, fldCfg);
				filteredFields.push(fldCfg);
				if(visibleFields && visibleFields.indexOf(fldName) >= 0) {
					fldCfg.visible = true;
				} else {
					fldCfg.visible = (fldName == codeField || fldName == nameField);
				}
			}
		}
		dsMeta.fields = filteredFields;
	},
		
	_startCreateDataset: function(dsName, hostDsName, isLookup) {
		var hostDsCfg;
		if(hostDsName) {
			hostDsCfg = this._getDsCfg(hostDsName);
			if(!hostDsCfg) {
				hostDsCfg = {name: hostDsName, level: 0, relative: []};
				this._creatingDatasets.push(hostDsCfg);
			}
			if(!this._getDsCfg(dsName)) {
				var relative = hostDsCfg.relative;
				if(!relative) {
					hostDsCfg.relative = [];
					relative = hostDsCfg.relative;
				}
				relative.push({name: dsName, level: (isLookup? hostDsCfg.level + 1: 0), parent: hostDsCfg});
			}
			console.debug(dsName + '->' + hostDsName);
		}
	},
	
	_canCreatingDataset: function(hostDsName) {
		var hostDsCfg = this._getDsCfg(hostDsName);
		if(!hostDsCfg) {
			return true;
		}
		var dsCfg = hostDsCfg;
		var maxLevel = 0;
		while(true) {
			if(!dsCfg.parent) {
				maxLevel = this._maxCreatingLevels[dsCfg.name];
				break;
			}
			dsCfg = dsCfg.parent;
		}
		if(maxLevel && hostDsCfg.level === maxLevel) {
			return false
		}
		return true;
	},
	
	_checkAllCreated: function(hostDsCfg) {
		var result = true, 
			dsCfg, 
			relative = hostDsCfg.relative;
		
		for(var i = 0, len = relative.length; i < len; i++) {
			dsCfg = relative[i];
			if(!jslet.data.getDataset(dsCfg.name)) {
				return false;
			}
			if(dsCfg.relative) {
				result = this._checkAllCreated(dsCfg);
				if(!result) {
					return false;
				}
			}
		}
		return true;
	},
	
	_getDsCfg: function(dsName, datasets) {
		if(!dsName) {
			return null;
		}
		var datasets, dsCfg;
		if(datasets === undefined) {
			datasets = this._creatingDatasets;
		}
		for(var i = 0, len = datasets.length; i < len; i++) {
			dsCfg = datasets[i];
			if(dsCfg.name == dsName) {
				return dsCfg;
			}
			if(dsCfg.relative) {
				dsCfg = this._getDsCfg(dsName, dsCfg.relative);
				if(dsCfg) {
					return dsCfg;
				}
			}
		}
		return null;
	},
	
	_doDatasetCreated: function(deferred) {
		var datasets = this._creatingDatasets,
			rootDsCfg, rootDsName,
			allCreated = true;
		for(var i = datasets.length - 1; i >= 0; i--) {
			rootDsCfg = datasets[i];
			rootDsName = rootDsCfg.name;
			if(this._checkAllCreated(rootDsCfg)) {
				datasets.splice(i, 1);
				delete this._maxCreatingLevels[rootDsName];
			} else {
				allCreated = false;
				break;
			}
		}
		if(allCreated) {
			deferred.resolve();
		}
	}
}
jslet.data.datasetFactory = new jslet.data.DatasetFactory();

/**
 * @class
 * 
 * This class is a interface for datase meta. Any class which exists 'getDatasetMeta' method can be as a datase meta store. <br />
 * Dataset meta store can be an object array, IndexedDB object or a query from server side. <br />  
 * we extremely suggest you store dataset meta to IndexedDB.
 */
jslet.data.DatasetMetaStore = {
	/**
	 * This method will be called by jslet.data.DatasetFactory. Do not call it manually. <br />
	 * This method uses to get dataset meta when creating dataset. <br />
	 * It can be called asynchronously or synchronously. Example:
	 * 
	 *     @example
	 *     //synchronously
	 *     function getDatasetMeta(dsName) {
	 *          var defer = jQuery.Deferred();
	 *          var getMetaUrl = ...;
	 *          var settings = ...;
	 *          jQuery.ajax(getMetaUrl, settings).done(function(datasetMeta, textStatus, jqXHR) {
	 *          	defer.resolve(datasetMeta);
	 *          })
	 *          return defer.promise();
	 *     }
	 * 
	 *     //synchronously
	 *     var datasetMetas = [{name: '',....}], dsMeta;
	 *     function getDatasetMeta(dsName) {
	 *          for(var i = 0, len = datasetMetas.length; i < len; i++) {
	 *              dsMeta = datasetMetas[i];
	 *              if(dsMeta.name == dsName) {
	 *                  return dsMeta;
	 *              }
	 *          }
	 *          return null;
	 *     }
	 *     
	 * 		
	 * @param {String} datasetName The creating dataset name.
	 * 
	 * @return {Promise | Object} Dataset meta, see example to get more.
	 */
	getDatasetMeta: function(datasetName) {}
}
/**
 * @class
 * 
 * Expression for calculating field value. It can used in formula field, finding data,
 * filtering data and context rule.
 * 
 * Example:
 * 
 *     @example
 *     var expr = new jslet.data.Expression(dsEmployee, '[salary] * 0.2');
 *     expr.eval(); 
 */
jslet.data.Expression = function(dataset, expr) {
	jslet.Checker.test('jslet.data.Expression#dataset', dataset).required();
	jslet.Checker.test('jslet.data.Expression#expr', expr).required().isString();
	this._fields = [];
	this._otherDatasetFields = [];
	this._expr = expr;
	this._parsedExpr = '';
	if (typeof dataset == 'string') {
		this._dataset = jslet.data.getDataset(dataset);
		if (!this._dataset) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.datasetNotFound, [dataset]));
		}
	}else{
		jslet.Checker.test('jslet.data.Expression#dataset', dataset).isClass(jslet.data.Dataset.className);
		this._dataset = dataset;
	}
	
	this.context = {mainds: dataset};
	this.parse();
};

jslet.data.Expression.prototype = {
	_ParserPattern: /\[[_a-zA-Z][\.!\w]*(,\d){0,1}]/gim,
	
	parse: function() {
		
		var start = 0, end, k, 
			dsName, fldName, 
			otherDs, stag, dsObj,
			tmpExpr = [], 
			valueIndex = null;
		this._ParserPattern.lastIndex = 0;
		while ((stag = this._ParserPattern.exec(this._expr)) !== null) {
			fldName = stag[0];

			if (!fldName || fldName.endsWith('(')) {
				continue;
			}

			dsName = null;
			fldName = fldName.substr(1, fldName.length - 2);
			k = fldName.indexOf(',');
			if(k > 0) {
				valueIndex = parseInt(fldName.substr(k + 1));
				if(isNaN(valueIndex)) {
					valueIndex = null;
				}
				fldName = fldName.substr(0, k);
			}
			k = fldName.indexOf('!');
			if (k > 0) {
				dsName = fldName.substr(0, k);
				fldName = fldName.substr(k + 1);
			}

			end = stag.index;
			dsObj = this._dataset;
			if(dsName) {
				otherDs = jslet.data.dataModule[dsName];
				if (!otherDs) {
					throw new Error(jslet.formatMessage(jsletlocale.Dataset.datasetNotFound, [dsName]));
				}
				this.context[dsName] = otherDs;
				dsObj = otherDs;
			}

			if (!dsName) {
				tmpExpr.push(this._expr.substring(start, end));
				tmpExpr.push('context.mainds.getFieldValueByRecord(context.dataRec, "');
				this._fields.push(fldName);
			} else {
				tmpExpr.push(this._expr.substring(start, end));
				tmpExpr.push('context.');
				tmpExpr.push(dsName);
				tmpExpr.push('.getFieldValue("');
				this._otherDatasetFields.push({
							dataset : dsName,
							fieldName : fldName
						});
			}
			tmpExpr.push(fldName);
			tmpExpr.push('"');
			if(valueIndex !== null) {
				tmpExpr.push(',');
				tmpExpr.push(valueIndex);
			}
			tmpExpr.push(')');
			
			start = end + stag[0].length;
		}//end while
		tmpExpr.push(this._expr.substr(start));
		this._parsedExpr = tmpExpr.join('');
	}, //end function

	/**
	 * Get field names included in the expression.
	 * 
	 * @return {String[]}
	 */
	mainFields: function() {
		return this._fields;
	},

	/**
	 * Get fields of other dataset included in the expression.
	 * Other dataset fields are identified with 'datasetName!fieldName', like: department!deptName
	 * 
	 * @return {Object[]} the return value like:[{dataset : 'dsName', fieldName: 'fldName'}]
	 */
	otherDatasetFields: function() {
		return this._otherDatasetFields;
	},

	/**
	 * Evaluate the expression.
	 * 
	 * @param {Object} dataRec Data record object, this argument is used in parsedExpr 
	 * @return {Object} The value of Expression.
	 */
	eval: function(dataRec) {
		var context = this.context;
		context.mainds = this._dataset;
		context.dataRec = dataRec;
		//Customized functions for expression evaluation
		var like = jslet.like;
		var between = jslet.between;
		var inlist = jslet.inlist;
		var inArray = jslet.inArray;
		var inchildren = function(fldName, parentValue, onlyDirectChild) {
			return context.mainds.inChildren(fldName, parentValue, onlyDirectChild);
		};
		var inChildren = inchildren;
		var inchildrenandself = function(fldName, parentValue, onlyDirectChild) {
			return context.mainds.inChildrenAndSelf(fldName, parentValue, onlyDirectChild);
		};
		var inChildrenAndSelf = inchildrenandself;
		/* jshint ignore:start */
		return eval(this._parsedExpr); //Don't use window.eval
		/* jshint ignore:end */

	},
	
	destroy: function() {
		this._dataset = null;
		this._fields = null;
		this._otherDatasetFields = [];
		this._parsedExpr = null;
		this._expr = null;
		this.context = null;
	}
	
};


/**
 * @class
 * 
 * Datase field class.
 * 
 * @param {String} dsObj Field name.
 * @param {jslet.data.DataType} dataType Data type of field.
 */
jslet.data.Field = function (dsObj, fldCfg, parentFldObj) {
	var Z = this;
	Z._dataset = null;
	Z._datasetName = null;
	Z._displayOrder = null;
	Z._tabIndex = null;
	Z._shortName = null;
	
	Z._proxyHostFieldName = null;
	
	Z._proxyFldObjs = null;
	Z._proxyFieldChanged = null;
	Z._currProxyFieldName = null;
	
	Z._length = 0;
	Z._scale = 0;
	Z._unique = false;
	
	Z._defaultExpr = null;
	Z._defaultValue = null;
	Z._label = null;
	Z._displayLabel = null;
	Z._tip = null;
	Z._displayWidth = 0;
	Z._editMask = null;
	Z._displayFormat = null;
	Z._dateFormat = null;
	Z._formula = null;
	Z._readOnly = false;
	Z._visible = true;
	Z._disabled = false;
	Z._unitConverted = false;

	Z._lookup = null;
	
	Z._displayControl = null;
	Z._editControl = null;
	Z._detailDataset = null;
	Z._urlExpr = null;
	Z._innerUrlExpr = null;
	Z._urlTarget = null;
	Z._valueStyle = jslet.data.FieldValueStyle.NORMAL; //0 - Normal, 1 - Between style value, 2 - Multiple value
	Z._valueCountLimit = 0;
	Z._valueCountRange = null;
	Z._required = false;
	Z._nullText = jsletlocale.Dataset.nullText;
	Z._dataRange= null;
	Z._regularExpr = null;
	Z._antiXss = true;
	
	Z._customValueAccessor = null;
	Z._customValueConverter = null;
	Z._customValidator = null;
	Z._validChars = null; //Array of characters
	Z._dateChar = null;
	Z._dateRegular = null;
	Z._parent = null; //parent field object
	Z._children = null; //child field object
	Z._trueValue = true;
	Z._falseValue = false;
	Z._trueText = null;
	Z._falseText = null;
	Z._mergeSame = false;
	Z._mergeSameBy = null;
	Z._fixedValue = null;
	Z._valueFollow = false;
	Z._trimBlank = true;
	Z._focused = false;
	Z._encrypted = null;
	Z._aggregated = false;
	Z._aggregatedBy = null;
	Z._extendHostName = null;
	Z._crossSource = null;
	
	Z._dataset = dsObj;
	Z._create(fldCfg, parentFldObj);
};

jslet.data.Field.className = 'jslet.data.Field';

jslet.data.Field.prototype = {
	className: jslet.data.Field.className,
	
	_create: function (fldCfg, parentFldObj) {
		jslet.Checker.test('Field#fieldConfig', fldCfg).required().isObject();
		var fldName = jslet.trim(fldCfg.name);
		if (!fldName) {
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.fieldNameRequired));
		}
		
		var dtype = fldCfg.type || fldCfg.dataType;
		if (dtype === null || dtype === undefined) {
			dtype = jslet.data.DataType.STRING;
		} else {
			dtype = dtype.toUpperCase();
			if (dtype !== jslet.data.DataType.STRING && 
					dtype !== jslet.data.DataType.NUMBER && 
					dtype !== jslet.data.DataType.DATE && 
					dtype !== jslet.data.DataType.BOOLEAN && 
					dtype !== jslet.data.DataType.CROSS && 
					dtype !== jslet.data.DataType.PROXY && 
					dtype !== jslet.data.DataType.ACTION && 
					dtype !== jslet.data.DataType.EDITACTION && 
					dtype !== jslet.data.DataType.DATASET) {
				dtype = jslet.data.DataType.STRING;
			}
		}
		
		var Z = this;
		Z._fieldName = fldName;
		Z._dataType = dtype;
		function setPropValue(propName) {
			var propValue = fldCfg[propName];
			if (propValue !== undefined) {
				Z[propName](propValue);
			}
		}
		
		Z.parent(parentFldObj);
		if(parentFldObj) {
			var children = parentFldObj.children();
			if(!children) {
				children = [];
				parentFldObj.children(children);
			}
			children.push(Z);
		}
		
		setPropValue('tabIndex');
		setPropValue('displayOrder');
		setPropValue('label');
		setPropValue('displayLabel');
		setPropValue('shortName');
		setPropValue('tip');

		if(dtype === jslet.data.DataType.PROXY) {
			jslet.Checker.test('Field.proxyHostFieldName', fldCfg.proxyHostFieldName).required().isString();
			jslet.Checker.test('Field.proxyFieldChanged', fldCfg.proxyFieldChanged).required().isFunction();
			setPropValue('proxyHostFieldName');
			setPropValue('proxyFieldChanged');
			return;
		}
		if (dtype === jslet.data.DataType.DATASET){
			var detailDs = fldCfg.detailDataset || fldCfg.subDataset;
			if (detailDs) {
				Z.detailDataset(detailDs);
			} else {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.invalidDatasetField, [fldName]));
			}
			Z.visible(false);
			return;
		}
		
		setPropValue('visible');
		
		if(dtype === jslet.data.DataType.EDITACTION) {
			Z._displayWidth = 3;
			Z._readOnly = true;
			return;
		}
		setPropValue('displayWidth');
		setPropValue('fixedValue');
		if (dtype === jslet.data.DataType.ACTION){
			if (!fldCfg.fixedValue) {
				throw new Error(jslet.formatMessage(jsletlocale.Dataset.invalidActionField, [fldName]));
			}
			Z._readOnly = true;
			return;
		}
		
		setPropValue('formula');
		setPropValue('unique');
		setPropValue('required');
		setPropValue('readOnly');
		setPropValue('disabled');
		setPropValue('length');
		setPropValue('scale');
		setPropValue('alignment');
		setPropValue('defaultExpr');
		setPropValue('defaultValue');
		setPropValue('editMask');
		setPropValue('displayFormat');
		setPropValue('nullText');
		setPropValue('unitConverted');
		setPropValue('editControl');
		setPropValue('urlExpr');
		setPropValue('urlTarget');
		setPropValue('valueStyle');
		
		setPropValue('valueCountLimit');
		setPropValue('valueCountRange');
		setPropValue('dataRange');
		setPropValue('customValidator');
		setPropValue('customValueConverter');
		setPropValue('customValueAccessor');
		
		setPropValue('trueValue');
		setPropValue('falseValue');
		setPropValue('mergeSame');
		setPropValue('mergeSameBy');
		if(fldCfg.aggraded) {
			setPropValue('aggraded');
		} else {
			setPropValue('aggregated');
		}
		if(fldCfg.aggradedBy) {
			setPropValue('aggradedBy');
		} else {
			setPropValue('aggregatedBy');
		}

		setPropValue('valueFollow');
		setPropValue('trimBlank');
		
		setPropValue('focused');
		setPropValue('encrypted');
		
		setPropValue('antiXss');
		setPropValue('validChars');
		
		setPropValue('trueValue');
		setPropValue('falseValue');
		setPropValue('trueText');
		setPropValue('falseText');

		var regularExpr = fldCfg.regularExpr;
		var regularMessage = fldCfg.regularMessage;
		if(regularExpr) {
			Z.regularExpr(regularExpr, regularMessage);
		}
		
		var lkfCfg = fldCfg.lookup;
		if(lkfCfg === undefined) {
			var lkDataset = fldCfg.lookupSource || fldCfg.lookupDataset,
				lkParam = fldCfg.lookupParam,
				realDataset = fldCfg.realSource || fldCfg.realDataset;
			if(lkDataset) {
				if(lkParam) {
					if (jslet.isString(lkParam)) {
						lkfCfg = jslet.JSON.parse(lkParam);
					} else {
						lkfCfg = lkParam;
					}
				} else {
					lkfCfg = {};
				}
				lkfCfg.dataset = lkDataset;
				if(realDataset) {
					lkfCfg.realDataset = realDataset;
				}
			}
		}
		if (lkfCfg !== undefined && lkfCfg) {
			Z.lookup(lkfCfg);
		}
		if (fldCfg.children){
			var	childFldObj, childFldCfg;
			for(var i = 0, cnt = fldCfg.children.length; i < cnt; i++){
				childFldCfg = fldCfg.children[i];
				childFldObj = new jslet.data.Field(Z._dataset, childFldCfg, Z);
				if(childFldCfg.displayOrder === undefined) {
					childFldObj.displayOrder(i);
				}
			}
			Z.alignment('center');
		}	
	},

	
	/**
	 * @property
	 * 
	 * Set or get dataset. Don't set dataset property manually.
	 * 
	 *     @example
	 *     fldObj.dataset('test'); //Set property, return this.
	 *     var propValue = dsObj.dataset(); //Get property value.
	 * 
	 * @param {jslet.data.Dataset | undefined} dataset Dataset object.
	 * 
	 * @return {this | jslet.data.Dataset}
	 */
	dataset: function (dataset) {
		var Z = this;
		if (dataset === undefined) {
			if(Z._parent && !Z._dataset) {
				Z.dataset(Z._parent.dataset());
			}
			return Z._dataset;
		}
		
		if(jslet.isString(dataset)) {
			dataset = jslet.data.getDataset(dataset); 
		} else {
			jslet.Checker.test('Field.dataset', dataset).isClass(jslet.data.Dataset.className);
		}
		if(dataset) {
			Z._datasetName = dataset.name();
		}
		Z._removeRelation();
		Z._dataset = dataset;
		Z._clearFieldCache();
		Z._addRelation();
		var children = Z._children;
		if(children) {
			var childFldObj;
			for(var i = 0, len = children.length; i < len; i++) {
				childFldObj = children[i];
				childFldObj.dataset(Z._dataset);
			}
		}
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Get field name.
	 * 
	 * @return {String}
	 */
	name: function () {
		if(arguments.length >0) {
			console.error("Can't change field name!");
		}
		return this._fieldName;
	},

	/**
	 * @property
	 * 
	 * Set or get field short name. <br />
	 * Field short name is used to reduce field name length. It can reduce data size obviously. <br />
	 * For example, suppose field name is 'department', short name is 'a', it will reduce 9 characters for one record, if querying 10000 records, it will reduce 90000 characters.
	 * This will improve the whole performance. Example:  
	 * 
	 *     @example
	 *     fldObj.shortName('test'); //Set property, return this.
	 *     var propValue = dsObj.shortName(); //Get property value.
	 * 
	 * @param {String | undefined} shortName Field short name.
	 * 
	 * @return {this | String}
	 */
	shortName: function(shortName) {
		var Z = this;
		if (shortName === undefined) {
			return Z._shortName;
		}
		jslet.Checker.test('Field.shortName', shortName).isString();
		Z._shortName = shortName;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get field label, field label can be used to display, configure, export, import data. Example:  
	 * 
	 *     @example
	 *     fldObj.label('test'); //Set property, return this.
	 *     var propValue = dsObj.label(); //Get property value.
	 * 
	 * @param {String | undefined} label Field label.
	 * @return {this | String}
	 */
	label: function (label) {
		var Z = this;
		if (label === undefined) {
			if(Z._dataType === jslet.data.DataType.EDITACTION) {
				return '  ';
			}
			return Z._label || Z._fieldName;
		}
		jslet.Checker.test('Field.label', label).isString();
		Z._label = label;
		Z._fireMetaChangedEvent('label');
		Z._fireGlobalMetaChangedEvent('label');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field display label, display label is only used to display data.
	 * In some scenarios, display label can be different from field label.
	 * 
	 *     @example
	 *     fldObj.displayLabel('test'); //Set property, return this.
	 *     var propValue = dsObj.displayLabel(); //Get property value.
	 * 
	 * @param {String | undefined} displayLabel Field display label.
	 * @return {this | String}
	 */
	displayLabel: function (displayLabel) {
		var Z = this;
		if (displayLabel === undefined) {
			if(Z._dataType === jslet.data.DataType.EDITACTION) {
				return '  ';
			}
			return Z._displayLabel || Z.label();
		}
		jslet.Checker.test('Field.displayLabel', displayLabel).isString();
		Z._displayLabel = displayLabel;
		Z._fireMetaChangedEvent('label');
		Z._fireGlobalMetaChangedEvent('label');
		return this;
	},

	fullLabel: function(separator) {
		if(!this.parent()) {
			return this.label();
		}
		if(separator === undefined) {
			separator = '_';
		}
		var labels = [this.label()];
		var pFldObj = this.parent();
		while(pFldObj) {
			labels.push(pFldObj.label());
			pFldObj = pFldObj.parent();
		}
		return labels.reverse().join(separator);
	},
	
	/**
	 * @property
	 * 
	 * Set or get field tip.
	 * 
	 *     @example
	 *     fldObj.tip('test'); //Set property, return this.
	 *     var propValue = dsObj.tip(); //Get property value.
	 * 
	 * @param {String | undefined} tip Field tip.
	 * @return {this | String}
	 */
	tip: function(tip) {
		var Z = this;
		if (tip === undefined) {
			return Z._tip;
		}
		jslet.Checker.test('Field.tip', tip).isString();
		Z._tip = tip;
		Z._fireMetaChangedEvent('tip');
		Z._fireGlobalMetaChangedEvent('tip');
		return this;
	},
	
	/**
	 * Get field data type.
	 * 
	 * @return {jslet.data.DataType} 
	 */
	getType: function () {
		if(this._dataType == jslet.data.DataType.PROXY) {
			var result = this._getProxyPropValue('dataType') || jslet.data.DataType.STRING;
			if(result === jslet.data.DataType.DATASET) {
				return this._dataType;
			} else {
				return result;
			}
		}
		return this._dataType;
	},

	/**
	 * @property
	 * 
	 * Set or get field data type.
	 * 
	 *     @example
	 *     fldObj.dataType('test'); //Set property, return this.
	 *     var propValue = dsObj.dataType(); //Get property value.
	 * 
	 * @param {String | undefined} dataType Field's data type.
	 * 
	 * @return {this | String}
	 */
	dataType: function(dataType) {
		if(dataType === undefined) {
			return this._dataType;
		}
		jslet.Checker.test('Field#dataType', dataType).isString().required();
		var dtype = dataType;
		if (dtype === null) {
			dtype = jslet.data.DataType.STRING;
		} else {
			dtype = dtype.toUpperCase();
			if (dtype != jslet.data.DataType.STRING && 
					dtype != jslet.data.DataType.NUMBER && 
					dtype != jslet.data.DataType.DATE && 
					dtype != jslet.data.DataType.BOOLEAN && 
					dtype != jslet.data.DataType.CROSS && 
					dtype != jslet.data.DataType.PROXY && 
					dtype != jslet.data.DataType.ACTION && 
					dtype != jslet.data.DataType.EDITACTION && 
					dtype != jslet.data.DataType.DATASET)
			dtype = jslet.data.DataType.STRING;
		}
		this._dataType = dtype;
		return this;
	},
	
	proxyHostFieldName: function(proxyHostFieldName) {
		var Z = this;
		if(proxyHostFieldName === undefined) {
			return Z._proxyHostFieldName;
		}
		Z._proxyHostFieldName = proxyHostFieldName;
	},
	
	proxyFieldChanged: function(proxyFieldChanged) {
		var Z = this;
		if (proxyFieldChanged === undefined) {
			return Z._proxyFieldChanged;
		}
		jslet.Checker.test('Field.proxyFieldChanged', proxyFieldChanged).required().isFunction();
		Z._proxyFieldChanged = proxyFieldChanged;
		return this;
	},
	
	changeProxyFieldName: function(dataRecord, isSilence) {
		var Z = this,
			fldObj, proxyHostFldName, proxyFldName;
		
		proxyFldName = dataRecord[Z._proxyHostFieldName];
		if(!proxyFldName || Z._currProxyFieldName == proxyFldName) {
			return;
		}
		if(!Z._proxyFldObjs) {
			Z._proxyFldObjs = {};
		}
		var oldProxyFldObj = Z._proxyFldObjs[Z._currProxyFieldName],
			newProxyFldObj = Z._proxyFldObjs[proxyFldName];
		
		if(!newProxyFldObj) {
			newProxyFldObj = new jslet.data.Field(Z._dataset, {name: proxyFldName, dataType: 'S'});
			Z._proxyFieldChanged.call(Z._dataset, dataRecord, proxyFldName, newProxyFldObj);
			Z._proxyFldObjs[proxyFldName] = newProxyFldObj;
		}
		Z._currProxyFieldName = proxyFldName;
		if(!isSilence) {
			Z._fireMetaChangedEvent('editControl');
		}
	},
	
	_getProxyPropValue: function(propName) {
		if(!this._proxyFldObjs) {
			return null;
		}
		var proxyFldObj = this._proxyFldObjs[this._currProxyFieldName];
		if(proxyFldObj) {
			return proxyFldObj[propName]();
		}
		return null;
	},
	
	_setProxyPropValue: function(propName, propValue) {
		if(!this._proxyFldObjs) {
			return;
		}
		var proxyFldObj = this._proxyFldObjs[this._currProxyFieldName];
		if(proxyFldObj) {
			proxyFldObj[propName](propValue);
		}
	},
	
	/**
	 * @property
	 * 
	 * Set or get parent field object.
	 * 
	 *     @example
	 *     fldObj.parent(fldParent); //Set property, return this.
	 *     var propValue = dsObj.parent(); //Get property value.
	 * 
	 * @param {jslet.data.Field | undefined} parent Parent field object.
	 * 
	 * @return {this | jslet.data.Field}
	 */
	parent: function (parent) {
		var Z = this;
		if (parent === undefined) {
			return Z._parent;
		}
		jslet.Checker.test('Field.parent', parent).isClass(this.className);
		Z._parent = parent;
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get child fields of this field.
	 * 
	 *     @example
	 *     fldObj.children([fldObj1, fldObj2]); //Set property, return this.
	 *     var propValue = dsObj.children(); //Get property value.
	 * 
	 * @param {jslet.data.Field[] | undefined} children Child field object.
	 * 
	 * @return {this | jslet.data.Field[]}
	 */
	children: function (children) {
		var Z = this;
		if (children === undefined) {
			return Z._children;
		}
		jslet.Checker.test('Field.children', children).isArray();
		for(var i = 0, len = children.length; i < len; i++) {
			jslet.Checker.test('Field.children#childField', children[i]).isClass(this.className);
		}
		Z._children = children;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get field display order. <br />
	 * Dataset uses this property to set field order.
	 * 
	 *     @example
	 *     fldObj.displayOrder(1); //Set property, return this.
	 *     var propValue = dsObj.displayOrder(); //Get property value.
	 * 
	 * @param {Integer | undefined} displayOrder Field display order.
	 * 
	 * @return {this | Integer}
	 */
	displayOrder: function (displayOrder) {
		var Z = this;
		if (displayOrder === undefined) {
			return Z._displayOrder;
		}
		jslet.Checker.test('Field.displayOrder', displayOrder).isNumber();
		Z._displayOrder = parseInt(displayOrder);
		Z._fireGlobalMetaChangedEvent('displayOrder');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get the edit control tab index of this field.
	 * 
	 *     @example
	 *     fldObj.tabIndex(1); //Set property, return this.
	 *     var propValue = dsObj.tabIndex(); //Get property value.
	 * 
	 * @param {Integer | undefined} tabIndex Tab index of edit control linked this field.
	 * 
	 * @return {this | Integer}
	 */
	tabIndex: function(tabIndex) {
		var Z = this;
		if (tabIndex === undefined) {
			//If not set tabIndex property, use displayOrder instead.
//			if(Z._tabIndex === null || Z._tabIndex === undefined) {
//				return Z._displayOrder + 1;
//			}
			return Z._tabIndex;
		}
		jslet.Checker.test('Field.tabIndex', tabIndex).isNumber();
		tabIndex = tabIndex? parseInt(tabIndex): null;
		Z._tabIndex = tabIndex !== NaN? tabIndex: null;
		Z._fireMetaChangedEvent('tabIndex');
		Z._fireGlobalMetaChangedEvent('tabIndex');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get field stored length.<br />
	 * 
	 *     @example
	 *     fldObj.length(10); //Set property, return this.
	 *     var propValue = dsObj.length(); //Get property value.
	 * 
	 * @param {Integer | undefined} len Field stored length.
	 * 
	 * @return {this | Integer}
	 */
	length: function (len) {
		var Z = this;
		if (len === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('length') || 10;
			}
			return Z._length || 10;
		}
		jslet.Checker.test('Field.length', len).isGTEZero();
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('length', parseInt(len));
		} else {
			Z._length = parseInt(len);
		}
		Z._fireGlobalMetaChangedEvent('length');
		return this;
	},
	
	/**
	 * Get edit length. Edit length is used in editor to input data.
	 * 
	 * @return {Integer}
	 */
	getEditLength: function () {
		var Z = this,
			lkObj = Z.lookup(),
			len = Z.length();
		if (lkObj) {
			var codeFld = lkObj.codeField(),
				nameFld = lkObj.nameField(),
				lkds = lkObj.dataset();
			if (lkds && codeFld) {
				var lkf = lkds.getField(codeFld);
				if (lkf) {
					len = lkf.getEditLength();
				}
				if(nameFld) {
					lkf = lkds.getField(nameFld);
					if(lkf) {
						len = Math.max(len, lkf.getEditLength());
					}
				}
				return len;
			}
		}
		if(Z.getType() === jslet.data.DataType.NUMBER && Z.scale() > 0) {
			return len + 1; // 1 for decimal point
		}
		return len > 0 ? len : 10;
	},

	/**
	 * @property
	 * 
	 * Set or get field decimal length.
	 * 
	 *     @example
	 *     fldObj.scale(10); //Set property, return this.
	 *     var propValue = dsObj.scale(); //Get property value.
	 * 
	 * @param {Integer | undefined} scale Field decimal length.
	 * 
	 * @return {this | Integer}
	 */
	scale: function (scale) {
		var Z = this;
		if (scale === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('scale') || 0;
			}
			return Z._scale;
		}
		jslet.Checker.test('Field.scale', scale).isGTEZero();
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('scale', parseInt(scale));
		} else {
			Z._scale = parseInt(scale);
		}
		Z._fireGlobalMetaChangedEvent('scale');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field alignment. The optional values: left, center, right.
	 * 
	 *     @example
	 *     fldObj.alignment('left'); //Set property, return this.
	 *     var propValue = dsObj.alignment(); //Get property value.
	 * 
	 * @param {String | undefined} alignment Field alignment.
	 * 
	 * @return {this | String}
	 */
	alignment: function (alignment) {
		var Z = this;
		if (alignment === undefined){
			var align = Z._alignment;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				align = Z._getProxyPropValue('alignment');
			}
			if(align) {
				return align;
			}
			
			if(Z.lookup()) {
				return 'left';
			}
			if(Z.getType() == jslet.data.DataType.NUMBER) {
				return 'right';
			}
			
			if(Z.getType() == jslet.data.DataType.BOOLEAN) {
				return 'center';
			}
			return 'left';
		}
		
		jslet.Checker.test('Field.alignment', alignment).isString();
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('alignment', jslet.trim(alignment));
		} else {
			Z._alignment = jslet.trim(alignment);
		}
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('alignment');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get the display text if the field value is null.
	 * 
	 *     @example
	 *     fldObj.nullText('<Empty>'); //Set property, return this.
	 *     var propValue = dsObj.nullText(); //Get property value.
	 * 
	 * @param {String | undefined} nullText Field null text.
	 * 
	 * @return {this | String}
	 */
	nullText: function (nullText) {
		var Z = this;
		if (nullText === undefined) {
			return Z._nullText;
		}
		jslet.Checker.test('Field.nullText', nullText).isString();
		nullText = jslet.trim(nullText);
		Z._nullText = nullText;
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('nullText');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field display width.
	 * Display width is usually used in DBTable column.
	 * 
	 *     @example
	 *     fldObj.displayWidth(10); //Set property, return this.
	 *     var propValue = dsObj.displayWidth(); //Get property value.
	 * 
	 * @param {Integer | undefined} displayWidth Field display width.
	 * 
	 * @return {this | Integer}
	 */
	displayWidth: function (displayWidth) {
		var Z = this;
		if (displayWidth === undefined) {
			if (Z._displayWidth <= 0) {
				return Z.length() || 12;
			} else {
				return Z._displayWidth;
			}
		}
		jslet.Checker.test('Field.displayWidth', displayWidth).isGTEZero();
		Z._displayWidth = parseInt(displayWidth);
		Z._fireGlobalMetaChangedEvent('displayWidth');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get field default expression.
	 * This expression will be calculated when inserting a record.
	 * 
	 *     @example
	 *     fldObj.defaultExpr('20'); //Default value: 20.
	 *     fldObj.defaultExpr('"OK"'); //Default value: 'OK'.
	 *     var propValue = dsObj.defaultExpr(); //Get property value.
	 * 
	 * @param {String | undefined} defaultExpr Field default expression.
	 * 
	 * @return {this | String}
	 */
	defaultExpr: function (defaultExpr) {
		var Z = this;
		if (defaultExpr === undefined) {
			return Z._defaultExpr;
		}
		jslet.Checker.test('Field.defaultExpr', defaultExpr).isString();
		Z._defaultExpr = defaultExpr;
		Z._fireGlobalMetaChangedEvent('defaultExpr');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field display format:<br />
	 * Number field placeholder: # - one number, 0 - one number(if not exists, 0 instread), like: #,##0.00, $#,##0.00;<br />
	 * Date field placeholder: y - year, M - month, d - date, h - hour, m - minute, s - second, like: yyyy/MM/dd hh:mm:ss;<br />
	 * String field: # - one character, ecapse: \# like ###-###-###, \###<br />
	 * 
	 *     @example
	 *     numFldObj.setValue(134589.8);
	 *     numFldObj.displayFormat('$#,##0.00');
	 *     numFldObj.getTextValue(); //return '$1,345,89.80'
	 *     
	 *     numFldObj.displayFormat('$#,##0.##');
	 *     numFldObj.getTextValue(); //return '$1,345,89.8'
	 *     
	 *     dateFldObj.setValue(new Date(2015, 9, 1));
	 *     dateFldObj.displayFormat('yyyy-MM-dd');
	 *     dateFldObj.getTextValue(); //return '2015-10-01'
	 *     
	 *     strFldObj.setValue('08579');
	 *     strFldObj.displayFormat('NO##-###');
	 *     strFldObj.getTextValue(); //return 'NO08-579'

	 *     var propValue = dsObj.displayFormat(); //Get property value.
	 * 
	 * @param {String | undefined} format Field display format.
	 * 
	 * @return {this | String}
	 */
	displayFormat: function (format) {
		var Z = this;
		if (format === undefined) {
			var displayFmt = Z._displayFormat;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				displayFmt = Z._getProxyPropValue('displayFormat');
			}
			if (displayFmt) {
				return displayFmt;
			} else {
				if (Z.getType() == jslet.data.DataType.DATE) {
					return jsletlocale.Date.format;
				} else {
					return displayFmt;
				}
			}
		}
		
		jslet.Checker.test('Field.displayFormat', format).isString();
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('displayFormat', jslet.trim(format));
		} else {
			Z._displayFormat = jslet.trim(format);
		}
		Z._dateFormat = null;
		Z._dateChar = null;
		Z._dateRegular = null;
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('displayFormat');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field default value. <br />
	 * The data type of default value must be same as Field data type. Example:
	 * 
	 *     @example
	 *     fldObj.defauleValue(100); //Number field 
	 *     fldObj.defaultValue(new Date()); //Date field
	 *     fldObj.defaultValue('test'); //String field
	 * 
	 * @param {Object | undefined} dftValue Field default value.
	 * 
	 * @return {this | Object}
	 */
	defaultValue: function (dftValue) {
		var Z = this;
		if (dftValue === undefined) {
			return Z._defaultValue;
		}
		jslet.Checker.test('Field.defaultValue', Z.dftValue).isDataType(Z._dateType);
		Z._defaultValue = dftValue;
		Z._fireGlobalMetaChangedEvent('defaultValue');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field is unique or not.
	 * 
	 *     @example
	 *     fldObj.unique(true); //Set property, return this.
	 *     var propValue = dsObj.unique(); //Get property value.
	 * 
	 * @param {Boolean | undefined} unique Field is unique or not.
	 * 
	 * @return {this | Boolean}
	 */
	unique: function (unique) {
		var Z = this;
		if (unique === undefined) {
			return Z._unique;
		}
		Z._unique = unique ? true: false;
		Z._fireGlobalMetaChangedEvent('unique');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get field is required or not.
	 * 
	 *     @example
	 *     fldObj.required(true); //Set property, return this.
	 *     var propValue = dsObj.required(); //Get property value.
	 * 
	 * @param {Boolean | undefined} required Field is required or not.
	 * 
	 * @return {this | Boolean}
	 */
	required: function (required) {
		var Z = this;
		if (required === undefined) {
			return Z._required;
		}
		Z._required = required ? true: false;
		Z._fireMetaChangedEvent('required');
		Z._fireGlobalMetaChangedEvent('required');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get field edit mask.
	 * 
	 *     @example
	 *     fldObj.editMask('CC-00-00'); //Set property, return this.
	 *     
	 *     fldObj.editMask({mask: 'CC-00-00', keepChar:false}); //Set property, return this.
	 *     var propValue = dsObj.editMask(); //Get property value.
	 * 
	 * @param {String | Object | undefined} mask Field edit mask.
	 * 
	 * @return {this | Object}
	 */
	editMask: function (mask) {
		var Z = this;
		if (mask === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('editMask');
			}
			return Z._editMask;
		}
		if(mask) {
			if (jslet.isString(mask)) {
				mask = {mask: mask,keepChar:false};
			}
		} else {
			mask = null;
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('editMask', mask);
		} else {
			Z._editMask = mask;
		}
		Z._clearFieldCache();		
		Z._fireMetaChangedEvent('editMask');
		Z._fireGlobalMetaChangedEvent('required');
		return this;
	},
	
	dateFormat: function(){
		var Z = this;
		if (Z._dateFormat) {
			return Z._dateFormat;
		}
		if (this.getType() != jslet.data.DataType.DATE) {
			return null;
		}
		var displayFmt = this.displayFormat().toUpperCase();
		Z._dateFormat = '';
		var c;
		for(var i = 0, len = displayFmt.length; i < len; i++){
			c = displayFmt.charAt(i);
			if ('YMD'.indexOf(c) < 0) {
				continue;
			}
			if (Z._dateFormat.indexOf(c) < 0) {
				Z._dateFormat += c;
			}
		}
		return Z._dateFormat;
	},
	
	dateSeparator: function(){
		var Z = this;
		if (Z._dateChar) {
			return Z._dateChar;
		}
		if (this.getType() != jslet.data.DataType.DATE) {
			return null;
		}
		var displayFmt = this.displayFormat().toUpperCase();
		for(var i = 0, c, len = displayFmt.length; i < len; i++){
			c = displayFmt.charAt(i);
			if ('YMD'.indexOf(c) < 0){
				Z._dateChar = c;
				return c;
			}
		}
	},
	
	dateRegular: function(){
		var Z = this;
		if (Z._dateRegular) {
			return Z._dateRegular;
		}
		var dateFmt = this.dateFormat(),
			dateSeparator = this.dateSeparator(),
			result = ['^'];
		for(var i = 0, c; i < dateFmt.length; i++){
			if (i > 0){
				result.push('\\');
				result.push(dateSeparator);
			}
			c = dateFmt.charAt(i);
			if (c == 'Y') {
				result.push('(\\d{4}|\\d{2})');
			} else if (c == 'M'){
				result.push('(0?[1-9]|1[012])');
			} else {
				result.push('(0?[1-9]|[12][0-9]|3[01])');
			}
		}
		result.push('(\\s+\\d{2}:\\d{2}:\\d{2}(\\.\\d{3}){0,1}){0,1}');
		result.push('$');
		Z._dateRegular = {expr: new RegExp(result.join(''), 'gim'), message: jslet.formatMessage(jsletlocale.Dataset.invalidDate, [Z._displayFormat])};
		
		return Z._dateRegular;
	},
	
	/**
	 * @property
	 * 
	 * Set or get field formula.<br />
	 * Jslet formula is base on javascript expression, to get field value to use '[' + fieldName + ']'. 
	 * 
	 *     @example
	 *     fldObj.formula('[price]*[num]'); //Set property, return this.
	 *     fldObj.formula('[fld1] > 0 && [fld2] > 0'? [fld3]: [fld4]'); 
	 *     var propValue = dsObj.formula(); //Get property value.
	 * 
	 * @param {String | undefined} formula Field formula.
	 * 
	 * @return {this | String}
	 */
	formula: function (formula) {
		var Z = this;
		if (formula === undefined) {
			return Z._formula;
		}
		
		jslet.Checker.test('Field.formula', formula).isString();
		Z._formula = jslet.trim(formula);
		Z._readOnly = true;
		Z._clearFieldCache();
		var dataset = Z.dataset(); 
		if (dataset) {
			dataset.removeInnerFormulaField(Z._fieldName);
			dataset.addInnerFormulaField(Z._fieldName, Z._formula);		
			Z._fireColumnUpdatedEvent();
		}
		Z._fireGlobalMetaChangedEvent('formula');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field is visible or not.
	 * 
	 *     @example
	 *     fldObj.visible(true); //Set property, return this.
	 *     var propValue = dsObj.visible(); //Get property value.
	 * 
	 * @param {Boolean | undefined} visible Field is visible or not.
	 * 
	 * @return {this | Boolean}
	 */
	visible: function (visible) {
		var Z = this;
		if (visible === undefined){
			if (Z._visible){
				var p = this.parent();
				while(p){
					if (!p.visible()) { //if parent is invisible
						return false;
					}
					p = p.parent();
				}
			}
			return Z._visible;
		}
		Z._visible = visible ? true: false;
		Z._fireMetaChangedEvent('visible');
		Z._fireGlobalMetaChangedEvent('visible');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field is disabled or not.
	 * 
	 *     @example
	 *     fldObj.disabled(true); //Set property, return this.
	 *     var propValue = dsObj.disabled(); //Get property value.
	 * 
	 * @param {Boolean | undefined} disabled Field is disabled or not.
	 * 
	 * @return {this | Boolean}
	 */
	disabled: function (disabled) {
		var Z = this;
		if (disabled === undefined) {
			if(Z._formula || Z._dataType === jslet.data.DataType.DATASET || Z._children) {
				return false;
			}
			return Z._disabled;
		}
		Z._disabled = disabled ? true: false;
		Z._fireMetaChangedEvent('disabled');
		Z._fireGlobalMetaChangedEvent('disabled');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field is read only or not.
	 * 
	 *     @example
	 *     fldObj.readOnly(true); //Set property, return this.
	 *     var propValue = dsObj.readOnly(); //Get property value.
	 * 
	 * @param {Boolean | undefined} readOnly Field is readOnly or not.
	 * 
	 * @return {this | Boolean}
	 */
	readOnly: function (readOnly) {
		var Z = this;
		if (readOnly === undefined){
			if (Z._dataType == jslet.data.DataType.DATASET) {
				return true;
			}
			var children = Z.children();
			if (children && children.length === 0) {
				return true;
			}

			return Z._readOnly || Z._dataset.readOnly();
		}
		
		Z._readOnly = readOnly? true: false;
		Z._fireMetaChangedEvent('readOnly');
		Z._fireGlobalMetaChangedEvent('readOnly');
		return this;
	},
	
	fieldReadOnly: function() {
		var Z = this;
		if (Z._dataType == jslet.data.DataType.DATASET) {
			return true;
		}
		var children = Z.children();
		if (children && children.length === 0) {
			return true;
		}

		return Z._readOnly;
	},
	
	fieldDisabled: function() {
		var Z = this;
		return this._disabled;
	},
	
	_fireGlobalMetaChangedEvent: function(metaName) {
		var dsObj = this.dataset();
		if (dsObj && dsObj.designMode() && dsObj.isFireGlobalEvent()) {
			var handler = jslet.data.globalDataHandler.fieldMetaChanged();
			if(handler) {
				handler.call(this, dsObj, this._fieldName, metaName);
			}
		}
	},
	
	_fireMetaChangedEvent: function(metaName) {
		var ds = this.dataset();
		if (ds) {
			var evt = jslet.data.RefreshEvent.changeMetaEvent(metaName, this._fieldName);
			ds.refreshControl(evt);
		}
	},
	
	_fireColumnUpdatedEvent: function() {
		var ds = this.dataset();
		if (ds) {
			var evt = jslet.data.RefreshEvent.updateColumnEvent(this._fieldName);
			ds.refreshControl(evt);
		}
	},
	
	/**
	 * @property
	 * 
	 * Set or get if field participates unit converting.
	 * 
	 *     @example
	 *     fldObj.unitConverted(true); //Set property, return this.
	 *     var propValue = dsObj.unitConverted(); //Get property value.
	 * 
	 * @param {Boolean | undefined} unitConverted.
	 * 
	 * @return {this | Boolean}
	 */
	unitConverted: function (unitConverted) {
		var Z = this;
		if (unitConverted === undefined) {
			return Z._dataType == jslet.data.DataType.NUMBER? Z._unitConverted:false;
		}
		Z._unitConverted = unitConverted ? true : false;
		var ds = this.dataset();
		Z._clearFieldCache();		
		if (Z._dataType == jslet.data.DataType.NUMBER && ds && ds.unitConvertFactor() != 1) {
			Z._fireColumnUpdatedEvent();
		}
		Z._fireGlobalMetaChangedEvent('unitConverted');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get value style of this field. Optional value is come from {@link jslet.data.FieldValueStyle}. <br />
	 * 
	 *     @example
	 *     fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE); //Set property, return this.
	 *     var propValue = dsObj.valueStyle(); //Get property value.
	 * 
	 * @param {Integer | undefined} valueStyle.
	 * 
	 * @return {this | Integer}
	 */
	valueStyle: function (valueStyle) {
		var Z = this;
		if (valueStyle === undefined) {
			if(Z._dataType == jslet.data.DataType.DATASET ||  
					Z._children && Z._children.length > 0) 
				return jslet.data.FieldValueStyle.NORMAL;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('valueStyle');
			}

			return Z._valueStyle;
		}

		if(valueStyle) {
			valueStyle = parseInt(valueStyle);
		} else {
			valueStyle = 0;
		}
		jslet.Checker.test('Field.valueStyle', valueStyle).isNumber().inArray([0,1,2]);
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('valueStyle', valueStyle);
		} else {
			Z._valueStyle = valueStyle;
		}
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireMetaChangedEvent('valueStyle');
		Z._fireGlobalMetaChangedEvent('valueStyle');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get allowed item count when {@link jslet.data.Field#valueStyle} is multiple.
	 * 
	 *     @example
	 *     fldObj.valueCountLimit(5); //Set property, return this.
	 *     var propValue = dsObj.valueCountLimit(); //Get property value.
	 * 
	 * @param {Integer | undefined} count Maximum items for multiple values.
	 * 
	 * @return {this | Integer}
	 */
	valueCountLimit: function (count) {
		var Z = this;
		if (count === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('valueCountLimit');
			}
			return Z._valueCountLimit;
		}
		if(count) {
			jslet.Checker.test('Field.valueCountLimit', count).isNumber();
		} else {
			count = 0;
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('valueCountLimit', parseInt(count));
		} else {
			Z._valueCountLimit = parseInt(count);
		}
		Z._fireGlobalMetaChangedEvent('valueCountLimit');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get allowed item count when {@link jslet.data.Field#valueStyle} is multiple or between.
	 * 
	 *     @example
	 *     fldObj.valueCountRange({min: 1, max: 5}); //Set property, return this.
	 *     var propValue = fldObj.valueCountRange(); //Get property value.
	 * 
	 * @param {Object | undefined} valueCountRange The value count range.
	 * 
	 * @return {this | Object}
	 */
	valueCountRange: function (valueCountRange) {
		var Z = this;
		if (valueCountRange === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('valueCountRange');
			}
			return Z._valueCountRange;
		}
		if(valueCountRange) {
			jslet.Checker.test('Field.valueCountRange', valueCountRange).isObject();
			jslet.Checker.test('Field.valueCountRange', valueCountRange.min).isGTEZero();
			jslet.Checker.test('Field.valueCountRange', valueCountRange.max).isGTEZero();
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('valueCountRange', valueCountRange);
		} else {
			Z._valueCountRange = valueCountRange;
		}
		Z._fireGlobalMetaChangedEvent('valueCountRange');
		return this;
	},

	/**
	 * @private
	 * @property
	 * 
	 * Set or get field display control. It is similar as DBControl configuration.
	 * Here you need not set 'dataset' and 'field' property. Example:
	 * 
	 *     @example
	 *     //Normal DBControl configuration
	 *     //var normalCtrlCfg = {type: "DBSpinEdit", dataset: "employee", field: "age", minValue:10, maxValue: 100, step: 5};
	 * 
	 *     var displayCtrlCfg = {type: "DBSpinEdit", minValue: 10, maxValue: 100, step: 5};
	 *     fldObj.displayControl(displayCtrlCfg);
	 * 
	 * @param {Object | String | undefined} dispCtrl If String, it will convert to DBControl Config.
	 * 
	 * @return {this | Object}
	 */
	displayControl: function (dispCtrl) {
		var Z = this;
		if (dispCtrl === undefined){
			var result = Z._displayControl;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				result = Z._getProxyPropValue('displayControl');
			}
			if (Z.getType() == jslet.data.DataType.BOOLEAN && !result) {
				return {
					type: 'dbcheckbox'
				};
			}
			return result;
		}
		dispCtrl = jslet.isString(dispCtrl) ? { type: dispCtrl } : dispCtrl;
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('displayControl', dispCtrl);
		} else {
			Z._displayControl = dispCtrl;
		}
		Z._fireGlobalMetaChangedEvent('displayControl');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field edit control. It is similar as DBControl configuration except not set 'dataset' and 'field' property. Example:
	 * 
	 *     @example
	 *     //Normal DBControl configuration
	 *     //var normalCtrlCfg = {type: "DBSpinEdit", dataset: "employee", field: "age", minValue: 10, maxValue: 100, step: 5};
	 *     
	 *     var editCtrlCfg = {type: "DBSpinEdit", minValue: 10, maxValue: 100, step: 5};
	 *     fldObj.displayControl(editCtrlCfg);
	 * 
	 * @param {Object | String | undefined} editCtrl If String, it will convert to DBControl Config.
	 * 
	 * @return {this | Object}
	 */
	editControl: function (editCtrl) {
		var Z = this;
		if (editCtrl=== undefined){
			var result = Z._editControl;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				result = Z._getProxyPropValue('editControl');
			}
			if (result) {
				return result;
			}

			var fldType = Z.getType();
			if (fldType == jslet.data.DataType.BOOLEAN) {
				return {type: 'dbcheckbox'};
			}
			if (fldType == jslet.data.DataType.DATE) {
				return {type: 'dbdatepicker'};
			}
			
			return Z.lookup()? {type: 'dbselect'}:{type: 'dbtext'};
		}
		if(jslet.isString(editCtrl)) {
			editCtrl = jslet.trim(editCtrl);
			if(editCtrl) {
				if(editCtrl.indexOf(':') > 0) {
					editCtrl = jslet.JSON.parse(editCtrl);
				} else {
					editCtrl =  {type: editCtrl};
				}
			} else {
				editCtrl = null;
			}
		}
		var oldValue = Z._getProxyPropValue('editControl');
		if(oldValue && editCtrl && oldValue.type == editCtrl.type) {
			return this;
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('editControl', editCtrl);
		} else {
			Z._editControl = editCtrl;
		}
		Z._fireMetaChangedEvent('editControl');
		Z._fireGlobalMetaChangedEvent('editControl');
		return this;
	},

	_addRelation: function() {
		var Z = this, 
			lkObj = Z.lookup(),
			lkDsName,
			hostDsName = Z._datasetName;
		if(!hostDsName || (Z.getType() != jslet.data.DataType.DATASET && !lkObj)) {
			return;
		}
		
		var hostField = Z._fieldName,
			relationType;
		if(Z.getType() == jslet.data.DataType.DATASET) {
			if(Z._detailDataset) {
				lkDsName = Z._getDatasetName(Z._detailDataset);
				relationType = jslet.data.DatasetType.DETAIL;
				jslet.data.datasetRelationManager.addRelation(hostDsName, hostField, lkDsName, relationType);
				var detailDsObj = jslet.data.getDataset(Z._detailDataset);
				if(detailDsObj) {
					detailDsObj.masterDataset(hostDsName);
					detailDsObj.masterField(hostField);
				}
			}
		} else {
			lkDsName = Z._getDatasetName(lkObj._dataset);
			relationType = jslet.data.DatasetType.LOOKUP;
			jslet.data.datasetRelationManager.addRelation(hostDsName, hostField, lkDsName, relationType);
		}
	},
	
	_removeRelation: function() {
		var Z = this,
			lkObj = Z.lookup(),
			hostDsName = Z._datasetName;
		if(!hostDsName || (!Z._detailDataset && !lkObj)) {
			return;
		}
		var hostField = Z._fieldName,
			relationType, lkDsName;

		if(Z._detailDataset) {
			lkDsName = Z._getDatasetName(Z._detailDataset);
			var detailDsObj = jslet.data.getDataset(Z._detailDataset);
			if(detailDsObj) {
				detailDsObj.masterDataset(null);
				detailDsObj.masterField(null);
			}
		} else {
			lkDsName = Z._getDatasetName(lkObj._dataset);
		}
		jslet.data.datasetRelationManager.removeRelation(hostDsName, hostField, lkDsName);
	},
		
	/**
	 * @property
	 * 
	 * Set or get lookup field object. <br />
	 * In jslet, there are two relations of dataset: LOOKUP and DETAIL.<br />
	 * "Lookup" relation means where one field value is come from. Example:
	 * 
	 *     @example
	 *     var dsDepartment = jslet.data.getDataset('department');
	 *     fldObj.lookup({dataset: dsDepartment}); 
	 *     //or
	 *     fldObj.lookup({dataset: 'department'});
	 * 
	 * @param {jslet.data.FieldLookup | Object | undefined} lookupObject Lookup field object or lookup configuration.
	 * 
	 * @return {this | jslet.data.FieldLookup}
	 */
	lookup: function (lookupObj) {
		var Z = this;
		if (lookupObj === undefined){
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('lookup');
			}
			return Z._lookup;
		}
		if(lookupObj && lookupObj.className != jslet.data.FieldLookup.className) {
			lookupObj = new jslet.data.FieldLookup(Z, lookupObj);
		}
		Z._removeRelation();
		
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('lookup', lookupObj);
		} else {
			Z._lookup = lookupObj;
		}
		if(lookupObj) {
			Z._addRelation();
		}
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		Z._fireLookupChangedEvent();
		return this;
	},
	
	/**
	 * @private
	 * 
	 * Fire lookup setting changed event.
	 */
	_fireLookupChangedEvent: function() {
		var Z = this;
		if(!Z._dataset) {
			return;
		}
		var fldName = this.name();
		var lookupEvt = jslet.data.RefreshEvent.lookupEvent(fldName, true);
		this._dataset.refreshControl(lookupEvt);
	},

	_getDatasetName: function(dsObjOrName) {
		return jslet.isString(dsObjOrName)? dsObjOrName: dsObjOrName.name();
	},

	/**
	 * @deprecated
	 * Use detailDataset instead.
	 */
	subDataset: function (subDataset) {
		return this.detailDataset(subDataset);
	},
	
	/**
	 * @property
	 * 
	 * Set or get sub dataset. <br />
	 * In jslet, there are two relations of dataset: LOOKUP and DETAIL.<br />
	 * "Detail" relation is used to define "Master/Detail" between two dataset.
	 * 
	 *     @example
	 *     var dsDetail = new jslet.data.Dataset({name: 'detail', fields: [...]); //create detail dataset
	 *     dsMaster.getField('detail1').detailDataset(dsDetail); //set detail dataset
	 *     
	 *     dsMaster.getField('detail1').detailDataset(); //get detail dataset
	 *  
	 * @param {jslet.data.Dataset | undefined} detailDataset Detail dataset.
	 * 
	 * @return {this | jslet.data.Dataset}
	 */
	detailDataset: function (detailDataset) {
		var Z = this;
		if (detailDataset === undefined) {
			if(Z._detailDataset && jslet.isString(Z._detailDataset)) {
				Z.detailDataset(Z._detailDataset);
				if(jslet.isString(Z._detailDataset)) {
					throw new Error(jslet.formatMessage(jsletlocale.Dataset.datasetNotFound, [Z._detailDataset]));
				}
			}
			return Z._detailDataset;
		}
		
		Z._removeRelation();
		if(!detailDataset) {
			Z._detailDataset = null;
			return this;
		}
		if (jslet.isString(detailDataset)) {
			var dtlDsObj = jslet.data.getDataset(detailDataset);
			if(!dtlDsObj) {
				Z._detailDataset = detailDataset;
				if(Z._dataset.createdByFactory) {
				    jslet.data.datasetFactory.createDataset(detailDataset);
				} else {
					if(jslet.global.dataset.onDatasetCreating) {
						var hostDsName = Z._datasetName;
						
						var creatingOpt = {datasetType: jslet.data.DatasetType.DETAIL}; 
						jslet.data.createDynamicDataset(detailDataset, creatingOpt, hostDsName);
					}
				}
				Z._addRelation();
				return this;
			}
			detailDataset = dtlDsObj;
		} else {
			jslet.Checker.test('Field.detailDataset', detailDataset).isClass(jslet.data.Dataset.className);
		}
		Z._detailDataset = detailDataset;
		Z._addRelation();
		return this;
	},

	urlExpr: function (urlExpr) {
		var Z = this;
		if (urlExpr === undefined) {
			return Z._urlExpr;
		}

		jslet.Checker.test('Field.urlExpr', urlExpr).isString();
		Z._urlExpr = jslet.trim(urlExpr);
		Z._innerUrlExpr = null;
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('urlExpr');
		return this;
	},

	urlTarget: function (target) {
		var Z = this;
		if (target === undefined){
			return !Z._urlTarget ? jslet.data.Field.URLTARGETBLANK : Z._urlTarget;
		}

		jslet.Checker.test('Field.urlTarget', target).isString();
		Z._urlTarget = jslet.trim(target);
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('urlTarget');
		return this;
	},

	calcUrl: function () {
		var Z = this;
		if (!this.dataset() || !Z._urlExpr) {
			return null;
		}
		if (!Z._innerUrlExpr) {
			Z._innerUrlExpr = new jslet.data.Expression(this.dataset(), Z._urlExpr);
		}
		return Z._innerUrlExpr.eval();
	},

	/**
	 * @property
	 * 
	 * Set or get if field need be anti-xss.
	 * If true, field value will be encoded.
	 * 
	 * @param {Boolean | undefined} isXss.
	 * @return {this | Boolean}
	 */
	antiXss: function(isXss){
		var Z = this;
		if (isXss === undefined) {
			return Z._antiXss;
		}
		Z._antiXss = isXss ? true: false;
		Z._fireGlobalMetaChangedEvent('antiXss');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get field rang.
	 * Range is an object as: {min: x, max: y}. Example:
	 * 
	 *     @example
	 *     //For String field
	 *     var range = {min: 'a', max: 'z'};
	 *     //For Date field
	 *     var range = {min: new Date(2000,1,1), max: new Date(2010,12,31)};
	 *     //For Number field
	 *     var range = {min: 0, max: 100};
	 *     fldObj.dataRange(range);
	 * 
	 * @param {Object | undefined} range Field range;
	 * @return {this | Object}
	 */
	dataRange: function (range) {
		var Z = this;
		if (range === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('dataRange');
			}
			return Z._dataRange;
		}
		if(range && jslet.isString(range)) {
			range = jslet.JSON.parse(range);
		}
		if(range) {
			jslet.Checker.test('Field.dataRange', range).isObject();
			if(range.min) {
				jslet.Checker.test('Field.dataRange.min', range.min).isDataType(Z._dateType);
			}
			if(range.max) {
				jslet.Checker.test('Field.dataRange.max', range.max).isDataType(Z._dateType);
			}
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('dataRange', range);
		} else {
			Z._dataRange = range;
		}
		Z._fireGlobalMetaChangedEvent('dataRange');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get regular expression.
	 * You can specify your own validator with regular expression. If regular expression not specified, 
	 * The default regular expression for Date and Number field will be used. Example:
	 * 
	 *     @example
	 *     var exprObj = {expr: /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, message: 'Invalid phone number!'};
	 *     fldObj.regularExpr(exprObj);//like: 0755-12345678
	 *     fldObj.regularExpr(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, 'Invalid phone number!');//like: 0755-12345678
	 * 
	 * @param {String} expr Regular expression;
	 * @param {String} message Message for invalid.
	 * @return {Object} An object like: {expr: expr, message: message}
	 */
	regularExpr: function (expr, message) {
		var Z = this;
		var argLen = arguments.length;
		if (argLen === 0){
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('regularExpr');
			}
			return Z._regularExpr;
		}
		if(argLen > 1) {
			expr = { expr: expr, message: message };
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('regularExpr', expr);
		} else {
			Z._regularExpr = expr;
		}
		Z._fireGlobalMetaChangedEvent('regularExpr');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get customized field value accessor, the example:
	 * 
	 *     @example
	 *     var accessor = {
	 * 	     getValue: function(dataRecord, fldName) {
	 *         var dynamicProps = dataRecord['dynamicProps'];
	 *         if(dynamicProps) {
	 *           return dynamicProps[fldName];
	 *         } else {
	 *           return null;
	 *         }
	 *         //The default method is: return dataRecord[fldname];
	 *      },
	 * 	     setValue: function(dataRecord, fldName, fldValue) {
	 *         //Field value is stores in property 'dynamicProps'
	 *         var dynamicProps = dataRecord['dynamicProps'];
	 *         if(!dynamicProps) {
	 *           dynamicProps = {};
	 *           dataRecord['dynamicProps'] = dynamicProps;
	 *         }
	 *         dynamicProps[fldName] = fldValue;
	 *         //The default method is: dataRecord[fldname] = fldValue;
	 *       }
	 *     };
	 *     fldDyncField1.customValueAccessor(accessor); 
	 *     fldDyncField2.customValueAccessor(accessor);
	 *     
	 * @param {Object | undefined} accessor Field raw value accessor.
	 * @param {Function} accessor.getValue The method to get value from the original record.
	 * @param {Object} accessor.getValue.dataRecord Field The original record.
	 * @param {Object} accessor.getValue.fieldName Field name.
	 * @param {Object} accessor.getValue.return Field value.
	 * @param {Object} accessor.setValue The method to get value from the original record.
	 * @param {Object} accessor.setValue.dataRecord Field The original record.
	 * @param {Object} accessor.setValue.fieldName Field name.
	 * 
	 * @return {this | Object}
	 */
	customValueAccessor: function(accessor) {
		var Z = this;
		if (accessor === undefined) {
			return Z._customValueAccessor;
		}
		Z._customValueAccessor = accessor;
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('customValueAccessor');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get customized field value converter. The converter is used to convert field value <--> field text. 
	 * 
	 * @param {jslet.data.FieldValueConverter | undefined} converter converter object, sub class of {@link jslet.data.FieldValueConverter}.
	 * 
	 * @return {this | jslet.data.FieldValueConverter} 
	 */
	customValueConverter: function (converter) {
		var Z = this;
		if (converter === undefined) {
			return Z._customValueConverter;
		}
		Z._customValueConverter = converter;
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('customValueConverter');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get customized validator. Example:
	 * 
	 *     @example
	 *     //Client validating
	 *     var clientValidateFn = function(fldObj, fldValue) {
	 *       if(fldValue <= 0) {
	 *       	return 'Must be great than 0';
	 *       } else 
	 *       	return null;
	 *     };
	 *     fldObj1.customValidator(clientValidateFn);
	 *     
	 *     var serverValidateFn = function(fldObj, fldValue, serverValidateFn) {
	 *       //Send request to server to validate.
	 *       return serverValidateFn('/xx/check.do', {fieldValue: fldValue});
	 *     };
	 *     fldObj2.customValidator(serverValidateFn);
	 * 
	 * @param {Function} validator Validator function.
	 * @param {jslet.data.Field} validator.fieldObject Field object.
	 * @param {Object} validator.fieldValue Field value.
	 * @param {Function} validator.serverValidateFn (optional) Validator function which will send request to server.
	 * @param {String} validator.serverValidateFn.requestUrl The request URL for server validator.
	 * @param {Object} validator.serverValidateFn.requestData The request data for server validator.
	 * @param {String} validator.serverValidateFn.return Error message, if validate failed, return error message, otherwise return null.
	 * @param {String} validator.return Error message, if validate failed, return error message, otherwise return null.
	 */
	customValidator: function (validator) {
		var Z = this;
		if (validator === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('customValidator');
			}
			return Z._customValidator;
		}
		if(validator) {
			jslet.Checker.test('Field.customValidator', validator).isFunction();
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('customValidator', validator);
		} else {
			Z._customValidator = validator;
		}
		Z._fireGlobalMetaChangedEvent('customValidator');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Valid characters for this field.
	 * 
	 *     @example
	 *     fldObj.validChars('abc'); //Set property, return this.
	 *     var propValue = dsObj.validChars(); //Get property value.
	 * 
	 * @param {String | undefined} validChars Valid characters.
	 * 
	 * @return {this | String}
	 */
	validChars: function(validChars){
		var Z = this;
		if (validChars === undefined){
			var result = Z._validChars;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				result = Z._getProxyPropValue('validChars');
			}
			if (result) {
				return result;
			}
			if (Z.getType() == jslet.data.DataType.NUMBER){
				return Z._scale ? '+-0123456789.' : '+-0123456789';
			}
			if (Z.getType() == jslet.data.DataType.DATE){
				var displayFormat = Z.displayFormat();
				validChars = '0123456789';
				for(var i = 0, len = displayFormat.length; i < len; i++) {
					var c = displayFormat.charAt(i);
					if(c === 'y' || c === 'M' || c === 'd' || c === 'h' || c === 'm' || c === 's') {
						continue;
					}
					validChars += c;
				}
				return validChars;
			}
			return null;
		}
		
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('validChars', validChars);
		} else {
			Z._validChars = validChars;
		}
		Z._fireGlobalMetaChangedEvent('validChars');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Used for Boolean field, actual value for 'true' value, like: 1, 'yes', 'true'. Example:
	 * 
	 *     @example
	 *     var propValue = dsObj.trueValue(); //get property.
	 *     
	 *     var fldObj = dsObj.getField('booleanFld');
	 *     var rec = dsObj.getRecord(); //Get original record object
	 *     fldObj.trueValue(1); 
	 *     fldObj.setValue(true);
	 *     console.log(rec.booleanFld); //return 1
	 *     
	 *     fldObj.trueValue('yes'); //
	 *     fldObj.setValue(true);
	 *     console.log(rec.booleanFld); //return 'yes'
	 * 
	 * @param {Object | undefined} trueValue Actual value for 'true' value.
	 * 
	 * @return {this | Object}
	 */
	trueValue: function(trueValue) {
		var Z = this;
		if (trueValue === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('trueValue');
			}
			return Z._trueValue;
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('trueValue', trueValue);
		} else {
			Z._trueValue = trueValue;
		}
		return this;		
	},
	
	/**
	 * @property
	 * 
	 * Used for Boolean field, actual value for 'false' value, like: 0, 'no', 'false'. Example:
	 * 
	 *     @example
	 *     var propValue = dsObj.falseValue(); //get property.
	 *     
	 *     var fldObj = dsObj.getField('booleanFld');
	 *     var rec = dsObj.getRecord(); //Get original record object
	 *     fldObj.falseValue(1); 
	 *     fldObj.setValue(false);
	 *     console.log(rec.booleanFld); //return 1
	 *     
	 *     fldObj.trueValue('no'); //
	 *     fldObj.setValue(false);
	 *     console.log(rec.booleanFld); //return 'no'
	 * 
	 * @param {Object | undefined} falseValue Actual value for 'false' value.
	 * 
	 * @return {this | Object}
	 */
	falseValue: function(falseValue) {
		var Z = this;
		if (falseValue === undefined) {
			if(Z._dataType == jslet.data.DataType.PROXY) {
				return Z._getProxyPropValue('falseValue');
			}
			return Z._falseValue;
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('falseValue', falseValue);
		} else {
			Z._falseValue = falseValue;
		}
		return this;		
	},
	
	/**
	 * @property
	 * 
	 * Used for Boolean field, diaplay text for 'true' value, like: 'Yes', 'True', 'Enabled'. Example:
	 * 
	 *     @example
	 *     var propValue = dsObj.trueText(); //get property.
	 *     
	 *     var fldObj = dsObj.getField('booleanFld');
	 *     fldObj.trueText('Enabled'); 
	 *     fldObj.setValue(true);
	 *     dsObj.getFieldText('booleanFld'); //return 'Enabled'
	 *     
	 *     fldObj.trueText('yes'); //
	 *     fldObj.setValue(true);
	 *     dsObj.getFieldText('booleanFld'); //return 'Yes'
	 * 
	 * @param {Object | undefined} trueText Display text for 'true' value.
	 * 
	 * @return {this | Object}
	 */
	trueText: function(trueText) {
		var Z = this;
		if (trueText === undefined) {
			var result = Z._trueText;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				result = Z._getProxyPropValue('trueText');
			}
			return result || jsletlocale.Dataset.trueText;
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('trueText', trueText);
		} else {
			Z._trueText = trueText;
		}
		return this;		
	},
	
	/**
	 * @property
	 * 
	 * Used for Boolean field, diaplay text for 'false' value, like: 'No', 'False', 'Disabled'. Example:
	 * 
	 *     @example
	 *     var propValue = dsObj.falseText(); //get property.
	 *     
	 *     var fldObj = dsObj.getField('booleanFld');
	 *     fldObj.trueText('Disabled'); 
	 *     fldObj.setValue(false);
	 *     dsObj.getFieldText('booleanFld'); //return 'Disabled'
	 *     
	 *     fldObj.trueText('No'); //
	 *     fldObj.setValue(false);
	 *     dsObj.getFieldText('booleanFld'); //return 'No'
	 * 
	 * @param {Object | undefined} falseText Display text for 'false' value.
	 * 
	 * @return {this | Object}
	 */
	falseText: function(falseText) {
		var Z = this;
		if (falseText === undefined) {
			var result = Z._falseText;
			if(Z._dataType == jslet.data.DataType.PROXY) {
				result = Z._getProxyPropValue('falseText');
			}
			return result || jsletlocale.Dataset.falseText;
		}
		if(Z._dataType == jslet.data.DataType.PROXY) {
			Z._setProxyPropValue('falseText', falseText);
		} else {
			Z._falseText = falseText;
		}
		return this;		
	},
	
	/**
	 * @property
	 * 
	 * Set or get whether the same field values will be merged.
	 * 
	 *     @example
	 *     dsFld.mergeSame(true); //Set property, return this.
	 *     var propValue = fldObj.mergeSame(); //Get property value.
	 * 
	 * @param {Boolean | undefined} mergeSame.
	 * 
	 * @return {this | Boolean}
	 */
	mergeSame: function(mergeSame){
		var Z = this;
		if (mergeSame === undefined) {
			return Z._mergeSame;
		}
		Z._mergeSame = mergeSame ? true: false;
		Z._fireGlobalMetaChangedEvent('mergeSame');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get the field names to be merge by. <br />
	 * Multiple field names are separated by ','.
	 * 
	 *     @example
	 *     //The the same field values of "salesNo" + "customer" will be merged. 
	 *     dsObj.getField('customer').mergeSame(true);
	 *     dsFld.mergeSameBy('salesNo');
	 * 
	 * @param {String | undefined} mergeSameBy.
	 * 
	 * @return {this | String}
	 */
	mergeSameBy: function(mergeSameBy){
		var Z = this;
		if (mergeSameBy === undefined) {
			return Z._mergeSameBy;
		}
		jslet.Checker.test('Field.mergeSameBy', mergeSameBy).isString();
		Z._mergeSameBy = jslet.trim(mergeSameBy);
		Z._fireGlobalMetaChangedEvent('mergeSameBy');
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get if the field is following the value of previous record which append before.
	 * 
	 *     @example
	 *     dsObj.getField('fld1').valueFollow(true);
	 *     dsObj.setFieldValue('fld1', 123); //Step 1
	 *     dsObj.confirm();
	 *     dsObj.appendRecord();
	 *     dsObj.getFieldValue('fld1'); //return 123, same as "step 1"
	 * 
	 * @param {Boolean | undefined} valueFollow True - the default value is same as the value which appended before, false -otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	valueFollow: function(valueFollow) {
		var Z = this;
		if(valueFollow === undefined) {
			if(Z._formula) { //Formula field can't set value followed or it will cause unpredictable issue.
				return false;
			}
			return Z._valueFollow;
		}
		Z._valueFollow = valueFollow? true: false;
		if(!Z._valueFollow && Z._dataset) {
			Z._dataset.clearFollowedValues();
		}
		Z._fireGlobalMetaChangedEvent('valueFollow');
		return this;
	},

	/**
	 * @property
	 * 
	 * Identity whether trim the prefix or suffix blank character when setting field value.
	 * 
	 * @param {Boolean | undefined} trimBlank True - (Default) trim the prefix or suffix blank character, false -otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	trimBlank: function(trimBlank) {
		var Z = this;
		if(trimBlank === undefined) {
			return Z._trimBlank;
		}
		Z._trimBlank = trimBlank? true: false;
		Z._fireGlobalMetaChangedEvent('_trimBlank');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get whether the field is focused or not. <br />
	 * If a field is focused, the input focus will be jumped in them.
	 * 
	 * @param {Boolean | undefined} focused True - the field is focused, false - otherwise.
	 * 
	 * @return {this | Boolean}
	 */
	focused: function(focused) {
		var Z = this;
		if(focused === undefined) {
			return Z._focused;
		}
		focused = focused? true: false;
		if(focused === Z._focused) {
			return this;
		}
		Z._focused = focused;
		if(Z._dataset) {
			Z._dataset.calcFocusedFields();
		}
		Z._fireGlobalMetaChangedEvent('focused');
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get whether the field is encrypted or not. <br />
	 * It can be an object like: {start: 5, end: 8}. Example:
	 * 
	 *     @example
	 *     fldObj.encrypted({start: 5, end: 8});
	 *     //If field value is : '0123456789', the display text will be '01234***890'.
	 *      
	 * @param {Object | undefined} encrypted An plan object.
	 * @param {Integer} encrypted.start The start position to be encrypted, start with 0.
	 * @param {Integer} encrypted.end The end position to be encrypted(Not include the end position).
	 * 
	 * @return {this | Object}
	 */
	encrypted: function(encrypted) {
		var Z = this;
		if(encrypted === undefined) {
			return Z._encrypted;
		}
		jslet.Checker.test('Field.encrypted', encrypted).isPlanObject();
		if(encrypted) {
			jslet.Checker.test('Field.encrypted.start', encrypted.start).isGTEZero();
			jslet.Checker.test('Field.encrypted.end', encrypted.end).isGTEZero();
		}
		Z._encrypted = encrypted;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get whether the field value is aggregated.
	 * 
	 * @param {Boolean | undefined} aggregated.
	 * 
	 * @return {this | Boolean}
	 */
	aggregated: function (aggregated) {
		var Z = this;
		if (aggregated === undefined){
			return Z._aggregated;
		}
		
		Z._aggregated = aggregated? true: false;
		if(Z._dataset) {
			Z._dataset.refreshAggregatedFields();
		}
		Z._fireGlobalMetaChangedEvent('aggregated');
		return this;
	},

	/*
	 * @deprecated
	 * Use aggregated instead.
	 */
	aggraded: function (aggregated) {
		return this.aggregated(aggregated);
	},

	/**
	 * @property
	 * 
	 * Set or get the field names to aggregate field value. <br /> 
	 * Same field values which specified by "aggregatedBy" will only calculate once. Multiple field names are separated by ','.
	 * 
	 * @param {String | undefined} aggregatedBy Field names.
	 * 
	 * @return {this | String}
	 */
	aggregatedBy: function(aggregatedBy){
		var Z = this;
		if (aggregatedBy === undefined) {
			return Z._aggregatedBy;
		}
		jslet.Checker.test('Field.aggregatedBy', aggregatedBy).isString();
		Z._aggregatedBy = jslet.trim(aggregatedBy);
		Z._fireGlobalMetaChangedEvent('aggregatedBy');
		return this;
	},

	/*
	 * @deprecated
	 * Use aggregatedBy instead.
	 */
	aggradedBy: function(aggregatedBy){
		return this.aggregatedBy(aggregatedBy);
	},
	
	extendHostName: function(extendHostName) {
		var Z = this;
		if(extendHostName === undefined) {
			return Z._extendHostName;
		}
		jslet.Checker.test('Field.extendHostName', extendHostName).isString();
		Z._extendHostName = extendHostName;
		return this;
	},
	
	crossSource: function(crossSource) {
		var Z = this;
		if(crossSource === undefined) {
			return Z._crossSource;
		}
		jslet.Checker.test('Field.crossSource', crossSource).isClass(jslet.data.CrossFieldSource.className);
		Z._crossSource = crossSource;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get fixed field value, if field value not specified, fixed field value used.<br />
	 * This property can be used to display non-data field, like "action field"(one or multiple buttons).
	 * 
	 * @param {String | undefined} fixedValue Fixed value.
	 * 
	 * @return {this | String}
	 */
	fixedValue: function(fixedValue){
		var Z = this;
		if (fixedValue === undefined) {
			return Z._fixedValue;
		}
		jslet.Checker.test('Field.fixedValue', fixedValue).isString();
		Z._fixedValue = jslet.trim(fixedValue);
		Z._fireGlobalMetaChangedEvent('fixedValue');
		return this;
	},
	
	/**
	 * Get field value.
	 * 
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {Object}
	 */
	getValue: function(valueIndex) {
		return this._dataset.getFieldValue(this._fieldName, valueIndex);
	},
	
	/**
	 * Set field value.
	 * 
	 * @param {Object} value Field value.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, start with 0.
	 * 
	 * @return {this}
	 */
	setValue: function(value, valueIndex) {
		this._dataset.setFieldValue(this._fieldName, value, valueIndex);
		return this;
	},

	/**
	 * Get field text.
	 * 
	 * @param {Boolean} isEditing (optional) In edit mode or not, if in edit mode, return 'Input Text'(user inputting text), else return 'Display Text'(Display text is almost formatted). 
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, starts with 0.
	 * 
	 * @return {String} Field text.
	 */
	getTextValue: function(isEditing, valueIndex) {
		return this._dataset.getFieldText(this._fieldName, isEditing, valueIndex);
	},
	
	/**
	 * Set field text.
	 * 
	 * @param {String} inputText String value inputed by user.
	 * @param {Integer} valueIndex (optional) Field value index, only used for field.valueStyle is BETWEEN or MULTIPLE, starts with 0.
	 * 
	 * @return {this}
	 */
	setTextValue: function(inputText, valueIndex) {
		this._dataset.setFieldText(this._fieldName, inputText, valueIndex);
		return this;
	},
	
	/**
	 * Clone a field object. Example:
	 * 
	 *     @example
	 *     var dsNew = jslet.data.getDataset('newDataset');
	 *     var newFldObj = fldObj.clone('field1', dsNew);
	 *     dsNew.addField(newFldObj);
	 * 
	 * @param {String} fldName Field name.
	 * @param {jslet.data.Dataset} newDataset New dataset object.
	 * 
	 * @return {jslet.data.Field}
	 */
	clone: function(fldName, newDataset){
		var Z = this;
		jslet.Checker.test('Field.clone#fldName', fldName).required().isString();
		
		var result = new jslet.data.Field(newDataset, {name: fldName, dataType: Z._dataType, detailDataset: Z._detailDataset});
		newDataset = newDataset || this.dataset();
		result.dataset(newDataset);
		result.visible(Z._visible);
		if (Z._parent) {
			result.parent(Z._parent.clone(Z._parent.name(), newDataset));
		}
		if (Z._children && Z._children.length > 0){
			var childFlds = [], childFldObj;
			for(var i = 0, cnt = Z._children.length; i < cnt; i++){
				childFldObj = Z._children[i];
				childFlds.push(childFldObj.clone(childFldObj.name(), newDataset));
			}
			result.children(childFlds);
		}
		
		result.length(Z._length);
		result.scale(Z._scale);
		result.alignment(Z._alignment);
		result.defaultExpr(Z._defaultExpr);
		result.defaultValue(Z._defaultValue);
		result.label(Z._label);
		result.displayLabel(Z._displayLabel);
		
		result.shortName(Z._shortName);
		result.tip(Z._tip);
		result.displayWidth(Z._displayWidth);
		if (Z._editMask) {
			result.editMask(Z._editMask.clone());
		}
		result.displayOrder(Z._displayOrder);
		result.tabIndex(Z._tabIndex);
		result.displayFormat(Z._displayFormat);
		result.formula(Z._formula);
		result.unique(Z._unique);
		result.required(Z._required);
		result.readOnly(Z._readOnly);
		result.disabled(Z._disabled);
		result.unitConverted(Z._underted);
		if (Z._lookup) {
			result.lookup(Z._lookup.clone(result));
		}
		result.displayControl(Z._displayControl);
		result.editControl(Z._editControl);
		result.urlExpr(Z._urlExpr);
		result.urlTarget(Z._urlTarget);
		result.valueStyle(Z._valueStyle);
		result.valueCountLimit(Z._valueCountLimit);
		result.valueCountRange(Z._valueCountRange);
		result.nullText(Z._nullText);
		result.dataRange(Z._dataRange);
		if (Z._regularExpr) {
			result.regularExpr(Z._regularExpr);
		}
		result.antiXss(Z._antiXss);
		result.customValidator(Z._customValidator);
		result.customValueConverter(Z._customValueConverter);
		result.customValueAccessor(Z._customValueAccessor);
		result.validChars(Z._validChars);
		
		result.mergeSame(Z._mergeSame);
		result.mergeSameBy(Z._mergeSameBy);
		result.fixedValue(Z._fixedValue);
		
		result.valueFollow(Z._valueFollow);
		result.trimBlank(Z._trimBlank);
		result.focused(Z._focused);
		result.encrypted(Z._encrypted);
		result.aggregated(Z._aggregated);
		result.aggregatedBy(Z._aggregatedBy);

		result.trueValue(Z._trueValue);
		result.falseValue(Z._falseValue);
		result.trueText(Z._trueText);
		result.falseText(Z._falseText);
		result._addRelation();
		return result;
	},
	
	_clearFieldCache: function() {
		var Z = this;
		if(Z._dataset && Z._fieldName) {
			jslet.data.FieldValueCache.clearAll(Z._dataset, Z._fieldName);
		}
	}
	
};

jslet.data.Field.URLTARGETBLANK = '_blank';


/**
 * @class
 * 
 * A lookup field represents a field value is from another dataset named "Lookup Dataset";
 * 
 * @param {jslet.data.Field} hostFieldObject Host field object.
 * @param {Object} lookupConfig Lookup field configuration. Its member must be same the properties of jslet.data.FieldLookup.
 */
jslet.data.FieldLookup = function(hostFldObj, lookupCfg) {
	jslet.Checker.test('FieldLookup#hostFldObj', hostFldObj).required().isClass(jslet.data.Field.className);
	jslet.Checker.test('FieldLookup#lookupCfg', lookupCfg).required();
	if (jslet.isString(lookupCfg)) {
		lookupCfg = lookupCfg.trim();
		if(lookupCfg) {
			if(lookupCfg.trim().startsWith('{')) {
				lookupCfg = jslet.JSON.parse(lookupCfg);
			} else {
				lookupCfg = {dataset: lookupCfg};
			}
		}
	}

	jslet.Checker.test('FieldLookup#lookupCfg.dataset', lookupCfg.dataset).required();
	var Z = this;
	Z._hostDatasetName = hostFldObj.dataset().name();
	Z._hostField = hostFldObj;//The field which contains this lookup field object.
	Z._dataset = null;
	Z._realDataset = null;
	Z._dsParsed = false;
	Z._keyField = null;
	Z._codeField = null;
	Z._nameField = null;
	Z._codeFormat = null;
	Z._displayFields = null;
	Z._innerdisplayFields = null;
	Z._parentField = null;
	Z._onlyLeafLevel = true;
	Z._returnFieldMap = null;
	Z._editFilter = null;
	Z._editItemDisabled = false;
	Z._onlyLookupFields = false;
	Z._includeFields = null;
	Z._excludeFields = null;
	Z._visibleFields = null;
	Z._create(lookupCfg);
};
jslet.data.FieldLookup.className = 'jslet.data.FieldLookup';

jslet.data.FieldLookup.prototype = {
	className: jslet.data.FieldLookup.className,
	
	_create: function(param) {
		var Z = this;
		if (param.realDataset !== undefined) {
			Z.realDataset(param.realDataset);
		}
		
		if (param.keyField !== undefined) {
			Z.keyField(param.keyField);
		}
		if (param.codeField !== undefined) {
			Z.codeField(param.codeField);
		}
		if (param.nameField !== undefined) {
			Z.nameField(param.nameField);
		}
		if (param.parentField !== undefined) {
			Z.parentField(param.parentField);
		}
		if (param.displayFields !== undefined) {
			Z.displayFields(param.displayFields);
		}
		if (param.onlyLeafLevel !== undefined) {
			Z.onlyLeafLevel(param.onlyLeafLevel);
		}
		if (param.returnFieldMap !== undefined) {
			Z.returnFieldMap(param.returnFieldMap);
		}
		if (param.editFilter !== undefined) {
			Z.editFilter(param.editFilter);
		}
		if (param.editItemDisabled !== undefined) {
			Z.editItemDisabled(param.editItemDisabled);
		}
		
		if (param.onlyLookupFields !== undefined) {
			Z.onlyLookupFields(param.onlyLookupFields);
		}
		
		if (param.includeFields !== undefined) {
			Z.includeFields(param.includeFields);
		}
		
		if (param.excludeFields !== undefined) {
			Z.excludeFields(param.excludeFields);
		}
		
		if (param.visibleFields !== undefined) {
			Z.visibleFields(param.visibleFields);
		}
		
		Z.dataset(param.dataset);
	},
	
	clone: function(hostFldObj){
		var Z = this, 
			result = new jslet.data.FieldLookup(hostFldObj, {dataset: Z._dataset});
		result.keyField(Z._keyField);
		result.codeField(Z._codeField);
		result.nameField(Z._nameField);
		result.displayFields(Z._displayFields);
		result.parentField(Z._parentField);
		result.onlyLeafLevel(Z._onlyLeafLevel);
		result.returnFieldMap(Z._returnFieldMap);
		result.editFilter(Z._editFilter);
		result.editItemDisabled(Z._editItemDisabled);
		
		result.onlyLookupFields(Z._onlyLookupFields);
		result.includeFields(Z._includeFields);
		result.excludeFields(Z._excludeFields);
		result.visibleFields(Z._visibleFields);
		return result;
	},
	
	toPlanObject: function() {
		var Z = this,
			result = {};
		result.dataset = Z._dataset;
		result.keyField = Z._keyField;
		result.codeField = Z._codeField;
		result.nameField = Z._nameField;
		result.displayFields = Z._displayFields;
		result.parentField = Z._parentField;
		result.onlyLeafLevel = Z._onlyLeafLevel;
		result.returnFieldMap = Z._returnFieldMap;
		result.editFilter = Z._editFilter;
		result.editItemDisabled = Z._editItemDisabled;
		
		result.onlyLookupFields = Z._onlyLookupFields;
		result.includeFields = Z._includeFields;
		result.excludeFields = Z._excludeFields;
		result.visibleFields = Z._visibleFields;
		return result;
	},
	
	hostField: function(fldObj) {
		var Z = this;
		if (fldObj === undefined) {
			return Z._hostField;
		}
		jslet.Checker.test('FieldLookup.hostField', fldObj).isClass(jslet.data.Field.className);
		Z._hostField = fldObj;
		return this;
	},
	
	/**
	 * Fire lookup setting changed event.
	 */
	_fireLookupChangedEvent: function() {
		var Z = this;
		if(!Z._hostField) {
			return;
		}
		Z._hostField._fireLookupChangedEvent();
	},

	/**
	 * @property
	 * 
	 * Set or get lookup dataset.
	 * 
	 * @param {jslet.data.Dataset | undefined} dataset Lookup dataset.
	 * 
	 * @return {this | jslet.data.Dataset}
	 */
	dataset: function(lkdataset) {
		var Z = this;
		if (lkdataset === undefined) {
			if(!Z._dsParsed) {
				Z.dataset(Z._dataset);
				if(!Z._dsParsed) {
					throw new Error('Not found lookup dataset: ' + Z._dataset);
				}			}
			
			return Z._dataset;
		}
		var lkDsName;
		if(lkdataset) {
			if (typeof(lkdataset) == 'string') {
				lkDsName = lkdataset;
			} else {
				lkDsName = lkdataset.name();
			}
			if(lkDsName == Z._hostDatasetName) {
				throw new Error(jsletlocale.Dataset.LookupDatasetNotSameAsHost);
			}
		}
		var lkDsObj = lkdataset;
		if (typeof(lkDsObj) == 'string') {
			lkDsObj = jslet.data.getDataset(lkDsObj);
			if(!lkDsObj) {
				var creatingOpt = {datasetType: jslet.data.DatasetType.LOOKUP, 
						onlyLookupFields: (Z._onlyLookupFields === undefined || Z._onlyLookupFields)};
				if(Z._includeFields) {
					creatingOpt.includeFields = Z._includeFields;
				}
				if(Z._excludeFields) {
					creatingOpt.excludeFields = Z._excludeFields;
				}
				if(Z._visibleFields) {
					creatingOpt.visibleFields = Z._visibleFields;
				}
				if(Z._realDataset) {
					creatingOpt.realDatasetName = Z._realDataset;
				}
				if(Z._hostField.dataset().createdByFactory) {
				    jslet.data.datasetFactory.createDataset(lkdataset, creatingOpt);
				} else if(jslet.global.dataset.onDatasetCreating &&
					jslet.data.defaultDatasetCreatingManager.allowCreatingDataset(Z._hostDatasetName)) {
					jslet.data.createDynamicDataset(lkdataset, creatingOpt, Z._hostDatasetName);
				} 
			}
		}
		if(lkDsObj) {
			Z._dataset = lkDsObj;
			Z._dataset.autoRefreshHostDataset(true);
			Z._dsParsed = true;
			Z._fireLookupChangedEvent();
		} else {
			Z._dataset = lkdataset;
			Z._dsParsed = false;
		}

		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get key field. <br />
	 * Key field is optional, if it is null, it will use LookupDataset.keyField instead. 
	 * 
	 * @param {String | undefined} keyFldName Key field name.
	 * 
	 * @return {this | String}
	 */
	realDataset: function(realDataset) {
		var Z = this;
		if (realDataset === undefined){
			return Z._realDataset;
		}

		jslet.Checker.test('FieldLookup.realDataset', realDataset).isString();
		Z._realDataset = realDataset;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Set or get key field. <br />
	 * Key field is optional, if it is null, it will use LookupDataset.keyField instead. 
	 * 
	 * @param {String | undefined} keyFldName Key field name.
	 * 
	 * @return {this | String}
	 */
	keyField: function(keyFldName) {
		var Z = this;
		if (keyFldName === undefined){
			return Z._keyField || Z.dataset().keyField();
		}

		jslet.Checker.test('FieldLookup.keyField', keyFldName).isString();
		Z._keyField = jslet.trim(keyFldName);
		Z._fireLookupChangedEvent();
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get code field. <br />
	 * Code field is optional, if it is null, it will use LookupDataset.codeField instead. 
	 * 
	 * @param {String | undefined} codeFldName Code field name.
	 * 
	 * @return {this | String}
	 */
	codeField: function(codeFldName) {
		var Z = this;
		if (codeFldName === undefined){
			return Z._codeField || Z.dataset().codeField();
		}

		jslet.Checker.test('FieldLookup.codeField', codeFldName).isString();
		Z._codeField = jslet.trim(codeFldName);
		Z._fireLookupChangedEvent();
		return this;
	},
	
	codeFormat: function(format) {
		var Z = this;
		if (format === undefined) {
			return Z._codeFormat;
		}

		jslet.Checker.test('FieldLookup.codeFormat', format).isString();
		Z._codeFormat = jslet.trim(format);
		Z._fireLookupChangedEvent();
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get name field. <br />
	 * Name field is optional, if it is null, it will use LookupDataset.nameField instead. 
	 * 
	 * @param {String | undefined} nameFldName Name field name.
	 * 
	 * @return {this | String}
	 */
	nameField: function(nameFldName) {
		var Z = this;
		if (nameFldName === undefined){
			return Z._nameField || Z.dataset().nameField();
		}

		jslet.Checker.test('FieldLookup.nameField', nameFldName).isString();
		Z._nameField = jslet.trim(nameFldName);
		Z._fireLookupChangedEvent();
		return this;
	},

	/**
	 * @property
	 * 
	 * Set or get parent field. <br />
	 * Parent field is optional, if it is null, it will use LookupDataset.parentField instead. 
	 * 
	 * @param {String | undefined} parentFldName Parent field name.
	 * 
	 * @return {this | String}
	 */
	parentField: function(parentFldName) {
		var Z = this;
		if (parentFldName === undefined){
			return Z._parentField || Z.dataset().parentField();
		}

		jslet.Checker.test('FieldLookup.parentField', parentFldName).isString();
		Z._parentField = jslet.trim(parentFldName);
		Z._fireLookupChangedEvent();
		return this;
	},

	/**
	 * @property
	 * 
	 * An expression for display field value. Example:
	 * 
	 *     @example
	 *     lookupFldObj.displayFields('[code]-[name]'); //set property value
	 *     lookupFldObj.displayFields(); //get property value.
	 *    
	 * @param {String | undefined} displayFields Display fields expression.
	 * 
	 * @return {this | String}
	 */
	displayFields: function(fieldExpr) {
		var Z = this;
		if (fieldExpr === undefined) {
			return Z._displayFields? Z._displayFields: this.getDefaultDisplayFields();
		}
		jslet.Checker.test('FieldLookup.displayFields', fieldExpr).isString();
		fieldExpr = jslet.trim(fieldExpr);
		if (Z._displayFields != fieldExpr) {
			Z._displayFields = fieldExpr;
			Z._innerdisplayFields = null;
			if(Z._hostField) {
				Z._hostField._clearFieldCache();
			}
		}
		Z._fireLookupChangedEvent();
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Return extra field values of lookup dataset into main dataset. <br />
	 * Map format: {"main dataset field name":"lookup dataset field name", ...}. <br /> 
	 * Example:
	 * 
	 *     @example
	 *     lookupObj.returnFieldMap({hostDsFieldName: lookupDsFieldName}); //Set property value
	 *     lookupObj.returnFieldMap(); //Get property value
	 *     
	 *     var dsDepartment = jslet.data.getDataset('customer'); //Fields: custNo, custName, contactor
	 *     var dsSales = jslet.data.getDataset('sales'); //Fields: customer, customerName, contactor
	 *     
	 *     dsSales.getField('customer').lookup().returnFieldMap({"customerName": "custName", "contactor": "contactor"});
	 *     
	 *     dsSales.setFieldValue('customer', 23); //Add customer(custName: 'IBM', contactor: 'James')
	 *     
	 *     //After customer is set, the field value of 'customerName' and 'contactor' will be set automatically.
	 *     dsSales.getFieldValue('customerName'); //return 'IBM'
	 *     dsSales.getFieldValue('contactor'); //return 'James'
	 *     
	 *       
	 * @param {Object | undefined} returnFieldMap The key is master dataset's field name, and the value is the lookup dataset's field name.
	 * 
	 * @return {this | Object}
	 */
	returnFieldMap: function(returnFieldMap) {
		if(returnFieldMap === undefined) {
			return this._returnFieldMap;
		}
		jslet.Checker.test('FieldLookup.returnFieldMap', returnFieldMap).isObject();
		this._returnFieldMap = returnFieldMap;
	},
	
	/**
	 * @private
	 */
	getDefaultDisplayFields: function() {
//		var expr = '[',fldName = this.codeField();
//		if (fldName) {
//			expr += fldName + ']';
//		}
//		fldName = this.nameField();
//
//		if (fldName) {
//			expr += '+"-"+[';
//			expr += fldName + ']';
//		}
//		if (expr === '') {
//			expr = '"Not set displayFields"';
//		}
//		
		var expr = '[' + (this.nameField() || this.codeField() || this.keyField()) + ']';
		return expr;
	},

	/**
	 * @private
	 */
	getCurrentDisplayValue: function() {
		var Z = this;
		if (Z._displayFields === null) {
			this.displayFields(this.getDefaultDisplayFields());
		}
		if(!Z._innerdisplayFields) {
			Z._innerdisplayFields = new jslet.data.Expression(Z.dataset(), Z.displayFields());
		}
		
		return Z._innerdisplayFields.eval();
	},

	/**
	 * @property
	 * 
	 * Identify whether user can select leaf level item if lookup dataset is a tree-style dataset.
	 * 
	 * @param {Boolean | undefined} onlyLeafLevel True(Default) - Only leaf level item user can selects, false - otherwise.
	 * @return {this | Boolean}
	 */
	onlyLeafLevel: function(flag) {
		var Z = this;
		if (flag === undefined) {
			return Z._onlyLeafLevel;
		}
		Z._onlyLeafLevel = flag ? true: false;
		Z._fireLookupChangedEvent();
		return this;
	},

	/**
	 * @property
	 * 
	 * An expression to filter lookup dataset records when editing the host dataset. Example:
	 * 
	 *     @example
	 *     lookupFldObj.editFilter('like([code], "101%" ');
	 * 
	 * @param {String | undefined} editFilter An expression to filter the lookup dataset.
	 * 
	 * @return {this | String}
	 */
	editFilter: function(editFilter) {
		var Z = this;
		if (editFilter === undefined) {
			return Z._editFilter;
		}
		jslet.Checker.test('FieldLookup.editFilter', editFilter).isString();
		
		if (Z._editFilter != editFilter) {
			Z._editFilter = editFilter;
		}
		Z._fireLookupChangedEvent();
		return this;
	},
	
	/**
	 * @property
	 * 
	 * Disable or hide the edit item which not match the 'editFilter'.
	 * editItemDisabled is true, the non-matched item will be disabled, not hidden.
	 * 
	 * @param {Boolean | undefined} editItemDisabled - true: disable edit item, false: hide edit item, default is true.
	 * 
	 * @return {this | Boolean}
	 */
	editItemDisabled: function(editItemDisabled) {
		var Z = this;
		if (editItemDisabled === undefined) {
			return Z._editItemDisabled;
		}
		
		Z._editItemDisabled = editItemDisabled? true: false;
		Z._fireLookupChangedEvent();
		return this;
	},
	
	/**
	 * @property
	 * 
	 * It's used to create lookup dataset.
	 * if onlyLookupFields is true, it will create dataset with fields 
	 * which specified by the following dataset's properties: keyField, codeField, nameField, parentField and statusField;
	 * 
	 * @param{Boolean | undefined} onlyLookupFields
	 * 
	 * @return {this | Boolean}
	 */
	onlyLookupFields: function(onlyLookupFields) {
		var Z = this;
		if (onlyLookupFields === undefined) {
			return Z._onlyLookupFields;
		}
		
		Z._onlyLookupFields = onlyLookupFields? true: false;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * It's used to create lookup dataset.
	 * Creating lookup dataset with the specified field names.
	 * 
	 * @param {String[] | undefined} includeFields.
	 * 
	 * @return {this | String[]}
	 */
	includeFields: function(includeFields) {
		var Z = this;
		if (includeFields === undefined) {
			return Z._includeFields;
		}
		
		jslet.Checker.test('FieldLookup.includeFields', includeFields).isArray();
		Z._includeFields = includeFields;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * It's used to create lookup dataset.
	 * Creating lookup dataset with the specified field names.
	 * 
	 * @param{String[] | undefined} excludeFields.
	 * 
	 * @return {this | String[]}
	 */
	excludeFields: function(excludeFields) {
		var Z = this;
		if (excludeFields === undefined) {
			return Z._excludeFields;
		}
		
		jslet.Checker.test('FieldLookup.excludeFields', excludeFields).isArray();
		Z._excludeFields = excludeFields;
		return this;
	},
	
	/**
	 * @property
	 * 
	 * It's used to create lookup dataset to specified which fields is visible.
	 * 
	 * @param{String[] | undefined} visibleFields Visible fields.
	 * 
	 * @return {this | String[]}
	 */
	visibleFields: function(visibleFields) {
		var Z = this;
		if (visibleFields === undefined) {
			return Z._visibleFields;
		}
		
		jslet.Checker.test('FieldLookup.visibleFields', visibleFields).isArray();
		Z._visibleFields = visibleFields;
		return this;
	}
	
};

jslet.data.CrossFieldSource = function() {
	var Z = this;
	
	Z._sourceType = 0; //Optional value: 0-field, 1-custom'
	Z._sourceField = null;
	Z._lookupLevel = 1;
	
	Z._labels = null;
	Z._values = null;
	Z._matchExpr = null;
	
	Z._hideEmptyValue = false;
	Z._hasSubtotal = true;
	Z._subtotalPosition = 1; //Optional value: 0-first, 1-end
	Z._subtotalLabel = null;		
};
jslet.data.CrossFieldSource.className = 'jslet.data.CrossFieldSource';

jslet.data.CrossFieldSource.prototype = {
	className: jslet.data.CrossFieldSource.className,
	
	clone: function(){
		var Z = this, 
			result = new jslet.data.CrossFieldSource();
		result.sourceType(Z._sourceType);
		result.sourceField(Z._sourceField);
		result.lookupLevel(Z._lookupLevel);
		result.labels(Z._labels);
		result.values(Z._values);
		result.matchExpr(Z._matchExpr);
		result.hideEmptyValue(Z._hideEmptyValue);
		result.hasSubtotal(Z._hasSubtotal);
		result.subtotalPosition(Z._subtotalPosition);
		result.subtotalLabel(Z._subtotalLabel);
		return result;
	},
	
	/**
	 * Cross source type, optional value: 0 - field, 1 - custom.
	 * 
	 * @param {Integer | undefined} sourceType Cross source type.
	 * @return {this | Integer}
	 */
	sourceType: function(sourceType) {
		var Z = this;
		if (sourceType === undefined) {
			return Z._sourceType;
		}
		jslet.Checker.test('CrossFieldSource.sourceType', sourceType).isNumber();
		Z._sourceType = sourceType;
		return this;
	},

	/**
	 * Identify the field name which is used to create cross field. Avaliable when crossType is 0-Field.
	 * sourceField must be a lookup field and required. 
	 * 
	 * @param {String | undefined} sourceField The field name which is used to create cross field.
	 * @return {this | String}
	 */
	sourceField: function(sourceField) {
		var Z = this;
		if (sourceField === undefined) {
			return Z._sourceField;
		}
		jslet.Checker.test('CrossFieldSource.sourceField', sourceField).isString();
		Z._sourceField = sourceField;
		return this;
	},
	
	/**
	 * Identify cross field labels. Avaliable when crossType is 1-Field.
	 * If labels is null, use "values" as "labels" instead.
	 * 
	 * @param {String[] | undefined} labels The cross field labels.
	 * @return {this | String[]}
	 */
	labels: function(labels) {
		var Z = this;
		if (labels === undefined) {
			return Z._labels;
		}
		jslet.Checker.test('CrossFieldSource.labels', labels).isArray();
		Z._labels = labels;
		return this;
	},
	
	/**
	 * Identify cross field cross values. Avaliable when crossType is 1-Field.
	 * If crossType is 1-Field, "values" is reqired.
	 * 
	 * @param {Object[] | undefined} values The cross field source values.
	 * @return {this | Object[]}
	 */
	values: function(values) {
		var Z = this;
		if (values === undefined) {
			return Z._values;
		}
		jslet.Checker.test('CrossFieldSource.values', values).isArray();
		Z._values = values;
		return this;
	},
	
	/**
	 * Identify the field name which is used to create cross field. Avaliable when crossType is 1-Custom.
	 * If crossType is 1-Custom, matchExpr is required. 
	 * 
	 * @param {String | undefined} matchExpr The expression which use to match value.
	 * @return {this | String}
	 */
	matchExpr: function(matchExpr) {
		var Z = this;
		if (matchExpr === undefined) {
			return Z._matchExpr;
		}
		jslet.Checker.test('CrossFieldSource.matchExpr', matchExpr).isString();
		Z._matchExpr = matchExpr;
		return this;
	},
	
	/**
	 * Identify it has subtotal column or not.
	 * 
	 * @param {Boolean | undefined} hasSubtotal True - has subtotal, false otherwise.
	 * @return {this | Boolean}
	 */
	hasSubtotal: function(hasSubtotal) {
		var Z = this;
		if (hasSubtotal === undefined) {
			return Z._hasSubtotal;
		}
		jslet.Checker.test('CrossFieldSource.hasSubtotal', hasSubtotal).isString();
		Z._hasSubtotal = hasSubtotal;
		return this;
	},
	
	/**
	 * Identify the "subtotal" column position. Avaliable when "hasSubtotal" is true;
	 * Optional Value: 0 - At first column, 1 - At last column.
	 * 
	 * @param {Integer | undefined} subtotalPosition subtotal column position.
	 * @return {this | Integer}
	 */
	subtotalPosition: function(subtotalPosition) {
		var Z = this;
		if (subtotalPosition === undefined) {
			return Z._subtotalPosition;
		}
		jslet.Checker.test('CrossFieldSource.subtotalPosition', subtotalPosition).isNumber();
		Z._subtotalPosition = subtotalPosition;
		return this;
	},

	/**
	 * Subtotal label. Avaliable when "hasSubtotal" is true;
	 * 
	 * @param {String | undefined} subtotalLabel Subtotal label.
	 * @return {this | String}
	 */
	subtotalLabel: function(subtotalLabel) {
		var Z = this;
		if (subtotalLabel === undefined) {
			return Z._subtotalLabel;
		}
		jslet.Checker.test('CrossFieldSource.subtotalLabel', subtotalLabel).isString();
		Z._subtotalLabel = subtotalLabel;
		return this;
	}
};

jslet.data.createCrossFieldSource = function(cfg) {
	var result = new jslet.data.CrossFieldSource();
	var srcType = cfg.sourceType || 0;
	result.sourceType(srcType);
	if(cfg.hasSubtotal !== undefined) {
		result.hasSubtotal(cfg.hasSubtotal);
	}
	
	if(cfg.subtotalPosition !== undefined) {
		result.subtotalPosition(cfg.subtotalPosition);
	}
	
	if(cfg.subtotalLabel !== undefined) {
		result.subtotalLabel(cfg.subtotalLabel);
	}
	
	if(srcType === 0) {
		result.sourceField(cfg.sourceField);
	} else {
		result.labels(cfg.labels);
		result.values(cfg.values);
		result.matchExpr(cfg.matchExpr);
	}
	return result;
};

/**
 * @class
 */
jslet.data.FilterDataset = function(hostDataset) {
	if(!jslet.data.getDataset('ds_logical_opr_')) {
		var dsObj = new jslet.data.Dataset({name: 'ds_logical_opr_', isEnum: true, records: {'and': jsletlocale.FilterDataset.and, 'or': jsletlocale.FilterDataset.or}});
		dsObj.isFireGlobalEvent(false);
	}
	
	if(!jslet.data.getDataset('ds_operator_')) {
		var fldCfg = [{name: 'code', type: 'S', length: 10, label:'code'},
	                  {name: 'name', type: 'S', length: 30, label:'name'},
	                  {name: 'range', type: 'S', length: 30, label:'range'}];
		
		var dsOperator = new jslet.data.Dataset({name: 'ds_operator_', fields: fldCfg, 
				keyField: 'code', codeField: 'code', nameField: 'name', autoRefreshHostDataset: true, isFireGlobalEvent: false});
		dsOperator.records([{code: '==', name: jsletlocale.FilterDataset.equal, range: 'NDSBLH'},
		                     {code: '!=', name: jsletlocale.FilterDataset.notEqual, range: 'NDS'},
		                     {code: '>', name: jsletlocale.FilterDataset.greatThan, range: 'ND'},
		                     {code: '>=', name: jsletlocale.FilterDataset.greatThanAndEqual, range: 'ND'},
		                     {code: '<', name: jsletlocale.FilterDataset.lessThan, range: 'ND'},
		                     {code: '<=', name: jsletlocale.FilterDataset.lessThanAndEqual, range: 'ND'},
		                     
		                     {code: 'likeany', name: jsletlocale.FilterDataset.likeany, range: 'S'},
		                     {code: 'likefirst', name: jsletlocale.FilterDataset.likefirst, range: 'S'},
		                     {code: 'likelast', name: jsletlocale.FilterDataset.likelast, range: 'S'},
		                     {code: 'between', name: jsletlocale.FilterDataset.between, range: 'NDS'},
	
		                     {code: 'select', name: jsletlocale.FilterDataset.select, range: 'LH'},
		                     {code: 'selfchildren0', name: jsletlocale.FilterDataset.selfchildren0, range: 'H'},
		                     {code: 'children0', name: jsletlocale.FilterDataset.children0, range: 'H'},
		                     {code: 'selfchildren1', name: jsletlocale.FilterDataset.selfchildren1, range: 'H'},
		                     {code: 'children1', name: jsletlocale.FilterDataset.children1, range: 'H'}
		                     ]);
	}
	this._hostDataset = hostDataset;
	this._filterDataset = null;
	this._varValues = null;
};

jslet.data.FilterDataset.prototype = {
	/**
	 * Get filter dataset, if not found, generate it.
	 * 
	 * @return {jslet.data.Dataset}
	 */
	filterDataset: function() {
		var Z = this;
		if(Z._filterDataset) {
			return Z._filterDataset;
		}
		
		var id =  jslet.nextId();
		var fldCfg = [
            {name: 'name', type: 'S', length: 30, label: 'Field Code'}, 
            {name: 'label', type: 'S', length: 50, label: 'Field Name'}, 
            {name: 'dataType', type: 'S', length: 2, label: 'Data Type'}, 
            {name: 'parentName', type: 'S', length: 30, label: 'Parent Field Code'}, 
		];
		var dsFields = jslet.data.createDataset('ds_fields_' + id, fldCfg, 
				{keyField: 'name', codeField: 'name', nameField: 'label', parentField: 'parentName', autoRefreshHostDataset: true, isFireGlobalEvent: false});
		
		var fieldLabels = [];
		Z._appendFields(Z._hostDataset, fieldLabels);
		dsFields.records(fieldLabels);
		
		function doProxyFieldChanged(dataRec, proxyFldName, proxyFldObj) {
			if(proxyFldName.endsWith('.Y') || proxyFldName.endsWith('.M') || proxyFldName.endsWith('.YM')) {
				proxyFldObj.dataType('N');
				proxyFldObj.length(10);
				proxyFldObj.scale(0);
				proxyFldObj.editMask(null);
				proxyFldObj.displayFormat(null);
				proxyFldObj.dateFormat(null);
				proxyFldObj.displayControl(null);
				proxyFldObj.validChars(null);
				proxyFldObj.lookup(null);
				proxyFldObj.editControl('DBText');
				proxyFldObj.valueStyle(null);
				return;
			}
			var hostFldObj = jslet.data.getDataset(Z._hostDataset).getField(proxyFldName);
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
				var lkCfg = hostLkObj.toPlanObject();
				lkCfg.onlyLeafLevel = false;
				proxyFldObj.lookup(lkCfg);
//				proxyFldObj.editControl('DBComboSelect');
				proxyFldObj.editControl('DBAutoComplete');
			} else {
				proxyFldObj.lookup(null);
				var editorObj = hostFldObj.editControl();
				if(jslet.compareValue(editorObj.type,'DBTextArea') === 0) {
					editorObj = {type: 'DBText'};
				}
				proxyFldObj.editControl(editorObj);
			}
			var operator = dataRec.operator;
			var valueStyle = jslet.data.FieldValueStyle.NORMAL;
			if(operator == 'between') {
				valueStyle = jslet.data.FieldValueStyle.BETWEEN;
			} else if(operator == 'select') {
				valueStyle = jslet.data.FieldValueStyle.MULTIPLE;
			}
			proxyFldObj.valueStyle(valueStyle);
		}
		
		var filterFldCfg = [ 
             {name: 'lParenthesis', type: 'S', length: 10, label: jsletlocale.FilterDataset.lParenthesis, validChars:'(', tabIndex: 90980}, 
	         {name: 'hostField', type: 'S', length: 30, label: 'Host Field', visible: false},
	         {name: 'field', type: 'S', length: 200, displayWidth:30, label: jsletlocale.FilterDataset.field, tabIndex: 90981, 
	        	 lookup: {dataset: dsFields, onlyLeafLevel: false}, editControl: {type: 'DBComboSelect', textReadOnly: true}, required: true},
	         {name: 'dataType', type: 'S', length: 10, label: jsletlocale.FilterDataset.dataType, visible: false},
	         {name: 'operator', type: 'S',length: 50, displayWidth:20, label: jsletlocale.FilterDataset.operator, 
	        	 lookup: {dataset:"ds_operator_"}, required: true, tabIndex: 90982},
	         {name: 'value', type: 'P', length: 200, displayWidth:30, label: jsletlocale.FilterDataset.value, tabIndex: 90983, 
	        		 proxyHostFieldName: 'field', proxyFieldChanged: doProxyFieldChanged, visible: false},
	         {name: 'valueExpr', type: 'S', length: 30, visible: false},
	         {name: 'valueExprInput', type: 'S', length: 2, label: ' ', readOnly: true, visible: false,
	        	 fixedValue: '<button class="btn btn-defualt btn-xs">...</button>', tabIndex: 90984},
             {name: 'rParenthesis', type: 'S', length: 10, label: jsletlocale.FilterDataset.rParenthesis, validChars:')', tabIndex: 90985}, 
             {name: 'logicalOpr', type: 'S', length: 10, label: jsletlocale.FilterDataset.logicalOpr, 
            	 lookup: {dataset:"ds_logical_opr_"}, required: true, defaultValue: 'and', tabIndex: 90986} 
		];
		var dsFilter = new jslet.data.Dataset({name: 'dsFilter_' + id, fields: filterFldCfg, isFireGlobalEvent: false});
		var rule1 = {condition: '[field]', rules: [{field: 'value', customized: function(fldObj, changingFldName){
			var fldName = dsFilter.getFieldValue('field');
			if(!fldName) {
				return;
			}
			var valueFldObj = dsFilter.getField('value', true);
			var hostFldObj = jslet.data.getDataset(Z._hostDataset).getField(fldName), 
				fldType;
			if(hostFldObj) {
				var lkObj = hostFldObj.lookup();
				if(lkObj) {
					fldType = (lkObj.dataset().parentField()) ? 'H': 'L';
				} else {
					fldType = hostFldObj.getType();
				}
				
			} else {
				fldType = dsFields.getFieldValue('dataType');
			}
			if(changingFldName) {
				dsFilter.setFieldValue('dataType', fldType);
			}
			}}
		]};
		
		var rule2 = {
			condition: '[dataType]',
			rules: [{field: 'operator', customized: function(fldObj, changingFldName){
				var dataType = dsFilter.getFieldValue('dataType');
				if(!dataType) {
					return;
				}
				fldObj = dsFilter.getField('operator');
				var lkDs = fldObj.lookup().dataset();
				lkDs.filter('[range].indexOf("' + dataType + '") >= 0');
				lkDs.filtered(true);
				lkDs.first();
				if(changingFldName) {
					var firstValue = lkDs.getFieldValue('code');
					dsFilter.setFieldValue('operator', firstValue);
				}
				}}
			]};

		var rule3 = {condition: '[operator]', rules: [{field: 'value', customized: function(fldObj, changingFldName){
			if(!changingFldName) {
				return;
			}

			var oldValueStyle = dsFilter.getField('value').valueStyle();
			var operator = dsFilter.getFieldValue('operator');
			var valueStyle = jslet.data.FieldValueStyle.NORMAL;
			if(operator == 'between') {
				valueStyle = jslet.data.FieldValueStyle.BETWEEN;
			}
			var ctrlType = fldObj.editControl().type;
			if(operator == 'select') {
				valueStyle = jslet.data.FieldValueStyle.MULTIPLE;
				if(ctrlType !== 'DBComboSelect') {
					fldObj.editControl('DBComboSelect');
				}
			} else {
				var dataType = dsFilter.getFieldValue('dataType');
				if((dataType == 'L' || dataType == 'H') && ctrlType !== 'DBAutoComplete') {
					fldObj.editControl('DBAutoComplete');
				}
			}
			if(oldValueStyle != valueStyle) {
				fldObj.valueStyle(valueStyle);
			}
			}}
		]};
		
		dsFilter.contextRules([rule1, rule2, rule3]);
		dsFilter.enableContextRule();
		dsFilter.onFieldChanged(function(fldName, fldValue) {
			if(fldName == 'field' || fldName == 'operator') {
				this.setFieldValue('value', null);
				this.focusEditControl('value');
			}
		});
		this._filterDataset = dsFilter;
		return dsFilter;

	},
	
	/**
	 * Get filter expression text.
	 * 
	 * @return {String} Filter expression text.
	 */
	getFilterExprText: function() {
		var Z = this,
			dsFilter = Z._filterDataset;
		if(!dsFilter || dsFilter.recordCount() === 0) {
			return null;
		}
		this.validate();
		var result = '', recno,
			lastRecno = dsFilter.recordCount() - 1;
		
		dsFilter.iterate(function() {
			recno = this.recno();
			result += this.getFieldValue('lParenthesis') || '';
			result += this.getFieldText('field') + ' ';
			result += this.getFieldText('operator') + ' ';
			result += this.getFieldText('value');
			result += this.getFieldText('valueExpr');
			result += this.getFieldValue('rParenthesis') || '';
			if(recno != lastRecno) {
				result += ' ' + this.getFieldText('logicalOpr') + ' ';
			}
		});
		return result;
	},
	
	/**
	 * Get filter expression.
	 * 
	 * @return {String} Filter expression.
	 */
	getFilterExpr: function() {
		var Z = this,
			dsFilter = Z._filterDataset;
		if(!dsFilter || dsFilter.recordCount() === 0) {
			return null;
		}
		this.validate();
		var result = '', recno,
			lastRecno = dsFilter.recordCount() - 1;
		
		dsFilter.iterate(function() {
			recno = this.recno();
			var dataType = this.getFieldValue('dataType');
			result += this.getFieldValue('lParenthesis') || '';
			
			result += Z._getFieldFilter(this);
			result += this.getFieldValue('rParenthesis') || '';
			if(recno != lastRecno) {
				result += ' ' + (this.getFieldValue('logicalOpr') == 'or' ?  '||': '&&') + ' ';
			}
			
		});
		return result;
	},
	
	_appendFields: function(hostDataset, fieldLabels, hostFldName, hostFldLabel) {
		var fields = jslet.data.getDataset(hostDataset).getNormalFields(),
			fldObj;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			//Hidden fields, fixed value fields and dataset fieldS do not need to filter.
			if(!fldObj.visible() || fldObj.fixedValue() || fldObj.getType() === jslet.data.Dataset.DATASET) { 
				continue;
			}
			var fldCode = fldObj.name(),
				fldLabel = fldObj.label(),
				fldDataType = fldObj.getType();
			if(hostFldName) {
				fldCode = hostFldName + '.' + fldCode;
				fldLabel = hostFldLabel + '.' + fldLabel;
			}
			var fldCfg = {name: fldCode, label: fldLabel, dataType: fldDataType};
			if(hostFldName) {
				fldCfg.parentName = hostFldName;
			}
			fieldLabels.push(fldCfg);
			if(fldDataType === jslet.data.DataType.DATE) {
				fieldLabels.push({name: fldCode + '.Y', label: fldLabel + '.' + jsletlocale.FilterDataset.year, dataType: 'N', parentName: fldCode});
				fieldLabels.push({name: fldCode + '.M', label: fldLabel + '.' + jsletlocale.FilterDataset.month, dataType: 'N', parentName: fldCode});
				fieldLabels.push({name: fldCode + '.YM', label: fldLabel + '.' + jsletlocale.FilterDataset.yearMonth, dataType: 'N', parentName: fldCode});
			}
			var lkObj = fldObj.lookup();
			if(lkObj) {
				this._appendFields(lkObj.dataset(), fieldLabels, fldCode, fldLabel);
			}
		}
	},

	_getFieldFilter: function(dsFilter) {
		var	fldName = dsFilter.getFieldValue('field'),
			dataType = dsFilter.getFieldValue('dataType'),
			operator = dsFilter.getFieldValue('operator'),
			value = dsFilter.getFieldValue('value'),
			valueExpr = dsFilter.getFieldValue('valueExpr'),
			result = '';
		//Boolean value
		if(dataType == 'B') { 
			result =  '[' + fldName + ']';
			if(!value) {
				result =  '!' + result;
			}
			return result;
		}
		var fldNameStr = '[' + fldName + ']';
		//Extend date field
		if(dataType === 'N') {
			if(fldName.endsWith('.Y')) {
				fldNameStr = '[' + fldName.substring(0, fldName.length - 2) + ']';
				fldNameStr = 'jslet.getYear(' + fldNameStr + ')';
			} else	if(fldName.endsWith('.M')) {
				fldNameStr = '[' + fldName.substring(0, fldName.length - 2) + ']';
				fldNameStr = 'jslet.getMonth(' + fldNameStr + ')';
			} else if(fldName.endsWith('.YM')) {
				fldNameStr = '[' + fldName.substring(0, fldName.length - 3) + ']';
				fldNameStr = 'jslet.getYearMonth(' + fldNameStr + ')';
			}
		}
		function getValue(dataType, value) {
			if(dataType === 'D') {
				return 'new Date(' + value.getTime() + ')';
			}
			if(dataType === 'S') {
				return '"' + value + '"';
			}
			return value;
		}
		//Operator: ==, !=, >, >=, <, <=
		if(operator == '==' || operator == '!=' ||
		   operator == '>' || operator == '>=' || 
		   operator == '<' || operator == '<=') {
			if(dataType === 'L' || dataType === 'H') {
				dataType = this._hostDataset.getField(fldName).getType();
			}
			result = 'jslet.compareValue(' + fldNameStr + ', ' + getValue(dataType, value) + ')';
			result += operator + '0';
			return result;
		}
		//Operator: between
		if(operator == 'between') {
			var value1 = value[0], value2 = null;
			if(value.length > 1) {
				value2 = value[1];
			}
			if(value1 !== null && value1 !== undefined) {
				result += 'jslet.compareValue(' + fldNameStr + ', ' + getValue(dataType, value1) + ') >=0';
			}
			if(value2 !== null && value2 !== undefined) {
				if(result.length > 0) {
					result += ' && ';
				}
				result += 'jslet.compareValue(' + fldNameStr + ', ' + getValue(dataType, value2) + ') <=0';
			}
			return '(' + result + ')';
		}
		//Operator: likeany, likefirst, likelast
		if(operator == 'likeany' || operator == 'likefirst' || operator == 'likelast') {
			result = 'like(' + fldNameStr + ', "';
			if(operator == 'likeany' || operator == 'likelast') {
				result += '%';
			}
			result += value;
			if(operator == 'likeany' || operator == 'likefirst') {
				result += '%';
			}
			result += '")';
			return result;
		}
		//Operator: select
		if(operator == 'select') {
			dataType = this._hostDataset.getField(fldName).getType();
			result = 'inlist(' + fldNameStr ; 
			for(var i = 0, len = value.length; i < len; i++) {
				result += ',' + getValue(dataType, value[i]);
			}
			result += ')';
			return result;
		}
		//Operator: selfchildren0, children0, selfchildren1, children1
		if(operator == 'selfchildren0' || operator == 'children0' || 
			operator == 'selfchildren1' || operator == 'children1') {
			var funcStr = 'inChildren';
			if(operator == 'selfchildren0' || operator == 'selfchildren1') {
				funcStr = 'inChildrenAndSelf';
			} else {
				result = 'inChildren';
			}
			dataType = this._hostDataset.getField(fldName).getType();
			result = funcStr + '("' + fldName + '", ' + getValue(dataType, value) + ',';
			if(operator == 'selfchildren0' || operator == 'children0') {
				result += 'false)';
			} else {
				result += 'true)';
			}
			return result;
		}
		return result;
	},
	
	_getFilterValue: function(dsFilter) {
		return dsFilter.getFieldValue('value');
	},
	
	validate: function() {
		var dsFilter = this._filterDataset,
			parenthesisCount = 0,
			errMsg = null;
		dsFilter.iterate(function() {
			parenthesisCount = (this.getFieldValue('lParenthesis') || '').length - (this.getFieldValue('rParenthesis') || '').length;
			if(this.getFieldValue('value') === null && this.getFieldValue('valueExpr') === null) {
				errMsg = jsletlocale.FilterDataset.valueRequired;
				return true; //Exists invalidate record, break iterating.
			}
		});
		if(!errMsg && parenthesisCount !== 0) {
			errMsg = jsletlocale.FilterDataset.parenthesisNotMatched;
		}
		if(errMsg) {
			console.error(errMsg);
		}
		return errMsg;
	},
	
	destroy: function() {
		var lkdsField = this._filterDataset.getField('field').lookup().dataset();
		this._filterDataset.destroy();
		lkdsField.destroy();
	}
};
/**
 * @private
 * @class
 * 
 * Raw value accessor for field object.
 */
jslet.data.FieldRawValueAccessor = {
	/**
	 * Get raw value from an data record.
	 * 
	 * @param {Object} dataRec Data record, normally it's a plan object, like: {field1: value1, field2: value2}.
	 * @param {jslet.data.Field} fldObj Field object.
	 * @return {Object} 
	 */
	getRawValue: function(dataRec, fldObj) {
		var fldName = fldObj.shortName() || fldObj.name(),
			customValueAccessor = fldObj.customValueAccessor();
		
		var fldType = fldObj.getType(), value = null;
		var extHostName = fldObj.extendHostName();
		if(extHostName) {
			var extHostValue = dataRec[extHostName];
			if(extHostValue) {
				value = extHostValue[fldName];
			}
		} else {
			value = this._innerGetValue(dataRec,  fldName, customValueAccessor);
		}
		if(value === undefined || value === null) {
			return null;
		}
		if(fldType === jslet.data.DataType.BOOLEAN) {
			return value === fldObj.trueValue();
		}
		
		if(fldType === jslet.data.DataType.PROXY) {
			return jslet.JSON.parse(value);
		}

		if(fldType === jslet.data.DataType.DATE) {
			var flag = false;
			if(jslet.isArray(value)) {
				for(var i = 0, len = value.length; i < len; i++) {
					var val = value[i];
					if (!jslet.isDate(val)) {
						val = jslet.convertISODate(val);
						value[i] = val;
						flag = true;
					} //end if
					
				}
			} else {
				if (!jslet.isDate(value)) {
					value = jslet.convertISODate(value);
					flag = true;
				} //end if
			}
			if(flag) {
				this._innerSetValue(dataRec, fldName, value, customValueAccessor);
			}
		}
		return value;
	},
	
	/**
	 * Set a field value of a data record.
	 * 
	 * @param {Object} dataRec Data record, normally it's a plan object, like: {field1: value1, field2: value2}.
	 * @param {jslet.data.Field} fldObj Field object.
	 * @param {Object} value Field value.
	 */
	setRawValue: function(dataRec, fldObj, value) {
		var fldName = fldObj.shortName() || fldObj.name(),
			customValueAccessor = fldObj.customValueAccessor();
		
		var fldType = fldObj.getType();
		if(value === undefined) {
			value = null;
		}
		if(value !== null && fldType === jslet.data.DataType.BOOLEAN) {
			value = (value? fldObj.trueValue(): fldObj.falseValue());
		}
		
		if(value !== null && fldType === jslet.data.DataType.PROXY) {
			value = jslet.JSON.stringify(value);
		}
		var extHostName = fldObj.extendHostName();
		if(extHostName) {
			var extHostValue = dataRec[extHostName];
			if(!extHostValue) {
				extHostValue = {};
				dataRec[extHostName] = extHostValue;
			}
			extHostValue[fldName] = value;
		} else {
			this._innerSetValue(dataRec, fldName, value, customValueAccessor);
		}
	},
	
	_innerGetValue: function(dataRec, fldName, customValueAccessor) {
		if(customValueAccessor) {
			return customValueAccessor.getValue(dataRec, fldName);
		} else {
			return dataRec[fldName];
		}
	},
	
	_innerSetValue:  function(dataRec, fldName, value, customValueAccessor) {
		if(customValueAccessor) {
			return customValueAccessor.setValue(dataRec, fldName, value);
		} else {
			dataRec[fldName] = value;
		}
	}
};

jslet.data.FieldValueCache = {
	
	put: function(record, fieldName, value, valueIndex) {
		var recInfo = jslet.data.getRecInfo(record), 
			cacheObj = recInfo.cache;
		if(!cacheObj) {
			cacheObj = {};
			record._jl_.cache = cacheObj;
		}
		if(valueIndex || valueIndex === 0) {
			var fldCacheObj = cacheObj[fieldName];
			if(!fldCacheObj || !jslet.isObject(fldCacheObj)){
				fldCacheObj = {};
				cacheObj[fieldName] = fldCacheObj;
			}
			fldCacheObj[valueIndex+""] = value;
		} else {
			cacheObj[fieldName] = value;
		}
	},
	
	get: function(record, fieldName, valueIndex) {
		var recInfo = jslet.data.getRecInfo(record), 
			cacheObj = recInfo.cache;
		if(cacheObj) {
			if(valueIndex || valueIndex === 0) {
				var fldCacheObj = cacheObj[fieldName];
				if(fldCacheObj && jslet.isObject(fldCacheObj)){
					return fldCacheObj[valueIndex+""];
				}
				return undefined;
			} else {
				return cacheObj[fieldName];
			}
		} else {
			return undefined;
		}
	},
	
	clear: function(record, fieldNameOrArray) {
		var recInfo = jslet.data.getRecInfo(record), 
			cacheObj = recInfo.cache;
		if(cacheObj) {
			var arrFldNames;
			if(jslet.isString(fieldNameOrArray)) {
				arrFldNames = fieldNameOrArray.split(',');
			} else {
				arrFldNames = fieldNameOrArray;
			}
			var j, fldCnt = arrFldNames.length;
			for(j = 0; j < fldCnt; j++) {
				delete cacheObj[arrFldNames[j]];
			}
		}
	},
	
	clearAll: function(dataset, fieldNameOrArray) {
		var records = dataset.records();
		if(!records) {
			return;
		}
		var arrFldNames;
		if(jslet.isString(fieldNameOrArray)) {
			arrFldNames = fieldNameOrArray.split(',');
		} else {
			arrFldNames = fieldNameOrArray;
		}
		var rec, cacheObj, recInfo, j, fldCnt = arrFldNames.length;
		for(var i = 0, len = records.length; i < len; i++) {
			rec = records[i];
			recInfo = jslet.data.getRecInfo(rec);
			cacheObj = recInfo.cache;
			if(cacheObj) {
				for(j = 0; j < fldCnt; j++) {
					delete cacheObj[arrFldNames[j]];
				}
			}
		}
	},
	
	removeCache: function(record) {
		var recInfo = jslet.data.getRecInfo(record);
		delete recInfo.cache;
	},
	
	removeAllCache: function(dataset) {
		var records = dataset.records();
		if(!records) {
			return;
		}
		var rec, cacheObj, recInfo;
		for(var i = 0, len = records.length; i < len; i++) {
			rec = records[i];
			if(!rec) {
				continue;
			}
			recInfo = jslet.data.getRecInfo(rec); 
			delete recInfo.cache;
		}
	}
};
/*End of field value cache manager*/
/**
 * @private
 * @class
 * @abstract
 * 
 * Field value converter. 
 */
jslet.data.FieldValueConverter = jslet.Class.create({
	className: 'jslet.data.FieldValueConverter',
	
	textToValue: function(fldObj, inputText) {
		var value = inputText;
		return value;
	},
	
	valueToText: function(fldObj, value, isEditing) {
		var text = value;
		return text;
	},
	
	_addFieldLabel: function(fldLabel, errMsg) {
		return '[' + fldLabel + ']: ' + errMsg;
	}
});
jslet.data.FieldValueConverter.className = 'jslet.data.FieldValueConverter';

/**
 * @private
 * @class
 * @extend jslet.data.FieldValueConverter.
 * 
 * Number value converter.
 */
jslet.data.NumberValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	intRegular: {expr: /^(-)?[1-9]*\d+$/ig, message: jsletlocale.Dataset.invalidInt},
	
	floatRegular: {expr: /((^-?[1-9])|\d)\d*(\.[0-9]*)?$/ig, message: jsletlocale.Dataset.invalidFloat},
	
	textToValue: function(fldObj, inputText) {
		if(!inputText) {
			return null;
		}
		var regular;
		if (!fldObj.scale()) {
			regular = this.intRegular;
		} else {
			regular = this.floatRegular;
		}
		var regExpObj = regular.expr;
		regExpObj.lastIndex = 0;
		if (!regExpObj.test(inputText)) {
			var invalidMsg = this._addFieldLabel(fldObj.label(), regular.message);
			fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, null, inputText);
			return undefined;
		}

		var value = undefined,
			scale = fldObj.scale() || 0,
			length = fldObj.length();
		if (scale === 0) {
			value = parseInt(inputText);
		} else {
			var k = inputText.indexOf('.');
			var actual = k > 0? k: inputText.length,
				expected = length - scale;
			if(actual > expected) {
				var invalidMsg = this._addFieldLabel(fldObj.label(), 
						jslet.formatMessage(jsletlocale.Dataset.invalidIntegerPart, [expected, actual]));
				fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, null, inputText);
			} else {
				actual = k > 0 ? inputText.length - k - 1: 0;
				if(actual > scale) {
					var invalidMsg = this._addFieldLabel(fldObj.label(), 
							jslet.formatMessage(jsletlocale.Dataset.invalidDecimalPart, [scale, actual]));
					fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, null, inputText);
				} else {
					value = parseFloat(inputText);
				}
			}
		}
		
		return value;
	},

	valueToText: function(fldObj, value, isEditing) {
		var dataset = fldObj.dataset();
		if (fldObj.unitConverted()) {
			value = value * dataset._unitConvertFactor;
		}

		if (!isEditing) {
			var rtnText = jslet.formatNumber(value, fldObj.displayFormat());
			if (fldObj.unitConverted() && dataset._unitName) {
				rtnText += dataset._unitName;
			}
			return rtnText;
		} else {
			return value;
		}
	}
});

/**
 * @private
 * @class
 * @extend jslet.data.FieldValueConverter.
 * 
 * Date value converter.
 */
jslet.data.DateValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText) {
		if(!inputText) {
			return null;
		}
		var regular = fldObj.dateRegular();
		var regExpObj = regular.expr;
		regExpObj.lastIndex = 0;
		if (!regExpObj.test(inputText)) {
			var invalidMsg = this._addFieldLabel(fldObj.label(), regular.message);
			fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, null, inputText);
			return undefined;
		}
		
		var value = undefined;
		try {
			value = jslet.parseDate(inputText, fldObj.displayFormat());
		} catch (e) {
			var invalidMsg = this._addFieldLabel(fldObj.label(), e.message);
			fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, null, inputText);
			value = undefined;
		}
		return value; 
	},
	
	valueToText: function(fldObj, value, isEditing) {
		if (!(value instanceof Date)) {
			//Invalid value: [{1}] for DATE field: [{0}]!
			throw new Error(jslet.formatMessage(jsletlocale.Dataset.invalidDateFieldValue, [fldObj.name(), value]));
		}

		return value ? jslet.formatDate(value, fldObj.displayFormat()): '';
	}
});

/**
 * @private
 * @class
 * @extend jslet.data.FieldValueConverter.
 * 
 * String value converter.
 */
jslet.data.StringValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText) {
		if(!inputText) {
			return inputText;
		}
		var regular = fldObj.regularExpr();
		if(regular) {
			var regExpObj = regular.expr;
			regExpObj.lastIndex = 0;
			if (!regExpObj.test(inputText)) {
				var invalidMsg = this._addFieldLabel(fldObj.label(), regular.message);
				fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, null, inputText);
				return undefined;
			}
		}
		
		var value = inputText;
		if (fldObj.antiXss()) {
			value = jslet.htmlEncode(value);
		}
		return value;
	},
	
	valueToText: function(fldObj, value, isEditing) {
		var dataset = fldObj.dataset(),
			dispFmt = fldObj.displayFormat();
		if (!isEditing && dispFmt) {
			return jslet.formatString(value, dispFmt);
		} else {
			return value;
		}
	}
	
});

/**
 * @private
 * @class
 * @extend jslet.data.FieldValueConverter.
 * 
 * Boolean value converter.
 */
jslet.data.BooleanValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText) {
		if(!inputText) {
			return false;
		}
		return inputText.toLowerCase() == 'true';
	},
	
	valueToText: function(fldObj, value, isEditing) {
		return value ? fldObj.trueText(): fldObj.falseText();
	}
});

/**
 * @private
 * @class
 * @extend jslet.data.FieldValueConverter.
 * 
 * Lookup value converter.
 */
jslet.data.LookupValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText, valueIndex) {
		if(!inputText) {
			return null;
		}
		var value = '',
			lkFldObj = fldObj.lookup(),
			dsLookup = lkFldObj.dataset(),
			keyFldName = lkFldObj.keyField(),
			codeFldName = lkFldObj.codeField(),
			nameFldName = lkFldObj.nameField(),
			editFilter = lkFldObj.editFilter(),
			fixedFilter = dsLookup.fixedFilter();
		if(editFilter) {
			if(fixedFilter) {
				editFilter = '(' + editFilter + ') && (' + fixedFilter + ')'; 
			}
		} else {
			editFilter = fixedFilter;
		}
		value = this._convertFieldValue(dsLookup, codeFldName, inputText, keyFldName, editFilter);
		if (value === null) {
			if(nameFldName !== codeFldName) {
				value = this._convertFieldValue(dsLookup, nameFldName, inputText, keyFldName, editFilter);
			}
			if (value === null) {
				var invalidMsg = jslet.formatMessage(jsletlocale.Dataset.valueNotFound, [fldObj.displayLabel()]);
				fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, valueIndex, inputText);
				dsLookup.first();
				return undefined;
			}
		}

		return value;
	},
	
	valueToText: function(fldObj, value, isEditing) {
		var lkFldObj = fldObj.lookup(),
			dsLookup = lkFldObj.dataset(),
			result;
		if (!isEditing) {
			result = this._convertFieldValue(dsLookup, lkFldObj.keyField(), value,
					lkFldObj.displayFields());
		} else {
			result = this._convertFieldValue(dsLookup, lkFldObj.keyField(), value, 
					'[' + lkFldObj.codeField() + ']');
		}
		return result;
	},
	
	/**
	 * @private
	 */
	_convertFieldValue: function (dsLookup, srcField, srcValues, destFields, editFilter) {
		if (destFields === null) {
			throw new Error('NOT set destFields in method: ConvertFieldValue');
		}
		var isExpr = destFields.indexOf('[') > -1;
		if (isExpr) {
			if (destFields != dsLookup._convertDestFields) {
				dsLookup._innerConvertDestFields = new jslet.data.Expression(dsLookup,
						destFields);
				dsLookup._convertDestFields = destFields;
			}
		}
		if (typeof (srcValues) != 'string') {
			srcValues += '';
		}
		var separator = jslet.global.valueSeparator;
		var values = srcValues.split(separator), valueCnt = values.length - 1;
		dsLookup._ignoreFilter = true;
		var context = dsLookup.startSilenceMove();
		try {
			var options = (editFilter? {extraFilter: editFilter} : null);

			if (valueCnt === 0) {
				if (!dsLookup.findByField(srcField, values[0], options)) {
					return null;
				}
				if (isExpr) {
					return dsLookup._innerConvertDestFields.eval();
				} else {
					return dsLookup.getFieldValue(destFields);
				}
			}
	
			var fldcnt, destValue = '';
			for (var i = 0; i <= valueCnt; i++) {
				if (!dsLookup.findByField(srcField, values[i], options)) {
					destValue += jslet.formatMessage(jsletlocale.Dataset.notFound, values[i]);
				} else {
					if (isExpr) {
						destValue += dsLookup._innerConvertDestFields.eval();
					} else {
						destValue += dsLookup.getFieldValue(destFields);
					}
				}
				if (i != valueCnt) {
					destValue += separator;
				}
			}
			return destValue;
		} finally {
			dsLookup._ignoreFilter = false;
			dsLookup.endSilenceMove(context);
		}
	}
	
});

jslet.data._valueConverters = {};
jslet.data._valueConverters[jslet.data.DataType.NUMBER] = new jslet.data.NumberValueConverter();
jslet.data._valueConverters[jslet.data.DataType.STRING] = new jslet.data.StringValueConverter();
jslet.data._valueConverters[jslet.data.DataType.DATE] = new jslet.data.DateValueConverter();
jslet.data._valueConverters[jslet.data.DataType.BOOLEAN] = new jslet.data.BooleanValueConverter();

jslet.data._valueConverters.lookup = new jslet.data.LookupValueConverter();

/**
 * @private
 * 
 * Get appropriate field value converter.
 * 
 * @member jslet.data
 * @param {jslet.data.Field} fldObj field object.
 * 
 * @return {jslet.data.FieldValueConverter} field value converter;
 */
jslet.data.getValueConverter = function(fldObj) {
	if(fldObj.lookup()) {
		return jslet.data._valueConverters.lookup;
	}
	var dataType = fldObj.getType();
	return jslet.data._valueConverters[dataType];
};
/* End of field value converter */


/* Field value error */
jslet.data.FieldError = {
	
	put: function(record, fldName, errorMsg, valueIndex, inputText) {
		if(!record) {
			return;
		}
		if(!errorMsg) {
			jslet.data.FieldError.clear(record, fldName, valueIndex);
			return;
		}
		var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
		if(!errObj) {
			errObj = {};
			recInfo.error = errObj;
		}
		var fldErrObj = errObj[fldName];
		if(!fldErrObj) {
			fldErrObj = {};
			errObj[fldName] = fldErrObj;
		}
		var errMsgObj = {message: errorMsg};
		if(inputText !== undefined) {
			errMsgObj.inputText = inputText;
		}
		if(!valueIndex) {
			valueIndex = 0;
		}
		fldErrObj[valueIndex+""] = errMsgObj;
	},
	
	get: function(record, fldName, valueIndex) {
		if(!record) {
			return null;
		}
		var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
		if(errObj) {
			var fldErrObj = errObj[fldName];
			if(!fldErrObj) {
				return null;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			return fldErrObj[valueIndex+""];
		} else {
			return null;
		}
	},
	
	clear: function(record, fldName, valueIndex) {
		if(!record) {
			return;
		}
		var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
		if(errObj) {
			var fldErrObj = errObj[fldName];
			if(!fldErrObj) {
				return;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			delete fldErrObj[valueIndex+""];
			var found = false;
			for(var idx in fldErrObj) {
				found = true;
				break;
			}
			if(!found) {
				delete errObj[fldName];
			} 
		}
	},
	
	existFieldError: function(record, fldName, valueIndex) {
		if(!record) {
			return false;
		}
		var recInfo = jslet.data.getRecInfo(record), 
		errObj = recInfo.error;
		if(errObj) {
			var fldErrObj = errObj[fldName];
			if(!fldErrObj){
				return false;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			return fldErrObj[valueIndex+""] ? true: false;
		}
		return false;
	},
	
	existRecordError: function(record, includeFields, excludeFields) {
		if(!record) {
			return false;
		}
		var recInfo = jslet.data.getRecInfo(record);
		if(!recInfo) {
			return false;
		}
		var errObj = recInfo.error;
		if(errObj) {
			for(var fldName in errObj) {
				if(excludeFields && excludeFields.indexOf(fldName) >= 0 || 
					includeFields && includeFields.indexOf(fldName) < 0) {
					continue;
				}
				if(errObj[fldName]) {
					return true;
				}
			}
		}
		return false;
	},
	
	getFirstErrorField: function(record, includeFields, excludeFields) {
		if(!record) {
			return null;
		}
		var recInfo = jslet.data.getRecInfo(record);
		if(!recInfo) {
			return null;
		}
		var errObj = recInfo.error;
		if(errObj) {
			for(var fldName in errObj) {
				if(excludeFields && excludeFields.indexOf(fldName) >= 0 || 
					includeFields && includeFields.indexOf(fldName) < 0) {
					continue;
				}
				if(errObj[fldName]) {
					return fldName;
				}
			}
		}
		return null;
	},
	
	clearFieldError: function(dataset, fldName) {
		var records = dataset.records();
		if(!records) {
			return;
		}
		var rec, errObj, recInfo;
		for(var i = 0, len = records.length; i < len; i++) {
			rec = records[i];
			recInfo = jslet.data.getRecInfo(rec);
			errObj = recInfo.error;
			if(errObj) {
				delete errObj[fldName];
			}
		}
	},
	
	clearRecordError: function(record, includeFields, excludeFields) {
		var recInfo = jslet.data.getRecInfo(record);
		if(recInfo) {
			if(jslet.isEmpty(includeFields) && jslet.isEmpty(excludeFields)) {
				delete recInfo.error;
			} else {
				var errObj = recInfo.error;
				for(var fldName in errObj) {
					if(excludeFields && excludeFields.indexOf(fldName) >= 0 || 
						includeFields && includeFields.indexOf(fldName) < 0) {
						continue;
					}
					delete errObj[fldName];
				}
			}
		}
	},
	
	clearDatasetError: function(dataset) {
		var records = dataset.records();
		if(!records) {
			return;
		}
		var rec, errObj, recInfo;
		for(var i = 0, len = records.length; i < len; i++) {
			rec = records[i];
			recInfo = jslet.data.getRecInfo(rec);
			if(recInfo) {
				delete recInfo.error;
			}
		}
	}
};
/*End of field value error manager*/

/**
 * @private
 * @class
 * 
 * Data selection class.
 */
jslet.data.DataSelection = function(dataset) {
	this._dataset = dataset;
	this._selection = [];
	this._onChanged = null;
};

jslet.data.DataSelection.prototype = {
	/**
	 * Select all data.
	 * 
	 * @param {String[]} fields An array of field name to be selected.
	 * @param {Boolean} fireEvent Identify firing event or not.
	 */
	selectAll: function(fields, fireEvent) {
		jslet.Checker.test('DataSelection.add#fields', fields).isArray();
		this.removeAll();
		if(!fields) {
			var arrFldObj = this._dataset.getNormalFields(), fldName;
			fields = [];
			for(var i = 0, len = arrFldObj.length; i < len; i++) {
				fldName = arrFldObj[i].name();
				fields.push(fldName);
			}
		}
		this.add(0, this._dataset.recordCount() - 1, fields, fireEvent);
	},
	
	/**
	 * Remove all selected data.
	 */
	removeAll: function() {
		this._selection = [];
	},
	
	/**
	 * Add data into selection.
	 * 
	 * @param {Integer} startRecno The start recno to be selected.
	 * @param {Integer} endRecno The end recno to be selected.
	 * @param {String[]} fields An array of field name to be selected.
	 * @param {Boolean} fireEvent Identify firing event or not.
	 */
	add: function(startRecno, endRecno, fields, fireEvent) {
		jslet.Checker.test('DataSelection.add#startRecno', startRecno).required().isNumber();
		jslet.Checker.test('DataSelection.add#endRecno', endRecno).required().isNumber();
		jslet.Checker.test('DataSelection.add#fields', fields).required().isArray();

		if(endRecno === undefined) {
			endRecno = startRecno;
		}
		var fldName, dsObj = this._dataset, dataType, arrFlds = [];
		for(var j = 0, fldCnt = fields.length; j < fldCnt; j++) {
			fldName = fields[j];
			dataType = dsObj.getField(fldName).dataType();
			if(dataType === jslet.data.DataType.ACTION || dataType === jslet.data.DataType.EDITACTION) {
				continue;
			}
			arrFlds.push(fldName);
		}
		for(var recno = startRecno; recno <= endRecno; recno++) {
			for(var i = 0, len = arrFlds.length; i < len; i++) {
				fldName = arrFlds[i];
				this._selectCell(recno, fldName, true);
			}
		}
		if(fireEvent && this._onChanged) {
			this._onChanged(startRecno, endRecno, fields, true);
		}
	},

	/**
	 * Unselect data.
	 * 
	 * @param {Integer} startRecno The start recno to be unselected.
	 * @param {Integer} endRecno The end recno to be selected.
	 * @param {String[]} fields An array of field name to be unselected.
	 * @param {Boolean} fireEvent Identify firing event or not.
	 */
	remove: function(startRecno, endRecno, fields, fireEvent) {
		jslet.Checker.test('DataSelection.remove#startRecno', startRecno).required().isNumber();
		jslet.Checker.test('DataSelection.remove#endRecno', endRecno).required().isNumber();
		jslet.Checker.test('DataSelection.remove#fields', fields).required().isArray();

		if(endRecno === undefined) {
			endRecno = startRecno;
		}
		if(startRecno > endRecno) {
			var tmp = startRecno;
			startRecno = endRecno;
			endRecno = tmp;
		}
		var fldName;
		for(var recno = startRecno; recno <= endRecno; recno++) {
			for(var i = 0, len = fields.length; i < len; i++) {
				fldName = fields[i];
				this._selectCell(recno, fldName, false);
			}
		}
		if(fireEvent && this._onChanged) {
			this._onChanged(startRecno, endRecno, fields, false);
		}
	},

	/**
	 * Fired when the selection area is changed.
	 * 
	 * @param {Function} onChanged The event handler, format:
	 * 	function(startRecno, endRecno, fields, selected) {
	 * 		//startRecno - Integer, start recno;
	 * 		//endRecno - Integer, end recno;
	 * 		//fields - String[], field names;
	 * 		//selected - Boolean, selected or not;	
	 * 	}
	 * 	
	 */
	onChanged: function(onChanged) {
		if(onChanged === undefined) {
			return this._onChanged;
		}
		jslet.Checker.test('DataSelection.onChanged', onChanged).isFunction();
		this._onChanged = onChanged;
	},
	
	/**
	 * Check the specified cell is selected or not.
	 * 
	 * @param {Integer} recno Record no.
	 * @param {String} fldName Field name.
	 * 
	 * @return {Boolean}
	 */
	isSelected: function(recno, fldName) {
		jslet.Checker.test('DataSelection.isSelected#recno', recno).required().isNumber();
		jslet.Checker.test('DataSelection.isSelected#fldName', fldName).required().isString();
		var selObj;
		for(var i = 0, len = this._selection.length; i < len; i++) {
			selObj = this._selection[i];
			if(selObj._recno_ === recno && selObj[fldName]) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Get selected text.
	 * 
	 * @param {String} seperator Seperator for fields.
	 * 
	 * @return {String}
	 */
	getSelectionText: function(surround, encodeSpecialData, seperator) {
		if(!seperator) {
			seperator = '\t';
		}
		var Z = this;
		surround = surround? surround: '';
		encodeSpecialData = encodeSpecialData? true: false;
		var dataset = Z._dataset,
			result = [], 
			context = dataset.startSilenceMove(),
			fields = dataset.getNormalFields(),
			fldCnt = fields.length, label,
			labels = [], dispOrder, labelLen,
			fldName, textRec, fldObj, text, dataType;
		try {
			dataset.iterate(function() {
				textRec = [];
				for(var i = 0; i < fldCnt; i++) {
					fldObj = fields[i];
					fldName = fldObj.name();
					if(!Z.isSelected(dataset.recno(), fldName)) {
						continue;
					}
					dispOrder = fldObj.displayOrder();
					labelLen = labels.length;
					if(labelLen < dispOrder) {
						for(var j = labelLen; j < dispOrder; j++) {
							labels[j] = null;
						}
					}
					if(!labels[dispOrder]) {
						label = fldObj.label();
						labels.push(jslet.removeHtmlTag(label) || ' ');
					}
					//If Number field does not have lookup field, return field value, not field text. 
					//Example: 'amount' field
					dataType = fldObj.getType();
					if(dataType === 'N' && !fldObj.lookup()) {
						text = fldObj.getValue();
						if(text === null || text === undefined) {
							text = '';
						}
						text = surround + text + surround;
					} else {
						text = dataset.getFieldText(fldName);
						if(text === null || text === undefined) {
							text = '""';
						} else {
							text = text.replace(/"/g,'""');
							var isStartZero = false;
							if(text.startsWith('0')) {
								isStartZero = true;
							}
							text = surround + text + surround;
							if(encodeSpecialData && (isStartZero || dataType === jslet.data.DataType.DATE)) {
								text = '=' + text;
							}
						}
					}
					
					textRec.push(text); 
				} //End for
				if(textRec.length > 0) {
					result.push(textRec.join(seperator));
				}
			}); //End iterate
		} finally { 
			dataset.endSilenceMove(context); 
		}
		if(result.length > 0) {
			var labelStr = '', s, isFirst = true;
			for(var i = 0, len = labels.length; i < len; i++) {
				s = labels[i];
				if(s) {
					labelStr += (isFirst? '':seperator) + s;
					isFirst = false;
				}
			}
			return labelStr + '\n' + result.join('\n');
		} else {
			return null;
		}
	},
	
	_selectCell: function(recno, fldName, selected) {
		var selObj,
			found = false;
		for(var i = 0, len = this._selection.length; i < len; i++) {
			selObj = this._selection[i];
			if(selObj._recno_ === recno) {
				found = true;
				selObj[fldName] = selected;
			}
		}
		if(selected && !found) {
			selObj = {_recno_: recno};
			selObj[fldName] = true;
			this._selection.push(selObj);
		}
	}
};

/**
 * @private
 * @class
 * 
 * Field Validator.
 */
jslet.data.FieldValidator = function() {
};

jslet.data.FieldValidator.prototype = {
	
	intRegular: {expr: /^(-)?[1-9]*\d+$/ig},
	
	floatRegular: {expr: /((^-?[1-9])|\d)\d*(\.[0-9]*)?$/ig},

	/**
	 * Check the specified character is valid or not.
	 * Usually use this when user presses a key down.
	 * 
	 * @param {String} inputChar Single character
	 * @param {Boolean} True for passed, otherwise failed.
	 */
	checkInputChar: function (fldObj, inputChar, existText, cursorPos) {
		var validChars = fldObj.validChars();
		var valid = true;
		if (validChars && inputChar) {
			var c = inputChar.charAt(0);
			valid = validChars.indexOf(c) >= 0;
		}
		if(existText && valid && fldObj.getType() == jslet.data.DataType.NUMBER){
			var scale = fldObj.scale();
			var k = existText.lastIndexOf('.');
			if(inputChar == '.') {
				if(k >= 0) {
					return false;
				} else {
					return true;
				}
			}
			if(scale > 0 && k >= 0) {
				if(existText.length - k - 1 === scale && cursorPos - 1 > k) {
					return false;
				}
			}
			
		}
		return valid;
	},
	
	_addFieldLabel: function(fldLabel, errMsg) {
		return '[' + fldLabel + ']: ' + errMsg;
	},
	
	/**
	 * Check the required field's value is empty or not
	 * 
	 * @param {jslet.data.Field} fldObj Field Object
	 * @param {Object} value field value.
	 * @return {String} If input text is valid, return null, otherwise return error message.
	 */
	checkRequired: function(fldObj, value) {
		if (fldObj.required()) {
			var valid = true;
			if (value === null || value === undefined) {
				valid = false;
			}
			if(valid && jslet.isString(value) && jslet.trim(value).length === 0) {
				valid = false;
			}
			if(valid && jslet.isArray(value) && value.length === 0) {
				valid = false;
			}
			if(!valid) {
				return this._addFieldLabel(fldObj.label(), jslet.formatMessage(jsletlocale.Dataset.fieldValueRequired));
			} else {
				return null;
			}
		}
		return null;
	},
	
	checkMultiple: function(fldObj, value) {
		var valueStyle = fldObj.valueStyle();
		if(valueStyle !== jslet.data.FieldValueStyle.MULTIPLE || value === null || value === undefined) {
			return null;
		}
		var valueCountRange = fldObj.valueCountRange();
		if(!valueCountRange) {
			return null;
		}
		var min = valueCountRange.min,
			max = valueCountRange.max,
			valueCount = value.length,
			msg = null;
		if(max && valueCount > max) {
			msg = jslet.formatMessage(jsletlocale.Dataset.lessThanCount, [max]);
		} else {
			if(min && valueCount < min) {
				msg = jslet.formatMessage(jsletlocale.Dataset.lessThanCount, [min]);
			}
		}
		if(msg) {
			return this._addFieldLabel(fldObj.label(), msg);
		}
		var fldRange = fldObj.dataRange();
		if(fldRange) {
			for(var i = 0, len = valueCount; i < len; i++) {
				msg = this.checkDataRange(fldObj, value[i]);
				if(msg) {
					return msg;
				}
			}
		}
		return null; 
	},
	
	checkBetween: function(fldObj, value) {
		var valueStyle = fldObj.valueStyle();
		if(valueStyle !== jslet.data.FieldValueStyle.BETWEEN || value === null || value === undefined) {
			return null;
		}
		var v1 = null, v2 = null;
		if(value) {
			if(value.length > 0) {
				v1 = value[0];
				if(value.length > 1) {
					v2 = value[1];
				}
			}
		}
		var invalidMsg = null;
		if(v1 !== null && v1 !== undefined) {
			invalidMsg = this.checkDataRange(fldObj, v1);
		}
		if(!invalidMsg && v2 !== null && v2 !== undefined) {
			this.checkDataRange(fldObj, v2);
		}
		if(!invalidMsg && v1 && v2) {
			if(jslet.isDate(v1) && v1.getTime() > v2.getTime() || v1 > v2) {
				invalidMsg = jsletlocale.Dataset.betwwenInvalid;
			}
			return invalidMsg;
		}
		return invalidMsg;
	},
	
	checkDataRange: function(fldObj, value) {
		var fldType = fldObj.getType();
		//Check range
		var fldRange = fldObj.dataRange();
		if (!fldRange || value === null || value === undefined) {
			return null;
		}
		var	hasLookup = fldObj.lookup()? true: false;
		
		if (hasLookup) {//lookup field need compare 'code' value 
			var dsLookup = fldObj.lookup().dataset();
			value = dsLookup.lookup(dsLookup.keyField(), value, dsLookup.codeField());
		}
			
		var min = fldRange.min,
			strMin = min,
			max = fldRange.max,
			strMax = max;
		var fmt = fldObj.displayFormat();
		
		if (fldType == jslet.data.DataType.DATE) {
			if (min) {
				strMin = jslet.formatDate(min, fmt);
			}
			if (max) {
				strMax = jslet.formatDate(max, fmt);
			}
		}
		
		if (!hasLookup && fldType == jslet.data.DataType.NUMBER) {
			strMin = jslet.formatNumber(min, fmt);
			strMax = jslet.formatNumber(max, fmt);
		}
		
		if (min !== undefined && max !== undefined && (value < min || value > max)) {
			return this._addFieldLabel(fldObj.label(), 
					jslet.formatMessage(jsletlocale.Dataset.notInRange, [strMin, strMax]));
		}
		if (min !== undefined && max === undefined && value < min) {
			return this._addFieldLabel(fldObj.label(), 
					jslet.formatMessage(jsletlocale.Dataset.moreThanValue, [strMin]));
		}
		if (min === undefined && max !== undefined && value > max) {
			return this._addFieldLabel(fldObj.label(), 
					jslet.formatMessage(jsletlocale.Dataset.lessThanValue, [strMax]));
		}
		return null;
	},
	
	checkUnique: function(fldObj, value) {
		if(!fldObj.unique() || value === null || value === undefined) {
			return null;
		}
		var currDs = fldObj.dataset(),
			records = currDs.records();
		
		if(value !== null && value !== undefined && records && records.length > 1) {
			var currRec = currDs.getRecord(), 
				fldName = fldObj.name(),
				rec;
			for(var i = 0, len = records.length; i < len; i++) {
				rec = records[i];
				if(rec === currRec) {
					continue;
				}
				if(rec[fldName] == value) {
					return this._addFieldLabel(fldObj.label(), jsletlocale.Dataset.notUnique);
				}
			}
		}
		return null;
	},
	
	/**
	 * Check the specified field value is valid or not
	 * It will check required, range and custom validation
	 * 
	 * @param {jslet.data.Field} fldObj Field Object
	 * @param {Object} value field value. 
	 * @return {String} If input text is valid, return null, otherwise return error message.
	 */
	checkValue: function(fldObj, value) {
		if(!fldObj.visible() || fldObj.disabled() || fldObj.readOnly()) {
			return null;
		}
		var result = this.checkRequired(fldObj, value);
		if(result) {
			return result;
		}
		if(fldObj.valueStyle()) {
			result = this.checkMultiple(fldObj, value) || this.checkBetween(fldObj, value);
		} else {
			result = this.checkDataRange(fldObj, value) || this.checkUnique(fldObj, value);
		}
		if(result) {
			return result;
		}
		
		//Customized validation
		if (fldObj.customValidator()) {
			var msg = fldObj.customValidator().call(fldObj.dataset(), fldObj, value, jslet.data.serverValidator);
			if(msg) {
				return this._addFieldLabel(fldObj.label(), msg);
			}
		}
		
		return null;
	}
};

/**
 * The common function to validate data at server side.
 * 
 * @param {String} url - Validating url to connect to server.
 * @param {Object} reqData - request data to post to server to validate.
 */
jslet.data.serverValidator = function(url, reqData) {
	var ajaxSetting;
	if(jslet.global.beforeSubmit) {
		ajaxSetting = jslet.global.beforeSubmit({url: url});
	}
	if(!ajaxSetting) {
		ajaxSetting = {};
	}
	ajaxSetting.type = 'POST';
	ajaxSetting.async = false;
	ajaxSetting.contentType = 'application/json';
	ajaxSetting.mimeType = 'application/json';
	ajaxSetting.dataType = 'json';
	if(typeof reqData === 'object') {
		reqData = jslet.JSON.stringify(reqData);
	}
	ajaxSetting.data = reqData;
	var result = null;
	jQuery.ajax(url, ajaxSetting)
	.done(function(data, textStatus, jqXHR) {
		if(data) {
			var errorCode = data.errorCode;
			if (errorCode) {
				result = data.errorMessage;
			} else {
				if(jslet.isString(data)) {
					result = data;
				} else {
					result = data.result;
				}
			}
		} else {
			result = null;
		}
	})
	.fail(function( jqXHR, textStatus, errorThrown ) {
		var data = jqXHR.responseJSON,
			result;
		if(data && data.errorCode) {
			result = data.errorMessage;
		} else {
			var errorCode = textStatus,
				errorMessage = textStatus;
			if(textStatus == 'error') {
				errorCode = '0000';
				errorMessage = jsletlocale.Common.ConnectError;
			}
			result = errorMessage;
		}
	});
	return result;
};

if (!jslet.data) {
	jslet.data = {};
}

/**
 * @enum
 * 
 */
jslet.data.ApplyAction = {QUERY: 'query', SAVE: 'save', SELECTED: 'selected'};

/**
 * @class
 * Data provider to communicate to server side.
 */
jslet.data.DataProvider = function() {
	
	/**
	 * Send request to server.
	 * 
	 * @param {jslet.data.Dataset} dataset Dataset Object, see {@link jslet.data.Dataset}.
	 * @param {String} url Request URL.
	 * @param {String} reqData The request data which need to send to server.
	 */
	this.sendRequest = function(dataset, url, reqData) {
		var settings;
		if(jslet.global.beforeSubmit) {
			settings = jslet.global.beforeSubmit({url: url});
		}
		if(!settings) {
			settings = {};
		}
		settings.type = 'POST';
		settings.contentType = 'application/json';
		settings.mimeType = 'application/json';
		settings.dataType = 'json';
		settings.data = reqData;
		settings.context = dataset;
		if(dataset.csrfToken) {
			var headers = settings.headers || {};
			headers.csrfToken = dataset.csrfToken;
			settings.headers = headers;
		}
		
		var defer = jQuery.Deferred();
		jQuery.ajax(url, settings)
		.done(function(data, textStatus, jqXHR) {
			if(data) {
				if(data.csrfToken) {
					this.csrfToken = data.csrfToken;
				}
				var errorCode = data.errorCode;
				if (errorCode) {
					defer.reject(data, this);
					return;
				}
			}
			defer.resolve(data, this);
		})
		.fail(function( jqXHR, textStatus, errorThrown ) {
			var data = jqXHR.responseJSON,
				result;
			if(data && data.errorCode) {
				result = {errorCode: data.errorCode, errorMessage: data.errorMessage};
			} else {
				var errorCode = textStatus,
					errorMessage = textStatus;
				if(textStatus == 'error') {
					errorCode = '0000';
					errorMessage = jsletlocale.Common.ConnectError;
				}
				result = {errorCode: errorCode, errorMessage: errorMessage};
			}
			defer.reject(result, this);
		})
		.always(function(dataOrJqXHR, textStatus, jqXHRorErrorThrown) {
			if(dataOrJqXHR && jslet.isFunction(dataOrJqXHR.done)) { //fail
				var data = dataOrJqXHR.responseJSON,
					result;
				if(data && data.errorCode) {
					result = {errorCode: data.errorCode, errorMessage: data.errorMessage};
				} else {
					result = {errorCode: textStatus, errorMessage: jqXHRorErrorThrown};
				}
				defer.always(result, this);
			} else {
				defer.always(dataOrJqXHR, this);
			}
		});
		return defer.promise();
	};
};

if (!jslet.data) {
	jslet.data = {};
}

jslet.data.XLSXXPorter = {
	/*
	 * Import data into the specifed dataset from Excel file.
	 * @param {jslet.data.Dataset or String} dataset - Dataset object or dataset name.
	 * @param {String} fileContent - Excel file content.
	 */
	importData: function(dataset, fileContent) {
		function getHeader(sheet) {
		    var headers = [];
		    if (!sheet['!ref']) return;
		    var range = XLSX.utils.decode_range(sheet['!ref']);
		    var C, R = range.s.r; /* start in the first row */
		    /* walk every column in the range */
		    for(C = range.s.c; C <= range.e.c; ++C) {
		        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

		        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
		        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

		        headers.push(hdr);
		    }
		    return headers;
		}


		if(!XLSX) {
			throw new Error('js-xlsx.js(https://github.com/SheetJS/js-xlsx) NOT loaded!');
		}
		var workbook = XLSX.read(fileContent, {type: 'binary'});
		var result = {};
		if(workbook.SheetNames.length === 0) {
			return null;
		}
		var sheetName = workbook.SheetNames[0],
			sheet = workbook.Sheets[sheetName],
			header = getHeader(sheet),
			roa = XLSX.utils.sheet_to_row_object_array(sheet);
		result.data = roa;
		result.header = header;
		return result;

	},
	
	/*
	 * Export dataset data to the specified Excel file.
	 * 
	 * @param {jslet.data.Dataset | String} dataset Dataset object or dataset name.
	 * @param {String} fileName Excel file name.
	 * @param {Object} exportOption Export option.
	 * @param {Boolean} exportOption.exportHeader True - export field labels, false - otherwise, default is true.
	 * @param {Boolean} exportOption.exportDisplayValue True - export display value of field, false - export actual value of field, default is true.
	 * @param {Boolean} exportOption.onlySelected True - export selected records, false - otherwise, default is false.
	 * @param {Boolean} exportOption.exportAggregated True - export aggregated value, false -otherwise, default is false.
	 * @param {String[]} exportOption.includeFields Array of field names which to be exported.
	 * @param {String[]} exportOption.excludeFields Array of field names which not to be exported.
	 * @param {Function} exportOption.onExporting Exporting event.
	 * @param {Integer} exportOption.onExporting.recno The exporting record number.
	 * @param {Integer} exportOption.onExporting.recordcount The exporting record count.
	 * 
	 */
	exportData: function(dataset, fileName, exportOption) {
		if(!XLSX) {
			throw new Error('js-xlsx.js(https://github.com/SheetJS/js-xlsx) NOT loaded!');
		}
		dataset.confirm();
		if(dataset.existDatasetError()) {
			console.warn(jsletlocale.Dataset.cannotConfirm);
		}

		var exportHeader = true,
			exportDisplayValue = true,
			onlySelected = false,
			includeFields = null,
			excludeFields = null,
			exportAggregated = false,
			onlyOnce = true,
			onExporting = null,
			onExported = null;
			
		if(exportOption && jQuery.isPlainObject(exportOption)) {
			if(exportOption.exportHeader !== undefined) {
				exportHeader = exportOption.exportHeader? true: false;
			}
			if(exportOption.onlySelected !== undefined) {
				onlySelected = exportOption.onlySelected? true: false;
			}
			if(exportOption.exportAggregated !== undefined) {
				exportAggregated = exportOption.exportAggregated? true: false;
			}
			if(exportOption.includeFields !== undefined) {
				includeFields = exportOption.includeFields;
				jslet.Checker.test('Dataset.exportCsv#exportOption.includeFields', includeFields).isArray();
			}
			if(exportOption.excludeFields !== undefined) {
				excludeFields = exportOption.excludeFields;
				jslet.Checker.test('Dataset.exportCsv#exportOption.excludeFields', excludeFields).isArray();
			}
			if(exportOption.onExporting !== undefined) {
				jslet.Checker.test('Dataset.exportCsv#exportOption.onExporting', onExporting).isFunction();
				onExporting = exportOption.onExporting;
			}
			if(exportOption.onExported !== undefined) {
				jslet.Checker.test('Dataset.exportCsv#exportOption.onExported', onExported).isFunction();
				onExported = exportOption.onExported;
			}
			if(exportOption.onlyOnce !== undefined) {
				onlyOnce = exportOption.onlyOnce? true: false;
			}
		}
		var parsedExpCfg = this._getExportFields(dataset, includeFields, excludeFields)
		var topDsCfg = parsedExpCfg.datasets;
		var exportFields = parsedExpCfg.fields;
		
		var workSheet = {},
			row = 0, lastRow, lastCol,
			fldCnt = exportFields.length,
			startCell = {r: 0, c: 0}, 
			endCell = {r: 0, c: fldCnt - 1},
			expFld, i;
		
		if (exportHeader) {
			for(i = 0; i < fldCnt; i++) {
				expFld = exportFields[i];
				var label = expFld.label;
				if(!label) {
					label = '';
				} else {
					label = jslet.removeHtmlTag(label);
				}
				this._convertToXLSXFormat(workSheet, row, i, 's', label);
			}
			row++;
			lastRow = 0, lastCol = fldCnt - 1;
		}
		topDsCfg.endRow = row - 1;
		
		function doEndExporting() {
			endCell.r = topDsCfg.endRow;
			workSheet['!ref'] = XLSX.utils.encode_range({s: startCell, e: endCell});
			
			var ws_name = 'Sheet1';
			var wb = {SheetNames: [], Sheets: {}};
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = workSheet;
			var xlsxOpt = {bookType:'xlsx', bookSST:true, type: 'binary'};
			var wbout = XLSX.write(wb, xlsxOpt);
			
			function convertToUnitArray(workBook) {
				var len = workBook.length,
					buf = new ArrayBuffer(len),
					view = new Uint8Array(buf);
				for (var k = 0; k != len; ++k) {
					view[k] = workBook.charCodeAt(k) & 0xFF;
				}
				return buf;
			}

			saveAs(new Blob([convertToUnitArray(wbout)], {type:"application/octet-stream"}), fileName);
			if(onExported) {
				onExported();
			}
		}
		var recordCount = dataset.recordCount();
		if(recordCount === 0) {
			doEndExporting();
			return;
		}
		var Z = this;
		new jslet.StepProcessor(dataset.recordCount(), function(start, end, percent) {
			Z._innerExportData(workSheet, topDsCfg, exportFields, onlySelected, onlyOnce, exportAggregated, start, end);
			if(onExporting) {
				onExporting(percent);
			}
			if(percent === 100) {
				doEndExporting();
			}
		}).run();
	},

	_convertToXLSXFormat: function(worksheet, row, col, type, value) {
		var cell_ref = XLSX.utils.encode_cell({c: col,r: row}), 
			cell = {t: type, v: value};
		worksheet[cell_ref] = cell;
	},

	_innerExportData: function(workSheet, currDsCfg, exportFields, onlySelected, onlyOnce, exportAggregated, start, end) {
		var dsObj = currDsCfg.dataset,
			context = dsObj.startSilenceMove(), 
			value, dataType, expFld, fldName,
			row = currDsCfg.endRow + 1,
			fldCnt = exportFields.length;
		if(currDsCfg.master) {
			row = currDsCfg.master.endRow;
		} else {
			row = currDsCfg.endRow + 1;
		}
		try {
			var dsTmp, notFirst = false, isMaster,
				hasMaster = currDsCfg.master? true: false;
			if(!start) {
				start = 0;
			}
			var totalRecCnt = dsObj.recordCount() - 1;
			if(!end && end !== 0) {
				end = totalRecCnt;
			}
			var SType = jslet.data.DataType.STRING,
				NType = jslet.data.DataType.NUMBER;
			
			for(var recno = start; recno <= end; recno++) {
				dsObj.recno(recno);
				if (onlySelected && !dsObj.selected()) {
					continue;
				}
				for(var i = 0; i < fldCnt; i++) {
					expFld = exportFields[i];
					fldName = expFld.field;
					dsTmp = dsObj;
					if(dsObj !== expFld.dataset) {
						if(onlyOnce) {
							continue;
						}
						isMaster = false;
						var dsCfg = currDsCfg.master; 
						while(true) {
							if(!dsCfg) {
								break;
							}
							if(dsCfg.dataset === expFld.dataset) {
								isMaster = true;
								dsTmp = dsCfg.dataset;
								break;
							}
							dsCfg = dsCfg.master;
						}
						if(!isMaster) {
							continue;
						}
					}
					//If Number field does not have lookup field, return field value, not field text. 
					//Example: 'amount' field
					dataType = expFld.dataType;
					if(dataType === NType && !expFld.hasLookup) {
						value = dsTmp.getFieldValue(fldName);
						if(value === null || value === undefined) {
							continue;
						}
						this._convertToXLSXFormat(workSheet, row, i, 'n', value);
					} else {
						value = dsTmp.getFieldText(fldName);
						if(value === null || value === undefined || value === '') {
							continue;
						}
						if(dataType === SType) {
							var replaceFn = value.replace;
							if(replaceFn) {
								value = jslet.removeHtmlTag(value);
							} else {
								value += '';
							}
						}
						this._convertToXLSXFormat(workSheet, row, i, 's', value);
					}
				} //end for i
			
				currDsCfg.endRow = row;
				var details = currDsCfg.details, dtlCfg;
				if(details && details.length > 0) {
					for(var j = 0, cfgCnt = details.length; j < cfgCnt; j++) {
						this._innerExportData(workSheet, details[j], exportFields, false, onlyOnce, exportAggregated);
					}
					row = currDsCfg.endRow + 1;
				} else {
					row++
				}
				var aggrValues = dsObj.aggregatedValues();
				if(exportAggregated && recno === totalRecCnt && aggrValues) {
					var aggrValue;
					for(i = 0; i < fldCnt; i++) {
						expFld = exportFields[i];
						fldName = expFld.field;
						aggrValue = aggrValues[fldName];
						if(!aggrValue) {
							continue;
						}
						dataType = expFld.dataType;
						aggrValue = dataType === NType? aggrValue.sum: aggrValue.count;
						if(aggrValue) {
							this._convertToXLSXFormat(workSheet, row, i, 'n', aggrValue);
						}
					}
					currDsCfg.endRow = row;
				}
				notFirst = true;
			} // end for recno
			var masterCfg = currDsCfg.master;
			if(masterCfg && masterCfg.endRow < currDsCfg.endRow) {
				masterCfg.endRow = currDsCfg.endRow;
			}
		}finally{
			dsObj.endSilenceMove(context);
		}
	},
	
	_getExportFields: function(dataset, includeFields, excludeFields) {
		function getMaster(dsCfg, dsMaster) {
			if(dsCfg.dataset == dsMaster) {
				return dsCfg;
			} else {
				var details = topDsCfg.details;
				var dsObj, dsCfg;
				for(var i = 0, len = details.length; i < len; i++) {
					dsCfg = details[i];
					dsCfg = getMaster(dsCfg, dsMaster);
					if(!dsCfg) {
						return dsCfg;
					}
				}
			}
			return null;
		}
		
		function addDs(topDsCfg, dsMaster, dsDetail) {
			var dsCfg, details = topDsCfg.details;
			if(!details) {
				details = [];
				topDsCfg.details = details;
			}
			var found = false;
			var masterCfg = getMaster(topDsCfg, dsMaster);
			details = masterCfg.details;
			for(var k = 0, dsCnt = details.length; k < dsCnt; k++) {
				dsCfg = details[k];
				if(dsCfg.dataset === dsDetail) {
					found = true;
					break;
				}
			}
			if(!found) {
				details.push({master: masterCfg, dataset: dsDetail});
			}
		}
		
		var exportFlds = [], datasets = {dataset: dataset},
			fldName, fldObj, dtlFldObj, dsDetail, i, len, fldNames, expFld;
		if(includeFields && includeFields.length > 0) {
			for(i = 0, len = includeFields.length; i < len; i++) {
				fldName = includeFields[i];
				expFld = {};
				if(fldName.indexOf('.') < 0) {
					expFld.dataset = dataset;
					expFld.field = fldName;
					fldObj = dataset.getField(fldName);
				} else {
					fldNames = fldName.split('.');
					var dsMaster = dataset;
					for(var j = 0, cnt = fldNames.length - 1; j < cnt; j++) {
						dtlFldObj = dsMaster.getField(fldNames[j]);
						dsDetail = dtlFldObj.detailDataset();
						addDs(datasets, dsMaster, dsDetail);
						dsMaster = dsDetail; 
					}
					fldName = fldNames[cnt];
					expFld.dataset = dsDetail;
					expFld.field = fldName;
					fldObj = dsDetail.getField(fldName);
				}
				expFld.label = fldObj.label();
				expFld.dataType = fldObj.getType();
				expFld.hasLookup = fldObj.lookup() ? true: false;
				exportFlds.push(expFld);
			}
		} else {
			var fields = dataset.getNormalFields();
			for(i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				if(!fldObj.visible()) {
					continue;
				}
				fldName = fldObj.name();
				if(excludeFields && excludeFields.length > 0) {
					if(excludeFields.indexOf(fldName) >= 0) {
						continue;
					}
				} 
				expFld = {dataset: dataset, field: fldName};
				expFld.label = fldObj.label();
				expFld.dataType = fldObj.getType();
				expFld.hasLookup = fldObj.lookup() ? true: false;
				exportFlds.push(expFld);
			}
		}
		return {datasets: datasets, fields: exportFlds};
	}
};

if (!jslet.data) {
	jslet.data = {};
}

jslet.data.XPorter = function() {
	this._excelXPorter = null;
	
}

jslet.data.XPorter.prototype = {
	excelXPorter: function(xporter) {
		if(xporter === undefined) {
			return this._excelXPorter || jslet.data.XLSXXPorter;
		}
		this._excelXPorter = xporter;
	}
	
};

jslet.data.defaultXPorter = new jslet.data.XPorter();
/**
 * @class
 * 
 * The dataset meta store which store in IndexedDB. Example:
 * 
 *     @example
 *     var indexedDBMetaStore = new jslet.data.IndexedDBMetaStore('demo');
 *     jslet.data.datasetFactory.addMetaStore(indexedDBMetaStore);
 * 
 * @param {String} databaseName IndexedDB database name.
 */
jslet.data.IndexedDBMetaStore = function(dbName) {
	var Z = this;
	Z._dbName = dbName;
	Z._db = null;
 }

jslet.data.IndexedDBMetaStore.prototype = {
	openDatabase: function() {
		var Z = this;
		var defer = jQuery.Deferred();
		var request = indexedDB.open(this._dbName, 1);
		request.onsuccess = function(event) {
			Z._db = request.result;	
			defer.resolve();
		};
		request.onerror = function(event) {
			console.error(event);
			defer.reject();
		};
		
		request.onupgradeneeded = function (evt) {   
	    	var store = evt.currentTarget.result.createObjectStore
				("datasetMeta", {keyPath: "name"});
	    };
	    
	    return defer.promise();
	},
	
	/**
	 * This method will be called by jslet.data.DatasetFactory. Do not call it manually. <br />
	 * This method uses to get dataset meta when creating dataset. <br />
	 * It is called asynchronously.
	 * 
	 * @param {String} datasetName Dataset name.
	 * 
	 * @return {Promise} 
	 */
	getDatasetMeta: function(datasetName) {
		var Z = this;
		function innerGet() {
		
			var defer = jQuery.Deferred(),
				transaction = Z._db.transaction('datasetMeta', 'readonly'),
				store = transaction.objectStore('datasetMeta').get(datasetName);
			store.onsuccess = function(event) {
				defer.resolve(event.target.result);
			};
			store.onerror = function(event) {
				console.error(event);
				defer.reject(null);
			};
			return defer.promise();
		}
		if(!Z._db) {
			var defer = jQuery.Deferred();
			Z.openDatabase().done(function() {
				innerGet().done(function(result) {
					defer.resolve(result);
				}).fail(function() {
					defer.reject();
				});
			}).fail(function() {
				defer.reject();
			});
			return defer.promise();
		} else {
			return innerGet();
		}
	},
	
	/**
	 * Add a dataset meta.
	 * 
	 * @param {String} datasetName Dataset name.
	 * @param {Object} datasetMeta Dataset meta object.
	 * 
	 * @return {this}
	 */
	addDatasetMeta: function(datasetName, datasetMeta) {
		jslet.Checker.test('addDatasetMeta#datasetName', datasetName).required().isString();
		jslet.Checker.test('addDatasetMeta#datasetMeta', datasetMeta).required().isObject();
		var Z = this;
		if(Z._db) {
			Z._db.transaction('datasetMeta', "readwrite");
			var store = transaction.objectStore('datasetMeta');
			store.put(datasetName, datasetMeta);
		} else {
			Z.openDatabase().done(function() {
				var store = Z._db.transaction('datasetMeta', "readwrite").objectStore('datasetMeta');
				datasetMeta.name = datasetName;
				store.add(datasetMeta);
			})
		}
		return this;
	},
	
	/**
	 * Add some dataset metas.
	 * 
	 * @param {Object[]} datasetMeta Dataset meta objects.
	 * 
	 * @return {this}
	 */
	addDatasetMetas: function(datasetMetas) {
		jslet.Checker.test('addDatasetMetas#datasetMetas', datasetMetas).required().isArray();
		var Z = this, 
			i, len = datasetMetas.length, datasetMeta;
		for(i = len - 1; i >= 0; i--) {
			datasetMeta = datasetMetas[i];
			if(datasetMeta) {
				jslet.Checker.test('addDatasetMeta#datasetName', datasetMeta.name).required().isString();
			} else {
				datasetMetas.splice(i, 1);
			}
		}
		if(Z._db) {
			Z._db.transaction('datasetMeta', "readwrite");
			var store = transaction.objectStore('datasetMeta');
			for(i = 0; i < len; i++) {
				datasetMeta = datasetMetas[i];
				store.put(datasetMeta.name, datasetMeta);
			}
		} else {
			Z.openDatabase().done(function() {
				var store = Z._db.transaction('datasetMeta', "readwrite").objectStore('datasetMeta');
				for(i = 0; i < len; i++) {
					datasetMeta = datasetMetas[i];
					store.add(datasetMeta);
				}
			});
		}
		return this;
	}
	
}
/* jshint ignore:start */
	return jslet;
});
/* jshint ignore:end */
