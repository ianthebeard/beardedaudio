#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════
   BUILD — turns the single-page app into real, crawlable pages.

   Run it after editing assets/js/data.js:

       node build.js

   No dependencies, nothing to install. It loads data.js and views.js
   in a sandbox, asks each view for the exact HTML the browser would
   render, and writes that into a real file per section:

       /index.html          home / file select
       /podcasts/index.html
       /games/index.html    … and so on
       /404.html
       /sitemap.xml

   The point is that a search engine — or anything else that doesn't
   run JavaScript, which is most link previewers and AI crawlers —
   sees the same words a visitor sees. app.js still takes over on load
   and re-renders the same view, so the site behaves identically.

   index.html is both the template and the home page: everything
   between the seo/prerender markers is regenerated, everything
   outside them is yours to edit.
   ══════════════════════════════════════════════════════════════════ */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ══ Load the site's own code ══════════════════════════════════════
   views.js builds strings and touches no DOM until mount(), which we
   never call — so it runs perfectly well out here with a couple of
   stubs standing in for browser state. */
function loadSite() {
  const sandbox = { console };
  sandbox.window = sandbox;            // `window.BA = …` defines a global
  sandbox.self = sandbox;

  // A first-time visitor is what a crawler should see: no achievements,
  // nothing unlocked. Same as any real first hit on the page.
  sandbox.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };

  // Midday, so the time-of-day avatar doesn't make the build output
  // change depending on when it ran.
  const RealDate = Date;
  sandbox.Date = function () { return new RealDate('2024-01-01T12:00:00Z'); };
  sandbox.Date.now = RealDate.now;

  vm.createContext(sandbox);
  for (const f of ['assets/js/data.js', 'assets/js/achievements.js', 'assets/js/views.js']) {
    vm.runInContext(read(f), sandbox, { filename: f });
  }

  const BA = sandbox.BA;
  BA.secretUnlocked = () => false;
  if (!BA.ach) throw new Error('achievements.js did not define BA.ach');
  return BA;
}

/* ══ Helpers ══════════════════════════════════════════════════════ */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pathFor = (id) => (id === 'home' ? '/' : '/' + id + '/');

/* ══ <head> ═══════════════════════════════════════════════════════ */
function headFor(BA, id, meta) {
  const site = BA.data.site;
  const url = site.url + pathFor(id);
  const og = site.url + site.ogImage;
  const out = [];

  out.push(`<title>${esc(meta.title)}</title>`);
  out.push(`<meta name="description" content="${esc(meta.description)}">`);

  if (meta.noindex) {
    out.push('<meta name="robots" content="noindex, follow">');
  } else {
    // max-image-preview:large is what gets a real thumbnail next to
    // the result rather than a favicon-sized one.
    out.push('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">');
  }

  out.push(`<link rel="canonical" href="${esc(url)}">`);

  out.push('');
  out.push(`<meta property="og:type" content="${id === 'home' ? 'website' : 'article'}">`);
  out.push(`<meta property="og:site_name" content="${esc(site.name)}">`);
  out.push(`<meta property="og:locale" content="${esc(site.locale)}">`);
  out.push(`<meta property="og:url" content="${esc(url)}">`);
  out.push(`<meta property="og:title" content="${esc(meta.title)}">`);
  out.push(`<meta property="og:description" content="${esc(meta.description)}">`);
  out.push(`<meta property="og:image" content="${esc(og)}">`);
  out.push('<meta property="og:image:width" content="1200">');
  out.push('<meta property="og:image:height" content="630">');
  out.push(`<meta property="og:image:alt" content="${esc(site.name)} — ${esc(BA.data.profile.role)}">`);

  out.push('');
  out.push('<meta name="twitter:card" content="summary_large_image">');
  out.push(`<meta name="twitter:title" content="${esc(meta.title)}">`);
  out.push(`<meta name="twitter:description" content="${esc(meta.description)}">`);
  out.push(`<meta name="twitter:image" content="${esc(og)}">`);

  const ld = jsonLd(BA, id, meta);
  if (ld) {
    out.push('');
    out.push('<script type="application/ld+json">');
    out.push(JSON.stringify(ld, null, 2));
    out.push('</script>');
  }
  return out.join('\n');
}

