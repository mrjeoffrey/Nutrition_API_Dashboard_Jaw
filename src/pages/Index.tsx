
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import FoodSearchbar from "@/components/FoodSearchbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-bg py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                The Nutrition Data API for Developers
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Access comprehensive nutrition data for your applications with our
                robust, developer-friendly API.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-brand-600 hover:bg-gray-100">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button size="lg" className="w-full sm:w-auto" variant="outline">
                    Explore Documentation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Try Our Food Search</h3>
              <FoodSearchbar />
              <div className="mt-4 text-sm text-gray-200">
                Enter a food item like "apple" or "chicken breast" to see nutrition data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Developers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to integrate nutrition data into your applications
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Extensive Food Database"
              description="Access nutrition data for thousands of foods, including branded and generic items."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Barcode Scanning"
              description="Quickly retrieve nutrition information by scanning product barcodes."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="RESTful API"
              description="Simple and intuitive RESTful API with comprehensive documentation."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Developer Dashboard"
              description="Monitor API usage, manage keys, and access detailed analytics."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Flexible Plans"
              description="Choose the subscription plan that best fits your project's needs and scale."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="USDA Food Data"
              description="Access to the USDA Food Data Central database for comprehensive nutrition information."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Developers Worldwide</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of developers building with NutriVerse API
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-brand-600">5,000+</p>
              <p className="text-gray-600 mt-2">Developers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-600">100M+</p>
              <p className="text-gray-600 mt-2">API Requests / Month</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-600">50,000+</p>
              <p className="text-gray-600 mt-2">Food Items</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-600">99.9%</p>
              <p className="text-gray-600 mt-2">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-20">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Ready to get started with NutriVerse API?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-brand-100">
                  Create a free account to start exploring our API. No credit card required.
                </p>
              </div>
              <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                <div className="sm:flex">
                  <div className="mt-4 sm:mt-0 w-full">
                    <Link to="/signup" className="w-full block">
                      <Button size="lg" className="w-full bg-white text-brand-600 hover:bg-gray-100">
                        Sign Up for Free
                      </Button>
                    </Link>
                  </div>
                </div>
                <p className="mt-3 text-sm text-brand-100">
                  Get 100 API calls per day with our free plan. 
                  <Link to="/pricing" className="font-medium text-white"> See all pricing options</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
