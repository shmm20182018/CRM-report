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
                <div class="canshu-source canshu-title-item">数据源</div>
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
                        <el-select v-model="paramMatch.lbracket" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option label="(" value="("></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-source canshu-data-item">
                    <el-form-item prop="dataSource">
                        <el-select v-model="paramMatch.dataSource" clearable @focus="changeParamIndex(index)" :disabled="true" placeholder="">
                            <el-option v-for="(obj,index) in step.dataSource" :key="index" :label="obj.name" :value="obj.id+','+obj.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-field canshu-data-item">
                    <el-form-item prop="field">
                        <el-select v-model="paramMatch.field" filterable clearable placeholder=""  @change="changeParamField(index)" @focus="changeParamIndex(index)">
                            <el-option  v-for="(obj,index) in checkedFieldList[selectDSIndex]" :key="index" :label="obj.label" :value="obj.field+','+obj.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-formula canshu-data-item">
                    <el-form-item>
                        <el-input  v-model="paramMatch.formula" :disabled="true"></el-input>  
                    </el-form-item>
                </div>
                <div class="canshu-paramType canshu-data-item">
                    <el-form-item prop="paramType">
                        <el-select v-model="paramMatch.paramType" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option v-for="(obj,index) in paramTypes" :key="index" :label="obj.name" :value="obj.value+','+obj.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-param canshu-data-item">
                    <el-form-item prop="param">
                        <el-select v-model="paramMatch.param" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option  v-for="(filterParam,index) in filterParams" :key="index" :label="filterParam.name" :value="filterParam.code+','+filterParam.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-rbracket canshu-data-item">
                    <el-form-item >
                        <el-select v-model="paramMatch.rbracket" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option label=")" value=")"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="canshu-relation canshu-data-item">
                    <el-form-item>
                        <el-select v-model="paramMatch.relation" clearable placeholder="" @focus="changeParamIndex(index)">
                            <el-option label="并且" value="and,并且"></el-option>
                            <el-option label="或者" value="or,或者"></el-option>
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
  props:['step','selectDSIndex','checkedFieldList','filterParams'],
  data () {
    return {
      dragFormulaDOM:'',
      paramFormulaShowFlag:false,//公式配置
      filterParamIndex:-1,
      paramMatchArray:[],
      paramMatchIndex:0,
      paramRules:{
        dataSource:[{required:true,trigger: 'blur'}],
        field:[{required:true,trigger: 'blur'}],
        paramType:[{required:true,trigger: 'blur'}],
        param:[{required:true,trigger: 'blur'}]
      },
      paramTypes:[
          {name:'等于',value:'='},
          {name:'不等于',value:'!='},
          {name:'大于',value:'>'},
          {name:'大于等于',value:'>='},
          {name:'小于',value:'<'},
          {name:'小于等于',value:'<='},
          {name:'包含',value:'like'},
          {name:'被包含',value:'in'}
      ]
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
          this.paramMatchIndex = this.paramMatchArray.length;
      }
      var ds = this.step.dataSource[this.selectDSIndex]
      this.paramMatchArray.push({
          lbracket:'', 
          dataSource:ds.id+','+ds.name,
          field:'',
          formula:'',
          paramType:'',
          param:'',
          rbracket:'',
          relation:'',
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
        if(this.paramMatchArray.length){
            this.validateParam().then((paramValid)=>{
                if(paramValid){
                    this.step.dataSource[this.selectDSIndex].paramMatchText = '' 
                     this.step.dataSource[this.selectDSIndex].paramMatchCode = ''  
                    for(let i in this.paramMatchArray){
                        var paramMatch = this.paramMatchArray[i]
                        var dataSource = paramMatch.dataSource.split(',')
                        var field = paramMatch.field.split(',');
                        var paramType = paramMatch.paramType.split(',')
                        var param = paramMatch.param.split(',')
                        var relation = paramMatch.relation?paramMatch.relation.split(','):[[],[]]
                        this.step.dataSource[this.selectDSIndex].paramMatchText += paramMatch.lbracket+'@'+dataSource[1]+'@'+
                            field[1]+'@'+paramType[1]+'@'+param[1]+'@'+paramMatch.rbracket+'@'+relation[1]+';'

                        this.step.dataSource[this.selectDSIndex].paramMatchCode += paramMatch.lbracket+field[0]+
                            paramType[0]+':'+param[0]+ paramMatch.rbracket+' '+relation[0]+' '
                    }
                    this.step.dataSource[this.selectDSIndex].paramMatchText = 
                        this.step.dataSource[this.selectDSIndex].paramMatchText.substring(0,this.step.dataSource[this.selectDSIndex].paramMatchText.length-1)
                    //console.log(this.step.dataSource[this.selectDSIndex].paramMatchCode)
                  
                    this.openMessage('保存成功!','success');
                    this.$emit('on-close-param')
                }else{ 
                    this.openMessage('选项不能为空!，若放弃请删除该行!','warning');
                    return false;
                }
            })
        }
    },
    validateParam(){
        var paramValid = true
        for(let i in this.paramMatchArray){
            if(paramValid){
                this.$refs.paramConForm[i].validate((valid)=>{
                    if(!valid){  
                        paramValid = false;   
                    }
                })
            }
        }
        return  Promise.resolve(paramValid)   
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
        this.openMessage('公式设置成功！','success');
        this.paramFormulaShowFlag = false;
    }
  },
  created(){
      var ds = this.step.dataSource[this.selectDSIndex]
        if(ds.paramMatchText){
            var codeFieldArr = ds.paramMatchCode.match(/[A-Z]*_{1}[A-Z]*/g)//字段

            var codeTypeArr = ds.paramMatchCode.match(/_{1}[A-Z]*(.*?):/g)
            codeTypeArr = codeTypeArr.map(type => {//参数方式
                return  type.match(/_{1}[A-Z]*(\S*):/)[1]
    
            });
            var codeParamArr = ds.paramMatchCode.match(/:(.*?)(\)| )/g)
            codeParamArr = codeParamArr.map(param => {//参数编号
               return  param.match(/:(\S*)(\)| )/)[1]
     
            });
            //console.log(codeParamArr,codeTypeArr,codeRelationArr)
            var paramMatchTextArr = ds.paramMatchText.split(';')
            for(let i in paramMatchTextArr){
                var textStr = paramMatchTextArr[i].split('@')
                this.paramMatchArray.push({
                    lbracket:textStr[0], 
                    dataSource:ds.id+','+ds.name,
                    field:codeFieldArr[i]+','+textStr[2],
                    formula:'',
                    paramType:codeTypeArr[i]+','+textStr[3],
                    param:codeParamArr[i]+','+textStr[4],
                    rbracket:textStr[5],
                    relation:textStr[6]?(textStr[6]=='并且'?('and,'+textStr[6]):('or,'+textStr[6])):'',
                })
            }
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
    overflow-y: auto;
    overflow-x: hidden;
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
    flex: 0 0 auto;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.canshu-lbracket,.canshu-rbracket{
    flex: 0 0 auto;
    width: 60px;
    box-sizing: border-box;
}
.canshu-paramType,.canshu-relation{
    flex: 0 0 auto;
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
    border-radius: 0;
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
.data-define .el-form-item.is-error .el-input__inner,.data-define .el-form-item.is-error .el-input__inner:focus {
    border-bottom:1px solid  #f56c6c;
}
</style>