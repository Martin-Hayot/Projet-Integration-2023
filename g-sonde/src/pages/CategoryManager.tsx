import { IonPage, IonToast, IonButton, IonInput } from "@ionic/react";
import { Navbar, Popup, CategoryCard, UserContext } from "../components";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CategoryProps } from "../types";

const CategoryManager: React.FC = () => {
	const [categories, setCategories] = useState<CategoryProps[]>([]);

	const [toastErrorMessage, setToastErrorMessage] = useState<string>("");
	const [insertedLabelToAdd, setInsertedLabelToAdd] = useState<string>("");
	const [insertedLabelToFind, setInsertedLabelToFind] = useState<string>("");
	const [categoryId, setCategoryId] = useState<string>("");
	const [deletedMessageToast, setDeletedMessageToast] = useState<string>("");

	const [showToastError, setShowToastError] = useState<boolean>(false);
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
	const [showDeletionToast, setShowDeletionToast] = useState<boolean>(false);
	const [isAdminChecked, setIsAdminChecked] = useState<boolean>(false);

	const { logout } = useContext(UserContext);

	const openPopup = () => {
		setIsPopupOpen(true);
	};

	const closePopup = () => {
		setIsPopupOpen(false);
		fetchCategories();
	};

	const handleCategoryDelete = async (categoryId: string) => {
		setShowDeletionToast(true);
		setDeletedMessageToast(categoryId);
		await fetchCategories();
	};

	const handleSubmitFind = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!insertedLabelToFind || !insertedLabelToFind.trim()) {
			setInsertedLabelToFind("");
			setToastErrorMessage(`Please fill out all fields. Label is empty.`);
			setShowToastError(true);
			return;
		}
		if (!/^[a-zA-Z\s]+$/.test(insertedLabelToFind)) {
			setToastErrorMessage("Label must only contain letters or spaces.");
			setShowToastError(true);
			return;
		}
		const res = await axios.get(
			`http://localhost:3001/api/category/search/${insertedLabelToFind.trim()}`,
			{
				withCredentials: true,
				validateStatus: function () {
					return true;
				},
			}
		);
		if (res.status == 200) {
			setCategories(res.data.categories);
		} else {
			setToastErrorMessage(res.data.message);
		}
	};

	const handleSubmitAdd = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!insertedLabelToAdd || !insertedLabelToAdd.trim()) {
			setInsertedLabelToAdd("");
			setToastErrorMessage(`Please fill out all fields. Label is empty.`);
			setShowToastError(true);
			return;
		}
		if (!/^[a-zA-Z\s]+$/.test(insertedLabelToAdd)) {
			setToastErrorMessage("Label must only contain letters or spaces.");
			setShowToastError(true);
			return;
		}
		const res = await axios.post(
			"http://localhost:3001/api/category",
			{
				label: insertedLabelToAdd.trim(),
			},
			{
				withCredentials: true,
			}
		);
		if (res.status == 201) {
			setCategoryId(res.data.category._id);
			openPopup();
			fetchCategories();
		} else {
			setToastErrorMessage(res.data.message);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get(`http://localhost:3001/api/category/`, {
				withCredentials: true,
			});
			setCategories(response.data.categories);
		} catch (error) {
			setToastErrorMessage("Error fetching categories");
			setShowToastError(true);
			console.error("Error fetching categories:", error);
		}
	};

	const fetchUserAbility = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3001/api/user/ability`,
				{
					withCredentials: true,
					validateStatus: function () {
						return true;
					},
				}
			);

			if (
				response.status === 401 ||
				response.status === 400 ||
				response.data.ability !== 1
			) {
				setIsAdminChecked(false);
				logout();
				window.location.href = "/login?error=unauthorized";
				return;
			}
			setIsAdminChecked(true);
		} catch (error) {
			setToastErrorMessage("Error fetching ability");
			setShowToastError(true);
			console.error("Error fetching ability :", error);
		}
	};

	useEffect(() => {
		fetchUserAbility();

		fetchCategories();
	}, []);
	return (
		isAdminChecked && (
			<IonPage>
				<Navbar />
				<div className="m-1 mx-auto">
					<h1 className="underline text-4xl">Category Manager</h1>
				</div>
				<div className="flex w-full h-full">
					<div className="flex flex-wrap place-content-baseline min-w-min overflow-y-auto w-3/4 h-full">
						{categories !== undefined ? (
							categories.map((category: CategoryProps) => {
								return (
									<div className="w-fit h-fit max-w-xs" key={category._id}>
										<CategoryCard
											_id={category._id}
											label={category.label}
											onDelete={(id) => handleCategoryDelete(id)}
										/>
									</div>
								);
							})
						) : (
							<p>There is no category</p>
						)}
					</div>
					<div className="w-1/4 border p-4">
						<form onSubmit={handleSubmitFind} className="m-1 mt-5">
							<IonInput
								id="input-category-manager-label-find"
								value={insertedLabelToFind}
								fill="outline"
								labelPlacement="stacked"
								label="Label To Find"
								clearInput={true}
								onIonChange={(e: any) => setInsertedLabelToFind(e.detail.value)}
								className="mb-4"
								required
							/>
							<IonButton id="category-manager-submit-button-find" type="submit">
								Find a category
							</IonButton>
							<IonButton
								id="category-manager-reset-button-find"
								onClick={() => {
									setInsertedLabelToFind("");
									fetchCategories;
								}}>
								Reset Filter
							</IonButton>
						</form>
						<hr />
						<form onSubmit={handleSubmitAdd} className="m-1 mt-9">
							<IonInput
								id="input-category-manager-label-add"
								value={insertedLabelToAdd}
								fill="outline"
								labelPlacement="stacked"
								label="Label To Add"
								clearInput={true}
								onIonChange={(e: any) => setInsertedLabelToAdd(e.detail.value)}
								className="mb-4"
								required
							/>
							<IonButton id="category-manager-submit-button-find" type="submit">
								Add a category
							</IonButton>
						</form>
					</div>
				</div>

				<Popup isOpen={isPopupOpen} onClose={closePopup}>
					<p
						id="category-manager-popup-summary-text"
						className="underline m-0 mx-auto text-3xl">
						Summary :
					</p>
					<div id="category-manager-popup-summaryform" className="m-8 mx-4">
						<IonInput
							value={insertedLabelToAdd}
							fill="outline"
							labelPlacement="stacked"
							label="Label"
							className="mb-4"
							disabled
						/>
						<IonInput
							value={categoryId}
							fill="outline"
							labelPlacement="stacked"
							label="Category ID"
							className="mb-4"
							readonly
						/>
					</div>
				</Popup>
				<IonToast
					id="toast-category-manager-error"
					isOpen={showToastError}
					onDidDismiss={() => setShowToastError(false)}
					message={toastErrorMessage}
					duration={3000}
					color="danger"
					buttons={[
						{
							text: "Dismiss",
							role: "cancel",
						},
					]}
				/>
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
			</IonPage>
		)
	);
};

export default CategoryManager;
