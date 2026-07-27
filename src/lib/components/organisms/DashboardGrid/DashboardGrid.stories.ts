import type { Meta, StoryObj } from '@storybook/svelte';
import DashboardGridStory from './DashboardGridStory.svelte';

const meta = {
	title: 'Organisms/DashboardGrid',
	component: DashboardGridStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		example: {
			control: 'select',
			options: [
				'default',
				'readonly',
				'six-cols',
				'dense',
				'static',
				'empty',
				'no-compact',
				'rich',
				'loading'
			]
		}
	}
} satisfies Meta<typeof DashboardGridStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { example: 'default' }
};

export const Readonly: Story = {
	args: { example: 'readonly' }
};

export const SixColumns: Story = {
	args: { example: 'six-cols' }
};

export const Dense: Story = {
	args: { example: 'dense' }
};

export const WithStaticWidget: Story = {
	args: { example: 'static' }
};

export const Empty: Story = {
	args: { example: 'empty' }
};

export const NoAutoCompact: Story = {
	args: { example: 'no-compact' }
};

export const RichContent: Story = {
	args: { example: 'rich' }
};

export const Loading: Story = {
	args: { example: 'loading' }
};
