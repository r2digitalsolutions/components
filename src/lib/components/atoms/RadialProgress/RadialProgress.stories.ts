import type { Meta, StoryObj } from '@storybook/svelte';
import RadialProgressStory from './RadialProgressStory.svelte';

const meta = {
	title: 'Atoms/RadialProgress',
	component: RadialProgressStory,
	tags: ['autodocs']
} satisfies Meta<typeof RadialProgressStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
