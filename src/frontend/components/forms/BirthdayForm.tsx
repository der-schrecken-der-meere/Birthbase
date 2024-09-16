import { memo } from 'react'


import { format } from "date-fns";
import { de } from "date-fns/locale";
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MdCalendarMonth } from "react-icons/md";

import { TailSpin } from "react-loader-spinner";

import { Button } from '@/frontend/components/ui/button';
import { Calendar } from '@/frontend/components/ui/calendar';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from '@/frontend/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/frontend/components/ui/popover';
import { useToast } from '@/frontend/components/ui/use-toast';
import { db } from "@/database/birthbase";

import { useDispatch, useSelector } from 'react-redux';
import { changeMethod, changeData, changeDataInitial } from "@/frontend/store/dataForm/dataFormSlice";
import { addData, updateData, deleteData } from "@/frontend/store/data/dataSlice";
import { RootState } from '@/frontend/store/store';

const formSchema = z.object({
    id: z.number(),
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
    date: z.coerce.date({
        message: "Falscher Datumsstring",
    })
    .max(new Date(), {
        message: "Datum liegt in der Zukunft",
    }),
});

type T_Form = z.infer<typeof formSchema>

const BirthdayForm = () => {
    const { toast } = useToast();

    const dispatch = useDispatch();

    const birthday = useSelector((state: RootState) => state.dataForm.value);
    const method = useSelector((state: RootState) => state.dataForm.method);

    const form = useForm<T_Form>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: birthday.id,
            firstname: birthday.name.first,
            lastname: birthday.name.last,
            date: birthday.date as unknown as Date,
        }
    });

    const onSubmit: SubmitHandler<T_Form> = async (data) => {
        console.log("OnSubmit: ", data);
        try {
            const newObj = {
                id: data.id,
                name: {
                    first: data.firstname,
                    last: data.lastname,
                },
                date: data.date.toISOString(),
            }
            console.log(method, newObj);
            switch (method) {
                case "add":
                    let { id, ...no_id } = newObj;
                    let add_response = await db.tables.birthdays.create(no_id);
                    newObj.id = add_response.id;
                    console.log(newObj);
                    dispatch(addData(newObj));
                    dispatch(changeMethod("update"));
                    dispatch(changeData(newObj));
                    form.reset({
                        id: newObj.id,
                        date: newObj.date as unknown as Date,
                        firstname: newObj.name.first,
                        lastname: newObj.name.last,
                    })
                    break;
                case "delete":
                    await db.tables.birthdays.delete(newObj.id);
                    dispatch(deleteData(newObj.id));
                    dispatch(changeDataInitial({}));
                    break;
                case "update":
                    await db.tables.birthdays.update(newObj);
                    dispatch(changeData(newObj));
                    dispatch(updateData(newObj));
                break;
                default:
                    break;
            }
            
        } catch (e) {
            console.error(e);
            form.setError("root.serverError", {
                type: (e as unknown as any).msg,
            })
        }
        
        toast({
            duration: 5000,
            title: "Sie haben diese Daten gesendet",
            description: (
                <pre>
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

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
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
                                    <PopoverContent className="w-auto p-0" align="start">
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
                <FormField
                    control={form.control}
                    name="id"
                    render={({field}) => (
                        <FormControl>
                            <Input type="hidden" {...field}/>
                        </FormControl>
                    )}
                />
                <ActionButtons
                    isSubmitting={form.formState.isSubmitting}
                />
            </form>
        </Form>    
    )
}

export default BirthdayForm

interface I_ActionButtons {
    isSubmitting: boolean,
}

const ActionButtons = memo(({
    isSubmitting,
}: I_ActionButtons) => {
    const dispatch = useDispatch();
    const method = useSelector((state: RootState) => state.dataForm.method);

    return (
        <div className='flex'>
            <Button className="min-w-min w-20" disabled={isSubmitting} type="submit" variant="outline">
                {
                    isSubmitting ? (
                        <TailSpin
                            color='currentColor'
                            height={16}
                            width={16}
                        />
                    ) : (
                        method === "add" ? "Hinzufügen" : "Ändern"
                    )
                }
            </Button>
            {(method === "update" || method === "delete") && <Button disabled={isSubmitting} onClick={() => dispatch(changeMethod("delete"))} type="submit" variant="destructive" className="ml-auto min-w-min w-20">
                {
                    isSubmitting ? (
                        <TailSpin
                            color='currentColor'
                            height={16}
                            width={16}
                        />
                    ) : (
                        "Löschen"
                    )
                }   
            </Button>}    
        </div>
    );
});