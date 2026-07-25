import type { Meta, StoryObj } from '@storybook/svelte';
import AuditLogPageStory from './AuditLogPageStory.svelte';

const meta = {
	title: 'Organisms/AuditLogPage',
	component: AuditLogPageStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'empty']
		}
	},
	args: { variant: 'default' }
} satisfies Meta<typeof AuditLogPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
	args: { variant: 'empty' }
};
