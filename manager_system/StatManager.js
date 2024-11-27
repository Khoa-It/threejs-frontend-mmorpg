import { MODELS } from "../assets.js";
import { EquipmentManager } from "./EquipmentManager.js";
import { UserManager } from "./UserManager.js";

export class StatManager {
    static MONSTER = false;
    static PLAYER = true;

    static decreaseHp(damage = 0, hp = 100, isPlayer = this.PLAYER, monsterId = 'zerodata'){
        const curChar = UserManager.getCurrentCharId();
        const hpOfChar = EquipmentManager.getCalculator().hp + MODELS[curChar].stat.hp;
        const hpOfMonster = MODELS[monsterId].stat.hp;
        const baseHp = isPlayer ? hpOfChar : hpOfMonster;
        let curHp = Math.ceil((hp * baseHp) / 100);
        curHp -= damage;
        return Math.floor((curHp / baseHp) * 100);
    }

    static calculateAttack(isPlayer = this.PLAYER, monsterId = 'zerodata'){
        const curChar = UserManager.getCurrentCharId();
        const charAtk = EquipmentManager.getCalculator().atk + MODELS[curChar].stat.atk;
        const monsAtk = MODELS[monsterId].stat.atk;
        return isPlayer ? charAtk : monsAtk;
    }

}