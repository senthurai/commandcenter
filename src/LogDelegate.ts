 
export enum LogLevel {
    VERBOSE = 0,
    INFO = 10,
    DEBUG = 20,
    WARN = 30,
    ERROR = 40
}
export abstract class LogDelegate {
    level: LogLevel = LogLevel.WARN;

    setLevel(level: LogLevel): void {
        this.level = level;
    }

    constructor(private name: string) {

    };

    verbose(message: string): void {
        this.level <= LogLevel.VERBOSE && this.log(message);
    }

    abstract log(message: string): void;

    info(caller: any, message: string): void {
        this.level <= LogLevel.ERROR && this.log(this.format(caller, message));
    }
    format(caller: any, message: string): string {
        return this.name + ": " + caller.prototype.name + ": " + message;
    }

    warn(message: string): void {
        this.level <= LogLevel.WARN && this.log(message);
    }

    error(message: string): void {
        this.level <= LogLevel.ERROR && this.log(message);
    }

    debug(message: string): void {
        this.level <= LogLevel.ERROR && this.log(message);
    }

}