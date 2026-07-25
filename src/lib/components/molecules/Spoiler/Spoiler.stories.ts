import type { Meta, StoryObj } from '@storybook/svelte';
import SpoilerStory from './SpoilerStory.svelte';

const meta = {
	title: 'Molecules/Spoiler',
	component: SpoilerStory,
	tags: ['autodocs']
} satisfies Meta<typeof SpoilerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
