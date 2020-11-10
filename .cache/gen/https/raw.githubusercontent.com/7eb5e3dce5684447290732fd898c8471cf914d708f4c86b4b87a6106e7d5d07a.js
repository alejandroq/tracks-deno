import { log } from "../deps.ts";
export { log };
let isDebug = false;
export function debug(func) {
    if (isDebug) {
        func();
    }
}
export async function config(config) {
    isDebug = config.debug;
    await log.setup({
        handlers: {
            console: new log.handlers.ConsoleHandler(config.debug ? "DEBUG" : "INFO"),
            file: new log.handlers.FileHandler("WARNING", {
                filename: config.logFile,
                formatter: "{levelName} {msg}",
            }),
        },
        loggers: {
            default: {
                level: "DEBUG",
                handlers: ["console", "file"],
            },
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFakMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBRWYsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBR3BCLE1BQU0sVUFBVSxLQUFLLENBQUMsSUFBYztJQUNsQyxJQUFJLE9BQU8sRUFBRTtRQUNYLElBQUksRUFBRSxDQUFDO0tBQ1I7QUFDSCxDQUFDO0FBR0QsTUFBTSxDQUFDLEtBQUssVUFBVSxNQUFNLENBQUMsTUFBMkM7SUFDdEUsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDdkIsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ2QsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDekUsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO2dCQUM1QyxRQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQ3hCLFNBQVMsRUFBRSxtQkFBbUI7YUFDL0IsQ0FBQztTQUNIO1FBRUQsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRSxPQUFPO2dCQUNkLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7YUFDOUI7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMifQ==