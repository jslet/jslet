describe('Jslet Communicate with Server', function() {
	var dsOrder = jslet.data.getDataset('order');
	var dsOrderItem = jslet.data.getDataset('orderItem');
	var logger = dsOrder._changeLog;
	var transformer = dsOrder._dataTransformer;
	
	var initRecords = jslet.deepClone(dsOrder.records());

	describe('Change Log', function() {
		beforeEach(function() {
			dsOrder.records(jslet.deepClone(initRecords));
		});
		
		dsOrder.selected(true);
		it('Change Log: Insert/Update/Delete records', function() {
			dsOrder.setFieldValue('comment', 'changed');
			dsOrder.confirm();
			dsOrder.last();
			dsOrder.setFieldValue('comment', 'deleted');
			dsOrder.confirm();
			dsOrder.deleteRecord();
			dsOrder.appendRecord();
			dsOrder.setFieldValue('orderid', '004');
			dsOrder.setFieldValue('saledate', new Date());
			dsOrder.setFieldValue('customer', '02');
			dsOrder.setFieldValue('comment', 'inserted');
			dsOrder.confirm();
			
			var logs = logger.changedRecords();
			expect(logs.length).toBe(3);
			var rec = logs[0];
			expect(rec.orderid).toBe('001');
			expect(rec.comment).toBe('changed');
			expect(rec._jl_.status).toBe(2);
			
			var rec = logs[1];
			expect(rec.orderid).toBe('003');
			expect(rec.comment).toBe('deleted');
			expect(rec._jl_.status).toBe(3);
			
			var rec = logs[2];
			expect(rec.orderid).toBe('004');
			expect(rec.comment).toBe('inserted');
			expect(rec._jl_.status).toBe(1);
			
		});

		it('Change Log: Insert/Update/Delete detail records', function() {
			dsOrderItem.setFieldValue('qty', 2500);
			dsOrderItem.confirm();

			dsOrderItem.last();
			dsOrderItem.deleteRecord();
			
			dsOrderItem.appendRecord();
			dsOrderItem.setFieldValue('seqno', 6);
			dsOrderItem.setFieldValue('qty', 333);
			dsOrderItem.confirm();
			
			dsOrder.confirm();
			var logs = logger.changedRecords();
			expect(logs.length).toBe(1);
			
			var rec = logs[0];
			expect(rec.orderid).toBe('001');
			expect(rec._jl_.status).toBe(2);
			var dtlLogs = rec._jl_.detailLog['items'];
			expect(dtlLogs.length).toBe(3);
			expect(dtlLogs[0].seqno).toBe(1);
			expect(dtlLogs[1].seqno).toBe(5);
			expect(dtlLogs[2].seqno).toBe(6);
			
			dtlLogs = dsOrderItem._changeLog.changedRecords();
			expect(dtlLogs.length).toBe(3);
			expect(dtlLogs[0].seqno).toBe(1);
			expect(dtlLogs[1].seqno).toBe(5);
			expect(dtlLogs[2].seqno).toBe(6);
		});

	});

	describe('jslet.data.DataTransformer', function() {
		beforeEach(function() {
			dsOrder.records(jslet.deepClone(initRecords));
		});
		
		dsOrder.selected(true);
		it('Submitting: Insert/Update/Delete records', function() {
			dsOrder.setFieldValue('comment', 'changed');
			dsOrder.confirm();
			dsOrder.last();
			dsOrder.setFieldValue('comment', 'deleted');
			dsOrder.confirm();
			dsOrder.deleteRecord();
			dsOrder.appendRecord();
			dsOrder.setFieldValue('orderid', '004');
			dsOrder.setFieldValue('saledate', new Date());
			dsOrder.setFieldValue('customer', '02');
			dsOrder.setFieldValue('comment', 'inserted');
			dsOrder.confirm();
			
			//Submit all/changed records
			var records = transformer.getSubmittingChanged();
			expect(records.length).toBe(3);
			expect(records[0].rs.startsWith('u')).toBe(true);
			expect(records[1].rs.startsWith('d')).toBe(true);
			expect(records[2].rs.startsWith('i')).toBe(true);
			expect(records[0].items.length).toBe(5);

			//Submit current record
			dsOrder.first();
			var records = transformer.getSubmittingChanged(jslet.data.RecordRange.CURRENT);
			expect(records.length).toBe(1);
			expect(records[0].rs.startsWith('u')).toBe(true);

			//Submit selected records
			dsOrder.selectAll(true);
			var records = transformer.getSubmittingChanged(jslet.data.RecordRange.SELECTED);
			expect(records.length).toBe(2);
			expect(records[0].rs.startsWith('u')).toBe(true);
			expect(records[1].rs.startsWith('i')).toBe(true);
			
		});

		it('Submitting details: Insert/Update/Delete records', function() {
			dsOrder.setFieldValue('comment', 'changed');
			dsOrderItem.setFieldValue('qty', 555);
			dsOrderItem.confirm();
			dsOrderItem.last();
			dsOrderItem.deleteRecord();
			dsOrder.confirm();
			
			//Submit all/changed records
			var records = transformer.getSubmittingChanged(jslet.data.RecordRange.CHANGED, jslet.data.RecordRange.CHANGED);
			expect(records.length).toBe(1);
			expect(records[0].rs.startsWith('u')).toBe(true);
			expect(records[0].items.length).toBe(2);
			expect(records[0].items[0].qty).toBe(555);
			expect(records[0].items[1].rs.startsWith('d')).toBe(true);
			
			//Submit all/changed records
			var records = transformer.getSubmittingChanged(jslet.data.RecordRange.CHANGED);
			expect(records.length).toBe(1);
			expect(records[0].rs.startsWith('u')).toBe(true);
			expect(records[0].items.length).toBe(5);
			expect(records[0].items[0].qty).toBe(555);
			expect(records[0].items[4].rs.startsWith('d')).toBe(true);
		});
		
		it('Submitting selected records', function() {
			dsOrder.selectAll(false);
			var records = transformer.getSubmittingSelected(jslet.data.RecordRange.SELECTED);
			expect(records).toBeNull();
			
			dsOrder.selectAll(true);
			dsOrderItem.select(true);
			records = transformer.getSubmittingSelected(jslet.data.RecordRange.SELECTED);
			expect(records.length).toBe(3);
			expect(records[0].items.length).toBe(5);
			expect(records[0].items[0].rs.startsWith('s')).toBe(true);
			expect(records[0].items[1].rs.startsWith('s')).toBe(false);
			
			dsOrderItem.selectAll(false);
			records = transformer.getSubmittingSelected(jslet.data.RecordRange.SELECTED, jslet.data.RecordRange.SELECTED);
			expect(records.length).toBe(3);
			expect(records[0].items).toBeUndefined();
			
			dsOrderItem.selectAll(true);
			records = transformer.getSubmittingSelected(jslet.data.RecordRange.SELECTED, jslet.data.RecordRange.SELECTED);
			expect(records[0].items.length).toBe(5);
			
			dsOrderItem.selectAll(false);
			dsOrderItem.select(true);
			records = transformer.getSubmittingSelected(jslet.data.RecordRange.SELECTED, jslet.data.RecordRange.SELECTED);
			expect(records[0].items.length).toBe(1);
			
		});

	});
	
});