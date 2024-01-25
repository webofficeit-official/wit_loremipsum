# TYPO3 Extension `wit_loremipsum`

The wit_loremipsum TYPO3 extension enhances the functionality of the Rich Text Editor (RTE) CKEditor by seamlessly integrating a dedicated "Add Lorem Ipsum" button. This feature simplifies the content creation process by providing users with a convenient tool for generating succinct paragraphs of Lorem Ipsum text, facilitating the visualization and formatting of layouts.

## Key Features:

Effortless Integration: Following installation via the TYPO3 Extension Manager, the extension seamlessly incorporates an "Add Lorem Ipsum" button into the RTE CKEditor interface.

Real-Time Preview: The extension offers an instant preview of the generated Lorem Ipsum text within the CKEditor, providing users with a live representation of the content structure.

Enhanced Productivity: By eliminating the need to search for external Lorem Ipsum text, the extension significantly streamlines the content creation process for web developers, content creators, and editors.

## Installation

Composer Installation: Install this extension via `composer req woit/wit-loremipsum` and activate the extension in the Extension Manager of your TYPO3 installation.

Ter Installation: Install the wit_loremipsum extension directly from the TYPO3 Extension Repository (TER).

Default Configuration: The extension seamlessly integrates into the default TYPO3 configuration, adding the "Add Lorem Ipsum" button to the CKEditor toolbar.

Custom Presets: For users with custom RTE configurations, the extension supports easy integration. Replace "default" with your custom RTE configuration to tailor the experience to your specific needs.

## Adding to your own sitepackage

For use dummy lorem ipsum, add the below code inside `ext_localconf.php`

```php
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:wit_loremipsum/Configuration/RTE/Default.yaml';
```

replace `default` with your custom RTE configurations.