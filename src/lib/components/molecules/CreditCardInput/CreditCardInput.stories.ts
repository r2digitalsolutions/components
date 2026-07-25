import type { Meta, StoryObj } from '@storybook/svelte';
import CreditCardInputStory from './CreditCardInputStory.svelte';

const meta = {
	title: 'Molecules/CreditCardInput',
	component: CreditCardInputStory,
	tags: ['autodocs']
} satisfies Meta<typeof CreditCardInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
