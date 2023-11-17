import { IonPage, IonToast } from "@ionic/react";
import { Navbar, Ticket, UserContext } from "../components";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TicketProps } from "../types";

const UserTicketsManager: React.FC = () => {
	const [tickets, setTickets] = useState<TicketProps[]>([]);

	const [errorMessageToast, setErrorMessageToast] = useState<string>("");

	const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
	const [isAdminChecked, setIsAdminChecked] = useState<boolean>(false);

	const { logout } = useContext(UserContext);

	const fetchTickets = async () => {
		try {
			const res = await axios.get(`http://localhost:3001/api/ticket/user/`, {
				withCredentials: true,
				validateStatus: function () {
					return true;
				},
			});
			if (res.status === 401 || res.status === 400) {
				setIsAdminChecked(false);
				logout();
				window.location.href = "/login?error=unauthorized";
				return;
			}
			if (res.status === 200) {
				setTickets(res.data.tickets);
				setIsAdminChecked(true);
			}
		} catch (error) {
			setErrorMessageToast("Error fetching tickets");
			setShowErrorToast(true);
			console.error("Error fetching tickets:", error);
		}
	};

	useEffect(() => {
		fetchTickets();
	}, []);

	return (
		isAdminChecked && (
			<IonPage>
				<Navbar />

				<div className="m-1 mx-auto">
					<h1 className="text-4xl underline">"Your Tickets :"</h1>
				</div>
				<div className="m-auto p-1 w-full h-full flex flex-wrap overflow-y-auto">
					{tickets !== undefined && tickets.length > 0 ? (
						tickets.map((ticket: TicketProps, index) => (
							<div key={index} className="w-fit h-fit max-w-xs">
								<Ticket
									key={ticket._id}
									categoryId={ticket.categoryId}
									message={ticket.message}
									_id={ticket._id}
									readonly
								/>
							</div>
						))
					) : (
						<p>You have no opened tickets</p>
					)}
				</div>
				<IonToast
					id="toast-user-tickets-manager-error"
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

export default UserTicketsManager;
