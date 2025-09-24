import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <Header />
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="prose lg:prose-lg max-w-none text-slate-700 space-y-4">
            <p>This is a placeholder for your terms of service. This agreement sets the rules and guidelines that users must agree to in order to use your app.</p>
            <h2 className="text-2xl font-bold text-slate-800">1. Accounts</h2>
            <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            <h2 className="text-2xl font-bold text-slate-800">2. Intellectual Property</h2>
            <p>The Service and its original content, features and functionality are and will remain the exclusive property of Collabriss and its licensors.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}