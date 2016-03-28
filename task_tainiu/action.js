/**
 * Created by apple on 16/3/28.
 */
function check()
{
    var email = document.getElementById('email');
    var phone = document.getElementById('phone');
    var password = document.getElementById('password');
    var repassword = document.getElementById('repassword');

    if(!email.value.match('[@]')){
        alert('邮箱地址不正确');
        return false;
    }

    if(!phone.value.match('[^d$]{11}')){
        alert('手机号码填写错误');
        return false;
    }
    if(password.value=='')
    {
        alert('密码不能为空');
        return false;
    }
    if(password.value!=repassword.value){
        alert('两次密码输入不一至');
        return false;
    }
}
function getResult()
{
    var output = document.getElementById('result');
    output.value='';
    var url = document.getElementById('inputvalue').value;
    output.value += '协议是：'+url.substring(0,url.lastIndexOf('://'))+'\n';
    output.value += '域名是：'+url.substring(url.indexOf('://')+3,url.lastIndexOf(':'))+'\n';
    output.value += '端口是：'+url.substring(url.lastIndexOf(':')+1,url.lastIndexOf(':')+3)+'\n';
    output.value += '文件名是：'+url.substring(url.lastIndexOf('/')+1)+'\n';

}