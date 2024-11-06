import { NPC_DATA } from "../web_data/NpcData.js";

export class NpcManager {
    static data = NPC_DATA;

    static getNpcNameById(npcId){
        return this.data[npcId].name;
    }

    static getNpcStoryById(npcId){
        return this.data[npcId].story;
    }

}