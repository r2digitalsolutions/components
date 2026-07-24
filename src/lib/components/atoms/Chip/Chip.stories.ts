import type { Meta, StoryObj } from '@storybook/svelte';
import ChipStory from './ChipStory.svelte';

const meta = {
	title: 'Atoms/Chip',
	component: ChipStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'error'] },
		size: { control: 'select', options: ['sm', 'md'] },
		selected: { control: 'boolean' },
		disabled: { control: 'boolean' },
		dismissible: { control: 'boolean' }
	},
	args: {
		variant: 'default',
		size: 'md',
		selected: false,
		disabled: false,
		dismissible: true
	}
} satisfies Meta<typeof ChipStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: 'primary' } };
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { disabled: true } };
