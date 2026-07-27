import type { Meta, StoryObj } from '@storybook/svelte';
import AuditEventRowStory from './AuditEventRowStory.svelte';

const meta = {
	title: 'Molecules/AuditEventRow',
	component: AuditEventRowStory,
	tags: ['autodocs']
} satisfies Meta<typeof AuditEventRowStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
