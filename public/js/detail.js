$(function() {
	$('.comment').click(function(e) {
		var target = $(this);
		var commentId = target.data('cid');
		var toId = target.data('tid');
		// console.log($('#toId').length);
		if($('#toId').length > 0) {
			$('#toId').val(toId);
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');		
		}

		if($('#commentId').length > 0) {
			$('#commentId').val(commentId);
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId,
			}).appendTo('#commentForm');
		}
	});
});