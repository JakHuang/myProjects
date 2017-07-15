
    var zoomO = 1920/1080,//原图缩放比
      ddw = document.documentElement.clientWidth,
      ddh = document.documentElement.clientHeight,
      zoomNow = ddw/ddh,
      zoomNum = 1;

    function initChat(){
        var svgWidth;
        if(zoomNow>zoomO){
            var newW = 1920*ddh/1080;
            d3.select("#svgline2").attr({"width":newW, "height":ddh});
            zoomNum = newW/1920;//缩放比
            svgWidth = newW;
        }
        else{
            var newH = 1080*ddw/1920;
            d3.select("#svgline2").attr({"width":ddw, "height":newH});
            zoomNum = newH/1080;//缩放比
            svgWidth = ddw
        }       
        $('html').css('font-size',625*zoomNum+'%'); 
        $('#tocenter').css('margin-left', (ddw-svgWidth)/2+'px').show();
    }
    initChat();



function getRandom(min, max) {
  if(arguments.length===0){
       min=1;max=9999;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

var pie = d3.layout.pie().startAngle(-0.2*Math.PI).endAngle(1.8*Math.PI),
  arcPie = d3.svg.arc().innerRadius(34*zoomNum).outerRadius(42*zoomNum),
  dataset = [ 20 , 23 , 33 , 65 , 26 ];


var arcList = DrawArcPieBG([
  {ID:"#c1", color:"#00E08E"},
  {ID:"#c2", color:"#F8B753"},
  {ID:"#c3", color:"#7065FF"},
  {ID:"#c4", color:"#FF374C"},
  {ID:"#c5", color:"#306C9F"}
]);

function DrawArcPieBG(option){
  var list =[];
  for(var i=0;i<option.length;i++){
    list.push(ArcPieBG(option[i].ID, option[i].color));
  }
  return list;
}

function ArcPieBG(ID, color){
  var g1 = d3.select(ID).append('svg').append('g').attr("transform","translate("+52*zoomNum+","+52*zoomNum+")"),
  circle0 = g1.append('circle').attr({cx: 0, cy: 0, r: 48*zoomNum}).style({"stroke-width":"6","stroke": 'rgba(42,92,134,0.6)', 'fill':"none"}),
  circle1 = g1.append('circle').attr({cx: 0, cy: 0, r: 30*zoomNum}).style({"stroke": 'none', 'fill':"#4DAEFF"}),
  pieArcs = g1.selectAll('.pie').data(pie(dataset)).enter().append("path")
  .attr("fill", color).classed('pie1', true)  
  .attr("d",function(d){ 
    d.endAngle -= 0.1;
    return arcPie(d);  
  });
  pieArcs.transition().ease(d3.ease("bounce")).duration(2000).attr("transform", Rotate(1.5*Math.random() * Math.PI));
  return pieArcs;
}



//数字滚动初始化
var numSet = InitCountUp({
  domIDs:['MapNum1','MapNum2','MapNum3','MapNum4','MapNum5'],
  fromNum:[0,0,0,0,0],
  toNum:[73165,48785485,848118,8705858,70808578]
});

function InitCountUp(option){
  var numset = {};
  for(var i=0; i<option.domIDs.length; i++){
    var num = new CountUp(option.domIDs[i], option.fromNum[i], option.toNum[i], 0, 2, {useEasing:true});
    numset[option.domIDs[i]] = num;
    num.start();
  }
  return numset;
}

function CallBackComet(){
  //setTimeWarnInfo,setTimePerson,setTimeCurlture 下半部分电流的回调
  DrawComet("", path2, 600, "#f3ecec",color[1], [setTimeWarnInfo,setTimeCurlture,setTimePerson]); 
}

function moveArc(isCallBack){
  for(var i=0; i<arcList.length;i++){
    arcList[i].transition().ease(d3.ease("bounce")).duration(2000).attr("transform", Rotate(1.5*Math.random() * Math.PI));
    

    numSet["MapNum"+(i+1)].update( parseInt($("#MapNum"+(i+1)).html().replace(/,/g, ''))+ getRandom(5,15) );
  }
  window.setTimeout(CallBackComet,2060);
  
}


function Rotate(newAngle){
    return "rotate(" + (180/Math.PI * newAngle) + ")";
}

//-----------------标题装饰物----------------
TitleDress();
function TitleDress(){
  var _html1="",_html2="";
  for(var j=0; j<10; j++){
    var opacity1 = 1-j*0.1,
    opacity2 = j*0.1;
    _html1 += '<em style="opacity: '+opacity1+'"></em>';
    _html2 += '<em style="opacity: '+opacity2+'"></em>';
  }
  $('.BBtitle .right').html(_html1);
  $('.BBtitle .left').html(_html2);
}

//-----------------全网各领域情况----------------
  
var amchartList = [{
      "country": "城市形象",
      "visits": 4025,
      "color": "rgba(12,135,198,0.5)"
  }, {
      "country": "城市民生",
      "visits": 1882,
      "color": "rgba(43,97,142,0.5)"
  }, {
      "country": "财经经济",
      "visits": 1809,
      "color": "rgba(43,97,142,0.5)"
  }, {
      "country": "公共安全",
      "visits": 1322,
      "color": "rgba(43,97,142,0.5)"
  }, {
      "country": "时政信息",
      "visits": 1122,
      "color": "rgba(43,97,142,0.5)"
  }, {
      "country": "维稳信息",
      "visits": 1114,
      "color": "rgba(43,97,142,0.5)"
  },{
      "country": "维权信息",
      "visits": 1114,
      "color": "rgba(43,97,142,0.5)"
  }];
amchart(amchartList);
var chartObj;
function amchart(amchartList){
  chartObj = AmCharts.makeChart("chatBox", {
  "theme": "light",
  "type": "serial",
  "color": "#62BFFF",
  "columnWidth":0.5,  //柱图的宽度
  "dataProvider": amchartList,
  "depth3D": 20,
  "angle": 30,
  "startDuration":0.8,
  "valueAxes": [{
      "position": "left",
      "axisColor": "#2C618E",
      "gridColor": "#81B7EA"
  }],
  "balloon":{"adjustBorderColor":false, "fillColor": "rgba(8,26,44,0.7)","color":"#BCD8FA","borderColor": "#4BA5ED" },
  "graphs": [{
      "balloonText": "[[category]]: <b>[[value]]</b>",
      "fillColorsField": "color",
      "fillAlphas": 0.85,
      "lineAlpha": 0.1,
      "type": "column",
      "valueField": "visits"
  }],
  "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": false
  },
  "categoryField": "country",
  "categoryAxis": {
      "gridPosition": "start",
      "labelRotation": 0,
      "color":"#fff",
      "fontSize":18*zoomNum,
      "axisColor": "#2C618E",
      "gridColor": "rgba(0,0,0,0)",
      "fontFamily":"Microsoft YaHei"
  },
  "export": {
    "enabled": true
  }

},0);
}      

//-------------------电流------------------------
//准备彗星路径
function FillCometPath(sky, pathArr){
  for(var i=0; i<pathArr.length; i++){
    var pathItem = pathArr[i],
      path = pathItem.path,
      r = pathItem.r,
      offset = pathItem.offset,
      pathID = path.id.toString(),
      currentLen = 0,
      len = path.getTotalLength(),
      skyG = sky.append('g').classed('G'+pathID, true);

    for(;currentLen <= len;currentLen += r*offset){
      var point = path.getPointAtLength(currentLen);
      skyG.append("circle").attr({cx: point.x+pathItem.translateX, cy: point.y+pathItem.translateY, r: r})
        .classed(pathID, true).style("opacity", 0);
    } 
  }
}
FillCometPath(d3.select("#svgline2").append('g').attr("id","sky"),[
    {path: path1, r:3.2, offset: 1.5, translateX: 0, translateY: 0},
    {path: path2, r:3.2, offset: 1.5, translateX: 0, translateY: 0}
]);


/**
 * [DrawComet 绘制长尾彗星，按彗星半径偏移量运动]
 * @param path     [彗星运行路径]
 * @param duration [滑动速度，整个路径长度的百分比]
 * @param headRGB  [头部颜色]
 * @param tailRGB  [尾部颜色]
 * @param callback [回调函数，在彗星消失后]
 */
function DrawComet(_id, path, duration, headRGB, tailRGB, cbArr, callback){
  var i = 0,
    pathID = path.id.toString(),
    cachePoints = d3.select("#svgline2 #sky").selectAll("."+pathID),
    hadAnimate=[],
    trigger1 = cachePoints[0].length*0.1,
    trigger2 = cachePoints[0].length*0.31,
    trigger3 = cachePoints[0].length*0.85;

  function AnimPoint(point){
    d3.select(point).style({fill: headRGB, opacity: 1})
      .transition().ease(d3.ease("out")).duration(duration).style("opacity", 0).style("fill", tailRGB);
  }

  function StartCB1(trigger, j){
    if(i> trigger && $.inArray(trigger, hadAnimate)===-1){
      hadAnimate.push(trigger);
      if(cbArr && cbArr.length>j && hadAnimate.length<=cbArr.length){
        cbArr[j]();
      }
    }
  }

  (function Animloop(){
    if(i < cachePoints[0].length){
      AnimPoint(cachePoints[0][i++]);

      if(cbArr && cbArr.length>0){
        StartCB1(trigger1, 0);
        StartCB1(trigger2, 1);
        StartCB1(trigger3, 2);
      }

      requestAnimationFrame(Animloop);
    }else{
      if(typeof callback !== 'undefined')
       callback(_id);
    }
  })();
}

//电流颜色
var color = ["#2B6A8C","#e9f505","#f30634","#2806f3","#06f3f0"];
//电流调用
function beginComet() {
    chartObj.animateAgain();
    chartObj.validateData();
    DrawComet("", path1, 600, "#f3ecec",color[0], [], function(id){ 
        moveArc(true);
    });
}
beginComet();
window.setInterval(beginComet, 23000);


//宣传文化，高亮
$("#cultureContainer ol li").click(function () {
    $(this).addClass("hover").siblings("li").removeClass("hover");
    var liHeight = parseInt($(this).css("height"));
    var marginBottom = parseInt($(this).css("margin-bottom"));
    var index = $(this).index();
    $("#cultureContainer .arrow-left,.arrow-right").css("top", liHeight * index + (liHeight -
        marginBottom) / 2 + marginBottom * index);
});



//重点人员标签云
var myChart = echarts.init(document.getElementById('tagCloud'));
// 指定图表的配置项和数据
var colors = ['#B78742', '#4DAEFF', '#2283D4', '#A1712C'];
var option = {
    tooltip: {},
    series: [{
        type: 'wordCloud',
        size: ['100%', '80%'],
        gridSize: 6,
        sizeRange: [14, 30],
        rotationRange: [0, 25],
        shape: 'circle',
        autoSize: {
            enable: true,
            minSize: 14
        },
        textStyle: {
            normal: {
                color: function () {
                    return colors[Math.floor(Math.random() * 4)];
                }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#4DAEFF'
            }
        },
        data: [{
            name: '习近平',
            value: 2000,
            textStyle: {
                normal: {
                    color: '#4DAEFF'
                },
                emphasis: {
                    color: 'red'
                }
            }
        }, {
            name: "李克强",
            value: 666
        }, {
            name: "李克强",
            value: 520
        }, {
            name: "李克强",
            value: "999"
        }, {
            name: "李克强",
            value: "888"
        }, {
            name: "李克强",
            value: "777"
        }, {
            name: "李克强",
            value: "888"
        }, {
            name: "李克强",
            value: "588"
        }, {
            name: "李克强",
            value: "516"
        }, {
            name: "李克强",
            value: "515"
        }, {
            name: "李克强",
            value: "483"
        }, {
            name: "李克强",
            value: "462"
        }, {
            name: "李克强",
            value: "449"
        }, {
            name: "李克强",
            value: "429"
        }, {
            name: "李克强",
            value: "407"
        }, {
            name: "李克强",
            value: "406"
        }, {
            name: "李克强",
            value: "406"
        }, {
            name: "李克强",
            value: "386"
        }, {
            name: "李克强",
            value: "385"
        }, {
            name: "李克强",
            value: "375"
        }, {
            name: "李克强",
            value: "355"
        }, {
            name: "李克强",
            value: "355"
        }, {
            name: "李克强",
            value: "335"
        }, {
            name: "李克强",
            value: "324"
        }, {
            name: "李克强",
            value: "304"
        }, {
            name: "李克强",
            value: "304"
        }, {
            name: "李克强",
            value: "284"
        }, {
            name: "李克强",
            value: "284"
        }, {
            name: "李克强",
            value: "284"
        }, {
            name: "李克强",
            value: "254"
        }, {
            name: "李克强",
            value: "254"
        }, {
            name: "李克强",
            value: "253"
        }, {
            name: "李克强",
            value: "253"
        }]
    }]
};
myChart.setOption(option);

//突发敏感信息预警
function setTimeWarnInfo() {
    var WarnInfoLi = $(".warn-info").find("li");
    WarnInfoLi.addClass("animated bounceIn");
    setTimeout(function () {
        WarnInfoLi.removeClass('bounceIn');
    }, 3000);
}

//重点人员
function setTimePerson() {
    var tagCloud = $("#tagCloud");
    tagCloud.addClass("animated flipInY");
    setTimeout(function () {
        tagCloud.removeClass('flipInY');
    }, 3000);
}

//宣传文化
function setTimeCurlture() {
    var cultureLi = $("#cultureContainer").find("li");
    cultureLi.addClass("animated bounce");
    setTimeout(function () {
        cultureLi.removeClass('bounce');
    }, 3000);
}

setTimeWarnInfo();
setTimePerson();
setTimeCurlture();