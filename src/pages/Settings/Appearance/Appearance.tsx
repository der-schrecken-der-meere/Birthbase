import { useSelector } from 'react-redux'

import { ListItem, SelectAsRadio, SelectShortend, SettingsFormElement, SettingsFormPageWrapper } from '../Settings';

import { getMediaScreen } from '@/store/mediaType/mediaTypeSlice'

import { Separator } from '@/components/ui/separator'
import { RootState } from '@/store/store';

import { PaintbrushVertical, Palette } from 'lucide-react';
import { z } from 'zod';
import { colors } from '@/globals/constants/colors';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Settings } from '@/database/tables/settings/settings';
import { useAppToast } from '@/hooks/useAppToast';
import { useNavbar } from '@/hooks/useNavbar';
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';

import { get_settings_query, set_settings_query } from '@/features/manage_settings/query';
import { obj_is_empty } from '@/lib/functions/object/empty';

const formSchema = z.object({
    mode: z.enum(["dark", "light", "system"], {
        required_error: "Bitte wählen Sie einen Modus aus"
    }),
    color: z.enum(colors, {
        required_error: "Bitte wählen Sie eine Farbe aus"
    })
})

type AppearanceForm = z.infer<typeof formSchema>

const Appearance = () => {

    useNavbar({
        pageTitle: "Aussehen",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    const { setErrorNotification, setSuccessNotification } = useAppToast();
    const { data, isError, error, isFetching } = get_settings_query();
    const { mutate: update } = set_settings_query();

    useEffect(() => {
        if (isError) {
            setErrorNotification({
                title: "Fehler beim Anzeigen der Einstellungen",
                description: JSON.stringify(error),
            });
        }
    }, [isError, error]);

    const form = useForm<AppearanceForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            color: "blue",
            mode: "system",
        },
        values: data
    })

    const onSubmit = useCallback((data: AppearanceForm) => {
        const new_settings: Partial<Settings> = {};

        if (form.formState.dirtyFields.color) {
            new_settings.color = data.color;
        }
        if (form.formState.dirtyFields.mode) {
            new_settings.mode = data.mode;
        }

        console.log(new_settings)

        if (!obj_is_empty(new_settings)) {
            update(new_settings, {
                onSuccess: () => {
                    setSuccessNotification({
                        title: "Erfolgreich",
                        description: "Die Einstellungen wurden aktualisiert",
                    });
                },
                onError: (error) => {
                    setErrorNotification({
                        title: "Fehler beim Speichern der Einstellungen",
                        description: JSON.stringify(error), 
                    });
                },
            });
        }

        // updateSettings(newData, (v, e) => {
        //     console.log(v);
        //     if (v) {
        //         dispatch(setColor(v.color));
        //         dispatch(setMode(v.mode));
        //         console.log(v);
        //         defaultValue.current = {
        //             color: v.color,
        //             mode: v.mode,
        //         }
        //         form.reset({
        //             color: v.color,
        //             mode: v.mode,
        //         });
        //         setSuccessNotification({
        //             title: "Erfolgreich",
        //             description: "Die Einstellungen wurden geändert",
        //         })
        //     } else {
        //         form.reset(defaultValue.current);
        //         setErrorNotification({
        //             title: "Fehler beim Aktualisieren",
        //             description: e,
        //         })
        //     }
        // });
    }, []);

    if (isFetching) {
        return (
            <div>Loading...</div>
        );
    }

    return (
            <SettingsFormPageWrapper
                onSubmit={onSubmit}
                form={form}
            >
                <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                        <SettingsFormElement
                            icon={<PaintbrushVertical/>}
                            rightElement={<ModeSelect defaultValue={field.value} onValueChange={field.onChange} />}
                            caption={"Ändert das Farbschema"}
                        >
                            Modus
                        </SettingsFormElement>
                    )}
                />
                <Separator/>
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <SettingsFormElement
                            icon={<Palette/>}
                            rightElement={<ColorSelect defaultValue={field.value} onValueChange={field.onChange} />}
                            caption={"Ändert die Farbpalette"}
                        >
                            Akzentfarbe
                        </SettingsFormElement>
                    )}
                />
            </SettingsFormPageWrapper>
    ) 
}

const ModeSelect = ({
    defaultValue,
    onValueChange,
}: {
    defaultValue: string,
    onValueChange: (value: string) => void,
}) => {
    const lg = useSelector((state: RootState) => {
        const screens = state.mediaType.screens;
        return getMediaScreen("md", screens)?.value.isActive;
    });

    const listitems: ListItem[] = useMemo(() => [
        {
            item: "Dunkel", 
            value: "dark",
            displayText: "Dunkel"
        },
        {
            item: "Hell",
            value: "light",
            displayText: "Hell",
        },
        {
            item: "System",
            value: "system",
            displayText: "System",
        },
    ], []);
    const placeholder = "Modus";

    return (
        !lg ? (
            <SelectAsRadio
                title={placeholder}
                radioItems={listitems}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
            />
        ) : (
            <SelectShortend
                title={placeholder}
                selectItems={listitems}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
            />
        )
    );
}

const ColorSelectEntry = ({
    className,
    text,
}: {
    className: string,
    text: string,
}) => {
    return (
        <>
            <span>{text}</span>
            <span className={cn('bg-primary ml-auto', className)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </>
    );
}

const ColorSelect = ({
    defaultValue,
    onValueChange,
}: {
    defaultValue: string,
    onValueChange: (value: string) => void,
}) => {
    const lg = useSelector((state: RootState) => {
        const screens = state.mediaType.screens;
        return getMediaScreen("md", screens)?.value.isActive;
    });

    const listitems: ListItem[] = [
        {item: <ColorSelectEntry text='Blau' className='blue' />, value: "blue", displayText: "Blau" },
        {item: <ColorSelectEntry text='Grau' className='gray' />, value: "gray", displayText: "Grau"},
        {item: <ColorSelectEntry text='Grün' className='green' />, value: "green", displayText: "Grün"},
        {item: <ColorSelectEntry text='Lila' className='purple' />, value: "purple", displayText: "Lila"},
        {item: <ColorSelectEntry text='Orange' className='orange' />, value: "orange", displayText: "Orange"},
        {item: <ColorSelectEntry text='Rot' className='red' />, value: "red", displayText: "Rot"},
    ];
    const placeholder = "Farbe"

    return (
        !lg ? (
            <SelectAsRadio
                title={placeholder}
                radioItems={listitems}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
            />
        ) : (
            <SelectShortend
                title={placeholder}
                selectItems={listitems}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
            />
        )
    );
}
export default Appearance