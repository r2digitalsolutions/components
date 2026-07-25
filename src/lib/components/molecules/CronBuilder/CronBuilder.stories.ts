import type { Meta, StoryObj } from '@storybook/svelte';
import CronBuilderStory from './CronBuilderStory.svelte';

const meta = {
	title: 'Molecules/CronBuilder',
	component: CronBuilderStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['playground', 'deploy', 'backup', 'reports', 'minimal', 'disabled']
		},
		showPresets: { control: 'boolean' },
		showHuman: { control: 'boolean' },
		showExpression: { control: 'boolean' },
		showNextRuns: { control: 'boolean' },
		nextRunCount: { control: { type: 'number', min: 1, max: 8 } },
		minuteStep: { control: 'select', options: [1, 5, 15, 30] },
		disabled: { control: 'boolean' },
		frequency: {
			control: 'select',
			options: ['hourly', 'daily', 'weekly', 'monthly', 'custom']
		}
	},
	args: {
		example: 'playground',
		showPresets: true,
		showHuman: true,
		showExpression: true,
		showNextRuns: true,
		nextRunCount: 3,
		minuteStep: 15,
		disabled: false,
		frequency: 'weekly'
	}
} satisfies Meta<typeof CronBuilderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DeployPipeline: Story = {
	name: 'Deploy pipeline',
	args: { example: 'deploy', showNextRuns: true }
};

export const Backup: Story = {
	args: { example: 'backup', minuteStep: 5 }
};

export const MonthlyReport: Story = {
	name: 'Monthly report',
	args: { example: 'reports' }
};

export const Minimal: Story = {
	args: { example: 'minimal', showPresets: false }
};

export const Disabled: Story = {
	args: { example: 'disabled', disabled: true }
};

export const FineMinutes: Story = {
	name: '1-minute steps',
	args: { example: 'playground', minuteStep: 1, showNextRuns: true }
};
