import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SlimLayout } from '@/components/SlimLayout';

export default function ThankYou() {
  return (
    <>
      <Header />
      <SlimLayout>
        <div className="mx-4 my-10 text-center">
          <h1 className="text-2xl">
            Thank you for signing up! Please check your email for more details.
          </h1>
        </div>
      </SlimLayout>
      <Footer />
    </>
  );
}
