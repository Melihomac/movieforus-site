// The deck of made-up films on the landing page: drag a card or use the
// buttons. Nothing is stored or sent anywhere; reloading starts it again.
(function () {
  var deck = document.querySelector('[data-deck]');
  if (!deck) return;
  var cards = [].slice.call(deck.querySelectorAll('[data-film]'));
  var result = deck.querySelector('[data-deck-result]');
  var likedOut = deck.querySelector('[data-liked]');
  var buttons = [].slice.call(document.querySelectorAll('[data-deck-act]'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var liked = 0;

  function layout() {
    cards.forEach(function (card, i) {
      var depth = i - index;
      if (depth < 0) return;
      card.style.zIndex = String(cards.length - i);
      card.style.transition = reduce ? 'none' : 'transform .35s ease, opacity .35s ease';
      card.style.transform = depth ? 'translateY(' + depth * 16 + 'px) scale(' + (1 - depth * 0.05) + ')' : '';
      card.style.opacity = depth > 2 ? '0' : '1';
      card.setAttribute('aria-hidden', depth === 0 ? 'false' : 'true');
      card.classList.remove('show-like', 'show-pass', 'show-love');
    });
  }

  function decide(kind) {
    var card = cards[index];
    if (!card) return;
    if (kind !== 'pass') liked += 1;
    var dir = kind === 'pass' ? -1 : 1;
    card.classList.add('show-' + kind);
    card.style.transition = reduce ? 'none' : 'transform .45s ease, opacity .45s ease';
    card.style.transform =
      kind === 'love'
        ? 'translateY(-120%) scale(.9)'
        : 'translateX(' + dir * 130 + '%) rotate(' + dir * 16 + 'deg)';
    card.style.opacity = '0';
    card.setAttribute('aria-hidden', 'true');
    index += 1;
    if (index >= cards.length) {
      likedOut.textContent = String(liked);
      result.hidden = false;
      buttons.forEach(function (b) { b.disabled = true; });
    }
    layout();
  }

  function reset() {
    index = 0;
    liked = 0;
    result.hidden = true;
    buttons.forEach(function (b) { b.disabled = false; });
    layout();
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () { decide(button.getAttribute('data-deck-act')); });
  });
  deck.querySelector('[data-deck-reset]').addEventListener('click', reset);

  // Dragging the top card: past a third of its width it counts.
  var start = null;
  deck.addEventListener('pointerdown', function (event) {
    var card = cards[index];
    if (!card || !card.contains(event.target)) return;
    start = { x: event.clientX, y: event.clientY, card: card, id: event.pointerId };
    card.setPointerCapture(event.pointerId);
    card.style.transition = 'none';
  });
  deck.addEventListener('pointermove', function (event) {
    if (!start || event.pointerId !== start.id) return;
    var dx = event.clientX - start.x;
    var dy = event.clientY - start.y;
    start.card.style.transform = 'translate(' + dx + 'px,' + dy * 0.3 + 'px) rotate(' + dx / 18 + 'deg)';
    start.card.classList.toggle('show-like', dx > 30);
    start.card.classList.toggle('show-pass', dx < -30);
  });
  function release(event) {
    if (!start || event.pointerId !== start.id) return;
    var dx = event.clientX - start.x;
    var limit = start.card.offsetWidth / 3;
    start = null;
    if (dx > limit) decide('like');
    else if (dx < -limit) decide('pass');
    else layout();
  }
  deck.addEventListener('pointerup', release);
  deck.addEventListener('pointercancel', release);

  // Arrow keys work once the deck has focus.
  deck.tabIndex = 0;
  deck.addEventListener('keydown', function (event) {
    if (index >= cards.length) return;
    if (event.key === 'ArrowRight') decide('like');
    if (event.key === 'ArrowLeft') decide('pass');
  });

  layout();
})();
