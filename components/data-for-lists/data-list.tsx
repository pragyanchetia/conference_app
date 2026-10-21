import { ReactNode } from "react";

export type userType = {
    id: string;
    userId: string | null;
    name: string | null;
    username: string | null;
    email: string | null;
    password?: string | null;
    image: string | null;
    room?: roomType;
    createdAt?: Date;
    updatedAt?: Date;
}

export type roomType = {
    id: string;
    name: string | null;
    description: string | null;
    inviteCode: string | null;
    admin: string | null;
    user?: userType;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HomeCardProps {
    className?: string;
    img: string; 
    title: string;
    description: string;
    handleClick?: () => void;
}
  
export interface MeetingCardProps {
    title: string;
    date: string;
    icon: string;
    isPreviousMeeting?: boolean;
    buttonIcon1?: string;
    buttonText?: string;
    handleClick: () => void;
    link: string;
}

export interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title:string;
    className?: string;
    children?: ReactNode;
    handleClick?: () => void;
    buttonText?: string;
    image?: string;
    buttonIcon?: string;
  }