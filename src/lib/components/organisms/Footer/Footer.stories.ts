import type { Meta, StoryObj } from '@storybook/svelte';
import FooterStory from './FooterStory.svelte';

const meta = {
	title: 'Organisms/Footer',
	component: FooterStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		example: {
			control: 'select',
			options: ['product', 'minimal', 'centered', 'mega', 'compact', 'newsletter', 'docs']
		},
		variant: {
			control: 'select',
			options: ['default', 'minimal', 'centered', 'mega', 'compact']
		},
		brand: { control: 'text' },
		description: { control: 'text' },
		badge: { control: 'text' }
	},
	args: {
		example: 'product',
		variant: 'default',
		brand: 'R2DigiSolutions',
		description: 'Building thoughtful product interfaces.',
		badge: ''
	}
} satisfies Meta<typeof FooterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Product',
	args: { example: 'product' }
};

export const Minimal: Story = {
	args: { example: 'minimal', badge: 'v2.4' }
};

export const Centered: Story = {
	args: { example: 'centered' }
};

export const Mega: Story = {
	args: { example: 'mega', badge: 'Design System' }
};

export const Compact: Story = {
	args: { example: 'compact' }
};

export const WithNewsletter: Story = {
	name: 'With newsletter',
	args: { example: 'newsletter' }
};

export const Docs: Story = {
	args: { example: 'docs' }
};
