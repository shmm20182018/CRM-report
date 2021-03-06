<?php
header('Access-Control-Allow-Origin=>*');
header("Access-Control-Allow-Headers=> Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods=> GET, POST, PUT,DELETE');
header("Content-Type=>application/json;charset=utf-8");

$array = array(
    "multipleSort"=> false,
    "title"=>'用户信息表',
    "total"=>0,
    "queryImmediately"=>false,
    "title"=>"日报检查",
    "showExport"=>false,
    "showFooter"=>false,
    "pageSize"=>30,
    "tableData"=> array(),
    "columns"=> array(
        array("field"=> 'custome', "width" => 50, "titleAlign"=> 'center', "columnAlign" => 'center', "isFrozen" => true ),
        array("field" => 'name', "width" => 100, "columnAlign" => 'center', "isFrozen" => true, "isResize" => true),
        array("field" => 'gender', "width" => 100, "columnAlign" => 'center', "isFrozen" => true, "sumFlag"=>true, "isResize" => true),
        array("field" => 'height', "width" => 90, "columnAlign" => 'center', "isFrozen" => false,"isResize" =>true),
        array("field" => 'address', "width" => 230, "columnAlign" => 'left',"isResize" =>true,"isSpan"=>true),
        array("field" => 'hobby', "width" => 180, "columnAlign" => 'center',"isResize" =>true,"isSpan"=>true),
        array(
            "field" => 'rowSum', "width" => 100, "titleAlign"=> 'center', "columnAlign" => 'center',
            "isFrozen" => false, "isResize" => true
        ),

    ),
    "titleRows"=> array(
                  array(array("fields"=> array('custome'), "title" => '排序', "titleAlign"=> 'center', "rowspan"=> 2),
                  array("fields"=> array('name', 'gender'), "title" => '基础信息', "titleAlign"=> 'center', "colspan"=> 2),
                  array("fields"=> array('height','address','hobby'), "title" => '用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;他&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;信&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;息', "titleAlign"=> 'center', "colspan"=> 3),
                  array("fields"=> array('rowSum'),"title" =>'行数据汇总',"titleAlign"=> 'center', "rowspan"=> 2)),

                  array(array("fields"=> array('name'), "title" => '姓名', "titleAlign"=> 'center'),
                  array("fields"=> array('gender'), "title" => '性别', "titleAlign"=> 'center', "orderBy"=> ''),
                  array("fields"=> array('height'), "title" => '身高', "titleAlign"=> 'center',"orderBy"=> ''),
                  array("fields"=> array('address'), "title" => '住址', "titleAlign"=> 'center'),
                  array("fields"=> array('hobby'), "title" => '爱好', "titleAlign"=> 'center')
                  ),
                  array(array("fields"=> array('custome','name','gender'), "title" => '平均值', "titleAlign"=> 'center', "colspan"=> 3,"titleCellClassName"=>'title-cell-class-name-test1'),
                  array("fields"=> array('height'), "title" => '111', "titleAlign"=> 'center',"titleCellClassName"=>'title-cell-class-name-test2'),
                  array("fields"=> array('address'), "title" => '222', "titleAlign"=> 'center',"titleCellClassName"=>'title-cell-class-name-test2'),
                  array("fields"=> array('hobby'), "title" => '333', "titleAlign"=> 'center',"titleCellClassName"=>'title-cell-class-name-test2'),
                  array("fields"=> array('rowSum'), "title" => '444', "titleAlign"=> 'center',"titleCellClassName"=>'title-cell-class-name-test2')
                  )
                )

                );
echo json_encode($array);
?>
