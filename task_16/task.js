/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {},
    table = window.document.getElementById('aqi-table');
;

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var inCity = window.document.getElementById('aqi-city-input').value;
    var inNum = window.document.getElementById('aqi-value-input').value;
    if(!inCity.trim().match(/^[A-Za-z\u4E00-\u9FA5]+$/)){
        alert('城市名称必须为英文或者汉字');
        return ;
    }

    if(!inNum.trim().match(/^\d+$/)){
        alert('空气质量指数必须为正整数');
        return ;
    }

    aqiData[inCity]=inNum;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var html="<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>";
    for(var data in aqiData)
    {
        html += "<tr><td>"+data+"</td><td>"+aqiData[data]+"</td><td><button data-city='"+data+"'>删除</button></td></tr>";
    }
    table.innerHTML = data?html:"";
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(target) {
    // do sth.
    //console.log(target.parentElement.parentElement.children[0].innerHTML);
    var city = target.parentElement.parentElement.children[0].innerHTML;


    //点击对象data-'city'的值;
    //dataset匹配data-*的值
    //https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset
    //兼容性：IE11...
    //var city = target.dataset.city;
    delete aqiData[city];
    renderAqiList();
}

function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    window.document.getElementById('add-btn').addEventListener('click',addBtnHandle);
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    window.document.getElementById('aqi-table').addEventListener('click',function(event){
        if(event.target.nodeName.toLowerCase() === 'button')
        {
            delBtnHandle.call(null,event.target);
            // call函数未理解透
        }
    })
}
init();