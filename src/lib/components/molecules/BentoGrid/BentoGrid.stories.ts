import type { Meta, StoryObj } from '@storybook/svelte';
import BentoGridStory from './BentoGridStory.svelte';

const meta = {
	title: 'Molecules/BentoGrid',
	component: BentoGridStory,
	tags: ['autodocs']
} satisfies Meta<typeof BentoGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
