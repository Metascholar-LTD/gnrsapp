"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- Component Props & Data Types ---

interface ProcessStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  duration: string;
  image: string; // URL to the image for the phone mockup
}

interface QuantumTimelineProps {
  steps?: ProcessStep[];
  defaultStep?: string;
}

// --- Main Timeline Component ---

export const QuantumTimeline = ({ steps = [], defaultStep }: QuantumTimelineProps) => {
  const [activeStep, setActiveStep] = useState(defaultStep || steps[0]?.id);

  const activeStepData = steps.find(step => step.id === activeStep);
  const activeIndex = steps.findIndex(step => step.id === activeStep);

  if (!steps.length || !activeStepData) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 font-sans bg-white dark:bg-black rounded-2xl shadow-2xl" style={{ backgroundColor: 'hsl(40 33% 96%)' }}>
      {/* Top Navigation */}
      <TimelineNav steps={steps} activeStep={activeStep} onStepClick={setActiveStep} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeStepData && (
          <motion.div
            key={activeStepData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid md:grid-cols-2 gap-12"
          >
            <TimelineContent step={activeStepData} />
            <TimelinePhoneMockup image={activeStepData.image} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Timeline */}
      <BottomTimeline steps={steps} activeIndex={activeIndex} onStepClick={setActiveStep} />
    </div>
  );
};

// --- Sub-components ---

const TimelineNav = ({ steps, activeStep, onStepClick }: { steps: ProcessStep[], activeStep: string, onStepClick: (id: string) => void }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center font-bold">E</div>
      <span className="text-xl font-bold text-slate-800 dark:text-white">Education Hub</span>
    </div>
    <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
      {steps.map(step => (
        <button
          key={step.id}
          onClick={() => onStepClick(step.id)}
          className={cn(
            "px-4 py-1 rounded-full text-sm font-semibold transition-colors",
            activeStep === step.id
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700"
          )}
        >
          {step.id}
        </button>
      ))}
    </div>
  </div>
);

const TimelineContent = ({ step }: { step: ProcessStep }) => (
  <div>
    <span className="text-sm font-bold text-blue-500">{step.id}</span>
    <h2 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{step.title}</h2>
    <p className="mt-1 text-slate-600 dark:text-slate-400">{step.subtitle}</p>
    <p className="mt-4 text-slate-700 dark:text-slate-300">{step.description}</p>
    <div className="mt-6 grid sm:grid-cols-2 gap-4">
      {step.details.map((detail, i) => (
        <div 
          key={i} 
          className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:shadow-md hover:scale-[1.02] group"
        >
          <div className="w-6 h-6 bg-green-500/10 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm transition-all duration-300 group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30 group-hover:scale-110">✓</div>
          <span className="text-base font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{detail}</span>
        </div>
      ))}
    </div>
  </div>
);

const TimelinePhoneMockup = ({ image }: { image: string }) => (
  <div className="flex items-center justify-center">
    <div 
      className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] shadow-2xl"
      style={{
        width: '280px',
        height: '600px',
        padding: '5px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
      }}
    >
      {/* Dynamic Island */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 z-10"
        style={{
          top: '20px',
          width: '110px',
          height: '30px',
          backgroundColor: '#000000',
          borderRadius: '19px',
          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)',
        }}
      />
      
      {/* Screen */}
      <div 
        className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative"
        style={{
          width: 'calc(100% - 10px)',
          height: 'calc(100% - 10px)',
          margin: '5px',
        }}
      >
        <img 
          src={image} 
          alt="Education Resource" 
          className="w-full h-full object-cover" 
          style={{
            objectPosition: 'center',
          }}
        />
        
        {/* Screen reflection overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }}
        />
      </div>
      
      {/* Home indicator */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 z-10"
        style={{
          bottom: '12px',
          width: '134px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '3px',
        }}
      />
    </div>
  </div>
);

const BottomTimeline = ({ steps, activeIndex, onStepClick }: { steps: ProcessStep[], activeIndex: number, onStepClick: (id: string) => void }) => (
  <div className="mt-16">
    <div className="relative w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full">
      <motion.div
        className="absolute h-1 bg-blue-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-4 h-4 -top-1.5 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"
        initial={{ left: '0%' }}
        animate={{ left: `calc(${(activeIndex / (steps.length - 1)) * 100}% - 8px)` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
    <div className="mt-4 flex justify-between">
      {steps.map((step, i) => (
        <button key={step.id} onClick={() => onStepClick(step.id)} className="text-center w-1/4">
          <span className={cn(
            "text-sm font-semibold transition-colors",
            i <= activeIndex ? "text-blue-500" : "text-slate-500 dark:text-slate-400"
          )}>
            {step.id}
          </span>
          <p className={cn(
            "text-xs mt-1 transition-colors",
            i <= activeIndex ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
          )}>
            {step.title.split(' ')[0]}
          </p>
        </button>
      ))}
    </div>
  </div>
);

