// Retire public power comparisons on fresh builds and reused output directories.
// Keep a client-side fallback for existing bookmarks; this is not an HTTP redirect.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const retiredAssets = [
  '6006-stage1-directory.js', '6006-stage1-directory.css',
  '6006-stage1-open-engine-finder.js', '6006-stage1-seo-filter.js',
  '6006-stage1-references.json', '6006-stage1-seo.css',
  '6006-stage1-seo-summary.json'
];
for (const file of retiredAssets) fs.rmSync(path.join(root, 'assets', file), {force: true});

const legacyRoute = path.join(root, 'stage1-referenzen');
fs.rmSync(legacyRoute, {recursive: true, force: true});
fs.mkdirSync(legacyRoute, {recursive: true});
fs.writeFileSync(path.join(legacyRoute, 'index.html'), `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="https://6006coding.de/">
<meta http-equiv="refresh" content="0;url=/#aracin">
<title>Fahrzeugsoftware &amp; Codierung | 6006 Coding</title>
<script>location.replace('/#aracin');</script>
</head><body><p><a href="/#aracin">Fahrzeugsoftware &amp; Codierung</a></p></body></html>
`, 'utf8');

const sitemapFile = path.join(root, 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapFile, 'utf8');
fs.writeFileSync(sitemapFile, sitemap.replace(/\s*<url>\s*<loc>https:\/\/6006coding\.de\/stage1-referenzen\/[^<]*<\/loc>[\s\S]*?<\/url>/g, ''), 'utf8');
console.log('SERVICES: retired comparison assets removed; legacy bookmarks lead to the software and coding overview');
