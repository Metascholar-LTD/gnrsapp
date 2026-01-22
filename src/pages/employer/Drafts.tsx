import React from 'react';
import AllJobs from './AllJobs';

const Drafts: React.FC = () => {
  return <AllJobs showDraftsOnly={true} />;
};

export default Drafts;
