# Vehicle selection, Stage 1 and diagnostic guides

Reviewed 13 October 2026. This update keeps one selected vehicle through the catalogue, published Stage 1 references and fault-code search. Source data is a reference, not an OEM vehicle identity or a diagnosis.

## Research and decisions

| First-party source | Useful pattern | Decision for 6006 |
| --- | --- | --- |
| [BR-Performance: Golf VIII R](https://www.br-performance.be/en-be/chiptuning/1-cars/54-volkswagen/2968-golf/10993-golf-viii-03-2020/12849-2-0-tsi-r/?stage=11887) | Vehicle, generation and engine selection; stock, advertised result and difference together | Show the existing source-backed result beside stock figures, with the actual publisher and source. Do not relabel advertised third-party results as a 6006 dyno measurement. |
| [HELLA: exhaust-gas aftertreatment diagnostics](https://www.hella.com/techworld/us/technical/exhaust-technology/exhaust-gas-aftertreatment-design-diagnostics/) | Diagnose using fault memory, live readings, system diagrams and interdependent signals | Explain how to inspect and compare readings, distinguish findings, repair a confirmed fault and verify the repair. A DTC does not imply a replacement part. |
| [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/) and [FAQ](https://vpic.nhtsa.dot.gov/api/home/index/faq) | Public VIN/manufacturer data; incomplete foreign-vehicle coverage | Preserve the existing private full-VIN workflow: identify WMI locally, query only the three-character manufacturer prefix if necessary. Do not promise European engine/ECU decoding. The user confirms model and engine separately. |
| [TecAlliance: TecDoc Web Service](https://www.tecalliance.net/products/cards/tecdoc-web-service) | Commercial vehicle/OE/VIN matching for a parts catalogue | Defer full vehicle-specific parts matching until a licensed data provider is available. No fake integration, universal part recommendation or inferred tightening torque. |

## Correct vehicle memory

An empty engine selection must stay empty. It must not index engine zero. Selected variants use a composite identity including generation, year bounds, fuel, transmission and stock power/torque. Only a matching remembered vehicle may supply its engine information after navigation; changing make/model cannot import a different vehicle's engine.

Vehicle data remains in browser storage. No full VIN is stored or included in quotation messages. Contact actions are optional and explicit. Catalogue and diagnostic content stays readable on the website.

## Fault-code workspace

An explicit URL manufacturer takes precedence. Otherwise the saved vehicle determines the manufacturer filter when a dataset exists. Generic definitions remain available; unsupported makes receive an explicit generic fallback. The context panel and exported report distinguish the saved vehicle from the actual definition filter.

Autocomplete uses the same filtering and aliases as the result list. German AGR and EGR searches share the same recirculation definition matching. Manufacturer, family and component filters continue to apply when a suggestion is selected.

DPF matching uses whole-word boundaries so an EGR pressure-feedback (DPFE) definition is not misclassified as a particulate-filter fault. Related-code links must survive the input blur/change event: updating a vehicle cannot replace an anchor during the first click.

## Focused practical guides

`6006-diagnostic-playbooks.json` holds original German, Turkish and English content, code-specific diagnostic focus, six system workflows and first-party source references. New focused codes: P2453, P2454, P2455, P20E8, P203F, P229F, P2200, P2202, P2203 and P246C. Existing DPF, AGR, SCR, NOx and turbo guides also receive the focused workflow.

The catalogue shows symptoms, how to test, finding-to-action branches and after-repair checks in accessible tabs. Direct focused code pages have crawlable German HTML and native phone-language rendering. Without JavaScript, all sections remain readable. Sources explain diagnostic principles; vehicle-specific wiring, calibration, limits and service actions require the matching manufacturer procedure.

Do not perform a forced regeneration from generic web instructions. Distinguish soot from ash, electrical signal faults from actual restriction, sensor 1 from sensor 2 and supply faults from SCR conversion faults. Repairs preserve functioning emissions controls.

## Publication

The authoritative live project is `Haydars1/6006coding-site`, main branch, Render static service `6006coding`. Build runs the existing generators and validations. Generated directories are build output; publish authored sources and required assets, not thousands of generated duplicates. The older ChatGPT Sites project is not the current live source.

The requested Instagram profile artwork is also available as `/assets/6006-coding-instagram.jpg`. Its subtitle reads CODING; the turbo/ECU emblem, red graph accent, black background and gold ring remain.

## Validation

Run `npm test` for the complete static build, locale, source/guide and generated-link checks. In this proxy-based execution environment use `NODE_USE_ENV_PROXY=1 npm test`; Render uses its normal network environment.

Browser journey regressions are in `scripts/verify-journey-browser.cjs` and require Playwright/Chromium in the development environment. Serve `dist` on a local HTTP port, then run `JOURNEY_BASE_URL=http://127.0.0.1:8767 node scripts/verify-journey-browser.cjs`. Coverage includes incomplete and exact engine selection, cross-vehicle memory, VIN privacy, published Stage 1 results, first-click navigation, manufacturer/filter consistency, reports and native-language guide pages.
