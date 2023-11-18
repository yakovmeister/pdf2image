import { fromPath } from "./src";
import { promises as fs } from 'fs'

async function main() {
  const convert = fromPath("./test/data/pdf1.pdf", {
    width: 1000,
    height: undefined,
    density: 300,
    preserveAspectRatio: true,
  })
  const pagePng = await convert(2, { responseType: "buffer" })

  await fs.writeFile('./dump/page-test.png', pagePng.buffer)
}

main()
