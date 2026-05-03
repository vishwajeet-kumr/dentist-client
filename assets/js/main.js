document.addEventListener('DOMContentLoaded', function () {

  /* ===== NAVBAR SCROLL ===== */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ===== MOBILE MENU ===== */
  var menuBtn = document.getElementById('menu-btn');
  var menuClose = document.getElementById('menu-close');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileOverlay = document.getElementById('mobile-overlay');
  function openMenu() { mobileMenu.classList.add('open'); mobileOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('open'); mobileOverlay.classList.remove('open'); document.body.style.overflow = ''; }
  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(function (l) { l.addEventListener('click', closeMenu); });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ===== SCROLL ANIMATIONS ===== */
  var animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  var animObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); animObs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  animEls.forEach(function (el) { animObs.observe(el); });

  /* ===== COUNT-UP ===== */
  function countUp(el, target, suffix) {
    var duration = 2000;
    var start = 0;
    var startTime = null;
    var isDecimal = String(target).indexOf('.') !== -1;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statsObserved = false;
  var statsSection = document.getElementById('stats');
  if (statsSection) {
    var statsObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !statsObserved) {
        statsObserved = true;
        document.querySelectorAll('[data-count]').forEach(function (el) {
          countUp(el, parseFloat(el.dataset.count), el.dataset.suffix || '');
        });
        statsObs.unobserve(statsSection);
      }
    }, { threshold: 0.3 });
    statsObs.observe(statsSection);
  }

  /* ===== GOOGLE REVIEWS ===== */
  var PLACE_ID = 'ChIJhYFjXUfIbTkRC_9mp__TcTo';
  var reviewsContainer = document.getElementById('reviews-container');
  var ratingBadge = document.getElementById('rating-badge');
  var fallbackReviews = [
    { author_name: 'Rahul Meena', rating: 5, text: 'Dr. Amrata is an excellent dentist. Got my root canal done here, absolutely painless. The clinic is clean and well-equipped. Highly recommend!', time: '2 months ago', profile_photo_url: '' },
    { author_name: 'Sneha Gupta', rating: 5, text: 'Best dental clinic in Jagatpura. Dr. Amrata is very patient and explains everything before treatment. My kids love visiting here!', time: '1 month ago', profile_photo_url: '' },
    { author_name: 'Vikram Singh', rating: 5, text: 'Got my dental implants done by Dr. Amrata. Amazing results! She is very skilled and professional. The staff is friendly too.', time: '3 months ago', profile_photo_url: '' },
    { author_name: 'Priya Sharma', rating: 4, text: 'Very good experience. Clean clinic, modern equipment. Dr. Amrata took time to explain my treatment plan in detail.', time: '2 weeks ago', profile_photo_url: '' },
    { author_name: 'Amit Kumar', rating: 5, text: 'I had severe tooth pain and Dr. Amrata handled it with great care. The crown fitting was perfect. Thank you so much!', time: '1 month ago', profile_photo_url: '' }
  ];

  function renderStars(rating) {
    var s = '';
    for (var i = 1; i <= 5; i++) {
      s += '<svg class="w-4 h-4 inline-block ' + (i <= rating ? 'star-filled' : 'star-empty') + '" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>';
    }
    return s;
  }

  function getInitials(name) {
    return name.split(' ').map(function(w){return w[0];}).join('').toUpperCase().substring(0,2);
  }

  function renderReviews(reviews) {
    reviewsContainer.innerHTML = '';
    reviews.forEach(function (r) {
      var snippet = r.text.length > 150 ? r.text.substring(0, 150) + '…' : r.text;
      var hasMore = r.text.length > 150;
      var card = document.createElement('div');
      card.className = 'review-card bg-white rounded-xl p-6 border border-stone-100 shadow-sm min-w-[300px] md:min-w-0 flex-shrink-0 md:flex-shrink';
      card.innerHTML =
        '<div class="flex items-center gap-3 mb-3">' +
          '<div class="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold text-sm">' + getInitials(r.author_name) + '</div>' +
          '<div><p class="font-semibold text-stone-800 text-sm">' + r.author_name + '</p>' +
          '<p class="text-xs text-stone-400">' + (r.relative_time_description || r.time || '') + '</p></div>' +
        '</div>' +
        '<div class="mb-2">' + renderStars(r.rating) + '</div>' +
        '<p class="text-stone-600 text-sm leading-relaxed review-text">' + snippet +
        (hasMore ? ' <button class="text-teal-600 font-medium text-xs hover:underline read-more-btn">Read more</button>' : '') + '</p>';
      if (hasMore) {
        var expanded = false;
        card.querySelector('.read-more-btn').addEventListener('click', function () {
          expanded = !expanded;
          card.querySelector('.review-text').innerHTML = expanded ? r.text + ' <button class="text-teal-600 font-medium text-xs hover:underline read-more-btn">Show less</button>' : snippet + ' <button class="text-teal-600 font-medium text-xs hover:underline read-more-btn">Read more</button>';
          card.querySelector('.read-more-btn').addEventListener('click', arguments.callee);
        });
      }
      reviewsContainer.appendChild(card);
    });
  }

  function loadGoogleReviews() {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      var service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({ placeId: PLACE_ID, fields: ['reviews', 'rating', 'user_ratings_total'] }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews && place.reviews.length > 0) {
          if (ratingBadge && place.rating) {
            ratingBadge.textContent = place.rating.toFixed(1);
          }
          renderReviews(place.reviews.slice(0, 5));
        } else {
          renderReviews(fallbackReviews);
        }
      });
    } else {
      renderReviews(fallbackReviews);
    }
  }
  window.initReviews = loadGoogleReviews;
  loadGoogleReviews();

  /* ===== LIGHTBOX ===== */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var galleryItems = document.querySelectorAll('.gallery-item img');
  var currentIdx = 0;
  var galleryImages = [];
  galleryItems.forEach(function (img, i) {
    galleryImages.push(img.src);
    img.parentElement.addEventListener('click', function () {
      currentIdx = i;
      lightboxImg.src = galleryImages[currentIdx];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.querySelector('.lightbox-prev').addEventListener('click', function () {
    currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIdx];
  });
  document.querySelector('.lightbox-next').addEventListener('click', function () {
    currentIdx = (currentIdx + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIdx];
  });
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
  });

  /* ===== HIGHLIGHT TODAY'S HOURS ===== */
  var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  var today = days[new Date().getDay()];
  var todayRow = document.getElementById('hours-' + today);
  if (todayRow) todayRow.classList.add('hours-today');

});
