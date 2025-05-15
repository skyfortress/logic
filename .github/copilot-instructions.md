don't include comments in code, unless it's absolutely not clear what that code does
don't use JSdoc
don't add methods that are not being used
avoid duplicated code, refactor it into separated methods when needed
move types and interfaces into types.ts within related module
don't create type if it already exists, reuse it
don't create unused types.
don't create one line IFs, always use braces
make sure you keep separation of concerns
don't use any always try to use proper types
don't use default values for localization messages, instead add proper localization into messages/en/index.json and messages/ua/index.json