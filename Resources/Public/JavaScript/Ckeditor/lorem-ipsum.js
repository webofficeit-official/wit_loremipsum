import { Core, UI } from '@typo3/ckeditor5-bundle.js';

export default class LoremIpsum extends Core.Plugin {
  static pluginName = 'LoremIpsum';

  init() {
    const editor = this.editor;

    // The button must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add(LoremIpsum.pluginName, () => {
      // The button will be an instance of ButtonView.
      const button = new UI.ButtonView();

      button.set({
        label: 'Lorem Ipsum',
        withText: true
      });

      //Execute a callback function when the button is clicked
      button.on('execute', () => {
        //Change the model using the model writer
        editor.model.change(writer => {
          
          const loremIpsumText = `Lorems ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam in arcu cursus euismod quis viverra nibh. Nunc aliquet bibendumenim facilisis gravida neque convallis a cras. Sagittis purus sit amet volutpatConsequat mauris. Duis ultricies lacus sed turpis tincidunt id. Consequat interdumvarius sit amet mattis vulputate. Enim sedfaucibus turpis in eu. Ridiculus mus maurisvitae ultricies leo integer malesuada nunc vel.Nulla pharetra diam sit amet nisl suscipit.Lobortis elementum nibh tellus molestie nuncnon blandit massa enim. Dis parturient montesnascetur ridiculus mus. Justo nec ultrices duisapien eget. Enim tortor at auctor urna nunc.Dictumst quisque sagittis purus sit amet volutpatconsequat mauris nunc.`;

          //Insert the text at the user's current position
          const loremIpsum = writer.createElement( 'loremIpsum' );
          const loremIpsumTitle = writer.createElement( 'loremIpsumTitle' );
          const loremIpsumDescription = writer.createElement( 'loremIpsumDescription' );

          // insert default value
          writer.insertText(loremIpsumText, loremIpsumTitle)

          writer.append( loremIpsumTitle, loremIpsum );
          writer.append( loremIpsumDescription, loremIpsum );

          // There must be at least one paragraph for the description to be editable.
          writer.appendElement( 'paragraph', loremIpsumDescription );
          editor.model.insertContent(loremIpsum);
        });
      });

      return button;
    });
  }
}