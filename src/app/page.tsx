import GradientButton from '@/components/ui/gradientButton';

export default function Home() {
  return (
    <div className="bg-white min-h-screen" style={{ scrollBehavior: 'smooth' }}>
      {/* Home Section */}
      <section id="home" className="h-screen w-screen flex items-center px-8 md:px-16 lg:px-24 relative overflow-hidden bg-white pt-16">
        {/* Subtle dotted background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-8 h-full w-full p-4">
            {Array.from({ length: 200 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 relative z-10">
          <h1 className="text-gray-900 font-bold leading-tight tracking-tight">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Extract{' '}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-6 py-2 rounded-3xl inline-block">
                Custom
              </span>{' '}
              Data from PDFs<br />
              into Excel Format
            </div>
          </h1>

          <p className="text-gray-600 text-lg mt-6 mb-8 max-w-xl">
            Transform unstructured PDF data into organized Excel spreadsheets with AI-powered precision.
          </p>

          <GradientButton href="/product" className="mt-8" requireAuth={true}>
            Start Extracting →
          </GradientButton>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="min-h-screen bg-gray-50 flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">About Us</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're passionate about making data extraction simple and efficient. 
            Our AI-powered platform helps businesses transform unstructured PDF data 
            into organized Excel formats, saving time and reducing errors.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen bg-white flex items-center justify-center px-8 py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Pricing</h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl hover:border-blue-500 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Starter</h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">$29<span className="text-lg text-gray-600">/mo</span></p>
              <p className="text-gray-600 mb-6">Perfect for individuals</p>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-600">✓ 100 PDFs per month</li>
                <li className="text-gray-600">✓ Basic extraction</li>
                <li className="text-gray-600">✓ Email support</li>
              </ul>
              <button className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white transform scale-105 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Professional</h3>
              <p className="text-4xl font-bold mb-2">$99<span className="text-lg opacity-90">/mo</span></p>
              <p className="opacity-90 mb-6">For growing teams</p>
              <ul className="space-y-3 mb-8">
                <li>✓ 1,000 PDFs per month</li>
                <li>✓ Advanced AI extraction</li>
                <li>✓ Priority support</li>
                <li>✓ Custom templates</li>
              </ul>
              <button className="w-full py-3 px-6 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Get Started
              </button>
            </div>

            <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl hover:border-blue-500 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">Custom</p>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-600">✓ Unlimited PDFs</li>
                <li className="text-gray-600">✓ Custom AI models</li>
                <li className="text-gray-600">✓ Dedicated support</li>
                <li className="text-gray-600">✓ API access</li>
              </ul>
              <button className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="min-h-screen bg-gray-50 flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">
              Ready to transform your data extraction process? Get in touch with our team.
            </p>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-900 font-medium mb-2 text-sm">Name</label>
                <input 
                  className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                  type="text" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2 text-sm">Email</label>
                <input 
                  className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                  type="email" 
                  placeholder="your@email.com" 
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2 text-sm">Message</label>
                <textarea 
                  className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg h-32 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" 
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}