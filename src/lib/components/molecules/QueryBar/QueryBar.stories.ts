import type { Meta, StoryObj } from '@storybook/svelte';
import QueryBarStory from './QueryBarStory.svelte';

const meta = {
	title: 'Molecules/QueryBar',
	component: QueryBarStory,
	tags: ['autodocs']
} satisfies Meta<typeof QueryBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
