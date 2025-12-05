import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { 
  Bolt, 
  Hammer, 
  Droplet, 
  Building, 
  Flame, 
  Paintbrush,
  Scissors,
  User,
  Wrench,
  UtensilsCrossed,
  Filter,
  Sparkles
} from "lucide-react";
import { WorkerCarousel } from "@/components/ui/worker-carousel";
import { motion } from "framer-motion";
import TextType from "@/components/ui/TextType";

// Completely isolated styles - no global CSS dependencies
const isolatedStyles = `
  #sw-page-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #sw-hero-section {
    position: relative;
    min-height: 50vh;
    overflow: visible;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 640px) {
    #sw-hero-section {
      min-height: 55vh;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-hero-section {
      min-height: 70vh;
      flex-direction: row;
      align-items: flex-end;
      overflow: hidden;
    }
  }
  
  #sw-hero-main {
    position: relative;
    flex: 1;
    min-height: 50vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 1;
  }
  
  @media (min-width: 640px) {
    #sw-hero-main {
      min-height: 55vh;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-hero-main {
      min-height: 70vh;
      width: 65%;
      padding-bottom: 0;
    }
  }
  
  #sw-hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, hsl(40, 33%, 96%) 0%, hsl(40, 25%, 92%) 100%);
    z-index: 1;
  }
  
  #sw-hero-overlay {
    display: none;
  }
  
  #sw-hero-curve {
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
    #sw-hero-curve {
      width: 100%;
      height: 250px;
      left: 0;
      bottom: -50px;
    }
  }
  
  #sw-hero-svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  #sw-carousel-container {
    display: none;
  }
  
  @media (min-width: 1024px) {
    #sw-carousel-container {
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
  
  #sw-carousel-wrapper {
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
    #sw-carousel-wrapper {
      padding: 2rem;
      border-radius: 1.75rem;
    }
  }
  
  #sw-carousel-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    font-family: 'Playfair Display', serif;
    text-align: center;
  }
  
  @media (min-width: 1024px) {
    #sw-carousel-title {
      text-align: left;
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
    }
  }
  
  #sw-carousel-track {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  @media (min-width: 640px) {
    #sw-carousel-track {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    #sw-carousel-track {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }
  
  .sw-carousel-item {
    aspect-ratio: 1;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .sw-carousel-item:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }
  
  .sw-carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  #sw-hero-content {
    position: relative;
    z-index: 10;
    max-width: 1280px;
    margin: 0 auto;
    padding: 3rem 1rem 3rem;
    width: 100%;
  }
  
  @media (min-width: 640px) {
    #sw-hero-content {
      padding: 4rem 1.5rem 3.5rem;
    }
  }
  
  @media (min-width: 768px) {
    #sw-hero-content {
      padding: 5rem 1.5rem 4rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-hero-content {
      padding: 7rem 4rem 6rem;
    }
  }
  
  #sw-hero-inner {
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
    #sw-hero-inner {
      gap: 1.25rem;
    }
  }
  
  @media (min-width: 768px) {
    #sw-hero-inner {
      gap: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-hero-inner {
      max-width: 90%;
      padding: 0 2rem;
    }
  }
  
  #sw-hero-title {
    color: hsl(220, 30%, 15%);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    letter-spacing: -0.01em;
    font-family: 'Playfair Display', serif;
  }
  
  @media (min-width: 375px) {
    #sw-hero-title {
      font-size: 2rem;
    }
  }
  
  @media (min-width: 640px) {
    #sw-hero-title {
      font-size: 2.5rem;
      line-height: 1.1;
    }
  }
  
  @media (min-width: 768px) {
    #sw-hero-title {
      font-size: 3.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-hero-title {
      font-size: 4.5rem;
      letter-spacing: -0.02em;
    }
  }
  
  #sw-hero-divider {
    height: 0.25rem;
    width: 6.25rem;
    background-color: hsl(220, 30%, 15%);
    border: none;
    margin: 1.125rem 0 1.875rem;
    padding: 0;
  }
  
  @media (min-width: 640px) {
    #sw-hero-divider {
      width: 6.25rem;
      margin: 1.25rem 0 2rem;
    }
  }
  
  @media (min-width: 768px) {
    #sw-hero-divider {
      width: 6.25rem;
      margin: 1.5rem 0 2.25rem;
    }
  }
  
  #sw-hero-text {
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
    #sw-hero-text {
      font-size: 0.9375rem;
    }
  }
  
  @media (min-width: 640px) {
    #sw-hero-text {
      font-size: 1rem;
      max-width: 42rem;
      line-height: 1.6;
    }
  }
  
  @media (min-width: 768px) {
    #sw-hero-text {
      font-size: 1.125rem;
    }
  }
  
  #sw-section {
    background-color: #ffffff;
    position: relative;
    z-index: 10;
    padding-top: 2rem;
    padding-bottom: 2rem;
    width: 100%;
  }
  
  @media (min-width: 640px) {
    #sw-section {
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
    }
  }
  
  @media (min-width: 768px) {
    #sw-section {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
  }
  
  #sw-section-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  @media (min-width: 640px) {
    #sw-section-inner {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-section-inner {
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }
  
  #sw-section-header {
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 640px) {
    #sw-section-header {
      margin-bottom: 2rem;
    }
  }
  
  #sw-section-title-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  @media (min-width: 640px) {
    #sw-section-title-wrapper {
      gap: 0.75rem;
    }
  }
  
  #sw-section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    font-family: 'Playfair Display', serif;
  }
  
  @media (min-width: 640px) {
    #sw-section-title {
      font-size: 1.875rem;
    }
  }
  
  @media (min-width: 768px) {
    #sw-section-title {
      font-size: 2.25rem;
    }
  }
  
  #sw-section-subtitle {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  @media (min-width: 640px) {
    #sw-section-subtitle {
      font-size: 1rem;
    }
  }
  
  #sw-category-section {
    margin-bottom: 2rem;
  }
  
  @media (min-width: 640px) {
    #sw-category-section {
      margin-bottom: 2.5rem;
    }
  }
  
  #sw-category-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.75rem 0;
    font-family: 'Playfair Display', serif;
  }
  
  @media (min-width: 640px) {
    #sw-category-title {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
  }
  
  #sw-category-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
  
  @media (min-width: 375px) {
    #sw-category-grid {
      gap: 1rem;
    }
  }
  
  @media (min-width: 640px) {
    #sw-category-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  
  @media (min-width: 768px) {
    #sw-category-grid {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }
  
  #sw-category-grid-services {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
  
  @media (min-width: 375px) {
    #sw-category-grid-services {
      gap: 1rem;
    }
  }
  
  @media (min-width: 640px) {
    #sw-category-grid-services {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  
  @media (min-width: 768px) {
    #sw-category-grid-services {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }
  
  .sw-category-btn {
    position: relative;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
    background-color: #ffffff;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  
  @media (min-width: 640px) {
    .sw-category-btn {
      padding: 1.25rem;
      border-radius: 1rem;
    }
  }
  
  @media (min-width: 768px) {
    .sw-category-btn {
      padding: 1.5rem;
    }
  }
  
  .sw-category-btn:hover {
    background-color: #f9fafb;
    border-color: rgba(37, 99, 235, 0.5);
  }
  
  .sw-category-btn-selected {
    border-color: #2563eb;
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2), 0 4px 6px -2px rgba(37, 99, 235, 0.2);
    background-color: rgba(37, 99, 235, 0.05);
  }
  
  .sw-category-btn-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .sw-category-icon-wrapper {
    padding: 0.75rem;
    border-radius: 9999px;
    transition: all 0.3s ease;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  @media (min-width: 640px) {
    .sw-category-icon-wrapper {
      padding: 1rem;
    }
  }
  
  .sw-category-btn:hover .sw-category-icon-wrapper {
    background-color: rgba(37, 99, 235, 0.05);
  }
  
  .sw-category-icon-wrapper-selected {
    background-color: rgba(37, 99, 235, 0.1);
  }
  
  .sw-category-label {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    color: #111827;
    transition: color 0.3s ease;
    display: block;
    width: 100%;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  @media (min-width: 375px) {
    .sw-category-label {
      font-size: 0.8125rem;
    }
  }
  
  @media (min-width: 640px) {
    .sw-category-label {
      font-size: 0.875rem;
    }
  }
  
  .sw-category-label-selected {
    color: #2563eb;
    font-weight: 600;
  }
  
  .sw-category-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  @media (min-width: 640px) {
    .sw-category-icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  
  .sw-selected-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #2563eb;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .sw-selected-dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #ffffff;
    border-radius: 9999px;
  }
  
  #sw-browse-all-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .sw-btn-browse {
    border: 2px solid #e5e7eb;
    background-color: #ffffff;
    color: #111827;
    padding: 0.625rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', system-ui, sans-serif;
    width: 100%;
    max-width: 100%;
  }
  
  @media (min-width: 640px) {
    .sw-btn-browse {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      width: auto;
      max-width: none;
    }
  }
  
  .sw-btn-browse:hover {
    background-color: #f9fafb;
    border-color: #2563eb;
  }
  
  .sw-btn-browse-active {
    background-color: #2563eb;
    color: #ffffff;
    border-color: #2563eb;
  }
  
  .sw-btn-browse-active:hover {
    background-color: #1d4ed8;
  }
  
  #sw-results {
    background-color: #f9fafb;
    padding-top: 3rem;
    padding-bottom: 3rem;
    width: 100%;
  }
  
  #sw-results-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    #sw-results-inner {
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }
  
  #sw-results-content {
    text-align: center;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  #sw-results-text {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  #sw-results-text strong {
    font-weight: 600;
    color: #111827;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  #sw-results-subtext {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0.5rem 0 0 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  #sw-trusted-section {
    background-color: #ffffff;
    padding: 4rem 0;
    width: 100%;
  }
  
  @media (min-width: 768px) {
    #sw-trusted-section {
      padding: 5rem 0;
    }
  }
  
  #sw-trusted-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  @media (min-width: 640px) {
    #sw-trusted-inner {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-trusted-inner {
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }
  
  #sw-trusted-heading {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  @media (min-width: 768px) {
    #sw-trusted-heading {
      margin-bottom: 4rem;
    }
  }
  
  #sw-trusted-title {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    font-family: 'Playfair Display', serif;
  }
  
  @media (min-width: 640px) {
    #sw-trusted-title {
      font-size: 2.25rem;
    }
  }
  
  @media (min-width: 768px) {
    #sw-trusted-title {
      font-size: 2.75rem;
    }
  }
  
  .sw-trusted-title-part1 {
    color: hsl(200, 50%, 30%);
    margin-right: 0.5rem;
  }
  
  .sw-trusted-title-part2 {
    color: hsl(220, 70%, 50%);
    display: inline-block;
    min-width: 200px;
    text-align: left;
  }
  
  @media (min-width: 768px) {
    .sw-trusted-title-part2 {
      min-width: 250px;
    }
  }
  
  #sw-trusted-logos-container {
    background-color: #ffffff;
    border-radius: 1.5rem;
    padding: 2.5rem 1.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    position: relative;
  }
  
  @media (min-width: 768px) {
    #sw-trusted-logos-container {
      padding: 3rem 2rem;
      border-radius: 2rem;
    }
  }
  
  #sw-trusted-marquee-wrapper {
    overflow: hidden;
    width: 100%;
    position: relative;
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }
  
  #sw-trusted-marquee-container {
    display: flex;
    align-items: center;
    gap: 3rem;
    animation: sw-marquee-scroll 40s linear infinite;
    will-change: transform;
    width: fit-content;
  }
  
  @media (min-width: 768px) {
    #sw-trusted-marquee-container {
      gap: 4rem;
    }
  }
  
  @keyframes sw-marquee-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .sw-trusted-logo {
    flex-shrink: 0;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: all 0.3s ease;
    filter: grayscale(0%) brightness(1) contrast(1.1);
  }
  
  @media (min-width: 768px) {
    .sw-trusted-logo {
      height: 4rem;
    }
  }
  
  .sw-trusted-logo:hover {
    opacity: 1;
    filter: grayscale(0%) brightness(1.05) contrast(1.15);
    transform: scale(1.05);
  }
  
  .sw-trusted-logo img {
    max-height: 100%;
    max-width: 120px;
    object-fit: contain;
    filter: brightness(1) contrast(1.1);
  }
  
  @media (min-width: 768px) {
    .sw-trusted-logo img {
      max-width: 150px;
    }
  }
  
  .sw-community-logo {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 0.5rem;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    height: 3rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }
  
  @media (min-width: 768px) {
    .sw-community-logo {
      min-width: 150px;
      height: 4rem;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
    }
  }
  
  .sw-community-logo:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #1e1e3e 0%, #1a2a4e 100%);
  }
  
  .sw-community-logo-text {
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    font-family: 'DM Sans', system-ui, sans-serif;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  
  @media (min-width: 768px) {
    .sw-community-logo-text {
      font-size: 1rem;
    }
  }
  
  #sw-streamline-section {
    background: linear-gradient(135deg, hsl(40, 20%, 98%) 0%, hsl(40, 15%, 97%) 100%);
    padding: 5rem 0;
    width: 100%;
    position: relative;
  }
  
  @media (min-width: 768px) {
    #sw-streamline-section {
      padding: 6rem 0;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-streamline-section {
      padding: 8rem 0;
    }
  }
  
  #sw-streamline-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  @media (min-width: 640px) {
    #sw-streamline-inner {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-streamline-inner {
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }
  
  #sw-streamline-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  @media (min-width: 768px) {
    #sw-streamline-header {
      margin-bottom: 5rem;
    }
  }
  
  #sw-streamline-title {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
    color: hsl(220, 30%, 15%);
  }
  
  @media (min-width: 640px) {
    #sw-streamline-title {
      font-size: 2rem;
    }
  }
  
  @media (min-width: 768px) {
    #sw-streamline-title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-streamline-title {
      font-size: 2.75rem;
    }
  }
  
  .sw-streamline-title-highlight {
    color: hsl(220, 70%, 50%);
  }
  
  #sw-streamline-subtitle {
    font-size: 1.125rem;
    color: hsl(220, 15%, 45%);
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  @media (min-width: 768px) {
    #sw-streamline-subtitle {
      font-size: 1.25rem;
    }
  }
  
  #sw-streamline-features {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (min-width: 768px) {
    #sw-streamline-features {
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }
  }
  
  .sw-feature-card {
    background-color: #ffffff;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 768px) {
    .sw-feature-card {
      border-radius: 1.25rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
  }
  
  .sw-feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  }
  
  .sw-feature-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  
  @media (min-width: 768px) {
    .sw-feature-image {
      height: 240px;
    }
  }
  
  .sw-feature-content {
    padding: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .sw-feature-content {
      padding: 2rem;
    }
  }
  
  .sw-feature-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: hsl(220, 30%, 15%);
    font-family: 'Playfair Display', serif;
  }
  
  @media (min-width: 768px) {
    .sw-feature-title {
      font-size: 1.75rem;
      margin-bottom: 1.25rem;
    }
  }
  
  .sw-feature-description {
    font-size: 0.9375rem;
    color: hsl(220, 15%, 45%);
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  @media (min-width: 768px) {
    .sw-feature-description {
      font-size: 1rem;
      margin-bottom: 2rem;
    }
  }
  
  .sw-feature-link {
    color: hsl(220, 70%, 50%);
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.3s ease;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  
  .sw-feature-link:hover {
    color: hsl(220, 70%, 45%);
  }
  
  @media (min-width: 768px) {
    .sw-feature-link {
      font-size: 1rem;
    }
  }
  
  #sw-industries-section {
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  @media (min-width: 640px) {
    #sw-industries-section {
      padding: 2.5rem 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-industries-section {
      padding: 3rem 2rem;
    }
  }
  
  #sw-industries-inner {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
  }
  
  #sw-industries-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 640px) {
    #sw-industries-header {
      margin-bottom: 2rem;
    }
  }
  
  #sw-industries-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(220, 30%, 15%);
    margin: 0;
    font-family: 'Playfair Display', serif;
    line-height: 1.2;
  }
  
  @media (min-width: 640px) {
    #sw-industries-title {
      font-size: 1.875rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-industries-title {
      font-size: 2.25rem;
    }
  }
  
  #sw-industries-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
  
  @media (min-width: 640px) {
    #sw-industries-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.875rem;
    }
  }
  
  @media (min-width: 1024px) {
    #sw-industries-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }
  }
  
  .sw-industry-card {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
  }
  
  @media (min-width: 640px) {
    .sw-industry-card {
      border-radius: 0.625rem;
    }
  }
  
  .sw-industry-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }
  
  .sw-industry-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .sw-industry-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
    padding: 0.75rem 0.625rem 0.625rem;
    color: #ffffff;
  }
  
  @media (min-width: 640px) {
    .sw-industry-overlay {
      padding: 1rem 0.75rem 0.75rem;
    }
  }
  
  .sw-industry-label {
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (min-width: 640px) {
    .sw-industry-label {
      font-size: 0.875rem;
    }
  }
  
  @media (min-width: 1024px) {
    .sw-industry-label {
      font-size: 0.9375rem;
    }
  }
`;

