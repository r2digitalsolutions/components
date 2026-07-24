import type { Meta, StoryObj } from '@storybook/svelte';
import CascaderStory from './CascaderStory.svelte';

const meta = {
	title: 'Molecules/Cascader',
	component: CascaderStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		disabled: { control: 'boolean' },
		changeOnSelect: { control: 'boolean' }
	},
	args: {
		label: 'Location',
		placeholder: 'Select location...',
		disabled: false,
		changeOnSelect: false
	}
} satisfies Meta<typeof CascaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ChangeOnSelect: Story = { args: { changeOnSelect: true } };
export const Disabled: Story = { args: { disabled: true } };
