const fs = require('fs');
const m = require('motionless');

// load basic.html to use as a template
const t = m.dom(m.load("basic.html"));

// load README.md to use as the content
const content = m.load("README.md");

// get a reference to the <body> tag in the document
const body = t.$("body");

// convert the markdown to an HTML string and set
// the content of the body tag to it
body.innerHTML = m.md(content);

// set the title of the page
t.$("title").textContent = "Motionless example!";

// build a table of contents
// get a list of the h2 headers in the page
const headers = t.$$("h2");
if (headers.length) {
  // build a list of <li> tags with an <a> link for every header
  const items = headers.map((h2)=>{
    // add a named href the TOC can link to
    h2.appendChild(t.h("a", {"className": "pilcrow", "name": m.slug(h2.textContent)}, " "))
    // create the TOC <li> link tag
    return t.h("li", {}, t.h("a", {"href": "#" + m.slug(h2.textContent)}, h2.textContent));
  });
  // create the top level <ul> tag containing the items
  const toc = t.h("ul", {"className": "toc"}, items);
  // prepend the table of contents inside the <main> tag
  body.prepend(toc);
  body.prepend(t.h("h2", {}, "Contents"));
}

// make the build folder
try { fs.mkdirSync("build"); } catch {}

// save the new page as index.html
m.save("build/index.html", t.render());

