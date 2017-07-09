(function(window,d3){

	window.WuxiMap=function(){
		this.version=0.1;
		this.Init.apply(this, arguments);
	}
	
	WuxiMap.prototype.Init = function(option){
		this.config = {
			containerID:"#wuxiMap",//容器ID
			width:1000,//画布宽
			height:600,//画布高
			mapStroke:'#fff',//地图边线颜色
			mapCenter:[120.5, 31.5],//地图中心坐标
			mapScale:25000,//地图缩放比例
			interval:2000,//闪点切换时间间隔（毫秒）
			maxCoexist:3,//地图中最多能同时出现的闪点个数
			duration:750,//单次闪点动画持续时长（毫秒）
			color:d3.scale.category20(),//地图颜色
			pointR:6,//闪点半径,
			pointFill:'#fff',//闪点颜色
			pointMarginTop:16,//闪点与提示框的距离
			invertTips:['北塘区','宜兴市','南长区','惠山区'],//提示框显示在左边
			place:["北塘区","滨湖区","宜兴市","江阴市","锡山区","崇安区",'南长区','惠山区'],//无锡各区域名称
			longLat:[
		        	[120.28, 31.61],[120.25, 31.45],
		        	[119.80, 31.40],[120.28, 31.86],
		        	[120.50, 31.66],[120.33, 31.59],
		        	[120.315, 31.54],[120.23, 31.68]
		        ],//地区闪点经纬度
		    data:[]//驱动闪点动画的数据
		};
		
		var me = this;
		this.config = this.extend(this.config, option || {});
		this.svg = d3.select("body").select(this.config.containerID).append("svg")
					    .attr("width", this.config.width)
					    .attr("height", this.config.height);
	    this.projection = d3.geo.mercator()
						.center(this.config.mapCenter)
						.scale(this.config.mapScale)
    					.translate([this.config.width/2, this.config.height/2]);
		this.path = d3.geo.path().projection(this.projection);
		this.tipStack = [];
				
		//无锡的行政区划代码320200
		d3.json("320200.json", function(error, root) {
			if (error) 
				return console.error(error);
		
			me.svg.selectAll("path")
				.data(root.features)
				.enter()
				.append("path")
				.attr("stroke",me.config.mapStroke)
				.attr("stroke-width",1)
				.attr("fill", function(d,i){
					return me.config.color(i);
				})
				.attr("d", me.path );
//				.on("click",function(d){
//					alert(d.properties.name);
//				});

			me.wuxiScale = d3.scale.ordinal()
		        .domain(me.config.place)
		        .range(me.config.longLat);
		
		    //根据地区名转换闪点坐标位置
	    	for(var i=0;i<me.config.data.length;i++){
				var item = me.config.data[i];
				item.XY = me.projection(me.wuxiScale(item.place));
			}
			if(me.config.data&&me.config.data.length>0){
			    me.ShowTip(me.config.data[0]);
			    var i=1;
			    setInterval(function(){
			    	i = i%me.config.data.length;
			    	me.ShowTip(me.config.data[i++]);
			    },me.config.interval);
		    }
		});
	}
	
	WuxiMap.prototype.Update = function(data){
		this.config.data=data;
		for(var i=0;i<data.length;i++){
			var item = this.config.data[i];
			item.XY = this.projection(this.wuxiScale(item.place));
		}
	}
	
	WuxiMap.prototype.ShowTip = function (point){
		this.ClearTip(point.place);
		
		var me = this;
		var t = setInterval(function(){
			me.drawPoints(point);
		},400);
		var html = this.drawTiphHtml(point);
		this.tipStack.push({place:point.place, t:t, html: html});//入栈缓存
		
		setTimeout(function(){
			me.ClearTip.call(me, point.place);
		}, me.config.interval * me.config.maxCoexist - me.config.duration);
	}
	
	WuxiMap.prototype.drawPoints = function(point){
		this.svg.append("circle")  
		    .attr("class","point")  
		    .attr("cx",point.XY[0])  
		    .attr("cy",point.XY[1])  
		    .attr("fill",this.config.pointFill)
		    .attr("r",this.config.pointR)
		    .transition()
		    .duration(this.config.duration)
			.style("opacity", 0)
			.attr("r",this.config.pointR*2)
			.remove();
	}
	
	WuxiMap.prototype.drawTiphHtml=function (point){
		var me = this,
			html = d3.select(this.config.containerID).append('a').html(point.title)
					.attr('href',point.link)
					.attr('target','_blank')
					.attr('class','tipBox')
					.style('left',function(){
						if(me.config.invertTips.indexOf(point.place)!==-1){
							return point.XY[0] - 5*me.config.pointR - me.GetLength(point.title)*7 + 'px';
						}
							
						return point.XY[0]+12+'px';
					})
					.style('top',  point.XY[1]+'px');
			
		html.transition()
			.duration(500)
			.style("opacity", 1)
			.style('top',(point.XY[1] - this.config.pointMarginTop)+'px');
		
		return html;
	}
	
	WuxiMap.prototype.ClearTip = function(place){
		for(var i=0; i<this.tipStack.length; i++){
			var tip = this.tipStack[i];
			if(tip.place===place){
				clearInterval(tip.t);//清除闪点动画
				tip.html.transition().duration(this.config.duration/2).style("opacity", 0).remove();//清除提示
				this.tipStack.splice(i,1);
				break;
			}
		}
	}
	
	//计算字符串长度
	WuxiMap.prototype.GetLength = function(str) {
		return str.replace(/[^\x00-\xff]/g,"aa").length;
	};   
	
	//合并处理
	WuxiMap.prototype.extend= function(source, target){ 
        for(var p in target){
            if(target.hasOwnProperty(p)){
                source[p] = target[p];
            }
        }
        return source;
    }
})(window,d3);
