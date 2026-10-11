// Conservative source-quality rules. A public dataset is not OEM verification.
export const placeholder = description => /^(?:manufacturer controlled dtc|(?:iso[ /-]*)?sae reserved|reserved(?:\s.*)?|not (?:used|defined|assigned)|unknown|no definition available)[.!\s]*$/i.test(String(description).trim());
export const hasDefinition = rows => rows.some(row => !placeholder(row.description));
export const readiness = description => /(?:readiness|monitor testing|systems? test).*(?:not complete|not completed|incomplete)/i.test(description);
export const specialist = description => /airbag|srs|pretension|restraint|squib|high.voltage|hybrid|traction battery|pyrotechnic/i.test(description);
