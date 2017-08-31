// ==UserScript==
// @name         ScratchFixer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tries to fix and improve certain aspects of Scratch
// @author       Wetbikeboy2500
// @match        https://scratch.mit.edu/*
// @grant        none
// @updateURL    https://github.com/Wetbikeboy2500/ScratchFixer/raw/master/ScratchFixer.user.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", load_messages, false);
    //adds my css to edit custom elements
    let style = document.createElement("style");
    style.innerHTML = '.tips a span { display: none; position: absolute; } .tips a:after { content: "Forums"; visibility: visible; position: static; } .phosphorus { margin-left: 14px; margin-right: 14px; margin-top: 16px; } .my_select {height: 32px; line-height: 32px; margin: 3px 0px 3px 0px; width: 110px;}';
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
    //adds the different players using a dropdown menu
    let url = window.location.href;
    if (url.includes("projects") && !url.includes("all")) {
        let player = 0, project, number, script, menu; //0 is default, 1 is phosphorous, 2 is sulforus
        console.log("Project page");
        if (document.getElementById("share-bar") === null) {
            menu = document.getElementsByClassName("buttons")[0];
        } else {
            menu = document.getElementsByClassName("buttons")[1];
        }
        let select = document.createElement("select");
        select.setAttribute("class", "my_select");
        select.addEventListener("change", (event) => {
            if (player === 1 || player === 2) {
                document.getElementsByClassName("phosphorus")[0].parentNode.removeChild(document.getElementsByClassName("phosphorus")[0]);
            } else if (player === 0) {
                document.getElementById("player").style = "display: none;";
            }
            switch (document.getElementsByClassName("my_select")[0].value) {
                case "D":
                    document.getElementById("player").style = "display: block;";
                    player = 0;
                    break;
                case "P":
                    project = document.getElementById("project");
                    number = project.getAttribute("data-project-id");
                    script = document.createElement("script");
                    script.src = "https://phosphorus.github.io/embed.js?id="+number+"&auto-start=false&light-content=false";
                    document.getElementsByClassName("stage")[0].appendChild(script);
                    player = 1;
                    break;
                case "S":
                    project = document.getElementById("project");
                    number = project.getAttribute("data-project-id");
                    script = document.createElement("script");
                    script.src = "https://sulfurous.aau.at/js/embed.js?id="+number+"&resolution-x=480&resolution-y=360&auto-start=true&light-content=false";
                    document.getElementsByClassName("stage")[0].appendChild(script);
                    player = 2;
                    break;
                default:
                    document.getElementById("player").style = "display: block;";
                    player = 0
                    break;
                                                                         }
        }, false);
        let option = document.createElement("option");
        option.appendChild(document.createTextNode("Default"))
        option.setAttribute("value", "D");
        select.appendChild(option);

        option = document.createElement("option");
        option.appendChild(document.createTextNode("Phosperous"))
        option.setAttribute("value", "P");
        select.appendChild(option);

        option = document.createElement("option");
        option.appendChild(document.createTextNode("Sulfurous"))
        option.setAttribute("value", "S");
        select.appendChild(option);

        menu.appendChild(select);
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

    let users = [], userinfo = {};

    //first compile names of all the users
    if (document.getElementsByTagName("a") != null) {
        let links = document.getElementsByTagName("a");
        //compile a list of the urls
        for (let a of links) {
            if (a.hasAttribute("href") && a.getAttribute("href").includes("/users/")) {
                if (!users.includes(a.getAttribute("href"))) {
                    users.push(a.getAttribute("href"));
                    console.log(users.length);
                }
            }
        }
        //load info for each user
        userinfo.fulllength = users.length;
        userinfo.length = 0;
        for (let i = 0; i < users.length; i++) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    userinfo.length += 1;
                    console.log(users[i]);
                    userinfo[String(users[i])] = xhttp.responseXML.getElementsByClassName("profile-details")[0];
                    if (userinfo.fulllength === userinfo.length) {
                        add_profile_info();
                    }
                }
            };
            xhttp.open("GET", "https://scratch.mit.edu" + users[i], true);
            xhttp.responseType = "document";
            xhttp.send(null);
        }
    }
    //once all info is loaded make it display over a element when hovered over
    function add_profile_info () {
        console.log(userinfo);
        let links = document.getElementsByTagName("a");

        for (let i = 0; i < links.length; i++) {
            let a = links.item(i);
            if (users.includes(a.getAttribute("href"))) {
                a.addEventListener("mouseenter", (event) => {
                    let div = document.createElement("div");
                    div.setAttribute("class", "userwindow");
                    div.setAttribute("style", "position: absolute; left: "+ event.pageX +"px; top: "+ (event.pageY + 10) +"px; width: inherit; height: 20px; background-color: white;");
                    userinfo[a.getAttribute("href")].setAttribute("style", "margin: 0px;");
                    div.appendChild(userinfo[a.getAttribute("href")]);
                    document.body.appendChild(div);
                }, false);
                a.addEventListener("mouseleave", (event) => {
                    if (document.body.getElementsByClassName("userwindow")[0] !== null) {
                        document.body.removeChild(document.body.getElementsByClassName("userwindow")[0]);
                    }
                }, false);
            }
        }
    }
})();
