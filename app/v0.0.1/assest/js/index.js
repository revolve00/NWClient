/**
 * Created by Hypnos on 16/6/15.
 */
$(function(){
    /**
     *创建UUID
     */
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16)
            .substring(1);
    }

    /**
     *生成windowId
     */
    function CreateIndentityWindowId() {
        return "UUID-"
            + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-"
            + S4() + S4() + S4());
    }

    $("#add").click(function(){
        var windowId = CreateIndentityWindowId();
        var frameId = CreateIndentityWindowId();
        var dialog = $('<div id="'+windowId+'"><iframe id="'
            + frameId
            + '" src="single.html?windowId='
            + windowId
            + '" class="singlefram" frameborder="0"></iframe></div>');
        dialog.appendTo($("#panel_inline"));
        var index = $("#panel_inline .window-body").length;
        //alert(index);
        if(index > 3) {
            index = 1;
        }
        //alert(index);
        $(dialog).window({
            title : '监视窗口',
            width : $("#panel_inline").width() / 4 - 10,
            /* height: $("#panel_inline").height()70, */
            height : $("#panel_inline").height(),
            //top : 74,
            left : index * $("#panel_inline").width() / 4,
            inline : true,
            shadow : false,
            modal : false,
            iconCls : 'icon-add',
            closed : true,
            minimizable : false,
            maximizable : false,
            collapsible : false,
            onClose : function() {
                $(dialog).remove();
            }
        });
        $(dialog).window('open');
    });
});