/* ══ Structured data ══════════════════════════════════════════════
   Only claims that are true and checkable on the page itself. An
   @graph so the Person, the site and the page are one connected
   description rather than three unrelated blobs. */
function jsonLd(BA, id, meta) {
  const site = BA.data.site;
  const p = BA.data.profile;
  const url = site.url + pathFor(id);
  const personId = site.url + '/#ian';
  const siteId = site.url + '/#website';

  const graph = [];

  if (id === 'home' || id === 'about') {
    graph.push({
      '@type': 'Person',
      '@id': personId,
      name: p.name.replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase()),
      jobTitle: p.role,
      description: p.bio[0],
      url: site.url + '/',
      image: site.url + '/assets/img/emote-hype.png',
      email: 'mailto:beardedaudio@gmail.com',
      sameAs: site.sameAs,
      knowsAbout: [
        'Podcast editing', 'Audiobook post-production', 'Game sound design',
        'Sound effects', 'Foley', 'Audio mixing', 'Audio mastering', 'ASMR'
      ]
    });

    graph.push({
      '@type': 'ProfessionalService',
      '@id': site.url + '/#service',
      name: site.name,
      url: site.url + '/',
      image: site.url + site.ogImage,
      description: BA.data.seo.home.description,
      founder: { '@id': personId },
      areaServed: 'Worldwide',
      availableLanguage: 'en',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Audio post-production',
        itemListElement: [
          'Podcast editing, mixing and mastering',
          'Audiobook post-production',
          'Game sound design and SFX',
          'Music production, mixing and mastering',
          'ASMR sound design'
        ].map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } }))
      }
    });
  }

  graph.push({
    '@type': 'WebSite',
    '@id': siteId,
    url: site.url + '/',
    name: site.name,
    inLanguage: 'en',
    publisher: { '@id': personId }
  });

  const page = {
    '@type': 'WebPage',
    '@id': url + '#page',
    url: url,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': siteId },
    about: { '@id': personId }
  };

  // Breadcrumbs on section pages only — a crumb trail of one is noise.
  if (id !== 'home') {
    const section = BA.data.sections.filter((s) => s.id === id)[0];
    page.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url + '/' },
        { '@type': 'ListItem', position: 2, name: section ? titleCase(section.name) : meta.title, item: url }
      ]
    };
  }
  graph.push(page);

  const items = itemListFor(BA, id, url);
  if (items) graph.push(items);

  return { '@context': 'https://schema.org', '@graph': graph };
}

function titleCase(s) {
  return String(s).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/* The work itself, as a list — this is what can earn a rich result,
   and it only describes things actually rendered on the page. */
function itemListFor(BA, id, url) {
  const d = BA.data;
  let items = null;

  if (id === 'podcasts') {
    items = d.podcasts.map((s) => ({
      '@type': 'CreativeWork',
      name: s.title,
      url: s.link,
      image: s.art,
      creditText: s.role
    }));
  } else if (id === 'games') {
    items = d.games.map((g) => ({
      '@type': 'VideoGame',
      name: g.title,
      url: g.link,
      image: g.art,
      description: g.text,
      creditText: g.role,
      genre: g.tags.map((t) => t.label)
    }));
  } else if (id === 'music') {
    items = d.music.map((m) => ({
      '@type': 'MusicRecording',
      name: m.title,
      byArtist: { '@type': 'MusicGroup', name: m.project },
      creditText: m.role
    }));
  }

  if (!items || !items.length) return null;
  return {
    '@type': 'ItemList',
    '@id': url + '#items',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem', position: i + 1, item: item
    }))
  };
}

/* ══ Body ═════════════════════════════════════════════════════════
   The music view renders an empty host that the tape deck fills in on
   mount, so on its own it gives a crawler nothing but a heading. The
   deck replaces this list wholesale when JS runs, and it carries the
   same titles, projects and credits the deck shows — so no-JS
   visitors and crawlers get the catalogue rather than a blank panel. */
