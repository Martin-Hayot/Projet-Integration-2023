// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,jsx,ts,tsx,css}"],
	darkMode: "media",
	theme: {
		extend: {},
		backgroundImage: theme => ({
			'aquarium': "url('aquarium2.jpg')",
			
		}),
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
