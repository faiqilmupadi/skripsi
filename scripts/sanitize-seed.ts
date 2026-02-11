import fs from 'fs';

const input = process.argv[2] || 'datasetreal_decimal_filtered_101_261_Z48_plantCabangYasmin.sql';
const output = process.argv[3] || 'dataset_sanitized.sql';
const sql = fs.readFileSync(input, 'utf8');
const cleaned = sql.replace(/'([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?)'/g, (_, n) => n.replace(/,/g, ''));
fs.writeFileSync(output, cleaned, 'utf8');
console.log(`Sanitized SQL written to ${output}`);
