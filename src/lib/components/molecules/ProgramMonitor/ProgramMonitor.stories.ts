import type { Meta, StoryObj } from '@storybook/svelte';
import ProgramMonitorStory from './ProgramMonitorStory.svelte';

const meta = {
	title: 'Molecules/ProgramMonitor',
	component: ProgramMonitorStory,
	tags: ['autodocs']
} satisfies Meta<typeof ProgramMonitorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
