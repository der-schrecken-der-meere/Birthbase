import type { Settings } from '@/database/tables/settings/type';
import type { ListItem } from '@/components/select/types';

import { Languages as LanguageIcon } from 'lucide-react';
import { FormField } from '@/components/ui/form';
import { UniSelect } from '@/components/select/UniSelect';
import { SettingsEntriesSkeleton } from '@/components/skeletons/SettingsEntriesSkeleton';
import { SettingsFormWrapper } from '@/components/settings/SettingsFormWrapper';
import { SettingsFormElement } from '@/components/settings/SettingsFormElement';

import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useNavbar } from '@/hooks/core/use_navbar';
import { useSettingsForm } from '@/hooks/use_settings_form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';
import { obj_is_empty } from '@/lib/functions/object/empty';
import { type Languages, languages } from '@/globals/constants/language';

const Language = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.language",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <LanguageForm/>
    );
};

const LanguageForm = () => {

    const { t } = useTranslation(["pages", "generally"]);

    const ts = (key: string) => {
        return t(`settings_language.${key}`);
    };
    
    const language_items: ListItem<Languages>[] = languages.map((key) => {
        const text = t(`languages.${key}`, { ns: "generally" });
        return {
            item: text,
            value: key,
            displayText: text,
        };
    });

    const formSchema = z.object({
        language: z.enum(languages, {
            required_error: ts("language_required_error"),
        }),
    });

    const { form, isFetching, onSubmit } = useSettingsForm({
        formSchema,
        checkSubmitValues: (data) => {
            const new_settings: Partial<Settings> = {};

            if (form.formState.dirtyFields.language) {
                new_settings.language = data.language;
            }

            if (!obj_is_empty(new_settings)) {
                return new_settings;
            }
        },
        reducer: (data) => {
            const { language } = data;
            return {
                language,
            }
        },
    });

    if (isFetching) {
        return (
            <SettingsEntriesSkeleton entries={1} />
        );
    }

    return (
        <SettingsFormWrapper
            onSubmit={onSubmit}
            form={form}
        >
            <FormField
                control={form.control}
                name="language"
                render={({ field: { onChange, ...props } }) => (
                    <SettingsFormElement
                        icon={LanguageIcon}
                        actionNode={
                            <UniSelect
                                onValueChange={onChange}
                                placeholder={ts("language_placeholder")}
                                listItems={language_items}
                                {...props}
                            />
                        }
                        caption={ts("language_description")}
                    >
                        {ts("language_title")}
                    </SettingsFormElement>
                )}
            />
        </SettingsFormWrapper>
    );
};

export default Language;