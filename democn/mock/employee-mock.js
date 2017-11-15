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
    var employeeList = [
      {id: '1001', name: 'Tom', department: '00', gender: 'M', salutation: 'Sir', age: 48, birthday: new Date(1961, 1, 23), province: '01',
        city: '0110', position: '1', married: 1, university: '北京大学', photo: '1.jpg', salary: 30000, currency: 'USD', idcard: '440404198001011101'},

      {id: '1002', name: 'Marry', department: '03', gender: 'F', salutation: 'Madam', age: 26, birthday: new Date(1983, 8, 23), province: '02',
        city: '0201', position: '2', married: 0, university: '哈佛大学', photo: '2.jpg', salary: 20000, currency: 'USD', idcard: '440404198102011175'},

      {id: '1003', name: 'Jerry', department: '0201', gender: 'M', salutation: 'Mr', age: 32, birthday: new Date(1977, 5, 22), province: '13',
        city: '1305', position: '3', married: 1, university: '清华大学', photo: '3.jpg', salary: 3200, currency: 'RMB'},

      {id: '1004', name: 'John', department: '01', gender: 'M', salutation: 'Gentleman', age: 48, birthday: new Date(1961, 1, 6), province: '13',
        city: '1311', position: '0', married: 1, university: '北京大学', photo: '4.jpg', salary: 7800, currency: 'RMB'},

      {id: '1005', name: 'Monica', department: '04', gender: 'F', salutation: 'Miss', age: 38, birthday: new Date(1971, 8, 23), province: '06',
        city: '0605', position: '1', married: 0, university: '剑桥大学', photo: '5.jpg', salary: 5000, currency: 'RMB'},

        
      {id: '1006', name: 'Ted', department: '02', gender: 'U', salutation: 'Dr', age: 26, birthday: new Date(1983, 7, 12), province: '06',
        city: '0606', position: '3', married: 0, university: '剑桥大学', photo: '6.jpg', salary: 3000, currency: 'HKD'},

      {id: '1007', name: 'Jack', department: '02', gender: 'M', salutation: 'Gentleman', age: 26, birthday: new Date(1983, 9, 12), province: '06',
        city: '0606', position: '3', married: 0, university: '麻省理工大学', photo: '6.jpg', salary: 3000, currency: 'HKD'},

      {id: '1008', name: 'Mike', department: '02', gender: 'M', salutation: 'Mr', age: 26, birthday: new Date(1983, 8, 12), province: '06',
        city: '0606', position: '3', married: 0, university: '麻省理工大学', photo: '6.jpg', salary: 3000, currency: 'RMB'},

      {id: '1009', name: 'Jessica', department: '03', gender: 'F', salutation: 'Miss', age: 25, birthday: new Date(1984, 8, 23), province: '03',
        city: '0307', position: '3', married: 1, university: '哈佛大学', photo: '7.jpg', salary: 8000, currency: 'RMB'}
    ];
   
    var departmentList = [{deptid: '00', name: '行政部', address: '深圳'}, 
                {deptid: '01', name: '市场部', address: '北京'}, 
                {deptid: '0101', name: '成都分部', address: '成都', parentid: '01'}, 
                {deptid: '0102', name: '上海分部', address: '上海', parentid: '01'}, 
                {deptid: '02', name: '研发部', address: '深圳'}, 
                {deptid: '0201', name: '研发一部', address: '深圳', parentid: '02'}, 
                {deptid: '0202', name: '研发二部', address: '深圳', parentid: '02'}, 
                {deptid: '03', name: '质量部', address: '深圳'}, 
                {deptid: '04', name: '财务部', address: '深圳'}];
    
	var employeeService = {
		findAll : function() {
			return employeeList;
		},
		
		find: function(criteria) {
			if(!criteria) {
				return employeeList;
			}
			var gender = criteria.gender;
			var salary = criteria.salary;
			var salaryMin = null;
			var salaryMax = null;
			if(salary) {
				salaryMin = salary[0];
				salaryMax = salary[1];
			}
			var result = [], rec, sv;
			for(var i = 0, len = employeeList.length; i < len; i++) {
				rec = employeeList[i];
				if(gender && rec.gender !== gender) {
					continue;
				}
				if((salaryMin || salaryMin === 0) && rec.salary < salaryMin) {
					continue;
				}
				if((salaryMax || salaryMax === 0) && rec.salary > salaryMax) {
					continue;
				}
				result.push(rec);
			}
			return result;
		},
		
		save: function(employees) {
			var emp, state, id;
			for(var i = 0, len = employees.length; i < len; i++) {
				emp = employees[i];
				state = emp.rs;
				if(state[0] === 'd' || state[0] === 'u') {
					id = emp.id;
					for(var j = 0, len1 = employeeList.length; j < len1; j++) {
						if(employeeList[j].id == id) {
							if(state[0] === 'd') {
								employeeList.splice(j, 1);
							} else {
								employeeList.splice(j, 1, emp);
							}
							break;
						}
					}
				} else {
					employeeList.push(emp);
				}
			}
			return employees;
		}
	}

	//URL: /demo/employee/findall
	jQuery.mockjax({
		url : "/demo/employee/findall",
		contentType : "application/json",
		responseTime: 100,
		responseText : {main: employeeService.findAll()}
	});
	
	jQuery.mockjax({
		url : "/demo/employee/find",
		contentType : "application/json",
		responseTime: 100,
		response: function(request) {
			var criteria = JSON.parse(request.data);
			this.responseText = {main: employeeService.find(criteria.simpleCriteria)};
		}
	});
	
	jQuery.mockjax({
		url : "/demo/employee/findEmployeeAndDepartment",
		contentType : "application/json",
		responseTime: 100,
		responseText : {main: employeeService.findAll(), others: {department: departmentList}}
	});
	
	jQuery.mockjax({
		url : "/demo/employee/save",
		contentType : "application/json",
		dataType: 'json',
		responseTime: 100,
		response: function(request) {
			var data = JSON.parse(request.data);
			data.main = employeeService.save(data.main);
			this.responseText = data;
		}
	});

	jQuery.mockjax({
		url : "/demo/employee/queryerror",
		contentType : "application/json",
		dataType: 'json',
		responseTime: [100, 200],
		response: function(request) {
			var data = {
				errorCode: '1234',
				errorMessage: 'Invalid data!'
			}
			this.responseText = data;
		}
	});

	jQuery.mockjax({
		url : "/demo/employee/checkblacklist",
		contentType : "application/json",
		dataType: 'json',
		responseTime: 100,
		response: function(request) {
			var data = JSON.parse(request.data);
			var name = data.name;
			if(['a', 'b', 'c'].indexOf(name) >= 0) {
				this.responseText = '"不允许的名称！"';
			} else {
				this.responseText = 'null';
			}
		}
	});
	
});
