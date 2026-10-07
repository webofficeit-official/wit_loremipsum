import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

const LOREM_IPSUM_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam in arcu cursus euismod quis viverra nibh. Nunc aliquet bibendum enim facilisis gravida neque convallis a cras. Sagittis purus sit amet volutpat consequat mauris. Duis ultricies lacus sed turpis tincidunt id. Consequat interdum varius sit amet mattis vulputate. Enim sed faucibus turpis in eu. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel. Nulla pharetra diam sit amet nisl suscipit. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Dis parturient montes nascetur ridiculus mus. Justo nec ultrices dui sapien eget. Enim tortor at auctor urna nunc. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.';

export class LoremIpsum extends Plugin {
  static get pluginName() {
    return 'LoremIpsum';
  }

  init() {
    const editor = this.editor;

    // The button must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add('loremIpsum', locale => {
      const button = new ButtonView(locale);

      button.set({
        label: 'Lorem Ipsum',
        tooltip: true,
        withText: true
      });

      // Insert the text as its own paragraph at the user's current position
      button.on('execute', () => {
        editor.model.change(writer => {
          const paragraph = writer.createElement('paragraph');
          writer.insertText(LOREM_IPSUM_TEXT, paragraph);
          editor.model.insertContent(paragraph);
        });
        editor.editing.view.focus();
      });

      return button;
    });
  }
}

export default LoremIpsum;
