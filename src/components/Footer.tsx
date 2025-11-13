export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">AI.Tech</h3>
            <p className="text-primary-foreground/80">
              Empowering businesses with intelligent solutions
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-primary-foreground/80">
              © 2024 AI.Tech. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
