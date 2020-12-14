<p align="center">
  <img src="logo.svg?sanitize=true" alt="motionless logo"><br/>
</p>

**Motionless** is a static site generator for making websites using plain JavaScript and HTML with Node. There's no special templating or config language to learn. Instead you load plain HTML files and then use querySelectors and the DOM API to change pages using JavaScript, just like you would in the browser. Motionless has batteries included - it bundles dependencies for doing static site stuff like **markdown rendering**, **parsing HTML**, **reading and writing files**, **querySelectors**, etc. The result is a concise JavaScript API to specify exactly how to turn your HTML file into multiple web pages with different content. Motionless has a bias towards shipping sites fast and tries to save on typing.

# Install

`npm i motionless`

# Use

There is a minimal working example in the [example](./example) folder. You can use the `live-reload` package (`npm i live-reload`) to serve your build directory while you build your static site.

The following are some recipes for doing common static site tasks.

In this first example we load an HTML file and a markdown file and replace the `<main>` element with a rendered version of the markdown.

```javascript
const m = require('motionless');

// load and parse index.html to use as a template
const template = m.dom(m.load("index.html"));
// load README.md and render it to an HTML string
const content = m.md(m.load("README.md"));
// set the <main> tag contents to the rendered markdown
template.$("main").innerHTML = content;
// save the whole thing into the file readme.html
m.save("readme.html", template.render());
```

Here's another example building a table of contents from all of the `<h2>` tags on the page. We use the [hyperscript](https://github.com/hyperhype/hyperscript) helper to generate HTML using JavaScript code.

```javascript
// get a list of the h2 headers in the page
const headers = template.$$("h2");
if (headers.length) {
  // build a list of <li> tags with an <a> link for every header
  const items = headers.map((h2)=>{
    // add a named href the TOC can link to
    h2.appendChild(t.h("a", {"className": "pilcrow", "name": m.slug(h2.textContent)}, " "))
    // create the TOC <li> link tag
    return t.h("li", {}, t.h("a", {"href": "#" + m.slug(h2.textContent)}, h2.textContent));
  });
  // create the top level <ul> tag containing the items
  const toc = template.h("ul", {"className": "toc"}, items);
  // prepend the table of contents inside the <main> tag
  template.$("main").prepend(toc);
}
```

A final example showing how to load up several markdown pages and render them using a single template.

```javascript
m = require('motionless');

// load our basic page
template = m.dom(m.load("index.html"));

// list the content folder full of markdown files
m.dir("content").forEach(function(pagefile) {
  const page = m.load("content/" + pagefile);
  const title = pagefile.replace(/\-/g, " ").replace(".md", "");
  // set the main part of the template, the title, and the h1 tag
  template.$("main").innerHTML = m.md(page);
  template.$("title").textContent = title;
  template.$("h1").textContent = title;
  // save the updated HTML file
  m.save(pagefile.replace(".md", ".html"), template.render());
});
```

# API

## `m.load(path)`

Reads the entire file at `path` and returns a string synchronously.

## `m.save(path, contents)`

A simple alias for `writeFileSync` to write the string `contents` into the file at `path`.

## `m.dir(path)`

A simple alias for `readdirSync` to get a listing of files in the directory at `path`.

## `m.glob(globstring)`

An instance of [node-glob](https://github.com/isaacs/node-glob) to provide a convenient way to generate file listings using wildcards etc.

## `m.dom(html)`

Parses the `html` string using `jsdom` and returns a [jsDOM](https://www.npmjs.com/package/jsdom) object that behaves just like a [browser HTML `Node`](https://developer.mozilla.org/en-US/docs/Web/API/Node).

For convenience the returned jsdom object has some useful properties set:

 * `template.doc` - convenient access to the `document` object.
 * `template.$` - a shortcut for `template.doc.querySelector` returning a single HTML `Node`.
 * `template.$$` - a shortcut for `querySelectorAll` returning a JavaScript array of HTML `Node`s.
 * `template.h` - a [hyperscript](https://github.com/hyperhype/hyperscript) instance you can use to build new DOM elements.
 * `template.render()` - convenience function for returning the HTML string of the rendered document.

## `m.remove(element)`

Convenience function to remove HTML `element` from it's parent node.

## `m.md(markdown)`

Render the `markdown` string to an HTML string. If you want to modify the rendered markdown using the DOM API just wrap it with `m.dom()` like this:

```javascript
const content = m.dom(m.md(m.load("README.md")));
```

## `m.minify(various)`

An instance of [minify](https://coderaiser.github.io/minify/) that you can use to crunch various types of files. For example CSS and JavaScript:

```javascript
const styles = await minify('style.css');
const js = await minify('main.js').catch(console.error);
```

## `m.slug(text)`

Converts `text` into a URL-friendly path, for example: `My Wonderful Webpage` becomes `my-wonderful-webpage`.

# Who

Hi, 👋 I'm Chris and I made this. You can find me online at [mccormick.cx](https://mccormick.cx/) and [@mccrmx](https://twitter.com/mccrmx). I made this so I can ship static websites fast using Node.
