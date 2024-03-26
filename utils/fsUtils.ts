import { TFile, Vault } from "obsidian";

export async function addNewLineToFile(vault : Vault, file : TFile, line : string){
    vault.process(file, (data) =>{
        const result = data + `\n${line}`
        return result;
    })
    // const content = await vault.read(file)
    // return vault.modify(file, `${content}\n${line}`)
} 