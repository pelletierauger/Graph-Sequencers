let walkers = [];

let Walker = function(v) {
    this.v = v;
    this.goalV = null;
    this.distanceToWalk = null;
    this.walking = false;
    this.speed = 10;
    walkers.push(this);
};

Walker.prototype.startWalking = function() {
    if (this.v.edges) {
        let r = floor(random(this.v.edges.length));
        if (this.v.edges[r].a == this.v) {
            this.goalV = this.v.edges[r].b;
        } else {
            this.goalV = this.v.edges[r].a;
        }
    }
    this.walking = true;
    this.walked = 0;
    this.distanceToWalk = dist(this.v.pos.x, this.v.pos.y, this.goalV.pos.x, this.goalV.pos.y);
};

Walker.prototype.walk = function() {
    this.walked += this.speed;
    if (this.walked >= this.distanceToWalk) {
        this.walking = false;
        this.v = this.goalV;
        this.goalV = null;
        // this.v.env.play();
        this.sing();
    }
};

Walker.prototype.sing = function() {
    currentVoice++;
    if (currentVoice >= voices.length) {
        currentVoice = 0;
    }
    voices[currentVoice].osc.freq(this.v.freq);
    voices[currentVoice].env.play();
};


Walker.prototype.show = function() {
    if (!this.walking) {
        fill(0);
        ellipse(this.v.pos.x, this.v.pos.y, 15);
    } else {
        let d = map(this.walked, 0, this.distanceToWalk, 0, 1);
        let x = lerp(this.v.pos.x, this.goalV.pos.x, d);
        let y = lerp(this.v.pos.y, this.goalV.pos.y, d);
        fill(0);
        ellipse(x, y, 5);
    }
};