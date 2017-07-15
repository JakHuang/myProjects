(function(window) {
//椭圆周长计算函数
function getEllipseLength(ellipse){
  var rx = parseFloat(ellipse.getAttribute('rx')),
    ry = parseFloat(ellipse.getAttribute('ry')),
    h = Math.pow((rx-ry), 2) / Math.pow((rx+ry), 2);
  return (Math.PI * ( rx + ry )) * (1 + ( (3 * h) / ( 10 + Math.sqrt( 4 - (3 * h) )) ));
}

//画椭圆路径
function ellipsePath(cx, cy, rx, ry, r){
  if (r>0){
      rx = r;
      ry = r;
  }
  var output = "M" + (cx-rx).toString() + "," + cy.toString();
  output += "a" + rx.toString() + "," + ry.toString() + " 0 1,0 " + (2 * rx).toString() + ",0";
  output += "a" + rx.toString() + "," + ry.toString() + " 0 1,0 " + (-2 * rx).toString() + ",0";
  return output;
}

function svgElemWidth(elem) {
    var methods = [ // name of function and how to process its result
        { fn: 'getBBox', w: function(x) { return x.width; }, },
        { fn: 'getBoundingClientRect', w: function(x) { return x.width; }, },
        { fn: 'getComputedTextLength', w: function(x) { return x; }, }, // text elements only
    ];
    var widths = [];
    var width, i, method;
    for (i = 0; i < methods.length; i++) {
        method = methods[i];
        if (typeof elem[method.fn] === 'function') {
            width = method.w(elem[method.fn]());
            if (width !== 0) {
                widths.push(width);
            }
        }
    }
    var result;
    if (widths.length) {
        result = 0;
        for (i = 0; i < widths.length; i++) {
            result += widths[i];
        }
        result /= widths.length;
    }
    return result;
}

window.Nebula = function(option){
  var svg = d3.select(option.ID).append('svg').attr({"width": option.W,"height": option.H,
      'viewBox':'0 0 '+option.W+' '+option.H,'preserveAspectRatio':'xMidYMid meet'})
      .attr({'xmlns':'http://www.w3.org/2000/svg','xmlns:xlink':'http://www.w3.org/1999/xlink'}),
    ringR = option.W/2*parseInt(option.radius)/100,
    scaleR = option.W/745,
    g1 = svg.append('g').classed('g1', true).attr("transform","translate("+option.W/2+","+option.H/2+")"),
    ring0 = g1.append("ellipse").style({stroke:'#31698E',fill:'none','stroke-width':1,'filter': 'url(#f1)'})
      .attr({cx:0, cy:0, rx:(ringR+60*scaleR), ry:(ringR+90*scaleR)*option.ry, transform:'translate(0, '+10*scaleR+')'}),
    ring1 = g1.append("ellipse").style({stroke:'#204156',fill:'none','stroke-width':1})
      .attr({cx:0, cy:0, rx:(ringR+40*scaleR), ry:(ringR+50*scaleR)*option.ry, transform:'translate(0, '+5*scaleR+')'}),
    ring2 = g1.append("ellipse").style({stroke:'#BCA37B',fill:'none','stroke-width':1,'filter': 'url(#f2)'})
    .attr({cx:0,cy:0,rx:ringR,ry:ringR*option.ry}),
    ring3 = g1.append("ellipse").style({stroke:'#204156',fill:'none','stroke-width':1})
      .attr({cx:0, cy:0, rx:(ringR-20*scaleR), ry:(ringR-40*scaleR)*option.ry, transform:'translate(0, '+-3.5*scaleR+')'}),
    ring4_dashed = g1.append("ellipse").style({stroke:'#A6B7D1',fill:'none','stroke-width':1.5,'stroke-dasharray':"1.5 8"})
      .attr({cx:0, cy:0, rx:(ringR-80*scaleR), ry:(ringR-70*scaleR)*option.ry, transform:'translate(0, '+-6.5*scaleR+')'}),
    ring5 = g1.append("ellipse").style({stroke:'#204156',fill:'none','stroke-width':1})
      .attr({cx:0, cy:0, rx:(ringR-140*scaleR), ry:(ringR-100*scaleR)*option.ry, transform:'translate(0, '+-7.5*scaleR+')'}),
    ring6 = g1.append("ellipse").style({stroke:'#4EADFF',fill:'none','stroke-width':1.5,'filter': 'url(#f1)'})
      .attr({cx:0, cy:0, rx: (ringR-140*scaleR), ry: (ringR-100*scaleR)*option.ry, transform:'translate(0, '+-7.5*scaleR+')'}),
    ring6_length = getEllipseLength(ring6.node()),
    ring7 = g1.append("ellipse").style({stroke:'#D0A258',fill:'rgba(208,162,88,0.3)','stroke-width':1})
      .attr({cx:0, cy:0, rx:25*scaleR, ry:9*scaleR, transform:'translate(0, '+-6.5*scaleR+')','filter': 'url(#f2)'}),
    ring8 = g1.append("ellipse").style({stroke:'#D0A258',fill:'#D0A258','stroke-width':1})
       .attr({cx:0, cy:0, rx:10*scaleR, ry:4*scaleR, transform:'translate(0, '+-6.5*scaleR+')','filter': 'url(#f2)'}),
    ring9_dashed = g1.append("ellipse").style({stroke:'#5A7389',fill:'none','stroke-width':1.5,'stroke-dasharray':"1.5 4"})
      .attr({cx:0, cy:0, rx:(ringR*.26),ry:(ringR*.12), transform:'skewY(130)'}),
    ring10_dashed = g1.append("ellipse").style({stroke:'#3B5564',fill:'none','stroke-width':1.5,'stroke-dasharray':"1.5 4"})
      .attr({cx:0, cy:0, rx:(ringR*.45),ry:(ringR*.2), transform:'skewY(30)'}),
    trace1 = g1.append("path").classed('trace1', true).style('fill','none')
      .attr({d: function(){ return ellipsePath(0, -7.5*scaleR, ringR-140*scaleR, (ringR-100*scaleR)*option.ry, 0); }}),
    trace2 = g1.append("path").classed('trace2', true).style('fill','none')
      .attr({d: function(){ return ellipsePath(0, 0, ringR, ringR*option.ry, 0); }}),
    trace3 = g1.append("path").classed('trace3', true).style('fill','none')
      .attr({d: function(){ return ellipsePath(0, 10*scaleR, ringR+60*scaleR, (ringR+90*scaleR)*option.ry, 0); }}),
    nodeList1 = [],
    nodeList2 = [],
    nodeList3 = [];

  ring6.style({ 'stroke-dasharray': ring6_length/6});

  //第一层轨道上的话题
  FillNodeList(option.ID, option.W, option.H, g1, option.data1, 10, 16, nodeList1, "0.18rem", trace1.node(), 0.8, true);

  //第二层轨道上的话题
  FillNodeList(option.ID, option.W, option.H, g1, option.data2, 8, 14, nodeList2, "0.18rem", trace2.node(), 1);

  //第三层轨道上的话题
  FillNodeList(option.ID, option.W, option.H, g1, option.data3, 6, 12, nodeList3, "0.18rem", trace3.node(), 1.1, true);


  var s_offset=0;
  (function Animloop(){
      MoveNode(nodeList1);
      MoveNode(nodeList2);
      MoveNode(nodeList3);
      
      s_offset = s_offset <= ring6_length ? s_offset : 0;
      ring6.style("stroke-dashoffset", s_offset);
      s_offset += 1;
      requestAnimationFrame(Animloop);
  })();

  function MoveNode(nodeList){
    for(var i=0; i<nodeList.length; i++){
      var item = nodeList[i],
        point = item.cacheArr[item.moveIndex];
      item.moveIndex  = item.moveIndex===item.cacheArr.length-1 ? 0 : item.moveIndex+1;
      item.ball.attr("transform","translate("+point.x+","+point.y+")");
    }
  }

  function FillNodeList(container, W, H, g1, data, ballRIn, ballROut, nodeList, fontSize, tracePath, incrementNum, isReverse){
    if(data && data.length>0){
      var traceLength = tracePath.getTotalLength(); 
      for(var i=0; i<data.length;i++){
        var obj={cacheArr:[]};

        if(isReverse){
          for(var currentLen = traceLength; currentLen >= 0; currentLen-=incrementNum){
            var PointPosition = (traceLength*i/data.length + currentLen) % traceLength;
              obj.cacheArr.push(tracePath.getPointAtLength(PointPosition));
          }
        }else{
          for(var currentLen = 0; currentLen <= traceLength; currentLen+=incrementNum){
            var PointPosition = (traceLength*i/data.length + currentLen) % traceLength,
              p = tracePath.getPointAtLength(PointPosition);
            obj.cacheArr.push({x:p.x, y:p.y});
          }
        }

        obj.ball = g1.append('g');
        var tip_rect = obj.ball.append("rect").attr({"y":"-3.05em","rx":"5","ry":"5","height":"1.8em"})
          .style({"fill":"rgba(124,224,250,0.3)","stroke":"rgba(124,224,250,.5)","stroke-width":1,"font-size":fontSize}),
        tip_text = obj.ball.append("text").attr({"dy":"-1.8em","fill":"#fff","text-anchor":"middle"})
          .style({"font-size":fontSize}).text(data[i].substr(0,22)+"..."),
        tip_title = obj.ball.append("title").text(data[i]),
        _W = svgElemWidth(tip_text.node())+20;
        tip_rect.attr({"x":_W/-2,"width":_W});

        obj.ball.append("circle").attr("r", ballROut).classed({ballout:true});
        obj.ball.append("circle").attr("r", ballRIn).classed({ballout:true,ballin:true});
        obj.moveIndex = 0;
        nodeList.push(obj);
      }
    }
  }
}
})(window);