interface TicketProps {
	message: string;
	_id: string;
	userId?: string;
	archived?: boolean;
	onDelete?: (id: string) => void;
	onArchive?: (id: string) => void;
	categoryId: string;
	readonly?: boolean;
}

export default TicketProps;
