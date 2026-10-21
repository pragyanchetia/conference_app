'use client'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"

import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"

import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
  
const MobileNav = () => {

  const pathname = usePathname();
  const params = useParams();
  const roomId = Array.isArray(params.id) ? params.id[0] : String(params.id ?? "");

  return (
    <section className='w-full max-w-[264px]'>
        <Sheet>
        <SheetTrigger asChild>
            <Image 
                src={"/icons/hamburger.svg"}
                width={36}
                height={36}
                alt="hamburger"
                className="cursor-pointer sm:hidden"
            />
        </SheetTrigger>
        <SheetContent side={"left"} className="border-none bg-dark-1">
            <Link
                href={"/"}
                className="flex items-center gap-1 max-lg:pl-6"
            >
                <Image
                    src={"/icons/logo.svg"}
                    width={32}
                    height={32}
                    alt="conference-logo"
                    className="max-sm:size-10"
                />
                <p className="text-[26px] uppercase font-extrabold text-white">
                    Conference
                </p>
            </Link>

            <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                <SheetClose asChild>
                    <section className="flex h-full flex-col ga6 pt-16 text-white">
                        {sidebarLinks.map((link) => {
                            const href = link.route === "/" ? `/room/${roomId}` : `/room/${roomId}${link.route}`;
                            const isActive = pathname === href;
            
                            return (
                                <SheetClose asChild key={link.route}>
                                <Link 
                                    href={href}
                                    key={link.label}
                                    className={cn('flex gap-4 items-center p-4 ml-10 rounded-lg w-full max-w-60 justify-start', {
                                        'bg-blue-1': isActive, 'hover:bg-cyan-400' : !isActive
                                    })}
                                >
                                    <Image 
                                        src={link.imgUrl}
                                        alt={link.label}
                                        width={20}
                                        height={20}
                                    />
                                    <p className="font-semibold">
                                        {link.label}
                                    </p>
                                
                                </Link>
                                </SheetClose>
                            )
                        })}
                    </section>
                </SheetClose>
            </div>
        </SheetContent>
        </Sheet>
    </section>
  )
}

export default MobileNav
