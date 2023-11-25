import {
	IonContent,
	IonPage,
	IonInput,
	IonTextarea,
	IonButton,
	IonToast,
	IonSelect,
	IonSelectOption,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Navbar, UserContext, Popup } from "../components";
import axios from "axios";
import { CategoryProps } from "../types";

const ContactUs: React.FC = () => {
	const [insertedMessage, setInsertedMessage] = useState<string>("");
	const [ticketId, setTicketId] = useState<string>("");
	const [toastMessage, setToastMessage] = useState<string>("");

	const [categoryChosen, setCategoryChosen] = useState<CategoryProps>();
	const [categories, setCategories] = useState<CategoryProps[]>([]);

	const [showToast, setShowToast] = useState<boolean>(false);
	const [disabledButton, setDisabledButton] = useState<boolean>(false);
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

	const { emailUser } = React.useContext(UserContext);

	const openPopup = () => {
		setIsPopupOpen(true);
	};
	const closePopup = () => {
		setIsPopupOpen(false);
		window.location.href = "/";
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get(`http://localhost:3001/api/category/`, {
				withCredentials: true,
				validateStatus: function () {
					return true;
				},
			});
			setCategories(response.data.categories);
		} catch (error) {
			setToastMessage("Error fetching categories");
			setShowToast(true);
			console.error("Error fetching categories:", error);
		}
	};

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!insertedMessage) {
			if (!insertedMessage) {
				setToastMessage(`Please fill out all fields. Message is empty.`);
				setShowToast(true);
				return;
			}
		}
		const res = await axios.post(
			"http://localhost:3001/api/ticket",
			{
				message: insertedMessage,
				...(categoryChosen ? { categoryId: categoryChosen._id } : null),
			},
			{
				withCredentials: true,
				validateStatus: function () {
					return true;
				},
			}
		);
		if (res.status == 201) {
			setTicketId(res.data.ticket._id);
			setDisabledButton(true);
			openPopup();
		} else {
			setShowToast(true);
			setToastMessage(res.data.message);
		}
	}

	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<IonPage>
			<Navbar />
			<IonContent class="ion-padding ion-text-center">
				<form
					id="form-contact"
					onSubmit={handleSubmit}
					className="mx-auto my-4 w-1/2">
					<IonTextarea
						id="input-contact-message"
						value={insertedMessage}
						fill="outline"
						label="Message"
						labelPlacement="stacked"
						onIonInput={(e: any) => {
							setInsertedMessage(e.detail.value);
						}}
						autoGrow={true}
						className="mb-4"
						required></IonTextarea>
					<IonSelect
						id="input-contact-category"
						fill="outline"
						label="Category of your message (optional)"
						labelPlacement="stacked"
						onIonChange={(event) => {
							setCategoryChosen(event.detail.value);
						}}>
						{categories.map((category: CategoryProps) => (
							<IonSelectOption
								key={category._id}
								value={category}
								className="break-all">
								{category.label}
							</IonSelectOption>
						))}
					</IonSelect>
					<IonButton
						type="submit"
						id="input-contact-submit-button"
						disabled={disabledButton}>
						Submit
					</IonButton>
				</form>
			</IonContent>
			<IonToast
				id="toast-contact-error"
				isOpen={showToast}
				onDidDismiss={() => setShowToast(false)}
				message={toastMessage}
				duration={3000}
				color="danger"
				buttons={[
					{
						text: "Dismiss",
						role: "cancel",
					},
				]}
			/>
			<Popup isOpen={isPopupOpen} onClose={closePopup}>
				<h1
					id="contact-popup-title"
					className="m-0 mx-auto text-3xl underline font-bold">
					Thank you for your message !
				</h1>
				<h2 id="contact-popup-subtitle" className="m-8 mx-auto">
					We will get back to you as soon as possible.
				</h2>
				<hr className="h-1 bg-white" />
				<p
					id="contact-popup-summary-text"
					className="m-0 mx-auto text-2xl underline">
					Summary :
				</p>
				<div id="contact-popup-summaryform" className="m-8">
					<IonInput
						value={emailUser}
						fill="outline"
						labelPlacement="stacked"
						label="Email"
						className="mb-4"
						disabled
					/>
					<IonTextarea
						value={insertedMessage}
						fill="outline"
						autoGrow={true}
						className="mb-4"
						label="Message"
						labelPlacement="stacked"
						disabled></IonTextarea>
					{categoryChosen && (
						<IonSelect
							className="mb-4"
							value={categoryChosen}
							fill="outline"
							label="Category of your message (optional)"
							labelPlacement="stacked"
							interface="popover"
							disabled>
							<IonSelectOption value={categoryChosen}>
								{categoryChosen.label}
							</IonSelectOption>
						</IonSelect>
					)}
					<IonInput
						value={ticketId}
						fill="outline"
						labelPlacement="stacked"
						label="Ticket ID"
						className="mb-4"
						readonly
					/>
				</div>
			</Popup>
		</IonPage>
	);
};

export default ContactUs;
