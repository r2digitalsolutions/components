import type { Meta, StoryObj } from '@storybook/svelte';
import FormActionsStory from './FormActionsStory.svelte';

const meta = {
	title: 'Molecules/FormActions',
	component: FormActionsStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['plain', 'bar', 'sticky'] },
		align: { control: 'select', options: ['start', 'end', 'between'] },
		example: { control: 'select', options: ['default', 'danger', 'hint'] },
		loading: { control: 'boolean' }
	},
	args: {
		variant: 'bar',
		align: 'end',
		loading: false,
		example: 'default'
	}
} satisfies Meta<typeof FormActionsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const WithDanger: Story = {
	name: 'With delete',
	args: { example: 'danger', align: 'between' }
};
export const WithHint: Story = {
	name: 'With hint',
	args: { example: 'hint', align: 'between' }
};
export const Sticky: Story = {
	args: { variant: 'sticky', example: 'danger', align: 'between' }
};
