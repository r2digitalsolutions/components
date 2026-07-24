import type { Meta, StoryObj } from '@storybook/svelte';
import ImageStory from './ImageStory.svelte';

const meta = {
	title: 'Atoms/Image',
	component: ImageStory,
	tags: ['autodocs'],
	argTypes: {
		src: { control: 'text' },
		alt: { control: 'text' },
		fallbackSrc: { control: 'text' },
		aspectRatio: { control: 'text' },
		rounded: { control: 'boolean' },
		objectFit: { control: 'select', options: ['cover', 'contain'] },
		loading: { control: 'select', options: ['lazy', 'eager'] }
	},
	args: {
		src: 'https://picsum.photos/seed/r2digi/400/300',
		alt: 'Sample image',
		aspectRatio: '4/3',
		rounded: true,
		objectFit: 'cover',
		loading: 'lazy'
	}
} satisfies Meta<typeof ImageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFallback: Story = {
	args: {
		src: 'https://broken-url.invalid/image.jpg',
		fallbackSrc: 'https://picsum.photos/seed/fallback/400/300'
	}
};

export const Contain: Story = {
	args: { objectFit: 'contain', aspectRatio: '16/9' }
};
