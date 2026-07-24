import type { Meta, StoryObj } from '@storybook/svelte';
import VirtualListStory from './VirtualListStory.svelte';

const meta = {
	title: 'Molecules/VirtualList',
	component: VirtualListStory,
	tags: ['autodocs'],
	argTypes: {
		count: { control: 'number' },
		itemHeight: { control: 'number' },
		height: { control: 'number' }
	},
	args: {
		count: 10000,
		itemHeight: 52,
		height: 400
	}
} satisfies Meta<typeof VirtualListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TenThousandItems: Story = {};
export const SmallList: Story = { args: { count: 100, height: 300 } };
export const TallRows: Story = { args: { count: 5000, itemHeight: 80, height: 480 } };
