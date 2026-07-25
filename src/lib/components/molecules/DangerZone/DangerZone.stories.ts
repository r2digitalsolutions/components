import type { Meta, StoryObj } from '@storybook/svelte';
import DangerZoneStory from './DangerZoneStory.svelte';

const meta = {
	title: 'Molecules/DangerZone',
	component: DangerZoneStory,
	tags: ['autodocs']
} satisfies Meta<typeof DangerZoneStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
