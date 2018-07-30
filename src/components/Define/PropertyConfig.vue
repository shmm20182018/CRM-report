<template>
    <div class="config-content">
        <el-tabs v-if="changeFullScreen" v-model="activeNameTag" @tab-click="handleTabClick">
            <el-tab-pane label="数据源属性" name="dataSource">
                <div class="obj-config-wrapper">
                    <div class="left-obj-config">
                        <p class='tree-title'><i class="el-icon-check"></i>请勾选要使用的字段</p> 
                        <el-form class="object-list" ref="form"  label-width="80px" size="small">
                            <el-form-item label="对象列表">
                                <el-select v-model="selectDataSourceIndex" placeholder="">
                                    <el-option v-for="(obj,index) in step.dataSource" :index="index" :key="index" :label="obj.name" :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>    
                        </el-form>   
                        <el-tree
                            check-strictly
                            show-checkbox
                            highlight-current
                            :expand-on-click-node="false"
                            :check-on-click-node="false"
                            :data="selectDsTreeData"
                            :default-checked-keys="selectDsTreeDefaultCheckedKeys"
                            @node-click="nodeClick"
                            @check-change="checkChange"
                            node-key="id"
                            ref="conTree" 
                            >
                        </el-tree>                                                         
                    </div>
                    <div class="right-obj-config">
                        <el-collapse v-model="activeNames" >
                            <el-form ref="form" :model="selectDataSource" label-width="100px" size="small" label-position="left">
                            <el-collapse-item title="对象" name="1">
                                    <el-form-item label="数据源名称" >
                                        <el-input v-model="selectDataSource.name"></el-input>
                                    </el-form-item> 
                                    <el-form-item label="语义对象名称" >
                                        <el-input v-model="currentDataSourceTreeNode.senName" :disabled="true"></el-input>
                                    </el-form-item> 
                                    <el-form-item label="数据结构">
                                        <el-input v-if="currentDataSourceTreeNode.tableName" v-model="currentDataSourceTreeNode.tableName" :disabled="true"></el-input> 
                                        <el-input v-else  v-model="currentDataSourceTreeNode.field" :disabled="true"></el-input> 
                                    </el-form-item>  
                            </el-collapse-item>
                            <el-collapse-item title="参数配置" name="2" v-show="currentDataSourceTreeNode.tableName">
                                <el-form-item label="对应参数"  class="obj-config-can">
                                    <el-input type="textarea" v-model="selectDataSource.paramMatchText"  :disabled="true"></el-input>
                                    <i class="el-icon-setting" @click="openCan"></i>
                                </el-form-item> 
                            </el-collapse-item>
                            <el-collapse-item title="权限配置" name="3" v-show="currentDataSourceTreeNode.tableName" class="obj-config-quan">
                                <el-form-item label="对应权限">
                                    <el-input type="textarea" v-model="selectDataSource.rightMatchText" :disabled="true"></el-input>
                                    <i class="el-icon-setting" @click="openQuan"></i>
                                </el-form-item> 
                            </el-collapse-item>
                            <el-collapse-item title="列属性" name="4" v-if="operation.type==3 && currentDataSourceTreeNode.field" >
                                    <el-form-item label="是否分组主列">
                                        <el-switch v-model="currentDataSourceTreeNode.isKeyCol" active-value="1" inactive-value="0"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="是否数据列">
                                        <el-switch v-model="currentDataSourceTreeNode.isUnoCol"  active-value="1" inactive-value="0"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="是否日期列">
                                        <el-switch v-model="currentDataSourceTreeNode.isDateCol" active-value="1" inactive-value="0"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="日期类型列">
                                        <el-radio-group v-model="currentDataSourceTreeNode.dataColType">
                                            <el-radio label="日期"></el-radio>
                                            <el-radio label="月份"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                            </el-collapse-item>
                            </el-form>  
                        </el-collapse>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="操作属性" name="operation">
                <div class="ope-config-wrapper">
                    <div v-if="step.operation.type == 1" class="hebing-operate-wrapper">
                        <div class="merge-config-menu">
                            <ul>
                                <li @click="addMerge">增加关系</li>
                                <li @click="delMerge">删除关系</li>
                                <li @click="saveMerge">保存</li>
                                <li >字段公式</li>
                            </ul>
                        </div>
                        <div class="merge-config-content"> 
                            <div class="merge-config-table">
                                <div class="merge-list-title">
                                    <div class="merge-select merge-title-item">
                                    </div>
                                    <div class="merge-field-first merge-title-item" v-if="checkedField.length" v-for="(checkedField,index) in checkedFieldList" :key="index">
                                       {{step.dataSource[index].name}}
                                    </div>
                                </div>
                                <div class="merge-list-item"  v-for="(mergeAssoc,index) in mergeOperaArray" :key="index" @click="changeMergeIndex(index)">
                                    <div class="merge-select merge-data-item">
                                        <i v-show="mergeOperaIndex==index" class="el-icon-check"></i>
                                    </div>  
                                    <div class="merge-field-first merge-data-item"  v-if="checkedFieldList[fIndex].length" v-for="(field,fIndex) in mergeAssoc" :key="fIndex">
                                        <el-form :model="field" ref="mergeConForm" :rules="mergeRules" :show-message="false" > 
                                        <el-form-item prop="field">
                                            <el-select v-model="field.field" filterable clearable placeholder="请选择" @focus="changeMergeIndex(index)">
                                                <el-option v-for="(obj,index) in checkedFieldList[fIndex]" :key="index" :label="obj.label" :value="obj.field"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="operation.type == 2&& activeNameTag=='operation'" class="guanlian-operate-wrapper">
                        <el-form class="guanlian-operate-form" :model="form" label-width="100px" size="small" label-position="left" >
                        <div class="guanlian-operate-content">
                            <el-form-item class="guanlian-operate-textarea" label="对象关联关系">
                                <el-input type="textarea" v-model="operation.mapColText"></el-input>
                                <el-button @click="openAssoc" class="guanlian-operate-btn">设置关系</el-button>
                            </el-form-item>
                            <el-form-item  label="关联方式">
                                <el-select v-model="operation.mapELe" placeholder="">
                                    <el-option label="左联接" value="L"></el-option>
                                    <el-option label="等值联接" value="I"></el-option>
                                </el-select> 
                            </el-form-item>
                        </div>
                        </el-form>
                    </div>
                    <div v-if="operation.type == 3" class="duibi-operate-wrapper">
                        <el-form class="duibi-operate-form" :model="form" label-width="100px" size="small" label-position="left" >
                            <div class="duibi-form-left">
                                <el-form-item label="操作对象">
                                    <el-select v-model="step.dataSource[0].id" disabled   placeholder="">
                                        <el-option v-for="(ds) in step.dataSource" 
                                            :key="ds.id"
                                            :label="ds.name" 
                                            :value="ds.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <div class="duibi-checkedcol-list">
                                    <div class="duibi-keyCol">
                                        <div class="duibi-col-title" :class="checkedFieldList[0].length?'':'last-col-item'">已选主列列表</div>
                                        <div class="duibi-col-item" :class="(index == checkedFieldList[0].length-1)?'last-col-item':''"  v-if="col.isKeyCol=='1'"  v-for="(col,index) in checkedFieldList[0]" :key="index" >{{ col.label}}</div>
                                    </div>
                                    <div class="duibi-UnoCol">
                                        <div class="duibi-col-title" :class="checkedFieldList[0].length?'':'last-col-item'">已选数据列列表</div>
                                        <div class="duibi-col-item"  :class="(index == checkedFieldList[0].length-1)?'last-col-item':''"  v-if="col.isUnoCol=='1'"  v-for="(col,index) in checkedFieldList[0]" :key="index">{{ col.label}}</div>
                                    </div>
                                </div>  
                            </div>
                            <div class="duibi-form-right">
                                <el-form-item label="同期">
                                    <el-switch v-model="operation.compType[0]" active-value="TQ" inactive-value=" "></el-switch>
                                </el-form-item>
                                <el-form-item label="上期">
                                    <el-switch v-model="operation.compType[1]" active-value="SY" inactive-value=" "></el-switch>
                                </el-form-item>
                            </div>       
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="结果属性" name="result">
                <div class="res-config-wrapper">
                    <div class="result-config-menu">
                        <ul>
                            <li @click="createResultOnceAgain" >重新生成分录</li>
                            <li>字段公式操作</li>
                            <li @click="deleteResult">删除分录</li>
                            <li @click="createFinallyResult">设置最终结果</li>
                        </ul>
                    </div>
                    <div class="result-config-content" :class="resultFinallyShowFlag?'':'result-finally-show'"> 
                        <div class="result-config-table">
                            <div class="result-list-title">
                                <div class="result-select result-title-item"></div>
                                <div class="result-sort result-title-item">序号</div>
                                <div class="result-fieldName result-title-item">字段名称</div>
                                <div class="result-field result-title-item">结果列名</div>
                                <div class="result-colTitle1 result-title-item">结果名称</div>
                                <div class="result-fieldType1 result-title-item">字段类型</div>
                                <div class="result-fieldWidth result-title-item">字段长度</div>
                                <div class="result-fieldFormula result-title-item">辅助列公式</div>
                                <div class="result-colTitle2 result-title-item" v-show="resultFinallyShowFlag">标题</div>
                                <div class="result-colWidth result-title-item" v-show="resultFinallyShowFlag">列宽</div>
                                <div class="result-alignType result-title-item" v-show="resultFinallyShowFlag">对齐方式</div>
                                <div class="result-fieldType2 result-title-item" v-show="resultFinallyShowFlag">显示类型</div>
                                <div class="result-showArea result-title-item" v-show="resultFinallyShowFlag">显示位置</div>
                            </div>
                            <el-form>
                            <draggable v-model="step.result.rows"  @start="drag=true" @end="drag=false">
                            <div v-for="(row,index) in step.result.rows" :key="index" class="result-list-item"  @click="changeResultRowIndex(index)">
                                <div class="result-select result-data-item">
                                    <i v-show="resultRowIndex==index" class="el-icon-check"></i>
                                </div>  
                                <div class="result-sort result-data-item">
                                    <el-form-item >
                                       <el-input :value="index" :disabled="true"></el-input> 
                                    </el-form-item>
                                </div>
                                <div class="result-fieldName result-data-item">
                                    <el-form-item>
                                        <el-input  v-model="row.fieldName" :disabled="true"></el-input> 
                                    </el-form-item>
                                </div>
                                <div class="result-field result-data-item">
                                    <el-form-item>
                                        <el-input  v-model="row.aliasCol"  :disabled="row.extraCol!=''"></el-input>  
                                    </el-form-item>
                                </div>
                                <div class="result-colTitle1 result-data-item">
                                    <el-form-item>
                                       <el-input  v-model="row.colTitle"></el-input>  
                                    </el-form-item>
                                </div>
                                <div class="result-fieldType1 result-data-item">
                                   <el-form-item >
                                        <el-select v-model="row.fieldType"  placeholder="" @focus="changeResultRowIndex(index)">
                                            <el-option label="字符串" value="C"></el-option>
                                            <el-option label="数值" value="F"></el-option>
                                        </el-select>
                                    </el-form-item> 
                                </div>
                                <div class="result-fieldWidth result-data-item">
                                    <el-form-item>
                                        <el-input  v-model.number="row.fieldWidth" type="number"  min="0"></el-input>  
                                    </el-form-item>
                                </div>
                                <div class="result-fieldFormula result-data-item">
                                    <el-form-item >
                                       <el-input  :disabled="true"></el-input> 
                                    </el-form-item>
                                </div>
                                <div class="result-colTitle2 result-data-item" v-show="resultFinallyShowFlag">
                                    <el-form-item >
                                        <el-input  v-model="row.colTitle"></el-input>  
                                    </el-form-item>
                                </div>
                                <div class="result-colWidth result-data-item" v-show="resultFinallyShowFlag">
                                    <el-form-item>
                                        <el-input  v-model.number="row.colWidth" type="number"  min="0"></el-input>  
                                    </el-form-item>
                                </div>
                                <div class="result-alignType result-data-item" v-show="resultFinallyShowFlag">
                                    <el-form-item >
                                        <el-select v-model="row.alignType"  placeholder="" @focus="changeResultRowIndex(index)">
                                            <el-option label="中间对齐" value="C"></el-option>
                                            <el-option label="左对齐" value="L"></el-option>
                                            <el-option label="右对齐" value="R"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="result-fieldType2 result-data-item" v-show="resultFinallyShowFlag">
                                   <el-form-item >
                                        <el-select v-model="row.fieldType"  placeholder="" @focus="changeResultRowIndex(index)">
                                            <el-option label="字符串" value="C"></el-option>
                                            <el-option label="数值" value="F"></el-option>
                                        </el-select>
                                    </el-form-item> 
                                </div>
                                 <div class="result-showArea result-data-item" v-show="resultFinallyShowFlag">
                                    <el-form-item >
                                        <el-select v-model="row.showArea"  placeholder="" @focus="changeResultRowIndex(index)" :disabled="row.extraCol!=''">
                                            <el-option label="行标题区" value="0"></el-option>
                                            <el-option label="列标题区" value="1"></el-option>
                                            <el-option label="数据区" value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                            </draggable>
                            </el-form>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <param-config v-if="paramShowFlag" v-drag="dragParamDOM" :style="canStyle" class="canshu-config-wrapper"
            :step=step
            :selectDSIndex="selectDataSourceIndex"
            :checkedFieldList="checkedFieldList"
            :filterParams="filterParams"
            @on-close-param="closeCan"
        ></param-config>
        <auth-conifg v-if="authShowFlag" v-drag="dragAuthDOM" :style="quanStyle" class="quanxian-config-wrapper"       
            :step=step
            :selectDSIndex="selectDataSourceIndex"
            :checkedFieldList="checkedFieldList"
            @on-close-auth="closeQuan"
        ></auth-conifg>
         <merge-field v-if="mergeFieldShowFlag" v-drag="dragMergeDOM" :style="mergeStyle" class="quanxian-config-wrapper"       
            :step=step
            :checkedFieldList="checkedFieldList"
            :mergeOperaArray="mergeOperaArray"
            :mergeOperaIndex="mergeOperaIndex"
            @on-close-auth="closeMergeField"
        ></merge-field>
        <assoc-operation  v-if="assocShowFlag" v-drag="dragAssocDOM" class="assoc-config-wrapper"
            :step=step
            @on-close-assoc="closeAssoc"
            ></assoc-operation>
    </div>                         
