import type { Meta, StoryObj } from '@storybook/svelte';
import LabeledProgressStory from './LabeledProgressStory.svelte';

const meta = {
	title: 'Atoms/LabeledProgress',
	component: LabeledProgressStory,
	tags: ['autodocs'],
	args: { label: 'Storage used', value: 72, helper: '7.2 GB of 10 GB' }
} satisfies Meta<typeof LabeledProgressStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
