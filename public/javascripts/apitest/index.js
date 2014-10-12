/**
 * Created by kikimans on 2014-10-08.
 */
var defaultAPIURL = 'https://broker-test.ucareme.co.kr/broker/rest/api'

var paramIdx = 0;

var transforms = {
    'object':{'tag':'div','class':'package ${show} ${type}','children':[
        {'tag':'div','class':'header','children':[
            {'tag':'div','class':function(obj){
                if( getValue(obj.value) !== undefined ) return('glyphicon glyphicon-plus arrow hide');
                else return('glyphicon glyphicon-plus');
            }},
            {'tag':'span','class':'name','html':'${name}'},
            {'tag':'span','class':'value','html':function(obj) {
                var value = getValue(obj.value);
                if( value !== undefined ) return(" : " + value);
                else return('');

            }},
            {'tag':'span','class':'type','html':'${type}'}
        ]},
        {'tag':'div','class':'children','children':function(obj){return(children(obj.value));}}
    ]}
};


$(document).ready(function(){

    $('#apiurl').val(defaultAPIURL);
    $('#apiresult').hide();
    $('#btn').on('click', function(){
        var btn = $(this);
        btn.button('loading');
        $('.panel-body').html('');

        if($('#username').val() == ''){
            $('.alert').text('OpenShift Account를 입력하셔야 합니다.');
            $('#username').focus();
            $('.alert').show();
            btn.button('reset');
        }

        if($('#password').val() == ''){
            $('.alert').text('OpenShift Account를 입력하셔야 합니다.');
            $('#password').focus();
            $('.alert').show();
            btn.button('reset');
        }
        var historyStr = '<li class="list-group-item alert alert-info">' + $('#apiurl').val() + '</li>';
        $('.nav.nav-sidebar.list-group').append(historyStr)

        var formdata = $('#apitestFrom').serialize();
        $.ajax({
            type : 'POST',
            data : formdata,
            url : '/apitest',
            success : function(data){
                $('.panel-body').json2html(convert('json',data,'open'),transforms.object);
                regEvents();
                btn.button('reset');
                $('#apiresult').show();
            },
            error : function(xhr, status, e ){
                console.log(e);
                btn.button('reset');
            }
        })

    });

    //parameter button event
    $('#parambtn').on('click', function(){
        if($('#urlkey').val() == '' || $('urlvalue').val() == ''){
            alert('parameter key And Value was null');
            return false;
        }else{
            if(paramIdx == 0){
                $('#apiurl').val($('#apiurl').val() + '?');
                var paramValue = $('#urlkey').val() + '=' + $('#urlvalue').val();
                $('#apiurl').val($('#apiurl').val() + paramValue);
                paramIdx += 1;
            }else{
                $('#apiurl').val($('#apiurl').val() + '&');
                var paramValue = $('#urlkey').val() + '=' + $('#urlvalue').val();
                $('#apiurl').val($('#apiurl').val() + paramValue);
                paramIdx=+1
            }
            $('#urlkey').val('');
            $('#urlvalue').val('');
        }

    })

});

function getValue(obj) {
    var type = $.type(obj);

    //Determine if this object has children
    switch(type) {
        case 'array':
        case 'object':
            return(undefined);
            break;

        case 'function':
            //none
            return('function');
            break;

        case 'string':
            return("'" + obj + "'");
            break;

        default:
            return(obj);
            break;
    }
}

//Transform the children
function children(obj){
    var type = $.type(obj);

    //Determine if this object has children
    switch(type) {
        case 'array':
        case 'object':
            return(json2html.transform(obj,transforms.object));
            break;

        default:
            //This must be a litteral
            break;
    }
}

function convert(name,obj,show) {

    var type = $.type(obj);

    if(show === undefined) show = 'closed';

    var children = [];

    //Determine the type of this object
    switch(type) {
        case 'array':
            //Transform array
            //Itterrate through the array and add it to the elements array
            var len=obj.length;
            for(var j=0;j<len;++j){
                //Concat the return elements from this objects tranformation
                children[j] = convert(j,obj[j]);
            }
            break;

        case 'object':
            //Transform Object
            var j = 0;
            for(var prop in obj) {
                children[j] = convert(prop,obj[prop]);
                j++;
            }
            break;

        default:
            //This must be a litteral (or function)
            children = obj;
            break;
    }

    return( {'name':name,'value':children,'type':type,'show':show} );

}
function regEvents() {

    $('.header').click(function(){
        var parent = $(this).parent();
        var child = $(this).children('div');

        if(parent.hasClass('closed')) {
            parent.removeClass('closed');
            parent.addClass('open');
            if(child.hasClass('glyphicon-plus')){
                child.removeClass('glyphicon-plus');
                child.addClass('glyphicon-minus');
            }
        } else {
            parent.removeClass('open');
            parent.addClass('closed');
            if(child.hasClass('glyphicon-minus')){
                child.removeClass('glyphicon-minus');
                child.addClass('glyphicon-plus');
            }
        }
    });

    $('span').on('click', function(){
        if($(this).prev().text() == 'href'){
            var splitText = $(this).text().split('\'');
            $('#apiurl').val(splitText[1]);
        }
    });

    //sidebar event
    $('ul.nav.nav-sidebar.list-group > li').on('click', function(){
        console.log('info : '+ $(this).text());
        $('#apiurl').val($(this).text());
    });


}
