import type { Meta, StoryObj } from '@storybook/svelte';
import PhoneFrameStory from './PhoneFrameStory.svelte';

const meta = {
	title: 'Molecules/PhoneFrame',
	component: PhoneFrameStory,
	tags: ['autodocs']
} satisfies Meta<typeof PhoneFrameStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
