<template>
  <div class="filterForm" :class="isLineFeed?'':'filter-last-search-filterForm'">
    <el-form class="wathet-filter-style demo-ruleForm" 
      :show-message="false" 
      label-position='left'
      label-width="80px" 
      :model="ruleForm" 
      :inline="true" 
      :rules="rules"
      ref="ruleForm"
      size="mini">
      <el-row :gutter="30">
        <component :toolSize="toolColSize" 
                   v-for="(param) in paramsInfo" 
                   :is="param.componentName" 
                   :param="param" 
                   :ruleForm="ruleForm"
                   :paramsInfo ="paramsInfo"
                   @rule-form-change="ruleFormChange"  
                   :key="param.id"
                   :phoneFlag="phoneFlag"></component>
         <el-col :span="6"  v-if="isLineFeed && !phoneFlag">
          <div class="grid-content">
            <el-form-item :class="filtertoolbtn" class="filter-last-search-btn">
              <i  class="el-icon-search" @click.prevent="submitForm('ruleForm')"></i>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <i v-if="!isLineFeed && !phoneFlag"  class="el-icon-search last-search-btn" @click.prevent="submitForm('ruleForm')"></i>
    <el-form v-if="phoneFlag" class="phone-filter-btn-form" size="mini">
        <el-button class="phone-filter-btn-right" type="primary" @click.prevent="submitForm('ruleForm')">查询</el-button>
        <el-button  @click="resetForm('ruleForm')">重置</el-button>
     </el-form>
  </div>
