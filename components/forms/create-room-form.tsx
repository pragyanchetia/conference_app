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
    <div className="grid grid-cols-[2fr_1fr] bg-dark-3 rounded-xl">
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4 py-4">
                <div className="grid grid-rows-2 space-y-2"> 
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
                                        className="bg-zinc-500/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 w-fit"
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
                                        className="bg-zinc-500/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter Room Description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>         
                </div> 

                <div>
                    <Button className="bg-dark-1 text-white hover:bg-dark-4" disabled={isLoading}>
                        Create
                    </Button>
                </div>
                
           </form> 
        </Form>                  
    </div>
  )
}

export default CreateRoomForm
