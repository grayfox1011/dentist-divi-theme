( function () {
	'use strict';

	// The name of the site in the footer, made exactly as wide as the footer.
	function bigShell() {
		Array.prototype.forEach.call( document.querySelectorAll( '.dimora-wordmark' ), function ( mark ) {
			var range = document.createRange();

			mark.classList.add( 'is-fitted' );
			mark.style.transition = 'none';
			mark.style.fontSize = '100px';
			range.selectNodeContents( mark );

			var width = range.getBoundingClientRect().width;

			if ( width ) {
				mark.style.fontSize = Math.min( 100 * mark.clientWidth / width, mark.clientWidth * 0.5 ).toFixed( 1 ) + 'px';
			} else {
				mark.style.fontSize = '';
				mark.classList.remove( 'is-fitted' );
			}
		} );
	}

	bigShell();
	window.addEventListener( 'resize', bigShell );

	if ( document.fonts && document.fonts.ready ) {
		document.fonts.ready.then( bigShell );
	}
}() );
