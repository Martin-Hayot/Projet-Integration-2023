import {
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    isPlatform,
} from "@ionic/react";
import React from "react";
import { Navbar } from "../components";
import { Router } from "react-router";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { warningOutline } from "ionicons/icons";

const isDesktop = isPlatform("desktop");

const Home: React.FC = () => {
    const history = useHistory();
    return (
        <>
            {isDesktop ? (
                // Render desktop-specific content
                <div id="home-desktop-content">
                    <Navbar />
                    <section className="bg-aquarium dark:bg-aquarium mx-auto text-center h-screen bg-cover bg-center bg-no-repeat relative">
                        <h1 className="text-5xl pt-[8%] mb-6 text-white">
                            Desktop Home
                        </h1>
                        <p className="mb-12 text-white">
                            This is desktop-specific content.
                        </p>
                        <div className="absolute inset-0 bg-center dark:bg-black"></div>
                        <div
                            className="group relative m-0 flex w-full h-full sm:w-48 sm:h-36 md:w-72 md:h-56 lg:w-96 lg:h-72 max-w-96 max-h-72 rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto"
                            onClick={() => history.push("/login")}
                        >
                            <div className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
                                <img
                                    src="sonde.png"
                                    className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                                    alt=""
                                />
                            </div>
                            <div className="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                                <h1 className="font-serif text-2xl font-bold text-white shadow-xl ">
                                    Your Probe
                                </h1>
                            </div>
                        </div>
                    </section>
                    <footer className="bg-transparent fixed bottom-0 w-full sm:h-12 md:h-16 lg:h-20 xl:h-24 backdrop-blur-sm">
                        <div className="footer-content flex justify-center items-center mt-4 text-xl font-serif">
                            G-Sonde, developed thanks to Valérie Ramakers
                        </div>
                    </footer>
                </div>
            ) : (
                // Render mobile-specific content
                <>
                    <IonMenu contentId="main-content">
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Menu Content</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                            This is the menu content.
                            <IonButton expand="block" routerLink="/login">
                                Login
                            </IonButton>
                        </IonContent>
                    </IonMenu>
                    <IonPage id="main-content">
                        <IonHeader>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonMenuButton></IonMenuButton>
                                </IonButtons>
                                <IonTitle>Menu</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                    </IonPage>
                </>
            )}
        </>
    );
};

export default Home;
