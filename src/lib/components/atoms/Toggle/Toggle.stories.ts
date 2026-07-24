import type { Meta, StoryObj } from '@storybook/svelte';
import ToggleStory from './ToggleStory.svelte';

const meta = {
	title: 'Atoms/Toggle',
	component: ToggleStory,
	tags: ['autodocs'],
	argTypes: {
		checked: { control: 'boolean', description: 'Toggle state' },
		disabled: { control: 'boolean', description: 'Disabled state' },
		label: { control: 'text', description: 'Label text' },
		labelPosition: { control: 'radio', options: ['left', 'right'], description: 'Label side' },
		size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Toggle size' }
	},
	args: { checked: false, disabled: false, label: 'Enable notifications', labelPosition: 'right', size: 'md' }
} satisfies Meta<typeof ToggleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { checked: false } };
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true, label: 'Disabled toggle' } };
export const LabelLeft: Story = { args: { labelPosition: 'left', label: 'Dark mode', checked: true } };
export const Small: Story = { args: { size: 'sm', label: 'Small toggle' } };
export const Large: Story = { args: { size: 'lg', label: 'Large toggle', checked: true } };
