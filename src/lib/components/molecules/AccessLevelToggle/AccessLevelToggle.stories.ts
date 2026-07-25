import type { Meta, StoryObj } from '@storybook/svelte';
import AccessLevelToggleStory from './AccessLevelToggleStory.svelte';

const meta = {
	title: 'Molecules/AccessLevelToggle',
	component: AccessLevelToggleStory,
	tags: ['autodocs']
} satisfies Meta<typeof AccessLevelToggleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
