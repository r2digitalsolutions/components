import type { Meta, StoryObj } from '@storybook/svelte';
import CookieConsentStory from './CookieConsentStory.svelte';

const meta = {
	title: 'Organisms/CookieConsent',
	component: CookieConsentStory,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Show code mirrors the Controls of each story (Default, Card, …). The canvas always renders with `placement="static"` so the banner stays visible; copy `placement="fixed"` (from Controls) into your app.'
			},
			source: {
				transformArgs: true,
				componentName: 'CookieConsent',
				language: 'svelte'
			}
		}
	},
	argTypes: {
		variant: { control: 'select', options: ['bar', 'card'] },
		placement: { control: 'select', options: ['fixed', 'absolute', 'static'] },
		position: { control: 'select', options: ['bottom-left', 'bottom-right', 'bottom-center'] },
		title: { control: 'text' },
		description: { control: 'text' },
		acceptLabel: { control: 'text' },
		rejectLabel: { control: 'text' },
		customizeLabel: { control: 'text' },
		policyLabel: { control: 'text' },
		policyHref: { control: 'text' },
		showCustomize: { control: 'boolean' }
	},
	args: {
		variant: 'bar',
		placement: 'fixed',
		position: 'bottom-center',
		title: 'Cookies & privacy',
		description:
			'We use cookies to keep the product running and understand how it’s used. You can accept all, reject non-essential ones, or manage preferences.',
		acceptLabel: 'Accept all',
		rejectLabel: 'Reject non-essential',
		customizeLabel: 'Manage',
		policyLabel: 'Privacy policy',
		policyHref: '/privacy',
		showCustomize: true
	}
} satisfies Meta<typeof CookieConsentStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Card: Story = {
	args: {
		variant: 'card',
		placement: 'fixed',
		position: 'bottom-right'
	}
};
