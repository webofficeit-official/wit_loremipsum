# TYPO3 Extension `wit_loremipsum`

Adds a **dummy text** button to the CKEditor 5 toolbar of the TYPO3 Rich Text Editor (RTE).
Editors choose the kind of dummy text from a dropdown and it is inserted at the current cursor position. This helps editors
and integrators to fill content elements quickly when building or testing layouts.

## Features

- Toolbar dropdown with icon: one sentence, one paragraph, three paragraphs, bulleted list, heading with text
- Dummy text language follows the content language of the record: German "Blindtext" for German content, Lorem Ipsum for all other languages
- Button labels in German or English, depending on the backend user language
- Inserts regular paragraphs, headings and lists, which can be edited and formatted like any other text
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

## Restrict access

By default all backend users see the button in every application context. You can restrict it in
**Admin Tools > Settings > Extension Configuration > wit_loremipsum**:

| Setting | Description | Default |
|---------|-------------|---------|
| `allowedContexts` | Comma-separated application contexts, e.g. `Development,Testing`. Sub contexts like `Development/Local` are included. Empty = all contexts. | empty |
| `allowedBackendGroups` | Comma-separated backend user group UIDs. Groups a user gets through subgroups count as well. Empty = all users. | empty |
| `alwaysAllowAdmins` | Administrators see the button regardless of their groups. The context restriction still applies. | on |

Both restrictions are combined: the button is shown only if the context **and** the user group are allowed.
If the button is not allowed, it is removed from the toolbar and the plugin is not loaded. This works with
every RTE preset, no separate presets are needed.

Example: only show the button on development and staging systems, not in production:

```php
// config/system/additional.php
$GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['wit_loremipsum']['allowedContexts'] = 'Development,Testing';
```

## Usage

1. Open a content element with a rich text field (for example "Text") in the TYPO3 backend.
2. Place the cursor where the text should go.
3. Click the dummy text icon in the editor toolbar ("Insert dummy text" / "Blindtext einfügen").
4. Choose the variant:

| Variant | Inserted content |
|---------|------------------|
| One sentence | One paragraph with one sentence |
| One paragraph | One paragraph with five sentences |
| Three paragraphs | Three paragraphs with five sentences each |
| Bulleted list | Bulleted list with four items (plain paragraphs if lists are disabled in the preset) |

If the cursor is inside existing text, the dummy text is added as new block(s) after the current block.
An empty block or selected text is replaced. Each insert is one undo step.
| Heading with text | Heading (`heading2`, otherwise `heading1` or `heading3`) and one paragraph |

The dummy text language follows the language of the edited record as configured in the site
configuration (German "Blindtext" for German, Lorem Ipsum for all other languages). This also works for
records in the default language, no extra configuration is needed.

Tip: TYPO3 sets the CKEditor content language (used e.g. for spell checking) of default language records
to `editor.config.defaultContentLanguage` (fallback: `en-US`). If your default language is not English,
also set it in your preset:

```yaml
editor:
  config:
    defaultContentLanguage: de
```

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
| `ext_conf_template.txt` | Extension settings for access restriction |
| `Classes/EventListener/AddDummyTextLanguage.php` | Passes the record language from the site configuration to the plugin |
| `Classes/EventListener/RestrictLoremIpsumButton.php` | Removes the button for contexts and user groups that are not allowed |
| `Configuration/RTE/Default.yaml` | Core default preset plus Lorem Ipsum button |
| `Configuration/RTE/Plugin.yaml` | Loads the CKEditor plugin, for use in custom presets |
| `Configuration/JavaScriptModules.php` | Registers the ES module `@woit/wit-loremipsum/lorem-ipsum.js` |
| `Resources/Public/JavaScript/Ckeditor/lorem-ipsum.js` | CKEditor 5 plugin with the toolbar dropdown and the dummy texts |

## Changelog

### 2.1.0

- Toolbar dropdown with five variants: sentence, paragraph, three paragraphs, bulleted list, heading with text
- German dummy text for German content, based on the record language from the site configuration
- Icon in the toolbar and German/English labels
- Restrict the button to application contexts (e.g. not in production) and backend user groups

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
