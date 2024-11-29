export class StatusInfoManager {
    static data = {
        7: {
            position: [0,0,0],
            mora: 10000,
        },
        8: {
            position: [0,0,0],
            mora: 10000,
        }
    }

    static getMora(id){
        return this.data[id].mora;
    }

    static setMora(id,mora){
        this.data[id].mora = mora;
    }
}