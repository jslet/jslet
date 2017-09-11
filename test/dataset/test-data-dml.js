describe('Jslet Dataset Object(DML)', function() {
    //Department
	function createDataset() {
//		if(jslet.data.getDataset('employee')) {
//			return;
//		}
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
          {name: 'age', dataType: 'N', length: 6, label: 'Age', dataRange: {min: 18, max: 60 }, defaultValue: 20},
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
	
	describe('Data Manipulation', function() {
		createDataset();
		
		var dsEmployee = jslet.data.getDataset('employee');
		
		it('/Insert and Default Value', function() {
			dsEmployee.appendRecord();
			expect(dsEmployee.recordCount()).toBe(1);
			dsEmployee.deleteRecord();
			expect(dsEmployee.recordCount()).toBe(0);
			dsEmployee.deleteRecord();
		});
		
		it('/DeleteRecord', function() {
			dsEmployee.appendRecord();
			dsEmployee.deleteRecord();
			expect(dsEmployee.recordCount()).toBe(0);
		});
		
		it('/Set|Get Field Value', function() {
			dsEmployee.appendRecord();
			var value = ['01', '02'];
			dsEmployee.setFieldValue('department', value);
			
			expect(dsEmployee.getFieldValue('department')).toBe(value);
			expect(dsEmployee.getFieldValue('department', 0)).toBe('01');
			expect(dsEmployee.getFieldValue('department', 1)).toBe('02');
			
			dsEmployee.deleteRecord();
		});

		it('/Set|Get Field Text', function() {
			dsEmployee.appendRecord();
			var value = '01,02';
			dsEmployee.setFieldText('department', value);
			
			expect(dsEmployee.getFieldText('department')).toBe('Marketing Dept.,Dev. Dept.');
			expect(dsEmployee.getFieldText('department', true)).toBe(value);
			expect(dsEmployee.getFieldValue('department', 0)).toBe('01');
			expect(dsEmployee.getFieldValue('department', 1)).toBe('02');
			
			dsEmployee.deleteRecord();
		});

		it('/Default Value', function() {
			dsEmployee.appendRecord();
			expect(dsEmployee.getFieldValue('age')).toBe(20);
			dsEmployee.deleteRecord();

			var fldObj = dsEmployee.getField('age');
			fldObj.defaultValue(null);
			fldObj.defaultExpr('20 + 40');
			dsEmployee.appendRecord();
			expect(dsEmployee.getFieldValue('age')).toBe(60);
			dsEmployee.deleteRecord();
		});
		
		
	});
	
});