import type { Meta, StoryObj } from '@storybook/svelte';
import SeatMeterStory from './SeatMeterStory.svelte';

const meta = {
	title: 'Molecules/SeatMeter',
	component: SeatMeterStory,
	tags: ['autodocs']
} satisfies Meta<typeof SeatMeterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
