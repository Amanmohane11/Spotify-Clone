
let currentsong=new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds)|| seconds<0){
        return "invalid input"
    }
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if necessary
    minutes = String(minutes).padStart(2, '0');
    remainingSeconds = String(remainingSeconds).padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
}
// Example usage:
console.log(secondsToMinutesSeconds(123)); // Output: "02:03"


async function getsong(folder) {
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as)
     songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
        // show all the song in playlist
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img class="invert" svg="music.svg" alt="mus">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Aman</div>
                </div>
                <div class="playnow">
                    <span>play now</span>
                    <img src="play.svg">
                </div>
         </li>`;
    }
    
        // attach an event listener to each song
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
            e.addEventListener("click", element=>{
                console.log(e.querySelector(".info").firstElementChild.innerHTML)
              playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
}





const playmusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track)
    currentsong.src=`${currfolder}`+track
    if(!pause){
        currentsong.play()
        play.src="paused.svg"
    }
   
   
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}

async function main() {
     songs = await getsong("songs/oldsong");
    playmusic(songs[0], true)


    // Array.from(document.querySelector(".songlist").querySelectorAll("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML);
    //         playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    //     });
    // });
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="paused.svg"
        }else{
            currentsong.pause()
            play.src="play.svg"
        }
    })
    // listen for time update event
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%";
    })

        // add an event listner to seekbar
        document.querySelector(".seekbar").addEventListener("click",e=>{
            console.log(e)
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector("circle").style.left= percent + "%";
            // for update the time
            currentsong.currentTime=((currentsong.duration)*percent)/100
       
    })
    // add an addEventListener for hambugger
    document.querySelector(".hambugger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0"
    })
    // add addEventListener for cancel the left
    document.querySelector(".cancel").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
        // add an event liostner to previos
prev.addEventListener("click",()=>{
    // currentsong.pause()
    console.log("next clicked")
    console.log(currentsong)


    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index-1) >= 0){
        playmusic(songs[index-1])
    }
    })
    // add an event liostner to next
next.addEventListener("click",()=>{
    
    console.log("next clicked")

    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length){
        playmusic(songs[index+1])
    }
})
    //  add an event volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
               console.log("setting volume to",e.target.value)
               currentsong.volume=parseInt(e.target.value)/100
    })
    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            await getsong(`songs/${ item.currentTarget.dataset.folder}`)
           
        })
    })
}


main() 