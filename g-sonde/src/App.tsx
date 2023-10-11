import {
	IonApp,
	IonRouterOutlet,
	IonSplitPane,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import DashboardPage from "./pages/User/DashboardPage";
import Login from "./pages/Login";
import Aquarium from "./pages/Aquarium";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import "../styles/tailwind.css";

setupIonicReact();

const App: React.FC = () => {
	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path={"/"}>
						<Home></Home>
					</Route>
					<Route path={"/user/home"}>
						<DashboardPage></DashboardPage>
					</Route>
					<Route path={"/aquarium"}>
						<Aquarium></Aquarium>
					</Route>
					<Route path={"/login"}>
						<Login></Login>
					</Route>
					<Route path={"/about"}>
						<About></About>
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;