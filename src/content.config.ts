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

const platformName = z.enum(['google', 'bing', 'facebook', 'instagram', 'linkedin', 'pinterest', 'youtube']);
const cardColor = z.enum(['green', 'orange']);
const sectionBackground = z.enum(['slate', 'white', 'gray']);

const gridItem = z.object({
  title: z.string(),
  description: z.string(),
  icon: iconName.optional(),
  platform: platformName.optional(),
  logoStyle: z.enum(['badge', 'full']).default('badge'),
  href: z.string().optional(),
  color: cardColor.default('green'),
});

const featureGridBlock = z.object({
  type: z.literal('featureGrid'),
  columns: z.union([z.literal(2), z.literal(3)]).default(2),
  cardStyle: z.enum(['bordered', 'plain']).default('bordered'),
  background: sectionBackground.default('slate'),
  items: z.array(gridItem),
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
  background: sectionBackground.default('gray'),
  icon: iconName.optional(),
});

const channelsListBlock = z.object({
  type: z.literal('channelsList'),
  eyebrow: z.string(),
  heading: z.string(),
  intro: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: iconName.optional(),
      platform: platformName.optional(),
    })
  ),
});

const teamBiosBlock = z.object({
  type: z.literal('teamBios'),
  eyebrow: z.string(),
  heading: z.string(),
  members: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      photo: z.string(),
      bio: z.string(),
    })
  ),
});

const processStepsBlock = z.object({
  type: z.literal('processSteps'),
  eyebrow: z.string(),
  heading: z.string(),
  note: z.string(),
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

const heroButton = z.object({ text: z.string(), href: z.string() });

const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    metaDescription: z.string(),
    hidden: z.boolean().default(false),
    redirectTo: z.string().optional(),
    showInNav: z.boolean().default(true),
    hero: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      description: z.string(),
      primaryButton: heroButton.optional(),
      secondaryButton: heroButton.optional(),
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),
    }),
    blocks: z.array(
      z.discriminatedUnion('type', [
        featureGridBlock,
        ctaBlock,
        textBlock,
        channelsListBlock,
        teamBiosBlock,
        processStepsBlock,
      ])
    ),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/settings' }),
  schema: z.object({
    blogVisible: z.boolean().default(true),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    client: z.string(),
    summary: z.string(),
    metaDescription: z.string(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    platforms: z.array(platformName).default([]),
    results: z.array(z.object({ value: z.string(), description: z.string() })).default([]),
    gallery: z.array(z.object({ image: z.string(), alt: z.string().optional() })).default([]),
    pubDate: z.coerce.date(),
    hidden: z.boolean().default(false),
    redirectTo: z.string().optional(),
  }),
});

export const collections = { blog, pages, settings, caseStudies };
