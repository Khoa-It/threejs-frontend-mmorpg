import { MODELS } from "../assets.js";
import { DistanceManager } from "../manager_system/DistanceManager.js";
import { Notification } from "../manager_system/NotificationManager.js";
import { NpcManager } from "../manager_system/NpcManager.js";
import { UserManager } from "../manager_system/UserManager.js";
import { ModelLoader } from "../modules/ModelLoader.js";
import { GraphicModelManager } from "../modules/three_model_manager.js";

export class NPC {
    constructor(graphicWorld, id) {
        this.graphicWorld = graphicWorld;
        this.id = id;
        ModelLoader.loadGtlfFile(
            MODELS[id].url,
            this.graphicWorld.scene, MODELS[id].position,
            MODELS[id].scale,
            null,
            id
        );
        this.currentLineIndex = 0;
        console.log(this.currentLineIndex);

        this.name = NpcManager.getNpcNameById(id);
        this.story = NpcManager.getNpcStoryById(id);

        this.notification = new Notification(`${this.name}`, 0, 0.5, id);
        this.selector = {
            story_owner: '#js-story-owner',
            story_content: '#js-story-content',
            story: '.story',
            story_btn: '#js-story-btn',
        }
        this.statusChildComponent = {
            notification: false,
            story: false,
        }
        this.setEvent();
    }

    setEvent() {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() == 'f' && this.notification.status) {
                this.notification.hide();
                this.showStory();
                this.statusChildComponent.story = true;
            }
        })
        $(this.selector.story_btn).click((e) => {
            e.preventDefault();
            if (this.statusChildComponent.story) this.showStory();
        });
    }

    isAllConditionTrue() {
        const checkKeys = [this.id, 'woman_warior'];
        let result = checkKeys.every((key) => GraphicModelManager.model[key] != undefined);
        return result;
    }

    showStory() {
        console.log('click');
        
        if (this.currentLineIndex == this.story.length) {
            this.currentLineIndex = 0;
            $(this.selector.story).removeClass('show');
            $(this.selector.story).addClass('hide');
            this.statusChildComponent.story = false;
            return;
        }
        if (this.currentLineIndex == 0) {
            $(this.selector.story).removeClass('hide');
            $(this.selector.story).addClass('show');
        }
        $(this.selector.story_owner).text(this.name);
        $(this.selector.story_content).text(this.story[this.currentLineIndex++]);
    }

    update(deltaTime) {
        if (!this.isAllConditionTrue()) return;
        const distance = DistanceManager.calculateDistance(this.id, UserManager.getCurrentCharId());
        this.notification.update(distance);
    }
}