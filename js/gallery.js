/*
 * CHIWO gallery — builds the album filters, photo grid and lightbox from data/gallery.json.
 *
 * Each item in gallery.json:
 *   { "src": "assets/img/name-1600.webp", "thumb": "assets/img/name-600.webp",
 *     "alt": "What the photo shows", "album": "Meal Time", "type": "image" }
 * Videos use "type": "video", an .mp4 as "src" and its poster .jpg as "thumb".
 * "album" must match one of the filter buttons in gallery.html exactly.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-gallery]');
  if (!root) return;

  // Photos are shown a page at a time so parents on mobile data only download what they ask for.
  var PAGE_SIZE = 12;

  var grid = root.querySelector('[data-gallery-grid]');
  var status = root.querySelector('[data-gallery-status]');
  var moreButton = root.querySelector('[data-gallery-more]');
  var filters = Array.prototype.slice.call(root.querySelectorAll('[data-album]'));

  var dialog = document.querySelector('[data-lightbox]');
  var stage = dialog.querySelector('[data-lightbox-stage]');
  var counter = dialog.querySelector('[data-lightbox-count]');
  var prevButton = dialog.querySelector('[data-lightbox-prev]');
  var nextButton = dialog.querySelector('[data-lightbox-next]');

  var items = [];
  var visible = [];
  var album = 'all';
  var shown = PAGE_SIZE;
  var current = 0;
  var opener = null;

  // Only relative paths or https URLs, so a typo in the JSON can't inject a script URL.
  function isSafePath(path) {
    return typeof path === 'string' && path.trim() !== '' && (/^https:\/\//i.test(path) || !/^[a-z][a-z0-9+.-]*:/i.test(path));
  }

  function isValid(item) {
    return item && isSafePath(item.src) && isSafePath(item.thumb);
  }

  function icon(name) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    var use = document.createElementNS(ns, 'use');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    return svg;
  }

  function actionButton(label, onClick) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn--ghost';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function actionLink(label, href) {
    var link = document.createElement('a');
    link.className = 'btn btn--green';
    link.href = href;
    link.textContent = label;
    return link;
  }

  function setStatus(message, action) {
    status.textContent = '';
    status.hidden = !message;
    if (!message) return;
    var text = document.createElement('p');
    text.textContent = message;
    status.appendChild(text);
    if (action) status.appendChild(action);
  }

  function selectAlbum(name) {
    album = name;
    shown = PAGE_SIZE;
    filters.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-album') === name));
    });
    render();
  }

  function tile(item, index) {
    var li = document.createElement('li');
    var button = document.createElement('button');
    var img = document.createElement('img');
    var isVideo = item.type === 'video';

    button.type = 'button';
    button.className = 'gallery-item';
    button.setAttribute('aria-haspopup', 'dialog');

    img.src = item.thumb;
    img.alt = (isVideo ? 'Video: ' : '') + (item.alt || '');
    img.width = 600;
    img.height = 600;
    img.loading = 'lazy';
    img.decoding = 'async';
    button.appendChild(img);

    if (isVideo) {
      var badge = document.createElement('span');
      badge.className = 'gallery-item__play';
      badge.appendChild(icon('play'));
      button.appendChild(badge);
    }

    button.addEventListener('click', function () {
      open(index, button);
    });
    li.appendChild(button);
    return li;
  }

  function render() {
    visible = items.filter(function (item) {
      return album === 'all' || item.album === album;
    });

    grid.textContent = '';
    visible.slice(0, shown).forEach(function (item, index) {
      grid.appendChild(tile(item, index));
    });
    moreButton.hidden = visible.length <= shown;

    if (!items.length) {
      setStatus('There are no photos here yet.', actionLink('Visit Us', 'contact.html#visit'));
    } else if (!visible.length) {
      setStatus('There are no photos in this album yet.', actionButton('Show all photos', function () {
        selectAlbum('all');
      }));
    } else {
      setStatus('');
    }
  }

  function show(index) {
    current = (index + visible.length) % visible.length;
    var item = visible[current];
    var media;

    if (item.type === 'video') {
      media = document.createElement('video');
      media.controls = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.poster = item.thumb;
      media.src = item.src;
      media.setAttribute('aria-label', item.alt || 'Video');
    } else {
      media = document.createElement('img');
      media.srcset = item.thumb + ' 600w, ' + item.src + ' 1600w';
      media.sizes = '100vw';
      media.src = item.src;
      media.alt = item.alt || '';
    }

    stage.textContent = '';
    stage.appendChild(media);
    counter.textContent = (item.type === 'video' ? 'Video ' : 'Photo ') + (current + 1) + ' of ' + visible.length;

    var single = visible.length < 2;
    prevButton.hidden = single;
    nextButton.hidden = single;
  }

  function open(index, trigger) {
    opener = trigger;
    show(index);
    document.documentElement.classList.add('has-lightbox');
    dialog.showModal();
  }

  function close() {
    dialog.close();
  }

  dialog.addEventListener('close', function () {
    stage.textContent = '';
    document.documentElement.classList.remove('has-lightbox');
    if (opener) opener.focus();
  });

  dialog.querySelector('[data-lightbox-close]').addEventListener('click', close);
  prevButton.addEventListener('click', function () { show(current - 1); });
  nextButton.addEventListener('click', function () { show(current + 1); });

  // Keep Tab and Shift+Tab cycling inside the lightbox.
  function trapFocus(event) {
    var focusable = Array.prototype.filter.call(dialog.querySelectorAll('button, video'), function (el) {
      return !el.hidden && el.getClientRects().length > 0;
    });
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      trapFocus(event);
      return;
    }
    if (event.target.tagName === 'VIDEO') return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1);
    }
  });

  // Tap the dark area around a photo to close.
  stage.addEventListener('click', function (event) {
    if (event.target === stage) close();
  });

  // Swipe left or right on touch screens.
  var swipeX = null;
  var swipeY = null;
  stage.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse') return;
    swipeX = event.clientX;
    swipeY = event.clientY;
  });
  stage.addEventListener('pointerup', function (event) {
    if (swipeX === null) return;
    var dx = event.clientX - swipeX;
    var dy = event.clientY - swipeY;
    swipeX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', function () {
    swipeX = null;
  });

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      selectAlbum(button.getAttribute('data-album'));
    });
  });

  // Add the next page of photos and move focus to the first new one.
  moreButton.addEventListener('click', function () {
    var start = shown;
    shown += PAGE_SIZE;
    visible.slice(start, shown).forEach(function (item, offset) {
      grid.appendChild(tile(item, start + offset));
    });
    moreButton.hidden = visible.length <= shown;
    grid.children[start].querySelector('button').focus();
  });

  function load() {
    setStatus('Loading photos…');
    fetch('data/gallery.json')
      .then(function (response) {
        if (!response.ok) throw new Error('data/gallery.json answered ' + response.status);
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error('data/gallery.json must be a list [ ... ]');
        items = data.filter(isValid);
        if (items.length !== data.length) console.warn('Gallery: skipped ' + (data.length - items.length) + ' item(s) without a valid "src" and "thumb".');
        // Only offer albums that have something in them.
        filters.forEach(function (button) {
          var name = button.getAttribute('data-album');
          button.hidden = name !== 'all' && !items.some(function (item) { return item.album === name; });
        });
        render();
      })
      .catch(function (error) {
        console.error('Gallery:', error);
        var message = "The gallery couldn't load. Check your connection, then try again.";
        if (location.protocol === 'file:') message += ' (Site owners: preview the site through a local web server — see README.md.)';
        setStatus(message, actionButton('Try again', load));
      });
  }

  load();
})();
