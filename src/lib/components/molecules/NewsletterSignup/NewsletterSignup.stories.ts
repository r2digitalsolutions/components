import type { Meta, StoryObj } from '@storybook/svelte';
import NewsletterSignupStory from './NewsletterSignupStory.svelte';

const meta = {
	title: 'Molecules/NewsletterSignup',
	component: NewsletterSignupStory,
	tags: ['autodocs']
} satisfies Meta<typeof NewsletterSignupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
