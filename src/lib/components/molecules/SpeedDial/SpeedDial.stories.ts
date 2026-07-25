import type { Meta, StoryObj } from '@storybook/svelte';
import SpeedDialStory from './SpeedDialStory.svelte';

const meta = {
	title: 'Molecules/SpeedDial',
	component: SpeedDialStory,
	tags: ['autodocs']
} satisfies Meta<typeof SpeedDialStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
