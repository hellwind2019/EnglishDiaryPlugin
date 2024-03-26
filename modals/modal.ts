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





export class SuggestModalTest extends FuzzySuggestModal<Book> {
    public title: string; //
    constructor(app: App, testTitle : string){
        super(app)
        this.title = testTitle
    }
    getItems(): Book[] {
        return ALL_BOOKS;
    }

    getItemText(book: Book): string {
        return this.title; }

    onChooseItem(book: Book, evt: MouseEvent | KeyboardEvent) {
        new Notice(`Selected ${book.title}`);
        if(book.title == "Add new book"){
            new SampleModal(this.app).open()
        }
    }
}
interface Book {
    title: string;
    author: string;
}

const ALL_BOOKS = [
    {
        title: "How to Take Smart Notes",
        author: "Sönke Ahrens",
    },
    {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
    },
    {
        title: "Deep Work",
        author: "Cal Newport",
    },
    {
        title: "Add new book",
        author: ""
    }
];
class SampleModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.setText('Woah!');
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export class ExampleModal extends Modal {
    result: string;
    onSubmit: (result: string) => void;

    constructor(app: App, onSubmit: (result: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.createEl("h1", { text: "What's your name?" });

        new Setting(contentEl)
            .setName("Name")
            .addText((text) =>
                text.onChange((value) => {
                    this.result = value
                }));

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Submit")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.onSubmit(this.result);
                    }));
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}