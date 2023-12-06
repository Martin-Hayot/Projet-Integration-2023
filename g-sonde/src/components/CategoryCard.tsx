import React, { useContext } from "react";
import {
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonIcon,
	IonAlert,
	IonCardSubtitle,
} from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import axios from "axios";
import { CategoryProps } from "../types";
import { UserContext } from "../components";

const CategoryCard: React.FC<CategoryProps> = (params) => {
	const { logout } = useContext(UserContext);
	const apiUrl = import.meta.env.VITE_URL_API;

	const deleteSelectedCategory = async () => {
		try {
			const res = await axios.delete(`${apiUrl}category/${params._id}`, {
				withCredentials: true,
			});
			if (res.status == 200) {
				params.onDelete(params._id);
			}
			if (res.status == 401 || res.status == 500) {
				logout();
				window.location.href = "/login?error=unauthorized";
			}
		} catch (err: any) {
			console.error(err);
		}
	};

	return (
		<IonCard>
			<IonCardHeader>
				<IonCardTitle>{params.label}</IonCardTitle>
				<IonCardSubtitle>{params._id}</IonCardSubtitle>
			</IonCardHeader>

			<div className="flex place-content-center">
				<IonButton id={`category-button-delete-${params._id}`} fill="clear">
					<IonIcon icon={trashOutline}></IonIcon>
				</IonButton>

				<IonAlert
					trigger={`category-button-delete-${params._id}`}
					header="Deletion confirmation"
					message="Are you sure you want to delete this category ?"
					buttons={[
						{ text: "Cancel", role: "cancel" },
						{
							text: "Ok",
							role: "confirm",
							cssClass: "alert-button-confirm",
							handler: () => {
								deleteSelectedCategory();
							},
						},
					]}
				/>
			</div>
		</IonCard>
	);
};
export default CategoryCard;
