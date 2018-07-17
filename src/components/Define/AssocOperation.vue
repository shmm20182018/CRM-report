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
            <el-form>
            <div v-for="(assocFormula,index) in assocFormulaArray" :key="index" class="assoc-list-item">
                <div class="assoc-select assoc-data-item" @click="changeAssocIndex(index)">
                    <i v-show="assocFormulaIndex==index" class="el-icon-check"></i>
                </div>  
                <div class="assoc-ds-first assoc-data-item">
                    <el-form-item >
                        <el-select v-model="assocFormula.dsFirst" clearable @focus="changeAssocIndex(index)" @change="changeAssocSourceIndex(assocFormula.dsFirst,index,'sourceIndex1','fieldFirst')" placeholder="请选择">
                            <el-option v-for="(ds,index) in step.dataSource" :key="index" :label="ds.name" :value="ds.id+','+ds.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="assoc-field-first assoc-data-item">
                    <el-form-item >
                        <el-select v-model="assocFormula.fieldFirst" clearable filterable placeholder="请选择" @focus="changeAssocIndex(index)">
                            <el-option  v-for="(obj,index) in step.dataSource[assocFormula.sourceIndex1].fields" :key="index" :label="obj.label" :value="obj.id+','+obj.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="assoc-symbol assoc-data-item"  @click="changeAssocIndex(index)">
                    =
                </div>
                <div class="assoc-ds-second assoc-data-item">
                    <el-form-item >
                        <el-select v-model="assocFormula.dsSecond" clearable @focus="changeAssocIndex(index)" @change="changeAssocSourceIndex(assocFormula.dsSecond,index,'sourceIndex2','fieldSecond')" placeholder="请选择">
                            <el-option v-for="(ds,index) in step.dataSource" :key="index" :label="ds.name" :value="ds.id+','+ds.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="assoc-field-second assoc-data-item">
                    <el-form-item >
                        <el-select v-model="assocFormula.fieldSecond" clearable filterable  placeholder="请选择" @focus="changeAssocIndex(index)">
                            <el-option  v-for="(obj,index) in step.dataSource[assocFormula.sourceIndex2].fields" :key="index" :label="obj.label" :value="obj.id+','+obj.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            </el-form>
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
      assocFormulaArray:[]
    };
  },
  computed: {},
  methods: {
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
        this.step.operation.mapColText = ''
        for(let assoc of  this.assocFormulaArray){
            var dsFirst = assoc.dsFirst.split(',')
            var fieldFirst = assoc.fieldFirst.split(',')
            var fieldSecond = assoc.fieldSecond.split(',')
            var dsSecond = assoc.dsSecond.split(',')
            this.step.operation.mapColText += dsFirst[1] + '.[' + fieldFirst[1]+ ']=' + dsSecond[1] + '.[' + fieldSecond[1] + '],'
        }
        this.step.operation.mapColText = this.step.operation.mapColText.substring(0,this.step.operation.mapColText.length-1)  
        console.log(this.step.operation.mapColText)
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
        var source = this.step['dataSource']
        for(var i in source){
            if(id[0] == source[i]['id']){
                this.assocFormulaArray[index][sourceIndex] = i;
                break;
            }
        }
        if(this.assocFormulaIndex == index){
            return false;
        }else{
            this.assocFormulaIndex = index;
        }
    }
  }
}

</script>
<style>
</style>
