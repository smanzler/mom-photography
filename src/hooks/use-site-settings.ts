import { getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi("__root__");

export const useSiteSettings = () =>
  rootRoute.useRouteContext({ select: (context) => context.site });
