# TYPO3 Extension `wit_loremipsum`

Adds a **Lorem Ipsum** button to the CKEditor 5 toolbar of the TYPO3 Rich Text Editor (RTE).
One click inserts a paragraph of dummy text at the current cursor position. This helps editors
and integrators to fill content elements quickly when building or testing layouts.

## Features

- "Lorem Ipsum" button in the CKEditor toolbar
- Inserts the dummy text as a regular paragraph (`<p>`), which can be edited and formatted like any other text
- Works out of the box with the TYPO3 `default` RTE preset
- Can be added to any custom RTE preset with a single import

## Compatibility

| Extension version | TYPO3 | PHP  |
|-------------------|-------|------|
| 2.x               | 14    | 8.2+ |
| 1.x               | 12    | -    |

## Installation

### Composer

```bash
composer require woit/wit-loremipsum
```

Then set up the extension, for example with:

```bash
vendor/bin/typo3 extension:setup
```

### TYPO3 Extension Repository (TER)

Download the extension from https://extensions.typo3.org/extension/wit_loremipsum and activate it
in the Extension Manager.

After installation, flush all caches.

## Configuration

### Default RTE preset

The extension registers its own configuration as the `default` RTE preset:

```php
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:wit_loremipsum/Configuration/RTE/Default.yaml';
```

`Configuration/RTE/Default.yaml` imports the TYPO3 core default preset and adds the Lorem Ipsum
button at the end of the toolbar. All other settings of the core preset (headings, styles,
alignment, tables) stay the same.

Note: if another extension also sets the `default` preset, the extension that is loaded last wins.

### Custom RTE preset

If your site uses its own RTE preset (for example set via Page TSconfig `RTE.default.preset = my_preset`),
import the plugin configuration in your preset YAML and add `loremIpsum` to the toolbar:

```yaml
imports:
    - { resource: "EXT:rte_ckeditor/Configuration/RTE/Processing.yaml" }
    - { resource: "EXT:rte_ckeditor/Configuration/RTE/Editor/Base.yaml" }
    - { resource: "EXT:rte_ckeditor/Configuration/RTE/Editor/Plugins.yaml" }
    - { resource: "EXT:wit_loremipsum/Configuration/RTE/Plugin.yaml" }

editor:
  config:
    toolbar:
      items:
        # ... your other toolbar items
        - loremIpsum
```

`Configuration/RTE/Plugin.yaml` only loads the CKEditor plugin. It does not change the toolbar or
any other setting of your preset.

## Usage

1. Open a content element with a rich text field (for example "Text") in the TYPO3 backend.
2. Place the cursor where the text should go.
3. Click **Lorem Ipsum** in the editor toolbar.

The dummy text is inserted as a new paragraph.

## Upgrade from 1.x to 2.0

- TYPO3 14 is required. Stay on 1.x for TYPO3 12.
- The toolbar item name is `loremIpsum`. Check that your custom preset uses exactly this name.
- In custom presets, replace a manual `importModules` entry for `@woit/wit-loremipsum/lorem-ipsum.js`
  with the import of `EXT:wit_loremipsum/Configuration/RTE/Plugin.yaml`.
- The CKEditor plugin now imports from `@ckeditor/ckeditor5-core` and `@ckeditor/ckeditor5-ui`
  instead of the legacy `@typo3/ckeditor5-bundle.js`.

## File structure

| File | Purpose |
|------|---------|
| `ext_localconf.php` | Sets the `default` RTE preset |
| `Configuration/RTE/Default.yaml` | Core default preset plus Lorem Ipsum button |
| `Configuration/RTE/Plugin.yaml` | Loads the CKEditor plugin, for use in custom presets |
| `Configuration/JavaScriptModules.php` | Registers the ES module `@woit/wit-loremipsum/lorem-ipsum.js` |
| `Resources/Public/JavaScript/Ckeditor/lorem-ipsum.js` | CKEditor 5 plugin with the toolbar button |

## Changelog

### 2.0.0

- TYPO3 14 compatibility (TYPO3 12 support dropped)
- CKEditor imports changed from the legacy bundle to `@ckeditor/ckeditor5-*` modules
- Dummy text is inserted as a regular paragraph
- Fixed typos and missing spaces in the dummy text
- New `Configuration/RTE/Plugin.yaml` for custom presets
- `Default.yaml` now builds on the TYPO3 core default preset

### 1.0.1

- Documentation

### 1.0.0

- Initial release for TYPO3 12

## License

GPL-2.0-or-later
