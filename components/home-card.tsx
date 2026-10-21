'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { HomeCardProps } from './data-for-lists/data-list';


const HomeCard = ({ 
    className, 
    img, 
    title,  
    description, 
    handleClick }: HomeCardProps) => {
        return (
            <button type="button"
              className={cn(
                'bg-orange-1 px-4 py-6 flex flex-col justify-between text-left w-full xl:max-w-[270px] min-h-[200px] rounded-[14px] cursor-pointer transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
                className
              )}
              onClick={handleClick}
            >
              <div className="flex-center glassmorphism size-12 rounded-[10px]">
                <Image src={img} alt="meeting" width={27} height={27} />
              </div>
              
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-sm text-white/75">{description}</p>
              </div>
            </button>
          );
}

export default HomeCard
