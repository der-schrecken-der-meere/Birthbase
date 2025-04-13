import type { ListItem } from '@/components/select/types';
import type { Settings } from '@/database/tables/settings/type';

import { PaintbrushVertical, Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator'
import { FormField } from '@/components/ui/form';
import { UniSelect } from '@/components/select/UniSelect';
import { SettingsEntriesSkeleton } from '@/components/skeletons/SettingsEntriesSkeleton';
import { SettingsFormWrapper } from '@/components/settings/SettingsFormWrapper';
import { SettingsFormElement } from '@/components/settings/SettingsFormElement';

import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useNavbar } from '@/hooks/core/use_navbar';
import { useTranslation } from 'react-i18next';
import { useSettingsForm } from '@/hooks/use_settings_form';

import { type Colors, colors } from '@/globals/constants/colors';
import { type Modes, modes } from '@/globals/constants/modes';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { obj_is_empty } from '@/lib/functions/object/empty';

const Appearance = () => {

    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.appearance",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <AppearanceForm/>
    );
};

const AppearanceForm = () => {

    const { t } = useTranslation(["pages", "generally"]);

    const ts = (key: string) => {
        return t(`settings_appearance.${key}`);
    };

    const mode_items: ListItem<Modes>[] = modes.map((key) => {
        return {
            item: t(`modes.${key}`, { ns: "generally" }),
            value: key,
            displayText: t(`modes.${key}`, { ns: "generally" }),
        };
    });

    const color_items: ListItem<Colors>[] = colors.map((key) => {
        return {
            item: <ColorSelectEntry text={t(`colors.${key}`, { ns: "generally" })} className={key} />,
            value: key,
            displayText: t(`colors.${key}`, { ns: "generally" }),
        };
    });

    const formSchema = z.object({
        mode: z.enum(modes, {
            required_error: ts("mode_required_error"),
        }),
        color: z.enum(colors, {
            required_error: ts("color_required_error"),
        }),
    });

    const { form, isFetching, onSubmit } = useSettingsForm({
        formSchema,
        checkSubmitValues: (data) => {
            const { color, mode } = data;
            const new_settings: Partial<Settings> = {};

            if (form.formState.dirtyFields.color) {
                new_settings.color = color;
            }
            if (form.formState.dirtyFields.mode) {
                new_settings.mode = mode;
            }

            if (!obj_is_empty(new_settings)) {
                return new_settings;
            }
        },
        reducer: (data) => {
            const { mode, color } = data;
            return {
                mode,
                color,
            };
        },
    });

    if (isFetching) {
        return (
            <SettingsEntriesSkeleton entries={2}/>
        );
    }

    return (
        <SettingsFormWrapper
            onSubmit={onSubmit}
            form={form}
        >
            <FormField
                control={form.control}
                name="mode"
                render={({ field: { onChange, ...props }}) => (
                    <SettingsFormElement
                        icon={PaintbrushVertical}
                        actionNode={
                            <UniSelect
                                onValueChange={onChange}
                                placeholder={ts("mode_placeholder")}
                                listItems={mode_items}
                                {...props}
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
                render={({ field: { onChange, ...props }}) => (
                    <SettingsFormElement
                        icon={Palette}
                        actionNode={
                            <UniSelect
                                onValueChange={onChange}
                                placeholder={ts("color_placeholder")}
                                listItems={color_items}
                                {...props}
                            />
                        }
                        caption={ts("color_description")}
                    >
                        {ts("color_title")}
                    </SettingsFormElement>
                )}
            />
        </SettingsFormWrapper>
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
            <span className={cn('bg-primary justify-self-end', className)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </>
    );
};

export default Appearance;