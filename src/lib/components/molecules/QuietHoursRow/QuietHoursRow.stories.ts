import type { Meta, StoryObj } from '@storybook/svelte';
import QuietHoursRowStory from './QuietHoursRowStory.svelte';

const meta = {
	title: 'Molecules/QuietHoursRow',
	component: QuietHoursRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof QuietHoursRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
