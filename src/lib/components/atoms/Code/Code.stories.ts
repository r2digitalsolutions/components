import type { Meta, StoryObj } from '@storybook/svelte';
import CodeStory from './CodeStory.svelte';

const meta = {
	title: 'Atoms/Code',
	component: CodeStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md'] },
		block: { control: 'boolean' }
	},
	args: { size: 'sm', block: false }
} satisfies Meta<typeof CodeStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
