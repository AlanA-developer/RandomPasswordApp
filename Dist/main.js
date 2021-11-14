"use strict";
//Here we select the app id
var app = document.getElementById("app");
//!! This is header component
//Declaring the header component
var headerComponent = /** @class */ (function () {
    function headerComponent() {
        this.headerTemplate = "\n    <header id=\"header\">\n      <h1 id=\"headerTitle\">Welcome to my RandomPassword app</h1>\n      <blockquote>By: Draizce, GitHub: https://github.com/AlanA-developer</blockquote>\n    <header>\n  ";
    }
    headerComponent.prototype.addTemplateToHtml = function () {
        app.insertAdjacentHTML("beforeend", this.headerTemplate);
    };
    return headerComponent;
}());
//Using title component
var insertHeader = new headerComponent();
insertHeader.addTemplateToHtml();
//!! This is password content component
var passwordContentComponent = /** @class */ (function () {
    function passwordContentComponent() {
        this.passwordContentTemplate = "\n    <div id=\"passwordContent\">\n      <h1 id=\"passwordText\">Hi</h1>\n    </div>\n  ";
    }
    passwordContentComponent.prototype.addTemplateToHtml = function () {
        app.insertAdjacentHTML("beforeend", this.passwordContentTemplate);
    };
    return passwordContentComponent;
}());
//Using password content component
var passwordContent = new passwordContentComponent();
passwordContent.addTemplateToHtml();
//!! This is lateral menu component
var lateralMenuComponent = /** @class */ (function () {
    function lateralMenuComponent() {
        this.lateralMenuTemplate = "\n    <nav id=\"lateralMenu\">\n      <ul id=\"linksMenu\">\n        <li id=\"linkMenu\" class=\"passwordNumber\">Generate Password with numbers</li>\n        <li id=\"linkMenu\" class=\"passwordLetters\">Generate Password with letters</li>\n        <li id=\"linkMenu\" class=\"passwordNumberAndLetters\">Generate Password with numbers and letters</li>\n        <li id=\"linkMenu\" class=\"about\">About</li>\n      </ul>\n    </nav>\n  ";
    }
    lateralMenuComponent.prototype.addTemplateToHtml = function () {
        app.insertAdjacentHTML("beforeend", this.lateralMenuTemplate);
    };
    return lateralMenuComponent;
}());
//Using lateral menu component
var insertLateralMenu = new lateralMenuComponent();
insertLateralMenu.addTemplateToHtml();
//!! This is password numbers component
var passwordNumbersComponent = /** @class */ (function () {
    function passwordNumbersComponent() {
        this.randomNumber = Math.floor(Math.random() * (99999 - 10 + 1)) + 10000;
    }
    return passwordNumbersComponent;
}());
//!! This is password letters component
//Declaring the password letters component
var passwordLettersComponent = /** @class */ (function () {
    function passwordLettersComponent() {
    }
    passwordLettersComponent.prototype.randomPasswordLetters = function () {
        var passwordLetters = "";
        var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < 10; i++) {
            passwordLetters += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return passwordLetters;
    };
    return passwordLettersComponent;
}());
//!! This is password letters and numbers component
//Declaring the password letters component
var passwordNumberAndLettersComponent = /** @class */ (function () {
    function passwordNumberAndLettersComponent() {
    }
    passwordNumberAndLettersComponent.prototype.randomPasswordLettersAndNumbers = function () {
        var passwordLettersAndNumbers = "";
        var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numbers = "0123456789";
        for (var i = 0; i < 5; i++) {
            passwordLettersAndNumbers +=
                letters.charAt(Math.floor(Math.random() * letters.length)) +
                    numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return passwordLettersAndNumbers;
    };
    return passwordNumberAndLettersComponent;
}());
//!! This is generate passwords component
//Declaring the generate passwords component
var generatePasswordsComponent = /** @class */ (function () {
    function generatePasswordsComponent() {
        this.textReplaceWithPassword = document.getElementById("passwordText");
    }
    //^^Password numbers
    generatePasswordsComponent.prototype.passwordNumbers = function () {
        var passwordNumbers = new passwordNumbersComponent();
        this.textReplaceWithPassword.innerText = passwordNumbers.randomNumber;
    };
    //^^Password letters
    generatePasswordsComponent.prototype.passwordLetters = function () {
        var passwordLetters = new passwordLettersComponent();
        this.textReplaceWithPassword.innerText =
            passwordLetters.randomPasswordLetters();
    };
    //^^Password letters and numbers
    generatePasswordsComponent.prototype.passwordLettersAndNumbers = function () {
        var passwordLettersAndNumbers = new passwordNumberAndLettersComponent();
        this.textReplaceWithPassword.innerText =
            passwordLettersAndNumbers.randomPasswordLettersAndNumbers();
    };
    return generatePasswordsComponent;
}());
//* Using generate passwords component
var generatePasswords = new generatePasswordsComponent();
//**  Using password numbers
var optionPasswordNumbers = document.getElementsByClassName("passwordNumber");
optionPasswordNumbers[0].addEventListener("click", function () {
    generatePasswords.passwordNumbers();
});
//**  Using password letters
var optionPasswordLetters = document.getElementsByClassName("passwordLetters");
optionPasswordLetters[0].addEventListener("click", function () {
    generatePasswords.passwordLetters();
});
//**  Using password letters and numbers
var optionPasswordLettersAndNumbers = document.getElementsByClassName("passwordNumberAndLetters");
optionPasswordLettersAndNumbers[0].addEventListener("click", function () {
    generatePasswords.passwordLettersAndNumbers();
});
//!! This is about component
//Declaring the about component
var aboutComponent = /** @class */ (function () {
    function aboutComponent() {
        this.aboutTemplate = "\n  <div id=\"aboutContent\">\n    <div id=\"about\">\n      <h1 id=\"aboutText\">About</h1>\n      <p>\n        This app was created by Alan A.\n        <br>\n        <br>\n        This app was created with the purpose of practice typescript.\n        <br>\n        <br>\n        The app was created using the following technologies:\n        <br>\n        <br>\n        - TypeScript\n        <br>\n        - HTML\n        <br>\n        - CSS\n        <br>\n        - JavaScript\n        <br>\n        - Github\n        <br>\n        <br>\n        The app was created in the following languages:\n        <br>\n        <br>\n        - English\n        <br>\n        <br>\n        <strong>This project was made solely for my professional portfolio, I am not responsible for the use you give to this project</strong>\n      </div>\n  </div>\n  ";
    }
    aboutComponent.prototype.addStylesToTemplate = function () {
        var aboutContent = document.getElementById("aboutContent");
        aboutContent.style.backgroundColor = "rgba(123,100,50,.5)";
        aboutContent.style.padding = "20px";
        aboutContent.style.borderRadius = "10px";
        aboutContent.style.width = "50%";
        aboutContent.style.margin = "auto";
        aboutContent.style.display = "flex";
        aboutContent.style.alignItems = "center";
        aboutContent.style.justifyContent = "center";
        aboutContent.style.marginTop = "5em";
    };
    aboutComponent.prototype.addTemplateToHtml = function () {
        app.innerHTML = this.aboutTemplate;
    };
    return aboutComponent;
}());
//Using about component
var aboutOption = document.getElementsByClassName("about");
aboutOption[0].addEventListener("click", function () {
    var insertAbout = new aboutComponent();
    insertAbout.addTemplateToHtml();
    insertAbout.addStylesToTemplate();
});
//!! This is styles component
//Declaring the reset body css
var stylesComponent = /** @class */ (function () {
    function stylesComponent() {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
    }
    stylesComponent.prototype.applyStyles = function () {
        //^^ Selecting the elemements
        var header = document.getElementById("header");
        var headerTitle = document.getElementById("headerTitle");
        var linksMenu = document.getElementById("linksMenu");
        var linkMenu = document.getElementsByTagName("li");
        var passwordContent = document.getElementById("passwordContent");
        var aboutContent = document.getElementById("aboutContent");
        //^^ Selecting the elemements
        //* General header styles
        header.style.textAlign = "center";
        header.style.margin = "0";
        header.style.padding = "0";
        header.style.borderBottom = "1px solid black";
        header.style.fontFamily = "Arial, Helvetica Neue, Helvetica, sans-serif";
        //* Header title styles
        headerTitle.style.margin = "0";
        headerTitle.style.padding = "0";
        //* Links menu styles
        linksMenu.style.listStyle = "none";
        linksMenu.style.margin = "0";
        linksMenu.style.padding = "0";
        linksMenu.style.display = "inline-block";
        linksMenu.style.borderRight = "1px solid black";
        linksMenu.style.borderBottom = "1px solid black";
        //* Link menu styles
        for (var i = 0; i < linkMenu.length; i++) {
            linkMenu[i].style.margin = "3em";
            linkMenu[i].style.marginBottom = "25.9%";
            linkMenu[i].style.borderBottom = "1px solid black";
            linkMenu[i].style.color = "black";
            linkMenu[i].style.fontFamily =
                "Arial, Helvetica Neue, Helvetica, sans-serif";
            linkMenu[i].style.fontSize = "1.2em";
            linkMenu[i].style.cursor = "pointer";
        }
        //* Password content styles
        passwordContent.style.display = "inline-block";
        passwordContent.style.float = "right";
        passwordContent.style.paddingTop = "18.3em";
        passwordContent.style.paddingBottom = "18.39em";
        passwordContent.style.paddingLeft = "15.3em";
        passwordContent.style.paddingRight = "19.3em";
        passwordContent.style.marginRight = "9em";
        passwordContent.style.marginLeft = "5em";
    };
    return stylesComponent;
}());
//Using the styles component
var styles = new stylesComponent();
styles.applyStyles();
