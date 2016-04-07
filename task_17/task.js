/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day",
    maxValue: "0"
}

/**
 * 渲染图表
 */
function renderChart() {

    var res_array ={};
    var weekDay=0;
    var year = 0,yearNum=0;
    if(pageState.nowGraTime=='week')
    {
        for(var indate in aqiSourceData[pageState.nowSelectCity])
        {
            var d = new Date(indate);
            res_array[weekDay] = (res_array[weekDay]?res_array[weekDay]:0)+aqiSourceData[pageState.nowSelectCity][indate];
            if(d.getDay()==0)
            {
                weekDay++;
            }
        }
        chartData[pageState.nowSelectCity]=res_array;
    }else if(pageState.nowGraTime=='month')
    {
        for(var indate in aqiSourceData[pageState.nowSelectCity])
        {
            var d = new Date(indate);
            res_array[(d.getMonth()+yearNum)] = (res_array[d.getMonth()]?res_array[d.getMonth()]:0)+aqiSourceData[pageState.nowSelectCity][indate];
            if(d.getFullYear()>year)
            {
                year = d.getFullYear();
                yearNum++;
            }
        }
        chartData[pageState.nowSelectCity]=res_array;
    }

    var dataHtml='<div class="'+pageState.nowGraTime+'">';
    var sourceData = chartData[pageState.nowSelectCity];

    var colorContainer=["#99CCCC", "#FFCC99", "#FFCCCC", "#FF9999", "#996699", "#FFCCCC","#009966","#CC99CC","#666699","#336699"];
    pageState.maxValue=0;
    for(var indate in sourceData)
    {
        if(pageState.maxValue<sourceData[indate]){
            pageState.maxValue=sourceData[indate]+1;
        }
    }
    for(var indate in sourceData)
    {
        dataHtml += '<i style="height: '+(sourceData[indate]/pageState.maxValue)*100+'%;' +
            'background:'+colorContainer[Math.round(Math.random()*9)]+';" ' +
            'data-value="'+indate+':'+sourceData[indate]+'"></i>';
    }
    dataHtml+='<\/div>';

    /*  写入数据  */
    var chartHTMLContainer = window.document.getElementsByClassName('aqi-chart-wrap')[0];
    chartHTMLContainer.innerHTML = dataHtml;

    //添加事件
    window.document.getElementsByClassName('aqi-chart-wrap')[0].addEventListener('mouseover',function(e){
        var htmlContainer = window.document.getElementById("mouseover");
        if(typeof(e.target.dataset.value) != "undefined")
        {
            //var value =(e.target.dataset.value).match(/:\d+/)[0].match(/\d+/);
            var value =(e.target.dataset.value).match(/\b[\d]+$/);

            var weekdOrMonth = (e.target.dataset.value).match(/\d+/);
            var year = (e.target.dataset.value).match(/\d{1,4}-\d{1,2}-\d{1,2}/);
            var res=year?year:++weekdOrMonth;
            var tag="";

            if(pageState.nowGraTime=="month")
            {
                tag="月";
            }else if(pageState.nowGraTime=="week")
            {
                tag="周";
            }

            htmlContainer.innerHTML=
                "<span>日期："+res+tag+"</span>"+
                "<span>质量："+value+"</span>";

            htmlContainer.style.display='block';
            htmlContainer.style.top= e.clientY;
            htmlContainer.style.left= (e.clientX - htmlContainer.offsetWidth/2);
        }else{
            htmlContainer.style.display='none';
        }
    })
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var time_list = window.document
        .getElementById('form-gra-time')
        .getElementsByTagName('input');

    // 设置对应数据
    for(var i=0;i<time_list.length;i++)
    {
        if(time_list[i].checked && (time_list[i].value != pageState.nowGraTime))
        {
            pageState.nowGraTime = time_list[i].value;
            chartData[pageState.nowSelectCity]=randomBuildData(Math.random()*100);
            // 调用图表渲染函数
            renderChart();
        }
    }

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var city = window.document.getElementById('city-select').value;
    //(pageState.nowSelectCity!=city)?(pageState.nowSelectCity=city):'';
    if(pageState.nowSelectCity!=city){
        pageState.nowSelectCity=city;
    }else{
        return;
    }
    // 设置对应数据
    chartData[city]=randomBuildData(Math.random()*100);

    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    graTimeChange();
    var time_select = window.document.getElementById('form-gra-time');
    time_select.addEventListener('click',function(e){
        graTimeChange();
    })
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var city_select = window.document.getElementById('city-select');
    var city_list="",i=0;

    for (var city in aqiSourceData){
        if(i<1){
            pageState.nowSelectCity=city;
            i++;
        }
        city_list += "<option value='"+city+"'>"+city+"</option>";
    }
    city_select.innerHTML = city_list?city_list:"";
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    city_select.addEventListener('change',citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中

    chartData[pageState.nowSelectCity] = aqiSourceData[pageState.nowSelectCity];
    // 显示数据到网页
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

init();