$(function() {
    size_li = $("#myList .item").length;
    x=6;
    $('#myList .item:lt('+x+')').show();
	if(size_li<=x)
	{
		$('#loadMore').hide();
	}
	if(x<=6)
	{
		$('#loadLess').hide();
	}
    $('#loadMore').click(function () {
        x= (x+6 <= size_li) ? x+6 : size_li;
        $('#myList .item:lt('+x+')').show();
        $('#loadLess').show();
        if(x == size_li){
            $('#loadMore').hide();
        }
    });
    $('#loadLess').click(function () {
        x=(x-6<6) ? 6 : x-6;
        $('#myList .item').not(':lt('+x+')').hide();
		$('#loadMore').show();
        if(x <= 6){
            $('#loadLess').hide();
        }
    });
});