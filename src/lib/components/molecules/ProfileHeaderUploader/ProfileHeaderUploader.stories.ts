import type { Meta, StoryObj } from '@storybook/svelte';
import ProfileHeaderUploaderStory from './ProfileHeaderUploaderStory.svelte';

const meta = {
	title: 'Molecules/ProfileHeaderUploader',
	component: ProfileHeaderUploaderStory,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		coverHelperText: { control: 'text' },
		avatarHelperText: { control: 'text' },
		accept: { control: 'text' },
		maxCoverMb: { control: 'number' },
		maxAvatarMb: { control: 'number' },
		disabled: { control: 'boolean' }
	},
	args: {
		label: 'Profile media',
		coverHelperText: 'Cover · PNG or JPG · max 10MB',
		avatarHelperText: 'Avatar · square image recommended',
		accept: 'image/*',
		maxCoverMb: 10,
		maxAvatarMb: 5,
		disabled: false
	}
} satisfies Meta<typeof ProfileHeaderUploaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
