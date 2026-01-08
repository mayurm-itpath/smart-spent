"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAppStore } from "@/store/use-app-store";
import { pageRoutes } from "@/utils/constants/routes";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const Home = () => {
  const { userInfo } = useAppStore();

  return (
    <>
      <section>
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="py-[50px] flex justify-between items-center gap-5 max-lg:flex-col">
            <div className="w-[500px] flex flex-col items-baseline gap-4 max-sm:w-[300px] max-lg:items-center max-lg:text-center">
              <h2 className="text-3xl font-bold">
                Take Control of Your Finances
              </h2>

              <p>
                Track expenses, set budgets, and achieve your financial goals
                with our intuitive expense tracking platform. Get insights that
                help you make smarter money decisions.
              </p>

              {userInfo ? (
                <Button asChild>
                  <Link href={pageRoutes.user.dashboard}>Dashboard</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={pageRoutes.auth.login}>Login</Link>
                </Button>
              )}
            </div>

            <div className="w-[450px] max-sm:w-[300px]">
              <Image
                src={IMAGES.heroImage}
                alt="Hero Image"
                width={300}
                height={300}
                style={{ width: "100%", height: "auto" }}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-[50px] flex flex-col gap-5">
            <h2 className="text-3xl font-bold text-center">How It Works</h2>

            <p className="text-center">
              Get started with ExpenseTracker in three simple steps and start
              saving money today.
            </p>

            <div className="flex justify-between items-center gap-10 max-lg:flex-col">
              <div>
                <ul className="list-disc list-inside space-y-4 text-lg">
                  <li>
                    <strong>Sign Up:</strong> Create your free account to get
                    started.
                  </li>
                  <li>
                    <strong>Add Transactions:</strong> Easily log your income
                    and expenses.
                  </li>
                  <li>
                    <strong>Monitor & Analyze:</strong> View detailed reports
                    and insights to manage your finances effectively.
                  </li>
                </ul>
              </div>

              <div className="w-[500px] max-sm:w-[350px]">
                <Image
                  src={IMAGES.howItWorks}
                  alt="How it works"
                  width={300}
                  height={300}
                  style={{ width: "100%", height: "auto" }}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="rounded-2xl bg-linear-to-r from-green-500 to-emerald-500 text-white py-[50px] text-center my-16">
            <h2 className="text-3xl font-bold">
              Start Tracking Your Money Today
            </h2>
            <p className="mt-2 opacity-90">
              It's free and takes less than a minute.
            </p>

            <div className="mt-6">
              <Button variant="secondary" size="lg" asChild>
                <Link href={pageRoutes.auth.signup}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
