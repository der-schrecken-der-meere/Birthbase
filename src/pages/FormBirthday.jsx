import React from 'react'

import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
    lastname: z.string().min(3, {
        message: "Nachname muss mindestens 3 Buchstaben haben.",
    }) 
})

const BirthdayForm = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lastname: "",
        }
    })
    /**
     * 
     * @param {z.infer<typeof formSchema>} values 
     */
    const onSubmit = (values) => {
        console.log(values);
    }

    return (
        <Dialog id="alpha">
            <DialogTrigger id='alpha'>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogContent>
                    <DialogTitle>Geburtstag bearbeiten</DialogTitle>
                    <DialogHeader>
                        
                        <DialogDescription>
                            Erstellen oder ändern von Daten eines Geburtstags.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nachname</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mustermann" {...field}/>
                                        </FormControl>
                                        <FormDescription>
                                            Das ist der Nachname der Person
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="outline">Submit</Button>
                        </form>
                    </Form>

                    <DialogFooter>
                            <Button type="submit" variant="outline">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogContent>
        </Dialog>
    );
}

export default BirthdayForm