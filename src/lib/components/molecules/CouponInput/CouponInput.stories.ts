import type { Meta, StoryObj } from '@storybook/svelte';
import CouponInputStory from './CouponInputStory.svelte';

const meta = {
	title: 'Molecules/CouponInput',
	component: CouponInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof CouponInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
