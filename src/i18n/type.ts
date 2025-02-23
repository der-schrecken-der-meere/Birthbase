type LanguageTranslation = {
    sidebar: {
        main_menu: string,
        home: string,
        notifications: string,
        my_birthdays: string,
        settings: string,
        appearance: string,
        storage: string,
        date_and_time: string,
        language: string,
        info: string,
        app: string,
        update: string,
    },
    search: {
        search_placeholder: string
    },
    my_birthdays: {
        search_placeholder: string,
        date: string,
        last_name: string,
        first_name: string,
        age: string,
        until: string,
        misc: string,
        view: string,
        actions: string,
        copy_in_message: string,
    },
    notifications: {
        all: string,
        birthdays: string,
        reminders: string,
        infos: string,
        no_notifications: string,
    },
    appearance_settings: {
        mode: string,
        mode_description: string,
        system: string,
        dark: string,
        light: string,
        accent_color: string,
        accent_color_description: string,
        blue: string,
        gray: string,
        green: string,
        purple: string,
        orange: string,
        red: string,
    },
    notifications_settings: {
        notifications: string,
        notifications_description: string,
        reminder: string,
        reminder_description: string,
    },
    storage_settings: {
        /**
         * How many storage is used
         * - $0: used
         * - $1: quotas
         */
        used_storage: string,
        empty_storage: string,
    },
    tables: {
        show_columns: string,
        desc: string,
        asc: string,
        reset: string,
        hide: string,
        rows_per_page: string,
        /** Translation with two placeholders
         * - $0: Current page
         * - $1: Maximum page
         */
        current_page: string,
        table_options_heading: string,
        table_options_description: string,
        columns: string,
        columns_description: string,
        max_rows_per_page_description: string,
        save: string,
    },
    birthday_form: {
        form_heading_add: string,
        form_heading_change: string,
        form_description_add: string,
        form_form_description_change: string,
        first_name: string,
        first_name_placeholder: string,
        first_name_description: string,
        last_name: string,
        last_name_placeholder: string,
        last_name_description: string,
        date: string,
        data_description: string,
    },
    generally: {
        add: string,
        save: string,
        delete: string,
        edit: string,
        change: string,
        create: string,
    }
};

export type { LanguageTranslation };