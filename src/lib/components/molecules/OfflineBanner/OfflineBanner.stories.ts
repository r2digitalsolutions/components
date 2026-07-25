import type { Meta, StoryObj } from '@storybook/svelte';
import OfflineBannerStory from './OfflineBannerStory.svelte';

const meta = {
	title: 'Molecules/OfflineBanner',
	component: OfflineBannerStory,
	tags: ['autodocs'],
	argTypes: {
		forced: {
			control: 'select',
			options: [false, true, null],
			labels: { false: 'Offline', true: 'Online', null: 'Auto (navigator)' }
		}
	},
	args: { forced: false }
} satisfies Meta<typeof OfflineBannerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Online: Story = { args: { forced: true } };
