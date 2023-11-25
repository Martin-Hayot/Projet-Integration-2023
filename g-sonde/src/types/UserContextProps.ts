interface UserContextProps {
	emailUser: string | null;
	abilityUser: string | null;
	setEmailUser: (email: string | null) => void;
	setAbilityUser: (ability: string | null) => void;
	logout: () => void;
}

export default UserContextProps;
