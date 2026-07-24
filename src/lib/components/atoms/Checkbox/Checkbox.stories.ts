import type { Meta, StoryObj } from '@storybook/svelte';
import CheckboxStory from './CheckboxStory.svelte';

const meta = {
	title: 'Atoms/Checkbox',
	component: CheckboxStory,
	tags: ['autodocs'],
	argTypes: {
		checked: { control: 'boolean', description: 'Checked state' },
		indeterminate: { control: 'boolean', description: 'Indeterminate state (overrides checked)' },
		disabled: { control: 'boolean', description: 'Disabled state' },
		label: { control: 'text', description: 'Checkbox label' },
		helperText: { control: 'text', description: 'Helper text below the label' },
		size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Checkbox size' }
	},
	args: {
		checked: false,
		indeterminate: false,
		disabled: false,
		label: 'Accept terms and conditions',
		helperText: '',
		size: 'md'
	}
} satisfies Meta<typeof CheckboxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { checked: false } };
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { indeterminate: true, label: 'Select all' } };
export const WithHelper: Story = {
	args: { label: 'Marketing emails', helperText: 'Receive news and promotional offers.' }
};
export const Disabled: Story = { args: { disabled: true, label: 'Disabled option' } };
export const Small: Story = { args: { size: 'sm', label: 'Small checkbox', checked: true } };
export const Large: Story = { args: { size: 'lg', label: 'Large checkbox' } };
