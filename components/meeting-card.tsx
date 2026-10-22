"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";
import { MeetingCardProps } from "./data-for-lists/data-list";

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="flex min-h-[230px] min-w-0 w-full flex-col justify-between gap-7 rounded-2xl border border-white/5 bg-dark-1 p-5 shadow-sm sm:p-6 lg:p-7 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex min-w-0 justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="break-words text-lg font-bold leading-snug sm:text-xl lg:text-2xl" style={{ overflowWrap: "anywhere" }}>{title}</h2>
            <p className="break-words text-sm leading-relaxed text-slate-300 sm:text-base" style={{ overflowWrap: "anywhere" }}>{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("relative flex flex-wrap items-center justify-between gap-4", {})}>
        <div className="relative flex w-full max-sm:hidden">
          {avatarImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="attendees"
              width={40}
              height={40}
              className={cn("rounded-full", { absolute: index > 0 })}
              style={{ top: 0, left: index * 28 }}
            />
          ))}
          <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4">
            +5
          </div>
        </div>
        {!isPreviousMeeting && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button onClick={handleClick} className="min-h-11 w-full rounded-lg bg-blue-1 px-4 sm:w-auto sm:px-5">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="min-h-11 w-full bg-dark-4 px-4 sm:w-auto sm:px-5"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;