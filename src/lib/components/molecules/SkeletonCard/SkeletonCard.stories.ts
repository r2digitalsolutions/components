import type { Meta, StoryObj } from '@storybook/svelte';
import SkeletonCardStory from './SkeletonCardStory.svelte';

const meta = {
	title: 'Molecules/SkeletonCard',
	component: SkeletonCardStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['gallery', 'grid', 'single', 'feed']
		},
		layout: {
			control: 'select',
			options: ['article', 'profile', 'list', 'stats', 'product', 'post', 'form']
		},
		media: { control: 'boolean' },
		avatar: { control: 'boolean' },
		actions: { control: 'boolean' },
		lines: { control: { type: 'number', min: 1, max: 6 } },
		animation: { control: 'select', options: ['shimmer', 'pulse', 'none'] }
	},
	args: {
		example: 'gallery',
		layout: 'article',
		media: true,
		avatar: true,
		actions: true,
		lines: 3,
		animation: 'shimmer'
	}
} satisfies Meta<typeof SkeletonCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Gallery',
	args: { example: 'gallery' }
};

export const ProductGrid: Story = {
	name: 'Product grid',
	args: { example: 'grid' }
};

export const SocialFeed: Story = {
	name: 'Social feed',
	args: { example: 'feed' }
};

export const Single: Story = {
	args: { example: 'single', layout: 'article' }
};
