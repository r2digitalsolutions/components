import type { Meta, StoryObj } from '@storybook/svelte';
import TimezoneSelectStory from './TimezoneSelectStory.svelte';

const meta = {
	title: 'Molecules/TimezoneSelect',
	component: TimezoneSelectStory,
	tags: ['autodocs']
} satisfies Meta<typeof TimezoneSelectStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
