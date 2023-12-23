import { IonPage, IonToast, IonButton } from "@ionic/react";
import { Navbar, Ticket, UserContext } from "../components";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TicketProps } from "../types";

const TicketsViewer: React.FC = () => {
	const [tickets, setTickets] = useState<TicketProps[]>([]);

	const [deletedMessageToast, setDeletedMessageToast] = useState<string>("");
	const [archivedMessageToast, setArchivedMessageToast] = useState<string>("");
	const [errorMessageToast, setErrorMessageToast] = useState<string>("");

	const [showDeletionToast, setShowDeletionToast] = useState<boolean>(false);
	const [showArchiveToast, setShowArchiveToast] = useState<boolean>(false);
	const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
	const [isArchived, setIsArchived] = useState<boolean>(false);
	const [isAdminChecked, setIsAdminChecked] = useState<boolean>(false);
	const { logout } = useContext(UserContext);
	const apiUrl = import.meta.env.VITE_URL_API;

	const fetchTickets = async () => {
		try {
			const response = await axios.get(
				`${apiUrl}ticket/${isArchived ? "archived" : ""}`,
				{
					withCredentials: true,
					validateStatus: function () {
						return true;
					},
				}
			);
			if (response.status === 401 || response.status === 400) {
				setIsAdminChecked(false);
				logout();
				window.location.href = "/login?error=unauthorized";
				return;
			}
			setTickets(response.data.tickets);
			setIsAdminChecked(true);
		} catch (error) {
			setErrorMessageToast("Error fetching tickets");
			setShowErrorToast(true);
			console.error("Error fetching tickets:", error);
		}
	};

	const handleTicketDeletion = async (ticketId: string) => {
		setShowDeletionToast(true);
		setDeletedMessageToast(ticketId);
		await fetchTickets();
	};

	const handleTicketArchive = async (ticketId: string) => {
		setShowArchiveToast(true);
		setArchivedMessageToast(ticketId);
		await fetchTickets();
	};

	useEffect(() => {
		fetchTickets();
	}, [isArchived]);

	return (
		isAdminChecked && (
			<IonPage id="main-content">
				<Navbar />
				<div className="m-0 mx-auto">
					<IonButton
						color={"danger"}
						onClick={() => {
							setIsArchived(false);
						}}>
						Opened Tickets
					</IonButton>
					<IonButton
						color={"medium"}
						onClick={() => {
							setIsArchived(true);
						}}>
						Archived Tickets
					</IonButton>
					<IonButton
						color="success"
						onClick={() => {
							window.location.href = "/admin/category/manager";
						}}>
						Category Manager
					</IonButton>
				</div>
				<div className="m-1 mx-auto">
					<h1 className="text-4xl underline">
						{isArchived ? "Archived Tickets :" : "Opened Tickets"}
					</h1>
				</div>
				<div className="m-auto p-1 w-full h-full flex flex-wrap overflow-y-auto">
					{tickets !== undefined && tickets.length > 0 ? (
						tickets.map((ticket: TicketProps, index) => (
							<div key={index} className="w-fit h-fit max-w-xs">
								<Ticket
									key={ticket._id}
									categoryId={ticket.categoryId}
									archived={ticket.archived}
									userId={ticket.userId}
									message={ticket.message}
									_id={ticket._id}
									onDelete={(ticketId) => {
										handleTicketDeletion(ticketId);
									}}
									onArchive={(ticketId) => {
										handleTicketArchive(ticketId);
									}}
								/>
							</div>
						))
					) : (
						<p>There is no tickets in this category</p>
					)}
				</div>
				<IonToast
					isOpen={showDeletionToast}
					onDidDismiss={() => {
						setShowDeletionToast(false);
					}}
					message={`Ticket deleted successfuly ! ${deletedMessageToast}`}
					duration={3000}
					color="success"
					buttons={[
						{
							text: "Dismiss",
							role: "cancel",
						},
					]}
				/>
				<IonToast
					isOpen={showArchiveToast}
					onDidDismiss={() => {
						setShowArchiveToast(false);
					}}
					message={`Ticket archived successfuly ! ${archivedMessageToast}`}
					duration={3000}
					color="success"
					buttons={[
						{
							text: "Dismiss",
							role: "cancel",
						},
					]}
				/>
				<IonToast
					id="toast-tickets-viewer-error"
					isOpen={showErrorToast}
					onDidDismiss={() => setShowErrorToast(false)}
					message={errorMessageToast}
					duration={3000}
					color="danger"
					buttons={[
						{
							text: "Dismiss",
							role: "cancel",
						},
					]}
				/>
			</IonPage>
		)
	);
};

export default TicketsViewer;
