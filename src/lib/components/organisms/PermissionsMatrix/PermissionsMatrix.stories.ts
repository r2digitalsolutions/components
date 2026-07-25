import type { Meta, StoryObj } from '@storybook/svelte';
import PermissionsMatrixStory from './PermissionsMatrixStory.svelte';

const meta = {
	title: 'Organisms/PermissionsMatrix',
	component: PermissionsMatrixStory,
	tags: ['autodocs']
} satisfies Meta<typeof PermissionsMatrixStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
