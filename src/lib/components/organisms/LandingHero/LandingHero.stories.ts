import type { Meta, StoryObj } from '@storybook/svelte';
import LandingHeroStory from './LandingHeroStory.svelte';

const meta = {
	title: 'Organisms/LandingHero',
	component: LandingHeroStory,
	tags: ['autodocs']
} satisfies Meta<typeof LandingHeroStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
