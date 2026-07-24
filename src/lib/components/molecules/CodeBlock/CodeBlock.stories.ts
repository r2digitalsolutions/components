import type { Meta, StoryObj } from '@storybook/svelte';
import CodeBlockStory from './CodeBlockStory.svelte';

const meta = {
	title: 'Molecules/CodeBlock',
	component: CodeBlockStory,
	tags: ['autodocs'],
	argTypes: {
		tone: {
			control: 'select',
			options: ['adaptive', 'contrast']
		},
		showLineNumbers: { control: 'boolean' },
		filename: { control: 'text' }
	},
	args: {
		tone: 'adaptive',
		showLineNumbers: true,
		filename: 'Button.svelte'
	}
} satisfies Meta<typeof CodeBlockStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Adaptive: Story = {};

export const Contrast: Story = {
	args: { tone: 'contrast' }
};

export const NoFilename: Story = {
	args: { filename: '' }
};

export const NoLineNumbers: Story = {
	args: { showLineNumbers: false }
};
