import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Briefcase, User, Check } from "lucide-react";
import { motion } from "framer-motion";

const isolatedStyles = `
  #swj-page-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #swj-main-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    min-height: calc(100vh - 200px);
  }

  @media (min-width: 640px) {
    #swj-main-content {
      padding: 3rem 1.5rem;
    }
  }

  #swj-container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }

  #swj-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 3rem 0;
    text-align: center;
    font-family: 'Playfair Display', serif;
    line-height: 1.2;
  }

  @media (min-width: 640px) {
    #swj-title {
      font-size: 2.5rem;
    }
  }

  @media (min-width: 1024px) {
    #swj-title {
      font-size: 3rem;
    }
  }

  #swj-cards-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  @media (min-width: 640px) {
    #swj-cards-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }

  .swj-role-card {
    position: relative;
    padding: 2.5rem 2rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    background-color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 280px;
  }

  @media (min-width: 640px) {
    .swj-role-card {
      padding: 3rem 2.5rem;
      min-height: 320px;
    }
  }

  .swj-role-card:hover {
    border-color: #2563eb;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
    transform: translateY(-4px);
  }

  .swj-role-card.selected {
    border-color: #2563eb;
    border-width: 3px;
    background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    box-shadow: 0 12px 32px rgba(37, 99, 235, 0.2);
  }

  .swj-radio-button {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    width: 24px;
    height: 24px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    background-color: #ffffff;
  }

  .swj-role-card.selected .swj-radio-button {
    border-color: #2563eb;
    background-color: #2563eb;
  }

  .swj-radio-dot {
    width: 10px;
    height: 10px;
    background-color: #ffffff;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .swj-role-card.selected .swj-radio-dot {
    opacity: 1;
  }

  .swj-icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 1rem;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }

  @media (min-width: 640px) {
    .swj-icon-wrapper {
      width: 100px;
      height: 100px;
    }
  }

  .swj-role-card.selected .swj-icon-wrapper {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    transform: scale(1.05);
  }

  .swj-icon {
    width: 48px;
    height: 48px;
    color: #6b7280;
    transition: color 0.3s ease;
  }

  @media (min-width: 640px) {
    .swj-icon {
      width: 56px;
      height: 56px;
    }
  }

  .swj-role-card.selected .swj-icon {
    color: #2563eb;
  }

  .swj-role-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
    line-height: 1.5;
    transition: color 0.3s ease;
  }

  @media (min-width: 640px) {
    .swj-role-text {
      font-size: 1.25rem;
    }
  }

  .swj-role-card.selected .swj-role-text {
    color: #2563eb;
  }

  #swj-action-button {
    width: 100%;
    padding: 1rem 2rem;
    background-color: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'DM Sans', system-ui, sans-serif;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  @media (min-width: 640px) {
    #swj-action-button {
      padding: 1.25rem 2.5rem;
      font-size: 1.25rem;
    }
  }

  #swj-action-button:hover {
    background-color: #1d4ed8;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }

  #swj-action-button:active {
    transform: translateY(0);
  }

  #swj-action-button:disabled {
    background-color: #d1d5db;
    color: #ffffff;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  #swj-login-link {
    text-align: center;
    font-size: 0.9375rem;
    color: #6b7280;
  }

  #swj-login-link a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }

  #swj-login-link a:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

type RoleType = 'employer' | 'worker' | null;

const SkilledWorkersJoin = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);

  // Prevent body scroll if needed
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleRoleSelect = (role: 'employer' | 'worker') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    // Navigate to join page with role information
    navigate('/join', {
      state: {
        role: selectedRole,
        from: '/skilled-workers/browse'
      }
    });
  };

  const getButtonText = () => {
    if (!selectedRole) return 'Select a role to continue';
    if (selectedRole === 'employer') return 'Apply as an Employer';
    return 'Apply as a Skilled Worker';
  };

  return (
    <div id="swj-page-wrapper">
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />

      <div id="swj-main-content">
        <div id="swj-container">
          <motion.h1
            id="swj-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join as an employer or skilled worker
          </motion.h1>

          <div id="swj-cards-container">
            {/* Employer Card */}
            <motion.div
              className={`swj-role-card ${selectedRole === 'employer' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('employer')}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="swj-radio-button">
                <div className="swj-radio-dot"></div>
              </div>
              <div className="swj-icon-wrapper">
                <Briefcase className="swj-icon" />
              </div>
              <p className="swj-role-text">
                I'm an employer, hiring for a project
              </p>
            </motion.div>

            {/* Skilled Worker Card */}
            <motion.div
              className={`swj-role-card ${selectedRole === 'worker' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('worker')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="swj-radio-button">
                <div className="swj-radio-dot"></div>
              </div>
              <div className="swj-icon-wrapper">
                <User className="swj-icon" />
              </div>
              <p className="swj-role-text">
                I'm a skilled worker, looking for work
              </p>
            </motion.div>
          </div>

          <motion.button
            id="swj-action-button"
            onClick={handleContinue}
            disabled={!selectedRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {getButtonText()}
          </motion.button>

          <motion.p
            id="swj-login-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Already have an account? <Link to="/join">Log In</Link>
          </motion.p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SkilledWorkersJoin;

