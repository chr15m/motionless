const fs = require('fs');
const jsdom = require("jsdom");
const minify = require('minify');
const { JSDOM } = jsdom;
const glob = require("glob");
const commonmark = require('commonmark');
const md_reader = new commonmark.Parser();
const md_writer = new commonmark.HtmlRenderer();

const $ = (element, query) => element.querySelector(query);
const $$ = (element, query) => [...element.querySelectorAll(query)];

module.exports = {
  // file system helpers
  load: function(path) { return fs.readFileSync(path).toString(); },
  save: fs.writeFileSync,
  dir: fs.readdirSync,
  glob: glob,
  // dom creation
  dom: function(plaintext) {
    const d = new JSDOM(plaintext);
    d.doc = d.window.document;
    d.$ = $.bind(null, d.doc);
    d.$$ = $$.bind(null, d.doc);
    d.h = require("hyperscript-custom")({"document": d.doc})
    d.render = d.serialize;
    return d;
  },
  // minification
  minify: minify,
  // utility functions
  slug: function(text) {
    // https://gist.github.com/mathewbyrne/1280286
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },
  remove: function(element) {
    return element.parentNode.removeChild(element);
  },
  // markdown renderer
  md: function(plaintext) {
    return md_writer.render(md_reader.parse(plaintext));
  }
}
