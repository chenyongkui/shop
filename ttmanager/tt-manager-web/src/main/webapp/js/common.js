/**
 * 封装常用的js方法
 */
/** 打开一个最大化的窗口并关闭当前窗口 */
function openMaxWindow(url) {
	// 注意IE7以后的浏览器需要把站点设置为可信任才能隐藏地址栏
	windowHandle = window
			.open(
					url,
					'',
					'resizable=yes,menubar=no,status=yes,toolbar=no,scrollbars=yes,location=no,directories=0');
	windowHandle.moveTo(0, 0);
	windowHandle.resizeTo(screen.availWidth, screen.availHeight);

	window.opener = null;
	window.open('', '_self');
	self.close();
}
function isUndefined(val){
	return typeof(val)=="undefined";
}

/** 判断字符串是否为空 */
function isEmpty(str) {
	if (typeof str === "boolean") {
		return false;
	}
	if (typeof str === "number") {
		return false;
	}
	if (str == "null" || !str) {
		return true;
	}
	if (str.match(/^\s*$/) || str.length == 0) {
		return true;
	}
	return false;
}

function isNotEmpty(str) {
	if (typeof str === "boolean") {
		return true;
	}
	if (typeof str === "number") {
		return true;
	}
	if (!str || str == 'null') {
		return false;
	}
	if (str.match(/^\s*$/) || str.length == 0) {
		return false;
	}
	return true;
}
function checkIp(ip){
   var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+):(\d+)$/;//正则表达式     
   if(re.test(ip))     
   {     
       if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256 && RegExp.$5<10000)   
       return true;     
   }     
   return false;      
}  
function checkUrl(url){
	var strRegex ='(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';  
	var re=new RegExp(strRegex);   
	if (!re.test(url)) {   
	   return false;   
	} 
	return true;
}
/** 表单清空 传入参数表单id */
function clearForm(id) {
	$(':input', '#' + id).not(':button, :submit, :reset, :hidden').val('')
			.removeAttr('checked').removeAttr('selected');
	$('#' + id + ' .selectpicker').selectpicker('val','');
}
/** 含隐藏域清空 */
function clearFullForm(id) {
	$(':input', '#' + id).not(':button, :submit, :reset').val('').removeAttr(
			'checked').removeAttr('selected');
	$('#' + id + ' .selectpicker').selectpicker('val','');
}
/**
 * 区域取值。区域内所有包含name属性的取值。 flag:是否取隐藏值,ture:取，false：不取。默认为true
 */
function getAreaVal(areaId, flag) {
	var doms;
	if (flag == false) {
		doms = $("#" + areaId).find("*").not(':hidden');
	} else {
		doms = $("#" + areaId).find("*");
	}
	var result = {};
	doms.each(function(index, dom) {
		if (dom.name) {
			if (isNotEmpty(dom.name)) {
				if (dom.nodeName == "SELECT" || dom.nodeName == "INPUT") {
					result[dom.name] = dom.value;
				} else {
					result[dom.name] = dom.value;
				}
			}
		}
	});
	return result;
}

/**
 * 区域设值 flag:是否根据name设置，true：是，false：否。默认为true
 */
function setAreaVal(areaId, data, flag) {
	//选择出所有的input标签元素
	$(':input', '#' + areaId).each(function(index, dom) {
		for ( var attr in data) {
			if (dom.name == attr) {
				if(dom.nodeName == "INPUT"){
					dom.value = data[attr];
				}else if(dom.nodeName == "SELECT"){
					if($(dom).hasClass("selectpicker")){
						$(dom).selectpicker('val',data[attr]);
					}else{
						dom.value = data[attr];
					}
				}else{
					dom.value = data[dom.name];
				}
			} else if (flag == false) {
				// do nothing
			}
		}
	});
	$("#" + areaId).find("*").not(':input').each(function(index, dom) {
		for ( var attr in data) {
			if (dom.name == attr) {
				dom.innerHTML = data[attr];
			}else if (flag == false) {
				// do nothing
			}
		}
	});
}
/*
 * 显示等待对话框
 */
function showWait() {
	$(document.body).append('<div class="fakeloader"></div>');
	$(".fakeloader").fakeLoader({
		timeToHide : 12000000,
		spinner : "spinner7",
		bgColor : "rgba(52,73,94,0.2)"
	});

}
/*
 * 关闭等待对话框
 */
function closeWait() {
	$(".fakeloader").remove();
}
/**
 * jquery ajax请求封装
 * 
 * @param opts
 */
function doPost(opts) {
	opts.type = "POST";
	opts.contentType="application/json";
	if(opts.data){
		opts.data = JSON.stringify(opts.data);
	}
	doAjax(opts);
}

function doPut(opts) {
	opts.type = "PUT";
	opts.contentType="application/json";
	if(opts.data){
		opts.data = JSON.stringify(opts.data);
	}
	doAjax(opts);
}

function doDelete(opts) {
	opts.type = "DELETE";
	opts.contentType="application/json";
	if(opts.data){
		opts.data = JSON.stringify(opts.data);
	}
	doAjax(opts);
}

