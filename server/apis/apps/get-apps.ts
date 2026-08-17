import { api, z, restApiIntegration } from "@superblocksteam/sdk-api";

const SUPERBLOCKS_API = "b514ad4a-0bfc-45ac-905c-c65b822c054c";

const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  isDeployed: z.boolean(),
  updated: z.string(),
});

const AppsResponseSchema = z.object({
  data: z.object({
    applications: z.array(AppSchema.passthrough()),
  }),
});

export default api({
  name: "GetApps",
  description: "Fetches all applications from the Superblocks API",

  integrations: {
    superblocks_api: restApiIntegration(SUPERBLOCKS_API),
  },

  input: z.object({}),

  output: z.object({
    apps: z.array(AppSchema),
  }),

  async run(ctx) {
    const result = await ctx.integrations.superblocks_api.apiRequest(
      {
        method: "GET",
        path: "/api/v2/applications",
      },
      { response: AppsResponseSchema },
      { label: "Fetch all applications" },
    );

    const apps = result.data.applications.map((app) => ({
      id: app.id,
      name: app.name,
      isDeployed: app.isDeployed,
      updated: app.updated,
    }));

    return { apps };
  },
});
