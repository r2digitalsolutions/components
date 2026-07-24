import type { Meta, StoryObj } from '@storybook/svelte';
import TransferListStory from './TransferListStory.svelte';

const meta = {
	title: 'Molecules/TransferList',
	component: TransferListStory,
	tags: ['autodocs'],
	argTypes: {
		leftTitle: { control: 'text' },
		rightTitle: { control: 'text' },
		searchable: { control: 'boolean' },
		disabled: { control: 'boolean' }
	},
	args: {
		leftTitle: 'Available',
		rightTitle: 'Selected',
		searchable: false,
		disabled: false
	}
} satisfies Meta<typeof TransferListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Searchable: Story = {
	args: { searchable: true }
};

export const Disabled: Story = {
	args: { disabled: true }
};
