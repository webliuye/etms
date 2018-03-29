<template>
      <div id="container" v-if="!loading"    class="mymap" ref="mymap" v-cloak></div>
      <div id="container" v-else  v-loading="loading"  element-loading-text="拼命加载中"  element-loading-background="rgba(11, 78, 112, 0.8)"></div>
</template>
<script>
// import AMap from 'AMap';   //在页面中引入高德地图
import { getOpenCountAllTable } from 'api/sourceIndex';
export default {
  props: {
    unitName: {
      type: String,
      default: "广西省"
    },
    unitId: {
      type: String,
      default: "430200"
    },
    mapLoaded: {
      type: Promise,
      default: () => {
        return Promise.resolve('地图加载失败');
      }
    }
  },
  data() {
    return {
      location: "广西省",
      dataList: [],
      cityData:[],
      orgId:"",
      loading:false
    };
  },
  watch: {
    location(val) {},
    unitId(val){
       this.loading=true;
        this.orgId=this.unitId;
        if(this.orgId){
            this.getcityData().then(res=>{
            this.loadmap()
          });
        }
    }
  },
  mounted() {
    this.loading=true;
    this.orgId=this.unitId;
    if(this.orgId){
          this.getcityData().then(res=>{
            this.mapLoaded.then(() => {
              this.loadmap();
            });
          });
    }

  },
  methods: {
    getcityData(){
      const vm=this;
       return new Promise( (resolve, reject) => {
           getOpenCountAllTable({unitId:vm.orgId,groups:'catalogueType'}).then(res=>{
                if(res && res.length > 0){
                      res.forEach((e,index)=>{
                        var percent=Math.round(e.totalRate*100);
                          vm.cityData[e.unitId]=percent;
                      });
                      resolve(vm.cityData);
                    }
              })

        });
    },
    loadmap() {
      const vm = this;
      const map = new AMap.Map("container", {
        zoom: 18,
        mapStyle: "amap://styles/1ba6a3c5885891def4d48751c94be019"
      });
      //  map.clearMap(); // 清除地图覆盖物
      // map.setMapStyle("amap://styles/blue");//'grey/darkblue/whitesmoke
      map.setMapStyle("amap://styles/1ba6a3c5885891def4d48751c94be019");//'grey/darkblue/whitesmoke
       map.setFeatures(["bg",'point','road','building']);
      // map.setFeatures([]);
      var cityData = vm.cityData;
      AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], function(
        DistrictExplorer,
        $
      ) {
        //创建一个实例
        var districtExplorer = (window.districtExplorer = new DistrictExplorer({
          map: map,
          eventSupport: true, //打开事件支持
          preload: [100000] //预加载全国
        }));

        //要聚合的点列表
        var lngLatList;

        //当前聚焦的区域
        var currentAreaNode = null;

        //鼠标hover提示内容
        var $tipMarkerContent = $(
          '<div class="tipMarker" style="z-index:10;margin-bottom:-32px;width:0;height:0;color:rgba(255,255,255,0);"></div>'
          // '<div class="tipMarker" style="background:rgba(0,0,0,0.8);font-size:14px;width:auto; white-space: nowrap;color:#fff;border:1px solid #ececec;padding:5px;border-radius:5px;"></div>'
        );

        var tipMarker = new AMap.Marker({
          content: $tipMarkerContent.get(0),
          offset: new AMap.Pixel(0, 0),
          bubble: true
        });

        //根据Hover状态设置相关样式
        function toggleHoverFeature(feature, isHover, position) {
          tipMarker.setMap(isHover ? map : null);

          if (!feature) {
            return;
          }

          var props = feature.properties;

          if (isHover) {
            var points = groupedPointsCache[props.adcode] || [];
            var percent = cityData[props.adcode] ? cityData[props.adcode] : 0;
            //更新提示内容
            $tipMarkerContent.html(
              ''
              // props.name + ":" + percent + "%" //换行改变样式<br>
            );
            //更新位置
            tipMarker.setPosition(position || props.center);
          }

          $("#area-tree")
            .find('h2[data-adcode="' + props.adcode + '"]')
            .toggleClass("hover", isHover);

          //更新相关多边形的样式
          var polys = districtExplorer.findFeaturePolygonsByAdcode(
            props.adcode
          );
          for (var i = 0, len = polys.length; i < len; i++) {
            polys[i].setOptions({
              fillOpacity: isHover ? 0.5 : 1
            });
          }
        }

        //监听feature的hover事件
        districtExplorer.on("featureMouseout featureMouseover", function(
          e,
          feature
        ) {
          toggleHoverFeature(
            feature,
            e.type === "featureMouseover",
            e.originalEvent ? e.originalEvent.lnglat : null
          );
        });

        //监听鼠标在feature上滑动
        districtExplorer.on("featureMousemove", function(e, feature) {
          //更新提示位置
          tipMarker.setPosition(e.originalEvent.lnglat);
        });

        //feature被点击
        districtExplorer.on("featureClick", function(e, feature) {

          var props = feature.properties;
          vm.$emit('showSchl',props);
          //如果存在子节点
          // if (props.childrenNum > 0) {
          //   //切换聚焦区域

          //   switch2AreaNode(props.adcode);
          //   vm.location = props.name;
          // }
        });

        //外部区域被点击
        // districtExplorer.on("outsideClick", function(e) {
        //   vm.location = this.unitName;
        //   switch2AreaNode(vm.unitId);
        //   vm.$emit('showSchl',{adcode:vm.unitId,childrenNum:12});
        //   // districtExplorer.locatePosition(
        //   //   e.originalEvent.lnglat,
        //   //   function(error, routeFeatures) {
        //   //     switch2AreaNode(vm.unitId);
        //   //   },
        //   //   {
        //   //     levelLimit: 2
        //   //   }
        //   // );
        // });

        //绘制区域面板的节点
        function renderAreaPanelNode(ele, props, color) {
          var $box = $("<li/>").addClass("lv_" + props.level);

          var points = groupedPointsCache[props.adcode] || [];

          var $h2 = $("<h2/>")
            .addClass("lv_" + props.level)
            .attr({
              "data-adcode": props.adcode,
              "data-level": props.level,
              "data-children-num": props.childrenNum || void 0,
              "data-center": props.center.join(",")
            })
            .html(props.name)
            .appendTo($box);

          if (color) {
            $h2.css("borderColor", color);
          }

          //如果存在子节点
          if (props.childrenNum > 0) {
            //显示隐藏
            $('<div class="showHideBtn"></div>').appendTo($box);

            //子区域列表
            $("<ul/>")
              .addClass("sublist lv_" + props.level)
              .appendTo($box);

            $('<div class="clear"></div>').appendTo($box);

            if (props.level !== "country") {
              $box.addClass("hide-sub");
            }
          }

          $box.appendTo(ele);
        }

        //填充某个节点的子区域列表
        function renderAreaPanel(areaNode) {
          var props = areaNode.getProps();
          var $subBox = $("#area-tree")
            .find('h2[data-adcode="' + props.adcode + '"]')
            .siblings("ul.sublist");

          if (!$subBox.length) {
            //父节点不存在，先创建
            renderAreaPanelNode($("#area-tree"), props);
            $subBox = $("#area-tree").find("ul.sublist");
          }

          if ($subBox.attr("data-loaded") === "rendered") {
            return;
          }

          $subBox.attr("data-loaded", "rendered");

          var subFeatures = areaNode.getSubFeatures();

          // subFeatures.sort(function(f1, f2) {
          //     var props1 = areaNode.getPropsOfFeature(f1),
          //         props2 = areaNode.getPropsOfFeature(f2);

          //     var points1 = groupedPointsCache[props1.adcode] || [],
          //         points2 = groupedPointsCache[props2.adcode] || [];

          //     return points2.length - points1.length;

          // });

          //填充子区域
          for (var i = 0, len = subFeatures.length; i < len; i++) {
            var color = '#002b60';
            // var data = cityData[subFeatures[i].properties.adcode];
            // if (data > 50) {
            //   color = `rgba(250,173,20,${data / 100})`;
            // } else if (data) {
            //   color = `rgba(255,20,20,${1 - data / 100})`;
            // }
            renderAreaPanelNode(
              $subBox,
              areaNode.getPropsOfFeature(subFeatures[i]),
              color
            );
          }

          return $subBox;
        }

        //绘制某个区域的边界
        function renderAreaPolygons(areaNode) {
          //更新地图视野
          map.setBounds(areaNode.getBounds(), null, null, true);

          //清除已有的绘制内容
          districtExplorer.clearFeaturePolygons();
           var strokeColor = '#55fdff'; //#0000FF
          //绘制子区域
          districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
            var color = "#002b60";
            // var data = cityData[feature.properties.adcode];
            // if (data > 50) {
            //   color = `rgba(250,173,20,${data / 100})`;
            // } else if (data) {
            //   color = `rgba(255,20,20,${1 - data / 100})`;
            // }

            var fillColor = color;
            // var strokeColor = colors[colors.length - 1 - i % colors.length];
            var strokeColor = '#55fdff'; //#0000FF
            return {
              cursor: "default",
              bubble: true,
              strokeColor: strokeColor, //线颜色
              strokeOpacity: 1, //线透明度
              strokeWeight: 2, //线宽
              fillColor: "#0a3455" , //填充色
              fillOpacity: 1 //填充透明度
            };
          });

          //绘制父区域
          districtExplorer.renderParentFeature(areaNode, {
            cursor: "default",
            bubble: true,
            strokeColor: strokeColor, //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线宽
            fillColor:null, //填充色
            fillOpacity: 1 //填充透明度
          });

          setTimeout(()=>{
            vm.loading=false;
          },200)
        }

        //切换区域后刷新显示内容
        function refreshAreaNode(areaNode) {

          districtExplorer.setHoverFeature(null);

          renderAreaPolygons(areaNode);

          //更新选中节点的class
          var $nodeEles = $("#area-tree").find("h2");

          $nodeEles.removeClass("selected");

          var $selectedNode = $nodeEles
            .filter("h2[data-adcode=" + areaNode.getAdcode() + "]")
            .addClass("selected");

          //展开下层节点
          $selectedNode.closest("li").removeClass("hide-sub");

          //折叠下层的子节点
          $selectedNode
            .siblings("ul.sublist")
            .children()
            .addClass("hide-sub");


        }

        //切换区域
        function switch2AreaNode(adcode, callback) {
          vm.loading=true;
          vm.orgId=adcode;
          vm.getcityData();
          if (
            currentAreaNode &&
            "" + currentAreaNode.getAdcode() === "" + adcode
          ) {
            return;
          }

          loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
              if (callback) {
                callback(error);
              }

              return;
            }

            currentAreaNode = window.currentAreaNode = areaNode;

            //设置当前使用的定位用节点
            districtExplorer.setAreaNodesForLocating([currentAreaNode]);
            refreshAreaNode(areaNode);

            if (callback) {
              callback(null, areaNode);
            }
          });
        }

        var groupedPointsCache = {};

        function getGroupedPoints(adcode) {
          return groupedPointsCache[adcode] || lngLatList;
        }

        //保留中间聚合结果
        // function saveGroupedPoints(areaNode, groups) {

        //     for (var i = 0, len = groups.length; i < len; i++) {

        //         var subFeature = groups[i].subFeature; //所属子区域

        //         if (!subFeature) {
        //             groupedPointsCache['-out-' + areaNode.getAdcode()] = groups[i].points;
        //             continue;
        //         }

        //         groupedPointsCache[subFeature.properties.adcode] = groups[i].points;
        //     }
        // }
        //加载区域
        function loadAreaNode(adcode, callback) {

          //...................
           map.clearMap(); // 清除地图覆盖物
          districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
              if (callback) {
                callback(error);
              }

              console.error(error);

              return;
            }

            var points = getGroupedPoints(adcode);

            //当前子区域聚合
            var groups = areaNode.groupByPosition(points, function(item) {
              return item;
            });
            //...........................

            const arrData = areaNode._data.geoData.sub.features;
            var newData=[]
            arrData.forEach(e=>{
              var a={};
              a.name=e.properties.name;
              a.count=cityData[e.properties.adcode]|| 0;
              a.position=e.properties.center;
              newData.push(a);
            })
             newData.forEach(function(marker) {

                var div = document.createElement("div");
                div.className = "circle";
                var percent=45;
                var a= 1 ; var s=2.5;
                function render() {
                  percent=percent +a*s;
                  if(percent>=45){
                    a=-1;
                  }else if (percent<=25) {
                    a = 1;
                  }
                 var  t = 72;
                  var count =Math.ceil( marker.count/10);
                  div.style.width = t + "px";
                  div.style.height = t + "px";
                  div.innerHTML = `<p  style="
                  position:absolute;
                  top:-36px;
                  width:72px;
                  height:72px;
                  left:-36px;
                  ${count?`background:url(${require(`../../assets/visual/level/level-${count}.gif`)}) no-repeat;`:`background:url(${require(`../../assets/visual/level/level-circle-1.png`)}) no-repeat;`}
                  background-position:50% 50%;
                  border-radius:36px;
                  text-align:center;
                  padding:16px 0 0 0;
                  font-family: Microsoft YaHei;
                  transition:all 0.5s linear;
                  font-size:16px;
                  border:none;
                  color:#fff;"
                  >
                  </p><p style="  position:absolute;
                  top:-24px;
                  width:56px;
                  height:auto;
                  padding:4px;
                  right:-8px;
                  z-index:1245;
                  border:1px solid #73e4e8;
                  border-radius:5px;
                  color:#ccc;
                  text-align:center;
                  "> ${marker.name}<br>${marker.count}%
                  <img src="${require(`../../assets/visual/zhexian.png`)}"  style="position:absolute; left:-20px;top:50%;"/>
                  </p>
                 `;
                }
                // setInterval(render,500-marker.count*5);
                 // background-size:${percent}px ${percent}px;
                render();
                // new AMap.Marker({
                //   map: map,
                //   content: canv,
                //   position: [marker.position[0], marker.position[1]],
                //   offset: new AMap.Pixel(-8, -8),
                //   zIndex: marker.count
                // });
                new AMap.Marker({
                  map: map,
                  content:div,
                  position: [marker.position[0], marker.position[1]],
                  offset: new AMap.Pixel(-8, -8),
                  zIndex: marker.count
                });
              });
              //...........................
            // saveGroupedPoints(areaNode, groups);

            var $subBox = renderAreaPanel(areaNode);

            // if (groups.length &&
            //     !groups[groups.length - 1].subFeature) {

            //     renderAreaPanelNode($subBox, {
            //         adcode: '-out-' + areaNode.getAdcode(),
            //         name: '',
            //         center: groups[groups.length - 1].points[0]
            //     }, 'gray');
            // }

            if (callback) {
              callback(null, areaNode);
            }
          });
        }
        $("#area-tree").on("mouseenter mouseleave", "h2[data-adcode]", function(
          e
        ) {
          if (e.type === "mouseleave") {
            districtExplorer.setHoverFeature(null);
            return;
          }

          var adcode = $(this).attr("data-adcode");

          districtExplorer.setHoverFeature(
            currentAreaNode.getSubFeatureByAdcode(adcode)
          );
        });

        $("#area-tree").on("click", "h2[data-children-num]", function() {
          var adcode = $(this).attr("data-adcode");

          switch2AreaNode(adcode);
        });

        $("#area-tree").on("click", ".showHideBtn", function() {
          var $li = $(this).closest("li");

          $li.toggleClass("hide-sub");

          if (!$li.hasClass("hide-sub")) {
            //子节点列表被展开
            var $subList = $li.children("ul.sublist");

            //尚未加载
            if (!$subList.attr("data-loaded")) {
              $subList.attr("data-loaded", "loading");

              $li.addClass("loading");

              //加载
              loadAreaNode($li.children("h2").attr("data-adcode"), function() {
                $li.removeClass("loading");
              });
            }
          }
        });

        $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);
        var txturl="https://a.amap.com/amap-ui/static/data/10w.txt";
          if(process.env.NODE_ENV === 'development'){
            txturl="http://a.amap.com/amap-ui/static/data/10w.txt";
          }
        $.get(txturl, function(csv) {
          $("#loadingTip").remove();

          var lines = csv.split("\n");

          var lngLats = [];

          for (var i = 0, len = lines.length; i < len; i++) {
            if (!lines[i]) {
              continue;
            }

            var parts = lines[i].split(",");

            lngLats.push([parseFloat(parts[0]), parseFloat(parts[1])]);
          }

          lngLatList = lngLats;

          groupedPointsCache[""+vm.unitId] = lngLats;

          //加载全国
          switch2AreaNode(vm.unitId);
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
/* .mymap{
      width: 800px;
      height: 800px;
    } */
#container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 300px;
  margin: 0px;
  position: relative;
  padding:0;
}
[v-cloak]{
  display: none;
}
</style>
