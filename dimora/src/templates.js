// Templates are plain .html: no translatable text here, the words live in the patterns.
const { b, space, section, flow, row } = require('./blocks');
const { pageHead } = require('./patterns');

const pattern = slug => b('core/pattern', { slug: `dimora/${slug}` });
const part = (slug, tagName) => b('core/template-part', { slug, tagName });

const page = inner => [
  part('header', 'header'),
  b('core/group', { tagName: 'main', style: { spacing: { margin: { top: '0' }, blockGap: '0' } }, layout: { type: 'default' } }, inner),
  part('footer', 'footer'),
];

const content = (className = 'dimora-content') => b('core/post-content', { align: 'full', className, layout: { type: 'constrained' } });

const comments = () => section({ name: 'Comments', tagName: 'div', bg: 'base', top: '0px', bottom: space('80') }, [
  b('core/comments', {}, [
    b('core/comments-title', { level: 2, fontSize: 'x-large' }),
    b('core/comment-template', {}, [
      row({ wrap: false, valign: 'top', gap: space('40'), margin: { bottom: space('50') } }, [
        b('core/avatar', { size: 44, style: { border: { radius: '22px' } } }),
        flow({ gap: '6px' }, [
          row({ gap: '10px' }, [b('core/comment-author-name', { fontSize: 'small' }), b('core/comment-date', { fontSize: 'small' }), b('core/comment-edit-link', { fontSize: 'small' })]),
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
  'front-page': page([pattern('front-page')]),

  page: page([
    pageHead([b('core/post-title', { level: 1, className: 'dimora-split' })]),
    content(),
  ]),

  'page-no-title': page([content()]),

  single: page([
    pageHead([
      row({ name: 'Details', gap: '14px' }, [b('core/post-terms', { term: 'category', className: 'is-style-dimora-label' }), b('core/post-date', { className: 'is-style-dimora-label' })]),
      b('core/post-title', { level: 1, className: 'dimora-split', style: { typography: { fontSize: 'clamp(38px, 5.6vw, 88px)' } } }),
    ]),
    section({ name: 'Article', tagName: 'article', bg: 'base', top: '0px', bottom: space('80'), gap: space('70') }, [
      b('core/post-featured-image', { align: 'wide', aspectRatio: '16/9', className: 'dimora-image dimora-parallax' }),
      content('dimora-article'),
      b('core/post-terms', { term: 'post_tag', className: 'dimora-tags' }),
    ]),
    comments(),
    pattern('post-footer'),
  ]),

  // the blog, and the fallback for everything else
  index: page([pattern('blog-header'), pattern('posts-loop')]),

  archive: page([
    pageHead([b('core/query-title', { type: 'archive', level: 1, className: 'dimora-split' }), b('core/term-description')]),
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
