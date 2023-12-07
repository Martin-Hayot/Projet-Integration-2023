import {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import {
    Home,
    About,
    Login,
    DashboardPage,
    ContactUs,
    TicketsViewer,
    CategoryManager,
    UserTicketsManager,
    Charts,
    Profile,
} from "./pages";
import Signup from "./pages/Signup";
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
                    <Route path={"/user/dashboard"}>
                        <DashboardPage></DashboardPage>
                    </Route>
                    <Route path={"/user/tickets"}>
                        <UserTicketsManager></UserTicketsManager>
                    </Route>
                    <Route path={"/user/charts"}>
                        <Charts></Charts>
                    </Route>
                    <Route path={"/login"}>
                        <Login></Login>
                    </Route>
                    <Route path={"/signup"}>
                        <Signup></Signup>
                    </Route>
                    <Route path={"/about"}>
                        <About></About>
                    </Route>
                    <Route path={"/contact"}>
                        <ContactUs />
                    </Route>
                    <Route path={"/admin/tickets"}>
                        <TicketsViewer />
                    </Route>
                    <Route path="/admin/category/manager">
                        <CategoryManager />
                    </Route>
                    <Route path={"/user/profile"} component={Profile} />
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
