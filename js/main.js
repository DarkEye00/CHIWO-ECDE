/*
 * CHIWO — behaviour shared by every page:
 *   - mobile menu
 *   - enquiry form on the contact page (validation, Formspree, WhatsApp fallback)
 *   - click-to-load Google Map on the contact page (saves mobile data)
 */
(function () {
  'use strict';

  var WHATSAPP_URL = 'https://wa.me/254717040800';
  var WHATSAPP_GREETING = "Hello CHIWO, I'd like to ask about admission for my child.";

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!toggle) return;

    var header = toggle.closest('.site-header');
    var nav = document.getElementById(toggle.getAttribute('aria-controls'));
    var wideScreen = window.matchMedia('(min-width: 64em)');

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      header.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (isOpen() && !header.contains(event.target)) setOpen(false);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    wideScreen.addEventListener('change', function () {
      setOpen(false);
    });
  }

  function initEnquiryForm() {
    var form = document.querySelector('[data-enquiry-form]');
    if (!form) return;

    // The browser's own validation stays on if this script never runs.
    form.noValidate = true;

    var submit = form.querySelector('[type="submit"]');
    var submitLabel = submit.textContent;
    var alertBox = form.querySelector('[data-form-alert]');
    var fallbackLink = alertBox.querySelector('[data-whatsapp-fallback]');
    var success = document.querySelector('[data-form-success]');

    var rules = {
      parent_name: function (value) {
        return value.trim() ? '' : 'Enter your name.';
      },
      phone: function (value) {
        var digits = value.replace(/\D/g, '');
        if (!digits) return 'Enter your phone number.';
        if (digits.length < 9 || digits.length > 13) return 'Enter a phone number like 07XX XXX XXX.';
        return '';
      }
    };

    var labels = [
      ['parent_name', "Parent's name"],
      ['phone', 'Phone number'],
      ['child_age', "Child's age"],
      ['programme', 'Programme of interest'],
      ['message', 'Message']
    ];

    function check(name) {
      var input = form.elements[name];
      var message = rules[name](input.value);
      var error = document.getElementById(input.id + '-error');

      error.textContent = message;
      error.hidden = !message;
      if (message) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
      return message ? input : null;
    }

    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener('blur', function () {
        if (input.value) check(name);
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') check(name);
      });
    });

    // Turns whatever the parent typed into a ready-to-send WhatsApp message.
    function whatsappLink() {
      var lines = [WHATSAPP_GREETING, ''];
      labels.forEach(function (pair) {
        var value = form.elements[pair[0]].value.trim();
        if (value) lines.push(pair[1] + ': ' + value);
      });
      return WHATSAPP_URL + '?text=' + encodeURIComponent(lines.join('\n'));
    }

    function setBusy(busy) {
      submit.disabled = busy;
      submit.textContent = busy ? 'Sending…' : submitLabel;
      form.setAttribute('aria-busy', String(busy));
    }

    function showFailure() {
      fallbackLink.href = whatsappLink();
      alertBox.hidden = false;
    }

    function showSuccess() {
      success.querySelector('[data-success-name]').textContent = form.elements.parent_name.value.trim();
      success.querySelector('[data-success-phone]').textContent = form.elements.phone.value.trim();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      alertBox.hidden = true;

      var invalid = Object.keys(rules).map(check).filter(Boolean);
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      // Bots fill the hidden field; let them think it worked.
      if (form.elements._gotcha.value) {
        showSuccess();
        return;
      }

      // Never send a parent's details to an unconfigured endpoint.
      if (form.getAttribute('action').indexOf('FORM_ID') !== -1) {
        console.warn('Enquiry form: replace FORM_ID in contact.html with your Formspree form ID (see TODO.md).');
        showFailure();
        return;
      }

      setBusy(true);
      fetch(form.getAttribute('action'), {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Formspree answered ' + response.status);
          showSuccess();
        })
        .catch(function (error) {
          console.error('Enquiry form:', error);
          showFailure();
        })
        .finally(function () {
          setBusy(false);
        });
    });
  }

  function initMap() {
    var map = document.querySelector('[data-map]');
    if (!map) return;

    var template = map.querySelector('template');
    var button = map.querySelector('[data-map-load]');

    button.hidden = false;
    button.addEventListener('click', function () {
      var frame = template.content.cloneNode(true);
      map.textContent = '';
      map.appendChild(frame);
      map.querySelector('iframe').focus();
    });
  }

  initMenu();
  initEnquiryForm();
  initMap();
})();
