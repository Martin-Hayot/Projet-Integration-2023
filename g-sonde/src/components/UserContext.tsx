import { createContext } from 'react';
import { UserContextProps } from '../types';

const UserContext = createContext<UserContextProps>({
	emailUser: null,
	abilityUser: null,
	setEmailUser: () => {},
	setAbilityUser: () => {},
	logout: () => {},
});

export default UserContext;
