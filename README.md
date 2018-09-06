![logo](http://oi65.tinypic.com/10pydkh.jpg)
# Guidebook me

## App Sample
https://guidebookme.azurewebsites.net/

## Why?

Are you a developer or a technical writer tired to document your app guides in word files or have crazy complex documentation content approval workflow? - You might want to take a look at this project.

## What?

Guidebook me is a documentation site generator.
This project prupose an easy way to document any content structured guide like an API's or a software manual guide for instance.
It allow Technical writers to update and manage documentation on a github repository without the need of rebuild or change the documentation site.

Guidebook me allows versioning documentation and multi language as well.

## How?
- Create your Github repository for the documentation following convention based rules of this project.
- Clone Guidebook me, reference your documentation repository, edit the rest of your so desired configurations and deploy it.
- Keep updating your documentation repo :)

## Configurable properties

Configurable properties names can be changed on enviroment files. Default names and values for configurable properties:

|Name|Type|Default value|
|---|---|---|
|enableMultiLanguage|bool|false|
|enableVersioning|bool|false|
|enableDictionaires|bool|false|
|defaultVersion|string|""|
|defaultLanguage|string|""|
|versions|string[]|[]|
|languages|string[]|[]|

Current markdown root folder will depend on 2 values you choose on your configurations (enableMultiLanguage & enableVersioning).

- (enableVersioning == false && enableMultiLanguage == false)
  - markdownRoot = markdownFolder
- (enableVersioning == true && enableMultiLanguage == false)
  - markdownRoot = markdownFolder/SelectedVersion
- (enableVersioning == false && enableMultiLanguage == true)
  - markdownRoot = markdownFolder/SelectedLanguage
- (enableVersioning == true && enableMultiLanguage == false)
  - markdownRoot = markdownFolder/SelectedVersion/SelectedLanguage

## Documentation repo and app conventions

### Typical Folder structure:
- root
  - Markdown folder
  - Configuration file (.json)
  - Dictionaire file (.csv) (optional)

In a nutchell, Guidebook me will look at your markdown folder structure and try to reason what to:

- Set your markdownRoot based on your config props / query params.
- Display folders on side tree view (markdownRoot folders that contain subfolders)
- Display file/collection of related files on side tree view (markdownRoot folders that only contain files)
- Depending on current url, guess the collection of files to select and display in the main container. Each markdown document will be reflected as a tab on guidebook main page.
- If you are on root, Guidebook me try to show the collection of files that are on root folder.

### Conventions:
- Versioning is always 1 folder level above language. Meaning that if you enable both versioning and multilanguage, the folder for each language will be inside of the respective version.
- if you enable 'enableMultiLanguage', property 'languages' must have exacly a collection with language folders names that exist. 'defaultLanguage' property must have one value belonging to 'languages'.
- if you enable 'enableVersioning', property 'versions' must have exacly a collection with version folders names that exist. 'defaultVersion' property must have one value belonging to 'versions'.
- By default every folder and file name, for display purposes, Guidebook me follow 'underscoreToSpaceConvention'. This Convention works nice on some languages like english. But if you have the requirement to use another language or even multilanguage, you must make use of Dictionaire feature.
- You can see Dictionaire as an excel file where the first column is a key and the next rows are the corresponding value in each languages you have enabled.

## Extra Info
When you clone this project, by default the app configs are atached to 
https://github.com/Brickable/Guidebookme-MarkdownDocumentation.
This repo intend to have a folder structure and configurations that match with guidebook me conventions. Each Branch has a different set of configurations.

## Future Developments
- Testing the application
- Provide authentication capabilities for access to private repositories
- Provide the same services for Bitbucket.
