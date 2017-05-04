export class ApiResponseEntity {

    private status: number;

    private content: any;

    private errors: string[];

    constructor(xhr: XMLHttpRequest) {

        this.status = xhr.status;

        this.content = '';
        if(this.status == 200 || this.status == 201 || this.status == 400) {
            this.content = JSON.parse(xhr.response);
        }

        if(this.status == 400) {

            let messages = [];
            let content = this.content;

            // Errors on whole form
            if(content.errors.errors != null) {
                for(let i = 0; i < content.errors.errors.length; i++) {
                    messages.push(content.errors.errors[i]);
                }
            }

            // Errors on fields
            let fields = content.errors.children;
            for(let propertyName in fields) {
                let fieldErrors = fields[propertyName]['errors'];
                if(fieldErrors) {
                    for(let i = 0; i < fieldErrors.length; i++) {
                        let fieldError = fieldErrors[i];
                        let message = '';
                        let propertyNameCapitalized = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
                        // let translatedPropertyNameCapitalized = translator.translate(propertyNameCapitalized);
                        let translatedPropertyNameCapitalized = propertyNameCapitalized;
                        message += '<strong>';
                        message += translatedPropertyNameCapitalized;
                        message += ' : <strong>';
                        message += fieldError;
                        messages.push(message);
                    }
                }
            }

        }

    }

}