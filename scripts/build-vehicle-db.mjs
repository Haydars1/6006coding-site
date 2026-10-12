// Builds a compact, per-make on-site vehicle catalogue from the community ODbL data.
// Source: https://github.com/gor3a/vehicle-makes-models (ODbL-1.0)
// Upstream information compiled by the dataset authors from autoevolution.com.
// This is reference data, NOT manufacturer/OEM-verified repair or tuning data.
import fs from 'node:fs';
import path from 'node:path';
const out='dist/assets/vehicle-data';
const base='https://raw.githubusercontent.com/gor3a/vehicle-makes-models/main/data/csv/';
const norm=x=>String(x??'').trim();
function rows(csv) {
  const res=[];let row=[],field='',quoted=false;
  for(let i=0;i<csv.length;i++){
    const c=csv[i];
    if(quoted){if(c==='"'&&csv[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}
    else if(c==='"')quoted=true;
    else if(c===','){row.push(field);field='';}
    else if(c==='\n'){row.push(field.replace(/\r$/,''));if(row.some(Boolean))res.push(row);row=[];field='';}
    else field+=c;
  }
  if(field||row.length){row.push(field);res.push(row);}
  const fields=res.shift();
  return res.map(parts=>Object.fromEntries(fields.map((key,i)=>[key,parts[i]??''])));
}
async function download(name){
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),25000);
  try{const r=await fetch(base+name,{signal:ctl.signal,headers:{'User-Agent':'6006Performance/1.0 (ODbL source attribution)'}});if(!r.ok)throw Error(name+': '+r.status);return await r.text();}
  finally{clearTimeout(timer);}
}
async function main(){
  const [models,engines]=await Promise.all([download('makes-models.csv'),download('engines.csv')]);
  const index=rows(models),variants=rows(engines),groups=new Map();
  for(const r of index){
    const group=norm(r.make_group),make=norm(r.make),name=norm(r.model);
    if(!group||!make||!name)continue;
    if(!groups.has(group))groups.set(group,{slug:group,makes:new Set(),models:new Map()});
    const bucket=groups.get(group);bucket.makes.add(make);
    const key=make+'\u0000'+name;
    if(!bucket.models.has(key))bucket.models.set(key,{make,name,from:r.year_start||null,to:r.year_end||null,engines:[]});
  }
  for(const r of variants){
    const group=norm(r.make_group),make=norm(r.make),name=norm(r.model);
    const groupObj=groups.get(group);if(!groupObj)continue;
    const entity=groupObj.models.get(make+'\u0000'+name);if(!entity)continue;
    const e={
      generation:norm(r.generation),from:norm(r.gen_year_start),to:norm(r.gen_year_end),
      engine:norm(r.engine_label),fuel:norm(r.fuel_type),hp:Number(r.power_hp)||null,
      nm:Number(r.torque_nm)||null,transmission:norm(r.transmission),
      displacement:Number(r.displacement_cc)||null,
      drive:norm(r.drivetrain)
    };
    if(!e.engine)continue;
    entity.engines.push(e);
  }
  fs.mkdirSync(out,{recursive:true});
  // Build one compact, globally searchable index without duplicating detailed per-make files.
  // A model dictionary avoids repeating model and brand strings in every motor row.
  const engineSearchModels=[],engineSearchEntries=[],engineSearchMakes=[],makeIds=new Map();
  const makeIndex=make=>{
    if(!makeIds.has(make)){makeIds.set(make,engineSearchMakes.length);engineSearchMakes.push(make);}
    return makeIds.get(make);
  };
  const list=[];
  for(const group of groups.values()){
    const payload={license:'ODbL-1.0',source:'https://github.com/gor3a/vehicle-makes-models',upstream:'autoevolution.com',referenceOnly:true,
      makes:[...group.makes],models:[...group.models.values()]};
    fs.writeFileSync(path.join(out,group.slug+'.json'),JSON.stringify(payload));
    for(const model of payload.models){
      const modelId=engineSearchModels.length;
      engineSearchModels.push([makeIndex(model.make),model.name]);
      for(const e of model.engines){
        // [modelId,generation,label,firstYear,lastYear,HP,Nm,fuel,gearbox,drive].
        // These are third-party OPEN reference specs, never tuning targets.
        engineSearchEntries.push([modelId,e.generation,e.engine,e.from||model.from||"",e.to||model.to||"",e.hp,e.nm,e.fuel,e.transmission,e.drive]);
      }
    }
    list.push({slug:group.slug,makes:[...group.makes],models:payload.models.length,engines:payload.models.reduce((n,m)=>n+m.engines.length,0)});
  }
  const metadata={license:'ODbL-1.0',source:'https://github.com/gor3a/vehicle-makes-models',upstream:'autoevolution.com',
    databaseLicense:'https://opendatacommons.org/licenses/odbl/1-0/',
    notes:'This adapted reference database is offered under ODbL 1.0. Values are not OEM verified and must not be used as repair or Stage 1 limits.',
    makes:list.sort((a,b)=>a.makes[0].localeCompare(b.makes[0],'de')),
    totalModels:list.reduce((n,r)=>n+r.models,0),totalEngines:list.reduce((n,r)=>n+r.engines,0)};
  fs.writeFileSync(path.join(out,'index.json'),JSON.stringify(metadata));
  const engineSearch={
    schemaVersion:1,
    license:'ODbL-1.0',
    source:metadata.source,
    databaseLicense:metadata.databaseLicense,
    referenceOnly:true,
    note:'Open public reference data, NOT manufacturer verified and NOT Stage 1 tuning output.',
    count:engineSearchEntries.length,
    makes:engineSearchMakes,
    models:engineSearchModels,
    entries:engineSearchEntries
  };
  if(engineSearch.count!==metadata.totalEngines)throw Error('Engine index counts do not match the per-make catalogue');
  fs.writeFileSync(path.join(out,'engine-search.json'),JSON.stringify(engineSearch));
  console.log('OPEN VEHICLES: '+list.length+' make groups, '+metadata.totalModels+' models, '+metadata.totalEngines+' engine rows');
}
main().catch(error=>{
  console.warn('Open reference database unavailable; built-in vehicle finder remains available: '+error.message);
  // The build must stay usable if upstream or the network is unavailable.
});
