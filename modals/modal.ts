import test from "node:test";
import { App, FuzzySuggestModal, Modal, Notice, Setting } from "obsidian";
import { stringify } from "querystring";
//TODO: Modal that receives one word, shows it asks for translation and return pair of words. made some testing changes

export class NewWordModal extends Modal {
  result: string; 
  word : string;
  onSubmit: (result: string) => void;

  constructor(app: App, word: string, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
    this.word = word; 
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: `${this.word}` });

    new Setting(contentEl)
      .setName("Translation : ")
      .addText((text) =>
        text.onChange((value) => {
          this.result = value
        }));

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Add")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
          }));
    this.scope.register([],'Enter', (evt : KeyboardEvent)=>{
        if(evt.isComposing) return
        evt.preventDefault()
        evt.stopPropagation()
        const actionButton = document.getElementsByClassName("mod-cta")
        .item(0) as HTMLButtonElement | null;
        actionButton?.click()
    })
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}





