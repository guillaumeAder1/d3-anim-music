// http://ianreah.com/2013/02/28/Real-time-analysis-of-streaming-audio-data-with-Web-Audio-API.html

(function() {
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
    audioElement.addEventListener("canplay", function() {
        var source = context.createMediaElementSource(audioElement);
        analyser = context.createAnalyser();
        source.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 64;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
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

    init = function() {

    }



    var drawing = function() {
        requestAnimationFrame(drawing);
        if (isPlaying) return;
        analyser.getByteFrequencyData(frequencyData);
        playerSvg.selectAll('rect').remove();
        var color = 'black';
        var bassAvg = (frequencyData[0] + frequencyData[1] + frequencyData[2]) / 3;
        bassValues.push(bassAvg)

        var sum = bassValues.reduce(function(a, b) {
            return a + b;
        });
        var allAvg = sum / bassValues.length;

        if (bassAvg > allAvg) {
            color = 'red'
        }


        // empty array
        if (bassValues.length > 100) {
            bassValues = [];
        }

        for (var i = 0; i < frequencyData.length; i++) {
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