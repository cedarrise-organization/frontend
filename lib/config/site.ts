const siteConfig = {
	contact: {
		email: {
			all: ["cedarriseinitiative@gmail.com"],
			href: "mailto:cedarriseinitiative@gmail.com",
			primary: "cedarriseinitiative@gmail.com",
		},
		phone: {
			display: "+234 903 937 7669",
			href: "tel:+2349039377669",
			whatsAppUrl:
				"https://api.whatsapp.com/send/?phone=%2B2349039377669&text&type=phone_number&app_absent=0",
		},
	},
	copyrightYear: 2026,
	description: "Nurturing Minds, Transforming Communities",
	name: "CedarRise",
	organizationName: "CedarRise Initiative",
	social: {
		instagram: "https://www.instagram.com/cedarriseinitiative",
		linkedIn: "https://www.linkedin.com/company/cedarrise-initiative",
		tikTok: "https://www.tiktok.com/@cedarrise.initiat",
		youTube: "https://youtube.com/@cedarriseinitiative",
	},
	websiteUrl: "https://bit.ly/CedarRiseInitiative",
} as const;

export { siteConfig };
