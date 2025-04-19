import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

const AboutUs = () => {
  return (
    <section className="bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div
        className="text-center py-20 bg-cover bg-center bg-black text-white"
        style={{ backgroundImage: "url('/angulilekha-hero.jpg')" }}
      >
        <h1 className="text-4xl md:text-6xl font-bold">About Us</h1>
        <p className="mt-4 text-gray-300">Home / About Us</p>
      </div>

      {/* Intro Section */}
      <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto px-6 py-20 items-center">
        <img
          src="/angulilekha-editor.jpg"
          alt="AnguliLekha in action"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="md:w-1/2">
          <h3 className="uppercase text-sm text-gray-500 mb-2">
            About AnguliLekha
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bridging Communication Gaps <br /> with Technology
          </h2>
          <p className="text-gray-700 mb-6">
            AnguliLekha is an innovative platform that enables real-time Indian
            Sign Language (ISL) recognition through advanced computer vision and
            machine learning. Our mission is to empower the deaf and
            hard-of-hearing community by making digital communication seamless,
            accessible, and inclusive.
          </p>
          <button className="bg-black text-white px-6 py-2 rounded-[4px] font-medium hover:bg-gray-800">
            Learn More
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-gray-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Our Capabilities</h3>
          <p className="text-gray-600 mb-10">
            Powered by AI and backed by extensive research in sign language
            processing, AnguliLekha offers:
          </p>

          <div className="space-y-6">
            {[
              { title: "Real-time ISL Gesture Recognition", value: 95 },
              { title: "Accurate Sign Translation", value: 90 },
              { title: "User-Friendly Learning Modules", value: 88 },
            ].map((skill) => (
              <div key={skill.title}>
                <div className="flex justify-between mb-1 text-sm text-gray-500 max-w-[50%]">
                  <span>{skill.title}</span>
                  <span>{skill.value}%</span>
                </div>
                <div className="w-1/2 bg-gray-300 rounded h-2">
                  <div
                    className="bg-black h-2 rounded"
                    style={{ width: `${skill.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-16 text-gray-800">
            <div>
              <h4 className="text-3xl font-bold">2024</h4>
              <p className="text-sm mt-2">Project Started</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold">4+</h4>
              <p className="text-sm mt-2">Core Contributors</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold">1000+</h4>
              <p className="text-sm mt-2">Signs Trained</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold">∞</h4>
              <p className="text-sm mt-2">Potential Impact</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-black h-[400px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-sm mb-2 uppercase">Get Involved</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Help Us Build a More Inclusive Future
          </h2>
          <button className="mt-6 bg-white text-black px-6 py-2 rounded-[4px] font-medium hover:bg-gray-200 transition">
            Join the Movement
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </section>
  );
};

export default AboutUs;
