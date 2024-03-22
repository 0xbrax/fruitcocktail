export class Button {
    constructor(name, style) {
        this.element = document.createElement('i-heroicons');
        this.element.setAttribute('icon-name', name);

        if (style) {
            this.element.setAttribute('style-name', style);
        }
    }

}