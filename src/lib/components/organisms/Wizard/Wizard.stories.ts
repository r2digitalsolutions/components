import type { Meta, StoryObj } from '@storybook/svelte';
import WizardStory from './WizardStory.svelte';

const meta = {
	title: 'Organisms/Wizard',
	component: WizardStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered'
	},
	argTypes: {
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		variant: { control: 'select', options: ['numbered', 'dots'] },
		clickable: { control: 'boolean' },
		nonLinear: { control: 'boolean' },
		showDescription: { control: 'boolean' },
		showConnectors: { control: 'boolean' },
		showStepHeader: { control: 'boolean' },
		loading: { control: 'boolean' },
		canNext: { control: 'boolean' },
		withError: { control: 'boolean' }
	},
	args: {
		orientation: 'horizontal',
		size: 'md',
		variant: 'numbered',
		clickable: false,
		nonLinear: false,
		showDescription: true,
		showConnectors: true,
		showStepHeader: true,
		loading: false,
		canNext: true,
		withError: false
	}
} satisfies Meta<typeof WizardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Clickable: Story = { args: { clickable: true } };
export const NonLinear: Story = { args: { clickable: true, nonLinear: true } };
export const Dots: Story = {
	args: { variant: 'dots', showDescription: false }
};
export const Loading: Story = { args: { loading: true } };
export const WithError: Story = { args: { withError: true, clickable: true } };
export const Compact: Story = {
	args: { size: 'sm', showDescription: false }
};
