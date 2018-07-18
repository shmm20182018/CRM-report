<template>
  <div>
    <p class="config-title" id="dragassoc">
        <i class="el-icon-menu"></i>
        <span>数据源列名匹配</span>
        <i class="el-icon-close close-config" @click="closeAssoc"></i>
    </p>
    <div class="assoc-config-menu">
        <ul>
            <li @click="addAssoc">新增</li>
            <li @click="delAssoc">删除</li>
            <li @click="saveAssoc">保存</li>
        </ul>
    </div>
    <div class="assoc-config-content"> 
        <div class="assoc-config-table">
            <div class="assoc-list-title">
                <div class="assoc-select assoc-title-item"></div>
                <div class="assoc-ds-first assoc-title-item">对象1</div>
                <div class="assoc-field-first assoc-title-item">对象字段1</div>
                <div class="assoc-symbol assoc-title-item">连接符</div>
                <div class="assoc-ds-second assoc-title-item">对象2</div>
                <div class="assoc-field-second assoc-title-item">对象字段2</div>
            </div>
            <div v-for="(assocFormula,index) in assocFormulaArray" :key="index" class="assoc-list-item">
            <el-form :model="assocFormula" ref="assocConForm" :rules="assocRules" :show-message="false" >
                <div class="assoc-select assoc-data-item" @click="changeAssocIndex(index)">
                    <i v-show="assocFormulaIndex==index" class="el-icon-check"></i>
                </div>  
                <div class="assoc-ds-first assoc-data-item">
                    <el-form-item prop="dsFirst">
                        <el-select v-model="assocFormula.dsFirst" clearable @focus="changeAssocIndex(index)" @change="changeAssocSourceIndex(assocFormula.dsFirst,index,'sourceIndex1','fieldFirst')" placeholder="请选择">
                            <el-option v-for="(ds,index) in step.dataSource" :key="index" :label="ds.name" :value="ds.id+','+ds.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="assoc-field-first assoc-data-item">
                    <el-form-item prop="fieldFirst">
                        <el-select v-model="assocFormula.fieldFirst" clearable filterable placeholder="请选择" @focus="changeAssocIndex(index)">
                            <el-option  v-for="(obj,index) in checkedColList[assocFormula.sourceIndex1]" :key="index" :label="obj.label" :value="obj.field+','+obj.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="assoc-symbol assoc-data-item"  @click="changeAssocIndex(index)">
                    =
                </div>
                <div class="assoc-ds-second assoc-data-item">
                    <el-form-item prop="dsSecond">
                        <el-select v-model="assocFormula.dsSecond" clearable @focus="changeAssocIndex(index)" @change="changeAssocSourceIndex(assocFormula.dsSecond,index,'sourceIndex2','fieldSecond')" placeholder="请选择">
                            <el-option v-for="(ds,index) in step.dataSource" :key="index" :label="ds.name" :value="ds.id+','+ds.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="assoc-field-second assoc-data-item">
                    <el-form-item prop="fieldSecond">
                        <el-select v-model="assocFormula.fieldSecond" clearable filterable  placeholder="请选择" @focus="changeAssocIndex(index)">
                            <el-option  v-for="(obj,index) in checkedColList[assocFormula.sourceIndex2]" :key="index" :label="obj.label" :value="obj.field+','+obj.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            </div> 
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['step'],
  data () {
    return {
      assocFormulaIndex:0,
      assocFormulaArray:[],
      assocRules:{
        dsFirst:[{required:true,trigger: 'blur'}],
        fieldFirst:[{required:true,trigger: 'blur'}],
        dsSecond:[{required:true,trigger: 'blur'}],
        fieldSecond:[{required:true,trigger: 'change'}]
      },
      assocValid:true
    };
  },
  computed: {
    checkedColList(){
        var list = [];
        for(let i in  this.step.dataSource){
            list.push([])
            var fields = this.step.dataSource[i].fields;
            var findKeys = function(fields){
                fields.forEach(function(field){
                    if(field.useFlag=='1'){
                        list[i].push({
                            id:field.id,
                            label:field.label,
                            field:field.field,
                        });
                    }
                    if(field.hasChild){
                        findKeys(field.children);
                    }
                });
            }    
            findKeys(fields);          
        }
        return list;
    }
  },
  created(){
    if(this.step.operation.mapColFormula.length){
        var mapColFormulaList = this.step.operation.mapColFormula.split(',')
        var mapColTextList = this.step.operation.mapColText.split(',')
        for(let i=0;i<mapColFormulaList.length;i++){
            var mapColFormula= mapColFormulaList[i].split('=')
            var leftMapFormula = mapColFormula[0].split('.');
            var rightMapFormula = mapColFormula[1].split('.')

            var mapColText = mapColTextList[i].split('=')
            var leftMapText = mapColText[0].split('.');
            var rightMapText = mapColText[1].split('.')
            var sourceIndex1 = this.step.dataSource.findIndex(function(value, index, arr){
                                    return value.id == leftMapFormula[0];
                                })
            var sourceIndex2 = this.step.dataSource.findIndex(function(value, index, arr){
                                    return value.id == rightMapFormula[0];
                                })                    
           
            this.assocFormulaArray.push({
                dsFirst:leftMapFormula[0]+','+leftMapText[0],
                fieldFirst:leftMapFormula[1]+','+leftMapText[1].substr(1,leftMapText[1].length-2),
                dsSecond:rightMapFormula[0]+','+rightMapText[0],
                fieldSecond:rightMapFormula[1]+','+rightMapText[1].substr(1,rightMapText[1].length-2),
                sourceIndex1:sourceIndex1,
                sourceIndex2:sourceIndex2
            })
        }
    }
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
    closeAssoc(){
        this.$emit('on-close-assoc')
    },
    addAssoc(){
        if(this.assocFormulaArray.length){
            this.assocFormulaIndex++;
        }
        this.assocFormulaArray.push({
            dsFirst:'',
            fieldFirst:'',
            dsSecond:'',
            fieldSecond:'',
            sourceIndex1:0,
            sourceIndex2:0
        });
    },
    delAssoc(){
        if(this.assocFormulaArray.length){
            this.assocFormulaArray.splice(this.assocFormulaIndex,1);
        }
        if(this.assocFormulaIndex){
            this.assocFormulaIndex--;
        }  
    },
    saveAssoc(){
        if(this.assocFormulaArray.length){
            this.validateAssoc().then(()=>{
                if(this.assocValid){  
                    this.step.operation.mapColText = ''
                    this.step.operation.mapColFormula = ''
                    for(let assoc of  this.assocFormulaArray){
                        var dsFirst = assoc.dsFirst.split(',')
                        var fieldFirst = assoc.fieldFirst.split(',')
                        var fieldSecond = assoc.fieldSecond.split(',')
                        var dsSecond = assoc.dsSecond.split(',')
                        this.step.operation.mapColText += dsFirst[1] + '.[' + fieldFirst[1]+ ']=' + dsSecond[1] + '.[' + fieldSecond[1] + '],'
                        this.step.operation.mapColFormula += dsFirst[0] + '.' + fieldFirst[0]+ '=' + dsSecond[0] + '.' + fieldSecond[0] + ','
                    }
                    this.step.operation.mapColText = this.step.operation.mapColText.substring(0,this.step.operation.mapColText.length-1)  
                    this.step.operation.mapColFormula = this.step.operation.mapColFormula.substring(0,this.step.operation.mapColFormula.length-1)  
                    this.openMessage('保存成功!','success');
                    this.$emit('on-close-assoc')
                }else{ 
                    this.openMessage('选项不能为空!，若放弃请删除该行!','warning');
                    return false;
                }
            })
        }
    },
    changeAssocIndex(index){
        if(this.assocFormulaIndex == index){
            return false;
        }else{
            this.assocFormulaIndex = index;
        }
    },
    changeAssocSourceIndex(ds,index,sourceIndex,field){
        var id = ds.split(',')
        this.$set(this.assocFormulaArray[index],field,'')
        var source = this.step.dataSource
        for(var i in source){
            if(id[0] == source[i]['id']){
                this.assocFormulaArray[index][sourceIndex] = i;
                break;
            }
        }
    },
    validateAssoc(){
        this.assocValid = true;
        for(let i in this.assocFormulaArray){
                this.$refs.assocConForm[i].validate((valid)=>{
                    if(!valid){  
                       this.assocValid = false;      
                    }
                })
        }
        return  Promise.resolve()   
    }
  }
}

