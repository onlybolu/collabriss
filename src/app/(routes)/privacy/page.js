import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <Header />
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="prose lg:prose-lg max-w-none text-slate-700 space-y-4">
            <p>This is a placeholder for your privacy policy. It&apos;s important to have a clear and comprehensive privacy policy that informs your users how you collect, use, and protect their data.</p>
            <h2 className="text-2xl font-bold text-slate-800">Information We Collect</h2>
            <p>Describe the types of information you collect, such as personal identification information (name, email address, phone number, etc.), business data (sales, inventory), and usage data.</p>
            <h2 className="text-2xl font-bold text-slate-800">How We Use Your Information</h2>
            <p>Explain why you collect this information. For example, to provide and maintain your service, to notify you about changes, to provide customer support, to gather analysis to improve your service, etc.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

