import {
	type CSSProperties,
	type KeyboardEvent,
	type PointerEvent,
	type ReactNode,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

const minEditorWidth = 328;
const minPreviewWidth = 400;
const keyboardStep = 24;

export const defaultPreviewShare = 680 / (536 + 680);

export function BuilderSplit({
	children,
	preview,
	view,
	previewFocus,
	previewShare,
	onPreviewShareChange,
}: {
	children: ReactNode;
	preview: ReactNode;
	view: string;
	previewFocus: number;
	previewShare: number;
	onPreviewShareChange: (share: number) => void;
}) {
	const split = useRef<HTMLDivElement>(null);
	const previewPane = useRef<HTMLElement>(null);
	const lastPreviewFocus = useRef(previewFocus);
	const drag = useRef<{ pointer: number; x: number; width: number } | null>(
		null,
	);
	const previewId = useId();
	const [availableWidth, setAvailableWidth] = useState(0);
	const [resizing, setResizing] = useState(false);
	const maxPreviewWidth = Math.max(
		minPreviewWidth,
		availableWidth - minEditorWidth,
	);
	const constrain = (width: number) =>
		Math.min(Math.max(width, minPreviewWidth), maxPreviewWidth);
	const previewWidth = constrain(availableWidth * previewShare);

	useLayoutEffect(() => {
		const layout = split.current;
		if (!layout) return;
		setAvailableWidth(layout.clientWidth);
		const observer = new ResizeObserver(([entry]) => {
			setAvailableWidth(entry.contentRect.width);
		});
		observer.observe(layout);
		return () => observer.disconnect();
	}, []);
	useLayoutEffect(() => {
		if (lastPreviewFocus.current === previewFocus) return;
		lastPreviewFocus.current = previewFocus;
		previewPane.current?.focus({ preventScroll: true });
	}, [previewFocus]);

	function resize(width: number) {
		if (availableWidth >= minEditorWidth + minPreviewWidth) {
			onPreviewShareChange(constrain(width) / availableWidth);
		}
	}

	function startDrag(event: PointerEvent<HTMLHRElement>) {
		if (!event.isPrimary || event.button !== 0) return;
		event.preventDefault();
		event.currentTarget.focus({ preventScroll: true });
		event.currentTarget.setPointerCapture(event.pointerId);
		drag.current = {
			pointer: event.pointerId,
			x: event.clientX,
			width: previewWidth,
		};
		setResizing(true);
	}

	function moveDrag(event: PointerEvent<HTMLHRElement>) {
		const start = drag.current;
		if (start?.pointer === event.pointerId) {
			resize(start.width + start.x - event.clientX);
		}
	}

	function stopDrag(event: PointerEvent<HTMLHRElement>) {
		if (drag.current?.pointer !== event.pointerId) return;
		drag.current = null;
		setResizing(false);
	}

	function resizeWithKeyboard(event: KeyboardEvent<HTMLHRElement>) {
		let width: number;
		switch (event.key) {
			case "ArrowLeft":
				width = previewWidth + keyboardStep;
				break;
			case "ArrowRight":
				width = previewWidth - keyboardStep;
				break;
			case "Home":
				width = minPreviewWidth;
				break;
			case "End":
				width = maxPreviewWidth;
				break;
			case "Enter":
				width = availableWidth * defaultPreviewShare;
				break;
			default:
				return;
		}
		event.preventDefault();
		resize(width);
	}

	return (
		<div
			ref={split}
			className="ap-builder-split"
			data-view={view}
			data-resizing={resizing ? "" : undefined}
			style={
				{
					"--ap-builder-preview-share": `${previewShare * 100}%`,
					"--ap-builder-editor-min": `${minEditorWidth}px`,
					"--ap-builder-preview-min": `${minPreviewWidth}px`,
				} as CSSProperties
			}
		>
			{children}
			<hr
				className="ap-builder-divider"
				tabIndex={0}
				aria-label="Preview width"
				aria-orientation="vertical"
				aria-controls={previewId}
				aria-valuemin={minPreviewWidth}
				aria-valuemax={Math.round(maxPreviewWidth)}
				aria-valuenow={Math.round(previewWidth)}
				aria-valuetext={`${Math.round(previewWidth)} pixels`}
				aria-description="Use the arrow keys to resize or press Enter to reset."
				onPointerDown={startDrag}
				onPointerMove={moveDrag}
				onLostPointerCapture={stopDrag}
				onDoubleClick={() => resize(availableWidth * defaultPreviewShare)}
				onKeyDown={resizeWithKeyboard}
			/>
			<section
				className="ap-builder-preview-pane"
				id={previewId}
				ref={previewPane}
				tabIndex={-1}
				aria-label="Agent preview pane"
			>
				{preview}
			</section>
		</div>
	);
}
