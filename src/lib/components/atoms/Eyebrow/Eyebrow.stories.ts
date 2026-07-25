import type { Meta, StoryObj } from '@storybook/svelte';
import EyebrowStory from './EyebrowStory.svelte';

const meta = {
	title: 'Atoms/Eyebrow',
	component: EyebrowStory,
	tags: ['autodocs']
} satisfies Meta<typeof EyebrowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
