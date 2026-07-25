import type { Meta, StoryObj } from '@storybook/svelte';
import ProductCardStory from './ProductCardStory.svelte';

const meta = {
	title: 'Molecules/ProductCard',
	component: ProductCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof ProductCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
