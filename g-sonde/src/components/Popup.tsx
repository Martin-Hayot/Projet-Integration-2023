import React from "react";
import { IonButton } from "@ionic/react";
import { PopupProps } from "../types";

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
	return (
		<>
			{isOpen && (
				<>
					<div
						id="popup-background"
						className="fixed top-0 left-0 w-full h-full bg-opacity-50 backdrop-blur-md z-10"
						onClick={onClose}></div>
					<div
						id="popup-content"
						className="rounded-2xl flex flex-col fixed top-1/2 left-1/2 bg-gray-500 bg-opacity-40 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 z-45 overflow-auto mx-auto z-50">
						<IonButton
							id="popup-close-button"
							className="m-0 place-self-end"
							color={"danger"}
							onClick={onClose}>
							&times;
						</IonButton>
						{children}
					</div>
				</>
			)}
		</>
	);
};

export default Popup;
