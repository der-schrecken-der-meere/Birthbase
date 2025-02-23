import { type ListItem, SettingsFormElement, SettingsFormPageWrapper } from '../Settings';

import { Separator } from '@/components/ui/separator'

import { PaintbrushVertical, Palette } from 'lucide-react';
import { z } from 'zod';
import { colors } from '@/globals/constants/colors';
import { useCallback, useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Settings } from '@/database/tables/settings/settings';
import { use_settings_breadcrumbs } from '@/components/layouts/SettingsLayout';

import { obj_is_empty } from '@/lib/functions/object/empty';
import { update_navbar } from '@/hooks/use_app_navbar';
import { useTranslation } from 'react-i18next';
import { use_settings_form } from '@/hooks/use_settings_form';
import { UniSelect } from '@/components/Select';

const Appearance = () => {

    const { t } = useTranslation(["pages", "generally"]);

    const ts = useCallback((key: string) => {
        return t(`settings_appearance.${key}`);
    }, [t]);

    const mode_items: ListItem[] = useMemo(() => {
        const t_modes = (key: string) => t(`modes.${key}`, { ns: "generally" });
        const list_item = (key: string) => ({
            item: t_modes(key),
            value: key,
            displayText: t_modes(key),
        });

        return [
            list_item("dark"),
            list_item("light"),
            list_item("system"),
        ]
    }, [t]);

    const color_items: ListItem[] = useMemo(() => {
        const t_colors = (key: string) => t(`colors.${key}`, { ns: "generally" });
        const list_item = (key: string) => ({
            item: <ColorSelectEntry text={t_colors(key)} className={key} />,
            value: key,
            displayText: t_colors(key),
        });

        return [
            list_item("purple"),
            list_item("blue"),
            list_item("green"),
            list_item("orange"),
            list_item("red"),
            list_item("gray"),
        ];
    }, [t]);

    const formSchema = useMemo(() => z.object({
        mode: z.enum(["dark", "light", "system"], {
            required_error: ts("mode_required_error"),
        }),
        color: z.enum(colors, {
            required_error: ts("color_required_error"),
        }),
    }), [t]);

    const { breadcrumbs } = use_settings_breadcrumbs();

    update_navbar({
        pageTitle: "settings.appearance",
        breadcrumbDisplay: breadcrumbs,
    });

    const { form, isFetching, onSubmit } = use_settings_form({
        form_schema: formSchema,
        on_submit: (data) => {
            const new_settings: Partial<Settings> = {};

            if (form.formState.dirtyFields.color) {
                new_settings.color = data.color;
            }
            if (form.formState.dirtyFields.mode) {
                new_settings.mode = data.mode;
            }

            if (!obj_is_empty(new_settings)) {
                return new_settings;
            }
        },
    });

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
                        rightElement={
                            <UniSelect
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder={ts("mode_placeholder")}
                                listItems={mode_items}
                            />
                        }
                        caption={ts("mode_description")}
                    >
                        {ts("mode_title")}
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
                        rightElement={
                            <UniSelect
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder={ts("color_placeholder")}
                                listItems={color_items}
                            />
                        }
                        caption={ts("color_description")}
                    >
                        {ts("color_title")}
                    </SettingsFormElement>
                )}
            />
        </SettingsFormPageWrapper>
    );
};

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
};

export default Appearance;