</template>

<script>
import draggable from 'vuedraggable'
import AssocOperation from './AssocOperation.vue'//关系操作
import mergeFieldConfig from './mergeFieldConfig.vue'//合并操作
import ResultRow from '../../viewModel/resultRow.js'
import AuthConifg from './AuthConfig.vue'//语义对象权限配置
import ParamConfig from './ParamConfig.vue'//语义对象参数配置
export default {
  props:['step','stepIndex','dataSourceIndex','activeNameCon','filterParams','fullscreen'],
  data () {
    return {
        operation: this.step.operation,   //操作对象
        dragParamDOM:'',
        dragAuthDOM:'',
        dragAssocDOM:'',
        dragMergeDOM:'',
        selectDataSourceIndex:this.dataSourceIndex, //当前选择的数据源索引
        currentDataSourceTreeNode:{},             //当前选中的数据源树节点,在created时需要根据计算属性selectDsTreeData初始
        resultFinallyShowFlag:false,//用于result
        resultRowIndex:0,
        mergeOperaArray:[],//合并操作
        mergeOperaIndex:0,//合并操作
        mergeFieldShowFlag:false,//合并操作
        mergeRules:{
            field:[{required:true,trigger: 'change'}]
        },
        compSelIndex:0,
        paramShowFlag:false,//参数配置
        authShowFlag:false,//权限配置
        assocShowFlag:false,//关系操作公式配置
        changeFullScreen:true, 
        activeNames:['1','2','3','4'],
        activeNameTag:this.activeNameCon,
        canStyle:{
            position:'fixed',
            left: 'calc(50% - 450px)',
            top: '50px',
            width:'900px',
            height: '500px',
            border: '1px solid #ccc',
            background: '#fff',
        },
        quanStyle:{
            position:'fixed',
            left: 'calc(50% - 350px)',
            top: '50px',
            width:'700px',
            height: '500px',
            border: '1px solid #ccc',
            background: '#fff',
        },
        mergeStyle:{
            position:'fixed',
            left: 'calc(50% - 350px)',
            top: '50px',
            width:'700px',
            height: '500px',
            border: '1px solid #ccc',
            background: '#fff',
        },
        form:{
            name:'123'
        }
    };
  },
  watch:{
    fullscreen(){
        this.changeFullScreen = false;
        this.$nextTick(()=>{
            this.changeFullScreen = true;
        })
    }
  },
  computed:{
    //当前选中的数据源
    selectDataSource(){
        return  this.step.dataSource[this.selectDataSourceIndex];
    },
    //当前选中数据源tree data
    selectDsTreeData(){
        var parentNode = {
             id:this.selectDataSource.id,
             senmaID:this.selectDataSource.senmaId,
             label:this.selectDataSource.name,
             name:this.selectDataSource.name,
             senName:this.selectDataSource.senmaName,
             tableName:this.selectDataSource.senmaTableName,
             children:this.selectDataSource.fields
        }
        return [parentNode];
    },
    //当前选中数据源tree的默认选中节点，用于tree节点的默认勾选
    selectDsTreeDefaultCheckedKeys(){
        var fields =  this.selectDataSource.fields;
        var checkedKeys = [];

        var findCheckdKeys = function(fields){
            fields.forEach(function(field){
                if(field.useFlag=='1'){
                   checkedKeys.push(field.id);
                }
                if(field.hasChild){
                    findCheckdKeys(field.children);
                }
            });          
        }
        findCheckdKeys(fields);
        return checkedKeys;
    },
    //已经勾选的节点
    checkedFieldList(){
        var list = new Array(this.step.dataSource.length);        
        var findKeys = function(fields,index,level){
            fields.forEach(function(field){
                if(field.useFlag=='1'){
                   if(level)
                        field.level=level;
                   list[index].push(field);
                }
                if(field.hasChild){
                    findKeys(field.children,index);
                }
            });          
        }

        for(let i in  this.step.dataSource){
            list[i] = [];
            var fields = this.step.dataSource[i].fields;
            findKeys(fields,i,1);   
        }

        return list;
    },
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
    nodeClick(currentNode){
        this.currentDataSourceTreeNode=currentNode
    },
    checkChange(currentNode,isChecked,isHasChecked){
        this.$refs.conTree.setCurrentNode(currentNode);
        this.nodeClick(currentNode);
        currentNode.useFlag = isChecked == true ? '1':'0';

        if(isChecked && !currentNode.tableName){
            this.step.result.rows.push(ResultRow(currentNode.id,this.selectDsTreeData[0].id,currentNode))
        }else if(!isChecked && !currentNode.tableName){
           var currentIndex = this.step.result.rows.findIndex(function(value, index, arr) {
                                    return value.id == currentNode.id;
                                })
            this.step.result.rows.splice(currentIndex,1)
        }
    },
    openCan(){
        this.paramShowFlag = true;
        this.$nextTick(()=>{
            this.dragParamDOM = document.getElementById('dragParam')
        })
    },
    openQuan(){
        this.authShowFlag = true;
        this.$nextTick(()=>{
            this.dragAuthDOM = document.getElementById('dragAuth')
        })
    },
    closeCan(){
        this.paramShowFlag = false;
    },
    closeQuan(){
        this.authShowFlag = false;
    },
    opeSelChange(dsCompareId){
        var object = this.step.dataSource;
        for(let i in object){
            var o = object[i]
            if(o.id == dsCompareId){
                this.compSelIndex = i;
                break;
            } 
        }
    },
    openAssoc(){
        this.assocShowFlag = true;
        this.$nextTick(()=>{
            this.dragAssocDOM = document.getElementById('dragassoc')
        })
    },
    closeAssoc(){
        this.assocShowFlag = false;
    },
    openMergeField(){
        this.mergeFieldShowFlag = true;
    },
    closeMergeField (){
        this.mergeFieldShowFlag = false;
    },
    addMerge(){
        if(this.mergeOperaArray.length){
            this.mergeOperaIndex = this.mergeOperaArray.length;
        }
        var dsFields={}
        this.mergeOperaArray.push([])

        for (let i in this.checkedFieldList){
            if(this.checkedFieldList[i].length){
                this.mergeOperaArray[this.mergeOperaArray.length-1].push({
                    field:'',dsIndex:i})
            }else{
                this.mergeOperaArray[this.mergeOperaArray.length-1].push({
                    field:'',dsIndex:i})
            }
           
        } 
    },
    delMerge(){
        if(this.mergeOperaArray.length){
            this.mergeOperaArray.splice(this.mergeOperaIndex,1);
        }
        if(this.mergeOperaIndex){
            this.mergeOperaIndex--;
        }  
    },
    saveMerge(){
         if(this.mergeOperaArray.length){
            this.validateMerge().then((mergeValid)=>{
                if(mergeValid){
                    this.step.operation.mapEleCode = '' 
                    this.step.operation.mapEle = ''     
                    this.mergeOperaArray.forEach((mapCol,index)=>{  
                        for(let i in mapCol){
                            if(mapCol[i].field){
                                if(index ==0){
                                    var order = mapCol[i].dsIndex
                                    this.step.operation.mapEle += this.step.dataSource[order].id+':'
                                }         
                                this.step.operation.mapEleCode += mapCol[i].field+';'
                            
                            }
                        
                        }
                        this.step.operation.mapEleCode = this.step.operation.mapEleCode.substring(0,this.step.operation.mapEleCode.length-1)
                        this.step.operation.mapEleCode += '^'
                    })
                    this.step.operation.mapEleCode = this.step.operation.mapEleCode.substring(0,this.step.operation.mapEleCode.length-1)
                    this.step.operation.mapEle = this.step.operation.mapEle.substring(0,this.step.operation.mapEle.length-1)
                    this.openMessage('保存成功!','success');
        
                }else{ 
                    this.openMessage('选项不能为空!，若放弃请删除该行!','warning');
                    return false;
                }
            })
        }
    },
    changeMergeIndex(index){
        if(this.mergeOperaIndex == index){
            return false;
        }else{
            this.mergeOperaIndex = index;
        }
    },
    changeResultRowIndex(index){
        this.resultRowIndex = index;
    },
    createResultOnceAgain(){
        /**重新生成结果待优化的问题：当发生数据源删除后，结果明细里的记录不会被删除，目前只能手动删除
         * 可以根据数据源id，自动删除结果明细
         */
        var self = this;
        var dataColList = [];
        self.step.result.rows.length = 0;
        this.checkedFieldList.forEach(function(nodeList,index){
            if(!(self.operation.type=='1' && index>0))
            {         
                var srcId = self.step.dataSource[index].id;
                nodeList.forEach(function(node){
                    if(!node.tableName){
                        // var find = self.step.result.rows.find(function(row){
                        //     return row.fieldId==node.fieldId;
                        // })

                        var find =  ResultRow(self.guid(),srcId,node);
                        self.step.result.rows.push(find);

                        if(self.operation.type=='3' && node.isUnoCol=='1')
                            dataColList.push(find);
                    }
                })
            }
        })

        //对比操作需要处理对比列
        if(this.operation.type=='3'){
            this.step.result.rows = this.step.result.rows.filter(function(row){
                return !row.extraCol;
            })

            this.operation.compType.forEach(function(item,index){
                if(item.trim()!=''){
                    var itemName;
                    switch(item)
                    {
                        case 'TQ':
                            itemName="同期"
                            break;
                        case 'SY':
                            itemName="上期"
                            break;
                        case 'BNLJ':
                            itemName="本年累计"
                            break;
                        case 'TQLJ':
                            itemName="同期累计"
                            break;
                        case 'QJLJ':
                            itemName="区间累计"
                            break;
                    }
             
                    dataColList.forEach(function(dataCol){
                        var field = item+dataCol.field;
                        var row =  ResultRow(self.guid(),'','',dataCol);
                        row.field = field;
                        row.fieldName = itemName+row.fieldName;
                        row.aliasCol = field;
                        row.colTitle = itemName+row.colTitle;
                        row.extraCol = item;
                        self.step.result.rows.push(row);
                    })

                }
            })
        }
    },
    createFinallyResult(){
        this.resultFinallyShowFlag = !this.resultFinallyShowFlag
    },
    deleteResult(){
        this.step.result.rows.splice(this.resultRowIndex,1)
    },
    createMergeOperation(){
        if(this.operation.mapEleCode&&this.operation.type == 1){
            this.mergeOperaArray = []
            var dsfields = this.operation.mapEleCode.split('^')
            var dsIds = this.operation.mapEle.split(':')
            var dsIndexs = []
            for(let i in  dsIds){
                var dsIndex = this.step.dataSource.findIndex(function(value, index, arr){
                                        return value.id == dsIds[i];
                                    })
                dsIndexs.push(dsIndex)
            }
            for(let i in dsfields){
                this.mergeOperaArray.push([])
                var fields = dsfields[i].split(';')             
                var checkIndex =-1;
                for(let j=0;j<this.checkedFieldList.length;j++){
                    checkIndex ++;
                    var oldIndex = dsIndexs.findIndex((value,index,arr)=>{
                        return j == value
                    })
                // console.log(dsIndexs,oldIndex)
                    if(this.checkedFieldList[j].length&&oldIndex>=0){
                        this.mergeOperaArray[i].push({
                            field: fields[oldIndex],
                            dsIndex: dsIndexs[oldIndex]
                        })
                    
                    }else{
                        this.mergeOperaArray[i].push({
                            field: '',
                            dsIndex: j
                        })
                    }
                }
            }
        }
    },
    handleTabClick(){
        if(this.step.operation.type==1){
            this.createMergeOperation()
        }   
    },
    validateMerge(){
       var mergeValid = true
        for(let i=0; i<this.$refs.mergeConForm.length; i++){
            if(mergeValid){
                this.$refs.mergeConForm[i].validate((valid)=>{
                    if(!valid){  
                        mergeValid = false;   
                    }
                })
            }
        }
        return  Promise.resolve(mergeValid)   
    }
  },
  created(){   
      this.createMergeOperation()
  },
  components:{
      draggable,
      AssocOperation:AssocOperation,
      mergeField:mergeFieldConfig,
      AuthConifg:AuthConifg,
      ParamConfig:ParamConfig
  }
}
</script>
<style>
.right-propterty-config .config-title{
    position: relative;
    width: 100%;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    font-weight: normal;
    color:#808080;
    cursor: pointer;
}
.right-propterty-config .config-title .el-icon-menu{
    font-size: 16px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #1A8BE6;
    vertical-align: top;
}
.right-propterty-config .config-title i.close-config{
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 16px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #808080;
    z-index: 10;
}
.right-propterty-config .el-tabs__nav{
    width: 100%;
}
.right-propterty-config .el-tabs__item {
    width: 33.3333333%;
    text-align: center;
}
.obj-config-wrapper,.ope-config-wrapper,.res-config-wrapper{
    height: 520px;
}
.obj-config-wrapper{
    width: 100%;
    display:flex;
}
.obj-config-wrapper .left-obj-config{
    flex: 0 0 auto;
    width: 500px;
    height: 520px;
    border-top: 1px solid #E6E7EB;
    padding-top: 5px;
    box-sizing: border-box;
}
.obj-config-wrapper .right-obj-config{
    flex: 1;
    border: 1px solid #E6E7EB;
    padding: 0 10px;
}
.left-obj-config .tree-title{
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    color: #303133;;
    padding-left: 16px;
    border-bottom: 1px solid #E6E7EB;
}
.left-obj-config .object-list{
    margin-top: 5px;
}
.left-obj-config .tree-title i{
    width: 14px;
    height: 14px;
    border: 1px solid #109EFF;
    text-align: center;
    line-height: 14px;
    margin-right: 5px;
    color: #109EFF;
}
.obj-config-wrapper .el-tree{
  margin-left: 8px;
  height: 450px;
  overflow-y: auto;
}
.obj-config-wrapper .el-collapse {
  border-top: none;
}
.obj-config-wrapper .el-collapse-item__header{
  height:42px;
  line-height: 42px;
}
.obj-config-wrapper .el-collapse-item__arrow{
  float:none;
}
.obj-config-wrapper .el-collapse-item__content {
    margin-bottom: 0;
    padding-bottom: 0;
}
.obj-config-wrapper .el-form-item--mini.el-form-item, .obj-config-wrapper .el-form-item--small.el-form-item {
    margin-bottom: 5px;
}
.obj-config-wrapper .left-obj-config .el-form-item__label{
  color: #999;
}
.obj-config-quan,.obj-config-can{
    position: relative;
}
.obj-config-quan .el-textarea__inner,.obj-config-can .el-textarea__inner{
    height: 87px;
    min-height: 87px;
    max-height: 87px;
    padding-right: 25px;
}
.obj-config-quan .el-icon-setting,.obj-config-can .el-icon-setting{
    position: absolute;
    right: 16px;
    top: 0;
    font-size: 16px;
    color: #C3C5C8;
    height: 32px;
    line-height: 32px;
    width: 20px;
    text-align: center;
    cursor: pointer;
}
.obj-config-quan .el-icon-setting:hover,.obj-config-can .el-icon-setting:hover{
    color: #109EFF;
}
.guanlian-operate-wrapper{
    width: 100%;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
}
.guanlian-operate-form{
    height: 500px;
    border: 1px solid #E6E7EB;
    padding: 5px;
    box-sizing: border-box;
}
.guanlian-operate-content{
    width: 70%;
}
.guanlian-operate-content .el-select{
    width: 100%;
}
.guanlian-operate-content .el-textarea__inner{
    min-height: 100px !important;
    max-height: 380px;
}
.guanlian-operate-content .el-form-item__content{
    position: static;
}
.guanlian-operate-textarea{
    position: relative;
}
.guanlian-operate-btn{
    position:absolute;
    left: 0px;
    top: 40px;
    padding: 9px 11px;
}
.duibi-operate-wrapper{
    width: 100%;
    height: 100%;
}
.duibi-operate-wrapper .duibi-operate-form{
    display: flex;
    height: 100%;
}
.duibi-operate-wrapper .duibi-form-left{
    flex: 1;
    padding: 10px 20px;
    border-top: 1px solid #E6E7EB;
    border-right: 1px solid #E6E7EB;
    height: 100%;
    overflow:auto;
    box-sizing: border-box;
}
.duibi-form-left .el-select{
    width: 75%;
}
.duibi-form-left .el-input{
    width: 100%;
}
.duibi-operate-wrapper .duibi-form-right{
    flex: 0 0 auto;
    width: 300px;
    padding: 10px 20px;
    border-top: 1px solid #E6E7EB;
    height: 100%;
}
.duibi-checkedcol-list{
    display: flex;
    width: calc((100% - 100px) * 0.75 + 100px);
    box-sizing: border-box;
    border: 1px solid #E6E7EB;
    font-size: 12px; 
}
.duibi-checkedcol-list .duibi-keyCol{
    flex: .5;
    height:auto;
}
.duibi-checkedcol-list .duibi-UnoCol{
    flex: .5;
    height: auto;
}
.duibi-checkedcol-list .duibi-UnoCol{
    border-left:1px solid #E6E7EB;
}
.duibi-col-title,.duibi-col-item{
    border-bottom: 1px solid #E6E7EB;
    height: 40px;
    line-height: 40px;
    padding-left: 5px;
}
.duibi-col-title{
    background-color: #f5f7fa;
}
.last-col-item{
    border-bottom: none;
}
.duibi-col-item:hover{
  background-color: #E0F4F7;
}
.canshu-config-wrapper,.quanxian-config-wrapper{
    z-index: 3010;
    box-shadow:gray 0 0 30px;
}
.assoc-config-wrapper{
    position: fixed;
    width: 900px;
    height: 500px;
    left:calc(50% - 450px);
    top: 50px;
    z-index: 3020;
    box-shadow:gray 0 0 30px;
    background: #fff;
}
.quanxian-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.quanxian-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.quanxian-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.merge-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.merge-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.merge-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.merge-config-content{
  width: 100%;
  padding: 10px 5px; 
  box-sizing: border-box;
}
.merge-config-table{
    width: 100%;
    border:1px solid #E6E7EB;
    font-size: 12px;
    height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
}
.merge-list-title:hover,.merge-data-item:hover{
    background-color: #f5f7fa;
}
.merge-list-title{
    background-color:  #f5f7fa;
    display: flex;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.merge-title-item{
    font-size: 12px;
    padding-left: 5px;
    box-sizing: border-box;
}
.merge-list-item{
    font-size: 12px;
    font-weight: normal;
    display: flex;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.merge-list-item:hover .el-input__inner,.merge-list-item:hover .merge-symbol{
    border-radius: 0;
    background: #E0F4F7;
}
.merge-title-item,.merge-data-item{
    border-left: 1px solid #E6E7EB;
}
.merge-config-table .el-textarea.is-disabled .el-textarea__inner {
    min-height: 60px;
    max-height: 60px;
    height: 60px;
    border: none;   
}
.merge-select{
    border-left:none;
    flex: 0 0 auto;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.merge-field-first{
    flex: 1;
}
.merge-data-item .el-form-item {
  margin-bottom: 0;
}
.merge-data-item .el-form-item__content{
    line-height: 30px;
}
.merge-data-item .el-select{
    width: 100%;
}
.merge-data-item .el-input{
    font-size: 12px;
}
.merge-data-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
    padding-right: 14px;
}
.merge-formula .el-input__inner{
    padding-right: 5px;
}
.merge-data-item .el-input__suffix{
    right: 2px;
}
.merge-data-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.merge-data-item .el-select .el-input .el-select__caret.is-show-close{
    opacity: 1;
}
.merge-data-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
}
.merge-data-item  .el-form-item.is-error .el-input__inner,.merge-data-item  .el-form-item.is-error .el-input__inner:focus {
    border-bottom: 1px solid #f56c6c;
}
.result-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.result-config-menu li{
  display: inline-block;
  width: 85px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.result-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.result-config-content{
  width: 100%;
  padding: 10px 5px; 
  box-sizing: border-box;
}
.result-config-table{
    width: 100%;
    border:1px solid #E6E7EB;
    font-size: 12px;
    height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
}
.result-list-title,.result-list-item{
    display: flex;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.result-list-title:hover,.result-data-item:hover{
    background-color: #f5f7fa;
}
.result-list-title{
    background-color:  #f5f7fa;
}
.result-title-item{
    font-size: 12px;
    padding-left: 5px;
    box-sizing: border-box;
}
.result-list-item{
    font-size: 12px;
    font-weight: normal;
}
.result-list-item:hover .el-input__inner{
    border-radius: 0;
    background: #E0F4F7;
    cursor: pointer;
}
.result-title-item,.result-data-item{
    border-left: 1px solid #E6E7EB;
    box-sizing: border-box;
}
.result-select{
    border-left:none;
    flex: 0 0 auto;
    width: 20px;
    text-align: center;
    font-size: 14px;
    color: #109EFF;
}
.result-sort{
    flex: 0 0 auto;
    width: 32px;
    text-align: center;
}
.result-fieldType1,.result-fieldType2{
    flex: 0 0 auto;
    width: 60px;
}
.result-fieldWidth,.result-colWidth{
    flex: 0 0 auto;
    width: 60px;
}
.result-alignType{
    flex:0 0 auto;
    width: 60px;
}
.result-showArea{
    flex:0 0 auto;
    width: 80px;
}
.result-field,.result-colTitle1,.result-colTitle2,.result-fieldName,
.result-fieldFormula{
    flex: 0.2;
}
.result-finally-show .result-fieldType1{
    flex: 0 0 auto;
    width: 60px;
}
.result-finally-show .result-fieldWidth{
    flex: 0 0 auto;
    width: 60px;
}
.result-finally-show .result-field,
.result-finally-show .result-colTitle1,
.result-finally-show .result-fieldName,
.result-finally-show .result-fieldFormula{
    flex: 0.25;
}
.result-data-item .el-form-item {
    margin-bottom: 0;
}
.result-data-item .el-form-item__content{
    line-height: 30px;
}
.result-data-item .el-select{
    width: 100%;
}
.result-data-item .el-input{
    font-size: 12px;
}
.result-data-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
    padding-right: 5px;
}
.result-formula .el-input__inner{
    padding-right: 5px;
}
.result-data-item .el-input__suffix{
    right: 2px;
}
.result-data-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.result-data-item .el-select .el-input .el-select__caret.is-show-close{
    opacity: 1;
}
.result-data-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
}

</style>
