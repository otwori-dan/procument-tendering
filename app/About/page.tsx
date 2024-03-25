"use client"
// pages/about.tsx

import Layout from '@/components/Layout';

const AboutPage: React.FC = () => {
    const randomTeamMembers = [
        {
          name: "John Doe",
          description: "I am a passionate individual with a strong background in web development and design. I am committed to delivering high-quality work and ensuring customer satisfaction."
        },
        {
          name: "Jane Smith",
          description: "I have extensive experience in project management and business development. I am dedicated to fostering strong client relationships and driving business growth."
        },
        {
          name: "Michael Johnson",
          description: "I am a creative thinker with a keen eye for detail. I am committed to delivering innovative solutions and exceeding customer expectations."
        },
        // Add more team members as needed
      ];
      
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <p className="text-base text-gray-700 dark:text-gray-300">
            We are a dedicated team committed to providing high-quality products/services to our customers. 
            Our mission is to deliver innovative solutions and exceed customer expectations.
          </p>
        </div>

        <div className="mb-8">
  <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {randomTeamMembers.map((member, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
        <p className="text-base text-gray-700 dark:text-gray-300">{member.description}</p>
      </div>
    ))}
  </div>
</div>


        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300">
            <li>Customer Satisfaction</li>
            <li>Innovation</li>
            <li>Integrity</li>
            {/* Add more values as needed */}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
