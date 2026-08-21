import type { Meta, StoryObj } from '@storybook/svelte';
import TreePanelStory from './TreePanelStory.svelte';

const meta = {
	title: 'Molecules/TreePanel',
	component: TreePanelStory,
	tags: ['autodocs'],
	argTypes: {
		showMeta: { control: 'boolean' },
		empty: { control: 'boolean' }
	},
	args: {
		showMeta: false,
		empty: false
	}
} satisfies Meta<typeof TreePanelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithOrder: Story = { args: { showMeta: true } };
export const Empty: Story = { args: { empty: true } };
