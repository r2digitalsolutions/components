import type { Meta, StoryObj } from '@storybook/svelte';
import PlayheadStory from './PlayheadStory.svelte';

const meta = {
	title: 'Atoms/Playhead',
	component: PlayheadStory,
	tags: ['autodocs']
} satisfies Meta<typeof PlayheadStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
