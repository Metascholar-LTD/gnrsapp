import VerifiedJobListingsManager from "./VerifiedJobListingsManager";

// AllJobsManager uses VerifiedJobListingsManager but loads all jobs (verified and unverified)
const AllJobsManager = () => {
  // We can extend this later to show unverified jobs too
  // For now, it uses the same component which can be modified to show all jobs
  return <VerifiedJobListingsManager />;
};

export default AllJobsManager;

