import type { Meta, StoryObj } from '@storybook/svelte';
import DataListPageStory from './DataListPageStory.svelte';

const meta = {
	title: 'Organisms/DataListPage',
	component: DataListPageStory,
	tags: ['autodocs'],
	argTypes: {
		empty: { control: 'boolean' },
		loading: { control: 'boolean' }
	},
	args: { empty: false, loading: false }
} satisfies Meta<typeof DataListPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
	args: { empty: true }
};

export const Loading: Story = {
	args: { loading: true }
};
