This directory contains a working example of using `motionless` to generate a static HTML files. It renders the contents of this `README.md` markdown file and merges it with `basic.html`, writing the resulting page to `build/index.html`.

## Set up

```
npm install
```

## Run it

```
node generate.js
```

## Layout

This example consists of:

 * A `package.json` file with `motionless` as a dependency.
 * A `basic.html` template file that the page is built form.
 * This `README.md` content file.
 * The script `generate.js` which does the work to produce `build/index.html`.
