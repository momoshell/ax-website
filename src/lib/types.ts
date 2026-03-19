// Content type definitions for A&X Labs website

export interface HeroContent {
	headline: string;
	tagline: string;
	subtagline: string;
	cta_text: string;
	cta_target: string;
	body: string;
}

export interface Service {
	title: string;
	description: string;
	icon: string;
}

export interface ServicesContent {
	title: string;
	subtitle: string;
	services: Service[];
	body: string;
}

export interface AboutContent {
	title: string;
	subtitle: string;
	body: string;
}

export interface ContactContent {
	title: string;
	subtitle: string;
	email: string;
	linkedin: string;
	github: string;
	location: string;
	body: string;
}

export type ContentType = HeroContent | ServicesContent | AboutContent | ContactContent;
