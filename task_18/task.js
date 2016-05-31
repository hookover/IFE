/**
 * Created by apple on 16/4/7.
 */
$= function (obj) {
    try{
        return window.document.querySelector(obj);
    }catch(e){
        throw new Error(e);
    }
}
var data = [];
function getInputValue()
{
    var rex = /^\d+$/.test($('#input_value').value);
    if(!rex)
    {
        return new Error('请输入数字');
    }
    return $('#input_value').value;
}

function action(func,callback){
    var args = [].slice.call(arguments,2);
    return function(e)
    {
        try{
            var arg = args.map(function(item){
                return typeof item === 'function' ? item(e) : item;
            });
            var result = func.apply(data,arg);
            if(callback != null)
            {
                callback(result);
            }
        }
        catch(ex){
            alert(ex.message);
        }
        render();
    }
}
function render(){
    $('#result').innerHTML = 
    data.map(function(d){
        return "<span>" + d + "</span>";
    }).join('-');
}
function getClickIndex(e){
    var node = e.target;
    return [].indexOf.call(node.parentNode.children,node);
}
$("#left_in").onclick=action([].unshift,null,getInputValue);
$("#left_out").onclick=action([].shift,window.alert);
$("#right_in").onclick=action([].push,null,getInputValue);
$("#right_out").onclick=action([].pop,window.alert);
$("#result").onclick = action([].splice,null,getClickIndex,1);



