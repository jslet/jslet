describe('Jslet Data', function() {
	describe('Data Common', function() {
		var dsOrder = jslet.data.getDataset('order');
		it('jslet.data.getDataset("order")', function() {
			expect(dsOrder.name()).toBe('order');
		});

		it('jslet.data.getDataset(Not Exists)', function() {
			expect(jslet.data.getDataset('foo')).toBeNull();
		});

		it('jslet.data.getDataset(datasetObj)', function() {
			expect(jslet.data.getDataset(dsOrder)).toBe(dsOrder);
		});

		it('jslet.data.DatasetType', function() {
			expect(jslet.data.DatasetType).toBeDefined();
			expect(jslet.data.DatasetType.NORMAL).toBe(0);
			expect(jslet.data.DatasetType.LOOKUP).toBe(1);
			expect(jslet.data.DatasetType.DETAIL).toBe(2);
		});
		
		it('jslet.data.DataType', function() {
			expect(jslet.data.DataType).toBeDefined();
			expect(jslet.data.DataType.NUMBER).toBe('N');
			expect(jslet.data.DataType.STRING).toBe('S');
			expect(jslet.data.DataType.DATE).toBe('D');
			expect(jslet.data.DataType.BOOLEAN).toBe('B');
			expect(jslet.data.DataType.DATASET).toBe('V');
			expect(jslet.data.DataType.PROXY).toBe('P');
			expect(jslet.data.DataType.EXTEND).toBe('X');
			expect(jslet.data.DataType.ACTION).toBe('A');
			expect(jslet.data.DataType.EDITACTION).toBe('E');
		});
		
		it('jslet.data.FieldValueStyle', function() {
			expect(jslet.data.FieldValueStyle).toBeDefined();
			expect(jslet.data.FieldValueStyle.NORMAL).toBe(0);
			expect(jslet.data.FieldValueStyle.BETWEEN).toBe(1);
			expect(jslet.data.FieldValueStyle.MULTIPLE).toBe(2);
		});
		
		it('jslet.data.RecordRange', function() {
			expect(jslet.data.RecordRange).toBeDefined();
			expect(jslet.data.RecordRange.ALL).toBe(0);
			expect(jslet.data.RecordRange.SELECTED).toBe(1);
			expect(jslet.data.RecordRange.CURRENT).toBe(2);
			expect(jslet.data.RecordRange.CHANGED).toBe(3);
		});
		
		it('jslet.data.DatasetEvent', function() {
			expect(jslet.data.DatasetEvent).toBeDefined();
			expect(jslet.data.DatasetEvent.BEFORESCROLL).toBe('beforescroll');
			expect(jslet.data.DatasetEvent.AFTERSCROLL).toBe('afterscroll');
			
			expect(jslet.data.DatasetEvent.BEFOREINSERT).toBe('beforeinsert');
			expect(jslet.data.DatasetEvent.AFTERUPDATE).toBe('afterupdate');
			
			expect(jslet.data.DatasetEvent.BEFOREDELETE).toBe('beforedelete');
			expect(jslet.data.DatasetEvent.AFTERDELETE).toBe('afterdelete');
			
			expect(jslet.data.DatasetEvent.BEFORECONFIRM).toBe('beforeconfirm');
			expect(jslet.data.DatasetEvent.AFTERCONFIRM).toBe('afterconfirm');
			
			expect(jslet.data.DatasetEvent.BEFORECANCEL).toBe('beforecancel');
			expect(jslet.data.DatasetEvent.AFTERCANCEL).toBe('aftercancel');
			
			expect(jslet.data.DatasetEvent.BEFORESELECT).toBe('beforeselect');
			expect(jslet.data.DatasetEvent.AFTERSELECT).toBe('afterselect');
			
			expect(jslet.data.DatasetEvent.BEFORESELECTALL).toBe('beforeselectall');
			expect(jslet.data.DatasetEvent.AFTERSELECTALL).toBe('afterselectall');
		});
		
		it('jslet.data.DataSetStatus', function() {
			expect(jslet.data.DataSetStatus).toBeDefined();
			expect(jslet.data.DataSetStatus.BROWSE).toBe(0);
			expect(jslet.data.DataSetStatus.INSERT).toBe(1);
			expect(jslet.data.DataSetStatus.UPDATE).toBe(2);
			expect(jslet.data.DataSetStatus.DELETE).toBe(3);
		});
		
		it('jslet.data.RefreshEvent.updateRecordEvent', function() {
			var evt = jslet.data.RefreshEvent.updateRecordEvent('foo');
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.UPDATERECORD);
			expect(evt.fieldName).toBe('foo');
		});
		
		it('jslet.data.RefreshEvent.updateColumnEvent', function() {
			var evt = jslet.data.RefreshEvent.updateColumnEvent('foo');
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.UPDATECOLUMN);
			expect(evt.fieldName).toBe('foo');
		});
		
		it('jslet.data.RefreshEvent.updateAllEvent', function() {
			var evt = jslet.data.RefreshEvent.updateAllEvent('foo');
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.UPDATEALL);
		});
		
		it('jslet.data.RefreshEvent.changeMetaEvent', function() {
			var evt = jslet.data.RefreshEvent.changeMetaEvent('readOnly', 'foo');
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.CHANGEMETA);
			expect(evt.metaName).toBe('readOnly');
			expect(evt.fieldName).toBe('foo');
		});
		
		it('jslet.data.RefreshEvent.beforeScrollEvent', function() {
			var evt = jslet.data.RefreshEvent.beforeScrollEvent(100);
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.BEFORESCROLL);
			expect(evt.recno).toBe(100);
		});
		
		it('jslet.data.RefreshEvent.scrollEvent', function() {
			var evt = jslet.data.RefreshEvent.scrollEvent(100, 99);
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.SCROLL);
			expect(evt.recno).toBe(100);
			expect(evt.prevRecno).toBe(99);
		});
		
		it('jslet.data.RefreshEvent.insertEvent', function() {
			var evt = jslet.data.RefreshEvent.insertEvent(99, 100, true);
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.INSERT);
			expect(evt.recno).toBe(100);
			expect(evt.prevRecno).toBe(99);
			expect(evt.updateAll).toBe(true);
		});
		
		it('jslet.data.RefreshEvent.deleteEvent', function() {
			var evt = jslet.data.RefreshEvent.deleteEvent(100);
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.DELETE);
			expect(evt.recno).toBe(100);
		});
		
		it('jslet.data.RefreshEvent.selectRecordEvent', function() {
			var evt = jslet.data.RefreshEvent.selectRecordEvent(100, true);
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.SELECTRECORD);
			expect(evt.recno).toBe(100);
			expect(evt.selected).toBe(true);
		});
		
		it('jslet.data.RefreshEvent.selectAllEvent', function() {
			var evt = jslet.data.RefreshEvent.selectAllEvent(true);
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.SELECTALL);
			expect(evt.selected).toBe(true);
		});
		
		it('jslet.data.RefreshEvent.changePageEvent', function() {
			var evt = jslet.data.RefreshEvent.changePageEvent();
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.CHANGEPAGE);
		});
		
		it('jslet.data.RefreshEvent.errorEvent', function() {
			var evt = jslet.data.RefreshEvent.errorEvent('Error');
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.ERROR);
			expect(evt.message).toBe('Error');
		});
		
		it('jslet.data.RefreshEvent.lookupEvent', function() {
			var evt = jslet.data.RefreshEvent.lookupEvent('foo', true);
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.UPDATELOOKUP);
			expect(evt.fieldName).toBe('foo');
			expect(evt.isMetaChanged).toBe(true);
		});
		
		it('jslet.data.RefreshEvent.aggregatedEvent', function() {
			var evt = jslet.data.RefreshEvent.aggregatedEvent();
			expect(evt.eventType).toBe(jslet.data.RefreshEvent.AGGREGATED);
		});
		
	});

	describe('Data Edit Mask', function() {
		it('jslet.data.EditMask()', function() {
			expect(jslet.data.EditMask).toThrow();
		});
		it('new jslet.data.EditMask("AA0000")', function() {
			var mask = new jslet.data.EditMask('AA0000');
			expect(mask.mask).toBe('AA0000');
			expect(mask.keepChar).toBe(true);
			expect(mask.transform).toBe(false);
		});
		it('new jslet.data.EditMask("AA0000", false, true)', function() {
			var mask = new jslet.data.EditMask('AA0000', false, true);
			expect(mask.mask).toBe('AA0000');
			expect(mask.keepChar).toBe(false);
			expect(mask.transform).toBe(true);
		});
	});

	describe('jslet.data.record2Json', function() {
		it('jslet.data.record2Json()', function() {
			expect(jslet.data.record2Json()).toBe(undefined);
		});
		it('jslet.data.record2Json(null)', function() {
			expect(jslet.data.record2Json(null)).toBe('null');
		});
		it('jslet.data.record2Json([{x: 1, y: "a", z: true}])', function() {
			expect(jslet.data.record2Json([{x: 1, y: "a", z: true}])).toBe('[{"x":1,"y":"a","z":true}]');
		});
		it('jslet.data.record2Json([{x: 1, y: "a", z: true}], ["x", "y"])', function() {
			expect(jslet.data.record2Json([{x: 1, y: "a", z: true}], ["x", "y"])).toBe('[{"z":true}]');
		});
	});

	
});