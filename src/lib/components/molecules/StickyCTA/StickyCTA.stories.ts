import type { Meta, StoryObj } from '@storybook/svelte';
import StickyCTAStory from './StickyCTAStory.svelte';

const meta = {
	title: 'Molecules/StickyCTA',
	component: StickyCTAStory,
	tags: ['autodocs']
} satisfies Meta<typeof StickyCTAStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
