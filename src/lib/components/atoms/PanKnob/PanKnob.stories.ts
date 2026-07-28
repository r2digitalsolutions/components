import type { Meta, StoryObj } from '@storybook/svelte';
import PanKnobStory from './PanKnobStory.svelte';

const meta = {
	title: 'Atoms/PanKnob',
	component: PanKnobStory,
	tags: ['autodocs']
} satisfies Meta<typeof PanKnobStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
