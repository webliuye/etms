<template>
    <div id="container" v-if="!loading"    class="mymap" ref="mymap1"></div>
    <div id="container" v-else  v-loading="loading"   element-loading-text="拼命加载中" element-loading-background="rgba(11, 78, 112, 0.8)"></div>
</template>
<script>
import { getOpenCountAllTable } from 'api/sourceIndex';
export default {
 props: {
    unitName: {
      type: String,
      default: "广西省"
    },
    unitId: {
      type: String,
      default: "450000"
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
      orgName: "",
      cityData:[],
      loading:false
    };
  },
  created(){
    if (this.unitName) {
      this.loading=true;
      this.orgName= name;
      this.getcityData().then(res=>{
        this.mapLoaded.then(() => {
          this.loadmap();
        });
      });
    }else{
      console.log("没有单位名称")
    }
  },
  mounted() {
    //加载地图和相关组件
  },
  methods: {
    getcityData(){
      const vm=this;
      return new Promise( (resolve, reject) => {
          getOpenCountAllTable({unitId:vm.unitId,groups:'catalogueType'}).then(res=>{
              if(res && res.length > 0){
                    res.forEach((e,index)=>{
                      var percent
                      if(!e.finalAmount||e.finalAmount==0){
                        percent=0;
                      }else if(!e.totalAmount||e.totalAmount==0){
                          percent=100;
                      }else{
                        percent=Math.round(e.finalAmount/e.totalAmount*100);
                      }
                    vm.cityData.push(e);
                    });
                    resolve(vm.cityData);
                  }
            })

      });
    },
    loadmap() {
      var vm = this;
      var map = new AMap.Map("container", {
        mapStyle: "amap://styles/1ba6a3c5885891def4d48751c94be019",
        resizeEnable: true
      });
      // map.setFeatures(["bg",'building','road','point']);//单一种类要素显示
      map.setFeatures([]); //单一种类要素显示
      //地图中添加地图操作ToolBar插件
      // map.plugin(['AMap.ToolBar'], function() {
      //     //设置地位标记为自定义标记
      //     var toolBar = new AMap.ToolBar();
      //     map.addControl(toolBar);
      // });

      // map.setMapStyle('amap://styles/darkblue');

      addBeiJing();
      function addBeiJing() {
        //加载行政区划插件
        AMap.service("AMap.DistrictSearch", function() {
          var opts = {
            subdistrict: 1, //返回下一级行政区
            extensions: "all", //返回行政区边界坐标组等具体信息
            level: "district" //查询行政级别为 市
          };
          //实例化DistrictSearch
          const district = new AMap.DistrictSearch(opts);
          district.setLevel("district");
          //行政区查询vm.unitName
          district.search(vm.unitId, function(status, result) {
            var bounds = result.districtList[0].boundaries;
            var polygons = [];
            if (bounds) {
              for (var i = 0, l = bounds.length; i < l; i++) {
                //生成行政区划polygon
                var polygon = new AMap.Polygon({
                  map: map,
                  strokeWeight: 2,
                  path: bounds[i],
                  fillOpacity: 0.7,
                  fillColor: "#002b60",
                  strokeColor: "#55fdff"
                });
                polygons.push(polygon);
              }

              map.setFitView(); //地图自适应
              setTimeout(()=>{vm.loading=false},200)
            }
          });

        });
      }

      map.clearMap(); // 清除地图覆盖物
      var markers=[];
       markers=vm.cityData;
      markers.forEach(function(marker) {
        if(marker.x){
        marker.count= Math.round(marker.totalRate*100);
        var count =Math.ceil( marker.count/10);
        var div = document.createElement("div");
        div.className = "circle";
        div.style.borderRadius = "16px";
        function render() {
          // '+t/24+'
          div.style.width = 60+ "px";
          div.style.height = 60 + "px";
          div.style.margin="-30px 0 0 -30px";
          div.style.background =count?`url(${require(`../../assets/visual/level/level-${count}.gif`)}) no-repeat  center`:`url(${require(`../../assets/visual/level/level-circle-1.png`)}) no-repeat  center`;
          div.innerHTML = `<p class="label" style="position:absolute;top:-36px;width:72px;right:-72px;z-index:1400;border-radius:5px;padding:2px;font-size:14px;text-align:center;background:rgb(0,0,0,0.3);border:1px solid #73e4e8;color:#73e4e8;">
          ${marker.unitName}<br/>${marker.count}%
           <img src="${require(`../../assets/visual/zhexian.png`)}"  style="position:absolute; left:-20px;top:50%;"/>
          </p>`;
        }
        render();
        new AMap.Marker({
          map: map,
          content: div,
          position: [marker.x, marker.y],
          offset: new AMap.Pixel(-8, -8),
          zIndex: marker.count
        });
        }

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
  width: 100%;
  height:100%;
  margin: 0px;
  position: relative;
}
</style>
