import type { Meta, StoryObj } from '@storybook/svelte';
import ComingSoonPageStory from './ComingSoonPageStory.svelte';

const meta = {
	title: 'Organisms/ComingSoonPage',
	component: ComingSoonPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof ComingSoonPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
