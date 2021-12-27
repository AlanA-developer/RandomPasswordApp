"use strict";
//Here we select the app id
let app = document.getElementById("app");
//!! This is header component
//Declaring the header component
class headerComponent {
    constructor() {
        this.headerTemplate = `
    <header id="header">
      <h1 id="headerTitle">Welcome to my RandomPassword app</h1>
      <blockquote>By: Draizce, GitHub: https://github.com/AlanA-developer</blockquote>
    <header>
  `;
    }
    addTemplateToHtml() {
        app.insertAdjacentHTML("beforeend", this.headerTemplate);
    }
}
//Using title component
let insertHeader = new headerComponent();
insertHeader.addTemplateToHtml();
//!! This is password content component
class passwordContentComponent {
    constructor() {
        this.passwordContentTemplate = `
    <div id="passwordContent">
      <h1 id="passwordText">Hi</h1>
    </div>
  `;
    }
    addTemplateToHtml() {
        app.insertAdjacentHTML("beforeend", this.passwordContentTemplate);
    }
}
//Using password content component
let passwordContent = new passwordContentComponent();
passwordContent.addTemplateToHtml();
//!! This is lateral menu component
class lateralMenuComponent {
    constructor() {
        this.lateralMenuTemplate = `
    <nav id="lateralMenu">
      <ul id="linksMenu">
        <li id="linkMenu" class="passwordNumber">Generate Password with numbers</li>
        <li id="linkMenu" class="passwordLetters">Generate Password with letters</li>
        <li id="linkMenu" class="passwordNumberAndLetters">Generate Password with numbers and letters</li>
        <li id="linkMenu" class="about">About</li>
      </ul>
    </nav>
  `;
    }
    addTemplateToHtml() {
        app.insertAdjacentHTML("beforeend", this.lateralMenuTemplate);
    }
}
//Using lateral menu component
let insertLateralMenu = new lateralMenuComponent();
insertLateralMenu.addTemplateToHtml();
//!! This is password numbers component
class passwordNumbersComponent {
    constructor() {
        this.randomNumber = Math.floor(Math.random() * (99999 - 10 + 1)) + 10000;
    }
}
//!! This is password letters component
//Declaring the password letters component
class passwordLettersComponent {
    constructor() { }
    randomPasswordLetters() {
        let passwordLetters = "";
        let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < 10; i++) {
            passwordLetters += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return passwordLetters;
    }
}
//!! This is password letters and numbers component
//Declaring the password letters component
class passwordNumberAndLettersComponent {
    constructor() { }
    randomPasswordLettersAndNumbers() {
        let passwordLettersAndNumbers = "";
        let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let numbers = "0123456789";
        for (let i = 0; i < 8; i++) {
            passwordLettersAndNumbers +=
                letters.charAt(Math.floor(Math.random() * letters.length)) +
                    numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return passwordLettersAndNumbers;
    }
}
//!! This is generate passwords component
//Declaring the generate passwords component
class generatePasswordsComponent {
    constructor() {
        this.textReplaceWithPassword = document.getElementById("passwordText");
    }
    //^^Password numbers
    passwordNumbers() {
        let passwordNumbers = new passwordNumbersComponent();
        this.textReplaceWithPassword.innerHTML = String(passwordNumbers.randomNumber);
    }
    //^^Password letters
    passwordLetters() {
        let passwordLetters = new passwordLettersComponent();
        this.textReplaceWithPassword.innerText =
            passwordLetters.randomPasswordLetters();
    }
    //^^Password letters and numbers
    passwordLettersAndNumbers() {
        let passwordLettersAndNumbers = new passwordNumberAndLettersComponent();
        this.textReplaceWithPassword.innerText =
            passwordLettersAndNumbers.randomPasswordLettersAndNumbers();
    }
}
//* Using generate passwords component
let generatePasswords = new generatePasswordsComponent();
//**  Using password numbers
let optionPasswordNumbers = document.getElementsByClassName("passwordNumber");
optionPasswordNumbers[0].addEventListener("click", function () {
    generatePasswords.passwordNumbers();
});
//**  Using password letters
let optionPasswordLetters = document.getElementsByClassName("passwordLetters");
optionPasswordLetters[0].addEventListener("click", function () {
    generatePasswords.passwordLetters();
});
//**  Using password letters and numbers
let optionPasswordLettersAndNumbers = document.getElementsByClassName("passwordNumberAndLetters");
optionPasswordLettersAndNumbers[0].addEventListener("click", function () {
    generatePasswords.passwordLettersAndNumbers();
});
//!! This is about component
//Declaring the about component
class aboutComponent {
    constructor() {
        this.aboutTemplate = `
  <div id="aboutContent">
    <div id="about">
      <h1 id="aboutText">About</h1>
      <p>
        This app was created by Alan A.
        <br>
        <br>
        This app was created with the purpose of practice typescript.
        <br>
        <br>
        The app was created using the following technologies:
        <br>
        <br>
        - TypeScript
        <br>
        - HTML
        <br>
        - CSS
        <br>
        - JavaScript
        <br>
        - Github
        <br>
        <br>
        The app was created in the following languages:
        <br>
        <br>
        - English
        <br>
        <br>
        <strong>This project was made solely for my professional portfolio, I am not responsible for the use you give to this project</strong>
      </div>
  </div>
  `;
    }
    addStylesToTemplate() {
        let aboutContent = document.getElementById("aboutContent");
        aboutContent.style.backgroundColor = "rgba(123,100,50,.5)";
        aboutContent.style.padding = "20px";
        aboutContent.style.borderRadius = "10px";
        aboutContent.style.width = "50%";
        aboutContent.style.margin = "auto";
        aboutContent.style.display = "flex";
        aboutContent.style.alignItems = "center";
        aboutContent.style.justifyContent = "center";
        aboutContent.style.marginTop = "5em";
    }
    addTemplateToHtml() {
        app.innerHTML = this.aboutTemplate;
    }
}
//Using about component
let aboutOption = document.getElementsByClassName("about");
aboutOption[0].addEventListener("click", function () {
    let insertAbout = new aboutComponent();
    insertAbout.addTemplateToHtml();
    insertAbout.addStylesToTemplate();
});
//!! This is styles component
//Declaring the reset body css
class stylesComponent {
    constructor() {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
    }
    applyStyles() {
        //^^ Selecting the elemements
        let header = document.getElementById("header");
        let headerTitle = document.getElementById("headerTitle");
        let linksMenu = document.getElementById("linksMenu");
        let linkMenu = document.getElementsByTagName("li");
        let passwordContent = document.getElementById("passwordContent");
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
        for (let i = 0; i < linkMenu.length; i++) {
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
        passwordContent.style.display = "flex";
        passwordContent.style.flexDirection = "column";
        passwordContent.style.alignItems = "center";
        passwordContent.style.justifyContent = "center";
        passwordContent.style.margin = "0";
        passwordContent.style.padding = "0";
        passwordContent.style.border = "1px solid black";
        passwordContent.style.borderRadius = "10px";
        passwordContent.style.width = "50%";
        passwordContent.style.margin = "auto";
        passwordContent.style.position = "absolute";
        passwordContent.style.marginLeft = "40em";
        passwordContent.style.marginTop = "15em";
    }
}
//Using the styles component
let styles = new stylesComponent();
styles.applyStyles();
