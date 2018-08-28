export const environment = {
  production: false,
  repoUrl: 'https://api.github.com/repos/Brickable/API-DOC-MarkdownDocumentation',
  branch: 'AllowLanguageBranch',
  markdownRoot: 'markdown',
  configFileRoot: 'config.json',
  dictionaireRoot: 'dictionaire.csv',
  dictionaireKeyName: 'key',
  useDictionaire: true,
  useUnderscoreToSpaceConvention: true,
  toastSettings: {
    timeOut: 3000,
    easing: 'ease-in',
    positionClass: 'toast-top-center',
    easeTime : 500
  },
  defaultToastMessages: {
    invalidUrl: 'The provided url has no match on selected version/language. System redirected you to the version root page.',
  }
};
