var blockSize = 3;
var gridSize = 9;
$(document).on('ready',function(){
   sudoku.NewGame();
});   

var sudoku = {
    NewGame : function(){
        $.ajax({
    type:"GET",
       dataType: "json",
    url:"/js/game.json",
       headers: {
                "Content-Type": "application/json"
       },
       success:function(data){
           localStorage.setItem('game',JSON.stringify(data));
        sudoku.appendData(data);
       }
   });
    },
    appendData : function(data){
        $('tbody').html(''); 
           var data = data.data;
        for(var j=0;j<gridSize;j++){
        $('tbody').append('<tr id="'+j+'"></tr>');
            for(var k=j*gridSize;k<(j*gridSize)+gridSize;k++){
                //var state = data[k] != 0 ? "disable" : "";
                $('tbody').find('tr[id="'+j+'"]').append('<td><input style="width:20px;text-align:center" type="text" value="'+data[k]+'"></td>');
            }
        }
    },
    loadGame:function(){
        var data = JSON.parse(localStorage.getItem('sgame'));
        if(data != undefined || data != null){
            sudoku.appendData(data);
            setTimeout(function(){
                alert('Game Loaded From last saved state!!!');
            },5);
        }
        else{
            alert("Sorry! you dont have any saved games!!!");
        }
    },
    checkSingleBlock:function(a,b){
        var a1 = parseInt(Math.floor(a/blockSize));
    var b1 = parseInt(Math.floor(b/blockSize));
    var tr = [];
    var td = [];
    $('tbody').children('tr:eq('+b+')').find('input').each(function(){
        var s = $(this).val();
        tr.push(parseInt(s));
    });
    $('tbody').children('tr').each(function(){
        var t = $(this).find('td:eq('+a+')').find('input').val();
        td.push(parseInt(t));
    });
    var x = a1+(b1*blockSize)+1;
    
    var ri = b1 * blockSize;
    var ci = a1 * blockSize;
    
    var bv = [];
    for(var i=ri; i < ri+blockSize; i++){
        for(var j=ci;j<ci+blockSize;j++){
            var c = $('tbody').find('tr:eq('+i+')').children('td:eq('+j+')').find('input').val();
            bv.push(c);
        }
    }
    var state = $.unique(tr).length > gridSize-1 ? true : false;
    var tro = $.inArray(0,tr);
        
    var ds = $.unique(td).length > gridSize-1 ? true : false;
    var dso=$.inArray(0,td);
        
    var bvs = $.unique(bv).length > gridSize-1 ? true : false;
    var bvso = $.inArray(0,bv);
    if(tro > -1 || dso > -1 || bvso > -1){
        state = false;
    }
    if(!state || !ds || !bvs){
        state = false;    
    }
        return state;
    },
    checkAllBlocks:function(){
      tr = $('tbody').children('tr');
        td = tr.children('td');
        input = td.find('input');
        var st = '';
        tr.each(function(){
            td.each(function(){
                var val = $(this).find('input').val();
                var a = $(this).index();
                var b = $(this).closest('tr').index();
                st = sudoku.checkSingleBlock(a,b);
                if(!st){
                    alert('Game incomplete')
                    return false;
                }
            });
            if(!st){
                 //   alert('Game incomplete')
                    return false;
            }
        });
        if(st){
            alert('Congratulations you did it !!!')
        }
    }
};

$('#load').on('click',function(){
    sudoku.loadGame();
});

$('#new').on('click',function(){
    sudoku.NewGame();
});

$('#save').on('click',function(){
    var data = [];
    $('tbody').children('tr').each(function(){
        var a = [];
        $(this).children('td').each(function(){
            a.push(parseInt($(this).find('input').val()));
        });
        $.merge(data,a);
    });
    data = {"data":data};
    localStorage.setItem('sgame',JSON.stringify(data));
    alert('Games Saved Successfully!!!');
});

$('tbody').on('focusout','input',function(){
    var val = $(this).val();var st = '';
    var a = $(this).closest('td').index();
    var b = $(this).closest('tr').index();
    var state = sudoku.checkSingleBlock(a,b);
    if(state){
        sudoku.checkAllBlocks();                    
    }
    else{
        alert('Game is incomplete.')
    }
});