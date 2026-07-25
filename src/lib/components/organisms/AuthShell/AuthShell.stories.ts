import type { Meta, StoryObj } from '@storybook/svelte';
import AuthShellStory from './AuthShellStory.svelte';

const meta = {
	title: 'Organisms/AuthShell',
	component: AuthShellStory,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		asideSide: {
			control: 'inline-radio',
			options: ['left', 'right', 'none']
		},
		formVariant: {
			control: 'inline-radio',
			options: ['card', 'plain']
		},
		formAlign: {
			control: 'inline-radio',
			options: ['center', 'start']
		},
		preview: {
			control: 'inline-radio',
			options: ['desktop', 'mobile', 'compact']
		},
		fullHeight: { control: 'boolean' },
		mobileHero: { control: 'boolean' }
	},
	args: {
		brand: 'R2DigiSolutions',
		tagline: 'Build faster with a cohesive design system.',
		headline: 'Sign in to continue',
		fullHeight: true,
		asideSide: 'left',
		mobileHero: true,
		formVariant: 'card',
		formAlign: 'center',
		preview: 'desktop'
	}
} satisfies Meta<typeof AuthShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Classic split layout with elevated login card */
export const WithLogin: Story = {};

/** Login form without card chrome — cleaner for product shells */
export const PlainLogin: Story = {
	name: 'Plain login (no card)',
	args: {
		formVariant: 'plain',
		formAlign: 'start'
	}
};

/** Marketing panel on the right, form on the left */
export const AsideRight: Story = {
	name: 'Aside right',
	args: {
		asideSide: 'right',
		formVariant: 'plain',
		formAlign: 'start',
		headline: 'Welcome back'
	}
};

/** Form-only centered auth (no marketing column) */
export const CenteredOnly: Story = {
	name: 'Centered only',
	args: {
		asideSide: 'none',
		formVariant: 'card',
		mobileHero: false
	}
};

/** Full mobile auth experience inside a phone frame */
export const MobileComplete: Story = {
	name: 'Mobile complete',
	args: {
		preview: 'mobile',
		fullHeight: false,
		formVariant: 'plain',
		formAlign: 'start',
		mobileHero: true,
		asideSide: 'left'
	},
	parameters: {
		layout: 'fullscreen'
	}
};

/** Framed embed that still stretches to the bottom of the canvas */
export const Compact: Story = {
	args: {
		preview: 'compact',
		fullHeight: false,
		mobileHero: false,
		formVariant: 'plain',
		formAlign: 'start'
	},
	parameters: {
		layout: 'fullscreen'
	}
};
