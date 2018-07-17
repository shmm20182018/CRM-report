<template>
  <el-col :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="param.title" :prop="param.id" class="filtertool-text help-tool">
        <el-tooltip :disabled="tooltipFlag" effect="light" :content="toolTipContent" placement="bottom-start" offset="">
            <div style="position:relative">
            <el-input class="help-input" 
                     ref="helpInput" 
                     v-model.lazy="inputShowText"  
                     @focus="focusHandler" 
                     @blur="blurHandler($event)"        
                     :disabled="param.readonly" 
                     placeholder="请输入"
            ></el-input>
            </div>
        </el-tooltip> 
        <i class="el-icon-search" @click="openHelp"></i>
        <transition name="help-slide">
        <div v-if="helpShowFlag" class="help-wrapper-mask" :class="phoneFlag?'phone-help-wrapper-mask':''">
            <div v-if="helpShowFlag" v-drag="dragDOM" class="help-wrapper"  :style="helpStyle">
                <el-card class="box-card" shadow="never">
                    <div v-if="!phoneFlag" slot="header" id="drag" class="clearfix">
                        <span class="card-title">{{tableInfo.title}}</span>
                        <i class="icon-close el-icon-close"  @click="closeHelp"></i>
                    </div>
                    <div class="content-wrapper">
                        <div class="search-form-wrapper">
                            <div v-if="!phoneFlag" class="search-select">
                                <el-select v-model="searchText" class="search-select">
                                    <el-option v-for="tableData in tableInfo.tableData" :key="tableData.F_BH" :value="tableData.F_BH" :label="tableData.F_MC"></el-option>
                                </el-select>
                            </div>      
                            <div class="search-input-col">
                                <el-input v-model="searchText" class="search-input" placeholder="请输入关键词" ></el-input>
                            </div>  
                            <div class="search-icon-col">
                                <i v-if="!phoneFlag" type="primary" class="el-icon-search" @click="onSubmit"></i>
                                <i v-if="phoneFlag" class="phone-search-btn" @click="onSubmit">查询</i>
                            </div>
                        </div>
                        <div class="table-content-wrapper">
                            <v-table  ref='table'
                                id=""
                                :error-content-height = '320'
                                is-vertical-resize
                                :vertical-resize-offset='60'
                                is-horizontal-resize
                                column-width-drag
                                style="width:100%"
                                :multiple-sort="false"
                                :min-height="300"
                                :height="350"
                                odd-bg-color="#F5F9FF"
                                even-bg-color="#FFFFFF"
                                row-click-color="#ffe7e7"                    
                                :row-click="rowClick"
                                :row-dblclick="rowDoubleClick"
                                :columns="tableInfo.columns"
                                :table-data="tableInfo.tableData"
                                :paging-index="(pageIndex-1)*tableInfo.pageSize"
                                :title-row-height="phoneFlag?44:36"
                                :row-height="phoneFlag?44:32"
                                :select-group-change="selectGroupChange"
                                :select-all="selectGroupChange"
                                >
                            </v-table>
                            <div class="footer-wapper clear table-pagination">
                                <div  class="page-wrapper">
                                    <v-pagination size="small" @page-change="pageChange" 
                                        :page-index="pageIndex" 
                                        :total="tableInfo.total"
                                        :page-size="tableInfo.pageSize"
                                        :showPagingCount="1"
                                        :layout="['total', 'pager']"></v-pagination>
                                </div> 
                            </div>
                        </div>                      
                    </div>
                    <div v-if="!phoneFlag" :inline="true"  class="search-form-bottom" size="mini">
                        <div class="search-form-inner">
                            <span class="search-bottom-btn" @click="closeHelp">取消</span>
                            <span class="search-bottom-btn bottom-btn-last" @click="onDetermine">确定</span>
                        </div>  
                    </div>
                </el-card>  
            </div>     
        </div>
        </transition>
      </el-form-item>
    </div>
  </el-col>    
</template>

