import type { Meta, StoryObj } from '@storybook/svelte';
import AuditLogPageStory from './AuditLogPageStory.svelte';

const meta = {
	title: 'Organisms/AuditLogPage',
	component: AuditLogPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof AuditLogPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
