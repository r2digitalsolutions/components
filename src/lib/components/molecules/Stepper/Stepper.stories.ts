import type { Meta, StoryObj } from '@storybook/svelte';
import StepperStory from './StepperStory.svelte';

const meta = {
	title: 'Molecules/Stepper',
	component: StepperStory,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		clickable: { control: 'boolean' }
	},
	args: {
		orientation: 'horizontal',
		clickable: true
	}
} satisfies Meta<typeof StepperStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const ReadOnly: Story = { args: { clickable: false } };
