$(function() {
	$('a.pull-left').click(function(e) {
		var target = $(this);
		var cid = target.data('cid');
		var tid = target.data('tid');
		console.log(cid);
		console.log(tid);
		if($('#tid').length > 0) {
			$('#tid').val(tid);
		} else {
			$('<input>').attr({
				id: 'tid',
				name: 'comment[tid]',
				type: 'hidden',
				value: tid
			}).appendTo('#commentForm');
		}

		if($('#cid').length > 0) {
			$('#cid').val(cid);
		} else {
			$('<input>').attr({
				id: 'cid',
				name: 'comment[cid]',
				type: 'hidden',
				value: cid
			}).appendTo('#commentForm');
		}
	});
});
