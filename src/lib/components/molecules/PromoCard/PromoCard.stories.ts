import type { Meta, StoryObj } from '@storybook/svelte';
import PromoCardStory from './PromoCardStory.svelte';

const meta = {
	title: 'Molecules/PromoCard',
	component: PromoCardStory,
	tags: ['autodocs']
} satisfies Meta<typeof PromoCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
