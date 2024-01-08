const app = {
    input: null,
    reader: null,
    content: null,
    vouchers: [],

    init: function() {
        console.log("app : init");

        app.reader = new FileReader();
        app.reader.addEventListener('load', app.display);

        app.content = document.querySelector('#vouchers');

        app.input = document.querySelector('#upload');
        app.input.value = null;
        //app.input.addEventListener('change', app.parse);

        document.querySelector('#generate').addEventListener('click', app.parse);
        document.querySelector('#print').addEventListener('click', app.print);
    },

    parse: function() {
        console.log('file changed !');

        //const fileList = this.files;
        const fileList = app.input.files;
        // console.log(fileList.length);
        if(fileList.length > 0) {
            console.table(fileList);

            // check if correct CSV
            if(fileList[0].type === "text/csv") {
                app.reader.readAsText(fileList[0]);
            } else {
                console.error("Something went wrong ! (wrong file type)");
            }
        } else {
            console.error("Something went wrong ! (file is missing)");
        }
    },

    display: function() {
        console.log("RAW : ");
        console.log(app.reader.result);

        const data = app.reader.result.split('\n');
        for(const line of data) {
            if(line.startsWith('"')) {
                app.vouchers.push(line.split('"')[1]);
            }
        }

        console.table(app.vouchers);

        const template = document.querySelector("#voucher_template");

        app.content.innerHTML = "<h2>Preview</h2>";
        
        for(const voucher of app.vouchers) {
            const clone = document.importNode(template.content, true);

            clone.querySelector('.header').innerHTML = document.querySelector('#form__header').value;
            clone.querySelector('.intro').innerHTML = document.querySelector('#form__intro').value;
            clone.querySelector('.outro').innerHTML = document.querySelector('#form__outro').value;
            clone.querySelector('.footer').innerHTML = document.querySelector('#form__footer').value;

            const code = clone.querySelector('.code');
            code.textContent = voucher;
            app.content.appendChild(clone);
        }

        document.querySelector('#print').disabled = false;
    },

    print: function() {
        window.print();
    }
};

document.addEventListener('DOMContentLoaded', app.init);