/**
 * Blog writers. A post's frontmatter `authors:` lists ids from here. Not read from git: agents commit
 * under one account, so the commit author cannot tell writers apart. No job titles (Sơn 17/10).
 * A writer without `photo` gets a plain person icon, never initials.
 */
export type Author = { id: string; name: string; photo?: string; github?: string };

export const AUTHORS: Author[] = [
  // Photo: his GitHub avatar, 256 px.
  { id: 'son-piaz', name: 'Son Piaz', photo: '/blog/authors/son-piaz.jpg', github: 'sonpiaz' },
];

/**
 * An id from AUTHORS, or an older name entry such as "Son Piaz, Founder": the title after the comma
 * is dropped and the name is matched against the registry.
 */
export function resolveAuthor(entry: string): Author {
  const name = entry.split(',')[0].trim();
  return AUTHORS.find((a) => a.id === entry || a.name === name) ?? { id: entry, name };
}
