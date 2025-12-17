import { IMAGES } from "@/assets/images";
import { pageRoutes } from "@/utils/constants/routes";
import Image from "next/image";
import Link from "next/link";
import ToggleThemeButton from "../buttons/toggle-theme-butthon";
import LogoutButton from "../buttons/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "../ui/button";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <header className="sticky top-0 bg-white shadow-md p-2 z-10 h-[52px] dark:bg-[#18181b]/75 dark:shadow-[#303032]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold max-sm:text-2xl">
            <Link href={pageRoutes.public.home} className="flex gap-2">
              <Image
                src={IMAGES.logo}
                alt="SmartSpent Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              SmartSpent
            </Link>
          </h1>

          <nav>
            <ul className="flex gap-3">
              <li>
                <Link href={pageRoutes.public.home}>Home</Link>
              </li>
              <li>
                <Link href={pageRoutes.user.dashboard}>Dashboard</Link>
              </li>
              <li>
                <Link href={pageRoutes.user.addTransaction}>
                  Add Transaction
                </Link>
              </li>
              <li>
                <Link href={pageRoutes.user.transactions}>Transactions</Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ToggleThemeButton />
            {session ? (
              <>
                <LogoutButton />
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href={pageRoutes.auth.login}>Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
