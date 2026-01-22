import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// Custom fields beyond Starlight defaults
				author: z.string().default('Affitor Team'),
				tags: z.array(z.string()).optional(),
				relatedPages: z.array(z.string()).optional(),
				featured: z.boolean().default(false),
				videoUrl: z.string().url().optional(),
			}),
		}),
	}),
};
