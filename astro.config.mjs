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
					label: 'Start Here',
					items: [
						{ label: 'What is Affitor?', slug: 'getting-started/what-is-affitor' },
						{ label: 'How It Works', slug: 'getting-started/how-it-works' },
						{ label: 'Pricing & Performance Model', slug: 'getting-started/pricing-performance-model' },
					],
				},
				{
					label: 'Quickstart',
					items: [
						{ label: 'Launch Your Program', slug: 'advertisers/quickstart' },
						{ label: 'CLI Setup (5 min)', slug: 'advertisers/cli/quickstart' },
						{ label: 'Install Tracking', slug: 'advertisers/tracking/quickstart-integration' },
						{ label: 'Test Your Integration', slug: 'advertisers/tracking/testing-integration' },
					],
				},
				{
					label: 'CLI',
					items: [
						{ label: 'CLI Quickstart', slug: 'advertisers/cli/quickstart' },
						{ label: 'Command Reference', slug: 'advertisers/cli/commands' },
					],
				},
				{
					label: 'Tracking',
					items: [
						{ label: 'Tracking Overview', slug: 'advertisers/tracking/tracking-overview' },
						{ label: 'Click Tracking', slug: 'advertisers/tracking/pageview-tracker-click' },
						{ label: 'Signup Tracking', slug: 'advertisers/tracking/lead-tracking-signup' },
						{ label: 'Payment Tracking', slug: 'advertisers/tracking/payment-tracking-stripe' },
						{ label: 'Payment Flow', slug: 'advertisers/tracking/payment-flow' },
						{ label: 'Testing Integration', slug: 'advertisers/tracking/testing-integration' },
					],
				},
				{
					label: 'Program Management',
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
					label: 'Reference',
					items: [
						{ label: 'Glossary', slug: 'getting-started/glossary' },
					],
				},
				{
					label: 'Help',
					items: [
						{ label: 'FAQ', slug: 'faq' },
						{ label: 'Contact Us', slug: 'support/contact' },
					],
				},
			],
		}),
	],
});
