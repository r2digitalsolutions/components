import type { Meta, StoryObj } from '@storybook/svelte';
import BulkActionBarStory from './BulkActionBarStory.svelte';

const meta = {
	title: 'Molecules/BulkActionBar',
	component: BulkActionBarStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['default', 'inline', 'icons', 'loading', 'neutral', 'compact']
		},
		size: { control: 'select', options: ['xs', 'sm'] },
		placement: { control: 'select', options: ['dock', 'inline'] },
		tone: { control: 'select', options: ['brand', 'neutral'] },
		maxPrimary: { control: { type: 'number', min: 1, max: 6 } }
	},
	args: {
		example: 'default',
		size: 'sm',
		placement: 'dock',
		tone: 'brand',
		maxPrimary: 3
	}
} satisfies Meta<typeof BulkActionBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
	args: { example: 'compact', size: 'xs' }
};

export const Inline: Story = {
	args: { example: 'inline', placement: 'inline' }
};

export const IconOnly: Story = {
	args: { example: 'icons', maxPrimary: 4 }
};

export const Loading: Story = {
	args: { example: 'loading' }
};

export const Neutral: Story = {
	args: { example: 'neutral', tone: 'neutral' }
};
