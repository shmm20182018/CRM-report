<template>
  <div>
    <p class="config-title" id="dragParam">
        <i class="el-icon-menu"></i>
        <span>{{'参数设置'}}</span>
        <i class="el-icon-close close-config" @click="closeCan"></i>
    </p>
    <div class="canshu-config-menu">
        <ul>
            <li @click="addParam">新增</li>
            <li @click="delParam">删除</li>
            <li @click="saveParam">保存</li>
            <li @click="openParamFormula">公式处理</li>
        </ul>
    </div>
    <div class="canshu-config-content"> 
        <div class="canshu-config-table">
            <div class="canshu-list-title">
                <div class="canshu-select canshu-title-item"></div>
                <div class="canshu-lbracket canshu-title-item">括号</div>
                <div class="canshu-source canshu-title-item">操作对象</div>
                <div class="canshu-field canshu-title-item">对象字段</div>
                <div class="canshu-formula canshu-title-item">公式处理结果</div>
                <div class="canshu-paramType canshu-title-item">对应参数方式</div>
                <div class="canshu-param canshu-title-item">参数</div>
                <div class="canshu-rbracket canshu-title-item">括号</div>
                <div class="canshu-relation canshu-title-item">关联关系</div>
            </div>
            <div v-for="(paramMatch,index) in paramMatchArray" :key="index" class="canshu-list-item">
            <el-form :model="paramMatch" ref="paramConForm" :rules="paramRules" :show-message="false">
                <div class="canshu-select canshu-data-item" @click="changeParamIndex(index)">
                    <i v-show="paramMatchIndex==index" class="el-icon-check"></i>
                </div>  
                <div class="canshu-lbracket canshu-data-item">
                    <el-form-item >
                        <el-select v-model="paramMatch.lbracket" clearable @focus="changeParamIndex(index)" placeholder="">
                            <el-option label="(" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-source canshu-data-item">
                    <el-form-item prop="dataSource">
                        <el-select v-model="paramMatch.dataSource" clearable @focus="changeParamIndex(index)" @change="changeParamSourceIndex(paramMatch.dataSource,index)" placeholder="">
                            <el-option v-for="(obj,index) in step.dataSource" :key="index" :label="obj.name" :value="obj.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-field canshu-data-item">
                    <el-form-item prop="field">
                        <el-select v-model="paramMatch.field" filterable clearable placeholder=""  @change="changeParamField(index)" @focus="changeParamIndex(index)">
                            <el-option  v-for="(obj,index) in checkedFieldList[paramMatch.sourceIndex]" :key="index" :label="obj.label" :value="obj.id+','+obj.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-formula canshu-data-item">
                    <el-form-item>
                        <el-input  v-model="paramMatch.formula" :disabled="true"></el-input>  
                    </el-form-item>
                </div>
                <div class="canshu-paramType canshu-data-item">
                    <el-form-item>
                        <el-select v-model="paramMatch.paramType" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option v-for="(obj,index) in paramTypes" :key="index" :label="obj.name" :value="obj.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-param canshu-data-item">
                    <el-form-item>
                        <el-select v-model="paramMatch.param" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option  v-for="(filterParam,index) in filterParams" :key="index" :label="filterParam.code" :value="filterParam.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-rbracket canshu-data-item">
                    <el-form-item >
                        <el-select v-model="paramMatch.lbracket" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option label=")" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-relation canshu-data-item">
                    <el-form-item prop="relation">
                        <el-select v-model="paramMatch.relation" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option label="并且" value="0"></el-option>
                            <el-option label="或者" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            </div>
        </div>
    </div>
    <formula-config v-if="paramFormulaShowFlag"  v-drag="dragFormulaDOM" class="formula-config-wrapper"
          :formulaFieldValue = paramMatchArray[paramMatchIndex].formula
          @on-close-formula="closeParamFormula" 
          @on-save-formula="saveParamFormula">
    </formula-config>
  </div>
</template>

