import Link from 'next/link';
import FacebookIcon from '@/app/components/icons/FacebookIcon';
import LinkedInIcon from '@/app/components/icons/LinkedInIcon';
import TwitterIcon from '@/app/components/icons/TwitterIcon';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-slate-600 hover:text-[#2EBF83]">Features</a></li>
              <li><a href="#pricing" className="text-slate-600 hover:text-[#2EBF83]">Pricing</a></li>
              <li><a href="#faq" className="text-slate-600 hover:text-[#2EBF83]">FAQ</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-slate-600 hover:text-[#2EBF83]">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-600 hover:text-[#2EBF83]">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#2EBF83]">Privacy Policy</Link></li>
              <li><Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#2EBF83]">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-slate-500 hover:text-[#2EBF83]"><TwitterIcon className="w-6 h-6" /></a>
              <a href="#" aria-label="Facebook" className="text-slate-500 hover:text-[#2EBF83]"><FacebookIcon className="w-6 h-6" /></a>
              <a href="#" aria-label="LinkedIn" className="text-slate-500 hover:text-[#2EBF83]"><LinkedInIcon className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-slate-500 mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Collabriss. All rights reserved.</p>
          <p className="text-slate-500">
            Powered by{' '}
            <a
              href="https://inovareun.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-600 hover:text-[#2EBF83]"
            >
              Inovareun
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}