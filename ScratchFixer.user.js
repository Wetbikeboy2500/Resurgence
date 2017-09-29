// ==UserScript==
// @name         ResurgenceUserscript
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Tries to fix and improve certain aspects of Scratch
// @author       Wetbikeboy2500
// @match        https://scratch.mit.edu/*
// @resource     CSS https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/style.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @updateURL    https://raw.githubusercontent.com/Wetbikeboy2500/ScratchFixer/master/ScratchFixer.user.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener("load", () => {
        if (ran_code == false) {
            console.log("window loaded");
            ran_code = true;
            load_messages();
            load_scratchblockcode();
            load_userinfo();
            load_bbcode();
        }
    }, false);
    let url = window.location.href, count = null, users = [], userinfo = {}, l, ran_code = false, style;
    //adds my css to edit custom elements
    GM_addStyle('.tips a span { display: none; position: absolute; } .tips a:after { content: "Forums"; visibility: visible; position: static; } .phosphorus { margin-left: 14px; margin-right: 14px; margin-top: 16px; } .my_select {height: 34px; line-height: 34px; vertical-align: middle; margin: 3px 0px 3px 0px; width: 110px;} .messages-social {width: 700px; right: 446.5px; left: 235.5px; position: relative; border: 0.5px solid #F0F0F0; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; } .messages-header {font-size: 24px; padding-left: 10px;} select[name="messages.filter"] {right: 720px; top: 20px; font-size: 24px; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background-color: #F2F2F2; visibility: visible;} #___gcse_0 {display: none;} .messages-details {margin-top: 40px;} .mod-messages {visibility: hidden; height: 0px; padding: 0px; margin: 0px;}');
    dark_theme();
    //GM_addStyle(GM_getResourceText("CSS"));
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
    //make sure code runs if window loading dosn't work
    setTimeout (() => {
        if (ran_code == false) {
            console.log("load interval");
            ran_code = true;
            load_messages();
            load_scratchblockcode();
            load_userinfo();
            load_bbcode();
        }
    },5000);//6 second wait for the page
    //adds info button to bottom of the page and new page will be coming soon but until then I am just going to let it sit here
    let but = document.createElement("button");
    but.addEventListener("click", () => {
        if (GM_getValue("theme", false) === "dark") {
            GM_setValue("theme", "light");
        } else {
            GM_setValue("theme", "dark");
        }
        dark_theme();
    });
    but.setAttribute("title", "Must refresh page for theme change to take effect");
    but.appendChild(document.createTextNode("Switch Theme"));
    if (document.getElementsByClassName("lists").length > 0) {
        let dd = document.createElement("dd");
        let a = document.createElement("a");
        a.setAttribute("href", "/resurgence");
        a.appendChild(document.createTextNode("Resurgence Userscript"));
        dd.appendChild(a);
        document.getElementsByClassName("lists")[0].getElementsByTagName("dl")[1].appendChild(dd);
        document.getElementsByClassName("lists")[0].getElementsByTagName("dl")[1].appendChild(but);
    } else if (document.getElementsByClassName("footer-col").length > 0) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.setAttribute("href", "/resurgence");
        a.appendChild(document.createTextNode("Resurgence Userscript"));
        li.appendChild(a);
        document.getElementsByClassName("footer-col")[0].childNodes[3].childNodes[3].appendChild(li);
        document.getElementsByClassName("footer-col")[0].childNodes[3].childNodes[3].appendChild(but);
    }
    //adds the new page
    if ("https://scratch.mit.edu/resurgence" === url) {
        GM_addStyle('.box-content li {width: 50%; position: relative; left: 25%; text-align: left;}');
        let main = document.getElementsByClassName("box-content")[0];
        main.innerHTML = "";
        let h4 = document.createElement("h4");
        h4.appendChild(document.createTextNode("Resurgence Userscript"));
        document.getElementsByClassName("box-head")[0].setAttribute("style", "padding: 10px 0px 0px 7px !important;")
        document.getElementsByClassName("box-head")[0].appendChild(h4);
        let p = document.createElement("p");
        p.appendChild(document.createTextNode("Made By Wetbikeboy2500"));
        main.appendChild(p);        
        p = document.createElement("p");
        p.appendChild(document.createTextNode("Special thanks to "));
        let a = document.createElement("a");
        a.setAttribute("href", "https://scratch.mit.edu/users/NitroCipher/");
        a.appendChild(document.createTextNode("NitroCipher"));
        p.appendChild(a);
        main.appendChild(p);
        p = document.createElement("p");
        p.appendChild(document.createTextNode("Resurgence Userscript (previously named ScratchFixer until NitroCipher suggested its current name) was originally going to be a chrome extension but I decided that a userscript was going to be easier to update and change. The userscript started out by just adding the forums button, messages to the main page, and letting you use the Phosphorus player for projects. Since then, more features have been added to the userscipt with more to come in the future."));
        main.appendChild(p);
        p = document.createElement("p");
        a = document.createElement("a");
        a.setAttribute("href", "https://scratch.mit.edu/discuss/topic/274665/");
        a.appendChild(document.createTextNode("Click this to go to the forum post"));
        p.appendChild(a);
        main.appendChild(p);
        p = document.createElement("p");
        a = document.createElement("a");
        a.setAttribute("href", "https://github.com/Wetbikeboy2500/ScratchFixer");
        a.appendChild(document.createTextNode("Click this to go to the Github repo"));
        p.appendChild(a);
        main.appendChild(p);
        let h3 = document.createElement("h3");
        h3.appendChild(document.createTextNode("Features"));
        main.appendChild(h3);
        let ul = document.createElement("ul");
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Forums tab instead of tips tab"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Adds messages to the main page"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Forums tab instead of tips tab"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Switch between Scratch player, Phosphorus player, Sulfurous player, and the Scratch 3 player"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Adds google search so you can search the whole Scratch site with google"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Quick info when hovering over usernames"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("When you click on Scratch Blocks in the forums it will show the original Scrachblock code"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Click on a new button “BBCode” to switch between the BBCode and the original post"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Changes the messages area to look like how it use to look"));
        ul.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.createTextNode("Adds this page to Scratch"));
        ul.appendChild(li);
        main.appendChild(ul);
    }
    //adds the different players using a dropdown menu
    if (url.includes("projects") && !url.includes("all") && !url.includes("search")) {
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
            if (player === 1 || player === 2 || player === 3) {
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
                case "5":
                    project = document.getElementById("project");
                    number = project.getAttribute("data-project-id");
                    let div = document.createElement("div");
                    div.setAttribute("id", "player");
                    div.setAttribute("style", "width:500px;height:410px;overflow:hidden;position:relative;left:7px;top:7px; margin: 0px;");
                    div.setAttribute("class", "phosphorus");
                    let obj = document.createElement("object");
                    obj.setAttribute("style", "position:absolute;top:-51px;left:-2065px");
                    obj.setAttribute("class", "int-player");
                    obj.setAttribute("width", "2560");
                    obj.setAttribute("height", "1440");
                    obj.setAttribute("data", "https://llk.github.io/scratch-gui/#" + number);
                    obj.setAttribute("scrolling", "no");
                    div.appendChild(obj);
                    document.getElementsByClassName("stage")[0].appendChild(div);
                    player = 3;
                    break;
                default:
                    document.getElementById("player").style = "display: block;";
                    player = 0;
                    break;
            }
        }, false);
        let option = document.createElement("option");
        option.appendChild(document.createTextNode("Default"));
        option.setAttribute("value", "D");
        select.appendChild(option);

        option = document.createElement("option");
        option.appendChild(document.createTextNode("Phosphorus"));
        option.setAttribute("value", "P");
        select.appendChild(option);

        option = document.createElement("option");
        option.appendChild(document.createTextNode("Sulfurous"));
        option.setAttribute("value", "S");
        select.appendChild(option);

        option = document.createElement("option");
        option.appendChild(document.createTextNode("Scratch 3"));
        option.setAttribute("value", "5");
        select.appendChild(option);

        menu.appendChild(select);
    }
    //adds google to the search
    if (url.includes("/search/")) {
        console.log("search");
        //first load new search
        let search = document.createElement("gcse:searchresults-only");//<gcse:searchresults-only></gcse:searchresults-only>
        let display = document.getElementById("projectBox");
        display.appendChild(search);

        var cx = '005257552979626070807:ejqzgnmerl0';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);

        //add the button to switch to it
        let nav = document.getElementsByClassName("sub-nav tabs")[0];
        let button = document.createElement("a");
        let li = document.createElement("li");
        li.setAttribute("id", "active");
        let img = document.createElement("img");
        img.setAttribute("class", "tab-icon");
        img.setAttribute("style", "height: 24px;");
        li.appendChild(img);
        let span = document.createElement("span");
        span.appendChild(document.createTextNode("Google"));
        li.appendChild(span);
        button.appendChild(li);
        nav.appendChild(button);

        //add function to the button
        button.addEventListener("click", () => {
            //make button look selected
            document.getElementsByClassName("active")[0].removeAttribute("class");
            document.getElementById("active").setAttribute("class", "active");
            //need to clear current searches
            display.childNodes[0].style.display = "none";
            display.childNodes[1].style.display = "none";
            document.getElementById("___gcse_0").style.display = "block";
        }, false);
    }
    //adds dark theme button
    function dark_theme () {
        console.log(GM_getValue("theme", false));
        if (GM_getValue("theme", false) === "dark") {
            //want dark theme
            style = GM_addStyle(GM_getResourceText("CSS"));
        } else if (style !== null) {
            style.parentNode.removeChild(style);
            style = null;
        }
    }
    //add messages to main page
    function load_messages () {
        //https://api.scratch.mit.edu/users/Wetbikeboy2500/messages?limit=40&offset=0
        if (url == "https://scratch.mit.edu/" && document.getElementsByClassName("box activity")[0] !== null) {
            console.log("loading messages");
            let token = null;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    let html  = xhttp.responseText;
                    let js = JSON.parse(html);
                    //load_message(js.user.token, js.user.username);
                    check_unread(js.user.token, js.user.username);
                }
            };
            xhttp.open("GET", "https://scratch.mit.edu/session/", true);
            xhttp.send(null);

        }
    }

    function check_unread (token, username) {
        let r = new XMLHttpRequest();
        r.onreadystatechange = () => {
            if (r.status == 200 && r.readyState == 4) {
                count = JSON.parse(r.responseText).msg_count;
                if (count > 0 || GM_getValue("message", true) === true || GM_getValue("username", true) != username) {
                    console.log("load from web");
                    get_message(token, username);
                } else {
                    console.log("load from presave");
                    //load from the json list
                    load_message(GM_getValue("message", {}), username);
                }
            }
        };
        r.open("GET", "https://api.scratch.mit.edu/proxy/users/"+username+"/activity/count", true);
        r.send(null);
    }

    function get_message (token, username) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.status == 200 && xhttp.readyState == 4) {
                load_message(xhttp.responseText, username);
            }
        };
        xhttp.open("GET", "https://api.scratch.mit.edu/users/"+username+"/messages?limit=40&offset=0", true);
        xhttp.setRequestHeader("X-Token", token);
        xhttp.send(null);
    }

    function load_message (json, username) {
        GM_addStyle(".activity .box-content{ overflow-y: scroll; height: 248px;} .username_link {cursor: pointer; color: #6b6b6b !important; text-decoration: none;}");
        let html = JSON.parse(json);
        GM_setValue("username", username);
        GM_setValue("message", json);
        let ul = document.createElement("ul");
        for (let a of html) {
            let li = document.createElement("li");
            let container = document.createElement("div");
            let link, user;

            switch (a.type) {
                case "forumpost":
                    container.appendChild(document.createTextNode("There are new posts in the forum: "));
                    link = document.createElement("a");
                    link.setAttribute("href", "/discuss/topic/"+a.topic_id+"/unread/");
                    link.appendChild(document.createTextNode(a.topic_title));
                    container.appendChild(link);
                    break;
                case "studioactivity":
                    container.appendChild(document.createTextNode("There was new activity in "));
                    link = document.createElement("a");
                    link.setAttribute("href", "/studios/"+a.gallery_id);
                    link.appendChild(document.createTextNode(a.title));
                    container.appendChild(link);
                    break;
                case "favoriteproject":
                    user = document.createElement("a");
                    user.setAttribute("href", "/users/" + a.actor_username);
                    user.setAttribute("class", "username_link");
                    user.appendChild(document.createTextNode(a.actor_username));
                    container.appendChild(user);
                    container.appendChild(document.createTextNode(" favorited your project "));
                    link = document.createElement("a");
                    link.setAttribute("href", "/projects/"+a.project_id);
                    link.appendChild(document.createTextNode(a.project_title));
                    container.appendChild(link);
                    break;
                case "loveproject":
                    user = document.createElement("a");
                    user.setAttribute("href", "/users/" + a.actor_username);
                    user.setAttribute("class", "username_link");
                    user.appendChild(document.createTextNode(a.actor_username));
                    container.appendChild(user);
                    container.appendChild(document.createTextNode(" loved your project "));
                    link = document.createElement("a");
                    link.setAttribute("href", "/projects/"+a.project_id);
                    link.appendChild(document.createTextNode(a.title));
                    container.appendChild(link);
                    break;
                case "followuser":
                    user = document.createElement("a");
                    user.setAttribute("href", "/users/" + a.actor_username);
                    user.setAttribute("class", "username_link");
                    user.appendChild(document.createTextNode(a.actor_username));
                    container.appendChild(user);
                    container.appendChild(document.createTextNode(" followed you"));
                    break;
                case "remixproject":
                    user = document.createElement("a");
                    user.setAttribute("href", "/users/" + a.actor_username);
                    user.setAttribute("class", "username_link");
                    user.appendChild(document.createTextNode(a.actor_username));
                    container.appendChild(user);
                    container.appendChild(document.createTextNode(" remixed your project "));
                    link = document.createElement("a");
                    link.setAttribute("href", "/projects/"+a.project_id);
                    link.appendChild(document.createTextNode(a.title));
                    container.appendChild(link);
                    break;
                case "addcomment":
                    if (a.comment_type === 0) { //project
                        user = document.createElement("a");
                        user.setAttribute("href", "/users/" + a.actor_username);
                        user.setAttribute("class", "username_link");
                        user.appendChild(document.createTextNode(a.actor_username));
                        container.appendChild(user);
                        container.appendChild(document.createTextNode(' commented "'+a.comment_fragment+'" on your project '));
                        link = document.createElement("a");
                        link.setAttribute("href", "/projects/"+a.comment_obj_id+"/#comments-"+a.comment_id);
                        link.appendChild(document.createTextNode(a.comment_obj_title));
                        container.appendChild(link);
                    } else if (a.comment_type === 1) { //profile page
                        user = document.createElement("a");
                        user.setAttribute("href", "/users/" + a.actor_username);
                        user.setAttribute("class", "username_link");
                        user.appendChild(document.createTextNode(a.actor_username));
                        container.appendChild(user);
                        container.appendChild(document.createTextNode(' commented "'+a.comment_fragment+'" on your profile '));
                        link = document.createElement("a");
                        link.setAttribute("href", "/users/"+a.comment_obj_id+"/#comments-"+a.comment_id);
                        link.appendChild(document.createTextNode(a.comment_obj_title));
                        container.appendChild(link);
                    } else if (a.comment_type === 2) {
                        user = document.createElement("a");
                        user.setAttribute("href", "/users/" + a.actor_username);
                        user.setAttribute("class", "username_link");
                        user.appendChild(document.createTextNode(a.actor_username));
                        container.appendChild(user);
                        container.appendChild(document.createTextNode(' commented "'+a.comment_fragment+'" in the studio '));
                        link = document.createElement("a");
                        link.setAttribute("href", "/studios/"+a.comment_obj_id+"/#comments-"+a.comment_id);
                        link.appendChild(document.createTextNode(a.comment_obj_title));
                        container.appendChild(link);
                    } else {
                        console.warn("Comment type not found");
                    }
                    break;
                case "curatorinvite":
                    user = document.createElement("a");
                    user.setAttribute("href", "/users/" + a.actor_username);
                    user.setAttribute("class", "username_link");
                    user.appendChild(document.createTextNode(a.actor_username));
                    container.appendChild(user);
                    container.appendChild(document.createTextNode(' invited you to curate '));
                    link = document.createElement("a");
                    link.setAttribute("href", "/studios/"+a.gallery_id);
                    link.appendChild(document.createTextNode(a.title));
                    container.appendChild(link);
                    break;
                case "becomeownerstudio":
                    user = document.createElement("a");
                    user.setAttribute("href", "/users/" + a.actor_username);
                    user.setAttribute("class", "username_link");
                    user.appendChild(document.createTextNode(a.actor_username));
                    container.appendChild(user);
                    container.appendChild(document.createTextNode(' promoted you to manager in '));
                    link = document.createElement("a");
                    link.setAttribute("href", "/studios/"+a.gallery_id);
                    link.appendChild(document.createTextNode(a.title));
                    container.appendChild(link);
                    break;
                case "userjoin":
                    container.appendChild(document.createTextNode('Welcome to Scratch'));
                    break;
                default:
                    console.warn(a, "Not Found");

            }
            container.appendChild(document.createTextNode(calcSmallest(new Date(Date.parse(a.datetime_created)))));
            li.appendChild(container);
            ul.appendChild(li);
        }
        let happening = document.getElementsByClassName("box activity")[0];
        happening.childNodes[0].childNodes[0].innerHTML = "Messages";
        happening.childNodes[1].childNodes[0].style.display = "none";
        ul.setAttribute("id", "messages");
        happening.childNodes[1].appendChild(ul);
        //then needs to see message count for the user
        set_unread(username);
    }

    function set_unread (username) {
        let messages = document.getElementById("messages").getElementsByTagName("li");
        for (let i = 0; i < count; i++) {
            messages[i].setAttribute("style", "background-color: #eed; opacity: 1;");
        }
    }

    function load_userinfo () {
        if (document.getElementsByTagName("a").length !== 0) {
            let userlinks = false;
            userinfo = GM_getValue("user", {});
            console.log("New profile loader");
            let links = document.getElementsByTagName("a");
            for (let a of links) {
                if (a.hasAttribute("href") && a.getAttribute("href").includes("/users/")) {
                    userlinks = true;
                    if (!users.includes(a.getAttribute("href")) && !userinfo.hasOwnProperty(a.getAttribute("href"))) {
                        users.push(a.getAttribute("href"));
                        console.log("load new user info");
                    }
                }
            }

            userinfo.fulllength = users.length;
            userinfo.length = 0;
            if (!userlinks) {
                console.log("No user links");
            } else if (users.length === 0) {
                set_userinfo(links);
            } else {
                for (let i = 0; i < users.length; i++) {
                    let xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = () => {
                        if (xhttp.status == 200 && xhttp.readyState == 4) {
                            userinfo.length += 1;
                            userinfo[String(users[i])] = JSON.parse(xhttp.responseText);
                            if (userinfo.fulllength === userinfo.length) {
                                set_userinfo(links);
                            }
                        }
                    };
                    let string = users[i];
                    if (users[i].lastIndexOf("/") + 1 === users[i].length) {
                        string = string.slice(0, -1);
                    }
                    if (users[i].includes("https://scratch.mit.edu/users/") || users[i].includes("http://scratch.mit.edu/users/")) {
                        xhttp.open("GET", "https://api.scratch.mit.edu/users/" + string.substring(string.indexOf("/users/") + 7), true);
                    } else  {
                        xhttp.open("GET", "https://api.scratch.mit.edu" + string, true);
                    }
                    xhttp.send(null);
                }
            }
        }
    }

    function set_userinfo (links) {
        GM_setValue("user", userinfo);
        //run final code here
        for (let a of links) {
            if (userinfo.hasOwnProperty(a.getAttribute("href"))) {
                //if (users.includes(a.getAttribute("href"))) {
                a.addEventListener("mouseenter", (event) => {
                    let div = document.createElement("div");
                    div.setAttribute("class", "userwindow");
                    div.setAttribute("style", "position: absolute; left: "+ event.pageX +"px; top: "+ (event.pageY + 10) +"px; width: inherit; height: 20px; background-color: white;");
                    let info = userinfo[a.getAttribute("href")];
                    let date = new Date(Date.parse(info.history.joined));
                    //date = new Date(date);
                    let dif = calcDate(new Date(), date);
                    div.appendChild(document.createTextNode(info.username + " joined " + dif +" from " + info.profile.country));
                    document.body.appendChild(div);
                }, false);
                a.addEventListener("mouseleave", (event) => {
                    if (document.body.getElementsByClassName("userwindow")[0] !== null) {
                        document.body.removeChild(document.body.getElementsByClassName("userwindow")[0]);
                    }
                }, false);
            }
        }
        console.log("Finished user info");
    }

    function calcDate(date1,date2) {
        let diff = Math.floor(date1.getTime() - date2.getTime());
        let day = 1000 * 60 * 60 * 24;
        let months = Math.ceil(Math.floor(diff/day)/31);
        let years = Math.floor(months/12);
        months -= years * 12;
        let message = "";
        if (years > 0) {
            if (years == 1) {
                message += "1 year";
            } else {
                message += years + " years";
            }
            if (months > 0) {
                message += ", "
            }
        }
        if (months > 0) {
            if (months == 1) {
                message += "1 month";
            } else {
                message += months + " months";
            }
        } else if (years == 0) {
            message += "1 month";
        }

        message += " ago";
        return message;
    }

    function calcSmallest(date2) {
        let date1 = new Date(), time, unit;
        if (date1.getFullYear() == date2.getFullYear()) {
            if (date1.getMonth() == date2.getMonth()) {
                if (date1.getDate() == date2.getDate()) {
                    if (date1.getHours() == date2.getHours()) {
                        time = date1.getMinutes() - date2.getMinutes();
                        unit = " minute";
                    } else {
                        time = date1.getHours() - date2.getHours();
                        unit = " hour";
                    }
                } else {
                    time = date1.getDate() - date2.getDate();
                    unit = " day";
                }
            } else {
                time = date1.getMonth() - date2.getMonth();
                unit = " month";
            }
        } else {
            time = date1.getFullYear() - date2.getFullYear();
            unit = " year";
        }
        if (time == 1) {
            return " " + time + unit + " ago"; 
        } else {
            return " " + time + unit + "s ago";
        }

    }
    //adds scratchblockcode load support
    function load_scratchblockcode () {
        if (url.includes("discuss") && document.getElementsByClassName("blocks")[0] !== null) {
            let blocks = [], blocks1 = [], blocks2 = [], blocks3 = [];
            console.log("contains scratch blocks");
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    let doc = xhttp.responseXML;
                    //only do the elements in post body html
                    let posts = document.getElementsByClassName("post_body_html");
                    let posts1 = doc.getElementsByClassName("post_body_html");
                    for (let a of posts) {
                        if (a.getElementsByClassName("blocks") !== null) {
                            for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                blocks.push(a.getElementsByClassName("blocks")[l]);
                            }
                        }
                    }
                    for (let a of posts1) {
                        if (a.getElementsByClassName("blocks") !== null) {
                            for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                blocks1.push(a.getElementsByClassName("blocks")[l]);
                            }
                        }
                    }
                    if (blocks.length > 0) {
                        for (let i = 0; i < blocks1.length; i++) {
                            blocks[i].setAttribute("id", i);
                            blocks[i].addEventListener("click", (event) => {
                                let target = event.currentTarget;
                                target.parentElement.replaceChild(blocks1[target.id], blocks[target.id]);
                            }, false);
                        }
                    }
                    //do elements for signatures
                    posts = document.getElementsByClassName("postsignature");
                    posts1 = doc.getElementsByClassName("postsignature");
                    for (let a of posts) {
                        if (a.getElementsByClassName("blocks") !== null) {
                            for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                blocks2.push(a.getElementsByClassName("blocks")[l]);
                            }
                        }
                    }
                    for (let a of posts1) {
                        if (a.getElementsByClassName("blocks") !== null) {
                            for (let l = 0; l < a.getElementsByClassName("blocks").length; l++) {
                                blocks3.push(a.getElementsByClassName("blocks")[l]);
                            }
                        }
                    }
                    if (blocks2.length > 0) {
                        for (let i = 0; i < blocks3.length; i++) {
                            blocks2[i].setAttribute("id", i);
                            blocks2[i].addEventListener("click", (event) => {
                                let target = event.currentTarget;
                                target.parentElement.replaceChild(blocks3[target.id], blocks2[target.id]);
                            }, false);
                        }
                    }
                    console.log("Finished ScratchBlocks");
                }
            };
            xhttp.open("GET", url, true);
            xhttp.responseType = "document";
            xhttp.send(null);
        }
    }

    function load_bbcode () {
        if (url.includes("discuss")) {
            let bbarr = [], bbcode = {};
            let posts = document.getElementsByClassName("blockpost");
            for (let a of posts) {
                bbarr.push(a.getElementsByClassName("box-head")[0].getElementsByTagName("a")[0].getAttribute("href"));
            }
            bbcode.full_length = bbarr.length;
            for (let i = 0; i < bbarr.length; i++) {
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    if (xhttp.status == 200 && xhttp.readyState == 4) {
                        let current = posts.item(i).getElementsByClassName("post_body_html")[0].innerHTML;
                        let button = document.createElement("button");
                        button.setAttribute("style", "height: 15px; line-height: 14px;");
                        button.appendChild(document.createTextNode("BBCode"));
                        button.addEventListener("click", (event) => {
                            if (event.currentTarget.innerHTML === "BBCode") {
                                posts.item(i).getElementsByClassName("post_body_html")[0].innerText = xhttp.responseText;
                                event.currentTarget.innerHTML = "Original";
                            } else {
                                posts.item(i).getElementsByClassName("post_body_html")[0].innerHTML = current;
                                event.currentTarget.innerHTML = "BBCode";
                            }
                        });
                        posts.item(i).getElementsByClassName("box-head")[0].appendChild(button);
                    }
                };
                xhttp.open("GET", "https://scratch.mit.edu" + bbarr[i] + "source/", true);
                xhttp.send(null);
            }
        }
    }
})();