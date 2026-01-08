import { IMAGES } from "@/assets/images";
import { pageRoutes } from "@/utils/constants/routes";
import Image from "next/image";
import Link from "next/link";
import ToggleThemeButton from "../buttons/toggle-theme-butthon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "../ui/button";
import { CircleUserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import NavMenu from "../nav-menu";
import DrawerMenu from "../drawer-menu";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <header className="sticky top-0 bg-white shadow-md p-2 z-10 h-[52px] dark:bg-[#18181b]/75 dark:shadow-[#303032]">
        <div className="container mx-auto flex justify-between items-center">
          {session && (
            <span className="hidden max-md:inline-block">
              <DrawerMenu />
            </span>
          )}

          <h1 className="text-3xl font-bold max-sm:text-2xl">
            <Link href={pageRoutes.public.home} className="flex gap-2">
              <Image
                src={IMAGES.logo}
                alt="SmartSpent Logo"
                width={32}
                height={32}
                className="rounded-full h-8 w-8"
              />
              SmartSpent
            </Link>
          </h1>

          {session && (
            <span className="inline-block max-md:hidden">
              <NavMenu />
            </span>
          )}

          <div className="flex items-center gap-2">
            <ToggleThemeButton />
            {session ? (
              <>
                <Link href={pageRoutes.user.profile}>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {session.user?.name?.charAt(0).toUpperCase() || (
                        <CircleUserRound />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Link>
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
