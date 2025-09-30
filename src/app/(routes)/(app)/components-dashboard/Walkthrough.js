'use client';

import { useEffect, useCallback, useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const Walkthrough = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
   const { showWalkthrough, setShowWalkthrough } = useAppContext();

  // Effect to track window size and determine if the view is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize(); // Check on initial render
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getSteps = useCallback(() => {
    const commonSteps = [
      {
        popover: {
          title: 'Welcome to Your Dashboard!',
          description: `
            <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&q=80" alt="Welcome" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Let's take a quick tour to see how everything works. This will help you get started with Collabriss.</p>
          `,
        },
      },
      {
        element: '#business-overview',
        popover: {
          title: 'Your Business Overview',
          description: `
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80" alt="Business Overview" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>This is where you'll find key metrics like total sales and orders at a glance. Keep an eye on your growth here!</p>
          `,
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#todo-list',
        popover: {
          title: 'Your Setup Guide',
          description: `
            <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG8lMjBkbyUyMGxpc3R8ZW58MHx8MHx8fDA%3D" alt="To-do List" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Follow these simple steps in your to-do list to get your store up and running in no time.</p>
          `,
          side: isMobile ? 'top' : 'bottom',
          align: 'start',
        },
      },
      {
        element: '#quick-actions',
        popover: {
          title: 'Quick Actions',
          description: `
            <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWN0aW9ufGVufDB8fDB8fHww" alt="Quick Actions" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Need to add a product or create an invoice fast? Use these shortcuts to get things done quickly.</p>
          `,
          side: isMobile ? 'top' : 'left',
          align: 'start',
        },
      },
      {
        element: '#view-store-button',
        popover: {
          title: 'View Your Live Store',
          description: `
            <img src="https://plus.unsplash.com/premium_photo-1661964205360-b0621b5a9366?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8fDA%3D" alt="View Store" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Click here at any time to see what your customers see. This is your public-facing storefront!</p>
          `,
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '#user-profile-dropdown',
        popover: {
          title: 'Your Profile & Settings',
          description: `
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" alt="Profile" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Access your profile, settings, and log out from this menu. You can also restart this walkthrough from here.</p>
          `,
          side: 'bottom',
          align: 'end',
        },
      },
    ];

    const mobileSteps = [
      {
        element: '#mobile-menu-button',
        popover: {
          title: 'Navigation Menu',
          description: `
            <img src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&q=80" alt="Navigation" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Tap here to open the sidebar and navigate to different sections of your dashboard, like Orders, Products, and Customers.</p>
          `,
          side: 'bottom',
          align: 'start',
        },
      },
      ...commonSteps,
    ];

    const desktopSteps = [
      ...commonSteps,
      {
        element: '#sidebar-navigation',
        popover: {
          title: 'Main Navigation',
          description: `
            <img src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&q=80" alt="Navigation" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Use this sidebar to navigate to different sections of your dashboard, like Orders, Products, and Customers.</p>
          `,
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#sidebar-collapse-button',
        popover: {
          title: 'Collapse Sidebar',
          description: `
            <img src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?w=400&q=80" alt="Collapse" style="border-radius: 8px; margin-bottom: 1rem;" />
            <p>Click here to collapse the sidebar for a more focused view of your content. Click it again to expand.</p>
          `,
          side: 'right',
          align: 'center',
        },
      },
    ];

    return isMobile ? mobileSteps : desktopSteps;
  }, [isMobile]);

  useEffect(() => {
    if (isOpen) {
      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        stagePadding: 8,
        stageRadius: 8,
        onDestroyed: () => {
          // This is called when the tour is finished by clicking "Done" on the last step,
          // or when `driverObj.destroy()` is called.
          onClose();
          setShowWalkthrough(false);
        },
        steps: getSteps(),
      });

      driverObj.drive();
    }
  }, [isOpen, onClose, getSteps]);

  // This component doesn't render anything itself; it just controls the Driver.js tour.
  return null;
};

export default Walkthrough;