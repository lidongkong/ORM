$(function(){
	
	$.get('/departments', appendToTable);
	
	function appendToTable(blocks) {
		var list = [];
		for(var i in blocks){
			list.push($('<li>', {text: blocks[i]));
			
		}
		$('.block-list').append(list);
	}
}