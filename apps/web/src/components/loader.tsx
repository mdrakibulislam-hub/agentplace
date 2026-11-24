import { LoadingStatus } from "@agentplace/ui/components/ap-data";

export default function Loader() {
	return (
		<div className="ap-route-loading" data-ap-enter="message">
			<LoadingStatus>Loading page…</LoadingStatus>
		</div>
	);
}
