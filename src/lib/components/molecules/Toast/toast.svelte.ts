/**
 * Toast notification store — Svelte 5 runes
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastAppearance = 'default' | 'card';
export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

export interface ToastAction {
	id: string;
	label: string;
	variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
	/** If true, dismisses the toast after click (default true) */
	dismissOnClick?: boolean;
	onClick?: () => void;
}

export interface Toast {
	id: string;
	message: string;
	variant: ToastVariant;
	appearance: ToastAppearance;
	duration: number;
	dismissible: boolean;
	pinned: boolean;
	title?: string;
	actions?: ToastAction[];
}

export type ToastInput = Partial<Omit<Toast, 'id' | 'message'>> & { message: string };

class ToastStore {
	toasts = $state<Toast[]>([]);

	private timers = new Map<string, ReturnType<typeof setTimeout>>();

	private add(partial: Omit<Toast, 'id'>): string {
		const id = Math.random().toString(36).slice(2, 9);
		const pinned = partial.pinned || partial.duration === 0;
		const toast: Toast = {
			...partial,
			id,
			pinned,
			duration: pinned ? 0 : partial.duration
		};

		this.toasts = [...this.toasts, toast];

		if (toast.duration > 0) {
			const timer = setTimeout(() => this.dismiss(id), toast.duration);
			this.timers.set(id, timer);
		}

		return id;
	}

	dismiss(id: string) {
		const timer = this.timers.get(id);
		if (timer) {
			clearTimeout(timer);
			this.timers.delete(id);
		}
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}

	clear() {
		for (const timer of this.timers.values()) clearTimeout(timer);
		this.timers.clear();
		this.toasts = [];
	}

	show(message: string, options: Partial<Omit<Toast, 'id' | 'message'>> = {}): string {
		return this.add({
			message,
			variant: 'default',
			appearance: 'default',
			duration: 4000,
			dismissible: true,
			pinned: false,
			...options
		});
	}

	success(message: string, title?: string, options: Partial<Omit<Toast, 'id' | 'message' | 'variant'>> = {}) {
		return this.add({
			message,
			title,
			variant: 'success',
			appearance: 'default',
			duration: 4000,
			dismissible: true,
			pinned: false,
			...options
		});
	}

	error(message: string, title?: string, options: Partial<Omit<Toast, 'id' | 'message' | 'variant'>> = {}) {
		return this.add({
			message,
			title,
			variant: 'error',
			appearance: 'default',
			duration: 6000,
			dismissible: true,
			pinned: false,
			...options
		});
	}

	warning(message: string, title?: string, options: Partial<Omit<Toast, 'id' | 'message' | 'variant'>> = {}) {
		return this.add({
			message,
			title,
			variant: 'warning',
			appearance: 'default',
			duration: 5000,
			dismissible: true,
			pinned: false,
			...options
		});
	}

	info(message: string, title?: string, options: Partial<Omit<Toast, 'id' | 'message' | 'variant'>> = {}) {
		return this.add({
			message,
			title,
			variant: 'info',
			appearance: 'default',
			duration: 4000,
			dismissible: true,
			pinned: false,
			...options
		});
	}

	card(message: string, options: Partial<Omit<Toast, 'id' | 'message' | 'appearance'>> = {}) {
		return this.add({
			message,
			variant: 'default',
			appearance: 'card',
			duration: 6000,
			dismissible: true,
			pinned: false,
			...options
		});
	}

	pinned(message: string, options: Partial<Omit<Toast, 'id' | 'message' | 'pinned' | 'duration'>> = {}) {
		return this.add({
			message,
			variant: 'info',
			appearance: 'default',
			duration: 0,
			dismissible: true,
			pinned: true,
			...options
		});
	}
}

export const toastStore = new ToastStore();

/** Convenience shorthand */
export const toast = {
	show: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) => toastStore.show(msg, opts),
	success: (
		msg: string,
		title?: string,
		opts?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>
	) => toastStore.success(msg, title, opts),
	error: (msg: string, title?: string, opts?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>) =>
		toastStore.error(msg, title, opts),
	warning: (
		msg: string,
		title?: string,
		opts?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>
	) => toastStore.warning(msg, title, opts),
	info: (msg: string, title?: string, opts?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>) =>
		toastStore.info(msg, title, opts),
	card: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message' | 'appearance'>>) =>
		toastStore.card(msg, opts),
	pinned: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message' | 'pinned' | 'duration'>>) =>
		toastStore.pinned(msg, opts),
	dismiss: (id: string) => toastStore.dismiss(id),
	clear: () => toastStore.clear()
};
