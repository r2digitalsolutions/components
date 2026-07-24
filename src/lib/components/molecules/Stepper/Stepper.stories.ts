import type { Meta, StoryObj } from '@storybook/svelte';
import StepperStory from './StepperStory.svelte';

const meta = {
	title: 'Molecules/Stepper',
	component: StepperStory,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		variant: { control: 'select', options: ['numbered', 'dots'] },
		clickable: { control: 'boolean' },
		nonLinear: { control: 'boolean' },
		showDescription: { control: 'boolean' },
		showConnectors: { control: 'boolean' },
		withError: { control: 'boolean' }
	},
	args: {
		orientation: 'horizontal',
		size: 'md',
		variant: 'numbered',
		clickable: true,
		nonLinear: false,
		showDescription: true,
		showConnectors: true,
		withError: false
	}
} satisfies Meta<typeof StepperStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Dots: Story = { args: { variant: 'dots', showDescription: false } };
export const NonLinear: Story = { args: { nonLinear: true } };
export const ReadOnly: Story = { args: { clickable: false } };
export const WithError: Story = { args: { withError: true } };
export const Compact: Story = {
	args: { size: 'sm', showDescription: false, showConnectors: true }
};
