describe('Jslet Dataset Field', function() {
    //Department
	function createDataset() {
	    var deptFldCfg = [
          {name: 'code', type: 'S', length: 15, label: 'Code'}, 
          {name: 'name', type: 'S', length: 15, label: 'Name'}, 
          {name: 'address', type: 'S', length: 20, label: 'Address'}, 
          {name: 'parentid', type: 'S', length: 6, label: 'parentId', visible:false}];

        var dsDept = new jslet.data.Dataset({name: 'department', fields: deptFldCfg, 
        	keyField: 'code',codeField: 'code', nameField: 'name', 
        	parentField: 'parentid', autoRefreshHostDataset: true});
        var data = [{code: '00', name: 'Admin Dept.', address: 'Shenzhen'}, 
                    {code: '01', name: 'Marketing Dept.', address: 'Beijing'}, 
                    {code: '0101', name: 'Chengdu Branch.', address: 'Chengdu', parentid: '01'}, 
                    {code: '0102', name: 'Shanghai Branch ', address: 'Shanghai', parentid: '01'}, 
                    {code: '02', name: 'Dev. Dept.', address: 'Shenzhen'}, 
                    {code: '0201', name: 'Dev. Branch 1', address: 'Shenzhen', parentid: '02'}, 
                    {code: '0202', name: 'Dev. Branch 2', address: 'Shenzhen', parentid: '02'}, 
                    {code: '03', name: 'QA', address: 'Shenzhen'}, 
                    {code: '0301', name: 'QA1', parentid: '03', address: 'Shenzhen'}, 
                    {code: '0302', name: 'QA2', parentid: '03', address: 'Shenzhen'}, 
                    {code: '0303', name: 'QA3', parentid: '03', address: 'Shenzhen'}, 
                    {code: '0304', name: 'QA4', parentid: '03', address: 'Shenzhen'}, 
                    {code: '0305', name: 'QA5', parentid: '03', address: 'Shenzhen'}, 
                    {code: '0306', name: 'QA6', parentid: '03', address: 'Shenzhen'}, 
                    {code: '04', name: 'FA Dept.', address: 'Shenzhen'}
                    ];
       dsDept.records(data);
       
       //Employee
       var fldCfg = [
          {name: 'id', dataType: 'N', length: 11, label: 'Id', required: true}, 
          {name: 'name', dataType: 'S', length: 15, label: 'Name', required: true, unique: true}, 
          {name: 'department', dataType: 'S', length: 10, label: 'Department', lookup: {dataset: 'department'}, 
        	  valueCountRange: {min: 1, max: 3}, dataRange: {min: '01', max: '03'}, valueFollow: true,
        	  valueStyle: jslet.data.FieldValueStyle.MULTIPLE}, 
          {name: 'age', dataType: 'N', length: 6, label: 'Age', dataRange: {min: 18, max: 60 }},
          {name: 'agebtw', dataType: 'N', length: 6, label: 'Age', dataRange: {min: 18, max: 60 },
    		  valueStyle: jslet.data.FieldValueStyle.BETWEEN},
          {name: 'salary', dataType: 'N', length: 16, scale: 2, label: 'Salary', customValidator: function(fldObj, value, serverValidator) {
        	  if(value < 1000) {
        		  return 'Salary must be great than 1000';
        	  }
          }}
       ];

       new jslet.data.Dataset({name: 'employee', fields: fldCfg, keyField: 'id'});
       
       return dsDept;
	}
	
	describe('Field Creation', function() {
		createDataset();
		
		var dsEmployee = jslet.data.getDataset('employee');
		var fldObj = dsEmployee.createField({name: 'tmp'});
		
		it('/Property: dataset', function() {
			expect(fldObj.dataset().name()).toBe('employee');
		});
		
		it('/Property: displayOrder', function() {
			expect(fldObj.displayOrder()).toBe(dsEmployee.getFields().length);
			fldObj.displayOrder(8);
			expect(fldObj.displayOrder()).toBe(8);
		});
		
		it('/Property: displayOrder', function() {
			expect(fldObj.tabIndex()).toBe(null);
			fldObj.tabIndex(1);
			expect(fldObj.tabIndex()).toBe(1);
		});
		
		it('/Property: shortName', function() {
			expect(fldObj.shortName()).toBe(null);
			fldObj.shortName('a');
			expect(fldObj.shortName()).toBe('a');
		});
		
		it('/Property: length', function() {
			expect(fldObj.length()).toBe(10);
			fldObj.length(15);
			expect(fldObj.length()).toBe(15);
			fldObj.length(10);
		});
		
		it('/Property: scale', function() {
			expect(fldObj.scale()).toBe(0);
			fldObj.scale(2);
			expect(fldObj.scale()).toBe(2);
		});
		
		it('/Property: unique', function() {
			expect(fldObj.unique()).toBe(false);
			fldObj.unique(true);
			expect(fldObj.unique()).toBe(true);

			expect(dsEmployee.getField('name').unique()).toBe(true);
		});
		
		it('/Property: defaultExpr', function() {
			expect(fldObj.defaultExpr()).toBe(null);
			fldObj.defaultExpr('"a" + "b"');
			expect(fldObj.defaultExpr()).toBe('"a" + "b"');
		});
		
		it('/Property: defaultValue', function() {
			expect(fldObj.defaultValue()).toBe(null);
			fldObj.defaultValue('ccc');
			expect(fldObj.defaultValue()).toBe('ccc');
		});
		
		it('/Property: label', function() {
			expect(fldObj.label()).toBe('tmp');
			fldObj.label('Test');
			expect(fldObj.label()).toBe('Test');
			fldObj.label(null);
		});
		
		it('/Property: displayLabel', function() {
			expect(fldObj.displayLabel()).toBe('tmp');
			fldObj.displayLabel('Temp');
			expect(fldObj.displayLabel()).toBe('Temp');
		});
		
		it('/Property: tip', function() {
			expect(fldObj.tip()).toBe(null);
			fldObj.tip('Tips');
			expect(fldObj.tip()).toBe('Tips');
		});
		
		it('/Property: displayWidth', function() {
			expect(fldObj.displayWidth()).toBe(10);
			fldObj.displayWidth(20);
			expect(fldObj.displayWidth()).toBe(20);
		});
		
		it('/Property: editMask', function() {
			expect(fldObj.editMask()).toBe(null);
			fldObj.editMask('AA-0000');
			expect(fldObj.editMask().mask).toBe('AA-0000');
		});
		
		it('/Property: displayFormat', function() {
			expect(fldObj.displayFormat()).toBe(null);
			fldObj.displayFormat('yyyy-MM-dd');
			expect(fldObj.displayFormat()).toBe('yyyy-MM-dd');
		});
		
		it('/Property: readOnly', function() {
			expect(fldObj.readOnly()).toBe(false);
			fldObj.readOnly(true);

			expect(fldObj.readOnly()).toBe(true);
			fldObj.readOnly(false);
		});
		
		it('/Property: formula', function() {
			expect(fldObj.formula()).toBe(null);
			fldObj.formula('[name] + "b"');
			expect(fldObj.formula()).toBe('[name] + "b"');
			fldObj.formula(null);
		});
		
		it('/Property: visible', function() {
			expect(fldObj.visible()).toBe(true);
			fldObj.visible(false);
			expect(fldObj.visible()).toBe(false);
		});
		
		it('/Property: disabled', function() {
			expect(fldObj.disabled()).toBe(false);
			fldObj.disabled(true);
			expect(fldObj.disabled()).toBe(true);
			fldObj.disabled(false);
		});
		
		it('/Property: unitConverted', function() {
			expect(fldObj.unitConverted()).toBe(false);
			fldObj.unitConverted(true);
			//Only number field can be true
			expect(fldObj.unitConverted()).toBe(false);
			fldObj.unitConverted(false);
		});
		
		it('/Property: lookup', function() {
			expect(fldObj.lookup()).toBe(null);
			fldObj.lookup({dataset: 'department'});
			expect(fldObj.lookup().dataset().name()).toBe('department');
			fldObj.lookup(null);
		});
		
		it('/Property: editControl', function() {
			expect(fldObj.editControl().type).toBe('dbtext');
			fldObj.editControl('DBSelect');
			expect(fldObj.editControl().type).toBe('DBSelect');
		});
		
		it('/Property: displayControl', function() {
			expect(fldObj.displayControl()).toBe(null);
			fldObj.displayControl('DBText');
			expect(fldObj.displayControl().type).toBe('DBText');
		});
		
		it('/Property: detailDataset', function() {
			expect(fldObj.detailDataset()).toBe(null);
			fldObj.detailDataset('department');
			expect(fldObj.detailDataset().name()).toBe('department');
			fldObj.detailDataset(null);
		});
		
		it('/Property: valueStyle', function() {
			expect(fldObj.valueStyle()).toBe(jslet.data.FieldValueStyle.NORMAL);
			fldObj.valueStyle(jslet.data.FieldValueStyle.BETWEEN);
			expect(fldObj.valueStyle()).toBe(jslet.data.FieldValueStyle.BETWEEN);
			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
			expect(fldObj.valueStyle()).toBe(jslet.data.FieldValueStyle.MULTIPLE);
			fldObj.valueStyle(jslet.data.FieldValueStyle.NORMAL);
		});
		
		it('/Property: valueCountRange', function() {
			expect(fldObj.valueCountRange()).toBe(null);
			fldObj.valueCountRange({min: 1, max: 3});
			expect(fldObj.valueCountRange().min).toBe(1);
			expect(fldObj.valueCountRange().max).toBe(3);
		});
		
		it('/Property: required', function() {
			expect(fldObj.required()).toBe(false);
			fldObj.required(true);
			expect(fldObj.required()).toBe(true);
		});
		
		it('/Property: nullText', function() {
			expect(fldObj.nullText()).toBe(jsletlocale.Dataset.nullText);
			fldObj.nullText('NULL');
			expect(fldObj.nullText()).toBe('NULL');
		});
		
		it('/Property: dataRange', function() {
			expect(fldObj.dataRange()).toBe(null);
			fldObj.dataRange({min: 'a', max: 'f'});
			expect(fldObj.dataRange().min).toBe('a');
			expect(fldObj.dataRange().max).toBe('f');
		});
		
		it('/Property: regularExpr', function() {
			expect(fldObj.regularExpr()).toBe(null);
			fldObj.regularExpr({expr: 'aaa', message: 'Disallowed!'});
			expect(fldObj.regularExpr().expr).toBe('aaa');
			expect(fldObj.regularExpr().message).toBe('Disallowed!');
		});
		
		it('/Property: antiXss', function() {
			expect(fldObj.antiXss()).toBe(true);
			fldObj.antiXss(false);
			expect(fldObj.antiXss()).toBe(false);
		});
		
		it('/Property: customValueAccessor', function() {
			expect(fldObj.customValueAccessor()).toBe(null);
		});
		
		it('/Property: customValueConverter', function() {
			expect(fldObj.customValueConverter()).toBe(null);
		});
		
		it('/Property: customValidator', function() {
			expect(fldObj.customValidator()).toBe(null);
		});
		
		it('/Property: validChars', function() {
			expect(fldObj.validChars()).toBe(null);
			fldObj.validChars('abcdef');
			expect(fldObj.validChars()).toBe('abcdef');
		});
		
		it('/Property: parent', function() {
			expect(fldObj.parent()).toBe(null);
		});
		
		it('/Property: children', function() {
			expect(fldObj.children()).toBe(null);
		});
		
		it('/Property: trueValue', function() {
			expect(fldObj.trueValue()).toBe(true);
			fldObj.trueValue(1);
			expect(fldObj.trueValue()).toBe(1);
		});
		
		it('/Property: falseValue', function() {
			expect(fldObj.falseValue()).toBe(false);
			fldObj.falseValue(0);
			expect(fldObj.falseValue()).toBe(0);
		});
		
		it('/Property: trueText', function() {
			expect(fldObj.trueText()).toBe(jsletlocale.Dataset.trueText);
			fldObj.trueText('OK');
			expect(fldObj.trueText()).toBe('OK');
		});
		
		it('/Property: falseText', function() {
			expect(fldObj.falseText()).toBe(jsletlocale.Dataset.falseText);
			fldObj.falseText('NOT-OK');
			expect(fldObj.falseText()).toBe('NOT-OK');
		});
		
		it('/Property: mergeSame', function() {
			expect(fldObj.mergeSame()).toBe(false);
			fldObj.mergeSame(true);
			expect(fldObj.mergeSame()).toBe(true);
		});
		
		it('/Property: mergeSameBy', function() {
			expect(fldObj.mergeSameBy()).toBe(null);
			fldObj.mergeSameBy('name');
			expect(fldObj.mergeSameBy()).toBe('name');
		});
		
		it('/Property: fixedValue', function() {
			expect(fldObj.fixedValue()).toBe(null);
			fldObj.fixedValue('<a>Audit</a>');
			expect(fldObj.fixedValue()).toBe('<a>Audit</a>');
		});
		
		it('/Property: valueFollow', function() {
			expect(fldObj.valueFollow()).toBe(false);
			fldObj.valueFollow(true);
			expect(fldObj.valueFollow()).toBe(true);
			
			expect(dsEmployee.getField('department').valueFollow()).toBe(true);
		});
		
		it('/Property: trimBlank', function() {
			expect(fldObj.trimBlank()).toBe(true);
			fldObj.trimBlank(false);
			expect(fldObj.trimBlank()).toBe(false);
		});
		
		it('/Property: focused', function() {
			expect(fldObj.focused()).toBe(false);
			fldObj.focused(true);
			expect(fldObj.focused()).toBe(true);
		});
		
		it('/Property: aggregated', function() {
			expect(fldObj.aggregated()).toBe(false);
			fldObj.aggregated(true);
			expect(fldObj.aggregated()).toBe(true);
		});
		
		it('/Property: aggregatedBy', function() {
			expect(fldObj.aggregatedBy()).toBe(null);
			fldObj.aggregatedBy('name');
			expect(fldObj.aggregatedBy()).toBe('name');
		});
		
		it('/Property: extendHostName', function() {
			expect(fldObj.extendHostName()).toBe(null);
		});
		
		
		
	});
	
});