</script>
<style>
.assoc-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.assoc-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.assoc-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.assoc-config-content{
  width: 100%;
  padding: 10px 5px; 
  box-sizing: border-box;
}
.assoc-config-table{
    width: 100%;
    border:1px solid #E6E7EB;
    font-size: 12px;
    height: 380px;
    overflow: auto;
}
.assoc-list-title,.assoc-list-item{
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.assoc-list-title:hover,.assoc-data-item:hover{
    background-color: #f5f7fa;
}
.assoc-list-title{
    display: flex;
    background-color:  #f5f7fa;
}
.assoc-title-item{
    font-size: 12px;
    padding-left: 5px;
    box-sizing: border-box;
}
.assoc-list-item{
    font-size: 12px;
    font-weight: normal;
}
.assoc-list-item .el-form{
    display: flex;
}
.assoc-list-item:hover .el-input__inner,.assoc-list-item:hover .assoc-symbol{
    border-radius: 0;
    background: #E0F4F7;
}
.assoc-title-item,.assoc-data-item{
    border-left: 1px solid #E6E7EB;
}
.assoc-select{
    border-left:none;
    flex: 0 0 32px;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.assoc-symbol{
    flex: 0 0 80px;
    width: 80px;
    text-align: center;
    font-size: 14px;
}
.assoc-ds-first,.assoc-field-first,.assoc-ds-second,.assoc-field-second{
    flex: 0.25;
}
.assoc-data-item .el-form-item {
  margin-bottom: 0;
}
.assoc-data-item .el-form-item__content{
    line-height: 30px;
}
.assoc-data-item .el-select{
    width: 100%;
}
.assoc-data-item .el-input{
    font-size: 12px;
}
.assoc-data-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
    padding-right: 14px;
}
.assoc-formula .el-input__inner{
    padding-right: 5px;
}
.assoc-data-item .el-input__suffix{
    right: 2px;
}
.assoc-data-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.assoc-data-item .el-select .el-input .el-select__caret.is-show-close{
    opacity: 1;
}
.assoc-data-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
}
</style>
