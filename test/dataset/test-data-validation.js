describe('Jslet Dataset Object', function() {
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
        	  valueCountRange: {min: 1, max: 3}, dataRange: {min: '01', max: '03'},
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
	
	describe('Data validation', function() {
		createDataset();
		
		var dsEmployee = jslet.data.getDataset('employee');
		
		it('/Required', function() {
			dsEmployee.appendRecord();
			dsEmployee.setFieldText('id', '0');
			expect(dsEmployee.existFieldError('id')).toBe(false);
			dsEmployee.setFieldText('id', null);
			expect(dsEmployee.existFieldError('id')).toBe(true);
			dsEmployee.deleteRecord();
			
		});
		
		it('/Unique', function() {
			dsEmployee.appendRecord();
			dsEmployee.setFieldText('name', 'tom');
			expect(dsEmployee.existFieldError('name')).toBe(false);
			dsEmployee.confirm();
			dsEmployee.appendRecord();
			dsEmployee.setFieldText('name', 'tom');
			expect(dsEmployee.existFieldError('name')).toBe(true);
			dsEmployee.confirm();
			dsEmployee.deleteRecord();
			dsEmployee.deleteRecord();
		});
		
		it('/Value Count Range', function() {
			dsEmployee.appendRecord();
			dsEmployee.setFieldValue('department', ['01']);
			expect(dsEmployee.existFieldError('department')).toBe(false);
			dsEmployee.setFieldValue('department', []);
			expect(dsEmployee.existFieldError('department')).toBe(true);
			dsEmployee.setFieldValue('department', ['01', '0101', '02']);
			expect(dsEmployee.existFieldError('department')).toBe(false);

			dsEmployee.setFieldValue('department', ['01', '0101', '02', '0201']);
			expect(dsEmployee.existFieldError('department')).toBe(true);
//			console.log(dsEmployee.getFieldError('department'));
			dsEmployee.deleteRecord();
		});

		it('/Value Conversion', function() {
			dsEmployee.appendRecord();
			dsEmployee.setFieldText('department', '05');
			expect(dsEmployee.existFieldError('department')).toBe(true);
			dsEmployee.setFieldValue('department', ['04']);
			expect(dsEmployee.existFieldError('department')).toBe(true);
//			console.log(dsEmployee.getFieldError('department'));
			dsEmployee.deleteRecord();
		});
		
		it('/Data Range', function() {
			dsEmployee.appendRecord();
			dsEmployee.setFieldValue('age', 18);
			expect(dsEmployee.existFieldError('age')).toBe(false);
			dsEmployee.setFieldValue('age', 60);
			expect(dsEmployee.existFieldError('age')).toBe(false);

			dsEmployee.setFieldValue('age', 17);
			expect(dsEmployee.existFieldError('age')).toBe(true);
			dsEmployee.setFieldValue('age', 61);
			expect(dsEmployee.existFieldError('age')).toBe(true);

//			console.log(dsEmployee.getFieldError('age'));
			dsEmployee.deleteRecord();
		});
		
		it('/Between Validation', function() {
			dsEmployee.appendRecord();
			dsEmployee.setFieldValue('agebtw', [18, 40]);
			expect(dsEmployee.existFieldError('agebtw')).toBe(false);

			dsEmployee.setFieldValue('agebtw', [17]);
			expect(dsEmployee.existFieldError('agebtw')).toBe(true);

			dsEmployee.setFieldValue('agebtw', [48, 40]);
			expect(dsEmployee.existFieldError('agebtw')).toBe(true);

//			console.log(dsEmployee.getFieldError('agebtw'));
			dsEmployee.deleteRecord();
		});
		
		it('/Custom Validation', function() {
			dsEmployee.appendRecord();
			dsEmployee.setFieldValue('salary', 0);
			expect(dsEmployee.existFieldError('salary')).toBe(true);
			dsEmployee.setFieldValue('salary', 999.99);
			expect(dsEmployee.existFieldError('salary')).toBe(true);
			dsEmployee.setFieldValue('salary', 1000);
			expect(dsEmployee.existFieldError('salary')).toBe(false);

//			console.log(dsEmployee.getFieldError('salary'));
			dsEmployee.deleteRecord();
		});
		
		it('/Record Validation', function() {
			dsEmployee.appendRecord();
			dsEmployee.confirm();
			expect(dsEmployee.existRecordError()).toBe(true);
			dsEmployee.setFieldText('id', '0');
			dsEmployee.setFieldText('name', 'tom');
			expect(dsEmployee.existRecordError()).toBe(false);
			
//			console.log(dsEmployee.getRecordErrorInfo(dsEmployee.recno()));
			dsEmployee.deleteRecord();
		});
		
		it('/VadateDataset', function() {
			var records = [{id: 0, name: 'tom', salary: 900}, {id: 1, name: 'tom', department: '00'}];
			
			dsEmployee.records(records);
			expect(dsEmployee.existRecordError()).toBe(false);
			dsEmployee.validateDataset();
			expect(dsEmployee.existRecordError()).toBe(true);
//			console.log(dsEmployee.getRecordErrorInfo(dsEmployee.recno()));
			dsEmployee.next();
			expect(dsEmployee.existRecordError()).toBe(true);
//			console.log(dsEmployee.getRecordErrorInfo(dsEmployee.recno()));

			dsEmployee.records(null);
		});
		
	});
	
});