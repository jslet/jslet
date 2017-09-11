Ext.data.JsonP.jslet_data_FieldValidator({"tagname":"class","name":"jslet.data.FieldValidator","autodetected":{},"files":[{"filename":"jslet.valuevalidator.js","href":"jslet.valuevalidator.html#jslet-data-FieldValidator"}],"private":true,"members":[{"name":"checkInputChar","tagname":"method","owner":"jslet.data.FieldValidator","id":"method-checkInputChar","meta":{}},{"name":"checkRequired","tagname":"method","owner":"jslet.data.FieldValidator","id":"method-checkRequired","meta":{}},{"name":"checkValue","tagname":"method","owner":"jslet.data.FieldValidator","id":"method-checkValue","meta":{}},{"name":"serverValidator","tagname":"method","owner":"jslet.data.FieldValidator","id":"method-serverValidator","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-jslet.data.FieldValidator","classIcon":"icon-class","superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/jslet.valuevalidator.html#jslet-data-FieldValidator' target='_blank'>jslet.valuevalidator.js</a></div></pre><div class='doc-contents'><div class='rounded-box private-box'><p><strong>NOTE:</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p></div><p>Field Validator.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-checkInputChar' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='jslet.data.FieldValidator'>jslet.data.FieldValidator</span><br/><a href='source/jslet.valuevalidator.html#jslet-data-FieldValidator-method-checkInputChar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/jslet.data.FieldValidator-method-checkInputChar' class='name expandable'>checkInputChar</a>( <span class='pre'>inputChar, True</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Check the specified character is valid or not. ...</div><div class='long'><p>Check the specified character is valid or not.\nUsually use this when user presses a key down.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>inputChar</span> : String<div class='sub-desc'><p>Single character</p>\n</div></li><li><span class='pre'>True</span> : Boolean<div class='sub-desc'><p>for passed, otherwise failed.</p>\n</div></li></ul></div></div></div><div id='method-checkRequired' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='jslet.data.FieldValidator'>jslet.data.FieldValidator</span><br/><a href='source/jslet.valuevalidator.html#jslet-data-FieldValidator-method-checkRequired' target='_blank' class='view-source'>view source</a></div><a href='#!/api/jslet.data.FieldValidator-method-checkRequired' class='name expandable'>checkRequired</a>( <span class='pre'>fldObj, value</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Check the required field's value is empty or not ...</div><div class='long'><p>Check the required field's value is empty or not</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fldObj</span> : <a href=\"#!/api/jslet.data.Field\" rel=\"jslet.data.Field\" class=\"docClass\">jslet.data.Field</a><div class='sub-desc'><p>Field Object</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>field value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>If input text is valid, return null, otherwise return error message.</p>\n</div></li></ul></div></div></div><div id='method-checkValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='jslet.data.FieldValidator'>jslet.data.FieldValidator</span><br/><a href='source/jslet.valuevalidator.html#jslet-data-FieldValidator-method-checkValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/jslet.data.FieldValidator-method-checkValue' class='name expandable'>checkValue</a>( <span class='pre'>fldObj, value</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Check the specified field value is valid or not\nIt will check required, range and custom validation ...</div><div class='long'><p>Check the specified field value is valid or not\nIt will check required, range and custom validation</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fldObj</span> : <a href=\"#!/api/jslet.data.Field\" rel=\"jslet.data.Field\" class=\"docClass\">jslet.data.Field</a><div class='sub-desc'><p>Field Object</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>field value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>If input text is valid, return null, otherwise return error message.</p>\n</div></li></ul></div></div></div><div id='method-serverValidator' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='jslet.data.FieldValidator'>jslet.data.FieldValidator</span><br/><a href='source/jslet.valuevalidator.html#jslet-data-FieldValidator-method-serverValidator' target='_blank' class='view-source'>view source</a></div><a href='#!/api/jslet.data.FieldValidator-method-serverValidator' class='name expandable'>serverValidator</a>( <span class='pre'>url, reqData</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>The common function to validate data at server side. ...</div><div class='long'><p>The common function to validate data at server side.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><ul>\n<li>Validating url to connect to server.</li>\n</ul>\n\n</div></li><li><span class='pre'>reqData</span> : Object<div class='sub-desc'><ul>\n<li>request data to post to server to validate.</li>\n</ul>\n\n</div></li></ul></div></div></div></div></div></div></div>","meta":{"private":true}});