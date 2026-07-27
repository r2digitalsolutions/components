import type { Meta, StoryObj } from '@storybook/svelte';
import MobileAccountPageStory from './MobileAccountPageStory.svelte';

const meta = {
	title: 'Organisms/MobileAccountPage',
	component: MobileAccountPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof MobileAccountPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
