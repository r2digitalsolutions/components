import type { Meta, StoryObj } from '@storybook/svelte';
import FooterStory from './FooterStory.svelte';

const meta = {
	title: 'Organisms/Footer',
	component: FooterStory,
	tags: ['autodocs']
} satisfies Meta<typeof FooterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
