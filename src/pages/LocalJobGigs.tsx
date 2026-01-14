import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Briefcase, 
  MapPin, 
  CreditCard,
  Search,
  Filter,
  TrendingUp,
  Users,
  Calendar,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  UserPlus,
  Award,
  Zap,
  Layers,
  Globe,
  Eye,
  Phone,
  Mail,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Completely isolated styles - no global CSS dependencies
const isolatedStyles = `
  #ljg-page-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #ljg-content-wrapper {
    min-height: calc(100vh - 80px);
  }
  
  #ljg-hero-section {
    position: relative;
    min-height: 50vh;
    overflow: visible;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, hsl(220, 33%, 96%) 0%, hsl(220, 25%, 92%) 100%);
  }
  
  @media (min-width: 640px) {
    #ljg-hero-section {
      min-height: 55vh;
    }
  }
  
  @media (min-width: 1024px) {
    #ljg-hero-section {
      min-height: 70vh;
      flex-direction: row;
      align-items: flex-end;
      overflow: hidden;
    }
  }
  
  #ljg-hero-content {
    position: relative;
    z-index: 10;
    max-width: 1280px;
    margin: 0 auto;
    padding: 3rem 1rem 3rem;
    width: 100%;
  }
  
  @media (min-width: 640px) {
    #ljg-hero-content {
      padding: 4rem 1.5rem 3.5rem;
    }
  }
  
  @media (min-width: 768px) {
    #ljg-hero-content {
      padding: 5rem 1.5rem 4rem;
    }
  }
  
  @media (min-width: 1024px) {
    #ljg-hero-content {
      padding: 7rem 4rem 6rem;
    }
  }
  
  #ljg-hero-inner {
    max-width: 100%;
    margin: 0;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 0;
    align-items: flex-start;
  }
  
  @media (min-width: 640px) {
    #ljg-hero-inner {
      gap: 1.25rem;
    }
  }
  
  @media (min-width: 768px) {
    #ljg-hero-inner {
      gap: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #ljg-hero-inner {
      max-width: 90%;
      padding: 0 2rem;
    }
  }
  
  #ljg-hero-title {
    color: hsl(220, 30%, 15%);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    letter-spacing: -0.01em;
    font-family: 'Playfair Display', serif;
  }
  
  @media (min-width: 375px) {
    #ljg-hero-title {
      font-size: 2rem;
    }
  }
  
  @media (min-width: 640px) {
    #ljg-hero-title {
      font-size: 2.5rem;
      line-height: 1.1;
    }
  }
  
  @media (min-width: 768px) {
    #ljg-hero-title {
      font-size: 3.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #ljg-hero-title {
      font-size: 4.5rem;
      letter-spacing: -0.02em;
    }
  }
  
  #ljg-hero-divider {
    height: 0.25rem;
    width: 6.25rem;
    background-color: hsl(220, 30%, 15%);
    border: none;
    margin: 1.125rem 0 1.875rem;
    padding: 0;
  }
  
  @media (min-width: 640px) {
    #ljg-hero-divider {
      width: 6.25rem;
      margin: 1.25rem 0 2rem;
    }
  }
  
  @media (min-width: 768px) {
    #ljg-hero-divider {
      width: 6.25rem;
      margin: 1.5rem 0 2.25rem;
    }
  }
  
  #ljg-hero-text {
    color: hsl(220, 15%, 45%);
    font-size: 0.875rem;
    margin: 0;
    max-width: 100%;
    margin-left: 0;
    margin-right: auto;
    line-height: 1.5;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  @media (min-width: 375px) {
    #ljg-hero-text {
      font-size: 0.9375rem;
    }
  }
  
  @media (min-width: 640px) {
    #ljg-hero-text {
      font-size: 1rem;
      max-width: 42rem;
      line-height: 1.6;
    }
  }
  
  @media (min-width: 768px) {
    #ljg-hero-text {
      font-size: 1.125rem;
    }
  }

  #ljg-search-box {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  @media (min-width: 768px) {
    #ljg-search-box {
      flex-direction: row;
      gap: 0;
      align-items: stretch;
    }
  }

  /* Autocomplete Wrapper */
  .ljg-autocomplete-wrapper {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  @media (min-width: 768px) {
    .ljg-autocomplete-wrapper {
      min-width: 200px;
    }
    
    .ljg-autocomplete-wrapper:not(:last-of-type) {
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  @media (min-width: 1024px) {
    .ljg-autocomplete-wrapper {
      min-width: 250px;
    }
  }

  @media (min-width: 1280px) {
    .ljg-autocomplete-wrapper {
      min-width: 280px;
    }
  }

  /* Search Input Container - Past Questions Style */
  .ljg-search-input-container {
    position: relative;
    width: 100%;
    height: 44px;
  }

  @media (min-width: 768px) {
    .ljg-search-input-container {
      height: 48px;
    }
  }

  .ljg-search-input-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    background: #f5f5f5;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: visible;
    display: flex;
    align-items: center;
    padding: 0 0.875rem;
    gap: 0.625rem;
    transition: all 0.2s ease;
  }

  @media (min-width: 375px) {
    .ljg-search-input-wrapper {
      padding: 0 1rem;
      gap: 0.75rem;
    }
  }

  @media (min-width: 640px) {
    .ljg-search-input-wrapper {
      padding: 0 1.125rem;
      gap: 0.75rem;
    }
  }

  @media (min-width: 768px) {
    .ljg-search-input-wrapper {
      border-radius: 0;
      border: none;
      box-shadow: none;
      background: transparent;
      padding: 0 1.5rem;
      gap: 0.875rem;
    }
  }

  @media (min-width: 1024px) {
    .ljg-search-input-wrapper {
      padding: 0 1.75rem;
      gap: 1rem;
    }
  }

    .ljg-autocomplete-wrapper:first-child .ljg-search-input-wrapper {
      border-radius: 30px 0 0 30px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-right: none;
      background: #f5f5f5;
    }

    .ljg-autocomplete-wrapper:last-of-type:not(:only-child) .ljg-search-input-wrapper {
      border-radius: 0;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-left: none;
      background: #f5f5f5;
    }
  }

  .ljg-search-input-wrapper:focus-within {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: rgba(37, 99, 235, 0.3);
  }

  @media (min-width: 768px) {
    .ljg-search-input-wrapper:focus-within {
      box-shadow: none;
    }
  }

  .ljg-search-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #6b7280;
    height: 100%;
    line-height: 1;
  }

  .ljg-search-icon-wrapper svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 1.4;
    display: block;
    vertical-align: middle;
  }

  .ljg-input-field-wrapper {
    flex: 1;
    position: relative;
    min-width: 0;
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 1.5;
  }

  .ljg-placeholder-text {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    color: #9ca3af;
    font-size: 0.625rem;
    pointer-events: none;
    z-index: 1;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.3;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 375px) {
    .ljg-placeholder-text {
      font-size: 0.6875rem;
    }
  }

  @media (min-width: 640px) {
    .ljg-placeholder-text {
      font-size: 0.75rem;
    }
  }

  @media (min-width: 768px) {
    .ljg-placeholder-text {
      font-size: 0.75rem;
    }
  }

  @media (min-width: 1024px) {
    .ljg-placeholder-text {
      font-size: 0.8125rem;
    }
  }

  .ljg-placeholder-text span {
    line-height: 1.5;
    display: inline-block;
  }

  #ljg-search-input,
  #ljg-location-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: #111827;
    font-family: 'DM Sans', system-ui, sans-serif;
    padding: 0;
    line-height: 1.4;
    height: 100%;
    display: block;
  }

  @media (min-width: 640px) {
    #ljg-search-input,
    #ljg-location-input {
      font-size: 0.9375rem;
    }
  }

  @media (min-width: 768px) {
    #ljg-search-input,
    #ljg-location-input {
      font-size: 1rem;
    }
  }

  #ljg-search-input::placeholder,
  #ljg-location-input::placeholder {
    color: transparent;
  }

  /* Search Button - Past Questions Style */
  #ljg-search-button {
    height: 44px;
    padding: 0 1.5rem;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'DM Sans', system-ui, sans-serif;
    white-space: nowrap;
    width: 100%;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 375px) {
    #ljg-search-button {
      padding: 0 2rem;
      font-size: 0.9375rem;
    }
  }

  @media (min-width: 640px) {
    #ljg-search-button {
      font-size: 1rem;
    }
  }

  @media (min-width: 768px) {
    #ljg-search-button {
      width: auto;
      min-width: 140px;
      height: 48px;
      border-radius: 0 30px 30px 0;
      padding: 0 2.5rem;
      font-size: 1rem;
    }
  }

  #ljg-search-button:hover {
    background-color: #1d4ed8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    transform: translateY(-1px);
  }

  #ljg-search-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }

  /* Autocomplete Suggestions - Modern Design */
  .ljg-suggestions-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-height: 320px;
    overflow-y: auto;
    z-index: 1000;
    animation: ljg-fadeInDown 0.2s ease-out;
  }

  @keyframes ljg-fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .ljg-suggestions-dropdown::-webkit-scrollbar {
    width: 6px;
  }

  .ljg-suggestions-dropdown::-webkit-scrollbar-track {
    background: #f9fafb;
  }

  .ljg-suggestions-dropdown::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .ljg-suggestions-dropdown::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .ljg-suggestion-item {
    padding: 0.875rem 1.25rem;
    cursor: pointer;
    transition: all 0.15s ease;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-suggestion-item:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .ljg-suggestion-item:last-child {
    border-bottom: none;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  .ljg-suggestion-item:hover,
  .ljg-suggestion-item.ljg-suggestion-active {
    background-color: #f3f4f6;
  }

  .ljg-suggestion-icon {
    width: 1.125rem;
    height: 1.125rem;
    color: #6b7280;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .ljg-suggestion-text {
    flex: 1;
    font-size: 0.9375rem;
    color: #111827;
    font-weight: 400;
    line-height: 1.5;
  }

  .ljg-suggestion-category {
    font-size: 0.75rem;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 0.25rem 0.625rem;
    border-radius: 0.375rem;
    margin-left: auto;
    font-weight: 500;
    white-space: nowrap;
  }

  .ljg-suggestion-highlight {
    font-weight: 600;
    color: #2563eb;
    background-color: rgba(37, 99, 235, 0.1);
    padding: 0 0.125rem;
    border-radius: 0.125rem;
  }

  #ljg-gigs-section {
    background-color: #f9fafb;
    padding: 3rem 0;
    width: 100%;
  }

  @media (min-width: 768px) {
    #ljg-gigs-section {
      padding: 4rem 0;
    }
  }

  #ljg-gigs-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  @media (min-width: 640px) {
    #ljg-gigs-inner {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #ljg-gigs-inner {
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }

  /* Side-by-side layout container */
  #ljg-content-layout {
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (min-width: 1024px) {
    #ljg-content-layout {
      flex-direction: row;
      align-items: flex-start;
      gap: 2rem;
    }
  }

  /* Left side - Cards Grid */
  #ljg-cards-container {
    width: 100%;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (min-width: 1024px) {
    #ljg-cards-container {
      width: 100%;
    }

    #ljg-content-layout.has-selection #ljg-cards-container {
      width: 45%;
      flex-shrink: 0;
    }
  }

  /* Mobile overlay backdrop */
  #ljg-mobile-overlay {
    display: none;
  }

  @media (max-width: 1023px) {
    #ljg-mobile-overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 99;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    #ljg-mobile-overlay.active {
      opacity: 1;
      visibility: visible;
    }
  }

  /* Right side - Detail View */
  #ljg-detail-sidebar {
    width: 100%;
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    background: white;
    z-index: 100;
    overflow-y: auto;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    transition: right 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: 1023px) {
    #ljg-detail-sidebar.active {
      right: 0;
    }
  }

  @media (min-width: 1024px) {
    #ljg-detail-sidebar {
      position: relative;
      top: auto;
      right: auto;
      height: auto;
      width: 0;
      opacity: 0;
      overflow: hidden;
      box-shadow: none;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #ljg-content-layout.has-selection #ljg-detail-sidebar {
      width: 55%;
      opacity: 1;
      overflow: visible;
    }
  }

  #ljg-section-header {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  @media (min-width: 640px) {
    #ljg-section-header {
      gap: 1.75rem;
    }
  }

  @media (min-width: 768px) {
    #ljg-section-header {
      margin-bottom: 3rem;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      gap: 2rem;
    }
  }

  @media (min-width: 1024px) {
    #ljg-section-header {
      gap: 2.5rem;
    }
  }

  #ljg-section-header-content {
    flex: 1;
    min-width: 0;
  }

  #ljg-section-header-search {
    flex: 1;
    min-width: 0;
    max-width: 100%;
    width: 100%;
  }

  @media (min-width: 640px) {
    #ljg-section-header-search {
      max-width: 100%;
    }
  }

  @media (min-width: 768px) {
    #ljg-section-header-search {
      max-width: 700px;
      flex-shrink: 0;
      min-width: 500px;
    }
  }

  @media (min-width: 1024px) {
    #ljg-section-header-search {
      max-width: 800px;
      min-width: 600px;
    }
  }

  @media (min-width: 1280px) {
    #ljg-section-header-search {
      max-width: 900px;
      min-width: 700px;
    }
  }

  #ljg-section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
    font-family: 'Playfair Display', serif;
  }
  
  @media (min-width: 640px) {
    #ljg-section-title {
      font-size: 1.875rem;
    }
  }
  
  @media (min-width: 768px) {
    #ljg-section-title {
      font-size: 2.25rem;
    }
  }

  #ljg-section-subtitle {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  @media (min-width: 640px) {
    #ljg-section-subtitle {
      font-size: 1rem;
    }
  }

  #ljg-gigs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 640px) {
    #ljg-gigs-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    #ljg-gigs-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
    }
  }

  .ljg-gig-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #E5E7EB;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    user-select: none;
  }

  .ljg-gig-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .ljg-gig-header {
    margin-top: 0;
    margin-bottom: 0.75rem;
  }

  .ljg-gig-title {
    font-size: 1rem;
    font-weight: 600;
    color: #141522;
    margin: 0 0 0.25rem 0;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.4;
  }

  .ljg-gig-badge {
    font-size: 0.875rem;
    color: #54577A;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-gig-description {
    color: #54577A;
    font-size: 0.875rem;
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-gig-details {
    margin-top: 0.75rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .ljg-gig-detail {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
    border-radius: 8px;
    border: 1px solid rgba(84, 111, 255, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ljg-gig-detail:hover {
    background: linear-gradient(135deg, #f0f2ff 0%, #e8ebff 100%);
    border-color: rgba(84, 111, 255, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(84, 111, 255, 0.1);
  }

  .ljg-gig-detail-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .ljg-gig-detail-icon {
    width: 14px;
    height: 14px;
    color: #54577A;
    flex-shrink: 0;
  }

  .ljg-gig-detail-value {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #141522;
    margin: 0;
    line-height: 1.2;
    font-family: 'DM Sans', system-ui, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ljg-gig-detail-label {
    font-size: 0.6875rem;
    color: #54577A;
    margin: 0;
    line-height: 1.2;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-gig-footer {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .ljg-gig-price {
    font-size: 0.875rem;
    font-weight: 600;
    color: #141522;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-gig-apply-btn {
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-gig-apply-btn-group {
    position: relative;
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(220, 30%, 15%);
    transition: color 0.3s ease;
  }

  .ljg-gig-apply-btn:hover .ljg-gig-apply-btn-group {
    color: hsl(220, 20%, 40%);
  }

  .ljg-gig-apply-btn-content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding-bottom: 0.25rem;
  }

  .ljg-gig-apply-btn-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: #60a5fa;
    transition: all 0.3s ease;
    width: calc(100% + 14px);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
  }

  .ljg-gig-apply-btn:hover .ljg-gig-apply-btn-underline {
    background: #3b82f6;
  }

  .ljg-gig-apply-btn-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Detail Sidebar Styles */
  #ljg-detail-container {
    position: relative;
    background: white;
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow-y: auto;
  }

  @media (min-width: 1024px) {
    #ljg-detail-container {
      padding: 1.25rem;
      border-radius: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }

  #ljg-detail-close-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: #f3f4f6;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
    color: #6b7280;
  }

  @media (min-width: 1024px) {
    #ljg-detail-close-btn {
      display: flex;
      top: 1.25rem;
      right: 1.25rem;
      width: 2.25rem;
      height: 2.25rem;
    }
  }

  #ljg-detail-close-btn:hover {
    background: #e5e7eb;
    transform: rotate(90deg);
    color: #111827;
  }

  #ljg-detail-close-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  #ljg-detail-header {
    padding: 0 0 1.5rem 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 2rem;
  }

  .ljg-detail-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .ljg-detail-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    font-family: 'Playfair Display', serif;
    flex: 1;
    line-height: 1.3;
  }

  @media (min-width: 768px) {
    .ljg-detail-title {
      font-size: 2.25rem;
    }
  }

  .ljg-detail-badge {
    background-color: #dbeafe;
    color: #1e40af;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: 'DM Sans', system-ui, sans-serif;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ljg-detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .ljg-detail-meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.9375rem;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-detail-meta-icon {
    width: 1.125rem;
    height: 1.125rem;
    color: #9ca3af;
  }

  #ljg-detail-content {
    padding: 0.75rem 0;
  }

  .ljg-detail-section {
    margin-bottom: 1.25rem;
  }

  .ljg-detail-section:last-child {
    margin-bottom: 0;
  }

  .ljg-detail-section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.75rem 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-detail-section-content {
    color: #6b7280;
    font-size: 0.9375rem;
    line-height: 1.7;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-detail-list {
    margin: 0 !important;
    padding-left: 1.5rem !important;
    list-style-type: disc !important;
    list-style-position: outside !important;
  }

  .ljg-detail-list li {
    color: #6b7280 !important;
    font-size: 0.9375rem !important;
    line-height: 1.7 !important;
    margin-bottom: 0.5rem !important;
    font-family: 'DM Sans', system-ui, sans-serif !important;
    display: list-item !important;
    list-style-type: disc !important;
    list-style-position: outside !important;
  }

  .ljg-detail-list li:last-child {
    margin-bottom: 0 !important;
  }

  .ljg-employer-contact-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.875rem 1rem;
    display: flex;
    align-items: center;
    gap: 0;
    flex-wrap: nowrap;
  }

  .ljg-employer-contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #374151;
    text-decoration: none;
    font-size: 0.875rem;
    font-family: 'DM Sans', system-ui, sans-serif;
    transition: all 0.2s ease;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ljg-employer-contact-item:first-child {
    padding-left: 0;
  }

  .ljg-employer-contact-item:hover {
    color: #2563eb;
    background: #f3f4f6;
  }

  .ljg-employer-contact-divider {
    width: 1px;
    height: 1.5rem;
    background: #e5e7eb;
    margin: 0 0.5rem;
    flex-shrink: 0;
  }

  .ljg-employer-contact-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #6b7280;
    transition: color 0.2s ease;
  }

  .ljg-employer-contact-item:hover .ljg-employer-contact-icon {
    color: #2563eb;
  }

  .ljg-employer-contact-item span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  @media (min-width: 640px) {
    .ljg-employer-contact-item span {
      max-width: 200px;
    }
  }

  #ljg-detail-footer {
    padding: 1.5rem 0 0 0;
    border-top: 1px solid #e5e7eb;
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
  }

  .ljg-detail-price {
    font-size: 0.875rem;
    font-weight: 600;
    color: #141522;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-detail-apply-btn {
    padding: 0.875rem 2rem;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'DM Sans', system-ui, sans-serif;
    white-space: nowrap;
  }

  .ljg-detail-apply-btn:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  }

  /* Card animations - Smooth transitions */
  .ljg-gig-card-selected {
    z-index: 10;
    position: relative;
  }

  @media (min-width: 1024px) {
    #ljg-content-layout.has-selection #ljg-gigs-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  #ljg-empty-state {
    text-align: center;
    padding: 4rem 1rem;
    color: #6b7280;
  }

  #ljg-empty-state-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  #ljg-empty-state-text {
    font-size: 0.875rem;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* Mobile: 0px - 767px */
  @media (max-width: 767px) {
    #ljg-content-wrapper {
      padding-top: 60px;
    }
  }

  /* Tablet: 768px - 1199px */
  @media (min-width: 768px) and (max-width: 1199px) {
    #ljg-content-wrapper {
      padding-top: 70px;
    }
  }

  /* Desktop: 1200px - 1599px */
  @media (min-width: 1200px) and (max-width: 1599px) {
    #ljg-content-wrapper {
      padding-top: 120px;
    }
  }

  /* Large Desktop: 1600px+ */
  @media (min-width: 1600px) {
    #ljg-content-wrapper {
      padding-top: 120px;
    }
  }

  /* Hero Carousel Styles */
  #ljg-hero-main {
    position: relative;
    flex: 1;
    min-height: 50vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 1;
  }
  
  @media (min-width: 640px) {
    #ljg-hero-main {
      min-height: 55vh;
    }
  }
  
  @media (min-width: 1024px) {
    #ljg-hero-main {
      min-height: 70vh;
      width: 65%;
      padding-bottom: 0;
    }
  }
  
  #ljg-hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, hsl(40, 33%, 96%) 0%, hsl(40, 25%, 92%) 100%);
    z-index: 1;
  }
  
  #ljg-hero-curve {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 180px;
    z-index: 2;
    pointer-events: none;
    overflow: visible;
  }
  
  @media (min-width: 1024px) {
    #ljg-hero-curve {
      width: 100%;
      height: 250px;
      left: 0;
      bottom: -50px;
    }
  }
  
  #ljg-hero-svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  #ljg-carousel-container {
    display: none;
  }
  
  @media (min-width: 1024px) {
    #ljg-carousel-container {
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 35%;
      padding: 2rem;
      margin-top: 0;
      margin-left: 0;
      bottom: -50px;
      right: 2rem;
      z-index: 10;
      pointer-events: auto;
    }
  }
  
  #ljg-carousel-wrapper {
    position: relative;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  @media (min-width: 1024px) {
    #ljg-carousel-wrapper {
      padding: 2rem;
      border-radius: 1.75rem;
    }
  }
  
  #ljg-carousel-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    font-family: 'Playfair Display', serif;
    text-align: center;
  }
  
  @media (min-width: 1024px) {
    #ljg-carousel-title {
      text-align: left;
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
    }
  }
  
  #ljg-carousel-track {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  @media (min-width: 640px) {
    #ljg-carousel-track {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    #ljg-carousel-track {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }
  
  .ljg-carousel-item {
    aspect-ratio: 1;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .ljg-carousel-item:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }
  
  .ljg-carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Featured Workers Section - EXACT COPY of Monthly Mentors */
  #ljg-featured-workers-section {
    background-color: #ffffff;
    padding: 3rem 0;
    width: 100%;
  }

  @media (min-width: 768px) {
    #ljg-featured-workers-section {
      padding: 4rem 0;
    }
  }

  #ljg-featured-workers-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (min-width: 640px) {
    #ljg-featured-workers-inner {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    #ljg-featured-workers-inner {
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }

  .ljg-featured-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
  }

  .ljg-featured-title {
    font-size: 2rem;
    font-weight: 600;
    color: #141522;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.2;
  }

  .ljg-featured-nav {
    display: flex;
    align-items: center;
    gap: 0;
    margin-right: -0.25rem;
  }

  .ljg-featured-nav-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #54577A;
    transition: all 0.2s ease;
    padding: 0.5rem;
  }

  .ljg-featured-nav-btn:hover:not(.disabled) {
    color: #141522;
  }

  .ljg-featured-nav-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ljg-featured-nav-btn svg {
    width: 20px;
    height: 20px;
  }

  .ljg-featured-slider {
    position: relative;
    overflow: hidden;
  }

  .ljg-featured-slider-track {
    display: flex;
    gap: 1.5rem;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  @media (min-width: 640px) {
    .ljg-featured-slider-track {
      gap: 1.75rem;
    }
  }

  @media (min-width: 1024px) {
    .ljg-featured-slider-track {
      gap: 2rem;
    }
  }

  /* Card - Horizontal layout with optimal width */
  .ljg-featured-card {
    min-width: 320px;
    width: 320px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.12);
    user-select: none;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 640px) {
    .ljg-featured-card {
      min-width: 350px;
      width: 350px;
    }
  }

  .ljg-featured-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Top section: HORIZONTAL layout - Avatar, Name/Title, Button all on one line */
  .ljg-featured-card-main-stack {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    gap: 12px;
  }

  /* Left side: Avatar + Name/Title */
  .ljg-featured-card-content-stack {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  /* Avatar 48x48 with primary.main background */
  .ljg-featured-card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #546FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
  }

  .ljg-featured-card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* CardContent with name and title - LEFT ALIGNED */
  .ljg-featured-card-content {
    padding: 0;
    text-align: left;
    flex: 1;
    min-width: 0;
  }

  .ljg-featured-card-name {
    font-size: 1rem;
    font-weight: 600;
    color: #141522;
    margin: 0 0 4px 0;
    text-decoration: none;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.5;
    display: block;
  }

  .ljg-featured-card-name:hover {
    color: #546FFF;
    text-decoration: underline;
  }

  .ljg-featured-card-subtitle {
    font-size: 0.875rem;
    color: #54577A;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.43;
    display: block;
  }

  /* CardActions with Button - on the RIGHT */
  .ljg-featured-card-actions {
    padding: 0;
    margin: 0;
    width: auto;
    flex-shrink: 0;
  }

  .ljg-featured-card-button {
    padding: 6px 16px;
    background: transparent;
    border: none;
    color: #546FFF;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-family: 'DM Sans', system-ui, sans-serif;
    text-transform: none;
    min-height: 36px;
    white-space: nowrap;
  }

  .ljg-featured-card-button:hover {
    background-color: rgba(84, 111, 255, 0.04);
  }

  .ljg-featured-card-button.followed {
    color: #54577A;
  }

  .ljg-featured-card-button.followed:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  /* Icon in button - gridicons:plus-small */
  .ljg-featured-card-button-icon {
    width: 16px;
    height: 16px;
    margin-right: 0;
    pointer-events: none;
    display: inline-block;
    flex-shrink: 0;
  }

  /* CardContent with stats (reduced margin-top) */
  .ljg-featured-card-stats-content {
    padding: 12px 16px 16px 16px;
    margin-top: 16px;
  }

  /* Stack alignItems="center" justifyContent="space-between" for stats */
  .ljg-featured-card-stats {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  /* Stack alignItems="center" spacing={0.875} for Task */
  .ljg-featured-card-stat-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  /* Stack alignItems="center" spacing={0.5} for Rating */
  .ljg-featured-card-stat-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  /* Icon - hugeicons:note with text.secondary color */
  .ljg-featured-card-stat-icon-note {
    width: 24px;
    height: 24px;
    color: #54577A;
  }

  /* Icon - material-symbols:star-rate-rounded with warning.main color */
  .ljg-featured-card-stat-icon-star {
    width: 24px;
    height: 24px;
    color: #FFB054;
    fill: #FFB054;
  }

  /* Typography for stat values */
  .ljg-featured-card-stat-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #141522;
    margin: 0;
    text-align: center;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.43;
  }

  /* Upcoming Gigs Section - Upcoming Task Style */
  #ljg-upcoming-gigs-section {
    background-color: #F5F5F7;
    padding: 3rem 0;
    width: 100%;
  }

  @media (min-width: 768px) {
    #ljg-upcoming-gigs-section {
      padding: 4rem 0;
    }
  }

  #ljg-upcoming-gigs-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (min-width: 640px) {
    #ljg-upcoming-gigs-inner {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    #ljg-upcoming-gigs-inner {
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }

  .ljg-upcoming-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
  }

  .ljg-upcoming-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #141522;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  @media (min-width: 768px) {
    .ljg-upcoming-title {
      font-size: 2rem;
    }
  }

  .ljg-upcoming-nav {
    display: flex;
    align-items: center;
    gap: 0;
    margin-right: -0.25rem;
  }

  .ljg-upcoming-nav-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #54577A;
    transition: all 0.2s ease;
    padding: 0.5rem;
  }

  .ljg-upcoming-nav-btn:hover:not(.disabled) {
    color: #141522;
  }

  .ljg-upcoming-nav-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ljg-upcoming-nav-btn svg {
    width: 20px;
    height: 20px;
  }

  .ljg-upcoming-slider {
    position: relative;
    overflow: hidden;
  }

  .ljg-upcoming-slider-track {
    display: flex;
    gap: 1.5rem;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  @media (min-width: 1024px) {
    .ljg-upcoming-slider-track {
      gap: 1.75rem;
    }
  }

  .ljg-upcoming-card {
    min-width: 280px;
    width: 280px;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
    user-select: none;
    transition: all 0.3s ease;
  }

  @media (min-width: 640px) {
    .ljg-upcoming-card {
      min-width: 300px;
      width: 300px;
    }
  }

  .ljg-upcoming-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .ljg-upcoming-card-image {
    width: 100%;
    height: 110px;
    object-fit: cover;
    display: block;
  }

  .ljg-upcoming-card-content {
    padding: 1.5rem;
  }

  .ljg-upcoming-card-header {
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .ljg-upcoming-card-name {
    font-size: 1rem;
    font-weight: 600;
    color: #141522;
    margin: 0 0 0.25rem 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-upcoming-card-category {
    font-size: 0.875rem;
    color: #54577A;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-upcoming-card-info {
    margin-top: 0.75rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .ljg-upcoming-card-info-item.full-width {
    grid-column: 1 / -1;
  }

  .ljg-upcoming-card-info-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
    border-radius: 8px;
    border: 1px solid rgba(84, 111, 255, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ljg-upcoming-card-info-item:hover {
    background: linear-gradient(135deg, #f0f2ff 0%, #e8ebff 100%);
    border-color: rgba(84, 111, 255, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(84, 111, 255, 0.1);
  }

  .ljg-upcoming-card-info-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .ljg-upcoming-card-info-value {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #141522;
    margin: 0;
    line-height: 1.2;
    font-family: 'DM Sans', system-ui, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ljg-upcoming-card-info-label {
    font-size: 0.6875rem;
    color: #54577A;
    margin: 0;
    line-height: 1.2;
    font-family: 'DM Sans', system-ui, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ljg-upcoming-card-footer {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ljg-upcoming-card-viewed-text {
    font-size: 0.75rem;
    color: #54577A;
    font-weight: 500;
    white-space: nowrap;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .ljg-upcoming-card-avatars {
    display: flex;
    align-items: center;
    gap: -0.5rem;
  }

  .ljg-upcoming-card-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    margin-left: -8px;
    background-color: #546FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 600;
    font-size: 0.75rem;
    overflow: hidden;
  }

  .ljg-upcoming-card-avatar:first-child {
    margin-left: 0;
  }

  .ljg-upcoming-card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Carousel images data for Local Job Gigs
const GIG_CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    alt: 'Event setup and planning'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    alt: 'Moving and logistics'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    alt: 'Garden and landscaping work'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    alt: 'Delivery and transportation'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    alt: 'Photography and events'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    alt: 'Cleaning services'
  }
];

// Featured Workers will be loaded from Supabase

// Upcoming Gigs Data (Upcoming Task Style)
const UPCOMING_GIGS = [
  {
    id: 'u1',
    title: 'Creating Mobile App Design',
    category: 'UI UX Design',
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=110&fit=crop',
    experienceLevel: 'Expert',
    locationType: 'Remote Job',
    projectType: 'Complex Gig',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
    ]
  },
  {
    id: 'u2',
    title: 'Creating Perfect Website',
    category: 'Web Developer',
    thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=110&fit=crop',
    experienceLevel: 'Intermediate',
    locationType: 'On-site',
    projectType: 'Standard project',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
    ]
  },
  {
    id: 'u3',
    title: 'Mobile App Design',
    category: 'UI UX Design',
    thumb: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=110&fit=crop',
    experienceLevel: 'Expert',
    locationType: 'Hybrid',
    projectType: 'Complex project',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
    ]
  },
  {
    id: 'u4',
    title: 'Creating Mobile Apps',
    category: 'Android Developer',
    thumb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=110&fit=crop',
    experienceLevel: 'Expert',
    locationType: 'Remote Job',
    projectType: 'Complex project',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
    ]
  },
  {
    id: 'u5',
    title: 'Creating Awesome Mobile Apps',
    category: 'UI UX Design',
    thumb: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=110&fit=crop',
    experienceLevel: 'Advanced',
    locationType: 'Remote Job',
    projectType: 'Standard project',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
    ]
  },
  {
    id: 'u6',
    title: 'Creating Fresh Website',
    category: 'Web Developer',
    thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=110&fit=crop',
    experienceLevel: 'Intermediate',
    locationType: 'On-site',
    projectType: 'Standard project',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
    ]
  }
];

// Sample gig data - in production, this would come from a database
const SAMPLE_GIGS = [
  {
    id: '1',
    title: 'Event Setup Assistant',
    description: 'Help set up for a community event. Need someone to help with tables, chairs, and decorations.',
    location: 'Accra, Greater Accra',
    duration: '4 hours',
    pay: 'GHS 150',
    type: 'One-time',
    posted: '2 hours ago',
    employer_name: 'Community Events Ltd',
    employer_phone: '+233 24 123 4567',
    employer_email: 'contact@communityevents.gh',
    requirements: 'Ability to work in a team\nPhysical stamina for setup and breakdown\nAvailable for the full event duration'
  },
  {
    id: '2',
    title: 'Moving Helper',
    description: 'Need help moving furniture from one apartment to another. Heavy lifting required.',
    location: 'Kumasi, Ashanti',
    duration: '6 hours',
    pay: 'GHS 200',
    type: 'One-time',
    posted: '5 hours ago',
    employer_name: 'Swift Movers',
    employer_phone: '+233 20 987 6543',
    employer_email: 'info@swiftmovers.gh',
    requirements: 'Heavy lifting required\nMust be physically fit and able to lift at least 50kg\nPrevious moving experience preferred'
  },
  {
    id: '3',
    title: 'Garden Cleanup',
    description: 'Looking for someone to help clean up and maintain a small garden. Basic gardening knowledge preferred.',
    location: 'Tema, Greater Accra',
    duration: '3 hours',
    pay: 'GHS 100',
    type: 'One-time',
    posted: '1 day ago',
    employer_name: 'Green Thumb Services',
    employer_phone: '+233 27 456 7890',
    employer_email: 'hello@greenthumb.gh',
    requirements: 'Basic gardening knowledge preferred\nTools will be provided\nMust be comfortable working outdoors'
  },
  {
    id: '4',
    title: 'Delivery Driver',
    description: 'Need a driver with a motorcycle to make deliveries around the city. Valid license required.',
    location: 'Tamale, Northern',
    duration: '8 hours',
    pay: 'GHS 250',
    type: 'Daily',
    posted: '1 day ago',
    employer_name: 'QuickServe Logistics',
    employer_phone: '+233 24 555 1234',
    employer_email: 'jobs@quickserve.com',
    requirements: 'Valid driver\'s license required\nMotorcycle or vehicle needed\nGood knowledge of city routes'
  },
  {
    id: '5',
    title: 'Photography Assistant',
    description: 'Assist with a wedding photography session. Help carry equipment and manage lighting.',
    location: 'Cape Coast, Central',
    duration: '5 hours',
    pay: 'GHS 180',
    type: 'One-time',
    posted: '2 days ago',
    employer_name: 'Capture Moments Studio',
    employer_phone: '+233 20 777 8888',
    employer_email: 'contact@capturemoments.gh',
    requirements: 'Experience with photography equipment preferred\nMust be available for the full duration\nAbility to work in a fast-paced environment'
  },
  {
    id: '6',
    title: 'House Cleaning',
    description: 'Deep cleaning of a 3-bedroom house. All cleaning supplies will be provided.',
    location: 'Takoradi, Western',
    duration: '4 hours',
    pay: 'GHS 120',
    type: 'One-time',
    posted: '2 days ago',
    employer_name: 'CleanPro Services',
    employer_phone: '+233 27 111 2222',
    employer_email: 'info@cleanpro.gh',
    requirements: 'All cleaning supplies will be provided\nAttention to detail required\nPrevious cleaning experience preferred'
  }
];

// Search suggestions data
const JOB_TITLE_SUGGESTIONS = [
  { id: '1', text: 'Event Setup Assistant', category: 'Event' },
  { id: '2', text: 'Moving Helper', category: 'Moving' },
  { id: '3', text: 'Garden Cleanup', category: 'Gardening' },
  { id: '4', text: 'Delivery Driver', category: 'Delivery' },
  { id: '5', text: 'Photography Assistant', category: 'Photography' },
  { id: '6', text: 'House Cleaning', category: 'Cleaning' },
  { id: '7', text: 'Data Entry', category: 'Office' },
  { id: '8', text: 'Customer Service', category: 'Service' },
  { id: '9', text: 'Warehouse Worker', category: 'Warehouse' },
  { id: '10', text: 'Food Service', category: 'Food' },
];

const LOCATION_SUGGESTIONS = [
  { id: '1', text: 'Accra, Greater Accra', category: 'City' },
  { id: '2', text: 'Kumasi, Ashanti', category: 'City' },
  { id: '3', text: 'Tema, Greater Accra', category: 'City' },
  { id: '4', text: 'Tamale, Northern', category: 'City' },
  { id: '5', text: 'Cape Coast, Central', category: 'City' },
  { id: '6', text: 'Takoradi, Western', category: 'City' },
  { id: '7', text: 'Sunyani, Bono', category: 'City' },
  { id: '8', text: 'Koforidua, Eastern', category: 'City' },
  { id: '9', text: 'Ho, Volta', category: 'City' },
  { id: '10', text: 'Remote', category: 'Remote' },
];

const LocalJobGigs = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobQuery, setJobQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [gigs, setGigs] = useState(SAMPLE_GIGS);
  const [jobSuggestions, setJobSuggestions] = useState<typeof JOB_TITLE_SUGGESTIONS>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<typeof LOCATION_SUGGESTIONS>([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [activeLocationIndex, setActiveLocationIndex] = useState(-1);
  const [selectedGig, setSelectedGig] = useState<typeof SAMPLE_GIGS[0] | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const jobInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const locationSuggestionsRef = useRef<HTMLDivElement>(null);
  
  // Featured Workers Slider State
  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const featuredSliderRef = useRef<HTMLDivElement>(null);
  const [featuredWorkers, setFeaturedWorkers] = useState<any[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  
  // Upcoming Gigs Slider State
  const [upcomingSlideIndex, setUpcomingSlideIndex] = useState(0);
  const upcomingSliderRef = useRef<HTMLDivElement>(null);

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Load Featured Workers from Supabase
  useEffect(() => {
    const loadFeaturedWorkers = async () => {
      setFeaturedLoading(true);
      try {
        const { data, error } = await supabase
          .from('skilled_workers' as any)
          .select('*')
          .eq('status', 'active')
          .order('rating', { ascending: false })
          .limit(8);

        if (error) throw error;

        if (data) {
          const transformed = data.map((worker: any) => ({
            id: worker.id,
            name: worker.name,
            title: worker.category || 'Professional',
            avatar: worker.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&size=200&background=546FFF&color=fff`,
            task: worker.completed_jobs || 0,
            rating: parseFloat(worker.rating) || 0,
            review: worker.reviews_count || 0,
            followed: false
          }));
          setFeaturedWorkers(transformed);
        }
      } catch (error: any) {
        console.error('Error loading featured workers:', error);
        setFeaturedWorkers([]);
      } finally {
        setFeaturedLoading(false);
      }
    };

    loadFeaturedWorkers();
  }, []);

  // Handle route param - if id exists, show detail view (for mobile/tablet)
  useEffect(() => {
    if (id) {
      const gig = SAMPLE_GIGS.find(g => g.id === id);
      if (gig) {
        setSelectedGig(gig);
      } else {
        // If gig not found, navigate back
        navigate('/local-job-gigs');
      }
    } else {
      // If no id, clear selection
      setSelectedGig(null);
    }
  }, [id, navigate]);

  // Filter suggestions based on input
  useEffect(() => {
    if (jobQuery.trim()) {
      const filtered = JOB_TITLE_SUGGESTIONS.filter(item =>
        item.text.toLowerCase().includes(jobQuery.toLowerCase())
      ).slice(0, 5);
      setJobSuggestions(filtered);
      setShowJobSuggestions(true);
    } else {
      setJobSuggestions([]);
      setShowJobSuggestions(false);
    }
  }, [jobQuery]);

  useEffect(() => {
    if (locationQuery.trim()) {
      const filtered = LOCATION_SUGGESTIONS.filter(item =>
        item.text.toLowerCase().includes(locationQuery.toLowerCase())
      ).slice(0, 5);
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [locationQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          jobInputRef.current && !jobInputRef.current.contains(event.target as Node)) {
        setShowJobSuggestions(false);
      }
      if (locationSuggestionsRef.current && !locationSuggestionsRef.current.contains(event.target as Node) &&
          locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleJobSuggestionClick = (suggestion: typeof JOB_TITLE_SUGGESTIONS[0]) => {
    setJobQuery(suggestion.text);
    setShowJobSuggestions(false);
    jobInputRef.current?.focus();
  };

  const handleLocationSuggestionClick = (suggestion: typeof LOCATION_SUGGESTIONS[0]) => {
    setLocationQuery(suggestion.text);
    setShowLocationSuggestions(false);
    locationInputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="ljg-suggestion-highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  const handleSearch = () => {
    let filtered = SAMPLE_GIGS;
    
    if (jobQuery.trim()) {
      filtered = filtered.filter(gig => 
        gig.title.toLowerCase().includes(jobQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(jobQuery.toLowerCase())
      );
    }
    
    if (locationQuery.trim()) {
      filtered = filtered.filter(gig => 
        gig.location.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }
    
    setGigs(filtered);
    setShowJobSuggestions(false);
    setShowLocationSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'job' | 'location') => {
    const suggestions = type === 'job' ? jobSuggestions : locationSuggestions;
    const activeIndex = type === 'job' ? activeSuggestionIndex : activeLocationIndex;
    const setActiveIndex = type === 'job' ? setActiveSuggestionIndex : setActiveLocationIndex;
    const handleClick = type === 'job' ? handleJobSuggestionClick : handleLocationSuggestionClick;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      handleClick(suggestions[activeIndex]);
    } else if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      if (type === 'job') {
        setShowJobSuggestions(false);
      } else {
        setShowLocationSuggestions(false);
      }
      setActiveIndex(-1);
    }
  };

  const handleGigClick = (gigId: string) => {
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) return;

    // On mobile/tablet, navigate to detail page
    if (!isDesktop) {
      navigate(`/local-job-gigs/${gigId}`);
      return;
    }

    // On desktop, show detail view with animation
    setSelectedGig(gig);
  };

  const handleCloseDetail = () => {
    if (!isDesktop && id) {
      // On mobile/tablet, navigate back to list
      navigate('/local-job-gigs');
    } else {
      // On desktop, just clear selection
      setSelectedGig(null);
    }
  };

  // Close detail view on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedGig) {
        handleCloseDetail();
      }
    };

    if (selectedGig) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedGig]);

  // Close detail view when clicking outside on desktop
  useEffect(() => {
    if (!selectedGig || !isDesktop) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const detailSidebar = document.getElementById('ljg-detail-sidebar');
      const cardsContainer = document.getElementById('ljg-cards-container');
      
      // Don't close if clicking inside detail sidebar or cards container
      if (detailSidebar?.contains(target) || cardsContainer?.contains(target)) {
        return;
      }
      
      // Close if clicking outside both containers
      handleCloseDetail();
    };

    // Small delay to prevent immediate close on selection
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedGig, isDesktop]);

  // Featured Gigs Slider Functions
  const [featuredSlidesPerView, setFeaturedSlidesPerView] = useState(1);
  
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth > 1440) setFeaturedSlidesPerView(4);
      else if (window.innerWidth > 1024) setFeaturedSlidesPerView(3);
      else if (window.innerWidth > 720) setFeaturedSlidesPerView(2);
      else setFeaturedSlidesPerView(1);
    };
    
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const handleFeaturedPrev = () => {
    setFeaturedSlideIndex(prev => Math.max(0, prev - featuredSlidesPerView));
  };

  const handleFeaturedNext = () => {
    const maxIndex = Math.max(0, featuredWorkers.length - featuredSlidesPerView);
    setFeaturedSlideIndex(prev => Math.min(maxIndex, prev + featuredSlidesPerView));
  };

  const isFeaturedSlideBegin = featuredSlideIndex === 0;
  const isFeaturedSlideEnd = featuredSlideIndex >= Math.max(0, featuredWorkers.length - featuredSlidesPerView);

  // Upcoming Gigs Slider Functions
  const [upcomingSlidesPerView, setUpcomingSlidesPerView] = useState(1);
  
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth > 1440) setUpcomingSlidesPerView(4);
      else if (window.innerWidth > 1024) setUpcomingSlidesPerView(3);
      else if (window.innerWidth > 720) setUpcomingSlidesPerView(2);
      else setUpcomingSlidesPerView(1);
    };
    
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const handleUpcomingPrev = () => {
    setUpcomingSlideIndex(prev => Math.max(0, prev - upcomingSlidesPerView));
  };

  const handleUpcomingNext = () => {
    const maxIndex = Math.max(0, UPCOMING_GIGS.length - upcomingSlidesPerView);
    setUpcomingSlideIndex(prev => Math.min(maxIndex, prev + upcomingSlidesPerView));
  };

  const isUpcomingSlideBegin = upcomingSlideIndex === 0;
  const isUpcomingSlideEnd = upcomingSlideIndex >= Math.max(0, UPCOMING_GIGS.length - upcomingSlidesPerView);

  // If on mobile/tablet and has id param, show only detail view
  const showDetailOnly = !isDesktop && id && selectedGig;

  return (
    <div id="ljg-page-wrapper">
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      <div id="ljg-content-wrapper">
        {/* Show detail view only on mobile/tablet when id param exists */}
        {showDetailOnly ? (
          <div id="ljg-detail-sidebar" className="active" style={{ position: 'relative', right: 'auto', height: 'auto', width: '100%', padding: '2rem 1rem' }}>
            <div id="ljg-detail-container">
              <button
                id="ljg-detail-close-btn"
                onClick={handleCloseDetail}
                aria-label="Close details"
              >
                <X />
              </button>

              <div id="ljg-detail-header">
                <div className="ljg-detail-header-top">
                  <h2 className="ljg-detail-title">{selectedGig.title}</h2>
                  <span className="ljg-detail-badge">{selectedGig.type}</span>
                </div>
                <div className="ljg-detail-meta">
                  <div className="ljg-detail-meta-item">
                    <MapPin className="ljg-detail-meta-icon" />
                    <span>{selectedGig.location}</span>
                  </div>
                  <div className="ljg-detail-meta-item">
                    <Calendar className="ljg-detail-meta-icon" />
                    <span>Posted {selectedGig.posted}</span>
                  </div>
                  <div className="ljg-detail-meta-item">
                    <CreditCard className="ljg-detail-meta-icon" />
                    <span>Estimated Pay: {selectedGig.pay}</span>
                  </div>
                </div>
              </div>

              <div id="ljg-detail-content">
                <div className="ljg-detail-section">
                  <h3 className="ljg-detail-section-title">Job Description</h3>
                  <p className="ljg-detail-section-content">
                    {selectedGig.description}
                  </p>
                </div>

                <div className="ljg-detail-section">
                  <h3 className="ljg-detail-section-title">Requirements</h3>
                  <p className="ljg-detail-section-content">
                    {selectedGig.title.includes('Moving') && 'Heavy lifting required. Must be physically fit and able to lift at least 50kg.'}
                    {selectedGig.title.includes('Garden') && 'Basic gardening knowledge preferred. Tools will be provided.'}
                    {selectedGig.title.includes('Delivery') && 'Valid driver\'s license required. Motorcycle or vehicle needed.'}
                    {selectedGig.title.includes('Photography') && 'Experience with photography equipment preferred. Must be available for the full duration.'}
                    {selectedGig.title.includes('Cleaning') && 'All cleaning supplies will be provided. Attention to detail required.'}
                    {selectedGig.title.includes('Event') && 'Ability to work in a team. Physical stamina for setup and breakdown.'}
                    {!selectedGig.title.includes('Moving') && !selectedGig.title.includes('Garden') && !selectedGig.title.includes('Delivery') && !selectedGig.title.includes('Photography') && !selectedGig.title.includes('Cleaning') && !selectedGig.title.includes('Event') && 'No specific requirements. All skill levels welcome.'}
                  </p>
                </div>

                <div className="ljg-detail-section">
                  <h3 className="ljg-detail-section-title">What to Expect</h3>
                  <p className="ljg-detail-section-content">
                    This is a {selectedGig.type.toLowerCase()} opportunity that offers flexible work hours. 
                    You'll be working directly with the client to complete the task. Payment will be made upon 
                    completion of the work. This is a great opportunity to earn extra income while helping your 
                    local community.
                  </p>
                </div>
              </div>

              <div id="ljg-detail-footer">
                <div className="ljg-detail-price">Estimated: {selectedGig.pay}</div>
                <button
                  className="ljg-detail-apply-btn"
                  onClick={() => {
                    console.log('Apply for gig:', selectedGig.id);
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div id="ljg-hero-section">
          {/* Hero Main Content (Left Side) */}
          <div id="ljg-hero-main">
            {/* Background */}
            <div id="ljg-hero-bg"></div>
            
            {/* Curved Bottom Edge */}
            <div id="ljg-hero-curve">
              <svg
                id="ljg-hero-svg"
                viewBox="0 0 1440 250"
                preserveAspectRatio="none"
              >
                <path
                  fill="#ffffff"
                  d="M0,250 L0,150 Q300,100 600,120 Q900,140 1200,110 Q1400,90 1440,100 L1440,250 Z"
                ></path>
              </svg>
            </div>
            
            {/* Carousel Container - Sits ON the Curve */}
            <div id="ljg-carousel-container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                id="ljg-carousel-wrapper"
              >
                <h3 id="ljg-carousel-title">Featured Gigs</h3>
                <div id="ljg-carousel-track">
                  {GIG_CAROUSEL_IMAGES.slice(0, 4).map((image) => (
                    <div key={image.id} className="ljg-carousel-item">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="ljg-carousel-image"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div id="ljg-hero-content">
              <div id="ljg-hero-inner">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.h1 
                    id="ljg-hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Local Job Gigs
                  </motion.h1>
                  <motion.hr
                    id="ljg-hero-divider"
                    initial={{ width: 0 }}
                    animate={{ width: '6.25rem' }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                  <motion.p 
                    id="ljg-hero-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Find local part-time jobs, gigs, and short-term opportunities in your area. Perfect for earning extra income or finding flexible work.
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Workers Section - Monthly Mentors Style (EXACT MATCH) */}
        <div id="ljg-featured-workers-section">
          <div id="ljg-featured-workers-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="ljg-featured-header">
                <h2 className="ljg-featured-title">Featured Workers</h2>
                <div className="ljg-featured-nav">
                  <button
                    className={`ljg-featured-nav-btn ${isFeaturedSlideBegin ? 'disabled' : ''}`}
                    onClick={handleFeaturedPrev}
                    disabled={isFeaturedSlideBegin}
                    aria-label="Previous featured workers"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    className={`ljg-featured-nav-btn ${isFeaturedSlideEnd ? 'disabled' : ''}`}
                    onClick={handleFeaturedNext}
                    disabled={isFeaturedSlideEnd}
                    aria-label="Next featured workers"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>

              <div className="ljg-featured-slider" ref={featuredSliderRef}>
                <div
                  className="ljg-featured-slider-track"
                  style={{
                    transform: `translateX(-${featuredSlideIndex * (window.innerWidth > 640 ? 350 + 32 : 320 + 24)}px)`
                  }}
                >
                  {featuredLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#54577A' }}>Loading workers...</div>
                  ) : featuredWorkers.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#54577A' }}>No workers available</div>
                  ) : (
                    featuredWorkers.map((worker) => (
                      <div key={worker.id} className="ljg-featured-card">
                        {/* Top Section: HORIZONTAL - Avatar + Name/Title + Button all on ONE LINE */}
                        <div className="ljg-featured-card-main-stack">
                          {/* Left side: Avatar + Name/Title */}
                          <div className="ljg-featured-card-content-stack">
                            {/* Avatar 48x48 */}
                            <div className="ljg-featured-card-avatar">
                              <img src={worker.avatar} alt={worker.name} />
                            </div>
                            {/* CardContent with name and title */}
                            <div className="ljg-featured-card-content">
                              <a href="#!" className="ljg-featured-card-name">
                                {worker.name}
                              </a>
                              <p className="ljg-featured-card-subtitle">{worker.title}</p>
                            </div>
                          </div>

                          {/* Right side: Follow Button */}
                          <div className="ljg-featured-card-actions">
                            <button
                              className={`ljg-featured-card-button ${worker.followed ? 'followed' : ''}`}
                              onClick={() => {
                                // Handle follow/unfollow
                                console.log('Toggle follow:', worker.id);
                              }}
                            >
                              {!worker.followed && (
                                <svg className="ljg-featured-card-button-icon" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                                </svg>
                              )}
                              {worker.followed ? 'Followed' : 'Follow'}
                            </button>
                          </div>
                        </div>

                        {/* CardContent with stats (mt: 2.75) */}
                        <div className="ljg-featured-card-stats-content">
                          {/* Stack: alignItems="center" justifyContent="space-between" */}
                          <div className="ljg-featured-card-stats">
                            {/* Stack: alignItems="center" spacing={0.875} */}
                            <div className="ljg-featured-card-stat-left">
                              {/* Icon: hugeicons:note - EXACT COPY */}
                              <svg className="ljg-featured-card-stat-icon-note" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                              </svg>
                              <p className="ljg-featured-card-stat-value">{worker.task} Job/Gigs</p>
                            </div>
                            {/* Stack: alignItems="center" spacing={0.5} */}
                            <div className="ljg-featured-card-stat-right">
                              {/* Icon: material-symbols:star-rate-rounded - EXACT COPY */}
                              <svg className="ljg-featured-card-stat-icon-star" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                              </svg>
                              <p className="ljg-featured-card-stat-value">
                                {worker.rating} ({worker.review} Reviews)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Upcoming Gigs Section - Upcoming Task Style */}
        <div id="ljg-upcoming-gigs-section">
          <div id="ljg-upcoming-gigs-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
               <div className="ljg-upcoming-header">
                 <h2 className="ljg-upcoming-title">Most Worked Gigs</h2>
                <div className="ljg-upcoming-nav">
                  <button
                    className={`ljg-upcoming-nav-btn ${isUpcomingSlideBegin ? 'disabled' : ''}`}
                    onClick={handleUpcomingPrev}
                    disabled={isUpcomingSlideBegin}
                    aria-label="Previous upcoming gigs"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    className={`ljg-upcoming-nav-btn ${isUpcomingSlideEnd ? 'disabled' : ''}`}
                    onClick={handleUpcomingNext}
                    disabled={isUpcomingSlideEnd}
                    aria-label="Next upcoming gigs"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>

              <div className="ljg-upcoming-slider" ref={upcomingSliderRef}>
                <div
                  className="ljg-upcoming-slider-track"
                  style={{
                    transform: `translateX(-${upcomingSlideIndex * 304}px)`
                  }}
                >
                  {UPCOMING_GIGS.map((gig) => (
                    <div key={gig.id} className="ljg-upcoming-card">
                      <img
                        src={gig.thumb}
                        alt={gig.title}
                        className="ljg-upcoming-card-image"
                      />
                      <div className="ljg-upcoming-card-content">
                        <div className="ljg-upcoming-card-header">
                          <h3 className="ljg-upcoming-card-name">{gig.title}</h3>
                          <p className="ljg-upcoming-card-category">{gig.category}</p>
                        </div>
                        <div className="ljg-upcoming-card-info">
                          <div className="ljg-upcoming-card-info-item">
                            <div className="ljg-upcoming-card-info-content">
                              <span className="ljg-upcoming-card-info-value">{gig.experienceLevel}</span>
                              <span className="ljg-upcoming-card-info-label">Experience Level</span>
                            </div>
                          </div>
                          <div className="ljg-upcoming-card-info-item">
                            <div className="ljg-upcoming-card-info-content">
                              <span className="ljg-upcoming-card-info-value">{gig.locationType}</span>
                              <span className="ljg-upcoming-card-info-label">Location</span>
                            </div>
                          </div>
                          <div className="ljg-upcoming-card-info-item">
                            <div className="ljg-upcoming-card-info-content">
                              <span className="ljg-upcoming-card-info-value">{gig.projectType}</span>
                              <span className="ljg-upcoming-card-info-label">Gig Type</span>
                            </div>
                          </div>
                        </div>
                        <div className="ljg-upcoming-card-footer">
                          <span className="ljg-upcoming-card-viewed-text">Recently viewed by:</span>
                          <div className="ljg-upcoming-card-avatars">
                            {gig.avatars.slice(0, 5).map((avatar, index) => (
                              <div key={index} className="ljg-upcoming-card-avatar">
                                <img src={avatar} alt={`Team member ${index + 1}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Gigs Section */}
        <div id="ljg-gigs-section">
          <div id="ljg-gigs-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="ljg-section-header"
            >
              <div id="ljg-section-header-content">
                <h2 id="ljg-section-title">
                  Available Gigs
                </h2>
                <p id="ljg-section-subtitle">
                  Browse local job opportunities and gigs in your area
                </p>
              </div>
              
              {/* Search Section - Moved here beside the header */}
              <div id="ljg-section-header-search">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  id="ljg-search-box"
                >
                  {/* Job Search Field */}
                  <div className="ljg-autocomplete-wrapper">
                    <div className="ljg-search-input-container">
                      <motion.div
                        layoutId="job-search-container"
                        transition={{
                          layout: {
                            duration: 0.5,
                            type: 'spring',
                            bounce: 0.2
                          }
                        }}
                        className="ljg-search-input-wrapper"
                      >
                        <motion.div layoutId="job-search-icon" className="ljg-search-icon-wrapper">
                          <Search />
                        </motion.div>
                        <div className="ljg-input-field-wrapper">
                          {!jobQuery && (
                            <motion.div
                              layout
                              className="ljg-placeholder-text"
                            >
                              <AnimatePresence mode="popLayout">
                                <motion.span
                                  layoutId="job-placeholder"
                                  key="job-placeholder"
                                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                  exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                                  transition={{ duration: 0.2, ease: 'easeOut' }}
                                >
                                  Job title, keywords, company
                                </motion.span>
                              </AnimatePresence>
                            </motion.div>
                          )}
                          <motion.input
                            ref={jobInputRef}
                            layout="position"
                            id="ljg-search-input"
                            type="text"
                            value={jobQuery}
                            onChange={(e) => setJobQuery(e.target.value)}
                            onFocus={() => {
                              if (jobSuggestions.length > 0) {
                                setShowJobSuggestions(true);
                              }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, 'job')}
                          />
                        </div>
                      </motion.div>
                    </div>
                    {showJobSuggestions && jobSuggestions.length > 0 && (
                      <motion.div
                        ref={suggestionsRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ljg-suggestions-dropdown"
                      >
                        {jobSuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion.id}
                            className={`ljg-suggestion-item ${activeSuggestionIndex === index ? 'ljg-suggestion-active' : ''}`}
                            onClick={() => handleJobSuggestionClick(suggestion)}
                            onMouseEnter={() => setActiveSuggestionIndex(index)}
                          >
                            <Search className="ljg-suggestion-icon" />
                            <span className="ljg-suggestion-text">
                              {highlightMatch(suggestion.text, jobQuery)}
                            </span>
                            <span className="ljg-suggestion-category">{suggestion.category}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Location Search Field */}
                  <div className="ljg-autocomplete-wrapper">
                    <div className="ljg-search-input-container">
                      <motion.div
                        layoutId="location-search-container"
                        transition={{
                          layout: {
                            duration: 0.5,
                            type: 'spring',
                            bounce: 0.2
                          }
                        }}
                        className="ljg-search-input-wrapper"
                      >
                        <motion.div layoutId="location-search-icon" className="ljg-search-icon-wrapper">
                          <MapPin />
                        </motion.div>
                        <div className="ljg-input-field-wrapper">
                          {!locationQuery && (
                            <motion.div
                              layout
                              className="ljg-placeholder-text"
                            >
                              <AnimatePresence mode="popLayout">
                                <motion.span
                                  layoutId="location-placeholder"
                                  key="location-placeholder"
                                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                  exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                                  transition={{ duration: 0.2, ease: 'easeOut' }}
                                >
                                  City, region, or "remote"
                                </motion.span>
                              </AnimatePresence>
                            </motion.div>
                          )}
                          <motion.input
                            ref={locationInputRef}
                            layout="position"
                            id="ljg-location-input"
                            type="text"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            onFocus={() => {
                              if (locationSuggestions.length > 0) {
                                setShowLocationSuggestions(true);
                              }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, 'location')}
                          />
                        </div>
                      </motion.div>
                    </div>
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <motion.div
                        ref={locationSuggestionsRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ljg-suggestions-dropdown"
                      >
                        {locationSuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion.id}
                            className={`ljg-suggestion-item ${activeLocationIndex === index ? 'ljg-suggestion-active' : ''}`}
                            onClick={() => handleLocationSuggestionClick(suggestion)}
                            onMouseEnter={() => setActiveLocationIndex(index)}
                          >
                            <MapPin className="ljg-suggestion-icon" />
                            <span className="ljg-suggestion-text">
                              {highlightMatch(suggestion.text, locationQuery)}
                            </span>
                            <span className="ljg-suggestion-category">{suggestion.category}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Search Button */}
                  <button
                    id="ljg-search-button"
                    onClick={handleSearch}
                    type="button"
                  >
                    Search
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile Overlay Backdrop - Outside layout */}
            {selectedGig && !isDesktop && (
              <div 
                id="ljg-mobile-overlay" 
                className="active"
                onClick={handleCloseDetail}
              />
            )}

            {/* Side-by-side Layout Container */}
            <div id="ljg-content-layout" className={selectedGig && isDesktop ? 'has-selection' : ''}>
              {/* Left Side - Cards Container */}
              {gigs.length > 0 ? (
                <div id="ljg-cards-container">
                  <div id="ljg-gigs-grid" className={selectedGig && isDesktop ? 'has-selection' : ''}>
                    <AnimatePresence mode="popLayout">
                      {gigs
                        .filter(gig => !isDesktop || !selectedGig || selectedGig.id === gig.id)
                        .map((gig, index) => {
                          const isSelected = selectedGig?.id === gig.id;
                          
                          return (
                            <motion.div
                              key={gig.id}
                              layout
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                scale: isSelected && isDesktop ? 1.02 : 1
                              }}
                              exit={{ 
                                opacity: 0, 
                                scale: 0.95,
                                y: -10,
                                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                              }}
                              transition={{ 
                                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                                scale: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                                y: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                              }}
                              className={`ljg-gig-card ${isSelected && isDesktop ? 'ljg-gig-card-selected' : ''}`}
                              onClick={() => !isDesktop && handleGigClick(gig.id)}
                            >
                              <div className="ljg-gig-header">
                                <h3 className="ljg-gig-title">{gig.title}</h3>
                                <p className="ljg-gig-badge">{gig.type}</p>
                              </div>
                              <p className="ljg-gig-description">{gig.description}</p>
                              <div className="ljg-gig-details">
                                <div className="ljg-gig-detail">
                                  <div className="ljg-gig-detail-content">
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                      <MapPin className="ljg-gig-detail-icon" />
                                      <span className="ljg-gig-detail-value">{gig.location}</span>
                                    </div>
                                    <span className="ljg-gig-detail-label">Location</span>
                                  </div>
                                </div>
                                <div className="ljg-gig-detail">
                                  <div className="ljg-gig-detail-content">
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                      <Calendar className="ljg-gig-detail-icon" />
                                      <span className="ljg-gig-detail-value">{gig.posted}</span>
                                    </div>
                                    <span className="ljg-gig-detail-label">Posted</span>
                                  </div>
                                </div>
                                <div className="ljg-gig-detail" style={{ gridColumn: "1 / -1" }}>
                                  <div className="ljg-gig-detail-content">
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                      <CreditCard className="ljg-gig-detail-icon" />
                                      <span className="ljg-gig-detail-value">Estimated: {gig.pay}</span>
                                    </div>
                                    <span className="ljg-gig-detail-label">Estimated Pay</span>
                                  </div>
                                </div>
                              </div>
                              {!isSelected && (
                                <div className="ljg-gig-footer">
                                  <button
                                    className="ljg-gig-apply-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGigClick(gig.id);
                                    }}
                                  >
                                    <motion.span
                                      className="ljg-gig-apply-btn-group"
                                      whileHover={{ x: 2 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <span className="ljg-gig-apply-btn-content">
                                        <Eye className="ljg-gig-apply-btn-icon" />
                                        View Details
                                        <span className="ljg-gig-apply-btn-underline" />
                                      </span>
                                    </motion.span>
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div id="ljg-empty-state">
                  <h3 id="ljg-empty-state-title">No gigs found</h3>
                  <p id="ljg-empty-state-text">
                    Try adjusting your search terms or check back later for new opportunities.
                  </p>
                </div>
              )}

              {/* Right Side - Detail View */}
              {selectedGig && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    id="ljg-detail-sidebar"
                    className={selectedGig && !isDesktop ? 'active' : ''}
                  >
                    <div id="ljg-detail-container">
                      <button
                        id="ljg-detail-close-btn"
                        onClick={handleCloseDetail}
                        aria-label="Close details"
                      >
                        <X />
                      </button>

                      <div id="ljg-detail-header">
                        <div className="ljg-detail-header-top">
                          <h2 className="ljg-detail-title">{selectedGig.title}</h2>
                          <span className="ljg-detail-badge">{selectedGig.type}</span>
                        </div>
                        <div className="ljg-detail-meta">
                          <div className="ljg-detail-meta-item">
                            <MapPin className="ljg-detail-meta-icon" />
                            <span>{selectedGig.location}</span>
                          </div>
                          <div className="ljg-detail-meta-item">
                            <Calendar className="ljg-detail-meta-icon" />
                            <span>Posted {selectedGig.posted}</span>
                          </div>
                          <div className="ljg-detail-meta-item">
                            <CreditCard className="ljg-detail-meta-icon" />
                            <span>{selectedGig.pay}</span>
                          </div>
                        </div>
                      </div>

                      <div id="ljg-detail-content">
                        <div className="ljg-detail-section">
                          <h3 className="ljg-detail-section-title">Job Description</h3>
                          <p className="ljg-detail-section-content">
                            {selectedGig.description}
                          </p>
                        </div>

                        <div className="ljg-detail-section">
                          <h3 className="ljg-detail-section-title">Requirements</h3>
                          {(selectedGig as any).requirements ? (
                            <ul className="ljg-detail-list">
                              {(selectedGig as any).requirements.split('\n').filter(Boolean).map((req: string, index: number) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ljg-detail-section-content">
                              No specific requirements. All skill levels welcome.
                            </p>
                          )}
                        </div>

                        <div className="ljg-detail-section">
                          <h3 className="ljg-detail-section-title">What to Expect</h3>
                          <p className="ljg-detail-section-content">
                            This is a {selectedGig.type.toLowerCase()} opportunity that offers flexible work hours. 
                            You'll be working directly with the client to complete the task. Payment will be made upon 
                            completion of the work. This is a great opportunity to earn extra income while helping your 
                            local community.
                          </p>
                        </div>

                        {(selectedGig.employer_name || selectedGig.employer_phone || selectedGig.employer_email) && (
                          <div className="ljg-detail-section">
                            <h3 className="ljg-detail-section-title">Employer Information</h3>
                            {selectedGig.employer_name && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Building2 className="ljg-detail-meta-icon" style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                                <span className="ljg-detail-section-content" style={{ margin: 0 }}>{selectedGig.employer_name}</span>
                              </div>
                            )}
                            {(selectedGig.employer_phone || selectedGig.employer_email) && (
                              <div className="ljg-employer-contact-card">
                                {selectedGig.employer_phone && (
                                  <>
                                    <a href={`tel:${selectedGig.employer_phone}`} className="ljg-employer-contact-item">
                                      <Phone className="ljg-employer-contact-icon" />
                                      <span>{selectedGig.employer_phone}</span>
                                    </a>
                                    {selectedGig.employer_email && (
                                      <div className="ljg-employer-contact-divider" />
                                    )}
                                  </>
                                )}
                                {selectedGig.employer_email && (
                                  <a href={`mailto:${selectedGig.employer_email}`} className="ljg-employer-contact-item">
                                    <Mail className="ljg-employer-contact-icon" />
                                    <span>{selectedGig.employer_email}</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div id="ljg-detail-footer">
                        <div className="ljg-detail-price">Estimated Pay: {selectedGig.pay}</div>
                        <button
                          className="ljg-detail-apply-btn"
                          onClick={() => {
                            // Handle apply action
                            console.log('Apply for gig:', selectedGig.id);
                          }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LocalJobGigs;
