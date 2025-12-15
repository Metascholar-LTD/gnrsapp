import { Navigation } from "@/components/Navigation";
import { Carousel } from "@/components/Carousel";
import { About } from "@/components/About";
import { Statistics } from "@/components/Statistics";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { EducationHubSummary } from "@/components/EducationHubSummary";
import { ImageGallery } from "@/components/ImageGallery";
import { SkilledWorkersSummary } from "@/components/SkilledWorkersSummary";
import { DirectoriesSummary } from "@/components/DirectoriesSummary";
import { DatasetSummary } from "@/components/DatasetSummary";
import { HomeFAQs } from "@/components/HomeFAQs";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";

const Index = () => {
  return (
    <>
      <InitScripts />
      <Navigation />
      <Carousel />
      <About />
      <Statistics />
      <Services />
      <WhyChooseUs />
      <EducationHubSummary />
      <ImageGallery />
      <SkilledWorkersSummary />
      <Projects />
      <DirectoriesSummary />
      <DatasetSummary />
      <HomeFAQs />
      <Footer />
    </>
  );
};

export default Index;
