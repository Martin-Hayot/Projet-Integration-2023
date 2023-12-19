import { IonPage, IonToast, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonIcon, IonLabel, IonContent } from "@ionic/react";
import { person } from 'ionicons/icons';
import { Navbar, Ticket, UserContext } from "../../components";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TicketProps } from "../../types";
import Menu from "../../components/Menu";

const UserTicketsManager: React.FC = () => {
	const [tickets, setTickets] = useState<TicketProps[]>([]);
	const [userInfo, setUserInfo] = useState<any | null>(null);
	const [errorMessageToast, setErrorMessageToast] = useState<string>("");

	const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
	const [isAdminChecked, setIsAdminChecked] = useState<boolean>(false);

	const { logout } = useContext(UserContext);
	const apiUrl = import.meta.env.VITE_URL_API;

	const fetchTickets = async () => {
		try {
			const res = await axios.get(`${apiUrl}ticket/user/`, {
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
		axios.get(apiUrl + 'user/profile',{
			withCredentials: true,
		})
			.then((response) => {
				if (response.status === 401 || response.status === 400) {
					window.location.href = "/login?error=unauthorized";
					return;
				}
				setUserInfo(response.data);
			})
	}, []);

	return (
		isAdminChecked && (
			<>
			<Menu/>
			<IonPage id="main-content">
			<IonHeader>
					<IonToolbar>
						<IonButtons slot='start'>
							<IonMenuButton></IonMenuButton>
						</IonButtons>
						<IonTitle></IonTitle>
						<div style= {{paddingTop: "25px", fontSize:"20px"}}>Menu</div>
							{userInfo && (
            					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}>
              						<IonIcon icon={person} />
              						<IonLabel>Bonjour {userInfo.firstname} {userInfo.lastname}</IonLabel>
            					</div>
          					)}
					</IonToolbar>
				</IonHeader>
				<IonContent className="ion-text-center ion-padding">
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
				</IonContent>
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
			</>
		)
	);
};

export default UserTicketsManager;
