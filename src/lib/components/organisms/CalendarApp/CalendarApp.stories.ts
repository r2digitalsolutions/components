import type { Meta, StoryObj } from '@storybook/svelte';
import CalendarAppStory from './CalendarAppStory.svelte';

const meta = {
	title: 'Organisms/CalendarApp',
	component: CalendarAppStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof CalendarAppStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
