import type { Meta, StoryObj } from '@storybook/svelte';
import CheckoutTemplateStory from './CheckoutTemplateStory.svelte';

const meta = {
	title: 'Templates/CheckoutTemplate',
	component: CheckoutTemplateStory,
	tags: ['autodocs']
} satisfies Meta<typeof CheckoutTemplateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