// Category definitions
const SKILLED_TRADES = [
  { id: 'electricians', label: 'Electricians', icon: Bolt, color: '#eab308' },
  { id: 'carpenters', label: 'Carpenters', icon: Hammer, color: '#d97706' },
  { id: 'plumbers', label: 'Plumbers', icon: Droplet, color: '#3b82f6' },
  { id: 'masons', label: 'Masons', icon: Building, color: '#4b5563' },
  { id: 'welders', label: 'Welders', icon: Flame, color: '#f97316' },
  { id: 'painters', label: 'Painters', icon: Paintbrush, color: '#a855f7' },
];

const PERSONAL_SERVICES = [
  { id: 'tailors', label: 'Tailors', icon: Scissors, color: '#ec4899' },
  { id: 'barbers', label: 'Barbers', icon: User, color: '#6366f1' },
  { id: 'hairdressers', label: 'Hairdressers', icon: User, color: '#f43f5e' },
  { id: 'mechanics', label: 'Auto Mechanics', icon: Wrench, color: '#475569' },
  { id: 'caterers', label: 'Caterers', icon: UtensilsCrossed, color: '#22c55e' },
  { id: 'cleaners', label: 'Cleaners', icon: Sparkles, color: '#06b6d4' },
];

const ALL_CATEGORIES = [...SKILLED_TRADES, ...PERSONAL_SERVICES];

