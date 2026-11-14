// Templates are plain .html: no translatable text here, the words live in the patterns.
const { b, space, section, flow, row } = require('./blocks');
const { band, FRONT_PAGE } = require('./patterns');

const pattern = slug => b('core/pattern', { slug: `perla/${slug}` });
const part = (slug, tagName) => b('core/template-part', { slug, tagName });

const page = inner => [
  part('header', 'header'),
  b('core/group', { tagName: 'main', style: { spacing: { margin: { top: '0' }, blockGap: '0' } }, layout: { type: 'default' } }, inner),
  part('footer', 'footer'),
];

const content = (className = 'perla-content') => b('core/post-content', { align: 'full', className, layout: { type: 'constrained' } });

const comments = () => section({ name: 'Comments', tagName: 'div', bg: 'white', small: true, top: '0px', className: 'perla-comments' }, [
  b('core/comments', {}, [
    b('core/comments-title', { level: 2, style: { typography: { fontSize: 'clamp(24px, 2.2vw, 30px)' } } }),
    b('core/comment-template', {}, [
      row({ wrap: false, valign: 'top', gap: space('40'), margin: { bottom: space('50') } }, [
        b('core/avatar', { size: 44, style: { border: { radius: '22px' } } }),
        flow({ gap: '6px' }, [
          row({ gap: '10px' }, [b('core/comment-author-name', { fontSize: 'small' }), b('core/comment-date', { fontSize: 'x-small' }), b('core/comment-edit-link', { fontSize: 'x-small' })]),
          b('core/comment-content'),
          b('core/comment-reply-link', { fontSize: 'small' }),
        ]),
      ]),
    ]),
    b('core/comments-pagination', {}, [b('core/comments-pagination-previous'), b('core/comments-pagination-numbers'), b('core/comments-pagination-next')]),
    b('core/post-comments-form'),
  ]),
]);

const TEMPLATES = {
  'front-page': page(FRONT_PAGE.map(pattern)),

  page: page([
    band([b('core/post-title', { level: 1, textAlign: 'center', className: 'perla-split' })]),
    content(),
  ]),

  'page-no-title': page([content()]),

  single: page([
    band([
      row({ name: 'Details', justify: 'center', gap: '10px' }, [b('core/post-terms', { term: 'category' }), b('core/post-date')]),
      b('core/post-title', { level: 1, textAlign: 'center', className: 'perla-split', style: { typography: { fontSize: 'clamp(32px, 4vw, 52px)' } } }),
    ]),
    section({ name: 'Article', tagName: 'article', bg: 'white', small: true, gap: space('70') }, [
      b('core/post-featured-image', { align: 'wide', aspectRatio: '16/9', className: 'perla-image', style: { border: { radius: 'var(--wp--custom--radius--large)' } } }),
      content('perla-post'),
      b('core/post-terms', { term: 'post_tag', className: 'perla-tags' }),
    ]),
    comments(),
    pattern('post-footer'),
  ]),

  // the blog, and the fallback for everything else
  index: page([pattern('blog-header'), pattern('posts-loop')]),

  archive: page([
    band([b('core/query-title', { type: 'archive', level: 1, textAlign: 'center', className: 'perla-split' }), b('core/term-description', { textAlign: 'center' })]),
    pattern('posts-loop'),
  ]),

  search: page([pattern('search-header'), pattern('posts-loop')]),

  404: page([pattern('not-found')]),
};

const PARTS = {
  header: [pattern('header')],
  footer: [pattern('footer')],
};

module.exports = { TEMPLATES, PARTS };
