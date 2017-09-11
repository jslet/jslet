describe('Jslet core methods test suite', function() {
	describe('jslet.deepClone()', function() {
		it('jslet.deepClone(undefined | null | true | false)', function() {
			expect(jslet.deepClone()).toBeUndefined();
			expect(jslet.deepClone(null)).toBeNull();
			expect(jslet.deepClone(true)).toBe(true);
			expect(jslet.deepClone(false)).toBe(false);
		});

		it('jslet.deepClone(Number)', function() {
			expect(jslet.deepClone(100)).toBe(100);
			expect(jslet.deepClone(100.5)).toBe(100.5);
		});

		it('jslet.deepClone(String)', function() {
			var x = 'abc';
			var y = jslet.deepClone(x);
			expect(x).toBe(y);
		});

		it('jslet.deepClone(Date)', function() {
			var x = new Date();
			var y = jslet.deepClone(x);
			expect(x).not.toBe(y);
			expect(x.getTime()).toBe(y.getTime());
		});

		it('jslet.deepClone(Array)', function() {
			var x = [1, 2, 3];
			var y = jslet.deepClone(x);
			expect(x).not.toBe(y);
			expect(x.length).toBe(y.length);
			expect(x[0]).toBe(y[0]);
			expect(x[1]).toBe(y[1]);
			expect(x[2]).toBe(y[2]);
		});

		it('jslet.deepClone(Object)', function() {
			var x = {a: 1, b: 2};
			var y = jslet.deepClone(x);
			expect(x).not.toBe(y);
			expect(x.a).toBe(y.a);
			expect(x.b).toBe(y.b);
		});

		it('jslet.deepClone(Complex Object)', function() {
			var x = {a: 1, b: 2, items: [{m: 1, n: 'abc'}]};
			var y = jslet.deepClone(x);
			expect(x).not.toBe(y);
			expect(x.a).toBe(y.a);
			expect(x.b).toBe(y.b);
			expect(x.items).not.toBe(y.items);
			expect(x.items[0]).not.toBe(y.items[0]);
			expect(x.items[0].n).toBe(y.items[0].n);
			expect(x.items[0].m).toBe(y.items[0].m);
			x.items = null;
			expect(y.items.length).toBe(1);
			
		});

	});
	
	describe('jslet.formatMessage(message, args)', function() {
		it('jslet.formatMessage(No message)', function() {
			expect(jslet.formatMessage).toThrowError('[jslet.formatMessage#msg] is Required!');
		});

		it('jslet.formatMessage(Arguments: None)', function() {
			expect(jslet.formatMessage('Hello, {0}')).toBe('Hello, {0}');
		});

		it('jslet.formatMessage(Arguments: Array)', function() {
			expect(jslet.formatMessage('Hello, {0}', [ 'Tom' ])).toBe('Hello, Tom');
		});

		it('jslet.formatMessage(Arguments: Object)', function() {
			expect(jslet.formatMessage('Hello, {name}', {
				name : 'Tom'
			})).toBe('Hello, Tom');
		});

		it('jslet.formatMessage(Arguments: String)', function() {
			expect(jslet.formatMessage('Hello, {0}', 'Tom')).toBe('Hello, Tom');
		});
	});

	describe('jslet.formatString(str, format)', function() {

		it('jslet.formatString(No string)', function() {
			expect(jslet.formatString()).toBe(undefined);
		});

		it('jslet.formatString(No format)', function() {
			expect(jslet.formatString('Hello')).toBe('Hello');
		});

		it('jslet.formatString("12345678", "##-###-###")', function() {
			expect(jslet.formatString("12345678", "##-###-###")).toBe('12-345-678');
		});

	});

	describe('jslet.formatNumber(num, format)', function() {

		it('jslet.formatNumber(No string)', function() {
			expect(jslet.formatNumber()).toBe('');
		});

		it('jslet.formatNumber(3123.5)', function() {
			expect(jslet.formatNumber(3123.5)).toBe('3123.5');
		});

		it('jslet.formatNumber(5681009.2, "#,###.##")', function() {
			expect(jslet.formatNumber(5681009.2, "#,###.##")).toBe('5,681,009.2');
		});

		it('jslet.formatNumber(-100, "#,###.##")', function() {
			expect(jslet.formatNumber(-100, "#,###.##")).toBe('-100');
		});

		it('jslet.formatNumber(1009.2, "#,###.00")', function() {
			expect(jslet.formatNumber(1009.2, "#,###.00")).toBe('1,009.20');
		});

		it('Currency: jslet.formatNumber(1009.2, "$#,###.00")', function() {
			expect(jslet.formatNumber(1009.2, "$#,###.00")).toBe('$1,009.20');
		});

		it('jslet.formatNumber(1009.2, "#,###.00")', function() {
			expect(jslet.formatNumber(123, "00000")).toBe('00123');
		});

		it('Round nubmer 1: jslet.formatNumber(12345.999,"#,##0.00")', function() {
			expect(jslet.formatNumber(12345.999,"#,##0.00")).toBe('12,346.00');
		});

		it('Round nubmer 2: jslet.formatNumber(12345.999,"#,##0.##")', function() {
			expect(jslet.formatNumber(12345.999,"#,##0.##")).toBe('12,346');
		});
	});

	describe('jslet.formatDate(date, format)', function() {
		var date = new Date(2016, 2, 15, 11, 36, 45);
		it('jslet.formatDate()', function() {
			expect(jslet.formatDate()).toBe('');
		});

		it('jslet.formatDate(new Date(2016, 2, 15), "yyyy-MM-dd")', function() {
			expect(jslet.formatDate(date, "yyyy-MM-dd")).toBe('2016-03-15');
		});

		it('jslet.formatDate(new Date(2016, 2, 15, 11, 36, 45), "yyyy-MM-dd hh:mm:ss")', function() {
			expect(jslet.formatDate(date, "yyyy-MM-dd hh:mm:ss")).toBe('2016-03-15 11:36:45');
		});

		it('jslet.formatDate(new Date(2016, 2, 15, 11, 36, 45), "MM/dd/yyyy hh:mm:ss")', function() {
			expect(jslet.formatDate(date, "MM/dd/yyyy hh:mm:ss")).toBe('03/15/2016 11:36:45');
		});

		it('jslet.formatDate(new Date(2016, 2, 15, 11, 36, 45), "yyyy-MM-ddThh:mm:ssZ")', function() {
			expect(jslet.formatDate(date, "yyyy-MM-ddThh:mm:ssZ")).toBe('2016-03-15T11:36:45Z');
		});
	});

	describe('jslet.parseDate(dateStr, format)', function() {
		it('jslet.parseDate()', function() {
			expect(jslet.parseDate()).toBe(null);
		});

		var date1 = jslet.parseDate("2016-02-15", "yyyy-MM-dd");
		it('jslet.parseDate("2016-02-15", "yyyy-MM-dd")', function() {
			expect(date1.getFullYear()).toBe(2016);
			expect(date1.getMonth()).toBe(1);
			expect(date1.getDate()).toBe(15);
		});

		var date2 = jslet.parseDate('2013-03-25 15:20:18', 'yyyy-MM-dd hh:mm:ss');
		it('jslet.parseDate("2013-03-25 15:20:18", "yyyy-MM-dd hh:mm:ss")', function() {
			expect(date2.getHours()).toBe(15);
			expect(date2.getMinutes()).toBe(20);
			expect(date2.getSeconds()).toBe(18);
		});
	});

	describe('jslet.convertISODate(dateStr)', function() {
		it('jslet.convertISODate()', function() {
			expect(jslet.convertISODate()).toBe(null);
		});

		var date1 = jslet.parseDate("2016-02-15", "yyyy-MM-dd");
		it('jslet.convertISODate(dateObj)', function() {
			expect(jslet.convertISODate(date1)).toBe(date1);
		});

		var date2 = jslet.convertISODate("2012-11-24T16:00:00Z");
		it('jslet.convertISODate("2012-11-24T16:00:00Z")', function() {
			expect(date2.getFullYear()).toBe(2012);
		});
		
		var date3 = jslet.convertISODate("2012-11-24T16:00:00");
		it('jslet.convertISODate("2012-11-24T16:00:00")', function() {
			expect(date3.getHours()).toBe(16);
			expect(date3.getFullYear()).toBe(2012);
			expect(date3.getDate()).toBe(24);
		});
	});

	describe('jslet.like(testValue, pattern, escapeChar)', function() {
		it('jslet.like()', function() {
			expect(jslet.like()).toBe(false);
		});

		it('jslet.like("abc")', function() {
			expect(jslet.like("abc")).toBe(false);
		});

		it('jslet.like("abcd", "%b%")', function() {
			expect(jslet.like("abcd", "%b%")).toBe(true);
		});
		
		it('jslet.like("abcd", "%e%")', function() {
			expect(jslet.like("abcd", "%e%")).toBe(false);
		});
		
		it('jslet.like("abcd", "%b_d")', function() {
			expect(jslet.like("abcd", "%b_d")).toBe(true);
		});
		
		it('jslet.like("ab%cd", "%b$%_d", "$")', function() {
			expect(jslet.like("ab%cd", "%b$%_d", "$")).toBe(true);
		});		
	});
	
	describe('jslet.between(testValue, minValue, maxValue)', function() {
		it('jslet.between()', function() {
			expect(jslet.between()).toBe(false);
		});

		it('jslet.between("b", "a", "c")', function() {
			expect(jslet.between("b", "a", "c")).toBe(true);
		});

		it('jslet.between("a", "b", "c")', function() {
			expect(jslet.between("a", "b", "c")).toBe(false);
		});

		it('jslet.between(5, 1, 10)', function() {
			expect(jslet.between(5, 1, 10)).toBe(true);
		});

		it('jslet.between(new Date(2001, 2, 10), new Date(2001, 1, 10), new Date(2002, 2, 10))', function() {
			expect(jslet.between(new Date(2001, 2, 10), new Date(2001, 1, 10), new Date(2002, 2, 10))).toBe(true);
		});

		it('jslet.between(5, 1, null)', function() {
			expect(jslet.between(5, 1)).toBe(true);
		});

		it('jslet.between(5, null, 10)', function() {
			expect(jslet.between(5, 1)).toBe(true);
		});
	});
	
	describe('jslet.inlist(testValue, value1, value2, ...)', function() {
		it('jslet.inlist()', function() {
			expect(jslet.inlist()).toBe(false);
		});

		it('jslet.inlist("b", "a", "c")', function() {
			expect(jslet.inlist("b", "a", "c")).toBe(false);
		});

		it('jslet.inlist("a", "b", "c", "a")', function() {
			expect(jslet.inlist("a", "b", "c", "a")).toBe(true);
		});

		it('jslet.inlist(5, 1, 10, 5)', function() {
			expect(jslet.inlist(5, 1, 10, 5)).toBe(true);
		});

		it('jslet.inlist(new Date(2001, 2, 10), new Date(2001, 1, 10), new Date(2002, 2, 10), new Date(2001, 2, 10))', function() {
			expect(jslet.inlist(new Date(2001, 2, 10), new Date(2001, 1, 10), new Date(2002, 2, 10), new Date(2001, 2, 10))).toBe(true);
		});

	});
	
	describe('jslet.inArray(testValue, [value1, value2, ...])', function() {
		it('jslet.inArray()', function() {
			expect(jslet.inArray()).toBe(false);
		});

		it('jslet.inArray("b", ["a", "c"])', function() {
			expect(jslet.inArray("b", ["a", "c"])).toBe(false);
		});

		it('jslet.inArray("a", ["b", "c", "a"])', function() {
			expect(jslet.inArray("a", ["b", "c", "a"])).toBe(true);
		});

		it('jslet.inArray(5, [1, 10, 5])', function() {
			expect(jslet.inArray(5, [1, 10, 5])).toBe(true);
		});

		it('jslet.inArray(new Date(2001, 2, 10), [new Date(2001, 1, 10), new Date(2002, 2, 10), new Date(2001, 2, 10)])', function() {
			expect(jslet.inArray(new Date(2001, 2, 10), [new Date(2001, 1, 10), new Date(2002, 2, 10), new Date(2001, 2, 10)])).toBe(true);
		});
	});
	
	describe('jslet.isDate(testValue)', function() {
		it('jslet.isDate()', function() {
			expect(jslet.isDate()).toBe(true);
		});

		it('jslet.isDate(null)', function() {
			expect(jslet.isDate(null)).toBe(true);
		});

		it('jslet.isDate(new Date(2001, 2, 10))', function() {
			expect(jslet.isDate(new Date(2001, 2, 10))).toBe(true);
		});

		it('jslet.isDate("abc")', function() {
			expect(jslet.isDate("abc")).toBe(false);
		});

		it('jslet.isDate(123)', function() {
			expect(jslet.isDate(123)).toBe(false);
		});

		it('jslet.isDate(true)', function() {
			expect(jslet.isDate(true)).toBe(false);
		});

		it('jslet.isDate({x: 1})', function() {
			expect(jslet.isDate({x: 1})).toBe(false);
		});
	});
	
	describe('jslet.isArray(testValue)', function() {
		it('jslet.isArray()', function() {
			expect(jslet.isArray()).toBe(true);
		});

		it('jslet.isArray(null)', function() {
			expect(jslet.isArray(null)).toBe(true);
		});

		it('jslet.isArray([1, 2, 3])', function() {
			expect(jslet.isArray([1, 2, 3])).toBe(true);
		});

		it('jslet.isArray(new Date(2001, 2, 10))', function() {
			expect(jslet.isArray(new Date(2001, 2, 10))).toBe(false);
		});

		it('jslet.isArray("abc")', function() {
			expect(jslet.isArray("abc")).toBe(false);
		});

		it('jslet.isArray(123)', function() {
			expect(jslet.isArray(123)).toBe(false);
		});

		it('jslet.isArray(true)', function() {
			expect(jslet.isArray(true)).toBe(false);
		});

		it('jslet.isArray({x: 1})', function() {
			expect(jslet.isArray({x: 1})).toBe(false);
		});
	});
		
	describe('jslet.isString(testValue)', function() {
		it('jslet.isString()', function() {
			expect(jslet.isString()).toBe(true);
		});

		it('jslet.isString(null)', function() {
			expect(jslet.isString(null)).toBe(true);
		});

		it('jslet.isString([1, 2, 3])', function() {
			expect(jslet.isString([1, 2, 3])).toBe(false);
		});

		it('jslet.isString(new Date(2001, 2, 10))', function() {
			expect(jslet.isString(new Date(2001, 2, 10))).toBe(false);
		});

		it('jslet.isString("abc")', function() {
			expect(jslet.isString("abc")).toBe(true);
		});

		it('jslet.isString(123)', function() {
			expect(jslet.isString(123)).toBe(false);
		});

		it('jslet.isString(true)', function() {
			expect(jslet.isString(true)).toBe(false);
		});

		it('jslet.isString({x: 1})', function() {
			expect(jslet.isString({x: 1})).toBe(false);
		});
	});
		
	describe('jslet.isNumber(testValue)', function() {
		it('jslet.isNumber()', function() {
			expect(jslet.isNumber()).toBe(true);
		});

		it('jslet.isNumber(null)', function() {
			expect(jslet.isNumber(null)).toBe(true);
		});

		it('jslet.isNumber(123)', function() {
			expect(jslet.isNumber(123)).toBe(true);
		});

		it('jslet.isNumber(123.35)', function() {
			expect(jslet.isNumber(123.35)).toBe(true);
		});

		it('jslet.isNumber([1, 2, 3])', function() {
			expect(jslet.isNumber([1, 2, 3])).toBe(false);
		});

		it('jslet.isNumber(new Date(2001, 2, 10))', function() {
			expect(jslet.isNumber(new Date(2001, 2, 10))).toBe(false);
		});

		it('jslet.isNumber("abc")', function() {
			expect(jslet.isNumber("abc")).toBe(false);
		});

		it('jslet.isNumber(true)', function() {
			expect(jslet.isNumber(true)).toBe(false);
		});

		it('jslet.isNumber({x: 1})', function() {
			expect(jslet.isNumber({x: 1})).toBe(false);
		});
	});
		
	describe('jslet.isObject(testValue)', function() {
		it('jslet.isObject()', function() {
			expect(jslet.isObject()).toBe(true);
		});

		it('jslet.isObject(null)', function() {
			expect(jslet.isObject(null)).toBe(true);
		});

		it('jslet.isObject([1, 2, 3])', function() {
			expect(jslet.isObject([1, 2, 3])).toBe(false);
		});

		it('jslet.isObject(new Date(2001, 2, 10))', function() {
			expect(jslet.isObject(new Date(2001, 2, 10))).toBe(false);
		});

		it('jslet.isObject("abc")', function() {
			expect(jslet.isObject("abc")).toBe(false);
		});

		it('jslet.isObject(123)', function() {
			expect(jslet.isObject(123)).toBe(false);
		});

		it('jslet.isObject(true)', function() {
			expect(jslet.isObject(true)).toBe(false);
		});

		it('jslet.isObject({x: 1})', function() {
			expect(jslet.isObject({x: 1})).toBe(true);
		});
	});
	
	describe('jslet.isHTMLElement(testValue)', function() {
		it('jslet.isHTMLElement()', function() {
			expect(jslet.isHTMLElement()).toBe(true);
		});

		it('jslet.isHTMLElement(null)', function() {
			expect(jslet.isHTMLElement(null)).toBe(true);
		});

		it('jslet.isHTMLElement([1, 2, 3])', function() {
			expect(jslet.isHTMLElement([1, 2, 3])).toBe(false);
		});

		it('jslet.isHTMLElement(new Date(2001, 2, 10))', function() {
			expect(jslet.isHTMLElement(new Date(2001, 2, 10))).toBe(false);
		});

		it('jslet.isHTMLElement("abc")', function() {
			expect(jslet.isHTMLElement("abc")).toBe(false);
		});

		it('jslet.isHTMLElement(123)', function() {
			expect(jslet.isHTMLElement(123)).toBe(false);
		});

		it('jslet.isHTMLElement(true)', function() {
			expect(jslet.isHTMLElement(true)).toBe(false);
		});

		it('jslet.isHTMLElement({x: 1})', function() {
			expect(jslet.isHTMLElement({x: 1})).toBe(false);
		});
		
		var odiv = document.createElement('div');
		it('jslet.isHTMLElement(divEl)', function() {
			expect(jslet.isHTMLElement(odiv)).toBe(true);
		});
	});
	
	describe('jslet.isEmpty(testValue)', function() {
		it('jslet.isEmpty()', function() {
			expect(jslet.isEmpty()).toBe(true);
		});

		it('jslet.isEmpty(null)', function() {
			expect(jslet.isEmpty(null)).toBe(true);
		});

		it('jslet.isEmpty("")', function() {
			expect(jslet.isEmpty(null)).toBe(true);
		});

		it('jslet.isEmpty(["", null, ""])', function() {
			expect(jslet.isEmpty(["", null, ""])).toBe(true);
		});

		it('jslet.isEmpty([1, 2, 3])', function() {
			expect(jslet.isEmpty([1, 2, 3])).toBe(false);
		});

		it('jslet.isEmpty(new Date(2001, 2, 10))', function() {
			expect(jslet.isEmpty(new Date(2001, 2, 10))).toBe(false);
		});

		it('jslet.isEmpty("abc")', function() {
			expect(jslet.isEmpty("abc")).toBe(false);
		});

		it('jslet.isEmpty(123)', function() {
			expect(jslet.isEmpty(123)).toBe(false);
		});

		it('jslet.isEmpty(true)', function() {
			expect(jslet.isEmpty(true)).toBe(false);
		});
	});
	
	describe('jslet.compareValue(value1, value2, caseSensitive, useLocale)', function() {
		it('jslet.compareValue()', function() {
			expect(jslet.compareValue()).toBe(0);
		});

		it('jslet.compareValue(null, null)', function() {
			expect(jslet.compareValue(null, null)).toBe(0);
		});

		it('jslet.compareValue("", null)', function() {
			expect(jslet.compareValue("", null)).toBe(1);
		});

		it('jslet.compareValue(null, 1)', function() {
			expect(jslet.compareValue(null, 1)).toBe(-1);
		});

		it('jslet.compareValue(1, null)', function() {
			expect(jslet.compareValue(1, null)).toBe(1);
		});

		it('jslet.compareValue(11, 2)', function() {
			expect(jslet.compareValue(11, 2)).toBe(1);
		});

		it('jslet.compareValue(2, 11)', function() {
			expect(jslet.compareValue(2, 11)).toBe(-1);
		});

		it('jslet.compareValue(new Date(2001, 2, 10), new Date(2002, 2, 10))', function() {
			expect(jslet.compareValue(new Date(2001, 2, 10), new Date(2002, 2, 10))).toBe(-1);
		});

		it('jslet.compareValue(new Date(2002, 2, 10), new Date(2001, 2, 10))', function() {
			expect(jslet.compareValue(new Date(2002, 2, 10), new Date(2001, 2, 10))).toBe(1);
		});

		it('jslet.compareValue("11", "2")', function() {
			expect(jslet.compareValue("11", "2")).toBe(-1);
		});

		it('jslet.compareValue("2", "11")', function() {
			expect(jslet.compareValue("2", "11")).toBe(1);
		});

		it('jslet.compareValue("a", "b")', function() {
			expect(jslet.compareValue("a", "b")).toBe(-1);
		});

		it('jslet.compareValue("a", "b")', function() {
			expect(jslet.compareValue("a", "b")).toBe(-1);
		});

		it('jslet.compareValue("a", "B", true)', function() {
			expect(jslet.compareValue("a", "B", true)).toBe(-1);
		});

		it('jslet.compareValue("a", "B", true, false)', function() {
			expect(jslet.compareValue("a", "B", true, false)).toBe(1);
		});
	});
	
	describe('jslet.htmlEncode(htmlText)', function() {
		it('jslet.htmlEncode()', function() {
			expect(jslet.htmlEncode()).toBe('');
		});

		it('jslet.htmlEncode("<div />")', function() {
			expect(jslet.htmlEncode("<div />")).toBe('&lt;div /&gt;');
		});
	});
	
	describe('jslet.htmlDecode(htmlText)', function() {
		it('jslet.htmlDecode()', function() {
			expect(jslet.htmlDecode()).toBe('');
		});

		it('jslet.htmlDecode("&lt;div /&gt;")', function() {
			expect(jslet.htmlDecode("&lt;div /&gt;")).toBe('<div />');
		});
	});
	
	describe('jslet.getArrayValue(htmlText)', function() {
		it('jslet.getArrayValue()', function() {
			expect(jslet.getArrayValue()).toBe(null);
		});

		it('jslet.getArrayValue(null)', function() {
			expect(jslet.getArrayValue(null)).toBe(null);
		});

		it('jslet.getArrayValue([], 1)', function() {
			expect(jslet.getArrayValue([], 1)).toBe(null);
		});

		it('jslet.getArrayValue([1,2,3], 1)', function() {
			expect(jslet.getArrayValue([1,2,3], 1)).toBe(2);
		});

		it('jslet.getArrayValue(1)', function() {
			expect(jslet.getArrayValue(1)).toBe(1);
		});

		it('jslet.getArrayValue("abc")', function() {
			expect(jslet.getArrayValue("abc")).toBe("abc");
		});

	});
	
	describe('jslet.getFunction(funcOrFuncName, context)', function() {
		it('jslet.getFunction()', function() {
			expect(jslet.getFunction()).toBe(null);
		});

		func = function() {
			
		}
		it('jslet.getFunction(func)', function() {
			expect(jslet.getFunction(func)).toBe(func);
		});

		it('jslet.getFunction(function() {})', function() {
			expect(jslet.getFunction("func")).toBe(func);
		});

		var obj = {func: function() {}};
		it('jslet.getFunction("func", obj)', function() {
			expect(jslet.getFunction("func", obj)).toBe(obj.func);
		});
	});
	
	describe('jslet.cutString(wholeStr, cuttingStr)', function() {
		it('jslet.cutString()', function() {
			expect(jslet.cutString()).toBe(undefined);
		});

		it('jslet.cutString("abc")', function() {
			expect(jslet.cutString("abc")).toBe("abc");
		});

		it('jslet.cutString("abcdab", "ab")', function() {
			expect(jslet.cutString("abcdab", "ab")).toBe("cd");
		});

	});
	
	describe('jslet.getYear(dateValue)', function() {
		it('jslet.getYear()', function() {
			expect(jslet.getYear()).toBe(0);
		});

		it('jslet.getYear("abc")', function() {
			expect(jslet.getYear("abc")).toBe(0);
		});

		it('jslet.getYear(new Date(2015, 1, 1))', function() {
			expect(jslet.getYear(new Date(2015, 1, 1))).toBe(2015);
		});
	});
	
	describe('jslet.getMonth(dateValue)', function() {
		it('jslet.getMonth()', function() {
			expect(jslet.getMonth()).toBe(0);
		});

		it('jslet.getMonth("abc")', function() {
			expect(jslet.getMonth("abc")).toBe(0);
		});

		it('jslet.getMonth(new Date(2015, 0, 1))', function() {
			expect(jslet.getMonth(new Date(2015, 0, 1))).toBe(1);
		});
	});
	
	describe('jslet.getYearMonth(dateValue)', function() {
		it('jslet.getYearMonth()', function() {
			expect(jslet.getYearMonth()).toBe(0);
		});

		it('jslet.getYearMonth("abc")', function() {
			expect(jslet.getYearMonth("abc")).toBe(0);
		});

		it('jslet.getYearMonth(new Date(2015, 0, 1))', function() {
			expect(jslet.getYearMonth(new Date(2015, 0, 1))).toBe(201501);
		});
	});
		
	describe('jslet.urlUtil.addParam(url, param)', function() {
		it('jslet.urlUtil.addParam()', function() {
			expect(jslet.urlUtil.addParam).toThrow();
		});

		it('jslet.urlUtil.addParam("www.jslet.com")', function() {
			expect(jslet.urlUtil.addParam("www.jslet.com")).toBe("www.jslet.com");
		});

		it('jslet.urlUtil.addParam("www.jslet.com#new", {x:1})', function() {
			expect(jslet.urlUtil.addParam("www.jslet.com#new", {x:1})).toBe("www.jslet.com?x=1#new");
		});

		it('jslet.urlUtil.addParam("www.jslet.com?x=1", {name:"tom"})', function() {
			expect(jslet.urlUtil.addParam("www.jslet.com?x=1", {name:"tom"})).toBe("www.jslet.com?x=1&name=tom");
		});

		it('jslet.urlUtil.addParam("www.jslet.com?x=1", {x:2, name:"tom"})', function() {
			expect(jslet.urlUtil.addParam("www.jslet.com?x=1", {x:2, name:"tom"})).toBe("www.jslet.com?x=2&name=tom");
		});

		it('jslet.urlUtil.addParam("www.jslet.com?x=1", {name:"tom&jerry"})', function() {
			expect(jslet.urlUtil.addParam("www.jslet.com?x=1", {name:"tom&jerry"})).toBe("www.jslet.com?x=1&name=tom%26jerry");
		});
	});
	
	describe('jslet.urlUtil.addHash(url, hash)', function() {
		it('jslet.urlUtil.addHash()', function() {
			expect(jslet.urlUtil.addHash).toThrow();
		});

		it('jslet.urlUtil.addHash("www.jslet.com")', function() {
			expect(jslet.urlUtil.addHash("www.jslet.com")).toBe("www.jslet.com");
		});

		it('jslet.urlUtil.addHash("www.jslet.com", "old")', function() {
			expect(jslet.urlUtil.addHash("www.jslet.com", "old")).toBe("www.jslet.com#old");
		});

		it('jslet.urlUtil.addHash("www.jslet.com?x=1", "old")', function() {
			expect(jslet.urlUtil.addHash("www.jslet.com?x=1", "old")).toBe("www.jslet.com?x=1#old");
		});
	});
	
	describe('jslet.urlUtil.getHash(url)', function() {
		it('jslet.urlUtil.getHash()', function() {
			expect(jslet.urlUtil.getHash).toThrow();
		});

		it('jslet.urlUtil.getHash("www.jslet.com")', function() {
			expect(jslet.urlUtil.getHash("www.jslet.com")).toBe(null);
		});

		it('jslet.urlUtil.getHash("www.jslet.com#old")', function() {
			expect(jslet.urlUtil.getHash("www.jslet.com#old")).toBe("old");
		});

	});
	
	describe('jslet.urlUtil.getParam(url)', function() {
		it('jslet.urlUtil.getParam()', function() {
			expect(jslet.urlUtil.getParam).toThrow();
		});

		it('jslet.urlUtil.getParam("www.jslet.com", "name")', function() {
			expect(jslet.urlUtil.getParam("www.jslet.com", "name")).toBe(null);
		});

		it('jslet.urlUtil.getParam("www.jslet.com?name=tom", "name")', function() {
			expect(jslet.urlUtil.getParam("www.jslet.com?name=tom", "name")).toBe("tom");
		});

	});
	
});