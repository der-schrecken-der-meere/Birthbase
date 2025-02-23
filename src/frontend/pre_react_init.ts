import { get_settings_model } from "@/database/tables/settings/db_model";
import type { Settings } from "@/database/tables/settings/settings";
import { change_color } from "@/features/manage_settings/appearance/color";
import { change_mode } from "@/features/manage_settings/appearance/mode";
import { change_language } from "@/features/manage_settings/language/language";
import { set_notification_worker } from "@/features/notify/notify";
import { init_tauri } from "@/init/tauri_init";
// import { mock_init_tauri } from "@/init/test/tauri_init";
// import { mock_init_updater } from "@/init/test/updater_init";
import { init_updater } from "@/init/updater_init";
import { QueryClient } from "@tanstack/react-query";
import { isTauri } from "@tauri-apps/api/core";

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      }
    }
  }
);

const pre_react_init = async () => {
  set_notification_worker();
  const settings = await get_settings_model();
  if (isTauri()) {
    await init_updater(settings);
    await init_tauri();
  }
  setup_settings(settings);
};

const setup_settings = (settings: Omit<Settings, "id">) => {
  change_color(settings.color);
  change_mode(settings.mode);
  change_language(settings.language);
};

export { pre_react_init, queryClient };