<script>
import FormulaConfig from './FormulaConfig.vue'//公式设置
export default {
  props:['step','paramMatchArray','checkedFieldList','filterParams'],
  data () {
    return {
      dragFormulaDOM:'',
      paramFormulaShowFlag:false,//公式配置
      paramMatchIndex:0,
      paramRules:{
        dataSource:[{required:true,trigger: 'blur'}],
        field:[{required:true,trigger: 'blur'}],
        relation:[{required:true,trigger: 'blur'}]
      },
      paramTypes:[
          {name:'等于',value:'1'},
          {name:'不等于',value:'2'},
          {name:'大于',value:'3'},
          {name:'大于等于',value:'4'},
          {name:'小于',value:'5'},
          {name:'小于等于',value:'6'},
          {name:'包含',value:'7'},
          {name:'被包含',value:'8'}
      ],
    };
  },
  methods: {
    openMessage(msg,type){
      this.$message({
        showClose: true,
        message: msg,
        type: type,
        duration:'1000'
      })
    },
    addParam(){
      if(this.paramMatchArray.length){
          this.paramMatchIndex++;
      }
      this.paramMatchArray.push({
          lbracket:'', 
          dataSource:'',
          field:'',
          formula:'',
          paramType:'',
          param:'',
          rbracket:'',
          relation:'',
          sourceIndex:0
      });
    },
    delParam(){
        if(this.paramMatchArray.length){
            this.paramMatchArray.splice(this.paramMatchIndex,1);
        }
        if(this.paramMatchIndex){
            this.paramMatchIndex--;
        }  
    },
    saveParam(){

    },
    changeParamIndex(index){
      if(this.paramMatchIndex == index){
          return false;
      }else{
          this.paramMatchIndex = index;
      }
    },
    changeParamField(index){
      this.paramMatchArray[index]['formula'] = ''
    },
    changeParamSourceIndex(id,index){
      this.$set(this.paramMatchArray[index],'field','')
      var source = this.step['dataSource']
      for(var i in source){
          if(id == source[i]['id']){
              this.paramMatchArray[index]['sourceIndex'] = i;
              break;
          }
      }
      if(this.paramMatchIndex == index){
          return false;
      }else{
          this.paramMatchIndex = index;
      }
    },
    closeCan(){
        this.$emit('on-close-param');
    },
    openParamFormula(){
        var fieldValue = this.paramMatchArray[this.paramMatchIndex]['field'].split(',')
        this.paramMatchArray[this.paramMatchIndex]['formula'] = fieldValue[1],
        this.paramFormulaShowFlag = true;
        this.$nextTick(()=>{
            this.dragFormulaDOM = document.getElementById('dragFormula')
        })  
    },
    closeParamFormula(){
        this.paramFormulaShowFlag = false;
    },
    saveParamFormula(formulaString){//参数公式保存
        this.paramMatchArray[this.paramMatchIndex]['formula'] = formulaString
        this.openMessage('保存成功！','success');
        this.paramFormulaShowFlag = false;
    }
  },
  components:{
    FormulaConfig:FormulaConfig
  }
}

</script>
<style>
.canshu-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.canshu-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.canshu-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.canshu-config-content{
  width: 100%;
  padding: 10px 5px; 
  box-sizing: border-box;
}
.canshu-config-table{
    width: 100%;
    border:1px solid #E6E7EB;
    font-size: 12px;
    height: 380px;
    overflow: auto;
}
.canshu-list-title,.canshu-list-item{
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.canshu-list-title:hover,.canshu-data-item:hover{
  background-color: #f5f7fa;
}
.canshu-list-title{
    display: flex;
    background-color:  #f5f7fa;
}
.canshu-title-item{
  font-size: 12px;
  padding-left: 5px;
  box-sizing: border-box;
}
.canshu-list-item{
    font-size: 12px;
    font-weight: normal;
}
.canshu-list-item:hover .el-input__inner {
    border-radius: 0;
    background: #E0F4F7;
}
.canshu-title-item,.canshu-data-item{
    border-left: 1px solid #E6E7EB;
}
.canshu-list-item .el-form{
  display: flex;
}
.canshu-select{
    border-left:none;
    flex: 0 0 32px;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.canshu-lbracket,.canshu-rbracket{
    flex: 0 0 60px;
    width: 60px;
    box-sizing: border-box;
}
.canshu-paramType,.canshu-relation{
    flex: 0 0 100px;
    width: 100px;
    box-sizing: border-box;
}
.canshu-source,.canshu-field,.canshu-param,.canshu-formula{
  flex:0.25;
}
.canshu-data-item .el-form-item {
  margin-bottom: 0;
}
.canshu-data-item .el-form-item__content{
    line-height: 30px;
}
.canshu-data-item .el-select{
    width: 100%;
}
.canshu-data-item .el-input{
    font-size: 12px;
}
.canshu-data-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
    padding-right: 14px;
}
.canshu-formula .el-input__inner{
    padding-right: 5px;
}
.canshu-data-item .el-input__suffix{
    right: 2px;
}
.canshu-data-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.canshu-data-item .el-select .el-input .el-select__caret.is-show-close{
    opacity: 1;
}
.canshu-data-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
}
</style>