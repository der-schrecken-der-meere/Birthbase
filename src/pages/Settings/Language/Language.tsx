import { use_settings_breadcrumbs } from '@/components/layouts/SettingsLayout';
import { update_navbar } from '@/hooks/use_app_navbar';
import { ListItem, SettingsFormElement, SettingsFormPageWrapper } from '../Settings';
import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { obj_is_empty } from '@/lib/functions/object/empty';
import { Settings } from '@/database/tables/settings/settings';
import { FormField } from '@/components/ui/form';
import { Languages } from 'lucide-react';
import { UniSelect } from '@/components/Select';
import { use_settings_form } from '@/hooks/use_settings_form';
import { useTranslation } from 'react-i18next';

const Language = () => {

    const { t } = useTranslation(["pages"]);
    const { breadcrumbs } = use_settings_breadcrumbs();

    const ts = useCallback((key: string) => {
        return t(`settings_language.${key}`);
    }, [t]);

    const formSchema = useMemo(() => z.object({
        language: z.enum(["de", "en"], {
            required_error: ts("language_required"),
        }),
    }), [ts]);

    update_navbar({
        pageTitle: "settings.language",
        breadcrumbDisplay: breadcrumbs,
    });

    const languages = useMemo(() => {
        return {
            en: "English",
            de: "Deutsch"
        };
    }, []);

    const list_items = useMemo<ListItem[]>(() => {
        const list: ListItem[] = [];
        Object.entries(languages).forEach(([key, title]) => {
            list.push({
                displayText: title,
                item: title,
                value: key,
            })
        });
        return list;
    }, []);

    const { form, isFetching, onSubmit } = use_settings_form({
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