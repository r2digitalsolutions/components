import type { Meta, StoryObj } from '@storybook/svelte';
import SearchInputStory from './SearchInputStory.svelte';

const meta = {
	title: 'Molecules/SearchInput',
	component: SearchInputStory,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		disabled: { control: 'boolean' }
	},
	args: { placeholder: 'Search projects…', size: 'md', disabled: false }
} satisfies Meta<typeof SearchInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
