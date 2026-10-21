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
import { currentRoom } from "@/lib/current-room";
import { roomType } from "../data-for-lists/data-list";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
 
//z resolver setup:
    const formSchema = z.object({ 
        Name: z.string().min(1, {
        message: "Name is required!"
        }),
        Description: z.string().min(1, {
        message: "Description is required!"
        }),
    });


const UpdateRoomForm = ({id}: {id: string}) => {

    const router = useRouter();
    const {user} = useUser();
    const [room, setRoom] = useState<roomType | null>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            const roomData = await currentRoom(id);
            setRoom(roomData as roomType | null);
        };

        fetchRoom();
    }, [id]);


    //create form and adds resolver and default input values:
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { 
          Name: '',
          Description: ''
        }
    });

    useEffect(() => {
        if (room) {
          form.reset({
            Name: room.name?.toString() || '',
            Description: room.description?.toString() || ''
          });
        }
      }, [room, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        
        try {
            if(user?.id !== room?.admin) {
                return;
            };

            const payload = {
                id: room?.id,
                Name: values.Name,
                Description: values.Description
            }
            await axios.put('/api/room?update=update-details', payload);
            toast({ description: "Room details updated." });
            router.refresh();
            window.location.reload();
        } catch (error: any) {
            toast({ description: error?.response?.data?.message || "Could not update the room." });
        }
    };

  return (
    <div className="grid grid-cols-[2fr_1fr] h-full bg-dark-3 rounded-xl">
        
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4 py-4">
                <div> 
                    <div className="text-xl font-bold pb-5">Edit Name and Description</div>
                    <FormField
                        control= {form.control}
                        name= "Name"
                        render= {({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-white dark:text-secondary/70">
                                    Room Name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        className="bg-zinc-500/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 w-fit"
                                        placeholder="Edit server name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                    )}/>
                    <FormField
                        control= {form.control}
                        name= "Description"
                        render= {({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-white dark:text-secondary/70">
                                    Room Description
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        className="bg-zinc-500/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 w-fit"
                                        placeholder="Edit server name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                    )}/>
                </div> 

                <div>
                    <Button className="bg-dark-1 text-white hover:bg-dark-4" disabled={isLoading}>
                        Save
                    </Button>
                </div>
                
           </form> 
        </Form>                  
    </div>
  )
}

export default UpdateRoomForm;
