import type { Meta, StoryObj } from '@storybook/svelte';
import BrandMarkStory from './BrandMarkStory.svelte';

const meta = {
	title: 'Atoms/BrandMark',
	component: BrandMarkStory,
	tags: ['autodocs']
} satisfies Meta<typeof BrandMarkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
