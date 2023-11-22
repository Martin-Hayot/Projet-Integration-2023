import React from "react";
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

const CategoryCard: React.FC<CategoryProps> = (params) => {
	const deleteSelectedCategory = async () => {
		try {
			const res = await axios.delete(
				`http://localhost:3001/api/category/${params._id}`,
				{
					withCredentials: true,
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
