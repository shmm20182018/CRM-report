
import guid from '../utils/guid.js'

export default class ReportDataSourceViewModel {
    /**从语义对象构造数据源
     * 从结果构造数据源
     */
    constructor(data,type){
        this.id= guid();

        if(type=='objType'){
            this.name = data[1];
            this.senmaId = data[0];
            this.senmaName = data[1];
            this.senmaTableName = data[2];
            this.paramMatchText = ''
            this.paramMatchCode = ''
            this.rightMatchText = ''
            this.rightMatchCode = ''
            this.type ='0';
        }
        else{
            this.name = data.name;
            this.senmaId = data.id;
            this.senmaName = data.name;
            this.senmaTableName = '';
            this.paramMatchText = ''
            this.paramMatchCode = ''
            this.rightMatchText = ''
            this.rightMatchCode = ''
            this.type ='1';           
            this.fields = [];
            var self =this;
            data.rows.forEach(function(row){
                self.fields.push(new ReportDataSourceFieldsViewModel(row));
            })
        } 
    }
}
class ReportDataSourceFieldsViewModel{
    /**
     * 从结果明细构造字段
     */
    constructor(row){
        this.id= guid();
        this.senName='';
        this.fieldId =row.id;
        this.label = row.fieldName;
        this.field = row.field;
        this.fieldType = row.fieldType;
        this.fieldLength = row.fieldWidth;
        this.useFlag ='0';
        this.isKeyCol ='0';
        this.isUnoCol='0';
        this.isDateCol='0';
        this.dataColType = '';
        this.useParam ='';
        this.paramId='';
        this.linkInfo='';
        this.hasChild = false;
    }
}
//export default ReportDataSourceViewModel