function doGet(opts) {
	opts.type = "GET";
	doAjax(opts);
}
/**
 * 
 * @param opts modal:是否加载模态框
 * @returns
 */
function doAjax(opts) {
	showWait();
	// 处理参数，如果参数为null,就剔除
	for ( var key in opts.data) {
		if (opts.data[key] == "null" || opts.data[key] == null) {
			delete opts.data[key];
		}
	}
	opts.successCP = opts.success;
	var success = function(result) {
		closeWait();
		if (result.success) {// 成功
			var suc = opts.successCP;
			suc(result);
		} else {
			showErrorMessage(result.message);
		}
	};
	opts.success = success;
	var error = function(x, t, s) {
		closeWait();
		showErrorMessage("request error！")
		console.log(opts.url+'error:' + t);
	}
	opts.error = error;
	opts.dataType='json';
	$.ajax(opts);
}
/**
 * 扩展array的方法
 */
Array.prototype.contains = function (obj) {  
    var i = this.length;  
    while (i--) {  
        if (this[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}  

function showSuccessMessage(msg){
	$.alert({
		title : 'Message Tips',
		type : 'blue',
		content : msg
	});
}

function showWarningMessage(msg){
	$.alert({
		title : 'Message Tips',
		type : 'yellow',
		content : msg
	});
}

function showErrorMessage(msg){
	$.alert({
		title : 'Error Tips',
		type : 'red',
		content : msg
	});
}

/*
 * 分页信息
 */
function updatePagination(curPage, pageSize, total,id) {
	if(!id){//适应自定义表格报表数据
		id="";
	}else{
	}
	var $pagination = $(isEmpty(id)?' .pagination':'#'+id+' .pagination');
	var $paginationInfo = $(isEmpty(id)?' .pagination-info':'#'+id+' .pagination-info')
	if (curPage == 0 || total == 0) {
		// 无记录
		$pagination
				.html('<li class="disabled"><a href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true">&lt;</span></a></li>'
						+ '<li class="disabled"><a href="javascript:void(0);" aria-label="Next"><span aria-hidden="true">&gt;</span></a></li>');
		$paginationInfo
				.html('show&nbsp;<span>1</span>-<span>0</span>&nbsp;record&nbsp;total&nbsp;<span>0</span>&nbsp;record');
	} else {

		var pageinationList = new Array();
		// 计算总共页数
		var pages = 0;
		if (total % pageSize == 0) {
			pages = parseInt(total / pageSize);
		} else {
			pages = parseInt(total / pageSize + 1);
		}
		// 计算上一页
		if (curPage === 1) {
			pageinationList
					.push('<li class="disabled"><a href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true">&lt;</span></a></li>');
		} else {
			pageinationList
					.push('<li><a href="javascript:void(0);" onclick="clickCurPage('
							+ (curPage - 1)
							+ ',\"'+id+'\")"  aria-label="Previous"><span aria-hidden="true">&lt;</span></a></li>');
		}
		// 计算中间页面
		var indexs = calculateIndexe(curPage, pages, 5);
		addPageinationList(indexs, curPage, pageinationList);
		// 计算下一页
		if (curPage === pages) {
			pageinationList
					.push('<li class="disabled"><a href="javascript:void(0);" aria-label="Next"><span aria-hidden="true">&gt;</span></a></li>');
		} else {
			pageinationList
					.push('<li><a href="javascript:void(0);" onclick="clickCurPage('
							+ (curPage + 1)
							+ ',\"'+id+'\")" aria-label="Next"><span aria-hidden="true">&gt;</span></a></li>');
		}

		$pagination.html(pageinationList.join(' '));

		// 计算Pagination-info
		$paginationInfo.html('show&nbsp;<span>' + ((curPage - 1) * pageSize + 1)
				+ '</span>-<span>' + (curPage * pageSize)
				+ '</span>&nbsp;record&nbsp;total&nbsp;<span>' + total
				+ '</span>&nbsp;record');

	}
}
/*
 * 添加页面信息
 */
function addPageinationList(indexs, curPage, pageinationList) {
	$
			.each(
					indexs,
					function(index, node) {
						if (curPage == node) {
							pageinationList
									.push('<li class="active"><a href="javascript:void(0);">'
											+ node + '</a></li>');
						} else {
							pageinationList
									.push('<li><a href="javascript:void(0);" onclick="clickCurPage('
											+ node + ')">' + node + '</a></li>');
						}
					});

}
/*
 * 计算显示的页面
 */
function calculateIndexe(current, length, displayLength) {
	var indexes = [];
	var start = Math.round(current - displayLength / 2);
	var end = Math.round(current + displayLength / 2) - 1;
	if (start <= 1) {
		start = 1;
		end = start + displayLength - 1;
		if (end >= length - 1) {
			end = length - 1;
		}
	}
	if (end >= length - 1) {
		end = length;
		start = end - displayLength + 1;
		if (start <= 1) {
			start = 1;
		}
	}
	for (var i = start; i <= end; i++) {
		indexes.push(i);
	}
	return indexes;
}
/**
 * 通过name获取请求参数
 * @param name
 * @returns
 */
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
