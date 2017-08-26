// ==UserScript==
// @name         ScratchFixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tries to fix and improve certain aspects of Scratch
// @author       Wetbikeboy2500
// @match        https://scratch.mit.edu/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", load_messages, false);

    let style = document.createElement("style");
    style.innerHTML = '.tips a span { display: none; position: absolute; } .tips a:after { content: "Forums"; visibility: visible; position: static; } .phosphorus { margin-left: 14px; margin-right: 14px; margin-top: 16px; }';
    document.head.appendChild(style);
    //fixes navbar
    if (document.getElementById("navigation") !== null) {
        document.getElementsByClassName("tips")[0].childNodes[0].setAttribute("href", "/discuss");
        console.log("New Theme");
    } else {
        let tips = document.getElementsByClassName("site-nav")[0].childNodes[3].childNodes[0];
        tips.setAttribute("href", "/discuss");
        tips.innerHTML = "Forums";
        console.log("Old Theme");
    }
    //adds phosphouors player but I plan to add the new player
    let url = window.location.href;
    let editor = 0;//0 is phosperous and 2 is scratch player
    if (url.includes("projects") && !url.includes("all")) {
        console.log("Project page");
        let buttons = document.getElementsByClassName("buttons")[0];
        let button = document.createElement("div");
        button.setAttribute("class", "button");

        button.addEventListener("click", () => {
            if (editor === 0) {
                editor = -1;//if spammed can't activate twice
                document.getElementById("player").style = "display: none;";
                let project = document.getElementById("project");
                let number = project.getAttribute("data-project-id");
                let script = document.createElement("script");
                script.src = "https://phosphorus.github.io/embed.js?id="+number+"&auto-start=false&light-content=false";
                document.getElementsByClassName("stage")[0].appendChild(script);
                editor = 1;
            } else if (editor == 1) {
                editor = -1;
                document.getElementsByClassName("phosphorus")[0].parentNode.removeChild(document.getElementsByClassName("phosphorus")[0]);
                document.getElementById("player").style = "display: block;";
                editor = 0;
            }
        }, false);

        let span = document.createElement("span");
        span.setAttribute("class", "white");
        let text = document.createTextNode("Switch Player");
        span.appendChild(text);
        button.appendChild(span);
        buttons.appendChild(button);
    }
    //add messages to main page
    function load_messages () {
        if (url == "https://scratch.mit.edu/" && document.getElementsByClassName("box activity")[0] !== null) {
            let s = document.createElement("style");
            s.innerHTML = "#messages { height: 100%; width: 100%; max-height: 245px; overflow-y: scroll; } .box-content { padding: 0px 0px 0px 8px !important; } .read { margin-top: 6px !important; margin-bottom: 6px !important; line-height: 1em;} ul h3 { font-size: 1.1rem !important }";
            document.head.appendChild(s);
            console.log("loading messages");
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    set_message(xhttp.responseXML);
                }
            };
            xhttp.open("GET", "https://scratch.mit.edu/messages/", true);
            xhttp.responseType = "document";
            xhttp.send(null);
        }
    }

    function set_message (html) {
        let happening = document.getElementsByClassName("box activity")[0];
        happening.childNodes[0].childNodes[0].innerHTML = "Messages";
        happening.childNodes[1].removeChild(happening.childNodes[1].childNodes[0]);
        html.getElementsByClassName("social-notification-list")[0].setAttribute("id", "messages");
        happening.childNodes[1].appendChild(html.getElementsByClassName("social-notification-list")[0]);
    }
})();