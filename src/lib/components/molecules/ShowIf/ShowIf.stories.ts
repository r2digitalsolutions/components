import type { Meta, StoryObj } from '@storybook/svelte';
import PermissionsProviderStory from '../PermissionsProvider/PermissionsProviderStory.svelte';

const meta = {
	title: 'Molecules/ShowIf',
	component: PermissionsProviderStory,
	tags: ['autodocs']
} satisfies Meta<typeof PermissionsProviderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
