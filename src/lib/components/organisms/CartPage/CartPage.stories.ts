import type { Meta, StoryObj } from '@storybook/svelte';
import CartPageStory from './CartPageStory.svelte';

const meta = {
	title: 'Organisms/CartPage',
	component: CartPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof CartPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
