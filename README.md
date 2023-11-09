# TYPO3 Extension `wit_loremipsum`

Our new TYPO3 extension generated dummy lorem ipsum for your rte ckeditor.

## Installation

Install this extension via `composer req woit/wit-loremipsum` and activate
the extension in the Extension Manager of your TYPO3 installation.

## Adding to your own sitepackage

For use dummy lorem ipsum, add the below code inside `ext_localconf.php`

```php
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:wit_loremipsum/Configuration/RTE/Default.yaml';
```