import { type Settings } from '@/database/tables/settings/settings';

import { ListItem, SettingsFormElement, SettingsFormPageWrapper } from '../Settings';
import { Languages } from 'lucide-react';
import { FormField } from '@/components/ui/form';
import { UniSelect } from '@/components/Select';

import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useNavbar } from '@/hooks/core/use_navbar';
import { useSettingsForm } from '@/hooks/use_settings_form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';
import { obj_is_empty } from '@/lib/functions/object/empty';

const Language = () => {

    const { t } = useTranslation(["pages"]);
    const { breadcrumbs } = useSettingsBreadcrumbs();

    const ts = (key: string) => {
        return t(`settings_language.${key}`);
    };

    const formSchema = z.object({
        language: z.enum(["de", "en"], {
            required_error: ts("language_required"),
        }),
    });

    useNavbar({
        pageTitle: "settings.language",
        breadcrumbDisplay: breadcrumbs,
    });

    const languages = {
        en: "English",
        de: "Deutsch",
    };

    const list_items = (() => {
        const list: ListItem[] = [];
        Object.entries(languages).forEach(([key, title]) => {
            list.push({
                displayText: title,
                item: title,
                value: key,
            })
        });
        return list;
    })();

    const { form, isFetching, onSubmit } = useSettingsForm({
        form_schema: formSchema,
        on_submit: (data) => {
            const new_settings: Partial<Settings> = {};

            if (form.formState.dirtyFields.language) {
                new_settings.language = data.language;
            }

            if (!obj_is_empty(new_settings)) {
                return new_settings;
            }
        }
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
                name="language"
                render={({ field }) => (
                    <SettingsFormElement
                        icon={<Languages/>}
                        rightElement={
                            <UniSelect
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder={languages.en}
                                listItems={list_items}
                            />
                        }
                        caption={ts("language_description")}
                    >
                        {ts("language_title")}
                    </SettingsFormElement>
                )}
            />
        </SettingsFormPageWrapper>
    );
};

export default Language;