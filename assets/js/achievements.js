/* ══════════════════════════════════════════════════════════════════
   ACHIEVEMENTS

   Stored in localStorage, not cookies. That means: it never leaves
   the browser, it isn't sent to any server, it survives closing the
   tab, and it needs no consent banner and no privacy policy. There
   is no visitor tracking here of any kind — the browser is simply
   remembering things for its own user.
   ══════════════════════════════════════════════════════════════════ */

window.BA = window.BA || {};

BA.ach = (function () {
  var KEY = 'ba_achievements';
  var earned = load();
  var listeners = [];
  var queue = [];
  var showing = false;

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(earned)); } catch (e) {}
  }

  function defs() { return BA.data.achievements; }
  function find(id) {
    return defs().filter(function (a) { return a.id === id; })[0];
  }

  function has(id) { return earned.indexOf(id) !== -1; }
  function count() { return earned.length; }
  function total() { return defs().length; }

  /* ── Toast ──────────────────────────────────────────────────── */
  function pump() {
    if (showing || !queue.length) return;
    showing = true;
    var a = queue.shift();

    var host = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="toast-icon" aria-hidden="true">' + a.icon + '</span>' +
      '<span><span class="toast-kicker">ACHIEVEMENT UNLOCKED</span>' +
      '<span class="toast-name">' + a.name + '</span></span>';
    host.appendChild(el);

    BA.sfx.play('achievement');

    setTimeout(function () {
      el.classList.add('out');
      setTimeout(function () {
        el.remove();
        showing = false;
        pump();
      }, 300);
    }, 3400);
  }

  /* ── Award ──────────────────────────────────────────────────── */
  function award(id) {
    if (has(id)) return false;
    var def = find(id);
    if (!def) return false;

    earned.push(id);
    save();
    queue.push(def);
    pump();

    listeners.forEach(function (fn) { fn(id, def); });

    // Did that complete the set? (Checked after, so '100%' can chain.)
    if (id !== 'complete') {
      var rest = defs().filter(function (a) { return a.id !== 'complete'; });
      var done = rest.every(function (a) { return has(a.id); });
      if (done) setTimeout(function () { award('complete'); }, 900);
    }
    return true;
  }

  function onAward(fn) { listeners.push(fn); }

  function reset() {
    earned = [];
    save();
    listeners.forEach(function (fn) { fn(null, null); });
  }

  return {
    award: award, has: has, count: count, total: total,
    defs: defs, onAward: onAward, reset: reset,
    percent: function () { return Math.round((count() / total()) * 100); }
  };
})();
