import type { Meta, StoryObj } from '@storybook/svelte';
import UnauthorizedStory from './UnauthorizedStory.svelte';

const meta = {
	title: 'Molecules/Unauthorized',
	component: UnauthorizedStory,
	tags: ['autodocs']
} satisfies Meta<typeof UnauthorizedStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
