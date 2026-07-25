import type { Meta, StoryObj } from '@storybook/svelte';
import VoteControlStory from './VoteControlStory.svelte';

const meta = {
	title: 'Molecules/VoteControl',
	component: VoteControlStory,
	tags: ['autodocs']
} satisfies Meta<typeof VoteControlStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
