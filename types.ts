import React from 'react';

export type ViewState =
  | 'landing'
  | 'courses'
  | 'mentors'
  | 'careers'
  | 'certifications'
  | 'placements'
  | 'auth'
  | 'about'
  | 'blog'
  | 'contact'
  | 'company-careers'
  | 'faqs'
  | 'help-center'
  | 'refund-policy'
  | 'privacy-policy'
  | 'terms';

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
}