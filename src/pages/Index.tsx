import { Spinner } from "@/components/Spinner";
import { Navigation } from "@/components/Navigation";
import { Carousel } from "@/components/Carousel";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
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
      <Services />
      <Projects />
      <Footer />
    </>
  );
};

export default Index;
