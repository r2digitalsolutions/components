import type { Meta, StoryObj } from '@storybook/svelte';
import LinkStory from './LinkStory.svelte';

const meta = {
	title: 'Atoms/Link',
	component: LinkStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['default', 'muted', 'brand', 'underline'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		external: { control: 'boolean' }
	},
	args: { variant: 'brand', size: 'md', external: true }
} satisfies Meta<typeof LinkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Underline: Story = { args: { variant: 'underline', external: false } };
