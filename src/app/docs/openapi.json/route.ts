import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, JSON_SCHEMA } from 'js-yaml';

// /docs/openapi.json (affitor.com/openapi.json through the dashboard): the same spec as
// /docs/openapi.yaml, converted at build so the two cannot drift. Agents look for the JSON at the root.
export const dynamic = 'force-static';

export function GET() {
  const spec = load(readFileSync(join(process.cwd(), 'public/docs/openapi.yaml'), 'utf8'), { schema: JSON_SCHEMA });
  return new Response(`${JSON.stringify(spec, null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Link: '<https://affitor.com/docs/openapi.yaml>; rel="alternate"; type="text/yaml"',
    },
  });
}
