/* eslint-disable no-console */
import { promise } from 'glob-promise';
import fs from 'fs/promises';
import { join } from 'path';

function parseArgs() {
  const [, , jsiiBase, destinationLocation] = process.argv;
  if (!jsiiBase || !destinationLocation) {
    console.error(
      'Please provide a base location for location for jsii files and a destination location.'
    );
    console.error(
      'For example: npm run scrape-jsii -- ~/projects/aws-cdk/packages ./src/renderer/jsii/definitions'
    );
    process.exit(1);
  }
  return { jsiiBase, destinationLocation };
}

async function getFiles(dir: string): Promise<Array<string>> {
  return promise(`${dir}/**/.jsii`, {});
}

export async function scrape(params: {
  jsiiBase: string;
  destinationLocation: string;
}) {
  const allJsiiFiles = await getFiles(params.jsiiBase);
  const allContents: Array<any> = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const jsiiFile of allJsiiFiles) {
    const fileContents = await fs.readFile(jsiiFile, { encoding: 'utf-8' });
    const parsedContents = JSON.parse(fileContents);
    allContents.push(parsedContents);
  }

  const destinationFileName = `all.json`;
  await fs.writeFile(
    join(params.destinationLocation, destinationFileName),
    JSON.stringify(allContents)
  );
}

if (require.main === module) {
  const params = parseArgs();

  scrape(params)
    .then(() => {
      console.log(
        `Scraping complete, jsii files delivered from ${params.jsiiBase} to ${params.destinationLocation}`
      );
    })
    .catch((err) => {
      console.error(err);
    });
}

export default scrape;
