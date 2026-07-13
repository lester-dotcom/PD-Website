import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const iconName = z.enum([
  'search',
  'share',
  'users',
  'graduation-cap',
  'sparkles',
  'chart',
  'megaphone',
  'pin',
  'briefcase',
  'chat',
  'target',
  'layers',
  'shield',
  'compass',
  'hashtag',
  'heart',
  'arrow-forward',
  'instagram',
  'youtube',
  'eye',
  'thumbsup',
  'gear',
]);

const cardColor = z.enum(['green', 'orange']);

const featureGridBlock = z.object({
  type: z.literal('featureGrid'),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: iconName,
      color: cardColor,
    })
  ),
});

const ctaBlock = z.object({
  type: z.literal('cta'),
  title: z.string(),
  description: z.string(),
});

const textBlock = z.object({
  type: z.literal('text'),
  heading: z.string().optional(),
  body: z.string(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    metaDescription: z.string(),
    hero: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string(),
    }),
    blocks: z.array(z.discriminatedUnion('type', [featureGridBlock, ctaBlock, textBlock])),
  }),
});

export const collections = { blog, pages };