// Industry images for the grid section
const INDUSTRY_IMAGES = [
  { id: 'electricians', url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=450&fit=crop', alt: 'Electrician at work' },
  { id: 'carpenters', url: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1764878198/7c210d59277846477cf2d897f65ef507_xvfmm2.jpg', alt: 'Carpenter crafting' },
  { id: 'plumbers', url: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1764878533/R_bulkfp.jpg', alt: 'Plumber fixing pipes' },
  { id: 'masons', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=450&fit=crop', alt: 'Mason building' },
  { id: 'welders', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=450&fit=crop', alt: 'Welder working' },
  { id: 'painters', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=450&fit=crop', alt: 'Painter applying finish' },
  { id: 'tailors', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=450&fit=crop', alt: 'Tailor sewing' },
  { id: 'barbers', url: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1764877793/young-african-american-man-visiting-barbershop_dwrst6.jpg', alt: 'Barber cutting hair' },
  { id: 'hairdressers', url: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1764878066/stylist-woman-taking-care-her-client-afro-hair_vn7c53.jpg', alt: 'Hairdresser styling' },
  { id: 'mechanics', url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop', alt: 'Auto mechanic working' },
  { id: 'caterers', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=450&fit=crop', alt: 'Caterer preparing food' },
  { id: 'cleaners', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=450&fit=crop', alt: 'Cleaner at work' },
];

// Carousel images data
const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    alt: 'Skilled electrician at work'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    alt: 'Carpenter crafting furniture'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
    alt: 'Plumber fixing pipes'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    alt: 'Mason building structure'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    alt: 'Welder working on metal'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop',
    alt: 'Painter applying finish'
  }
];

const SkilledWorkers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div id="sw-page-wrapper">
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      {/* Hero Section */}
      <div id="sw-hero-section">
        {/* Hero Main Content (Left Side) */}
        <div id="sw-hero-main">
          {/* Background Image */}
          <div id="sw-hero-bg"></div>
          
          {/* Dark Overlay */}
          <div id="sw-hero-overlay"></div>
          
          {/* Curved Bottom Edge */}
          <div id="sw-hero-curve">
            <svg
              id="sw-hero-svg"
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
          <div id="sw-carousel-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              id="sw-carousel-wrapper"
            >
              <h3 id="sw-carousel-title">Featured Workers</h3>
              <div id="sw-carousel-track">
                {CAROUSEL_IMAGES.slice(0, 4).map((image) => (
                  <div key={image.id} className="sw-carousel-item">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="sw-carousel-image"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div id="sw-hero-content">
            <div id="sw-hero-inner">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h1 
                  id="sw-hero-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Find Skilled Workers & Artisans
                </motion.h1>
                <motion.hr
                  id="sw-hero-divider"
                  initial={{ width: 0 }}
                  animate={{ width: '6.25rem' }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <motion.p 
                  id="sw-hero-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Connect with verified skilled professionals in your area. Browse by category and location to find the right person for your needs.
                </motion.p>
              </motion.div>

            </div>
          </div>
        </div>

      </div>

      {/* Category Filters Section */}
      <div id="sw-section">
        <div id="sw-section-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="sw-section-header"
          >
            <p id="sw-section-subtitle">
              Select a category to filter skilled workers and artisans
            </p>
          </motion.div>

          {/* Skilled Trades Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            id="sw-category-section"
          >
            <h3 id="sw-category-title">
              Skilled Trades
            </h3>
            <div id="sw-category-grid">
              {SKILLED_TRADES.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`sw-category-btn ${isSelected ? 'sw-category-btn-selected' : ''}`}
                  >
                    <div className="sw-category-btn-inner">
                      <div className={`sw-category-icon-wrapper ${isSelected ? 'sw-category-icon-wrapper-selected' : ''}`}>
                        <Icon
                          className="sw-category-icon"
                          style={{
                            color: isSelected ? category.color : '#9ca3af'
                          }}
                        />
                      </div>
                      <span className={`sw-category-label ${isSelected ? 'sw-category-label-selected' : ''}`}>
                        {category.label}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="sw-selected-indicator"
                      >
                        <div className="sw-selected-dot" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Personal Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="sw-category-section"
          >
            <h3 id="sw-category-title">
              Personal Services
            </h3>
            <div id="sw-category-grid-services">
              {PERSONAL_SERVICES.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`sw-category-btn ${isSelected ? 'sw-category-btn-selected' : ''}`}
                  >
                    <div className="sw-category-btn-inner">
                      <div className={`sw-category-icon-wrapper ${isSelected ? 'sw-category-icon-wrapper-selected' : ''}`}>
                        <Icon
                          className="sw-category-icon"
                          style={{
                            color: isSelected ? category.color : '#9ca3af'
                          }}
                        />
                      </div>
                      <span className={`sw-category-label ${isSelected ? 'sw-category-label-selected' : ''}`}>
                        {category.label}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="sw-selected-indicator"
                      >
                        <div className="sw-selected-dot" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Browse All Categories Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            id="sw-browse-all-wrapper"
          >
            <button
              onClick={() => navigate('/skilled-workers/browse')}
              className="sw-btn-browse"
            >
              Browse All Categories
            </button>
          </motion.div>
        </div>
      </div>

      {/* Featured Workers Carousel Section */}
      <WorkerCarousel
        title="The smartest staffing solution for your business"
        subtitle="Find, hire, and pay temporary workers"
        workers={[
          {
            id: '1',
            name: 'Michael Chen',
            title: 'Senior Software Engineer, Cloud Infrastructure',
            description: 'Working with this team completely changed our infrastructure game. The support and expertise were incredible. They delivered beyond our expectations and helped us scale to millions of users.',
            image: 'https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            githubUrl: '#',
            twitterUrl: '#',
            youtubeUrl: '#',
            linkedinUrl: '#',
          },
          {
            id: '2',
            name: 'Jessica Roberts',
            title: 'Lead Data Scientist, InsightX',
            description: 'The data analytics platform they built gave our team the confidence and tools needed for true data-driven decisions. Their dashboarding capabilities went above and beyond our expectations.',
            image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80',
            githubUrl: '#',
            twitterUrl: '#',
            youtubeUrl: '#',
            linkedinUrl: '#',
          },
          {
            id: '3',
            name: 'William Carter',
            title: 'VP Product, NovaLabs',
            description: 'NovaLabs helped our products find the perfect market fit. Their engineering team exceeded every delivery milestone and provided exceptional technical leadership.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
            githubUrl: '#',
            twitterUrl: '#',
            youtubeUrl: '#',
            linkedinUrl: '#',
          },
        ]}
      />

      {/* Trusted Brands Section */}
      <div id="sw-trusted-section">
        <div id="sw-trusted-inner">
          <div id="sw-trusted-heading">
            <h2 id="sw-trusted-title">
              <span className="sw-trusted-title-part1">Trusted nationwide by </span>
              <span className="sw-trusted-title-part2">
                <TextType
                  text={["top brands", "institutions", "communities"]}
                  typingSpeed={120}
                  pauseDuration={3000}
                  deletingSpeed={50}
                  showCursor={true}
                  cursorCharacter="|"
                  as="span"
                />
              </span>
            </h2>
          </div>
          
          <div id="sw-trusted-logos-container">
            <div id="sw-trusted-marquee-wrapper">
              <div id="sw-trusted-marquee-container">
                {/* Alternating pattern: Brand, Institution, Community */}
                {/* Set 1 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872570/OIP_uoujra.webp" alt="Unilever - Manufacturing & Construction" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379495/46600902-ca9e-407d-9392-06a45b9d9b1a.png" alt="University of Ghana" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Greater Accra</span>
                  </div>
                </div>
                {/* Set 2 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872441/R_c78wwd.jpg" alt="Coca-Cola - Manufacturing & Facilities" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png" alt="KNUST" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Ashanti</span>
                  </div>
                </div>
                {/* Set 3 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872599/OIP_vorv7r.webp" alt="Guinness - Manufacturing & Maintenance" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379582/9c190837-92c2-4230-b205-4ab9f0c8c6a1.png" alt="University of Cape Coast" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Western</span>
                  </div>
                </div>
                {/* Set 4 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872686/OIP_xhdwgc.webp" alt="Samsung - Electronics & Installation" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379384/9c8b41be-3e40-4ee3-8ae5-8951832cd82c.png" alt="GIMPA" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Eastern</span>
                  </div>
                </div>
                {/* Set 5 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872756/MTN-EYG-Logo_fjhupw.jpg" alt="MTN - Infrastructure & Construction" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379251/673184a4-9fd7-433b-b33e-ab7871fa5a1b.png" alt="University of Education, Winneba" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Central</span>
                  </div>
                </div>
                {/* Set 6 - Remaining items */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872848/bbd99004fb6d86d23948c9a4524b729c_Edited_km1ycp.jpg" alt="Telecel - Infrastructure & Maintenance" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Northern</span>
                  </div>
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872500/OIP_hrtnxv.webp" alt="Ecobank - Facilities & Construction" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Volta</span>
                  </div>
                </div>
                {/* Duplicate set for seamless loop */}
                {/* Set 1 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872570/OIP_uoujra.webp" alt="Unilever - Manufacturing & Construction" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379495/46600902-ca9e-407d-9392-06a45b9d9b1a.png" alt="University of Ghana" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Greater Accra</span>
                  </div>
                </div>
                {/* Set 2 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872441/R_c78wwd.jpg" alt="Coca-Cola - Manufacturing & Facilities" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png" alt="KNUST" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Ashanti</span>
                  </div>
                </div>
                {/* Set 3 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872599/OIP_vorv7r.webp" alt="Guinness - Manufacturing & Maintenance" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379582/9c190837-92c2-4230-b205-4ab9f0c8c6a1.png" alt="University of Cape Coast" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Western</span>
                  </div>
                </div>
                {/* Set 4 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872686/OIP_xhdwgc.webp" alt="Samsung - Electronics & Installation" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379384/9c8b41be-3e40-4ee3-8ae5-8951832cd82c.png" alt="GIMPA" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Eastern</span>
                  </div>
                </div>
                {/* Set 5 */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872756/MTN-EYG-Logo_fjhupw.jpg" alt="MTN - Infrastructure & Construction" />
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763379251/673184a4-9fd7-433b-b33e-ab7871fa5a1b.png" alt="University of Education, Winneba" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Central</span>
                  </div>
                </div>
                {/* Set 6 - Remaining items */}
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872848/bbd99004fb6d86d23948c9a4524b729c_Edited_km1ycp.jpg" alt="Telecel - Infrastructure & Maintenance" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Northern</span>
                  </div>
                </div>
                <div className="sw-trusted-logo">
                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764872500/OIP_hrtnxv.webp" alt="Ecobank - Facilities & Construction" />
                </div>
                <div className="sw-trusted-logo">
                  <div className="sw-community-logo">
                    <span className="sw-community-logo-text">Volta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streamline Staffing Section */}
      <div id="sw-streamline-section">
        <div id="sw-streamline-inner">
          <div id="sw-streamline-header">
            <h2 id="sw-streamline-title">
              Streamline your Skills in <span className="sw-streamline-title-highlight">one, simple platform</span>
            </h2>
            <p id="sw-streamline-subtitle">
              Finding skilled workers has never been easier.
            </p>
          </div>
          
          <div id="sw-streamline-features">
            {/* Post Feature */}
            <div className="sw-feature-card">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop" 
                alt="Post a position" 
                className="sw-feature-image"
              />
              <div className="sw-feature-content">
                <h3 className="sw-feature-title">Post</h3>
                <p className="sw-feature-description">
                  Create a position, location and pay rate. Post to the entire community of over 2 million workers or your selected favorites.
                </p>
                <a href="#" className="sw-feature-link">
                  See Shift Management →
                </a>
              </div>
            </div>
            
            {/* Hire Feature */}
            <div className="sw-feature-card">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" 
                alt="Hire workers" 
                className="sw-feature-image"
              />
              <div className="sw-feature-content">
                <h3 className="sw-feature-title">Hire</h3>
                <p className="sw-feature-description">
                  Select the candidates who best fit your needs or let Smart Hire our AI-powered hiring system select for you.
                </p>
                <a href="#" className="sw-feature-link">
                  See Smart Hire →
                </a>
              </div>
            </div>
            
            {/* Pay Feature */}
            <div className="sw-feature-card">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" 
                alt="Pay workers" 
                className="sw-feature-image"
              />
              <div className="sw-feature-content">
                <h3 className="sw-feature-title">Pay</h3>
                <p className="sw-feature-description">
                  Once the shift is completed simply approve or modify the time sheet. GigSmart for Business handles payment on your behalf.
                </p>
                <a href="#" className="sw-feature-link">
                  See Payments →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {selectedCategory && (
        <div id="sw-results">
          <div id="sw-results-inner">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              id="sw-results-content"
            >
              <p id="sw-results-text">
                Showing results for: <strong>
                  {ALL_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </strong>
              </p>
              <p id="sw-results-subtext">
                Worker directory will be displayed here
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Industries Grid Section */}
      <div id="sw-industries-section">
        <div id="sw-industries-inner">
          <div id="sw-industries-header">
            <h2 id="sw-industries-title">
              Every industry, any role - We've got it
            </h2>
          </div>
          <div id="sw-industries-grid">
            {ALL_CATEGORIES.map((category) => {
              const industryImage = INDUSTRY_IMAGES.find(img => img.id === category.id);
              return (
                <div
                  key={category.id}
                  className="sw-industry-card"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <img
                    src={industryImage?.url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=450&fit=crop'}
                    alt={industryImage?.alt || category.label}
                    className="sw-industry-image"
                  />
                  <div className="sw-industry-overlay">
                    <p className="sw-industry-label">{category.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SkilledWorkers;

