// js-yaml ships no types and @types/js-yaml is not installed; only what src/ uses.
declare module 'js-yaml' {
  export const JSON_SCHEMA: unknown;
  export function load(input: string, options?: { schema?: unknown }): unknown;
}
