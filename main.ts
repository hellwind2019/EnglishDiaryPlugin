import { link } from "fs";
import { NewWordModal, SuggestModalTest } from "modals/modal";
import { App, Editor, MarkdownView, Modal, Plugin, Setting, Vault, Notice, FuzzySuggestModal, TFile } from "obsidian";
import * as internal from "stream";
export default class EnglishDiaryPlugin extends Plugin {
    settings: MyPluginSettings

    async onload() { //Runs when user enables plugin
        await this.loadSettings()
        initFolders(this)
        //Starting a new lesson TODO: refactor as another function
        this.addRibbonIcon("pen", "Start a new lesson", async () => {
            let lessonsFolder =
                this.app.vault.getFolderByPath(this.settings.lessonsPath)
                console.log(lessonsFolder)
            let lessonsCount = lessonsFolder?.children.length! + 1;
           const newLessonPath = `${this.settings.lessonsPath}/Lesson ${lessonsCount}.md` 
            const newLesson = await this.app.vault.create(newLessonPath, "")
            
            this.app.workspace.iterateAllLeaves((leaf) => {
                console.log(leaf.getViewState().state)
                if (leaf.getViewState().type == "markdown" || leaf.getViewState().type == "empty") {

                    leaf.openFile(newLesson);
                }
            })
            new NewWordModal(this.app, "Test", (result)=>{
                new Notice(result)
            }).open() 
            //Adding a link ot a FullDiary
            const fullDiary = this.app.vault.getFileByPath(this.settings.fullDiaryPath)!
            addLinkToFullDiary(this.app.vault,fullDiary,newLessonPath )
        })
        this.app.vault.on("modify", (ref) => {
            console.log(`File name is ${ref.name}`);
            const file = this.app.vault.getFileByPath(ref.path)!
            const cache = this.app.metadataCache.getFileCache(file)
            console.log(cache?.frontmatter);

        })
    } async onunload() {
        console.log('Unlo1ad')
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }


}
function insertNewWord(vault : Vault, diary : TFile, word : String){
    
}
async function addLinkToFullDiary(vault : Vault, file: TFile, link : string) : Promise<void>{
    const fullDiaryContent = await vault.read(file)
    return vault.modify(file, `${fullDiaryContent}\n![[${link}]]`)
}
function initFolders(plugin: EnglishDiaryPlugin) {
    if (plugin.app.vault.getFolderByPath(plugin.settings.rootPath) == null) {
        plugin.app.vault.createFolder(plugin.settings.rootPath)
        plugin.app.vault.createFolder(plugin.settings.lessonsPath)
        plugin.app.vault.create(plugin.settings.fullDiaryPath, "This is FullDiary",)
        plugin.app.vault.create(plugin.settings.wordsPath, "This is words",)
        plugin.app.vault.create(plugin.settings.statsPath, "This is stats",)


    }
}
interface MyPluginSettings {
    rootPath: string;
    lessonsPath: string;
    fullDiaryPath: string;
    wordsPath: string;
    statsPath: string;
}
const DEFAULT_ROOT : string = "EnglishDiary"
const DEFAULT_SETTINGS: MyPluginSettings = {
    rootPath: DEFAULT_ROOT,
    lessonsPath: DEFAULT_ROOT + '/Lessons',
    fullDiaryPath: DEFAULT_ROOT +'/FullDiary.md',
    wordsPath: DEFAULT_ROOT +"/Words.md",
    statsPath: DEFAULT_ROOT +"/Stats.md"
}
const DiaryParams = {

}