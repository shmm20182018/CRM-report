<template>
  <div class="chart-inner-wrapper">
    <i v-if="!phoneFlag" class="fullscreen-chart-open" @click="chartShowFullScreen">全屏</i>
    <div v-if="fullChartShow" class="full-chart-show">
      <i class="fullscreen-chart-close" @click="closeFullScreen">关闭</i>
      <chart  :init-options="initOptions" auto-resize :options="chartInfo" theme="light" ></chart>
    </div>  
    <chart auto-resize :options="chartInfo" theme="light" ></chart>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataset'

export default {
  props:['chartInfo','phoneFlag'],
  components: {
    chart: ECharts
  },
  data: function () {
    return {
      fullChartShow:false,
      initOptions:{}
    }
  },
  watch:{
  },
  methods:{
    chartShowFullScreen(){
      this.initOptions = Object.assign(this.initOptions,{
        width:document.documentElement.offsetWidth || document.body.offsetWidth,
        height: document.documentElement.offsetHeight || document.body.offsetHeight
      })
      this.fullChartShow = true;
    },
    closeFullScreen(){
      this.fullChartShow = false;
    }
  }
}
</script>

<style>
.echarts {
  width: 100%;
  height: 400px;
  
}
.phone-style-class  .echarts{
  width:100%;
}
.fullscreen-chart{
  cursor: pointer;
}
.chart-inner-wrapper{
  width:80%;
  left: 10%;
}
.full-chart-show{
  position: fixed !important;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color:#fff;
  z-index: 50;
}
.fullscreen-chart-open{
  position: absolute;
  left: 20px;
  top: 0;
  cursor: pointer;
  color: #698FB6;
}
.fullscreen-chart-close{
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 100;
  color: #698FB6;
}
</style>
