import type { Meta, StoryObj } from '@storybook/svelte';
import TrackHeaderStory from './TrackHeaderStory.svelte';

const meta = {
	title: 'Molecules/TrackHeader',
	component: TrackHeaderStory,
	tags: ['autodocs']
} satisfies Meta<typeof TrackHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
