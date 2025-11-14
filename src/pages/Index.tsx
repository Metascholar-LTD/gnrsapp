import { Spinner } from "@/components/Spinner";
import { Navigation } from "@/components/Navigation";
import { Carousel } from "@/components/Carousel";
import { About } from "@/components/About";
import { Statistics } from "@/components/Statistics";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ImageGallery } from "@/components/ImageGallery";
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
      <ImageGallery />
      <Projects />
      <Footer />
    </>
  );
};

export default Index;
