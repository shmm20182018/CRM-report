<template>
  <div :class="phoneClass" class="report-show-wrapper" v-wechat-title="reportTitle">
    <el-tooltip v-if="phoneFlag" content="过滤条件区" placement="bottom" effect="light">
      <div class="filter-toggle-wrapper" @click="showToggle('filter')">
        <i :class="iconArrowFilter" class="icon-toggle"></i>
      </div>
    </el-tooltip>
    <div class="filter-tools" :class="showFilterFlag?'':'phone-filter-tools'">
      <transition name="slide-fade">
        <filter-form v-show="showFilterFlag" 
                     :paramsInfo="reportInfo.paramsInfo"
                     @query-params-change ="queryParamsChange"
                     @search-data ="searchData"
                     :phoneFlag="phoneFlag"
                     ref="filter"></filter-form>
      </transition>
    </div>
    <el-tooltip v-if="!phoneFlag" content="过滤条件区" placement="bottom" effect="light">
      <div class="filter-toggle-wrapper" @click="showToggle('filter')">
        <i :class="iconArrowFilter" class="icon-toggle"></i>
      </div>
    </el-tooltip>
    <div class="report-title" v-if="reportInfo.chartInfo.series">
        <div class="chart-toggle-wrapper" @click="showToggle('chart')">
          <i>{{reportTitle}}</i>  
          <i :class="iconArrowChart" class="icon-toggle"></i>
        </div>
    </div>
    <div class="chart-wrapper" v-if="reportInfo.chartInfo.series"  :class="showChartFlag?'':'chart-wrapper-hide'">
      <transition name="fade">
        <server-chart v-show="showChartFlag" :chartInfo="reportInfo.chartInfo" :queryParams = "queryParams"></server-chart> 
      </transition> 
    </div>
    <div class="report-title" v-if="reportInfo.tableInfo.columns">
      <div class="table-toggle-wrapper" @click="showToggle('table')">
        <i>{{reportTableTitle}}</i>  
        <i :class="iconArrowTable" class="icon-toggle"></i>
      </div>
    </div>
    <div class="report-table-wrapper" v-if="reportInfo.tableInfo.columns" v-show="reportInfo.tableInfo.columns.length>0">
      <transition name="fade" >
        <server-table  v-show="showTableFlag"
                      :tableInfo="reportInfo.tableInfo" 
                      :hasChart="reportInfo.chartInfo.series"
                      :queryParams ="queryParams"
                      :id ="reportInfo.id"
                      :engine ="$route.params.engine"
                      :phoneFlag="phoneFlag"
                      :showChartFlag="showChartFlag"
                      :showTableFlag="showTableFlag"
                      ref="stable">
        </server-table>
      </transition>              
    </div>
  </div>
</template>

