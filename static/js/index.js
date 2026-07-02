window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})

function setTheme(isDark) {
  const body = document.body;
  const button = document.getElementById('theme-toggle');
  const icon = button.querySelector('i');

  if (isDark) {
    body.classList.add('dark-mode');
    button.classList.remove('light');
    button.classList.add('dark');
    icon.className = 'fas fa-sun';
  } else {
    body.classList.remove('dark-mode');
    button.classList.remove('dark');
    button.classList.add('light');
    icon.className = 'fas fa-moon';
  }

  localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function () {
  const savedTheme = localStorage.getItem('siteTheme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  setTheme(useDark);

  document.getElementById('theme-toggle').addEventListener('click', function () {
    setTheme(!document.body.classList.contains('dark-mode'));
  });
});

// Load and render publications from author page JSON
async function loadPublications() {
  try {
    const response = await fetch('https://benjamin-greenland.github.io/publications.json');
    const publications = await response.json();
    
    // Populate navbar dropdown
    const navbarDropdown = document.getElementById('navbar-publications');
    publications.forEach(pub => {
      const link = document.createElement('a');
      link.className = 'navbar-item';
      link.href = pub.links.website;
      link.target = '_blank';
      link.textContent = `${pub.title}, ${pub.year}`;
      navbarDropdown.appendChild(link);
    });
  } catch (error) {
    console.error('Error loading publications:', error);
  }
}
