"use client";
import { pageRoutes } from "@/utils/constants/routes";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import Link from "next/link";

interface NavMenuProps {
  closeDrawer?: () => void;
}

const NavMenu = ({ closeDrawer }: NavMenuProps) => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList className="font-bold flex max-md:flex-col max-md:items-start gap-1">
          <NavigationMenuItem onClick={closeDrawer}>
            <NavigationMenuLink asChild>
              <Link href={pageRoutes.public.home}>Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem onClick={closeDrawer}>
            <NavigationMenuLink asChild>
              <Link href={pageRoutes.user.dashboard}>Dashboard</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem onClick={closeDrawer}>
            <NavigationMenuLink asChild>
              <Link href={pageRoutes.user.addTransaction}>Add Transaction</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem onClick={closeDrawer}>
            <NavigationMenuLink asChild>
              <Link href={pageRoutes.user.transactions}>Transactions</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default NavMenu;
