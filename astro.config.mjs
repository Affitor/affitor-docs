// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.affitor.com',
	integrations: [
		starlight({
			title: 'Affitor',
			description: 'Complete guide to the Affitor affiliate management platform',
			logo: {
				light: './src/assets/affitor-logo.svg',
				dark: './src/assets/affitor-logo-dark.svg',
				replacesTitle: false,
			},
			favicon: '/favicon.svg',
			customCss: [
				'./src/styles/custom.css',
			],
			social: [
				{ icon: 'x.com', label: 'X', href: 'https://x.com/AffitorAI' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Affitor' },
			],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: '',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
					},
				},
			],
			editLink: {
				baseUrl: 'https://github.com/affitor/affiliate-docs/edit/main/',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is Affitor?', slug: 'getting-started/what-is-affitor', badge: { text: 'Start', variant: 'tip' } },
						{ label: 'How It Works', slug: 'getting-started/how-it-works' },
						{ label: 'Pricing', slug: 'getting-started/pricing-performance-model' },
						{ label: 'Glossary', slug: 'getting-started/glossary' },
					],
				},
				{
					label: 'Advertiser Guide',
					items: [
						{
							label: 'Quickstart',
							collapsed: false,
							items: [
								{ label: 'Create Account', slug: 'advertisers/quickstart/create-account' },
								{ label: 'Setup Program', slug: 'advertisers/quickstart/setup-program' },
								{ label: 'Define Commission', slug: 'advertisers/quickstart/define-commission' },
								{ label: 'Partner Approval & Quality Control', slug: 'advertisers/quickstart/partner-approval-quality-control' },
								{ label: 'View Performance', slug: 'advertisers/quickstart/view-performance' },
								{ label: 'Commission Approval & Cash Flow', slug: 'advertisers/quickstart/commission-approval-cash-flow' },
								{ label: 'Payouts', slug: 'advertisers/quickstart/payouts' },
							],
						},
						{
							label: 'Tracking & Integration',
							collapsed: false,
							items: [
								{ label: 'Tracking Overview', slug: 'advertisers/tracking/tracking-overview' },
								{ label: 'Pageview Tracker (Click)', slug: 'advertisers/tracking/pageview-tracker-click' },
								{ label: 'Lead Tracking (Signup)', slug: 'advertisers/tracking/lead-tracking-signup' },
								{ label: 'Payment Tracking (Stripe)', slug: 'advertisers/tracking/payment-tracking-stripe' },
								{ label: 'Payment Flow', slug: 'advertisers/tracking/payment-flow' },
							],
						},
					],
				},
				{
					label: 'FAQ & Support',
					items: [
						{ label: 'FAQ', slug: 'faq' },
						{ label: 'Contact Us', slug: 'support/contact' },
					],
				},
			],
		}),
	],
});
