import type { Meta, StoryObj } from '@storybook/svelte';
import FormSectionStory from './FormSectionStory.svelte';

const meta = {
	title: 'Molecules/FormSection',
	component: FormSectionStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['plain', 'card', 'inset'] },
		example: {
			control: 'select',
			options: ['settings', 'stack', 'collapsible', 'columns']
		}
	},
	args: {
		variant: 'card',
		example: 'settings'
	}
} satisfies Meta<typeof FormSectionStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Settings page',
	args: { example: 'settings', variant: 'plain' }
};
export const StackCard: Story = {
	name: 'Stack card',
	args: { example: 'stack', variant: 'card' }
};
export const Collapsible: Story = {
	args: { example: 'collapsible', variant: 'card' }
};
export const TwoColumns: Story = {
	name: 'Two columns',
	args: { example: 'columns', variant: 'card' }
};
