export class CliError extends Error {
  constructor(public readonly exitCode = 1, message?: string) {
    super(message ?? 'an error occurred while executing this program');
  }
}

export class LinterError extends CliError {}
