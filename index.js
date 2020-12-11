const fs = require('fs');
const jsdom = require("jsdom");
const minify = require('minify');
const { JSDOM } = jsdom;
const glob = require("glob");
const commonmark = require('commonmark');
const md_reader = new commonmark.Parser();
const md_writer = new commonmark.HtmlRenderer();

module.exports = {
  minify: minify,
  read: function(path) { return fs.readFileSync(path).toString(); },
  write: fs.writeFileSync,
  dir: function(path, options) { return fs.readdirSync(path, options); },
  glob: glob,
  dom: function(plaintext) {
    const d = new JSDOM(plaintext);
    d.doc = d.window.document;
    d.h = require("hyperscript-custom")({"document": d.doc})
    d.$ = d.doc.querySelector.bind(d.doc);
    d.$$ = (query)=>[...d.doc.querySelectorAll(query)];
    return d;
  },
  slug: function(text) {
    // https://gist.github.com/mathewbyrne/1280286
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },
  $: function(element, query) {
    return element.querySelector(query);
  },
  $$: function(element, query) {
    return [...element.querySelectorAll(query)];
  },
  remove: function(element) {
    return element.parentNode.removeChild(element);
  },
  replace: function(element, replacement) {
    return element.parentNode.replaceChild(replacement, element);
  },
  md: function(plaintext) {
    return md_writer.render(md_reader.parse(plaintext));
  }
}
