import type { Meta, StoryObj } from '@storybook/svelte';
import KbdStory from './KbdStory.svelte';

const meta = {
	title: 'Atoms/Kbd',
	component: KbdStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md'] }
	},
	args: {
		keys: ['⌘', 'K'],
		size: 'md'
	}
} satisfies Meta<typeof KbdStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
