
export class Notification {
    constructor(message = 'haha', from = 2, to = 2, parrent_id='arena') {
        this.from = from;
        this.to = to;
        this.message = message;
        this.parrent_id = parrent_id;
        this.selector = `#notification-${parrent_id}`;
        this.status = false;
    }

    generateHtmlContent(){
        return `<div class="communicated-notification" id="notification-${this.parrent_id}">
        <p>${this.message}</p> <div>F</div>
      </div>`;
    }

    hide() {
        $(this.selector).remove();
    }

    show() {
        if(this.status) return;
        $('body').append(this.generateHtmlContent());
        this.status = true;
    }
    
    update(distance){
        if (this.from < distance && distance < this.to) {
            this.show();
        } else {
            this.hide();
            this.status = false;
        }
    }
    

    
}