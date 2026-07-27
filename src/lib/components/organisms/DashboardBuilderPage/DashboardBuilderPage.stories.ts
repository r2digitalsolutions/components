import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardBuilderPageStory from './DashboardBuilderPageStory.svelte';

const meta = {
	title: 'Organisms/DashboardBuilderPage',
	component: DashboardBuilderPageStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: [
				'default',
				'preview',
				'empty',
				'dense',
				'no-picker',
				'executive',
				'minimal',
				'dirty'
			]
		}
	}
} satisfies Meta<typeof DashboardBuilderPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const Preview: Story = {
	args: { example: 'preview' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const Dense: Story = {
	args: { example: 'dense' }
};

export const NoPicker: Story = {
	args: { example: 'no-picker' }
};

export const Executive: Story = {
	args: { example: 'executive' }
};

export const Minimal: Story = {
	args: { example: 'minimal' }
};

export const UnsavedChanges: Story = {
	args: { example: 'dirty' }
};
