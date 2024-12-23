export default function PersonalInformation() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Personal Information</h1>
        <p className="mb-4">
          At DG Electronics, we take your personal information seriously. This page outlines how we collect, use, and protect your personal data.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">What information do we collect?</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Name and contact information</li>
          <li>Billing and shipping addresses</li>
          <li>Payment information</li>
          <li>Purchase history</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6 mb-4">How do we use your information?</h2>
        <p className="mb-4">
          We use your personal information to process orders, provide customer support, and improve our services. We do not sell or share your information with third parties for marketing purposes.
        </p>
        <p className="mt-6 text-sm text-gray-600">
          For more detailed information, please refer to our full Privacy Policy.
        </p>
      </div>
    )
  }
  
  