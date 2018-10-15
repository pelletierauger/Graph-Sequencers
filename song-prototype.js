let Song = function() {
    this.currentChord = 1;
    this.frequenciesOne = [98.00, 123.47, 146.83, 196.00, 246.94, 293.66];
    this.frequenciesTwo = [110, 130.81, 164.81, 220.00, 261.63, 329.63];
    this.frequenciesFour = [98.00, 130.81, 164.81, 196.00, 261.63, 329.63];
};

Song.prototype.getFrequency = function(n) {
    if (this.currentChord == 1) {
        return this.frequenciesOne[n];
    } else if (this.currentChord == 2) {
        return this.frequenciesTwo[n];
    } else if (this.currentChord == 4) {
        return this.frequenciesFour[n];
    }
};

let song = new Song();