(function () {
  function emphasisParts(text) {
    if (!text) return [];
    return String(text)
      .split(/\*(.+?)\*/)
      .map(function (part, i) {
        return { text: part, italic: i % 2 === 1 };
      });
  }

  function renderEmphasis(text, italicClassName) {
    return emphasisParts(text).map(function (p, i) {
      return p.italic ? h('em', { key: 'em' + i, className: italicClassName }, p.text) : p.text;
    });
  }

  var PLATFORM_LABEL = {
    google: 'G',
    bing: 'B',
    facebook: 'f',
    instagram: 'IG',
    linkedin: 'in',
    pinterest: 'P',
    youtube: 'YT',
  };

  function glyph(key, label, className) {
    return h('div', { key: key, className: className }, label);
  }

  function platformBadge(key, platform, className) {
    return glyph(key, PLATFORM_LABEL[platform] || '?', className);
  }

  function iconBadge(key, icon, className) {
    var label = icon ? String(icon).charAt(0).toUpperCase() : '•';
    return glyph(key, label, className);
  }

  function img(props, path, alt, className) {
    if (!path) return null;
    var asset = props.getAsset(path);
    var url = asset && asset.toString ? asset.toString() : path;
    return h('img', { src: url, alt: alt || '', className: className });
  }

  function toArray(list) {
    return list && list.toArray ? list.toArray() : [];
  }

  function sectionBg(background) {
    if (background === 'slate') return 'bg-brand-slate';
    if (background === 'gray') return 'border-t border-gray-100 bg-gray-50';
    return 'border-t border-gray-100 bg-white';
  }

  // ---- Hero ----
  function renderHero(hero, props) {
    if (!hero) return null;
    var heroImage = hero.get('heroImage');
    var heroImageAlt = hero.get('heroImageAlt');
    var eyebrow = hero.get('eyebrow');
    var title = hero.get('title');
    var description = hero.get('description');

    if (heroImage) {
      return h(
        'section',
        { className: 'border-b border-gray-100 bg-gray-50' },
        h(
          'div',
          { className: 'mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2' },
          h(
            'div',
            {},
            eyebrow
              ? h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-brand-green-dark' }, eyebrow)
              : null,
            h('h1', { className: 'mt-3 text-4xl font-bold text-brand-slate' }, title),
            h('p', { className: 'mt-5 text-lg text-brand-slate-light' }, description)
          ),
          img(props, heroImage, heroImageAlt, 'aspect-[4/3] w-full rounded-2xl border-2 border-brand-green object-cover')
        )
      );
    }

    return h(
      'section',
      { className: 'border-b border-gray-100 bg-gray-50' },
      h(
        'div',
        { className: 'mx-auto max-w-4xl px-6 py-16 text-center' },
        eyebrow
          ? h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-brand-green-dark' }, eyebrow)
          : null,
        h('h1', { className: 'mt-3 text-4xl font-bold text-brand-slate' }, title),
        h('p', { className: 'mx-auto mt-5 max-w-2xl text-lg text-brand-slate-light' }, description)
      )
    );
  }

  // ---- Blocks ----
  function renderFeatureGrid(block, props) {
    var background = block.get('background') || 'slate';
    var isSlate = background === 'slate';
    var eyebrow = block.get('eyebrow');
    var heading = block.get('heading');
    var items = toArray(block.get('items'));
    var columns = block.get('columns') || 2;
    var cardStyle = block.get('cardStyle') || 'bordered';
    var colClass =
      cardStyle === 'plain'
        ? columns === 3
          ? 'sm:grid-cols-3'
          : 'sm:grid-cols-2'
        : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2';

    return h(
      'section',
      { className: sectionBg(background) },
      h(
        'div',
        { className: 'mx-auto max-w-6xl px-6 py-20' },
        eyebrow || heading
          ? h(
              'div',
              { className: 'mb-10' },
              eyebrow
                ? h(
                    'div',
                    { className: 'flex items-center gap-3' },
                    h('span', { className: 'h-px w-8 ' + (isSlate ? 'bg-brand-green' : 'bg-brand-orange') }),
                    h(
                      'p',
                      {
                        className:
                          'text-sm font-semibold uppercase tracking-wide ' +
                          (isSlate ? 'text-white/60' : 'text-brand-slate-light'),
                      },
                      eyebrow
                    )
                  )
                : null,
              heading
                ? h(
                    'h2',
                    { className: 'mt-3 text-3xl font-bold ' + (isSlate ? 'text-white' : 'text-brand-slate') },
                    renderEmphasis(heading, 'font-light italic text-brand-green')
                  )
                : null
            )
          : null,
        h(
          'div',
          { className: 'grid gap-6 ' + colClass },
          items.map(function (item, i) {
            var color = item.get('color') || 'green';
            var borderClass = color === 'orange' ? 'border-brand-orange' : 'border-brand-green';
            var badgeClass =
              (color === 'orange' ? 'bg-brand-orange/10 text-brand-orange-dark' : 'bg-brand-green/10 text-brand-green-dark') +
              ' flex h-12 w-12 items-center justify-center rounded-xl font-bold';
            var href = item.get('href');
            var platform = item.get('platform');
            var cardClass = cardStyle === 'bordered' ? 'rounded-2xl border-2 bg-white p-6 ' + borderClass : '';
            return h(
              'div',
              { key: i, className: cardClass },
              platform ? platformBadge('b', platform, badgeClass) : iconBadge('b', item.get('icon'), badgeClass),
              h('h3', { className: 'mt-4 font-semibold text-brand-slate' }, item.get('title')),
              h('p', { className: 'mt-2 text-sm text-brand-slate-light' }, item.get('description')),
              href ? h('p', { className: 'mt-4 text-sm font-semibold text-brand-green-dark' }, 'Learn more →') : null
            );
          })
        )
      )
    );
  }

  function renderCta(block) {
    return h(
      'section',
      { className: 'border-t border-white/10 bg-brand-slate' },
      h(
        'div',
        { className: 'mx-auto max-w-4xl px-6 py-16 text-center' },
        h('h2', { className: 'text-2xl font-bold text-white' }, block.get('title')),
        h('p', { className: 'mx-auto mt-4 max-w-xl text-white/70' }, block.get('description')),
        h(
          'span',
          { className: 'mt-8 inline-block rounded-full bg-brand-green px-7 py-3 text-sm font-semibold text-brand-slate' },
          'Get in Touch'
        )
      )
    );
  }

  function renderText(block) {
    var background = block.get('background') || 'gray';
    var isSlate = background === 'slate';
    var icon = block.get('icon');
    var heading = block.get('heading');
    var body = block.get('body') || '';
    return h(
      'section',
      { className: sectionBg(background) },
      h(
        'div',
        { className: 'mx-auto max-w-3xl px-6 py-16 ' + (isSlate ? 'border-t border-white/10' : '') },
        icon
          ? iconBadge(
              'b',
              icon,
              (isSlate ? 'bg-white/10 text-brand-green' : 'bg-brand-green/10 text-brand-green-dark') +
                ' flex h-12 w-12 items-center justify-center rounded-xl font-bold'
            )
          : null,
        heading
          ? h(
              'h2',
              {
                className:
                  'mt-4 font-semibold ' +
                  (isSlate ? 'text-white' : 'text-brand-slate') +
                  ' ' +
                  (icon ? 'text-xl' : 'text-2xl sm:text-3xl'),
              },
              heading
            )
          : null,
        h(
          'div',
          { className: 'mt-4 space-y-4 ' + (isSlate ? 'text-white/60' : 'text-brand-slate-light') },
          body.split(/\n\s*\n/).map(function (para, i) {
            return h('p', { key: i }, para);
          })
        )
      )
    );
  }

  function renderChannelsList(block) {
    var items = toArray(block.get('items'));
    return h(
      'section',
      { className: 'bg-white' },
      h(
        'div',
        { className: 'mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2' },
        h(
          'div',
          {},
          h(
            'div',
            { className: 'flex items-center gap-3' },
            h('span', { className: 'h-px w-8 bg-brand-orange' }),
            h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-brand-slate-light' }, block.get('eyebrow'))
          ),
          h('h2', { className: 'mt-3 text-3xl font-bold text-brand-slate' }, renderEmphasis(block.get('heading'), 'font-light italic')),
          h('p', { className: 'mt-5 text-brand-slate-light' }, block.get('intro'))
        ),
        h(
          'div',
          { className: 'grid divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0' },
          items.map(function (item, i) {
            var platform = item.get('platform');
            var glyphClass = 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-[10px] font-bold text-brand-green-dark';
            return h(
              'div',
              { key: i, className: 'flex gap-3 p-6' },
              platform ? platformBadge('g', platform, glyphClass) : iconBadge('g', item.get('icon'), glyphClass),
              h(
                'div',
                {},
                h('h3', { className: 'font-semibold text-brand-slate' }, item.get('title')),
                h('p', { className: 'mt-1 text-sm text-brand-slate-light' }, item.get('description'))
              )
            );
          })
        )
      )
    );
  }

  function renderTeamBios(block, props) {
    var members = toArray(block.get('members'));
    return h(
      'section',
      { className: 'border-t border-gray-100 bg-white' },
      h(
        'div',
        { className: 'mx-auto max-w-6xl px-6 py-20' },
        h(
          'div',
          { className: 'flex items-center gap-3' },
          h('span', { className: 'h-px w-8 bg-brand-green' }),
          h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-brand-slate-light' }, block.get('eyebrow'))
        ),
        h('h2', { className: 'mt-3 text-3xl font-bold text-brand-slate' }, renderEmphasis(block.get('heading'), 'font-light italic')),
        h(
          'div',
          { className: 'mt-12 grid gap-12 sm:grid-cols-2' },
          members.map(function (person, i) {
            return h(
              'div',
              { key: i, className: 'flex gap-5' },
              img(props, person.get('photo'), person.get('name'), 'h-32 w-32 shrink-0 rounded-full object-cover'),
              h(
                'div',
                {},
                h('h3', { className: 'font-semibold text-brand-slate' }, person.get('name')),
                h('p', { className: 'text-sm font-medium text-brand-green-dark' }, person.get('role')),
                h('p', { className: 'mt-3 text-sm text-brand-slate-light' }, person.get('bio'))
              )
            );
          })
        )
      )
    );
  }

  function renderProcessSteps(block) {
    var steps = toArray(block.get('steps'));
    return h(
      'section',
      { className: 'bg-brand-slate' },
      h(
        'div',
        { className: 'mx-auto max-w-6xl px-6 py-20' },
        h(
          'div',
          { className: 'grid gap-8 lg:grid-cols-2' },
          h(
            'div',
            {},
            h(
              'div',
              { className: 'flex items-center gap-3' },
              h('span', { className: 'h-px w-8 bg-brand-green' }),
              h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-white/60' }, block.get('eyebrow'))
            ),
            h('h2', { className: 'mt-3 text-3xl font-bold text-white' }, renderEmphasis(block.get('heading'), 'font-light italic text-brand-green'))
          ),
          h('p', { className: 'text-white/60' }, block.get('note'))
        ),
        h(
          'div',
          { className: 'mt-14 grid gap-10 sm:grid-cols-3' },
          steps.map(function (step, i) {
            return h(
              'div',
              { key: i },
              h('p', { className: 'text-4xl font-bold text-brand-green' }, '0' + (i + 1)),
              h('h3', { className: 'mt-4 font-semibold text-white' }, step.get('title')),
              h('p', { className: 'mt-2 text-sm text-white/60' }, step.get('description'))
            );
          })
        )
      )
    );
  }

  function renderBlock(block, props) {
    var type = block.get('type');
    if (type === 'featureGrid') return renderFeatureGrid(block, props);
    if (type === 'cta') return renderCta(block);
    if (type === 'text') return renderText(block);
    if (type === 'channelsList') return renderChannelsList(block);
    if (type === 'teamBios') return renderTeamBios(block, props);
    if (type === 'processSteps') return renderProcessSteps(block);
    return null;
  }

  // ---- Pages (file collection: registered per file name below) ----
  var PagePreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var props = this.props;
      var hero = entry.getIn(['data', 'hero']);
      var blocks = toArray(entry.getIn(['data', 'blocks']));
      return h(
        'div',
        {},
        renderHero(hero, props),
        blocks.map(function (block, i) {
          return h('div', { key: i }, renderBlock(block, props));
        })
      );
    },
  });

  var PAGE_FILE_NAMES = [
    'homepage',
    'about-us',
    'contact-us',
    'for-agencies',
    'paid-search',
    'paid-search-google-ads',
    'paid-search-microsoft-ads',
    'paid-social',
    'paid-social-meta',
    'paid-social-other-platforms',
    'training-and-workshops',
    'ai',
  ];
  PAGE_FILE_NAMES.forEach(function (name) {
    CMS.registerPreviewTemplate(name, PagePreview);
  });

  // ---- Blog (folder collection) ----
  var BlogPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var pubDate = entry.getIn(['data', 'pubDate']);
      return h(
        'div',
        { className: 'mx-auto max-w-3xl px-6 py-16' },
        h('p', { className: 'text-xs font-semibold uppercase tracking-wide text-brand-green-dark' }, pubDate ? String(pubDate) : ''),
        h('h1', { className: 'mt-2 text-3xl font-bold text-brand-slate' }, entry.getIn(['data', 'title'])),
        h('div', { className: 'prose-content mt-8 space-y-6 text-brand-slate-light' }, this.props.widgetFor('body'))
      );
    },
  });
  CMS.registerPreviewTemplate('blog', BlogPreview);

  // ---- Case Studies (folder collection) ----
  var CaseStudyPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var props = this.props;
      var client = entry.getIn(['data', 'client']);
      var summary = entry.getIn(['data', 'summary']);
      var heroImage = entry.getIn(['data', 'heroImage']);
      var heroImageAlt = entry.getIn(['data', 'heroImageAlt']);
      var platforms = toArray(entry.getIn(['data', 'platforms']));
      var results = toArray(entry.getIn(['data', 'results']));
      var gallery = toArray(entry.getIn(['data', 'gallery']));

      return h(
        'div',
        {},
        h(
          'section',
          { className: 'border-b border-gray-100 bg-gray-50' },
          heroImage
            ? h(
                'div',
                { className: 'mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2' },
                h(
                  'div',
                  {},
                  h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-brand-green-dark' }, 'Case Studies'),
                  h('h1', { className: 'mt-3 text-4xl font-bold text-brand-slate' }, client),
                  h('p', { className: 'mt-5 text-lg text-brand-slate-light' }, summary)
                ),
                img(props, heroImage, heroImageAlt, 'aspect-[4/3] w-full rounded-2xl border-2 border-brand-green object-cover')
              )
            : h(
                'div',
                { className: 'mx-auto max-w-4xl px-6 py-16 text-center' },
                h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-brand-green-dark' }, 'Case Studies'),
                h('h1', { className: 'mt-3 text-4xl font-bold text-brand-slate' }, client),
                h('p', { className: 'mx-auto mt-5 max-w-2xl text-lg text-brand-slate-light' }, summary)
              )
        ),
        h(
          'section',
          { className: 'mx-auto max-w-3xl px-6 py-16' },
          platforms.length
            ? h(
                'div',
                { className: 'mb-10 flex flex-wrap gap-2' },
                platforms.map(function (platform, i) {
                  return platformBadge(i, platform, 'flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark font-bold');
                })
              )
            : null,
          results.length
            ? h(
                'div',
                { className: 'mb-12 grid gap-8 border-y border-gray-100 py-8 sm:grid-cols-3' },
                results.map(function (result, i) {
                  return h(
                    'div',
                    { key: i },
                    h('p', { className: 'text-3xl font-bold text-brand-green-dark' }, result.get('value')),
                    h('p', { className: 'mt-1 text-sm text-brand-slate-light' }, result.get('description'))
                  );
                })
              )
            : null,
          h('div', { className: 'prose-content space-y-6 text-brand-slate-light' }, this.props.widgetFor('body')),
          gallery.length
            ? h(
                'div',
                { className: 'mt-12 grid gap-4 sm:grid-cols-2' },
                gallery.map(function (item, i) {
                  return h('div', { key: i }, img(props, item.get('image'), item.get('alt'), 'aspect-video w-full rounded-xl border-2 border-brand-orange object-cover'));
                })
              )
            : null
        ),
        h(
          'section',
          { className: 'border-t border-white/10 bg-brand-slate' },
          h(
            'div',
            { className: 'mx-auto max-w-4xl px-6 py-16 text-center' },
            h('h2', { className: 'text-2xl font-bold text-white' }, 'Want results like this?'),
            h('p', { className: 'mx-auto mt-4 max-w-xl text-white/70' }, "Tell us about your account and we'll put together a plan.")
          )
        )
      );
    },
  });
  CMS.registerPreviewTemplate('caseStudies', CaseStudyPreview);

  CMS.registerPreviewStyle('/admin/preview.css');
})();
