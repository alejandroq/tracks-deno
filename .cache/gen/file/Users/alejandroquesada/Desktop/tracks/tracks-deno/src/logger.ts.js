import { log } from "./deps.ts";
await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("DEBUG"),
    },
    loggers: {
        default: {
            level: "DEBUG",
            handlers: ["console"],
        },
    },
});
export const logger = log.getLogger();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFaEMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ2QsUUFBUSxFQUFFO1FBQ1IsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO0tBQ2xEO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFO1lBQ1AsS0FBSyxFQUFFLE9BQU87WUFDZCxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FDdEI7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMifQ==