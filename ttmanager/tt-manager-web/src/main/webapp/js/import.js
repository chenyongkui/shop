var saveForm = 'saveForm';
var searchForm = 'searchForm';
var saveFormDefault = null; //保存菜单默认值
/*
 * 清除验证
 */
function clearFormBootstrapWalidator(formId) {
	$("#" + formId).data('bootstrapValidator').destroy();
	$("#" + formId).data('bootstrapValidator', null);
}

/*
 * 绑定form 验证规则
 */
function bindFormBootstrapValidator(formId) {

	if(typeof bootstrapValidatorJson != "undefined" && bootstrapValidatorJson) {
		$('#' + formId).bootstrapValidator(bootstrapValidatorJson);
	} else {
		$('#' + formId).bootstrapValidator({
			excluded: [':disabled'],
			message: 'Enter Input Invaild.',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {}
		});
	}

}
$(function() {
	$(".datetime").datetimepicker({
		format: 'yyyy-mm-dd hh:ii:ss',
		language: 'zh-CN',
		minView: 'hour',
		autoclose: true,
		todayBtn: true,
	});
	$(".date").datetimepicker({
		format: 'yyyy-mm-dd',
		language: 'zh-CN',
		minView: 'month',
		autoclose: true,
		todayBtn: true,
	});
	if($('#page-header').length != 0) {
		$.get('header.html', function(data) {
			$('#page-header').html(data);
			fixHeightSpace();
		});
	} else {
		fixHeightSpace();
	}
	if($('#page-header').length != 0) {
		$.get('footer.html', function(data) {
			$('#page-footer').html(data);
			fixHeightSpace();
		});
	} else {
		fixHeightSpace();
	}
	// right menu
	//showRightMenu();
	// top menu Scroller
	showTopMenuScroller();
	// close Note Box
	closeNoteBoxSelf();
	//openBoardClick
	openBoardClick();
	bindFormBootstrapValidator(saveForm);
	saveFormDefault = getAreaVal(saveForm);
});
/**
 * 表单搜索
 */
function onSearch(formId) {
	$("#saveModal").modal('hide');
	var param = getAreaVal(formId);
	searchData(1, param);
}
/**
 * 
 * @param page
 */
function clickCurPage(page) {
	searchData(page, getAreaVal(searchForm));
}
/**
 * @param param:成功后回调函数
 */
function searchData(pageNo, param) {
	var lastParam = {};
	lastParam.curPage = pageNo;
	lastParam.pageSize = pageSize;
	if(isNotEmpty(param.startDate)) {
		lastParam.startDate = param.startDate;
		delete param.startDate;
	}
	if(isNotEmpty(param.endDate)) {
		lastParam.endDate = param.endDate;
		delete param.endDate;
	}
	var params = "";
	for(var key in lastParam) {
		params += key + "=" + lastParam[key] + "&"
	}
	for(var key in param) {
		params += "data." + key + "=" + param[key] + "&"
	}
	doGet({
		url: mainUrl + "/query",
		data: params,
		success: function(result) {
			appendDataRow(result.data); //其他js实现
			updatePagination(result.curPage, result.pageSize, result.total); //common.js实现
		}
	});
}
/**
 * 打开保存表单
 */
function openSaveModal(id) {
	clearFullForm(saveForm);
	if(!id) {
		//新增
		setAreaVal(saveForm, saveFormDefault); //设置默认值
		$("#saveButton").attr("onclick", "add();");
		$("#saveModal").modal('show');
	} else {
		//修改
		doGet({
			url: mainUrl + "/query",
			data: {
				id: id
			},
			success: function(result) {
				if(result.data.length != 0) {
					setAreaVal(saveForm, result.data[0]);
					$("#saveButton").attr("onclick", "modify();");
					$("#saveModal").modal('show');
				}
			}
		});
	}
	clearFormBootstrapWalidator(saveForm);
	bindFormBootstrapValidator(saveForm);
}
/**
 * 打开删除确认
 * @param id
 */
function openDelModal(id) {
	$('#deleteModal').modal('show');
	$('#deletebtn').unbind('click');
	$('#deletebtn').click(function() {
		remove(id);
		$('#deleteModal').modal('hide');
	});
}
/**
 * 删除
 * @param id
 */
function remove(id) {
	doDelete({
		url: mainUrl + "/delete?id=" + id,
		success: function(result) {
			onSearch(searchForm);
		}
	});
}

/**
 * 修改
 */
function modify() {
	var data = getAreaVal(saveForm);
	if(validate(data)) {
		saveData(data);
	}
}
/**
 * 新增
 */
function add() {
	var data = getAreaVal(saveForm);
	if(validate(data)) {
		saveData(data);
	}
}
/**
 * 保存数据
 * @param data
 */
function saveData(data) {
	doPost({
		url: mainUrl + "/save",
		data: data,
		success: function(result) {
			onSearch(searchForm);
		}
	});
}
/**
 * 验证
 * @param data
 * @returns {Boolean}
 */
function validate(data) {
	var mustSelectDoms = $("#" + saveForm + " .selectpicker[must]");
	for(var i = 0; i < mustSelectDoms.length; i++) {
		var dom = mustSelectDoms[i];
		if(isEmpty(dom.value)) {
			showWarningMessage($(dom).attr("must"));
			return false;
		}
	}
	var bvData = $("#" + saveForm).data('bootstrapValidator');
	bvData.validate();
	if(!bvData.isValid()) {
		return false;
	} else {
		if(secondValidate && typeof(secondValidate) == "function") {
			return secondValidate(data);
		} else {
			return true;
		}
	}
}

function openBoardClick() {
	$('.board').click(function() {
		var $this = $(this);
		console.log('sdddd');
		window.open($this.data('url'));
	});
}

function closeNoteBoxSelf() {
	$("div.note-box.note button.close").click(function() {
		$(this).parent().hide();
	});
}

var fixHeightSpace = function() {
	var height_header = $("#page-header").height();
	var height_footer = $("#page-footer").height();
	var height_window = $(window).height();
	$("#page-content").css("min-height", height_window - height_header - height_footer - 15);
}

var slideToggleRightMenu = function() {
	$("#right_menu_list .menu_body:eq(0)").show();
	$("#right_menu_list .menu_head:eq(0)").addClass("current");
	$("#right_menu_list .menu_head").click(function() {
		if(!$(this).hasClass("current")) {
			$(this).addClass("current");
		} else {
			$(this).removeClass("current");
		}
		$(this).next("#right_menu_list .menu_body").slideToggle(300).siblings("#right_menu_list .menu_body").slideUp(300);
		$(this).siblings().removeClass("current");
	});
}

var fixHeightRightMenu = function() {
	var height_header = $("#page-header").height();
	var height_window = $(window).height();
	$("#right_menu_list").css("min-height", height_window - height_header);
}

/*var showRightMenu = function(){
	fixHeightRightMenu();
	slideToggleRightMenu();
	$(".top-menu-reorder").click(function(){
		if($("#right_menu_list").is(':visible')){
			$("#right_menu_list").hide(500);
		}else{
			$("#right_menu_list").show(500);
		}
		
	});
}*/

var showTopMenuScroller = function() {
	$('.dropdown-menu-list.scroller').slimScroll({
		// height: '320px',
		railVisible: true,
		size: '6px',
		alwaysVisible: false
	});
}

// window resize
$(window).resize(function() {
	// footer
	fixHeightSpace();
	// right menu
	//fixHeightRightMenu();
});