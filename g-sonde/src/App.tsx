import {
	IonApp,
	IonRouterOutlet,
	IonSplitPane,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home  from "./pages/Home";
import Signup from "./pages/Signup";
import Aquarium from "./pages/Aquarium";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import "../styles/tailwind.css";
import React, { useState } from 'react';
setupIonicReact();

const App: React.FC = () => {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path={'/'}>
						<Home></Home>
					</Route>
					<Route path={"/dashboard"}>
						<Dashboard></Dashboard>
					</Route>
					<Route path={'/aquarium'}>
						<Aquarium></Aquarium>
					</Route>
					<Route path={'/login'}>
						<Login></Login>
					</Route>
					<Route path={'/about'}>
						<About></About>
					</Route>
					<Route path={"/signup"}>
						<Signup></Signup>
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;
