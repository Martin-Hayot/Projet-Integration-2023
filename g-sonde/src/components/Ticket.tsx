import React, { useEffect, useState } from "react";
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonIcon,
	IonAlert,
} from "@ionic/react";
import { trashOutline, sendOutline, archiveOutline } from "ionicons/icons";
import axios from "axios";
import { CategoryProps, TicketProps } from "../types";

const Ticket: React.FC<TicketProps> = (params) => {
	const [category, setCategory] = useState<CategoryProps>();

	const deleteSelectedTicket = async () => {
		if (!params.readonly && params.onDelete) {
			try {
				const res = await axios.delete(
					`http://localhost:3001/api/ticket/${params._id}`,
					{
						withCredentials: true,
						validateStatus: function () {
							return true;
						},
					}
				);
				if (res.status == 200) {
					params.onDelete(params._id);
				}
				if (res.status == 401) {
					window.location.href = "/login";
				}
				if (res.status == 500) {
					window.location.href = "/";
				}
			} catch (err: any) {
				console.error(err);
			}
		}
	};

	const archiveSelectedTicket = async () => {
		if (!params.readonly && params.onArchive) {
			try {
				const res = await axios.post(
					`http://localhost:3001/api/ticket/archive/${params._id}`,
					{},
					{
						withCredentials: true,
						validateStatus: function () {
							return true;
						},
					}
				);
				if (res.status == 200) {
					params.onArchive(params._id);
				}
				if (res.status == 401) {
					window.location.href = "/login";
				}
				if (res.status == 500) {
					window.location.href = "/";
				}
			} catch (err: any) {
				console.error(err);
			}
		}
	};

	const handleOpenMail = async () => {
		const searchedUser = await fetchUser();
		const subject = encodeURIComponent(`Ticket ${params._id}`);
		const body = encodeURIComponent(
			`Your Ticket ID: ${params._id}

			Hello ${searchedUser.firstname + " " + searchedUser.lastname},
			Thank you for reaching out to us.

			Your Message: 
			${params.message}

			We have made some changes in the context of the ticket:

			[Explain the changes here]

			Don't hesitate to contact us again if you have any other questions.

			Best regards,
			G-Sonde Team`
		);
		window.location.href = `mailto:${searchedUser.email}?subject=${subject}&body=${body}`;
	};

	const fetchUser = async () => {
		try {
			const res = await axios.get(
				`http://localhost:3001/api/user/${params.userId}`,
				{
					withCredentials: true,
				}
			);
			if (res.status == 200) {
				return res.data.user;
			}
		} catch (err: any) {
			console.error(err);
		}
	};

	const fetchCategory = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3001/api/category/${params.categoryId}`,
				{
					withCredentials: true,
					validateStatus: function () {
						return true;
					},
				}
			);

			setCategory(response.data.category);
		} catch (error) {
			console.error("Error fetching tickets:", error);
		}
	};

	useEffect(() => {
		if (params.categoryId !== undefined) {
			fetchCategory();
		}
	}, []);

	return (
		<IonCard>
			<IonCardHeader>
				<IonCardTitle>Ticket ID : {params._id}</IonCardTitle>
			</IonCardHeader>
			<IonCardContent>Message : {params.message}</IonCardContent>

			{params.userId && (
				<IonCardContent>User ID : {params.userId}</IonCardContent>
			)}
			{category && <IonCardContent>Category : {category.label}</IonCardContent>}
			{!params.readonly ? (
				<div className="flex place-content-center">
					<IonButton id={`ticket-button-delete-${params._id}`} fill="clear">
						<IonIcon icon={trashOutline}></IonIcon>
					</IonButton>
					<IonButton
						id={`ticket-button-open-${params._id}`}
						fill="clear"
						onClick={handleOpenMail}>
						<IonIcon icon={sendOutline}></IonIcon>
					</IonButton>
					<IonAlert
						trigger={`ticket-button-delete-${params._id}`}
						header="Deletion confirmation"
						message="Are you sure you want to delete this ticket ?"
						buttons={[
							{ text: "Cancel", role: "cancel" },
							{
								text: "Ok",
								role: "confirm",
								cssClass: "alert-button-confirm",
								handler: () => {
									deleteSelectedTicket();
								},
							},
						]}
					/>
					{!params.archived && (
						<>
							<IonButton
								id={`ticket-button-archive-${params._id}`}
								fill="clear">
								<IonIcon icon={archiveOutline}></IonIcon>
							</IonButton>
							<IonAlert
								trigger={`ticket-button-archive-${params._id}`}
								header="Archive confirmation"
								message="Are you sure you want to archive this ticket ?"
								buttons={[
									{ text: "Cancel", role: "cancel" },
									{
										text: "Ok",
										role: "confirm",
										cssClass: "alert-button-confirm",
										handler: () => {
											archiveSelectedTicket();
										},
									},
								]}
							/>
						</>
					)}
				</div>
			) : null}
		</IonCard>
	);
};
export default Ticket;
