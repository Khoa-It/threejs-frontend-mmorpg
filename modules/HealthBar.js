import { MODELS } from "../assets.js";

export class HealthBar {
    constructor() {
        this.htmlElement = document.createElement('div');
        this.htmlElement.className = 'bottom-healthbar';
        document.body.appendChild(this.htmlElement);

        this.htmlElementInner = document.createElement('div');
        this.htmlElement.appendChild(this.htmlElementInner);
        this.htmlElementInner.id = 'bottom-hp-healthbar';
        this.bottom_hp_selector = '#bottom-hp-healthbar';
    }
}

export class CharacterHealthbar extends HealthBar {
    constructor(name) {
        super();
        this.right_hp_selector = `#hp-${name}`;
        $('#characters').append(
            `<div class="char">
                <div class="right-container">
                    <p class="name">${name}</p>
                    <div class="healthbar">
                        <div id="hp-${name}"></div>
                    </div>
                </div>
                <img src="${MODELS[name].avatar}" alt="">
            </div>`
        );
    }
    setHp(val) {
        $(this.right_hp_selector).animate({ width: `${val}%` }, 1000);
        $(this.bottom_hp_selector).animate({ width: `${val}%` }, 1000);
    }
}

export class BossHealthBar {
    constructor(name, level = 7) {
        $('#monster-info').html(`<p class="name">monster (lv ${level})</p>
    <div class="top-healthbar">
      <div id="${name}-top-hp-healthbar"></div>
    </div>`);
    this.top_hp_selector = `#${name}-top-hp-healthbar`;
    }

    setHp(val) {
        $(this.top_hp_selector).animate({ width: `${val}%` }, 1000);
    }
}