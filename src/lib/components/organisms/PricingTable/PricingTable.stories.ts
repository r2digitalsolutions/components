import type { Meta, StoryObj } from '@storybook/svelte';
import PricingTableStory from './PricingTableStory.svelte';

const meta = {
	title: 'Organisms/PricingTable',
	component: PricingTableStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	},
	argTypes: {
		layout: {
			control: 'select',
			options: ['grid', 'horizontal', 'vertical', 'bento', 'compact', 'split', 'table']
		},
		columns: { control: 'select', options: [2, 3, 4] },
		planSet: {
			control: 'select',
			options: ['three', 'two', 'four', 'bento', 'comparison']
		},
		showBillingToggle: { control: 'boolean' },
		showFeatures: { control: 'boolean' },
		showComparison: { control: 'boolean' },
		maxFeatures: { control: 'number' },
		selectedId: { control: 'text' }
	},
	args: {
		layout: 'grid',
		planSet: 'three',
		showBillingToggle: false,
		showFeatures: true,
		showComparison: false,
		selectedId: ''
	}
} satisfies Meta<typeof PricingTableStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Horizontal: Story = { args: { layout: 'horizontal' } };
export const Vertical: Story = { args: { layout: 'vertical' } };
export const Bento: Story = { args: { layout: 'bento', planSet: 'bento' } };
export const Compact: Story = { args: { layout: 'compact', planSet: 'four', columns: 4 } };
export const Split: Story = { args: { layout: 'split' } };
export const Table: Story = { args: { layout: 'table', planSet: 'comparison' } };
export const CardsPlusComparison: Story = {
	args: { layout: 'grid', showComparison: true, planSet: 'comparison' }
};
export const TwoPlans: Story = { args: { planSet: 'two', columns: 2 } };
export const FourPlans: Story = { args: { planSet: 'four', columns: 4 } };
export const WithBillingToggle: Story = {
	args: { showBillingToggle: true, planSet: 'three' }
};
export const WithSelection: Story = {
	args: { selectedId: 'pro' }
};
export const TruncatedFeatures: Story = {
	args: { maxFeatures: 2, layout: 'compact', planSet: 'four', columns: 4 }
};
