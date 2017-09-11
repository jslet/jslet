(function (factory) {
    if (typeof define === 'function') {
    	if(define.amd) {
	        define(['jquery', 'lib/mock/jquery.mockjax.min'], factory);
	    } else {
	    	define(function(require, exports, module) {
	    		module.exports = factory();
	    	});
	    }
    } else {
    	factory();
    }
})(function () {
	
	//导出mock
	var exportSchemas = [];

	var exportSchemaService = {
		deleteSchema: function(schemaName) {
			var schema;
			for(var i = 0, len = exportSchemas.length; i < len; i++) {
				schema = exportSchemas[i];
				if(schema.schema == schemaName) {
					exportSchemas.splice(i, 1);
					return;
				}
			}
		},
		
		saveSchema: function(schema) {
			this.deleteSchema(schema.schema);
			exportSchemas.push(schema);
		}
	
	};
	
	jQuery.mockjax({
		url : "/demo/exportschema/query",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			this.responseText = exportSchemas;
		},
		logging: false
	});

	jQuery.mockjax({
		url : "/demo/exportschema/save",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			exportSchemaService.saveSchema(request.data);
		},
		logging: false
	});

	jQuery.mockjax({
		url : "/demo/exportschema/delete",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			exportSchemaService.deleteSchema(request.data);
		},
		logging: false
	});

	//导入Mock
	var importSchemas = [];

	var importSchemaService = {
		deleteSchema: function(schemaName) {
			var schema;
			for(var i = 0, len = importSchemas.length; i < len; i++) {
				schema = importSchemas[i];
				if(schema.schema == schemaName) {
					importSchemas.splice(i, 1);
					return;
				}
			}
		},
		
		saveSchema: function(schema) {
			this.deleteSchema(schema.schema);
			importSchemas.push(schema);
		}
	
	};
	
	jQuery.mockjax({
		url : "/demo/importschema/query",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			this.responseText = importSchemas;
		},
		logging: false
	});

	jQuery.mockjax({
		url : "/demo/importschema/save",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			importSchemaService.saveSchema(request.data);
		},
		logging: false
	});

	jQuery.mockjax({
		url : "/demo/importschema/delete",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [50, 100],
		response: function(request) {
			importSchemaService.deleteSchema(request.data);
		},
		logging: false
	});

	
});
