let notyf = new Notyf({
    duration: 1500,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'warning',
            background: 'orange',
            icon: {
                className: 'material-icons',
                tagName: 'i',
                text: 'warning'
            }
        },
        {
            type: 'success',
            background: '#8bc34a'
        },
        {
            type: 'error',
            background: '#ff4081',
            duration: 2000,
            dismissible: true
        }
    ]
});

$('#commentListBox').on('click','.p-comment-reply-btn',function() {
    $(this).parent().parent().parent().append($("#p-comment-box"));
    $("#pid").val($(this).attr('data-pid'));
    $("#topPid").val($(this).attr('data-topPid'));
    $(".p-cancel-reply").show();
    $("#content").focus();
});

$('#commentListBox').on('click','.p-cancel-reply',function() {
    cancelReply();
});

$('.p-comment-box').on('click','#submitComment',function() {
    submitComment();
});
let emojiPanelStatus = false;
$('.p-comment-emoji-panel').on('click','li', function (){
    $("#content").val($("#content").val() + $(this).text());
    $("#content").focus();
    $(".p-comment-emoji-box").hide("normal");
    emojiPanelStatus = false;
});

$("#p-comment-emoji-btn").click(function () {
    console.log(111);
    if (emojiPanelStatus) {
        $(".p-comment-emoji-box").hide("normal");
        emojiPanelStatus = false;
    } else {
        $(".p-comment-emoji-box").show("normal");
        emojiPanelStatus = true;
    }
});
$('.p-form-item').on('click', '#p-comment-emoji-btn', function () {

});

function submitComment() {
    var form = $("#commentForm").serializeArray()
    var data = {};
    $.each(form,function(i,v){
        data[v.name] = v.value;
    })
    $.ajax({
        type: "POST",
        url: "/comment/submitComment" ,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (result) {
            if (result.code === 200) {
                $("#content").val('');
                cancelReply();
                const thisUrl = $("#url").val();
                $("#commentListBox").load(thisUrl+" #commentList",null,function(){
                    location.hash = "#comment-"+ result.data.id;
                });
                notyf.success('????????????');
            }else if (result.code === 201) {
                notyf.success("????????????,???????????????????????????");
            } else if (result.code === -1) {
                notyf.error("??????????????????????????????");
            }else if (result.code === -2) {
                notyf.error("???????????????");
            }else if (result.code === -3) {
                notyf.error("???????????????");
            }else if (result.code === -4) {
                notyf.error("??????????????????,???????????????");
            } else if (result.code === -5) {
                notyf.error("?????????????????????");
            } else {
                notyf.error(result.msg);
            }
        },
        error : function() {
            notyf.error("????????????,????????????");
        }
    });
}


function cancelReply() {
    $(".p-cancel-reply").hide();
    $("#commentListBox").after($("#p-comment-box"));
    $("#pid").val('');
    $("#topPid").val('');
}

