
$( function() {
  $(".auto-complete").each( function(index) {
    var $ac = $(this);
    var $target = $ac.attr('data-source');

    //alert($target);

    var value = $ac.val();

    $ac.autocomplete({
      source: $target,
      minLength: 2,
      select: function(event, ui) {
        log( "Selected: " + ui.item.value + " aka " + ui.item.id );
      }
		});
  });
});
