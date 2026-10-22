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
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";


const CreateRoomForm = () => {
  
    const router = useRouter();
    
    //z resolver setup:
    const formSchema = z.object ({
        name: z.string().min(1, {
            message: "Room name is required!"
        }),
        description: z.string().min(1, {
            message: "Room details is required!"
        })
    });

    //create form and adds resolver and default input values:
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/room', values);
            toast({ description: "Room created." });
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error: any) {
            toast({ description: error?.response?.data?.message || "Could not create the room." });
        }
    };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-white/5 bg-dark-3 shadow-lg">
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control= {form.control}
                        name= "name"
                        render= {({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-white dark:text-secondary/70">
                                    Room Name
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
                    <FormField 
                        control={form.control}
                        name="description"
                        render= {({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-white dark:text-secondary/70 w-fit">
                                    Room Description
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        className="h-11 w-full min-w-0 border border-white/10 bg-[#34394a] text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-0"
                                        placeholder="Enter Room Description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>         
                </div> 

                <div>
                    <Button className="min-h-11 w-full bg-sky-400 font-semibold text-slate-950 hover:bg-sky-300 sm:w-auto" disabled={isLoading}>
                        Create
                    </Button>
                </div>
                
           </form> 
        </Form>                  
    </div>
  )
}

export default CreateRoomForm
