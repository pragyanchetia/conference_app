'use client'

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
  } from '@/components/ui/form';

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast"; 


const JoinRoomForm = () => {

    const router = useRouter();
    
    //z resolver setup:
    const formSchema = z.object ({
        InviteCode: z.string().min(1, {
            message: "Invite Code is required!"
        }),
    });

    //create form and adds resolver and default input values:
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            InviteCode: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.put('/api/room?update=join-room', values);
            toast({ description: "You joined the room." });
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error: any) {
            toast({ description: error?.response?.data?.message || "Could not join this room." });
        }
    };

  return (
    <div className="h-full w-full min-w-0 rounded-2xl border border-white/5 bg-dark-3 shadow-lg">
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4 sm:p-5">
                <div> 
                    <FormField
                        control= {form.control}
                        name= "InviteCode"
                        render= {({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-white dark:text-secondary/70">
                                    Room Invite Code
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        className="h-11 w-full min-w-0 border border-white/10 bg-[#34394a] text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-0"
                                        placeholder="Enter server name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                    )}/>
                </div> 

                <div>
                    <Button className="min-h-11 w-full bg-sky-400 font-semibold text-slate-950 hover:bg-sky-300 sm:w-auto" disabled={isLoading}>
                        Join
                    </Button>
                </div>
                
           </form> 
        </Form>                  
    </div>
  )
}

export default JoinRoomForm;
