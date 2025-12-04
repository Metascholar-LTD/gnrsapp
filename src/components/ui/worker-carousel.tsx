"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Twitter,
  Youtube,
  Linkedin,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkerProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  githubUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

interface WorkerCarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle: string;
  workers: WorkerProfile[];
  onTakeTour?: () => void;
  onCreateAccount?: () => void;
  className?: string;
}

export const WorkerCarousel = React.forwardRef<HTMLDivElement, WorkerCarouselProps>(
  ({ title, subtitle, workers, className, onTakeTour, onCreateAccount, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = useCallback(() => {
      setCurrentIndex((index) => (index + 1) % workers.length);
    }, [workers.length]);
    
    const handlePrevious = useCallback(() => {
      setCurrentIndex((index) => (index - 1 + workers.length) % workers.length);
    }, [workers.length]);

    // Auto-rotate every 5 seconds
    useEffect(() => {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(timer);
    }, [handleNext]);

    const currentWorker = workers[currentIndex];

    const socialIcons = [
      { icon: Github, url: currentWorker.githubUrl, label: "GitHub" },
      { icon: Twitter, url: currentWorker.twitterUrl, label: "Twitter" },
      { icon: Youtube, url: currentWorker.youtubeUrl, label: "YouTube" },
      { icon: Linkedin, url: currentWorker.linkedinUrl, label: "LinkedIn" },
    ];

    const mobileStyles = `
      /* Mobile: 0px - 767px - Using meta-consult breakpoints */
      @media (max-width: 767px) {
        .wc-mobile-container {
          padding-top: 3rem !important;
          padding-bottom: 3rem !important;
        }
        
        .wc-mobile-content {
          padding-left: 1.5rem !important;
          padding-right: 1.5rem !important;
          gap: 2rem !important;
        }
        
        .wc-mobile-left {
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        
        .wc-mobile-buttons {
          width: 100% !important;
          gap: 1rem !important;
        }
        
        .wc-mobile-button-tour {
          width: auto !important;
          align-self: flex-start !important;
        }
        
        .wc-mobile-button-create {
          width: 100% !important;
          font-size: 0.875rem !important;
          padding: 0.875rem 1.5rem !important;
        }
        
        .wc-mobile-title {
          font-size: 2rem !important;
          line-height: 1.2 !important;
        }
        
        .wc-mobile-subtitle {
          font-size: 1rem !important;
          line-height: 1.5 !important;
        }
        
        .wc-mobile-carousel-wrapper {
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin-top: 2rem !important;
        }
        
        .wc-mobile-avatar {
          margin-bottom: 1.5rem !important;
          border-radius: 1.5rem !important;
        }
        
        .wc-mobile-card {
          padding: 1.5rem !important;
        }
        
        .wc-mobile-card-title {
          font-size: 1.25rem !important;
          line-height: 1.3 !important;
          margin-bottom: 0.5rem !important;
        }
        
        .wc-mobile-card-subtitle {
          font-size: 0.875rem !important;
          line-height: 1.4 !important;
          margin-bottom: 1rem !important;
        }
        
        .wc-mobile-card-text {
          font-size: 0.9375rem !important;
          line-height: 1.6 !important;
          margin-bottom: 1.5rem !important;
        }
        
        .wc-mobile-dots {
          margin-top: 1.5rem !important;
          padding-left: 1.5rem !important;
          padding-right: 1.5rem !important;
        }
        
        .wc-mobile-social-icons {
          gap: 0.75rem !important;
        }
        
        .wc-mobile-social-icon {
          width: 2.5rem !important;
          height: 2.5rem !important;
        }
      }
      
      /* Desktop: 768px+ - Make CREATE A FREE ACCOUNT button more compact */
      @media (min-width: 768px) {
        .wc-mobile-button-create {
          font-size: 0.875rem !important;
          padding: 0.625rem 1.25rem !important;
          gap: 0.5rem !important;
        }
        
        .wc-mobile-button-create svg {
          width: 1rem !important;
          height: 1rem !important;
        }
      }
    `;

    return (
      <React.Fragment>
        {/* Mobile-specific styles using meta-consult breakpoints: Mobile: 0-767px */}
        <style>{mobileStyles}</style>
        
        <div
          ref={ref}
          className={cn(
            'relative w-full py-16 md:py-24 flex items-center bg-white overflow-x-visible wc-mobile-container',
            className
          )}
          {...props}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" aria-hidden="true">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="z-10 flex w-full flex-col lg:flex-row items-start gap-8 lg:gap-12 pl-8 md:pl-12 lg:pl-20 xl:pl-24 2xl:pl-32 pr-0 wc-mobile-content">
          {/* Left Section - Text and Buttons */}
          <div className="flex flex-col items-start text-left space-y-6 lg:max-w-lg lg:flex-shrink-0 wc-mobile-left">
            {/* Buttons Section */}
            <div className="w-full flex flex-col sm:flex-row gap-4 wc-mobile-buttons">
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 wc-mobile-button-tour"
                onClick={onTakeTour}
              >
                Take a tour
              </Button>
            </div>

            {/* Header Section */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-blue-600 leading-tight wc-mobile-title">
                {title}
              </h2>
              <p className="text-lg md:text-xl text-slate-900 max-w-xl wc-mobile-subtitle">
                {subtitle}
              </p>
            </div>

            {/* Create Account Button */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-base flex items-center gap-2 shadow-lg wc-mobile-button-create"
              onClick={onCreateAccount}
            >
              <UserPlus className="w-5 h-5" />
              CREATE A FREE ACCOUNT
            </Button>
          </div>

          {/* Right Section - Carousel */}
          <div className="flex-1 w-full lg:w-auto lg:ml-auto lg:max-w-none wc-mobile-carousel-wrapper">
            <div className={cn("w-full lg:pr-8 xl:pr-12 2xl:pr-16")}>
              {/* Desktop layout */}
              <div className='hidden md:flex relative items-start lg:justify-end'>
                {/* Avatar */}
                <div className='w-[350px] h-[350px] rounded-3xl overflow-hidden bg-gray-200 flex-shrink-0'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentWorker.image}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className='w-full h-full'
                    >
                      <img
                        src={currentWorker.image}
                        alt={currentWorker.name}
                        className='w-full h-full object-cover'
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Card */}
                <div className='bg-white rounded-3xl shadow-2xl p-6 ml-[-60px] z-10 max-w-xl self-start mt-12'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentWorker.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className='mb-4'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                          {currentWorker.name}
                        </h2>

                        <p className='text-sm font-medium text-gray-700 dark:text-gray-500'>
                          {currentWorker.title}
                        </p>
                      </div>

                      <p className='text-black dark:text-white text-base leading-relaxed mb-6'>
                        {currentWorker.description}
                      </p>

                      <div className='flex space-x-4'>
                        {socialIcons.map(({ icon: IconComponent, url, label }) => (
                          <a
                            key={label}
                            href={url || "#"}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 cursor-pointer'
                            aria-label={label}
                          >
                            <IconComponent className='w-4 h-4 text-white dark:text-gray-900' />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile layout */}
              <div className='md:hidden max-w-sm mx-auto text-center bg-transparent'>
                {/* Avatar */}
                <div className='w-full aspect-square bg-gray-200 rounded-3xl overflow-hidden mb-6 wc-mobile-avatar'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentWorker.image}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className='w-full h-full'
                    >
                      <img
                        src={currentWorker.image}
                        alt={currentWorker.name}
                        className='w-full h-full object-cover'
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Card content */}
                <div className='px-4 wc-mobile-card'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentWorker.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2 wc-mobile-card-title'>
                        {currentWorker.name}
                      </h2>
                      
                      <p className='text-sm font-medium text-gray-600 dark:text-gray-300 mb-4 wc-mobile-card-subtitle'>
                        {currentWorker.title}
                      </p>
                      
                      <p className='text-black dark:text-white text-sm leading-relaxed mb-6 wc-mobile-card-text'>
                        {currentWorker.description}
                      </p>
                      
                      <div className='flex justify-center space-x-4 wc-mobile-social-icons'>
                        {socialIcons.map(({ icon: IconComponent, url, label }) => (
                          <a
                            key={label}
                            href={url || "#"}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer wc-mobile-social-icon'
                            aria-label={label}
                          >
                            <IconComponent className='w-4 h-4 text-white dark:text-gray-900' />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Dots navigation */}
              <div className='flex justify-center items-center gap-2 mt-8 wc-mobile-dots'>
                {workers.map((_, workerIndex) => (
                  <button
                    key={workerIndex}
                    onClick={() => setCurrentIndex(workerIndex)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors cursor-pointer",
                      workerIndex === currentIndex
                        ? "bg-gray-900"
                        : "bg-gray-400"
                    )}
                    aria-label={`Go to worker ${workerIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
);

WorkerCarousel.displayName = 'WorkerCarousel';
