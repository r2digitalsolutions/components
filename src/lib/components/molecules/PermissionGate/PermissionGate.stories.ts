import type { Meta, StoryObj } from '@storybook/svelte';
import PermissionGateStory from './PermissionGateStory.svelte';

const meta = {
	title: 'Molecules/PermissionGate',
	component: PermissionGateStory,
	tags: ['autodocs']
} satisfies Meta<typeof PermissionGateStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
