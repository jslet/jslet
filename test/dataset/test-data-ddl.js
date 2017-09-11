describe('Jslet Dataset Object(DML)', function() {
    //Department
	function createDept() {
	    var deptFldCfg = [
          {name: 'deptid', type: 'N', length: 6, label: 'id'}, 
          {name: 'code', type: 'S', length: 15, label: 'Code'}, 
          {name: 'name', type: 'S', length: 15, label: 'Name'}, 
          {name: 'address', type: 'S', length: 20, label: 'Address'}, 
          {name: 'parentid', type: 'S', length: 6, label: 'parentId', visible:false}];

        var dsDept = new jslet.data.Dataset({name: 'department', fields: deptFldCfg, 
        	keyField: 'deptid',codeField: 'code', nameField: 'name', 
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
       return dsDept;
	}
	
	function destroyDept() {
		var dsDept = jslet.data.getDataset('department');
		if(dsDept) {
			dsDept.destroy();
		}
	}
	
	describe('Create Dataset/Destroy Dataset', function() {
		createDept();
		var dsDept = jslet.data.getDataset('department');
		it('Create Dataset', function() {
			expect(dsDept).not.toBe(null);
		});

		it('Destroy Dataset', function() {
			dsDept.destroy();
			expect(jslet.data.getDataset('department')).toBe(null);
		});
	});

	describe('Dataset property', function() {
		createDept();
		var dsDept = jslet.data.getDataset('department');
		it('Propety: name', function() {
			expect(dsDept.name()).toBe('department');
			dsDept.name('dept');
			expect(dsDept.name()).toBe('dept');
			expect(jslet.data.getDataset('dept')).not.toBe(null);
			dsDept.name('department');
		});

		it('Propety: description', function() {
			expect(dsDept.description()).toBe('department');
			dsDept.description('Department Object');
			expect(dsDept.description()).toBe('Department Object');
			dsDept.description(null);
		});

		it('Propety: keyField', function() {
			expect(dsDept.keyField()).toBe('deptid');
			dsDept.keyField('deptid1');
			expect(dsDept.keyField()).toBe('deptid1');
			dsDept.keyField('deptid');
		});

		it('Propety: codeField', function() {
			expect(dsDept.codeField()).toBe('code');
			dsDept.codeField('code1');
			expect(dsDept.codeField()).toBe('code1');
			dsDept.codeField(null);
			expect(dsDept.codeField()).toBe('deptid');
			dsDept.codeField('code');
		});

		it('Propety: nameField', function() {
			expect(dsDept.nameField()).toBe('name');
			dsDept.nameField('name1');
			expect(dsDept.nameField()).toBe('name1');
			dsDept.nameField(null);
			expect(dsDept.nameField()).toBe('code');
			
			dsDept.codeField(null);
			expect(dsDept.nameField()).toBe('deptid');
			dsDept.codeField('code');
			dsDept.nameField('name');
		});
		
		it('Propety: parentField', function() {
			expect(dsDept.parentField()).toBe('parentid');
			dsDept.parentField('parentid1');
			expect(dsDept.parentField()).toBe('parentid1');
			dsDept.parentField('parentid');
		});

		it('Propety: levelOrderField', function() {
			expect(dsDept.levelOrderField()).toBe(null);
			dsDept.levelOrderField('levelOrder');
			expect(dsDept.levelOrderField()).toBe('levelOrder');
			dsDept.levelOrderField(null);
		});

		it('Propety: selectField', function() {
			dsDept.selectField('checked');
			expect(dsDept.selectField()).toBe('checked');
			dsDept.selectField(null);
		});

		it('Propety: statusField', function() {
			dsDept.statusField('status');
			expect(dsDept.statusField()).toBe('status');
			dsDept.statusField(null);
		});

		it('Propety: description', function() {
			expect(dsDept.description()).toBe('department');
			dsDept.description('Department Object');
			expect(dsDept.description()).toBe('Department Object');
			dsDept.description(null);
		});

		it('Propety: recordClass', function() {
			expect(dsDept.recordClass()).toBe(null);
			dsDept.recordClass('com.foo.Department');
			expect(dsDept.recordClass()).toBe('com.foo.Department');
			dsDept.recordClass(null);
		});

		it('Propety: queryUrl', function() {
			expect(dsDept.queryUrl()).toBe(null);
			dsDept.queryUrl('/foo/department/query.do');
			expect(dsDept.queryUrl()).toBe('/foo/department/query.do');
			dsDept.queryUrl(null);
		});

		it('Propety: queryUrl', function() {
			expect(dsDept.queryUrl()).toBe(null);
			dsDept.queryUrl('/foo/department/query.do');
			expect(dsDept.queryUrl()).toBe('/foo/department/query.do');
			dsDept.queryUrl(null);
		});

		it('Propety: submitUrl', function() {
			expect(dsDept.submitUrl()).toBe(null);
			dsDept.submitUrl('/foo/department/save.do');
			expect(dsDept.submitUrl()).toBe('/foo/department/save.do');
			dsDept.submitUrl(null);
		});

		it('Propety: pageNo', function() {
			expect(dsDept.pageNo()).toBe(0);
			dsDept.pageNo(2);
			expect(dsDept.pageNo()).toBe(2);
			dsDept.pageNo(0);
		});

		it('Propety: pageSize', function() {
			expect(dsDept.pageSize()).toBe(500);
			dsDept.pageSize(1000);
			expect(dsDept.pageSize()).toBe(1000);
			dsDept.pageSize(500);
		});

		it('Propety: fixedIndexFields', function() {
			expect(dsDept.fixedIndexFields()).toBe(null);
			dsDept.fixedIndexFields('code');
			dsDept.first();
			var code = dsDept.getFieldValue('code');
			expect(code).toBe('00');

			dsDept.fixedIndexFields('code desc');
			dsDept.first();
			code = dsDept.getFieldValue('code');
			expect(code).toBe('04');
			dsDept.fixedIndexFields(null);
		});

		it('Propety: indexFields', function() {
			expect(dsDept.indexFields()).toBe(null);
			dsDept.indexFields('code');
			dsDept.first();
			var code = dsDept.getFieldValue('code');
			expect(code).toBe('00');

			dsDept.indexFields('code desc');
			dsDept.first();
			code = dsDept.getFieldValue('code');
			expect(code).toBe('04');
			dsDept.indexFields(null);
		});

		it('Propety: fixedFilter', function() {
			expect(dsDept.fixedFilter()).toBe(null);
			dsDept.fixedFilter('[code] == "00"');
			dsDept.filtered(true);
			expect(dsDept.recordCount()).toBe(1);
			var code = dsDept.getFieldValue('code');
			expect(code).toBe('00');

			dsDept.fixedFilter(null);
			dsDept.filtered(false);
		});
		
		it('Propety: filter', function() {
			expect(dsDept.filter()).toBe(null);
			dsDept.filter('like([code], "02%")');
			dsDept.filtered(true);
			expect(dsDept.recordCount()).toBe(3);

			dsDept.filter(null);
			dsDept.filtered(false);
		});
		
		it('Propety: recno', function() {
			dsDept.first();
			expect(dsDept.recno()).toBe(0);
			dsDept.recno(2);
			expect(dsDept.recno()).toBe(2);
		});
		
		it('Propety: recordCount', function() {
			expect(dsDept.recordCount()).toBe(15);
		});
		
		it('Propety: autoShowError', function() {
			expect(dsDept.autoShowError()).toBe(true);
			dsDept.autoShowError(false);
			expect(dsDept.autoShowError()).toBe(false);
			dsDept.autoShowError(true);
		});
		
		it('Propety: autoRefreshHostDataset', function() {
			expect(dsDept.autoRefreshHostDataset()).toBe(true);
			dsDept.autoRefreshHostDataset(false);
			expect(dsDept.autoRefreshHostDataset()).toBe(false);
			dsDept.autoRefreshHostDataset(true);
		});
		
		it('Propety: valueFollowEnabled', function() {
			expect(dsDept.valueFollowEnabled()).toBe(true);
			dsDept.valueFollowEnabled(false);
			expect(dsDept.valueFollowEnabled()).toBe(false);
			dsDept.valueFollowEnabled(true);
		});
	});
	
	describe('Dataset methods - cursor', function() {
		createDept();
		
		var dsDept = jslet.data.getDataset('department');
		
		it('Method: first()', function() {
			dsDept.first();
			expect(dsDept.recno()).toBe(0);
		});

		it('Method: next()', function() {
			dsDept.first();
			dsDept.next();
			expect(dsDept.recno()).toBe(1);
		});

		it('Method: prior()', function() {
			dsDept.recno(3);
			dsDept.prior();
			expect(dsDept.recno()).toBe(2);
		});

		it('Method: last()', function() {
			dsDept.last();
			expect(dsDept.recno()).toBe(dsDept.recordCount() - 1);
		});

		it('Method: isBof()', function() {
			dsDept.first();
			dsDept.prior();
			expect(dsDept.isBof()).toBe(true);
			dsDept.next();
			expect(dsDept.isBof()).toBe(false);
		});

		it('Method: isEof()', function() {
			dsDept.last();
			dsDept.next();
			expect(dsDept.isEof()).toBe(true);
			dsDept.prior();
			expect(dsDept.isEof()).toBe(false);
		});

		it('Method: recno()', function() {
			dsDept.recno(0);
			expect(dsDept.recno()).toBe(0);
			dsDept.recno(100);
			expect(dsDept.recno()).toBe(dsDept.recordCount() - 1);
			
			dsDept.filter('false');
			dsDept.filtered(true);
			expect(dsDept.recordCount()).toBe(0);
			expect(dsDept.recno()).toBe(-1);
			
			dsDept.appendRecord();
			expect(dsDept.recno()).toBe(0);
			dsDept.deleteRecord();

			dsDept.filter(null);
			dsDept.filtered(false);
			
		});

		it('Method: recnoSilence()', function() {
			dsDept.recnoSilence(0);
			expect(dsDept.recnoSilence()).toBe(0);
			dsDept.recnoSilence(100);
			expect(dsDept.recnoSilence()).toBe(dsDept.recordCount() - 1);
		});

		it('Method: moveToRecord()', function() {
			var records = dsDept.records();
			var moved = dsDept.moveToRecord(records[1]);
			expect(moved).toBe(true);
			expect(dsDept.recno()).toBe(1);
			
			dsDept.filter('false');
			dsDept.filtered(true);
			
			var moved = dsDept.moveToRecord(records[1]);
			expect(moved).toBe(false);
			
			dsDept.filter(null);
			dsDept.filtered(false);
		});

	});

	describe('Dataset methods - field', function() {
		createDept();
		
		var dsDept = jslet.data.getDataset('department');
		
		it('Method: getFields()', function() {
			var dsTemp = new jslet.data.Dataset({name: 'temp'});
			expect(dsTemp.getFields().length).toBe(0);
			expect(dsTemp.getNormalFields().length).toBe(0);
			expect(dsDept.getFields().length).toBe(5);
			dsTemp.destroy();
		});

		it('Method: getNormalFields()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			expect(dsTemp.getFields().length).toBe(2);
			expect(dsTemp.getFields()[1].name()).toBe('fld2');
			
			var fields = dsTemp.getNormalFields();
			expect(fields.length).toBe(3);
			expect(fields[2].name()).toBe('fld22');
			dsTemp.destroy();
		});

		it('Method: createField()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fields = dsTemp.getFields();
			expect(fields.length).toBe(2);
			
			dsTemp.createField({name: 'fld3', dataType: 'N'});
			expect(fields.length).toBe(3);
			
			expect(fields[2].name()).toBe('fld3');
			dsTemp.destroy();
		});

		it('Method: createFields()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fields = dsTemp.getFields();
			expect(fields.length).toBe(2);
			
			dsTemp.createFields([{name: 'fld3', dataType: 'N'}, {name: 'fld4', dataType: 'N'}]);
			expect(fields.length).toBe(4);
			
			expect(fields[2].name()).toBe('fld3');
			expect(fields[3].name()).toBe('fld4');
			dsTemp.destroy();
		});

		it('Method: removeField()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fields = dsTemp.getFields();
			expect(fields.length).toBe(2);
			
			dsTemp.removeField('fld1');
			expect(fields.length).toBe(1);
			
			expect(fields[0].name()).toBe('fld2');
			dsTemp.destroy();
		});

		it('Method: addFieldFromDataset()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fields = dsTemp.getFields();
			expect(fields.length).toBe(2);
			
			dsTemp.addFieldFromDataset(dsDept);
			expect(fields.length).toBe(7);
			
			expect(fields[6].name()).toBe('parentid');
			dsTemp.destroy();
		});

		it('Method: getEditableFields()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fields = dsTemp.getEditableFields();
			expect(fields.length).toBe(3);
			
			dsTemp.getFields()[0].readOnly(true);
			fields = dsTemp.getEditableFields();
			expect(fields.length).toBe(2);
			
			dsTemp.destroy();
		});

		it('Method: getEditableFields()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fields = dsTemp.getEditableFields();
			expect(fields.length).toBe(3);
			
			dsTemp.getFields()[0].readOnly(true);
			fields = dsTemp.getEditableFields();
			expect(fields.length).toBe(2);
			
			dsTemp.destroy();
		});

		it('Method: getFirstFocusField()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fldName = dsTemp.getFirstFocusField();
			expect(fldName).toBe('fld1');
			
			dsTemp.getFields()[0].readOnly(true);
			fldName = dsTemp.getFirstFocusField();
			expect(fldName).toBe('fld21');
			
			dsTemp.destroy();
		});

		it('Method: setVisibleFields()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fldObj = dsTemp.getField('fld1');
			expect(fldObj.visible()).toBe(true);
			
			dsTemp.setVisibleFields(['fld21', 'fld22']);
			expect(fldObj.visible()).toBe(false);
			expect(dsTemp.getField('fld2').visible()).toBe(false);
			
			dsTemp.destroy();
		});

		it('Method: moveField()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fldObj = dsTemp.getField('fld1');
			expect(dsTemp.getField('fld1').displayOrder()).toBe(1);
			expect(dsTemp.getField('fld2').displayOrder()).toBe(2);
			
			dsTemp.moveField('fld1', 'fld2');
			expect(dsTemp.getField('fld1').displayOrder()).toBe(2);
			expect(dsTemp.getField('fld2').displayOrder()).toBe(1);
			
			dsTemp.destroy();
		});

		it('Method: clearFields()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fldObj = dsTemp.getField('fld1');
			expect(dsTemp.getFields().length).toBe(2);
			
			dsTemp.clearFields();
			expect(dsTemp.getFields().length).toBe(0);
			
			dsTemp.destroy();
		});

		it('Method: getTopField()', function() {
			var fldCfg = [{name: 'fld1', dataType: 'S'}, {name: 'fld2', children: [{name: 'fld21', dataType: 'S'}, {name: 'fld22', dataType: 'S'}]}];
			var dsTemp = new jslet.data.Dataset({name: 'temp', fields: fldCfg});
			
			var fldObj = dsTemp.getTopField('fld1');
			expect(fldObj.name()).toBe('fld1');
			
			fldObj = dsTemp.getTopField('fld21');
			expect(fldObj.name()).toBe('fld2');
			
			dsTemp.destroy();
		});

		
	});
	
});