function bodyFor(BA, id) {
  const view = BA.views[id];
  if (!view) throw new Error('no view for ' + id);
  let html = view().html;

  if (id === 'music') {
    const rows = BA.data.music.map((m) =>
      '<li><strong>' + esc(m.title) + '</strong>' +
      (m.project ? ' — ' + esc(m.project) : '') +
      (m.album ? ' (' + esc(m.album) + ')' : '') +
      '<br>' + esc(m.role) + '</li>'
    ).join('');
    html = html.replace(
      '<div id="deck-host"></div>',
      '<div id="deck-host"><ul class="track-index">' + rows + '</ul></div>'
    );
  }
  return html;
}

/* ══ Page assembly ════════════════════════════════════════════════ */
const SEO_RE = /(<!-- seo:start[\s\S]*?-->)[\s\S]*?(<!-- seo:end -->)/;
const PRE_RE = /(<!-- prerender:start -->)[\s\S]*?(<!-- prerender:end -->)/;
const NAV_RE = /(<!-- nav:start -->)[\s\S]*?(<!-- nav:end -->)/;

/* Byte-for-byte what buildNav() produces in app.js, minus the secret
   entry — that only exists once a visitor has unlocked it. Keep the
   two in step. */
function navFor(BA, id) {
  return BA.data.sections.map((s) =>
    '<a class="nav-btn" href="' + pathFor(s.id) + '" data-nav="' + s.id + '"' +
    (s.id === id ? ' aria-current="page"' : '') +
    '>' + esc(s.name) + '</a>'
  ).join('');
}

function renderPage(template, BA, id, meta) {
  for (const [re, name] of [[SEO_RE, 'seo'], [PRE_RE, 'prerender'], [NAV_RE, 'nav']]) {
    if (!re.test(template)) throw new Error('index.html is missing its ' + name + ' markers');
  }
  return template
    .replace(SEO_RE, (_, a, b) => a + '\n' + headFor(BA, id, meta) + '\n' + b)
    .replace(NAV_RE, (_, a, b) => a + navFor(BA, id) + b)
    .replace(PRE_RE, (_, a, b) => a + '\n' + bodyFor(BA, id) + '\n' + b);
}

/* ══ sitemap ══════════════════════════════════════════════════════ */
function sitemap(BA, ids) {
  const site = BA.data.site;
  const today = new Date().toISOString().slice(0, 10);
  const urls = ids.map((id) => [
    '  <url>',
    '    <loc>' + site.url + pathFor(id) + '</loc>',
    '    <lastmod>' + today + '</lastmod>',
    '    <priority>' + (id === 'home' ? '1.0' : '0.8') + '</priority>',
    '  </url>'
  ].join('\n')).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    ''
  ].join('\n');
}

/* ══ Run ══════════════════════════════════════════════════════════ */
function main() {
  const BA = loadSite();
  const template = read('index.html');
  const seo = BA.data.seo;

  // Every id that gets a file. `missing` becomes 404.html.
  const pages = ['home'].concat(BA.data.sections.map((s) => s.id), ['trophies', 'secret']);
  const written = [];

  for (const id of pages) {
    const meta = seo[id];
    if (!meta) throw new Error('no BA.data.seo entry for "' + id + '"');
    const html = renderPage(template, BA, id, meta);

    if (id === 'home') {
      fs.writeFileSync(path.join(ROOT, 'index.html'), html);
      written.push('index.html');
    } else {
      fs.mkdirSync(path.join(ROOT, id), { recursive: true });
      fs.writeFileSync(path.join(ROOT, id, 'index.html'), html);
      written.push(id + '/index.html');
    }
  }

  // Vercel serves this for any unmatched path. Same shell, so the app
  // boots and the visitor can navigate out of it.
  fs.writeFileSync(
    path.join(ROOT, '404.html'),
    renderPage(template, BA, 'missing', seo.missing)
  );
  written.push('404.html');

  const indexable = pages.filter((id) => !seo[id].noindex);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap(BA, indexable));
  written.push('sitemap.xml');

  console.log('Built ' + written.length + ' files:');
  written.forEach((f) => console.log('  ' + f));
  console.log('\nIndexable: ' + indexable.map(pathFor).join('  '));
}

main();
