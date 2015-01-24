
jQuery(".nav-stacked #ic").each(function() {
	jQuery(this).addClass("icon-chevron-right");
	jQuery(this).css({'margin-right':'5px'});
});

jQuery(document).ready(
			function($) {
				$('#colorstrip').colorstrip(
					{
						minInterval: 6000,
						maxInterval: 12000,
						minWidth: 10,
						maxWidth: 80,
						opacity: 0.5,
						colors: ['#f90', '#39c', '#c00', '#090', '#c3f', '#007', '#69f']
					}
				);
			}
);		