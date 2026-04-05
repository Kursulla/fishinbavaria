import { useEffect } from "react";
import { exposeBuildInfoToWindow } from "./buildInfo";

function AppVersionInitializer() {
  useEffect(() => {
    exposeBuildInfoToWindow();
  }, []);

  return null;
}

export default AppVersionInitializer;
