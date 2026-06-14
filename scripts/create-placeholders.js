import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contentDir = path.join(__dirname, '../src/content/docs');

// Define all placeholder pages with their metadata
const placeholders = [
  // Advertisers - Quickstart
  {
    path: 'advertisers/quickstart/setup-program.mdx',
    title: 'Setup Your Affiliate Program',
    description: 'Configure your affiliate program settings, commission structure, and program details.',
    content: `Learn how to set up and configure your affiliate program on Affitor, including program settings, terms and conditions, and initial configuration.

## What You'll Learn

- Program configuration options
- Setting program terms and conditions
- Configuring program visibility
- Setting up program branding

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on setting up your affiliate program.`
  },
  {
    path: 'advertisers/quickstart/partner-approval-quality-control.mdx',
    title: 'Partner Approval & Quality Control',
    description: 'Learn how to review partner applications and maintain quality standards for your affiliate program.',
    content: `Understand the partner approval process and how to maintain quality standards for your affiliate program.

## What You'll Learn

- Partner application review process
- Quality control criteria
- Approval and rejection workflows
- Best practices for partner vetting

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on partner approval and quality control.`
  },
  {
    path: 'advertisers/quickstart/view-performance.mdx',
    title: 'View Performance Metrics',
    description: 'Access and understand your affiliate program performance dashboard and key metrics.',
    content: `Learn how to access and interpret your affiliate program performance data.

## What You'll Learn

- Dashboard overview
- Key metrics explanation
- Performance reports
- Data interpretation and insights

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on viewing and analyzing performance metrics.`
  },
  {
    path: 'advertisers/quickstart/define-commission.mdx',
    title: 'Define Commission Structure',
    description: 'Set up commission rates, tiers, and rules for your affiliate program.',
    content: `Configure your commission structure to reward partners for successful referrals.

## What You'll Learn

- Commission structure options
- Setting commission rates
- Tiered commission models
- Commission rules and conditions

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on defining your commission structure.`
  },
  {
    path: 'advertisers/quickstart/commission-approval-cash-flow.mdx',
    title: 'Commission Approval & Cash Flow',
    description: 'Manage commission approvals and understand cash flow for affiliate payouts.',
    content: `Learn how to manage commission approvals and understand the cash flow process for affiliate payouts.

## What You'll Learn

- Commission approval process
- Cash flow management
- Payment schedules
- Financial reconciliation

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on commission approval and cash flow management.`
  },
  {
    path: 'advertisers/quickstart/payouts.mdx',
    title: 'Affiliate Payouts',
    description: 'Configure payout methods, schedules, and manage affiliate payments.',
    content: `Set up and manage affiliate payouts through Stripe Connect.

## What You'll Learn

- Payout methods and configuration
- Payout schedules
- Minimum payout thresholds
- Tax considerations

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on managing affiliate payouts.`
  },

  // Advertisers - Tracking
  {
    path: 'advertisers/tracking/introduction.mdx',
    title: 'Tracking Introduction',
    description: 'Introduction to Affitor\'s tracking system and how it works.',
    content: `Get started with Affitor's tracking system to accurately attribute referrals and conversions.

## What You'll Learn

- Tracking system overview
- Why tracking matters
- Tracking architecture
- Getting started with tracking

## Coming Soon

This guide is currently being written. Check back soon for an introduction to Affitor's tracking system.`
  },
  {
    path: 'advertisers/tracking/tracking-overview.mdx',
    title: 'Tracking Overview',
    description: 'Complete overview of the tracking flow from click to payment.',
    content: `Understand the complete tracking flow in Affitor from initial click to final payment.

## What You'll Learn

- Complete tracking flow
- Event types (click, signup, payment)
- Data flow diagrams
- Integration points

## Coming Soon

This guide is currently being written. Check back soon for a comprehensive tracking overview.`
  },
  {
    path: 'advertisers/tracking/click-tracking.mdx',
    title: 'Pageview Tracker (Click Tracking)',
    description: 'Implement click tracking to capture affiliate referrals.',
    content: `Learn how to implement click tracking to capture when users click on affiliate links.

## What You'll Learn

- Click tracking implementation
- Tracker installation
- URL parameter handling
- Testing click tracking

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on implementing click tracking.`
  },
  {
    path: 'advertisers/tracking/lead-tracking-signup.mdx',
    title: 'Lead Tracking (Signup)',
    description: 'Track user signups and attribute them to affiliate partners.',
    content: `Implement signup tracking to attribute new user registrations to affiliate partners.

## What You'll Learn

- Signup event tracking
- Lead attribution
- API integration
- Testing lead tracking

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on implementing signup tracking.`
  },
  {
    path: 'advertisers/tracking/payment-tracking-stripe.mdx',
    title: 'Payment Tracking (Stripe)',
    description: 'Integrate Stripe webhooks to track payments and trigger commissions.',
    content: `Connect Stripe to Affitor to automatically track payments and trigger commission calculations.

## What You'll Learn

- Stripe webhook integration
- Payment event handling
- Commission calculation triggers
- Testing payment tracking

## Coming Soon

This guide is currently being written. Check back soon for detailed instructions on Stripe payment tracking.`
  },
  {
    path: 'advertisers/tracking/payment-flow.mdx',
    title: 'Payment Flow',
    description: 'Understand the end-to-end payment flow and commission calculation.',
    content: `Learn how payments flow through the system and trigger commission calculations.

## What You'll Learn

- End-to-end payment flow
- Flow diagrams
- Error handling
- Edge cases

## Coming Soon

This guide is currently being written. Check back soon for a detailed payment flow guide.`
  },
  {
    path: 'advertisers/tracking/testing-integration.mdx',
    title: 'Testing Your Integration',
    description: 'Test your tracking implementation to ensure accurate attribution.',
    content: `Learn how to test your tracking integration to ensure everything works correctly.

## What You'll Learn

- Testing strategies
- Test mode setup
- Debugging tools
- Common issues and solutions

## Coming Soon

This guide is currently being written. Check back soon for testing and debugging guidance.`
  },

  // Advertisers - Managing Partners
  {
    path: 'advertisers/managing-partners/approve-reject.mdx',
    title: 'Approve & Reject Partners',
    description: 'Manage partner applications and maintain program quality.',
    content: `Learn how to review and manage partner applications for your affiliate program.

## What You'll Learn

- Partner approval interface
- Rejection reasons
- Communication templates
- Re-application process

## Coming Soon

This guide is currently being written. Check back soon for instructions on managing partner applications.`
  },

  // Advertisers - Best Practices
  {
    path: 'advertisers/best-practices.mdx',
    title: 'Best Practices',
    description: 'Best practices for running a successful affiliate program.',
    content: `Learn best practices for optimizing and scaling your affiliate program.

## What You'll Learn

- Program optimization tips
- Partner recruitment strategies
- Commission structure recommendations
- Fraud prevention
- Performance optimization

## Coming Soon

This guide is currently being written. Check back soon for best practices and optimization strategies.`
  },

  // FAQ
  {
    path: 'faq/index.mdx',
    title: 'Frequently Asked Questions',
    description: 'Common questions and answers about Affitor.',
    content: `Find answers to frequently asked questions about Affitor.

## General Questions

Coming soon...

## Advertiser Questions

Coming soon...

## Technical Questions

Coming soon...

## Billing Questions

Coming soon...

## Coming Soon

This FAQ section is currently being written. Check back soon for answers to common questions.`
  },

  // Support
  {
    path: 'support/status.mdx',
    title: 'System Status',
    description: 'Check the current status of Affitor services.',
    content: `Check the current operational status of Affitor services.

## Current Status

All systems operational.

## Coming Soon

This page will be updated with real-time system status information, uptime metrics, and incident history.`
  },
];

// Function to create a placeholder file
function createPlaceholder(placeholder) {
  const filePath = path.join(contentDir, placeholder.path);
  const dir = path.dirname(filePath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`  ⊘ Skipped (already exists): ${placeholder.path}`);
    return;
  }

  // Create frontmatter
  const frontmatter = `---
title: "${placeholder.title}"
description: "${placeholder.description}"
lastUpdated: 2026-01-22
---

`;

  // Add coming soon notice
  const comingSoonNotice = `:::note[Coming Soon]
This page is currently under development. The content will be available soon.
:::

`;

  // Combine all parts
  const fileContent = frontmatter + comingSoonNotice + placeholder.content;

  // Write file
  fs.writeFileSync(filePath, fileContent);
  console.log(`  ✓ Created: ${placeholder.path}`);
}

// Main execution
console.log('Creating placeholder pages...\n');

placeholders.forEach(createPlaceholder);

console.log(`\n✅ Placeholder creation complete!`);
console.log(`Created ${placeholders.length} placeholder pages`);


