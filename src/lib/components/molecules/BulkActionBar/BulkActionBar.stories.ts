import type { Meta, StoryObj } from '@storybook/svelte';
import BulkActionBarStory from './BulkActionBarStory.svelte';

const meta = {
	title: 'Molecules/BulkActionBar',
	component: BulkActionBarStory,
	tags: ['autodocs']
} satisfies Meta<typeof BulkActionBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
