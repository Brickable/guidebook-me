export const environment = {
  production: false,
  repoUrl: 'https://api.github.com/repos/Brickable/API-DOC-MarkdownDocumentation',
  branch: 'AllowLanguageBranch',

  markdownRoot: 'markdown',
  configFileRoot: 'config.json',
  dictionaireRoot: 'dictionaire.csv',
  csvColumnSeperator: ',',
  dictionaireKeyName: 'key',

  keyForEnableMultiLanguage: 'enableMultiLanguage',
  keyForEnableVersion: 'enableVersioning',
  keyForEnableDictionaires: 'enableDictionaires',
  keyForDefaultVersion: 'defaultVersion',
  keyForDefaultLanguage: 'defaultLanguage',
  keyForVersions: 'versions',
  keyForLanguages: 'languages',
  keyForInvalidUrlMessageDictionaire: 'invalidUrlMsg',

  toastSettings: {
    timeOut: 3000,
    easing: 'ease-in',
    positionClass: 'toast-top-center',
    easeTime: 500
  },
  useUnderscoreToSpaceConvention: true,
  defaultToastMessages: {
    invalidUrl: '...The provided url has no match on selected version/language. System redirected you to the version root page.',
  }
};
