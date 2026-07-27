import type { Meta, StoryObj } from '@storybook/svelte';
import QueryBuilderStory from './QueryBuilderStory.svelte';

const meta = {
	title: 'Molecules/QueryBuilder',
	component: QueryBuilderStory,
	tags: ['autodocs']
} satisfies Meta<typeof QueryBuilderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
