import type { Meta, StoryObj } from '@storybook/svelte';
import ConflictResolverStory from './ConflictResolverStory.svelte';

const meta = {
	title: 'Molecules/ConflictResolver',
	component: ConflictResolverStory,
	tags: ['autodocs']
} satisfies Meta<typeof ConflictResolverStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
