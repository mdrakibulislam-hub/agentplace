import { useCallback, useLayoutEffect, useRef, useState } from "react";

const latestProximity = 64;

export function useConversationScroll(updateKey: string | undefined) {
	const listRef = useRef<HTMLDivElement>(null);
	const following = useRef(true);
	const [showJump, setShowJump] = useState(false);
	const [canScroll, setCanScroll] = useState(false);
	const active = updateKey !== undefined;

	const syncLayout = useCallback(() => {
		const list = listRef.current;
		if (!list?.clientHeight) return;
		const overflow = list.scrollHeight - list.clientHeight;
		setCanScroll(overflow > 1);
		if (following.current) list.scrollTop = list.scrollHeight;
		if (overflow < 2) {
			following.current = true;
			setShowJump(false);
		}
	}, []);

	useLayoutEffect(() => {
		const list = listRef.current;
		if (!active || !list) return;
		const resize = new ResizeObserver(syncLayout);
		resize.observe(list);
		return () => resize.disconnect();
	}, [active, syncLayout]);

	useLayoutEffect(() => {
		if (updateKey !== undefined) syncLayout();
	}, [updateKey, syncLayout]);

	function onScroll() {
		const list = listRef.current;
		if (!list?.clientHeight) return;
		const remaining = list.scrollHeight - list.scrollTop - list.clientHeight;
		following.current = remaining <= latestProximity;
		setShowJump(!following.current);
	}

	function followLatest() {
		following.current = true;
		setShowJump(false);
	}

	function jumpToLatest() {
		const list = listRef.current;
		if (!list) return;
		followLatest();
		list.scrollTop = list.scrollHeight;
		list.focus({ preventScroll: true });
	}

	return { listRef, canScroll, onScroll, showJump, followLatest, jumpToLatest };
}
