export const environment = {
  production: false,
  repoUrl: 'https://api.github.com/repos/Brickable/API-DOC-MarkdownDocumentation', // [TWEAKING POINT] - change var to your repository.
  branch: 'AllowLanguageBranch', // [TWEAKING POINT] - change var to repository branch name you want to target.

  markdownRoot: 'markdown',
  configFileRoot: 'config.json',
  dictionaireRoot: 'dictionaire.csv',
<<<<<<< HEAD
  dictionaireKeyName: 'key',
  useDictionaire: true,
  useUnderscoreToSpaceConvention: true,
=======
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
  KeyForLanguageDictionaire: 'language',
  keyForVersionDictionaire: 'version',

>>>>>>> develop
  toastSettings: {
    timeOut: 3000,
    easing: 'ease-in',
    positionClass: 'toast-top-center',
<<<<<<< HEAD
    easeTime : 500
  },
  defaultToastMessages: {
    invalidUrl: 'The provided url has no match on selected version/language. System redirected you to the version root page.',
=======
    easeTime: 500
  },
  useUnderscoreToSpaceConvention: true,
  defaultTranslations: {
    language: 'language',
    version: 'version',
    invalidUrlMsg: 'The provided url has no match on selected version/language. System redirected you to the version root page.',
>>>>>>> develop
  }
};
