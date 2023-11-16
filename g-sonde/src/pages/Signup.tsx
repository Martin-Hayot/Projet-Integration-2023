import {
	IonButton,
	IonCard,
	IonCardContent,
	IonInput,
	IonItem,
	IonLabel,
	IonPage,
	IonToast,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
} from "@ionic/react";

import { InputChangeEventDetail } from '@ionic/core';
import React, { useState } from "react";
import axios from "axios";

const SignUp: React.FC = () => {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
	const [password, setPassword] = useState(""); 
    const [ confirmPassword,setConfirmPassword] = useState("");            
	const [toastMessage, setToastMessage] = useState("");
	const [showErrorToast, setShowErrorToast] = useState(false);
	const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [mailValide, setMailValide] = useState(false);
    const [mdpValide, setMdpValide] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("");
    
	const validationEmail = (currentEmail:string) => {
        const regularExpression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (regularExpression.test(currentEmail)) {
            setMailValide(true);
        } else {
            setMailValide(false);
			setShowErrorToast(true)
            setToastMessage("Adresse Mail invalide.");
        }
    };
    
    // Pour tester la force du mot de passe à travers les codes couleurs
    const analyze = (value: string) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\\$%^&*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (strongRegex.test(value)) {
        setBackgroundColor("#0F9D58");
    } else if (mediumRegex.test(value)) {
        setBackgroundColor("#F4B400");
    } else {
        setBackgroundColor("#DB4437");
    }
    };

    const handlePasswordChange = (e: CustomEvent<InputChangeEventDetail>) => {
		const newPassword = e.detail.value;
		if (newPassword !== null && newPassword !== undefined) {
			setPassword(newPassword);
			analyze(newPassword);
		  }
	  };
	          
      const ConfirmPwd = (confirmPass: string) => {
        const confirmPassword = confirmPass
        if (password === confirmPassword) {
            setMdpValide(true);
          } else {
            setMdpValide(false);
            setShowErrorToast(true)
			setToastMessage("Les mots de passe ne sont pas identiques.");
          }
      };
    
	
	async function SignUp(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
        // Valider l'email
        if (!mailValide) {
			setShowErrorToast(true)
            setToastMessage("Adresse e-mail invalide.");
            return;
        }

        // Valider le mot de passe
        if (!mdpValide) {
			setShowErrorToast(true)
			setToastMessage("Les mots de passe ne sont pas identiques.");
            return;
        }
		axios
			.post("http://localhost:3001/api/auth/signup", {
				firstname:firstname,
                lastname: lastname,
                email: email,
				password: password,
			})
			.then((res) => {
				if (res.status == 201) {
					setShowSuccessToast(true);
					setToastMessage("New account create successfully");
						window.location.href = "/user/home";
				} else {
					setShowErrorToast(true);
					setToastMessage(res.data.errors.msg);
				}
			})
			.catch((err) => {
				setShowErrorToast(true);
				setToastMessage(err.response.data.errors.msg);
			});
            
	}
	return (
		<IonPage className="signup-background">
		<IonHeader>
			<IonToolbar>
				<IonTitle>G-sonde</IonTitle>
				<IonButtons slot="end">
				<IonButton routerLink="/">Home</IonButton>
				<IonButton routerLink="/about">About</IonButton>
				<IonButton routerLink="/contact">Contact</IonButton>
				</IonButtons>
			</IonToolbar>
    	</IonHeader>
		<div className="bg-cover bg-center bg-no-repeat h-full" style={{ backgroundColor: "#F0F8FF", paddingTop:'20px' }}>
			<div className="md:w-[35em] md:m-auto my-auto">
				<h1 className="text-2xl text-center mb-6">
					Créer un compte 
				</h1>
				<IonCard className="">
					<IonCardContent>
						<form onSubmit={SignUp}>
							<IonItem>
                                <IonLabel position="floating">Nom</IonLabel>
								<IonInput
									type="text"
									onIonChange={(e) => {
                                        setLastname(e.detail.value!);
                                        }
                                    }
									required
								></IonInput>
							</IonItem>
							<IonItem>
                                <IonLabel position="floating">Prénom</IonLabel>
								<IonInput
									type="text"
									onIonChange={(e) => {
                                            setFirstname(e.detail.value!); 
                                        }
                                    }
									required
								></IonInput>
							</IonItem>
							<IonItem>
                                <IonLabel position="floating">e-mail</IonLabel>
                                <IonInput
                                    type="email"
                                    onIonChange={(e) => {
                                        setEmail(e.detail.value!);
                                        validationEmail(e.detail.value!);
                                    }}
                                >   
                                </IonInput>
							</IonItem>
							<IonItem>
                                <IonLabel position="floating"> Mot de passe </IonLabel>
                                <IonInput
                                    type="password"
                                    onIonChange={handlePasswordChange}
                                    style={{ backgroundColor: backgroundColor }}
                                >
                                </IonInput>
							</IonItem>
							<IonItem> 
                                <IonLabel position="floating">Confirmation</IonLabel>
                                <IonInput
                                    type="password"
                                    onIonChange={(e) => {
                                        setConfirmPassword(e.detail.value!); // Assurez-vous que cette ligne met à jour l'état
                                        ConfirmPwd(e.detail.value!); // Appelez confirmPwd ici
                                    }
                                }
								></IonInput>
							</IonItem>
							<IonButton
								expand="block"
								type="submit"
								id="open-toast"
								className="ion-margin-top"
							>
								S'inscrire
						
							</IonButton>
							<IonToast
								isOpen={showErrorToast}
								onDidDismiss={() => setShowErrorToast(false)}
								color="danger"
								message={toastMessage}
								duration={3000}
								buttons={[
									{
										text: "Dismiss",
										role: "cancel",
									},
								]}
							/>
							<IonToast
								isOpen={showSuccessToast}
								onDidDismiss={() => setShowSuccessToast(false)}
								message="User create successful!"
								duration={3000}
								color="success"
								buttons={[
									{
										text: "Dismiss",
										role: "cancel",
									},
								]}
							/>
							<div className="border my-6 border-gray-500"> </div>
						</form>
					</IonCardContent>
				</IonCard>
			</div>
			</div>
		</IonPage>
	);
};

export default SignUp;
