import type { Meta, StoryObj } from '@storybook/svelte';
import PresenceListStory from './PresenceListStory.svelte';

const meta = {
	title: 'Molecules/PresenceList',
	component: PresenceListStory,
	tags: ['autodocs']
} satisfies Meta<typeof PresenceListStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
