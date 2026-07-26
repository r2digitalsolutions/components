import type { Meta, StoryObj } from '@storybook/svelte';
import ForbiddenStory from './ForbiddenStory.svelte';

const meta = {
	title: 'Molecules/Forbidden',
	component: ForbiddenStory,
	tags: ['autodocs']
} satisfies Meta<typeof ForbiddenStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
