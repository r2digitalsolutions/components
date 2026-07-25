import type { Meta, StoryObj } from '@storybook/svelte';
import HelpCenterStory from './HelpCenterStory.svelte';

const meta = {
	title: 'Organisms/HelpCenter',
	component: HelpCenterStory,
	tags: ['autodocs']
} satisfies Meta<typeof HelpCenterStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
