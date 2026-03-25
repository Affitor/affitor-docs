// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.affitor.com',
	integrations: [
		sitemap(),
		starlight({
			title: 'Affitor Documentation',
			description: 'Complete guide to the Affitor affiliate management platform',
			customCss: ['./src/styles/custom.css'],
			logo: {
				src: './src/assets/affitor-logo.svg',
				replacesTitle: false,
			},
			favicon: '/favicon-v2.svg',
			social: [
				// { icon: 'github', label: 'GitHub', href: 'https://github.com/affitor' },
				// { icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/affitor' },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is Affitor?', slug: 'getting-started/what-is-affitor' },
						{ label: 'How It Works', slug: 'getting-started/how-it-works' },
						{ label: 'Pricing & Performance Model', slug: 'getting-started/pricing-performance-model' },
						{ label: 'Glossary', slug: 'getting-started/glossary' },
					],
				},
				{
					label: 'For Advertisers',
					items: [
						{
							label: 'Quickstart',
							collapsed: false,
							items: [
								{ label: 'Create Account', slug: 'advertisers/quickstart/create-account' },
								{ label: 'Setup Program', slug: 'advertisers/quickstart/setup-program' },
								{ label: 'Partner Approval & Quality Control', slug: 'advertisers/quickstart/partner-approval-quality-control' },
								{ label: 'View Performance', slug: 'advertisers/quickstart/view-performance' },
								{ label: 'Define Commission', slug: 'advertisers/quickstart/define-commission' },
								{ label: 'Commission Approval & Cash Flow', slug: 'advertisers/quickstart/commission-approval-cash-flow' },
								{ label: 'Payouts', slug: 'advertisers/quickstart/payouts' },
							],
						},
						{
							label: 'Tracking',
							collapsed: false,
							items: [
								{ label: '3-Step Integration Guide', slug: 'advertisers/tracking/quickstart-integration' },
								// { label: 'Introduction', slug: 'advertisers/tracking/introduction' },
								{ label: 'Tracking Overview', slug: 'advertisers/tracking/tracking-overview' },
								{ label: 'Pageview Tracker (Click)', slug: 'advertisers/tracking/pageview-tracker-click' },
								{ label: 'Lead Tracking (Signup)', slug: 'advertisers/tracking/lead-tracking-signup' },
								{ label: 'Payment Tracking (Stripe)', slug: 'advertisers/tracking/payment-tracking-stripe' },
								{ label: 'Payment Flow', slug: 'advertisers/tracking/payment-flow' },
								{ label: 'Testing Integration', slug: 'advertisers/tracking/testing-integration' },
							],
						},
						// {
						// 	label: 'Managing Partners',
						// 	items: [
						// 		{ label: 'Approve & Reject', slug: 'advertisers/managing-partners/approve-reject' },
						// 	],
						// },
						// { label: 'Best Practices', slug: 'advertisers/best-practices' },
					],
				},
				{
					label: 'FAQ',
					link: '/faq/',
				},
				{
					label: 'Support',
					items: [
						{ label: 'Contact Us', slug: 'support/contact' },
						// { label: 'System Status', slug: 'support/status' },
					],
				},
			],
		}),
	],
});
