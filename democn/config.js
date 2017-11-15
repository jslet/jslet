var theme = null;

if(window.sessionStorage){
	theme = window.sessionStorage['jslet-theme'];
}
if(!theme) {
	theme = 'default';
}
requirejs.config({
    paths: {
        requirejs: 'requirejs',
		//jquery
        jquery: '../lib/jquery/jquery-2.2.3.min',
        //Jslet
        "jslet-locale": '../dist/locale/zh-cn/jslet-locale.min',
        "jslet-data": '../dist/jslet-data',
        "jslet-ui": '../dist/jslet-ui',
        datasetmetastore: 'common/datasetmetastore',
		//echart
		'echarts': '../lib/chart/echarts.simple.min',
        
        //xlxs
        'jszip': '../lib/xlsx/jszip',
        'xlsx': '../lib/xlsx/xlsx.min',
        'filesaver': '../lib/xlsx/FileSaver.min'
    },
    map: {
        '*': {
            'css': 'lib/requirejs/css.min',
        }
    },
    shim: {
    	'xlsx': ['filesaver', 'jszip-wrap'],

    	'jslet-data': ['jquery', 'xlsx'],
    	'jslet-ui': ['jslet-data', 'bootstrapcss', 'fontawesome', 'css!../dist/asset/jslet.css', 'css!../dist/asset/' + theme + '/jslet-theme.css']
    },
	waitSeconds: 0
});

define('jszip-wrap', ['jszip'], function(jszip) {
	window.JSZip = jszip;
});

define('bootstrapcss', ['css!../lib/bootstrap-3.2.0-dist/css/bootstrap.min.css', 
                        'css!../dist/asset/' + theme + '/bootstrap-theme.css']);

define('fontawesome', ['css!../lib/fontawesome/css/font-awesome.min.css']);

define('jslet', ['echarts', 'jslet-data', 'jslet-ui'], function(ec) {
	jslet.global.echarts = ec;
	require(['bootstrapcss', 'fontawesome', 'css!../dist/asset/jslet.css', 
			 'css!../dist/asset/' + theme + '/jslet-theme.css', 
			 'jslet']);
});

