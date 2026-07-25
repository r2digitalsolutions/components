import type { Meta, StoryObj } from '@storybook/svelte';
import PulseDotStory from './PulseDotStory.svelte';

const meta = {
	title: 'Atoms/PulseDot',
	component: PulseDotStory,
	tags: ['autodocs']
} satisfies Meta<typeof PulseDotStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
