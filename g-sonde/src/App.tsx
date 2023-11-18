import {
	IonApp,
	IonRouterOutlet,
	IonSplitPane,
	setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Home, About, Login, Aquarium, DashboardPage } from './pages';

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

import '../styles/tailwind.css';

setupIonicReact();

const App: React.FC = () => {
	return (
	  <IonApp>
		<IonReactRouter>
		  <IonRouterOutlet>
			<Switch>
			  <Route exact path="/">
				<Home />
			  </Route>
			  <Route path="/user/home">
				<DashboardPage />
			  </Route>
			  <Route path="/aquarium">
				<Aquarium />
			  </Route>
			  <Route path="/login">
				<Login />
			  </Route>
			  <Route path="/about">
				<About />
			  </Route>
			  {/* Redirection par défaut */}
			  <Redirect to="/" />
			</Switch>
		  </IonRouterOutlet>
		</IonReactRouter>
	  </IonApp>
	);
  };
  
  export default App;