</template>
<script>
import texttool from '@/components/filtertools/texttool.vue'
import selecttool from '@/components/filtertools/selecttool.vue'
import datetool from '@/components/filtertools/datetool.vue'
import helptool from '@/components/filtertools/helptool.vue'
export default {
  props:['paramsInfo','queryParams','phoneFlag'],
  data() {
    return {
      isLineFeed:true,//查询按钮布局
      ruleForm: {},
      rules: {},
    };
  },
  computed:{
    //过滤组件占得格数
    toolColSize:function(){
      if(this.$route.params.pc == 'Mobile'){
          return 24
      }else if(this.$route.params.pc == 'PC'){
          return 6
      }
    },
    filtertoolbtn(){
      if(this.paramsInfo.length){
        if(this.paramsInfo.length%4 == 0 ){
          this.isLineFeed = false
          return 'filtertool-btn'
        }else{
          this.isLineFeed = true
          return  ''
        }
      }else{
        this.isLineFeed = true
        return  ''
      }
    }
  },
  watch:{
    'paramsInfo':{
         handler: function (newVal) {
            if(this.paramsInfo){
              this.paramsInfo.forEach(item => {
                 if(item.helpMultiSelect)
                    this.$set(this.ruleForm,item.id,"('')");
                 else
                    this.$set(this.ruleForm,item.id,item.defaultValue);
                 this.$set(this.rules,item.id,[{required: item.mandatory, trigger: '' }]);
              });
            }
          },
         deep: true
    }
  },
  methods: {
    ruleFormChange(id,newVal){
      this.$set(this.ruleForm,id,newVal);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {       
             this.$emit('query-params-change',this.ruleForm);
             this.$emit('search-data');
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(1111)
      this.$refs[formName].resetFields();
    }
  },
  components: {
     texttool,
     selecttool,
     datetool,
     helptool
  }
}
</script>
<style>
  .filterForm .el-input__inner {
    border-radius: 0px; 
    border: 1px solid #D4DEEE;
    color: #606266;
  }
  .filterForm .el-input__prefix,.filterForm .el-input__suffix,
  .filterForm .el-select .el-input .el-select__caret{
    color: #7591bc;
  }
  .filterForm .el-select .el-input .el-select__caret.is-show-close:hover {
    color: #7591bc;
  }
  .filterForm .el-input.is-disabled .el-input__prefix,
  .filterForm .el-input.is-disabled .el-input__suffix,
  .filterForm .el-select .el-input.is-disabled .el-select__caret{
    color: #c0c4cc;
  }
 .filterForm .el-form-item__label{
    font-size: 12px
  }
  .filterForm .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .filterForm .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    display: flex;
    align-items: center;
    width: 100%;
  }
  .filterForm .el-form-item__content{
    flex:1;
    position: relative;
  }
  .filterForm .el-icon-search{
    position: absolute;
    top: 6px;
    right: 5px;
    font-size: 18px;
    color: #C3C5C8;
  }
  .filterForm .filter-last-search-btn .el-icon-search{
    left: 0;
    right: auto;
    color: #7591bc;
  }
  .filterForm .el-icon-search:hover{
    color: #7591bc;
    cursor: pointer;
  } 
  .filterForm  .el-form--inline .el-form-item__label {
    flex: 0 0 80px;
    line-height: 14px;
    color: #333333;
  }
 .filterForm   .el-select{
    width: 100%;
  }
  .filterForm .el-select .el-input__inner{
    background-color: #eaf3ff;
  }
  .filterForm .el-select .el-input.is-disabled .el-input__inner{
    background-color: #f5f7fa;
  }
  .filterForm .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
 .filterForm   .green-style .el-form-item.is-success .el-input__inner,  .green-style .el-form-item.is-success .el-input__inner:focus, .green-style .el-form-item.is-success .el-textarea__inner,  .green-style .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #03A656;
  }
 .filterForm   .wathet-filter-style .el-form-item.is-success .el-input__inner, .wathet-filter-style .el-form-item.is-success .el-input__inner:focus, .wathet-filter-style .el-form-item.is-success .el-textarea__inner, .wathet-filter-style  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #D4DEEE;
  }
 body .el-select-dropdown__item {
    font-size: 12px;
    padding: 0px 15px;
    color: #606266;
    height: 24px;
    line-height: 24px;
  }
  body .el-select-dropdown__item span{
    line-height: 24px !important;
  }
  body .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  .filter-last-search-filterForm{
    padding-right: 20px;
   }
  .filter-last-search-filterForm .last-search-btn{
     top: auto;
     bottom: 30px;
     color: #7591bc;
   }
  .phone-style-class .filterForm .el-form-item__content{
    flex: 1;
  }
  .phone-style-class .filterForm .el-form-item__label{
    font-size: 14px
  }
  .phone-style-class  .filterForm .filtertool-btn{
    padding-left: 0;
  }  
  .phone-style-class  .filterForm .el-button--mini, .el-button--mini.is-round {
    padding: 11px 15px;
    width: 100%;
  }
 .phone-style-class   .filterForm .el-input--mini .el-input__inner {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    border: none;
  }
 .phone-style-class .filterForm .el-form-item.is-error .el-input__inner{
   border-bottom:1px solid #f56c6c;
  }
  .phone-style-class .filterForm .el-select .el-input__inner {
    background-color: #ffffff;
  }
  .phone-style-class [class*=el-col-] {
    border-bottom: 1px solid #eaeaea;
  }
  .phone-style-class .filterForm .el-form-item--mini.el-form-item, .phone-style-class .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
  .phone-style-class  .filterForm .el-icon-search{
    top: 12px;
  } 
  .phone-style-class .filterForm .el-form--inline .el-form-item__label {
    flex: 0 0 60px;
    line-height: 16px;
    color: #666;
    padding: 0;
    margin-right: 15px;
  }
  .phone-style-class .filterForm .el-input--mini .el-input__icon {
    text-align: left;
  }
  .phone-style-class .filterForm .el-input--prefix .el-input__inner {
    padding-left: 18px;
  }
  .phone-style-class .filterForm .el-input__inner{
    padding-left: 0;
  }
  .phone-style-class .filterForm  .el-input__prefix{
    left:0;
  }
  .phone-style-class .el-input.is-disabled .el-input__inner{
    background: #f5f7fa;
  }
  .phone-style-class  .el-row{
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .phone-style-class .filter-toggle-wrapper {
    margin-left: calc(50% - 15px);
    width: 30px;
    margin-bottom: 0;
}
  .phone-style-class ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:    #ccc;
    font-size: 14px;
  }
  .phone-style-class :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:    #ccc;
    font-size: 14px;
  }
  .phone-style-class ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:    #ccc;
    font-size: 14px;
  }
  .phone-style-class :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color:    #ccc;
    font-size: 14px;
  }
  .phone-style-class ::-ms-input-placeholder { /* Microsoft Edge */
    color:    #ccc;
    font-size: 14px;
  }
  .phone-filter-btn-form{
     height: 48px;
     line-height: 48px;
  }
  .phone-filter-btn-form .el-button {
    float: right;
    padding: 8px 20px;
    border-radius: 6px;
    margin-top: 8px;
}
.phone-filter-btn-right{
  margin-left: 10px;
  margin-right: 12px;
}
</style>