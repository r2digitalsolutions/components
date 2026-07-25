import type { Meta, StoryObj } from '@storybook/svelte';
import PriceTagStory from './PriceTagStory.svelte';

const meta = {
	title: 'Molecules/PriceTag',
	component: PriceTagStory,
	tags: ['autodocs']
} satisfies Meta<typeof PriceTagStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
