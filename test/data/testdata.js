(function () {
    
    jslet.data.createEnumDataset("paymentTerm", {'01':'M/T','02':'T/T'});

    jslet.data.createEnumDataset("customer", {'01':'ABC','02':'Oil Group LTD','03':'Mail Group LTD'});
    //------------------------------------------------------------------------------------------------------
    var fldCfg = [{name: 'seqno', type: jslet.data.DataType.NUMBER, label: 'Sales ID'},
                    {name: 'product', type: jslet.data.DataType.STRING, label: 'Customer', length: 20},
                    {name: 'qty', type: jslet.data.DataType.NUMBER, label: 'Quantity', length: 11, defaultValue: 2},
                    {name: 'price', type: jslet.data.DataType.NUMBER, label: 'Price', length: 11, scale: 2},
                    {name: 'amount', type: jslet.data.DataType.NUMBER, label: 'Amount', length: 11, scale: 2, 
                    	formula: '[qty]*[price]', aggraded: true}
                   ];
    
    var dsOrderItem = new jslet.data.Dataset({name: 'orderItem', fields: fldCfg});
    
    fldCfg = [{name: 'orderid', type: jslet.data.DataType.STRING, label: 'Order ID'},
                {name: 'saledate', type: jslet.data.DataType.DATE, label: 'Sales Date', displayFormat: 'yyyy-MM-dd'},
                {name: 'customer', type: jslet.data.DataType.STRING, label: 'Customer', length: 20, lookup: {dataset: 'customer'}},
                {name: 'paymentterm', type: jslet.data.DataType.STRING, label: 'Payment Term', lookup: {dataset: 'paymentTerm'}},
                {name: 'items', type: jslet.data.DataType.DATASET, label: 'Order Items', detailDataset: 'orderItem'},
                {name: 'comment', type: jslet.data.DataType.STRING, length: 20, label: 'comment'}
               ];
    
    var dsOrder = new jslet.data.Dataset({name: 'order', fields: fldCfg, keyField: 'saleId'});
    
    //Add data into detail dataset
    var items1 = [{ "seqno": 1, "product": "P1", "qty": 2000, "price": 11.5 },
				{ "seqno": 2, "product": "P2", "qty": 1000, "price": 21.5 },
				{ "seqno": 3, "product": "P3", "qty": 3000, "price": 31.5 },
				{ "seqno": 4, "product": "P4", "qty": 5000, "price": 41.5 },
				{ "seqno": 5, "product": "P5", "qty": 8000, "price": 51.5}];

    var items2 = [{ "seqno": 1, "product": "M1", "qty": 1, "price": 10001 },
    				{ "seqno": 2, "product": "M2", "qty": 2, "price": 30000}];

    //Add data into master dataset
    var records = [{ "orderid": "001", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02", "items": items1 },
			{ "orderid": "002", "saledate": new Date(2001, 1, 1), "customer": "01", "paymentterm": "01", "items": items2 },
			{ "orderid": "003", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02"}];
    dsOrder.records(records);
    
})();

