import type { Meta, StoryObj } from '@storybook/svelte';
import TimeRulerStory from './TimeRulerStory.svelte';

const meta = {
	title: 'Atoms/TimeRuler',
	component: TimeRulerStory,
	tags: ['autodocs']
} satisfies Meta<typeof TimeRulerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
