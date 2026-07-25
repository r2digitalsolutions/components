import type { Meta, StoryObj } from '@storybook/svelte';
import BlogPostStory from './BlogPostStory.svelte';

const meta = {
	title: 'Organisms/BlogPost',
	component: BlogPostStory,
	tags: ['autodocs'],
	argTypes: {
		layout: {
			control: 'select',
			options: ['stacked', 'with-toc']
		},
		showToc: { control: 'boolean' }
	}
} satisfies Meta<typeof BlogPostStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		layout: 'with-toc',
		showToc: true
	}
};

export const Stacked: Story = {
	args: {
		layout: 'stacked',
		showToc: true
	}
};

export const Minimal: Story = {
	args: {
		layout: 'stacked',
		showToc: false
	}
};
