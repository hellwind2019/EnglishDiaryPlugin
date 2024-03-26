 import { strict } from "assert";
import EnglishDiaryPlugin, { insertNewWord } from "main";
import { NewWordModal } from "modals/modal";
import { Command, Editor, Hotkey, MarkdownFileInfo, MarkdownView, Plugin, loadPdfJs } from "obsidian";
import { addNewLineToFile } from "utils/fsUtils";
export function AddNewWordCommand(plugin : EnglishDiaryPlugin){
    plugin.addCommand(new newWordCommand(plugin)) 
}
export class newWordCommand implements Command{
    id: string;
    name: string;
    icon?: string | undefined;
    mobileOnly?: boolean | undefined;
    repeatable?: boolean | undefined;
    callback?: (() => any) | undefined;
    checkCallback?: ((checking: boolean) => boolean | void) | undefined;
    editorCallback?: ((editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => any) | undefined;
    editorCheckCallback?: ((checking: boolean, editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => boolean | void) | undefined;
    hotkeys?: Hotkey[] | undefined;
    constructor(plugin : EnglishDiaryPlugin){
        this.id = "add-new-word"
        this.name = "Add word"
        this.editorCallback = (editor, ctx) =>{
            const selection = editor.getSelection()
            new NewWordModal(plugin.app, selection, (translation) =>{
                const dictionaryFile = plugin.app.vault.getFileByPath(plugin.settings.wordsPath)
                addNewLineToFile(plugin.app.vault, dictionaryFile!, `|${selection}|${translation}|`) 
            }).open()
        }

        
    }
    
}