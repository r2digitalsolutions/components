import type { Meta, StoryObj } from '@storybook/svelte';
import ComboboxStory from './ComboboxStory.svelte';

const meta = {
	title: 'Molecules/Combobox',
	component: ComboboxStory,
	tags: ['autodocs'],
	argTypes: {
		creatable: { control: 'boolean' },
		disabled: { control: 'boolean' }
	},
	args: {
		creatable: false,
		label: 'Framework',
		disabled: false
	}
} satisfies Meta<typeof ComboboxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Creatable: Story = { args: { creatable: true } };
export const Disabled: Story = { args: { disabled: true } };
