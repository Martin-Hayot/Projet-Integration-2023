import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonTitle,
    IonToast,
    IonToolbar,
    useIonViewDidEnter,
} from "@ionic/react";
import { Navbar } from "../../components";
import axios from "axios";
import React, { useRef, useEffect } from "react";
import { any } from "prop-types";

const Profile: React.FC = () => {
    const [toastMessage, setToastMessage] = React.useState("");
    const [showErrorToast, setShowErrorToast] = React.useState(false);
    const [showSuccessToast, setShowSuccessToast] = React.useState(false);
    const [modalEmail, setModalEmail] = React.useState("");
    const [modalPassword, setModalPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const modal = useRef<HTMLIonModalElement>(null);
    const apiUrl = import.meta.env.VITE_URL_API;

    const handleModalFormSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        axios
            .post(`${apiUrl}auth/login`, {
                email: modalEmail,
                password: modalPassword,
            })
            .then((res) => {
                if (res.status == 200) {
                    modal.current?.dismiss();
                    handleMainFormSubmit();
                } else {
                    setShowErrorToast(true);
                    setToastMessage(res.data.message);
                }
            })
            .catch((err) => {
                setShowErrorToast(true);
                setToastMessage(err.response.data.message);
            });
    };

    useEffect(() => {
        getProfilePicture();
        getProfileInfo();
    }, []);

    const getProfileInfo = () => {
        axios
            .get(`${apiUrl}user/profile`, {
                withCredentials: true,
            })
            .then((res) => {
                setEmail(res.data.email);
                setFirstname(res.data.firstname);
                setLastname(res.data.lastname);
            })
            .catch((err) => {
                setShowErrorToast(true);
                setToastMessage(err.response.data.message);
            });
    };

    const handleMainFormSubmit = () => {
        axios
            .patch(
                `${apiUrl}user/profile`,
                {
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    password: password,
                },
                {
                    withCredentials: true,
                }
            )
            .then((res) => {
                setShowSuccessToast(true);
                setToastMessage("Profile updated successfully");
            })
            .catch((err) => {
                setShowErrorToast(true);
                setToastMessage(err.response.data.message);
            });
    };

    const getProfilePicture = () => {
        const profilePictureElement =
            document.getElementById("profile-picture");
        if (!profilePictureElement) {
            return null;
        }
        axios
            .get(`${apiUrl}user/profile/picture`, {
                withCredentials: true,
            })
            .then((profilePicture) => {
                profilePictureElement.setAttribute(
                    "src",
                    profilePicture.data.profilePicture
                );
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    return null;
                }
                setShowErrorToast(true);
                setToastMessage("Error getting profile picture");
                console.log(error);
            });
    };

    const handleProfilePicture = async (e: any) => {
        const profilePictureElement =
            document.getElementById("profile-picture");
        const inputFile = document.getElementById("input-file");
        if (!profilePictureElement || !inputFile) {
            return null;
        }
        const file = (inputFile as HTMLInputElement).files![0];
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePictureElement.setAttribute(
                "src",
                e.target!.result as string
            );
            axios
                .put(
                    `${apiUrl}user/profile/picture`,
                    {
                        profilePicture: reader.result,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    setShowSuccessToast(true);
                    setToastMessage("Profile picture updated successfully");
                })
                .catch(() => {
                    setShowErrorToast(true);
                    setToastMessage("Error updating profile picture");
                });
        };
        reader.readAsDataURL(file);
    };

    return (
        <IonPage>
            <Navbar />
            <IonContent className="ion-padding">
                <div className="md:w-[35em] md:m-auto pt-20">
                    <h1 className="text-4xl text-center mb-6">
                        Modify your profile
                    </h1>
                    <img
                        id="profile-picture"
                        className="rounded-full w-32 h-32 mx-auto my-10"
                        src="/no-profile-picture.png"
                        alt="profile picture"
                    ></img>
                    <div className="flex justify-center ">
                        <label
                            htmlFor="input-file"
                            className="border border-blue-400 p-3 rounded-md cursor-pointer hover:bg-blue-400 hover:text-white duration-150 ease-in-out"
                        >
                            Change your profile picture
                        </label>
                        <input
                            id="input-file"
                            accept="image/jpeg, image/png, image/jpg"
                            type="file"
                            onChange={handleProfilePicture}
                            className="hidden"
                        />
                    </div>
                    <IonCard className="">
                        <IonCardContent>
                            <form id="main-form">
                                <div className="flex flex-col md:flex-row">
                                    <IonItem className="w-[50%]">
                                        <IonLabel position="floating">
                                            Firstname
                                        </IonLabel>
                                        <IonInput
                                            type="text"
                                            onIonChange={(e) =>
                                                setFirstname(e.detail.value!)
                                            }
                                            value={firstname}
                                            required
                                        ></IonInput>
                                    </IonItem>
                                    <IonItem className="w-[50%]">
                                        <IonLabel position="floating">
                                            Lastname
                                        </IonLabel>
                                        <IonInput
                                            type="text"
                                            onIonChange={(e) =>
                                                setLastname(e.detail.value!)
                                            }
                                            value={lastname}
                                            required
                                        ></IonInput>
                                    </IonItem>
                                </div>
                                <IonItem>
                                    <IonLabel position="floating">
                                        Email
                                    </IonLabel>
                                    <IonInput
                                        type="email"
                                        onIonChange={(e) =>
                                            setEmail(e.detail.value!)
                                        }
                                        value={email}
                                        required
                                    ></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="floating">
                                        New Password
                                    </IonLabel>
                                    <IonInput
                                        type="password"
                                        onIonChange={(e) =>
                                            setPassword(e.detail.value!)
                                        }
                                        required
                                    ></IonInput>
                                </IonItem>
                                <IonToast
                                    isOpen={showErrorToast}
                                    onDidDismiss={() =>
                                        setShowErrorToast(false)
                                    }
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
                                    onDidDismiss={() =>
                                        setShowSuccessToast(false)
                                    }
                                    message={toastMessage}
                                    duration={3000}
                                    color="success"
                                    buttons={[
                                        {
                                            text: "Dismiss",
                                            role: "cancel",
                                        },
                                    ]}
                                />
                                <div className="flex flex-row justify-center gap-5 items-center">
                                    <IonButton id="open-modal" className="mt-5">
                                        Apply changes
                                    </IonButton>
                                    <IonModal ref={modal} trigger="open-modal">
                                        <IonHeader className="text-center">
                                            <IonToolbar>
                                                <IonButtons slot="start">
                                                    <IonButton
                                                        onClick={() =>
                                                            modal.current?.dismiss()
                                                        }
                                                    >
                                                        Cancel
                                                    </IonButton>
                                                </IonButtons>
                                                <IonTitle className="mr-10">
                                                    Comfirm your identity
                                                </IonTitle>
                                            </IonToolbar>
                                        </IonHeader>
                                        <IonContent>
                                            <form
                                                onSubmit={handleModalFormSubmit}
                                                className="m-5"
                                            >
                                                <IonItem>
                                                    <IonLabel position="floating">
                                                        Email
                                                    </IonLabel>
                                                    <IonInput
                                                        type="email"
                                                        onIonChange={(e) =>
                                                            setModalEmail(
                                                                e.detail.value!
                                                            )
                                                        }
                                                        required
                                                    ></IonInput>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel position="floating">
                                                        Password
                                                    </IonLabel>
                                                    <IonInput
                                                        type="password"
                                                        onIonChange={(e) =>
                                                            setModalPassword(
                                                                e.detail.value!
                                                            )
                                                        }
                                                        required
                                                    ></IonInput>
                                                </IonItem>
                                                <IonButton
                                                    expand="block"
                                                    type="submit"
                                                    className="mt-5"
                                                >
                                                    Apply changes
                                                </IonButton>
                                            </form>
                                        </IonContent>
                                    </IonModal>
                                </div>
                            </form>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
