import type { Meta, StoryObj } from '@storybook/svelte';
import DescriptionsStory from './DescriptionsStory.svelte';

const meta = {
	title: 'Molecules/Descriptions',
	component: DescriptionsStory,
	tags: ['autodocs'],
	argTypes: {
		columns: { control: 'select', options: [1, 2, 3] },
		bordered: { control: 'boolean' },
		size: { control: 'select', options: ['sm', 'md'] },
		title: { control: 'text' }
	},
	args: {
		columns: 2,
		bordered: true,
		size: 'md',
		title: 'User profile'
	}
} satisfies Meta<typeof DescriptionsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ThreeColumns: Story = { args: { columns: 3 } };
export const Compact: Story = { args: { size: 'sm' } };
