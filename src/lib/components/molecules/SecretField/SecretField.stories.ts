import type { Meta, StoryObj } from '@storybook/svelte';
import SecretFieldStory from './SecretFieldStory.svelte';

const meta = {
	title: 'Molecules/SecretField',
	component: SecretFieldStory,
	tags: ['autodocs']
} satisfies Meta<typeof SecretFieldStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
