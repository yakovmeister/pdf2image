import { fromBuffer } from 'pdf2pic';
import fs from 'fs/promises'

const pdfBuffer = await fs.readFile('example.pdf');
const convert = fromBuffer(pdfBuffer, { width: 1024, preserveAspectRatio: true });
const result = await convert(1, { responseType: 'buffer' });

console.log(result);

await fs.writeFile('page_1.png', result.buffer, 'binary');
