To add new commands create a new file in src/commands. See [yargs docs](https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module) for the format. The handlers all need to be in the same format as you see in the existing commands, or at least they need to guarantee resolve() is called.

Basic setup:

```
git clone https://github.com/AlexGodofsky/exalted-discord-mush.git
cd exalted-discord-mush
npm install
npm test
```