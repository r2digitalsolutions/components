import type { Meta, StoryObj } from '@storybook/svelte';
import StepMarkStory from './StepMarkStory.svelte';

const meta = {
	title: 'Atoms/StepMark',
	component: StepMarkStory,
	tags: ['autodocs']
} satisfies Meta<typeof StepMarkStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
