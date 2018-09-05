export const environment = {
  production: true,
  repoUrl: 'https://api.github.com/repos/Brickable/Guidebookme-MarkdownDocumentation', // [TWEAKING POINT] - change var to your repository.
  branch: 'AllowVersioningLanguageAndDictionaire', // [TWEAKING POINT] - change var to repository branch name you want to target.

  markdownRoot: 'markdown',
  configFileRoot: 'config.json',
  dictionaireRoot: 'dictionaire.csv',
  csvColumnSeperator: ',',
  dictionaireKeyName: 'key',
  queryParamValueVersion: 'v',
  queryParamValueLanguage: 'lang',

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

  toastSettings: {
    timeOut: 3000,
    easing: 'ease-in',
    positionClass: 'toast-top-center',
    easeTime: 500
  },
  useUnderscoreToSpaceConvention: true,
  defaultTranslations: {
    language: 'language',
    version: 'version',
    invalidUrlMsg: 'The provided url has no match on selected version/language. System redirected you to the version root page.',
  }
};
