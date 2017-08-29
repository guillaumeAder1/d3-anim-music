// http://ianreah.com/2013/02/28/Real-time-analysis-of-streaming-audio-data-with-Web-Audio-API.html

(function() {
    //this.init();
    var svgHeight = 250;
    var svgWidth = 500;
    var playerSvg = d3.select('#svgPlayer').append('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var context = new AudioContext();
    var audioElement = document.getElementById("player");
    audioElement.crossOrigin = 'anonymous'
    audioElement.loop = true;
    audioElement.src = src = "./assets/techno.mp3"
    audioElement.play();
    var isPlaying = false;
    var ananlyser = null;
    var frequencyData = null;
    var animFinish = true;
    var lowPass = null;
    audioElement.addEventListener("canplay", function() {
        var source = context.createMediaElementSource(audioElement);
        analyser = context.createAnalyser();

        lowPass = context.createBiquadFilter();
        lowPass.type = "lowshelf";
        lowPass.frequency.value = 1000;
        lowPass.gain.value = 25;

        source.connect(lowPass);
        lowPass.connect(analyser);

        analyser.connect(context.destination);
        analyser.fftSize = 64;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        drawing();
    });

    var bassValues = [];



    /**
     * Test drawing
     */
    // var test = [222, 56, 123, 456, 488]
    // for (var i = 0; i < test.length; i++) {
    //     playerSvg.append('rect')
    //         .attr("x", (10 * i) + 20)
    //         .attr("y", svgHeight - test[i])
    //         .attr("width", 5)
    //         //.attr("height", test[i]);
    //         .attr("height", test[i]);
    // }

    this.init = function() {
        console.log('inini')
    }



    var drawing = function() {
        // auto draw
        requestAnimationFrame(drawing);
        // stop if Pause()
        if (isPlaying) return;
        // 
        analyser.getByteFrequencyData(frequencyData);
        // remove previous rect
        playerSvg.selectAll('rect').remove();
        var color = 'black';
        // calculate avg for bass freq
        var bassAvg = (frequencyData[0] + frequencyData[1] + frequencyData[2]) / 3;
        bassValues.push(bassAvg);
        // get sum of avg
        var sum = bassValues.reduce(function(a, b) {
            return a + b;
        });
        var allAvg = sum / bassValues.length;
        // if current bass value > to global avg value -> color is red
        if (bassAvg > allAvg) {
            color = 'red';
            // create circle anim in background
            if (animFinish) {
                animFinish = false;
                playerSvg.append('circle')
                    .style('stroke', color)
                    .style('opacity', 1)
                    .style('stroke-width', function() { return Math.floor(Math.random() * 10) + 1 })
                    .style('fill', function() { return (Math.floor(Math.random() * 10) % 2 === 0) ? 'none' : true; })
                    .attr('r', function() { return Math.floor(Math.random() * 50) })
                    .attr('cx', function() { return Math.floor(Math.random() * 50) * 10; })
                    .attr('cy', function() { return Math.floor(Math.random() * 25) * 10; })
                    .transition().ease(d3.easeSinInOut).duration(250)
                    .style('opacity', 0)
                    .attr('r', function() { return Math.floor(Math.random() * 50) })
                    .on('end', function() { animFinish = true; })
                    .remove();
            }


        }
        // empty array 
        if (bassValues.length > 100) {
            bassValues = [];
        }

        for (var i = 0; i < frequencyData.length; i++) {
            // color in redonly the bass 
            if (i > 2) {
                color = 'black'
            }
            playerSvg.append('rect')
                .attr("x", (10 * i) + 20)
                .attr("y", svgHeight - frequencyData[i])
                .attr("width", 5)
                .attr("height", frequencyData[i])
                .style('fill', color);
        }

    }

    document.addEventListener('keyup', function(e) {
        if (e.keyCode !== 13) { return; }
        if (isPlaying) {
            audioElement.play()
        } else {
            audioElement.pause()
        }
        isPlaying = !isPlaying;
    });


})();