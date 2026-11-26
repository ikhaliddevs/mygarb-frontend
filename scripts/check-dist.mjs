import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(file) : [file];
    }),
  );
  return groups.flat();
}

const files = await walk('dist');
for (const file of files) {
  if (
    /\.dc\.html$|support\.js$|\.docx$|PICTURES INSPO|fixtures|mocks/i.test(file)
  ) {
    throw new Error(`Reference or test material in production build: ${file}`);
  }
  if (/\.(js|html)$/.test(file)) {
    const content = await readFile(file, 'utf8');
    if (
      /__dcBoot|DCLogic|data-dc-script|REQ-2026-0418|Folake Adeyemi/.test(
        content,
      )
    ) {
      throw new Error(`Legacy runtime or prototype fixture found in ${file}`);
    }
  }
}
console.log(`Production boundary verified across ${files.length} files.`);
