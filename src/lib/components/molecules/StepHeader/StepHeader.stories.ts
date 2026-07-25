import type { Meta, StoryObj } from '@storybook/svelte';
import StepHeaderStory from './StepHeaderStory.svelte';

const meta = {
	title: 'Molecules/StepHeader',
	component: StepHeaderStory,
	tags: ['autodocs']
} satisfies Meta<typeof StepHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
