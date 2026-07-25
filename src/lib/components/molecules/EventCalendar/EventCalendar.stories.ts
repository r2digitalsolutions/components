import type { Meta, StoryObj } from '@storybook/svelte';
import EventCalendarStory from './EventCalendarStory.svelte';

const meta = {
	title: 'Molecules/EventCalendar',
	component: EventCalendarStory,
	tags: ['autodocs']
} satisfies Meta<typeof EventCalendarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
