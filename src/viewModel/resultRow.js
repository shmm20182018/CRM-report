function NewReportResultRowsViewModel(id,srcId,node,row){
    return new ReportResultRowsViewModel(id,srcId,node,row);
}
class ReportResultRowsViewModel{
    constructor(id,srcId,node,row){
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
        }
        else{
            this.fieldId=node.fieldId;
            this.fieldName=node.label;
            this.field=node.field;
            this.fieldFormula=node.field;
            this.aliasCol= node.field;                
            this.colTitle = node.label;
            this.fieldType = node.fieldType;
            this.fieldWidth = node.fieldLength;
            this.colWidth = '150';
            this.alignType = 'C';
            this.showArea ='0';
            this.extraCol = ''
        }
    }
}

export default NewReportResultRowsViewModel

