import type { Meta, StoryObj } from '@storybook/svelte';
import NewsletterSignupStory from './NewsletterSignupStory.svelte';

const meta = {
	title: 'Molecules/NewsletterSignup',
	component: NewsletterSignupStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['card', 'inline', 'stacked', 'banner', 'minimal', 'consent', 'error', 'success']
		},
		variant: {
			control: 'select',
			options: ['card', 'inline', 'stacked', 'minimal', 'banner']
		},
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		title: { control: 'text' },
		description: { control: 'text' },
		buttonLabel: { control: 'text' },
		socialProof: { control: 'text' },
		privacyNote: { control: 'text' },
		showName: { control: 'boolean' },
		requireConsent: { control: 'boolean' },
		loading: { control: 'boolean' }
	},
	args: {
		example: 'card',
		variant: 'card',
		size: 'md',
		title: 'Stay in the loop',
		description: 'Product updates, no spam.',
		buttonLabel: 'Subscribe',
		socialProof: '',
		privacyNote: 'Unsubscribe anytime. No spam.',
		showName: false,
		requireConsent: false,
		loading: false
	}
} satisfies Meta<typeof NewsletterSignupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
	args: { example: 'inline', variant: 'inline' }
};

export const Stacked: Story = {
	name: 'Stacked with name',
	args: { example: 'stacked', showName: true }
};

export const Banner: Story = {
	args: { example: 'banner', variant: 'banner', size: 'lg' }
};

export const Minimal: Story = {
	args: { example: 'minimal', variant: 'minimal', size: 'sm' }
};

export const WithConsent: Story = {
	name: 'With consent',
	args: { example: 'consent', requireConsent: true }
};

export const ErrorState: Story = {
	name: 'Error',
	args: { example: 'error' }
};

export const Success: Story = {
	args: { example: 'success' }
};

export const SocialProof: Story = {
	name: 'Social proof',
	args: {
		example: 'card',
		socialProof: 'Join 12,400 readers',
		title: 'Engineering digest',
		description: 'Deep dives every other week.'
	}
};
