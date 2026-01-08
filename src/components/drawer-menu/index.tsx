"use client";

import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import NavMenu from "../nav-menu";
import { useState } from "react";

const DrawerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      <DrawerTrigger asChild>
        <button>
          <Menu className="h-6 w-6" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-[260px] px-0">
        <DrawerHeader className="border-b px-4">
          <DrawerTitle className="text-lg font-semibold">
            Navigation
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        <div className="p-2">
          <NavMenu closeDrawer={() => setIsOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerMenu;
