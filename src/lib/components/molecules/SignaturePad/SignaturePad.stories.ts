import type { Meta, StoryObj } from '@storybook/svelte';
import SignaturePadStory from './SignaturePadStory.svelte';

const meta = {
	title: 'Molecules/SignaturePad',
	component: SignaturePadStory,
	tags: ['autodocs']
} satisfies Meta<typeof SignaturePadStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
