import { get_settings_model } from "@/database/tables/settings/db_model";
import type { Settings } from "@/database/tables/settings/settings";
import { change_color } from "@/features/manage_settings/appearance/color";
import { change_mode } from "@/features/manage_settings/appearance/mode";
import { set_notification_worker } from "@/features/notify/notify";
import { QueryClient } from "@tanstack/react-query";

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
  setup_settings(settings);
};

const setup_settings = (settings: Omit<Settings, "id">) => {
  change_color(settings.color);
  change_mode(settings.mode);
};

export { pre_react_init, queryClient };