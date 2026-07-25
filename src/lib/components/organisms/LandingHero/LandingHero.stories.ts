import type { Meta, StoryObj } from '@storybook/svelte';
import LandingHeroStory from './LandingHeroStory.svelte';

const meta = {
	title: 'Organisms/LandingHero',
	component: LandingHeroStory,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['split', 'centered', 'bleed', 'minimal']
		},
		tone: {
			control: 'select',
			options: ['surface', 'muted', 'brand', 'inverse']
		},
		ctaMode: {
			control: 'select',
			options: ['buttons', 'email']
		},
		size: {
			control: 'select',
			options: ['md', 'lg', 'xl']
		},
		showProof: { control: 'boolean' },
		showStats: { control: 'boolean' },
		showLogos: { control: 'boolean' },
		showAnnouncement: { control: 'boolean' },
		showVideoCta: { control: 'boolean' }
	}
} satisfies Meta<typeof LandingHeroStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: 'split',
		tone: 'surface',
		ctaMode: 'buttons',
		size: 'lg',
		showProof: true,
		showStats: true,
		showLogos: true,
		showAnnouncement: true,
		showVideoCta: true
	}
};

export const Centered: Story = {
	args: {
		variant: 'centered',
		tone: 'muted',
		showStats: false,
		showVideoCta: false
	}
};

export const Bleed: Story = {
	args: {
		variant: 'bleed',
		tone: 'inverse',
		showStats: true,
		showLogos: true,
		showVideoCta: false
	}
};

export const Waitlist: Story = {
	args: {
		variant: 'centered',
		tone: 'surface',
		ctaMode: 'email',
		showStats: false,
		showLogos: true,
		showVideoCta: false
	}
};

export const Minimal: Story = {
	args: {
		variant: 'minimal',
		tone: 'surface',
		size: 'md',
		showProof: false,
		showStats: false,
		showLogos: false,
		showAnnouncement: false,
		showVideoCta: false
	}
};
