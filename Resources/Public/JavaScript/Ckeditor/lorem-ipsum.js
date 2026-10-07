import { Plugin } from '@ckeditor/ckeditor5-core';
import { UIModel, createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui';
import { Collection, uid } from '@ckeditor/ckeditor5-utils';

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M3 4h14v1.5H3zm0 3.5h14V9H3zm0 3.5h14v1.5H3zm0 3.5h9V16H3z"/></svg>';

// Dummy text per content language, as list of sentences
const TEXTS = {
  en: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Diam in arcu cursus euismod quis viverra nibh.',
    'Nunc aliquet bibendum enim facilisis gravida neque convallis a cras.',
    'Sagittis purus sit amet volutpat consequat mauris.',
    'Duis ultricies lacus sed turpis tincidunt id.',
    'Consequat interdum varius sit amet mattis vulputate.',
    'Enim sed faucibus turpis in eu.',
    'Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel.',
    'Nulla pharetra diam sit amet nisl suscipit.',
    'Lobortis elementum nibh tellus molestie nunc non blandit massa enim.',
    'Dis parturient montes nascetur ridiculus mus.',
    'Justo nec ultrices dui sapien eget.',
    'Enim tortor at auctor urna nunc.',
    'Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.',
    'Pellentesque habitant morbi tristique senectus et netus et malesuada fames.'
  ],
  de: [
    'Dies ist ein Blindtext, der nur als Platzhalter für den späteren Inhalt dient.',
    'Er zeigt, wie Schrift, Absätze und Zeilenlängen auf der Seite wirken.',
    'An dieser Stelle steht später ein Text, der Besucherinnen und Besucher informiert.',
    'Bis dahin hilft dieser Absatz dabei, das Layout realistisch zu beurteilen.',
    'Zusammengesetzte Wörter wie Gemeindeveranstaltungskalender zeigen, wie lange Begriffe umbrechen.',
    'Kurze Sätze wirken anders als lange.',
    'Deshalb enthält dieser Blindtext Sätze in unterschiedlicher Länge, damit die Darstellung möglichst nah an echten Inhalten liegt.',
    'Umlaute wie ä, ö und ü sowie das ß sollten korrekt angezeigt werden.',
    'Bitte ersetzen Sie diesen Text vor der Veröffentlichung durch den endgültigen Inhalt.',
    'Ein guter Text ist klar gegliedert und leicht zu lesen.',
    'Überschriften helfen dabei, den Inhalt schnell zu erfassen.',
    'Listen eignen sich gut, um mehrere Punkte übersichtlich darzustellen.',
    'Absätze geben dem Text Struktur und erleichtern das Lesen am Bildschirm.',
    'Auch auf kleinen Bildschirmen sollte der Text gut lesbar bleiben.',
    'Dieser Platzhalter endet hier.'
  ]
};

const HEADINGS = {
  en: 'Lorem ipsum dolor sit amet',
  de: 'Überschrift als Platzhalter'
};

const LABELS = {
  en: {
    button: 'Insert dummy text',
    sentence: 'One sentence',
    paragraph: 'One paragraph',
    paragraphs: 'Three paragraphs',
    list: 'Bulleted list',
    headingText: 'Heading with text'
  },
  de: {
    button: 'Blindtext einfügen',
    sentence: 'Ein Satz',
    paragraph: 'Ein Absatz',
    paragraphs: 'Drei Absätze',
    list: 'Aufzählung',
    headingText: 'Überschrift mit Text'
  }
};

const VARIANTS = ['sentence', 'paragraph', 'paragraphs', 'list', 'headingText'];

function languageKey(language, available) {
  const key = String(language || '').toLowerCase().split(/[-_]/)[0];
  return available[key] ? key : 'en';
}

export class LoremIpsum extends Plugin {
  static get pluginName() {
    return 'LoremIpsum';
  }

  init() {
    const editor = this.editor;
    const labels = LABELS[languageKey(editor.locale.uiLanguage, LABELS)];

    // The dropdown must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add('loremIpsum', locale => {
      const dropdown = createDropdown(locale);

      dropdown.buttonView.set({
        label: labels.button,
        icon: ICON,
        tooltip: true
      });

      const items = new Collection();
      VARIANTS.forEach(variant => {
        items.add({
          type: 'button',
          model: new UIModel({
            variant,
            label: labels[variant],
            withText: true
          })
        });
      });
      addListToDropdown(dropdown, items);

      dropdown.on('execute', evt => {
        this.insert(evt.source.variant);
        editor.editing.view.focus();
      });

      return dropdown;
    });
  }

  insert(variant) {
    const editor = this.editor;
    const schema = editor.model.schema;
    // Language from the site configuration (set by the extension), otherwise the editor content language
    const configured = editor.config.get('loremIpsum') || {};
    const lang = languageKey(configured.language || editor.locale.contentLanguage, TEXTS);
    const sentences = TEXTS[lang];
    const paragraph = (from, count) => sentences.slice(from, from + count).join(' ');

    editor.model.change(writer => {
      const fragment = writer.createDocumentFragment();
      const append = (name, text, attributes = {}) => {
        const element = writer.createElement(name, attributes);
        writer.insertText(text, element);
        writer.append(element, fragment);
      };

      switch (variant) {
        case 'sentence':
          append('paragraph', sentences[0]);
          break;
        case 'paragraphs':
          append('paragraph', paragraph(0, 5));
          append('paragraph', paragraph(5, 5));
          append('paragraph', paragraph(10, 5));
          break;
        case 'list':
          if (schema.checkAttribute(['$root', 'paragraph'], 'listType')) {
            sentences.slice(0, 4).forEach(sentence => {
              append('paragraph', sentence, { listItemId: uid(), listType: 'bulleted', listIndent: 0 });
            });
          } else {
            sentences.slice(0, 4).forEach(sentence => append('paragraph', sentence));
          }
          break;
        case 'headingText': {
          const heading = ['heading2', 'heading1', 'heading3'].find(name => schema.isRegistered(name)) || 'paragraph';
          append(heading, HEADINGS[lang]);
          append('paragraph', paragraph(0, 5));
          break;
        }
        default:
          append('paragraph', paragraph(0, 5));
      }

      // Cursor inside existing text: add the dummy text as new block(s) after the current block
      // instead of merging it into the text. Empty blocks and selections are replaced.
      const selection = editor.model.document.selection;
      const block = Array.from(selection.getSelectedBlocks()).pop();
      if (selection.isCollapsed && block && !block.isEmpty) {
        editor.model.insertContent(fragment, writer.createPositionAfter(block));
      } else {
        editor.model.insertContent(fragment);
      }
    });
  }
}

export default LoremIpsum;