<script>
import FilterForm from '../components/FilterForm/FilterForm.vue'
import ServerTable from '../components/ServerTable/ServerTable.vue'
import ServerChart from '../components/ServerChart/ServerChart.vue'
export default {
  data () {
    return {
      showChartFlag :false,
      showTableFlag :false,
      showFilterFlag : false,
      reportInfo:{
        id:'',
        queryImmediately:false,
        paramsInfo:[],
        tableInfo:{},
        chartInfo:{}
      },
      queryParams:{},
      phoneFlag:false,
    };
  },
  computed:{
    phoneClass(){
      if(this.$route.params.pc == 'Mobile'){
        this.phoneFlag = true
        return 'phone-style-class'  
        //this.tableHeight = 1*100%
      
      }else if(this.$route.params.pc == 'PC'){
        return 'pc-style-class'
      }
    },
    reportTitle(){
      if(this.reportInfo.title){
        return this.reportInfo.title
      }else if(this.reportInfo.tableInfo.title){
        return this.reportInfo.tableInfo.title
      }else{
        return ""
      }
    },
    reportTableTitle(){
      if(this.reportInfo.tableInfo.title){
        return this.reportInfo.tableInfo.title
      }else{
        return ""
      }
    },
    initApiUrl:function(){
      return 'api/report/init?id='+this.$route.params.id+'&engine='+this.$route.params.engine;   
    },
    iconArrowFilter:function(){
      return this.showFilterFlag == true ? 'el-icon-arrow-down':'el-icon-arrow-up';
    },
    iconArrowTable:function(){
      return this.showTableFlag == true ? 'el-icon-arrow-down':'el-icon-arrow-up';
    },
    iconArrowChart:function(){
      return this.showChartFlag == true ? 'el-icon-arrow-down':'el-icon-arrow-up';
    },
    pageSize:function(){
      if(this.reportInfo.tableInfo.pageSize)
        return this.reportInfo.tableInfo.pageSize 
      else 
        return 0;
    },
    searchParams:function(){
      return {
        id:this.$route.params.id,
        engine:this.$route.params.engine,
        condition:this.queryParams,
        pageSize: this.pageSize
      }
    }
  },
  methods: {
    queryParamsChange(val){
         this.queryParams = {...val};
    },
    getReportInfo(){
      this.$Http('get',this.initApiUrl).then((res)=>{
          this.reportInfo = {...this.reportInfo,...res.data };
          if(this.reportInfo.paramsInfo.length>0){
            this.showFilterFlag =true;        
          }
          if(this.reportInfo.tableInfo.columns.length>0){
            this.showTableFlag =true;        
          }
          if(this.reportInfo.chartInfo.series){
            this.showChartFlag =true;        
          }
          if(this.reportInfo.queryImmediately){
            //调用api查询数据时，过滤参数的值是从查询按钮触发取值的
            //必填的日期类型控件在定义中有可能没有默认值，我们在组件中设置了默认值（没有在api中设置是因为多种解析引擎都需要设置）
            //因为设计问题，我们想实现立即查询的效果，就要从这里触发查询按钮事件，并且必须等到过滤组件DOM完成刷新后在异步调用
            //项目初期对vue理解的不深，目前设计的过滤参数的传递方式应该是比较变扭的，需要重构
            this.$refs.filter.$nextTick(function(){
               this.submitForm('ruleForm');
            })          
          }
      });
    },
    showToggle(type){
      if(type == 'filter'){
        this.showFilterFlag =!this.showFilterFlag;        
      }
      if(type == 'table'){
        this.showTableFlag =!this.showTableFlag;        
      }
      if(type == 'chart'){
        this.showChartFlag =!this.showChartFlag;        
      }
    },
    searchData(){
      this.$Http('post',"api/report/search",this.searchParams).then((res)=>{

        console.log(res.data)
        if(res.data.tableInfo){
          this.reportInfo.tableInfo = Object.assign({},this.reportInfo.tableInfo,res.data.tableInfo); 
          if(this.phoneFlag){
            for(let i in this.reportInfo.tableInfo.columns){
              this.$set(this.reportInfo.tableInfo.columns[i],'isFrozen',false)
            }
            this.showFilterFlag = false;
          }
          this.showTableFlag =true; 
        }
        if(res.data.chartInfo.dataset){          
          this.$set(this.reportInfo.chartInfo,'dataset',res.data.chartInfo.dataset);
          this.showChartFlag =true; 
        }   
      });
    }
  },
  created(){
    this.getReportInfo();
  },
  beforeRouteUpdate (to, from, next) {
      this.reload();
      next();
  },
  inject:['reload'],
  components: {
    ServerChart,
    ServerTable,
    FilterForm 
  }
}
</script>
<style>
.report-show-wrapper{
  padding:0;
  box-sizing: border-box;
}
.chart-wrapper{
  width: 100%;
  display: flex;
  justify-content:center;
   padding:28px 22px 26px 22px;
}
.filter-tools,.report-table-wrapper, .chart-wrapper{
  position: relative;
}
.report-table-wrapper{
  padding:28px 22px 26px 22px;
}
.chart-wrapper-hide{
  padding:0 22px;
}
.filter-tools{
  padding:18px 22px 16px 22px;
  border-bottom: 1px solid #E1E8F5;
}
.filter-toggle-wrapper{
  margin-left: 49%;
  width: 2%;
  min-width: 30px;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  text-align: center;
  color: #7591bc;
  background-color:#DDE6F5;
  margin-bottom: 10px;
}
.img-toggle{
  height: 16px;
}
.icon-toggle{
  font-size: 16px;
}
.chart-toggle-wrapper i,.table-toggle-wrapper i{
  font-size: 14px;
  vertical-align: top;
}
.chart-toggle-wrapper .icon-toggle,.table-toggle-wrapper .icon-toggle{
  margin-left: 6px;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateY(-100%);
  opacity: 0;
}
.fade-enter-active {
  transition: all .3s ease;
}
.fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.report-title{
  height: 14px;
  line-height: 14px;
  padding: 0 22px;
  margin: 0;
  margin-bottom: 15px;
  font-size: 0;
  color: #7591bc;
  cursor: pointer;
}
.phone-style-class .filter-tools, .phone-style-class .report-table-wrapper, .phone-style-class .chart-wrapper{
  padding:0;
  border-bottom: none;
}
.phone-style-class .filter-tools{
  border-top: 1px solid#E1E8F5;
}
.phone-style-class .report-title{
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  margin: 0;
  margin-bottom: 15px;
  font-size: 0;
  color: #999;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #ddd;
  background-color: #f5f5ff;
}
.phone-style-class .chart-toggle-wrapper i,.phone-style-class .table-toggle-wrapper i {
  vertical-align: baseline;
}
.phone-style-class .phone-filter-tools{
  border-top: none;
}
</style>
