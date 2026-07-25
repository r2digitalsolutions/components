import type { Meta, StoryObj } from '@storybook/svelte';
import FormActionsStory from './FormActionsStory.svelte';

const meta = {
	title: 'Molecules/FormActions',
	component: FormActionsStory,
	tags: ['autodocs'],
	argTypes: {
		align: { control: 'select', options: ['start', 'end', 'between'] },
		loading: { control: 'boolean' }
	},
	args: {
		submitLabel: 'Save changes',
		cancelLabel: 'Cancel',
		loading: false,
		align: 'end'
	}
} satisfies Meta<typeof FormActionsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: { loading: true }
};
