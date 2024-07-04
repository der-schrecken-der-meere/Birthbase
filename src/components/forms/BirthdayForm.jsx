import React from 'react'

import { createPortal } from "react-dom";

import { cn } from "@/lib/utils"
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MdCalendarMonth } from "react-icons/md";

import { TailSpin } from "react-loader-spinner";

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
    firstname: z.string({
        required_error: "Vorname muss gefüllt sein",
        invalid_type_error: "Vorname muss ein String sein",
    })
    .min(3, {
        message: "Vorname muss mindestens 3 Buchstaben haben",
    }),
    lastname: z.string({
        required_error: "Nachname muss gefüllt sein",
        invalid_type_error: "Nachname muss ein String sein",
    })
    .min(3, {
        message: "Nachname muss mindestens 3 Buchstaben haben",
    }),
    date: z.date({
        message: "Falscher Datumsstring",
    })
    .max(new Date(), {
        message: "Datum liegt in der Zukunft",
    }),
});

const BirthdayForm = ({
    customContainer,
}) => {
    
    const { toast } = useToast();

    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            date: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await new Promise((resolve, reject) => {setTimeout(() => {reject("asdasd")}, 1000)});
        } catch (e) {
            form.setError("root.serverError", {
                type: e.statusCode,
            })
            console.log(e);
        }
        console.log(data);
        
        toast({
            duration: 5000,
            title: "Sie haben diese Daten gesendet",
            description: (
                <pre>
                    <code className='text-black'>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    console.log(customContainer);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="firstname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Vorname</FormLabel>
                            <FormControl>
                                <Input placeholder="Max" {...field}/>
                            </FormControl>
                            <FormDescription>
                                Der Vorname der Person
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
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
                                Der Nachname der Person
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Datum</FormLabel>
                                <Popover modal={true} open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                onClick={() => setPopoverOpen(true)}
                                            >
                                                {field.value ? (
                                                    format(field.value, "dd-MM-yyyy")
                                                ) : (
                                                    <span>Datum auswählen</span>
                                                )}
                                                <MdCalendarMonth size={16} opacity={0.5} />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent container={customContainer} className="w-auto p-0" align="start">
                                        <Calendar
                                            locale={de}
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            captionLayout="dropdown-buttons"
                                            fixedWeeks={true}
                                            className=""
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => 
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>    
                            <FormDescription>
                                Das Datum des Geburtstages
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button className="min-w-min w-20" disabled={form.formState.isSubmitting} type="submit" variant="outline">
                    {
                        form.formState.isSubmitting ? (
                            <TailSpin
                                color='currentColor'
                                height={16}
                                width={16}
                            />
                        ) : (
                            "Submit"
                        )
                    }
                </Button>
            </form>
        </Form>    
    )
}

export default BirthdayForm