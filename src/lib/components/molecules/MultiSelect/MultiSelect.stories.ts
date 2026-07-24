import type { Meta, StoryObj } from '@storybook/svelte';
import MultiSelectStory from './MultiSelectStory.svelte';

const meta = {
	title: 'Molecules/MultiSelect',
	component: MultiSelectStory,
	tags: ['autodocs'],
	argTypes: {
		searchable: { control: 'boolean' },
		max: { control: 'number' },
		disabled: { control: 'boolean' }
	},
	args: {
		searchable: true,
		label: 'Skills',
		disabled: false
	}
} satisfies Meta<typeof MultiSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MaxThree: Story = { args: { max: 3 } };
export const NoSearch: Story = { args: { searchable: false } };
export const Disabled: Story = { args: { disabled: true } };
