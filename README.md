![logo](http://oi65.tinypic.com/10pydkh.jpg)
# GuideMeBook

## App Sample
https://guidebookme.azurewebsites.net/index.html

## Why?

Technical writing is part of your job? Are you tired to document your Guides in word documents or have crazy complex documentation content approval workflow? - You might want to take a look at this project.

## What?

GuideMeBook is a documentation site generator.
This project prupose an easy way to document any content structured guide (like an API's or a software manual guide for instance).
It allow Technical writers to update and manage documentation on a github repository without the need of rebuild or change the documentation site.
The basic idea behind is setting up a site based on this project, create a Github Repo for documentation, and manage all documentation worflow from this Git repo.

GuideMeBook allows versioning documentation and multi language as well.

## How?
- Create your Github repository for the managing the documentation workflow following convention based rules of this project.
- Clone GuideMeBook, reference your documentation repository, edit the rest of your so desired configurations and deploy it.

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

In a nutchell, GuideMeBook will look at your markdown folder structure and try to:

- Set your markdownRoot based on your config props / query params.
- Display folders on side treeview (from markdownRoot, folders that contain subfolders)
- Display file/collection of related files on side treeview (from markdownRoot, folders that only contain files)
- Depending on current url, guess the collection of files to select and display in the main container. Each markdown document will be reflected as a tab on guidebook main page.
- If you are at the root, GuideMeBook try to show the collection of files that are on root folder.

### Conventions:
- Versioning is always 1 folder level above language. Meaning that if you enable both versioning and multilanguage, the folder for each language must be inside of the respective version.
- If you enable 'enableMultiLanguage', property 'languages' must have a collection with language folders names that exist. 'defaultLanguage' property must have one value belonging to 'languages'.
- If you enable 'enableVersioning', property 'versions' must have a collection with version folders names that exist. 'defaultVersion' property must have one value belonging to 'versions'.
- By default and for displaying purposes, every folder and file name follow 'underscoreToSpaceConvention'. This Convention works nice on some languages like english. But if you have a requirement to use another language or even multilanguage, you must make use of Dictionaire feature.
- You can see Dictionaire as an excel file where the first column is a key and the next rows are the corresponding value in each languages you have enabled.

## Extra Info
When you clone this project, by default the app configs are atached to 
https://github.com/Brickable/Guidebookme-MarkdownDocumentation.
This repo intend to have a folder structure and configurations that match with guidebook me conventions. Each Branch of this repository has a different set of configurations.

## Future Developments
- Testing the application
- Provide searching capabilities feature
- Provide authentication capabilities for access into private repositories
- Provide the same services for Bitbucket.
