"use client";
import Layout from '@/components/Layout';

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <p className="text-base text-gray-700 dark:text-gray-300">
            For inquiries, you can visit us at our Nakuru location:
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-4">Nakuru Office</p>
          <p className="text-base text-gray-700 dark:text-gray-300">123 Nakuru Street</p>
          <p className="text-base text-gray-700 dark:text-gray-300">Nakuru, Kenya</p>
        </div>

        <div className="mb-8">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.801607168982!2d35.9646798738757!3d-0.16584053542556562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1829f6f2d8d061fd%3A0xf5c6ed1c10a7a362!2skabarak%20main%20gate!5e0!3m2!1sen!2ske!4v1707329127802!5m2!1sen!2ske"   width="100%"
            height="450" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
