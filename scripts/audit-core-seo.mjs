// Read-only SEO sanity audit for indexable German landing pages.
// Run after the generators (npm run build), so sitemap.xml reflects generated routes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const base='https://6006coding.de';
const root='dist';
const routes=['/','/fahrzeug/','/fehlercodes/','/technik/','/reparatur-wartung/','/stage1-referenzen/'];
const problems=[];
const warnings=[];
const attr=(tag,name)=>{
 const match=tag.match(new RegExp('(?:^|\s)'+name+'\s*=\s*(["\x27])([^"\x27]*)\1','i'));
 return match?match[2]:'';
};
const tags=(html,type)=>[...html.matchAll(new RegExp('<'+type+'\b[^>]*>','gi'))].map(m=>m[0]);
const meta=(html,name)=>tags(html,'meta').find(t=>attr(t,'name').toLowerCase()===name.toLowerCase());
const property=(html,name)=>tags(html,'meta').find(t=>attr(t,'property').toLowerCase()===name.toLowerCase());
const canonical=html=>tags(html,'link').filter(t=>attr(t,'rel').toLowerCase().split(/\s+/).includes('canonical'));
const sitemapPath=path.join(root,'sitemap.xml');
assert(fs.existsSync(sitemapPath),'Run SEO audit after site generation: sitemap.xml is missing');
const sitemap=fs.readFileSync(sitemapPath,'utf8');
const sitemapUrls=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
for(const route of routes){
 const file=path.join(root,route,'index.html');
 if(!fs.existsSync(file)){problems.push(route+': indexable landing page missing');continue;}
 const html=fs.readFileSync(file,'utf8');
 const expected=base+route;
 const title=(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)||[])[1]?.trim()||'';
 if(!title)problems.push(route+': missing title');
 const links=canonical(html);
 if(links.length!==1||attr(links[0],'href')!==expected)problems.push(route+': canonical must be exactly '+expected);
 if(!sitemapUrls.has(expected))problems.push(route+': not present in generated sitemap');
 if(!/<h1\b/i.test(html))warnings.push(route+': missing visible H1');
 const robots=attr(meta(html,'robots')||'','content').toLowerCase();
 if(robots.includes('noindex'))problems.push(route+': indexable page unexpectedly noindex');
 const description=attr(meta(html,'description')||'','content').trim();
 if(!description)warnings.push(route+': German meta description missing');
 else if(description.length<70||description.length>180)warnings.push(route+': meta description length '+description.length+' (review manually)');
 const ogUrl=attr(property(html,'og:url')||'','content');
 if(ogUrl&&ogUrl!==expected)problems.push(route+': og:url differs from canonical');
 if(route==='/fehlercodes/'&&/Arıza Kodu|Teşhis Kataloğu/i.test(title))warnings.push(route+': Turkish page title on German canonical; review localization');
 console.log('SEO:',route,'title='+JSON.stringify(title),'description='+description.length+' chars');
}
for(const warning of warnings)console.warn('SEO WARNING:',warning);
if(problems.length){for(const problem of problems)console.error('SEO ERROR:',problem);process.exitCode=1;}
else console.log('SEO audit: '+routes.length+' core routes checked, '+warnings.length+' advisory warning(s), no blocking errors.');
