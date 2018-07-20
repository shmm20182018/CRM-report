<template>
  <div>
    <p class="config-title" id="dragAuth">
        <i class="el-icon-menu"></i>
        <span>{{'权限设置'}}</span>
        <i class="el-icon-close close-config" @click="closeQuan"></i>
    </p>
    <div class="quanxian-config-menu">
        <ul>
            <li @click="addAuth">新增</li>
            <li @click="delAuth">删除</li>
            <li @click="authCompelete">设置完毕</li>
        </ul>
    </div>
    <div class="quanxian-config-content">
        <div class="quanxian-list-table">
            <div class="quanxian-list-title">
                <div class="quanxian-select"></div>
                <div class="quanxian-source">操作对象</div>
                <div class="quanxian-field">操作字段</div>
                <div class="quanxian-type">权限类型</div>
            </div>
            <div class="quanxian-list-item" v-for="(rightMatch,index) in rightMatchArray" :key="index">
            <el-form :model="rightMatch" ref="authConForm" :rules="authRules" :show-message="false" >
                <div class="quanxian-select" @click="changeRightIndex(index)">
                    <i v-show="rightMatchIndex==index" class="el-icon-check"></i>
                </div>  
                <div class="quanxian-source">
                    <el-form-item prop="dataSource">
                        <el-select v-model="rightMatch.dataSource" clearable @focus="changeRightIndex(index)" @change="changeRightSourceIndex(rightMatch.dataSource,index)" placeholder="请选择">
                            <el-option v-for="(obj,index) in step.dataSource" :key="index" :label="obj.name" :value="obj.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="quanxian-field">
                    <el-form-item prop="field">
                        <el-select v-model="rightMatch.field" filterable clearable placeholder="请选择" @focus="changeRightIndex(index)">
                            <el-option v-for="(obj,index) in checkedFieldList[rightMatch.sourceIndex]" :key="index" :label="obj.label" :value="obj.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="quanxian-type">
                    <el-form-item prop="type">
                        <el-select v-model="rightMatch.type" clearable placeholder="请选择" @focus="changeRightIndex(index)">
                            <el-option v-for="(authItem,index) in  authList" :key="index" :label="authItem.name" :value="authItem.value"></el-option>
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
  props:['step','rightMatchArray','checkedFieldList'],
  data () {
    return {
      rightMatchIndex:0,
      authList:[
        {name:'部门权限',value:'1'},
        {name:'地区权限',value:'2'},
        {name:'事业部权限',value:'3'},
        {name:'大区权限',value:'4'},
        {name:'人员权限',value:'5'}
        ],
      authRules:{
        dataSource:[{required:true,trigger: 'blur'}],
        field:[{required:true,trigger: 'blur'}],
        type:[{required:true,trigger: 'blur'}]
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
    addAuth(){
        if(this.rightMatchArray.length){
            this.rightMatchIndex++;
        }
        this.rightMatchArray.push({
            dataSource:'',
            field:'',
            type:'',
            sourceIndex:'0'
        });
    },
    delAuth(){
        if(this.rightMatchArray.length){
            this.rightMatchArray.splice(this.rightMatchIndex,1);
        }
        if(this.rightMatchIndex){
            this.rightMatchIndex--;
        }  
    },
    changeRightIndex(index){
        if(this.rightMatchIndex == index){
            return false;
        }else{
            this.rightMatchIndex = index;
        }
    },
    changeRightSourceIndex(id,index){
        this.$set(this.rightMatchArray[index],'field','')
        var source = this.step['dataSource']
        for(var i in source){
            if(id == source[i]['id']){
                this.rightMatchArray[index]['sourceIndex'] = i;
                break;
            }
        }
        if(this.rightMatchIndex == index){
            return false;
        }else{
            this.rightMatchIndex = index;
        }
    },
    authCompelete(){
        if(this.rightMatchArray.length){
            this.validateAuth().then((authValid)=>{
                if(authValid){   
                    this.openMessage('保存成功!','success');
                    this.$emit('on-close-auth')
                }else{ 
                    this.openMessage('选项不能为空!，若放弃请删除该行!','warning');
                    return false;
                }
            })
        }
    },
    validateAuth(){
        var authValid = true;
        for(let i in this.rightMatchArray){
            if(authValid){
                this.$refs.authConForm[i].validate((valid)=>{
                    if(!valid){  
                        authValid = false;      
                    }
                })
            }
        }
        return  Promise.resolve(authValid)   
    },
    closeQuan(){
        this.$emit('on-close-auth');
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
    overflow: auto;
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