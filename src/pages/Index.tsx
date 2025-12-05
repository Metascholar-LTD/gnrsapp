import { Spinner } from "@/components/Spinner";
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
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";

const Index = () => {
  return (
    <>
      <InitScripts />
      <Spinner />
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
      <Footer />
    </>
  );
};

export default Index;
