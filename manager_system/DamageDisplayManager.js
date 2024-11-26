export class DamageDisplayManager {
    static selector = '#js-damage';
    
    static hide(){
        $(this.selector).hide();
    }

    static show(damage){
        const txt = `-${damage}`;
        $(this.selector).text(txt);
        $(this.selector).toggle();
        $(this.selector).toggle(2000);
    }
}