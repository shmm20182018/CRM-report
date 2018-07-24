<template>
  <div>
    <p class="config-title" id="dragAuth">
        <i class="el-icon-menu"></i>
        <span>{{'权限设置'}}</span>
        <i class="el-icon-close close-config" @click="closeMergeField"></i>
    </p>
    <div class="quanxian-config-menu">
        <ul>
            <li @click="addMap">新增</li>
            <li @click="delMap">删除</li>
            <li @click="mapCompelete">设置完毕</li>
            <li >字段公式</li>
        </ul>
    </div>
    <div class="quanxian-config-content">
        <div class="quanxian-list-table">
            <div class="quanxian-list-title">
                <div class="quanxian-select"></div>
                <div class="quanxian-source">对象</div>
                <div class="quanxian-field">匹配字段</div>
            </div>
            <div class="quanxian-list-item" v-for="(mapCol,index) in mapColArray" :key="index">
            <el-form :model="mapCol" ref="mapConForm" :rules="mapRules" :show-message="false" >
                <div class="quanxian-select" @click="changeMapIndex(index)">
                    <i v-show="mapColIndex==index" class="el-icon-check"></i>
                </div>  
                <div class="quanxian-source">
                    <el-form-item prop="dataSource">
                        <el-select v-model="mapCol.dataSource"  @focus="changeMapIndex(index)" @change="changeMapSourceIndex(mapCol.dataSource,index)"  placeholder="请选择">
                            <el-option v-for="(obj,index) in step.dataSource" :key="index" :label="obj.name" :value="obj.id+','+obj.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="quanxian-field">
                    <el-form-item prop="field">
                        <el-select v-model="mapCol.field" filterable clearable placeholder="请选择" @focus="changeMapIndex(index)">
                            <el-option v-for="(obj,index) in checkedFieldList[mapCol.sourceIndex]" :key="index" :label="obj.label" :value="obj.field+','+obj.label"></el-option>
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
    props:['step','checkedFieldList','mergeOperaArray','mergeOperaIndex'],
    data () {
        return {
        mapColArray:[],
        mapColIndex:0,
        mapRules:{
            dataSource:[{required:true,trigger: 'blur'}],
            field:[{required:true,trigger: 'blur'}]
            }
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
        addMap(){
            if(this.mapColArray.length){
                this.mapColIndex = this.mapColArray.length;
            }
            this.mapColArray.push({
                dataSource:'',
                field:'',
                sourceIndex:''
            });
        },
        delMap(){
            if(this.mapColArray.length){
                this.mapColArray.splice(this.mapColIndex,1);
            }
            if(this.mapColIndex){
                this.mapColIndex--;
            }  
        },
        changeMapIndex(index){
            if(this.mapColIndex == index){
                return false;
            }else{
                this.mapColIndex = index;
            }
        },
        changeMapSourceIndex(ds,index){
            var id = ds.split(',')
            this.$set(this.mapColArray[index],'field','')
            var source = this.step.dataSource
            for(var i in source){
                if(id[0] == source[i]['id']){
                    this.mapColArray[index].sourceIndex = i;
                    break;
                }
            }
        },
        mapCompelete(){
            if(this.mapColArray.length){
                this.validateMap().then((mapValid)=>{
                    if(mapValid){ 
                        this.mergeOperaArray[this.mergeOperaIndex].mapColText = ''
                        this.mergeOperaArray[this.mergeOperaIndex].mapColCode = ''
                        this.mapColArray.forEach((mapCol,index,arr)=>{
                            var ds = mapCol.dataSource.split(',')
                            var field = mapCol.field.split(',')
                            if(index<arr.length-1){
                                this.mergeOperaArray[this.mergeOperaIndex].mapColText += 
                                    ds[1]+'.['+field[1]+']='
                                this.mergeOperaArray[this.mergeOperaIndex].mapColCode +=
                                    ds[0]+'.'+field[0]+'='
                            }else{
                                this.mergeOperaArray[this.mergeOperaIndex].mapColText += 
                                    ds[1]+'.['+field[1]+']'
                                this.mergeOperaArray[this.mergeOperaIndex].mapColCode +=
                                    ds[0]+'.'+field[0]
                            }
                           
                        })
                        //console.log(this.mergeOperaArray[this.mergeOperaIndex].mapColCode)
                        this.openMessage('设置成功!','success');
                        this.$emit('on-close-auth')
                    }else{ 
                        this.openMessage('选项不能为空!，若放弃请删除该行!','warning');
                        return false;
                    }
                })
            }
        },
        validateMap(){
            var mapValid = true;
            for(let i in this.mapColArray){
                if(mapValid){
                    this.$refs.mapConForm[i].validate((valid)=>{
                        if(!valid){  
                            mapValid = false;      
                        }
                    })
                }
            }
            return  Promise.resolve(mapValid)   
        },
        closeMergeField(){
            this.$emit('on-close-auth');
        }
    },
    created(){ 
        if(this.mergeOperaArray[this.mergeOperaIndex].mapColText){
            var mapColTextStr = this.mergeOperaArray[this.mergeOperaIndex].mapColText.split('=')   
            var mapColCodeStr = this.mergeOperaArray[this.mergeOperaIndex].mapColCode.split('=')      
            for(let i in mapColTextStr){
                var text = mapColTextStr[i].split('.')
                var code = mapColCodeStr[i].split('.')
                var sourceIndex = this.step.dataSource.findIndex(function(value, index, arr){
                                    return value.id == code[0];
                                })   
                this.mapColArray.push({
                    dataSource:code[0]+','+text[0],
                    field:code[1]+','+text[1].substr(1,text[1].length-2),
                    sourceIndex:sourceIndex
                })
            }
        }
    }
}

</script>
<style>
.quanxian-config-content{
  width: 100%;
  padding:10px 5px;
  box-sizing: border-box;
  overflow-y: auto;
}
.quanxian-list-table{
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #E6E7EB;
    height: 380px;
    overflow-y: auto;
    overflow-x: hidden;
}
.quanxian-list-title,.quanxian-list-item{
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.quanxian-list-title{
    display: flex;
    background-color: #f5f7fa
}
.quanxian-list-title .quanxian-source,
.quanxian-list-title .quanxian-field,
.quanxian-list-title .quanxian-type{
  font-size: 12px;
  padding-left: 5px;
  box-sizing: border-box;
}
.quanxian-list-item{
  font-size: 12px;
  font-weight: normal;
}
.quanxian-list-item:hover .el-input__inner {
    border-radius: 0;
    background: #E0F4F7;
}
.quanxian-list-table .el-form{
    display: flex;
}
.quanxian-select{
    flex: 0 0 32px;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.quanxian-source,.quanxian-field,.quanxian-type{
    border-left: 1px solid #E6E7EB;
}
.quanxian-source{
  flex:0.5;
}
.quanxian-field{
  flex:0.5;
}
.quanxian-type{
   flex: 0 0 150px;
   width: 150px;
  box-sizing: border-box;
}
.quanxian-list-item .el-form-item {
  margin-bottom: 0;
}
.quanxian-list-item .el-form-item__content{
    line-height: 30px;
}
.quanxian-list-item .el-select{
    width: 100%;
}
.quanxian-list-item .el-input{
    font-size: 12px;
}
.quanxian-list-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
    padding-right: 14px;
}
.quanxian-list-item .el-input__suffix{
    right: 2px;
}
.quanxian-list-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.quanxian-list-item .el-select .el-input .el-select__caret.is-show-close{
    opacity: 1;
}
.quanxian-list-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
}
</style>