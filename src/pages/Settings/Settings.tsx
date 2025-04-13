import { Fragment } from 'react';

import { Separator } from '@/components/ui/separator';
import { NavigationLink } from '@/components/settings/NavigationLink';

import { useNavEntriesStore } from '@/stores/use_nav_entries_store';

import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useNavbar } from '@/hooks/core/use_navbar';

const Settings = () => {

    const { breadcrumbs } = useSettingsBreadcrumbs();
    const settingsLinks = useNavEntriesStore((state) => state.settingsLinks);
    
    useNavbar({
        pageTitle: "main.settings",
        breadcrumbDisplay: () => {
            const breads = structuredClone(breadcrumbs);
            breads[0].type.length = 1;
            return breads;
        }
    });

    return (
        <div className='h-full scrollbar-visible overflow-auto'>
            {settingsLinks.entries.map((link_entry, i) => (
                <Fragment
                    key={link_entry.url}
                >
                    {i !== 0 && <Separator/>}
                    <NavigationLink
                        to={link_entry.url}
                        icon={link_entry.icon}
                        caption={!link_entry.search ? "" : link_entry.search}
                        className='overflow-hidden'
                    >
                        {link_entry.title}
                    </NavigationLink>
                </Fragment>
            ))}
        </div>
    )
}

export default Settings;