import type { Meta, StoryObj } from '@storybook/svelte';
import OnboardingPageStory from './OnboardingPageStory.svelte';

const meta = {
	title: 'Organisms/OnboardingPage',
	component: OnboardingPageStory,
	tags: ['autodocs']
} satisfies Meta<typeof OnboardingPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
