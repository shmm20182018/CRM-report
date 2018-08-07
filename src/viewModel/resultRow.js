class ReportResultRowsViewModel{
    constructor(id,srcId,node,row,operationType){
        this.id = id;
        this.srcId = srcId;
        if(row){
            this.fieldId=row.fieldId;
            this.fieldName=row.fieldName;
            this.field=row.field;
            this.fieldFormula=row.fieldFormula;
            this.aliasCol= row.aliasCol;                
            this.colTitle = row.colTitle;
            this.fieldType = row.fieldType;
            this.fieldWidth = row.fieldWidth;
            this.colWidth = row.colWidth;
            this.alignType = row.alignType;
            this.showArea ='2' 
            this.isKeyField = '';                     
        }
        else if(node.label){
            this.fieldId=node.fieldId;
            this.fieldName=node.label;
            this.field=node.field;
            this.fieldFormula=node.field;
            this.aliasCol= node.field;                
            this.colTitle = node.label;
            this.fieldType = node.fieldType;
            this.fieldWidth = node.fieldLength;
            this.colWidth = node.colWidth || '150';
            this.alignType = node.alignType || 'C';
            this.showArea =node.showArea || '0';
            this.extraCol = node.extraCol || ''
            if(operationType == '1'){
                this.isKeyField = node.isKeyField || '0';
            }else{
                this.isKeyField = node.isKeyField  || '';
            } 
        }else{
            this.id = node.id;
            this.fieldId=node.fieldId;
            this.fieldName=node.fieldName;
            this.field=node.field;
            this.fieldFormula=node.fieldFormula;
            this.aliasCol= node.aliasCol;                
            this.colTitle = node.colTitle;
            this.fieldType = node.fieldType;
            this.fieldWidth = node.fieldWidth;
            this.colWidth = node.colWidth || '150';
            this.alignType = node.alignType || 'C';
            this.showArea =node.showArea || '0';
            this.extraCol = node.extraCol || ''
            if(operationType == '1'){
                this.isKeyField = node.isKeyField || '0';
            }else{
                this.isKeyField = node.isKeyField  || '';
            } 
        }
    }
}

export default ReportResultRowsViewModel

