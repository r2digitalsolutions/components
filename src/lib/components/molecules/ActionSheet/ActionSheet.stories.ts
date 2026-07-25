import type { Meta, StoryObj } from '@storybook/svelte';
import ActionSheetStory from './ActionSheetStory.svelte';

const meta = {
	title: 'Molecules/ActionSheet',
	component: ActionSheetStory,
	tags: ['autodocs']
} satisfies Meta<typeof ActionSheetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
