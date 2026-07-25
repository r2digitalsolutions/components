import type { Meta, StoryObj } from '@storybook/svelte';
import FeatureComparisonStory from './FeatureComparisonStory.svelte';

const meta = {
	title: 'Organisms/FeatureComparison',
	component: FeatureComparisonStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	},
	argTypes: {
		example: { control: 'select', options: ['simple', 'rich', 'grouped'] }
	},
	args: {
		example: 'rich'
	}
} satisfies Meta<typeof FeatureComparisonStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Simple: Story = { args: { example: 'simple' } };
export const Grouped: Story = { args: { example: 'grouped' } };