<script>
import 'vue-easytable/libs/themes-base/index.css'
import {VTable,VPagination} from 'vue-easytable'
export default {
    props:['param','toolSize','ruleFormValue','phoneFlag','ruleForm','paramsInfo'],
    data () {
        return {                       
            dependParamsId: this.param.helpConditions.match(/@(\S*)@/g),        //依赖条件参数编号数组
            curRowData:{}, //当前选中行的数据，主要为单选时确定按钮使用
            selection:[],  //当前选中数据数组，多选时使用
            dragDOM:'',
            internalValue : this.param.defaultValue,
            helpBhValue: '',
            helpMcValue: '',
            inputShowText:this.param.defaultValue,
            showTextState:'default',
            helpShowFlag: false,
            tableInfo:{},
            interTableData:[],
            pageIndex:1,
            searchText:'',
            helpStyle: {
                width: '780px',
                height: '490px',
                position: 'fixed',
                left: 'calc(50% - 390px)',
                top: '50px'
            }
        }
    },
    computed:{
        tooltipFlag(){
             return this.helpBhValue == ''? true:false;
        },
        toolTipContent(){
            return this.helpBhValue+'-'+this.helpMcValue;
        },
        pageCount(){
            return  parseInt((this.tableInfo.total  +  this.tableInfo.pageSize  - 1) / this.tableInfo.pageSize);  
        },
        initRequestData(){
            var data = { queryText: this.searchText,helpTJ:this.getHelpConditions()};
            ({ helpID: data.helpID, helpXH: data.helpBH} = this.param);
            return data;
        },
        onBlurRequestData(){
            var data = { queryText:this.inputShowText,helpTJ:this.getHelpConditions() };
            ({ helpID: data.helpID, helpXH: data.helpBH} = this.param);
            return data;
        },
        searchRequestData(){
            var data = { queryText:this.searchText,pageIndex:this.pageIndex,helpTJ:this.getHelpConditions() };
            ({ helpID: data.helpID, helpXH: data.helpBH} = this.param);
            return data;
        }
    },
    watch:{
        'showTextState':function(val){
            this.getShowText(val);
        },
        'internalValue':function(val){
            this.$emit('rule-form-change',this.param.id,val);
        }
    },
    methods:{
        selectGroupChange(selection){
            this.selection = selection;
        },
        getHelpConditions(){  //替换过依赖条件的值后的帮助条件
            if(this.dependParamsId==null){
                return this.param.helpConditions;
            }
            else{
                var self = this;
                var condStr =  self.param.helpConditions;
                self.dependParamsId.forEach(id => {
                    var _id = id.replace(/@/g,'');
                    if(!self.ruleForm[_id]){
                        var p = self.paramsInfo.find((n) => n.id  == _id);
                        var dependParamName = p.title;
                        self.$message({
                            showClose: true,
                            type: 'warning',
                            message: '必须先选择['+dependParamName+']'
                        });
                        throw new Error( '必须先选择['+dependParamName+']'); //这里是为了阻止程序继续往下走
                    }
                    else{
                        condStr = condStr.replace(new RegExp('%'+id,'g'),"'%"+self.ruleForm[_id]+"'");
                        condStr = condStr.replace(new RegExp(id+'%','g'),"'"+self.ruleForm[_id]+"%'");
                        condStr = condStr.replace(new RegExp(id,'g'),"'"+self.ruleForm[_id]+"'");
                    }
                });
                return condStr;
            }
        },
        setHelpValue(nm,bh,mc){
            this.internalValue = nm;
            this.helpBhValue =  bh;
            this.helpMcValue =  mc;
        },
        getShowText(state){
            if(state == 'default' )
                this.inputShowText = this.internalValue;
            else if(state == 'focus')
                this.inputShowText = this.internalValue ;
            else //blur 
                 this.inputShowText = this.helpMcValue ==''? this.internalValue:this.helpMcValue ;
        },
        onBlurRequest(){
            this.$Http('post','api/help/onblur',this.onBlurRequestData).then((res)=>{
                if(!res.data.result){
                    this.searchText= this.inputShowText;
                    this.setHelpValue('','','');
                    this.openHelp();
                }
                else{
                    this.setHelpValue(res.data.F_NM,res.data.F_BH,res.data.F_MC);
                    this.showTextState ='blur'
                }
            });
        },
        blurHandler(event){
            if(!this.inputShowText && this.internalValue){
                this.setHelpValue(this.param.helpMultiSelect == true ? "('')" :'' ,'','');
                return;
            }
            if((this.helpBhValue=='' || event.target._value!=this.internalValue)&& this.internalValue && !this.param.helpMultiSelect)
                this.onBlurRequest();
            else
                this.showTextState = 'blur';
        },
        focusHandler(){
            this.showTextState = 'focus';
        },
        openHelp(){
            this.$Http('post','api/help/init',this.initRequestData).then((res)=>{
                this.tableInfo = {...this.tableInfo,...res.data };
                console.log(this.tableInfo)
                //帮助多选
                if(this.param.helpMultiSelect)
                     this.tableInfo.columns.unshift({width: 60, titleAlign: 'center',columnAlign:'center',type: 'selection'});
                this.interTableData[1]=this.tableInfo.tableData;
                this.helpShowFlag = true;
                this.$nextTick(()=>{
                    this.dragDOM = document.getElementById('drag')
                })              
            });
        },
        closeHelp(){
            this.helpShowFlag = false;
        },        
        onDetermine(){
            this.rowDoubleClick(null, this.curRowData,null);
        },
        rowDoubleClick(rowIndex, rowData, column){
            var _nm,_bh,_mc;
            
            if(!this.param.helpMultiSelect){
                _nm = rowData['F_NM'];
                _bh = rowData['F_BH'];
                _mc = rowData['F_MC'];
            }
            else{
                _nm = '(';
                _bh = '(';
                _mc = '';

                if(this.selection.length>0){
                    this.selection.forEach((i)=>{
                        _nm +="'"+i['F_NM']+"',"
                        _bh +=i['F_BH']+","
                        _mc +=i['F_MC']+","
                    });
                    _nm=_nm.substr(0,_nm.length-1);
                    _bh=_bh.substr(0,_bh.length-1);
                    _mc=_mc.substr(0,_mc.length-1);
                }
                
                _nm+= ')';
                _bh+= ')';
            }
            this.setHelpValue(_nm,_bh,_mc);
            this.helpShowFlag = false;
            this.inputShowText =  this.helpMcValue;
        },
        rowClick(rowIndex, rowData, column){
            this.curRowData = rowData;
            if(!this.phoneFlag){
                return ;
            }
            this.setHelpValue(rowData['F_NM'],rowData['F_BH'],rowData['F_MC']);
            this.helpShowFlag = false;
            this.inputShowText =  this.helpMcValue;
        },
        pageChange(pageIndex){ 
            this.pageIndex = pageIndex;
            if(this.interTableData[pageIndex]){
                this.tableInfo.tableData =  this.interTableData[pageIndex];
                return;
            }
            this.$Http('post',"api/help/search",this.searchRequestData).then((res)=>{
                this.tableInfo.tableData = res.data.rowData;
                this.tableInfo.total = res.data.total;
                if( this.tableInfo.tableData.length>0)
                    this.interTableData[pageIndex] = this.tableInfo.tableData ;
             });
        },
        onSubmit(){
            this.interTableData.length = 0;
            this.pageChange(1);
        }
    },
    created(){
        if(this.phoneFlag){
            this.helpStyle = {}
        }
    },
    components: {
     VTable,
     VPagination
  }
}
</script>
<style>
.filtertool-text{
  width: 320px;
}
.content-wrapper tbody tr{
    cursor: pointer;
}
.help-wrapper{
    z-index: 1000;
    background:#fafafa;
    border-radius: 2px;
    /*box-shadow:gray 0 0 30px*/
}
.help-wrapper-mask{
    position: fixed;
    left: 0;
    top:0;
    bottom: 0;
    right: 0;
    z-index: 990;
    background: rgba(0,0,0,.3);
}
.help-wrapper .icon-close{
    float: right; 
    width: 24px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    text-align: right;
}
.help-wrapper .el-card {
    border: none;
    background-color: #fafafa;
    color: #333333;
    border-radius: 2px;
    padding: 0;
}
.help-wrapper .el-card__header{
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    color: #346187;
    border-bottom: 1px solid #DAE3F0;
    padding:0 22px;
    margin-bottom: 20px;
}
.help-wrapper .clearfix{
    height: 32px;
    line-height: 32px;
} 
.help-wrapper .content-wrapper{
    padding: 0 22px;
}
.help-wrapper .search-form-wrapper{
    display: flex;
    margin-bottom: 15px;
} 
.help-wrapper .search-form-wrapper .el-icon-search {
    position: static;
    color: #346187;
}
.help-wrapper .search-input-col{
    margin: 0 12px 0 15px;
    flex: 1;
}
.help-wrapper .search-select-col{
    flex: 0 0 250px;
    width: 250px;
}  
.help-wrapper .search-icon-col{
    flex: 0 0 18px;
    width: 18px;
} 
.help-wrapper .search-form-bottom{
    width: 100%;
    margin-top: 10px;
    background: #4c84ba;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    padding: 0 22px;
}    
.help-wrapper .search-bottom-btn{
    float: right;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
}
.help-wrapper .search-bottom-btn:hover{
    color: #ffffff;
}
.help-wrapper .bottom-btn-last{
    margin-right: 20px;
}
.help-wrapper .v-table-title-cell {
    border-color:#dadee9;
}
.help-wrapper .v-table-header, .help-wrapper .v-table-toolbar, .help-wrapper .v-table-pager, .help-wrapper .v-table-footer-inner {
    border-color: #dadee9;;
}
.help-wrapper .v-table-body-cell{
    padding:0 8px;
    border-color: #e9ecf4;
}
.help-wrapper .v-table-class{
    font-size: 12px;
}
.help-wrapper .table-pagination{
    margin:0;
    height: 38px;
    line-height: 38px;
    border: 1px solid #dadee9;
    border-top: none;
    background-color:#eef5ff;
    color: #6C6D6F
}
.help-wrapper .v-page-ul{
    margin:7px 0 7px 0;
}
.help-wrapper .v-page-li {
    margin-right: 0; 
    background-color:transparent; 
    border: none; 
    border-radius: 2px;
}
.help-wrapper .v-page-li a {
    color: #6C6D6F;
}
.help-wrapper .v-page-li-active a {
    color: #fff;
}
.help-wrapper .v-page-prev i, .help-wrapper .v-page-next i {
    color: #6e94cf;
}
.help-wrapper .v-page-disabled i{
    color: #ccc;
}
.help-wrapper .v-page-li-active {
    background-color: #6e94cf;
}
.help-wrapper .v-page-li-active:hover {
    border:none;
    background-color: #6e94cf;
}
.help-wrapper .v-page-total{
    margin: 0 30px 0 17px;
}
.help-wrapper .v-page-prev{
    text-align: left;
}
.help-wrapper .v-page-next{
    text-align: right;
}
.help-wrapper .v-dropdown{
    margin-left: 30px;
    margin-right: 30px;
}
.help-wrapper .v-dropdown a, .help-wrapper .v-dropdown a:visited {
    color: #6C6D6F;
}
.help-wrapper .v-dropdown--small .v-dropdown-selected, .help-wrapper .v-dropdown--small .v-dropdown-items-li {
    font-size: 12px;
    line-height: 22px;
}
.help-wrapper .v-dropdown-selected {
    border: 1px solid #cdd9ec;
    border-radius: 2px;
}
.help-wrapper .v-select-selected-i{
    color: #6e94cf;
    right: 6px;
}
.help-wrapper .v-dropdown-items-li.active a {
    color: #fff;
}
.help-wrapper .v-dropdown-dd,.help-wrapper .v-dropdown-dt{
    background-color: transparent;
} 
.help-wrapper .v-select-selected-span{
    padding-left:0;
}
.help-wrapper .v-page-goto{
    margin: 0 0 0 30px;


}
.help-wrapper .v-page-goto-input {
    padding: 1px 7px;
    border: 1px solid #cdd9ec;
    background-color: transparent;
    border-radius: 2px;
    color: #6C6D6F;
    margin:0 5px;
    vertical-align: top;
    outline: none;
}
.help-wrapper .v-table-header-inner{
    background-color: #eaf3ff;
    border-bottom: 1px solid #dadee9
}
.help-wrapper .v-table-header-inner tbody td:last-child>div{ 
    border-right: #eaf3ff;
}
.help-wrapper .v-table-header-inner tbody td>div{
    border-bottom:none;
}
.help-wrapper .v-table-body table{
   width: 100%;
}
.help-wrapper .v-table-title-class td{
    background-color: #eaf3ff;
    font-weight: normal;
    color: #6C6D6F;
    white-space: nowrap;
    overflow: hidden;
} 
.help-tool form{
    display: inline-block
} 
.help-tool .el-form-item--mini.el-form-item, .help-tool  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
}
.help-tool .page-wrapper .page-total {
    display: inline-block;
    vertical-align: top;
    width: 5%;
    height: 24px;
    line-height: 24px;
    margin: 7px 0;
    font-size: 12px;
}
.help-tool [class^="v-icon-"]:before, .table-wrapper [class*=" v-icon-"]:before {
    width: auto; 
    margin-right: 0; 
    margin-left: 0; 
}
.help-tool .el-card__body {
    padding: 0px;
}
.help-input-title {
    position: absolute;
    left: 15px;
    top: 2px;
    height: 26px;
    line-height: 26px;
    font-size: 12px;
    color: #808080;
    background:#fff;
}
body .el-tooltip__popper.is-dark {
    background: #F5F7F9;
    color: #C3C5C8;
}
.help-tool .v-table-views{
    height: 314px !important;
    background-color: #f5f7fb;
}
.pc-style-class .help-wrapper ::-webkit-scrollbar{  
    width:8px;  
    height:8px;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-track{  
    background: #f6f6f6;  
    border-radius:4px;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-thumb{  
    background: #aaa;  
    border-radius:4px;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-thumb:hover{  
    background: #747474;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-corner{  
    background: #f6f6f6;  
}
.pc-style-class .help-wrapper .v-table-empty-scroll{
    height: 310px !important;
}
.phone-style-class     .help-slide-enter-active {
        transition: all .3s ease;
    }
.phone-style-class     .help-slide-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
.phone-style-class     .help-slide-enter, .help-slide-leave-to{
        transform: translateX(-100%);
        opacity: 0;
    }
.phone-style-class  .phone-help-wrapper-mask{
    position: static;
    background: #fff;
}    
.phone-style-class    .help-wrapper{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    z-index: 1000;
    margin:0;
    background: rgba(7,17,27,0.8);
    box-shadow:none;
    border:none;
}
.phone-style-class .help-wrapper .content-wrapper {
    padding: 0;
}
.phone-style-class .help-wrapper .search-input-col{
    margin: 0;
    height: 40px;
    line-height: 40px;
}
.phone-style-class .filterForm .search-input-col .el-input__inner {
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    border: none;
    padding-left: 24px;
    border-radius: 5px;
}
.phone-style-class  .search-form-wrapper{
    font-size: 14px;
    height: 40px;
    background-color: #0079D2;
    padding: 0 15px;
}
.phone-style-class .help-wrapper .search-icon-col{
    flex: 0 0 30px;
    width: auto;
    color: #fff;
    margin-left: 15px;
    line-height: 40px;
}
.phone-style-class .table-content-wrapper{
    padding: 0 15px;
}
.phone-style-class     .help-wrapper .el-card{
    height: 100%;
}
.phone-style-class    .help-wrapper .el-card__body{
    height: 100%;
}
.phone-style-class    .help-wrapper .content-wrapper{
    height: 100%;
}
.phone-style-class .table-content-wrapper{
    height: calc(100% - 55px)
}
.phone-style-class    .help-wrapper .v-table-views {
    height: calc(100% - 40px) !important;
    overflow: auto;
}
</style>